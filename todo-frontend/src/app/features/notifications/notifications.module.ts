import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationService } from './services/notification.service';


@NgModule({
  declarations: [
    NotificationListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NotificationsRoutingModule
  ],
  exports: [
    NotificationListComponent
  ],
  providers: [
    NotificationService
  ]
})
export class NotificationsModule { }
