import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { SharedService } from 'src/app/services/share-service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { dinhDangHoaDons, getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { IframeCSS, IframeScript } from 'src/assets/ts/iframe-css';
import * as moment from 'moment';
import { MessageInv } from 'src/app/models/messageInv';
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { MauVeDuLichComponent } from '../mau-ve-iframe/mau-ve-du-lich/mau-ve-du-lich.component';
declare var $: any;
@Component({
  selector: 'app-mau-ve-preview',
  templateUrl: './mau-ve-preview.component.html',
  styleUrls: ['./mau-ve-preview.component.scss']
})
export class MauVePreviewComponent implements OnInit {

  @Output() valueChangesPreviewEvent = new EventEmitter<any>();
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Input() data: any;
  @Input() disabledEdit: boolean;
  savedData: any;
  dinhDangHoaDons = dinhDangHoaDons();
  dinhDangHoaDon = 1;
  thietLapForm: FormGroup;
  emptyArrays = [];
  titleDinhDangHoaDon = '';
  innderHTML = '';
  compRef: ComponentRef<MauVeDuLichComponent>;
  doc;
  test: any;
  blockBackground = false;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  isLoading = false;
  salerInfo = null;
  blockDownloadTool = true;
  wsSubscription: Subscription;
  isKy = false;
  sub: Subscription;
  isFirst = true;
  serials = [];
  isDaKyDienTu = false;

