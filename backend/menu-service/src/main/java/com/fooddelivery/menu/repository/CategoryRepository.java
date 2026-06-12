package com.fooddelivery.menu.repository;

import com.fooddelivery.menu.model.Category;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends CrudRepository<Category, UUID> {
    List<Category> findAllByOrderByNameAsc();
}
