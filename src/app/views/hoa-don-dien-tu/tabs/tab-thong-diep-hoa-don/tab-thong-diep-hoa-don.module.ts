import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { KetQuaThongDiepGuiDuLieuHDDTComponent } from '../../modals/ket-qua-thong-diep-gui-du-lieu-hddt/ket-qua-thong-diep-gui-du-lieu-hddt.component';
import { TabGuiDuLieuHoaDonDeCapMaComponent } from './tab-gui-du-lieu-hoa-don-de-cap-ma/tab-gui-du-lieu-hoa-don-de-cap-ma.component';
import { TabGuiDuLieuHoaDonKhongMaComponent } from './tab-gui-du-lieu-hoa-don-khong-ma/tab-gui-du-lieu-hoa-don-khong-ma.component';
import { TabThongDiepHoaDonRoutingModule } from './tab-thong-diep-hoa-don-routing.module';
import { TabThongDiepHoaDonComponent } from './tab-thong-diep-hoa-don.component';

const APP_COMPONENTS = [
  TabThongDiepHoaDonComponent,
  TabGuiDuLieuHoaDonKhongMaComponent,
  TabGuiDuLieuHoaDonDeCapMaComponent
];

const APP_MODALS = [
  KetQuaThongDiepGuiDuLieuHDDTComponent,
];

@NgModule({
  imports: [
    TabThongDiepHoaDonRoutingModule,
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
export class TabThongDiepHoaDonModule { }
