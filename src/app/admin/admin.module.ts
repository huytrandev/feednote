import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { StatisticComponent } from './statistic/statistic.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FeedingDiaryComponent } from './feeding-diary/feeding-diary.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  declarations: [StatisticComponent, FeedingDiaryComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule
  ],
})
export class AdminModule {}
