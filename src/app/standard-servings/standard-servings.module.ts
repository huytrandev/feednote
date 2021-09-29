import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { StandardServingsRoutingModule } from './standard-servings-routing.module';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    StandardServingsRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class StandardServingsModule { }
