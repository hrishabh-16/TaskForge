package com.todo.app.repository;

import com.todo.app.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByUserIdOrderByNameAsc(Long userId);
    
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByNameAndUserId(String name, Long userId);
    
    List<Category> findByUserIdAndNameContainingIgnoreCase(Long userId, String name);
}