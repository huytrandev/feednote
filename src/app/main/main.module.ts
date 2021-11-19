import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MaterialModule } from '../material';
import { SharedModule } from '../shared';
import { getVietnamesePaginatorIntl } from '../core/helpers';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    ScrollingModule,
    SharedModule,
    FlexLayoutModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getVietnamesePaginatorIntl() },
  ],
})
export class MainModule {}
