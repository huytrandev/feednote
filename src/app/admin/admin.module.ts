import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

const routes: Routes = [];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), MaterialModule, CommonModule],
})
export class AdminModule {}
