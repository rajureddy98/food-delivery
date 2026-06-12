package com.fooddelivery.restaurant.repository;

import com.fooddelivery.restaurant.model.Restaurant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends CrudRepository<Restaurant, UUID> {
    List<Restaurant> findByCuisinesContainingIgnoreCase(String cuisine);
    List<Restaurant> findByLocationIgnoreCase(String location);
    List<Restaurant> findByCuisinesContainingIgnoreCaseAndLocationIgnoreCase(String cuisine, String location);
}
