package com.fooddelivery.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest extends AuthRequest {
    @Override
    @Email
    @NotBlank
    public String getEmail() {
        return super.getEmail();
    }

    @Override
    @NotBlank
    public String getPassword() {
        return super.getPassword();
    }
}
