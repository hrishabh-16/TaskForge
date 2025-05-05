package com.todo.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;



public class PasswordResetRequest {
    @NotBlank
    private String token;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String confirmPassword;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}
}