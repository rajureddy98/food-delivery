package com.fooddelivery.restaurant.repository;

import com.fooddelivery.restaurant.model.Category;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Category, UUID> {
}
