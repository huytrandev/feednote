import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { CowBreedRoutingModule } from './cow-breed-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DetailComponent } from './detail/detail.component';
import { CreateUpdateComponent } from './create-update/create-update.component';

@NgModule({
  declarations: [MainComponent, DetailComponent, CreateUpdateComponent],
  imports: [
    CommonModule,
    CowBreedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule
  ],
})
export class CowBreedModule {}
