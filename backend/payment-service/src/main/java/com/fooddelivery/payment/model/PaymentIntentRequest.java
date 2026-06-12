package com.fooddelivery.payment.model;

import java.util.Map;
import java.util.UUID;

public class PaymentIntentRequest {
    private UUID userId;
    private double amount;
    private Map<String, String> metadata;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }
}
