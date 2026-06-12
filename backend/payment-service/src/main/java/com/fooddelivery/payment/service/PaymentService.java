package com.fooddelivery.payment.service;

import com.fooddelivery.payment.model.PaymentIntentRequest;
import com.fooddelivery.payment.model.PaymentIntentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @PostConstruct
    public void initStripe() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntentResponse createPaymentIntent(PaymentIntentRequest request) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (request.getAmount() * 100))
                .setCurrency("usd")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .putAllMetadata(request.getMetadata())
                .build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            log.info("stripe-create=success paymentIntentId={} userId={}", paymentIntent.getId(), request.getUserId());
            return new PaymentIntentResponse(paymentIntent.getId(), paymentIntent.getClientSecret());
        } catch (StripeException e) {
            log.error("stripe-create=failure message={}", e.getMessage(), e);
            throw new IllegalStateException("Unable to create payment intent", e);
        }
    }
}
