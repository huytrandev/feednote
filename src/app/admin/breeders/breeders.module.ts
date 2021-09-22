import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { BreedersRoutingModule } from './breeders-routing.module';
import { DetailComponent } from './detail/detail.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    MainComponent,
    DetailComponent,
    CreateComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    BreedersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BreedersModule { }
