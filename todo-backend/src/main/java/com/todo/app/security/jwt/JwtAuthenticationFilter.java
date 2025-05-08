

// src/main/java/com/todo/app/security/jwt/JwtAuthenticationFilter.java
package com.todo.app.security.jwt;

import com.todo.app.model.entity.User;
import com.todo.app.model.entity.UserLoginActivity;
import com.todo.app.repository.UserLoginActivityRepository;
import com.todo.app.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserLoginActivityRepository loginActivityRepository;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        try {
            String jwt = tokenProvider.resolveToken(request);
            if (jwt != null && tokenProvider.validateToken(jwt)) {
                logger.debug("Valid JWT token found");
                Authentication auth = tokenProvider.getAuthentication(jwt);
                SecurityContextHolder.getContext().setAuthentication(auth);
                logger.debug("Authentication set for user: {}", auth.getName());
                
                // Record login activity and update last login time
                recordLoginActivity(request, auth.getName());
            } else {
                logger.debug("No valid JWT token found in request");
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private void recordLoginActivity(HttpServletRequest request, String username) {
        try {
            // Only record activity for certain paths to avoid recording activity for every request
            String path = request.getRequestURI();
            if (path.contains("/api/auth/signin") || 
                (path.contains("/api/profile") && request.getMethod().equals("GET")) ||
                path.contains("/api/users/me")) {
                
                Optional<User> userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    
                    // Update last login time
                    user.setLastLoginTime(LocalDateTime.now());
                    userRepository.save(user);
                    
                    // Record login activity
                    UserLoginActivity activity = new UserLoginActivity();
                    activity.setUser(user);
                    activity.setTimestamp(LocalDateTime.now());
                    activity.setIpAddress(getClientIpAddress(request));
                    activity.setDevice(request.getHeader("User-Agent"));
                    activity.setSuccess(true);
                    
                    loginActivityRepository.save(activity);
                    
                    logger.debug("Recorded login activity for user: {}", username);
                }
            }
        } catch (Exception e) {
            logger.error("Error recording login activity: {}", e.getMessage());
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
}