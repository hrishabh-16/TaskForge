package com.todo.app.security;

import com.todo.app.model.entity.User;
import com.todo.app.model.entity.UserLoginActivity;
import com.todo.app.repository.UserLoginActivityRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.security.jwt.JwtTokenProvider;
import com.todo.app.security.service.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.file.attribute.UserPrincipal;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationFilter extends OncePerRequestFilter {
	@Autowired
    private  JwtTokenProvider tokenProvider;
	@Autowired
    private  UserDetailsServiceImpl userDetailsService;
	@Autowired
    private  UserRepository userRepository;
	@Autowired
    private  UserLoginActivityRepository loginActivityRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (jwt != null && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Update last login time and record login activity
                recordLoginActivity(request, userDetails, true, null);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            
            // Record failed login attempt if possible
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserDetails) {
                recordLoginActivity(request, (UserDetails) auth.getPrincipal(), false, ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
    private void recordLoginActivity(HttpServletRequest request, UserDetails userDetails, boolean success, String failureReason) {
        if (userDetails instanceof UserPrincipal) {
            Long userId = ((User) userDetails).getId();
            Optional<User> userOpt = userRepository.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Update last login time if successful
                if (success) {
                    user.setLastLoginTime(LocalDateTime.now());
                    userRepository.save(user);
                }
                
                // Record login activity
                UserLoginActivity activity = new UserLoginActivity();
                activity.setUser(user);
                activity.setTimestamp(LocalDateTime.now());
                activity.setIpAddress(getClientIpAddress(request));
                activity.setDevice(request.getHeader("User-Agent"));
                activity.setSuccess(success);
                activity.setFailureReason(failureReason);
                
                loginActivityRepository.save(activity);
            }
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