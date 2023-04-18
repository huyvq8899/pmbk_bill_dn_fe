import { NgModule } from '@angular/core';
import { QuanLyHoaDonDienTuRoutingModule } from './quan-ly-hoa-don-dien-tu-routing.module';
import { SharedModule } from 'src/app/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { HoSoHoaDonDienTuComponent } from './ho-so-hoa-don-dien-tu/ho-so-hoa-don-dien-tu.component';
import { AddEditMauHoaDonModalComponent } from './modals/add-edit-mau-hoa-don-modal/add-edit-mau-hoa-don-modal.component';
import { TabThietLapHinhNenComponent } from './modals/add-edit-mau-hoa-don-modal/tab-thiet-lap-hinh-nen/tab-thiet-lap-hinh-nen.component';
import { TabTuyChinhChiTietComponent } from './modals/add-edit-mau-hoa-don-modal/tab-tuy-chinh-chi-tiet/tab-tuy-chinh-chi-tiet.component';
import { TabChonMauHoaDonComponent } from './modals/add-edit-mau-hoa-don-modal/tab-chon-mau-hoa-don/tab-chon-mau-hoa-don.component';
import { TabThietLapChungComponent } from './modals/add-edit-mau-hoa-don-modal/tab-thiet-lap-chung/tab-thiet-lap-chung.component';
import { MauHoaDonPreviewComponent } from './modals/add-edit-mau-hoa-don-modal/mau-hoa-don-preview/mau-hoa-don-preview.component';
import { MauHoaDonHtmlRawComponent } from './modals/add-edit-mau-hoa-don-modal/mau-hoa-don-html-raw/mau-hoa-don-html-raw.component';
import { XemMauHoaDonModalComponent } from './modals/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { ExportMauHoaDonModalComponent } from './modals/add-edit-mau-hoa-don-modal/export-mau-hoa-don-modal/export-mau-hoa-don-modal.component';
import { XemNhatKyMauHoaDonModalComponent } from './modals/xem-nhat-ky-mau-hoa-don-modal/xem-nhat-ky-mau-hoa-don-modal.component';
import { ConfigBackgroundComponent } from './modals/add-edit-mau-hoa-don-modal/mau-hoa-don-html-raw/config-background/config-background.component';
import { ConfigBorderComponent } from './modals/add-edit-mau-hoa-don-modal/mau-hoa-don-html-raw/config-border/config-border.component';
import { ImageDragDirective } from 'src/app/directives/image-drag.directive';
import { ExportDanhMucModalComponent } from './modals/export-danh-muc-modal/export-danh-muc-modal.component';
import { ThietLapChuChimModalComponent } from './modals/add-edit-mau-hoa-don-modal/tab-thiet-lap-hinh-nen/thiet-lap-chu-chim-modal/thiet-lap-chu-chim-modal.component';
import { SettingTruongMoRongComponent } from './modals/add-edit-mau-hoa-don-modal/tab-tuy-chinh-chi-tiet/setting-truong-mo-rong/setting-truong-mo-rong.component';
import { MauHoaDonComponent } from './mau-hoa-don/mau-hoa-don.component';
import { ChiTietHanhDongModalComponent } from '../../tien-ich/modals/chi-tiet-hanh-dong-modal/chi-tiet-hanh-dong-modal.component';
import { MauVePreviewComponent } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-preview/mau-ve-preview.component';
import { MauVeTabThietLapChungComponent } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-tab-thiet-lap-chung/mau-ve-tab-thiet-lap-chung.component';
import { MauVeTabThietLapHinhNenComponent } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-tab-thiet-lap-hinh-nen/mau-ve-tab-thiet-lap-hinh-nen.component';
import { MauVeTabTuyChinhChiTietComponent } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-tab-tuy-chinh-chi-tiet/mau-ve-tab-tuy-chinh-chi-tiet.component';
import { MauVeDuLichComponent } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-iframe/mau-ve-du-lich/mau-ve-du-lich.component';
import { ConfigBorderA5Component } from './modals/add-edit-mau-hoa-don-modal/mau-ve-dien-tu-modal/mau-ve-iframe/modals/config-borderA5/config-borderA5.component';

const APP_COMPONENTS = [
  MauHoaDonComponent,
  // HoSoHoaDonDienTuComponent,
  TabChonMauHoaDonComponent,
  TabThietLapChungComponent,
  TabThietLapHinhNenComponent,
  TabTuyChinhChiTietComponent,
  SettingTruongMoRongComponent,
  MauHoaDonPreviewComponent,
  MauVePreviewComponent,
  MauVeTabThietLapChungComponent,
  MauVeTabThietLapHinhNenComponent,
  MauVeTabTuyChinhChiTietComponent,
  
];

const APP_MODALS = [
  AddEditMauHoaDonModalComponent,
  ExportDanhMucModalComponent,
  MauHoaDonHtmlRawComponent,
  ConfigBackgroundComponent,
  ConfigBorderComponent,
  ExportMauHoaDonModalComponent,
  XemMauHoaDonModalComponent,
  XemNhatKyMauHoaDonModalComponent,
  ThietLapChuChimModalComponent,
  MauVeDuLichComponent,
  ConfigBorderA5Component
];

@NgModule({
  imports: [
    QuanLyHoaDonDienTuRoutingModule,
    SharedModule,
    DragDropModule
  ],
  declarations: [
    ...APP_COMPONENTS,
    ...APP_MODALS,
    ImageDragDirective
  ],
  entryComponents: [
    ...APP_MODALS
  ],
  exports: [
    ...APP_COMPONENTS,
    ...APP_MODALS,
  ]
})
export class QuanLyHoaDonDienTuModule { }
