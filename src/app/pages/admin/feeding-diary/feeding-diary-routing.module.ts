import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedingDiaryComponent } from './feeding-diary.component';


const routes: Routes = [
  {
    path: '',
    component: FeedingDiaryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedingDiaryRoutingModule {}