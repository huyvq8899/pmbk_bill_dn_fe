import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { LoginModel } from 'src/app/models/LoginModel';
import { AuthService } from 'src/app/services/auth.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { UserService } from 'src/app/services/user.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TabHoaDonDienTuComponent } from '../../hoa-don-dien-tu/tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { TabThongDiepGuiComponent } from '../../quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { DashboardComponent } from '../dashboard.component';
import { PopupVideoModalComponent } from '../popup-video-modal/popup-video-modal.component';
const TYPE_OF_DN_IN_QLKH = 3;
@Component({
  selector: 'app-huong-dan-su-dung-modal',
  templateUrl: './huong-dan-su-dung-modal.component.html',
  styleUrls: ['./huong-dan-su-dung-modal.component.scss']
})
export class HuongDanSuDungModalComponent implements OnInit {
  displayDetail: boolean = true;
  linkChiTiet: any;
  hasToKhaiDuocChapNhan = false;
  permission: boolean = false;
  thaoTacNNTs: any[] = [];
  thaoTacTDGs: any[] = [];
  thaoTacHDs: any[] = [];
  constructor(
    private router: Router,
    private modalService: NzModalService,
    private authsv: AuthService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private userService: UserService
  ) { }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if(!phanQuyen) {
      localStorage.clear();
      this.router.navigate(['/dang-nhap']);
    }
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacNNTs = pq.functions.find(x => x.functionName == "ThongTinNguoiNopThue") ? pq.functions.find(x => x.functionName == "ThongTinNguoiNopThue").thaoTacs : [];
      this.thaoTacTDGs = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs : [];
      this.thaoTacHDs = pq.functions.find(x => x.functionName == "HoaDon") ? pq.functions.find(x => x.functionName == "HoaDon").thaoTacs : [];
    }
    this.getThongTinToKhaiMoiNhat();
  }
  getThongTinToKhaiMoiNhat() {
    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        this.hasToKhaiDuocChapNhan = !!res;
      });
  }
  youTubeGetID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
  }
  getLink(danhMucId, type, titleHD = '') {//type=0 bài viết, type=1 video
    let qlkhTokenKey = localStorage.getItem('qlkhTokenKey');
    if (qlkhTokenKey) {
      this.authsv.GetByDanhMucIdAndTypeAsync(danhMucId, TYPE_OF_DN_IN_QLKH).subscribe((rs: any) => {
        if (rs) {
          if (type == 0) {
            if (rs.linkBai != null) {
              window.open(rs.linkBai, '_blank');
            } else {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 400,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: titleHD,
                  msContent: `Nội dung đang phát triển.`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });
            }
          } else {
            let key = rs.linkVideo != null ? this.youTubeGetID(rs.linkVideo) : '';
            if (key != '') {
              this.modalService.create({
                nzTitle: titleHD,
                nzContent: PopupVideoModalComponent,
                nzMaskClosable: false,
                nzClosable: true,
                nzKeyboard: false,
                nzClassName: "videoHD",
                nzWidth: 956,
                nzStyle: { top: '60px' },
                nzBodyStyle: { padding: '0px' },
                nzComponentParams: {
                  keyVideo: key,
                },
                nzFooter: null
              });
            } else {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 400,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: titleHD,
                  msContent: `Nội dung đang phát triển.`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });
            }

          }
        }
      },
        error => {
          console.error('loginqlkh: ' + error);
          this.authsv.loginqlkh().subscribe((rs: any) => {
            if (rs) {
              this.getLink(danhMucId, type);
            }
          }, error => {
            console.log("loginqlkh error");
          })
        });
    } else {
      this.authsv.loginqlkh().subscribe((rs: any) => {
        if (rs) {
          this.getLink(danhMucId, type);
        }
      }, error => {
        console.log("loginqlkh error");
      })
    }
  }
  toggle() {
    const element = document.getElementById("hdsd");
    console.log(element);
    if (element) {
      if (element.getAttribute('data-show') == 'true') {
        element.setAttribute('data-show', 'false');
        element.style.setProperty('display', 'none', 'important');
      } else {
        element.setAttribute('data-show', 'true');
        element.style.setProperty('display', 'block', 'important');
      }
    } else {
      this.router.navigate(['bang-dieu-khien']);
    }
  }
   goTo(link, param = {}) {
    if (link == 'quan-ly/bo-ky-hieu-hoa-don') {
      if (this.hasToKhaiDuocChapNhan) {
        this.router.navigate([link], { queryParams: param });
      } else {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '430px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msOkButtonInBlueColor: true,
            msTitle: 'Lập tờ khai đăng ký sử dụng',
            msContent: `<div>Không thể tạo ký hiệu hóa đơn do chưa tồn tại tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử được cơ quan thuế chấp nhận.</div>
            <br />
            <div>Bạn có muốn lập tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử không?</div>`,
            msOnOk: () => {
              this.tabThongDiepGuiComponent.clickThem();
            },
            msOnClose: () => { }
          },
          nzFooter: null
        });
        return;
      }
    } else if (link == 'hoa-don-dien-tu/quan-li-hoa-don-dien-tu' ||
      link == 'hoa-don-dien-tu/hoa-don-thay-the' ||
      link == 'hoa-don-dien-tu/hoa-don-dieu-chinh'
      || link == '/hoa-don-dien-tu/hoa-don-xoa-bo'
    ) {
      this.userService.getAdminUser().subscribe((users: any[]) => {
      let content = '';
      let textUserName = '';
      let checkPer = false;
      
        if (users && users.length > 0) {
          let stt = 0;
          users.forEach(item => {
            stt++;
            let uName = item.fullName ? item.fullName : item.userName;
            if (textUserName == '') {
              textUserName = uName;
            } else {
              if (users.length == 2) {
                textUserName += ' và ' + uName;
              } else {
                if (stt == users.length) {
                  textUserName += ' và ' + uName;
                } else {
                  textUserName += ', ' + uName;
                }
              }
            }
          });
        }
      
      switch (link) {
        case 'hoa-don-dien-tu/quan-li-hoa-don-dien-tu':
          content = `Bạn không có quyền <b>Lập hóa đơn</b>. Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${textUserName}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          checkPer = this.thaoTacHDs.indexOf('HD_CREATE') < 0;
          break;
        case 'hoa-don-dien-tu/hoa-don-thay-the':
          content = `Bạn không có quyền <b>Lập hóa đơn thay thế</b>. Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${textUserName}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          checkPer = this.thaoTacHDs.indexOf('HD_REPLACE') < 0;
          break;
        case 'hoa-don-dien-tu/hoa-don-dieu-chinh':
          content = `Bạn không có quyền <b>Lập hóa đơn điều chỉnh</b>. Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${textUserName}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          checkPer = this.thaoTacHDs.indexOf('HD_ADJUST') < 0;          
          break;
        case '/hoa-don-dien-tu/hoa-don-xoa-bo':
          content = `Bạn không có quyền <b>Xóa bỏ hóa đơn</b>. Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${textUserName}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          checkPer = this.thaoTacHDs.indexOf('HD_CRASH') < 0;          
          break;
        default:
          break;
      }
      if (this.permission != true && this.thaoTacHDs.indexOf('HD_FULL') < 0 && checkPer) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Phân quyền người dùng',
              msContent: content,
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
      } else {
        var listKyHieus: any = this.boKyHieuHoaDonService.GetListForHoaDonAsync(-1);
        if (listKyHieus.length === 0) {
          this.tabHoaDonDienTuComponent.showThongBaoKhongTonTaiBoKyHieu();
        } else {
          this.router.navigate([link], { queryParams: param });
        }
      }
    });
    }
    else if (link == "/he-thong/thong-tin-nguoi-nop-thue") {
      if (this.permission != true && this.thaoTacNNTs.indexOf('SYS_VIEW') < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
              content = `Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
            }
          }
          else {
            if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
              content = `Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Cập nhật thông tin người nộp thuế',
              msContent: content,
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else this.router.navigate([link], { queryParams: param });
    }
    else if (link == "/quan-ly/thong-diep-gui" && param['ltk'] == true) {
      if (this.permission != true && this.thaoTacTDGs.indexOf('MNG_CREATE') < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            let userList = `<b class="css-blue">` + rs.map(x => x.fullName).join(", ") + "</b>";
            if (this.thaoTacTDGs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
          }
          else {
            if (this.thaoTacTDGs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
          }

          console.log(content);
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Lập tờ khai đăng ký sử dụng',
              msContent: content,
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else this.router.navigate([link], { queryParams: param });
    }
    else if (link == "/quan-ly/thong-diep-gui" && param['ltbss'] == true) {
      if (this.permission != true && this.thaoTacTDGs.indexOf('MNG_CREATE') < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            let userList = `<b class="css-blue">` + rs.map(x => x.fullName).join(", ") + "</b>";
            if (this.thaoTacTDGs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
          }
          else {
            if (this.thaoTacTDGs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Lập thông báo hóa đơn sai sót',
              msContent: content,
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else this.router.navigate([link], { queryParams: param });
    }
    else {
      this.router.navigate([link], { queryParams: param });
    }

  }
  xemHuongDanChiTiet(idDanhMuc = '', title = '', type = 0) {
    if (idDanhMuc != '') {
      this.getLink(idDanhMuc, type, title);
    } else {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: title,
          msContent: `Nội dung đang phát triển.`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        },
      });
    }
  }
}
