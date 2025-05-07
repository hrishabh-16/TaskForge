// src/app/features/settings/models/settings.model.ts
export interface UserSettings {
    id: number;
    username: string;
    email: string;
    accountActive: boolean;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  }
  
  export interface AccountDeactivationRequest {
    password: string;
    reason?: string;
  }
  
  export interface AppearanceSettings {
    darkMode: boolean;
    compactMode: boolean;
    fontSize: string;
  }
  
  export interface NotificationSettings {
    emailNotifications: boolean;
    taskReminders: boolean;
    dueDateAlerts: boolean;
    systemNotifications: boolean;
  }
  
  export interface PrivacySettings {
    shareTaskStatistics: boolean;
    allowDataCollection: boolean;
  }
  
  export interface DeleteAccountRequest {
    password: string;
    confirmPhrase: string;
  }