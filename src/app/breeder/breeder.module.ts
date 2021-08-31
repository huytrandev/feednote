import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { BreederRoutingModule } from './breeder-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    BreederRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
  ],
})
export class BreederModule {}
