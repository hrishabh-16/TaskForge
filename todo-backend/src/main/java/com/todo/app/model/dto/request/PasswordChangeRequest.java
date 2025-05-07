
package com.todo.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;



public class PasswordChangeRequest {
    
    @NotBlank
    private String currentPassword;
    
    @NotBlank
    private String newPassword;
    
    @NotBlank
    private String confirmPassword;

	public String getCurrentPassword() {
		return currentPassword;
	}

	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
    
    
}