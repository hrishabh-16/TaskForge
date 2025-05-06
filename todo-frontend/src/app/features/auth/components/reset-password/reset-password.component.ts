// src/app/features/auth/components/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string = '';
  loading = false;
  submitted = false;
  error = '';
  success = '';
  tokenValidated = false;
  tokenError = '';
  showToast = false;
  manualTokenEntry = true; // We'll change this to true to allow manual token entry

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Check if token is in URL parameters
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    // Create the form with token field included
    this.resetPasswordForm = this.formBuilder.group({
      token: [this.token, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    // If token is provided in URL, validate it automatically
    if (this.token) {
      this.validateToken();
    }
  }

  // Validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Validate token with backend
  validateToken() {
    const tokenToValidate = this.f['token'].value;
    if (!tokenToValidate) {
      this.tokenError = 'Token is required';
      return;
    }

    this.loading = true;
    this.tokenError = '';
    
    this.authService.validateResetToken(tokenToValidate)
      .subscribe({
        next: response => {
          this.tokenValidated = true;
          this.loading = false;
        },
        error: error => {
          this.tokenError = error.message || 'Invalid or expired token. Please request a new password reset link.';
          this.tokenValidated = false;
          this.loading = false;
        }
      });
  }

  // Getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';
    this.showToast = false;

    // Stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(
      this.f['token'].value,
      this.f['password'].value,
      this.f['confirmPassword'].value
    )
    .subscribe({
      next: response => {
        this.success = response.message || 'Password has been reset successfully';
        this.showToast = true;
        this.loading = false;
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: error => {
        this.error = error.message || 'Failed to reset password';
        this.loading = false;
      }
    });
  }
  
  closeToast() {
    this.showToast = false;
  }
}