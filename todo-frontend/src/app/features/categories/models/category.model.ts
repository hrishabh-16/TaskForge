 // src/app/features/categories/models/category.model.ts
export interface Category {
    id: number;
    name: string;
    description?: string;
    color?: string;
    userId?: number;
    taskCount?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CategoryRequest {
    name: string;
    description?: string;
    color?: string;
  }
  
  export interface CategoryResponse {
    id: number;
    name: string;
    description?: string;
    color?: string;
    userId: number;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
  }