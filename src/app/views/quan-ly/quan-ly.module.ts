import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { QuanLyRoutingModule } from './quan-ly-routing.module';
import { TabThongDiepGuiComponent } from './tab-thong-diep-gui/tab-thong-diep-gui.component';
import { QuanLyComponent } from './quan-ly.component';
import { TabThongDiepNhanComponent } from './tab-thong-diep-nhan/tab-thong-diep-nhan.component';
import { TabBoKyHieuHoaDonComponent } from './tab-bo-ky-hieu-hoa-don/tab-bo-ky-hieu-hoa-don.component';
import { AddEditBoKyHieuHoaDonComponent } from './modals/add-edit-bo-ky-hieu-hoa-don/add-edit-bo-ky-hieu-hoa-don.component';
import { XacNhanSuDungModalComponent } from './modals/xac-nhan-su-dung-modal/xac-nhan-su-dung-modal.component';
import { CanhBaoXacThucSuDungComponent } from './modals/canh-bao-xac-thuc-su-dung/canh-bao-xac-thuc-su-dung.component';
import { QuanLyHoaDonDienTuModule } from '../danh-muc/quan-ly-hoa-don-dien-tu/quan-ly-hoa-don-dien-tu.module';
import { TagStatusKyDienTuComponent } from 'src/app/shared/components/tag-status-ky-dien-tu/tag-status-ky-dien-tu.component';
import { ViewXmlContentModalComponent } from './modals/view-xml-content-modal/view-xml-content-modal.component';
import { ChonCTSTuThongTinNguoiNopThueModalComponent } from './modals/chon-cts-tu-thong-tin-nguoi-nop-thue-modal/chon-cts-tu-thong-tin-nguoi-nop-thue-modal.component';
import { AddEditDangKyUyNhiemModalComponent } from './modals/add-edit-dang-ky-uy-nhiem-modal/add-edit-dang-ky-uy-nhiem-modal.component';
import { ChiTietThongDiepModalComponent } from './modals/chi-tiet-thong-diep-modal/chi-tiet-thong-diep-modal.component';
import { TabThongTinHoaDonComponent } from './tab-thong-tin-hoa-don/tab-thong-tin-hoa-don.component';
import { TagStatusThongTinHoaDonComponent } from 'src/app/shared/components/tag-status-thong-tin-hoa-don/tag-status-thong-tin-hoa-don.component';
import { OptionDangKyUyNhiemLapHoaDonModalComponent } from './modals/option-dang-ky-uy-nhiem-lap-hoa-don-modal/option-dang-ky-uy-nhiem-lap-hoa-don-modal.component';
import { XacNhanToKhaiMau01ModalComponent } from './modals/xac-nhan-to-khai-01-modal/xac-nhan-to-khai-mau-01-modal.component';
import { DoiChieuThongTin103Component } from './tab-thong-tin-hoa-don/modals/doi-chieu-thong-tin103/doi-chieu-thong-tin103.component';
import { XacNhanChuoiMaCqtComponent } from './tab-thong-tin-hoa-don/modals/xac-nhan-chuoi-ma-cqt/xac-nhan-chuoi-ma-cqt.component';
import { LichSuSinhSoHoaDonCmtmttComponent } from './tab-thong-tin-hoa-don/modals/lich-su-sinh-so-hoa-don-cmtmtt/lich-su-sinh-so-hoa-don-cmtmtt.component';
import { CapNhatSoKetThucComponent } from './tab-thong-tin-hoa-don/modals/cap-nhat-so-ket-thuc/cap-nhat-so-ket-thuc.component';
import { PopupVideoModalComponent } from '../dashboard/popup-video-modal/popup-video-modal.component';
import { DashboardModule } from '../dashboard/dashboard.module';

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
  AddEditBoKyHieuHoaDonComponent,
  XacNhanSuDungModalComponent,
  CanhBaoXacThucSuDungComponent,
  ViewXmlContentModalComponent,
  ChonCTSTuThongTinNguoiNopThueModalComponent,
  AddEditDangKyUyNhiemModalComponent,
  ChiTietThongDiepModalComponent,
  OptionDangKyUyNhiemLapHoaDonModalComponent,
  XacNhanToKhaiMau01ModalComponent,
  DoiChieuThongTin103Component,
  XacNhanChuoiMaCqtComponent,
  LichSuSinhSoHoaDonCmtmttComponent,
  CapNhatSoKetThucComponent,

];

@NgModule({
  imports: [
    CommonModule,
    QuanLyRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    CurrencyMaskModule,
    QuanLyHoaDonDienTuModule,
    DashboardModule
  ],
  declarations: [
    ...APP_MODALS,
    QuanLyComponent,
    TabThongTinHoaDonComponent,
    TabThongDiepGuiComponent,
    TabThongDiepNhanComponent,
    TabBoKyHieuHoaDonComponent,
    TagStatusKyDienTuComponent,
    TagStatusThongTinHoaDonComponent,
  ],
  entryComponents: [
    ...APP_MODALS,
  ],
  exports: [
    TabThongDiepGuiComponent,
    ...APP_MODALS
  ],
  providers: [
    TabThongDiepGuiComponent,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
  ]
})
export class QuanLyModule { }
