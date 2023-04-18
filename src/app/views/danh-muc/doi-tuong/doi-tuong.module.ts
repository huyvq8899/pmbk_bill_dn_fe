import { NgModule } from '@angular/core';
import { DoiTuongRoutingModule } from './doi-tuong-routing.module';
import { TabDoiTuongComponent } from './tab-doi-tuong/tab-doi-tuong.component';
import { KhachHangComponent } from './khach-hang/khach-hang.component';
import { NhanVienComponent } from './nhan-vien/nhan-vien.component';
import { SharedModule } from 'src/app/shared.module';
import { AddEditKhachHangModalComponent } from './modals/add-edit-khach-hang-modal/add-edit-khach-hang-modal.component';
import { AddEditNhanVienModalComponent } from './modals/add-edit-nhan-vien-modal/add-edit-nhan-vien-modal.component';
import { HangHoaDichVuComponent } from '../hang-hoa-dich-vu/hang-hoa-dich-vu/hang-hoa-dich-vu.component';
import { DonViTinhComponent } from '../hang-hoa-dich-vu/don-vi-tinh/don-vi-tinh.component';
import { AddEditHangHoaDichVuModalComponent } from '../hang-hoa-dich-vu/modals/add-edit-hang-hoa-dich-vu-modal/add-edit-hang-hoa-dich-vu-modal.component';
import { AddEditDonViTinhModalComponent } from '../hang-hoa-dich-vu/modals/add-edit-don-vi-tinh-modal/add-edit-don-vi-tinh-modal.component';
import { LoaiTienComponent } from '../loai-tien/loai-tien/loai-tien.component';
import { AddEditLoaiTienModalComponent } from '../loai-tien/modals/add-edit-loai-tien-modal/add-edit-loai-tien-modal.component';
import { SapXepLoaiTienComponent } from '../loai-tien/modals/sap-xep-loai-tien/sap-xep-loai-tien.component';

const APP_COMPONENTS = [
  TabDoiTuongComponent,
  KhachHangComponent,
  NhanVienComponent,
  HangHoaDichVuComponent,
  DonViTinhComponent,
  LoaiTienComponent
];

const APP_MODALS = [
  AddEditKhachHangModalComponent,
  AddEditNhanVienModalComponent,
  AddEditHangHoaDichVuModalComponent,
  AddEditDonViTinhModalComponent,
  AddEditLoaiTienModalComponent,
  SapXepLoaiTienComponent
];

@NgModule({
  imports: [
    DoiTuongRoutingModule,
    SharedModule
  ],
  declarations: [
    ...APP_COMPONENTS,
    ...APP_MODALS
  ],
  entryComponents: [
    ...APP_MODALS
  ]
})
export class DoiTuongModule { }
