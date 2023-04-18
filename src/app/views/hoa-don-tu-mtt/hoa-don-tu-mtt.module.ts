import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoaDonDienTuModule } from '../hoa-don-dien-tu/hoa-don-dien-tu.module';
import { HoaDonTuMayTinhTienRoutingModule } from './hoa-don-tu-mtt-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HoaDonTuMayTinhTienRoutingModule,
    HoaDonDienTuModule
  ],
  declarations: []
})
export class HoaDonTuMayTinhTienModule { }
