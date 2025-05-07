	
package com.todo.app.controller;

import com.todo.app.model.dto.request.AccountDeactivationRequest;
import com.todo.app.model.dto.request.DeleteAccountRequest;
import com.todo.app.model.dto.request.UserSettingsRequest;
import com.todo.app.model.dto.response.UserSettingsResponse;
import com.todo.app.service.interfaces.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/users/me/settings")
@RequiredArgsConstructor
public class SettingsController {
    @Autowired
    private  SettingsService settingsService;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsResponse> getUserSettings() {
        return ResponseEntity.ok(settingsService.getUserSettings());
    }
    
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsResponse> updateUserSettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateUserSettings(request));
    }
    
    @PutMapping("/notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsResponse> updateNotificationSettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateNotificationSettings(request));
    }
    
    @PutMapping("/appearance")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsResponse> updateAppearanceSettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateAppearanceSettings(request));
    }
    
    @PutMapping("/privacy")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsResponse> updatePrivacySettings(@RequestBody UserSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updatePrivacySettings(request));
    }
    
    @PostMapping("/deactivate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deactivateAccount(@Valid @RequestBody AccountDeactivationRequest request) {
        settingsService.deactivateAccount(request);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/activate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> activateAccount() {
        settingsService.activateAccount();
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/delete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteAccount(@Valid @RequestBody DeleteAccountRequest request) {
        settingsService.deleteAccount(request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/export-data")
    @PreAuthorize("isAuthenticated()")
    public void exportUserData(HttpServletResponse response) {
        settingsService.exportUserData(response);
    }
}