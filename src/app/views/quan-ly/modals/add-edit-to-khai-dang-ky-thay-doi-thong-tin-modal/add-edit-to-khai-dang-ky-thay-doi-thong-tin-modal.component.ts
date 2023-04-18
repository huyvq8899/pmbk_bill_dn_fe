import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { base64ToArrayBuffer, convertArrayBufferToBase64, DownloadFile, getcks, GetFileUrl, getNoiDungLoiPhatHanhHoaDon, getTenLoaiHoaDon, getUyNhiemLapHoaDons, isSelectChuKiCung, saveByteArray, setStyleTooltipError, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { CheckValidPhone } from 'src/app/customValidators/check-valid-phone.validator';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { Message } from 'src/app/shared/Message';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin, Subscription } from 'rxjs';
import { SumwidthConfig } from 'src/app/shared/global';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { MessageInv } from 'src/app/models/messageInv';
import { WebSocketService } from 'src/app/services/websocket.service';
import { getuid } from 'process';
import { GUID } from 'src/app/shared/Guid';
import { identifierModuleUrl } from '@angular/compiler';
import { TransferFormat } from '@aspnet/signalr';
import { CheckValidMst, CheckValidMst2 } from 'src/app/customValidators/check-valid-mst.validator';
import { CookieConstant } from 'src/app/constants/constant';
import { isBuffer } from 'util';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { element } from 'protractor';
import { truncateSync } from 'fs';
import { ChonCTSTuThongTinNguoiNopThueModalComponent } from '../chon-cts-tu-thong-tin-nguoi-nop-thue-modal/chon-cts-tu-thong-tin-nguoi-nop-thue-modal.component';
import { AddEditDangKyUyNhiemModalComponent } from '../add-edit-dang-ky-uy-nhiem-modal/add-edit-dang-ky-uy-nhiem-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { ESignCloudService } from 'src/app/services/Config/eSignCloud.service';

