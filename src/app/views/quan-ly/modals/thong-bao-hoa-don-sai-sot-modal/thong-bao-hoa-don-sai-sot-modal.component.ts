import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { ChonHoaDonSaiSotModalComponent } from '../chon-hoa-don-sai-sot-modal/chon-hoa-don-sai-sot-modal.component';
import * as moment from 'moment';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MessageInvTT78 } from 'src/app/models/messageInv';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { EnvService } from 'src/app/env.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { forkJoin, Subscription } from 'rxjs';
import { ChonThongBaoCanRaSoatModalComponent } from '../chon-thong-bao-can-ra-soat-modal/chon-thong-bao-can-ra-soat-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { DownloadFile, getNoiDungLoiPhatHanhHoaDon, getTitleTheoLoaiHoaDon, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { PopupVideoModalComponent } from 'src/app/views/dashboard/popup-video-modal/popup-video-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-thong-bao-hoa-don-sai-sot-modal',
  templateUrl: './thong-bao-hoa-don-sai-sot-modal.component.html',
  styleUrls: ['./thong-bao-hoa-don-sai-sot-modal.component.scss']
})
export class ThongBaoHoaDonSaiSotModalComponent implements OnInit {
  @Input() isEdit: boolean = false; //isEdit = true là sửa
  @Input() isCopy: boolean = false; //isCopy = true là nhân bản
  @Input() isView: boolean = false; //isView = true là xem
  @Input() autoSign: boolean = false; //autoSign = true là sẽ tự ký
  @Input() thongDiepGuiCQTId: string = '';
  @Input() loaiThongBao: number = 1; //loại thông báo gửi CQT
  @Input() daKyVaGuiCQT = false; //đã ký và gửi cơ quan thuế chưa
  //callBackAfterClosing sẽ chạy sau khi đóng form (được dùng khi đóng form add-thong-diep-gui-modal)
  @Input() callBackAfterClosing: () => any;
  @Input() lapTuHoaDonDienTuId: string = ''; //nếu lập thông báo 04 từ hóa đơn id
  @Input() hoaDonDienTuIdLienQuan: string = ''; //đây là id của hóa đơn liên quan (như điều chỉnh, sai thông tin)
  //trường hoaDonDienTuIdLienQuan này để tìm kiếm đúng bản ghi cần lập sai sót khi có nhiều dòng sai sót
  @Input() isTraVeThongDiepChung = false; //nếu muốn trả về thông điệp chung sau khi đóng form thì isTraVeThongDiepChung = true
  @Input() thongDiepChung: any;
  mainForm: FormGroup;
  spinning = false;
  listHoaDonSaiSot: any;
  listDiaDanh: any = [];
  totalRecords = 0;
  webSubcription: Subscription;
  daLuu = false; //đã lưu dữ liệu
  daClickSua = false; //đã click sửa
  daXoa = false; //đã xóa thành công hay chưa
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  listHoaDonSaiSotDaChon: any = null;
  modalInClosing: NzModalRef;
  daSuaVaLuuDuLieu = false;
  permission: boolean = false;
  thaoTacs: any[] = [];
  getTitleLoaiHoaDon = getTitleTheoLoaiHoaDon;
  autoCapNhatNgayLap = false;
  signing = false;
  mltd: any;
  isNew = false;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private hoSoHDDTService: HoSoHDDTService,
    private webSocket: WebSocketService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private authsv: AuthService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService
  ) {
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

    console.log(this.thongDiepGuiCQTId);
    this.createForm();
    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') this.khoiTaoDichVuChuKySo();
  }

  createForm() {
    this.mainForm = this.fb.group({
      id: [null],
      kinhGui: [null],
      tenNguoiNopThue: [null],
      maSoThue: [null],
      hoaDonSaiSots: this.fb.array([]),
      diaDanh: [],
      ngayLap: [moment().format("YYYY-MM-DD")],
      daiDienNguoiNopThue: [null],
      fileDinhKem: [null],
      maThongDiep: [null],
      fileXMLDaKy: [null],
      createdDate: [null],
      fileContainerPath: [null],
      maCoQuanThue: [null],
      hinhThucTBaoHuyGiaiTrinhKhac: [null],
      loaiThongBaoHienThi: [this.loaiThongBao == 1 ? '1' : this.loaiThongBao == 2 ? '2' : '3'],
      soThongBaoSaiSot: [null],
      ngayGui: [null],
      thongDiepChungId: [null]
    });

    this.thongDiepGuiCQTService.GetDanhSachDiaDanh().subscribe((res: any) => {
      this.listDiaDanh = res;
    });

    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.mainForm.get('kinhGui').setValue(rs.tenCoQuanThueQuanLy);
      this.mainForm.get('tenNguoiNopThue').setValue(rs.tenDonVi);
      this.mainForm.get('maSoThue').setValue(rs.maSoThue);
      this.mainForm.get('daiDienNguoiNopThue').setValue(rs.hoTenNguoiDaiDienPhapLuat);
      this.mainForm.get('diaDanh').setValue(rs.maDiaDanhCQTCapCuc);
      this.mainForm.get('maCoQuanThue').setValue(rs.coQuanThueQuanLy);

      //hiển thị khi mở form để xem/sửa/nhân bản
      this.hienThiDuLieuCapNhatThongBaoSaiSot();

      //mở ra form chọn hóa đơn sai sót
      console.log(this.lapTuHoaDonDienTuId);
      if (this.lapTuHoaDonDienTuId != '') {
        this.chonHoaDonCoSaiSot();
      }
    });
  }

  createChiTietHoaDonSaiSot(data: any = null): FormGroup {
    return this.fb.group({
      id: [data == null ? null : data.id],
      thongDiepGuiCQTId: [data == null ? null : data.thongDiepGuiCQTId],
      hoaDonDienTuId: [data == null ? null : data.hoaDonDienTuId],
      maCQTCap: [data == null ? null : data.maCQTCap],
      maCQT12: [data == null ? null : data.maCQT12],
      maCQT45: [data == null ? null : data.maCQT45],
      maCQTToKhaiChapNhan: [data == null ? null : data.maCQTToKhaiChapNhan],
      maCQTChuoiKyTuSo: [data == null ? null : data.maCQTChuoiKyTuSo],
      mauHoaDon: [data == null ? null : data.mauHoaDon],
      mauSoHoaDon_LoaiHoaDon: [data == null ? null : data.mauSoHoaDon_LoaiHoaDon],
      mauSoHoaDon_SoLienHoaDon: [data == null ? null : data.mauSoHoaDon_SoLienHoaDon],
      mauSoHoaDon_SoThuTuMau: [data == null ? null : data.mauSoHoaDon_SoThuTuMau],
      kyHieuHoaDon: [data == null ? false : data.kyHieuHoaDon],
      kyHieu1: [data == null ? null : data.kyHieu1],
      kyHieu23: [data == null ? null : data.kyHieu23],
      kyHieu4: [data == null ? null : data.kyHieu4],
      kyHieu56: [data == null ? null : data.kyHieu56],
      kyHieuHoaDon_2KyTuDau: [data == null ? null : data.kyHieuHoaDon_2KyTuDau],
      kyHieuHoaDon_2KyTuDau_DatIn: [data == null ? null : data.kyHieuHoaDon_2KyTuDau_DatIn],
      kyHieuHoaDon_2SoCuoiNamThongBao: [data == null ? null : data.kyHieuHoaDon_2SoCuoiNamThongBao],
      kyHieuHoaDon_HinhThucHoaDon: [data == null ? null : data.kyHieuHoaDon_HinhThucHoaDon],
      mauVaKyHieuHoaDon: [data == null ? null : this.displayMauVaKyHieuHoaDon(data.loaiApDungHoaDon, data.mauHoaDon, data.kyHieuHoaDon)],
      soHoaDon: [data == null ? null : data.soHoaDon],
      ngayLapHoaDon: [data == null ? null : (data.ngayLapHoaDon != null ? moment(data.ngayLapHoaDon).format('YYYY-MM-DD') : null)],
      ngayLapHoaDonText: [data == null ? null : (data.ngayLapHoaDon != null ? moment(data.ngayLapHoaDon).format('DD/MM/YYYY') : null)],
      loaiApDungHoaDon: [data == null ? null : data.loaiApDungHoaDon],
      hinhThucHoaDon: [data == null ? null : data.hinhThucHoaDon],
      phanLoaiHDSaiSot: [data == null ? null : data.phanLoaiHDSaiSot],
      phanLoaiHDSaiSotText: [data == null ? null : this.hienThiPhanLoaiHoaDonSaiSot(data.phanLoaiHDSaiSot)],
      lyDo: [data == null ? null : data.lyDo],
      createdDate: [data == null ? null : data.createdDate],
      createdBy: [data == null ? null : data.createdBy],
      modifyDate: [data == null ? null : data.modifyDate],
      modifyBy: [data == null ? null : data.modifyBy],
      thongBaoChiTietHDRaSoatId: [data == null ? null : data.thongBaoChiTietHDRaSoatId],
      chungTuLienQuan: [data == null ? null : data.chungTuLienQuan],
      trangThaiHoaDon: [data == null ? null : data.trangThaiHoaDon],
      dienGiaiTrangThai: [data == null ? null : data.dienGiaiTrangThai],
      phanLoaiHDSaiSotMacDinh: [data == null ? null : data.phanLoaiHDSaiSotMacDinh],
      loaiHoaDon: [data == null ? null : data.loaiHoaDon]
    });
  }

  //hàm này để hiển thị dữ liệu được xem/sửa/nhân bản
  hienThiDuLieuCapNhatThongBaoSaiSot() {
    setTimeout(() => {
      if (this.thongDiepGuiCQTId != null && this.thongDiepGuiCQTId != '') {
        let param = { thongDiepGuiCQTId: this.thongDiepGuiCQTId, isTraVeThongDiepChung: this.isTraVeThongDiepChung };

        this.thongDiepGuiCQTService.GetThongDiepGuiCQTById(param).subscribe((res: any) => {
          if (!this.isCopy) {
            console.log(res);
            this.mainForm.get('id').setValue(res.id);
            this.mainForm.get('soThongBaoSaiSot').setValue(res.soThongBaoSaiSot);
            this.mainForm.get('ngayGui').setValue(res.ngayGui);
            this.mainForm.get('fileXMLDaKy').setValue(res.fileXMLDaKy);
            this.mainForm.get('fileDinhKem').setValue(res.fileDinhKem);
            this.mainForm.get('fileContainerPath').setValue(res.fileContainerPath);
            this.mainForm.get('maThongDiep').setValue(res.maThongDiep);
            this.mainForm.get('createdDate').setValue(res.createdDate);
            this.mainForm.get('thongDiepChungId').setValue(res.thongDiepChungId);
            this.isNew = res.isNew;
          }

          this.loaiThongBao = res.loaiThongBao;
          this.mainForm.get('kinhGui').setValue(res.tenCoQuanThue);
          this.mainForm.get('tenNguoiNopThue').setValue(res.nguoiNopThue);
          this.mainForm.get('diaDanh').setValue(res.maDiaDanh);
          this.mainForm.get('ngayLap').setValue(moment(res.ngayLap).format('YYYY-MM-DD'));
          this.mainForm.get('daiDienNguoiNopThue').setValue(res.daiDienNguoiNopThue);
          this.mainForm.get('maCoQuanThue').setValue(res.maCoQuanThue);
          this.mainForm.get('hinhThucTBaoHuyGiaiTrinhKhac').setValue(res.hinhThucTBaoHuyGiaiTrinhKhac);

          //loaiThongBaoHienThi để hiển thị lên giao diện cho các nút radio button
          let loaiThongBaoHienThi = (this.loaiThongBao == 1 || this.loaiThongBao == 3) ? '1' : '2';
          this.mainForm.get('loaiThongBaoHienThi').setValue(loaiThongBaoHienThi);

          //cài đặt chi tiết
          const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
          hoaDonSaiSotFormArray.clear();

          if (this.loaiThongBao == 1) {
            this.listHoaDonSaiSotDaChon = res.thongDiepChiTietGuiCQTs;
          }
          else if (this.loaiThongBao == 3) { //trường hợp gửi khác
            this.listHoaDonSaiSotDaChon = res.thongDiepChiTietGuiCQTs;
            this.listHoaDonSaiSotDaChon.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
            this.listHoaDonSaiSotDaChon.hinhThucTBaoHuyGiaiTrinhKhac = res.hinhThucTBaoHuyGiaiTrinhKhac;
          }
          else { //rà soát
            this.listHoaDonSaiSotDaChon = {
              id: res.thongBaoHoaDonRaSoatId,
              detail: res.thongDiepChiTietGuiCQTs
            };
          }

          res.thongDiepChiTietGuiCQTs.forEach(item => {
            item.tichChon = true;
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          });
          this.totalRecords = res.length;
          this.mltd = this.thongDiepChung.maLoaiThongDiep;
          //nếu tự động ký
          if (this.autoSign) {
            this.sendMessageToServer();
          }
        });
      }
    });
  }

  //hàm này để hiển thị mẫu và ký hiệu hóa đơn vào cùng một cột theo phân loại loaiApDungHoaDon
  displayMauVaKyHieuHoaDon(loaiApDungHoaDon: number, mauHoaDon: string, kyHieuHoaDon: string) {
    if (loaiApDungHoaDon === 1) {
      return mauHoaDon + kyHieuHoaDon;
    }
    else {
      if (mauHoaDon !== '' && kyHieuHoaDon !== '') {
        return mauHoaDon + '-' + kyHieuHoaDon;
      }
      else if (mauHoaDon === '' && kyHieuHoaDon !== '') {
        return kyHieuHoaDon;
      }
      else if (mauHoaDon !== '' && kyHieuHoaDon === '') {
        return mauHoaDon;
      }
    }
  }

  //hàm này đọc ra danh sách địa danh
  getDanhSachDiaDanh() {
    this.thongDiepGuiCQTService.GetDanhSachDiaDanh().subscribe((res: any) => {
      this.listDiaDanh = res;
    });
  }

  changeLoaiThongBao(event: any) {
    const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    if (this.mainForm.dirty || hoaDonSaiSotFormArray.length > 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msOKText: "Đồng ý",
          msCancelText: "Không",
          msOnOk: () => {
            this.mainForm.get('loaiThongBaoHienThi').setValue(event);
            this.loaiThongBao = event;
            this.mainForm.reset();
            hoaDonSaiSotFormArray.clear();
          },
          msOnClose: () => {
            this.mainForm.get('loaiThongBaoHienThi').setValue(this.loaiThongBao);
          }
        },
        nzFooter: null
      });
    }
  }

  //hàm này hiển thị phân loại hóa đơn sai sót
  hienThiPhanLoaiHoaDonSaiSot(giaTri) {
    let ketQua = '';
    switch (giaTri) {
      case 1:
        ketQua = 'Hủy';
        break;
      case 2:
        ketQua = 'Điều chỉnh';
        break;
      case 3:
        ketQua = 'Thay thế';
        break;
      case 4:
        ketQua = 'Giải trình';
        break;
      default:
        ketQua = '';
        break;
    }

    return ketQua;
  }

  //hàm này để mở giao diện chọn hóa đơn sai sót
  chonHoaDonCoSaiSot() {
    let ngayLap = this.mainForm.get('ngayLap').value;
    if (ngayLap == null || ngayLap == '') ngayLap = moment().format('YYYY-MM-DD');

    if (this.loaiThongBao == 1) {
      const modal1 = this.modalService.create({
        nzTitle: 'Chọn hóa đơn điện tử có sai sót',
        nzContent: ChonHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '98%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          lapTuHoaDonDienTuId: this.lapTuHoaDonDienTuId,
          hoaDonDienTuIdLienQuan: this.hoaDonDienTuIdLienQuan,
          data: this.listHoaDonSaiSotDaChon,
          ngayLapThongBao: ngayLap,
          isXemChiTiet: this.isView || this.daKyVaGuiCQT
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if (rs) {
          if (rs.daChonLaiHoaDonKhac != undefined && rs.daChonLaiHoaDonKhac != null) {
            this.lapTuHoaDonDienTuId = '';
          }

          const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
          hoaDonSaiSotFormArray.clear();

          //đánh dấu form là có sửa
          this.mainForm.markAsDirty();

          //gán lại danh sách hóa đơn đã chọn để sử dụng lại khi cần
          this.listHoaDonSaiSotDaChon = rs;

          rs.forEach(item => {
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          });

          this.totalRecords = rs.length;
        }
      });
    }
    else if (this.loaiThongBao == 3) {
      const modal1 = this.modalService.create({
        nzTitle: 'Nhập thông tin hóa đơn khác có sai sót',
        nzContent: ChonHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '98%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          lapTuHoaDonDienTuId: this.lapTuHoaDonDienTuId,
          hoaDonDienTuIdLienQuan: this.hoaDonDienTuIdLienQuan,
          data: this.listHoaDonSaiSotDaChon,
          ngayLapThongBao: ngayLap,
          isTBaoHuyGiaiTrinhKhacCuaNNT: true,
          isXemChiTiet: this.isView || this.daKyVaGuiCQT
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if (rs) {
          if (rs.daChonLaiHoaDonKhac != undefined && rs.daChonLaiHoaDonKhac != null) {
            this.lapTuHoaDonDienTuId = '';
          }

          const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
          hoaDonSaiSotFormArray.clear();

          //đánh dấu form là có sửa
          this.mainForm.get('hinhThucTBaoHuyGiaiTrinhKhac').setValue(rs.hinhThucTBaoHuyGiaiTrinhKhac);
          this.mainForm.markAsDirty();

          //gán lại danh sách hóa đơn đã chọn để sử dụng lại khi cần
          this.listHoaDonSaiSotDaChon = rs;

          rs.forEach(item => {
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          });

          this.totalRecords = rs.length;
        }
      });
    }
    else {
      const modal1 = this.modalService.create({
        nzTitle: 'Chọn thông báo cần rà soát để giải trình',
        nzContent: ChonThongBaoCanRaSoatModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '98%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          ngayLapThongBao: ngayLap,
          data: this.listHoaDonSaiSotDaChon
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if (rs) {
          const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
          hoaDonSaiSotFormArray.clear();

          //đánh dấu form là có sửa
          this.mainForm.markAsDirty();

          //gán lại danh sách hóa đơn đã chọn để sử dụng lại khi cần
          this.listHoaDonSaiSotDaChon = rs;

          rs.detail.forEach(item => {
            let banGhi = {
              id: item.id,
              thongDiepGuiCQTId: null,
              hoaDonDienTuId: null,
              maCQTCap: item.maCQTCap,
              mauHoaDon: item.mauHoaDon,
              kyHieuHoaDon: item.kyHieuHoaDon,
              soHoaDon: item.soHoaDon,
              ngayLapHoaDon: moment(item.ngayLapHoaDon).format('YYYY-MM-DD'),
              loaiApDungHoaDon: item.loaiApDungHD,
              phanLoaiHDSaiSot: item.phanLoaiHDSaiSot,
              lyDo: item.lyDo == null ? item.lyDoRaSoat : item.lyDo,
              createdDate: null,
              createdBy: null,
              modifyDate: null,
              modifyBy: null,
              thongBaoChiTietHDRaSoatId: item.id
            };
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(banGhi));
          });

          this.totalRecords = rs.detail.length;
        }
      });
    }
  }

  //hàm này để hiển thị thông báo khi bấm nút hủy
  closeModal() {
    if (this.mainForm.dirty) {
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
            this.submitForm(true);
          },
          msOnClose: () => {
            //nếu có yêu cầu trả về thông điệp chung id
            if (this.isTraVeThongDiepChung) {
              let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
              this.modal.destroy(thongDiepChungId);
              return;
            }

            this.modal.destroy(this.daSuaVaLuuDuLieu);

            //nếu đóng thì sẽ gọi code của callBackAfterClosing
            if (this.callBackAfterClosing != null && this.daSuaVaLuuDuLieu) {
              this.callBackAfterClosing();
            }
          }
        },
        nzFooter: null
      });
    }
    else {
      //nếu có yêu cầu trả về thông điệp chung id
      if (this.isTraVeThongDiepChung) {
        let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
        this.modal.destroy(thongDiepChungId);
        return;
      }

      this.modal.destroy(this.daSuaVaLuuDuLieu);

      //nếu đóng thì sẽ gọi code của callBackAfterClosing
      //code của callBackAfterClosing thường là hàm tải lại dữ liệu
      //vì form này được mở thông qua form add-thong-diep-gui-modal nên dùng kiểu này để gọi sự kiện
      if (this.callBackAfterClosing != null && this.daSuaVaLuuDuLieu) {
        this.callBackAfterClosing();
      }
    }
  }

  async submitForm(confirmOkOnClosing: boolean = false) {
    this.spinning = true;
    let formData = this.mainForm.getRawValue();
    let data: any = {};
    data.id = formData.id;
    data.ngayLap = formData.ngayLap;
    if (data.ngayLap == null || data.ngayLap == '') {
      let ngayHienTaiTrenServer: any = await this.hoaDonDienTuService.GetNgayHienTai();
      data.ngayLap = moment(ngayHienTaiTrenServer.result).format("YYYY-MM-DD");
    }
    else {
      let isNgayLapHopLe = await this.kiemTraNgayLapHopLe();
      if (!isNgayLapHopLe) {
        this.spinning = false;
        return;
      }
    }

    if (formData.hoaDonSaiSots.length == 0) {
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
          msContent: 'Bạn chưa chọn hóa đơn điện tử có sai sót. Vui lòng kiểm tra lại!',
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }
    else {
      //kiểm tra ngày lập hóa đơn hợp lệ
      let checks = formData.hoaDonSaiSots.filter(x => moment(x.ngayLapHoaDon) > moment(data.ngayLap));
      if (checks.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '470px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: '&lt;Ngày lập hóa đơn&gt; không được lớn hơn ngày lập thông báo <' + moment(data.ngayLap).format('DD/MM/YYYY') + '><br>Vui lòng kiểm tra lại!'
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
    }

    let diaDanh = this.listDiaDanh.find(x => x.code == formData.diaDanh);
    if (diaDanh != null) {
      data.diaDanh = diaDanh.name;
      data.maDiaDanh = formData.diaDanh;
    }
    if (this.loaiThongBao == 2) //nếu chọn gửi theo mẫu của CQT
    {
      if (this.listHoaDonSaiSotDaChon != null) {
        data.thongBaoHoaDonRaSoatId = this.listHoaDonSaiSotDaChon.id;
        data.soTBCCQT = this.listHoaDonSaiSotDaChon.soThongBaoCuaCQT;
        data.nTBCCQT = this.listHoaDonSaiSotDaChon.ngayThongBao;
      }
    }
    data.nguoiNopThue = formData.tenNguoiNopThue;
    data.daiDienNguoiNopThue = formData.daiDienNguoiNopThue;
    data.maSoThue = formData.maSoThue;
    data.maThongDiep = formData.maThongDiep;
    data.tenCoQuanThue = formData.kinhGui;
    data.maCoQuanThue = formData.maCoQuanThue;
    data.loaiThongBao = this.loaiThongBao;
    data.createdDate = formData.createdDate;
    data.isNew = true;
    if (this.loaiThongBao == 3) {
      data.hinhThucTBaoHuyGiaiTrinhKhac = formData.hinhThucTBaoHuyGiaiTrinhKhac;
      data.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
    }
    data.thongDiepChiTietGuiCQTs = formData.hoaDonSaiSots;
    console.log(formData.hoaDonSaiSots[0].hinhThucHoaDon);
    this.mltd = this.loaiThongBao == 3 ? (formData.hoaDonSaiSots[0].hinhThucHoaDon == '2' ? MLTDiep.TDTBHDDTKTTMTTCSSot : MLTDiep.TDTBHDDLSSot) : (formData.hoaDonSaiSots[0].hinhThucHoaDon == '2' ? MLTDiep.TDTBHDDTKTTMTTCSSot : MLTDiep.TDTBHDDLSSot);
    console.log(this.mltd);
    if (this.mltd == MLTDiep.TDTBHDDLSSot) {
      this.thongDiepGuiCQTService.InsertThongBaoGuiHoaDonSaiSot(data).subscribe((res: any) => {
        if (res) {
          this.mainForm.get('id').setValue(res.ketQuaLuuThongDiep.id);
          this.mainForm.get('fileDinhKem').setValue(res.ketQuaLuuThongDiep.fileNames);
          this.mainForm.get('fileContainerPath').setValue(res.ketQuaLuuThongDiep.fileContainerPath);
          this.mainForm.get('maThongDiep').setValue(res.ketQuaLuuThongDiep.maThongDiep);
          this.mainForm.get('createdDate').setValue(res.ketQuaLuuThongDiep.createdDate);
          this.mainForm.get('soThongBaoSaiSot').setValue(res.ketQuaLuuThongDiep.soThongBaoSaiSot);
          this.mainForm.get('thongDiepChungId').setValue(res.ketQuaLuuThongDiep.thongDiepChungId);
          this.mainForm.get('ngayLap').setValue(data.ngayLap);
          this.thongDiepGuiCQTId = res.ketQuaLuuThongDiep.id;

          this.daLuu = true;
          this.daSuaVaLuuDuLieu = true;
          this.daXoa = false;
          this.daClickSua = false;

          //thông báo thành công
          this.message.create('success', `Lưu dữ liệu thành công`);

          //thêm nhật ký truy cập
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: this.daClickSua ? LoaiHanhDong.Sua : LoaiHanhDong.Them,
            refType: RefType.ThongBaoHoaDonSaiSot,
            thamChieu: 'Thông báo hóa đơn sai sót',
            moTaChiTiet: this.daClickSua ? 'Sửa thông báo' : 'Thêm thông báo',
            refId: res.ketQuaLuuThongDiep.id,
          }).subscribe();

          //nếu chọn đồng ý sau câu hỏi đóng form
          if (confirmOkOnClosing) {
            //nếu có yêu cầu trả về thông điệp chung id
            if (this.isTraVeThongDiepChung) {
              let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
              this.modal.destroy(thongDiepChungId);
              return;
            }

            this.modal.destroy(this.daSuaVaLuuDuLieu);
            //nếu đóng thì sẽ gọi code của callBackAfterClosing
            if (this.callBackAfterClosing != null && this.daSuaVaLuuDuLieu) {
              this.callBackAfterClosing();
            }
          }
        }
        else {
          //thông báo ko thành công
          this.message.create('error', `Có lỗi khi lưu dữ liệu`);
        }
        //đánh dấu về trạng thái ban đầu để bấm nút đóng ko bị gặp câu hỏi
        this.mainForm.markAsPristine();
        this.spinning = false;
      });
    } else if (this.mltd == MLTDiep.TDTBHDDTKTTMTTCSSot) {
      this.thongDiepGuiCQTService.InsertThongBaoGuiHoaDonSaiSot303(data).subscribe((res: any) => {
        if (res) {
          this.mainForm.get('id').setValue(res.ketQuaLuuThongDiep.id);
          this.mainForm.get('fileDinhKem').setValue(res.ketQuaLuuThongDiep.fileNames);
          this.mainForm.get('fileContainerPath').setValue(res.ketQuaLuuThongDiep.fileContainerPath);
          this.mainForm.get('maThongDiep').setValue(res.ketQuaLuuThongDiep.maThongDiep);
          this.mainForm.get('createdDate').setValue(res.ketQuaLuuThongDiep.createdDate);
          this.mainForm.get('soThongBaoSaiSot').setValue(res.ketQuaLuuThongDiep.soThongBaoSaiSot);
          this.mainForm.get('thongDiepChungId').setValue(res.ketQuaLuuThongDiep.thongDiepChungId);
          this.mainForm.get('ngayLap').setValue(data.ngayLap);
          this.thongDiepGuiCQTId = res.ketQuaLuuThongDiep.id;

          this.daLuu = true;
          this.daSuaVaLuuDuLieu = true;
          this.daXoa = false;
          this.daClickSua = false;

          //thông báo thành công
          this.message.create('success', `Lưu dữ liệu thành công`);

          //thêm nhật ký truy cập
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: this.daClickSua ? LoaiHanhDong.Sua : LoaiHanhDong.Them,
            refType: RefType.ThongBaoHoaDonSaiSot,
            thamChieu: 'Thông báo hóa đơn máy tính tiền sai sót',
            moTaChiTiet: this.daClickSua ? 'Sửa thông báo' : 'Thêm thông báo',
            refId: res.ketQuaLuuThongDiep.id,
          }).subscribe();

          //nếu chọn đồng ý sau câu hỏi đóng form
          if (confirmOkOnClosing) {
            //nếu có yêu cầu trả về thông điệp chung id
            if (this.isTraVeThongDiepChung) {
              let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
              this.modal.destroy(thongDiepChungId);
              return;
            }

            this.modal.destroy(this.daSuaVaLuuDuLieu);
            //nếu đóng thì sẽ gọi code của callBackAfterClosing
            if (this.callBackAfterClosing != null && this.daSuaVaLuuDuLieu) {
              this.callBackAfterClosing();
            }
          }

        }
        else {
          //thông báo ko thành công
          this.message.create('error', `Có lỗi khi lưu dữ liệu`);
        }
        //đánh dấu về trạng thái ban đầu để bấm nút đóng ko bị gặp câu hỏi
        this.mainForm.markAsPristine();
        this.spinning = false;
      });
    }
  }

  //hàm này để khởi tạo dịch vụ chữ ký số
   khoiTaoDichVuChuKySo() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      let obj = JSON.parse(rs);

      if (obj.TypeOfError === 0) {
        obj.dataXML = obj.XMLSigned;
        obj.thongDiepGuiCQTId = this.mainForm.get('id').value;
        obj.autoCapNhatNgayLap = this.autoCapNhatNgayLap;
        obj.maLoaiThongDiep = this.mltd;

        this.thongDiepGuiCQTService.GateForWebSocket(obj).subscribe((res: any) => {
          if (res) {
            this.mainForm.get('fileXMLDaKy').setValue(res.xmlFileName);
            this.mainForm.get('ngayGui').setValue(moment().format('YYYY-MM-DD HH:mm:ss'));

            //thêm nhật ký truy cập
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.KyDienTu,
              hanhDong: 'Ký và Gửi',
              refType: RefType.ThongBaoHoaDonSaiSot,
              thamChieu: 'Thông báo hóa đơn sai sót',
              moTaChiTiet: 'Đã ký thông báo',
              refId: this.mainForm.get('id').value,
            }).subscribe();

            //ký xong thì gửi XML tới cục thuế
            let duLieuGuiCucThue = {
              maSoThue: this.mainForm.get('maSoThue').value,
              maThongDiep: this.mainForm.get('maThongDiep').value,
              xmlFileName: res.xmlFileName,
              thongDiepGuiCQTId: this.mainForm.get('id').value,
              maLoaiThongDiep: this.mltd,
            }
            this.thongDiepGuiCQTService.GuiThongDiepToiCQT(duLieuGuiCucThue).subscribe((res1: any) => {
              this.spinning = false;
              if (res1) {
                //this.message.create('success', `Đã ký và gửi thông báo tới CQT`);
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
                    msTitle: 'Hoàn thành thao tác gửi dữ liệu đến CQT',
                    msContent: 'Đã hoàn thành thao tác gửi dữ liệu đến CQT. Bạn cần theo dõi <b>Trạng thái gửi và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b>',
                  },
                  nzFooter: null
                });
                this.daKyVaGuiCQT = true;

                //thêm nhật ký truy cập
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.KyGuiThongBaoToiCQT,
                  hanhDong: 'Ký và Gửi',
                  refType: RefType.ThongBaoHoaDonSaiSot,
                  thamChieu: 'Thông báo hóa đơn sai sót',
                  moTaChiTiet: 'Đã gửi thông báo tới CQT',
                  refId: this.mainForm.get('id').value,
                }).subscribe();
                this.signing = false;
              }
              else {
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
                    msTitle: 'Kiểm tra lại',
                    msContent: 'Không gửi được <b>Thông báo hóa đơn điện tử có sai sót</b> (Mẫu số 04/SS-HĐĐT) đến <b>TCTN</b> (Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử). Vui lòng thực hiện <span class = "colorChuYTrongThongBao"><b>Lập mới, Ký và Gửi</b></span> lại!',
                  },
                  nzFooter: null
                });
                //this.message.create('error', `Không gửi được thông báo tới CQT`);
                this.daKyVaGuiCQT = false;
                this.signing = false;
              }

              this.daSuaVaLuuDuLieu = true;

              //nếu tự động ký
              if (this.autoSign) {
                //nếu có yêu cầu trả về thông điệp chung id
                if (this.isTraVeThongDiepChung) {
                  let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
                  this.modal.destroy(thongDiepChungId);
                  return;
                }

                this.modal.destroy(true);
              }
            });
          }
        });
      } else {
        this.nhatKyThaoTacLoiService.Insert(this.mainForm.get('thongDiepChungId').value, obj.Exception).subscribe();

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
            msContent: `Ký điện tử không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        this.daKyVaGuiCQT = false;
        this.signing = false;
        this.spinning = false;
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
              this.spinning = false;
              this.signing = false;
            },
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => {
              this.spinning = false;
              this.signing = false;
              return;
            },
            msTitle: 'Kiểm tra lại',
            msContent: `Để ký thông báo, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
          },
          nzFooter: null
        });
      }
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

  //hàm này để gửi thông điệp cần ký chữ ký số
  async sendMessageToServer() {
    if (this.autoSign) {
      this.kyDienTu();
      return;
    }

    let thongBaoNgayLap = '';
    let ngayLap = this.mainForm.get('ngayLap').value;
    let ngayHienTaiTrenServer: any = await this.hoaDonDienTuService.GetNgayHienTai();
    let ngayHienTai = moment(ngayHienTaiTrenServer.result).format('DD/MM/YYYY');

    if (ngayLap == null || ngayLap == '') {
      ngayLap = moment(ngayHienTaiTrenServer.result);
    }
    else {
      ngayLap = moment(ngayLap);
    }
    if (ngayLap.format('DD/MM/YYYY') != ngayHienTai) {
      thongBaoNgayLap = `Ngày lập thông báo hóa đơn điện tử có sai sót là ngày <b class="colorChuYTrongThongBao">${ngayLap.format('DD/MM/YYYY')}</b>.
      Bạn có muốn cập nhật ngày lập thành ngày hiện tại <b class="colorChuYTrongThongBao">${ngayHienTai}</b> không?
      <br/><br/>
      Bạn có thể chọn <b class="colorBlueTrongThongBao">Quay lại</b> để ngừng thực hiện <b>Ký và Gửi</b>!`;

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
          msTitle: 'Cập nhật ngày lập thông báo',
          msContent: thongBaoNgayLap,
          msOnCancel: () => { },
          msOnOk: () => {
            this.mainForm.get('ngayLap').setValue(ngayHienTaiTrenServer.result);
            this.autoCapNhatNgayLap = true;
            this.kyDienTu();
          },
          msOnClose: () => {
            this.kyDienTu();
          }
        },
        nzFooter: null
      });
    }
    else {
      this.kyDienTu();
    }
  }

  //hàm này để yêu cầu ký điện tử
  kyDienTu() {
    let thongBaoHoaDonSaiSotId = this.mainForm.get('id').value;

    forkJoin([
      this.thongDiepGuiCQTService.GetListChungThuSo(thongBaoHoaDonSaiSotId),
      this.thongDiepGuiCQTService.GetBase64XmlThongDiepChuaKy(thongBaoHoaDonSaiSotId)
    ]).subscribe((res: any[]) => {
      let listSerials = [];
      res[0].forEach(item => {
        listSerials.push(item);
      });

      this.spinning = true;
      this.signing = true;
      let fileDinhKem = this.mainForm.get('fileDinhKem').value;
      let fileContainerPath = this.mainForm.get('fileContainerPath').value;
      let fileTaiVe = this.phanTachTenFile(fileDinhKem, 'xml');
      let apiURLXML = this.env.apiUrl + '/' + fileContainerPath + '/xml/unsign/' + fileTaiVe;
      let msg: any = {
        mLTDiep: MLTDiep.TDTBHDDLSSot,
        mst: this.mainForm.get('maSoThue').value,
        // urlXML: apiURLXML,
        dataXML: res[1].result,
        serials: listSerials
      };
      if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
        // Sending
        if (!this.webSocket.sendMessage(JSON.stringify(msg)) && !this.autoSign) {
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
                this.spinning = false;
                this.signing = false;
              },
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
                this.spinning = false;
                this.signing = false;
                return;
              },
              msTitle: 'Kiểm tra lại',
              msContent: `Để ký thông báo, bạn cần cài đặt hoặc chạy (nếu đã cài) phần mềm ký điện tử (công cụ ký) <b>BKSOFT KYSO</b>. Vui lòng kiểm tra lại.`,
            },
            nzFooter: null
          });
        }
      }else{
        this.kiMem(msg);
      }


    });
  }
  //Ký mềm
  kiMem(dataKy: any) {
    this.webSubcription = this.webSocket.createObservableSocket('', dataKy).subscribe((rs: any) => {
      let obj = rs;

      if (obj.TypeOfError === 0) {
        obj.dataXML = obj.XMLSigned;
        obj.thongDiepGuiCQTId = this.mainForm.get('id').value;
        obj.autoCapNhatNgayLap = this.autoCapNhatNgayLap;
        obj.maLoaiThongDiep = this.mltd;

        this.thongDiepGuiCQTService.GateForWebSocket(obj).subscribe((res: any) => {
          if (res) {
            this.mainForm.get('fileXMLDaKy').setValue(res.xmlFileName);
            this.mainForm.get('ngayGui').setValue(moment().format('YYYY-MM-DD HH:mm:ss'));

            //thêm nhật ký truy cập
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.KyDienTu,
              hanhDong: 'Ký và Gửi',
              refType: RefType.ThongBaoHoaDonSaiSot,
              thamChieu: 'Thông báo hóa đơn sai sót',
              moTaChiTiet: 'Đã ký thông báo',
              refId: this.mainForm.get('id').value,
            }).subscribe();

            //ký xong thì gửi XML tới cục thuế
            let duLieuGuiCucThue = {
              maSoThue: this.mainForm.get('maSoThue').value,
              maThongDiep: this.mainForm.get('maThongDiep').value,
              xmlFileName: res.xmlFileName,
              thongDiepGuiCQTId: this.mainForm.get('id').value,
              maLoaiThongDiep: this.mltd,
            }
            this.thongDiepGuiCQTService.GuiThongDiepToiCQT(duLieuGuiCucThue).subscribe((res1: any) => {
              this.spinning = false;
              if (res1) {
                //this.message.create('success', `Đã ký và gửi thông báo tới CQT`);
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
                    msTitle: 'Hoàn thành thao tác gửi dữ liệu đến CQT',
                    msContent: 'Đã hoàn thành thao tác gửi dữ liệu đến CQT. Bạn cần theo dõi <b>Trạng thái gửi và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b>',
                  },
                  nzFooter: null
                });
                this.daKyVaGuiCQT = true;

                //thêm nhật ký truy cập
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.KyGuiThongBaoToiCQT,
                  hanhDong: 'Ký và Gửi',
                  refType: RefType.ThongBaoHoaDonSaiSot,
                  thamChieu: 'Thông báo hóa đơn sai sót',
                  moTaChiTiet: 'Đã gửi thông báo tới CQT',
                  refId: this.mainForm.get('id').value,
                }).subscribe();
                this.signing = false;
              }
              else {
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
                    msTitle: 'Kiểm tra lại',
                    msContent: 'Không gửi được <b>Thông báo hóa đơn điện tử có sai sót</b> (Mẫu số 04/SS-HĐĐT) đến <b>TCTN</b> (Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử). Vui lòng thực hiện <span class = "colorChuYTrongThongBao"><b>Lập mới, Ký và Gửi</b></span> lại!',
                  },
                  nzFooter: null
                });
                //this.message.create('error', `Không gửi được thông báo tới CQT`);
                this.daKyVaGuiCQT = false;
                this.signing = false;
              }

              this.daSuaVaLuuDuLieu = true;

              //nếu tự động ký
              if (this.autoSign) {
                //nếu có yêu cầu trả về thông điệp chung id
                if (this.isTraVeThongDiepChung) {
                  let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
                  this.modal.destroy(thongDiepChungId);
                  return;
                }

                this.modal.destroy(true);
              }
            });
          }
        });
      } else {
        this.nhatKyThaoTacLoiService.Insert(this.mainForm.get('thongDiepChungId').value, obj.Exception).subscribe();

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
            msContent: `Ký điện tử không thành công.
          <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
          <br>Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        this.daKyVaGuiCQT = false;
        this.signing = false;
        this.spinning = false;
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
    });
  }
  //hàm này sẽ trả về tên file theo phân loại loaiFileTraVe
  phanTachTenFile(tenFile: string, loaiFileTraVe: string) {
    if (tenFile == null || tenFile == '') return '';
    let tenFiles = tenFile.split(';');
    let fileKetQua = '';
    for (let i = 0; i < tenFiles.length; i++) {
      let item = tenFiles[i];
      if (item.lastIndexOf(loaiFileTraVe) >= 0) {
        fileKetQua = item;
        break;
      }
    }
    return fileKetQua;
  }

  clickSua() {
    this.daLuu = false;
    this.daClickSua = true;
    this.isView = false;
    this.daXoa = false;
  }

  //hàm này để xóa thông điệp
  clickXoa() {
    let id = this.mainForm.get('id').value;

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzWidth: '420px',
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CANCLE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_OK,
        msTitle: 'Xóa thông báo',
        msContent: `Bạn có chắc chắn muốn xóa thông báo hóa đơn sai sót này không?`,
        msOnOk: () => {
          this.thongDiepGuiCQTService.Delete(id).subscribe((res: any) => {
            if (res) {
              this.message.success('Xóa dữ liệu thành công');
              this.mainForm.get('id').setValue(null);
              this.mainForm.get('fileXMLDaKy').setValue(null);
              this.daLuu = false;
              this.daClickSua = false;
              this.daSuaVaLuuDuLieu = true;
              this.daXoa = true;
              const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
              hoaDonSaiSotFormArray.clear();
              this.mainForm.markAsPristine();

              //thêm nhật ký truy cập
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.ThongBaoHoaDonSaiSot,
                thamChieu: 'Thông báo hóa đơn sai sót',
                moTaChiTiet: 'Xóa thông báo',
                refId: id,
              }).subscribe();

              //nếu có yêu cầu trả về thông điệp chung id
              if (this.isTraVeThongDiepChung) {
                let thongDiepChungId = this.mainForm.get('thongDiepChungId').value;
                this.modal.destroy(thongDiepChungId);
                return;
              }

              //đóng form
              this.modal.destroy(this.daXoa);
            } else {
              this.daXoa = false;
              this.message.error('Lỗi xóa dữ liệu');
            }
          });
        }
      },
      nzFooter: null
    });
  }

  //hàm này để tải file về máy tính
  downloadFile(loaiFile: string, taiFileXmlDaKy: boolean = false) {
    this.thongDiepGuiCQTService.GenerateFileIfNotExists(this.thongDiepGuiCQTId)
      .subscribe(() => {
        let param = { thongDiepGuiCQTId: this.thongDiepGuiCQTId, isTraVeThongDiepChung: this.isTraVeThongDiepChung };

        this.thongDiepGuiCQTService.GetThongDiepGuiCQTById(param).subscribe((res: any) => {
          console.log(res);
          this.mainForm.get('fileContainerPath').setValue(res.fileContainerPath);
          this.mainForm.get('fileDinhKem').setValue(res.fileDinhKem);
          this.mainForm.get('fileXMLDaKy').setValue(res.fileXMLDaKy);
          let fileTaiVe = '';
          let fileContainerPath = this.mainForm.get('fileContainerPath').value;

          if (taiFileXmlDaKy === false) {
            if (loaiFile === 'pdf' || loaiFile === 'docx') {
              fileContainerPath += '/attach';
            }
            else {
              fileContainerPath += '/xml/unsign';
            }

            let fileDinhKem = this.mainForm.get('fileDinhKem').value;
            console.log(fileDinhKem);
            fileTaiVe = this.phanTachTenFile(fileDinhKem, loaiFile);
          }
          else {
            fileTaiVe = this.mainForm.get('fileXMLDaKy').value;
            fileContainerPath += '/xml/signed';
          }

          //url của file tải về
          let URLFileTaiVe = this.env.apiUrl + '/' + fileContainerPath + '/' + fileTaiVe;
          this.thongDiepGuiCQTService.DownloadFile(URLFileTaiVe).subscribe(blob => {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = (taiFileXmlDaKy === false ? 'thongBaoHoaDonSaiSot.' : 'thongBaoHoaDonSaiSot_DaKy.') + loaiFile;
            a.click();
            URL.revokeObjectURL(objectUrl);
          });
        });
      });
  }

  //hàm này để hiển thị Địa danh, ngày tháng
  getChuoiDiaDanhNgayThang() {
    let chuoiDiaDanhNgayThang = '';
    let maDiaDanh = this.mainForm.get('diaDanh').value;
    let diaDanh = this.listDiaDanh.find(x => x.code == maDiaDanh);
    if (diaDanh != null) {
      chuoiDiaDanhNgayThang = diaDanh.name;
    }

    let ngayLapHoaDon = this.mainForm.get('ngayLap').value;
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

  //hàm hiển thị ngày ký ra DD/MM/YYYY
  getNgayKyGui() {
    return moment(this.mainForm.get('ngayGui').value).format("YYYY-MM-DD HH:mm:ss");
  }

  /**
   * Hàm này kiểm tra nếu ngày lập thông báo lớn hơn ngày hiện tại thì cảnh báo và không cho lưu dữ liệu
   * @returns Giá trị có kiểu boolean cho biết xem ngày lập thông báo có lớn hơn ngày hiện tại không
   */
  async kiemTraNgayLapHopLe(): Promise<boolean> {
    let isNgayLapHopLe = true; // nếu isNgayLapHopLe = true thì ngày lập là hợp lệ
    let ngayLap = this.mainForm.get('ngayLap').value;
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
}
