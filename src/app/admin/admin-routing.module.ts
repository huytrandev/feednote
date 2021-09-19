import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedingDiaryComponent } from './feeding-diary/feeding-diary.component';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: 'statistic',
    component: StatisticComponent,
  },
  {
    path: 'breeders',
    loadChildren: () =>
      import('./breeders/breeders.module').then((m) => m.BreedersModule),
  },
  {
    path: 'feeding-diary',
    component: FeedingDiaryComponent,
  },
  {
    path: '',
    redirectTo: 'feeding-diary',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