@Component({
  selector: 'app-add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal',
  templateUrl: './add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal.component.html',
  styleUrls: ['./add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal.component.scss']
})
export class AddEditToKhaiDangKyThayDoiThongTinModalComponent implements OnInit, AfterViewChecked {
  @Input() callBackAfterClosing: () => any;
  @Input() data: any;
  @Input() dTKhai: any;
  @Input() tenCQTQLy: string;
  @Input() isAddNew: boolean;
  @Input() isCopy: boolean;
  @Input() isThemMoi: boolean;
  @Input() nhanUyNhiem: boolean;
  @Input() loaiUyNhiem: number;
  @Input() phuongPhapTinh: string;
  @Input() fbEnableEdit: boolean;
  @Input() hoSoHDDT: any;
  @Input() autoSign: boolean;
  isSaved = false;
  isSigned = false;
  ActivedModal: any = null;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnESignDisable: boolean;
  fbBtnBackwardDisable: boolean;
  fbBtnForwardDisable: boolean;
  fbBtnSaveDisable: boolean;
  fbBtnFirst: boolean;
  fbBtnLast: boolean;
  tienLuiModel: any;
  mainForm: FormGroup;
  spinning = false;
  sending = false;
  coQuanThueQuanLys: any[] = [];
  coQuanThueCapCucs: any[] = [];
  diaDanhs: any[] = [];
  nghiDinh = "Theo Nghị định số 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 của Chính phủ, chúng tôi/tôi thuộc đối tượng sử dụng hóa đơn điện tử. Chúng tôi/tôi đăng ký/thay đổi thông tin đã đăng ký với cơ quan thuế về việc sử dụng hóa đơn điện tử như sau:";
  hinhThucDangKys = [
    { id: 1, name: "Thêm mới" },
    { id: 2, name: "Gia hạn" },
    { id: 3, name: "Ngừng sử dụng" },
  ];
  pThucThanhToans = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tiền mặt/Chuyển khoản" },
    { id: 4, name: "Đối trừ công nợ" },
    { id: 5, name: "Không thu tiền" },
    { id: 9, name: "Khác" },
  ]

  tinhChats = [
    { id: 1, name: "Hàng hóa, dịch vụ" },
    { id: 2, name: "Khuyến mại" },
    { id: 3, name: "Chiết khấu thương mại" },
    { id: 4, name: "Ghi chú/diễn giải" },
  ]
  //isSelectChuKiCung = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IsSelectChuKiCung').giaTri === 'true';
  webSubcription: Subscription;
  widthConfigTabCTS = ["50px", "50px", "250px", "200px", "150px", '150px', '150px'];
  scrollConfigTabCTS = { x: SumwidthConfig(this.widthConfigTabCTS), y: '280px' }
  widthConfigTabDKUN = ["50px", "200px", "150px", "150px", "200px", "200px", "170px", '150px'];
  scrollConfigTabDKUN = { x: SumwidthConfig(this.widthConfigTabDKUN), y: '280px' }
  signing = false;
  tDiepGui: any;
  permission: boolean = false;
  thaoTacs: any[] = [];
  listDangKyUyNhiem: any[] = [];
  tdiep: any;
  ngayKyGui: any;
  addCTS = false;
  idCu = null;
  disabledCTS = true;
  thongDiepChungId = null;
  ctsKyMem: any
  isKymem: boolean;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private hoSoHDDTService: HoSoHDDTService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private webSocket: WebSocketService,
    private authsv: AuthService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService,
    private eSignCloud: ESignCloudService,
  ) {
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung')
      this.createObservableSocket();
  }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs;
    }

    if (this.isCopy) {
      this.idCu = this.dTKhai.id;
      this.dTKhai.id = null;
      this.dTKhai.signedStatus = false;
    }
    this.getNgayKyGui();
    this.getListUyNhiem();
    this.createForm();
    this.disableOrEnableHeaderButtons();
    if (this.autoSign == true) {
      this.eSign();
    }
    if (isSelectChuKiCung(this.tuyChonService) !== 'KiCung') {
      this.ctsKyMem = isSelectChuKiCung(this.tuyChonService);
      this.isKymem = true;
    }
  }

  closeModal() {
    this.modal.destroy();
    if (this.callBackAfterClosing != null) {
      this.callBackAfterClosing()
    }

  }

  getHoSoHDDT() {
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.hoSoHDDT = rs;
    })
  }

  getListUyNhiem() {
    if (this.dTKhai && this.nhanUyNhiem == true) {
      this.quyDinhKyThuatService.GetListDangKyUyNhiem(this.dTKhai.id).subscribe((rs: any[]) => {
        this.listDangKyUyNhiem = rs;
        this.listDangKyUyNhiem.forEach(x => {
          x.tLHDon = x.tlhDon;
          x.kHMSHDon = x.khmshDon;
          x.kHHDon = x.khhDon;
          x.mST = x.mst;
          x.tTChuc = x.ttChuc;
          x.tNgayDisplay = moment(x.tNgay).format("DD/MM/YYYY"),
            x.dNgayDisplay = moment(x.dNgay).format("DD/MM/YYYY")
        })
      })
    }
  }

  disableOrEnableHeaderButtons() {
    if (this.fbEnableEdit === false) {
      this.disableControls(true);
      this.fbBtnSaveDisable = true;
      this.fbBtnPlusDisable = false;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = false;
      this.fbBtnESignDisable = false;
    } else {
      this.disableControls(false);
      this.fbBtnSaveDisable = false;
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = true;
      this.fbBtnDeleteDisable = true;
      this.fbBtnPrinterDisable = true;
      this.fbBtnESignDisable = true;
    }
  }

  chonDKUN() {
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: `6. Đăng ký ủy nhiệm lập hóa đơn`,
      nzContent: AddEditDangKyUyNhiemModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '100%',
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        toKhaiId: this.dTKhai ? this.dTKhai.id : null
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any[]) => {
      this.listDangKyUyNhiem = rs;
      this.listDangKyUyNhiem.forEach(x => {
        x.tLHDon = x.tlhDon;
        x.kHMSHDon = x.khmshDon;
        x.kHHDon = x.khhDon;
        x.mST = x.mst;
        x.tTChuc = x.ttChuc;
        x.tNgayDisplay = moment(x.tNgay).format("DD/MM/YYYY"),
          x.dNgayDisplay = moment(x.dNgay).format("DD/MM/YYYY")
      })
    })
  }

  disableControls(disabled = true) {
    if (disabled) {
      this.fbBtnPlusDisable = false;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = false;
      this.fbBtnSaveDisable = true;
      this.mainForm.disable();
      (this.mainForm.get('cTS') as FormArray)
        .controls
        .forEach(control => {
          control.disable();
        });

      // (this.mainForm.get('dKUNhiem') as FormArray)
      //   .controls
      //   .forEach(control => {
      //     control.disable();
      //   });
    } else {
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = true;
      this.fbBtnDeleteDisable = true;
      this.fbBtnPrinterDisable = true;
      this.fbBtnSaveDisable = false;
      this.mainForm.enable();
      this.mainForm.get('tNNT').disable();
      this.mainForm.get('mST').disable();
      this.mainForm.get('mCQTQLy').disable();
      /*       this.mainForm.get('dDanh').disable(); */
      if (this.nhanUyNhiem == true) {
        this.mainForm.get('cMa').disable();
        this.mainForm.get('kCMa').disable();
        this.mainForm.get('cmtmtTien').disable();
        this.mainForm.get('nNTDBKKhan').disable();
        this.mainForm.get('nNTKTDNUBND').disable();
        this.mainForm.get('cDLTTDCQT').disable();
        this.mainForm.get('cDLQTCTN').disable();
        this.mainForm.get('cDDu').disable();
        this.mainForm.get('cBTHop').disable();
        this.mainForm.get('hDGTGT').disable();
        this.mainForm.get('hDKhac').disable();
        this.mainForm.get('cTu').disable();
      }

      (this.mainForm.get('cTS') as FormArray)
        .controls
        .forEach(control => {
          control.enable();
        });

      if (!this.nhanUyNhiem) {
        if (this.isAddNew) {

          this.mainForm.get('cMa').setValue(true);
          this.changeCMa(true);
        }
        else {
          var cMa = this.mainForm.get('cMa').value;
          var kCMa = this.mainForm.get('kCMa').value;
          if (cMa == true) {
            this.changeCMa(cMa);
          }
          else this.changeKCMa(kCMa);
        }
      }
    }

    // this.mainForm.get('hDBTSCong').disable();
    // this.mainForm.get('hDBHDTQGia').disable();
    // this.mainForm.get('hDKhac').disable();
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetListCoQuanThueQuanLy(),
      this.hoSoHDDTService.GetListCoQuanThueCapCuc(),
      this.thongDiepGuiCQTService.GetDanhSachDiaDanh(),
      this.hoSoHDDTService.GetDetail(),
      this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai ? this.dTKhai.id : null)
    ])
  }

  createForm() {
    this.spinning = true;
    this.mainForm = this.fb.group({
      tNNT: [{ value: this.data != null ? this.data.dltKhai.ttChung.tnnt : null, disabled: true }, [Validators.required]],
      mST: [{ value: this.data != null ? this.data.dltKhai.ttChung.mst : null, disabled: true }, [Validators.required, CheckValidMst, CheckValidMst2]],
      mCQTQLy: [{ value: this.data != null ? this.data.dltKhai.ttChung.mcqtqLy : null, disabled: true }, [Validators.required]],
      mCQTQLyInput: [{ value: this.data != null ? this.data.dltKhai.ttChung.mcqtqLy : null, disabled: true }],
      nLHe: [{ value: this.data != null ? this.data.dltKhai.ttChung.nlHe : null, disabled: !this.fbEnableEdit }, [Validators.required, Validators.maxLength(50)]],
      dTLHe: [{ value: this.data != null ? this.data.dltKhai.ttChung.dtlHe : null, disabled: !this.fbEnableEdit }, [Validators.required, CheckValidPhone, Validators.maxLength(20)]],
      dCLHe: [{ value: this.data != null ? this.data.dltKhai.ttChung.dclHe : null, disabled: !this.fbEnableEdit }, [Validators.required, Validators.maxLength(400)]],
      dCTDTu: [{ value: this.data != null ? this.data.dltKhai.ttChung.dctdTu : null, disabled: !this.fbEnableEdit }, [Validators.required, CheckValidEmail, Validators.maxLength(50)]],
      cMa: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.hthDon.cMa == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cmtmtTien: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.hthDon.cmtmtTien == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      kCMa: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.hthDon.kcMa == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      nNTDBKKhan: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.htgdlhddt.nntdbkKhan == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      nNTKTDNUBND: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.htgdlhddt.nntktdnubnd == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cDLTTDCQT: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.htgdlhddt.cdlttdcqt == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cDLQTCTN: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.htgdlhddt.cdlqtctn == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cDDu: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.pThuc.cdDu == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cBTHop: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.pThuc.cbtHop == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      hDGTGT: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.hdgtgt == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      hDBHang: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.hdbHang == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      hDBTSCong: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.hdbtsCong == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      hDBHDTQGia: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.hdbhdtqGia == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      hDKhac: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.hdKhac == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      cTu: [{ value: this.nhanUyNhiem == false ? (this.data != null ? (this.data.dltKhai.ndtKhai.lhdsDung.cTu == 1 ? true : false) : false) : false, disabled: !this.fbEnableEdit }],
      dDanh: [{ value: null, disabled: true }],
      nLap: [this.data != null ? moment(this.data.dltKhai.ttChung.nLap).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")],
      nNT: [this.data != null ? this.data.dscks.nnt : this.hoSoHDDT.hoTenNguoiDaiDienPhapLuat],
      cTS: this.fb.array([]),
    });

    //this.changeKCMa(true);
    this.forkJoin().subscribe((rs: any[]) => {
      this.coQuanThueQuanLys = rs[0];
      this.coQuanThueCapCucs = rs[1];
      this.diaDanhs = rs[2];
      this.hoSoHDDT = rs[3];
      this.tdiep = rs[4];

      if (this.isAddNew) {
        this.mainForm.get('tNNT').setValue(this.hoSoHDDT.tenDonVi);
        this.mainForm.get('tNNT').disable();
        this.mainForm.get('mST').setValue(this.hoSoHDDT.maSoThue);
        this.mainForm.get('mST').disable();
        this.mainForm.get('mCQTQLyInput').setValue(this.tenCQTQLy);
        this.mainForm.get('mCQTQLy').setValue(this.coQuanThueQuanLys.find(x => x.name == this.tenCQTQLy).code);
        this.mainForm.get('mCQTQLy').disable();
        this.mainForm.get('nLHe').setValue(this.hoSoHDDT.hoTenNguoiDaiDienPhapLuat);
        this.mainForm.get('dCLHe').setValue(this.hoSoHDDT.diaChi);
        this.mainForm.get('dCTDTu').setValue(this.hoSoHDDT.emailLienHe);
        this.mainForm.get('dTLHe').setValue(this.hoSoHDDT.soDienThoaiLienHe);

        var coQuanThueCapCuc = this.coQuanThueCapCucs.find(x => x.code == this.coQuanThueQuanLys.find(y => y.name == this.tenCQTQLy).parent_code);
        var diaDanh = this.diaDanhs.find(x => x.code == coQuanThueCapCuc.parent_code);

        this.mainForm.get('dDanh').setValue(diaDanh.code);
        /*         this.mainForm.get('dDanh').disable(); */

      }
      else {
        if (this.tdiep && this.tdiep.trangThaiGui != -1) {
          this.isSigned = true;
        }

        if (this.isSigned == true || this.fbEnableEdit == false) {
          this.isSaved = true;
        }

        this.mainForm.get('tNNT').disable();
        this.mainForm.get('mST').disable();
        this.mainForm.get('mCQTQLy').disable();

        var diaDanh = this.diaDanhs.find(x => x.name == this.data.dltKhai.ttChung.dDanh);

        this.mainForm.get('dDanh').setValue(diaDanh.code);
        /*        this.mainForm.get('dDanh').disable(); */

        const cts = this.data.dltKhai.ndtKhai.dsctssDung;
        const ctsArr = this.mainForm.get('cTS') as FormArray;
        ctsArr.clear();
        cts.forEach((item: any) => {
          const formGroup = this.createCTS(item);
          if (!this.fbEnableEdit) formGroup.disable();
          ctsArr.push(formGroup);
        });


        var tenCQT = this.data.dltKhai.ttChung.cqtqLy;
        while (tenCQT.indexOf("–") > 0) {
          tenCQT = tenCQT.replace("–", "-");
        }

        var maCQT = this.coQuanThueQuanLys.find(x => x.name == tenCQT);

        this.mainForm.get('mCQTQLyInput').setValue(this.data.dltKhai.ttChung.cqtqLy);

        if (maCQT.code != this.data.dltKhai.ttChung.mCQTQLy) {
          this.data.dltKhai.ttChung.mCQTQLy = maCQT.code;
          this.mainForm.get('mCQTQLy').setValue(this.data.dltKhai.ttChung.mCQTQLy);
        }

        if (this.data.dltKhai.ttChung.mCQTQLy != this.hoSoHDDT.coQuanThueQuanLy && this.fbEnableEdit) {
          this.data.dltKhai.ttChung.mCQTQLy = this.hoSoHDDT.coQuanThueQuanLy;
          this.mainForm.get('mCQTQLy').setValue(this.data.dltKhai.ttChung.mCQTQLy);
        }

        if (this.data.dltKhai.ttChung.tnnt != this.hoSoHDDT.tenDonVi && this.fbEnableEdit) {
          this.data.dltKhai.ttChung.tnnt = this.hoSoHDDT.coQuanThueQuanLy;
          this.mainForm.get('tNNT').setValue(this.data.dltKhai.ttChung.tnnt);
        }

        if (this.data.dltKhai.ttChung.mst != this.hoSoHDDT.maSoThue && this.fbEnableEdit) {
          this.data.dltKhai.ttChung.mst = this.hoSoHDDT.maSoThue;
          this.mainForm.get('mST').setValue(this.data.dltKhai.ttChung.mst);
        }

        if (!this.isCopy && this.fbEnableEdit) {
          this.submitForm(false);
        }
      }
      this.spinning = false;
    });
  }

  changeNgayLap(event: any) {
    if (moment(event).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')) {
      this.mainForm.get('nLap').setValue(moment().format('YYYY-MM-DD'));
    }
  }

  createCTS(data: any = null): FormGroup {
    return this.fb.group({
      sTT: [data == null ? 1 : data.stt],
      tTChuc: [data == null ? null : data.ttChuc, [Validators.required]],
      seri: [data == null ? null : data.seri, [Validators.required]],
      tNgay: [data == null ? moment().format("YYYY-MM-DD") : data.tNgay],
      dNgay: [data == null ? moment().format("YYYY-MM-DD") : data.dNgay],
      tNgayD: [data == null ? moment().format("YYYY-MM-DD") : moment(data.tNgay).format('YYYY-MM-DD'), [Validators.required]],
      dNgayD: [data == null ? moment().format("YYYY-MM-DD") : moment(data.dNgay).format('YYYY-MM-DD'), [Validators.required]],
      hThuc: [data == null ? 1 : data.hThuc, [Validators.required]],
      auto: [data == null ? false : (data.auto ? data.auto : false)]
    });
  }

  addItem() {
    this.disabledCTS = false;
    const ctsArr = this.mainForm.get('cTS') as FormArray;
    const cts = ctsArr.value as any[];

    if (cts.length === 0) {
      ctsArr.push(this.createCTS({
        stt: 1,
        tTChuc: null,
        seri: null,
        tNgay: moment().format("YYYY-MM-DD"),
        dNgay: moment().format("YYYY-MM-DD"),
        hThuc: 1,
      }));
    } else {
      let lastItem = cts[cts.length - 1];
      lastItem = [];
      lastItem.stt += 1;
      ctsArr.push(this.createCTS(lastItem));
    }
  }

  removeRow(i: any) {
    const ctsArr = this.mainForm.get('cTS') as FormArray;
    ctsArr.removeAt(i);
    if (ctsArr.length == 0) this.disabledCTS = true;
  }

  ///Thao tác trên checkbox
  changeKCMa(event: any) {
    if (this.checkCountOfHinhThucHoaDon() > 0) {
      if (event == true) {
        if (this.mainForm.get('cMa').value == true || this.mainForm.get('cmtmtTien').value == true) {
          this.mainForm.get('nNTDBKKhan').enable();
          this.mainForm.get('nNTKTDNUBND').enable();
          this.mainForm.get('nNTDBKKhan').setValue(false);
          this.mainForm.get('nNTKTDNUBND').setValue(false);
        }
        if (this.mainForm.get('cMa').value == false && this.mainForm.get('cmtmtTien').value == false) {
          this.mainForm.get('nNTDBKKhan').disable();
          this.mainForm.get('nNTKTDNUBND').disable();
          this.mainForm.get('nNTDBKKhan').setValue(false);
          this.mainForm.get('nNTKTDNUBND').setValue(false);
        }
        //this.mainForm.get('kCMa').setValue(event);
        this.mainForm.get('cDLTTDCQT').disable();
        this.mainForm.get('cDLQTCTN').enable();
        this.mainForm.get('cDLQTCTN').setValue(true);
        this.mainForm.get('cDDu').enable();
        this.mainForm.get('cBTHop').enable();
        this.mainForm.get('cDDu').setValue(true);
        this.mainForm.get('cBTHop').setValue(false);
      }
      else {
        this.mainForm.get('cDDu').disable();
        this.mainForm.get('cBTHop').disable();
        this.mainForm.get('cDDu').setValue(true);
        this.mainForm.get('cBTHop').setValue(false);
      }
    } else {
      this.mainForm.get('kCMa').setValue(true);
    }

  }

  changeCMa(event: any) {
    if (this.checkCountOfHinhThucHoaDon() > 0) {
      if (event == true) {
        if (this.mainForm.get('kCMa').value == true) {
          this.mainForm.get('cDDu').disable();
          this.mainForm.get('cBTHop').disable();
        }
        if (this.mainForm.get('kCMa').value == false) {
          this.mainForm.get('cDDu').disable();
          this.mainForm.get('cBTHop').disable();
        }
        if (this.mainForm.get('cmtmtTien').value == true) {
          //this.mainForm.get('kCMa').setValue(false);
        }
        this.mainForm.get('cmtmtTien').enable();

        this.mainForm.get('cDDu').setValue(true);
        this.mainForm.get('cBTHop').setValue(false);
        this.mainForm.get('nNTDBKKhan').enable();
        this.mainForm.get('nNTKTDNUBND').enable();
        this.mainForm.get('nNTDBKKhan').setValue(false);
        this.mainForm.get('nNTKTDNUBND').setValue(false);
      }
      else {
        this.mainForm.get('nNTDBKKhan').disable();
        this.mainForm.get('nNTKTDNUBND').disable();
        this.mainForm.get('nNTDBKKhan').setValue(false);
        this.mainForm.get('nNTKTDNUBND').setValue(false);

      }
    } else {
      this.mainForm.get('cMa').setValue(true);
    }
  }

  changeKKhan(event: any) {
    if (event == true) {
      if (this.mainForm.get('nNTKTDNUBND').value == true) {
        this.mainForm.get('nNTKTDNUBND').setValue(false);
      }
    }
  }

  changeUBND(event: any) {
    if (event == true) {
      if (this.mainForm.get('nNTDBKKhan').value == true) {
        this.mainForm.get('nNTDBKKhan').setValue(false);
      }
    }
  }

  changeCDLDCQT(event: any) {
    if (event == true) {
      if (this.mainForm.get('cDLQTCTN').value == true) {
        this.mainForm.get('cDLQTCTN').setValue(false);
      }
    }
    else {
      if (this.mainForm.get('kCMa').value == true) {
        this.mainForm.get('cDLQTCTN').setValue(true);
        this.changeCDLQTCTN(true);
      }
    }
  }

  changeCDLQTCTN(event: any) {
    if (event == true) {
      if (this.mainForm.get('cDLTTDCQT').value == true) {
        this.mainForm.get('cDLTTDCQT').setValue(false);
      }
    }
  }

  changeCDDu(event: any) {
    if (event == false && this.nhanUyNhiem == false) {
      if (this.mainForm.get('cBTHop').value == false) {
        this.mainForm.get('cBTHop').setValue(true);
      }
    }
  }

  changeCBTHop(event: any) {
    if (event == false && this.nhanUyNhiem == false) {
      if (this.mainForm.get('cDDu').value == false) {
        this.mainForm.get('cDDu').setValue(true);
      }
    }
  }

  //blur textbox
  blur(control: any) {
    //event.preventDefault();
    this.mainForm.get(control).markAsTouched();
    this.mainForm.get(control).updateValueAndValidity();
    if (this.mainForm.get(control).invalid) {
      setStyleTooltipError();
    }
  }

  blurDetail(index: number, control: any) {
    const ctsArr = this.mainForm.get('cTS') as FormArray;
    const forms = ctsArr.controls as FormGroup[];
    forms[index].get(control).markAsTouched();
    forms[index].get(control).updateValueAndValidity();
    if (forms[index].get(control).invalid) {
      setStyleTooltipError_Detail();
    }
  }

  ///CRUD
  onAddObjClick(): void {
    if (this.fbBtnEditDisable === true) return;
    if (this.isAddNew === true) return;
    this.fbEnableEdit = true;
    this.isAddNew = true;
    this.disableOrEnableHeaderButtons();
    this.createForm();
  }

  onEditClick() {
    this.isAddNew = false;
    this.isCopy = false;
    this.fbEnableEdit = true;
    this.isSaved = false;

    this.disableOrEnableHeaderButtons();
  }

  onDeleteClick() {
    if (this.isAddNew === true) return;
    if (this.fbBtnEditDisable === true) return;

    if (this.dTKhai) {
      this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai.id).subscribe((td: any) => {
        if (td.trangThaiGui != -1) {
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
              msTitle: 'Cảnh báo',
              msContent: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử đã ký điện tử và gửi CQT. Bạn không được phép xóa.`,
            },
            nzFooter: null
          });
          return;
        }
        const modal = this.ActivedModal = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msTitle: `Xóa thông điệp`,
            msContent: '<span>Bạn có thực sự muốn xóa không?</span>',
            msOnClose: () => {
              return;
            },
            msOnOk: () => {
              this.quyDinhKyThuatService.XoaToKhai(td.idThamChieu).subscribe((res: any) => {
                if (res) {
                  this.quyDinhKyThuatService.DeleteThongDiepChung(td.thongDiepChungId).subscribe((rs: boolean) => {
                    if (rs) {
                      this.nhatKyTruyCapService.Insert({
                        loaiHanhDong: LoaiHanhDong.Xoa,
                        refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                        thamChieu: 'Tờ khai tạo ngày: ' + moment(td.ngayTao).format("YYYY-MM-DD"),
                        refId: td.id
                      }).subscribe();
                      this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                      this.modal.destroy(true);
                      if (this.callBackAfterClosing != null) {
                        this.callBackAfterClosing()
                      }
                    } else {
                      this.message.error(Message.DONT_DELETE_DANH_MUC);
                    }

                  });
                }
                else {
                  this.message.error(Message.DONT_DELETE_DANH_MUC);
                }
              }, _ => {
                this.message.error(Message.DONT_DELETE_DANH_MUC);
              })
            },
          }
        });
      });
    } else {
    }
  }
  ///

  layTuThongTinNNT() {
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: `Chọn chứng thư số sử dụng`,
      nzContent: ChonCTSTuThongTinNguoiNopThueModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '100%',
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        rs.forEach(item => {
          let i = rs.indexOf(item);
          const ctsArr = this.mainForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];
          if (cts.length == 0 || (cts.length === 1 && cts[0].seri == null)) {
            ctsArr.clear();
            ctsArr.push(this.createCTS({
              stt: i + 1,
              ttChuc: item.ttChuc,
              seri: item.seri,
              tNgay: moment(item.tNgay).format("YYYY-MM-DD"),
              dNgay: moment(item.dNgay).format("YYYY-MM-DD"),
              hThuc: 1,
            }));

            this.signing = false;
            this.spinning = false;
          } else {
            const lastItem = cts[cts.length - 1];
            var same = false;

            var index = 0;
            var hThuc = [];
            cts.forEach((element: any) => {
              if (element.seri.toUpperCase() == item.seri.toUpperCase() && moment(element.tNgay).format("YYYY-MM-DDThh:mm:ss") == moment(item.tNgay).format("YYYY-MM-DDThh:mm:ss") && moment(element.dNgay).format("YYYY-MM-DDThh:mm:ss") == moment(item.dNgay).format("YYYY-MM-DDThh:mm:ss")) {
                same = true;
                index = cts.indexOf(element);
                hThuc.push(element.hThuc);
              }
            })

            if (same == false) {
              ctsArr.push(this.createCTS({
                stt: lastItem.sTT + 1,
                ttChuc: item.ttChuc,
                seri: item.seri,
                tNgay: moment(item.tNgay).format("YYYY-MM-DDThh:mm:ss"),
                dNgay: moment(item.dNgay).format("YYYY-MM-DDThh:mm:ss"),
                hThuc: 1,
              }));
            }
            else {
              if (this.hinhThucDangKys.filter(x => hThuc.indexOf(x.id) < 0).length > 0) {
                ctsArr.push(this.createCTS({
                  stt: lastItem.sTT + 1,
                  ttChuc: item.ttChuc,
                  seri: item.seri,
                  tNgay: moment(item.tNgay).format("YYYY-MM-DDThh:mm:ss"),
                  dNgay: moment(item.dNgay).format("YYYY-MM-DDThh:mm:ss"),
                  hThuc: this.hinhThucDangKys.filter(x => hThuc.indexOf(x.id) < 0)[0].id,
                }));
              }
            }
            this.signing = false;
            this.spinning = false;
          }
        })
      }
    });
  }
  ///Ký và gửi thông điệp
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

                const dtToKhai = rs.nhanUyNhiem ? rs.toKhaiUyNhiem : rs.toKhaiKhongUyNhiem;
                var serials = dtToKhai.dltKhai.ndtKhai.dsctssDung.map(x => x.seri);
                console.log(serials);
                const msg = {
                  mLTDiep: !rs.nhanUyNhiem ? 100 : 101,
                  dataXML: res.result,
                  urlXML: fileUrl,
                  serials: serials,
                  mst: dtToKhai.dltKhai.ttChung.mst
                };
                if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
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
                } else {
                  this.kiMem(msg);
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

  chonCTS() {
    if (isSelectChuKiCung(this.tuyChonService) !== 'KiCung') {
      let cts = this.ctsKyMem.split('|')[1];
      this.addCTS = true;
      this.signing = true;
      this.eSignCloud.GetInfoSignCloud(cts).subscribe((rs: any) => {
        if (rs) {
          console.log(rs);
          const ctsArr = this.mainForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];
          console.log(cts);
          ctsArr.removeAt(ctsArr.length - 1)
          ctsArr.push(this.createCTS({
            stt: 1,
            ttChuc: rs.ttChuc,
            seri: rs.seri,
            tNgayD: moment(rs.tNgay).format("YYYY-MM-DD"),
            dNgayD: moment(rs.dNgay).format("YYYY-MM-DD"),
            tNgay: moment(rs.tNgay).format("YYYY-MM-DDTHH:mm:ss"),
            dNgay: moment(rs.dNgay).format("YYYY-MM-DDTHH:mm:ss"),
            hThuc: 1,
          }));
          this.spinning = false;
          this.addCTS = false;
          this.signing = false;
          this.disabledCTS = true;

        }
      });
    } else {

      this.addCTS = true;
      this.signing = true;
      this.createObservableSocket();
      const msg = {
        mLTDiep: "050",
        mst: this.hoSoHDDT.maSoThue
      };

      if (this.webSocket.isOpenSocket()) {
        //khi socket mở thì gửi thông tin lên socket
        this.webSocket.sendMessage(JSON.stringify(msg));
      }
      else {
        if (this.webSocket.isConnecting()) {
          //khi socket ở trạng thái đang kết nối
          //đợi 2000ms để socket được mở
          setTimeout(() => {
            if (this.webSocket.isOpenSocket()) {
              //nếu socket mở thì thoát time out
              this.webSocket.sendMessage(JSON.stringify(msg));
              //clearTimeout();
            }
          }, 2000);

          //nếu sau 2s mà vẫn k connect được thì ngắt
          if (!this.webSocket.isOpenSocket()) {
            this.spinning = false;
            this.signing = false;
          }
        }
        else {
          this.spinning = false;
          this.signing = false;
        }
        /*       this.modalService.create({
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
                  msOnOk: ()=>{
                    const link = document.createElement('a');
                    link.href = `${this.env.apiUrl}/${this.urlTools}`;
                    link.download = 'BKSOFT-KYSO-SETUP.zip';
                    link.click();
                  },
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: ()=>{
                    return;
                  },
                  msTitle: 'Hãy cài đặt công cụ ký số',
                  msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
                  <br>Để chọn chứng thư số, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
                },
                nzFooter: null
              }); */
      }
    }
  }

  async createObservableSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      if (!this.webSocket.isOpenSocket()) {
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
            msTitle: this.addCTS == false ? 'Ký tờ khai' : 'Chọn CTS',
            msContent: `Có lỗi xảy ra. Vui lòng thử lại.`,
          },
          nzFooter: null
        });
        this.spinning = false;
        this.addCTS = false;
        return;
      }
      let obj = JSON.parse(rs);
      obj.DataJSON = (obj.DataJson != null && obj.DataJson != undefined) ? JSON.parse(obj.DataJson) : null;
      console.log(obj);
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
                  doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
                  refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                  // thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
                  thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
                  moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:mm:ss")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
                  refId: this.dTKhai.id
                }).subscribe();

                //this.message.success("Ký tờ khai thành công!");
                this.quyDinhKyThuatService.GetToKhaiById(this.dTKhai.id).subscribe((rs: any) => {
                  this.GuiToKhai(rs);
                })
              }
              else this.modal.destroy(false);
            },
            err => {
              console.log(err);
              this.signing = false;
              this.spinning = false;
            }
          );
        } else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: 450,
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Chứng thư số',
              msContent: `Hãy chắc chắn chứng thư số đã đăng ký giao dịch điện tử với cơ quan thuế. Bạn có thể tra cứu tại <a target="_blank" href='https://thuedientu.gdt.gov.vn'>https://thuedientu.gdt.gov.vn</a>`,
            },
            nzFooter: null
          });

          console.log(this.addCTS);
          const ctsArr = this.mainForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];

          if (cts.length == 0 || (cts.length === 1 && cts[0].seri == null)) {
            ctsArr.clear();
            ctsArr.push(this.createCTS({
              stt: 1,
              ttChuc: obj.DataJSON.Issuer,
              seri: obj.DataJSON.SerialNumber,
              tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DDTHH:mm:ss"),
              dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DDTHH:mm:ss"),
              tNgayD: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
              dNgayD: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
              hThuc: 1,
            }));

            this.signing = false;
            this.spinning = false;
            this.addCTS = false;
          } else {
            const lastItem = cts[cts.length - 1];
            ctsArr.push(this.createCTS({
              stt: lastItem.sTT + 1,
              ttChuc: obj.DataJSON.Issuer,
              seri: obj.DataJSON.SerialNumber,
              tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DDTHH:mm:ss"),
              dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DDTHH:mm:ss"),
              tNgayD: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
              dNgayD: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
              hThuc: 1,
              auto: true
            }));

            this.signing = false;
            this.spinning = false;
            this.addCTS = false;
          }
        }
      }
      else {
        if (obj.MLTDiep != 50) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.KyToKhaiLoi,
            doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
            refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
            // thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
            thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
            moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:mm:ss")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
            refId: this.dTKhai.id
          }).subscribe();

          this.spinning = false;

          this.nhatKyThaoTacLoiService.Insert(this.thongDiepChungId, obj.Exception).subscribe();

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
              <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
          if (this.autoSign == true) this.autoSign = false;
        }
        else {
          this.spinning = false;

          this.nhatKyThaoTacLoiService.Insert(this.thongDiepChungId, obj.Exception).subscribe();

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
              <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
          this.addCTS = false;
          return;
        }
      }
    }, err => {
      this.spinning = false;
      if (this.signing == true && isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
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
            },
            msTitle: 'Kiểm tra lại',
            msContent: `Để ký tờ khai, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại..`,
          },
          nzFooter: null
        });
        this.signing = false;
        return;
      }
      else if (this.addCTS == true) {
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
            msOKText: "Tải BKSOFT KYSO",
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
            msContent: `Để chọn chứng thư số, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
          },
          nzFooter: null
        });

        this.addCTS = false;
        return;
      }
    });
  }
  async kiMem(dataKy: any) {
    this.webSubcription = (await this.webSocket.createObservableSocket('', dataKy)).subscribe((rs: any) => {
      let obj = rs;
      console.log(obj);
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
                  doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
                  refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                  // thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
                  thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
                  moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:mm:ss")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
                  refId: this.dTKhai.id
                }).subscribe();

                //this.message.success("Ký tờ khai thành công!");
                this.quyDinhKyThuatService.GetToKhaiById(this.dTKhai.id).subscribe((rs: any) => {
                  this.GuiToKhai(rs);
                })
              }
              else this.modal.destroy(false);
            },
            err => {
              console.log(err);
              this.signing = false;
              this.spinning = false;
            }
          );
        } else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: 450,
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Chứng thư số',
              msContent: `Hãy chắc chắn chứng thư số đã đăng ký giao dịch điện tử với cơ quan thuế. Bạn có thể tra cứu tại <a target="_blank" href='https://thuedientu.gdt.gov.vn'>https://thuedientu.gdt.gov.vn</a>`,
            },
            nzFooter: null
          });

          console.log(this.addCTS);
          const ctsArr = this.mainForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];

          if (cts.length == 0 || (cts.length === 1 && cts[0].seri == null)) {
            ctsArr.clear();
            ctsArr.push(this.createCTS({
              stt: 1,
              ttChuc: obj.DataJSON.Issuer,
              seri: obj.DataJSON.SerialNumber,
              tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DDTHH:mm:ss"),
              dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DDTHH:mm:ss"),
              tNgayD: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
              dNgayD: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
              hThuc: 1,
            }));

            this.signing = false;
            this.spinning = false;
            this.addCTS = false;
          } else {
            const lastItem = cts[cts.length - 1];
            ctsArr.push(this.createCTS({
              stt: lastItem.sTT + 1,
              ttChuc: obj.DataJSON.Issuer,
              seri: obj.DataJSON.SerialNumber,
              tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DDTHH:mm:ss"),
              dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DDTHH:mm:ss"),
              tNgayD: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
              dNgayD: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
              hThuc: 1,
              auto: true
            }));

            this.signing = false;
            this.spinning = false;
            this.addCTS = false;
          }
        }
      }
      else {
        if (obj.MLTDiep != 50) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.KyToKhaiLoi,
            doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
            refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
            // thamChieu: `Tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:MM:SS")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
            thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
            moTaChiTiet: `Ký tờ khai tạo lúc ${moment(this.dTKhai.ngayTao).format("YYYY-MM-DD HH:mm:ss")}, người nộp thuế ${this.data.dltKhai.ttChung.tnnt}, mã số thuế ${this.data.dltKhai.ttChung.mst}, ${this.data.dltKhai.ttChung.cqtqLy}`,
            refId: this.dTKhai.id
          }).subscribe();

          this.spinning = false;

          this.nhatKyThaoTacLoiService.Insert(this.thongDiepChungId, obj.Exception).subscribe();

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
              <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
          if (this.autoSign == true) this.autoSign = false;
        }
        else {
          this.spinning = false;

          this.nhatKyThaoTacLoiService.Insert(this.thongDiepChungId, obj.Exception).subscribe();

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
              <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
              <br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.signing = false;
          this.addCTS = false;
          return;
        }
      }
    },
      err => {
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
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              },
              msTitle: 'Kiểm tra lại',
              msContent: `Ký không thành công. Vui lòng kiểm tra lại.`,
            },
            nzFooter: null
          });
        }
      })
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

  eSign() {
    this.signing = true;

    if (this.data.dltKhai.ndtKhai.dsctssDung.length == 0 && isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
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
      this.isSaved = true
      this.autoSign = false;
      this.signing = false;
      return;
    }

    if (!this.nhanUyNhiem && this.data.dltKhai.ttChung.hThuc === 2) { // không ủy nhiệm + hình thức thay đổi thông tin
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
  }

  sendSocket() {
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') this.createObservableSocket();

    this.quyDinhKyThuatService.GetToKhaiById(this.dTKhai.id).subscribe(
      (result: any) => {
        if (result) {
          this.spinning = true;
          var tKhai = result.nhanUyNhiem == false ? result.toKhaiKhongUyNhiem : result.toKhaiUyNhiem;
          if (moment().format("YYYY-MM-DD") !== moment(tKhai.dltKhai.ttChung.nLap).format("YYYY-MM-DD")) {
            if (this.autoSign == true) this.autoSign = false;

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '450px',
              nzComponentParams: {
                msMessageType: MessageType.ConfirmBeforeClosing,
                msCancelText: TextGlobalConstants.TEXT_CONFIRM_BACK,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msQuestion: true,
                msTitle: 'Cập nhật ngày lập tờ khai',
                msContent: `Ngày lập tờ khai là ngày <b class="colorChuYTrongThongBao">${moment(tKhai.dltKhai.ttChung.nLap).format("DD/MM/YYYY")}</b>. Bạn có muốn cập nhật ngày lập thành ngày hiện tại <b class="colorChuYTrongThongBao">${moment().format("DD/MM/YYYY")}</b> không?
                <br/><br/>
                Bạn có thể chọn <b class="colorBlueTrongThongBao">Quay lại</b> để ngừng thực hiện <b>Ký và Gửi</b>!`,
                msOnCancel: () => {
                  this.spinning = false;
                },
                msOnOk: () => {
                  // update nLap
                  this.mainForm.get('nLap').setValue(moment().format('YYYY-MM-DD'));
                  const data = this.mainForm.getRawValue();
                  this.saveChanges(data, true, () => {
                    this.sendToCQT(result);
                  });
                },
                msOnClose: () => {
                  this.sendToCQT(result);
                }
              },
              nzFooter: null
            });
          } else {
            this.sendToCQT(result);
          }
        }
      }
    );
  }

  sendToCQT(result: any) {
    this.tDiepGui = this.taoThongDiepGui(result);
    this.quyDinhKyThuatService.GetThongDiepByThamChieu(result.id).subscribe((td: any) => {
      console.log(td);
      this.thongDiepChungId = td.thongDiepChungId;
      if (result.nhanUyNhiem == false) {
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
      }
      else {
        var params_1 = {
          thongDiepUyNhiem: this.tDiepGui,
          thongDiepId: td.thongDiepChungId
        }


        this.quyDinhKyThuatService.GetXMLThongDiepToKhai(params_1).subscribe((rs: any) => {
          if (this.sendMessageToServer(result, td.thongDiepChungId, rs.result) == false) {
            this.spinning = false;
            return;
          }
        })
      }
    });
  }

  GuiToKhai(tKhai: any) {
    this.quyDinhKyThuatService.GetThongDiepByThamChieu(tKhai.id).subscribe((td: any) => {
      var paramGuiTKhai = {
        id: td.thongDiepChungId,
        maThongDiep: this.tDiepGui.TTChung.MTDiep,
        mST: this.tDiepGui.TTChung.MST
      };
      this.quyDinhKyThuatService.GuiToKhai(paramGuiTKhai).subscribe((rs: boolean) => {
        if (rs) {
          var thongDiepChung = {
            thongDiepChungId: td.thongDiepChungId,
            maThongDiep: this.tDiepGui.TTChung.MTDiep,
            maNoiGui: this.tDiepGui.TTChung.MNGui,
            maNoiNhan: this.tDiepGui.TTChung.MNNhan,
            thongDiepGuiDi: td.thongDiepGuiDi,
            hinhThuc: td.hinhThuc,
            maLoaiThongDiep: this.tDiepGui.TTChung.MLTDiep,
            maThongDiepThamChieu: this.tDiepGui.TTChung.MTDTChieu,
            phienBan: this.tDiepGui.TTChung.PBan,
            soLuong: this.tDiepGui.TTChung.SLuong,
            maSoThue: this.tDiepGui.TTChung.MST,
            createdDate: td.createdDate,
            modifyDate: moment().format("YYYY-MM-DD"),
            ngayGui: moment().format("YYYY-MM-DD HH:mm:ss"),
            idThamChieu: td.idThamChieu,
            trangThaiGui: 0
          }

          this.quyDinhKyThuatService.UpdateThongDiepChung(thongDiepChung).subscribe((res: boolean) => {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzWidth: 500,
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Info,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Hoàn thành thao tác gửi dữ liệu đến CQT',
                msContent: `Đã hoàn thành thao tác gửi dữ liệu đến CQT.
                <br>Bạn cần theo dõi <b>Trạng thái gửi và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b>`,
                msOnClose: () => {
                }
              },
              nzFooter: null
            });
            this.quyDinhKyThuatService.GetThongDiepByThamChieu(td.idThamChieu).subscribe((rs: any) => {
              this.tdiep = rs;
              this.spinning = false;
              this.isSigned = true;
              this.getNgayKyGui();
              this.signing = false;
            })
          });
        }
        else {
          var thongDiepChung = {
            thongDiepChungId: td.thongDiepChungId,
            maThongDiep: this.tDiepGui.TTChung.MTDiep,
            maNoiGui: this.tDiepGui.TTChung.MNGui,
            maNoiNhan: this.tDiepGui.TTChung.MNNhan,
            thongDiepGuiDi: td.thongDiepGuiDi,
            hinhThuc: td.hinhThuc,
            maLoaiThongDiep: this.tDiepGui.TTChung.MLTDiep,
            maThongDiepThamChieu: this.tDiepGui.TTChung.MTDTChieu,
            phienBan: this.tDiepGui.TTChung.PBan,
            soLuong: this.tDiepGui.TTChung.SLuong,
            maSoThue: this.tDiepGui.TTChung.MST,
            createdDate: td.createdDate,
            modifyDate: moment().format("YYYY-MM-DD"),
            ngayGui: moment().format("YYYY-MM-DD"),
            idThamChieu: td.idThamChieu,
            trangThaiGui: 15
          }
          this.quyDinhKyThuatService.UpdateThongDiepChung(thongDiepChung).subscribe();
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzWidth: 500,
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `Không gửi được <b>Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử</b>(Mẫu số 01/ĐKTĐ-HĐĐT) đến <b>TCTN</b>(Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử).
              <br>Vui lòng thực hiện <span class="cssyellow">Lập mới, Ký và Gửi</span> lại!`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
          this.spinning = false;
          this.signing = false;
        }
      })
    });
  }

  taoThongDiepGui(tKhai): any {
    var tDiep = null;
    if (!tKhai.nhanUyNhiem) {
      var tDiepKUN = {
        TTChung: {
          PBan: "2.0.0",
          MNGui: `${this.env.taxCodeTCGP}`,
          MNNhan: `${this.env.taxCodeTCTN}`,
          MLTDiep: 100,
          MTDiep: `${this.env.taxCodeTCGP}${new GUID().toString().replace('-', '').toUpperCase()}`,
          MTDTChieu: '',
          MST: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mst,
          SLuong: 1
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
                  cmtmtTien: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.cmtmtTien,
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
        tDiepKUN.DLieu.TKhai.DLTKhai.NDTKhai.DSCTSSDung.push({
          sTT: element.stt,
          tTChuc: element.ttChuc,
          seri: element.seri,
          tNgay: moment(element.tNgay).format("YYYY-MM-DDTHH:mm:SS"),
          dNgay: moment(element.dNgay).format("YYYY-MM-DDTHH:mm:SS"),
          hThuc: element.hThuc
        });
      });

      tDiep = tDiepKUN;
    }
    else {
      var tDiepUN = {
        TTChung: {
          PBan: '2.0.0',
          MNGui: `${this.env.taxCodeTCGP}`,
          MNNhan: `${this.env.taxCodeTCTN}`,
          MLTDiep: 101,
          MTDiep: `${this.env.taxCodeTCGP.replace('-', '')}${new GUID().toString().replace('-', '').toUpperCase()}`,
          MTDTChieu: null,
          MST: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mst,
          SLuong: 1
        },
        DLieu: {
          TKhai: {
            DLTKhai: {
              TTChung: {
                PBan: '2.0.1',
                MSo: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mSo,
                Ten: tKhai.toKhaiUyNhiem.dltKhai.ttChung.ten,
                HThuc: tKhai.toKhaiUyNhiem.dltKhai.ttChung.hThuc,
                TNNT: tKhai.toKhaiUyNhiem.dltKhai.ttChung.tnnt,
                MST: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mst,
                CQTQLy: tKhai.toKhaiUyNhiem.dltKhai.ttChung.cqtqLy,
                MCQTQLy: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mcqtqLy,
                NLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.nlHe,
                DCLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dclHe,
                DCTDTu: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dctdTu,
                DTLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dtlHe,
                DDanh: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dDanh,
                NLap: tKhai.toKhaiUyNhiem.dltKhai.ttChung.nLap
              },
              NDTKhai: {
                DSCTSSDung: [],
                DSDKUNhiem: []
              }
            },
            DSCKS: {
              NNT: "",
              CCKSKhac: tKhai.toKhaiUyNhiem.dscks.ccksKhac
            }
          }
        }
      }

      tKhai.toKhaiUyNhiem.dltKhai.ndtKhai.dsctssDung.forEach(element => {
        tDiepUN.DLieu.TKhai.DLTKhai.NDTKhai.DSCTSSDung.push({
          sTT: element.stt,
          tTChuc: element.ttChuc,
          seri: element.seri,
          tNgay: moment(element.tNgay).format("YYYY-MM-DDTHH:mm:SS"),
          dNgay: moment(element.dNgay).format("YYYY-MM-DDTHH:mm:SS"),
          hThuc: element.hThuc
        });
      });

      tKhai.toKhaiUyNhiem.dltKhai.ndtKhai.dsdkuNhiem.forEach(element => {
        tDiepUN.DLieu.TKhai.DLTKhai.NDTKhai.DSDKUNhiem.push({
          sTT: element.stt,
          tLHDon: element.tlhDon,
          kHMSHDon: element.khmshDon,
          kHHDon: element.khhDon,
          mST: element.mst,
          tTChuc: element.ttChuc,
          mDich: element.mDich,
          tNgay: moment(element.tNgay).format("YYYY-MM-DDTHH:MM:SS"),
          dNgay: moment(element.dNgay).format("YYYY-MM-DDTHH:MM:SS"),
          pThuc: element.pThuc,
        });
      });

      tDiep = tDiepUN;
    }

    return tDiep;
  }


  ngAfterViewChecked() {

  }

  checkTrung(i: number) {
    const ctsArr = this.mainForm.get('cTS') as FormArray;
    const cts = ctsArr.value as any[];
    let indexs = [];
    for (let index = 0; index < cts.length; index++) {
      if (index != i) {
        if (cts[index].seri == cts[i].seri && moment(cts[index].tNgay).format("YYYY-MM-DD") == moment(cts[i].tNgay).format("YYYY-MM-DD") && moment(cts[index].dNgay).format("YYYY-MM-DD") == moment(cts[i].dNgay).format("YYYY-MM-DD")
          && cts[index].hThuc == cts[i].hThuc) {
          if (index < i) {
            return ''
          };
          indexs.push(index + 1);
        }
      }
    }

    if (indexs.length > 0) {
      return `&lt;Danh sách chứng thư số&gt; bị trùng dòng ${i + 1} với dòng ${indexs.join(", ")} `;
    }
    else return '';
  }
  ///Xuất khẩu
  export() {
    this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai.id).subscribe((rs: any) => {
      const params = {
        thongDiep: rs,
        signed: true
      };

      this.quyDinhKyThuatService.GetLinkFileXml(params).subscribe((res: any) => {
        var bytes = base64ToArrayBuffer(res.bytes);
        saveByteArray(`${moment().format("YYYYMMDDHHMMSS")}.xml`, bytes, res.type);
      })
    })
  }

  ///Lưu thông điệp
  async submitForm(checkCTS = true) {
    this.spinning = true;
    if (this.mainForm.invalid) {
      let invalidFormChung = false;
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
        if (invalidFormChung === false && this.mainForm.controls[i].invalid) {
          invalidFormChung = true;
        }
      }

      if (invalidFormChung) {
        setStyleTooltipError(true);
      }

      const ctsArr = this.mainForm.get('cTS') as FormArray;
      const forms = ctsArr.controls as FormGroup[];
      for (let i = 0; i < forms.length; i++) {
        var invalid = false;
        if (forms[i].invalid) {
          for (const f in forms[i].controls) {
            forms[i].controls[f].markAsTouched();
            forms[i].controls[f].updateValueAndValidity();
            if (invalid === false && forms[i].controls[f].invalid) {
              invalid = true;
            }
          }

          if (invalid == true) {
            setStyleTooltipError_Detail(true);
          }
        }
      }

      this.spinning = false;
      return;
    }

    const _data = this.mainForm.getRawValue();

    const cTSFormArray = this.mainForm.get('cTS') as FormArray;
    var listCTS = cTSFormArray.value;

    //check xem có những chứng thư số nào đang bị trùng
    //nếu có trùng thì báo lỗi: chỉ ra những dòng nào đang bị trùng
    let messageBaoTrung = '';
    let message = 'Danh sách chứng thư số bị trùng:';
    for (var i = 0; i < listCTS.length; i++) {
      let msgTrung = this.checkTrung(i);
      if (msgTrung != '') {
        messageBaoTrung += msgTrung + '<br>';
      }

      if (messageBaoTrung != '') {
        message += messageBaoTrung;
        message += '<br>Vui lòng kiểm tra lại!';
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
            msContent: message,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
    }

    if (this.nhanUyNhiem == true) {
      if (this.listDangKyUyNhiem.length == 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '455px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Bạn chưa chọn/nhập danh sách đăng ký ủy nhiệm. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });
        this.spinning = false;
        return;
      }
    }

    if (!this.nhanUyNhiem && _data.hDGTGT == false && _data.hDBHang == false && _data.hDBTSCong == false && _data.hDBHDTQGia == false && _data.hDKhac == false && _data.cTu == false) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '455px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Bạn chưa chọn loại hóa đơn sử dụng tại mục <b>4.Loại hóa đơn sử dụng</b>. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    if (!this.nhanUyNhiem && _data.cDDu == false && _data.cBTHop == false) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '455px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Bạn chưa chọn phương thức chuyển dữ liệu tại mục 3 "Phương thức chuyển dữ liệu hóa đơn điện tử". Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    if (_data.nLap == null || _data.nLap == '') {
      let ngayHienTaiTrenServer: any = await this.hoaDonDienTuService.GetNgayHienTai();
      _data.nLap = moment(ngayHienTaiTrenServer.result).format("YYYY-MM-DD");
      this.saveChanges(_data, checkCTS);
    }
    else {
      let isNgayLapHopLe = await this.kiemTraNgayLapHopLe();
      if (!isNgayLapHopLe) {
        this.spinning = false;
        return;
      }
    }


    if ((!listCTS || listCTS.length == 0) && checkCTS == true) {
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
          msTitle: "Bạn chưa chọn/nhập chứng thư số",
          msContent: `Bạn có thể chọn <span class="cssgreen text-bold">Đồng ý</span> để lưu, chọn <span class="cssred text-bold">Không</span> để đóng hoặc <span class="cssblue text-bold">Quay lại</span> để tiếp tục!`,
          msOnOk: () => {
            this.saveChanges(_data, checkCTS);
          },
          msOnClose: () => {
            this.modal.destroy();
            return;
          },
          msOnCancel: () => {
            this.spinning = false;
            return;
          }
        },
        nzFooter: null
      });
    }
    else this.saveChanges(_data, checkCTS);
  }

  saveChanges(_data: any, checkCTS: boolean, callback: () => any = null) {
    if (!this.nhanUyNhiem) {
      const _tKhai = {
        DLTKhai: {
          TTChung: {
            MSo: "01/ĐKTĐ-HĐĐT",
            Ten: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
            HThuc: this.isThemMoi ? 1 : 2,
            TNNT: _data.tNNT,
            MST: _data.mST,
            CQTQLy: this.coQuanThueQuanLys.find(x => x.code == _data.mCQTQLy).name,
            MCQTQLy: _data.mCQTQLy,
            NLHe: _data.nLHe,
            DCLHe: _data.dCLHe,
            DCTDTu: _data.dCTDTu,
            DTLHe: _data.dTLHe,
            DDanh: this.diaDanhs.find(x => x.code == _data.dDanh).name,
            NLap: _data.nLap,
          },
          NDTKhai: {
            HTHDon: {
              CMa: _data.cMa == true ? 1 : 0,
              cmtmtTien: _data.cmtmtTien == true ? 1 : 0,
              KCMa: _data.kCMa == true ? 1 : 0
            },
            HTGDLHDDT: {
              NNTDBKKhan: _data.nNTDBKKhan == true ? 1 : 0,
              NNTKTDNUBND: _data.nNTKTDNUBND == true ? 1 : 0,
              CDLTTDCQT: _data.cDLTTDCQT == true ? 1 : 0,
              CDLQTCTN: _data.cDLQTCTN == true ? 1 : 0
            },
            PThuc: {
              CDDu: _data.cDDu == true ? 1 : 0,
              CBTHop: _data.cBTHop == true ? 1 : 0,
            },
            LHDSDung: {
              HDGTGT: _data.hDGTGT == true ? 1 : 0,
              HDBHang: _data.hDBHang == true ? 1 : 0,
              HDBTSCong: _data.hDBTSCong == true ? 1 : 0,
              HDBHDTQGia: _data.hDBHDTQGia == true ? 1 : 0,
              HDKhac: _data.hDKhac == true ? 1 : 0,
              CTu: _data.cTu == true ? 1 : 0,
            },
            DSCTSSDung: _data.cTS && _data.cTS.length > 0 ? _data.cTS : null
          }
        },
        DSCKS: {
          NNT: _data.nNT,
          CCKSKhac: null
        }
      }

      const params = {
        toKhaiKhongUyNhiem: _tKhai
      }
      this.quyDinhKyThuatService.GetXMLToKhai(params).subscribe((rs: any) => {
        const dLTKhai = {
          pPTinh: this.phuongPhapTinh,
          isThemMoi: this.isThemMoi,
          signedStatus: false,
          fileXmlChuaKy: rs.result
        };
        if (this.isAddNew || this.isCopy) {
          if (this.isCopy) {
            this.dTKhai.id = null;
            this.dTKhai.signedStatus = false;
          }

          this.quyDinhKyThuatService.LuuToKhaiDangKyThongTin(dLTKhai).subscribe((rs: any) => {
            if (rs) {
              this.dTKhai = rs;

              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Them,
                doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
                refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
                moTaChiTiet: `Thêm tờ khai`,
                refId: this.dTKhai.id
              }).subscribe();

              this.quyDinhKyThuatService.GetToKhaiById(rs.id).subscribe((tk: any) => {
                this.data = tk.toKhaiKhongUyNhiem;
                var thongDiepChung = {
                  maLoaiThongDiep: 100,
                  thongDiepGuiDi: true,
                  hinhThuc: this.isThemMoi ? 1 : 2,
                  maThongDiepThamChieu: moment().format("YYYY/MM/DD HH:mm:ss"),
                  idThamChieu: rs.id,
                  soLuong: 1,
                  trangThaiGui: -1
                };

                var cts = [];
                if (_tKhai.DLTKhai.NDTKhai.DSCTSSDung && _tKhai.DLTKhai.NDTKhai.DSCTSSDung.length > 0) {
                  _tKhai.DLTKhai.NDTKhai.DSCTSSDung.forEach(ele => {
                    cts.push(ele);
                  })

                  this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();
                }

                this.quyDinhKyThuatService.InsertThongDiepChung(thongDiepChung).subscribe((res: any) => {
                  if (res != false) {
                    this.isSaved = true;
                    this.fbEnableEdit = false;
                    this.isAddNew = false;
                    this.disableOrEnableHeaderButtons();
                    this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
                    this.spinning = false;
                  }
                  else {
                    this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                    this.spinning = false;
                    this.modal.destroy(false);
                  }
                })

              })
            }
            else {
              this.message.error(TextGlobalConstants.TEXT_ERROR_API);
              this.spinning = false;
              this.modal.destroy(false);
            }
          })
        }
        else {
          const dLTKhai = {
            id: this.dTKhai.id,
            isThemMoi: this.isThemMoi,
            signedStatus: false,
            fileXmlChuaKy: rs.result,
            toKhaiKhongUyNhiem: _tKhai,
            ngayTao: this.dTKhai.ngayTao,
            createdDate: this.dTKhai.createdDate,
            createdBy: this.dTKhai.createdBy
          };
          this.quyDinhKyThuatService.SuaToKhaiDangKyThongTin(dLTKhai).subscribe((rs: boolean) => {
            if (rs) {
              this.quyDinhKyThuatService.GetToKhaiById(dLTKhai.id).subscribe((rs: any) => {
                this.data = rs.toKhaiKhongUyNhiem;
                this.quyDinhKyThuatService.GetThongDiepByThamChieu(dLTKhai.id).subscribe((rs: any) => {
                  var cts = [];
                  if (_tKhai.DLTKhai.NDTKhai.DSCTSSDung && _tKhai.DLTKhai.NDTKhai.DSCTSSDung.length > 0) {
                    _tKhai.DLTKhai.NDTKhai.DSCTSSDung.forEach(ele => {
                      cts.push(ele);
                    })
                  }

                  this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();
                  this.quyDinhKyThuatService.UpdateThongDiepChung(rs).subscribe((res: boolean) => {
                    if (res != false) {
                      if (checkCTS == true) {
                        this.isSaved = true;
                        this.fbEnableEdit = false;
                        this.disableOrEnableHeaderButtons();
                        this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
                      }
                      this.spinning = false;
                    }
                    else {
                      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                      this.spinning = false;
                      this.modal.destroy(false);
                    }
                  });
                });

                callback();
              });
            }
            else {
              this.message.error(TextGlobalConstants.TEXT_ERROR_API);
              this.spinning = false;
              this.modal.destroy(rs);
            }
          })
        }
      })
    }
    // else {
    //   this.dTKhai.id = null;
    //   this.dTKhai.signedStatus = false;

    //   this.quyDinhKyThuatService.LuuToKhaiDangKyThongTin(this.dTKhai).subscribe((res: any) => {
    //     if (res) {
    //       this.dTKhai = res;

    //       this.nhatKyTruyCapService.Insert({
    //         loaiHanhDong: LoaiHanhDong.Them,
    //         doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
    //         refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
    //         thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
    //         moTaChiTiet: `Thêm tờ khai`,
    //         refId: this.dTKhai.id
    //       }).subscribe();

    //       this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.idCu).subscribe((rs: any) => {
    //         if (rs) {
    //           rs.phienBan = '';
    //           rs.maThongDiep = '';
    //           rs.maNoiGui = '';
    //           rs.maNoiNhan = '';
    //           rs.maThongDiepThamChieu = moment().format("YYYY/MM/DD HH:mm:ss"),
    //             rs.thongDiepChungId = null;
    //           rs.maSoThue = '';
    //           rs.ngayGui = null;
    //           rs.idThamChieu = res.id;
    //           rs.trangThaiGui = -1;
    //           this.quyDinhKyThuatService.InsertThongDiepChung(rs).subscribe((rs: boolean) => {
    //             if (res != false) {
    //               this.isSaved = true;
    //               this.fbEnableEdit = false;
    //               this.isAddNew = false;
    //               this.disableOrEnableHeaderButtons();
    //               this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
    //               this.spinning = false;
    //             }
    //             else {
    //               this.message.error(TextGlobalConstants.TEXT_ERROR_API);
    //               this.spinning = false;
    //               this.modal.destroy(false);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   })
    // }}

    else {
      if (!this.isCopy) {
        _data.dKUNhiem = [];
        if (this.listDangKyUyNhiem.length > 0) {
          this.listDangKyUyNhiem.forEach(x => {
            _data.dKUNhiem.push({
              sTT: x.sTT,
              tLHDon: x.tLHDon,
              kHMSHDon: x.kHMSHDon,
              kHHDon: x.kHHDon,
              mST: x.mST,
              tTChuc: x.tTChuc,
              mDich: x.mDich,
              tNgay: x.tNgay,
              dNgay: x.dNgay,
              pThuc: x.pThuc
            })
          })
        }
        const _tKhai = {
          DLTKhai: {
            TTChung: {
              MSo: "01/ĐKTĐ-HĐĐT",
              Ten: "Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử",
              LDKUNhiem: this.loaiUyNhiem,
              TNNT: _data.tNNT,
              MST: _data.mST,
              CQTQLy: this.coQuanThueQuanLys.find(x => x.code == _data.mCQTQLy).name,
              MCQTQLy: _data.mCQTQLy,
              NLHe: _data.nLHe,
              DCLHe: _data.dCLHe,
              DCTDTu: _data.dCTDTu,
              DTLHe: _data.dTLHe,
              DDanh: this.diaDanhs.find(x => x.code == _data.dDanh).name,
              NLap: _data.nLap
            },
            NDTKhai: {
              DSCTSSDung: _data.cTS && _data.cTS.length > 0 ? _data.cTS : null,
              DSDKUNhiem: _data.dKUNhiem && _data.dKUNhiem ? _data.dKUNhiem : null
            }
          },
          DSCKS: {
            NNT: " ",
            CCKSKhac: null
          }
        }

        const params = {
          toKhaiUyNhiem: _tKhai
        }
        this.quyDinhKyThuatService.GetXMLToKhai(params).subscribe((rs: any) => {
          const dLTKhai = {
            id: this.dTKhai != null ? this.dTKhai.id : null,
            pPTinh: this.phuongPhapTinh,
            nhanUyNhiem: this.nhanUyNhiem,
            loaiUyNhiem: this.loaiUyNhiem,
            signedStatus: false,
            fileXmlChuaKy: rs.result,
            toKhaiUyNhiem: _tKhai,
            ngayTao: this.dTKhai != null ? moment(this.dTKhai.ngayTao).format("YYYY-MM-DD") : null,
          };
          if (this.isAddNew) {
            this.quyDinhKyThuatService.LuuToKhaiDangKyThongTin(dLTKhai).subscribe((rs: any) => {
              if (rs) {
                this.dTKhai = rs;

                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.Them,
                  doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
                  refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                  thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
                  moTaChiTiet: `Thêm tờ khai`,
                  refId: this.dTKhai.id
                }).subscribe();

                this.quyDinhKyThuatService.GetToKhaiById(rs.id).subscribe((tk: any) => {
                  this.data = tk.toKhaiUyNhiem;
                  var thongDiepChung = {
                    maLoaiThongDiep: 101,
                    thongDiepGuiDi: true,
                    hinhThuc: 2,
                    maThongDiepThamChieu: moment().format("YYYY/MM/DD hh:mm:ss"),
                    idThamChieu: rs.id,
                    soLuong: 1,
                    trangThaiGui: -1
                  };

                  var cts = [];
                  if (_tKhai.DLTKhai.NDTKhai.DSCTSSDung && _tKhai.DLTKhai.NDTKhai.DSCTSSDung.length > 0) {
                    _tKhai.DLTKhai.NDTKhai.DSCTSSDung.forEach(ele => {
                      cts.push(ele);
                    })

                    this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();
                  }

                  var dangKyUyNhiems = [];
                  this.listDangKyUyNhiem.forEach(ele => {
                    ele.idToKhai = rs.id;
                    dangKyUyNhiems.push(ele);
                  })
                  this.quyDinhKyThuatService.AddRangeDangKyUyNhiem(dangKyUyNhiems).subscribe();
                  this.quyDinhKyThuatService.InsertThongDiepChung(thongDiepChung).subscribe((res: boolean) => {
                    if (res != false) {
                      this.isSaved = true;
                      this.fbEnableEdit = false;
                      this.disableOrEnableHeaderButtons();
                      this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
                      this.spinning = false;
                    }
                    else {
                      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                      this.spinning = false;
                      this.modal.destroy(false);
                    }
                  })
                });

              }
              else {
                this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                this.spinning = false;
                this.modal.destroy(false);
              }
            })
          }
          else {
            var cts = [];
            if (_tKhai.DLTKhai.NDTKhai.DSCTSSDung && _tKhai.DLTKhai.NDTKhai.DSCTSSDung.length > 0) {
              _tKhai.DLTKhai.NDTKhai.DSCTSSDung.forEach(ele => {
                cts.push(ele);
              })
            }
            this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();

            var dangKyUyNhiems = [];
            _tKhai.DLTKhai.NDTKhai.DSDKUNhiem.forEach(ele => {
              dangKyUyNhiems.push({
                idToKhai: this.dTKhai.id,
                ...ele
              });
            });
            this.quyDinhKyThuatService.AddRangeDangKyUyNhiem(dangKyUyNhiems).subscribe();
            this.quyDinhKyThuatService.SuaToKhaiDangKyThongTin(dLTKhai).subscribe((rs: boolean) => {
              if (rs) {
                this.quyDinhKyThuatService.GetToKhaiById(dLTKhai.id).subscribe((rs: any) => {
                  this.data = rs.toKhaiUyNhiem;
                  this.quyDinhKyThuatService.GetThongDiepByThamChieu(dLTKhai.id).subscribe((td: any) => {
                    this.quyDinhKyThuatService.UpdateThongDiepChung(td).subscribe();
                    if (checkCTS == true) {
                      this.isSaved = true;
                      this.fbEnableEdit = false;
                      this.disableOrEnableHeaderButtons();
                      this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
                    }
                    this.spinning = false;
                  })
                });
              }
              else {
                this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                this.spinning = false;
              }
            })
            this.modal.destroy(rs);
          }
        })
      }
      else {
        this.dTKhai.id = null;
        this.dTKhai.signedStatus = false;
        this.quyDinhKyThuatService.LuuToKhaiDangKyThongTin(this.dTKhai).subscribe((res: any) => {
          if (res) {
            this.dTKhai = res;

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Them,
              doiTuongThaoTac: 'Tờ khai đăng ký thay đổi thông tin sử dụng hóa đơn',
              refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
              thamChieu: `${this.isThemMoi ? 'Đăng ký mới' : 'Thay đổi thông tin'}`,
              moTaChiTiet: `Thêm tờ khai`,
              refId: this.dTKhai.id
            }).subscribe();

            this.quyDinhKyThuatService.GetToKhaiById(res.id).subscribe((tk: any) => {
              this.data = this.dTKhai.toKhaiUyNhiem;
              this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.idCu).subscribe((rs: any) => {
                if (rs) {
                  rs.phienBan = '';
                  rs.maThongDiep = '';
                  rs.maNoiGui = '';
                  rs.maNoiNhan = '';
                  rs.maThongDiepThamChieu = moment().format("YYYY/MM/DD hh:mm:ss"),
                    rs.thongDiepChungId = null;
                  rs.maSoThue = '';
                  rs.ngayGui = null;
                  rs.idThamChieu = res.id;
                  rs.trangThaiGui = -1;
                  this.quyDinhKyThuatService.InsertThongDiepChung(rs).subscribe((rs: boolean) => {
                    if (res != false) {
                      this.isSaved = true;
                      this.fbEnableEdit = false;
                      this.disableOrEnableHeaderButtons();
                      this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
                      this.spinning = false;
                    }
                    else {
                      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
                      this.spinning = false;
                      this.modal.destroy(false);
                    }
                  });
                }
              })
            });
          }
        })
      }
    }
  }
  ///

  destroyModal() {
    if (this.mainForm.dirty && this.isSaved == false) {
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
            this.submitForm();
          },
          msOnClose: () => {
            this.modal.destroy();
            if (this.callBackAfterClosing != null) {
              this.callBackAfterClosing()
            }
          }
        },
        nzFooter: null
      });
    }
    else {
      if ((this.isSaved == true && !this.isSigned) || (this.isSigned == true && this.tdiep.trangThaiGui == -1)) {
        this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai.id).subscribe((rs: any) => {
          this.modal.destroy(rs);
          if (this.callBackAfterClosing != null) {
            this.callBackAfterClosing()
          }
        })
      }
      else this.modal.destroy(null);
      if (this.callBackAfterClosing != null) {
        this.callBackAfterClosing()
      }
    }
  }

  //hàm hiển thị ngày ký ra DD/MM/YYYY
  getNgayKyGui() {
    if (this.dTKhai && this.dTKhai.id) {
      this.quyDinhKyThuatService.GetThongDiepByThamChieu(this.dTKhai.id).subscribe((rs: any) => {
        this.ngayKyGui = rs.ngayGui ? moment(rs.ngayGui).format("YYYY-MM-DD HH:mm:ss") : moment().format('YYYY-MM-DD HH:mm:ss');
      })
    }
  }

  getChuoiDiaDanhNgayThang() {
    let chuoiDiaDanhNgayThang = '';
    let diaDanh = this.mainForm.get('dDanh').value;
    if (diaDanh != null) {
      chuoiDiaDanhNgayThang = this.diaDanhs.find(x => x.code == diaDanh).name;
    }

    let ngayLapHoaDon = this.mainForm.get('nLap').value;
    if (ngayLapHoaDon != null && ngayLapHoaDon != '') {
      let mangNgayLap = ngayLapHoaDon.split('-');
      let nam = mangNgayLap[0];
      let thang = mangNgayLap[1];
      let ngay = mangNgayLap[2];

      let thangInt = parseInt(thang);
      if (thangInt >= 3) thang = thangInt.toString(); //nếu là tháng 1, 2 thì thêm số 0 ở trước
      let ngayInt = parseInt(ngay);
      if (ngayInt >= 10) ngay = ngayInt.toString(); //nếu là ngày < 10 thì thêm số 0 ở trước

      let chuoiNgay = ", ngày " + ngay + " tháng " + thang + " năm " + nam;

      chuoiDiaDanhNgayThang = chuoiDiaDanhNgayThang + chuoiNgay;
    }
    return chuoiDiaDanhNgayThang;
  }

  /**
* Hàm này kiểm tra nếu ngày lập thông báo lớn hơn ngày hiện tại thì cảnh báo và không cho lưu dữ liệu
* @returns Giá trị có kiểu boolean cho biết xem ngày lập thông báo có lớn hơn ngày hiện tại không
*/
  async kiemTraNgayLapHopLe(): Promise<boolean> {
    let isNgayLapHopLe = true; // nếu isNgayLapHopLe = true thì ngày lập là hợp lệ
    let ngayLap = this.mainForm.get('nLap').value;
    if (ngayLap == null || ngayLap == '') {
      return isNgayLapHopLe;
    }

    let ngayHienTaiTrenServer: any = await this.hoaDonDienTuService.GetNgayHienTai();
    let ngayHienTai = moment(ngayHienTaiTrenServer.result).format('YYYY-MM-DD');

    if (moment(ngayLap) > moment(ngayHienTai)) {
      isNgayLapHopLe = false; // nếu isNgayLapHopLe = false thì ngày lập lớn hơn ngày hiện tại

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '380px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: 'Ngày lập không được lớn hơn ngày hiện tại. Vui lòng kiểm tra lại!',
        },
        nzFooter: null
      });
    }

    return isNgayLapHopLe;
  }
  /// Count checked option hinh thuc hoa don
  checkCountOfHinhThucHoaDon() {
    let count = 0;
    if (this.mainForm.get('cMa').value == true) {
      count++;
    }
    if (this.mainForm.get('kCMa').value == true) {
      count++;
    }
    return count;
  }
}

