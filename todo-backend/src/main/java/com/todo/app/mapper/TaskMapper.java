package com.todo.app.mapper;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    public Task toTask(TaskRequest taskRequest, User user) {
        if (taskRequest == null) {
            return null;
        }

        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        
        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }
        
        task.setDueDate(taskRequest.getDueDate());
        task.setUser(user);
        
        return task;
    }

    public TaskResponse toTaskResponse(Task task) {
        if (task == null) {
            return null;
        }

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getUser().getId(),
                task.getUser().getUsername(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getCompletedAt()
        );
    }

    public void updateTaskFromRequest(Task task, TaskRequest taskRequest) {
        if (taskRequest.getTitle() != null) {
            task.setTitle(taskRequest.getTitle());
        }
        
        if (taskRequest.getDescription() != null) {
            task.setDescription(taskRequest.getDescription());
        }
        
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        
        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }
        
        if (taskRequest.getDueDate() != null) {
            task.setDueDate(taskRequest.getDueDate());
        }
    }

    public List<TaskResponse> toTaskResponseList(List<Task> tasks) {
        return tasks.stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }
}