import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FoodRoutingModule } from './food-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, FoodRoutingModule, SharedModule, MaterialModule],
})
export class FoodModule {}
