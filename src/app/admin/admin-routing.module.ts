import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreedersComponent } from './breeders/breeders.component';
import { FeedingDiaryComponent } from './feeding-diary/feeding-diary.component';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: 'statistic',
    component: StatisticComponent
  },
  {
    path: 'breeders',
    component: BreedersComponent
  },
  {
    path: 'feeding-diary',
    component: FeedingDiaryComponent
  },
  {
    path: '',
    redirectTo: 'breeders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}