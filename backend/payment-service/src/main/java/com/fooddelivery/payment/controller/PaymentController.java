package com.fooddelivery.payment.controller;

import com.fooddelivery.payment.model.PaymentIntentRequest;
import com.fooddelivery.payment.model.PaymentIntentResponse;
import com.fooddelivery.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;

    @PostMapping("/intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody PaymentIntentRequest request) {
        log.info("createPaymentIntent=start userId={} amount={}", request.getUserId(), request.getAmount());
        PaymentIntentResponse response = paymentService.createPaymentIntent(request);
        log.info("createPaymentIntent=complete paymentIntentId={}", response.getPaymentIntentId());
        return ResponseEntity.ok(response);
    }
}
