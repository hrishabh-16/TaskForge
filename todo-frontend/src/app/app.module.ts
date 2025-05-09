import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';

// Core Module
import { CoreModule } from './core/core.module';

// Feature Modules
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { TasksModule } from './features/tasks/tasks.module';
import { TaskListsModule } from './features/task-lists/task-lists.module';
import { CategoriesModule } from './features/categories/categories.module';
import { CommentsModule } from './features/comments/comments.module';
import { AttachmentsModule } from './features/attachments/attachments.module';
import { ProfileModule } from './features/profile/profile.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { SettingsModule } from './features/settings/settings.module';
import { CalendarModule } from './features/calendar/calendar.module';
import { SharedModule } from './shared/shared.module';

// Material Design modules for dialogs
import { MatDialogModule } from '@angular/material/dialog';

// Auth Components (since they're not declared in AuthModule yet)
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';



// Services
import { TaskService } from './features/tasks/services/task.service';
import { CategoryService } from './features/categories/services/category.service';
import { TaskListService } from './features/task-lists/services/task-list.service';
import { CommentService } from './features/comments/services/comment.service';
import { AttachmentService } from './features/attachments/services/attachment.service';
import { ProfileService } from './features/profile/services/profile.service';
import { SettingsService } from './features/settings/services/settings.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,  
    ForgotPasswordComponent,
    ResetPasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      easing: 'ease-in',
      progressAnimation: 'increasing'
    }),
    DashboardModule,
    TasksModule,
    TaskListsModule,
    CategoriesModule,
    CommentsModule,
    AttachmentsModule,
    ProfileModule,
    SettingsModule,
    NotificationsModule,
    MatDialogModule,
    CalendarModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ,
    TaskService,
    CategoryService,
    TaskListService,
    CommentService,
    AttachmentService,
    ProfileService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }