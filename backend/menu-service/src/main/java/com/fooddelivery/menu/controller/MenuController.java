package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.model.MenuItem;
import com.fooddelivery.menu.service.MenuService;
import java.util.List;
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
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {
    private static final Logger log = LoggerFactory.getLogger(MenuController.class);
    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> listMenuItems(@RequestParam(required = false) String restaurantId,
                                                         @RequestParam(required = false) String categoryId) {
        log.info("listMenuItems=start restaurantId={} categoryId={}", restaurantId, categoryId);
        List<MenuItem> items = menuService.findMenuItems(restaurantId, categoryId);
        log.info("listMenuItems=complete count={}", items.size());
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable String id) {
        log.info("getMenuItem=start id={}", id);
        MenuItem item = menuService.findById(id);
        log.info("getMenuItem=complete id={}", id);
        return ResponseEntity.ok(item);
    }
}
