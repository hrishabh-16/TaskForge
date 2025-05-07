package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    
    TaskResponse createTask(TaskRequest taskRequest);
    
    TaskResponse updateTask(Long taskId, TaskRequest taskRequest);
    
    TaskResponse getTaskById(Long taskId);
    
    List<TaskResponse> getAllTasksForCurrentUser();
    
    List<TaskResponse> getTasksByStatus(TaskStatus status);
    
    List<TaskResponse> searchTasks(String keyword);
    
    void deleteTask(Long taskId);
    
    TaskResponse markTaskAsCompleted(Long taskId);
    
    List<TaskResponse> getOverdueTasks();
    
    void checkTasksDueSoon();
    void checkOverdueTasks();
}