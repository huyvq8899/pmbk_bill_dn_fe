import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { ChiTietHanhDongModalComponent } from 'src/app/views/tien-ich/modals/chi-tiet-hanh-dong-modal/chi-tiet-hanh-dong-modal.component';

@Component({
  selector: 'app-xem-nhat-ky-mau-hoa-don-modal',
  templateUrl: './xem-nhat-ky-mau-hoa-don-modal.component.html',
  styleUrls: ['./xem-nhat-ky-mau-hoa-don-modal.component.scss']
})
export class XemNhatKyMauHoaDonModalComponent implements OnInit {
  @Input() data: any;
  list = [];
  spinning = false;
  widthConfig = ['100px', '100px', '150px', '450px', '120px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  total = 0;

  constructor(
    private modalRef: NzModalRef,
    private mauHoaDonService: MauHoaDonService,
    private modalService: NzModalService,
    ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    console.log(this.data);
    this.spinning = true;
    this.mauHoaDonService.GetListNhatKyHoaDon(this.data.mauHoaDonId)
      .subscribe((res: any[]) => {
        this.list = res;
      this.total =  res.length;
      this.spinning = false;
      });
  }

  closeModal() {
    this.modalRef.destroy();
  }
  xemThem(data: any) {
    this.modalService.create({
      nzTitle: 'Chi tiết hành động',
      nzContent: ChiTietHanhDongModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data
      },
      nzFooter: null
    });
  }
}
