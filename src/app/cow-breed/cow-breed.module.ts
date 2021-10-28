import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { CowBreedRoutingModule } from './cow-breed-routing.module';
import { SharedModule } from '../shared';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material/material.module';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';
import { PeriodDetailComponent } from './period-detail/period-detail.component';
import { CreateUpdatePeriodDialogComponent } from './create-update-period-dialog/create-update-period-dialog.component';
import { DownloadStandardServingDialogComponent } from './download-standard-serving-dialog/download-standard-serving-dialog.component';
import { CreateStandardMealDialogComponent } from './create-standard-meal-dialog/create-standard-meal-dialog.component';
import { UpdateNutritionDialogComponent } from './update-nutrition-dialog/update-nutrition-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    CreateUpdateComponent,
    UpdateNutritionDialogComponent,
    PeriodDetailComponent,
    CreateUpdatePeriodDialogComponent,
    DownloadStandardServingDialogComponent,
    CreateStandardMealDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CowBreedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
  ],
})
export class CowBreedModule {}
