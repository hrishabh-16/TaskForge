package com.todo.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AccountDeactivationRequest {
    
    @NotBlank
    private String password;
    
    private String reason;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
    
    
    
}