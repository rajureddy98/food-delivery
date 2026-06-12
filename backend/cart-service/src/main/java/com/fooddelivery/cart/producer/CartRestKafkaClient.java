package com.fooddelivery.cart.producer;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Base64Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class CartRestKafkaClient {
    private static final Logger log = LoggerFactory.getLogger(CartRestKafkaClient.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${cart.kafka.rest.url}")
    private String kafkaRestUrl;

    @Value("${cart.kafka.rest.username}")
    private String kafkaRestUsername;

    @Value("${cart.kafka.rest.password}")
    private String kafkaRestPassword;

    @Value("${cart.kafka.rest.topic}")
    private String kafkaTopic;

    public void send(String key, Object value) {
        try {
            String url = String.format("%s/topics/%s", kafkaRestUrl, kafkaTopic);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(kafkaRestUsername, kafkaRestPassword);

            ObjectMapper mapper = new ObjectMapper();

            String keyBase64 = Base64.getEncoder()
                    .encodeToString(key.getBytes(StandardCharsets.UTF_8));

            String valueJson = mapper.writeValueAsString(value);

            String valueBase64 = Base64.getEncoder()
                    .encodeToString(valueJson.getBytes(StandardCharsets.UTF_8));

            Map<String, Object> record = new HashMap<>();
            record.put("key", keyBase64);
            record.put("value", valueBase64);

            Map<String, Object> body = new HashMap<>();
            body.put("records", new Object[]{record});

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            log.info("Sending Kafka REST event to {} for topic {}", kafkaRestUrl, kafkaTopic);

            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            log.info("Kafka REST response: {}", response.getStatusCode());

        } catch (Exception e) {
            throw new RuntimeException("Failed to publish Kafka event", e);
        }
    }
}
