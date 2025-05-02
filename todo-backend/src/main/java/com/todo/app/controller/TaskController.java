package com.todo.app.controller;

import com.todo.app.model.dto.request.TaskRequest;
import com.todo.app.model.dto.response.TaskResponse;
import com.todo.app.model.enums.TaskStatus;
import com.todo.app.service.interfaces.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        TaskResponse response = taskService.createTask(taskRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest) {
        TaskResponse response = taskService.updateTask(id, taskRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        List<TaskResponse> tasks = taskService.getAllTasksForCurrentUser();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(@PathVariable TaskStatus status) {
        List<TaskResponse> tasks = taskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(@RequestParam String keyword) {
        List<TaskResponse> tasks = taskService.searchTasks(keyword);
        return ResponseEntity.ok(tasks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markTaskAsCompleted(@PathVariable Long id) {
        TaskResponse response = taskService.markTaskAsCompleted(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks() {
        List<TaskResponse> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }
}