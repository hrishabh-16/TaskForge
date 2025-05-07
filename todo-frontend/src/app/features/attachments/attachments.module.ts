import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttachmentsRoutingModule } from './attachments-routing.module';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { AttachmentUploadComponent } from './components/attachment-upload/attachment-upload.component';


@NgModule({
  declarations: [
    AttachmentListComponent,
    AttachmentUploadComponent
  ],
  imports: [
    CommonModule,
    AttachmentsRoutingModule
  ],
  exports: [
    AttachmentListComponent,
    AttachmentUploadComponent
  ]
})
export class AttachmentsModule { }
