package com.todo.app.service.impl;

import com.todo.app.model.dto.response.NotificationResponse;
import com.todo.app.service.interfaces.NotificationWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationWebSocketServiceImpl implements NotificationWebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotification(String username, NotificationResponse notification) {
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", notification);
    }
}