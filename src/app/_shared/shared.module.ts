import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingComponent } from './loading/loading.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [LoadingComponent, DialogComponent],
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [LoadingComponent, DialogComponent]
})
export class SharedModule {}