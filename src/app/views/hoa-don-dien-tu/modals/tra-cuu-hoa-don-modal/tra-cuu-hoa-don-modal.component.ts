import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { GuiHoaDonModalComponent } from '../gui-hoa-don-modal/gui-hoa-don-modal.component';
import { saveAs } from "file-saver";
import { ChuyenThanhHoaDonGiayModalComponent } from '../chuyen-thanh-hoa-don-giay-modal/chuyen-thanh-hoa-don-giay-modal.component';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { generateUUIDV4, getNoiDungLoiPhatHanhHoaDon, mathRound } from 'src/app/shared/SharedFunction';
import { FormatPrice } from 'src/app/shared/formatPrice';
import { ChiTietThongTinChungThuSoNguoiBanModalComponent } from '../chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal/chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal.component';
import { WebSocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { formatNumber } from '@angular/common';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';

@Component({
  selector: 'app-tra-cuu-hoa-don-modal',
  templateUrl: './tra-cuu-hoa-don-modal.component.html',
  styleUrls: ['./tra-cuu-hoa-don-modal.component.scss']
})
export class TraCuuHoaDonModalComponent implements OnInit {
  @Input() fileUrl: any;
  @Input() data: any;
  @Input() ptChuyenDL: number;
  @Input() isFromPhone : boolean;
  domain = this.env.apiUrl;
  ActivedModal: any;
  permission: boolean;
  thaoTacs: any[]=[];
  ddtp: DinhDangThapPhan = new DinhDangThapPhan();
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  images = [
    { source: this.env.apiUrl + "/images/img/bannerA.png", url: 'https://hoadondientu.pmbk.vn/'},
    { source: this.env.apiUrl + "/images/img/bannerB.png", url: 'https://phanmemketoan.pmbk.vn/'},
  ];
  webSubcription: Subscription;
  loading: boolean = false;
  ttChung: any;
  trangThaiQuyTrinh = TrangThaiQuyTrinh;
  constructor(
    private message: NzMessageService,
    private modal: NzModalRef,
    private env: EnvService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private sharedService: SharedService,
    private webSocket: WebSocketService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
  ) {

  }

  ngOnInit() {
    this.ttChung = {
      PBan: '2.0.0',
      MNGui: `${this.env.taxCodeTCGP}`,
      MNNhan: this.env.taxCodeTCTN,
      MLTDiep: 200,
      MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
      MTDTChieu: '',
      MST: this.data.maSoThue,
      SLuong: 1
    };
    console.log(this.fileUrl);
    console.log(this.images);
  }

  downloadPDF(){
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.TaiHoaDon_TraCuu(res).subscribe((rs: any) => {
        console.log(res);
        const pathPrintPDF = this.env.apiUrl + `/${rs.filePDF}`;
        var fileName = rs.pdfName;
        this.sharedService.DownloadPdf(pathPrintPDF).subscribe((resPDF: any)=>{
          saveAs(resPDF, fileName);
          this.message.remove(id);
        });

      }, (err) => {
        this.message.warning("Lỗi khi tải hóa đơn");
        this.message.remove(id);
      });

    }, (err) => {
      this.message.warning("Lỗi khi tải hóa đơn");
      this.message.remove(id);
    });
  }

  downloadXML(){
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.TaiHoaDon_TraCuu(res).subscribe((rs: any) => {
        const pathPrintXML = this.env.apiUrl + `/${rs.fileXML}`;
        var fileName = rs.xmlName;
        this.sharedService.DownloadPdf(pathPrintXML).subscribe((resPDF: any)=>{
          saveAs(resPDF, fileName);
          this.message.remove(id);
        });

      }, (err) => {
        this.message.warning("Lỗi khi tải hóa đơn");
        this.message.remove(id);
      });

    }, (err) => {
      this.message.warning("Lỗi khi tải hóa đơn");
      this.message.remove(id);
    });
  }

  taiBoCai(){
    const link = document.createElement('a');
    link.href = `${this.env.apiUrl}/${this.urlTools}`;
    link.download = 'BKSOFT-KYSO-SETUP.zip';
    link.click();
  }

  traCuuThongTinNguoiBan(){
    const link = document.createElement('a');
    link.href = `http://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp`;
    link.target = '_blank';
    link.click();
  }

  id: any = null;
  async xemCTS(type: number){
    this.id = this.message.loading('Đang tra cứu thông tin chứng thư số, vui lòng chờ...', { nzDuration: 0 }).messageId;
    if(this.webSubcription && this.webSubcription.closed || !this.webSubcription){
      this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      });
    }
    this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((res: any) => {
      var params = {
        hoaDonDienTuId: res.hoaDonDienTuId,
        type: type
      }
      this.hoaDonDienTuService.FindSignatureElement(params).subscribe((info: any)=>{
        if(!info){
          var errorMsg = `Không tìm thấy thông tin chứng thư số ${type == 1 ? "người bán" : type == 2 ? "Cơ quan thuế" : "người mua"}`;
          if(this.id) this.message.remove(this.id);
          this.message.error(errorMsg);
          return;
        }
        let msg = {
          mLTDiep: 60,
          cert: info
        };

        // Sending
        const rsSend = this.webSocket.sendMessage(JSON.stringify(msg));
        if(this.id) this.message.remove(this.id);
      })
    });
  }

  sendMessageToServer(orderData: any) {
    let domain = this.env.apiUrl;
    //let domain = 'https://hdbk.pmbk.vn';
    if (!this.ttChung) {
      return;
    }
    orderData.TTChungThongDiep = this.ttChung;
    orderData.buyerSigned = true;
    this.hoaDonDienTuService.ConvertHoaDonToFilePDF_TraCuu(orderData).subscribe((rs: any) => {
      console.log(rs);
      if (rs.filePDF != "" && rs.fileXML != "") {
        orderData.fileChuaKy = rs.filePDF;
        orderData.xMLChuaKy = rs.fileXML;
        orderData.dataXML = rs.xmlBase64;
        orderData.dataPDF = rs.pdfBase64;
        this.hoaDonDienTuService.GetById_TraCuu(orderData.hoaDonDienTuId).subscribe((hd: any) => {
          const user = JSON.parse(localStorage.getItem('currentUser'));

          orderData.actionUser = user;
          orderData.kyHieuShow = `${hd.mauSo}${hd.kyHieu}`
          orderData.ngayHoaDonShow = moment(hd.ngayHoaDon).format("DD/MM/YYYY");
          orderData.tongTienThanhToanShow = `${formatNumber(Number(hd.tongTienThanhToan), 'vi-VN', '1.0-0')} ${hd.maLoaiTien}`;
          this.data = orderData;

          let msg: any = {
            mLTDiep: MLTDiep.TDCDLHDKMDCQThue,
            mst: hd.maSoThue == null ? '' : hd.maSoThue,
            dataXML: rs.xmlBase64,
            isNMua: true,
            isCompression: true,
            tTNKy: {
              mst: hd.maSoThue == null ? '' : hd.maSoThue,
              ten: hd.tenKhachHang == null ? '' : hd.tenKhachHang,
              diaChi: hd.diaChi == null ? '' : hd.diaChi,
              sDThoai: hd.soDienThoaiNguoiMuaHang == null ? '' : hd.soDienThoaiNguoiMuaHang,
              tenP1: hd.tenKhachHang == null ? '' : hd.tenKhachHang,
              tenP2: '',
            }
          };

          // Sending
          const rsSend = this.webSocket.sendMessage(JSON.stringify(msg));
        });

      }
    });
  }

  nguoiMuaKyDienTu() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      let obj = JSON.parse(rs);

      obj.hoaDonDienTuId = this.data.hoaDonDienTuId;
      obj.hoaDon = this.data;
      obj.dataXML = obj.XMLSigned;
      obj.dataPDF = this.data.dataPDF;
      obj.isBuyerSigned = true;

      console.log('obj: ', obj);

      if (obj.TypeOfError === 0 && obj.MLTDiep != 60) {
        this.hoaDonDienTuService.GateForWebSocket_TraCuu(obj).subscribe(
          (res) => {
            this.loading = false;
            if (res) {
              this.message.success("Ký thành công");
              this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((hd: any)=>{
                hd.kyHieuShow = `${hd.mauSo}${hd.kyHieu}`
                hd.ngayHoaDonShow = moment(hd.ngayHoaDon).format("DD/MM/YYYY");
                hd.tongTienThanhToanShow = `${formatNumber(Number(hd.tongTienThanhToan), 'vi-VN', '1.0-0')} ${hd.maLoaiTien}`;
                this.data = hd;
              })
            }
            else{
              this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

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
                  msContent: `Ký hóa đơn không thành công.
                  <br>Nội dung lỗi: Lỗi hệ thống.
                  <br>Vui lòng kiểm tra lại!`,
                },
                nzFooter: null
              });
            }
          },
          err => {
            this.modal.destroy(false);
          }
        );
      } else {
        this.loading = false;

        this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, obj.Exception).subscribe();

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
            msContent: `Ký hóa đơn không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
      }
    }, err => {
      this.loading = false;
      this.modalService.create({
        nzTitle: "<strong>Hãy cài đặt công cụ ký số</strong>",
        nzContent: "Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại." +
          "<br>Để ký điện tử lên hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.",
        nzOkType: "primary",
        nzOkText: "Tải bộ cài",
        nzOnOk: () => {
          const link = document.createElement('a');
          link.href = `${this.env.apiUrl}/${this.urlTools}`;
          link.download = 'BKSOFT-KYSO-SETUP.zip';
          link.click();
        },
        nzCancelText: "Đóng",
        nzOnCancel: () => {
          this.modal.destroy(false);
        }
      });
    });
    this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe(
      (result: any) => {
        if (result) {
          this.sendMessageToServer(result);
        }
      }
    );
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if($event.keyCode == 27)
    {
      if(this.ActivedModal == null) this.modal.destroy();
    }
  }
}
