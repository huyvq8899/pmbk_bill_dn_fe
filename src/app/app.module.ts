import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US, vi_VN, NzConfig, NzModalRef } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, DatePipe } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { LayoutComponent } from './layout/layout.component';
import { Page404Component } from './page404/page404.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from './shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EnvServiceProvider } from './env.service.provider';
import { CookieService } from 'ngx-cookie-service';
import { ThongTinComponent } from './user/thongTin/thongTin.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NhomTaiKhoanAddEditModalComponent } from './user/account/modals/nhom-tai-khoan-add-edit-modal/nhom-tai-khoan-add-edit-modal.component';
import { RoleAddEditModalComponent } from './user/account/modals/role-add-edit-modal/role-add-edit-modal.component';
import { HoaDonDienTuModule } from './views/hoa-don-dien-tu/hoa-don-dien-tu.module';
import { BaoCaoModule } from './views/bao-cao/bao-cao.module';
import { WebSocketService } from './services/websocket.service';
import { ModalPreviewMutiplePdfComponent } from './views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { TraCuuHoaDonComponent } from './views/hoa-don-dien-tu/tabs/tra-cuu-hoa-don/tra-cuu-hoa-don.component';
import { TraCuuHoaDonModalComponent } from './views/hoa-don-dien-tu/modals/tra-cuu-hoa-don-modal/tra-cuu-hoa-don-modal.component';
import { KHKyBienBanXoaBoHoaDonComponent } from './views/hoa-don-dien-tu/tabs/kh-ky-bien-ban-xoa-bo-hoa-don/kh-ky-bien-ban-xoa-bo-hoa-don.component';
import { ClientKyBienBanDieuChinhComponent } from './views/hoa-don-dien-tu/tabs/client-ky-bien-ban-dieu-chinh/client-ky-bien-ban-dieu-chinh.component';
import { MessageBoxModalComponent } from './shared/modals/message-box-modal/message-box-modal.component';
import { AlertstartModule } from './views/alertstart/alertstart.module';
import { ThongBaoHoaDonSaiSotModalComponent } from './views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { ChonThongBaoCanRaSoatModalComponent } from './views/quan-ly/modals/chon-thong-bao-can-ra-soat-modal/chon-thong-bao-can-ra-soat-modal.component';
import { ChonHoaDonSaiSotModalComponent } from './views/quan-ly/modals/chon-hoa-don-sai-sot-modal/chon-hoa-don-sai-sot-modal.component';
import { XemMauHoaDonRaSoatModalComponent } from './views/quan-ly/modals/chon-thong-bao-can-ra-soat-modal/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { TagStatusSuDungComponent } from './shared/components/tag-status-su-dung/tag-status-su-dung.component';
import { BangKeHoaDonSaiSotModalComponent } from './views/quan-ly/modals/bang-ke-hoa-don-sai-sot/bang-ke-hoa-don-sai-sot-modal.component';
import { ChonThamSoBangKeSaiSotModalComponent } from './views/quan-ly/modals/bang-ke-hoa-don-sai-sot/chon-tham-so/chon-tham-so-bang-ke-sai-sot-modal.component';
import { TagStatusGuiXmlComponent } from './shared/components/tag-status-gui-xml/tag-status-gui-xml.component';
import { MoTaLoiModalComponent } from './views/quan-ly/modals/mo-ta-loi-modal/mo-ta-loi-modal.component';
import { QuanLyModule } from './views/quan-ly/quan-ly.module';
import { TabHoaDonXoaBoComponent } from './views/hoa-don-dien-tu/tabs/tab-hoa-don-xoa-bo/tab-hoa-don-xoa-bo.component';
import { TabHoaDonDienTuComponent } from './views/hoa-don-dien-tu/tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { TabThongDiepGuiComponent } from './views/quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { ChiTietHanhDongModalComponent } from './views/tien-ich/modals/chi-tiet-hanh-dong-modal/chi-tiet-hanh-dong-modal.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HuongDanSuDungModalComponent } from './views/dashboard/huong-dan-su-dung-modal/huong-dan-su-dung-modal.component';
import { AddThongDiepGuiModalComponent } from './views/quan-ly/modals/add-thong-diep-gui-modal/add-thong-diep-gui-modal.component';
import { AddEditToKhaiDangKyThayDoiThongTinModalComponent } from './views/quan-ly/modals/add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal/add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal.component';
import { TabNhatKyGuiEmailComponent } from './views/tien-ich/tab-nhat-ky-gui-email/tab-nhat-ky-gui-email.component';
import { KetQuaSoSanhThongTinNguoinopThueComponent } from './views/hoa-don-dien-tu/modals/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal.component';
import { KetQuaCheckMauHoaDonModalComponent } from './views/hoa-don-dien-tu/modals/ket-qua-check-mau-hoa-don-modal/ket-qua-check-mau-hoa-don-modal.component';

