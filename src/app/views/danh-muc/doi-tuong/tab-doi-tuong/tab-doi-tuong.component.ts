import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieConstant } from 'src/app/constants/constant';
import { GlobalConstants } from 'src/app/shared/global';

@Component({
  selector: 'app-tab-doi-tuong',
  templateUrl: './tab-doi-tuong.component.html',
  styleUrls: ['./tab-doi-tuong.component.scss']
})
export class TabDoiTuongComponent implements OnInit {
  globalConstants = GlobalConstants;
  selectedTab = 0;
  permission: boolean = false;
  chucNangDuocSuDungs: any[] = [];
  boolQuanLyNhanVienBanHangTrenHoaDon = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolQuanLyNhanVienBanHangTrenHoaDon').giaTri);
  chucNangs = [
    { function: 'KhachHang', link: '/danh-muc/khach-hang' },
    { function: 'NhanVien', link: '/danh-muc/nhan-vien' },
    { function: 'HangHoaDichVu', link: '/danh-muc/hang-hoa-dich-vu' },
    { function: 'DonViTinh', link: '/danh-muc/don-vi-tinh' },
    { function: 'LoaiTien', link: '/danh-muc/loai-tien' },
  ]

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    if (!this.boolQuanLyNhanVienBanHangTrenHoaDon) {
      this.chucNangs = this.chucNangs.filter(x => x.function !== 'NhanVien');
    }

    const _url = this.router.url;

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.chucNangDuocSuDungs = pq.functions.map(x => x.functionName);
      this.chucNangs = this.chucNangs.filter(x => this.chucNangDuocSuDungs.indexOf(x.function) >= 0);
      console.log(this.chucNangs)
    }

    var selected = this.chucNangs.find(x => x.link == _url);
    this.selectedTab = this.chucNangs.indexOf(selected);
  }

  clickTab(link: string) {
    this.router.navigate([link]);
  }
}
