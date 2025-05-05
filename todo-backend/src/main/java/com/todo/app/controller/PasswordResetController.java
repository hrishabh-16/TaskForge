package com.todo.app.controller;

import com.todo.app.model.dto.request.ForgotPasswordRequest;
import com.todo.app.model.dto.request.PasswordResetRequest;
import com.todo.app.service.interfaces.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.createPasswordResetTokenForEmail(request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset email has been sent");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/reset-password")
    public ResponseEntity<Map<String, String>> validateResetToken(@RequestParam("token") String token) {
        String email = passwordResetService.validatePasswordResetToken(token);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Valid reset token");
        response.put("email", email);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.resetPassword(request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password has been reset successfully");
        return ResponseEntity.ok(response);
    }
}