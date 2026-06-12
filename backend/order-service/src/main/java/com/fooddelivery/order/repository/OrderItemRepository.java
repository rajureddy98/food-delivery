package com.fooddelivery.order.repository;

import com.fooddelivery.order.model.OrderItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends CrudRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderId(UUID orderId);
}
