package com.fooddelivery.order.controller;

import com.fooddelivery.order.model.CreateOrderRequest;
import com.fooddelivery.order.model.OrderResponse;
import com.fooddelivery.order.service.OrderService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        log.info("createOrder=start userId={} totalAmount={}", request.getUserId(), request.getTotalAmount());
        OrderResponse response = orderService.createOrder(request);
        log.info("createOrder=complete orderId={} status={}", response.getOrderId(), response.getStatus());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID orderId) {
        log.info("getOrder=start orderId={}", orderId);
        OrderResponse response = orderService.getOrder(orderId);
        log.info("getOrder=complete orderId={} status={}", response.getOrderId(), response.getStatus());
        return ResponseEntity.ok(response);
    }
}
