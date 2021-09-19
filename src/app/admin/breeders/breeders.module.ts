import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { BreedersRoutingModule } from './breeders-routing.module';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [
    MainComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    BreedersRoutingModule
  ]
})
export class BreedersModule { }
