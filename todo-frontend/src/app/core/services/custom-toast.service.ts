// src/app/core/services/custom-toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomToastService {
  private toastContainer: HTMLElement | null = null;

  constructor() {
    // Initialize toast container on service creation
    this.createToastContainer();
  }

  /**
   * Show a success toast notification
   */
  showSuccess(message: string, title: string = 'Success'): void {
    this.showToast(message, title, 'success');
  }

  /**
   * Show an error toast notification
   */
  showError(message: string, title: string = 'Error'): void {
    this.showToast(message, title, 'error');
  }

  /**
   * Internal method to create and manage toast notifications
   */
  private showToast(message: string, title: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Ensure container exists
    if (!this.toastContainer) {
      this.createToastContainer();
    }
    
    // Log for debugging
    console.log(`Showing ${type} toast: ${title} - ${message}`);

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.minWidth = '300px';
    toast.style.backgroundColor = type === 'success' ? '#51A351' : 
                               type === 'error' ? '#BD362F' : 
                               type === 'info' ? '#2F96B4' : '#F89406';
    toast.style.color = 'white';
    toast.style.padding = '15px 25px';
    toast.style.marginBottom = '10px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in';
    toast.style.position = 'relative';

    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.style.position = 'absolute';
    progressBar.style.bottom = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.width = '0';
    progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    progressBar.style.transition = 'width 3s linear';

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '10px';
    closeButton.style.top = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      if (this.toastContainer?.contains(toast)) {
        toast.style.opacity = '0';
        setTimeout(() => {
          this.toastContainer?.removeChild(toast);
        }, 300);
      }
    };

    // Create content
    const titleElement = document.createElement('div');
    titleElement.style.fontWeight = 'bold';
    titleElement.style.marginBottom = '5px';
    titleElement.style.paddingRight = '20px'; // Make room for close button
    titleElement.textContent = title;

    const messageElement = document.createElement('div');
    messageElement.textContent = message;

    // Assemble toast
    toast.appendChild(closeButton);
    toast.appendChild(titleElement);
    toast.appendChild(messageElement);
    toast.appendChild(progressBar);
    
    // Add to container
    if (this.toastContainer) {
      this.toastContainer.appendChild(toast);
    }

    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      progressBar.style.width = '100%';
    }, 10);

    // Remove after timeout
    setTimeout(() => {
      if (this.toastContainer?.contains(toast)) {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (this.toastContainer?.contains(toast)) {
            this.toastContainer.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);
  }

  /**
   * Create the toast container if it doesn't exist
   */
  private createToastContainer(): void {
    // Check if container already exists
    this.toastContainer = document.getElementById('custom-toast-container');
    
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'custom-toast-container';
      this.toastContainer.style.position = 'fixed';
      this.toastContainer.style.top = '20px';
      this.toastContainer.style.right = '20px';
      this.toastContainer.style.zIndex = '9999';
      document.body.appendChild(this.toastContainer);
      
      console.log('Custom toast container created');
    }
  }
}