// src/app/app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth/services/auth.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('sidebar') sidebar?: SidebarComponent;
  isAuthenticated = false;
  isAuthPage = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.checkCurrentRoute();
  }

  checkAuthentication(): void {
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  checkCurrentRoute(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      this.isAuthPage = url.includes('/login') || 
                       url.includes('/register') || 
                       url.includes('/forgot-password') || 
                       url.includes('/reset-password');
    });
  }
}