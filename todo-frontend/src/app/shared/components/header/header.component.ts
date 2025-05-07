// src/app/shared/components/header/header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone:false, 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  username: string = '';
  private subscription: Subscription = new Subscription();
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to user changes
    this.subscription.add(
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.username = user.username;
        }
      })
    );

    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
    
    // Remove event listener
    document.removeEventListener('click', this.closeDropdownOnClickOutside.bind(this));
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  closeDropdownOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('user-menu-button');
    
    if (dropdown && !dropdown.contains(target) && this.isDropdownOpen) {
      this.closeDropdown();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}