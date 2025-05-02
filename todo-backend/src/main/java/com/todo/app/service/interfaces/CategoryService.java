package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.CategoryRequest;
import com.todo.app.model.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    
    CategoryResponse createCategory(CategoryRequest categoryRequest);
    
    CategoryResponse updateCategory(Long categoryId, CategoryRequest categoryRequest);
    
    CategoryResponse getCategoryById(Long categoryId);
    
    List<CategoryResponse> getAllCategoriesForCurrentUser();
    
    List<CategoryResponse> searchCategories(String keyword);
    
    void deleteCategory(Long categoryId);
}