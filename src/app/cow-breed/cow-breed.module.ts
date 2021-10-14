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
import { DialogUpdateNutritionComponent } from './dialog-update-nutrition/dialog-update-nutrition.component';
import { DialogCreateNutritionComponent } from './dialog-create-nutrition/dialog-create-nutrition.component';
import { PeriodDetailComponent } from './period-detail/period-detail.component';

@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    CreateUpdateComponent,
    DialogUpdateNutritionComponent,
    DialogCreateNutritionComponent,
    PeriodDetailComponent,
  ],
  imports: [
    CommonModule,
    CowBreedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
  ],
})
export class CowBreedModule {}
