package com.todo.app.service.impl;

import com.todo.app.exception.BadRequestException;
import com.todo.app.exception.TokenRefreshException;
import com.todo.app.model.dto.request.ForgotPasswordRequest;
import com.todo.app.model.dto.request.PasswordResetRequest;
import com.todo.app.model.entity.PasswordResetToken;
import com.todo.app.model.entity.User;
import com.todo.app.repository.PasswordResetTokenRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.EmailService;
import com.todo.app.service.interfaces.PasswordResetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class PasswordResetServiceImpl implements PasswordResetService {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetServiceImpl.class);
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void createPasswordResetTokenForEmail(ForgotPasswordRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No user found with email: " + email));
        
        // If there's an existing token, remove it
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
        
        // Create new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);
        
        // Send email with reset link
        try {
            emailService.sendPasswordResetEmail(user, token);
            logger.info("Password reset email sent to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    @Override
    public String validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenRefreshException(token, "Invalid password reset token"));
        
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new TokenRefreshException(token, "Password reset token has expired");
        }
        
        return resetToken.getUser().getEmail();
    }
    
    @Override
    public void resetPassword(PasswordResetRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new TokenRefreshException(request.getToken(), "Invalid password reset token"));
        
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new TokenRefreshException(request.getToken(), "Password reset token has expired");
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        
        // Delete the used token
        tokenRepository.delete(resetToken);
        
        logger.info("Password reset successfully for user: {}", user.getUsername());
    }
}