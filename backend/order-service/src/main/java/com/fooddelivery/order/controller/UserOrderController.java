package com.fooddelivery.order.controller;

import com.fooddelivery.order.model.OrderResponse;
import com.fooddelivery.order.repository.OrderRepository;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders/user")
public class UserOrderController {
    private static final Logger log = LoggerFactory.getLogger(UserOrderController.class);
    private final OrderRepository orderRepository;

    public UserOrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable UUID userId) {
        log.info("getOrdersByUser=start userId={}", userId);
        List<OrderResponse> orders = orderRepository.findByUserId(userId).stream()
                .map(order -> new OrderResponse(order.getId(), order.getUserId(), order.getRestaurantId(), order.getTotalAmount(), order.getDeliveryFee(), order.getStatus(), order.getDeliveryAddress(), order.getPhone(), order.getStripePaymentId(), order.getCreatedAt(), order.getUpdatedAt(), List.of()))
                .toList();
        log.info("getOrdersByUser=complete userId={} count={}", userId, orders.size());
        return ResponseEntity.ok(orders);
    }
}
