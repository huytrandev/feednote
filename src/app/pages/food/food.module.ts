import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MainComponent } from './main/main.component';
import { FoodRoutingModule } from './food-routing.module';
import { SharedModule } from '../../shared';
import { MaterialModule } from '../../material';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';

@NgModule({
  declarations: [MainComponent, DetailComponent, CreateUpdateComponent],
  imports: [
    CommonModule,
    FoodRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class FoodModule {}
