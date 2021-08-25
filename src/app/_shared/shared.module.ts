import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [LoadingComponent],
  imports: [
    MatProgressSpinnerModule
  ],
  exports: [LoadingComponent]
})
export class SharedModule {}