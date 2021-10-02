import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared';
import { DetailComponent } from './detail/detail.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';



@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    DialogEditComponent
  ],
  imports: [
    CommonModule,
    NutritionRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class NutritionModule { }
