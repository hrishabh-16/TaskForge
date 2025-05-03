package com.todo.app.service.interfaces;

import com.todo.app.model.dto.response.NotificationResponse;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, NotificationType type, Task task);
    List<NotificationResponse> getUserNotifications();
    List<NotificationResponse> getUnreadNotifications();
    void markAsRead(Long notificationId);
    void markAllAsRead();
    void deleteNotification(Long notificationId);
}