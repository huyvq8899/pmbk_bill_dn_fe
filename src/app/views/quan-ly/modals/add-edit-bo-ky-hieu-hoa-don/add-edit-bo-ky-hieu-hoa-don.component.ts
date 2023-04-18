import { data } from 'jquery';
import { HinhThucHoaDon } from 'src/app/enums/HinhThucHoaDon.enum';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { getHeightBangKeMauHoaDonInBoKyHieu, getHinhThucHoaDons, getListKyTuThu4, getLoaiHoaDons, getNoiDungLoiPhatHanhHoaDon, getUyNhiemLapHoaDons, setStyleTooltipError, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import * as moment from 'moment';
import { XemMauHoaDonModalComponent } from 'src/app/views/danh-muc/quan-ly-hoa-don-dien-tu/modals/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TabThongDiepGuiComponent } from '../../tab-thong-diep-gui/tab-thong-diep-gui.component';
import { SharedService } from 'src/app/services/share-service';
import { CookieConstant } from 'src/app/constants/constant';
import { ViewXmlContentModalComponent } from '../view-xml-content-modal/view-xml-content-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TrangThaiSuDung, TrangThaiSuDung2, TrangThaiSuDungDescription } from 'src/app/enums/TrangThaiSuDung.enum';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { tap } from 'rxjs/operators';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { EnvService } from 'src/app/env.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { HuongDanSuDungModalComponent } from 'src/app/views/dashboard/huong-dan-su-dung-modal/huong-dan-su-dung-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { PopupVideoModalComponent } from '../../../dashboard/popup-video-modal/popup-video-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { LichSuTruyenNhanComponent } from 'src/app/views/hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { LichSuTruyenNhanDisplayXmldataComponent } from 'src/app/views/hoa-don-dien-tu/modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-add-edit-bo-ky-hieu-hoa-don',
  templateUrl: './add-edit-bo-ky-hieu-hoa-don.component.html',
  styleUrls: ['./add-edit-bo-ky-hieu-hoa-don.component.scss']
})
export class AddEditBoKyHieuHoaDonComponent implements OnInit, AfterViewInit {
  @Input() fbEnableEdit: boolean;
  @Input() isAddNew: boolean;
  @Input() isView: boolean;
  @Input() isCopy: boolean;
  @Input() data: any;
  @Input() isUyNhiemLapHoaDon: boolean;
  mainForm: FormGroup;
  spinning = false;
  widthConfigA = ['5%', '40%', '20%', '20%', '15%'];
  scrollConfigA = { x: '100%', y: `${getHeightBangKeMauHoaDonInBoKyHieu()}px` };
  widthConfigB = ['40%', '20%', '40%'];
  scrollConfigB = { x: '100%', y: '200px' };
  listMauHoaDon = [];
  listToKhai = [];
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons();
  hinhThucHoaDons = getHinhThucHoaDons();
  loaiHoaDons = getLoaiHoaDons();
  kyHieuThu4s = getListKyTuThu4();
  kyHieuThu4sSearch = getListKyTuThu4();
  kys = GetList();
  //checkbox
  isAllDisplayDataCheckedA = false;
  isIndeterminateA = false;
  isAllDisplayDataCheckedB = false;
  isIndeterminateB = false;
  // fix table
  customOverlayStyle1 = {
    width: '550px'
  };
  customOverlayStyle2 = {
    width: '420px'
  };
  kyKeKhaiThueGTGT = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
  chuCais = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  kyHieu23s: any[] = [];
  kyHieu56s: Array<string> = [];
  permission: boolean = false;
  thaoTacs: any[] = [];
  nhatKys: any[] = [];
  hoSoHDDT = null;
  serials = [];
  thongTinHoaDons = [];
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  btnLayDuLieuDisabled = false;
  btnLayDuLieuHide = false;
  btnSuaDisabled = false;
  btnSuaHide = false;
  btnLuuDisabled = false;
  btnLuuHide = false;
  btnDongDisabled = false;
  btnXacThucDisabled = false;
  btnXacThucHide = false;
  isChuyenDayDuNoiDungTungHoaDon = false;
  isChuyenBangTongHop = false;
  thongTinToKhaiMoiNhat = null;
  toKhaiMoiNhat = null;
  xacThucHetHieuLucCompleted = false;
  loaiHoaDonAlls: any[] = [];
  kyHieuThu4sSearchAll: any[] = getListKyTuThu4();
  ActivedModal: any;
  IsCanhBaoDaPhatSinhActive = false;
  IsCanhBaoDaPhatSinhActiveL = false;
  IsBoKyHieuDaTaoHoaDonNhap = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private webSocket: WebSocketService,
    private env: EnvService,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private message: NzMessageService,
    private mauHoaDonService: MauHoaDonService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private sharedService: SharedService,
    private hoSoHDDTService: HoSoHDDTService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private huongDanSuDungModalComponent: HuongDanSuDungModalComponent,
    private authsv: AuthService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
    private tuyChonService: TuyChonService
  ) { }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "BoKyHieuHoaDon").thaoTacs;
    }

    for (let i = 0; i < this.chuCais.length; i++) {
      for (let j = 0; j < this.chuCais.length; j++) {
        var item1 = this.chuCais[i];
        var item2 = this.chuCais[j];
        this.kyHieu56s.push(item1 + item2);
      }
    }

    const currentDate = moment().format('YYYY-MM-DD');
    const termDate = moment(`${moment().format('YYYY')}-01-31`).format('YYYY-MM-DD');
    if (currentDate <= termDate) {
      this.kyHieu23s.push(moment().subtract(1, 'years').format('YY'));
    }
    this.kyHieu23s.push(moment().format('YY'));

    this.listMauHoaDon = [...this.listMauHoaDon];
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
      this.observableSocket();
    }
    this.createForm();
    this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key != 3 && x.key != 4 && x.key != 13);
    this.loaiHoaDonAlls = JSON.parse(JSON.stringify(this.loaiHoaDons));


  }
  CheckUsedBoKyHieuHoaDon(BoKyHieuHoaDonId: string) {
    this.boKyHieuHoaDonService.CheckUsedBoKyHieuHoaDon(BoKyHieuHoaDonId).subscribe((res: boolean) => {
      if (res) {
        this.IsBoKyHieuDaTaoHoaDonNhap = true;
      }
    }, error => {

    })
  }


  CheckCanhBaoDaPhatSinh(type: number) {
    if (this.data != null && this.data.soLonNhatDaLapDenHienTai < 1) {
      /// Type = 1 Hình thức hóa đơn, 2 Loại hóa đơn
      if (type == 1) {
        this.IsCanhBaoDaPhatSinhActive = true;
        if (this.IsCanhBaoDaPhatSinhActive && this.IsBoKyHieuDaTaoHoaDonNhap && !this.isAddNew && !this.isCopy && !this.btnLuuDisabled) {
          const modal = this.ActivedModal = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOkButtonInBlueColor: false,
              msTitle: 'Kiểm tra lại',
              msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.data.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn chỉ được phép sửa <b> Hình thức hóa đơn </b> khi xóa hóa đơn sử dụng có liên quan. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
                ///////////////////////////
                this.IsCanhBaoDaPhatSinhActive = false;
              }
            },
            nzFooter: null
          });
          this.IsCanhBaoDaPhatSinhActive = true;
          modal.afterClose.subscribe(() => {
            this.ActivedModal = null;
          })
          return;
        }
      } else {
        this.IsCanhBaoDaPhatSinhActiveL = true;

        if (this.IsCanhBaoDaPhatSinhActiveL && this.IsBoKyHieuDaTaoHoaDonNhap && !this.isAddNew && !this.isCopy && !this.btnLuuDisabled) {
          const modal = this.ActivedModal = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOkButtonInBlueColor: false,
              msTitle: 'Kiểm tra lại',
              msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.data.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn chỉ được phép sửa <b> Loại hóa đơn </b> khi xóa hóa đơn sử dụng có liên quan. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
                ///////////////////////////
                this.IsCanhBaoDaPhatSinhActiveL = false;
              }
            },
            nzFooter: null
          });
          this.IsCanhBaoDaPhatSinhActiveL = true;
          modal.afterClose.subscribe(() => {
            this.ActivedModal = null;
          })
          return;
        }
      }


    }
  }

  CloseCanhBao() {
    //  this.IsCanhBaoDaPhatSinhActive = false;
    // this.IsCanhBaoDaPhatSinhActiveL = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const boxElement = document.querySelector('.box-nhat-ky-xac-thuc') as HTMLElement;
      if (boxElement) {
        const content = boxElement.querySelector('.content-nhat-ky-xac-thuc') as HTMLElement;
        content.style.height = (window.innerHeight - 170) + 'px';
      }
    }, 0);
  }

  async observableSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      if (!this.webSocket.isOpenSocket() && !this.webSocket.isConnecting()) {
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
                  msMessageType: MessageType.Info,
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
    });
  }

  CheckSoToiDaKhongDuocNhoHonSoBatDau(c: AbstractControl) {
    if (!c.parent || !c) {
      return;
    }
    const soBatDau = c.parent.get('soBatDau').value;
    const soToiDa = c.parent.get('soToiDa').value;

    if (soToiDa < soBatDau) {
      return { invalid: true };
    }

    return null;
  }

  createForm() {
    this.mainForm = this.fb.group({
      boKyHieuHoaDonId: [null],
      uyNhiemLapHoaDon: [0],
      hinhThucHoaDon: [1],
      loaiHoaDon: [1],
      kyHieu: [{ value: null, disabled: true }],
      kyHieuMauSoHoaDon: [{ value: 1, disabled: true }],
      kyHieuHoaDon: [{ value: `C${moment().format('YY')}TAA`, disabled: true }],
      kyHieu1: [{ value: 'C', disabled: true }],
      kyHieu23: [{ value: moment().format('YY'), disabled: true }, [Validators.required],],
      kyHieu4: [{ value: 'T', disabled: true }],
      kyHieu56: ['AA'],
      soBatDau: [{ value: 1, disabled: true }, [Validators.required, Validators.min(1), Validators.max(99999999)]],
      soLonNhatDaLapDenHienTai: [{ value: null, disabled: true }],
      soToiDa: [{ value: 99999999, disabled: true }, [Validators.required, Validators.min(1), Validators.max(99999999), this.CheckSoToiDaKhongDuocNhoHonSoBatDau]],
      isTuyChinh: [false],
      mauHoaDonId: [null],
      thongDiepId: [null],
      thongDiepMoiNhatId: [null],
      trangThaiSuDung: [0],
      maSoThueBenUyNhiem: [null],
      phuongThucChuyenDL: [null],
      createdDate: [null],
      createdBy: [null],
      status: [true],
      ky: [5],
      oldFromDate: [moment().startOf('month').format('YYYY-MM-DD')],
      oldToDate: [moment().format('YYYY-MM-DD')],
      fromDate: [moment().startOf('month').format('YYYY-MM-DD')],
      toDate: [moment().format('YYYY-MM-DD')],
    });

    this.spinning = true;

    if (this.data) {
      this.CheckUsedBoKyHieuHoaDon(this.data.boKyHieuHoaDonId);
      this.mainForm.patchValue({
        ...this.data
      });

      if (this.isCopy) {
        this.mainForm.get('soBatDau').setValue(1);
        this.mainForm.get('kyHieu23').setValue(moment().format('YY'));
        this.setKyHieuHoaDon();
      }

    }

    this.forkJoin().subscribe((res: any[]) => {
      this.nhatKys = res[0];
      console.log("🚀 ~ file: add-edit-bo-ky-hieu-hoa-don.component.ts:436 ~ AddEditBoKyHieuHoaDonComponent ~ this.forkJoin ~ this.nhatKys:", this.nhatKys)
      this.hoSoHDDT = res[1];
      this.serials = res[2].map(x => x.seri);
      this.thongTinToKhaiMoiNhat = res[3];
      this.thongTinHoaDons = res[4];

      if (this.isAddNew) {
        this.setKyHieu();
        this.listMauHoaDon = [];
        this.toKhaiMoiNhat = this.thongTinToKhaiMoiNhat.toKhaiForBoKyHieuHoaDon;
        this.listToKhai = [this.toKhaiMoiNhat];
        this.mainForm.get('phuongThucChuyenDL').setValue(this.thongTinToKhaiMoiNhat.isChuyenDayDuNoiDungTungHoaDon ? 0 : 1);
        ///Change để lọc loai hóa đơn
        if (this.hinhThucHoaDons.length > 0) {
          this.changeHinhThucHoaDon(this.hinhThucHoaDons[0].key);

        } else {
          this.changeHinhThucHoaDon(HinhThucHoaDon.CoMa);

        }
      } else {

        this.tuyChinhNguyenTacSHD(this.data.isTuyChinh);

        this.data.mauHoaDons.forEach((item: any) => item.checked = true);
        this.data.toKhaiForBoKyHieuHoaDon.checked = true;
        this.toKhaiMoiNhat = this.data.toKhaiMoiNhatForBoKyHieuHoaDon
        this.listToKhai = [this.data.toKhaiForBoKyHieuHoaDon];

        this.listMauHoaDon = [...this.data.mauHoaDons];

        // nếu TH: không ủy nhiệm và có phương thức chuyển dữ liệu
        const toKhaiKhongUyNhiem = this.data.toKhaiMoiNhatForBoKyHieuHoaDon.toKhaiKhongUyNhiem;
        if (toKhaiKhongUyNhiem) {
          this.isChuyenDayDuNoiDungTungHoaDon = toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu === 1;
          this.isChuyenBangTongHop = toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cbtHop === 1;
        }

        if (this.data.loaiHoaDon === 7 || this.data.loaiHoaDon === 8 || this.data.loaiHoaDon === 10 || this.data.loaiHoaDon === 2) {
          this.widthConfigA = ['5%', '50%', '25%', '20%'];
        } else {
          this.widthConfigA = ['5%', '40%', '20%', '20%', '15%'];
        }

        this.filterHinhThucHDNotChangeLoaiHD(this.data.hinhThucHoaDon);
        this.updateThongTinToKhaiMoiNhatNeuSua();
      }

      this.disableOrEnableButtons();
      this.spinning = false;
    });
  }

  // nếu tờ khai hiện tại khác với tờ khai mới nhất thì set lại thành tờ khai mới nhất
  updateThongTinToKhaiMoiNhatNeuSua() {
    if (!this.isView && this.thongTinToKhaiMoiNhat.toKhaiForBoKyHieuHoaDon.maThongDiepGui !== this.data.toKhaiForBoKyHieuHoaDon.maThongDiepGui) {
      this.data.toKhaiForBoKyHieuHoaDon = this.thongTinToKhaiMoiNhat.toKhaiForBoKyHieuHoaDon;
      this.toKhaiMoiNhat = this.data.toKhaiForBoKyHieuHoaDon;
      if (this.data.trangThaiSuDung !== 4) { // không là hết hiệu lực thì mới update
        this.listToKhai = [this.data.toKhaiForBoKyHieuHoaDon];
      }

      const toKhaiKhongUyNhiem = this.data.toKhaiForBoKyHieuHoaDon.toKhaiKhongUyNhiem;
      if (toKhaiKhongUyNhiem) {
        if (!(this.isChuyenDayDuNoiDungTungHoaDon && toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu === 1 &&
          this.isChuyenBangTongHop && toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cbtHop === 1)) {
          this.isChuyenDayDuNoiDungTungHoaDon = toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu === 1;
          this.isChuyenBangTongHop = toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cbtHop === 1;
          this.mainForm.get('phuongThucChuyenDL').setValue(this.thongTinToKhaiMoiNhat.isChuyenDayDuNoiDungTungHoaDon ? 0 : 1);
        }
      }
    }
  }

  showThongBao(title: string, content: string) {
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
        msOkButtonInBlueColor: false,
        msTitle: title,
        msContent: content,
        msOnClose: () => {
          ///////////////////////////
        }
      },
      nzFooter: null
    });
  }

  disableOrEnableButtons(fromUserAction = false) { // gọi từ thao tác của user
    const data = this.mainForm.getRawValue();

    // check trạng thái sử dụng
    switch (data.trangThaiSuDung) {
      case TrangThaiSuDung.DaXacThuc:
      case TrangThaiSuDung.DangSuDung:
        if (this.isView) {
          this.btnLayDuLieuDisabled = true;
          this.btnSuaDisabled = false;
          this.btnLuuDisabled = true;
          this.btnDongDisabled = false;
          this.btnXacThucDisabled = false;
        } else {
          this.isView = true;

          if (!fromUserAction) {
            this.btnLayDuLieuDisabled = true;
            this.btnSuaDisabled = false;
            this.btnLuuDisabled = true;
            this.btnDongDisabled = false;
            this.btnXacThucDisabled = false;
          }

          this.showThongBao('Sửa ký hiệu', `Bạn không thể sửa ký hiệu <b><span class='csslightBlue'>${data.kyHieu}</span></b> khi trạng thái sử dụng là
            <b>${TrangThaiSuDungDescription.get(data.trangThaiSuDung)}</b>. Hệ thống cho phép sửa khi trạng thái sử dụng là
            <b>${TrangThaiSuDungDescription.get(TrangThaiSuDung.NgungSuDung)}</b>.`);
        }

        this.btnLayDuLieuHide = false;
        this.btnSuaHide = false;
        this.btnLuuHide = false;
        this.btnXacThucHide = false;
        break;
      case TrangThaiSuDung.HetHieuLuc:
        if (!this.isView) {
          this.isView = false;

          this.btnSuaDisabled = true;
          this.btnXacThucDisabled = false;
          // this.showThongBao('Sửa ký hiệu', `Bạn không thể sửa ký hiệu <b><span  class='csslightBlue'>${data.kyHieu}</span></b> khi trạng thái sử dụng là <b>${TrangThaiSuDungDescription.get(TrangThaiSuDung.HetHieuLuc)}</b>.`);
        } else {
          this.btnSuaDisabled = false;
          this.btnXacThucDisabled = true;
        }

        this.btnLayDuLieuHide = true;
        this.btnSuaHide = false;
        this.btnLuuHide = true;
        this.btnXacThucHide = false;

        this.btnDongDisabled = false;
        break;
      case TrangThaiSuDung.ChuaXacThuc:
        if (!this.isView) {
          this.isView = false;

          this.btnLayDuLieuDisabled = false;
          this.btnSuaDisabled = true;
          this.btnLuuDisabled = false;
          this.btnDongDisabled = false;
          this.btnXacThucDisabled = true;
        } else {
          this.btnLayDuLieuDisabled = true;
          this.btnSuaDisabled = false;
          this.btnLuuDisabled = true;
          this.btnDongDisabled = false;
          this.btnXacThucDisabled = false;
        }

        this.btnLayDuLieuHide = false;
        this.btnSuaHide = false;
        this.btnLuuHide = false;
        this.btnXacThucHide = false;
        break;
      case TrangThaiSuDung.NgungSuDung:
        var trangThaiHinhThucHoaDon = this.thongTinHoaDons.find(x => x.loaiThongTin === 1) != null ? this.thongTinHoaDons.find(x => x.loaiThongTin === 1).trangThaiSuDung : 0;
        var trangThaiHinhThucHoaDonCMTTT = this.thongTinHoaDons.find(x => x.loaiThongTin === 1) != null ? this.thongTinHoaDons.find(x => x.loaiThongTin === 1).loaiThongTinChiTiet : 0;
        var trangThaiLoaiHoadon = this.thongTinHoaDons.find(x => x.loaiThongTin === 2) != null ? this.thongTinHoaDons.find(x => x.loaiThongTin === 2).trangThaiSuDung : 0;

        if (trangThaiHinhThucHoaDon === TrangThaiSuDung2.DangSuDung && trangThaiLoaiHoadon === TrangThaiSuDung2.DangSuDung || trangThaiHinhThucHoaDon === TrangThaiSuDung2.DangSuDung && trangThaiHinhThucHoaDonCMTTT === 9) {
          if (!this.isView) {
            this.isView = false;

            this.btnLayDuLieuDisabled = false;
            this.btnSuaDisabled = true;
            this.btnLuuDisabled = false;
            this.btnDongDisabled = false;
            this.btnXacThucDisabled = true;
          } else {
            this.btnLayDuLieuDisabled = true;
            this.btnSuaDisabled = false;
            this.btnLuuDisabled = true;
            this.btnDongDisabled = false;
            this.btnXacThucDisabled = false;
          }

          this.btnLayDuLieuHide = false;
          this.btnSuaHide = false;
          this.btnLuuHide = false;
          this.btnXacThucHide = false;
        } else if ((trangThaiHinhThucHoaDon === TrangThaiSuDung2.NgungSuDung && trangThaiLoaiHoadon === TrangThaiSuDung2.NgungSuDung) ||
          (trangThaiHinhThucHoaDon === TrangThaiSuDung2.DangSuDung && trangThaiLoaiHoadon === TrangThaiSuDung2.NgungSuDung) ||
          (trangThaiHinhThucHoaDon === TrangThaiSuDung2.NgungSuDung && trangThaiLoaiHoadon === TrangThaiSuDung2.DangSuDung)) {
          this.isView = true;

          this.btnDongDisabled = false;

          this.btnLayDuLieuHide = true;
          this.btnSuaHide = true;
          this.btnLuuHide = true;
          this.btnXacThucHide = true;

          // check trạng thái sử dụng trước khi sửa
          this.boKyHieuHoaDonService.CheckTrangThaiSuDungTruocKhiSua(data.boKyHieuHoaDonId)
            .subscribe((res: any) => {
              if (res) {
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
                    msOkButtonInBlueColor: false,
                    msTitle: 'Sửa ký hiệu',
                    msContent: `Bạn không thể sửa ký hiệu <b><span class='csslightBlue'>${data.kyHieu}</span></b> do đã ngừng sử dụng <b>${res.noiDung}</b>
                      liên quan tại tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử có mã thông điệp <a>${res.maThongDiepGui}</a>
                      đã được cơ quan thuế chấp nhận ngày ${moment(res.thoiDiemChapNhan).format('DD/MM/YYYY HH:mm:ss')}`,
                    msOnClose: () => {
                      ///////////////////////////
                    }
                  },
                  nzFooter: null
                });
              }
            })
        }
        break;
      default:
        break;
    }

    if (this.isView || this.mainForm.getRawValue().soLonNhatDaLapDenHienTai || data.trangThaiSuDung === TrangThaiSuDung.HetHieuLuc) {
      this.mainForm.disable();
      if (!this.isView) {
        this.mainForm.get('phuongThucChuyenDL').enable();
      }
      // nếu sửa hết hiệu lực thì cho enable phương thức chuyển dữ li
      // if (data.trangThaiSuDung === TrangThaiSuDung.HetHieuLuc && !this.isView) {
      //   this.mainForm.get('phuongThucChuyenDL').enable();
      // }
    } else {
      this.mainForm.enable();
      this.mainForm.get('kyHieu').disable();
      this.mainForm.get('kyHieu1').disable();
      this.mainForm.get('kyHieuMauSoHoaDon').disable();
      this.mainForm.get('soLonNhatDaLapDenHienTai').disable();
      this.mainForm.get('kyHieu23').disable();
      this.mainForm.get('kyHieu4').disable();
      if (!data.isTuyChinh) {
        this.mainForm.get('soBatDau').disable();
        this.mainForm.get('soToiDa').disable();
      }
    }
  }

  forkJoin() {
    const data = this.mainForm.getRawValue();

    const initNhatKys = {
      tenTrangThaiSuDung: 'Chưa xác thực',
      trangThaiSuDung: 0
    };

    return forkJoin([
      (this.isAddNew || this.isCopy) ? of([initNhatKys]) : this.boKyHieuHoaDonService.GetListNhatKyXacThucById(this.data.boKyHieuHoaDonId), // 0
      this.hoSoHDDTService.GetDetail(), // 1
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung(), // 2
      this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat().pipe( // 3
        tap((res: any) => {
          if (res) {
            this.hinhThucHoaDons = getHinhThucHoaDons().filter(x => x.key === res.hinhThucHoaDon);
            if (res.loaiHoaDons && res.loaiHoaDons.length > 0) {
              this.loaiHoaDons = getLoaiHoaDons().filter(x => res.loaiHoaDons.includes(x.key));
              this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key != 3 && x.key != 4 && x.key != 13);
              this.loaiHoaDonAlls = JSON.parse(JSON.stringify(this.loaiHoaDons));
              console.log("🚀 ~ file: add-edit-bo-ky-hieu-hoa-don.component.ts:620 ~ AddEditBoKyHieuHoaDonComponent ~ tap ~ this.loaiHoaDonAlls", this.loaiHoaDonAlls)
            }
            if (res.isCMTMTTien) {
              this.hinhThucHoaDons = [...this.hinhThucHoaDons, ...getHinhThucHoaDons().filter(x => x.key === 2)];
            }
            if (res.isKhongCoMa && res.hinhThucHoaDon != 0) {
              this.hinhThucHoaDons = [...this.hinhThucHoaDons, ...getHinhThucHoaDons().filter(x => x.key === 0)];
            }

            if (this.isAddNew) {
              this.mainForm.get('hinhThucHoaDon').setValue(res.hinhThucHoaDon);
              this.mainForm.get('loaiHoaDon').setValue(this.loaiHoaDons[0].key);

              this.isChuyenDayDuNoiDungTungHoaDon = res.isChuyenDayDuNoiDungTungHoaDon;
              this.isChuyenBangTongHop = res.isChuyenBangTongHop;
            } else {
              if (this.hinhThucHoaDons.filter(x => x.key === this.data.hinhThucHoaDon).length === 0) {
                this.hinhThucHoaDons = [getHinhThucHoaDons().find(x => x.key === this.data.hinhThucHoaDon), ...this.hinhThucHoaDons];
              }
              if (this.loaiHoaDons.filter(x => x.key === this.data.loaiHoaDon).length === 0) {
                this.loaiHoaDons = [getLoaiHoaDons().find(x => x.key === this.data.loaiHoaDon), ...this.loaiHoaDons];
              }
            }
          }
        })
      ),
      this.isAddNew ? of(null) : this.quanLyThongTinHoaDonService.GetListByHinhThucVaLoaiHoaDon(data.hinhThucHoaDon, data.loaiHoaDon) // 4
    ]);
  }

  async submitForm() {
    if (this.mainForm.invalid) {
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.mainForm.getRawValue();

    if (this.isAddNew || this.isCopy || (this.data.boKyHieuHoaDonId && this.data.kyHieu !== data.kyHieu)) {
      const checkExistKyHieu = await this.boKyHieuHoaDonService.CheckTrungKyHieuAsync(data);
      if (checkExistKyHieu) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '430px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOkButtonInBlueColor: false,
            msTitle: 'Kiểm tra lại',
            msContent: `Ký hiệu <b class="cssbrown">${data.kyHieu}</b> đã tồn tại. Vui lòng kiểm tra lại.`,
            msOnClose: () => {
            }
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
    }

    const checkedMauHoaDon = this.listMauHoaDon.filter(x => x.checked).map(x => x.mauHoaDonId);

    if (checkedMauHoaDon.length === 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '430px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOkButtonInBlueColor: false,
          msTitle: 'Kiểm tra lại',
          msContent: 'Bạn chưa chọn <strong>Mẫu hóa đơn</strong>. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    data.mauHoaDonId = checkedMauHoaDon.join(';');
    data.thongDiepId = this.listToKhai[0].thongDiepId;
    data.thongDiepMoiNhatId = this.toKhaiMoiNhat.thongDiepId;

    var checkExistMHD: any = await this.mauHoaDonService.CheckExistAsync(data.mauHoaDonId);
    if (!checkExistMHD.status) {
      const tenMauHoaDon = this.listMauHoaDon.filter(x => checkExistMHD.data.includes(x.mauHoaDonId)).map(x => x.ten).join(',');

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
          msContent: `Mẫu hóa đơn <span class='colorChuYTrongThongBao'><b>${tenMauHoaDon}</b></span> đã bị xóa. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      this.spinning = false;
      return;
    }

    if (this.currentUser.isAdmin || this.currentUser.isNodeAdmin) {
      data.roleId = null;
    }
    else data.roleId = this.currentUser.roleId;

    if (this.isAddNew || !this.data.boKyHieuHoaDonId) {
      // if (this.thongTinToKhaiMoiNhat.maCuaCQTToKhaiChapNhan != null) {
      //   data.maCuaCQTToKhaiChapNhan = this.thongTinToKhaiMoiNhat.maCuaCQTToKhaiChapNhan;
      // }
      this.boKyHieuHoaDonService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);

          this.afterSaveChanges(result.boKyHieuHoaDonId);
        } else {
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        }
      }, _ => {
        this.spinning = false;
        this.message.success(TextGlobalConstants.TEXT_ERROR_API);
      });
    } else {
      if (this.thongTinToKhaiMoiNhat.maCuaCQTToKhaiChapNhan != null) {
        data.maCuaCQTToKhaiChapNhan = this.thongTinToKhaiMoiNhat.maCuaCQTToKhaiChapNhan;
      }
      this.boKyHieuHoaDonService.Update(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.PhanQuyen,
            refType: RefType.PhanQuyenChucNang,
            thamChieu: `Tên bộ kí hiệu: ${data.kyHieu}`,
            moTaChiTiet: `Phân quyền tự động cho bộ kí hiệu: ${data.kyHieu}`,
            refId: data.boKyHieuHoaDonId
          }).subscribe();
          this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);

          this.afterSaveChanges(data.boKyHieuHoaDonId);
        } else {
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        }
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      });
    }
  }

  changePTChuyenDL(event: any) {
    this.mainForm.get('phuongThucChuyenDL').markAsDirty();
  }

  // set value after save change
  afterSaveChanges(id: any) {
    this.boKyHieuHoaDonService.GetById(id).subscribe((res: any) => {
      this.data = res;
      if (res.trangThaiSuDung == 4) {
        this.xacThucHetHieuLucCompleted = false;
      }

      if (this.isAddNew || this.isCopy) {
        this.isAddNew = false;
        this.isCopy = false;

        this.mainForm.patchValue({
          boKyHieuHoaDonId: this.data.boKyHieuHoaDonId,
          createdDate: this.data.createdDate,
          createdBy: this.data.createdBy
        });
      }

      this.mainForm.markAsPristine();

      this.isView = true;
      this.disableOrEnableButtons();
      this.sharedService.emitChange({
        type: "loadData",
        value: true
      });
    });
  }

  closeModal() {
    if (this.mainForm.dirty && this.isAddNew !== true) {
      const formData = this.mainForm.getRawValue();

      if ((this.btnXacThucDisabled === false && this.btnSuaDisabled === true && this.isOnlyDirtyPhuongThucChuyenDL()) ||
        (!this.xacThucHetHieuLucCompleted && this.mainForm.get('trangThaiSuDung').value == 4)) {
        if (this.data.phuongThucChuyenDL !== formData.phuongThucChuyenDL) {
          const modal = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzWidth: '460px',
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msTitle: 'Xác thực sử dụng',
              msContent: 'Bạn chưa xác thực sử dụng. Bạn có muốn xác thực sử dụng không?',
              msOnOk: () => {
                modal.destroy();
              },
              msOnClose: () => {
                modal.destroy();
                this.modal.destroy();
              }
            },
            nzFooter: null
          });
        } else {
          this.modal.destroy();
        }
      } else {
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
              this.submitForm()
            },
            msOnClose: () => {
              this.modal.destroy();
            }
          },
          nzFooter: null
        });
      }
    } else {
      this.modal.destroy();
    }
  }

  changeHinhThucHoaDon(event: any) {
    this.mainForm.get('kyHieu1').setValue(event === 0 ? 'K' : 'C');
    switch (event) {
      case 1:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13 && x.key !== 14 && x.key !== 15
        });
        this.kyHieuThu4sSearch = this.kyHieuThu4sSearchAll;
        this.mainForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGT);
        break;
      case 0:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13
        });
        this.mainForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGT);
        break;
      case 2:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 1 && x.key !== 2 && x.key !== 7 && x.key !== 8 && x.key !== 5  && x.key !== 15
        });

        this.mainForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGTCMTMTT);
        break;

      default:
        break;
    }
    this.setKyHieuHoaDon();
    this.listMauHoaDon = [];
  }

  changeLoaiHoaDon(event: any) {
    // Nếu là PXK kiêm vận chuyển nội bộ || PXK hàng gửi bán đại lý => Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn
    if (event === 7 || event === 8) {
      this.mainForm.get('kyHieu4').setValue(event === 7 ? 'N' : 'B');
      this.widthConfigA = ['5%', '50%', '25%', '20%'];
      event = 6;
    } else if (event === 9 || event === 10) {
      this.mainForm.get('kyHieu4').setValue('M');
      if (event === 13 || event === 10) {
        this.widthConfigA = ['5%', '50%', '25%', '20%'];
      } else {
        this.widthConfigA = ['5%', '40%', '20%', '20%', '15%'];
      }
    }
    else if (event === 14 || event === 13) {
      this.mainForm.get('kyHieu4').setValue('M');
      if (event === 14) {
        this.widthConfigA = ['5%', '40%', '20%', '20%', '15%'];
      } else {
        this.widthConfigA = ['5%', '50%', '25%', '20%'];
      }
    }
    else if (event === 15) {
      this.mainForm.get('kyHieu4').setValue('H');
    }

    else {
      this.mainForm.get('kyHieu4').setValue('T');
      if (event === 2) {
        this.widthConfigA = ['5%', '50%', '25%', '20%'];
      } else {
        this.widthConfigA = ['5%', '40%', '20%', '20%', '15%'];
      }
    }
    switch (event) {
      case 9:
        event = 1;
        break;
      case 10:
        event = 2;
        break;
      case 13:
        event = 5;
        break;
      case 14:
      case 15:
      case 16:
        event = 5;
        break;

      default:
        break;
    }
    this.mainForm.get('kyHieuMauSoHoaDon').setValue(event);
    this.setKyHieuHoaDon();
    this.listMauHoaDon = [];
  }

  searchKyHieu4(event: any) {

  }

  changeKyHieu4() {
    this.setKyHieuHoaDon();
  }

  changeKyHieu56() {
    this.setKyHieuHoaDon();
  }

  setKyHieuHoaDon() {
    const data = this.mainForm.getRawValue();
    const kyHieu1 = data.hinhThucHoaDon === 0 ? 'K' : 'C';
    const value = `${kyHieu1}${data.kyHieu23}${data.kyHieu4}${data.kyHieu56}`;
    this.mainForm.get('kyHieuHoaDon').setValue(value);

    this.mainForm.get('kyHieu').setValue(data.kyHieuMauSoHoaDon + value);
  }

  setKyHieu() {
    const data = this.mainForm.getRawValue();
    this.mainForm.get('kyHieu').setValue(data.kyHieuMauSoHoaDon + data.kyHieuHoaDon);
  }

  tuyChinhNguyenTacSHD(event: any) {
    if (!this.mainForm.get('isTuyChinh').dirty) {
      return;
    }

    if (event) {
      this.mainForm.get('soBatDau').enable();
      this.mainForm.get('soToiDa').enable();
    } else {
      const SO_BAT_DAU_MIN = 1;
      this.mainForm.get('soBatDau').setValue(SO_BAT_DAU_MIN);
      this.mainForm.get('soBatDau').disable();
      this.mainForm.get('soToiDa').disable();
    }
  }

  xemMauHoaDon(data: any) {
    const formData = this.mainForm.getRawValue();

    this.mauHoaDonService.CheckExist(data.mauHoaDonId)
      .subscribe((res: any) => {
        if (res.status) {
          this.modalService.create({
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
              kyHieu: formData.kyHieu,
              kySo: false,
              isOpenBoKyHieu: true
            },
            nzFooter: null
          });
        } else {
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
              msContent: `Mẫu hóa đơn <span class='colorChuYTrongThongBao'><b>${data.ten}</b></span> đã bị xóa. Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
          this.spinning = false;
          return;
        }
      });
  }

  xemToKhai(data: any) {
    this.quyDinhKyThuatService.GetThongDiepChungById(data.thongDiepId)
      .subscribe((res: any) => {
        if (res) {
          var phanQuyen = localStorage.getItem('KTBKUserPermission');
          let thaoTac = [];
          if (phanQuyen != 'true') {
            let pq = JSON.parse(phanQuyen);
            thaoTac = pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs;
          }
          this.tabThongDiepGuiComponent.permission = this.permission;
          this.tabThongDiepGuiComponent.thaoTacs = thaoTac;
          this.tabThongDiepGuiComponent.clickSua(false, true, res);
        }
      });
  }

  xemThongDiepNhan(data: any) {
    if (!data.maThongDiepNhan) {
      return;
    }

    this.quyDinhKyThuatService.GetXmlContentThongDiep(data.maThongDiepNhan)
      .subscribe((res: any) => {
        if (!res) {
          return;
        }
        const modal1 = this.modalService.create({
          nzTitle: "Chi tiết",
          nzContent: LichSuTruyenNhanDisplayXmldataComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 80,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            fileData: res.result,
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {

        });
        // const modal = this.modalService.create({
        //   nzTitle: "Lịch sử truyền nhận",
        //   nzContent: ViewXmlContentModalComponent,
        //   nzMaskClosable: false,
        //   nzClosable: false,
        //   nzKeyboard: false,
        //   nzWidth: window.innerWidth / 100 * 96,
        //   nzStyle: { top: '10px' },
        //   nzBodyStyle: { padding: '1px' },
        //   nzComponentParams: {
        //     data: res.result,
        //   },
        //   nzFooter: null
        // });
      });
  }

  checkedMauHoaDon(data: any) {
    this.listMauHoaDon.forEach((item: any) => {
      if (item !== data && item.loaiThueGTGT === data.loaiThueGTGT) {
        item.checked = false;
      }
    });
  }

  blurDate() {
    const params = this.mainForm.getRawValue();
    CheckValidDateV2(params);
    const ky = GetKy(params);
    this.mainForm.get('ky').setValue(ky);
  }

  changeKy(event: any) {
    const params = this.mainForm.getRawValue();
    SetDate(event, params);
    this.mainForm.patchValue({
      fromDate: params.fromDate,
      toDate: params.toDate
    });
  }

  async onCLickXacThucSuDung() {
    if (!this.data.mauHoaDons.every(x => x.ngayKy)) {
      var ten = this.data.mauHoaDons.filter(x => !x.ngayKy).map(x => x.ten).join(',');

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '430px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOkButtonInBlueColor: false,
          msTitle: 'Kiểm tra lại',
          msContent: `Mẫu hóa đơn <b class="cssbrown">${ten}</b> chưa ký điện tử. Vui lòng kiểm tra lại!`,
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    if (this.serials.length == 0) {
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

    this.sign();
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
      isSignBKH: true,
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
      if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
        this.observableSocket();
      } else {
        this.kiMem(msg)
      }
    } else {
      if (this.webSocket.isConnecting()) {
        //khi socket ở trạng thái đang kết nối
        //đợi 2000ms để socket được mở
        setTimeout(() => {
          if (this.webSocket.isOpenSocket()) {
            //nếu socket mở thì thoát time out
            this.webSocket.sendMessage(JSON.stringify(msg));
            if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
              this.observableSocket();
            } else {
              this.kiMem(msg)
            }
          }
        }, 2000);

        //sau 2000ms vẫn chưa kết nối được thì ngắt
        if (!this.webSocket.isOpenSocket()) {
          this.spinning = false;
          return;
        }
      } else {
        this.spinning = false;
        return;
      }
    }
  }
  async kiMem(dataKy: any) {
    this.webSubcription = (await this.webSocket.createObservableSocket('', dataKy)).subscribe((rs: any) => {
      console.log(rs);

      if (!this.webSocket.isOpenSocket() && !this.webSocket.isConnecting()) {
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

      let obj = rs;
      console.log('obj2: ', obj);
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
                  msMessageType: MessageType.Info,
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
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          },
          msTitle: 'Kiểm tra lại',
          msContent: `Ký không thành công. Vui lòng kiểm tra lại.`,
        },
        nzFooter: null
      });

    })
  }
  xacThucBoKyHieuHoaDon(resSeri: any) {
    let trangThaiSuDung = this.mainForm.get('trangThaiSuDung').value;
    if (trangThaiSuDung === 0 || trangThaiSuDung === 3) {
      this.GetThongTinHoaDonWhenClickXacThuc();
      trangThaiSuDung = 1;
    } else if (trangThaiSuDung === 1 || trangThaiSuDung === 2) {
      trangThaiSuDung = 3;
    }

    const data = {
      boKyHieuHoaDonId: this.data.boKyHieuHoaDonId,
      trangThaiSuDung: trangThaiSuDung,
      mauHoaDonId: this.data.mauHoaDonId,
      thongDiepId: this.data.thongDiepId,
      thongDiepMoiNhatId: this.toKhaiMoiNhat.thongDiepId,
      tenMauHoaDon: this.data.mauHoaDons.map(x => x.ten).join(';'),
      tenToChucChungThuc: this.data.subject,
      soSeriChungThu: this.data.serialNumber,
      thoiGianSuDungTu: resSeri.thoiGianSuDungTu,
      thoiGianSuDungDen: resSeri.thoiGianSuDungDen,
      thoiDiemChapNhan: this.toKhaiMoiNhat.thoiDiemChapNhan,
      maThongDiepGui: this.toKhaiMoiNhat.maThongDiepGui,
      phuongThucChuyenDL: this.mainForm.get('phuongThucChuyenDL').value,
      isXacThucTrenForm: true
    };
    this.boKyHieuHoaDonService.XacThucBoKyHieuHoaDon(data)
      .subscribe((res: any) => {
        if (res) {
          this.data.trangThaiSuDung = trangThaiSuDung;
          this.data.phuongThucChuyenDL = this.mainForm.get('phuongThucChuyenDL').value;
          this.mainForm.get('trangThaiSuDung').setValue(trangThaiSuDung);
          this.getNhatKys();
          this.message.success((trangThaiSuDung === 1 || trangThaiSuDung === 4) ? TextGlobalConstants.CONFIRM_BO_KY_HIEU_SUCCESS : TextGlobalConstants.STOP_USING_BO_KY_HIEU_SUCCESS);

          if (trangThaiSuDung === 4) {
            this.xacThucHetHieuLucCompleted = true;
            this.btnXacThucDisabled = true;
            this.btnSuaDisabled = false;
            this.mainForm.markAsPristine();
            this.isView = true;
            this.disableOrEnableButtons();
          }

          this.sharedService.emitChange({
            type: "loadData",
            value: true
          });
        }
      });
  }

  getNhatKys() {
    this.spinning = true;
    this.boKyHieuHoaDonService.GetListNhatKyXacThucById(this.data.boKyHieuHoaDonId)
      .subscribe((res: any[]) => {
        this.nhatKys = res;
        console.log("🚀 ~ file: add-edit-bo-ky-hieu-hoa-don.component.ts:1536 ~ AddEditBoKyHieuHoaDonComponent ~ .subscribe ~  this.nhatKys:", this.nhatKys)
        this.spinning = false;
      });
  }

  GetThongTinHoaDonWhenClickXacThuc() {
    const data = this.mainForm.getRawValue();
    this.quanLyThongTinHoaDonService.GetListByHinhThucVaLoaiHoaDon(data.hinhThucHoaDon, data.loaiHoaDon)
      .subscribe((res: any[]) => {
        this.thongTinHoaDons = res;
      });
  }

  onClickSua() {
    this.isView = false;
    // if (!this.isView && this.data.soLonNhatDaLapDenHienTai >= 1 && this.data.hinhThucHoaDon != 0) {
    //   const modal = this.ActivedModal = this.modalService.create({
    //     nzContent: MessageBoxModalComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzKeyboard: false,
    //     nzStyle: { top: '100px' },
    //     nzBodyStyle: { padding: '1px' },
    //     nzWidth: '430px',
    //     nzComponentParams: {
    //       msMessageType: MessageType.Warning,
    //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //       msOkButtonInBlueColor: false,
    //       msTitle: 'Kiểm tra lại',
    //       msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.data.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn không được phép sửa. Vui lòng kiểm tra lại!`,
    //       msOnClose: () => {
    //         ///////////////////////////
    //       }
    //     },
    //     nzFooter: null
    //   });
    //   modal.afterClose.subscribe(() => {
    //     this.ActivedModal = null;
    //   })
    //   return;
    // } else {
    //   this.updateThongTinToKhaiMoiNhatNeuSua();
    //   this.disableOrEnableButtons(true);
    // }

    this.updateThongTinToKhaiMoiNhatNeuSua();
    this.disableOrEnableButtons(true);

  }

  onClickLuu() {

  }

  xemMauHoaDonTaiDay(data: any) {
    this.boKyHieuHoaDonService.GetNhatKyXacThucBoKyHieuIdForXemMauHoaDon(data.nhatKyXacThucBoKyHieuId)
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
            nhatKyXacThucBoKyHieuId: res.result,
            kySo: false,
            isOpenBoKyHieu: true
          },
          nzFooter: null
        });/////
      });
  }

  getMauHoaDons() {
    const data = this.mainForm.getRawValue();
    this.spinning = true;
    this.mauHoaDonService.GetListFromBoKyHieuHoaDon(data)
      .subscribe((res: any[]) => {
        this.listMauHoaDon = res;

        if (this.listMauHoaDon.length === 0) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOkButtonInBlueColor: false,
              msTitle: 'Kiểm tra lại',
              msContent: `Không tồn tại <strong>Mẫu hóa đơn</strong> phù hợp với Ký hiệu <b class="cssbrown">${data.kyHieu}</b>. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
          this.spinning = false;
          return;
        }

        this.listMauHoaDon.forEach((item: any) => {
          if (data.mauHoaDonId && data.mauHoaDonId.includes(item.mauHoaDonId)) {
            item.checked = true;
          }
        });
        this.spinning = false;
      });
  }

  public get trangThaiSuDung(): typeof TrangThaiSuDung {
    return TrangThaiSuDung;
  }

  isOnlyDirtyPhuongThucChuyenDL() {
    const controls = this.mainForm.controls;
    let countDirty = 0;
    for (const name in controls) {
      if (controls[name].dirty) {
        countDirty++;
      }
    }

    return this.mainForm.get('phuongThucChuyenDL').dirty && countDirty === 1;
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
          msTitle: `Nội dung đang phát triển.`,
          msContent: ``,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        },
      });
    }
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
                  msTitle: `Nội dung đang phát triển.`,
                  msContent: ``,
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
                  msTitle: `Nội dung đang phát triển.`,
                  msContent: ``,
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
  filterHinhThucHDNotChangeLoaiHD(event) {
    switch (event) {
      case 1:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13
        });
        this.kyHieuThu4sSearch = this.kyHieuThu4sSearchAll;
        break;
      case 0:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13
        });
        break;
      case 2:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 1 && x.key !== 2 && x.key !== 7 && x.key !== 8
        });

        this.kyHieuThu4sSearch = this.kyHieuThu4sSearchAll.filter(x => {
          return x.key === 'M'
        });;
        break;

      default:
        break;
    }
  }
  // displayLichSuTruyenNhan(data: any) {
  //   this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(data).subscribe((rs: any) => {
  //     if (rs != null) {
  //       if (this.ActivedModal != null) return;
  //       const modal1 = this.ActivedModal = this.modalService.create({
  //         nzTitle: "Lịch sử truyền nhận",
  //         nzContent: LichSuTruyenNhanComponent,
  //         nzMaskClosable: false,
  //         nzClosable: false,
  //         nzKeyboard: false,
  //         nzWidth: window.innerWidth / 100 * 96,
  //         nzStyle: { top: '10px' },
  //         nzBodyStyle: { padding: '1px' },
  //         nzComponentParams: {
  //           data: [rs],
  //           maTD: data,
  //           showForm: false,
  //           loaiTD: 100,

  //         },
  //         nzFooter: null
  //       });
  //       modal1.afterClose.subscribe((rs: any) => {
  //         this.ActivedModal = null;
  //       });
  //     }
  //   });
  // }

}
