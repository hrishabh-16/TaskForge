export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    roles?: string[];
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }