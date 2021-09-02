import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { CowBreedRoutingModule } from './cow-breed-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DialogFormComponent } from './dialog-form/dialog-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MainComponent, DialogFormComponent],
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
