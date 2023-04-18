import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { GlobalConstants } from 'src/app/shared/global';

@Component({
  selector: 'app-quan-ly',
  templateUrl: './quan-ly.component.html',
  styleUrls: ['./quan-ly.component.scss']
})
export class QuanLyComponent implements OnInit {
  subscription: Subscription;
  globalConstants = GlobalConstants;
  selectedTab = 0;
  oldSelectTab = 0;
  permission: boolean = false;
  thaoTacs: any[] = [];
  chucNangs = [
    { function: 'MauHoaDon', link: '/quan-ly/mau-hoa-don' },
    { function: 'ThongDiepGui', link: '/quan-ly/thong-diep-gui' },
    { function: 'ThongDiepNhan', link: '/quan-ly/thong-diep-nhan' },
    { function: 'BoKyHieuHoaDon', link: '/quan-ly/bo-ky-hieu-hoa-don' },
    { function: 'ThongTinHoaDon', link: '/quan-ly/thong-tin-hoa-don' },
  ]
  chucNangDuocSuDungs = [];
  soLuongHoaDonCanRaSoat = -1;
  constructor(
    private router: Router,
    private quyDinhKyThuatService: QuyDinhKyThuatService
  ) {
  }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.chucNangDuocSuDungs = pq.functions.map(x=>x.functionName)
    }
    const _url = this.router.url;
    console.log(_url);
      if (_url.includes('/quan-ly/thong-tin-hoa-don')) {
        this.selectedTab = 0;
      }
      if (_url.includes('/quan-ly/mau-hoa-don')) {
        this.selectedTab = 1;
      }
      if (_url.includes('/quan-ly/thong-diep-gui')) {
        this.selectedTab = 2;
      }
      if (_url.includes('/quan-ly/thong-diep-nhan')) {
        this.selectedTab = 3;
      }
      if (_url.includes('/quan-ly/bo-ky-hieu-hoa-don')) {
        this.selectedTab = 4;
      }
  }
  clickTab(link: string) {
    this.router.navigate([link]);
  }

  /*   changeTab(event: any){
      
      
      if(this.oldSelectTab === 0 && event.index !== 0){
        this.subscription = this.sharedService.changeEmitted$.subscribe(
           (rs: any) => {
             
             if (rs != null && rs.type === 'Saved') {
               if(rs.value.saveClicked == false && rs.value.changed == true){
                     const modal = this.modalService.create({
                      nzTitle: "<b>Lưu ý</b>",
                      nzIconType: 'info',
                      nzContent: "Bạn đã thay đổi chức năng được sử dụng của nhóm vai trò kế toánn.<br>" +
                       "Bạn có thể chọn <b>Đồng ý</b> để thoát, <b>Quay lại</b> để thao tác chỉnh sửa.",
                       nzFooter: [
                         {
                           label: 'Quay lại',
                           type: 'primary',
                           onClick: ()=>{
                             modal.destroy();
                             this.selectedTab = this.oldSelectTab;
                             return;
                           }
                         },
                         {
                           label: "Đồng ý",
                           type: 'success',
                           onClick: ()=>{
                             modal.destroy();
                             this.selectedTab = event.index;
                             this.oldSelectTab = this.selectedTab;
                           }
                         }
                       ]
                     })
                }
             }
        });
      }
      else {
        this.selectedTab = event.index;
        this.oldSelectTab = this.selectedTab;
      }
    }  */
}
