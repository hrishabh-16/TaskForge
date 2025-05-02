package com.todo.app.security;

import com.todo.app.model.entity.User;
import com.todo.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {
    
    private final UserRepository userRepository;

    @Autowired
    public UserSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String currentUsername = authentication.getName();
        return userRepository.findByUsername(currentUsername)
            .map(user -> user.getId().equals(userId))
            .orElse(false);
    }
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String currentUsername = authentication.getName();
        return userRepository.findByUsername(currentUsername).orElse(null);
    }
    
    public Long getCurrentUserId() {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
    }
    
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}