import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CowBreedRoutingModule } from './cow-breed-routing.module';
import { SharedModule } from '../shared';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material/material.module';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';
import { NutritionDialogComponent } from './nutrition-dialog/nutrition-dialog.component';

@NgModule({
  declarations: [MainComponent, DetailComponent, CreateUpdateComponent, NutritionDialogComponent],
  imports: [
    CommonModule,
    CowBreedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule
  ],
})
export class CowBreedModule {}
