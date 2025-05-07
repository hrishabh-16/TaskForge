package com.todo.app.service.impl;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.NotificationType;
import com.todo.app.model.enums.TaskStatus;
import com.todo.app.exception.ResourceNotFoundException;
import com.todo.app.exception.UnauthorizedException;
import com.todo.app.mapper.TaskMapper;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.EmailService;
import com.todo.app.service.interfaces.NotificationService;
import com.todo.app.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper taskMapper;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public TaskResponse createTask(TaskRequest taskRequest) {
        User currentUser = getCurrentUser();
        Task task = taskMapper.toTask(taskRequest, currentUser);
        task = taskRepository.save(task);
        return taskMapper.toTaskResponse(task);
    }

    @Override
    public TaskResponse updateTask(Long taskId, TaskRequest taskRequest) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        
        User currentUser = getCurrentUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to update this task");
        }

        // Check if status is changing
        boolean statusChanged = taskRequest.getStatus() != null && !taskRequest.getStatus().equals(task.getStatus());
        
        taskMapper.updateTaskFromRequest(task, taskRequest);
        
        if (TaskStatus.COMPLETED.equals(taskRequest.getStatus()) && !TaskStatus.COMPLETED.equals(task.getStatus())) {
            task.setCompletedAt(LocalDateTime.now());
        }
        
        task = taskRepository.save(task);
        
        // Send notification if status changed
        if (statusChanged) {
            emailService.sendTaskStatusUpdateEmail(task);
            notificationService.createNotification(
                task.getUser(),
                "Task Status Updated",
                "Your task '" + task.getTitle() + "' status has been updated to " + task.getStatus(),
                NotificationType.TASK_STATUS_UPDATED,
                task
            );
        }
        
        return taskMapper.toTaskResponse(task);
    }

    @Override
    public TaskResponse getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        
        // Verify that the task belongs to the current user
        User currentUser = getCurrentUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
        	throw new UnauthorizedException("You don't have permission to update this task");
        }
        
        return taskMapper.toTaskResponse(task);
    }

    @Override
    public List<TaskResponse> getAllTasksForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return taskMapper.toTaskResponseList(tasks);
    }

    @Override
    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findByUserIdAndStatusOrderByCreatedAtDesc(currentUser.getId(), status);
        return taskMapper.toTaskResponseList(tasks);
    }

    @Override
    public List<TaskResponse> searchTasks(String keyword) {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.searchByKeyword(currentUser.getId(), keyword);
        return taskMapper.toTaskResponseList(tasks);
    }

    @Override
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        
        // Verify that the task belongs to the current user
        User currentUser = getCurrentUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
        	throw new UnauthorizedException("You don't have permission to update this task");

        }
        
        taskRepository.delete(task);
    }

    @Override
    public TaskResponse markTaskAsCompleted(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        
        // Verify that the task belongs to the current user
        User currentUser = getCurrentUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
        	throw new UnauthorizedException("You don't have permission to update this task");

        }
        
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        return taskMapper.toTaskResponse(task);
    }

    @Override
    public List<TaskResponse> getOverdueTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = taskRepository.findOverdueTasks(currentUser.getId(), LocalDateTime.now());
        return taskMapper.toTaskResponseList(tasks);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
    
    @Scheduled(cron = "0 0 */6 * * *") // Run every 6 hours
    public void checkTasksDueSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime soon = now.plusHours(24); // Consider "soon" as within 24 hours
        
        // Get all users
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            List<Task> dueSoonTasks = taskRepository.findTasksDueSoon(user.getId(), now, soon);
            for (Task task : dueSoonTasks) {
                // Only notify if not already notified recently
                if (task.getLastDueSoonNotificationSent() == null || 
                    task.getLastDueSoonNotificationSent().isBefore(now.minusHours(12))) {
                    
                    String title = "Task Due Soon";
                    String message = "Your task '" + task.getTitle() + "' is due " + 
                                    formatDueDate(task.getDueDate());
                    
                    notificationService.createNotification(
                        task.getUser(), 
                        title,
                        message,
                        NotificationType.TASK_DUE_SOON,
                        task
                    );
                    
                    // Update last notification sent time
                    task.setLastDueSoonNotificationSent(now);
                    taskRepository.save(task);
                }
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // Run at midnight every day
    public void checkOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        
        // Get all users
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            List<Task> overdueTasks = taskRepository.findOverdueTasks(user.getId(), now);
            for (Task task : overdueTasks) {
                // Only notify if not already notified recently
                if (task.getLastOverdueNotificationSent() == null || 
                    task.getLastOverdueNotificationSent().isBefore(now.minusDays(1))) {
                    
                    String title = "Task Overdue";
                    String message = "Your task '" + task.getTitle() + "' was due " + 
                                    formatDueDate(task.getDueDate()) + " and is now overdue.";
                    
                    notificationService.createNotification(
                        task.getUser(), 
                        title,
                        message,
                        NotificationType.TASK_OVERDUE,
                        task
                    );
                    
                    // Update last notification sent time
                    task.setLastOverdueNotificationSent(now);
                    taskRepository.save(task);
                }
            }
        }
    }

    private String formatDueDate(LocalDateTime dueDate) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dueDateDay = dueDate.toLocalDate();
        
        if (dueDateDay.isEqual(today)) {
            return "today at " + dueDate.format(DateTimeFormatter.ofPattern("h:mm a"));
        } else if (dueDateDay.isEqual(tomorrow)) {
            return "tomorrow at " + dueDate.format(DateTimeFormatter.ofPattern("h:mm a"));
        } else {
            return "on " + dueDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a"));
        }
    }
}