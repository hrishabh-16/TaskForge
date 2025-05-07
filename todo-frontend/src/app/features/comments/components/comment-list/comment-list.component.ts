// todo-frontend/src/app/features/comments/components/comment-list/comment-list.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { CommentResponse } from '../../models/comment.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-comment-list',
  standalone: false,
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() taskId!: number;
  
  comments: CommentResponse[] = [];
  isLoading = true;
  error = '';
  commentToEdit: CommentResponse | null = null;

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    if (this.taskId) {
      this.loadComments();
    }
  }

  ngOnChanges(): void {
    if (this.taskId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.isLoading = true;
    this.error = '';
    
    this.commentService.getCommentsByTaskId(this.taskId)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load comments';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  handleCommentCreated(comment: CommentResponse): void {
    this.comments = [comment, ...this.comments];
  }

  handleCommentUpdated(updatedComment: CommentResponse): void {
    this.comments = this.comments.map(comment => 
      comment.id === updatedComment.id ? updatedComment : comment
    );
    this.commentToEdit = null;
  }

  editComment(comment: CommentResponse): void {
    this.commentToEdit = comment;
  }

  cancelEdit(): void {
    this.commentToEdit = null;
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete comment';
            return of(null);
          })
        )
        .subscribe(() => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Get today's date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today or yesterday
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // Format the date
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}