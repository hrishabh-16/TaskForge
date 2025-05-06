import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Feature Modules
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { TasksModule } from './features/tasks/tasks.module';
import { TaskListsModule } from './features/task-lists/task-lists.module';
import { CategoriesModule } from './features/categories/categories.module';

import { SharedModule } from './shared/shared.module';

// Auth Components (since they're not declared in AuthModule yet)
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';


// Services
import { TaskService } from './features/tasks/services/task.service';
import { CategoryService } from './features/categories/services/category.service';
import { TaskListService } from './features/task-lists/services/task-list.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,  
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    TasksModule,
    TaskListsModule,
    CategoriesModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ,
    TaskService,
    CategoryService,
    TaskListService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }