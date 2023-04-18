import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { WebSocketService } from 'src/app/services/websocket.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';

@Component({
  selector: 'app-xac-nhan-to-khai-mau-01-modal',
  templateUrl: './xac-nhan-to-khai-mau-01-modal.component.html',
  styleUrls: ['./xac-nhan-to-khai-mau-01-modal.component.scss']
})
export class XacNhanToKhaiMau01ModalComponent implements OnInit {
  @Input() data: any;
  @Input() dTKhai: any;
  mainForm: FormGroup;
  dropdownOverlayStyle={
    width: '100px'
  }
  ActivedModal: any=null;
  xmlFileName: string;
  isAccept: boolean;
  dataReader: any;
  _xmlExtensions = ['.xml'];
  fileData: FormData;
  signing = false;
  spinning = false;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  tDiepGui: any;

  constructor(
    private message: NzMessageService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private webSocket: WebSocketService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private env: EnvService
  ){
  }

  ngOnInit(){
  }

  ImportFile(event: any) {
    const files = event.target.files;

    if (files && files[0]) {
      this.isAccept = false;
      this.dataReader = null;
      if (!this.hasExtension(event.target.files[0].name, this._xmlExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!this.hasFileSize(event.target.files[0].size)) {
        this.message.error('Dung lượng file vượt quá 10MB.');
        return;
      }

      this.fileData = new FormData();
      this.xmlFileName = event.target.files[0].name;
      for (let i = 0; i < files.length; i++) {
        this.fileData.append('files', files[i]);
        this.fileData.append('fileName', event.target.files[0].name);
        this.fileData.append('fileSize', event.target.files[0].size);
      }
      this.quyDinhKyThuatService.VerifyFile103(this.fileData).subscribe((rs: boolean)=>{
        // if(!rs){
        //   this.modalService.create({
        //     nzContent: MessageBoxModalComponent,
        //     nzMaskClosable: false,
        //     nzClosable: false,
        //     nzKeyboard: false,
        //     nzStyle: { top: '100px' },
        //     nzBodyStyle: { padding: '1px' },
        //     nzWidth: '450px',
        //     nzComponentParams: {
        //       msMessageType: MessageType.Warning,
        //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        //       msTitle: 'Kiểm tra lại',
        //       msContent: `Cấu trúc file XML không còn nguyên vẹn (có thể file đã bị chỉnh sửa sau khi ký điện tử). Vui lòng kiểm tra lại.`,
        //     },
        //     nzFooter: null
        //   });

        //   this.xmlFileName = null;
        //   return;
        // }
      })
    }
  }

  changeAccept(event: boolean){
    if(event){
      this.quyDinhKyThuatService.GetThongDiep103FromFile(this.fileData).subscribe((rs: any)=>{
        if(rs){
          if(rs.dltBao.mSo != '01/TB-ĐKĐT'){
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
                msContent: `File xml tải lên không phải Thông điệp 103 - Thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử. Vui lòng kiểm tra lại.`,
              },
              nzFooter: null
            });

            this.isAccept = !event;
            this.xmlFileName = null;
            return;
          }
          else this.dataReader = rs;
        }
      })
    }
  }



  eSign() {
    this.signing = true;
    this.spinning = true;

    this.quyDinhKyThuatService.CheckThongDiep103(this.fileData).subscribe((rs: number) => {
      console.log(rs);
      if(rs != 0){
        if(rs == 1){
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
              msContent: `Thời gian CQT chấp nhận trên tờ khai nhập vào phải lớn hơn thời gian CQT chấp nhận trên tờ khai mới nhất của hệ thống. Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });

          this.spinning = false;
          this.signing = false;
          return;
        }
        else if(rs == 2){
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
              msContent: `Mã số thuế trong file xml tờ khai nhập khẩu khác với mã số thuế của hệ thống. Vui lòng kiểm tra lại.`,
            },
            nzFooter: null
          });

          this.spinning = false;
          this.signing = false;
          return;
        }
      }

      if(this.data.dltKhai.ndtKhai.dsctssDung.length == 0){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: 450,
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Bạn chưa chọn/nhập chứng thư số. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });

        this.signing = false;
        this.spinning = false;
        return;
      }

      if (this.data.dltKhai.ttChung.hThuc === 2) { // không ủy nhiệm + hình thức thay đổi thông tin
        // check tờ khai hiện tại vs tờ khai mới nhất xem có thay đổi thông tin hình thức hóa đơn hoặc loại hóa đơn kh
        this.quyDinhKyThuatService.CheckToKhaiThayDoiThongTinTruocKhiKyVaGui(this.dTKhai.id)
          .subscribe((rsCheckVsToKhaiMoiNhat: any) => {
            if (rsCheckVsToKhaiMoiNhat.result) {
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
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                  msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                  msOkButtonInBlueColor: true,
                  msTitle: 'Kiểm tra lại',
                  msContent: rsCheckVsToKhaiMoiNhat.result,
                  msOnOk: () => {
                    this.sendSocket();
                  },
                  msOnClose: () => {
                    //////////////////////
                    this.spinning = false;
                    this.signing = false;
                  }
                },
                nzFooter: null
              });
            } else {
              this.sendSocket();
            }
          });
      } else {
        this.sendSocket();
      }
    })




  }

  async createObservableSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe(async (rs: string) => {
      if (!await this.webSocket.isOpenSocket()) {
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
            msTitle: 'Ký tờ khai',
            msContent: `Có lỗi xảy ra. Vui lòng thử lại.`,
          },
          nzFooter: null
        });

        this.signing = false;
        this.spinning = false;

        return;
      }

      let obj = JSON.parse(rs);
      obj.DataJSON = (obj.DataJson != null && obj.DataJson != undefined) ? JSON.parse(obj.DataJson) : null;

      if (obj.TypeOfError == 0) {
        if (obj.DataJSON === null || obj.DataJSON == undefined) {
          const _dataKTKhai = {
            idToKhai: this.dTKhai.id,
            content: obj.XMLSigned,
            mST: obj.MST,
            seri: obj.SerialSigned
          }

          this.quyDinhKyThuatService.LuuDuLieuKy(_dataKTKhai).subscribe(
            (res) => {
              if (res) {
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.KyToKhai,
                  doiTuongThaoTac: 'empty',
                  refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                  thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tNNT}, mã số thuế ${this.data.dltKhai.ttChung.mST}, ${this.data.dltKhai.ttChung.cQTQLy}`,
                  moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tNNT}, mã số thuế ${this.data.dltKhai.ttChung.mST}, ${this.data.dltKhai.ttChung.cQTQLy}`,
                  refId: this.dTKhai.id
                }).subscribe();

                this.xacNhanToKhai();
              }
              else this.modal.destroy(false);
            },
            err => {
              console.log(err);
              this.signing = false;
              this.spinning = false;
            }
          );
        }
      }
      else {
        if (obj.MLTDiep != 50) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.KyToKhaiLoi,
            doiTuongThaoTac: 'empty',
            refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
            thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tNNT}, mã số thuế ${this.data.dltKhai.ttChung.mST}, ${this.data.dltKhai.ttChung.cQTQLy}`,
            moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tNNT}, mã số thuế ${this.data.dltKhai.ttChung.mST}, ${this.data.dltKhai.ttChung.cQTQLy}`,
            refId: this.dTKhai.id
          }).subscribe();

          this.spinning = false;
          //this.message.error("Ký tờ khai không thành công mời bạn ký lại!");
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
              msContent: `Ký tờ khai không thành công.
              <br>Nội dung lỗi: ${obj.Exception}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
        }
        else {
          this.spinning = false;
          //this.message.error("Chọn chứng thư số không thành công mời bạn chọn lại!");
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
              msContent: `Chọn chứng thư số không thành công.
              <br>Nội dung lỗi: ${obj.Exception}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
          return;
        }
      }
    }, err => {
      this.spinning = false;
      if (this.signing == true) {
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
            msOKText: "Tải bộ cài",
            msOnOk: () => {
              const link = document.createElement('a');
              link.href = `${this.env.apiUrl}/${this.urlTools}`;
              link.download = 'BKSOFT-KYSO-SETUP.zip';
              link.click();
            },
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => {
            },
            msTitle: 'Hãy cài đặt công cụ ký số',
            msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
            <br>Để chọn chứng thư số, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
          },
          nzFooter: null
        });

        return;
      }
    });
  }

  sendSocket() {
    this.createObservableSocket();
    this.quyDinhKyThuatService.GetToKhaiById(this.dTKhai.id).subscribe(
      (result: any) => {
        if (result) {
          this.spinning = true;
          var tKhai = result.toKhaiKhongUyNhiem;
          if (moment().format("YYYY-MM-DD") > moment(tKhai.dltKhai.ttChung.nLap).format("YYYY-MM-DD")) {
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
                msTitle: 'Ngày ký và gửi phải nhỏ hơn hoặc bằng ngày lập',
                msContent: `Ngày ký và gửi phải nhỏ hơn hoặc bằng ngày lập ${moment(tKhai.dltKhai.ttChung.nLap).format("DD/MM/YYYY")}`,
              },
              nzFooter: null
            });

            this.spinning = false;
            this.signing = false;
            return;
          }

          this.tDiepGui = this.taoThongDiepGui(result);
          this.quyDinhKyThuatService.GetThongDiepByThamChieu(result.id).subscribe((td: any) => {
            console.log(td);
            var params = {
              thongDiepKhongUyNhiem: this.tDiepGui,
              thongDiepId: td.thongDiepChungId
            }
            this.quyDinhKyThuatService.GetXMLThongDiepToKhai(params).subscribe((rs: any) => {
              if (this.sendMessageToServer(result, td.thongDiepChungId, rs.result) == false) {
                this.spinning = false;
                return;
              }
            })
          })
        }
      }
    );
  }

  taoThongDiepGui(tKhai): any {
    var tDiep = {
      TTChung: {
        PBan: "",
        MNGui: ``,
        MNNhan: ``,
        MLTDiep: 100,
        MTDiep: ``,
        MTDTChieu: '',
        MST: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mst,
        SLuong: 0
      },
      DLieu: {
        TKhai: {
          DLTKhai: {
            TTChung: {
              PBan: "2.0.1",
              MSo: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mSo,
              Ten: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.ten,
              HThuc: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.hThuc,
              TNNT: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.tnnt,
              MST: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mst,
              CQTQLy: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.cqtqLy,
              MCQTQLy: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mcqtqLy,
              NLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.nlHe,
              DCLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dclHe,
              DCTDTu: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dctdTu,
              DTLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dtlHe,
              DDanh: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dDanh,
              NLap: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.nLap
            },
            NDTKhai: {
              HTHDon: {
                CMa: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.cMa,
                KCMa: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.kcMa
              },
              HTGDLHDDT: {
                NNTDBKKhan: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.nntdbkKhan,
                NNTKTDNUBND: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.nntktdnubnd,
                CDLTTDCQT: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.cdlttdcqt,
                CDLQTCTN: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.cdlqtctn
              },
              PThuc: {
                CDDu: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu,
                CBTHop: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cbtHop
              },
              LHDSDung: {
                HDGTGT: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdgtgt,
                HDBHang: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbHang,
                HDBTSCong: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbtsCong,
                HDBHDTQGia: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbhdtqGia,
                HDKhac: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdKhac,
                CTu: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.cTu,
              },
              DSCTSSDung: []
            }
          },
          DSCKS: {
            NNT: '',
            CCKSKhac: tKhai.toKhaiKhongUyNhiem.dscks.ccksKhac
          }
        }
      }
    };

    tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.dsctssDung.forEach(element => {
      tDiep.DLieu.TKhai.DLTKhai.NDTKhai.DSCTSSDung.push({
        sTT: element.stt,
        tTChuc: element.ttChuc,
        seri: element.seri,
        tNgay: moment(element.tNgay).format("YYYY-MM-DDTHH:mm:SS"),
        dNgay: moment(element.dNgay).format("YYYY-MM-DDTHH:mm:SS"),
        hThuc: element.hThuc
      });
    });

    return tDiep;
  }

  xacNhanToKhai(){
    this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai.id).subscribe((td: any) => {
      this.fileData.append('thongDiepId', td.thongDiepChungId);
      this.fileData.append('maSoThue', this.tDiepGui.TTChung.MST);

      this.quyDinhKyThuatService.XacNhanToKhai01(this.fileData).subscribe((rs: number) => {
        if (rs) {
          td.ngayGui = moment().format("YYYY-MM-DD");
          this.message.success("Xác nhận thành công");
          this.signing = false;
          this.spinning = false;
          this.modal.destroy(true);
        }
        else {
          this.message.error("Có lỗi xảy ra trong quá trình xác nhận!");
          this.signing = false;
          this.spinning = false;
          this.modal.destroy(false);
        }
      })
    });
  }

  sendMessageToServer(tKhai: any, thongDiepChungId: any, xmlGui: any): boolean {
    //let domain = 'https://hdbk.pmbk.vn';
    if (thongDiepChungId) {
      this.quyDinhKyThuatService.GetNoiDungThongDiepXMLChuaKy(thongDiepChungId).subscribe((res: any) => {
        if (res) {
          this.quyDinhKyThuatService.GetToKhaiById(tKhai.id).subscribe((rs: any) => {
            if (rs) {
              // this.getXmlThongDiep(tDiep, rs);
              if (xmlGui != "" || (res && res.result != "")) {
                var fileUrl = `${this.env.apiUrl}/${xmlGui}`;

                const dtToKhai = rs.toKhaiKhongUyNhiem;
                var serials = dtToKhai.dltKhai.ndtKhai.dsctssDung.map(x => x.seri);
                const msg = {
                  mLTDiep: 100,
                  dataXML: res.result,
                  urlXML: fileUrl,
                  serials: serials,
                  mst: dtToKhai.dltKhai.ttChung.mst
                };

                // Sending
                if (this.webSocket.isOpenSocket()) {
                  this.webSocket.sendMessage(JSON.stringify(msg));
                  return true;
                }
                else {
                  if (this.webSocket.isConnecting()) {
                    //khi socket ở trạng thái đang kết nối
                    //đợi 1000ms để socket được mở
                    setTimeout(() => {
                      if (this.webSocket.isOpenSocket()) {
                        //nếu socket mở thì thoát time out
                        this.webSocket.sendMessage(JSON.stringify(msg));
                        //clearTimeout();
                        return true;
                      }
                    }, 1000);

                    //nếu sau 1s mà vẫn k connect được thì ngắt
                    if (!this.webSocket.isOpenSocket()) {
                      return false;
                    }
                  }
                  else return false;
                }
              }
              else return false;
            }
            else return false;
          });
        }
        else return false;
      })
    }
    else return false;
  }


  confirm(){
    console.log("🚀 ~ file: xac-nhan-to-khai-mau-01-modal.component.ts ~ line 650 ~ XacNhanToKhaiMau01ModalComponent ~ confirm ~ this.data", this.data)
    console.log("🚀 ~ file: xac-nhan-to-khai-mau-01-modal.component.ts ~ line 650 ~ XacNhanToKhaiMau01ModalComponent ~ confirm ~ this.data", this.dataReader)

    this.spinning = true;
    if(this.dataReader.dltBao.ttxncqt == 2){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: 450,
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Trạng thái phản hồi từ cơ quan thuế là <b>CQT không chấp nhận</b>.<br>Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }
    else{
      if(this.data.dltKhai.ttChung.hThuc != this.dataReader.dltBao.htdKy){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: 450,
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Hình thức người dùng đăng ký là <b>${this.data.dltKhai.ttChung.hThuc == 1 ? `Đăng ký` : `Thay đổi thông tin`}</b> đang không trùng với hình thức đăng ký được cơ quan thuế chấp nhận là <b>${this.dataReader.dltBao.htdKy == 1 ? `Đăng ký` : `Thay đổi thông tin`}</b>. Vui lòng kiểm tra lại
            `,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }

      if(this.data.dltKhai.ndtKhai.hthDon.cmtmtTien == 1 && this.dataReader.dltBao.mccqt == null){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: 450,
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Bạn có đăng ký hình thức hóa đơn <b>Có mã của của cơ quan thuế khởi tạo từ máy tính tiền</b>. <br>
            Tuy nhiên, thông báo về việc chấp nhận sử dụng hóa đơn điện tử không có thông tin <b>Mã của cơ quan thuế</b> (Mã của cơ quan thuế trên hóa đơn điện tử khởi tạo từ máy tính tiền). Vui lòng kiểm tra lại

            `,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }

      if(this.data.dltKhai.ndtKhai.hthDon.cmtmtTien  == 0 && this.dataReader.dltBao.mccqt != null){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: 450,
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Bạn không đăng ký hình thức hóa đơn <b>Có mã của của cơ quan thuế khởi tạo từ máy tính tiền</b>. <br>
            Tuy nhiên, thông báo về việc chấp nhận sử dụng hóa đơn điện tử có thông tin <b>Mã của cơ quan thuế</b> (Mã của cơ quan thuế trên hóa đơn điện tử khởi tạo từ máy tính tiền). Vui lòng kiểm tra lại
            `,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }


      this.eSign();
    }
  }

  colseModal(){
    this.modal.destroy();
  }
  hasExtension(fileName, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
  hasFileSize(fileSize) {
    if ((fileSize / 1024 / 1024) < 10240) { return true; }
    return false;
  }
}
