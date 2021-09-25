import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material';
import { SharedModule } from 'src/app/shared';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    MainComponent,
    CreateComponent,
    UpdateComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
