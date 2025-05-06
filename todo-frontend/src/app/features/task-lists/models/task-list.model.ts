// src/app/features/task-lists/models/task-list.model.ts
export interface TaskList {
    id: number;
    name: string;
    description?: string;
    userId?: number;
    taskCount?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface TaskListRequest {
    name: string;
    description?: string;
  }
  
  export interface TaskListResponse {
    id: number;
    name: string;
    description?: string;
    userId: number;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
  }