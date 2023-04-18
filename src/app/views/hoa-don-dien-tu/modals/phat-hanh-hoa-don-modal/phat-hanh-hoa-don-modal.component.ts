import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, of, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
// import * as randomstring from 'randomstring';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TrangThaiQuyTrinh, TrangThaiQuyTrinhLabel } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { generateUUIDV4, getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung, kiemTraHoaDonHopLeTheoKyKeKhai, mathRound, showModalPreviewPDF, toTrimAndToUpperCase } from 'src/app/shared/SharedFunction';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { SharedService } from 'src/app/services/share-service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { FormatPricePipe } from 'src/app/pipes/format-price.pipe';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { HinhThucHoaDon } from 'src/app/enums/HinhThucHoaDon.enum';
import { TabHoaDonDienTuComponent } from '../../tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { isQuote } from '@angular/compiler';
import { Router } from '@angular/router';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { NguoiBanNguoiKyChecker } from 'src/app/shared/NguoiBanNguoiKyChecker';
import { DigitalSignerNameReaderService } from 'src/app/services/tien-ich/digital-signer-name-reader.service';

@Component({
  selector: 'app-phat-hanh-hoa-don-modal',
  templateUrl: './phat-hanh-hoa-don-modal.component.html',
  styleUrls: ['./phat-hanh-hoa-don-modal.component.scss'],
  providers: [FormatPricePipe]
})
export class PhatHanhHoaDonModalComponent implements OnInit {
  @Input() data: any;
  @Input() isPhatHanhLai: boolean;
  @Input() isGuiCQT: boolean;
  @Input() formModal: HoaDonDienTuModalComponent;
  @Input() callBack: () => any = null;
  mainForm: FormGroup;
  linkKy: "localhost:15782";
  disabled = false;
  chonLaiChungThuChuKySo: boolean = false;
  guiHoaDonChoKhachHang: boolean = false;
  soHoaDon: string = '';
  loiTBPH = null;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  webSubcription: Subscription;
  hoSoHDDT: any;
  serials = [];
  ttChung = null;
  thongDiepChung = null;
  loading = false;
  isboxEmailCcBcc: boolean = false;
  kyOption = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
  ddtp: DinhDangThapPhan = new DinhDangThapPhan();
  paramPhatHanh = null;
  hoaDonBiThayTheOrDieuChinh: any;
  IsPos: boolean;
  boolCanhBaoNguoiBanKhacNguoiKy = false;


  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private formatPricePipe: FormatPricePipe,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private authsv: AuthService,
    private webSocket: WebSocketService,
    private sharedService: SharedService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private tabHoaDonDienTuComp: TabHoaDonDienTuComponent,
    private router: Router,
    private tuyChonService: TuyChonService,
    private hoSoHHDTService: HoSoHDDTService,
    private signerNameReaderService: DigitalSignerNameReaderService
  ) { }

  isSelectChuKiCung = isSelectChuKiCung(this.tuyChonService);

  ToggleButton() {
    this.isboxEmailCcBcc = !this.isboxEmailCcBcc;
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('hoa-don-tu-mtt')) {
      this.IsPos = true;
    }
    this.paramPhatHanh = {
      hoaDonDienTuId: this.data.hoaDonDienTuId,
      skipCheckHetHieuLucTrongKhoang: false,
      skipChecNgayKyLonHonNgayHoaDon: false,
      skipCheckChenhLechThanhTien: false,
      skipCheckChenhLechTienChietKhau: false,
      skipCheckChenhLechTienThueGTGT: false,
      isPhatHanh: true,
      hoaDon: this.data
    };

    this.createForm();
    this.disabled = true;

    this.forkJoin().subscribe(async (res: any) => {
      this.hoSoHDDT = res[0];
      this.isSelectChuKiCung = isSelectChuKiCung(this.tuyChonService);

      this.ttChung = {
        PBan: '2.0.0',
        MNGui: `${this.env.taxCodeTCGP}`,
        MNNhan: this.env.taxCodeTCTN,
        MLTDiep: this.data.boKyHieuHoaDon.hinhThucHoaDon === 1 ? 200 : 203,
        MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
        MTDTChieu: '',
        MST: this.hoSoHDDT.maSoThue,
        SLuong: 1
      };

      this.thongDiepChung = {
        phienBan: this.ttChung.PBan,
        maNoiGui: this.ttChung.MNGui,
        maNoiNhan: this.ttChung.MNNhan,
        maLoaiThongDiep: this.ttChung.MLTDiep,
        maThongDiep: this.ttChung.MTDiep,
        maThongDiepThamChieu: '',
        maSoThue: this.ttChung.MST,
        soLuong: this.ttChung.SLuong
      };

      this.serials = res[1];
      this.hoaDonBiThayTheOrDieuChinh = res[3];

      if (!this.isGuiCQT) {
        this.soHoaDon = res[2].soHoaDon;
        this.mainForm.get('soHoaDon').setValue(this.soHoaDon);
      }

      this.disabled = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(), // 0
      this.boKyHieuHoaDonService.GetChungThuSoById(this.data.boKyHieuHoaDonId), // 1
      this.hoaDonDienTuService.CreateSoHoaDon(this.data), // 2
      (this.data.trangThai === 3 || this.data.trangThai === 4) ? // 3: Nếu hóa đơn là thay thế hoặc điều chỉnh thì lấy thông tin của hóa đơn bị thay thế hoặc bị điều chỉnh
        this.hoaDonDienTuService.GetById(this.data.trangThai === 3 ? this.data.thayTheChoHoaDonId : this.data.dieuChinhChoHoaDonId) :
        of(null),
      this.tuyChonService.GetAll()
    ]);
  }

  changeGuiHoaDonChoKH(event) {
    if (event == true) {
      this.mainForm.get('hoTenNguoiNhanHD').enable();
      this.mainForm.get('emailNguoiNhanHD').enable();
      this.mainForm.get('soDienThoaiNguoiNhanHD').enable();
    }
    else {
      this.mainForm.get('hoTenNguoiNhanHD').disable();
      this.mainForm.get('emailNguoiNhanHD').disable();
      this.mainForm.get('soDienThoaiNguoiNhanHD').disable();
    }
  }

  createForm() {
    this.mainForm = this.fb.group({
      kyHieu: [{ value: this.data.boKyHieuHoaDon.kyHieu, disabled: true }],
      tongTienThanhToan: [{ value: this.data.tongTienThanhToan, disabled: true }],
      soHoaDon: [{ value: this.data.soHoaDon ? this.data.soHoaDon : this.soHoaDon, disabled: true }],
      ngayHoaDon: [{ value: moment(this.data.ngayHoaDon).format("DD/MM/YYYY"), disabled: true }],
      tenKhachHang: [{ value: this.data.tenKhachHang || this.data.hoTenNguoiMuaHang, disabled: true }],
      hoTenNguoiNhanHD: [{ value: this.data.hoTenNguoiNhanHD, disabled: true }],
      emailNguoiNhanHD: [{ value: this.data.emailNguoiNhanHD, disabled: true }],
      soDienThoaiNguoiNhanHD: [{ value: this.data.soDienThoaiNguoiNhanHD, disabled: true }]
    });
  }

  view() {
    this.loading = true;
    this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe((rs: any) => {
      const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
      showModalPreviewPDF(this.modalService, `${pathPrint}`);
      this.loading = false;
    }, (err) => {
      this.message.warning("Lỗi khi xem hóa đơn");
      this.loading = false;
    });
  }

  sendMessageToServer(orderData: any) {
    this.loading = true;
    orderData.soHoaDon = this.soHoaDon;
    if (!this.ttChung) {
      return false;
    }
    orderData.TTChungThongDiep = this.ttChung;
    orderData.isPhatHanh = true;
    if (this.isPhatHanhLai) {
      orderData.trangThaiQuyTrinh = 0;
    }


    orderData.soHoaDon = this.soHoaDon;
    if (!this.ttChung) {
      return "";
    }
    orderData.TTChungThongDiep = this.ttChung;
    orderData.isPhatHanh = true;
    if (this.isPhatHanhLai) {
      orderData.trangThaiQuyTrinh = 0;
    }
    console.log('sendMessage :', orderData);
    setTimeout(() => {
      this.hoaDonDienTuService.CreateXMLToSign(orderData).subscribe((rs: any) => {
        if (rs) {
          orderData.dataXML = rs.base64;
          const user = JSON.parse(localStorage.getItem('currentUser'));

          var _data = this.mainForm.getRawValue();
          orderData.actionUser = user;
          this.data = orderData;
          this.data.soHoaDon = this.soHoaDon;
          this.data.hoTenNguoiNhanHD = _data.hoTenNguoiNhanHD;
          this.data.emailNguoiNhanHD = _data.emailNguoiNhanHD;
          this.data.soDienThoaiNguoiNhanHD = _data.soDienThoaiNguoiNhanHD;

          let msg: any = {
            mLTDiep: MLTDiep.TDCDLHDKMDCQThue,
            // type: 1004,
            mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
            dataXML: rs.base64,
            serials: this.serials,
            isCompression: true,
            tTNKy: {
              mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
              ten: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
              diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
              sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
              tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
              tenP2: '',
            }
          };

          // Sending
          console.log("msg", msg);
          if (msg) {
            //khi socket mở mới gửi và cập nhật trạng thái
            this.webSocket.sendMessage(JSON.stringify(msg));
            //kiểm tra lại trạng thái socket xem còn mở hay không. nếu mở mới cập nhật trạng thái thành đang ký, nếu đóng thì không cập nhật và ngắt quá trình ký.
            if (this.webSocket.isOpenSocket()) {
              this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.DangKyDienTu).subscribe();
              return true;
            } else {
              //cập nhật lại trạng thái quy trình thành chưa ký để ký lại
              if (this.webSocket.isConnecting()) {
                //khi socket ở trạng thái đang kết nối
                //đợi 2000ms để socket được mở
                setTimeout(() => {
                  if (this.webSocket.isOpenSocket()) {
                    //nếu socket mở thì thoát time out
                    this.webSocket.sendMessage(msg);
                    this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.DangKyDienTu).subscribe();
                    return true;
                  }
                }, 2000);

                //sau 2000ms vẫn k kết nối được thì ngắt
                if (!this.webSocket.isOpenSocket()) {
                  this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.ChuaKyDienTu).subscribe();
                  return false;
                }
              } else {
                this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.ChuaKyDienTu).subscribe();
                return false;
              }
            }
          }
        }
      });
    }, 1000);
  }

  async createXMLToSign(orderData: any): Promise<any> {
    orderData.soHoaDon = this.soHoaDon;
    if (!this.ttChung) {
      return "";
    }
    orderData.TTChungThongDiep = this.ttChung;
    orderData.isPhatHanh = true;
    if (this.isPhatHanhLai) {
      orderData.trangThaiQuyTrinh = 0;
    }
    let rs = await this.hoaDonDienTuService.CreateXMLToSignAsync(orderData);
    if (rs) {
      orderData.dataXML = rs.base64;
      const user = JSON.parse(localStorage.getItem('currentUser'));

      var _data = this.mainForm.getRawValue();
      orderData.actionUser = user;
      this.data = orderData;
      this.data.soHoaDon = this.soHoaDon;
      this.data.hoTenNguoiNhanHD = _data.hoTenNguoiNhanHD;
      this.data.emailNguoiNhanHD = _data.emailNguoiNhanHD;
      this.data.soDienThoaiNguoiNhanHD = _data.soDienThoaiNguoiNhanHD;

      let msg: any = {
        mLTDiep: MLTDiep.TDCDLHDKMDCQThue,
        // type: 1004,
        mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
        dataXML: rs.base64,
        serials: this.serials,
        isCompression: true,
        tTNKy: {
          mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
          ten: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
          diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
          sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
          tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
          tenP2: '',
        }
      };

      return msg;
      // Sending
    }
  }

  async ThucHienPhatHanh() {
    this.loading = true;
    let hoaDonDienTuIds = [this.data.hoaDonDienTuId];
    await this.soSanhThongTinNguoiNopThueVoiMauHoaDon(hoaDonDienTuIds,
      async () => // Truyền vào code callBack
      {

        //kiểm tra với hóa đơn thay thế
        if (this.data.thayTheChoHoaDonId != null && this.data.thayTheChoHoaDonId != '') {
          let ngayHienTai: any = await this.hoaDonDienTuService.GetNgayHienTai();

          let ngayHoaDon = this.data.ngayHoaDon;
          if (ngayHoaDon != null && ngayHoaDon != '') {
            //kiểm tra xem ngày hóa đơn theo kỳ kế toán có hợp lệ
            if (kiemTraHoaDonHopLeTheoKyKeKhai(this.modalService, ngayHoaDon, 'phatHanhHoaDon', ngayHienTai.result, this.data.boKyHieuHoaDon.kyHieu) == false) {
              this.loading = false;
              return;
            }
          }
        }

        //trường hợp này ít xảy ra: nhưng kiểm tra với dữ liệu cũ
        //kiểm tra xem hóa đơn thay thế đã được cấp mã hay chưa
        //đây là trường hợp: dữ liệu cũ; mà ở đó hóa đơn bị thay thế nhiều lần, trong đó có hóa đơn thay thế đã được cấp mã thì
        //hóa đơn thay thế phát hành sẽ ko được phát hành nữa
        var thongBaoKiemTraHoaDonThayThe: any = await this.hoaDonDienTuService.KiemTraHoaDonThayTheDaDuocCapMa(this.data.hoaDonDienTuId);
        if (thongBaoKiemTraHoaDonThayThe.result != null) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '500px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: thongBaoKiemTraHoaDonThayThe.result,
            },
            nzFooter: null
          });

          this.loading = false;
          return;
        }
        if (this.isGuiCQT) {
          let hoaDons = [this.data];
          this.tabHoaDonDienTuComp.hoSoHDDT = this.hoSoHDDT;
          this.tabHoaDonDienTuComp.serials = this.serials;
          this.tabHoaDonDienTuComp.guiHoaDonFromPos(hoaDons, this.modal, () => this.loading = false);
        }
        else {
          if (this.data.boKyHieuHoaDon.hinhThucHoaDon != HinhThucHoaDon.CoMaTuMayTinhTien) {
            // không mã
            if (this.data.boKyHieuHoaDon.hinhThucHoaDon === 0 && this.hoaDonBiThayTheOrDieuChinh && this.hoaDonBiThayTheOrDieuChinh.boKyHieuHoaDon.hinhThucHoaDon === 0) {
              let trangThaiHoaDon = this.data.trangThai === 3 ? 'thay thế' : 'điều chỉnh';

              // Nếu hóa đơn Thay thế hoặc hóa đơn Điều chỉnh có phương thức chuyển dữ liệu là TỪNG HÓA ĐƠN thì
              // Nếu hóa đơn bị thay thế và hóa đơn bị điều chỉnh có phương thức chuyển dữ liệu là Từng hóa đơn thì xét trạng thái quy trình của hóa đơn đó, nếu không phải là Hóa đơn hợp lệ thì thông báo tới NSD
              if (this.data.boKyHieuHoaDon.phuongThucChuyenDL === 0 && this.hoaDonBiThayTheOrDieuChinh.boKyHieuHoaDon.phuongThucChuyenDL === 0 && this.hoaDonBiThayTheOrDieuChinh.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) {
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
                    msContent: `Hóa đơn ${trangThaiHoaDon} được thiết lập gửi dữ liệu hóa đơn không có mã đến cơ quan thuế qua phương thức <b>Chuyển đầy đủ nội dung từng hóa đơn</b>.
                    Trạng thái quy trình của hóa đơn bị ${trangThaiHoaDon} là <b>${TrangThaiQuyTrinhLabel.get(this.hoaDonBiThayTheOrDieuChinh.trangThaiQuyTrinh)}</b>.
                    Hệ thống chỉ cho phép phát hành hóa đơn ${trangThaiHoaDon} khi trạng thái quy trình của hóa đơn bị ${trangThaiHoaDon} là <b>Hóa đơn hợp lệ</b>. Vui lòng kiểm tra lại!`,
                    msOnClose: () => {
                      this.loading = false;
                    }
                  },
                  nzFooter: null
                });
                return;
              }

              // Nếu hóa đơn Thay thế hoặc hóa đơn Điều chỉnh có phương thức chuyển dữ liệu là TỪNG HÓA ĐƠN thì
              // Nếu hóa đơn bị thay thế và hóa đơn bị điều chỉnh có phương thức chuyển dữ liệu là Bảng tổng hợp thì không cho phép phát hành
              if (this.data.boKyHieuHoaDon.phuongThucChuyenDL === 0 && this.hoaDonBiThayTheOrDieuChinh.boKyHieuHoaDon.phuongThucChuyenDL === 1) {
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
                    msContent: `Hệ thống không cho phép lập hóa đơn có phương thức chuyển dữ liệu hóa đơn điện tử là <b>Chuyển đầy đủ nội dung từng hóa đơn</b>
                    để ${trangThaiHoaDon} hóa đơn có phương thức chuyển dữ liệu là <b>Chuyển theo bảng tổng hợp hóa đơn điện tử</b>. Vui lòng kiểm tra lại!`,
                    msOnClose: () => {
                      this.loading = false;
                    }
                  },
                  nzFooter: null
                });
                return;
              }

              // Nếu hóa đơn Thay thế hoặc hóa đơn Điều chỉnh có phương thức chuyển dữ liệu là BẢNG TỔNG HỢP thì
              // Nếu hóa đơn bị thay thế và hóa đơn bị điều chỉnh có phương thức chuyển dữ liệu là Từng hóa đơn thì không cho phép phát hành
              if (this.data.boKyHieuHoaDon.phuongThucChuyenDL === 1 && this.hoaDonBiThayTheOrDieuChinh.boKyHieuHoaDon.phuongThucChuyenDL === 0) {
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
                    msContent: `Hệ thống không cho phép lập hóa đơn có phương thức chuyển dữ liệu hóa đơn điện tử là <b>Chuyển theo bảng tổng hợp hóa đơn điện tử</b>
                    để ${trangThaiHoaDon} hóa đơn có phương thức chuyển dữ liệu là <b>Chuyển đầy đủ nội dung từng hóa đơn</b>. Vui lòng kiểm tra lại!`,
                    msOnClose: () => {
                      this.loading = false;
                    }
                  },
                  nzFooter: null
                });
                return;
              }

              // Nếu hóa đơn Thay thế hoặc hóa đơn Điều chỉnh có phương thức chuyển dữ liệu là BẢNG TỔNG HỢP thì
              // Nếu hóa đơn bị thay thế và hóa đơn bị điều chỉnh có phương thức chuyển dữ liệu là Bảng tổng hợp thì xét trạng thái chuyển dữ liệu tại cột Phương thức chuyển dữ liệu, không phải là Chưa lập, Chưa gửi, Bảng tổng hợp hợp lệ thì thông báo
              if (this.data.boKyHieuHoaDon.phuongThucChuyenDL === 1 && this.hoaDonBiThayTheOrDieuChinh.boKyHieuHoaDon.phuongThucChuyenDL === 1) {
                if (this.hoaDonBiThayTheOrDieuChinh.noiDungGuiBangTongHop && this.hoaDonBiThayTheOrDieuChinh.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) {
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
                      msContent: `Hóa đơn ${trangThaiHoaDon} được thiết lập gửi dữ liệu hóa đơn không có mã đến cơ quan thuế qua phương thức <b>Chuyển theo bảng tổng hợp hóa đơn điện</b>
                      tử. Trạng thái chuyển dữ liệu của hóa đơn bị ${trangThaiHoaDon} là <b>${TrangThaiQuyTrinhLabel.get(this.hoaDonBiThayTheOrDieuChinh.trangThaiQuyTrinh)}</b>.
                      Hệ thống chỉ cho phép phát hành hóa đơn ${trangThaiHoaDon} khi trạng thái quy trình của hóa đơn bị ${trangThaiHoaDon} là <b>Chưa lập</b>, <b>Chưa gửi</b>, <b>Bảng tổng hợp hợp lệ</b>.
                      Vui lòng kiểm tra lại!`,
                      msOnClose: () => {
                        this.loading = false;
                      }
                    },
                    nzFooter: null
                  });
                  return;
                }
              }
            }

            this.hoaDonDienTuService.CheckHoaDonPhatHanh(this.paramPhatHanh)
              .subscribe((res: any) => {
                if (res) {
                  if (res.isYesNo) {
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
                        msOkButtonInBlueColor: false,
                        msTitle: res.titleMessage,
                        msContent: res.errorMessage,
                        msOnOk: () => {
                          if (res.isAcceptHetHieuLucTrongKhoang) {
                            this.paramPhatHanh.skipCheckHetHieuLucTrongKhoang = true;
                          }
                          if (res.isAcceptNgayKyLonHonNgayHoaDon) {
                            this.paramPhatHanh.skipChecNgayKyLonHonNgayHoaDon = true;
                          }
                          if (res.isCoCanhBaoChenhLechThanhTien) {
                            this.paramPhatHanh.skipCheckChenhLechThanhTien = true;
                          }
                          if (res.isCoCanhBaoChenhLechTienChietKhau) {
                            this.paramPhatHanh.skipCheckChenhLechTienChietKhau = true;
                          }
                          if (res.isCoCanhBaoChenhLechTienThueGTGT) {
                            this.paramPhatHanh.skipCheckChenhLechTienThueGTGT = true;
                          }
                          this.ThucHienPhatHanh();
                        },
                        msOnClose: () => {
                          this.loading = false;
                          // if (res.isCoCanhBaoChenhLech) {
                          //   this.modal.destroy(false);
                          //   if (!this.formModal) {
                          //     this.tabHoaDonDienTuComponent.clickSua(false, false, this.data)
                          //   }
                          // }
                        }
                      },
                      nzFooter: null
                    });
                  } else {
                    var modal = this.modalService.create({
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
                        msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
                        msOkButtonInBlueColor: false,
                        msTitle: res.titleMessage,
                        msContent: res.errorMessage,
                        msCapNhatNgayHoaDon: res.isCoHoaDonNhoHonHoaDonDangPhatHanh,
                        msListHoaDonChuaCapSo: res.hoaDons || [],
                        msOnCapNhatNgayHoaDon: () => {
                          let title = 'Cập nhật ngày hóa đơn';
                          let content = `Bạn có chắc chắn muốn cập nhật ngày hóa đơn là ngày <span class="colorChuYTrongThongBao"><b>${moment(this.data.ngayHoaDon).format("DD/MM/YYYY")}</b></span>
                          cho các hóa đơn có ký hiệu <span class="colorChuYTrongThongBao"><b>${this.data.boKyHieuHoaDon.kyHieu}</b></span> số hóa đơn <span class="colorChuYTrongThongBao"><b>Chưa cấp số</b></span>
                          đang có ngày hóa đơn nhỏ hơn ngày <span class="colorChuYTrongThongBao"><b>${moment(this.data.ngayHoaDon).format("DD/MM/YYYY")}</b></span> không?`;

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
                              msOkButtonInBlueColor: false,
                              msCapNhatNgayHoaDon: true,
                              msTitle: title,
                              msContent: content,
                              msOnOk: () => {
                                this.hoaDonDienTuService.UpdateNgayHoaDonBangNgayHoaDonPhatHanh(this.data).subscribe((res2: any) => {
                                  if (res2.status) {
                                    this.sharedService.emitChange({
                                      type: 'LoadDataAfterAddNew',
                                      status: true
                                    });
                                    this.message.success('Cập nhật ngày hóa đơn thành công!');
                                  } else {
                                    this.message.error('Cập nhật ngày hóa đơn thất bại!');
                                  }
                                  this.loading = false;
                                });
                              },
                              msOnClose: () => {
                                this.loading = false;
                              }
                            },
                            nzFooter: null
                          });
                        },
                        msOnOk: () => {
                          this.KyHoaDon();
                        },
                        msOnClose: () => {
                          this.loading = false;
                        }
                      },
                      nzFooter: null
                    });
                    modal.afterClose.subscribe((res: any) => {
                      if (res && res.isNgungChucNangVaXemChiTiet) {
                        this.modal.destroy(res);
                      }
                    });
                  }
                } else {
                  this.KyHoaDon();
                }
              });
          }
          else {
            this.hoaDonDienTuService.CheckHoaDonPhatHanh(this.paramPhatHanh).subscribe((res: any) => {
              if (res) {
                console.log(res);
                if (res.isYesNo) {
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
                      msOkButtonInBlueColor: false,
                      msTitle: res.titleMessage,
                      msContent: res.errorMessage,
                      msOnOk: () => {
                        if (res.isAcceptHetHieuLucTrongKhoang) {
                          this.paramPhatHanh.skipCheckHetHieuLucTrongKhoang = true;
                        }
                        if (res.isAcceptNgayKyLonHonNgayHoaDon) {
                          this.paramPhatHanh.skipChecNgayKyLonHonNgayHoaDon = true;
                        }

                        this.ThucHienPhatHanh();
                      },
                      msOnClose: () => {
                        this.loading = false;
                      }
                    },
                    nzFooter: null
                  });
                } else {
                  var modal = this.modalService.create({
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
                      msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
                      msOkButtonInBlueColor: false,
                      msTitle: res.titleMessage,
                      msContent: res.errorMessage,
                      msCapNhatNgayHoaDon: res.isCoHoaDonNhoHonHoaDonDangPhatHanh,
                      msListHoaDonChuaCapSo: res.hoaDons || [],
                      msOnCapNhatNgayHoaDon: () => {
                        let title = 'Cập nhật ngày hóa đơn';
                        let content = `Bạn có chắc chắn muốn cập nhật ngày hóa đơn là ngày <span class="colorChuYTrongThongBao"><b>${moment(this.data.ngayHoaDon).format("DD/MM/YYYY")}</b></span>
                        cho các hóa đơn có ký hiệu <span class="colorChuYTrongThongBao"><b>${this.data.boKyHieuHoaDon.kyHieu}</b></span> số hóa đơn <span class="colorChuYTrongThongBao"><b>Chưa cấp số</b></span>
                        đang có ngày hóa đơn nhỏ hơn ngày <span class="colorChuYTrongThongBao"><b>${moment(this.data.ngayHoaDon).format("DD/MM/YYYY")}</b></span> không?`;

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
                            msOkButtonInBlueColor: false,
                            msCapNhatNgayHoaDon: true,
                            msTitle: title,
                            msContent: content,
                            msOnOk: () => {
                              this.hoaDonDienTuService.UpdateNgayHoaDonBangNgayHoaDonPhatHanh(this.data).subscribe((res2: any) => {
                                if (res2.status) {
                                  this.sharedService.emitChange({
                                    type: 'LoadDataAfterAddNew',
                                    status: true
                                  });
                                  this.message.success('Cập nhật ngày hóa đơn thành công!');
                                } else {
                                  this.message.error('Cập nhật ngày hóa đơn thất bại!');
                                }
                                this.loading = false;
                              });
                            },
                            msOnClose: () => {
                              this.loading = false;
                            }
                          },
                          nzFooter: null
                        });
                      },
                      msOnOk: () => {
                        this.PhatHanhMTT();
                      },
                      msOnClose: () => {
                        this.loading = false;
                      }
                    },
                    nzFooter: null
                  });
                  modal.afterClose.subscribe((res: any) => {
                    if (res && res.isNgungChucNangVaXemChiTiet) {
                      this.modal.destroy(res);
                    }
                  });
                }
              } else {
                this.PhatHanhMTT();
              }
            });
          }

        }
      });
  }

  PhatHanhMTT() {
    this.hoaDonDienTuService.PhatHanhHoaDonCoMaTuMTT(this.data).subscribe((rs: boolean) => {
      if (rs) {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe(() => { });
        this.loading = false;
        this.modal.destroy(true);
      }
      else {
        this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.PhatHanhHoaDonThatBai,
          doiTuongThaoTac: 'empty',
          refType: RefType.HoaDonDienTu,
          thamChieu: `Hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
          moTaChiTiet: `Nội dung lỗi: Lỗi hệ thống. Vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp!`,
          refId: this.data.hoaDonDienTuId
        }).subscribe();

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
            msContent: `Phát hành hóa đơn không thành công.
            <br>Nội dung lỗi: Lỗi hệ thống.
            <br>Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });

        this.loading = false;
      }
    })
  }

  KyHoaDon() {
    console.log(this.isSelectChuKiCung);
    if (this.isSelectChuKiCung == 'KiCung') {
      if (this.webSubcription) {
        this.webSubcription.unsubscribe();
      }
      this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
        console.log('createObservableSocket', rs);
        if (rs && rs != ''){
          let obj = JSON.parse(rs);
          if(obj.XMLSigned != null && obj.XMLSigned != '')
            this.processPhatHanh(obj);

        }
      }, err => {
        this.loading = false;
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
              this.loading = false;
              return;
            },
            msTitle: 'Kiểm tra lại',
            msContent: `Để phát hành hóa đơn, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
          },
          nzFooter: null
        });
      });

      this.loading = true;
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((result: any) => {
          if (result) {
            if (!this.isPhatHanhLai &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.DangKyDienTu &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh) {
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
                  msContent: `Hệ thống chỉ thực hiện phát hành các hóa đơn <b>${result.boKyHieuHoaDon.hinhThucHoaDon === 1 || result.boKyHieuHoaDon.hinhThucHoaDon == 2 ? 'Có' : 'Không'} mã của cơ quan thuế</b>
                  có trạng thái quy trình là <b>Chưa phát hành</b>, <b>Chưa ký điện tử</b> hoặc <b>Ký điện tử bị lỗi</b> hoặc <b>Gửi TCTN lỗi</b>. Vui lòng kiểm tra lại!`,
                  msOnClose: () => {
                  },
                }
              });
              this.loading = false;
              return;
            }

            var isConnected = this.sendMessageToServer(result);
          if (isConnected == false) {
            this.loading = false;
            return;
          };
          }
        }
      );
    }
    else {
      this.loading = true;
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe(
        async (result: any) => {
          if (result) {
            if (!this.isPhatHanhLai &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.DangKyDienTu &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi &&
              result.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh) {
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
                  msContent: `Hệ thống chỉ thực hiện phát hành các hóa đơn <b>${result.boKyHieuHoaDon.hinhThucHoaDon === 1 || result.boKyHieuHoaDon.hinhThucHoaDon == 2 ? 'Có' : 'Không'} mã của cơ quan thuế</b>
                có trạng thái quy trình là <b>Chưa phát hành</b>, <b>Chưa ký điện tử</b> hoặc <b>Ký điện tử bị lỗi</b> hoặc <b>Gửi TCTN lỗi</b>. Vui lòng kiểm tra lại!`,
                  msOnClose: () => {
                  },
                }
              });
              this.loading = false;
              return;
            }

            let msg = await this.createXMLToSign(result);
            console.log('createXMLToSign',msg);

            this.webSocket.createObservableSocket('', msg).subscribe(async (rs: any) => {
              this.processPhatHanh(rs);
            }, err => {
              this.loading = false;
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
                  msTitle: 'Phát hành hóa đơn',
                  msContent: `Đã có lỗi trong quá trình phát hành. Vui lòng thử lại.`,
                },
                nzFooter: null
              });
            });
          }
        });
    }
  }

  processPhatHanh(obj: any) {
    if (obj) {
      obj.hoaDonDienTuId = this.data.hoaDonDienTuId;
      obj.tuDongGuiMail = this.guiHoaDonChoKhachHang;
      obj.hoaDon = this.data;
      obj.dataXML = obj.XMLSigned;
      obj.dataPDF = this.data.dataPDF;

      console.log('obj: ', obj);

      if (obj.TypeOfError === 0) {
        // check trường hợp liên tục vào socket thì check nếu ko đúng trạng thái quy trình thì block
        this.hoaDonDienTuService.GetTrangThaiQuyTrinhById(this.data.hoaDonDienTuId).subscribe((trangThaiQuyTrinh:any)=>{
          if (!this.isPhatHanhLai &&
            trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu &&
            trangThaiQuyTrinh !== TrangThaiQuyTrinh.DangKyDienTu &&
            trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
            trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi &&
            trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh) {
            console.log('block: ', trangThaiQuyTrinh);
            this.loading = false;
            return;
          }else{
            this.hoaDonDienTuService.GateForWebSocket(obj).subscribe((res) => {
              console.log('res: ', res);

              if (res != null) {
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.PhatHanhHoaDonThanhCong,
                  doiTuongThaoTac: 'empty',
                  refType: RefType.HoaDonDienTu,
                  thamChieu: `Hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
                  moTaChiTiet: `Phát hành hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
                  refId: this.data.hoaDonDienTuId
                }).subscribe();

                const param = {
                  ...this.thongDiepChung,
                  duLieuGuiHDDT: {
                    hoaDonDienTuId: this.data.hoaDonDienTuId,
                    hoaDonDienTu: this.data
                  }
                };

                if (this.thongDiepChung.maLoaiThongDiep === 200) { // gửi auto cqt nếu là 200
                  this.thongDiepGuiDuLieuHDDTService.Insert(param) // insert thongDiep
                    .subscribe((res1: any) => {
                      this.thongDiepGuiDuLieuHDDTService.GuiThongDiepDuLieuHDDT(res1.thongDiepChungId) // gửi thongDiep tới CQT
                        .subscribe((res2: any) => {
                          console.log('res2:', res2);
                          if (res2 === TrangThaiQuyTrinh.GuiKhongLoi || res2 === TrangThaiQuyTrinh.GuiTCTNLoi) {
                            this.hoaDonDienTuService.WaitForTCTResonse(obj).subscribe((res3) => {
                              if (res3) {
                                this.loading = false;
                                this.modal.destroy(true);
                              } else {
                                this.loading = false;

                                this.hoaDonDienTuService.GetTrangThaiQuyTrinhById(this.data.hoaDonDienTuId)
                                  .subscribe((res4: any) => {
                                    if (res4 === TrangThaiQuyTrinh.GuiTCTNLoi) {
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
                                          msTitle: `Không gửi được hóa đơn điện tử đến CQT`,
                                          msContent: `Không gửi được <strong>Hóa đơn điện tử</strong> đến <strong>TCTN</strong> (Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử). Vui lòng thực hiện lại thao tác <strong class="colorRedTrongThongBao">Phát hành</strong>!`,
                                          msOnClose: () => {
                                            this.modal.destroy();
                                          },
                                        }
                                      });
                                      this.sharedService.emitChange({
                                        type: 'LoadDataAfterAddNew',
                                        status: true
                                      });
                                    } else {
                                      this.modal.destroy(true);
                                    }
                                  });
                              }
                            });
                          } else {
                            this.loading = false;
                            this.modal.destroy(true);
                          }
                        });
                    });
                } else {
                  this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe(() => { });
                  this.loading = false;
                  this.modal.destroy(true);
                }
              } else {
                this.loading = false;
                this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.KyDienTuLoi)
                  .subscribe(() => {
                    this.sharedService.emitChange({
                      type: 'LoadDataAfterAddNew',
                      status: true
                    });

                    this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

                    this.nhatKyTruyCapService.Insert({
                      loaiHanhDong: LoaiHanhDong.PhatHanhHoaDonThatBai,
                      doiTuongThaoTac: 'empty',
                      refType: RefType.HoaDonDienTu,
                      thamChieu: `Hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
                      moTaChiTiet: `Nội dung lỗi: Lỗi hệ thống. Vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp!`,
                      refId: this.data.hoaDonDienTuId
                    }).subscribe();

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
                        msContent: `Phát hành hóa đơn không thành công.
                        <br>Nội dung lỗi: Lỗi hệ thống.
                        <br>Vui lòng kiểm tra lại!`,
                      },
                      nzFooter: null
                    });
                  });
              }
            }, err => {
              console.log(err);
              this.loading = false;
              this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.KyDienTuLoi)
                .subscribe(() => {
                  this.sharedService.emitChange({
                    type: 'LoadDataAfterAddNew',
                    status: true
                  });

                  this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, 'Lỗi hệ thống').subscribe();

                  this.nhatKyTruyCapService.Insert({
                    loaiHanhDong: LoaiHanhDong.PhatHanhHoaDonThatBai,
                    doiTuongThaoTac: 'empty',
                    refType: RefType.HoaDonDienTu,
                    thamChieu: `Hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
                    moTaChiTiet: `Nội dung lỗi: Lỗi hệ thống. Vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp!`,
                    refId: this.data.hoaDonDienTuId
                  }).subscribe();

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
                      msContent: `Phát hành hóa đơn không thành công.
                      <br>Nội dung lỗi: Lỗi hệ thống.
                      <br>Vui lòng kiểm tra lại!`,
                    },
                    nzFooter: null
                  });
                });
            });
          }
        });
      } else {
        this.loading = false;
        this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(this.data.hoaDonDienTuId, TrangThaiQuyTrinh.KyDienTuLoi)
          .subscribe(() => {
            this.sharedService.emitChange({
              type: 'LoadDataAfterAddNew',
              status: true
            });

            this.nhatKyThaoTacLoiService.Insert(this.data.hoaDonDienTuId, obj.Exception).subscribe();

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.PhatHanhHoaDonThatBai,
              doiTuongThaoTac: 'empty',
              refType: RefType.HoaDonDienTu,
              thamChieu: `Hóa đơn ${this.soHoaDon} - ${this.data.mauSo} - ${this.data.kyHieu} - ${this.data.maTraCuu}`,
              moTaChiTiet: `Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}. Vui lòng kiểm tra lại!`,
              refId: this.data.hoaDonDienTuId
            }).subscribe();

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
                msContent: `Phát hành hóa đơn không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
          });
      }
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

  destroyModal() {
    this.modal.destroy();
  }


    /*
  Hàm này được dùng để so sánh thông tin của người nộp thuế với thông tin của người bán trên mẫu hóa đơn.
  Nếu các thông tin không giống nhau thì phải đưa ra câu hỏi dạng trả lời 'yes/no' để người dùng biết và chọn.
  */
  async soSanhThongTinNguoiNopThueVoiMauHoaDon(hoaDonDienTuId: string[], callBack: any) {
    // Gọi API đọc thông tin của người nộp thuế
    let hoSoDienTuData: any = await this.hoSoHHDTService.GetDetailAsync();
    if (hoSoDienTuData) {
      // Gọi API đọc thông tin của người bán trên mẫu hóa đơn của hóa đơn điện tử
      let listThongTinNguoiBan: any = await this.signerNameReaderService.GetThongTinNguoiBanTuHoaDonAsync(hoaDonDienTuId);

      // So sánh xem có giá trị nào không trùng nhau hay không
      let comparedResult: any[] = [];

      // So sánh có giá trị nào không đúng độ dài quy định
      let checkInvalid: any[] = [];

      // Nếu trả về nhiều hơn một bộ ký hiệu thì sẽ hiển thị theo nhóm
      let isNhomBoKyHieu: boolean = (listThongTinNguoiBan.length > 1);

      // Duyệt mảng kết quả để xử lý dữ liệu trả về
      listThongTinNguoiBan.forEach((item: any) => {
        if (isNhomBoKyHieu && comparedResult.find(x => x.tenBoKyHieu == item.tenBoKyHieu) == null) {
          comparedResult.push(
            {
              'isNhomBoKyHieu': isNhomBoKyHieu,
              'tenBoKyHieu': item.tenBoKyHieu
            });

          checkInvalid.push(
            {
              'isNhomBoKyHieu': isNhomBoKyHieu,
              'tenBoKyHieu': item.tenBoKyHieu
            });
        }

        // Thêm tiêu chí tên
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên',
          'thongTinNguoiNopThue': hoSoDienTuData.tenDonVi,
          'thongTinTrenMauHoaDon': item.tenDonViNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.tenDonVi) != toTrimAndToUpperCase(item.tenDonViNguoiBan))
        });

        // Thêm tiêu chí mã số thuế
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Mã số thuế',
          'thongTinNguoiNopThue': hoSoDienTuData.maSoThue,
          'thongTinTrenMauHoaDon': item.maSoThueNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.maSoThue) != toTrimAndToUpperCase(item.maSoThueNguoiBan))
        });

        // Thêm tiêu chí địa chỉ
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ',
          'thongTinNguoiNopThue': hoSoDienTuData.diaChi,
          'thongTinTrenMauHoaDon': item.diaChiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.diaChi) != toTrimAndToUpperCase(item.diaChiNguoiBan))
        });

        // Thêm tiêu chí tên
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên',
          'thongTinTrenMauHoaDon': item.tenDonViNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.tenDonViNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.tenDonViNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí mã số thuế
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Mã số thuế',
          'thongTinTrenMauHoaDon': item.maSoThueNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.maSoThueNguoiBan).length > 14),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.maSoThueNguoiBan).length > 14 ? "Vượt quá 14 ký tự" : null
        });

        // Thêm tiêu chí địa chỉ
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ',
          'thongTinTrenMauHoaDon': item.diaChiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.diaChiNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.diaChiNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí số điện thoại
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Số điện thoại',
          'thongTinTrenMauHoaDon': item.dienThoaiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.dienThoaiNguoiBan).length > 20),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.dienThoaiNguoiBan).length > 20 ? "Vượt quá 20 ký tự" : null
        });

        // Thêm tiêu chí địa chỉ thư điện tử
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ thư điện tử',
          'thongTinTrenMauHoaDon': item.emailNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.emailNguoiBan).length > 50),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.emailNguoiBan).length > 50 ? "Vượt quá 50 ký tự" : null
        });

        // Thêm tiêu chí số tài khoản ngân hàng
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Số tài khoản ngân hàng',
          'thongTinTrenMauHoaDon': item.soTaiKhoanNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.soTaiKhoanNguoiBan).length > 30),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.soTaiKhoanNguoiBan).length > 30 ? "Vượt quá 30 ký tự" : null
        });

        // Thêm tiêu chí tên ngân hàng
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên ngân hàng',
          'thongTinTrenMauHoaDon': item.tenNganHangNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.tenNganHangNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.tenNganHangNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí fax
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Fax',
          'thongTinTrenMauHoaDon': item.faxNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.faxNguoiBan).length > 20),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.faxNguoiBan).length > 20 ? "Vượt quá 20 ký tự" : null
        });

        // Thêm tiêu chí website
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Website',
          'thongTinTrenMauHoaDon': item.websiteNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.websiteNguoiBan).length > 100),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.websiteNguoiBan).length > 100 ? "Vượt quá 100 ký tự" : null
        });
      });

      // Gọi class kiểm tra thông tin người nộp thuế, người bán, người ký hóa đơn
      let nguoiBanNguoiKyChecker = new NguoiBanNguoiKyChecker(this.webSocket, this.modalService);
      nguoiBanNguoiKyChecker.apiUrl = this.env.apiUrl;
      nguoiBanNguoiKyChecker.comparingData = comparedResult;
      nguoiBanNguoiKyChecker.checkValidHoaDon = checkInvalid;
      nguoiBanNguoiKyChecker.hasCoCanhBao = this.boolCanhBaoNguoiBanKhacNguoiKy;
      nguoiBanNguoiKyChecker.callBack = callBack;
      nguoiBanNguoiKyChecker.kiemTraNguoiNopThueTrenMauHoaDon();
    }
  }

}
