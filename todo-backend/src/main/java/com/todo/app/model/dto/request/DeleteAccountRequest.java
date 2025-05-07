package com.todo.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DeleteAccountRequest {
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String confirmPhrase;

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPhrase() {
		return confirmPhrase;
	}

	public void setConfirmPhrase(String confirmPhrase) {
		this.confirmPhrase = confirmPhrase;
	}
    
    
    
    
}