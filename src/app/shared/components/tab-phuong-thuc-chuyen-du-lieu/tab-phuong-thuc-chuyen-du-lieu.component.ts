import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-phuong-thuc-chuyen-du-lieu',
  templateUrl: './tab-phuong-thuc-chuyen-du-lieu.component.html',
  styleUrls: ['./tab-phuong-thuc-chuyen-du-lieu.component.scss']
})
export class TabPhuongThucChuyenDuLieuComponent implements OnInit {
  @Input() phuongThucChuyenDuLieu: any;
  tenPhuongThucChuyenDuLieu: any;
  isPhieuXuatKho = false;

  constructor(private router: Router) { }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }

    this.tenPhuongThucChuyenDuLieu = this.phuongThucChuyenDuLieu === 1 ? 'Bảng tổng hợp' : 'Từng ' + (this.isPhieuXuatKho ? 'PXK' : 'hóa đơn');
  }
}
