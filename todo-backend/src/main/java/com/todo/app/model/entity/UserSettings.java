// src/main/java/com/todo/app/model/entity/UserSettings.java
package com.todo.app.model.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "user_settings")
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    @Column(name = "notifications_enabled")
    private boolean notificationsEnabled = true;
    
    @Column(name = "email_notifications")
    private boolean emailNotifications = false;
    
    @Column(name = "task_reminders")
    private boolean taskReminders = true;
    
    @Column(name = "due_date_alerts")
    private boolean dueDateAlerts = true;
    
    @Column(name = "system_notifications")
    private boolean systemNotifications = true;
    
    @Column(name = "dark_mode")
    private boolean darkMode = false;
    
    @Column(name = "compact_mode")
    private boolean compactMode = false;
    
    @Column(name = "font_size")
    private String fontSize = "medium";
    
    @Column(name = "share_task_statistics")
    private boolean shareTaskStatistics = false;
    
    @Column(name = "allow_data_collection")
    private boolean allowDataCollection = false;
    
    @Column(name = "account_active")
    private boolean accountActive = true;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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