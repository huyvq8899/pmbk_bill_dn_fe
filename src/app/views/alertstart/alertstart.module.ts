import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { ThongBaoStartModalComponent } from './thong-bao-start-modal/thong-bao-start-modal.component';


@NgModule({
  declarations: [ThongBaoStartModalComponent],
  imports: [
    CommonModule,NzButtonModule,NzModalModule,NzIconModule,FormsModule,SharedModule
  ],exports: [
    ThongBaoStartModalComponent
  ],entryComponents: [
    ThongBaoStartModalComponent
  ],
})
export class AlertstartModule { }
