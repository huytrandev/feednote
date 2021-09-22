import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { MainComponent } from './main/main.component';
import { UpdateComponent } from './update/update.component';

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
    component: UpdateComponent,
  },
  {
    path: 'c',
    component: CreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedersRoutingModule {}
