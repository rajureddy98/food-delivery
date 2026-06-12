package com.fooddelivery.auth.model;

import java.util.UUID;

public class AuthResponse {
    private UUID userId;
    private String status;
    private String message;

    public AuthResponse(UUID userId, String status, String message) {
        this.userId = userId;
        this.status = status;
        this.message = message;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
