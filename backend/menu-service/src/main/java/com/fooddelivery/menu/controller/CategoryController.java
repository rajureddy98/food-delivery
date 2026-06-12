package com.fooddelivery.menu.controller;

import com.fooddelivery.menu.model.Category;
import com.fooddelivery.menu.repository.CategoryRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getCategories() {
        log.info("getCategories=start");
        List<Category> categories = categoryRepository.findAllByOrderByNameAsc();
        log.info("getCategories=complete count={}", categories.size());
        return ResponseEntity.ok(categories);
    }
}
