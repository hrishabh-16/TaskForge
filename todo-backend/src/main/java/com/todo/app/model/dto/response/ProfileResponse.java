package com.todo.app.model.dto.response;


import java.time.LocalDateTime;
import java.util.Set;


public class ProfileResponse {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    private TaskStatistics taskStats;
    
    
    public static class TaskStatistics {
        private int total;
        private int completed;
        private int pending;
        private int overdue;
		public int getTotal() {
			return total;
		}
		public void setTotal(int total) {
			this.total = total;
		}
		public int getCompleted() {
			return completed;
		}
		public void setCompleted(int completed) {
			this.completed = completed;
		}
		public int getPending() {
			return pending;
		}
		public void setPending(int pending) {
			this.pending = pending;
		}
		public int getOverdue() {
			return overdue;
		}
		public void setOverdue(int overdue) {
			this.overdue = overdue;
		}
     }


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
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


	public Set<String> getRoles() {
		return roles;
	}


	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}


	public boolean isEnabled() {
		return enabled;
	}


	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}


	public LocalDateTime getCreatedAt() {
		return createdAt;
	}


	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}


	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}


	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}


	public LocalDateTime getLastLoginAt() {
		return lastLoginAt;
	}


	public void setLastLoginAt(LocalDateTime lastLoginAt) {
		this.lastLoginAt = lastLoginAt;
	}


	public TaskStatistics getTaskStats() {
		return taskStats;
	}


	public void setTaskStats(TaskStatistics taskStats) {
		this.taskStats = taskStats;
	}
    
    
    
}