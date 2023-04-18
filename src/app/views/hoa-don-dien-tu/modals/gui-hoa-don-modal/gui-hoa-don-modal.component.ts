import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { getEmailWithBCCAndCC, getMainEmailFromDairy, getTenLoaiHoaDon, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { CheckValidPhone } from 'src/app/customValidators/check-valid-phone.validator';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { formatNumber } from '@angular/common';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { forkJoin } from 'rxjs';
import { NhatKyGuiEmailService } from 'src/app/services/tien-ich/nhat-ky-gui-email.service';

@Component({
  selector: 'app-gui-hoa-don-modal',
  templateUrl: './gui-hoa-don-modal.component.html',
  styleUrls: ['./gui-hoa-don-modal.component.scss']
})
export class GuiHoaDonModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() loaiEmail: any;
  @Input() isTraCuu: boolean;
  @Input() isDraft: boolean;
  @Input() hanhDong:any;
  mainForm: FormGroup;
  spinning = false;
  sending = false;
  isboxEmailCcBcc: boolean = false;
  permission: boolean = true;
  ddtp: DinhDangThapPhan;
  isDaGuiEmailHoaDon = false;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private nhatKyGuiEmailService: NhatKyGuiEmailService,
    private doiTuongService: DoiTuongService
  ) {
  }

  ngOnInit() {
    this.createForm();

    this.isDaGuiEmailHoaDon = this.data.trangThaiGuiHoaDon >= 3 || this.data.isXacNhanDaGuiHDChoKhachHang == true;
  }

  forkJoin() {
    return forkJoin([
      this.hoaDonDienTuService.IsDaGuiEmailChoKhachHang(this.data.hoaDonDienTuId)
    ]);
  }

  ToggleButton() {
    this.isboxEmailCcBcc = !this.isboxEmailCcBcc;
  }

  async createForm() {
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.data.mauSo + this.data.kyHieu, disabled: true }],
      soHoaDonShow: [{ value: this.data.soHoaDon || "<Chưa cấp số>", disabled: true }],
      ngayHoaDonShow: [{ value: moment(this.data.ngayHoaDon).format("DD/MM/YYYY"), disabled: true }],
      tenKhachHangShow: [{ value: this.data.tenKhachHang || this.data.hoTenNguoiMuaHang, disabled: true }],
      tongTienThanhToanShow: [{ value: formatNumber(Number(this.data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + this.data.loaiTien.ma, disabled: true }],
      hoTenNguoiNhanHD: [null, [Validators.required]],
      emailNguoiNhanHD: [null, [Validators.required, CheckValidEmail]],
      cC: [null, [CheckValidEmail]],
      bCC: [null, [CheckValidEmail]],
      soDienThoaiNguoiNhanHD: [{ value: null, disabled: true }, [CheckValidPhone]]
    });

    const doiTuong: any = await this.doiTuongService.GetByIdAsync(this.data.khachHangId);
    if (this.data.khachHangId && doiTuong && doiTuong.emailNguoiNhanHD) {
      this.mainForm.get('hoTenNguoiNhanHD').setValue(doiTuong.hoTenNguoiNhanHD);
      this.mainForm.get('emailNguoiNhanHD').setValue(doiTuong.emailNguoiNhanHD);
      this.mainForm.get('soDienThoaiNguoiNhanHD').setValue(doiTuong.soDienThoaiNguoiNhanHD);
      this.spinning = false;
    } else {
      this.mainForm.get('hoTenNguoiNhanHD').setValue(this.data.hoTenNguoiNhanHD);
      this.mainForm.get('emailNguoiNhanHD').setValue(this.data.emailNguoiMuaHang);
      this.mainForm.get('soDienThoaiNguoiNhanHD').setValue(this.data.soDienThoaiNguoiNhanHD);
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
  }

  view() {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    if (!this.isTraCuu)
      this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe((rs: any) => {
        const pathPrint = rs.filePDF;
        showModalPreviewPDF(this.modalService, `${this.env.apiUrl}/${pathPrint}`);
        this.message.remove(id);
      }, (err) => {
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      });
    else {
      this.hoaDonDienTuService.ConvertHoaDonToFilePDF_TraCuu(this.data).subscribe((rs: any) => {
        const pathPrint = rs.filePDF;
        showModalPreviewPDF(this.modalService, `${this.env.apiUrl}/${pathPrint}`);
        this.message.remove(id);
      }, (err) => {
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      });
    }
  }

  GuiHoaDon() {
    this.spinning = true;
    this.sending = true;
    if (this.mainForm.invalid) {
      let invalid = false;
      // tslint:disable-next-line:forin
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsDirty();
        this.mainForm.controls[i].updateValueAndValidity();

        if (invalid === false && this.mainForm.controls[i].invalid) {
          invalid = true;
        }
      }

      if (invalid) {
        setStyleTooltipError(true);
      }

      this.sending = false;
      this.spinning = false;
      return;
    }

    const rawValue = this.mainForm.getRawValue();
    if (!this.isTraCuu)
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
        if (rs) {
          const params = {
            hoaDon: rs,
            tenNguoiNhan: rawValue.hoTenNguoiNhanHD,
            toMail: rawValue.emailNguoiNhanHD,
            cC: rawValue.cC,
            bCC: rawValue.bCC,
            soDienThoaiNguoiNhan: rawValue.soDienThoaiNguoiNhanHD,
            loaiEmail: this.loaiEmail,
            link: this.env.apiUrl,
            linkTraCuu: this.env.apiUrl + '/tra-cuu-hoa-don'
          }

          this.hoaDonDienTuService.SendEmailAsync(params).subscribe(result => {
            if (result) {
              var phanQuyen = localStorage.getItem('KTBKUserPermission');
              var thaoTacs = [];
              if (phanQuyen != 'true') {
                this.permission = false;
                var pq = JSON.parse(phanQuyen);
                thaoTacs = pq.functions.find(x => x.functionName == "KhachHang").thaoTacs;
              }
              if (this.data.khachHangId && (this.permission == true || (this.permission == false && thaoTacs.indexOf("DM_UPDATE") >= 0))) {
                this.doiTuongService.GetById(this.data.khachHangId).subscribe((rs: any) => {
                  rs.hoTenNguoiNhanHD = rawValue.hoTenNguoiNhanHD;
                  rs.emailNguoiNhanHD = rawValue.emailNguoiNhanHD;
                  rs.soDienThoaiNguoiNhanHD = rawValue.soDienThoaiNguoiNhanHD;
                  this.doiTuongService.Update(rs).subscribe();
                });
              }
              var tenHanhDong = this.isDraft ? 'Gửi hóa đơn nháp đến khách hàng' : 'Gửi hóa đơn';
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.GuiHoaDonChoKhachHang,
                hanhDong: tenHanhDong,
                doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(rs.loaiHoaDon),
                refType: RefType.HoaDonDienTu,
                thamChieu: null,
                moTaChiTiet: `${tenHanhDong} thành công.\nMẫu số: <${rs.mauSo}>; Ký hiệu: <${rs.kyHieu}>; Số hóa đơn: <${rs.soHoaDon || 'Chưa cấp số'}>; Ngày hóa đơn: <${moment(rs.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${rawValue.hoTenNguoiNhanHD}>; Email người nhận: <${getEmailWithBCCAndCC(rawValue.emailNguoiNhanHD, rawValue.cC, rawValue.bCC)}>;`,
                refId: rs.hoaDonDienTuId
              }).subscribe();
              this.spinning = false;
              this.sending = false;
              this.modal.destroy({
                status: true,
                isDaGuiEmailHoaDon: this.isDaGuiEmailHoaDon
              });
            }
            else {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 400,
                nzStyle: { top: '10px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: `Kiểm tra lại`,
                  msContent: `Gửi hóa đơn ${this.isDraft == true ? 'nháp' : ''} không thành công. Vui lòng kiểm tra lại!`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => { }
                }
              })
              this.spinning = false;
              this.sending = false;
              return;
            }
          });
        } else {
          this.spinning = false;
          this.sending = false;
          this.modal.destroy({
            status: false,
            isDaGuiEmailHoaDon: this.isDaGuiEmailHoaDon
          });
        }
      });
    else {
      this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((rs: any) => {
        if (rs) {
          const params = {
            hoaDon: rs,
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
                loaiHanhDong: LoaiHanhDong.GuiHoaDonChoKhachHang,
                doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(rs.loaiHoaDon),
                refType: RefType.HoaDonDienTu,
                thamChieu: null,
                moTaChiTiet: `Mẫu số: <${rs.mauSo}>; Ký hiệu: <${rs.kyHieu}>; Số hóa đơn: <${rs.soHoaDon || '<Chưa cấp số>'}>; Ngày hóa đơn: <${moment(rs.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${rawValue.hoTenNguoiNhanHD}>; Email người nhận: <${getEmailWithBCCAndCC(rawValue.emailNguoiNhanHD, rawValue.cC, rawValue.bCC)}>;`,
                refId: rs.hoaDonDienTuId,
                hanhDong:this.hanhDong
              }).subscribe();
              this.spinning = false;
              this.sending = false;
              this.modal.destroy({
                status: true,
                isDaGuiEmailHoaDon: this.isDaGuiEmailHoaDon
              });
            }
            else {
              this.spinning = false;
              this.sending = false;
              this.modal.destroy({
                status: false,
                isDaGuiEmailHoaDon: this.isDaGuiEmailHoaDon
              });
            }
          });
        }
        else {
          this.spinning = false;
          this.sending = false;
          this.modal.destroy({
            status: false,
            isDaGuiEmailHoaDon: this.isDaGuiEmailHoaDon
          });
        }
      });
    }
  }
  ngAfterViewChecked() {

  }

  destroyModal() {
    this.modal.destroy(null);
  }
}
