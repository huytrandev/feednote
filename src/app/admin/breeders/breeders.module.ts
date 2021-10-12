import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared';
import { BreedersRoutingModule } from './breeders-routing.module';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';

@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    CreateUpdateComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    BreedersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
})
export class BreedersModule {}
