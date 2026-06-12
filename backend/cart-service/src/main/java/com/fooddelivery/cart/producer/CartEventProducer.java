package com.fooddelivery.cart.producer;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartEventProducer {
    private static final Logger log = LoggerFactory.getLogger(CartEventProducer.class);
    private final CartRestKafkaClient kafkaClient;

    public void publishCartUpdated(UUID cartId, UUID userId) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "CartUpdated");
        event.put("cartId", cartId.toString());
        event.put("userId", userId.toString());
        event.put("timestamp", System.currentTimeMillis());
        log.info("publishCartUpdated=event cartId={} userId={}", cartId, userId);
        kafkaClient.send(cartId.toString(), event);
    }
}
