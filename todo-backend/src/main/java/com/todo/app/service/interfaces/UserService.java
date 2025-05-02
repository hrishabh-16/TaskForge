package com.todo.app.service.interfaces;

import com.todo.app.model.dto.response.UserResponse;
import com.todo.app.model.entity.User;

import java.util.List;

public interface UserService {
    
    List<UserResponse> getAllUsers();
    
    UserResponse getUserById(Long id);
    
    UserResponse getUserByUsername(String username);
    
    UserResponse getUserByEmail(String email);
    
    UserResponse getCurrentUser();
    
    void deleteUser(Long id);
    
    UserResponse updateUser(Long id, User userDetails);
}