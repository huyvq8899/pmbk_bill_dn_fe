import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { LapBienBanXoaBoHoaDonModalComponent } from '../lap-bien-ban-xoa-bo-hoa-don/lap-bien-ban-xoa-bo-hoa-don.modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { getEmailWithBCCAndCC, getMainEmailFromDairy, getTenLoaiHoaDon, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { formatNumber } from '@angular/common';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { NhatKyGuiEmailService } from 'src/app/services/tien-ich/nhat-ky-gui-email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gui-hoa-don-xoa-bo-modal',
  templateUrl: './gui-hoa-don-xoa-bo-modal.component.html',
  styleUrls: ['./gui-hoa-don-xoa-bo-modal.component.scss']
})
export class GuiHoaDonXoaBoModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() isBBView: boolean = false;
  @Input() loaiEmail: LoaiEmail;
  mainForm: FormGroup;
  bienBan: any;
  nguoiChuyenDois: any[] = [];
  soCTXoaBo = "";
  lyDoXoaBo = "";
  daGuiHDChoKhachHang: boolean = false;
  daGuiThongBaoXoaBoChoKhachHang: boolean = false;
  daGuiThongBienBanChoKhachHang: boolean = false;
  isboxEmailCcBcc: boolean = false;
  spinning = true;
  sending = false;
  tooltipNotCreatSubstitute = "";
  isNotCreatSubstitute: boolean = false;
  isNotCreatSubstituteDisable: boolean = false;
  isNotCreatSubstituteShow: boolean = true;
  isAlertCustomShow: boolean = true;
  formData: FormData;
  fbBtnSaveDisable: boolean = false;
  hinhThucHoaDon: any;
  uyNhiemLapHoaDon: any;
  thongTinHoaDonId = null;
  txtHD_PXK: string = "hóa đơn";
  txtHD_PXK_UPPER: string = "Hóa đơn";
  constructor(
    private env: EnvService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private doiTuongService: DoiTuongService,
    private nhatKyGuiEmailService: NhatKyGuiEmailService
  ) {

  }
  ngOnInit() {
    this.spinning = true;
    const _url = this.router.url;
    if(_url.includes('phieu-xuat-kho')){
      this.txtHD_PXK = "PXK";
      this.txtHD_PXK_UPPER = "PXK";
    }

    if (this.data != null) {
      //kiểm tra xem là hdđt hay là thông tin hóa đơn
      if (this.data.thongTinHoaDonId != null) {
        this.thongTinHoaDonId = this.data.thongTinHoaDonId;
        this.thongTinHoaDonService.GetById(this.data.thongTinHoaDonId).subscribe((rs) => {
          this.data = rs;
          this.createForm();
        })
      } else {
        this.createForm();
      }
      this.daGuiThongBienBanChoKhachHang = (this.data.trangThaiBienBanXoaBo > 2);
      this.daGuiThongBaoXoaBoChoKhachHang = this.data.daGuiThongBaoXoaBoHoaDon;
      this.daGuiHDChoKhachHang = this.data.trangThaiGuiHoaDon >= 3;//Đã gửi cho khách hàng
      this.hinhThucHoaDon = this.data.hinhThucHoaDon == null ? this.data.boKyHieuHoaDon != null ? this.data.boKyHieuHoaDon.hinhThucHoaDon : null : this.data.hinhThucHoaDon;
      this.uyNhiemLapHoaDon = this.data.uyNhiemLapHoaDon;
      this.spinning = false;
    }

    this.isboxEmailCcBcc = false;
  }
  ToggleButton() {
    this.isboxEmailCcBcc = !this.isboxEmailCcBcc;
  }
  ngAfterViewChecked() {

  }

  async createForm() {
    console.log(this.data);
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.data != null ? this.data.mauSo + this.data.kyHieu : null, disabled: true }],
      tongTienThanhToanShow: [{ value: this.data != null ? formatNumber(Number(this.data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + (this.data.loaiTien != null ? this.data.loaiTien.ma : this.data.maLoaiTien) : null, disabled: true }],
      mauSoShow: [{ value: this.data != null ? this.data.mauSo : null, disabled: true }],
      soHoaDonShow: [{ value: this.data != null ? this.data.soHoaDon : null, disabled: true }],
      ngayHoaDonShow: [{ value: this.data != null ? moment(this.data.ngayHoaDon).format("YYYY-MM-DD") : null, disabled: true }],
      tenKhachHangShow: [{ value: this.data != null ? (this.data.tenKhachHang || this.data.hoTenNguoiMuaHang) : null, disabled: true }],
      hoTenNguoiNhanHD: [{ value: this.data != null ? this.data.hoTenNguoiNhanHD != null ? this.data.hoTenNguoiNhanHD : this.data.tenKhachHang : null, disabled: !this.isAddNew }, [Validators.required]],
      emailNguoiNhanHD: [{ value: this.data != null ? this.data.emailNguoiNhanHD : null, disabled: !this.isAddNew }, [Validators.required, CheckValidEmail]],
      cC: [{ value: null, disabled: !this.isAddNew }, [CheckValidEmail]],
      bCC: [{ value: null, disabled: !this.isAddNew }, [CheckValidEmail]],
      soDienThoaiNguoiNhanHD: [{ value: this.data != null ? this.data.soDienThoaiNguoiNhanHD : null, disabled: !this.isAddNew }],
    });

    const doiTuong: any = await this.doiTuongService.GetByIdAsync(this.data.khachHangId);
    if (this.data.khachHangId && doiTuong && doiTuong.emailNguoiNhanHD) {
      this.mainForm.get('hoTenNguoiNhanHD').setValue(doiTuong.hoTenNguoiNhanHD);
      this.mainForm.get('emailNguoiNhanHD').setValue(doiTuong.emailNguoiNhanHD);
      this.mainForm.get('soDienThoaiNguoiNhanHD').setValue(doiTuong.soDienThoaiNguoiNhanHD);
      this.spinning = false;
    }

    var emailNguoiNhanHD = this.mainForm.get('emailNguoiNhanHD').value;
    if (!emailNguoiNhanHD) {
      this.nhatKyGuiEmailService.GetThongTinEmailDaGuiChoKHGanNhat(this.data.hoaDonDienTuId)
        .subscribe((res: any) => {
          if (res) {
            this.mainForm.get('hoTenNguoiNhanHD').setValue(res.tenNguoiNhan);
            this.mainForm.get('emailNguoiNhanHD').setValue(getMainEmailFromDairy(res.emailNguoiNhan));
          }
        });
    }

    this.mainForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
    this.changeGuiThongBaoChoKH(true);
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
          this.message.warning("Lỗi khi xem hóa đơn");
          this.message.remove(id);
        });
      }, (err) => {
        console.log(err);
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      })
    }
  }
  viewBB() {
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.data.hoaDonDienTuId).subscribe((rs: any) => {
      const modal1 = this.modalService.create({
        nzTitle: "Lập biên bản hủy hóa đơn",
        nzContent: LapBienBanXoaBoHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          data: this.data,
          formData: rs,
          isAddNew: false,
          isShowbtnSendEmail: false
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {

      });
    });
  }

  changeGuiThongBaoChoKH(event: any) {
    if (event == true) {
      this.mainForm.get('hoTenNguoiNhanHD').enable();
      this.mainForm.get('emailNguoiNhanHD').enable();
      this.mainForm.get('cC').enable();
      this.mainForm.get('bCC').enable();
      // this.mainForm.get('soDienThoaiNguoiNhanHD').enable();//Đợi khi cung cấp dịch vụ SMS thì mới mở ra để sử dụng
    }
    else {
      this.mainForm.get('cC').disable();
      this.mainForm.get('bCC').disable();
      this.mainForm.get('hoTenNguoiNhanHD').disable();
      this.mainForm.get('emailNguoiNhanHD').disable();
      this.mainForm.get('soDienThoaiNguoiNhanHD').disable();
    }
  }

  GuiHoaDon() {
    this.spinning = true;
    this.sending = true;
    if (this.data != null) {
      if (!this.daGuiHDChoKhachHang) {
        let msContentHD = `${this.txtHD_PXK_UPPER} <` + this.data.mauSo + this.data.kyHieu + '-' + this.data.soHoaDon + ' -  Ngày -' + moment(this.data.ngayHoaDon).format("DD/MM/YYYY") + '> chưa được gửi cho khách hàng. Bạn có muốn gửi thông báo xóa bỏ hóa đơn cho khách hàng không?';
        let configCLose = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '345px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msTitle: `Gửi thông báo xóa bỏ ${this.txtHD_PXK} cho khách hàng`,
            msContent: msContentHD,
            msOnOk: () => {
              this.send();
            },
            msOnCancel: () => {
              this.spinning = false;
              this.sending = false;
              return;
            }
          },
          nzFooter: null
        });
      } else if (this.daGuiThongBaoXoaBoChoKhachHang && (this.loaiEmail == LoaiEmail.ThongBaoXoaBoHoaDon || this.loaiEmail == LoaiEmail.ThongBaoXoaBoPXK)) {
        let configCLose = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '345px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msTitle: `Gửi thông báo xóa bỏ ${this.txtHD_PXK}`,
            msContent: `Thông báo xóa bỏ ${this.txtHD_PXK_UPPER} đã được gửi cho khách hàng. Bạn có muốn gửi lại không?`,
            msOnOk: () => {
              this.send();
            },
            msOnCancel: () => {
              this.spinning = false;
              this.sending = false;
              this.modal.destroy();
            }
          },
          nzFooter: null
        });
        
      } else if (this.daGuiThongBienBanChoKhachHang && (this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoHoaDon || this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoPXK)) {
        let configCLose = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '345px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msTitle: `Gửi biên bản hủy ${this.txtHD_PXK}`,
            msContent: `Biên bản hủy ${this.txtHD_PXK} đã được gửi cho khách hàng. Bạn có muốn gửi lại không?`,
            msOnOk: () => {
              this.send();
            },
            msOnCancel: () => {
              this.spinning = false;
              this.sending = false;
              this.modal.destroy();
            }
          },
          nzFooter: null
        });
      }
      else {
        this.send();
      }

    }
    else {
      this.spinning = false;
      this.sending = false;
      this.modal.destroy(false);
    }
  }

  send() {
    console.log(this.data);
    // this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
    //   if (rs) {

    const rawValue = this.mainForm.getRawValue();
    let refType = this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoHoaDon ? RefType.BienBanXoaBo : RefType.HoaDonXoaBo;
    const params = {
      hoaDon: this.data,
      tenNguoiNhan: rawValue.hoTenNguoiNhanHD,
      toMail: rawValue.emailNguoiNhanHD,
      cC: rawValue.cC,
      bCC: rawValue.bCC,
      soDienThoaiNguoiNhan: rawValue.soDienThoaiNguoiNhanHD,
      loaiEmail: this.loaiEmail,
      link: this.env.apiUrl
    }
    this.hoaDonDienTuService.SendEmailAsync(params).subscribe(result => {
      if (result) {
        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: this.loaiEmail === LoaiEmail.ThongBaoXoaBoHoaDon ? LoaiHanhDong.GuiThongBaoXoaBoHoaDon : this.loaiEmail == LoaiEmail.ThongBaoBienBanDieuChinhHoaDon ? LoaiHanhDong.GuiBienBanDieuChinhHoaDon : LoaiHanhDong.GuiBienBanHuyHoaDon,
          doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.data.loaiHoaDon),
          refType: refType,
          thamChieu: null,
          moTaChiTiet: `Gửi ${this.loaiEmail === LoaiEmail.ThongBaoXoaBoHoaDon ? 'thông báo xóa bỏ hóa đơn' : this.loaiEmail == LoaiEmail.ThongBaoXoaBoPXK ? 'thông báo xóa bỏ phiếu xuất kho' : this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoPXK ? 'biên bản hủy phiếu xuất kho' : this.loaiEmail == LoaiEmail.ThongBaoBienBanDieuChinhHoaDon ? 'biên bản điều chỉnh hóa đơn' : this.loaiEmail == LoaiEmail.ThongBaoBienBanDieuChinhPXK ? 'biên bản điều chỉnh phiếu xuất kho' : 'biên bản hủy hóa đơn'} thành công.\nMẫu số: <${this.data.mauSo}>; Ký hiệu: <${this.data.kyHieu}>; Số hóa đơn: <${this.data.soHoaDon || '<Chưa cấp số>'}>; Ngày hóa đơn: <${moment(this.data.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${rawValue.hoTenNguoiNhanHD}>; Email người nhận: <${getEmailWithBCCAndCC(rawValue.emailNguoiNhanHD, rawValue.cC, rawValue.bCC)}>;`,
          refId: this.data.hoaDonDienTuId
        }).subscribe();
        if (this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoHoaDon || this.loaiEmail == LoaiEmail.ThongBaoBienBanHuyBoPXK) {
          this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.data.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              if (rs.soBienBan == null) {
                rs.soBienBan = 'BBH-' + this.data.kyHieu + '-' + this.data.soHoaDon + '-' + moment().format('DD/MM/yyyy hh:mm:ss');
                this.hoaDonDienTuService.CapNhatBienBanXoaBoHoaDon(rs).subscribe((rs2: boolean) => {
                  if (rs2) {
                    this.spinning = false;
                  }
                });
              }
            }
          });
        }
        this.spinning = false;
        this.sending = false;
        this.modal.destroy(true);
      }
      else {
        this.spinning = false;
        this.sending = false;
        this.modal.destroy(false);
      }
    });
    //   }
    // });
  }
  destroyModal() {
    this.modal.destroy();
  }
}
