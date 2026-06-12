package com.fooddelivery.cart.service;

import com.fooddelivery.cart.model.AddCartItemRequest;
import com.fooddelivery.cart.model.Cart;
import com.fooddelivery.cart.model.CartItem;
import com.fooddelivery.cart.model.CartResponse;
import com.fooddelivery.cart.model.UpdateCartItemRequest;
import com.fooddelivery.cart.producer.CartEventProducer;
import com.fooddelivery.cart.repository.CartItemRepository;
import com.fooddelivery.cart.repository.CartRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private static final Logger log = LoggerFactory.getLogger(CartService.class);
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartEventProducer eventProducer;

    @Transactional
    public CartResponse addItem(UUID userId, AddCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createCart(userId, request.getRestaurantId()));
        CartItem item = cartItemRepository.findByCartIdAndMenuItemId(cart.getId(), request.getMenuItemId())
                .orElseGet(() -> createCartItem(cart.getId(), request));
        item.setQuantity(item.getQuantity() + request.getQuantity());
        cartItemRepository.save(item);
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        log.info("cart-add=event userId={} cartId={} itemId={} quantity={}", userId, cart.getId(), request.getMenuItemId(), item.getQuantity());
        eventProducer.publishCartUpdated(cart.getId(), userId);
        return mapCartResponse(cart, cartItemRepository.findByCartId(cart.getId()));
    }

    @Transactional
    public CartResponse updateItem(UUID userId, UUID itemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        eventProducer.publishCartUpdated(cart.getId(), userId);
        return mapCartResponse(cart, cartItemRepository.findByCartId(cart.getId()));
    }

    @Transactional
    public CartResponse removeItem(UUID userId, UUID itemId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        cartItemRepository.delete(item);
        cart.setUpdatedAt(Instant.now());
        cartRepository.save(cart);
        eventProducer.publishCartUpdated(cart.getId(), userId);
        return mapCartResponse(cart, cartItemRepository.findByCartId(cart.getId()));
    }

    public CartResponse getCart(UUID userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        return mapCartResponse(cart, cartItemRepository.findByCartId(cart.getId()));
    }

    private Cart createCart(UUID userId, UUID restaurantId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setRestaurantId(restaurantId);
        cart.setCreatedAt(Instant.now());
        cart.setUpdatedAt(Instant.now());
        log.info("createCart=userId={} cartId={} restaurantId={}", userId, cart.getId(), restaurantId);
        return cartRepository.save(cart);
    }

    private CartItem createCartItem(UUID cartId, AddCartItemRequest request) {
        CartItem item = new CartItem();
        item.setCartId(cartId);
        item.setMenuItemId(request.getMenuItemId());
        item.setQuantity(request.getQuantity());
        item.setCreatedAt(Instant.now());
        return item;
    }

    private CartResponse mapCartResponse(Cart cart, List<CartItem> items) {
        return new CartResponse(cart.getId(), cart.getUserId(), cart.getRestaurantId(), items);
    }
}
