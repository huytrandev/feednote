import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedingDiaryRoutingModule } from './feeding-diary-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from 'src/app/material';
import { SharedModule } from 'src/app/shared';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    FeedingDiaryRoutingModule,
    MaterialModule,
    SharedModule,
  ]
})
export class FeedingDiaryModule { }
