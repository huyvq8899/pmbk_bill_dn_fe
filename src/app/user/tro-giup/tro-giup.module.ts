import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { TroGiupRoutingModule } from './tro-giup-routing.module';
import { TroGiupComponent } from './tro-giup.component';

@NgModule({
  imports: [
    CommonModule,
    TroGiupRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TroGiupComponent]
})
export class TroGiupModule { }