registerLocaleData(vi);
export function tokenGetter() {
  return localStorage.getItem('token');
}

export const whitelistedDomains = [
  new RegExp('localhost:?[0-9]*'),
  new RegExp('([a-zA-Z0-9-_]+\.)dvbk+\.vn$'),
  new RegExp('([a-zA-Z0-9-_]+\.)pmbk+\.vn$')
] as RegExp[];
export const blacklistedRoutes = [
  new RegExp('localhost:?[0-9]*\/api\/auth'),
  new RegExp('([a-zA-Z0-9-_]+\.)dvbk+\.vn\/api\/auth$'),
  new RegExp('([a-zA-Z0-9-_]+\.)pmbk+\.vn\/api\/auth$')
] as RegExp[];

export function jwtOptionsFactory() {
  return {
    tokenGetter,
    skipWhenExpired: true,
    whitelistedDomains,
    blacklistedRoutes
  };
}

@NgModule({
  declarations: [
    AppComponent,
    TraCuuHoaDonComponent,
    TraCuuHoaDonModalComponent,
    KHKyBienBanXoaBoHoaDonComponent,
    ClientKyBienBanDieuChinhComponent,
    LayoutComponent,
    Page404Component,
    ThongTinComponent,
    NhomTaiKhoanAddEditModalComponent,
    RoleAddEditModalComponent,
    ModalPreviewMutiplePdfComponent,
    MessageBoxModalComponent,
    ThongBaoHoaDonSaiSotModalComponent,
    ChonHoaDonSaiSotModalComponent,
    ChonThongBaoCanRaSoatModalComponent,
    XemMauHoaDonRaSoatModalComponent,
    BangKeHoaDonSaiSotModalComponent,
    ChonThamSoBangKeSaiSotModalComponent,
    MoTaLoiModalComponent,
    ChiTietHanhDongModalComponent,
    AddThongDiepGuiModalComponent,
    AddEditToKhaiDangKyThayDoiThongTinModalComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    DragDropModule,
    NzIconModule,
    SharedModule,
    NzTableModule,
    // CKEditorModule,
    BaoCaoModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    AlertstartModule,

  ],
  providers: [
    WebSocketService,
    //{ provide: NZ_I18N, useValue: vi_VN },
    // { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_I18N, useValue: vi_VN },
    DatePipe,
    EnvServiceProvider,
    CookieService,
    Title,
    TabHoaDonDienTuComponent,
    TabHoaDonXoaBoComponent,
    TabThongDiepGuiComponent,
    TabNhatKyGuiEmailComponent,
    DashboardComponent,
    HuongDanSuDungModalComponent
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    ThongTinComponent,
    NhomTaiKhoanAddEditModalComponent,
    RoleAddEditModalComponent,
    ModalPreviewMutiplePdfComponent,
    TraCuuHoaDonModalComponent,
    MessageBoxModalComponent,
    ThongBaoHoaDonSaiSotModalComponent,
    ChonHoaDonSaiSotModalComponent,
    ChonThongBaoCanRaSoatModalComponent,
    XemMauHoaDonRaSoatModalComponent,
    BangKeHoaDonSaiSotModalComponent,
    ChonThamSoBangKeSaiSotModalComponent,
    MoTaLoiModalComponent,
    ChiTietHanhDongModalComponent,
    AddThongDiepGuiModalComponent,
    AddEditToKhaiDangKyThayDoiThongTinModalComponent,
  ],
})
export class AppModule { }
