import { ElementRef, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { HoaDonDienTuRoutingModule } from './hoa-don-dien-tu-routing.module';
import { HoaDonDienTuModalComponent } from './modals/hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { TabHoaDonDienTuComponent } from './tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { HoaDonDienTuComponent } from './hoa-don-dien-tu.component';
import { TabHoaDonThayTheComponent } from './tabs/tab-hoa-don-thay-the/tab-hoa-don-thay-the.component';
import { TabHoaDonDieuChinhComponent } from './tabs/tab-hoa-don-dieu-chinh/tab-hoa-don-dieu-chinh.component';
import { LapHoaDonThayTheModalComponent } from './modals/lap-hoa-don-thay-the-modal/lap-hoa-don-thay-the-modal.component';
import { ThayTheHinhThucHoaDonKhacModalComponent } from './modals/thay-the-hinh-thuc-hoa-don-khac-modal/thay-the-hinh-thuc-hoa-don-khac-modal.component';
import { PhatHanhHoaDonModalComponent } from './modals/phat-hanh-hoa-don-modal/phat-hanh-hoa-don-modal.component';
import { XemLichSuModalComponent } from './modals/xem-lich-su-modal/xem-lich-su-modal.component';
import { GuiHoaDonModalComponent } from './modals/gui-hoa-don-modal/gui-hoa-don-modal.component';
import { XuatKhauChiTietHoaDonModalComponent } from './modals/xuat-khau-chi-tiet-hoa-don-modal/xuat-khau-chi-tiet-hoa-don-modal.component';
import { ChuyenThanhHoaDonGiayModalComponent } from './modals/chuyen-thanh-hoa-don-giay-modal/chuyen-thanh-hoa-don-giay-modal.component';
import { LapBienBanXoaBoHoaDonModalComponent } from './modals/lap-bien-ban-xoa-bo-hoa-don/lap-bien-ban-xoa-bo-hoa-don.modal.component';
import { TabHoaDonXoaBoComponent } from './tabs/tab-hoa-don-xoa-bo/tab-hoa-don-xoa-bo.component';
import { LapBienBanHoaDonDieuChinhModalComponent } from './modals/lap-bien-ban-hoa-don-dieu-chinh-modal/lap-bien-ban-hoa-don-dieu-chinh-modal.component';
import { AddEditBienBanDieuChinhModalComponent } from './modals/add-edit-bien-ban-dieu-chinh-modal/add-edit-bien-ban-dieu-chinh-modal.component';
import { ChonHhdvTuHoaDonGocModalComponent } from './modals/chon-hhdv-tu-hoa-don-goc-modal/chon-hhdv-tu-hoa-don-goc-modal.component';
import { GuiBienBanXoaBoModalComponent } from './modals/gui-bien-ban-xoa-bo-modal/gui-bien-ban-xoa-bo-modal.component';
import { AddEditMauHoaDonModalComponent } from '../danh-muc/quan-ly-hoa-don-dien-tu/modals/add-edit-mau-hoa-don-modal/add-edit-mau-hoa-don-modal.component';
import { QuanLyHoaDonDienTuModule } from '../danh-muc/quan-ly-hoa-don-dien-tu/quan-ly-hoa-don-dien-tu.module';
import { DoiTuongModule } from '../danh-muc/doi-tuong/doi-tuong.module';
import { ThietLapTruongDuLieuHoaDonModalComponent } from './modals/thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-hddt-modal.component';
import { ThietLapTruongDuLieuMoRongModalComponent } from './modals/thiet-lap-truong-du-lieu-mo-rong-modal/thiet-lap-truong-du-lieu-mo-rong-modal.component';
import { PhatHanhHoaDonHangLoatModalComponent } from './modals/phat-hanh-hoa-don-hang-loat-modal/phat-hanh-hoa-don-hang-loat-modal.component';
import { GuiHoaDonHangLoatModalComponent } from './modals/gui-hoa-don-hang-loat-modal/gui-hoa-don-hang-loat-modal.component';
import { TaiHoaDonHangLoatModalComponent } from './modals/tai-hoa-don-hang-loat-modal/tai-hoa-don-hang-loat-modal.component';
import { ChuyenDoiHoaDonHangLoatModalComponent } from './modals/chuyen-doi-hoa-don-hang-loat-modal/chuyen-doi-hoa-don-hang-loat-modal.component';
import { XemLoiHoaDonModalComponent } from './modals/xem-loi-hoa-don-modal/xem-loi-hoa-don-modal.component';
import { ThongDiepGuiDuLieuHddtModalComponent } from './modals/thong-diep-gui-du-lieu-hddt-modal/thong-diep-gui-du-lieu-hddt-modal.component';
import { SelectHDDTForThongDiepModalComponent } from './modals/thong-diep-gui-du-lieu-hddt-modal/select-hddt-for-thong-diep-modal/select-hddt-for-thong-diep-modal.component';
import { ListHoaDonXoaBoModalComponent } from './modals/list-hoa-don-xoa-bo-modal/list-hoa-don-xoa-bo-modal.modal.component';
import { TepDinhKemModalComponent } from './modals/tep-dinh-kem-modal/tep-dinh-kem-modal.component';
import { DinhKemHoaDonModalComponent } from './modals/dinh-kem-hoa-don-modal/dinh-kem-hoa-don-modal.component';
import { ListLapBienBanHuyHoaDonComponent } from './modals/list-lap-bien-ban-huy-hoa-don/list-lap-bien-ban-huy-hoa-don.component';
import { GuiHoaDonXoaBoModalComponent } from './modals/gui-hoa-don-xoa-bo-modal/gui-hoa-don-xoa-bo-modal.component';
import { ThayTheHinhThucHoaDonKhacPMGPModalComponent } from './modals/thay-the-hinh-thuc-hoa-don-khac-pmgp-modal/thay-the-hinh-thuc-hoa-don-khac-pmgp-modal.component';
import { ChiTietThongTinChungThuSoNguoiBanModalComponent } from './modals/chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal/chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal.component';
import { NzCarouselModule } from 'ng-zorro-antd';
import { LichSuTruyenNhanComponent } from './modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { TagStatusGuiXmlComponent } from 'src/app/shared/components/tag-status-gui-xml/tag-status-gui-xml.component';
import { ThongBaoHoaDonSaiSotModalComponent } from '../quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { ChonHoaDonSaiSotModalComponent } from '../quan-ly/modals/chon-hoa-don-sai-sot-modal/chon-hoa-don-sai-sot-modal.component';
import { ChonThongBaoCanRaSoatModalComponent } from '../quan-ly/modals/chon-thong-bao-can-ra-soat-modal/chon-thong-bao-can-ra-soat-modal.component';
import { LichSuTruyenNhanDisplayXmldataComponent } from './modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { ChonHoaDonSaiSotDeLapThayTheModalComponent } from './modals/chon-hoa-don-sai-sot-de-lap-thay-the-modal/chon-hoa-don-sai-sot-de-lap-thay-the-modal.component';
import { ChonCachLapHoaDonMoiModalComponent } from './modals/chon-cach-lap-hoa-don-moi-modal/chon-cach-lap-hoa-don-moi-modal.component';
import { AddEditBangTongHopDuLieuModalComponent } from './modals/add-edit-bang-tong-hop-du-lieu-hoa-don-modal/add-edit-bang-tong-hop-du-lieu-hoa-don-modal.component';
import { TabBangTongHopDuLieuHoaDonComponent } from './tabs/tab-bang-tong-hop-du-lieu-hoa-don/tab-bang-tong-hop-du-lieu-hoa-don.component';
import { ChonBangTongHopModalComponent } from './modals/chon-bang-tong-hop/chon-bang-tong-hop-modal.component';
import { TabThongDiepGuiComponent } from '../quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { ChonKyDuLieuModalComponent } from './modals/chon-ky-du-lieu-modal/chon-ky-du-lieu-modal.component';
import { TabStatusQuyTrinhBangTongHopComponent } from 'src/app/shared/components/tab-status-trang-thai-quy-trinh-bang-tong-hop/tab-status-trang-thai-quy-trinh-bang-tong-hop.component';
import { ChonHoaDonBangTongHopModalComponent } from './modals/chon-hoa-don-bang-tong-hop-modal/chon-hoa-don-bang-tong-hop-modal.component';
import { ChonHoaDonBangTongHopNgoaiHeThongModalComponent } from './modals/chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal/chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal.component';

import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { KetQuaCheckMauHoaDonModalComponent } from './modals/ket-qua-check-mau-hoa-don-modal/ket-qua-check-mau-hoa-don-modal.component';
import { XacNhanGuiHoaDonModalComponent } from './modals/xac-nhan-gui-hoa-don-cho-khach-hang-modal/xac-nhan-gui-hoa-don-cho-khach-hang-modal.component';
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
  HoaDonDienTuModalComponent,
  ThietLapTruongDuLieuHoaDonModalComponent,
  ThietLapTruongDuLieuMoRongModalComponent,
  LapHoaDonThayTheModalComponent,
  LapBienBanHoaDonDieuChinhModalComponent,
  AddEditBienBanDieuChinhModalComponent,
  ThayTheHinhThucHoaDonKhacModalComponent,
  AddEditBienBanDieuChinhModalComponent,
  ChonHhdvTuHoaDonGocModalComponent,
  PhatHanhHoaDonModalComponent,
  XemLichSuModalComponent,
  GuiHoaDonModalComponent,
  GuiHoaDonHangLoatModalComponent,
  XuatKhauChiTietHoaDonModalComponent,
  ChuyenThanhHoaDonGiayModalComponent,
  LapBienBanXoaBoHoaDonModalComponent,
  TepDinhKemModalComponent,
  //ChonHoaDonModalComponent,
  GuiBienBanXoaBoModalComponent,
  GuiHoaDonXoaBoModalComponent,
  PhatHanhHoaDonHangLoatModalComponent,
  TaiHoaDonHangLoatModalComponent,
  ChuyenDoiHoaDonHangLoatModalComponent,
  XemLoiHoaDonModalComponent,
  ThongDiepGuiDuLieuHddtModalComponent,
  SelectHDDTForThongDiepModalComponent,
  ListHoaDonXoaBoModalComponent,
  DinhKemHoaDonModalComponent,
  ListLapBienBanHuyHoaDonComponent,
  ThayTheHinhThucHoaDonKhacPMGPModalComponent,
  ChiTietThongTinChungThuSoNguoiBanModalComponent,
  ChonHoaDonSaiSotDeLapThayTheModalComponent,
  ChonCachLapHoaDonMoiModalComponent,
  AddEditBangTongHopDuLieuModalComponent,
  ChonBangTongHopModalComponent,
  ChonKyDuLieuModalComponent,
  TabStatusQuyTrinhBangTongHopComponent,
  ChonHoaDonBangTongHopModalComponent,
  ChonHoaDonBangTongHopNgoaiHeThongModalComponent,
  XacNhanGuiHoaDonModalComponent
];

@NgModule({
  imports: [

    CommonModule,
    HoaDonDienTuRoutingModule,
    ReactiveFormsModule,
    QuanLyHoaDonDienTuModule,
    DoiTuongModule,
    SharedModule,
    FormsModule,
    CurrencyMaskModule,
    NzCarouselModule,
    NzResizableModule
  ],
  declarations: [
    ...APP_MODALS,
    HoaDonDienTuComponent,
    TabHoaDonDienTuComponent,
    TabHoaDonThayTheComponent,
    TabHoaDonDieuChinhComponent,
    TabHoaDonXoaBoComponent,
    TabBangTongHopDuLieuHoaDonComponent,
  ],
  entryComponents: [
    ...APP_MODALS,
  ],
  exports: [
    TabHoaDonDienTuComponent,
    TabHoaDonXoaBoComponent,
    ...APP_MODALS
  ],
  providers: [
    TabHoaDonDienTuComponent,
    TabHoaDonDieuChinhComponent,
    TabHoaDonXoaBoComponent,
    TabThongDiepGuiComponent,
    ...APP_MODALS,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
    { provide: ElementRef }
  ]
})
export class HoaDonDienTuModule { }
