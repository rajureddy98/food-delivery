package com.fooddelivery.restaurant.controller;

import com.fooddelivery.restaurant.model.Category;
import com.fooddelivery.restaurant.model.Restaurant;
import com.fooddelivery.restaurant.repository.CategoryRepository;
import com.fooddelivery.restaurant.service.RestaurantService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private static final Logger log = LoggerFactory.getLogger(RestaurantController.class);
    private final RestaurantService restaurantService;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Restaurant>> listRestaurants(@RequestParam(required = false) String cuisine,
                                                            @RequestParam(required = false) String location) {
        log.info("listRestaurants=start cuisine={} location={}", cuisine, location);
        List<Restaurant> restaurants = restaurantService.findAll(cuisine, location);
        log.info("listRestaurants=complete count={}", restaurants.size());
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        log.info("getCategories=start");
        List<Category> categories = (List<Category>) categoryRepository.findAll();
        log.info("getCategories=complete count={}", categories.size());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable UUID id) {
        log.info("getRestaurant=start id={}", id);
        Restaurant restaurant = restaurantService.findById(id);
        log.info("getRestaurant=complete id={}", id);
        return ResponseEntity.ok(restaurant);
    }
}
