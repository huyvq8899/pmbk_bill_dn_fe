import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { ChonBaoCaoModalComponent } from './modals/chon-bao-cao-modal/chon-bao-cao-modal.component';
import { BaoCaoRoutingModule } from './bao-cao.routing.module';
import { TabThongKeSoLuongHoaDonDaPhatHanhComponent } from './tabs/tab-thong-ke-so-luong-hoa-don-da-phat-hanh/tab-thong-ke-so-luong-hoa-don-da-phat-hanh.component';
import { BaoCaoComponent } from './bao-cao.component';
import { ChonBaoCaoChiTietHoaDonModalComponent } from './modals/chon-bao-cao-chi-tiet-hoa-don-modal/chon-bao-cao-chi-tiet-hoa-don-modal.component';
import { TabBangKeChiTietHoaDonDaSuDungComponent } from './tabs/tab-bang-ke-chi-tiet-hoa-don-da-su-dung/tab-bang-ke-chi-tiet-hoa-don-da-su-dung.component';
import { TabTongHopGiaTriHoaDonDaSuDungComponent } from './tabs/tab-tong-hop-gia-tri-hoa-don-da-su-dung/tab-tong-hop-gia-tri-hoa-don-da-su-dung.component';
import { ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent } from './modals/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal.component';
import { ThietLapTruongDuLieuModalComponent } from './modals/thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-modal.component';
import { BaoCaoTinhHinhSuDungHoaDonContentComponent } from './modals/bao-cao-tinh-hinh-su-dung-hoa-don-content/bao-cao-tinh-hinh-su-dung-hoa-don-content.component';
import { ChonKyTinhThueModalComponent } from './modals/chon-ky-tinh-thue-modal/chon-ky-tinh-thue-modal.component';
import { TabBaoCaoTinhHinhSuDungHoaDonComponent } from './tabs/tab-bao-cao-tinh-hinh-su-dung-hoa-don/bao-cao-tinh-hinh-su-dung-hoa-don.component';
import { ModalPreviewMutiplePdfComponent} from './modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';

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
  ChonBaoCaoModalComponent,
  ChonBaoCaoChiTietHoaDonModalComponent,
  ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent,
  ThietLapTruongDuLieuModalComponent,
  BaoCaoTinhHinhSuDungHoaDonContentComponent,
  ChonKyTinhThueModalComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BaoCaoRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    CurrencyMaskModule,
  ],
  declarations: [
    ...APP_MODALS,
    BaoCaoComponent,
    TabThongKeSoLuongHoaDonDaPhatHanhComponent,
    TabBangKeChiTietHoaDonDaSuDungComponent,
    TabTongHopGiaTriHoaDonDaSuDungComponent,
    TabBaoCaoTinhHinhSuDungHoaDonComponent
  ],
  entryComponents: [
    ...APP_MODALS,
    TabThongKeSoLuongHoaDonDaPhatHanhComponent,
    TabBangKeChiTietHoaDonDaSuDungComponent
  ],
  exports: [
  ],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
  ]
})
export class BaoCaoModule { }
