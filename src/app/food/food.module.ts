import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FoodRoutingModule } from './food-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MainComponent, DialogFormComponent],
  imports: [CommonModule, FoodRoutingModule, SharedModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class FoodModule {}
