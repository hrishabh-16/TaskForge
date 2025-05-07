package com.todo.app.controller;

import com.todo.app.model.dto.request.PasswordChangeRequest;
import com.todo.app.model.dto.request.ProfileUpdateRequest;
import com.todo.app.model.dto.response.LoginActivityResponse;
import com.todo.app.model.dto.response.ProfileResponse;
import com.todo.app.service.interfaces.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile") 
@RequiredArgsConstructor
public class ProfileController {
    @Autowired
    private ProfileService profileService;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> getCurrentUserProfile() {
        return ResponseEntity.ok(profileService.getCurrentUserProfile());
    }
    
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
    
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        profileService.changePassword(request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/login-activity")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LoginActivityResponse>> getUserLoginActivity() {
        return ResponseEntity.ok(profileService.getUserLoginActivity());
    }
}