import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FlexModule,
  ],
})
export class ProfileModule {}
