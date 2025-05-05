import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from   '../../../../core/auth/services/auth.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
    
    // Validate token before showing the form
    if (this.token) {
      this.validateToken();
    } else {
      this.tokenError = 'Invalid password reset link. Please request a new one.';
    }

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Validate token with backend
  validateToken() {
    this.authService.validateResetToken(this.token)
      .subscribe({
        next: response => {
          this.tokenValidated = true;
        },
        error: error => {
          this.tokenError = error.error?.message || 'Invalid or expired token. Please request a new password reset link.';
        }
      });
  }

  // Getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(
      this.token,
      this.f['password'].value,
      this.f['confirmPassword'].value
    )
    .subscribe({
      next: response => {
        this.success = response.message || 'Password has been reset successfully';
        this.loading = false;
        // Redirect to login page after successful password reset
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: error => {
        this.error = error.error?.message || 'Failed to reset password';
        this.loading = false;
      }
    });
  }
}