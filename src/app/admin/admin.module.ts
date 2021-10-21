import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, MaterialModule, SharedModule],
})
export class AdminModule {}
