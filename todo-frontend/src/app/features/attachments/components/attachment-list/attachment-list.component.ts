// todo-frontend/src/app/features/attachments/components/attachment-list/attachment-list.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentResponse } from '../../models/attachment.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-attachment-list',
  standalone: false,  
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.css']
})
export class AttachmentListComponent implements OnInit {
  @Input() taskId!: number;
  
  attachments: AttachmentResponse[] = [];
  isLoading = true;
  error = '';
  showUploadForm = false;
  isUploading = false;
  progress = 0;
  message = '';
  selectedFiles?: FileList;
  currentFile?: File;

  constructor(private attachmentService: AttachmentService) { }

  ngOnInit(): void {
    if (this.taskId) {
      this.loadAttachments();
    }
  }

  ngOnChanges(): void {
    if (this.taskId) {
      this.loadAttachments();
    }
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
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
              return of(null);
            })
          )
          .subscribe(event => {
            if (event && event.type) {
              // Handle upload progress
              if (event.type === 1) { // HttpEventType.UploadProgress
                const progressEvent = event as any;
                if (progressEvent.total) {
                  this.progress = Math.round(100 * progressEvent.loaded / progressEvent.total);
                }
              } else if (event.type === 4) { // HttpEventType.Response
                if (event.body) {
                  this.message = 'Upload successful!';
                  this.handleAttachmentUploaded(event.body);
                  
                  // Close the form after successful upload after 2 seconds
                  setTimeout(() => {
                    this.resetForm();
                    this.showUploadForm = false;
                  }, 2000);
                }
                this.isUploading = false;
                this.currentFile = undefined;
              }
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

  loadAttachments(): void {
    this.isLoading = true;
    this.error = '';
    
    this.attachmentService.getAttachmentsByTaskId(this.taskId)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load attachments';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(attachments => {
        this.attachments = attachments;
      });
  }

  handleAttachmentUploaded(attachment: AttachmentResponse): void {
    this.attachments = [attachment, ...this.attachments];
  }

  downloadAttachment(id: number, fileName: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.attachmentService.downloadAttachment(id)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to download attachment';
          return of(null);
        })
      )
      .subscribe(blob => {
        if (blob) {
          // Create blob link to download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      });
  }

  deleteAttachment(id: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (confirm('Are you sure you want to delete this attachment?')) {
      this.attachmentService.deleteAttachment(id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete attachment';
            return of(null);
          })
        )
        .subscribe(() => {
          this.attachments = this.attachments.filter(attachment => attachment.id !== id);
        });
    }
  }

  formatFileSize(bytes: number): string {
    return this.attachmentService.formatFileSize(bytes);
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

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return 'image';
    } else if (fileType.startsWith('video/')) {
      return 'video';
    } else if (fileType.startsWith('audio/')) {
      return 'audio';
    } else if (fileType.includes('pdf')) {
      return 'pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'document';
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return 'spreadsheet';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return 'presentation';
    } else if (fileType.includes('zip') || fileType.includes('compressed')) {
      return 'archive';
    } else {
      return 'file';
    }
  }
}