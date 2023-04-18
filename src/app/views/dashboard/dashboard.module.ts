import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HuongDanSuDungModalComponent } from './huong-dan-su-dung-modal/huong-dan-su-dung-modal.component';
import { PopupVideoModalComponent } from './popup-video-modal/popup-video-modal.component';
import { TabThongDiepGuiComponent } from '../quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { TabHoaDonDienTuComponent } from '../hoa-don-dien-tu/tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [DashboardComponent,HuongDanSuDungModalComponent,PopupVideoModalComponent],
  providers: [TabThongDiepGuiComponent, TabHoaDonDienTuComponent],
  entryComponents: [PopupVideoModalComponent]
})
export class DashboardModule { }
