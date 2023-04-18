import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { VersionDetailRoutingModule } from './version-detail-routing.module';
import { VersionDetailComponent } from './version-detail.component';

@NgModule({
  imports: [
    CommonModule,
    VersionDetailRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [VersionDetailComponent]
})
export class VersionDetailModule { }
