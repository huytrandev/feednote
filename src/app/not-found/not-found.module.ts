import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, MaterialModule, SharedModule],
})
export class NotFoundModule {}
