import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { DownloadFile, getNoiDungLoiPhatHanhHoaDon } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import * as moment from 'moment';
import { MessageInv } from 'src/app/models/messageInv';
import { EnvService } from 'src/app/env.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { SharedService } from 'src/app/services/share-service';
import { ExportMauHoaDonModalComponent } from '../add-edit-mau-hoa-don-modal/export-mau-hoa-don-modal/export-mau-hoa-don-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';

@Component({
  selector: 'app-xem-mau-hoa-don-modal',
  templateUrl: './xem-mau-hoa-don-modal.component.html',
  styleUrls: ['./xem-mau-hoa-don-modal.component.scss']
})
export class XemMauHoaDonModalComponent implements OnInit {
  @Input() id: any;
  @Input() kyHieu: any;
  @Input() kySo = true;
  @Input() fromBoKyHieuHoaDon: any;
  @Input() nhatKyXacThucBoKyHieuId: any;
  @Input() isOpenBoKyHieu = false;
  link: any;
  templateType = 0;
  spinning = false;
  data = null;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  wsSubscription: Subscription;
  blockDownloadTool = true;
  salerInfo = null;
  serials = [];

  constructor(
    private env: EnvService,
    private modalService: NzModalService,
    private wsService: WebSocketService,
    private modalRef: NzModalRef,
    private mauHoaDonService: MauHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private sharedService: SharedService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
  ) { }

  ngOnInit() {
    this.spinning = true;
    if (this.isOpenBoKyHieu !== true) {
      this.observableSocket();
    }
    this.forkJoin().subscribe((res: any[]) => {
      this.data = res[0];
      this.link = window.URL.createObjectURL(res[1]);
      this.salerInfo = res[2];
      this.serials = res[3].map(x => x.seri);
      this.spinning = false;
    });
  }

  async observableSocket() {
    this.wsSubscription = (await this.wsService.createObservableSocket('ws://localhost:15872/bksoft'))
      .subscribe(
        data => {
          let obj = JSON.parse(data);

          console.log('obj: ', obj);

          if (obj.TypeOfError === 0) {
            this.spinning = false;
            this.data.ngayKy = this.data.ngayKy ? null : moment().format('YYYY-MM-DD');

            this.mauHoaDonService.UpdateNgayKy(this.data)
              .subscribe((res: any) => {
                if (res) {
                  this.sharedService.emitChange({
                    type: 'loadData',
                    value: true
                  });

                  if (this.fromBoKyHieuHoaDon) {
                    this.kySo = !this.data.ngayKy;
                  }

                  this.loadFile();
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
                      msTitle: `Thông báo`,
                      msContent: this.data.ngayKy ? 'Ký thành công!' : 'Xóa ký thành công!',
                      msOnClose: () => {
                      },
                    }
                  });
                }
              });
          } else {
            this.spinning = false;

            this.nhatKyThaoTacLoiService.Insert(this.id, obj.Exception).subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: `Kiểm tra lại`,
                msContent: `Ký mẫu hóa đơn không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
                msOnClose: () => {
                },
              }
            });
          }
        },
        err => {
          this.spinning = false;

          if (this.blockDownloadTool) {
            this.blockDownloadTool = false;
            return;
          }

          this.modalService.create({
            nzTitle: "<strong>Hãy cài đặt công cụ ký số</strong>",
            nzContent: "Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại." +
              "<br>Để ký biên bản điều chỉnh, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.",
            nzOkType: "primary",
            nzOkText: "Tải bộ cài",
            nzMaskClosable: false,
            nzClosable: false,
            nzOnOk: () => {
              const link = document.createElement('a');
              link.href = `${this.env.apiUrl}/${this.urlTools}`;
              link.download = 'BKSOFT-KYSO-SETUP.zip';
              link.click();
            },
            nzCancelText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            nzOnCancel: () => { }
          });
        },
        () => console.log('The observable stream is complete')
      );
  }

  loadFile() {
    this.spinning = true;

    if (this.nhatKyXacThucBoKyHieuId) {
      this.mauHoaDonService.PreviewPdfOfXacThuc(this.nhatKyXacThucBoKyHieuId, this.templateType)
        .subscribe((res: any) => {
          this.link = window.URL.createObjectURL(res);
          this.spinning = false;
        });
    } else {
      this.mauHoaDonService.PreviewPdf(this.id, this.templateType, this.kyHieu)
        .subscribe((res: any) => {
          this.link = window.URL.createObjectURL(res);
          this.spinning = false;
        });
    }
  }

  forkJoin() {
    return forkJoin([
      this.mauHoaDonService.GetNgayKyById(this.id),
      this.nhatKyXacThucBoKyHieuId ?
        this.mauHoaDonService.PreviewPdfOfXacThuc(this.nhatKyXacThucBoKyHieuId, this.templateType) :
        this.mauHoaDonService.PreviewPdf(this.id, this.templateType, this.kyHieu),
      this.hoSoHDDTService.GetDetail(),
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung()
    ]);
  }

  kyDienTu() {
    if (this.data.ngayKy) {
      this.mauHoaDonService.CheckXoaKyDienTu(this.id)
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
            this.spinning = true;

            this.mauHoaDonService.GetFileToSign()
              .subscribe((res: any) => {
                this.sendMessageWebsocket(res.result);
              });
          }
        });
    } else {
      this.spinning = true;

      this.mauHoaDonService.GetFileToSign()
        .subscribe((res: any) => {
          this.sendMessageWebsocket(res.result);
        });
    }
  }

  sendMessageWebsocket(dataXML: any) {
    let msg: any = null;

    if (this.serials.length > 0) {
      msg = {
        mLTDiep: MLTDiep.TDKMHDon,
        mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
        dataXML,
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

    // Sending
    const isConnected = this.wsService.sendMessage(JSON.stringify(msg));
    if (!isConnected) {
      this.observableSocket();
    }
  }

  xuatKhau() {
    this.modalService.create({
      nzTitle: 'Xuất mẫu hóa đơn',
      nzContent: ExportMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 400,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data: this.data
      },
      nzFooter: null
    });
  }

  closeModal() {
    this.modalRef.destroy();
  }

  changeType(event: any) {
    this.templateType = event;
    this.loadFile();
  }

  downloadFile(type: any) {
    this.spinning = true;
    this.mauHoaDonService.DownloadFile(this.id, this.templateType, this.kyHieu, type)
      .subscribe((res: any) => {
        let fileName;
        if (type === 0) {
          fileName = 'Hoa_don_mau.pdf';
        } else if (type === 1) {
          fileName = 'Hoa_don_mau.doc';
        } else {
          fileName = 'Hoa_don_mau.docx';
        }
        this.spinning = false;
        const url = window.URL.createObjectURL(res);
        DownloadFile(url, fileName);
      });
  }
}
