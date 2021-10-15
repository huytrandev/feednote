import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards';

import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: 'thong-ke',
    component: StatisticComponent,
  },
  {
    path: 'ho-chan-nuoi',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['manager'],
    },
    loadChildren: () =>
      import('./breeders/breeders.module').then((m) => m.BreedersModule),
  },
  {
    path: 'nhat-ky-cho-an',
    loadChildren: () =>
      import('./feeding-diary/feeding-diary.module').then(
        (m) => m.FeedingDiaryModule
      ),
  },
  {
    path: '',
    redirectTo: 'nhat-ky-cho-an',
    pathMatch: 'full',
  },
  {
    path: 'nguoi-dung',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['admin'],
    },
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
