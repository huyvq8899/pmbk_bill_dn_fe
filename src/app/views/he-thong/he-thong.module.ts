import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { HeThongRoutingModule } from './he-thong-routing.module';
import { TabHeThongComponent } from './tab-he-thong/tab-he-thong.component';
import { QuanLyNhomTaiKhoanComponent } from "./quan-ly-nhom-tai-khoan/quan-ly-nhom-tai-khoan.component";
import { AddEditRoleModalComponent } from './modals/add-edit-role-modal/add-edit-role-modal.component';
import { AccountModule } from 'src/app/user/account/account.module';
import { QuanLyTaiKhoanComponent } from './quan-ly-tai-khoan/quan-ly-tai-khoan.component';
import { ChonChucNangModalComponent } from './modals/chon-chuc-nang-modal/chon-chuc-nang-modal.component';
import { TabTuyChonComponent } from './tab-tuy-chon/tab-tuy-chon.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { NhapKhauChungTuComponent } from './nhap-khau-chung-tu/nhap-khau-chung-tu.component';
import { ImportKhachHangComponent } from './nhap-khau-chung-tu/DanhMuc/import-khach-hang/import-khach-hang.component';
import { ImportNhanVienComponent } from './nhap-khau-chung-tu/DanhMuc/import-nhan-vien/import-nhan-vien.component';
import { ImportVatTuHangHoaComponent } from './nhap-khau-chung-tu/DanhMuc/import-vat-tu-hang-hoa/import-vat-tu-hang-hoa.component';
import { ResultImportDanhMucComponent } from './nhap-khau-chung-tu/result-import-danh-muc/result-import-danh-muc.component';
import { ChonTepNguonComponent } from './nhap-khau-chung-tu/chon-tep-nguon/chon-tep-nguon.component';
import { HoSoHoaDonDienTuComponent } from '../danh-muc/quan-ly-hoa-don-dien-tu/ho-so-hoa-don-dien-tu/ho-so-hoa-don-dien-tu.component';
import { ImportHoaDonComponent } from './nhap-khau-chung-tu/HoaDon/import-hoa-don/import-hoa-don.component';
import { ResultImportHoaDonComponent } from './nhap-khau-chung-tu/result-import-hoa-don/result-import-hoa-don.component';
import { TagStatusSuDungComponent } from 'src/app/shared/components/tag-status-su-dung/tag-status-su-dung.component';
import { TabLichSuPhienBanComponent } from './tab-lich-su-phien-ban/tab-lich-su-phien-ban.component';
import { ImportPhieuXuatKhoComponent } from './nhap-khau-chung-tu/HoaDon/import-phieu-xuat-kho/import-phieu-xuat-kho.component';
import { GetInfoEsigncloudComponent } from './modals/get-info-esigncloud/get-info-esigncloud.component';
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: '.'
};

const APP_MODALS = [
  AddEditRoleModalComponent,
  ChonChucNangModalComponent,
  GetInfoEsigncloudComponent
];

@NgModule({
  imports: [
    CommonModule,
    HeThongRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,
    FormsModule,
    CurrencyMaskModule,
    AccountModule,
  ],
  declarations: [
    ...APP_MODALS,
    TabHeThongComponent,
    ChonTepNguonComponent,
    NhapKhauChungTuComponent,
    ImportKhachHangComponent,
    ImportNhanVienComponent,
    ImportVatTuHangHoaComponent,
    ImportHoaDonComponent,
    ImportPhieuXuatKhoComponent,
    ResultImportDanhMucComponent,
    ResultImportHoaDonComponent,
    QuanLyNhomTaiKhoanComponent,
    QuanLyTaiKhoanComponent,
    HoSoHoaDonDienTuComponent,
    TabTuyChonComponent,
    TabLichSuPhienBanComponent,

  ],
  entryComponents: [
    ...APP_MODALS
  ],
  exports: [
  ],
  providers: [
    ChonTepNguonComponent,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
  ]
})
export class HeThongModule { }
