// src/app/features/auth/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  showToast = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { passwordMismatch: true };
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';
    this.showToast = false;
  
    if (this.registerForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.authService.register(
      this.f['username'].value,
      this.f['email'].value,
      this.f['password'].value,
      this.f['confirmPassword'].value
    )
    .pipe(first())
    .subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        this.success = response.message || 'Registration successful!';
        this.showToast = true;
        this.loading = false;
        
        // First timeout for initial message
        setTimeout(() => {
          this.success = 'Redirecting to login page...';
          
          // Second timeout for navigation
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.error = error.message || 'Registration failed. Please try again.';
        this.loading = false;
        this.showToast = false;
      }
    });
  }
  
  closeToast() {
    this.showToast = false;
  }
}