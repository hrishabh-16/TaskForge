package com.todo.app.model.dto.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CategoryResponse {
    
    private Long id;
    private String name;
    private String description;
    private String color;
    private Long userId;
    private Integer taskCount;
    private String createdAt;
    private String updatedAt;

    public CategoryResponse(Long id, String name, String description, String color, 
                          Long userId, Integer taskCount, LocalDateTime createdAt, 
                          LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.userId = userId;
        this.taskCount = taskCount;
        this.createdAt = formatDateTime(createdAt);
        this.updatedAt = formatDateTime(updatedAt);
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Integer taskCount) {
        this.taskCount = taskCount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}