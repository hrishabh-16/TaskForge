// src/app/features/auth/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

 // src/app/features/auth/components/login/login.component.ts (continued)
 ngOnInit() {
  this.loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  // Get return url from route parameters or default to '/dashboard'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
}

// Getter for easy access to form fields
get f() { return this.loginForm.controls; }

onSubmit() {
  this.submitted = true;
  this.error = '';

  // Stop here if form is invalid
  if (this.loginForm.invalid) {
    return;
  }

  this.loading = true;
  console.log('Attempting login with username:', this.f['username'].value);
  this.authService.login(this.f['username'].value, this.f['password'].value)
    .pipe(first())
    .subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        console.error('Login error:', error);
        this.error = error.message || 'Invalid username or password';
        this.loading = false;
      }
    });
}
}