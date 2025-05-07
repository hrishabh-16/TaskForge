// src/app/features/settings/components/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSettings, AccountDeactivationRequest, DeleteAccountRequest } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: UserSettings | null = null;
  isLoading = true;
  error = '';
  
  selectedTab = 'account';
  
  accountSettingsForm: FormGroup;
  notificationSettingsForm: FormGroup;
  appearanceSettingsForm: FormGroup;
  privacySettingsForm: FormGroup;
  
  isDeactivating = false;
  deactivateAccountForm: FormGroup;
  
  isDeleting = false;
  deleteAccountForm: FormGroup;
  
  deleteConfirmPhrase = 'delete my account';

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Initialize forms with default values
    this.accountSettingsForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [{ value: '', disabled: true }]
    });
    
    this.notificationSettingsForm = this.formBuilder.group({
      emailNotifications: [false],
      taskReminders: [false],
      dueDateAlerts: [false],
      systemNotifications: [false]
    });
    
    this.appearanceSettingsForm = this.formBuilder.group({
      darkMode: [false],
      compactMode: [false],
      fontSize: ['medium']
    });
    
    this.privacySettingsForm = this.formBuilder.group({
      shareTaskStatistics: [false],
      allowDataCollection: [false]
    });
    
    this.deactivateAccountForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      reason: ['']
    });
    
    this.deleteAccountForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPhrase: ['', [Validators.required, this.confirmPhraseValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.settingsService.getUserSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        
        // Patch forms with user settings
        this.accountSettingsForm.patchValue({
          username: settings.username,
          email: settings.email
        });
        
        this.notificationSettingsForm.patchValue({
          emailNotifications: settings.emailNotifications || false,
          // Other notification settings will be default values if not present in the API response
        });
        
        this.appearanceSettingsForm.patchValue({
          darkMode: settings.darkMode || false,
          // Other appearance settings will be default values if not present in the API response
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load settings';
        this.isLoading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  saveAccountSettings(): void {
    if (this.accountSettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const formData = this.accountSettingsForm.getRawValue();
    
    this.settingsService.updateUserSettings(formData).subscribe({
      next: (updatedSettings) => {
        this.settings = { ...this.settings, ...updatedSettings };
        this.toastr.success('Account settings updated successfully', 'Success');
        
        // Update current user in auth service if necessary
        if (this.authService.currentUserValue) {
          const currentUser = this.authService.currentUserValue;
          currentUser.username = updatedSettings.username;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          // Assuming there's a method to update the current user in the auth service
          this.authService.updateCurrentUser(currentUser);
        }
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to update account settings', 'Error');
      }
    });
  }

  saveNotificationSettings(): void {
    if (this.notificationSettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const formData = this.notificationSettingsForm.value;
    
    this.settingsService.updateNotificationSettings(formData).subscribe({
      next: () => {
        this.toastr.success('Notification settings updated successfully', 'Success');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to update notification settings', 'Error');
      }
    });
  }

  saveAppearanceSettings(): void {
    if (this.appearanceSettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const formData = this.appearanceSettingsForm.value;
    
    this.settingsService.updateAppearanceSettings(formData).subscribe({
      next: () => {
        this.toastr.success('Appearance settings updated successfully', 'Success');
        
        // Apply dark mode if enabled
        if (formData.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to update appearance settings', 'Error');
      }
    });
  }

  savePrivacySettings(): void {
    if (this.privacySettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const formData = this.privacySettingsForm.value;
    
    this.settingsService.updatePrivacySettings(formData).subscribe({
      next: () => {
        this.toastr.success('Privacy settings updated successfully', 'Success');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to update privacy settings', 'Error');
      }
    });
  }

  toggleAccountStatus(): void {
    if (!this.settings) return;
    
    if (this.settings.accountActive) {
      // Deactivate account
      this.isDeactivating = true;
    } else {
      // Activate account
      this.settingsService.activateAccount().subscribe({
        next: () => {
          this.toastr.success('Your account has been reactivated', 'Success');
          if (this.settings) {
            this.settings.accountActive = true;
          }
        },
        error: (err) => {
          this.toastr.error(err.message || 'Failed to reactivate account', 'Error');
        }
      });
    }
  }

  deactivateAccount(): void {
    if (this.deactivateAccountForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const request: AccountDeactivationRequest = this.deactivateAccountForm.value;
    
    this.settingsService.deactivateAccount(request).subscribe({
      next: () => {
        this.toastr.success('Your account has been deactivated', 'Success');
        if (this.settings) {
          this.settings.accountActive = false;
        }
        this.isDeactivating = false;
        this.deactivateAccountForm.reset();
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to deactivate account', 'Error');
      }
    });
  }

  cancelDeactivation(): void {
    this.isDeactivating = false;
    this.deactivateAccountForm.reset();
  }

  showDeleteConfirmation(): void {
    this.isDeleting = true;
  }

  cancelDeletion(): void {
    this.isDeleting = false;
    this.deleteAccountForm.reset();
  }

  deleteAccount(): void {
    if (this.deleteAccountForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    const request: DeleteAccountRequest = this.deleteAccountForm.value;
    
    this.settingsService.deleteAccount(request).subscribe({
      next: () => {
        this.toastr.success('Your account has been deleted. Redirecting to login page...', 'Success');
        // Logout user and redirect to login page
        this.authService.logout();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to delete account', 'Error');
      }
    });
  }

  exportUserData(): void {
    this.settingsService.exportUserData().subscribe({
      next: (data) => {
        // Create a download link for the blob data
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'taskforge-user-data.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.toastr.success('Your data has been exported successfully', 'Success');
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to export user data', 'Error');
      }
    });
  }

  confirmPhraseValidator(control: any) {
    if (control.value !== this.deleteConfirmPhrase) {
      return { incorrectPhrase: true };
    }
    return null;
  }
}