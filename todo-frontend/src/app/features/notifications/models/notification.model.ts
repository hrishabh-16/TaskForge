 
// todo-frontend/src/app/features/notifications/models/notification.model.ts
export enum NotificationType {
    TASK_DUE_SOON = 'TASK_DUE_SOON',
    TASK_OVERDUE = 'TASK_OVERDUE',
    TASK_STATUS_UPDATED = 'TASK_STATUS_UPDATED',
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_COMPLETED = 'TASK_COMPLETED',
    PASSWORD_RESET = 'PASSWORD_RESET',
    ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION'
  }
  
  export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    taskId?: number;
    createdAt: string;
    readAt?: string;
  }