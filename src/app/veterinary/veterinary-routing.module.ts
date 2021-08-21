import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticComponent } from './statistic/statistic.component';
import { VeterinaryComponent } from './veterinary.component';

const routes: Routes = [
  {
    path: '',
    component: VeterinaryComponent,
    children: [
      {
        path: 'statistic',
        component: StatisticComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VeterinaryRoutingModule {}
