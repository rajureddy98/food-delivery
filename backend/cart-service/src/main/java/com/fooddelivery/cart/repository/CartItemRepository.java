package com.fooddelivery.cart.repository;

import com.fooddelivery.cart.model.CartItem;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends CrudRepository<CartItem, UUID> {
    Optional<CartItem> findByCartIdAndMenuItemId(UUID cartId, UUID menuItemId);
    List<CartItem> findByCartId(UUID cartId);
}
