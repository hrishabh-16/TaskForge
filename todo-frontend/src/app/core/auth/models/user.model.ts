export interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }
  export interface UserResponse {
    id: number;
    username: string;
    email: string;
    roles: string[];
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }