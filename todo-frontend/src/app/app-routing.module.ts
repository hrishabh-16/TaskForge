import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { TaskDetailComponent } from './features/tasks/components/task-detail/task-detail.component';
import { TaskFormComponent } from './features/tasks/components/task-form/task-form.component';
import { TaskListListComponent } from './features/task-lists/components/task-list-list/task-list-list.component';
import { TaskListFormComponent } from './features/task-lists/components/task-list-form/task-list-form.component';
import { CategoryListComponent } from './features/categories/components/category-list/category-list.component';
import { CategoryFormComponent } from './features/categories/components/category-form/category-form.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { SettingsComponent } from './features/settings/components/settings/settings.component';
import { NotificationListComponent } from './features/notifications/components/notification-list/notification-list.component';
import { CalendarComponent } from './features/calendar/components/calendar/calendar.component';

import { AuthGuard } from './core/auth/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

   // Task View Routes (MUST BE BEFORE the :id routes)
   { path: 'tasks/today', component: TaskListComponent, canActivate: [AuthGuard] },
   { path: 'tasks/upcoming', component: TaskListComponent, canActivate: [AuthGuard] },
   { path: 'tasks/completed', component: TaskListComponent, canActivate: [AuthGuard] },
   { path: 'tasks/overdue', component: TaskListComponent, canActivate: [AuthGuard] },

  // Task Routes
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },
  // These routes must be AFTER the specific named routes above
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id/edit', component: TaskFormComponent, canActivate: [AuthGuard] },
  
  // Task List Routes
  { path: 'task-lists', component: TaskListListComponent, canActivate: [AuthGuard] },
  { path: 'task-lists/new', component: TaskListFormComponent, canActivate: [AuthGuard] },
  { path: 'task-lists/:id', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task-lists/:id/edit', component: TaskListFormComponent, canActivate: [AuthGuard] },

  // Category Routes
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'categories/new', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'categories/:id', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'categories/:id/edit', component: CategoryFormComponent, canActivate: [AuthGuard] },
   
   // Profile Route
   { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
   // Settings Route
   { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

   // Notifications Route
  { path: 'notifications', component: NotificationListComponent, canActivate: [AuthGuard] },
  
  
  // Calendar placeholder route
  
{ path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  
  // // Categories placeholder routes
  // { path: 'categories/:id', component: TaskListComponent, canActivate: [AuthGuard] },
  // { path: 'categories/new', component: DashboardComponent, canActivate: [AuthGuard] },
  
  // Settings placeholder route
  { path: 'settings', component: DashboardComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '/dashboard' } // Handle 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }