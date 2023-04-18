import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { RelativepipePipe } from './services/relativepipe.pipe';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FormatPricePipe } from './pipes/format-price.pipe';
import { SumPipe } from './pipes/sum.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { TooltipInputDirective } from './directives/tooltip-input.directive';
import { PadPipe } from './pipes/pad.pipe';
import { TooltipInput2Directive } from './directives/tooltip-input2.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FilterColumnComponent } from './shared/components/filter-column/filter-column.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SwitchMultiCasePipe } from './pipes/switch-multi-case.pipe';
import { VatRatePipe } from './pipes/vat-rate.pipe';
import { TagStatusSuDungComponent } from './shared/components/tag-status-su-dung/tag-status-su-dung.component';
import { TabStatusQuyTrinhComponent } from './shared/components/tab-status-quy-trinh/tab-status-quy-trinh.component';
import { TagStatusGuiXmlComponent } from './shared/components/tag-status-gui-xml/tag-status-gui-xml.component';
import { LichSuTruyenNhanDisplayXmldataComponent } from './views/hoa-don-dien-tu/modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { LichSuTruyenNhanComponent } from './views/hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { ChuKyDienTuComponent } from './shared/components/chu-ky-dien-tu/chu-ky-dien-tu.component';
import { TagTrangThaiGuiHoaDonComponent } from './shared/components/tag-trang-thai-gui-hoa-don/tag-trang-thai-gui-hoa-don.component';
import { AccountChangepassComponent } from './user/account/modals/account-changepass/account-changepass.component';
import { TabPhuongThucChuyenDuLieuComponent } from './shared/components/tab-phuong-thuc-chuyen-du-lieu/tab-phuong-thuc-chuyen-du-lieu.component';
import { BkCurrencyMaskDirective } from './directives/bk-currency-mask.directive';
import { InputAutoSizeDirective } from './directives/input-auto-size.directive';
import { GuiTBaoSaiSotKhongPhaiLapHDonModalComponent } from './views/hoa-don-dien-tu/modals/gui-tbao-sai-sot-khong-phai-lap-hdon-modal/gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component';
import { XoaBoHoaDonModalComponent } from './views/hoa-don-dien-tu/modals/xoa-bo-hoa-don-modal/xoa-bo-hoa-don-modal.component';
import { MoTaLoiComponent } from './shared/components/mo-ta-loi/mo-ta-loi.component';
import { MaxLengthValidatorDirective } from './directives/max-length-validator.directive';
import { GreaterThanValidatorDirective } from './directives/greater-than-validator.directive';
import { TooltipActionErrorDirective } from './directives/tooltip-action-error.directive';
import { RequiredValidatorDirective } from './directives/required-validator.directive';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { SwitchSelectDirective } from './directives/switch-select.directive';
import { SnowflakeComponent } from './shared/components/snowflake/snowflake.component';
import { KetQuaCheckMauHoaDonModalComponent } from './views/hoa-don-dien-tu/modals/ket-qua-check-mau-hoa-don-modal/ket-qua-check-mau-hoa-don-modal.component';
import { KetQuaSoSanhThongTinNguoinopThueComponent } from './views/hoa-don-dien-tu/modals/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal.component';
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  decimal: ',',
  precision: 0,
  prefix: '',
  suffix: '',
  thousands: '.'
};

@NgModule({
  declarations: [
    SafePipe,
    SafeHtmlPipe,
    NotificationsComponent,
    FilterColumnComponent,
    ChuKyDienTuComponent,
    TagStatusSuDungComponent,
    TabPhuongThucChuyenDuLieuComponent,
    TabStatusQuyTrinhComponent,
    AccountChangepassComponent,
    TagStatusGuiXmlComponent,
    TagTrangThaiGuiHoaDonComponent,
    LichSuTruyenNhanDisplayXmldataComponent,
    LichSuTruyenNhanComponent,
    RelativepipePipe,
    FormatPricePipe,
    TooltipInputDirective,
    TooltipInput2Directive,
    BkCurrencyMaskDirective,
    InputAutoSizeDirective,
    SumPipe,
    PadPipe,
    CapitalizePipe,
    SwitchMultiCasePipe,
    VatRatePipe,
    GuiTBaoSaiSotKhongPhaiLapHDonModalComponent,
    XoaBoHoaDonModalComponent,
    MoTaLoiComponent,
    MaxLengthValidatorDirective,
    RequiredValidatorDirective,
    EmailValidatorDirective,
    GreaterThanValidatorDirective,
    TooltipActionErrorDirective,
    SwitchSelectDirective,
    SnowflakeComponent,
    KetQuaSoSanhThongTinNguoinopThueComponent,
    KetQuaCheckMauHoaDonModalComponent
  ],
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule, CurrencyMaskModule],
  entryComponents: [
    LichSuTruyenNhanDisplayXmldataComponent,
    LichSuTruyenNhanComponent,
    AccountChangepassComponent,
    GuiTBaoSaiSotKhongPhaiLapHDonModalComponent,
    XoaBoHoaDonModalComponent,
    KetQuaSoSanhThongTinNguoinopThueComponent,
    KetQuaCheckMauHoaDonModalComponent
  ],
  exports: [CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    SafePipe,
    SafeHtmlPipe,
    NotificationsComponent,
    FilterColumnComponent,
    ChuKyDienTuComponent,
    TagStatusSuDungComponent,
    TabPhuongThucChuyenDuLieuComponent,
    TabStatusQuyTrinhComponent,
    TagStatusGuiXmlComponent,
    TagTrangThaiGuiHoaDonComponent,
    LichSuTruyenNhanDisplayXmldataComponent,
    LichSuTruyenNhanComponent,
    RelativepipePipe,
    CurrencyMaskModule,
    FormatPricePipe,
    TooltipInputDirective,
    TooltipInput2Directive,
    BkCurrencyMaskDirective,
    InputAutoSizeDirective,
    SumPipe,
    PadPipe,
    CapitalizePipe,
    SwitchMultiCasePipe,
    VatRatePipe,
    MoTaLoiComponent,
    MaxLengthValidatorDirective,
    RequiredValidatorDirective,
    EmailValidatorDirective,
    GreaterThanValidatorDirective,
    TooltipActionErrorDirective,
    SwitchSelectDirective,
    SnowflakeComponent
  ],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
  ]
})
export class SharedModule { }
