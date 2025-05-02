package com.todo.app.service.impl;

import com.todo.app.model.dto.request.CategoryRequest;
import com.todo.app.model.dto.response.CategoryResponse;
import com.todo.app.model.entity.Category;
import com.todo.app.model.entity.User;
import com.todo.app.repository.CategoryRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        User currentUser = getCurrentUser();
        
        if (categoryRepository.existsByNameAndUserId(categoryRequest.getName(), currentUser.getId())) {
            throw new RuntimeException("Category with this name already exists");
        }
        
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setColor(categoryRequest.getColor());
        category.setUser(currentUser);
        
        category = categoryRepository.save(category);
        return mapToCategoryResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
        
        if (!category.getName().equals(categoryRequest.getName()) && 
            categoryRepository.existsByNameAndUserId(categoryRequest.getName(), currentUser.getId())) {
            throw new RuntimeException("Category with this name already exists");
        }
        
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setColor(categoryRequest.getColor());
        
        category = categoryRepository.save(category);
        return mapToCategoryResponse(category);
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
        
        return mapToCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Category> categories = categoryRepository.findByUserIdOrderByNameAsc(currentUser.getId());
        return categories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> searchCategories(String keyword) {
        User currentUser = getCurrentUser();
        List<Category> categories = categoryRepository.findByUserIdAndNameContainingIgnoreCase(
                currentUser.getId(), keyword);
        return categories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCategory(Long categoryId) {
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
        
        if (!category.getTasks().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing tasks");
        }
        
        categoryRepository.delete(category);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getColor(),
                category.getUser().getId(),
                category.getTasks().size(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}