package com.todo.app.scheduler;

import com.todo.app.model.entity.Task;
import com.todo.app.model.enums.NotificationType;
import com.todo.app.repository.TaskRepository;
import com.todo.app.service.interfaces.EmailService;
import com.todo.app.service.interfaces.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TaskReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TaskReminderScheduler.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Value("${app.task.reminder.hours-before}")
    private int hoursBeforeReminder;

    // Run every 30 minutes
    @Scheduled(cron = "0 */30 * * * ?")
    public void sendTaskReminders() {
        logger.info("Starting task reminder job");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusHours(hoursBeforeReminder);
        
        List<Task> tasksForReminder = taskRepository.findTasksForReminder(now, reminderTime);
        
        for (Task task : tasksForReminder) {
            try {
                emailService.sendTaskReminderEmail(task);
                notificationService.createNotification(
                    task.getUser(),
                    "Task Reminder",
                    "Your task '" + task.getTitle() + "' is due in " + hoursBeforeReminder + " hours",
                    NotificationType.TASK_DUE_SOON,
                    task
                );
                logger.info("Reminder sent for task '{}' to user '{}'", 
                           task.getTitle(), task.getUser().getUsername());
            } catch (Exception e) {
                logger.error("Failed to send reminder for task '{}': {}", 
                            task.getTitle(), e.getMessage());
            }
        }
        
        logger.info("Task reminder job completed. Processed {} tasks", tasksForReminder.size());
    }

    // Check for overdue tasks every 30 minutes
    @Scheduled(cron = "0 */30 * * * ?")
    public void checkOverdueTasks() {
        logger.info("Checking for overdue tasks");
        
        LocalDateTime now = LocalDateTime.now();
        
        List<Task> overdueTasks = taskRepository.findOverdueTasks(null, now);
        
        for (Task task : overdueTasks) {
            try {
                emailService.sendOverdueTaskEmail(task);
                notificationService.createNotification(
                    task.getUser(),
                    "Task Overdue",
                    "Your task '" + task.getTitle() + "' is overdue",
                    NotificationType.TASK_OVERDUE,
                    task
                );
                logger.info("Overdue notification sent for task '{}' to user '{}'", 
                           task.getTitle(), task.getUser().getUsername());
            } catch (Exception e) {
                logger.error("Failed to send overdue notification for task '{}': {}", 
                            task.getTitle(), e.getMessage());
            }
        }
        
        logger.info("Overdue task check completed. Found {} overdue tasks", overdueTasks.size());
    }
}