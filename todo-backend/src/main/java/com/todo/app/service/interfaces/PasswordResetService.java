package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.ForgotPasswordRequest;
import com.todo.app.model.dto.request.PasswordResetRequest;

public interface PasswordResetService {
    
    void createPasswordResetTokenForEmail(ForgotPasswordRequest request);
    
    String validatePasswordResetToken(String token);
    
    void resetPassword(PasswordResetRequest request);
}