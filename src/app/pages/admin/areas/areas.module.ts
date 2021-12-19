import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AreasRoutingModule } from './areas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';

import { SharedModule } from 'src/app/shared';
import { CreateUpdateDialogComponent } from './create-update-dialog/create-update-dialog.component';

@NgModule({
  declarations: [MainComponent, CreateUpdateDialogComponent],
  imports: [
    CommonModule,
    AreasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
  ],
})
export class AreasModule {}
