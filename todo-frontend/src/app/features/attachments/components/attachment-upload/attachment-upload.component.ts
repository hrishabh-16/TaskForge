// todo-frontend/src/app/features/attachments/components/attachment-upload/attachment-upload.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { AttachmentResponse } from '../../models/attachment.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-attachment-upload',
  standalone: false,
  templateUrl: './attachment-upload.component.html',
  styleUrls: ['./attachment-upload.component.css']
})
export class AttachmentUploadComponent {
  @Input() taskId!: number;
  @Output() uploadComplete = new EventEmitter<AttachmentResponse>();
  
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  isUploading = false;
  error = '';
  showUploadForm = false;

  constructor(private attachmentService: AttachmentService) { }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      // Reset form when hiding it
      this.resetForm();
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.progress = 0;
    this.message = '';
    this.error = '';
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFile = file;
        this.isUploading = true;
        this.progress = 0;
        this.error = '';

        this.attachmentService.uploadAttachment(this.taskId, file)
          .pipe(
            catchError(err => {
              this.error = err.message || 'Failed to upload attachment';
              this.isUploading = false;
              this.currentFile = undefined;
              // Return a dummy event that won't trigger progress calculations
              return of({ type: HttpEventType.Response } as HttpEvent<AttachmentResponse>);
            })
          )
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              const progressEvent = event as any; // Type assertion for progress event
              if (progressEvent.total) {
                this.progress = Math.round(100 * progressEvent.loaded / progressEvent.total);
              }
            } else if (event instanceof HttpResponse) {
              if (event.body) {
                this.message = 'Upload successful!';
                this.uploadComplete.emit(event.body);
                
                // Close the form after successful upload after 2 seconds
                setTimeout(() => {
                  this.resetForm();
                  this.showUploadForm = false;
                }, 2000);
              }
              this.isUploading = false;
              this.currentFile = undefined;
            }
          });
      }
    }
  }

  resetForm(): void {
    this.selectedFiles = undefined;
    this.currentFile = undefined;
    this.progress = 0;
    this.message = '';
    this.error = '';
  }
}