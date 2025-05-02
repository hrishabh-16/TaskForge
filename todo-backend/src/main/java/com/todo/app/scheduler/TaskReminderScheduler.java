package com.todo.app.scheduler;

import com.todo.app.model.entity.Task;
import com.todo.app.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TaskReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TaskReminderScheduler.class);

    @Autowired
    private TaskRepository taskRepository;

    // Run every hour
    @Scheduled(cron = "0 0 * * * ?")
    public void sendTaskReminders() {
        logger.info("Starting task reminder job");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusHours(24); // 24 hours before due date
        
        List<Task> tasksForReminder = taskRepository.findTasksForReminder(now, reminderTime);
        
        for (Task task : tasksForReminder) {
            // Here you would typically send an email or notification
            logger.info("Reminder: Task '{}' for user '{}' is due soon at {}", 
                       task.getTitle(), task.getUser().getUsername(), task.getDueDate());
            
            // In a real application, you would send notifications here
            // emailService.sendTaskReminder(task);
        }
        
        logger.info("Task reminder job completed. Processed {} tasks", tasksForReminder.size());
    }
}