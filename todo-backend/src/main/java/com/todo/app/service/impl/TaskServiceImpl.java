package com.todo.app.service.impl;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.TaskStatus;
import com.todo.app.exception.ResourceNotFoundException;
import com.todo.app.exception.UnauthorizedException;
import com.todo.app.mapper.TaskMapper;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        
        // Verify that the task belongs to the current user
        User currentUser = getCurrentUser();
        if (!task.getUser().getId().equals(currentUser.getId())) {
        	throw new UnauthorizedException("You don't have permission to update this task");
        }

        taskMapper.updateTaskFromRequest(task, taskRequest);
        
        // If task is being marked as completed, set the completed date
        if (TaskStatus.COMPLETED.equals(taskRequest.getStatus()) && !TaskStatus.COMPLETED.equals(task.getStatus())) {
            task.setCompletedAt(LocalDateTime.now());
        }
        
        task = taskRepository.save(task);
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
}