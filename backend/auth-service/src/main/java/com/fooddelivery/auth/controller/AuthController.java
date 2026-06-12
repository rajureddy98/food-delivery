package com.fooddelivery.auth.controller;

import com.fooddelivery.auth.model.AuthRequest;
import com.fooddelivery.auth.model.AuthResponse;
import com.fooddelivery.auth.model.ProfileUpdateRequest;
import com.fooddelivery.auth.model.RegisterRequest;
import com.fooddelivery.auth.model.UserProfile;
import com.fooddelivery.auth.service.AuthService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("register=start email={} traceId={} ", request.getEmail(), authService.currentTraceId());
        AuthResponse response = authService.register(request);
        log.info("register=complete userId={} traceId={}", response.getUserId(), authService.currentTraceId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("login=start email={} traceId={}", request.getEmail(), authService.currentTraceId());
        AuthResponse response = authService.login(request);
        log.info("login=complete userId={} traceId={}", response.getUserId(), authService.currentTraceId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable UUID userId) {
        log.info("getProfile=start userId={} traceId={}", userId, authService.currentTraceId());
        UserProfile profile = authService.getProfile(userId);
        log.info("getProfile=complete userId={} traceId={}", userId, authService.currentTraceId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable UUID userId, @Valid @RequestBody ProfileUpdateRequest request) {
        log.info("updateProfile=start userId={} traceId={}", userId, authService.currentTraceId());
        UserProfile profile = authService.updateProfile(userId, request);
        log.info("updateProfile=complete userId={} traceId={}", userId, authService.currentTraceId());
        return ResponseEntity.ok(profile);
    }
}
