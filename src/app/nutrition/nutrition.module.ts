import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class NutritionModule { }
