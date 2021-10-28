import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreederComponent } from './breeder.component';

const routes: Routes = [
  {
    path: '',
    component: BreederComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreederRoutingModule {}
