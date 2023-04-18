import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { CheckValidEmail, CheckValidSingleEmail } from 'src/app/customValidators/check-valid-email.validator';
import { CheckValidPhone, CheckValidSinglePhone } from 'src/app/customValidators/check-valid-phone.validator';
import { EnvService } from 'src/app/env.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { AuthService } from 'src/app/services/auth.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung, setStyleTooltipError, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { ESignCloudService } from 'src/app/services/Config/eSignCloud.service';

@Component({
  selector: 'app-ho-so-hoa-don-dien-tu',
  templateUrl: './ho-so-hoa-don-dien-tu.component.html',
  styleUrls: ['./ho-so-hoa-don-dien-tu.component.scss']
})
export class HoSoHoaDonDienTuComponent implements OnInit {
  hoSoHDDTForm: FormGroup;
  spinning = false;
  coQuanThueCapCucs = [];
  coQuanThueQuanLys = [];
  coQuanThueQuanLysByCapCuc = [];
  isAddNew: boolean;
  data: any;
  permission: boolean = false;
  thaoTacs: any[] = [];
  phuongPhapTinhs: any[] = [
    'Phương pháp khấu trừ',
    'Phương pháp trực tiếp trên doanh thu'
  ]

  nganhNgheKinhDoanhChinhs: any[] = [
    'Hoạt động sản xuất kinh doanh thông thường',
    'Xổ số kiến thiết, xổ số điện toán',
    'Nhà máy sản xuất điện khác tỉnh với nơi có trụ sở chính',
    'Chuyển nhượng DAĐT CS hạ tầng, nhà khác tỉnh với nơi có trụ sở chính',
    'Hoạt động thăm dò, khai thác dầu khí',
    // 'Ngành hàng sản xuất, kinh doanh thông thường',
    // 'Hoạt động thăm dò, phát triển mỏ và khai thác dầu, khí thiên nhiên',
    // 'Hoạt động xổ số kiến thiết của các công ty xổ số kiến thiết'
  ]

  hinhThucDangKys = [
    { id: 1, name: "Thêm mới" },
    { id: 2, name: "Gia hạn" },
    { id: 3, name: "Ngừng sử dụng" },
  ];

