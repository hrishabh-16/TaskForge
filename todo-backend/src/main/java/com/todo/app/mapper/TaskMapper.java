package com.todo.app.mapper;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.entity.Category;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.TaskList;
import com.todo.app.model.entity.User;
import com.todo.app.repository.CategoryRepository;
import com.todo.app.repository.TaskListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private TaskListRepository taskListRepository;

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
        
        // Set category if provided
        if (taskRequest.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(taskRequest.getCategoryId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
            task.setCategory(category);
        }
        
        // Set task list if provided
        if (taskRequest.getTaskListId() != null) {
            TaskList taskList = taskListRepository.findByIdAndUserId(taskRequest.getTaskListId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Task list not found or access denied"));
            task.setTaskList(taskList);
        }
        
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
                task.getCategory() != null ? task.getCategory().getId() : null,
                task.getCategory() != null ? task.getCategory().getName() : null,
                task.getTaskList() != null ? task.getTaskList().getId() : null,
                task.getTaskList() != null ? task.getTaskList().getName() : null,
                task.getComments() != null ? task.getComments().size() : 0,
                task.getAttachments() != null ? task.getAttachments().size() : 0,
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
        
        // Update category if provided
        if (taskRequest.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUserId(taskRequest.getCategoryId(), task.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
            task.setCategory(category);
        } else {
            task.setCategory(null);
        }
        
        // Update task list if provided
        if (taskRequest.getTaskListId() != null) {
            TaskList taskList = taskListRepository.findByIdAndUserId(taskRequest.getTaskListId(), task.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("Task list not found or access denied"));
            task.setTaskList(taskList);
        } else {
            task.setTaskList(null);
        }
    }

    public List<TaskResponse> toTaskResponseList(List<Task> tasks) {
        return tasks.stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }
}