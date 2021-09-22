import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FoodRoutingModule } from './food-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';

@NgModule({
  declarations: [MainComponent, DialogFormComponent, DetailComponent, CreateUpdateComponent],
  imports: [CommonModule, FoodRoutingModule, SharedModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class FoodModule {}
