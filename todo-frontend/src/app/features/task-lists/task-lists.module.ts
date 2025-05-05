import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListsRoutingModule } from './task-lists-routing.module';
import { TaskListListComponent } from './components/task-list-list/task-list-list.component';
import { TaskListFormComponent } from './components/task-list-form/task-list-form.component';


@NgModule({
  declarations: [
    TaskListListComponent,
    TaskListFormComponent
  ],
  imports: [
    CommonModule,
    TaskListsRoutingModule
  ]
})
export class TaskListsModule { }
