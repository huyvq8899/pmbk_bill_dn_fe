import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhieuXuatKhoRoutingModule } from './phieu-xuat-kho-routing.module';
import { HoaDonDienTuModule } from '../hoa-don-dien-tu/hoa-don-dien-tu.module';

@NgModule({
  imports: [
    CommonModule,
    PhieuXuatKhoRoutingModule,
    HoaDonDienTuModule
  ],
  declarations: []
})
export class PhieuXuatKhoModule { }
