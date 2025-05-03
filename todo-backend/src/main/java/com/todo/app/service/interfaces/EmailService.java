package com.todo.app.service.interfaces;

import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;

public interface EmailService {
    void sendTaskReminderEmail(Task task);
    void sendTaskStatusUpdateEmail(Task task);
    void sendOverdueTaskEmail(Task task);
    void sendPasswordResetEmail(User user, String token);
    void sendVerificationEmail(User user, String token);
}