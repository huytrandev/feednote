import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { StandardServingsRoutingModule } from './standard-servings-routing.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    StandardServingsRoutingModule
  ]
})
export class StandardServingsModule { }
