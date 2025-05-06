import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard' ;

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {  path: 'reset-password', component: ResetPasswordComponent  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },


  // New routes based on sidebar
  { path: 'tasks/today', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder until implemented
  { path: 'tasks/upcoming', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'tasks/completed', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'tasks/overdue', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'task-lists/:id', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'task-lists/new', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'calendar', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'categories/:id', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'categories/new', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder
  { path: 'settings', component: DashboardComponent, canActivate: [AuthGuard] }, // Placeholder

  
  // { path: '**', redirectTo: '/login' } // Handle 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }