import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NutritionRoutingModule } from './nutrition-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared';
import { DetailComponent } from './detail/detail.component';
import { DialogUpdateNutritionComponent } from './dialog-update-nutrition/dialog-update-nutrition.component';
import { DialogCreateNutritionComponent } from './dialog-create-nutrition/dialog-create-nutrition.component';


@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    DialogUpdateNutritionComponent,
    DialogCreateNutritionComponent
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NutritionModule { }
