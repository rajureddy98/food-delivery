package com.fooddelivery.menu.service;

import com.fooddelivery.menu.model.MenuItem;
import com.fooddelivery.menu.repository.MenuItemRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MenuService {
    private static final Logger log = LoggerFactory.getLogger(MenuService.class);
    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> findMenuItems(String restaurantId, String categoryId) {
        UUID restaurantUuid = null;
        UUID categoryUuid = null;

        if (restaurantId != null) {
            restaurantUuid = UUID.fromString(restaurantId);
        }
        if (categoryId != null) {
            categoryUuid = UUID.fromString(categoryId);
        }

        if (restaurantUuid != null && categoryUuid != null) {
            log.info("findMenuItems=filter restaurantId={} categoryId={}", restaurantId, categoryId);
            return menuItemRepository.findByRestaurantIdAndCategoryId(restaurantUuid, categoryUuid);
        }
        if (restaurantUuid != null) {
            log.info("findMenuItems=filter restaurantId={}", restaurantId);
            return menuItemRepository.findByRestaurantId(restaurantUuid);
        }
        if (categoryUuid != null) {
            log.info("findMenuItems=filter categoryId={}", categoryId);
            return menuItemRepository.findByCategoryId(categoryUuid);
        }
        log.info("findMenuItems=fetch-all");
        return (List<MenuItem>) menuItemRepository.findAll();
    }

    public MenuItem findById(String id) {
        return menuItemRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
    }
}
