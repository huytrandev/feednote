import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, FlexLayoutModule],
})
export class LoginModule {}
