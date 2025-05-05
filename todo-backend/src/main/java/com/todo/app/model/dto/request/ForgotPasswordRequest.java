package com.todo.app.model.dto.request;

import com.todo.app.validation.annotation.ValidEmail;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank
    @ValidEmail
    private String email;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
    
}