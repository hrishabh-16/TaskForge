import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { CommentsModule } from '../comments/comments.module';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TaskListComponent,
    TaskDetailComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommentsModule,
    TasksRoutingModule,
    SharedModule
  ],
  exports: [
    TaskListComponent,
    TaskDetailComponent,
    TaskFormComponent
  ]
})
export class TasksModule { }
