import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UsersRoutingModule } from './users-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material';
import { SharedModule } from 'src/app/shared';
import { CreateUpdateComponent } from './create-update/create-update.component';
import { DetailComponent } from './detail/detail.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    CreateUpdateComponent,
    DetailComponent,
    ResetPasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class UsersModule {}
