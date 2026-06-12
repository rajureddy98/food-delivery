package com.fooddelivery.restaurant.service;

import com.fooddelivery.restaurant.model.Restaurant;
import com.fooddelivery.restaurant.repository.RestaurantRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private static final Logger log = LoggerFactory.getLogger(RestaurantService.class);
    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> findAll(String cuisine, String location) {
        if (cuisine != null && location != null) {
            log.info("findAll=filter cuisine={} location={}", cuisine, location);
            return restaurantRepository.findByCuisinesContainingIgnoreCaseAndLocationIgnoreCase(cuisine, location);
        }
        if (cuisine != null) {
            log.info("findAll=filter cuisine={}", cuisine);
            return restaurantRepository.findByCuisinesContainingIgnoreCase(cuisine);
        }
        if (location != null) {
            log.info("findAll=filter location={}", location);
            return restaurantRepository.findByLocationIgnoreCase(location);
        }
        log.info("findAll=fetch-all");
        return (List<Restaurant>) restaurantRepository.findAll();
    }

    public Restaurant findById(UUID id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
    }
}
