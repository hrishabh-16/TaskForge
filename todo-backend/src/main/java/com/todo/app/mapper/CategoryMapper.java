package com.todo.app.mapper;

import com.todo.app.model.dto.request.CategoryRequest;
import com.todo.app.model.dto.response.CategoryResponse;
import com.todo.app.model.entity.Category;
import com.todo.app.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {

    public Category toCategory(CategoryRequest categoryRequest, User user) {
        if (categoryRequest == null) {
            return null;
        }

        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setColor(categoryRequest.getColor());
        category.setUser(user);
        
        return category;
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getColor(),
                category.getUser().getId(),
                category.getTasks() != null ? category.getTasks().size() : 0,
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    public void updateCategoryFromRequest(Category category, CategoryRequest categoryRequest) {
        if (categoryRequest.getName() != null) {
            category.setName(categoryRequest.getName());
        }
        
        if (categoryRequest.getDescription() != null) {
            category.setDescription(categoryRequest.getDescription());
        }
        
        if (categoryRequest.getColor() != null) {
            category.setColor(categoryRequest.getColor());
        }
    }

    public List<CategoryResponse> toCategoryResponseList(List<Category> categories) {
        return categories.stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }
}