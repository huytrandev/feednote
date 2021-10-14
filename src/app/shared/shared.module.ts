import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingComponent } from './loading/loading.component';
import { DialogComponent } from './dialog/dialog.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PageLoadingComponent } from './page-loading/page-loading.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';
import { ButtonComponent } from './button/button.component';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MaterialModule } from '../material';
import { BackButtonComponent } from './back-button/back-button.component';

@NgModule({
  declarations: [
    LoadingComponent,
    DialogComponent,
    ScrollToTopComponent,
    ProgressBarComponent,
    PageLoadingComponent,
    ButtonIconComponent,
    ButtonComponent,
    MenuComponent,
    MenuItemComponent,
    BackButtonComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LoadingComponent,
    DialogComponent,
    ScrollToTopComponent,
    ProgressBarComponent,
    PageLoadingComponent,
    ButtonIconComponent,
    ButtonComponent,
    MenuComponent,
    MenuItemComponent,
    BackButtonComponent
  ],
})
export class SharedModule {}
