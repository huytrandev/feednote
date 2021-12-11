import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard, RoleGuard } from './core/guards';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'not-found',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['admin', 'manager'],
    },
    children: [
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'foods',
        loadChildren: () =>
          import('./food/food.module').then((m) => m.FoodModule),
      },
      {
        path: 'standard-meals',
        loadChildren: () =>
          import('./standard-meal/standard-meal.module').then(
            (m) => m.StandardMealModule
          ),
      },
      {
        path: 'cow-breeds',
        loadChildren: () =>
          import('./cow-breed/cow-breed.module').then((m) => m.CowBreedModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
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
