import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/share-service';
import { GlobalConstants } from 'src/app/shared/global';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';

@Component({
  selector: 'app-hoa-don-dien-tu',
  templateUrl: './hoa-don-dien-tu.component.html',
  styleUrls: ['./hoa-don-dien-tu.component.scss']
})
export class HoaDonDienTuComponent implements OnInit {
  subscription: Subscription;
  globalConstants = GlobalConstants;
  selectedTab = 0;
  oldSelectTab = 0;
  permission: boolean = false;
  thaoTacs: any[] = [];

  soLuongHoaDonSaiSotChuaLap04 = -1;
  isKhongCoMa = false;
  isChuyenBangTongHop = localStorage.getItem('isChuyenBangTongHop') == 'true';
  isPhieuXuatKho = false;
  isPos = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService
  ) {
    // this.GetBoKyHieuTheoToKhaiMoiNhat();
  }

  ngOnInit() {
    //this.GetBoKyHieuTheoToKhaiMoiNhat();
    //this.thongKeSoLuongHoaDonSaiSotChuaLapThongBao();
    //đăng ký vào GlobalConstants hàm tải lại thống kê số lượng hóa đơn sai sót để dùng cho các tab hóa đơn
    this.isKhongCoMa = localStorage.getItem('isKhongCoMa') == 'true';
    console.log(this.isKhongCoMa);
    GlobalConstants.CallBack = () => { this.thongKeSoLuongHoaDonSaiSotChuaLapThongBao() };
    const _url = this.router.url;
    this.hoaDonDienTuService.UpdateIsTBaoHuyKhongDuocChapNhan().subscribe();
    // this.hoaDonDienTuService.UpdateLanGui04().subscribe();

    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }
    if(_url.includes('hoa-don-tu-mtt')){
      this.isPos = true;
    }

    if (_url.includes('/hoa-don-dien-tu/quan-li-hoa-don-dien-tu') || _url.includes('/phieu-xuat-kho/quan-li-phieu-xuat-kho') || _url.includes('/hoa-don-tu-mtt/quan-li-hoa-don-tu-mtt')) {
      this.selectedTab = 0;
    }
    if (_url.includes('/hoa-don-dien-tu/hoa-don-xoa-bo') || _url.includes('/phieu-xuat-kho/pxk-xoa-bo') || _url.includes('/hoa-don-tu-mtt/hoa-don-tu-mtt-xoa-bo')) {
      this.selectedTab = 1;
    }
    if (_url.includes('/hoa-don-dien-tu/hoa-don-thay-the') || _url.includes('/phieu-xuat-kho/pxk-thay-the') || _url.includes('/hoa-don-tu-mtt/hoa-don-tu-mtt-thay-the')) {
      this.selectedTab = 2;
    }
    if (_url.includes('/hoa-don-dien-tu/hoa-don-dieu-chinh') || _url.includes('/phieu-xuat-kho/pxk-dieu-chinh') || _url.includes('/hoa-don-tu-mtt/hoa-don-tu-mtt-dieu-chinh')) {
      this.selectedTab = 3;
    }
    if (this.isKhongCoMa && (_url.includes('/hoa-don-dien-tu/bang-tong-hop-du-lieu-hoa-don') || _url.includes('/phieu-xuat-kho/bang-tong-hop-du-lieu-pxk'))) {
      this.selectedTab = 4;
    }
  }

  // get thông tin bộ ký hiệu theo tờ khai mới nhất
  GetBoKyHieuTheoToKhaiMoiNhat() {

    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        if (res) {
          this.isChuyenBangTongHop = res.isChuyenBangTongHop;
        }
      });
  }

  //hàm này thống kê số lượng hóa đơn có sai sót chưa lập thông báo
  thongKeSoLuongHoaDonSaiSotChuaLapThongBao() {
    this.soLuongHoaDonSaiSotChuaLap04 = -1;
    let loaiNghiepVu=1;// hóa đơn điện tử
    if(this.isPhieuXuatKho) loaiNghiepVu=2;// Phiếu xuất kho
    if(this.isPos) loaiNghiepVu=3;//máy tính tiền
    this.hoaDonDienTuService.ThongKeSoLuongHoaDonSaiSotChuaLapThongBao(1, loaiNghiepVu).subscribe(async (res: any) => {
      this.soLuongHoaDonSaiSotChuaLap04 = res.soLuong;
    });
  }

  //hàm này sẽ thông báo tự động lọc hóa đơn có sai sót chưa lập thông báo
  locHoaDonCoSaiSotChuaLapThongBao() {
    localStorage.setItem('TuDongLocHoaDonCoSaiSot', 'true');
    let uri = "hoa-don-dien-tu/quan-li-hoa-don-dien-tu";
    if(this.isPhieuXuatKho) uri='phieu-xuat-kho/quan-li-phieu-xuat-kho';// Phiếu xuất kho
    if(this.isPos) uri='hoa-don-tu-mtt/quan-li-hoa-don-tu-mtt';//máy tính tiền
    window.location.href = uri;
  }

  clickTab(link: string) {
    this.router.navigate([link]);
  }

  beforeActivateTab(index: number, event: Event) {
    event.preventDefault();


    if (this.selectedTab == 0 && index != 0) {
      this.subscription = this.sharedService.changeEmitted$.subscribe(
        (rs: any) => {

          if (rs != null && rs.type === 'Saved') {
            if (rs.value.saveClicked == false && rs.value.changed == true) {
              const modal = this.modalService.create({
                nzTitle: "<b>Lưu ý</b>",
                nzIconType: 'info',
                nzContent: "Bạn đã thay đổi chức năng được sử dụng của nhóm vai trò kế toán.<br>" +
                  "Bạn có thể chọn <b>Đồng ý</b> để thoát, <b>Quay lại</b> để thao tác chỉnh sửa.",
                nzFooter: [
                  {
                    label: 'Quay lại',
                    type: 'primary',
                    onClick: () => {
                      modal.destroy();
                      return;
                    }
                  },
                  {
                    label: "Đồng ý",
                    type: 'success',
                    onClick: () => {
                      modal.destroy();
                      this.selectedTab = index;
                    }
                  }
                ]
              })
            }
          }
        });
    }
    else {
      this.selectedTab = index;
    }
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
