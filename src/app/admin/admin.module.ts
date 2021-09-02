import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { StatisticComponent } from './statistic/statistic.component';
import { AdminRoutingModule } from './admin-routing.module';
import { BreedersComponent } from './breeders/breeders.component';

const routes: Routes = [];

@NgModule({
  declarations: [StatisticComponent, BreedersComponent],
  imports: [
    RouterModule.forChild(routes),
    AdminRoutingModule,
    MaterialModule,
    CommonModule,
  ],
})
export class AdminModule {}
