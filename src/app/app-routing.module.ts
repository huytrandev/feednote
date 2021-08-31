import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'veterinary',
        loadChildren: () =>
          import('./veterinary/veterinary.module').then(
            (m) => m.VeterinaryModule
          ),
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
      },
      {
        path: 'foods',
        loadChildren: () =>
          import('./food/food.module').then((m) => m.FoodModule),
      },
      {
        path: 'cow-breeds',
        loadChildren: () =>
          import('./cow-breed/cow-breed.module').then((m) => m.CowBreedModule),
      },
      {
        path: 'breeders',
        loadChildren: () =>
          import('./breeder/breeder.module').then((m) => m.BreederModule),
      },
      {
        path: 'not-found',
        component: NotFoundComponent
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
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
