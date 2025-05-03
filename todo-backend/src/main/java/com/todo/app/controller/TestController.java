package com.todo.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo.app.model.entity.Task;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.EmailService;

@RestController
@RequestMapping("/api/test")
public class TestController {
	
	 	@Autowired
	    private EmailService emailService;
	    
	    @Autowired
	    private UserRepository userRepository;
	    
	    @Autowired
	    private TaskRepository taskRepository;
    
    @GetMapping("/public")
    public String publicAccess() {
        return "Public content - anyone can see this";
    }
    
    @GetMapping("/email/task-reminder/{taskId}")
    public ResponseEntity<String> testTaskReminderEmail(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        emailService.sendTaskReminderEmail(task);
        return ResponseEntity.ok("Task reminder email sent!");
    }
}