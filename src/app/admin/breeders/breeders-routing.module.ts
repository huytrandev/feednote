import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUpdateComponent } from './create-update/create-update.component';
import { DetailComponent } from './detail/detail.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'd/:id',
    component: DetailComponent,
  },
  {
    path: 'u/:id',
    component: CreateUpdateComponent,
  },
  {
    path: 'c',
    component: CreateUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedersRoutingModule {}
