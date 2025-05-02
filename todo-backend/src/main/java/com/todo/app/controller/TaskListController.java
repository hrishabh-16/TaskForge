package com.todo.app.controller;

import com.todo.app.model.dto.request.TaskListRequest;
import com.todo.app.model.dto.response.TaskListResponse;
import com.todo.app.service.interfaces.TaskListService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-lists")
public class TaskListController {

    @Autowired
    private TaskListService taskListService;

    @PostMapping
    public ResponseEntity<TaskListResponse> createTaskList(@Valid @RequestBody TaskListRequest taskListRequest) {
        TaskListResponse response = taskListService.createTaskList(taskListRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskListResponse> updateTaskList(@PathVariable Long id, 
                                                         @Valid @RequestBody TaskListRequest taskListRequest) {
        TaskListResponse response = taskListService.updateTaskList(id, taskListRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskListResponse> getTaskListById(@PathVariable Long id) {
        TaskListResponse response = taskListService.getTaskListById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskListResponse>> getAllTaskLists() {
        List<TaskListResponse> taskLists = taskListService.getAllTaskListsForCurrentUser();
        return ResponseEntity.ok(taskLists);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskListResponse>> searchTaskLists(@RequestParam String keyword) {
        List<TaskListResponse> taskLists = taskListService.searchTaskLists(keyword);
        return ResponseEntity.ok(taskLists);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskList(@PathVariable Long id) {
        taskListService.deleteTaskList(id);
        return ResponseEntity.noContent().build();
    }
}