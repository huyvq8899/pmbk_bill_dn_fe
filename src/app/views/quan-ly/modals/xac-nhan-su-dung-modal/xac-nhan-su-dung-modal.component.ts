import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { XemMauHoaDonModalComponent } from 'src/app/views/danh-muc/quan-ly-hoa-don-dien-tu/modals/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { forkJoin, Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { TabThongDiepGuiComponent } from '../../tab-thong-diep-gui/tab-thong-diep-gui.component';
import { EnvService } from 'src/app/env.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { TrangThaiSuDung } from 'src/app/enums/TrangThaiSuDung.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getNoiDungLoiPhatHanhHoaDon } from 'src/app/shared/SharedFunction';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-xac-nhan-su-dung-modal',
  templateUrl: './xac-nhan-su-dung-modal.component.html',
  styleUrls: ['./xac-nhan-su-dung-modal.component.scss']
})
export class XacNhanSuDungModalComponent implements OnInit, AfterViewInit {
  @Input() isXacThuc: boolean;
  @Input() data: any;
  mainForm: FormGroup;
  spinning = false;
  nhatKys: any[] = [];
  hoSoHDDT: any;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  serials = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private mauHoaDonService: MauHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private webSocket: WebSocketService,
    private authsv: AuthService,
    private env: EnvService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
  ) { }

  ngOnInit() {
    this.observableSocket();
    this.createForm();
  }

  async observableSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      if(!this.webSocket.isOpenSocket() && !this.webSocket.isConnecting()){
        //nếu socket bị ngắt kết nối hoặc đóng đột ngột
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Error,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Xác thực sử dụng',
            msContent: `Có lỗi xảy ra. Vui lòng thử lại.`,
          },
          nzFooter: null
        });
        this.spinning = false;
        return;
      }
      let obj = JSON.parse(rs);

      console.log('obj: ', obj);

      if (obj.TypeOfError == 0) {
        this.data.serialNumber = obj.SerialSigned;
        this.boKyHieuHoaDonService.CheckSoSeriChungThu(this.data)
          .subscribe((resSeri: any) => {
            if (resSeri.message && (this.data.trangThaiSuDung === 0 || this.data.trangThaiSuDung === 3)) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '450px',
                nzComponentParams: {
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: 'Kiểm tra lại',
                  msContent: resSeri.message
                },
                nzFooter: null
              });
              this.spinning = false;
              return;
            } else {
              this.data.subject = resSeri.ttChuc;
              this.xacThucBoKyHieuHoaDon(resSeri);
            }
          });
      } else {
        this.spinning = false;

        this.nhatKyThaoTacLoiService.Insert(this.data.boKyHieuHoaDonId, obj.Exception).subscribe();

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Error,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Xác thực không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });

        return;
      }
    }, err => {
      this.spinning = false;
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.WarningAndInstall,
          msHasWatchVideo: true,
          msWatchText: "Xem video",
          msOnWatch: ()=>{
            this.xemHuongDanChiTiet('D6F82FA2-DE2C-8C21-C517-F36493C4608F', "Cài đặt công cụ ký", 1);
          },
          msOKText: "Tải về BKSOFT KYSO",
          msOnOk: () => {
            const link = document.createElement('a');
            link.href = `${this.env.apiUrl}/${this.urlTools}`;
            link.download = 'BKSOFT-KYSO-SETUP.zip';
            link.click();
          },
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          },
          msTitle: 'Kiểm tra lại',
          msContent: `Để xác nhận sử dụng, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại..`,
        },
        nzFooter: null
      });
      return;
    });
  }

  getLink(danhMucId, type, titleHD = '') {//type=0 bài viết, type=1 video
    let qlkhTokenKey = localStorage.getItem('qlkhTokenKey');
    if (qlkhTokenKey) {
      this.authsv.getLinkBaiVietFormQlkh(danhMucId).subscribe((rs: any) => {
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

  youTubeGetID(url) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
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

  ngAfterViewInit() {
    setTimeout(() => {
      const boxElement = document.querySelector('.box-nhat-ky-xac-thuc') as HTMLElement;
      if (boxElement) {
        const content = boxElement.querySelector('.content') as HTMLElement;
        content.style.height = (window.innerHeight - 230) + 'px';
      }
    }, 0);
  }

  createForm() {
    this.mainForm = this.fb.group({
      kyHieu: [this.data.kyHieu],
      trangThaiCuaCQT: [this.data.toKhaiForBoKyHieuHoaDon.tenTrangThaiGui],
      thoiDiemChapNhan: [this.data.toKhaiForBoKyHieuHoaDon.thoiDiemChapNhan ? moment(this.data.toKhaiForBoKyHieuHoaDon.thoiDiemChapNhan).format('DD/MM/YYYY HH:mm:ss') : null],
      maSoThueBenUyNhiem: [this.data.toKhaiForBoKyHieuHoaDon.maSoThueDuocUyNhiem],
      tenDonViBenUyNhiem: [this.data.toKhaiForBoKyHieuHoaDon.tenToChucDuocUyNhiem],
      trangThaiSuDung: [this.data.trangThaiSuDung],
      tenTrangThaiSuDung: [this.data.tenTrangThaiSuDung],
      nhatKyXacThuc: [null],
    });

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.hoSoHDDT = res[0];
      this.nhatKys = res[1];
      console.log(res[1]);
      this.serials = res[2].map(x => x.seri);
      this.spinning = false;
    });

    this.mainForm.disable();
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.boKyHieuHoaDonService.GetListNhatKyXacThucById(this.data.boKyHieuHoaDonId),
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung()
    ]);
  }

  getNhatKys() {
    this.spinning = true;
    this.boKyHieuHoaDonService.GetListNhatKyXacThucById(this.data.boKyHieuHoaDonId)
      .subscribe((res: any[]) => {
        console.log(res);
        this.nhatKys = res;
        this.spinning = false;
      });
  }

  async submitForm() {
    if(this.serials.length == 0){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Error,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Xác thực không thành công.
          <br>Lỗi: Không có chứng thư số trong mục "Thông tin người nộp thuế" để xác thực.
          <br>Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    const data = this.mainForm.getRawValue();

    if (data.trangThaiSuDung === 0 || data.trangThaiSuDung === 1 || data.trangThaiSuDung === 2 || data.trangThaiSuDung === 3) {
      if (data.trangThaiSuDung === 0 || data.trangThaiSuDung === 3) {
        // const resToKhaiMoiNhat: any = await this.boKyHieuHoaDonService.CheckHasToKhaiMoiNhatAsync(this.data);
        // if (resToKhaiMoiNhat.result) {
        //   this.modalService.create({
        //     nzContent: MessageBoxModalComponent,
        //     nzMaskClosable: false,
        //     nzClosable: false,
        //     nzKeyboard: false,
        //     nzStyle: { top: '100px' },
        //     nzBodyStyle: { padding: '1px' },
        //     nzWidth: '550px',
        //     nzComponentParams: {
        //       msMessageType: MessageType.Warning,
        //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        //       msTitle: 'Kiểm tra lại',
        //       msContent: resToKhaiMoiNhat.result,
        //     },
        //     nzFooter: null
        //   });
        //   return;
        // }
      }

      // this.modalService.create({
      //   nzContent: MessageBoxModalComponent,
      //   nzMaskClosable: false,
      //   nzClosable: false,
      //   nzKeyboard: false,
      //   nzStyle: { top: '100px' },
      //   nzBodyStyle: { padding: '1px' },
      //   nzWidth: '550px',
      //   nzComponentParams: {
      //     msMessageType: MessageType.Info,
      //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
      //     msTitle: 'Chứng thư số',
      //     msContent: `Hãy chắc chắn chứng thư số đã đăng ký giao dịch điện tử với cơ quan thuế. Bạn có thể tra cứu tại <a target="_blank" href='https://thuedientu.gdt.gov.vn'>https://thuedientu.gdt.gov.vn</a>`,
      //   },
      //   nzFooter: null
      // });
      this.sign();
    } else {

    }
  }

  getToChucBySubject(subject: string) {
    const lastEqual = subject.lastIndexOf('=');
    return subject.slice(lastEqual + 1, subject.length);
  }

  sign() {
    this.spinning = true;

    this.mauHoaDonService.GetFileToSign()
      .subscribe((res: any) => {
        this.sendMessageWebsocket(res.result);
      });
  }

  sendMessageWebsocket(dataXML: any) {
    const msg = {
      mLTDiep: MLTDiep.TDCDLHDKMDCQThue,
      mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
      dataXML,
      serials: this.serials,
      isCompression: false,
      tTNKy: {
        mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
        ten: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
        sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
        tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        tenP2: '',
      }
    };

    console.log('msg: ', msg);

    this.spinning = true;
    // Sending
    const isConnected = this.webSocket.isOpenSocket();
    if (isConnected) {
      this.webSocket.sendMessage(JSON.stringify(msg));
      this.observableSocket();
    }
    else{
      if(this.webSocket.isConnecting()){
        //khi socket ở trạng thái đang kết nối
        //đợi 2000ms để socket được mở
        setTimeout(()=>{
          if(this.webSocket.isOpenSocket()){
            //nếu socket mở thì thoát time out
            this.webSocket.sendMessage(JSON.stringify(msg));
            this.observableSocket();
            //clearTimeout();
          }
        }, 2000);

        //sau 2000ms vẫn chưa kết nối được thì ngắt
        if(!this.webSocket.isOpenSocket()){
          this.spinning = false;
          return;
        }
      }
      else{
        this.spinning = false;
        return;
      }
    }
  }

  xacThucBoKyHieuHoaDon(resSeri: any) {
    let trangThaiSuDung = this.mainForm.get('trangThaiSuDung').value;
    if (trangThaiSuDung === 0 || trangThaiSuDung === 3) {
      trangThaiSuDung = 1;
    } else if (trangThaiSuDung === 1 || trangThaiSuDung === 2) {
      trangThaiSuDung = 3;
    }

    const data = {
      boKyHieuHoaDonId: this.data.boKyHieuHoaDonId,
      trangThaiSuDung: trangThaiSuDung,
      mauHoaDonId: this.data.mauHoaDonId,
      thongDiepId: this.data.thongDiepId,
      tenMauHoaDon: this.data.mauHoaDon.ten,
      tenToChucChungThuc: this.data.subject,
      soSeriChungThu: this.data.serialNumber,
      thoiGianSuDungTu: resSeri.thoiGianSuDungTu,
      thoiGianSuDungDen: resSeri.thoiGianSuDungDen,
      thoiDiemChapNhan: this.data.toKhaiForBoKyHieuHoaDon.thoiDiemChapNhan,
      maThongDiepGui: this.data.toKhaiForBoKyHieuHoaDon.maThongDiepGui
    };
    this.boKyHieuHoaDonService.XacThucBoKyHieuHoaDon(data)
      .subscribe((res: any) => {
        if (res) {
          this.data.trangThaiSuDung = trangThaiSuDung;
          this.mainForm.get('trangThaiSuDung').setValue(trangThaiSuDung);
          this.getNhatKys();
        }
      });
  }

  closeModal() {
    this.modal.destroy(this.data.trangThaiSuDung);
  }

  xemMauHoaDon() {
    const modal = this.modalService.create({
      nzTitle: 'Xem mẫu hóa đơn',
      nzContent: XemMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1000,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '5px' },
      nzComponentParams: {
        id: this.data.mauHoaDonId,
        kySo: false
      },
      nzFooter: null
    });/////
  }

  xemMauHoaDonTaiDay(data: any, index: any) {
    let nhatKyXacThucBoKyHieuId = data.nhatKyXacThucBoKyHieuId;

    if (data.trangThaiSuDung === TrangThaiSuDung.NgungSuDung) {
      nhatKyXacThucBoKyHieuId = this.nhatKys[index - 1].nhatKyXacThucBoKyHieuId;
    }

    this.boKyHieuHoaDonService.GetNhatKyXacThucBoKyHieuIdForXemMauHoaDon(nhatKyXacThucBoKyHieuId)
      .subscribe((res: any) => {
        const modal = this.modalService.create({
          nzTitle: 'Xem mẫu hóa đơn',
          nzContent: XemMauHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 1000,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '5px' },
          nzComponentParams: {
            id: data.mauHoaDonId,
            nhatKyXacThucBoKyHieuId: res ? nhatKyXacThucBoKyHieuId : null,
            kySo: false
          },
          nzFooter: null
        });/////
      });
  }

  xemToKhai(data: any) {
    this.quyDinhKyThuatService.GetThongDiepChungById(data.thongDiepId)
      .subscribe((res: any) => {
        if (res) {
          this.tabThongDiepGuiComponent.clickSua(false, true, res);
        }
      });
  }

  xemTrangThai(data: any) {
    //////////////////
  }
}
