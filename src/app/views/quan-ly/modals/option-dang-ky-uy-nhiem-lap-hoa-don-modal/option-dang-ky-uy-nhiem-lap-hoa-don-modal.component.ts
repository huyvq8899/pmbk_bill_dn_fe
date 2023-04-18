import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { CookieConstant } from 'src/app/constants/constant';

@Component({
  selector: 'app-option-dang-ky-uy-nhiem-lap-hoa-don-modal',
  templateUrl: './option-dang-ky-uy-nhiem-lap-hoa-don-modal.component.html',
  styleUrls: ['./option-dang-ky-uy-nhiem-lap-hoa-don-modal.component.scss']
})
export class OptionDangKyUyNhiemLapHoaDonModalComponent implements OnInit {
  spinning = false;
  isUyNhiemLapHoaDon = false;

  constructor(
    private modal: NzModalRef
  ) { }

  ngOnInit() {
  }

  continue() {
    this.modal.destroy(this.isUyNhiemLapHoaDon);
  }

  destroyModal() {
    this.modal.destroy(null);
  }
}
