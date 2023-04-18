import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/share-service';
import { Router } from '@angular/router';
import { EnvService } from '../env.service';
import { CookieConstant } from '../constants/constant';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { VersionService } from 'src/app/services/version.service';
import { TuyChonService } from '../services/Config/tuy-chon.service';
import { environment } from 'src/environments/environment';
import { SignalRService } from '../services/signalr.service';
import { GlobalConstants } from '../shared/global';
import { NhomTaiKhoanAddEditModalComponent } from '../user/account/modals/nhom-tai-khoan-add-edit-modal/nhom-tai-khoan-add-edit-modal.component';
import { TextGlobalConstants } from '../shared/TextGlobalConstants';
import { HoSoHDDTService } from '../services/danh-muc/ho-so-hddt.service';
import { Subscription } from 'rxjs';
import { NhatKyTruyCapService } from '../services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from '../models/nhat-ky-truy-cap';
import { AlertStartupService } from '../services/alert-startup.service';
import { HttpClient } from '@angular/common/http';
import { ThongBaoStartModalComponent } from '../views/alertstart/thong-bao-start-modal/thong-bao-start-modal.component';
import { BangTongHopDuLieuService } from '../services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { BoKyHieuHoaDonService } from '../services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from '../shared/modals/message-box-modal/message-box-modal.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { AccountChangepassComponent } from '../user/account/modals/account-changepass/account-changepass.component';
import { HuongDanSuDungModalComponent } from '../views/dashboard/huong-dan-su-dung-modal/huong-dan-su-dung-modal.component';
import { QuanLyThongTinHoaDonService } from '../services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { HoaDonDienTuService } from '../services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isShowSider = true;
  isShowMeNuDanhMuc = true;
  isShowDrawer = false;
  currentUser: any;
  userPermissions: any;
  isViewDrawerSetting = false;
  isShowHeader = true;
  showUserName = true;
  info: any;
  taxCode = localStorage.getItem(CookieConstant.TAXCODE);
  isDev = true;
  listVersion: any[] = [];
  currentVersion: any;
  currentVersionName: any;
  currentVersionDate: any;
  newestVersion: any;
  newestVersionName: any;
  newestVersionDate: any;
  notshowagain: any;
  buTruCongNoTheoHoaDon: boolean;
  subscription: Subscription;
  permission: boolean = false;
  thaoTacs: any[] = [];
  isAlert = false;
  hinhThucHoaDon = 1;
  isChuyenBangTongHop: any = false;
  boolQuanLyNhanVienBanHangTrenHoaDon = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolQuanLyNhanVienBanHangTrenHoaDon').giaTri);
  _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.JPG', '.JPGE', '.BMP', '.GIF', '.PNG'];
  isHoverAvatar = false;
  isOpenAvatarMenu = false;
  isOpenChangePass = false;
  isCMTMTT = false;
  isKhongCoMa = false;

  constructor(
    private http: HttpClient,
    private modalService: NzModalService,
    private usersv: UserService,
    private authsv: AuthService,
    private sharedService: SharedService,
    private signalRService: SignalRService,
    private router: Router,
    private env: EnvService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private tuyChonService: TuyChonService,
    private cookieService: CookieService,
    private versionsv: VersionService,
    private hoSoHDDTService: HoSoHDDTService,
    private alertStartupService: AlertStartupService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private message: NzMessageService,
    private huongDanSuDungModalComponent: HuongDanSuDungModalComponent,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private notification: NzNotificationService,
    private hoaDonDienTuService: HoaDonDienTuService,
  ) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setResize();
  }

  CollapseMenu() {
    if (this.isShowSider) {
      this.isCollapsed = true;
    }
  }
  setResize() {
    if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.isCollapsed = true;
      this.isShowSider = true;
      this.isShowDrawer = false;
      this.isShowMeNuDanhMuc = true;
    } else if (window.innerWidth >= 992) {
      // this.isCollapsed = false;
      // this.isShowSider = true;
      // this.isShowDrawer = false;
      // this.isShowMeNuDanhMuc = true;
      this.isCollapsed = true;
      this.isShowSider = true;
      this.isShowDrawer = false;
      this.isShowMeNuDanhMuc = true;
    } else if (window.innerWidth < 768) {
      this.isShowSider = false;
      this.isCollapsed = false;
      // this.isShowDrawer = true;
      this.isShowMeNuDanhMuc = false;
    }

    if (window.innerWidth < 1175) {
      this.isShowHeader = false;
    } else {
      this.isShowHeader = true;
    }
    if (window.innerWidth < 1180) {
      this.showUserName = false;
    } else {
      this.showUserName = true;
    }
  }
  closeDrawer() {
    this.isCollapsed = false;
    this.isShowDrawer = false;
  }
  openDrawer() {
    this.isCollapsed = false;
    this.isShowDrawer = true;
  }

  toggleCollapsed() {
    if (window.innerWidth < 768) {
      this.openDrawer();
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  getInfo() {
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        this.info = res;
      });
  }

  // get thông tin bộ ký hiệu theo tờ khai mới nhất
  GetBoKyHieuTheoToKhaiMoiNhat() {

    this.quanLyThongTinHoaDonService.GetListByLoaiThongTin()
      .subscribe((res: any[]) => {
        this.isKhongCoMa = res.some(x => x.loaiThongTin === 1 && x.loaiThongTinChiTiet == 2 && x.trangThaiSuDung > 1);
        localStorage.setItem('isKhongCoMa', this.isKhongCoMa.toString());
        this.isCMTMTT = res.some(x => x.loaiThongTin === 1 && x.loaiThongTinChiTiet == 9 && x.trangThaiSuDung > 1);
      });

    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        if (res) {
          this.hinhThucHoaDon = res.hinhThucHoaDon;
          this.isChuyenBangTongHop = res.isChuyenBangTongHop;


          localStorage.setItem('hinhThucHoaDon', this.hinhThucHoaDon.toString());
          localStorage.setItem('isChuyenBangTongHop', this.isChuyenBangTongHop);
          localStorage.setItem('isCoMaTuMTT', this.isCMTMTT.toString());
        }
      });
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getIpAddress();
    this.getInfo();
    this.GetBoKyHieuTheoToKhaiMoiNhat();
    this.setKyKeKhaiThueIfNull();

    this.signalRService.startConnection();
    setInterval(() => {
      //kiểm tra phân quyền
      this.checkPermisson();
    }, 500);
    this.subscription = this.sharedService.changeEmitted$
      .subscribe((res: any) => {
        if (res && res.type === 'updateInfo') {
          this.info = res.value;
        }
        if (res && res.type === 'UpdateUser') {
          this.currentUser = res.value;
        }
        if (res && res.type === 'BoolQuanLyNhanVienBanHangTrenHoaDon') {
          this.boolQuanLyNhanVienBanHangTrenHoaDon = res.value;
        }
      });

    this.isDev = environment.production === false;

    this.setResize();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.CollapseMenu();
    this.checkVersionInCookie();
    /* Hiển thị thông báo yêu cầu hủy của hóa đơn MTT 
    Hiển thị dạng notification */
    this.hoaDonDienTuService.GetHoaDonMttYeuCauHuy().subscribe((res: any) => {
      if (res && res > 0) {
        this.createBasicNotification(res);
      }
    })
    this.alertStartupService.getAlertStartupActive().subscribe((rs: any) => {
      console.log(rs);
      if (rs != null) {
        console.log('showAlertStart: ' + sessionStorage.getItem('showAlertStart'));
        console.log('this.isAlert: ' + rs.status);
        if (sessionStorage.getItem('showAlertStart') == null && rs.status == true) {
          const modal1 = this.modalService.create({
            nzTitle: '',
            nzContent: ThongBaoStartModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: rs.width + 'px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {

            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            if (rs) {
              sessionStorage.setItem('showAlertStart', 'true');
            }
          });
        }
      }

    }, error => {
      console.log("getAlertStartupActive error");
    });
  }
  createBasicNotification(sl:any){
    this.notification.config({
      nzPlacement: 'bottomRight',
      nzAnimate:true,
    });
    this.notification.create(
      'info',
      'Hóa đơn cần xóa bỏ',
      `
      BKPOS Bách Khoa (giải pháp khởi tạo hóa đơn từ máy tính tiền) đã hủy <b>${sl}</b> hóa đơn.
      Bạn cần thực hiện chức năng <b>Xóa bỏ hóa đơn</b> các hóa đơn đó trên hệ thống này <a target="_blank" href="/hoa-don-tu-mtt/quan-li-hoa-don-tu-mtt?yeucauhuy=true"><i>(Xem chi tiết)</i></a>. Hình thức xóa bỏ chọn: <b>Hủy hóa đơn theo lý do phát sinh</b> hoặc <b>Hủy hóa đơn do sai sót</b>`,
      {nzClass:'yeucauhuy',nzDuration:1350000,}
    );
  }
  setKyKeKhaiThueIfNull() {
    const kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (kyKeKhaiThue) {
      this.hoSoHDDTService.GetDetail().subscribe((res: any) => {
        localStorage.setItem(CookieConstant.KYKEKHAITHUE, res.kyTinhThue === 0 ? 'Thang' : 'Quy');
      });
    }
  }

  getAlert() {
    this.authsv.getAlertByIdFormQlkh().subscribe((rs: any) => {
      if (rs) {
        document.getElementById('marqueeContent').innerHTML = rs.content.replace(/<p>/ig, '<span class="marqueechildren">').replace(/<\/p>/ig, '</span>');
        document.getElementById('marqueerun').setAttribute('scrollamount', rs.width);

        let marqueechildren = document.getElementsByClassName('marqueechildren');
        for (let i = 0; i < marqueechildren.length; ++i) {
          let el = marqueechildren[i] as HTMLElement;
          console.log(el);
          if (i < marqueechildren.length - 1) el.style.marginRight = (window.innerWidth - document.getElementById('username').offsetWidth - 310) + 'px';
        }
      }
    },
      error => {
        this.authsv.loginqlkh().subscribe((rs: any) => {
          if (rs) {
            this.getAlert();
          }
        }, error => {
          console.log("loginqlkh error");
        })
      });
  }
  ngAfterViewInit() {
    this.getAlert();

    let marquee = document.getElementById('marquee');
    let username = document.getElementById('username');
    marquee.style.width = (window.innerWidth - username.offsetWidth - 310) + 'px';
  }
  changePass() {
    this.isOpenChangePass = true;
    this.usersv.GetById(this.currentUser.userId).subscribe((rs: any) => {
      const modal = this.modalService.create({
        nzTitle: 'Đặt lại mật khẩu',
        nzContent: AccountChangepassComponent,
        nzMaskClosable: false,
        nzClosable: true,
        nzKeyboard: false,
        nzWidth: 500,
        nzBodyStyle: { padding: '10px 10px 0px 10px' },
        nzStyle: { top: '100px', },
        nzComponentParams: {
          id: this.currentUser.userId,
          data: rs,
          forgotPassword: false
        },
      });
      modal.afterClose.subscribe((result: boolean) => {
        if (result) {
          // this.loadData();
        }
        this.isOpenChangePass = false;
      });
    })
  }

  importFile(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      if (!this.hasExtension(event.target.files[0].name, this._validFileExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!this.hasFileSize(event.target.files[0].size)) {
        this.message.error('Dung lượng file vượt quá 2MB.');
        return;
      }
      let fileData: any = null;
      // this.fileName = event.target.files[0].name;
      fileData = new FormData();
      fileData.append('fileName', event.target.files[0].name);
      fileData.append('fileSize', event.target.files[0].size); // tính theo byte
      fileData.append('userId', this.currentUser.userId);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < files.length; i++) {
        fileData.append('files', files[i]);
      }
      // gọi api update avatar
      //
      this.usersv.UpdateAvatar(fileData).subscribe((rs: any) => {
        if (rs.result === true) {
          this.isOpenAvatarMenu = false;
          this.currentUser.avatar = rs.user.avatar;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {

        }
      }, _ => {
      });
    }
  }

  hasExtension(fileName, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
  hasFileSize(fileSize) {
    if ((fileSize / 1024 / 1024) < 2048) { return true; }
    return false;
  }

  getIpAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      if (res.ip) {
        localStorage.setItem(CookieConstant.IPADDRESS, res.ip);
      }
    });
  }

  clickThietLapTaiKhoan() {
    this.router.navigate(['/account/setting'])
  }

  logout() {
    this.isOpenAvatarMenu = false;
    sessionStorage.removeItem('showAlertStart');
    this.alertStartupService.getAlertStartupActive().subscribe((rs: any) => {
      if (rs != null) {
        if (sessionStorage.getItem('showAlertStart') == null && rs.status == true) {
          const modal1 = this.modalService.create({
            nzTitle: '',
            nzContent: ThongBaoStartModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: rs.width + 'px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {

            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            if (rs) {
              this.openLogout();
            }
          });
        } else {
          this.openLogout();
        }
      } else {
        this.openLogout();
      }

    }, error => {
      console.log("getAlertStartupActive error");
      this.openLogout();
    });
  }
  openLogout() {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '400px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Đăng xuất khỏi hệ thống",
        msContent: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống ngay bây giờ?",
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.DangXuat,
            refType: RefType.DangXuat,
            thamChieu: 'Tên đăng nhập: ' + (this.currentUser ? this.currentUser.userName : ''),
            refId: this.currentUser ? this.currentUser.userId : ''
          }).subscribe();

          this.usersv
            .SetOnline(localStorage.getItem("userId"), false)
            .subscribe((rs: any) => {
              // không thể set trạng thai offline
            });
          this.signalRService.stopConnection();
          this.authsv.logout();
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }
  openDrawerSetting(): void {
    this.isViewDrawerSetting = true;
  }

  closeDrawerSetting(): void {
    this.isViewDrawerSetting = false;
  }
  toggleSetting() {
    this.isViewDrawerSetting = !this.isViewDrawerSetting;
  }

  callModal(url: string) {
    const data: any = {
      sendTo: 'layoutSendToQuy',
      value: url
    }
    this.sharedService.emitChange(data);
  }

  downloadFileMau() {

  }

  // tuyChon() {
  //   const modal = this.modalService.create({
  //     nzTitle: 'Tùy chọn',
  //     nzContent: TuyChonModalComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '950px',
  //     nzStyle: { top: '10px' },
  //     nzBodyStyle: { padding: '1px' },
  //     nzComponentParams: {
  //       // isBanHang
  //     },
  //     nzFooter: null
  //   });
  //   modal.afterClose.subscribe((rs: any) => {
  //     if (rs) {
  //       this.tuyChonService.GetAll().subscribe((res: any) => {
  //         if (res) {
  //           localStorage.setItem(CookieConstant.SETTING, JSON.stringify(res));
  //         }
  //         this.router.navigate(['/bang-dieu-khien']);
  //       });

  //     }
  //   });
  // }

  clickBaoCao() {
    this.CollapseMenu();
    this.router.navigate(['/bao-cao']);
  }
  clickHeThong() {
    this.CollapseMenu();
    this.router.navigate(['/he-thong']);
  }
  clickTroGiup() {
    // const url = this.env.apiUrl + '/docs/samples/HuongDanSuDung.pdf';
    // window.open(url);
    // const url = this.env.apiUrl + '/FilesUpload/docs/samples/HuongDanSuDung.pdf'
    // window.open(url);
    this.CollapseMenu();
    // this.router.navigate(['/tro-giup']);
    window.open('https://pmbk.vn/ho-tro-bksoft/', '_blank');
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 112) {
      this.clickTroGiup();
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 49) {
      //alt+1 = bảng điều khiển
      this.router.navigate(['/bang-dieu-khien']);
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 50) {
      //alt+2 = chuyển sang phân hệ tiền
      if (this.userPermissions != null) {
        for (let i = 0; i < 1; i++) {
          if ((this.userPermissions === true || this.userPermissions.indexOf('Tien') >= 0)) {
          } else {
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('ThuChiTien') >= 0)) {
            this.router.navigate(['/tien/thu-chi-tien']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('KiemKeTienMat') >= 0)) {
            this.router.navigate(['/tien/kiem-ke-tien-mat']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('DuBaoDongTien') >= 0)) {
            this.router.navigate(['/tien/du-bao-dong-tien']);
            break;
          }
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 51) {
      //alt+3 = chuyển sang phân hệ mua hàng
      if (this.userPermissions != null) {
        for (let i = 0; i < 1; i++) {
          if ((this.userPermissions === true || this.userPermissions.indexOf('MuaHang') >= 0)) {
          } else {
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('DonMuaHang') >= 0)) {
            this.router.navigate(['/mua-hang/don-mua-hang']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('HopDongMuaHang') >= 0)) {
            this.router.navigate(['/mua-hang/hop-dong-mua-hang']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('ChungTuMuaHang') >= 0)) {
            this.router.navigate(['/mua-hang/chung-tu-mua-hang']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('NhanHoaDon') >= 0)) {
            this.router.navigate(['/mua-hang/nhan-hoa-don']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('TraLaiHangMua') >= 0)) {
            this.router.navigate(['/mua-hang/tra-lai-hang-mua']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('GiamGiaHangMua') >= 0)) {
            this.router.navigate(['/mua-hang/giam-gia-hang-mua']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('CongNo') >= 0)) {
            this.router.navigate(['/mua-hang/cong-no']);
            break;
          }
          if ((this.userPermissions === true || this.userPermissions.indexOf('BuTroCongNo') >= 0)) {
            break;
          }
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 52) {
      //alt+4 = bán hàng
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('BanHang') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('BaoGia') >= 0)) {
          this.router.navigate(['/ban-hang/bao-gia']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DonDatHang') >= 0)) {
          this.router.navigate(['/ban-hang/don-dat-hang']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('ChungTuBanHang') >= 0)) {
          this.router.navigate(['/ban-hang/chung-tu-ban-hang']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('XuatHoaDon') >= 0)) {
          this.router.navigate(['/ban-hang/xuat-hoa-don']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('TraLaiHangBan') >= 0)) {
          this.router.navigate(['/ban-hang/tra-lai-hang-ban']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('GiamGiaHangBan') >= 0)) {
          this.router.navigate(['/ban-hang/giam-gia-hang-ban']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('CongNoBanHang') >= 0)) {
          this.router.navigate(['/ban-hang/cong-no']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('BuTruCongNoBanHang') >= 0)) {
          break;
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 53) {
      //alt+5 = kho
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('MenuKho') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('NhapXuatKho') >= 0)) {
          this.router.navigate(['/kho/nhap-xuat-kho']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('ChuyenKho') >= 0)) {
          this.router.navigate(['/kho/chuyen-kho']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('LenhSanXuat') >= 0)) {
          this.router.navigate(['/kho/lenh-san-xuat']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('KiemKeKho') >= 0)) {
          this.router.navigate(['/kho/kiem-ke']);
          break;
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 54) {
      //alt+6 = tài sản cố định
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('TaiSan') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('SoTaiSan') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/so-tai-san']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('GhiTang') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/ghi-tang']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('TinhKhauHao') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/tinh-khau-hao']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DanhGiaLai') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/danh-gia-lai']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DieuChuyen') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/dieu-chuyen']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('GhiGiam') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/ghi-giam']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('KiemKeTaiSan') >= 0)) {
          this.router.navigate(['/tai-san-co-dinh/kiem-ke']);
          break;
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 55) {
      //alt+7 = chi phí trả trước
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('ChiPhiTraTruoc') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('SoTheoDoiCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/so-theo-doi']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('GhiTangCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/ghi-tang']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('PhanBoChiPhiCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/phan-bo-chi-phi']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DieuChinhCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/dieu-chinh']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DieuChuyenCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/dieu-chuyen']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('GhiGiamCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/ghi-giam']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('KiemKeCPTT') >= 0)) {
          this.router.navigate(['/chi-phi-tra-truoc/kiem-ke']);
          break;
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 56) {
      //alt+8 = tổng hợp
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('TongHop') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('ChungTuNghiepVuKhac') >= 0)) {
          this.router.navigate(['/tong-hop/chung-tu-nghiep-vu-khac']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('KetChuyenLaiLo') >= 0)) {
          this.router.navigate(['/tong-hop/ket-chuyen-lai-lo']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('KhoaSoKyKeToan') >= 0)) {
          this.router.navigate(['/tong-hop/khoa-so-ky-ke-toan']);
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('DoanhThuNhanTruoc') >= 0)) {
          this.router.navigate(['/tong-hop/doanh-thu-nhan-truoc']);
          break;
        }
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 57) {
      //alt+9 = hợp đồng
      for (let i = 0; i < 1; i++) {
        if ((this.userPermissions === true || this.userPermissions.indexOf('HopDong') >= 0)) {
        } else {
          break;
        }
        if ((this.userPermissions === true || this.userPermissions.indexOf('HopDongBan') >= 0)) {
          this.router.navigate(['/hop-dong/hop-dong-ban-hang']);
          break;
        }
      }
    }
  }

  callModalThongTin(v: any) {
    // const modal = this.modalService.create({
    //   nzTitle: 'Thông báo',
    //   nzContent: ThongTinComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: 680,
    //   nzComponentParams: {
    //     value: v,
    //   },
    //   nzFooter: [
    //     {
    //       label: 'OK',
    //       shape: 'primary',
    //       onClick: () => modal.destroy(),
    //     },

    //   ]
    // });
  }

  async checkVersionInCookie() {
    // lấy phiên bản từ api
    let rs: any = await this.versionsv.GetVersionPromise();
    this.listVersion = rs;
    // this.listVersion.forEach(element => {
    //   element.ngayPhatHanh = moment(element.ngayPhatHanh).format('DD/MM/YYYY');
    //   element.header = 'Phiên bản: ' + element.phienBanHienTai + ' ( ' + element.ngayPhatHanh + ' ) ';
    // });
    this.newestVersion = this.listVersion[this.listVersion.length - 1];
    this.newestVersionName = this.newestVersion.phienBanHienTai;

    this.notshowagain = this.cookieService.get('notshowagain');

    var version = this.cookieService.get('version');

    if (version && version != 'undefined' && this.notshowagain != "true" && parseInt(this.newestVersionName[1]) > parseInt(version[1])
    ) {
      this.callModalThongTin(version);
      // so phiên bản, nếu có bản mới thì gọi hàm callModalThongTin để hiển thị
      // nếu tick vào Không hiển thị lại > OK thì lưu version mới nhất vào cookie
    } else {
      // gán phiên bản lấy đc từ api vào cookie
      this.cookieService.set('version', this.newestVersionName);
    }
  }

  checkPermisson() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    // console.log(phanQuyen);
    if (phanQuyen != null) {
      if (phanQuyen === 'true') {
        this.userPermissions = true;
      } else {
        var pq = JSON.parse(phanQuyen);
        this.userPermissions = pq.functions.map(x => x.functionName);
        if (this.userPermissions.indexOf('HoaDon') >= 0)
          this.thaoTacs = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
      }
    } else {
      this.userPermissions = [];
    }
    GlobalConstants.UserPermissions = this.userPermissions;
  }

  addNhomTaiKhoan() {
    const modal = this.modalService.create({
      nzTitle: 'Quản lý vai trò kế toán',
      nzContent: NhomTaiKhoanAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Lưu dữ liệu',
          type: 'default',
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });
  }

  xoaCache() {
    this.usersv
      .SetOnline(localStorage.getItem("userId"), false)
      .subscribe((rs: any) => {
      });

    setTimeout(() => {
      //xóa local storage
      localStorage.clear();

      //xóa sessiona storage
      sessionStorage.clear();

      //xóa cookie
      this.cookieService.deleteAll();

      //xóa cache trong trình duyệt
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          console.log(key);
          return caches.delete(key);
        }));
      });

      this.signalRService.stopConnection();
      this.authsv.logout();
    }, 0);
  }
  showHideHuongDan() {
    this.huongDanSuDungModalComponent.toggle();
  }
  goTo(link, param = {}) {
    // this.router.navigate([link], { queryParams: param });

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([link], { queryParams: param }));
  }

  closeAvatarMenu() {
    this.isHoverAvatar = false;

    setTimeout(() => {
      if (!this.isHoverAvatar) {
        this.isOpenAvatarMenu = false;
      }
    }, 300);
  }
}
