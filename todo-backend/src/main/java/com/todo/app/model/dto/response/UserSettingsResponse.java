package com.todo.app.model.dto.response;


public class UserSettingsResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private boolean notificationsEnabled;
    private boolean emailNotifications;
    private boolean taskReminders;
    private boolean dueDateAlerts;
    private boolean systemNotifications;
    private boolean darkMode;
    private boolean compactMode;
    private String fontSize;
    private boolean shareTaskStatistics;
    private boolean allowDataCollection;
    private boolean accountActive;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
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
	public boolean isNotificationsEnabled() {
		return notificationsEnabled;
	}
	public void setNotificationsEnabled(boolean notificationsEnabled) {
		this.notificationsEnabled = notificationsEnabled;
	}
	public boolean isEmailNotifications() {
		return emailNotifications;
	}
	public void setEmailNotifications(boolean emailNotifications) {
		this.emailNotifications = emailNotifications;
	}
	public boolean isTaskReminders() {
		return taskReminders;
	}
	public void setTaskReminders(boolean taskReminders) {
		this.taskReminders = taskReminders;
	}
	public boolean isDueDateAlerts() {
		return dueDateAlerts;
	}
	public void setDueDateAlerts(boolean dueDateAlerts) {
		this.dueDateAlerts = dueDateAlerts;
	}
	public boolean isSystemNotifications() {
		return systemNotifications;
	}
	public void setSystemNotifications(boolean systemNotifications) {
		this.systemNotifications = systemNotifications;
	}
	public boolean isDarkMode() {
		return darkMode;
	}
	public void setDarkMode(boolean darkMode) {
		this.darkMode = darkMode;
	}
	public boolean isCompactMode() {
		return compactMode;
	}
	public void setCompactMode(boolean compactMode) {
		this.compactMode = compactMode;
	}
	public String getFontSize() {
		return fontSize;
	}
	public void setFontSize(String fontSize) {
		this.fontSize = fontSize;
	}
	public boolean isShareTaskStatistics() {
		return shareTaskStatistics;
	}
	public void setShareTaskStatistics(boolean shareTaskStatistics) {
		this.shareTaskStatistics = shareTaskStatistics;
	}
	public boolean isAllowDataCollection() {
		return allowDataCollection;
	}
	public void setAllowDataCollection(boolean allowDataCollection) {
		this.allowDataCollection = allowDataCollection;
	}
	public boolean isAccountActive() {
		return accountActive;
	}
	public void setAccountActive(boolean accountActive) {
		this.accountActive = accountActive;
	}
    
    
    
}