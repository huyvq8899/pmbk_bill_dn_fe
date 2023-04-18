import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-canh-bao-xac-thuc-su-dung',
  templateUrl: './canh-bao-xac-thuc-su-dung.component.html',
  styleUrls: ['./canh-bao-xac-thuc-su-dung.component.scss']
})
export class CanhBaoXacThucSuDungComponent implements OnInit {
  @Input() message: any;
  @Input() boKyHieuHoaDonId: any;
  @Input() dataSelected: any;

  constructor(
    private modal: NzModalRef
  ) { }

  ngOnInit() {
  }

  xemNhatKyXacThuc() {
    this.modal.destroy(true);
  }

  closeModal() {
    this.modal.destroy();
  }
}
