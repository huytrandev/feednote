import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard, RoleGuard } from './core/guards';

const routes: Routes = [
  {
    path: 'dang-nhap',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '404',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
  },
  {
    path: 'ho-chan-nuoi',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['breeder'],
    },
    loadChildren: () =>
      import('./breeder/breeder.module').then((m) => m.BreederModule),
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    // data: {
    //   expectedRole: ['admin', 'manager'],
    // },
    children: [
      {
        path: '',
        redirectTo: 'qtv',
        pathMatch: 'full',
      },
      {
        path: 'qtv',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'trang-ca-nhan',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'thuc-an',
        loadChildren: () =>
          import('./food/food.module').then((m) => m.FoodModule),
      },
      {
        path: 'giong-bo',
        loadChildren: () =>
          import('./cow-breed/cow-breed.module').then((m) => m.CowBreedModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
