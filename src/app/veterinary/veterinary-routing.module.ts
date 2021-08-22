import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: 'statistic',
    component: StatisticComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VeterinaryRoutingModule {}
