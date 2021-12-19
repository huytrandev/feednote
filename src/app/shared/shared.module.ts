import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component';
import { DialogComponent } from './dialog/dialog.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PageLoadingComponent } from './page-loading/page-loading.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';
import { ButtonComponent } from './button/button.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MaterialModule } from '../material';
import { BackButtonComponent } from './back-button/back-button.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
  declarations: [
    LoadingComponent,
    DialogComponent,
    ProgressBarComponent,
    PageLoadingComponent,
    ButtonIconComponent,
    ButtonComponent,
    MenuItemComponent,
    BackButtonComponent,
    IconComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LoadingComponent,
    DialogComponent,
    ProgressBarComponent,
    PageLoadingComponent,
    ButtonIconComponent,
    ButtonComponent,
    MenuItemComponent,
    BackButtonComponent,
    IconComponent,
  ],
})
export class SharedModule {}
