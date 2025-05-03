package com.todo.app.service.impl;

import com.todo.app.model.dto.response.NotificationResponse;
import com.todo.app.model.entity.Notification;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.NotificationType;
import com.todo.app.repository.NotificationRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void createNotification(User user, String title, String message, NotificationType type, Task task) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTask(task);
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getUserNotifications() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return notifications.stream()
                .map(this::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId());
        return notifications.stream()
                .map(this::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(currentUser.getId());
        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private NotificationResponse mapToNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getTask() != null ? notification.getTask().getId() : null,
                notification.getCreatedAt(),
                notification.getReadAt()
        );
    }
}