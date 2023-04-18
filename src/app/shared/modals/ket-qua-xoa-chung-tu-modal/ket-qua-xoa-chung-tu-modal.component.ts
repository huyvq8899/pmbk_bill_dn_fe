import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-ket-qua-xoa-chung-tu-modal',
  templateUrl: './ket-qua-xoa-chung-tu-modal.component.html',
  styleUrls: ['./ket-qua-xoa-chung-tu-modal.component.scss']
})
export class KetQuaXoaChungTuModalComponent implements OnInit {
  @Input() isHopDong: any;
  @Input() model: any;
  list: any[] = [];
  selectedItem: any;

  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.list = this.model.list;
  }

  destroyModal() {
    this.modal.destroy(false);
  }
}
