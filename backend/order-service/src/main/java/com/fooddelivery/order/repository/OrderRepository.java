package com.fooddelivery.order.repository;

import com.fooddelivery.order.model.Order;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, UUID> {

    List<Order> findByUserId(UUID userId);

}