  isAddCTS: boolean = false;
  disabledCTS: boolean = true;
  widthConfigTabCTS = ["50px", "50px", "350px", "200px", "130px", '130px', '150px'];
  scrollConfigTabCTS = { x: SumwidthConfig(this.widthConfigTabCTS), y: '280px' }
  listChungThuSo: any[] = [];
  note = "";
  webSubcription: Subscription;
  loading: boolean = false;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  deleteIds = [];
  daThongBaoSauKhiThayDoiKySangThang = false;
  daThongBaoSauKhiThayDoiKySangQuy = false;
  coThaoTacChuyenKySangQuy = false;
  ctsKyMem: any;
  isKymem: boolean;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private hoSoHDDTService: HoSoHDDTService,
    private userService: UserService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private sharedService: SharedService,
    private webSocket: WebSocketService,
    private authsv: AuthService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private tuyChonService: TuyChonService,
    private eSignCloud: ESignCloudService,
  ) { }

  ngOnInit() {
    const test = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongTinNguoiNopThue").thaoTacs;
    }

    if (this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0) {
      this.userService.getAdminUser().subscribe((users: any[]) => {
        if (users && users.length > 0) {
          this.note = `<span style="display: flex; justify-content: flex-start; align-items: center!important;">Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b>${users.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.</span>`
        }
        else {
          this.note = `<i nz-icon nzType="info" nzTheme="fill" style="color: #fff"></i>&nbsp;Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
        }
      })
    }
    if (isSelectChuKiCung(this.tuyChonService) !== 'KiCung') {
      this.ctsKyMem = isSelectChuKiCung(this.tuyChonService);
      this.isKymem = true;
    }

    this.spinning = true;
    this.createForm();
    this.forkJoin().subscribe((res: any[]) => {
      this.isAddNew = res[0].hoSoHDDTId ? false : true;
      this.coQuanThueCapCucs = res[1];
      this.coQuanThueQuanLys = res[2];
      this.listChungThuSo = res[3];

      this.coQuanThueCapCucs.forEach(x => {
        x.displayName = `${x.name} | ${x.code}`;
      })

      this.coQuanThueQuanLys.forEach(x => {
        x.displayName = `${x.name} | ${x.code}`;
      })

      this.data = res[0];
      if (this.data.coQuanThueCapCuc) {
        this.data.tenCoQuanThueCapCuc = this.coQuanThueCapCucs.find(x => x.code === this.data.coQuanThueCapCuc).name;
      }
      if (this.data.coQuanThueQuanLy) {
        this.data.tenCoQuanThueQuanLy = this.coQuanThueQuanLys.find(x => x.code === this.data.coQuanThueQuanLy).name;
      }

      if (!this.data.nganhNghe) this.data.nganhNghe = this.nganhNgheKinhDoanhChinhs[0];
      this.data.cTS = this.listChungThuSo;
      this.hoSoHDDTForm.patchValue({ ...this.data });

      const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
      ctsArr.clear();
      if (this.data.cTS.length != 0)
        this.data.cTS.forEach((item: any) => {
          const formGroup = this.createCTS(item);
          ctsArr.push(formGroup);
        });

      this.spinning = false;
    });
  }

  createForm() {
    this.hoSoHDDTForm = this.fb.group({
      hoSoHDDTId: [null],
      maSoThue: [{ value: null, disabled: true }, [Validators.maxLength(14)]],
      tenDonVi: [null, [Validators.required, Validators.maxLength(400)]],
      diaChi: [null, [Validators.required, Validators.maxLength(400)]],
      // nganhNgheKinhDoanhChinh: [null, [Validators.required]],
      nganhNghe: [this.nganhNgheKinhDoanhChinhs[0], [Validators.required]],
      hoTenNguoiDaiDienPhapLuat: [null, [Validators.required]],
      emailNguoiDaiDienPhapLuat: [null, [Validators.required, CheckValidSingleEmail, Validators.maxLength(50)]],
      soDienThoaiNguoiDaiDienPhapLuat: [null, [Validators.required, CheckValidSinglePhone, Validators.maxLength(20)]],
      soTaiKhoanNganHang: [null, Validators.maxLength(30)],
      tenNganHang: [null, Validators.maxLength(400)],
      chiNhanh: [null],
      phuongPhapTinhThueGTGT: [null, [Validators.required]],
      emailLienHe: [null, [Validators.required, CheckValidEmail, Validators.maxLength(50)]],
      soDienThoaiLienHe: [null, [Validators.required, CheckValidPhone, Validators.maxLength(20)]],
      fax: [null, Validators.maxLength(20)],
      website: [null, Validators.maxLength(100)],
      coQuanThueCapCuc: [null, [Validators.required]],
      coQuanThueQuanLy: [null, [Validators.required]],
      tenCoQuanThueCapCuc: [null],
      tenCoQuanThueQuanLy: [null],
      maCQTQuanLy: [null],
      maCQTCapCuc: [null],
      kyTinhThue: [null],
      createdDate: [null],
      createdBy: [null],
      status: [true],
      cTS: this.fb.array([])
    });

    this.hoSoHDDTForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }

  createCTS(data: any = null, first = true): FormGroup {
    console.log(data);
    return this.fb.group({
      id: [data == null || first == false ? null : data.id],
      tTChuc: [data == null ? null : data.ttChuc, [Validators.required]],
      seri: [data == null ? null : data.seri, [Validators.required]],
      tNgay: [data == null ? moment().format("YYYY-MM-DD") : moment(data.tNgay).format('YYYY-MM-DD'), [Validators.required]],
      dNgay: [data == null ? moment().format("YYYY-MM-DD") : moment(data.dNgay).format('YYYY-MM-DD'), [Validators.required]],
      hThuc: [data == null ? 1 : data.hThuc, [Validators.required]],
      isAddInTTNNT: [data == null ? true : data.isAddInTTNNT]
    });
  }

  addItem() {
    console.log("them cts");
    this.disabledCTS = false;
    console.log(this.disabledCTS);
    const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
    ctsArr.enable();
    var cts = ctsArr.value as any[];
    console.log(cts);
    if (cts.length === 0) {
      ctsArr.push(this.createCTS({
        ttChuc: null,
        seri: null,
        tNgay: moment().format("YYYY-MM-DD"),
        dNgay: moment().format("YYYY-MM-DD"),
        hThuc: 1,
        isAddInTTNNT: true,
      }));
    } else {
      var lastItem = cts[cts.length - 1];
      ctsArr.push(this.createCTS({
        ttChuc: null,
        seri: null,
        tNgay: moment().format("YYYY-MM-DD"),
        dNgay: moment().format("YYYY-MM-DD"),
        hThuc: 1,
        isAddInTTNNT: true,
      }));
    }

    this.hoSoHDDTForm.markAsDirty();
  }

  removeRow() {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 500,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa chứng thư số",
        msContent: `Bạn có chắc chắn muốn xóa chứng thư số đã chọn không?`,
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOnClose: () => {
          return;
        },
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msOnOk: () => {
          const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];
          const datas = this.hoSoHDDTForm.get('cTS')['controls'].filter(x => x.selected == true);
          if (datas.length > 0) {
            if (datas[0].value.id != null) this.deleteIds.push(datas[0].value.id);
            ctsArr.removeAt(cts.indexOf(datas[0].value));
          }

          if (ctsArr.length == 0) this.disabledCTS = true;
          this.hoSoHDDTForm.markAsDirty();
        }
      }
    });
  }

  removeRowIdx(i: any) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 500,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa chứng thư số",
        msContent: `Bạn có chắc chắn muốn xóa chứng thư số đã chọn không?`,
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOnClose: () => {
          return;
        },
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msOnOk: () => {
          const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
          const cts = ctsArr.value as any[];
          if (cts[i].id != null) this.deleteIds.push(cts[i].id);
          ctsArr.removeAt(i);
          this.hoSoHDDTForm.markAsDirty();
        }
      }
    });
  }


  selectCTS(data: any) {
    if (data.selected == true) {
      data.selected = false;
      return;
    }
    this.hoSoHDDTForm.get('cTS')['controls'].forEach(x => {
      if (x.selected == true) x.selected = false;
    })

    data.selected = true;
  }


  checkTrung(i: number) {
    const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
    const cts = ctsArr.value as any[];
    let indexs = [];
    for (let index = 0; index < cts.length; index++) {
      if (index != i) {
        if (cts[index].seri == cts[i].seri && moment(cts[index].tNgay).format("YYYY-MM-DD") == moment(cts[i].tNgay).format("YYYY-MM-DD") && moment(cts[index].dNgay).format("YYYY-MM-DD") == moment(cts[i].dNgay).format("YYYY-MM-DD")
          && cts[index].hThuc == cts[i].hThuc) {
          if (index < i) {
            console.log('index = ' + index + 'i = ' + i);
            return ''
          };
          indexs.push(index + 1);
        }
      }
    }

    if (indexs.length > 0) {
      return `<br>&nbsp;- Trùng thông tin chứng thư số dòng ${i + 1} với dòng ${indexs.join(", ")} `;
    }
    else return '';
  }

  enableCTS(i: number) {
    const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
    ctsArr[i].enable();
  }

  chonCTS() {
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
      console.log('Chọn cts');
      this.loading = true;
      this.createObservableSocket();
      this.isAddCTS = true;
      const msg = {
        mLTDiep: "050",
        mst: this.data.maSoThue
      };

      if (this.webSocket.isOpenSocket()) {
        //nếu socket mở thì gửi thông tin lên
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
            }
          }, 2000);

          //sau 2000ms vẫn chưa kết nối được thì ngắt
          if (!this.webSocket.isOpenSocket()) {
            this.loading = false;
            return;
          }
        }
        else {
          //nếu socket không mở cũng không phải đang kết nối thì ngắt
          this.loading = false;
          return;
        }
      }
    } else {
      let cts = this.ctsKyMem.split('|')[1];
      this.isAddCTS = true;
      this.loading = true;
      this.eSignCloud.GetInfoSignCloud(cts).subscribe((rs: any) => {
        if (rs) {
          console.log(rs);
          const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
          ctsArr.removeAt(ctsArr.length - 1)
          const cts = ctsArr.value as any[];
          ctsArr.push(this.createCTS({
            stt: cts.length + 1,
            ttChuc: rs.ttChuc,
            seri: rs.seri,
            tNgayD: moment(rs.tNgay).format("YYYY-MM-DD"),
            dNgayD: moment(rs.dNgay).format("YYYY-MM-DD"),
            tNgay: moment(rs.tNgay).format("YYYY-MM-DDTHH:mm:ss"),
            dNgay: moment(rs.dNgay).format("YYYY-MM-DDTHH:mm:ss"),
            hThuc: 1,
          }));
          this.isAddCTS = false;
          this.loading = false;
          this.disabledCTS = true
        }
      });
    }

  }

  async createObservableSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      if (!this.webSocket.isOpenSocket()) {
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
            msTitle: 'Chọn chứng thư số',
            msContent: `Có lỗi xảy ra. Vui lòng thử lại.`,
          },
          nzFooter: null
        });
        this.spinning = false;
        return;
      }

      let obj = JSON.parse(rs);
      obj.DataJSON = (obj.DataJson != null && obj.DataJson != undefined) ? JSON.parse(obj.DataJson) : null;
      console.log(obj);
      if (obj.TypeOfError == 0) {
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


        const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
        const cts = ctsArr.value as any[];
        if (cts.length == 0 || (cts.length === 1 && cts[0].seri == null)) {
          ctsArr.clear();
          ctsArr.push(this.createCTS({
            ttChuc: obj.DataJSON.Issuer,
            seri: obj.DataJSON.SerialNumber,
            tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
            dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
            hThuc: 1,
          }));

          this.loading = false;
        } else {
          const lastItem = cts[cts.length - 1];

          if (lastItem.id == null && lastItem.seri == null) {
            ctsArr.removeAt(cts.length - 1);
          }

          ctsArr.push(this.createCTS({
            ttChuc: obj.DataJSON.Issuer,
            seri: obj.DataJSON.SerialNumber,
            tNgay: moment(obj.DataJSON.NotBefore).format("YYYY-MM-DD"),
            dNgay: moment(obj.DataJSON.NotAfter).format("YYYY-MM-DD"),
            hThuc: 1,
          }));

          this.loading = false;
        }

        this.isAddCTS = false;
        this.hoSoHDDTForm.markAsDirty();
      }
      else {
        this.loading = false;
        this.isAddCTS = false;
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
      }
    }, err => {
      console.log(err);
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
            this.isAddCTS = false;
            this.loading = false;
            const link = document.createElement('a');
            link.href = `${this.env.apiUrl}/${this.urlTools}`;
            link.download = 'BKSOFT-KYSO-SETUP.zip';
            link.click();
            this.isAddCTS = false;
            this.loading = false;
          },
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            this.isAddCTS = false;
            this.loading = false;
            return;
          },
          msTitle: 'Kiểm tra lại',
          msContent: `Để chọn chứng thư số, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
        },
        nzFooter: null
      });
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


  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoSoHDDTService.GetListCoQuanThueCapCuc(),
      this.hoSoHDDTService.GetListCoQuanThueQuanLy(),
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung()
    ]);
  }

  submitForm() {
    this.spinning = true;

    if (this.hoSoHDDTForm.invalid) {
      console.log(this.hoSoHDDTForm);
      for (const i in this.hoSoHDDTForm.controls) {
        this.hoSoHDDTForm.controls[i].markAsTouched();
        this.hoSoHDDTForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);

      const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
      console.log(ctsArr);
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

    if (this.hoSoHDDTForm.dirty) {
      const cTSFormArray = this.hoSoHDDTForm.get('cTS') as FormArray;
      var listCTS = cTSFormArray.value;

      console.log(listCTS);
      //check xem có những chứng thư số nào đang bị trùng
      //nếu có trùng thì báo lỗi: chỉ ra những dòng nào đang bị trùng
      let message = 'Danh sách chứng thư số bị trùng:';
      let messageBaoTrung = '';
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

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '500px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnClose: () => {
            this.spinning = false;
            return;
          },
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msOnOk: () => {
            this.saveChanges();
          },
          msTitle: 'Xác nhận thay đổi thông tin người nộp thuế',
          msContent: `Hệ thống không tự động cập nhật sự thay đổi thông tin người nộp thuế khi người dùng thực hiện <strong>SỬA</strong> các chứng từ (<i>Mẫu hóa đơn, Biên bản hủy hóa đơn, Biên bản điều chỉnh hóa đơn...</i>) đã tạo trước thời điểm cập nhật thông tin người nộp thuế có sử dụng đến thông tin này. Vui lòng thực hiện cập nhật thông tin thay đổi khi SỬA các chứng từ này. Bạn có chắc chắn muốn lưu không?
          `,
        },
        nzFooter: null
      });
    } else {
      this.spinning = false;
      return;
    }
  }

  saveChanges() {
    const data = this.hoSoHDDTForm.getRawValue();
    const ctsArr = this.hoSoHDDTForm.get('cTS') as FormArray;
    const cts = ctsArr.value as any[];
    const dataTuyChon = {

    }
    cts.forEach(x => {
      if (x.id == null || x.isAddInTTNNT == true)
        x.isAddInTTNNT = true;
    })

    if (this.isAddNew) {
      data.cts = null;
      this.hoSoHDDTService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.tuyChonService.Update(data)
          this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();
          if (this.deleteIds.length > 0) {
            this.quyDinhKyThuatService.DeleteRangeChungThuSo(this.deleteIds).subscribe();
          }
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Sua,
            refType: RefType.HoSoHoaDonDienTu,
            thamChieu: null,
            refId: result.hoSoHDDTId,
            duLieuCu: this.data,
            duLieuMoi: result
          }).subscribe();
          this.data = result;
          this.isAddNew = false;
          this.hoSoHDDTForm.patchValue({ ...result });
          this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
          this.hoSoHDDTForm.markAsPristine();
          this.sharedService.emitChange({
            type: "updateInfo",
            value: result
          });

          this.setCookieKyKeKhaiThue(data.kyTinhThue);
        } else {
          this.message.error('Lỗi thêm mới');
        }
      }, _ => {
        this.spinning = false;
        this.message.success(TextGlobalConstants.TEXT_ERROR_API);

      });
    } else {
      this.hoSoHDDTService.Update(data).subscribe((res: any) => {
        if (res) {
          this.quyDinhKyThuatService.AddRangeChungThuSo(cts).subscribe();
          if (this.deleteIds.length > 0) {
            this.quyDinhKyThuatService.DeleteRangeChungThuSo(this.deleteIds).subscribe();
          }
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Sua,
            refType: RefType.HoSoHoaDonDienTu,
            thamChieu: null,
            refId: data.hoSoHDDTId,
            duLieuCu: this.data,
            duLieuMoi: data
          }).subscribe();
          this.data = data;
          this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
          this.hoSoHDDTForm.markAsPristine();
          this.sharedService.emitChange({
            type: "updateInfo",
            value: data
          });

          this.setCookieKyKeKhaiThue(data.kyTinhThue);
        } else {
          this.message.error('Lỗi cập nhật');
        }

        this.spinning = false;
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      });
    }
  }

  changeCoQuanThueCapCuc(event: any) {
    if (event) {
      this.hoSoHDDTForm.get('tenCoQuanThueCapCuc').setValue(this.coQuanThueCapCucs.find(x => x.code === event).name);

      this.hoSoHDDTForm.get('maCQTCapCuc').setValue(event);
      this.coQuanThueQuanLysByCapCuc = this.coQuanThueQuanLys.filter(x => x.parent_code === event).sort((x1, x2) => (x1.code < x2.code ? -1 : 1));
      this.hoSoHDDTForm.get('coQuanThueQuanLy').setValue(this.coQuanThueQuanLysByCapCuc[0].code);
      this.hoSoHDDTForm.get('maCQTQuanLy').setValue(this.coQuanThueQuanLysByCapCuc[0].code);
    }
  }

  changeCoQuanThueQuanLy(event: any) {
    if (event) {
      this.hoSoHDDTForm.get('tenCoQuanThueQuanLy').setValue(this.coQuanThueQuanLys.find(x => x.code === event).name);
      this.hoSoHDDTForm.get('maCQTQuanLy').setValue(event);
    }
  }

  //hàm này để kiểm tra đã thay đổi giá trị của kỳ kê khai thuế
  changeKyKeKhai() {
    let kyKeKhaiThueGTGT = this.hoSoHDDTForm.get('kyTinhThue');
    if (kyKeKhaiThueGTGT.dirty) {
      let giaTriCu = this.data.kyTinhThue;
      if (giaTriCu == kyKeKhaiThueGTGT.value) return; //nếu đã chọn lại giá trị cũ thì bỏ qua

      if (kyKeKhaiThueGTGT.value === 1 && !this.daThongBaoSauKhiThayDoiKySangQuy) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: '440px',
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msTitle: 'Chuyển sang khai thuế GTGT theo quý',
            msContent: 'Khi người nộp thuế lựa chọn chuyển sang khai thuế theo quý thì gửi văn bản đề nghị quy định tại Phụ lục I ban hành kèm theo Nghị định số 126/2020/NĐ-CP đề nghị thay đổi kỳ tính thuế đến cơ quan thuế quản lý trực tiếp chậm nhất là 31 tháng 01 của năm bắt đầu khai thuế theo quý. ' +
              'Nếu sau thời hạn này người nộp thuế không gửi văn bản đến cơ quan thuế thì người nộp thuế tiếp tục thực hiện khai thuế theo tháng ổn định trọn năm dương lịch.' +
              '<br><br>Bạn có chắn chắn đã gửi văn bản đề nghị theo quy định và muốn thiết lập chuyển sang khai thuế theo quý không?',
            msOnOk: () => {
              this.daThongBaoSauKhiThayDoiKySangQuy = true;
              this.hienThongBao();
            },
            msOnClose: () => {
              this.coThaoTacChuyenKySangQuy = true;
              this.hoSoHDDTForm.get('kyTinhThue').setValue(0);
            }
          },
          nzFooter: null
        });
      }
      else {
        if (!this.coThaoTacChuyenKySangQuy && !this.daThongBaoSauKhiThayDoiKySangThang) {
          this.hienThongBao();
          this.daThongBaoSauKhiThayDoiKySangThang = true;
        }
      }
    }
  }

  //hàm này hiện thông báo hóa đơn sai sót
  hienThongBao() {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzWidth: '440px',
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Info,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msTitle: 'Cập nhật tình trạng thông báo hóa đơn có sai sót',
        msContent: 'Thay đổi kỳ kê khai thuế GTGT sẽ làm thay đổi thời điểm được xác định là ngày cuối cùng của kỳ kê khai thuế GTGT. Căn cứ vào ngày cuối cùng của kỳ kê khai thuế GTGT sau khi thay đổi, hệ thống sẽ cập nhập lại tình trạng thông báo hóa đơn điện tử có sai sót đối với các trạng thái thông báo hóa đơn có sai sót là <b>Chưa lập thông báo</b> và <b>Chưa gửi</b>',
        msOnClose: () => {
          this.spinning = false;
        }
      },
      nzFooter: null
    });
  }

  setCookieKyKeKhaiThue(kyTinhThue: any) {
    localStorage.setItem(CookieConstant.KYKEKHAITHUE, kyTinhThue === 0 ? 'Thang' : 'Quy');

    //reset các biến này sau khi lưu xong
    this.daThongBaoSauKhiThayDoiKySangThang = false;
    this.daThongBaoSauKhiThayDoiKySangQuy = false;
    this.coThaoTacChuyenKySangQuy = false;
  }
}
