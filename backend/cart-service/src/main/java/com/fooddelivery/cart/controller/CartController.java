package com.fooddelivery.cart.controller;

import com.fooddelivery.cart.model.AddCartItemRequest;
import com.fooddelivery.cart.model.CartResponse;
import com.fooddelivery.cart.model.UpdateCartItemRequest;
import com.fooddelivery.cart.service.CartService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private static final Logger log = LoggerFactory.getLogger(CartController.class);
    private final CartService cartService;

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartResponse> addItem(@PathVariable UUID userId, @RequestBody AddCartItemRequest request) {
        log.info("addItem=start userId={} itemId={} qty={}", userId, request.getMenuItemId(), request.getQuantity());
        CartResponse response = cartService.addItem(userId, request);
        log.info("addItem=complete cartId={}", response.getCartId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(@PathVariable UUID userId, @PathVariable UUID itemId, @RequestBody UpdateCartItemRequest request) {
        log.info("updateItem=start userId={} itemId={} qty={}", userId, itemId, request.getQuantity());
        CartResponse response = cartService.updateItem(userId, itemId, request);
        log.info("updateItem=complete cartId={}", response.getCartId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable UUID userId, @PathVariable UUID itemId) {
        log.info("removeItem=start userId={} itemId={}", userId, itemId);
        CartResponse response = cartService.removeItem(userId, itemId);
        log.info("removeItem=complete cartId={}", response.getCartId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable UUID userId) {
        log.info("getCart=start userId={}", userId);
        CartResponse response = cartService.getCart(userId);
        log.info("getCart=complete cartId={}", response.getCartId());
        return ResponseEntity.ok(response);
    }
}
