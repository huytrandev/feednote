import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards';

const routes: Routes = [
  {
    path: 'statistic',
    loadChildren: () =>
      import('./statistic/statistic.module').then((m) => m.StatisticModule),
  },
  {
    path: 'farmers',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['manager'],
    },
    loadChildren: () =>
      import('./breeders/breeders.module').then((m) => m.BreedersModule),
  },
  {
    path: 'feeding-diaries',
    loadChildren: () =>
      import('./feeding-diary/feeding-diary.module').then(
        (m) => m.FeedingDiaryModule
      ),
  },
  {
    path: 'users',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['admin'],
    },
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'areas',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['admin'],
    },
    loadChildren: () =>
      import('./areas/areas.module').then((m) => m.AreasModule),
  },
  {
    path: '',
    redirectTo: 'feeding-diaries',
    pathMatch: 'prefix',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
