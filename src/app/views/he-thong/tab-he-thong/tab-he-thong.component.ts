import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/share-service';
import { GlobalConstants } from 'src/app/shared/global';

@Component({
  selector: 'app-tab-he-thong',
  templateUrl: './tab-he-thong.component.html',
  styleUrls: ['./tab-he-thong.component.scss']
})
export class TabHeThongComponent implements OnInit {
  subscription: Subscription;
  globalConstants = GlobalConstants;
  selectedTab = 0;
  oldSelectTab = 0;
  permission: boolean = false;
  chucNangDuocSuDungs = [];
  currentUser: any;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private modalService: NzModalService
  ) { 
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const _url = this.router.url;
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.chucNangDuocSuDungs = pq.functions.map(x=>x.functionName);
    }

    if(this.permission == true){
      if (_url.includes('/he-thong/thong-tin-nguoi-nop-thue')) {
        this.selectedTab = 0;
      }
      if (_url.includes('/he-thong/quan-ly-vai-tro')) {
        this.selectedTab = 1;
      }
      if (_url.includes('/he-thong/quan-ly-nguoi-dung')) {
        this.selectedTab = 2;
      }
      if (_url.includes('/he-thong/nhap-khau-chung-tu')) {
        this.selectedTab = 3;
      }
      if (_url.includes('/he-thong/tuy-chon')) {
        this.selectedTab = 4;
      } 
      if (_url.includes('/he-thong/lich-su-phien-ban')) {
        this.selectedTab = 5;
      }
    }
    else{
      if(this.chucNangDuocSuDungs.indexOf('ThongTinNguoiNopThue') >= 0){
        if (_url.includes('/he-thong/thong-tin-nguoi-nop-thue')) {
          this.selectedTab = 0;
        }

        if (_url.includes('/he-thong/nhap-khau-chung-tu')) {
          this.selectedTab = 1;
        }

        if(this.chucNangDuocSuDungs.indexOf('TuyChonChung') >= 0
        || this.chucNangDuocSuDungs.indexOf('DinhDangSo') >= 0 
        || this.chucNangDuocSuDungs.indexOf('ThongTinTaiNguyen') >= 0 
        || this.chucNangDuocSuDungs.indexOf('ThietLapCongCuKy') >= 0
        || this.chucNangDuocSuDungs.indexOf('MayChuGuiEmail') >= 0
        || this.chucNangDuocSuDungs.indexOf('EmailGuiHoaDon') >= 0
        || this.chucNangDuocSuDungs.indexOf('EmailGuiPhieuXuatKho') >= 0
        || this.chucNangDuocSuDungs.indexOf('ThietLapSMSGuiHoaDon') >= 0
        || this.chucNangDuocSuDungs.indexOf('ThietLapXacNhanCTS') >= 0 
        || this.chucNangDuocSuDungs.indexOf('PheDuyetHoaDon') >= 0){
          if (_url.includes('/he-thong/tuy-chon')) {
            this.selectedTab = 2;
          } 

          if(_url.includes('/he-thong/lich-su-phien-ban')){
            this.selectedTab = 3;
          }
        }
        else{
          if(_url.includes('/he-thong/lich-su-phien-ban')){
            this.selectedTab = 2;
          }
        }
      }
      else{
        if (_url.includes('/he-thong/nhap-khau-chung-tu')) {
          this.selectedTab = 0;
        }

        if(this.chucNangDuocSuDungs.indexOf('TuyChonChung') >= 0
        || this.chucNangDuocSuDungs.indexOf('DinhDangSo') >= 0 
        || this.chucNangDuocSuDungs.indexOf('ThongTinTaiNguyen') >= 0 
        || this.chucNangDuocSuDungs.indexOf('ThietLapCongCuKy') >= 0
        || this.chucNangDuocSuDungs.indexOf('MayChuGuiEmail') >= 0
        || this.chucNangDuocSuDungs.indexOf('EmailGuiHoaDon') >= 0
        || this.chucNangDuocSuDungs.indexOf('EmailGuiPhieuXuatKho') >= 0
        || this.chucNangDuocSuDungs.indexOf('ThietLapSMSGuiHoaDon') >= 0
        || this.chucNangDuocSuDungs.indexOf('ThietLapXacNhanCTS') >= 0 
        || this.chucNangDuocSuDungs.indexOf('PheDuyetHoaDon') >= 0){
          if (_url.includes('/he-thong/tuy-chon')) {
            this.selectedTab = 1;
          } 
          if(_url.includes('/he-thong/lich-su-phien-ban')){
            this.selectedTab = 2;
          }
        }
        else{
          if(_url.includes('/he-thong/lich-su-phien-ban')){
            this.selectedTab = 1;
          }
        }
      }
    }
    console.log(this.selectedTab);
  }
 
  clickTab(link: string) {
    this.router.navigate([link]);
  }

}
