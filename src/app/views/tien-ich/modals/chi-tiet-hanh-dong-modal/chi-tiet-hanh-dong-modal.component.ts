import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-chi-tiet-hanh-dong-modal',
  templateUrl: './chi-tiet-hanh-dong-modal.component.html',
  styleUrls: ['./chi-tiet-hanh-dong-modal.component.scss']
})
export class ChiTietHanhDongModalComponent implements OnInit {
  @Input() data: any;

  constructor(
    private modalRef: NzModalRef
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalRef.destroy();
  }
}
