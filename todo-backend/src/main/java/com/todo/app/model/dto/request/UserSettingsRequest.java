package com.todo.app.model.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSettingsRequest {
	 @NotBlank
	 @Column(updatable = true)
	 private String username;
	 
	 @Email
	 private String email;
	 
    private Boolean notificationsEnabled;
    private Boolean emailNotifications;
    private Boolean taskReminders;
    private Boolean dueDateAlerts;
    private Boolean systemNotifications;
    private Boolean darkMode;
    private Boolean compactMode;
    private String fontSize;
    private Boolean shareTaskStatistics;
    private Boolean allowDataCollection;
	public Boolean getNotificationsEnabled() {
		return notificationsEnabled;
	}
	public void setNotificationsEnabled(Boolean notificationsEnabled) {
		this.notificationsEnabled = notificationsEnabled;
	}
	public Boolean getEmailNotifications() {
		return emailNotifications;
	}
	public void setEmailNotifications(Boolean emailNotifications) {
		this.emailNotifications = emailNotifications;
	}
	public Boolean getTaskReminders() {
		return taskReminders;
	}
	public void setTaskReminders(Boolean taskReminders) {
		this.taskReminders = taskReminders;
	}
	public Boolean getDueDateAlerts() {
		return dueDateAlerts;
	}
	public void setDueDateAlerts(Boolean dueDateAlerts) {
		this.dueDateAlerts = dueDateAlerts;
	}
	public Boolean getSystemNotifications() {
		return systemNotifications;
	}
	public void setSystemNotifications(Boolean systemNotifications) {
		this.systemNotifications = systemNotifications;
	}
	public Boolean getDarkMode() {
		return darkMode;
	}
	public void setDarkMode(Boolean darkMode) {
		this.darkMode = darkMode;
	}
	public Boolean getCompactMode() {
		return compactMode;
	}
	public void setCompactMode(Boolean compactMode) {
		this.compactMode = compactMode;
	}
	public String getFontSize() {
		return fontSize;
	}
	public void setFontSize(String fontSize) {
		this.fontSize = fontSize;
	}
	public Boolean getShareTaskStatistics() {
		return shareTaskStatistics;
	}
	public void setShareTaskStatistics(Boolean shareTaskStatistics) {
		this.shareTaskStatistics = shareTaskStatistics;
	}
	public Boolean getAllowDataCollection() {
		return allowDataCollection;
	}
	public void setAllowDataCollection(Boolean allowDataCollection) {
		this.allowDataCollection = allowDataCollection;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
    
	public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
}