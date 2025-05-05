export interface ForgotPasswordRequest {
    email: string;
  }
  
  export interface PasswordResetRequest {
    token: string;
    password: string;
    confirmPassword: string;
  }