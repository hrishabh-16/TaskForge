
export interface Profile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  taskStats?: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

export interface ProfileUpdateRequest {
  username: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}