import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { ChonHoaDonSaiSotDeLapThayTheModalComponent } from '../chon-hoa-don-sai-sot-de-lap-thay-the-modal/chon-hoa-don-sai-sot-de-lap-thay-the-modal.component';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
@Component({
  selector: 'app-chon-cach-lap-hoa-don-moi-modal',
  templateUrl: './chon-cach-lap-hoa-don-moi-modal.component.html',
  styleUrls: ['./chon-cach-lap-hoa-don-moi-modal.component.scss']
})
export class ChonCachLapHoaDonMoiModalComponent implements OnInit {
  @Input() loaiHoaDon: number = 1;
  @Input() callBack: any = null;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
  ) {
  }
  ngOnInit() {
  }

  lapHoaDonCoThayThe(coThayThe: boolean) {
    if (coThayThe) {
      this.modalService.create({
        nzTitle: 'Chọn hóa đơn có sai sót chưa gửi người mua và đã thông báo với CQT về việc hủy hóa đơn',
        nzContent: ChonHoaDonSaiSotDeLapThayTheModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: window.innerWidth / 100 * 90,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          loaiHoaDon: this.loaiHoaDon,
          callBack: this.callBack
        },
        nzFooter: null
      });
    }
    else {
      const modal1 = this.modalService.create({
        nzTitle: getTenHoaDonByLoai(this.loaiHoaDon),
        nzContent: HoaDonDienTuModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: window.innerWidth / 100 * 90,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          isAddNew: true,
          loaiHD: this.loaiHoaDon,
          fbEnableEdit: true
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if (this.callBack != null) {
          this.callBack();
        }
      });
    }
    this.modal.destroy();
  }

  destroyModal() {
    this.modal.destroy();
  }
}
