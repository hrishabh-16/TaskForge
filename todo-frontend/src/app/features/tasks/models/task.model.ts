 
// src/app/features/tasks/models/task.model.ts
export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
    userId?: number;
    username?: string;
    categoryId?: number;
    categoryName?: string;
    taskListId?: number;
    taskListName?: string;
    commentCount?: number;
    attachmentCount?: number;
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
  }
  
  export interface TaskRequest {
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
    categoryId?: number;
    taskListId?: number;
  }
  
  export interface TaskResponse {
    id: number;
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string;
    userId: number;
    username: string;
    categoryId?: number;
    categoryName?: string;
    taskListId?: number;
    taskListName?: string;
    commentCount: number;
    attachmentCount: number;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  }
  
  export interface TaskStatistics {
    total: number;
    completed: number;
    overdue: number;
    upcoming: number;
  }