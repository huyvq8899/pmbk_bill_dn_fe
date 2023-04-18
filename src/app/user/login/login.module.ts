import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared.module';
import { AlertstartModule } from 'src/app/views/alertstart/alertstart.module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    AlertstartModule,
    SharedModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
