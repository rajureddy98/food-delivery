package com.fooddelivery.auth.service;

import com.fooddelivery.auth.model.AuthRequest;
import com.fooddelivery.auth.model.AuthResponse;
import com.fooddelivery.auth.model.ProfileUpdateRequest;
import com.fooddelivery.auth.model.User;
import com.fooddelivery.auth.model.UserProfile;
import com.fooddelivery.auth.repository.UserRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(AuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        log.info("register-user=start email={}", normalizedEmail);
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setCreatedAt(Instant.now());
        userRepository.save(user);
        log.info("register-user=stored userId={}", user.getId());
        return new AuthResponse(user.getId(), "OK", "User registered successfully");
    }

    public AuthResponse login(AuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        log.info("login-user=start email={}", normalizedEmail);
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        log.info("login-user=credentials-ok userId={}", user.getId());
        return new AuthResponse(user.getId(), "OK", "Login successful");
    }

    public UserProfile getProfile(UUID userId) {
        log.info("profile-fetch=start userId={}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toProfile(user);
    }

    @Transactional
    public UserProfile updateProfile(UUID userId, ProfileUpdateRequest request) {
        log.info("profile-update=start userId={}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);
        log.info("profile-update=complete userId={}", userId);
        return toProfile(user);
    }

    public String currentTraceId() {
        return org.slf4j.MDC.get("traceId");
    }

    private UserProfile toProfile(User user) {
        return new UserProfile(user.getId(), user.getEmail(), user.getFullName(), user.getPhone());
    }
}
