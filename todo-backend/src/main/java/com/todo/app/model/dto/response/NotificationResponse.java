package com.todo.app.model.dto.response;

import com.todo.app.model.enums.NotificationType;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class NotificationResponse {
    
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private Long taskId;
    private String createdAt;
    private String readAt;

    public NotificationResponse(Long id, String title, String message, NotificationType type, 
                              boolean isRead, Long taskId, LocalDateTime createdAt, LocalDateTime readAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.taskId = taskId;
        this.createdAt = formatDateTime(createdAt);
        this.readAt = formatDateTime(readAt);
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getReadAt() {
        return readAt;
    }

    public void setReadAt(String readAt) {
        this.readAt = readAt;
    }
}