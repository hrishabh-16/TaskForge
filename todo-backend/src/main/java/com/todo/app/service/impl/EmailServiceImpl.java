package com.todo.app.service.impl;

import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.service.interfaces.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.base-url}")
    private String baseUrl;

    @Override
    public void sendTaskReminderEmail(Task task) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("task", task);
            context.setVariable("userName", task.getUser().getUsername());
            context.setVariable("dueDate", task.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));

            String html = templateEngine.process("email/task-reminder", context);

            helper.setTo(task.getUser().getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Task Reminder: " + task.getTitle());
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send task reminder email", e);
        }
    }

    @Override
    public void sendTaskStatusUpdateEmail(Task task) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("task", task);
            context.setVariable("userName", task.getUser().getUsername());
            context.setVariable("status", task.getStatus().toString());

            String html = templateEngine.process("email/task-status-update", context);

            helper.setTo(task.getUser().getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Task Status Updated: " + task.getTitle());
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send task status update email", e);
        }
    }

    @Override
    public void sendOverdueTaskEmail(Task task) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("task", task);
            context.setVariable("userName", task.getUser().getUsername());

            String html = templateEngine.process("email/task-overdue", context);

            helper.setTo(task.getUser().getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Task Overdue: " + task.getTitle());
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send overdue task email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(User user, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("userName", user.getUsername());
            context.setVariable("resetLink", baseUrl + "/api/auth/reset-password?token=" + token);

            String html = templateEngine.process("email/password-reset", context);

            helper.setTo(user.getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Password Reset Request");
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendVerificationEmail(User user, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("userName", user.getUsername());
            context.setVariable("verificationLink", baseUrl + "/api/auth/verify?token=" + token);

            String html = templateEngine.process("email/verification", context);

            helper.setTo(user.getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Account Verification");
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}