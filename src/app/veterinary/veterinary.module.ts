import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic/statistic.component';
import { VeterinaryComponent } from './veterinary.component';

import { MaterialModule } from '../material/material.module';
import { VeterinaryRoutingModule } from './veterinary-routing.module';

@NgModule({
  declarations: [StatisticComponent, VeterinaryComponent],
  imports: [CommonModule, MaterialModule, VeterinaryRoutingModule],
})
export class VeterinaryModule {}
