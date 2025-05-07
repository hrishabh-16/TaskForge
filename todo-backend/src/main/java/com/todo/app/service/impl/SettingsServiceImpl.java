package com.todo.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.app.exception.BadRequestException;
import com.todo.app.exception.ResourceNotFoundException;
import com.todo.app.model.dto.request.AccountDeactivationRequest;
import com.todo.app.model.dto.request.DeleteAccountRequest;
import com.todo.app.model.dto.request.UserSettingsRequest;
import com.todo.app.model.dto.response.UserSettingsResponse;
import com.todo.app.model.entity.User;
import com.todo.app.model.entity.UserSettings;
import com.todo.app.repository.UserRepository;
import com.todo.app.repository.UserSettingsRepository;
import com.todo.app.service.interfaces.SettingsService;
import com.todo.app.security.util.SecurityUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {
    @Autowired
    private  UserRepository userRepository;
    
    @Autowired
    private  UserSettingsRepository userSettingsRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  ObjectMapper objectMapper;

    @Override
    public UserSettingsResponse getUserSettings() {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public UserSettingsResponse updateUserSettings(UserSettingsRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Update all settings from request (only if values are not null)
        if (request.getNotificationsEnabled() != null) {
            settings.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        if (request.getEmailNotifications() != null) {
            settings.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getTaskReminders() != null) {
            settings.setTaskReminders(request.getTaskReminders());
        }
        if (request.getDueDateAlerts() != null) {
            settings.setDueDateAlerts(request.getDueDateAlerts());
        }
        if (request.getSystemNotifications() != null) {
            settings.setSystemNotifications(request.getSystemNotifications());
        }
        if (request.getDarkMode() != null) {
            settings.setDarkMode(request.getDarkMode());
        }
        if (request.getCompactMode() != null) {
            settings.setCompactMode(request.getCompactMode());
        }
        if (request.getFontSize() != null) {
            settings.setFontSize(request.getFontSize());
        }
        if (request.getShareTaskStatistics() != null) {
            settings.setShareTaskStatistics(request.getShareTaskStatistics());
        }
        if (request.getAllowDataCollection() != null) {
            settings.setAllowDataCollection(request.getAllowDataCollection());
        }
        
        settings = userSettingsRepository.save(settings);
        
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public UserSettingsResponse updateNotificationSettings(UserSettingsRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Update only notification settings
        if (request.getNotificationsEnabled() != null) {
            settings.setNotificationsEnabled(request.getNotificationsEnabled());
        }
        if (request.getEmailNotifications() != null) {
            settings.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getTaskReminders() != null) {
            settings.setTaskReminders(request.getTaskReminders());
        }
        if (request.getDueDateAlerts() != null) {
            settings.setDueDateAlerts(request.getDueDateAlerts());
        }
        if (request.getSystemNotifications() != null) {
            settings.setSystemNotifications(request.getSystemNotifications());
        }
        
        settings = userSettingsRepository.save(settings);
        
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public UserSettingsResponse updateAppearanceSettings(UserSettingsRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Update only appearance settings
        if (request.getDarkMode() != null) {
            settings.setDarkMode(request.getDarkMode());
        }
        if (request.getCompactMode() != null) {
            settings.setCompactMode(request.getCompactMode());
        }
        if (request.getFontSize() != null) {
            settings.setFontSize(request.getFontSize());
        }
        
        settings = userSettingsRepository.save(settings);
        
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public UserSettingsResponse updatePrivacySettings(UserSettingsRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Update only privacy settings
        if (request.getShareTaskStatistics() != null) {
            settings.setShareTaskStatistics(request.getShareTaskStatistics());
        }
        if (request.getAllowDataCollection() != null) {
            settings.setAllowDataCollection(request.getAllowDataCollection());
        }
        
        settings = userSettingsRepository.save(settings);
        
        return mapToResponse(settings);
    }

    @Override
    @Transactional
    public void deactivateAccount(AccountDeactivationRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Password is incorrect");
        }
        
        // Get settings
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Deactivate account
        settings.setAccountActive(false);
        userSettingsRepository.save(settings);
        
        // You might also want to log the reason for deactivation
        // This would require an additional entity to store deactivation reasons
    }

    @Override
    @Transactional
    public void activateAccount() {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Get settings
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(currentUser);
                    return userSettingsRepository.save(newSettings);
                });
        
        // Activate account
        settings.setAccountActive(true);
        userSettingsRepository.save(settings);
    }

    @Override
    @Transactional
    public void deleteAccount(DeleteAccountRequest request) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Password is incorrect");
        }
        
        // Validate confirmation phrase
        if (!"delete my account".equals(request.getConfirmPhrase())) {
            throw new BadRequestException("Confirmation phrase does not match");
        }
        
        // Delete user - this will cascade to all related entities
        userRepository.delete(currentUser);
    }

    @Override
    public void exportUserData(HttpServletResponse response) {
        User currentUser = SecurityUtils.getCurrentUser()
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Create a map of all user data
        Map<String, Object> userData = new HashMap<>();
        userData.put("user", currentUser);
        userData.put("tasks", currentUser.getTasks());
        userData.put("settings", userSettingsRepository.findByUser(currentUser).orElse(null));
        userData.put("loginActivities", currentUser.getLoginActivities());
        
        // Set response headers
        response.setContentType("application/json");
        response.setHeader("Content-Disposition", "attachment; filename=\"user-data.json\"");
        
        try {
            // Write user data to response
            objectMapper.writeValue(response.getOutputStream(), userData);
        } catch (IOException e) {
            throw new RuntimeException("Failed to export user data", e);
        }
    }

    private UserSettingsResponse mapToResponse(UserSettings settings) {
        UserSettingsResponse response = new UserSettingsResponse();
        response.setId(settings.getId());
        response.setUserId(settings.getUser().getId());
        response.setUsername(settings.getUser().getUsername());
        response.setEmail(settings.getUser().getEmail());
        response.setNotificationsEnabled(settings.isNotificationsEnabled());
        response.setEmailNotifications(settings.isEmailNotifications());
        response.setTaskReminders(settings.isTaskReminders());
        response.setDueDateAlerts(settings.isDueDateAlerts());
        response.setSystemNotifications(settings.isSystemNotifications());
        response.setDarkMode(settings.isDarkMode());
        response.setCompactMode(settings.isCompactMode());
        response.setFontSize(settings.getFontSize());
        response.setShareTaskStatistics(settings.isShareTaskStatistics());
        response.setAllowDataCollection(settings.isAllowDataCollection());
        response.setAccountActive(settings.isAccountActive());
        return response;
    }

	
}