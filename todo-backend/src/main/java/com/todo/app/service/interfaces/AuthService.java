package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.LoginRequest;
import com.todo.app.model.dto.request.SignupRequest;
import com.todo.app.model.dto.response.JwtResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    
    ResponseEntity<?> registerUser(SignupRequest signupRequest);
}