  listLoaiTuyChinhChiTiet = [
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinNguoiBan]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinHoaDon]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinNguoiMua]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.MaQRCode]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinNgoaiTe]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinNguoiKy]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinTraCuu]}`,
    `${LoaiTuyChinhChiTiet[LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue]}`,
  ]

  constructor(
    private hoSoHDDTService: HoSoHDDTService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private sharedService: SharedService,
    private wsService: WebSocketService,
    private env: EnvService,
    private authsv: AuthService,
    private mauHoaDonService: MauHoaDonService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.savedData = this.data;
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
      this.observableSocket();
    }

    this.forkJoin().subscribe((res: any[]) => {
      this.salerInfo = res[0];
      this.serials = res[1].map(x => x.seri);
      this.isDaKyDienTu = res[2] ? !!res[2].ngayKy : false;
    });

    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      console.log("🚀 ~ file: mau-ve-preview.component.ts:233 ~ MauVePreviewComponent ~ this.sub=this.sharedService.changeEmitted$.subscribe ~ res:", res)
      if (res && res.type === 'updateSelectedTCCT') {
        this.changeSignSelectedTCCT(res.value)
      }
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung(),
      this.mauHoaDonService.GetNgayKyById(this.data.mauHoaDonId)
    ]);
  }

  getNguoiNopThue() {
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        this.salerInfo = res;
      });
  }

  async observableSocket() {
    this.wsSubscription = (await this.wsService.createObservableSocket('ws://localhost:15872/bksoft'))
      .subscribe(
        data => {
          let obj = JSON.parse(data);

          console.log('obj: ', obj);

          if (obj.TypeOfError == 0) {
            this.isLoading = false;
            this.data.ngayKy = this.data.ngayKy ? null : moment().format('YYYY-MM-DD HH:mm:ss');
            this.isDaKyDienTu = true;

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.KyDienTu,
              refType: RefType.MauHoaDon,
              thamChieu: 'Tên mẫu hóa đơn: ' + this.data.ten,
              moTaChiTiet: 'Ký mẫu hóa đơn thành công',
              refId: this.data.mauHoaDonId,
            }).subscribe();

            this.mauHoaDonService.UpdateNgayKy(this.data)
              .subscribe((res: any) => {
                if (res) {
                  // this.modalService.create({
                  //   nzContent: MessageBoxModalComponent,
                  //   nzMaskClosable: false,
                  //   nzClosable: false,
                  //   nzKeyboard: false,
                  //   nzWidth: 400,
                  //   nzStyle: { top: '100px' },
                  //   nzBodyStyle: { padding: '1px' },
                  //   nzComponentParams: {
                  //     msTitle: 'Ký điện tử mẫu hóa đơn',
                  //     msContent: 'Đã hoàn thành việc ký điện tử mẫu hóa đơn!',
                  //     msMessageType: MessageType.Info,
                  //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  //     msOnClose: () => { }
                  //   },
                  // });
                  this.message.success('Ký điện tử mẫu hóa đơn thành công',{
                    nzDuration : 5000
                  })
                }
              });
          } else {
            this.isLoading = false;

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.KyDienTu,
              refType: RefType.MauHoaDon,
              thamChieu: 'Tên mẫu hóa đơn: ' + this.data.ten,
              moTaChiTiet: 'Ký mẫu hóa đơn không thành công',
              refId: this.data.mauHoaDonId,
            }).subscribe();

            this.nhatKyThaoTacLoiService.Insert(this.data.mauHoaDonId, obj.Exception).subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: 400,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: 'Kiểm tra lại',
                msContent: `Ký mẫu hóa đơn không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => { }
              },
            });
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
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
              msOnWatch: () => {
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
                return;
              },
              msTitle: 'Kiểm tra lại',
              msContent: `Để ký điện tử mẫu hóa đơn, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
            },
            nzFooter: null
          });
        },
        () => console.log('The observable stream is complete')
      );


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

  changeSignSelectedTCCT(selectedTCCT: MauHoaDonTuyChonChiTiet, showHightLight = true) {
    console.log("change co chu", );
    if (selectedTCCT) {
      const container = this.doc.body as HTMLElement;

      let dataFieldName = LoaiChiTietTuyChonNoiDung[selectedTCCT.loaiChiTiet];
      if (selectedTCCT.customKey) {
        dataFieldName += selectedTCCT.customKey;
      }

      if (showHightLight) {
        const elementActive = container.querySelectorAll('.element-active');
        elementActive.forEach((ele: HTMLElement) => {
          ele.classList.remove('element-active');
        });

        const customField = container.querySelector(`[group-field="${LoaiTuyChinhChiTiet[selectedTCCT.loai]}"]`);
        if (customField) {
          const closest = customField.closest('.highlight-block');
          if (!closest.classList.contains('bg-picked-by-user')) {
            closest.classList.add('bg-picked-by-user');
          }
        }

        const elements = container.querySelectorAll(`[data-field="${dataFieldName}"]`);
        elements.forEach((element: HTMLElement) => {
          element.classList.add('element-active');
        });
      }

      let textLoaiContainer = null;
      if (selectedTCCT.loaiContainer === 1) {
        textLoaiContainer = 'edit-label';
      } else if (selectedTCCT.loaiContainer === 2) {
        textLoaiContainer = 'edit-value';
      } else if (selectedTCCT.loaiContainer === 3) {
        textLoaiContainer = 'edit-symbol';
      } else {
        textLoaiContainer = 'edit-label-en';
      }

      if (selectedTCCT.tuyChonChiTiet.coChu != null) {
        const element = container.querySelector(`[data-field="${dataFieldName}"] .${textLoaiContainer}`) as HTMLElement;
        console.log("🚀 ~ file: mau-ve-preview.component.ts:400 ~ MauVePreviewComponent ~ changeSignSelectedTCCT ~ element:", element)

        if (element) {
          element.style.fontSize = selectedTCCT.tuyChonChiTiet.coChu + 'px';
        }
      }

      if ((selectedTCCT.loai === LoaiTuyChinhChiTiet.ThongTinNguoiBan || selectedTCCT.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua) && selectedTCCT.tuyChonChiTiet.canTieuDe) {
        let groupField = container.querySelector(`[group-field="${LoaiTuyChinhChiTiet[selectedTCCT.loai]}"]`);
        const editLabels = groupField.querySelectorAll(`.${(this.data.loaiNgonNgu === 1 ? 'edit-label' : 'edit-label-en')}:not(.display-none):not(.no-width)`);
        const editValues = groupField.querySelectorAll('.edit-value:not(.header-title):not(.none-offset-left)');
        const twoDots = groupField.querySelectorAll('.two-dot:not(.display-none):not(.no-width)');

        editLabels.forEach((item: HTMLElement) => {
          item.style.width = 'initial';
        });
        twoDots.forEach((item: HTMLElement) => {
          item.style.width = 'initial';
        });

        if (selectedTCCT.tuyChonChiTiet.canTieuDe === 2) {
          let maxLeft = 0;
          const listLeftTwoDot = [];

          editValues.forEach((item: HTMLElement) => {
            if (item.offsetLeft > maxLeft) {
              maxLeft = item.offsetLeft;
            }
          });

          twoDots.forEach((item: HTMLElement) => {
            listLeftTwoDot.push(item.offsetLeft);
          });

          twoDots.forEach((item: HTMLElement, index: 0) => {
            item.style.width = (maxLeft - listLeftTwoDot[index]) + 'px';
          });
        } else if (selectedTCCT.tuyChonChiTiet.canTieuDe === 3) {
          let maxLeft = 0;
          const listLeftEditLabel = [];

          twoDots.forEach((item: HTMLElement) => {
            if (item.offsetLeft > maxLeft) {
              maxLeft = item.offsetLeft;
            }
          });

          editLabels.forEach((item: HTMLElement) => {
            listLeftEditLabel.push(item.offsetLeft);
          });

          editLabels.forEach((item: HTMLElement, index: 0) => {
            item.style.width = (maxLeft - listLeftEditLabel[index] - 4) + 'px';
          });
        }
      }

      if (selectedTCCT.tuyChonChiTiet.chuDam != null) {
        const element = container.querySelector(`[data-field="${dataFieldName}"] .${textLoaiContainer}`) as HTMLElement;

        if (element) {
          element.style.fontWeight = selectedTCCT.tuyChonChiTiet.chuDam ? 'bold' : 'normal';
        }
      }

      if (selectedTCCT.tuyChonChiTiet.chuNghieng != null) {
        const element = container.querySelector(`[data-field="${dataFieldName}"] .${textLoaiContainer}`) as HTMLElement;
        if (element) {
          element.style.fontStyle = selectedTCCT.tuyChonChiTiet.chuNghieng ? 'italic' : 'normal';
        }
      }

      if (selectedTCCT.tuyChonChiTiet.maSoThue != null) {
        const groupField = container.querySelector(`[group-field="${LoaiTuyChinhChiTiet[selectedTCCT.loai]}"]`);
        if (groupField) {
          if (selectedTCCT.tuyChonChiTiet.maSoThue) {
            groupField.classList.add('border-active');
          } else {
            groupField.classList.remove('border-active');
          }
        }

        const eTaxCodes = groupField.querySelectorAll('.e-tax-code');
        eTaxCodes.forEach((item: HTMLElement) => {
          if (selectedTCCT.tuyChonChiTiet.maSoThue) {
            item.classList.add('block-tax-code');
          } else {
            item.classList.remove('block-tax-code');
          }
        });

        const marginETaxCode = groupField.querySelectorAll('.margin-e-tax-code');
        marginETaxCode.forEach((item: HTMLElement) => {
          if (selectedTCCT.tuyChonChiTiet.maSoThue) {
            item.classList.add('width-4');
          } else {
            item.classList.remove('width-4');
          }
        });
      }

      if (selectedTCCT.tuyChonChiTiet.mauNenTieuDeBang != null) {
        const elements = container.querySelectorAll(`#tbDetail tr.tr-header td`);
        elements.forEach((item: HTMLElement) => {
          if (selectedTCCT.tuyChonChiTiet.mauNenTieuDeBang === '#ffffff') {
            item.style.removeProperty('background-color');
          } else {
            item.style.backgroundColor = selectedTCCT.tuyChonChiTiet.mauNenTieuDeBang;
          }
        });
      }

      if (selectedTCCT.tuyChonChiTiet.mauChu != null) {
        const element = container.querySelector(`[data-field="${dataFieldName}"] .${textLoaiContainer}`) as HTMLElement;
        if (element) {
          element.style.color = selectedTCCT.tuyChonChiTiet.mauChu;
        }
      }

      if (selectedTCCT.tuyChonChiTiet.canChu != null) {
        let element = null;
        if (selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanKiemTraDoiChieu || selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhatHanhBoi) {
          element = container.querySelector(`[data-field="${dataFieldName}"]`) as HTMLElement;
        } else if (selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai || selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu || selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu) {
          switch (this.savedData.loaiHoaDon) {
            case LoaiHoaDon.HoaDonGTGT:
              case LoaiHoaDon.TemVeGTGT:
              element = container.querySelector(`[data-field="InforWebsiteSearch"]`) as HTMLElement;
              break;
            case LoaiHoaDon.HoaDonBanHang:
              if (selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai || selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu) {
                element = container.querySelector(`[data-field="InforWebsiteSearch"]`) as HTMLElement
              } else {
                element = container.querySelector(`[data-field="${dataFieldName}"]`) as HTMLElement;
              }
              break;
            default:
              break;
          }
        } else {
          element = container.querySelector(`[data-field="${dataFieldName}"] .${textLoaiContainer}`) as HTMLElement;
        }
        if (element) {
          if (selectedTCCT.tuyChonChiTiet.canChu === 1) {
            element.style.textAlign = 'left';
          } else if (selectedTCCT.tuyChonChiTiet.canChu === 2) {
            element.style.textAlign = 'center';
          } else {
            element.style.textAlign = 'right';
          }
        }
      }

      if (selectedTCCT.tuyChonChiTiet.doRong != null) {
        const element = container.querySelector(`#tbDetail tr.tr-header [data-field="${dataFieldName}"]`) as HTMLElement;
        if (element) {
          element.style.width = `${selectedTCCT.tuyChonChiTiet.doRong}%`;
        }
      }
    }
  }

  ngOnDestroy() {
    this.wsSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  onLoad(iframe) {
    this.doc = iframe.contentDocument || iframe.contentWindow;
    this.createComponent();
  }

  createComponent() {
    const compFactory = this.resolver.resolveComponentFactory(MauVeDuLichComponent);
    this.vcRef.clear();
    this.compRef = this.vcRef.createComponent(compFactory);
    this.compRef.location.nativeElement.id = 'innerComp';

    var head = this.doc.head as HTMLElement;
    if (head) {
      head.innerHTML = IframeCSS();
    }

    this.doc.body.innerHTML = '';
    this.doc.body.appendChild(this.compRef.location.nativeElement);
    IframeScript(this.doc.body);
    this.doc.body.setAttribute('style', 'overflow: hidden; transform: scale(0.87); transform-origin: 0px 0px 0px;');

    this.loadComponent();
    this.hightlightAreaPickedByUser(this.doc.body);
  }

  loadComponent() {
    if (this.doc) {
      (<MauVeDuLichComponent>this.compRef.instance).inputData = this.savedData;
      (<MauVeDuLichComponent>this.compRef.instance).dinhDangHoaDon = this.dinhDangHoaDon;
      (<MauVeDuLichComponent>this.compRef.instance).changeInput();

      this.loadTemplate(this.data);
      this.hightlightAreaPickedByUser(this.doc.body);

      setTimeout(() => {
        this.loadStyleFromTuyChinhChiTiet(this.data.tuyChonChiTiets);
        this.isFirst = false;
      }, 0);
    }
  }

  loadStyleFromTuyChinhChiTiet(list: MauHoaDonTuyChonChiTiet[]) {
    list.forEach((parent: MauHoaDonTuyChonChiTiet) => {
      parent.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        this.changeSignSelectedTCCT(child, false);
      });
    });
  }

  ngAfterViewInit() {
    // this.getInnerHTML();
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.savedData = changes.data.currentValue;
      this.loadComponent();
    }
    if (changes.disabledEdit) {
      this.disabledEdit = changes.disabledEdit.currentValue;
      this.mauHoaDonService.GetNgayKyById(this.data.mauHoaDonId)
        .subscribe((res: any) => {
          this.isDaKyDienTu = res ? !!res.ngayKy : false;
        })
    }
  }

  createForm() {
    this.thietLapForm = this.fb.group({
      ten: [null],
      mauSo: [null],
      kyHieu: [null],
      soDongTrang: [null],
      imageLogo: [null],
      alignLogo: ['left'],
    });
  }

  sliceTagName(tag: string): string {
    if (tag) {
      const lastDot = tag.lastIndexOf('.');
      const fileName = tag.substring(0, lastDot);
      const tagLength = fileName.length;
      if (tagLength > 20) {
        const fileExtention = tag.substring(lastDot, tag.length);
        const result = fileName.slice(0, 14) + '...' + fileName.slice(tagLength - 3, tagLength) + fileExtention;
        return result;
      } else {
        return tag;
      }
    } else {
      return '';
    }
  }

  kyDienTu() {
    if (this.data.mauHoaDonId) {
      this.mauHoaDonService.GetByIdBasic(this.data.mauHoaDonId)
        .subscribe((res: any) => {
          if (res.ngayKy) {
            this.mauHoaDonService.CheckXoaKyDienTu(this.data.mauHoaDonId)
              .subscribe((res: any) => {
                if (res) {
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msMessageType: MessageType.Info,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: `Xóa ký điện tử`,
                      msContent: 'Mẫu hóa đơn đã phát sinh bộ ký hiệu hóa đơn sử dụng. Bạn chỉ được xóa ký điện tử khi trạng thái sử dụng của bộ ký hiệu hóa đơn là &lt;Ngừng sử dụng&gt;.',
                      msOnClose: () => {
                      },
                    }
                  });
                } else {
                  this.sendSign();
                }
              });
          } else {
            this.sendSign();
          }
        });
    } else {
      this.sendSign();
    }
  }

  sendSign() {
    this.isLoading = true;
    this.mauHoaDonService.GetFileToSign()
      .subscribe((res: any) => {
        this.sendMessageWebsocket(res.result);
      });
  }

  sendMessageWebsocket(dataXML: any) {
    let msg: any = null;

    if (this.serials.length > 0) {
      msg = {
        mLTDiep: MLTDiep.TDCDLHDKMDCQThue,
        mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
        dataXML,
        isSignBKH: true,
        serials: this.serials,
        isCompression: false,
        tTNKy: {
          mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
          ten: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          diaChi: this.salerInfo.diaChi == null ? '' : this.salerInfo.diaChi,
          sDThoai: this.salerInfo.soDienThoaiLienHe == null ? '' : this.salerInfo.soDienThoaiLienHe,
          tenP1: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          tenP2: '',
        }
      };
    } else {
      msg = {
        type: 1004,
        mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
        dataXML,
        nBan: {
          mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
          ten: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          diaChi: this.salerInfo.diaChi == null ? '' : this.salerInfo.diaChi,
          sDThoai: this.salerInfo.soDienThoaiLienHe == null ? '' : this.salerInfo.soDienThoaiLienHe,
          tenP1: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          tenP2: '',
        }
      };
    }

    console.log('msg: ', msg);

    const isConnected = this.wsService.sendMessage(JSON.stringify(msg));
    if (!isConnected) {
      if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
        this.observableSocket();
      } else {
        this.kiMem(msg)
      }
    }
  }
  async kiMem(dataKy: any) {
    this.wsSubscription = (await this.wsService.createObservableSocket('', dataKy)).subscribe((rs: any) => {
      let obj = rs;
      console.log('obj2: ', obj);
      if (obj.TypeOfError == 0) {
        this.isLoading = false;
        this.data.ngayKy = this.data.ngayKy ? null : moment().format('YYYY-MM-DD HH:mm:ss');
        this.isDaKyDienTu = true;

        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.KyDienTu,
          refType: RefType.MauHoaDon,
          thamChieu: 'Tên mẫu hóa đơn: ' + this.data.ten,
          moTaChiTiet: 'Ký mẫu hóa đơn thành công',
          refId: this.data.mauHoaDonId,
        }).subscribe();

        this.mauHoaDonService.UpdateNgayKy(this.data)
          .subscribe((res: any) => {
            if (res) {
              // this.modalService.create({
              //   nzContent: MessageBoxModalComponent,
              //   nzMaskClosable: false,
              //   nzClosable: false,
              //   nzKeyboard: false,
              //   nzWidth: 400,
              //   nzStyle: { top: '100px' },
              //   nzBodyStyle: { padding: '1px' },
              //   nzComponentParams: {
              //     msTitle: 'Ký điện tử mẫu hóa đơn',
              //     msContent: 'Đã hoàn thành việc ký điện tử mẫu hóa đơn!',
              //     msMessageType: MessageType.Info,
              //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              //     msOnClose: () => { }
              //   },
              // });
              this.message.success('Ký điện tử mẫu hóa đơn thành công',{
                nzDuration : 5000
              })
            }
          });
      } else {
        this.isLoading = false;

        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.KyDienTu,
          refType: RefType.MauHoaDon,
          thamChieu: 'Tên mẫu hóa đơn: ' + this.data.ten,
          moTaChiTiet: 'Ký mẫu hóa đơn không thành công',
          refId: this.data.mauHoaDonId,
        }).subscribe();

        this.nhatKyThaoTacLoiService.Insert(this.data.mauHoaDonId, obj.Exception).subscribe();

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: 'Kiểm tra lại',
            msContent: `Ký mẫu hóa đơn không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
      }
    }, err => {
    })
    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res && res.type === 'updateSelectedTCCT') {
        this.changeSignSelectedTCCT(res.value)
      }
    });
  }

  zoomIn() {
    // document.documentElement.style.setProperty
  }

  zoomOut() {

  }

  loadEmptyArrays() {
    const array = new Array(this.savedData.soDongTrang).fill(0);
    this.emptyArrays = [...array];
  }

  changeDinhDangHoaDon(event: any) {
    this.dinhDangHoaDon = event;
    this.loadComponent();
    this.emitDinhDangHoaDon(event);
  }

  loadBackgroundImage(data: any, body: HTMLElement) {
    var bgParentJquery = $("#iframeDynamic").contents().find(".bg-template-parent");

    var bgChildJquery = bgParentJquery.find('.bg-template');

    if (!data.hinhNenTaiLen) {
      this.blockBackground = false;
      bgParentJquery.removeAttr('style');
      bgParentJquery.css({
        'z-index': '-1',
        'display': 'none'
      });
      bgChildJquery.removeAttr('style');
    }

    if (data.blockBackground && (!data.hinhNenTaiLen || this.blockBackground)) {
      if (data.hinhNenTaiLen) {
        bgChildJquery.css({
          'opacity': data.opacityHinhNenTaiLen,
        });
      }
      return;
    }

    if (data.hinhNenTaiLen) {
      bgParentJquery.addClass('highlight-logo');
      var container = body.querySelector('.frame-template-ve') as HTMLElement;
      var centerX = 0;
      var centerY = 0;

      if (data.topHinhNenTaiLen != null && data.leftHinhNenTaiLen != null) {
        centerX = data.leftHinhNenTaiLen;
        centerY = data.topHinhNenTaiLen;
      } else {
        centerX = container.clientWidth / 2 - (data.widthHinhNenTaiLen / 2);
        centerY = (container.clientHeight / 2) - (data.heightHinhNenTaiLen / 2);
        this.data.topHinhNenTaiLen = centerY;
        this.data.leftHinhNenTaiLen = centerX;
        this.emitValueChangesEvent();
      }

      bgParentJquery.css({
        'z-index': data.loaiHinhNenRieng === 1 ? '-2' : '1000',
        'display': 'block',
        'transform': 'none',
        'width': `250px`,
        'height': `250px`,
        'top': `${centerY}px`,
        'left': `${centerX}px`,
        'position': `absolute`,
      });

      var bgChildJquery = bgParentJquery.find('.bg-template');
      bgChildJquery.css({
        'opacity': data.opacityHinhNenTaiLen,
        'background-image': `url(${data.hinhNenTaiLen})`
      })

      const $this = this;

      bgParentJquery.draggable({
        scroll: false,
        stop: (event: any, ui: any) => {
          $this.data.topHinhNenTaiLen = ui.position.top;
          $this.data.leftHinhNenTaiLen = ui.position.left;
          $this.emitValueChangesEvent();
        },
        drag: function (event, ui) {
          var target = $(event.target); // cái ảnh nền

          if (ui.position.top < 0) {
            ui.position.top = 0;
          }

          if (ui.position.top + target.height() >= container.clientHeight) {
            ui.position.top = container.clientHeight - target.height() - 1;
          }

          if (ui.position.left < 0) {
            ui.position.left = 0;
          }

          if (ui.position.left + target.width() >= container.clientWidth) {
            ui.position.left = container.clientWidth - target.width() - 1;
          }
        },
      }).resizable({
        maxWidth: body.offsetWidth,
        stop: function (event: any, ui: any) {
          $this.data.widthHinhNenTaiLen = ui.size.width;
          $this.data.heightHinhNenTaiLen = ui.size.height;
          $this.emitValueChangesEvent();
        }
      });

      var uiSE = bgParentJquery.find('.ui-resizable-se');
      uiSE.css({
        'z-index': 90,
        'position': 'absolute',
        'width': '8px',
        'height': '8px',
        'background': 'rgb(20, 146, 230)',
        'right': '-5px',
        'bottom': '-5px',
        'cursor': 'se-resize',
        'border': '1px solid rgb(255, 255, 255)'
      });
      this.blockBackground = true;
    }
  }

  toggleUIJquery(element: HTMLElement, enable: boolean, position: any) {
    if (enable === true && this.data.position === position) {
      element.style.zIndex = '99';
      element.classList.add('highlight-logo');
      element.classList.remove('ui-resizable-disabled');
      element.classList.remove('ui-draggable-disabled');

      var uiResizableSe = element.querySelector('.ui-resizable-se') as HTMLElement;
      if (uiResizableSe) {
        uiResizableSe.style.display = 'block';
      }
    } else {
      if (this.data.position === 3 && position === 1) {
        element.style.zIndex = '99';
      } else {
        element.style.zIndex = '-1';
      }
      element.classList.remove('highlight-logo');
      element.classList.add('ui-resizable-disabled');
      element.classList.add('ui-draggable-disabled');

      var uiResizableSe = element.querySelector('.ui-resizable-se') as HTMLElement;
      if (uiResizableSe) {
        uiResizableSe.style.display = 'none';
      }
    }
  }

  loadLogoImage(data: any, container: any) {
    const viTriLogo = data.viTriLogo;
    const element = container.querySelector(`.logo-left .logo-template-content`) as HTMLElement;

    if (this.data.position !== 1) {
      this.toggleUIJquery(element, false, 1);
      return;
    }

    this.toggleUIJquery(element, true, 1);
    var leftLogo = $("#iframeDynamic").contents().find(".logo-left .logo-template-content");
    var rightLogo = $("#iframeDynamic").contents().find(".logo-right .logo-template-content");

    if (data.anhLogo) {
      element.style.display = 'block';
      var jquery = viTriLogo === 1 ? leftLogo : rightLogo;
      if (viTriLogo === 1) {
        leftLogo.show();
        rightLogo.hide();
      } else {
        rightLogo.show();
        leftLogo.hide();
      }

      const $this = this;

      jquery.css({
        'z-index': '1',
        'display': 'block',
        'width': data.widthLogo + 'px',
        'height': data.heightLogo + 'px',
        'left': data.leftLogo + 'px',
        'top': data.topLogo + 'px',
        'background-image': `url(${data.anhLogo})`
      }).draggable({
        stop: (event: any, ui: any) => {
          $this.data.topLogo = ui.position.top;
          $this.data.leftLogo = ui.position.left;
          $this.emitValueChangesEvent();
        }
      }).resizable({
        stop: function (event: any, ui: any) {
          $this.data.widthLogo = ui.size.width;
          $this.data.heightLogo = ui.size.height;
          $this.emitValueChangesEvent();
        }
      });

      var uiSE = jquery.find('.ui-resizable-se');
      uiSE.css({
        'display': this.data.position === 1 ? 'block' : 'none',
        'z-index': 90,
        'position': 'absolute',
        'width': '8px',
        'height': '8px',
        'background': 'rgb(20, 146, 230)',
        'right': '-5px',
        'bottom': '-5px',
        'cursor': 'se-resize',
        'border': '1px solid rgb(255, 255, 255)'
      });
    } else {
      element.style.display = 'none';
    }
  }

  loadTemplate(data: any) {
    if (!data) {
      return;
    }

    var container = this.doc.body as HTMLElement;
    this.setFontFamily(data.fontChu, container);
    this.loadLogoImage(data, container);
    this.setBackground(data, container);
    this.loadBackgroundImage(data, container);
    this.detectHienThiQRCode(data.isHienThiQRCode, container);
    this.detectChangeClickOutside(data, container);
    this.initHightlightAreaPickedByUser(container);
    this.setHightlightBlock(data, container);
  }

  initHightlightAreaPickedByUser(container: any) {
    if (!this.data.loaiTuyChonChiTiet && this.data.position === 3) {
      setTimeout(() => {
        this.clearBgPickedByUser(container);
        const groupField = container.querySelector(`[group-field="${this.listLoaiTuyChinhChiTiet[0]}"]`) as HTMLElement;
        groupField.closest('.highlight-block').classList.add('bg-picked-by-user');
        this.emitPickedFieldByUser(LoaiTuyChinhChiTiet.ThongTinNguoiBan);
      }, 0);
    }
  }

  hightlightAreaPickedByUser(container: HTMLElement) {
    setTimeout(() => {
      this.listLoaiTuyChinhChiTiet.forEach((item: any) => {
        const groupField = container.querySelector(`[group-field="${item}"]`) as HTMLElement;
        if (groupField) {
          groupField.addEventListener('click', () => {
            if (this.data.position === 3) {
              this.clearBgPickedByUser(this.doc.body);
              groupField.closest('.highlight-block').classList.add('bg-picked-by-user');
              this.emitPickedFieldByUser(LoaiTuyChinhChiTiet[item]);
            }
          });
        }
      });
    }, 0);
  }

  clearBgPickedByUser(container: any) {
    const highlightBlocks = container.querySelectorAll('.highlight-block');

    highlightBlocks.forEach((item: HTMLElement) => {
      item.classList.remove('bg-picked-by-user');
      const chilrenElement = item.querySelectorAll('.element-active');
      chilrenElement.forEach((child: HTMLElement) => {
        child.classList.remove('element-active');
      });
    });
  }

  setHightlightBlock(data: any, container: HTMLElement) {
    const bgPickedByUser = container.querySelectorAll('.bg-picked-by-user');
    // const templateTable = container.querySelector('.template-table') as HTMLElement;

    // if (data.position === 1) {
    //   templateTable.style.display = 'block';
    // } else {
    //   templateTable.style.display = 'none';
    // }

    if (data.position !== 3) {
      bgPickedByUser.forEach((item: HTMLElement) => {
        item.classList.remove('bg-picked-by-user');
        const elementActives = item.querySelectorAll('.element-active');
        elementActives.forEach((itemActive: HTMLElement) => {
          itemActive.classList.remove('element-active');
        });
      });
    }
  }

  detectChangeClickOutside(data: any, container: HTMLElement) {
    var container = container.querySelector('.container') as HTMLElement;
    var $this = this;

    var bgTemplateParent = container.querySelector('.bg-template-parent') as HTMLElement;
    if (this.data.position === 1) {
      this.toggleUIJquery(bgTemplateParent, false, 1);
    }

    container.addEventListener('click', () => {
      $this.toggleUIJquery(bgTemplateParent, true, 2);
    });

    document.addEventListener('click', function (event: any) {
      $this.toggleUIJquery(bgTemplateParent, false, 2);
    });
  }

  detectHienThiQRCode(value: any, container: any) {
    var buyerInfo = container.querySelector('.buyer-infor') as HTMLElement;
    var qrcode = container.querySelector('.qrcode-parent') as HTMLElement;

    if (value) {
      buyerInfo.style.width = '83%';
      qrcode.classList.remove('display-none');
    } else {
      buyerInfo.style.width = '100%';
      qrcode.classList.add('display-none');
    }
  }

  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  setFontFamily(value: any, container: any) {
    setTimeout(() => {
      var elements = container.querySelectorAll('div, span');
      if (elements) {
        elements.forEach((element: HTMLElement) => {
          element.style.fontFamily = value;
        });
      }
    }, 0);
  }

  setBackground(data: any, container: any) {
    var background = container.querySelector('.bg-default') as HTMLElement;
    if (background) {
      background.style.opacity = `${data.opacityHinhNenMacDinh}`;
    }
  }

  emitValueChangesEvent() {
    this.sharedService.emitChange({
      type: "updatePositionSizeImage",
      value: this.data
    });
  }

  emitPickedFieldByUser(type) {
    this.sharedService.emitChange({
      type: "updatePickedFieldByUser",
      value: type
    });
  }

  emitDinhDangHoaDon(type) {
    this.sharedService.emitChange({
      type: "updateDinhDangHoaDon",
      value: type,
      data: this.data
    });
  }
}
