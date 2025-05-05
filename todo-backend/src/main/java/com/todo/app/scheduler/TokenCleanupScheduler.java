package com.todo.app.scheduler;

import com.todo.app.repository.PasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class TokenCleanupScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(TokenCleanupScheduler.class);
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Scheduled(cron = "0 0 1 * * ?") // Run at 1:00 AM every day
    @Transactional
    public void cleanupExpiredTokens() {
        logger.info("Starting expired token cleanup");
        
        LocalDateTime now = LocalDateTime.now();
        passwordResetTokenRepository.deleteAllExpiredTokens(now);
        
        logger.info("Expired token cleanup completed");
    }
}