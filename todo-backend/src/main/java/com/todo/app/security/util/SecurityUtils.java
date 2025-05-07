// src/main/java/com/todo/app/security/util/SecurityUtils.java
package com.todo.app.security.util;

import com.todo.app.model.entity.User;
import com.todo.app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {
    
    private static UserRepository userRepositoryStatic;
    
    public SecurityUtils(UserRepository userRepository) {
        SecurityUtils.userRepositoryStatic = userRepository;
    }
    
    /**
     * Get the current authenticated user
     * @return Optional User entity or empty if not authenticated
     */
    public static Optional<User> getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        String username = authentication.getName();
        return userRepositoryStatic.findByUsername(username);
    }
    
    /**
     * Get the current authenticated user ID
     * @return Optional user ID or empty if not authenticated
     */
    public static Optional<Long> getCurrentUserId() {
        return getCurrentUser().map(User::getId);
    }
    
    /**
     * Check if the current user is authenticated
     * @return true if authenticated, false otherwise
     */
    public static boolean isAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
                .map(authentication -> authentication.isAuthenticated() && 
                        !(authentication.getPrincipal() instanceof String) &&
                        !"anonymousUser".equals(authentication.getPrincipal()))
                .orElse(false);
    }
}