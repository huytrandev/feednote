import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards';

const routes: Routes = [
  {
    path: 'thong-ke',
    loadChildren: () =>
      import('./statistic/statistic.module').then((m) => m.StatisticModule),
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
    path: 'nguoi-dung',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['admin'],
    },
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'khu-vuc',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['admin'],
    },
    loadChildren: () =>
      import('./areas/areas.module').then((m) => m.AreasModule),
  },
  {
    path: '',
    redirectTo: 'nhat-ky-cho-an',
    pathMatch: 'prefix',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
