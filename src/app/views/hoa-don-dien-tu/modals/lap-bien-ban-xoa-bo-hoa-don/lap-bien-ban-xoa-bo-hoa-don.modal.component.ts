import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { DownloadFile, GetFileUrl, getHeightBangKe, getListEmptyBangKe, getNoiDungLoiPhatHanhHoaDon, getTenLoaiHoaDon, isSelectChuKiCung, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { MessageInv, MessageInvTT78 } from 'src/app/models/messageInv';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { XoaBoHoaDonModalComponent } from '../xoa-bo-hoa-don-modal/xoa-bo-hoa-don-modal.component';
import { GuiHoaDonXoaBoModalComponent } from '../gui-hoa-don-xoa-bo-modal/gui-hoa-don-xoa-bo-modal.component';
import { UtilityService } from 'src/app/services/utility.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { Router } from '@angular/router';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-lap-bien-ban-xoa-bo-hoa-don-modal',
  templateUrl: './lap-bien-ban-xoa-bo-hoa-don-modal.component.html',
  styleUrls: ['./lap-bien-ban-xoa-bo-hoa-don-modal.component.scss']
})
export class LapBienBanXoaBoHoaDonModalComponent implements OnInit {
  @Input() data: any;
  @Input() timKiemTheos: any[] = [];
  @Input() formData: any;
  @Input() isAddNew: boolean;
  @Input() checkHideBtnXoa: boolean = false;
  @Input() checkHideBtnXemHd: boolean = false;
  @Input() fbEnableEdit: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() isShowFromBangKeXoaBo: boolean = false;
  @Input() isShowbtnSendEmail: boolean = true;
  @Input() isDeleteBB: boolean = false;
  @Input() bbIdDetele: any = '';
  @Input() ActivedModal: any;     // Nếu mở modal thì ActivedModal != null để ngăn sự kiện bàn phím mở modal nhiều lần
  subcription: Subscription;
  spinning = false;
  fdata: any;
  scrollConfig = { x: '1300px', y: '35vh' };
  mainForm: FormGroup;
  nguoiChuyenDois: any[] = [];
  selectedIndex: number = 0;
  thongTu: string = "";
  displayDatas: any[] = [];
  uploadedFile: any[] = [];

  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  ddtp = new DinhDangThapPhan();
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  loaiKey: number = 1;
  keyword: string = '';
  total = 0;
  pageSizeOptions: number[] = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  loading = false;
  listOfSelected: any[] = [];
  dataSelected: any;
  hoSoHDDT: any;
  kys = GetList();
  soBB: string;
  hoaDonDienTuForm: any;
  listFile: TaiLieuDinhKem[] = [];
  listUploadedFile: TaiLieuDinhKem[] = [];
  validExtentions = ['.doc', '.docx', '.xls', '.xlsx', '.xml', '.pdf'];
  isShowChuKyA: boolean = false;
  tenCongTyBenA: any;
  ngayKyBenA: any;
  isShowChuKyB: boolean = false;
  tenCongTyBenB: any;
  ngayKyBenB: any;
  isDelete: boolean = false;
  innerHeight: any;
  trangThaiBienBanXoaBo: any = -1;
  sub: Subscription;
  isPhieuXuatKho: boolean = false;
  txtHD_PXK: string = "hóa đơn";
  txtHD_PXK_UPPER: string = "Hóa đơn";
  constructor(
    private router: Router,
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private modalService: NzModalService,
    private websocketService: WebSocketService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private uploadFileService: UploadFileService,
    private utilityService: UtilityService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService
  ) {
    this.thongTu = "- Căn cứ Luật Quản lý thuế ngày 13 tháng 6 năm 2019;\n" +
      "- Căn cứ Luật Giao dịch điện tử ngày 29 tháng 11 năm 2005;\n" +
      "- Căn cứ Luật Công nghệ thông tin ngày 29 tháng 6 năm 2006;\n" +
      "- Căn cứ Nghị định số 123/2020/NĐ-CP ngày 19/10/2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
      "- Căn cứ Thông tư số 78/2021/TT-BTC ngày 17/09/2021 của Bộ Tài chính hướng dẫn thực hiện một số điều của Luật Quản lý thuế ngày 13 tháng 6 năm 2019, Nghị định số 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
      "- Căn cứ vào thỏa thuận giữa các bên.";
  }
  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK = "PXK";
      this.txtHD_PXK_UPPER = "PXK";
    }

    setTimeout(() => {
      var modalHeader = document.getElementsByClassName('ant-modal-header');
      this.innerHeight = (window.innerHeight - modalHeader[0].scrollHeight - 5);
    }, 0);
    this.spinning = true;
    if (this.data != null || this.data != undefined) {
      this.fdata = this.data;
      this.spinning = false;
      this.trangThaiBienBanXoaBo = this.data.trangThaiBienBanXoaBo;
      this.isDelete = this.data.trangThaiBienBanXoaBo == 0;
      this.checkHideBtnXemHd = this.data.checkHideBtnXemHd;
      // this.uploadFileService.GetFilesById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
      //   if (rs) {
      //     this.uploadedFile = rs;
      //     this.listFile = rs;
      //   }
      // })
      if (this.formData != null || this.formData != undefined) {
        if (this.formData.ngayKyBenA != null) {
          this.isShowChuKyA = (this.formData && this.formData.ngayKyBenA != null);
          this.tenCongTyBenA = this.formData.tenCongTyBenA;
          this.ngayKyBenA = moment(this.formData.ngayKyBenA).format('YYYY-MM-DD HH:mm:ss');
          // this.isEdit = true;
        }
        if (this.formData.ngayKyBenB) {
          this.ngayKyBenB = moment(this.formData.ngayKyBenB).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      this.createForm();
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      var modalHeader = document.getElementsByClassName('ant-modal-header');
      this.innerHeight = (window.innerHeight - modalHeader[0].scrollHeight - 5);
    }, 0);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('window:resize');
    console.log(event);
    setTimeout(() => {
      var modalHeader = document.getElementsByClassName('ant-modal-header');
      this.innerHeight = (window.innerHeight - modalHeader[0].scrollHeight - 5);
    }, 0);
  }

  kyDienTu() {
    this.spinning = true;
    const _data = this.mainForm.getRawValue();

    //Check ngày ký với ngày biên bản
    let ngaybb = moment(_data.ngayBienBan).format('YYYY-MM-DD');
    let curDate = moment().format('YYYY-MM-DD');
    if (ngaybb > curDate) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 600,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Cập nhật ngày biên bản hủy ${this.txtHD_PXK}`,
          msContent: `Ngày biên bản hủy ${this.txtHD_PXK} không được lớn hơn ngày ký biên bản hủy ${this.txtHD_PXK} là ngày <b>${moment().format('DD/MM/YYYY')}</b>. Bạn có muốn cập nhật ngày biên bản hủy ${this.txtHD_PXK} thành ngày <b>${moment().format('DD/MM/YYYY')}</b> không?`,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.vaoKy(_data, true);
          },
          msOnClose: () => { this.spinning = false; return; }
        },
      });
    } else {
      this.vaoKy(_data);
    }

  }

  async vaoKy(_data: any, flag: boolean = false) {
    if (flag) {
      _data.ngayBienBan = moment();
      this.mainForm.controls['ngayBienBan'].setValue(moment().format('YYYY-MM-DD'));
    }
    let hoaDonDienTuId = _data.hoaDonDienTuId != null ? _data.hoaDonDienTuId : _data.thongTinHoaDonId;
    console.log(isSelectChuKiCung(this.tuyChonService))
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
      (await this.websocketService.createObservableSocket('ws://localhost:15872/bksoft')).subscribe((rs: any) => {
        let obj = JSON.parse(rs);
        this.fdata.thongTinHoaDonId = this.formData != null ? this.formData.thongTinHoaDonId : this.data.thongTinHoaDonId;
        obj.typeKy = 10;
        obj.bienBan = this.fdata;
        obj.dataXML = obj.XMLSigned;
        obj.dataPDF = this.fdata.dataPDF;
        obj.hoaDonDienTuId = obj.hoaDonDienTuId == null ? this.data.thongTinHoaDonId : obj.hoaDonDienTuId;
        console.log("vào ký:");
        console.log(obj);
        if (obj.TypeOfError === 0) {
          this.hoaDonDienTuService.KyBienBanXoaBo_NB(obj).subscribe(
            (res) => {
              if (res) {
                this.formData.ngayKyBenA = moment();
                this.reload(res != null);

                console.log('ký xong trả về: ' + res);
                console.log(this.data);
                console.log(this.formData);
                this.spinning = false;
                this.checkHideBtnXemHd = this.data.checkHideBtnXemHd;
                // this.message.success("Ký biên bản hủy hóa đơn thành công!");
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzWidth: '400px',
                  nzComponentParams: {
                    msMessageType: MessageType.Info,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msTitle: `Ký biên bản hủy ${this.txtHD_PXK}`,
                    msContent: `Ký biên bản hủy ${this.txtHD_PXK} thành công!`,
                  },
                  nzFooter: null
                });
                // this.modal.destroy(true);
              }
            },
            err => {
              this.spinning = false;

              this.nhatKyThaoTacLoiService.Insert(obj.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '400px',
                nzComponentParams: {
                  msMessageType: MessageType.Error,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Kiểm tra lại`,
                  msContent: `Ký biên bản hủy ${this.txtHD_PXK} không thành công.
                <br>Nội dung lỗi: Lỗi hệ thống.
                <br>Vui lòng kiểm tra lại!`,
                },
                nzFooter: null
              });
              console.log(err);
              // this.modal.destroy(false);
            }
          );
        } else {
          this.spinning = false;

          this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, obj.Exception).subscribe();

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '400px',
            nzComponentParams: {
              msMessageType: MessageType.Error,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: `Ký biên bản hủy ${this.txtHD_PXK} không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
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
          nzWidth: '400px',
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
            <br>Để ký biên bản hủy ${this.txtHD_PXK}, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
          },
          nzFooter: null
        });
      });
      this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(hoaDonDienTuId).subscribe((rs: any) => {
        if (flag) rs.ngayBienBan = moment().format('YYYY-MM-DD');
        this.sendMessageToServer(rs);
      })
      console.log("Thoát ký:");
    } else {
      this.kiMem(hoaDonDienTuId, flag);
    }
  }
  sendMessageToServer(orderData: any) {
    let domain = this.env.apiUrl;
    //let domain = 'https://hdbk.pmbk.vn';
    orderData.ngayKyBenA = new Date();
    this.hoaDonDienTuService.ConvertBienBanXoaBoToFilePdf_NB(orderData).subscribe((rs: any) => {
      if (rs.filePDF != "" && rs.fileXML != "") {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const apiURLPDF = this.env.apiUrl + `/${rs.filePDF}`;
        const apiURLXML = this.env.apiUrl + `/${rs.fileXML}`;
        orderData.fileChuaKy = rs.filePDF;
        orderData.xMLChuaKy = rs.fileXML;
        orderData.dataXML = rs.xmlBase64;
        orderData.dataPDF = rs.pdfBase64;
        orderData.actionUser = user;
        this.fdata = orderData;
        this.quyDinhKyThuatService.GetAllListCTS().subscribe((cts: any[]) => {
          let msg: any = {};
          msg.mLTDiep = 10;
          msg.mst = this.formData.maSoThueBenA;
          msg.serials = cts;
          msg.urlPdf = apiURLPDF;
          //msg.dataPDF = orderData.dataPDF;
          //msg.dataXML = `https://localhost:44383/uploaded/${user.databaseName}/xml/unsign/${orderData.bill.lookupCode}.xml`;
          msg.tTNKy = {
            mst: this.formData.maSoThueBenA == null ? '' : this.formData.maSoThueBenA,
            ten: this.formData.tenCongTyBenA == null ? '' : this.formData.tenCongTyBenA,
            diaChi: this.formData.diaChiBenA == null ? '' : this.formData.diaChiBenA,
            sDThoai: this.formData.soDienThoaiBenA == null ? '' : this.formData.soDienThoaiBenA,
            tenP1: this.formData.tenCongTyBenA == null ? '' : this.formData.tenCongTyBenA,
            tenP2: '',
          }
          // console.log(msg);
          // Sending
          if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
            let isConnected = this.websocketService.sendMessage(JSON.stringify(msg));
            if (isConnected == 'false') {
              this.message.error("Có lỗi xảy ra trong quá trình ký");
              this.spinning = false;
              return;
            }
          } else {
            msg.dataPDF = orderData.dataPDF;
            this.processKyMem(msg);
          }
        })
      }
    });
  }
  kiMem(hoaDonDienTuId: any, flag) {
    this.createDataToSignCloud(hoaDonDienTuId, flag);
  }
  createDataToSignCloud(hoaDonDienTuId: any, flag) {
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(hoaDonDienTuId).subscribe((rs: any) => {
      if (flag) rs.ngayBienBan = moment().format('YYYY-MM-DD');
      this.sendMessageToServer(rs);
    })
  }
  async processKyMem(dataKy) {
    (await this.websocketService.createObservableSocket('', dataKy)).subscribe((rs: any) => {
      let obj = rs;
      this.fdata.thongTinHoaDonId = this.formData != null ? this.formData.thongTinHoaDonId : this.data.thongTinHoaDonId;
      obj.typeKy = 10;
      obj.bienBan = this.fdata;
      obj.hoaDonDienTuId = obj.hoaDonDienTuId == null ? this.data.thongTinHoaDonId : obj.hoaDonDienTuId;
      if (obj.TypeOfError === 0) {
        this.hoaDonDienTuService.KyBienBanXoaBo_NB(obj).subscribe(
          (res) => {
            if (res) {
              this.formData.ngayKyBenA = moment();
              this.reload(res != null);

              this.spinning = false;
              this.checkHideBtnXemHd = this.data.checkHideBtnXemHd;
              // this.message.success("Ký biên bản hủy hóa đơn thành công!");
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '400px',
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Ký biên bản hủy ${this.txtHD_PXK}`,
                  msContent: `Ký biên bản hủy ${this.txtHD_PXK} thành công!`,
                },
                nzFooter: null
              });
              // this.modal.destroy(true);
            }
          },
          err => {
            this.spinning = false;

            this.nhatKyThaoTacLoiService.Insert(obj.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '400px',
              nzComponentParams: {
                msMessageType: MessageType.Error,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: `Kiểm tra lại`,
                msContent: `Ký biên bản hủy ${this.txtHD_PXK} không thành công.
                <br>Nội dung lỗi: Lỗi hệ thống.
                <br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
            console.log(err);
            // this.modal.destroy(false);
          }
        );
      } else {
        this.spinning = false;

        this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, obj.Exception).subscribe();

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '400px',
          nzComponentParams: {
            msMessageType: MessageType.Error,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: `Kiểm tra lại`,
            msContent: `Ký biên bản hủy ${this.txtHD_PXK} không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });
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
        nzWidth: '400px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          },
          msTitle: 'Kiểm tra lại',
          msContent: `Ký không thành công. Vui lòng kiểm tra lại.`,
        },
        nzFooter: null
      });
    });
  }
  createForm() {
    // console.log('isAddNew: '+this.isAddNew);
    // console.log(this.formData);
    // console.log('fbEnableEdit: '+ this.fbEnableEdit);
    // console.log(this.data);
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.hoSoHDDT = rs;
      this.mainForm = this.fb.group({
        id: [this.formData != null ? this.formData.id : null],
        hoaDonDienTuId: [this.formData != null ? this.formData.hoaDonDienTuId : this.fdata.hoaDonDienTuId],
        thongTinHoaDonId: [this.formData != null ? this.formData.thongTinHoaDonId : this.fdata.thongTinHoaDonId],
        ngayBienBan: [{ value: this.formData != null ? moment(this.formData.ngayBienBan).format("YYYY-MM-DD") : moment().format('YYYY-MM-DD'), disabled: !this.isAddNew && !this.fbEnableEdit }],
        soBienBan: [{ value: this.formData != null ? this.formData.soBienBan : null, disabled: true }],
        thongTu: [{ value: this.formData != null ? this.formData.thongTu : this.thongTu, disabled: !this.isAddNew && !this.fbEnableEdit }],
        tenCongTyBenA: [{ value: this.formData != null ? this.formData.tenCongTyBenA : this.hoSoHDDT.tenDonVi, disabled: true }],
        diaChiBenA: [{ value: this.formData != null ? this.formData.diaChiBenA : this.hoSoHDDT.diaChi, disabled: true }],
        maSoThueBenA: [{ value: this.formData != null ? this.formData.maSoThueBenA : this.hoSoHDDT.maSoThue, disabled: true }],
        soDienThoaiBenA: [{ value: this.formData != null ? this.formData.soDienThoaiBenA : this.hoSoHDDT.soDienThoaiLienHe, disabled: !this.isAddNew && !this.fbEnableEdit }],
        daiDienBenA: [{ value: this.formData != null ? this.formData.daiDienBenA : this.hoSoHDDT.hoTenNguoiDaiDienPhapLuat, disabled: !this.isAddNew && !this.fbEnableEdit }],
        chucVuBenA: [{ value: this.formData != null ? this.formData.chucVuBenA : null, disabled: !this.isAddNew && !this.fbEnableEdit }],
        tenKhachHang: [{ value: this.formData != null ? this.formData.tenKhachHang : this.fdata.tenKhachHang, disabled: !this.isAddNew && !this.fbEnableEdit }],
        diaChi: [{ value: this.formData != null ? this.formData.diaChi : this.fdata.diaChi, disabled: !this.isAddNew && !this.fbEnableEdit }],
        maSoThue: [{ value: this.formData != null ? this.formData.maSoThue : this.fdata.maSoThue, disabled: !this.isAddNew && !this.fbEnableEdit }],
        soDienThoai: [{ value: this.formData != null ? this.formData.soDienThoai : this.fdata.soDienThoai, disabled: !this.isAddNew && !this.fbEnableEdit }],
        daiDien: [{ value: this.formData != null ? this.formData.daiDien : this.fdata.hoTenNguoiMuaHang, disabled: !this.isAddNew && !this.fbEnableEdit }],
        chucVu: [{ value: this.formData != null ? this.formData.chucVu : null, disabled: !this.isAddNew && !this.fbEnableEdit }],
        lyDoXoaBo: [{ value: this.formData != null ? this.formData.lyDoXoaBo : this.fdata.lyDoXoaBo, disabled: !this.isAddNew && !this.fbEnableEdit }, [Validators.required]]
      });
      this.mainForm.valueChanges.subscribe(() => {
        setStyleTooltipError(true);
      });
    });


  }
  onPrintClick() {
    this.spinning = true;

    const _data = this.mainForm.getRawValue();
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(_data.hoaDonDienTuId).subscribe((rs: any) => {
      this.hoaDonDienTuService.ConvertBienBanXoaBoToFilePdf(rs).subscribe((rs: any) => {
        const apiURLPDF = this.env.apiUrl + `/${rs.filePDF}`;
        showModalPreviewPDF(this.modalService, `${apiURLPDF}`);
        this.message.remove(id);
        this.spinning = false;

      }, (err) => {
        this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
        this.message.remove(id);
        this.spinning = false;
      });
    }, (err) => {
      this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
      this.message.remove(id);
      this.spinning = false;
    });

  }
  view() {
    if (this.data != null) {
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.message.remove(id);
        }, (err) => {
          this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
          this.message.remove(id);
        });
      }, (err) => {
        console.log(err);
        this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
        this.message.remove(id);
      })
    }
  }

  delete(bbId: any, callback: () => any = null) {
    var tb = '';
    if (this.data.trangThaiBienBanXoaBo <= 2) {
      tb = 'Bạn có chắc chắn muốn xóa không?'
    }
    else if (this.data.trangThaiBienBanXoaBo == 3) {
      tb = `Biên bản hủy ${this.txtHD_PXK} đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không ký được biên bản hủy ${this.txtHD_PXK} đã gửi trước đó. Bạn có muốn tiếp tục xóa không?`
    }
    else {
      tb = `Biên bản hủy ${this.txtHD_PXK} đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không xem được biên bản hủy ${this.txtHD_PXK} đã gửi trước đó. Bạn có muốn tiếp tục xóa không?`
    }
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '400px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa biên bản hủy hóa đơn",
        msContent: tb,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          this.hoaDonDienTuService.DeleteBienBanXoaHoaDon(bbId).subscribe((rs: boolean) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.BienBanXoaBo,
                thamChieu: `Số ${this.txtHD_PXK} ${this.fdata.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: this.formData.id
              }).subscribe();
              //xóa file
              this.listFile.forEach(element => {
                this.uploadFileService.DeleteFileAttach({
                  nghiepVuId: this.formData.id,
                  loaiNghiepVu: RefType.HoaDonXoaBo,
                  tenGoc: element.tenGoc,
                  tenGuid: element.tenGuid,
                  taiLieuDinhKemId: element.taiLieuDinhKemId
                }).subscribe();
              });

              // this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '400px',
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Xóa biên bản hủy ${this.txtHD_PXK}`,
                  msContent: `Xóa biên bản hủy ${this.txtHD_PXK} thành công!`,
                },
                nzFooter: null
              });
            }
            else {
              this.message.error("Lỗi khi xóa");
            }
            console.log('kq xóa: ' + rs);
            this.modal.destroy(rs);
          });
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }

  cancel() {
    this.modal.destroy();
  }

  edit() {
    if (this.data.trangThaiBienBanXoaBo == 2) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Sửa biên bản hủy ${this.txtHD_PXK}`,
          msContent: `Biên bản hủy ${this.txtHD_PXK} này đã được ký điện tử, nếu bạn thực hiện sửa thì chữ ký sẽ bị xóa và bạn cần ký lại. Bạn có muốn tiếp tục thực hiện không?`,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.formData.ngayKyBenA = null;
            this.isShowChuKyA = false;
            this.fbEnableEdit = true;
            this.mainForm.enable();
            this.mainForm.controls['soBienBan'].disable();
            this.mainForm.controls['thongTu'].disable();
            this.mainForm.controls['tenCongTyBenA'].disable();
            this.mainForm.controls['diaChiBenA'].disable();
            this.mainForm.controls['maSoThueBenA'].disable();
            this.mainForm.controls['soDienThoaiBenA'].disable();
            this.mainForm.controls['daiDienBenA'].disable();
            this.isAddNew = true;
            this.isEdit = true;
            this.isDelete = true;
            this.trangThaiBienBanXoaBo = 1;
            this.data.trangThaiBienBanXoaBo = 1;
            // this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.data.hoaDonDienTuId).subscribe((rs: any) => {
            //   if (rs) {
            //     rs.ngayKyBenA = null;
            //     rs.hoaDonDienTu = null;
            //     this.formData.ngayKyBenA = null;
            //     this.isShowChuKyA = false;
            //     console.log('GetBienBanXoaBoHoaDon');
            //     console.log(rs);
            //     this.hoaDonDienTuService.CapNhatBienBanXoaBoHoaDon(rs).subscribe((rsUpdate: any) => {
            //       console.log(rsUpdate);
            //       this.fbEnableEdit = true;
            //       this.mainForm.enable();
            //       this.mainForm.controls['soBienBan'].disable();
            //       this.mainForm.controls['thongTu'].disable();
            //       this.mainForm.controls['tenCongTyBenA'].disable();
            //       this.mainForm.controls['diaChiBenA'].disable();
            //       this.mainForm.controls['maSoThueBenA'].disable();
            //       this.mainForm.controls['soDienThoaiBenA'].disable();
            //       this.mainForm.controls['daiDienBenA'].disable();
            //       this.isAddNew = true;
            //       this.isEdit = true;
            //       this.isDelete = true;
            //       this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rsHD: any) => {
            //         if (rsHD) {
            //           rsHD.trangThaiBienBanXoaBo = 1;
            //           this.hoaDonDienTuService.Update(rsHD).subscribe();
            //         }
            //       });
            //     });
            //   }
            // })
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else if (this.data.trangThaiBienBanXoaBo == 3 || this.data.trangThaiBienBanXoaBo == 4) {
      let noidung = this.data.trangThaiBienBanXoaBo == 3 ? `Biên bản hủy ${this.txtHD_PXK} đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện sửa thì biên bản hủy ${this.txtHD_PXK} sẽ bị xóa và người mua sẽ không ký được biên bản hủy ${this.txtHD_PXK} đã gửi trước đó. Hệ thống sẽ nhân bản biên bản hủy ${this.txtHD_PXK} này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?` : `Biên bản hủy ${this.txtHD_PXK} đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện sửa thì biên bản hủy ${this.txtHD_PXK} sẽ bị xóa và người mua sẽ không xem được biên bản hủy ${this.txtHD_PXK} đã gửi trước đó. Hệ thống sẽ nhân bản biên bản hủy ${this.txtHD_PXK} này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?`;

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Sửa biên bản hủy ${this.txtHD_PXK}`,
          msContent: noidung,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.trangThaiBienBanXoaBo = 0;
            this.data.trangThaiBienBanXoaBo = 0;
            this.formData = null;
            this.isShowChuKyA = false;
            this.fbEnableEdit = true;
            this.mainForm.enable();
            this.mainForm.controls['soBienBan'].disable();
            this.mainForm.controls['thongTu'].disable();
            this.mainForm.controls['tenCongTyBenA'].disable();
            this.mainForm.controls['diaChiBenA'].disable();
            this.mainForm.controls['maSoThueBenA'].disable();
            this.mainForm.controls['soDienThoaiBenA'].disable();
            this.mainForm.controls['daiDienBenA'].disable();
            this.isAddNew = true;
            this.isEdit = true;
            this.isDelete = true;

            // this.hoaDonDienTuService.DeleteBienBanXoaHoaDon(this.formData.id).subscribe((rs: boolean) => {
            //   if (rs) {
            //     this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rsHD: any) => {
            //       if (rsHD) {
            //         rsHD.trangThaiBienBanXoaBo = 0;
            //         this.formData = null;
            //         this.isShowChuKyA = false;
            //         this.hoaDonDienTuService.Update(rsHD).subscribe((rsUpdateHD: any) => {
            //           this.fbEnableEdit = true;
            //           this.mainForm.enable();
            //           this.mainForm.controls['soBienBan'].disable();
            //           this.mainForm.controls['thongTu'].disable();
            //           this.mainForm.controls['tenCongTyBenA'].disable();
            //           this.mainForm.controls['diaChiBenA'].disable();
            //           this.mainForm.controls['maSoThueBenA'].disable();
            //           this.mainForm.controls['soDienThoaiBenA'].disable();
            //           this.mainForm.controls['daiDienBenA'].disable();
            //           this.isAddNew = true;
            //           this.isEdit = true;
            //           this.isDelete = true;
            //         });
            //       }
            //     });
            //     //xóa file
            //     this.listFile.forEach(element => {
            //       this.uploadFileService.DeleteFileAttach({
            //         nghiepVuId: this.formData.id,
            //         loaiNghiepVu: RefType.HoaDonXoaBo,
            //         tenGoc: element.tenGoc,
            //         tenGuid: element.tenGuid,
            //         taiLieuDinhKemId: element.taiLieuDinhKemId
            //       }).subscribe();
            //     });
            //   }
            //   else {
            //     this.message.error("Lỗi khi xóa");
            //   }
            // });
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    } else {
      this.fbEnableEdit = true;
      this.mainForm.enable();
      this.mainForm.controls['soBienBan'].disable();
      this.mainForm.controls['thongTu'].disable();
      this.mainForm.controls['tenCongTyBenA'].disable();
      this.mainForm.controls['diaChiBenA'].disable();
      this.mainForm.controls['maSoThueBenA'].disable();
      this.mainForm.controls['soDienThoaiBenA'].disable();
      this.mainForm.controls['daiDienBenA'].disable();
      this.isAddNew = true;
      this.isEdit = true;
      this.isDelete = true;
      this.ngOnInit();

    }


  }

  save(optional: number = 1) {
    this.spinning = true;
    const _data = this.mainForm.getRawValue();
    console.log(_data);

    if (_data.lyDoXoaBo == null || _data.lyDoXoaBo == '') {
      this.mainForm.controls['lyDoXoaBo'].markAsTouched();
      this.mainForm.controls['lyDoXoaBo'].setValidators([Validators.required]);
      this.mainForm.controls['lyDoXoaBo'].updateValueAndValidity();
      setStyleTooltipError(true);
      this.spinning = false;
      return;
    }
    else {
      this.mainForm.controls['lyDoXoaBo'].clearValidators();
      this.mainForm.controls['lyDoXoaBo'].updateValueAndValidity();
      setStyleTooltipError(false);
    }

    //check ngày bb
    let ngaybb = moment(_data.ngayBienBan).format('YYYY-MM-DD');
    let ngayKyDienTu = moment(this.fdata.ngayHoaDon).format('YYYY-MM-DD');
    let ngayXoaBo = moment(this.fdata.ngayXoaBo).format('YYYY-MM-DD');
    if (ngaybb < ngayKyDienTu) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `Ngày biên bản hủy ${this.txtHD_PXK} phải lớn hơn hoặc bằng ngày người bán ký điện tử trên ${this.txtHD_PXK} là ngày <b>${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}</b>. Vui lòng kiểm tra lại.`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            this.spinning = false;
            return;
          }
        },
      });

    }
    else if (this.data.trangThai == 2 && ngaybb > ngayXoaBo) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `${this.txtHD_PXK_UPPER} này đã thực hiện xóa bỏ ${this.txtHD_PXK} ngày <b>${moment(this.fdata.ngayXoaBo).format('DD/MM/YYYY')}</b>. Ngày biên bản hủy ${this.txtHD_PXK} phải nhỏ hơn hoặc bằng ngày xóa bỏ ${this.txtHD_PXK}. Vui lòng kiểm tra lại.`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            this.spinning = false;
            return;
          }
        },
      });
    }
    else {
      // _data.soBienBan == null;
      _data.khachHangId = this.fdata.khachHangId;
      _data.ngayXoaBo = moment();
      let hoaDonDienTuId = this.data.hoaDonDienTuId == null ? this.data.thongTinHoaDonId : this.data.hoaDonDienTuId;
      if (this.data.thongTinHoaDonId != undefined && this.data.thongTinHoaDonId != null) {
        _data.thongTinHoaDonId = this.data.thongTinHoaDonId;
        _data.hoaDonDienTuId = null;
      }

      const params = {
        data: _data,
        optionSendData: optional
      };
      if (this.fbEnableEdit == false) {
        //xóa bb khi sửa ở trạng thái đã gửi và kh đã ký
        if (this.bbIdDetele != '' && this.isDeleteBB) {
          this.hoaDonDienTuService.DeleteBienBanXoaHoaDon(this.bbIdDetele).subscribe((rsdeleted: boolean) => {
            if (rsdeleted) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.BienBanXoaBo,
                thamChieu: `Số ${this.txtHD_PXK} ${this.fdata.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: this.bbIdDetele
              }).subscribe();
              //xóa file
              this.listFile.forEach(element => {
                this.uploadFileService.DeleteFileAttach({
                  nghiepVuId: this.bbIdDetele,
                  loaiNghiepVu: RefType.HoaDonXoaBo,
                  tenGoc: element.tenGoc,
                  tenGuid: element.tenGuid,
                  taiLieuDinhKemId: element.taiLieuDinhKemId
                }).subscribe();
              });

              this.hoaDonDienTuService.SaveBienBanXoaHoaDon(params).subscribe((rs: any) => {
                if (rs) {
                  this.nhatKyTruyCapService.Insert({
                    loaiHanhDong: LoaiHanhDong.Them,
                    refType: RefType.BienBanXoaBo,
                    thamChieu: `Số ${this.txtHD_PXK} ${this.fdata.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}`,
                    refId: rs.id,
                  }).subscribe();
                  this.spinning = false;
                  this.fbEnableEdit = false;
                  this.isAddNew = false;
                  this.isEdit = false;
                  this.isDelete = false;
                  this.isShowFromBangKeXoaBo = true;

                  if (this.router.url.includes('/hoa-don-dien-tu/quan-li-hoa-don-dien-tu')) {
                    this.router.navigate(['/hoa-don-dien-tu/hoa-don-xoa-bo']);
                  }

                  this.mainForm.disable();
                  this.message.success('Lưu thành công.');
                  this.reload(rs != null);
                }
                else {
                  this.spinning = false;
                  this.message.success('Lưu thất bại.')
                }
              })
            }
            else {
              this.message.error("Lỗi khi xóa");
            }
            console.log('kq xóa: ' + rsdeleted);
          });
        } else {
          this.hoaDonDienTuService.SaveBienBanXoaHoaDon(params).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Them,
                refType: RefType.BienBanXoaBo,
                thamChieu: `Số ${this.txtHD_PXK} ${this.fdata.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: rs.id,
              }).subscribe();
              this.spinning = false;
              this.fbEnableEdit = false;
              this.isAddNew = false;
              this.isEdit = false;
              this.isDelete = false;
              this.isShowFromBangKeXoaBo = true;
              this.checkHideBtnXemHd = this.data.checkHideBtnXemHd;

              if (this.router.url.includes('/hoa-don-dien-tu/quan-li-hoa-don-dien-tu')) {
                this.router.navigate(['/hoa-don-dien-tu/hoa-don-xoa-bo']);
              }

              this.mainForm.disable();
              this.message.success('Lưu thành công.');
              this.reload(rs != null);
            }
            else {
              this.spinning = false;
              this.message.success('Lưu thất bại.')
            }
          })
        }

      }
      else {
        this.hoaDonDienTuService.CapNhatBienBanXoaBoHoaDon(_data).subscribe((rs: boolean) => {
          if (rs) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.BienBanXoaBo,
              thamChieu: `Số ${this.txtHD_PXK} ${this.fdata.soHoaDon || '&lt;Chưa cấp số&gt;'}\nNgày ${this.txtHD_PXK} ${moment(this.fdata.ngayHoaDon).format('DD/MM/YYYY')}`,
              refId: _data.id,
              duLieuCu: this.formData,
              duLieuMoi: _data
            }).subscribe();

            if (this.trangThaiBienBanXoaBo != -1) {
              this.hoaDonDienTuService.GetById(hoaDonDienTuId).subscribe((rsHD: any) => {
                if (rsHD) {
                  rsHD.trangThaiBienBanXoaBo = this.trangThaiBienBanXoaBo;
                  this.hoaDonDienTuService.Update(rsHD).subscribe();
                }
              });
            }
            this.spinning = false;
            this.message.success('Lưu thành công.');
            this.isAddNew = false;
            this.fbEnableEdit = false;
            this.isEdit = false;
            this.isDelete = false;
            this.isShowFromBangKeXoaBo = true;
            this.checkHideBtnXemHd = this.data.checkHideBtnXemHd;

            this.mainForm.disable();
            // this.reload(rs!=null);

          }
          else {
            this.spinning = false;
            this.message.error('Lưu thất bại.');
          }
        })
      }
    }
  }

  send() {
    console.log(this.data);
    const modal1 = this.modalService.create({
      nzTitle: `Gửi biên bản hủy ${this.txtHD_PXK}`,
      nzContent: GuiHoaDonXoaBoModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 45,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        data: this.data,
        isBBView: true,
        loaiEmail: this.isPhieuXuatKho ? LoaiEmail.ThongBaoBienBanHuyBoPXK : LoaiEmail.ThongBaoBienBanHuyBoHoaDon
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        console.log(rs);
        this.message.success(`Gửi biên bản hủy ${this.txtHD_PXK} thành công!`)
        this.modal.destroy(true);
      }
    });
  }
  XoaBoHoaDon(data: any = null, isView = false) {
    if (data && data.trangThai == 2 && isView == false) {
      isView = true;
    }
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: `Xóa bỏ ${this.txtHD_PXK}`,
      nzContent: XoaBoHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 45,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: !isView,
        data: data,
        isCheckViewFromBB: true
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.ngOnInit();
      }
    });
  }
  uploadFile(event: any) {
    console.log('uploadFile');
    if (event && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > (1024 * 1024 * 3)) {
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
              msContent: 'Dung lượng file vượt quá 3MB.',
              msOnClose: () => {
              },
            }
          });
          return false;
        }
        if (!this.utilityService.checkExtension(event.target.files[i].name, this.validExtentions)) {
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
              msContent: 'File không hợp lệ.',
              msOnClose: () => {
              },
            }
          });
          return false;
        }

        const file = event.target.files[i];
        var li = GetFileUrl(file);
        this.listFile.push({ tenGoc: file.name, file: file, link: li });
        console.log(this.listFile);
      }
    }
  }

  callUploadApi22() {
    var files = this.listFile.filter(x => x.file).map(x => x.file);
    var removedFiles = this.uploadedFile.filter(x => !this.listFile.map(y => y.taiLieuDinhKemId).includes(x.taiLieuDinhKemId));

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: this.data.hoaDonDienTuId,
      loaiNghiepVu: RefType.HoaDonXoaBo,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        //sau khi insert thành công thì tải lại các file để nhận về taiLieuDinhKemId
        this.reload(res);
      });
  }

  downloadFile(item: TaiLieuDinhKem) {
    DownloadFile(item.link, item.tenGoc);
  }

  deleteFile(item: TaiLieuDinhKem) {
    if (item.taiLieuDinhKemId == undefined) {
      this.listFile = this.listFile.filter(x => x !== item);
    } else {
      //xóa file trên server
      this.spinning = true;
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msTitle: `Xóa tài liệu đính kèm`,
          msContent: 'Bạn có muốn xóa tài liệu đính kèm này không?',
          msOnClose: () => {
            this.spinning = false;
            return;
          },
          msOnOk: () => {
            this.listFile = this.listFile.filter(x => x.taiLieuDinhKemId != item.taiLieuDinhKemId);
            if (this.listFile.length == 0) {
              //lúc đầu upload chưa có taiLieuDinhKemId thì dùng tên file
              this.listFile = this.listFile.filter(x => x.tenGoc != item.tenGoc);
            }
            this.callUploadApi22();
          },
        }
      });
    }
  }

  onFileInputSave(event: any) {
    console.log('onFileInputSave');
    const files = event.target.files;
    if (files && files[0]) {
      var fff = this.uploadFile(event);
      if (fff == false) {
        return;
      }
      //file đính kèm
      var ss = this.callUploadApi22();
      this.message.success("Thêm file thành công.");
    }
  }

  destroyModal() {
    if (this.mainForm.dirty && this.isEdit == true) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.ConfirmBeforeClosing,
          msOnOk: () => {
            this.save();
          },
          msOnClose: () => {
            if (this.isShowFromBangKeXoaBo == true) { this.modal.destroy(true); } else {
              this.modal.destroy();
            }
          }
        },
        nzFooter: null
      });
    } else {
      if (this.isShowFromBangKeXoaBo == true) { this.modal.destroy(true); } else {
        this.modal.destroy();
      }
    }
  }

  reload(res: any) {
    console.log('reload');
    console.log(this.data);

    if (res) {
      this.spinning = false;
      this.isShowFromBangKeXoaBo = true;
      let id = this.data.hoaDonDienTuId == null ? this.data.thongTinHoaDonId : this.data.hoaDonDienTuId;

      this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(id).subscribe((rs: any) => {
        this.formData = rs;
        if (rs.hoaDonDienTuId == null) {
          this.thongTinHoaDonService.GetById(id).subscribe((rsTT: any) => {
            rsTT.checkHideBtnXemHd = this.data.checkHideBtnXemHd;
            this.data = rsTT;
            this.ngOnInit();
          });
        } else {
          this.hoaDonDienTuService.GetById(rs.hoaDonDienTuId).subscribe((resHd: any) => {
            resHd.checkHideBtnXemHd = this.data.checkHideBtnXemHd;
            this.data = resHd;
            this.ngOnInit();
          });
        }
      });

    }
  }
  getReloadDataBenA() {
    this.spinning = true;

    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {

      this.mainForm.controls['tenCongTyBenA'].setValue(this.hoSoHDDT.tenDonVi);
      this.mainForm.controls['diaChiBenA'].setValue(this.hoSoHDDT.diaChi);
      this.mainForm.controls['maSoThueBenA'].setValue(this.hoSoHDDT.maSoThue);
      this.mainForm.controls['soDienThoaiBenA'].setValue(this.hoSoHDDT.soDienThoaiLienHe);
      this.mainForm.controls['daiDienBenA'].setValue(this.hoSoHDDT.hoTenNguoiDaiDienPhapLuat);

      this.spinning = false;
    });
  }
}

