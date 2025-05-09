// src/app/features/settings/components/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSettings, AccountDeactivationRequest, DeleteAccountRequest } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { catchError, finalize, of } from 'rxjs';
import { UserSettingsRequest } from '../../models/settings.model';

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
  isSubmittingAccount = false;
  
  notificationSettingsForm: FormGroup;
  isSubmittingNotifications = false;
  
  appearanceSettingsForm: FormGroup;
  isSubmittingAppearance = false;
  
  privacySettingsForm: FormGroup;
  isSubmittingPrivacy = false;
  
  isDeactivating = false;
  deactivateAccountForm: FormGroup;
  isSubmittingDeactivation = false;
  
  isDeleting = false;
  deleteAccountForm: FormGroup;
  isSubmittingDeletion = false;
  
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
  
    this.isSubmittingAccount = true;
    
    // Create the UserSettingsRequest object with exact field name expected by the backend
    const updateData: UserSettingsRequest = {
      username: this.accountSettingsForm.value.username
    };
    
    console.log('Sending settings update with data:', updateData);
    
    this.settingsService.updateUserSettings(updateData)
      .pipe(
        catchError(err => {
          console.error('Settings update error:', err);
          this.toastr.error(err.message || 'Failed to update account settings', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingAccount = false;
        })
      )
      .subscribe(updatedSettings => {
        if (updatedSettings) {
          console.log('Settings update successful:', updatedSettings);
          this.settings = { ...this.settings, ...updatedSettings };
          this.toastr.success('Account settings updated successfully', 'Success');
          
          // Update current user in auth service
          if (this.authService.currentUserValue) {
            const currentUser = this.authService.currentUserValue;
            currentUser.username = updatedSettings.username;
            
            // Update local storage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update auth service state
            this.authService.updateCurrentUser(currentUser);
          }
        }
      });
  }

  saveNotificationSettings(): void {
    if (this.notificationSettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    this.isSubmittingNotifications = true;
    const formData = this.notificationSettingsForm.value;
    
    this.settingsService.updateNotificationSettings(formData)
      .pipe(
        catchError(err => {
          this.toastr.error(err.message || 'Failed to update notification settings', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingNotifications = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.toastr.success('Notification settings updated successfully', 'Success');
        }
      });
  }

  saveAppearanceSettings(): void {
    if (this.appearanceSettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    this.isSubmittingAppearance = true;
    const formData = this.appearanceSettingsForm.value;
    
    this.settingsService.updateAppearanceSettings(formData)
      .pipe(
        catchError(err => {
          this.toastr.error(err.message || 'Failed to update appearance settings', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingAppearance = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.toastr.success('Appearance settings updated successfully', 'Success');
          
          // Apply dark mode if enabled
          if (formData.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      });
  }

  savePrivacySettings(): void {
    if (this.privacySettingsForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    this.isSubmittingPrivacy = true;
    const formData = this.privacySettingsForm.value;
    
    this.settingsService.updatePrivacySettings(formData)
      .pipe(
        catchError(err => {
          this.toastr.error(err.message || 'Failed to update privacy settings', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingPrivacy = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.toastr.success('Privacy settings updated successfully', 'Success');
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
      this.settingsService.activateAccount()
        .pipe(
          catchError(err => {
            this.toastr.error(err.message || 'Failed to reactivate account', 'Error');
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.toastr.success('Your account has been reactivated', 'Success');
            if (this.settings) {
              this.settings.accountActive = true;
            }
          }
        });
    }
  }

  deactivateAccount(): void {
    if (this.deactivateAccountForm.invalid) {
      this.toastr.error('Please correct the form errors before submitting', 'Validation Error');
      return;
    }

    this.isSubmittingDeactivation = true;
    const request: AccountDeactivationRequest = this.deactivateAccountForm.value;
    
    this.settingsService.deactivateAccount(request)
      .pipe(
        catchError(err => {
          this.toastr.error(err.message || 'Failed to deactivate account', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingDeactivation = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.toastr.success('Your account has been deactivated', 'Success');
          if (this.settings) {
            this.settings.accountActive = false;
          }
          this.isDeactivating = false;
          this.deactivateAccountForm.reset();
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

    this.isSubmittingDeletion = true;
    const request: DeleteAccountRequest = this.deleteAccountForm.value;
    
    this.settingsService.deleteAccount(request)
      .pipe(
        catchError(err => {
          this.toastr.error(err.message || 'Failed to delete account', 'Error');
          return of(null);
        }),
        finalize(() => {
          this.isSubmittingDeletion = false;
        })
      )
      .subscribe(response => {
        if (response) {
          this.toastr.success('Your account has been deleted. Redirecting to login page...', 'Success');
          // Logout user and redirect to login page
          this.authService.logout();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
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

  private updateAuthUser(username: string): void {
    if (this.authService.currentUserValue) {
      const currentUser = this.authService.currentUserValue;
      currentUser.username = username;
      
      // Update local storage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update auth service state
      this.authService.updateCurrentUser(currentUser);
    }
  }
}