import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared';
import { MaterialModule } from '../material';
import { BreederComponent } from './breeder.component';
import { BreederRoutingModule } from './breeder-routing.module';

@NgModule({
  declarations: [BreederComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    BreederRoutingModule,
  ],
})
export class BreederModule {}
