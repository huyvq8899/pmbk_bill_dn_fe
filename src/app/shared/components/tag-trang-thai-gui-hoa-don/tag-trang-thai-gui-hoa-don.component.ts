import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-trang-thai-gui-hoa-don',
  templateUrl: './tag-trang-thai-gui-hoa-don.component.html',
  styleUrls: ['./tag-trang-thai-gui-hoa-don.component.scss']
})
export class TagTrangThaiGuiHoaDonComponent implements OnInit {
  @Input() trangThaiGuiHoaDon: any;
  tenTrangThaiGuiHoaDon: any;

  constructor() { }

  ngOnInit() {
    switch (this.trangThaiGuiHoaDon) {
      case 0:
        this.tenTrangThaiGuiHoaDon = 'Chưa gửi cho khách hàng';
        break;
      case 1:
        this.tenTrangThaiGuiHoaDon = 'Đang gửi cho khách hàng';
        break;
      case 2:
        this.tenTrangThaiGuiHoaDon = 'Gửi cho khách hàng lỗi';
        break;
      case 3:
        this.tenTrangThaiGuiHoaDon = 'Đã gửi cho khách hàng';
        break;
      case 4:
        this.tenTrangThaiGuiHoaDon = 'Khách hàng đã xem';
        break;
      case 5:
        this.tenTrangThaiGuiHoaDon = 'Khách hàng chưa xem';
        break;
      default:
        break;
    }
  }

}
