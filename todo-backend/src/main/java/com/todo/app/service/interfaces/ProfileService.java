package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.PasswordChangeRequest;
import com.todo.app.model.dto.request.ProfileUpdateRequest;
import com.todo.app.model.dto.response.LoginActivityResponse;
import com.todo.app.model.dto.response.ProfileResponse;

import java.util.List;

public interface ProfileService {
    ProfileResponse getCurrentUserProfile();
    ProfileResponse updateProfile(ProfileUpdateRequest request);
    void changePassword(PasswordChangeRequest request);
    List<LoginActivityResponse> getUserLoginActivity();
}