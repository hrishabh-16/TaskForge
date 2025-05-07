
export interface CommentRequest {
    content: string;
  }
  
  export interface CommentResponse {
    id: number;
    content: string;
    taskId: number;
    userId: number;
    username: string;
    createdAt: string;
    updatedAt: string;
  }