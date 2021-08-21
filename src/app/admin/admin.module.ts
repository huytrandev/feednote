import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AdminComponent } from './admin.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [RouterModule.forChild(routes), MaterialModule, CommonModule],
})
export class AdminModule {}
