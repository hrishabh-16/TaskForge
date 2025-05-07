import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { CommentsRoutingModule } from './comments-routing.module';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';


@NgModule({
  declarations: [
    CommentListComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommentListComponent,
    CommentFormComponent
  ]
})
export class CommentsModule { }
