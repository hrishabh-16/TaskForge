// src/app/features/auth/components/forgot-password/forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  showToast = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';
    this.showToast = false;

    // Stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.f['email'].value)
      .subscribe({
        next: response => {
          this.success = response.message || 'Password reset email has been sent. Please check your inbox.';
          this.showToast = true;
          this.loading = false;
          
          // Important: We're changing this to redirect to the reset-password page
          // instead of login page
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 3000);
        },
        error: error => {
          this.error = error.message || 'Error sending password reset email.';
          this.loading = false;
        }
      });
  }
  
  closeToast() {
    this.showToast = false;
  }
}