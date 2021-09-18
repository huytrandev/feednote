import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingComponent } from './loading/loading.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';


@NgModule({
  declarations: [LoadingComponent, DialogComponent, ScrollToTopComponent, ProgressBarComponent],
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  exports: [LoadingComponent, DialogComponent, ScrollToTopComponent, ProgressBarComponent]
})
export class SharedModule {}