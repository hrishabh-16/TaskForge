// src/app/features/profile/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { TaskService } from '../../../../features/tasks/services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { ProfileUpdateRequest } from '../../models/profile.model';
import { CustomToastService } from '../../../../core/services/custom-toast.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  isLoading = true;
  error = '';
  
  profileForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  
  passwordForm: FormGroup;
  isChangingPassword = false;
  isSubmittingPassword = false;
  
  loginActivities: any[] = [];
  loadingActivities = false;
  
  // Success banner flag
  showSuccessBanner = false;

  constructor(
    private profileService: ProfileService,
    private taskService: TaskService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private customToast: CustomToastService // Add custom toast service
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
    
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadLoginActivity();
    this.testToastr(); // Test the toastr on init
  }
  
  // Test toastr functionality
  testToastr(): void {
    setTimeout(() => {
      this.profileService.testToastr().subscribe({
        next: () => {
          console.log('Testing all notification methods...');
      
        }
      });
    }, 1000);
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          username: profile.username
        });
        this.loadTaskStatistics();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile';
        this.isLoading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }
  
  loadTaskStatistics(): void {
    if (!this.profile) return;
    
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Calculate task statistics
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'COMPLETED').length;
        const pending = tasks.filter(task => task.status !== 'COMPLETED').length;
        const overdue = tasks.filter(task => {
          if (task.dueDate && task.status !== 'COMPLETED') {
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
          }
          return false;
        }).length;
        
        // Update profile with task stats
        if (this.profile) {
          this.profile.taskStats = {
            total,
            completed,
            pending,
            overdue
          };
        }
      },
      error: (err) => {
        console.error('Failed to load task statistics:', err);
      }
    });
  }

  loadLoginActivity(): void {
    this.loadingActivities = true;
    this.profileService.getUserLoginActivity().subscribe({
      next: (activities) => {
        this.loginActivities = activities;
        this.loadingActivities = false;
      },
      error: (err) => {
        console.error('Failed to load login activities:', err);
        this.loadingActivities = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode && this.profile) {
      // Reset form when canceling edit
      this.profileForm.patchValue({
        username: this.profile.username
      });
    }
  }

  togglePasswordChange(): void {
    this.isChangingPassword = !this.isChangingPassword;
    if (!this.isChangingPassword) {
      // Reset password form
      this.passwordForm.reset();
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }
  
    this.isSubmitting = true;
    
    // Create the ProfileUpdateRequest object with exact field name expected by the backend
    const formData: ProfileUpdateRequest = {
      username: this.profileForm.value.username
    };
    
    console.log('Sending profile update with data:', formData);
    
    this.profileService.updateProfile(formData)
      .pipe(
        catchError(err => {
          console.error('Profile update error:', err);
          this.toastr.error(err.message || 'Failed to update profile', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe(updatedProfile => {
        if (updatedProfile) {
          console.log('Profile update successful:', updatedProfile);
          this.profile = updatedProfile;
          this.isEditMode = false;
          this.toastr.success('Profile updated successfully', 'Success');
          
          // Update current user in auth service
          if (this.authService.currentUserValue) {
            const currentUser = this.authService.currentUserValue;
            currentUser.username = updatedProfile.username;
            
            // Update local storage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update auth service state
            this.authService.updateCurrentUser(currentUser);
          }
        }
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    this.isSubmittingPassword = true;
    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };
    
    // Log for debugging
    console.log('Attempting to change password...');
    
    this.profileService.changePassword(passwordData)
      .pipe(
        catchError(err => {
          console.error('Password change error:', err);
          
          // Try both notification methods for errors
          this.toastr.error(err.message || 'Failed to change password', 'Error');
          this.customToast.showError('Failed to change password. Please try again.');
          
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingPassword = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response !== null) {
            console.log('Password change successful:', response);
            
            // Try multiple notification methods to ensure at least one works
            this.showPasswordSuccessNotifications();
            
            // Reset the form and close it
            this.passwordForm.reset();
            this.isChangingPassword = false;
          }
        },
        error: (error) => {
          console.error('Password change subscription error:', error);
        }
      });
  }
  
  // Show multiple types of success notifications to ensure visibility
  private showPasswordSuccessNotifications(): void {
    // custom toast for password change success
    this.customToast.showSuccess('Your password has been changed successfully', 'Password Updated'); 
  }
  
  // Method to dismiss the success banner manually
  dismissSuccessBanner(): void {
    this.showSuccessBanner = false;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  getRoleDisplay(roles: string[]): string {
    if (!roles || roles.length === 0) return 'User';
    
    return roles.map(role => {
      // Convert ROLE_ADMIN to Admin, ROLE_USER to User, etc.
      return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase();
    }).join(', ');
  }
}