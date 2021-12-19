import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { MainComponent } from './main/main.component';
import { PeriodDetailComponent } from './period-detail/period-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: ':id',
    component: DetailComponent,
  },
  {
    path: ':idCowBreed/period/:id',
    component: PeriodDetailComponent,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CowBreedRoutingModule {}
