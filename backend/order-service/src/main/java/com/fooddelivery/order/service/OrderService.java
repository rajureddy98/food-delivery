package com.fooddelivery.order.service;

import com.fooddelivery.order.model.CreateOrderRequest;
import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.model.OrderItem;
import com.fooddelivery.order.model.OrderResponse;
import com.fooddelivery.order.repository.OrderItemRepository;
import com.fooddelivery.order.repository.OrderRepository;
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
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setRestaurantId(request.getRestaurantId());
        order.setTotalAmount(request.getTotalAmount());
        order.setDeliveryFee(request.getDeliveryFee());
        order.setStatus("pending");
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPhone(request.getPhone());
        order.setStripePaymentId(request.getStripePaymentId());
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        request.getItems().forEach(itemRequest -> {
            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setMenuItemId(itemRequest.getMenuItemId());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice());
            item.setItemName(itemRequest.getItemName());
            item.setCreatedAt(Instant.now());
            orderItemRepository.save(item);
        });

        log.info("order-create=stored orderId={} userId={} totalAmount={}", order.getId(), order.getUserId(), order.getTotalAmount());
        return toResponse(order);
    }

    public OrderResponse getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return new OrderResponse(order.getId(), order.getUserId(), order.getRestaurantId(), order.getTotalAmount(), order.getDeliveryFee(), order.getStatus(), order.getDeliveryAddress(), order.getPhone(), order.getStripePaymentId(), order.getCreatedAt(), order.getUpdatedAt(), items);
    }
}
