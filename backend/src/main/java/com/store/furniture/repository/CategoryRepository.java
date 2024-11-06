package com.store.furniture.repository;

import com.store.furniture.entity.Category;
import com.store.furniture.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
