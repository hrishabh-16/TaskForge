// src/main/java/com/todo/app/service/impl/ProfileServiceImpl.java
package com.todo.app.service.impl;

import com.todo.app.exception.BadRequestException;
import com.todo.app.exception.ResourceNotFoundException;
import com.todo.app.model.dto.request.PasswordChangeRequest;
import com.todo.app.model.dto.request.ProfileUpdateRequest;
import com.todo.app.model.dto.response.LoginActivityResponse;
import com.todo.app.model.dto.response.ProfileResponse;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.entity.UserLoginActivity;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserLoginActivityRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.ProfileService;
import com.todo.app.security.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileServiceImpl.class);
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserLoginActivityRepository loginActivityRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User not found");
        }
        
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<Task> userTasks = taskRepository.findByUser(currentUser);
        
        ProfileResponse response = new ProfileResponse();
        response.setId(currentUser.getId());
        response.setUsername(currentUser.getUsername());
        response.setEmail(currentUser.getEmail());
        response.setRoles(currentUser.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet()));
        response.setEnabled(currentUser.isEnabled());
        response.setCreatedAt(currentUser.getCreatedAt());
        response.setUpdatedAt(currentUser.getUpdatedAt());
        response.setLastLoginAt(currentUser.getLastLoginTime());
        
        // Calculate task statistics
        ProfileResponse.TaskStatistics stats = new ProfileResponse.TaskStatistics();
        stats.setTotal(userTasks.size());
        stats.setCompleted((int) userTasks.stream()
                .filter(task -> "COMPLETED".equals(task.getStatus()))
                .count());
        stats.setPending((int) userTasks.stream()
                .filter(task -> !"COMPLETED".equals(task.getStatus()))
                .count());
        
        // Fix the LocalDate/LocalDateTime issue
        LocalDate today = LocalDate.now();
        stats.setOverdue((int) userTasks.stream()
                .filter(task -> !"COMPLETED".equals(task.getStatus()) && 
                        task.getDueDate() != null && 
                        task.getDueDate().toLocalDate().isBefore(today))
                .count());
        
        response.setTaskStats(stats);
        
        return response;
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        // Get authentication and find user by username directly 
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("No authenticated user found");
            throw new ResourceNotFoundException("User not found");
        }
        
        String currentUsername = authentication.getName();
        logger.info("Attempting to update profile for user: {}", currentUsername);
        
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> {
                    logger.error("User not found in database: {}", currentUsername);
                    return new ResourceNotFoundException("User not found");
                });
        
        // Check if new username already exists (but isn't the current user)
        if (!currentUser.getUsername().equals(request.getUsername()) &&
                userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Username already taken: {}", request.getUsername());
            throw new BadRequestException("Username is already taken");
        }
        
        // Update username
        logger.info("Updating username from {} to {}", currentUser.getUsername(), request.getUsername());
        currentUser.setUsername(request.getUsername());
        currentUser.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(currentUser);
        logger.info("User saved with updated username: {}", updatedUser.getUsername());
        
        // No need to update authentication - just return the updated profile
        return getCurrentUserProfile();
    }

    @Override
    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User not found");
        }
        
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Validate current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        // Validate new password and confirmation match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirmation do not match");
        }
        
        // Update password
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        currentUser.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(currentUser);
    }

    @Override
    public List<LoginActivityResponse> getUserLoginActivity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("User not found");
        }
        
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<UserLoginActivity> activities = loginActivityRepository.findTop10ByUserOrderByTimestampDesc(currentUser);
        
        // If no activities exist, create a dummy one for testing
        if (activities.isEmpty()) {
            logger.info("No login activities found, creating a dummy one for testing");
            UserLoginActivity dummyActivity = new UserLoginActivity();
            dummyActivity.setUser(currentUser);
            dummyActivity.setTimestamp(LocalDateTime.now());
            dummyActivity.setIpAddress("127.0.0.1");
            dummyActivity.setDevice("Web Browser");
            dummyActivity.setSuccess(true);
            
            loginActivityRepository.save(dummyActivity);
            
            // Add it to our list
            activities = new ArrayList<>();
            activities.add(dummyActivity);
        }
        
        return activities.stream()
                .map(activity -> {
                    LoginActivityResponse response = new LoginActivityResponse();
                    response.setId(activity.getId());
                    response.setTimestamp(activity.getTimestamp());
                    response.setIpAddress(activity.getIpAddress());
                    response.setDevice(activity.getDevice());
                    response.setSuccess(activity.isSuccess());
                    return response;
                })
                .collect(Collectors.toList());
    }
}