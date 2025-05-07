package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.AccountDeactivationRequest;
import com.todo.app.model.dto.request.DeleteAccountRequest;
import com.todo.app.model.dto.request.UserSettingsRequest;
import com.todo.app.model.dto.response.UserSettingsResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface SettingsService {
    UserSettingsResponse getUserSettings();
    UserSettingsResponse updateUserSettings(UserSettingsRequest request);
    UserSettingsResponse updateNotificationSettings(UserSettingsRequest request);
    UserSettingsResponse updateAppearanceSettings(UserSettingsRequest request);
    UserSettingsResponse updatePrivacySettings(UserSettingsRequest request);
    void deactivateAccount(AccountDeactivationRequest request);
    void activateAccount();
    void deleteAccount(DeleteAccountRequest request);
    void exportUserData(HttpServletResponse response);
}