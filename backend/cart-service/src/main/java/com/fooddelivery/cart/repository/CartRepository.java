package com.fooddelivery.cart.repository;

import com.fooddelivery.cart.model.Cart;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, UUID> {
    Optional<Cart> findByUserId(UUID userId);
}
