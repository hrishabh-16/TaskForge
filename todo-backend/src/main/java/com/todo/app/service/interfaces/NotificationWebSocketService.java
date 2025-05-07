package com.todo.app.service.interfaces;

import com.todo.app.model.dto.response.NotificationResponse;

public interface NotificationWebSocketService {
    void sendNotification(String username, NotificationResponse notification);
}