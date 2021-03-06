import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MainComponent } from './main/main.component';
import { StandardMealRoutingModule } from './standard-meal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared';
import { MaterialModule } from '../../material';
import { DownloadComponent } from './download/download.component';
import { CreateMealComponent } from './create-meal/create-meal.component';

@NgModule({
  declarations: [MainComponent, DownloadComponent, CreateMealComponent],
  imports: [
    CommonModule,
    StandardMealRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class StandardMealModule {}
