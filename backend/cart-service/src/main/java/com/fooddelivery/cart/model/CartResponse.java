package com.fooddelivery.cart.model;

import java.util.List;
import java.util.UUID;

public class CartResponse {
    private UUID cartId;
    private UUID userId;
    private UUID restaurantId;
    private List<CartItem> items;

    public CartResponse(UUID cartId, UUID userId, UUID restaurantId, List<CartItem> items) {
        this.cartId = cartId;
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.items = items;
    }

    public UUID getCartId() {
        return cartId;
    }

    public void setCartId(UUID cartId) {
        this.cartId = cartId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(UUID restaurantId) {
        this.restaurantId = restaurantId;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }
}
