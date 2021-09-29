import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from './interceptors';
import {
  AreaService,
  AuthService,
  CommonService,
  CowBreedService,
  FoodService,
  UserService,
} from './services';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    AreaService,
    AuthService,
    CowBreedService,
    CommonService,
    FoodService,
    UserService,
  ],
  declarations: [],
})
export class CoreModule {}
