// src/app/core/models/task.model.ts
export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD'
  }
  
  export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
  }

  export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    userId: number;
    username?: string;
    categoryId?: number;
    categoryName?: string;
    taskListId?: number;
    taskListName?: string;
    commentCount?: number;
    attachmentCount?: number;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
  }