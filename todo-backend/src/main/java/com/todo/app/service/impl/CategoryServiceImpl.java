package com.todo.app.service.impl;

import com.todo.app.mapper.CategoryMapper;
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

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        User currentUser = getCurrentUser();
        
        if (categoryRepository.existsByNameAndUserId(categoryRequest.getName(), currentUser.getId())) {
            throw new RuntimeException("Category with this name already exists");
        }
        
        Category category = categoryMapper.toCategory(categoryRequest, currentUser);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
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
        
        categoryMapper.updateCategoryFromRequest(category, categoryRequest);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(categoryId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
        
        return categoryMapper.toCategoryResponse(category);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Category> categories = categoryRepository.findByUserIdOrderByNameAsc(currentUser.getId());
        return categoryMapper.toCategoryResponseList(categories);
    }

    @Override
    public List<CategoryResponse> searchCategories(String keyword) {
        User currentUser = getCurrentUser();
        List<Category> categories = categoryRepository.findByUserIdAndNameContainingIgnoreCase(
                currentUser.getId(), keyword);
        return categoryMapper.toCategoryResponseList(categories);
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
}