// todo-frontend/src/app/features/comments/components/comment-form/comment-form.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommentRequest, CommentResponse } from '../../models/comment.model';

@Component({
  selector: 'app-comment-form',
  standalone: false,
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  @Input() taskId!: number;
  @Input() commentToEdit: CommentResponse | null = null;
  @Output() commentCreated = new EventEmitter<CommentResponse>();
  @Output() commentUpdated = new EventEmitter<CommentResponse>();
  @Output() cancelEdit = new EventEmitter<void>();

  commentForm!: FormGroup;
  isSubmitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    // When commentToEdit changes, update the form
    if (this.commentForm) {
      if (this.commentToEdit) {
        this.commentForm.patchValue({
          content: this.commentToEdit.content
        });
      } else {
        this.commentForm.reset();
      }
    }
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    const commentRequest: CommentRequest = {
      content: this.commentForm.value.content
    };

    if (this.commentToEdit) {
      // Update existing comment
      this.commentService.updateComment(this.commentToEdit.id, commentRequest)
        .subscribe({
          next: (comment) => {
            this.isSubmitting = false;
            this.commentUpdated.emit(comment);
            this.commentForm.reset();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.error = err.message || 'Failed to update comment';
          }
        });
    } else {
      // Create new comment
      this.commentService.createComment(this.taskId, commentRequest)
        .subscribe({
          next: (comment) => {
            this.isSubmitting = false;
            this.commentCreated.emit(comment);
            this.commentForm.reset();
          },
          error: (err) => {
            this.isSubmitting = false;
            this.error = err.message || 'Failed to create comment';
          }
        });
    }
  }

  onCancel(): void {
    this.commentForm.reset();
    this.cancelEdit.emit();
  }
}