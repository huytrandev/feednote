import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MaterialModule } from '../material';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, MaterialModule],
})
export class MainModule {}
