package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.model.MenuItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends CrudRepository<MenuItem, UUID> {
    List<MenuItem> findByRestaurantId(UUID restaurantId);
    List<MenuItem> findByCategoryId(UUID categoryId);
    List<MenuItem> findByRestaurantIdAndCategoryId(UUID restaurantId, UUID categoryId);
}
