import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material';
import { SharedModule } from 'src/app/shared';
import { CreateUpdateComponent } from './create-update/create-update.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    MainComponent,
    CreateUpdateComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
