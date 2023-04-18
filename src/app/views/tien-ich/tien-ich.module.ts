import { NgModule } from '@angular/core';
import { TienIchRoutingModule } from './tien-ich-routing.module';
import { SharedModule } from 'src/app/shared.module';
import { TabNhatKyTruyCapComponent } from './tab-nhat-ky-truy-cap/tab-nhat-ky-truy-cap.component';
import { TabNhatKyGuiEmailComponent } from './tab-nhat-ky-gui-email/tab-nhat-ky-gui-email.component';
import { TienIchComponent } from './tien-ich.component';

const APP_COMPONENTS = [
  TienIchComponent,
  TabNhatKyTruyCapComponent,
  TabNhatKyGuiEmailComponent
];

const APP_MODALS = [
];

@NgModule({
  imports: [
    SharedModule,
    TienIchRoutingModule
  ],
  declarations: [
    ...APP_COMPONENTS,
    ...APP_MODALS
  ],
  entryComponents: [
    ...APP_MODALS
  ]
})
export class TienIchModule { }
