import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { formatNumber } from '@angular/common';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import { AddEditBienBanDieuChinhModalComponent } from '../add-edit-bien-ban-dieu-chinh-modal/add-edit-bien-ban-dieu-chinh-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { getEmailWithBCCAndCC, getMainEmailFromDairy, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { NhatKyGuiEmailService } from 'src/app/services/tien-ich/nhat-ky-gui-email.service';

@Component({
  selector: 'app-gui-bien-ban-xoa-bo-modal',
  templateUrl: './gui-bien-ban-xoa-bo-modal.component.html',
  styleUrls: ['./gui-bien-ban-xoa-bo-modal.component.scss']
})
export class GuiBienBanXoaBoModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() hoaDonBiDieuChinh: any;
  @Input() isAddNew: boolean;
  @Input() isBBView: boolean = false;
  @Input() loaiEmail: LoaiEmail;
  @Input() isSystem: boolean = true;

  isboxEmailCcBcc = false;
  mainForm: FormGroup;
  spinning = false;
  sending = false;
  permission: boolean;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private bienBanDieuChinhService: BienBanDieuChinhService,
    private doiTuongService: DoiTuongService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private nhatKyGuiEmailService: NhatKyGuiEmailService
  ) {
  }
  ngOnInit() {
    console.log(this.data.trangThaiBienBan);
    this.createForm();
  }

  ToggleButton() {
    this.isboxEmailCcBcc = !this.isboxEmailCcBcc;
  }

  async createForm() {
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.hoaDonBiDieuChinh != null ? this.hoaDonBiDieuChinh.loaiApDungHoaDonDieuChinh == 1 ? `${this.hoaDonBiDieuChinh.mauSo}${this.hoaDonBiDieuChinh.kyHieu}` : `${this.hoaDonBiDieuChinh.mauSo}-${this.hoaDonBiDieuChinh.kyHieu}` : null, disabled: true }],
      tongTienThanhToanShow: [{ value: this.hoaDonBiDieuChinh != null ? formatNumber(Number(this.hoaDonBiDieuChinh.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + this.hoaDonBiDieuChinh.loaiTien.ma : null, disabled: true }],
      mauSoShow: [{ value: this.hoaDonBiDieuChinh != null ? this.hoaDonBiDieuChinh.mauSo : null, disabled: true }],
      soHoaDonShow: [{ value: this.hoaDonBiDieuChinh != null ? this.hoaDonBiDieuChinh.soHoaDon : null, disabled: true }],
      ngayHoaDonShow: [{ value: this.hoaDonBiDieuChinh != null ? moment(this.hoaDonBiDieuChinh.ngayHoaDon).format("DD/MM/YYYY") : null, disabled: true }],
      tenKhachHangShow: [{ value: this.hoaDonBiDieuChinh.tenKhachHang || this.hoaDonBiDieuChinh.hoTenNguoiMuaHang, disabled: true }],
      hoTenNguoiNhanHD: [{ value: null, disabled: !this.isAddNew }, [Validators.required]],
      emailNguoiNhanHD: [{ value: null, disabled: !this.isAddNew }, [Validators.required, CheckValidEmail]],
      cC: [{ value: null, disabled: !this.isAddNew }, [CheckValidEmail]],
      bCC: [{ value: null, disabled: !this.isAddNew }, [CheckValidEmail]],
      soDienThoaiNguoiNhanHD: [{ value: null, disabled: !this.isAddNew }],
    });

    this.mainForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    const doiTuong: any = await this.doiTuongService.GetByIdAsync(this.hoaDonBiDieuChinh.khachHangId);
    if (this.hoaDonBiDieuChinh.khachHangId && doiTuong && doiTuong.emailNguoiNhanHD) {
      this.mainForm.get('hoTenNguoiNhanHD').setValue(doiTuong.hoTenNguoiNhanHD);
      this.mainForm.get('emailNguoiNhanHD').setValue(doiTuong.emailNguoiNhanHD);
      this.mainForm.get('soDienThoaiNguoiNhanHD').setValue(doiTuong.soDienThoaiNguoiNhanHD);
    } else {
      this.mainForm.get('hoTenNguoiNhanHD').setValue(this.hoaDonBiDieuChinh.hoTenNguoiNhanHD);
      this.mainForm.get('emailNguoiNhanHD').setValue(this.hoaDonBiDieuChinh.emailNguoiNhanHD);
      this.mainForm.get('soDienThoaiNguoiNhanHD').setValue(this.hoaDonBiDieuChinh.soDienThoaiNguoiNhanHD);
    }

    var emailNguoiNhanHD = this.mainForm.get('emailNguoiNhanHD').value;
    if (!emailNguoiNhanHD) {
      this.nhatKyGuiEmailService.GetThongTinEmailDaGuiChoKHGanNhat(this.data.bienBanDieuChinhId)
        .subscribe((res: any) => {
          if (res) {
            this.mainForm.get('hoTenNguoiNhanHD').setValue(res.tenNguoiNhan);
            this.mainForm.get('emailNguoiNhanHD').setValue(getMainEmailFromDairy(res.emailNguoiNhan));
          }
        });
    }

    if (this.hoaDonBiDieuChinh.loaiApDungHoaDonDieuChinh != 1) {
      this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((rs: any) => {
        this.mainForm.get('tenKhachHangShow').setValue(rs.tenDonViBenB);
      })
    }
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
    this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((bb: any) => {
      const modal1 = this.modalService.create({
        nzTitle: "Biên bản điều chỉnh hóa đơn",
        nzContent: AddEditBienBanDieuChinhModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px', height: '96%' },
        nzComponentParams: {
          isAddNew: false,
          data: bb,
          isMoTuGDGuiHoaDon: true
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
      });
    });
  }

  GuiBienBan() {
    if (this.mainForm.invalid) {
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    const rawValue = this.mainForm.getRawValue();
    // this.spinning = true;
    this.sending = true;
    if (this.data.thongTinHoaDonId) {
      //nếu gửi email cho hóa đơn nhập từ chức năng nhập thông tin hóa đơn
      const params = {
        thongTinHoaDonId: this.data.thongTinHoaDonId,
        tenNguoiNhan: rawValue.hoTenNguoiNhanHD,
        toMail: rawValue.emailNguoiNhanHD,
        cC: rawValue.cC,
        bCC: rawValue.bCC,
        soDienThoaiNguoiNhan: rawValue.soDienThoaiNguoiNhanHD,
        loaiEmail: this.loaiEmail,
        link: this.env.apiUrl
      }

      this.hoaDonDienTuService.SendEmailThongTinHoaDon(params).subscribe(result => {
        if (result == true) {
          this.modal.destroy(true);
        }
        else {
          this.modal.destroy(false);
        }
      });
    }
    else {
      if (this.isSystem) {
        this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
          console.log(rs);
          console.log(this.data.bienBanDieuChinhId);
          this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((bb: any) => {
            if (bb.trangThaiBienBan < 2) {
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
                  msTitle: `Chưa ký biên bản`,
                  msContent: 'Biên bản điều chỉnh chưa ký. Để gửi, phải ký biên bản điều chỉnh',
                  msOnClose: () => {
                  },
                }
              });
              return;
            }

            if (bb.trangThaiBienBan >= 3) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzWidth: '500',
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Confirm,
                  msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                  msOnOk: () => { this.send(rs, rawValue); },
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                  msOnClose: () => {
                    this.spinning = false;
                    this.sending = false;
                    return;
                  },
                  msTitle: 'Gửi biên bản điều chỉnh hóa đơn',
                  msContent: 'Biên bản điều chỉnh hóa đơn đã được gửi cho khách hàng. Bạn có muốn gửi lại không?',
                },
                nzFooter: null
              });


            }

            else this.send(rs, rawValue);

          });

        });
      }
      else {
        this.thongTinHoaDonService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
          console.log(rs);
          console.log(this.data.bienBanDieuChinhId);
          this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((bb: any) => {
            if (bb.trangThaiBienBan < 2) {
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
                  msTitle: `Chưa ký biên bản`,
                  msContent: 'Biên bản điều chỉnh chưa ký. Để gửi, phải ký biên bản điều chỉnh',
                  msOnClose: () => {
                  },
                }
              });
              return;
            }

            if (bb.trangThaiBienBan >= 3) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzWidth: '500',
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Confirm,
                  msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                  msOnOk: () => { this.send(rs, rawValue); },
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                  msOnClose: () => {
                    this.spinning = false;
                    this.sending = false;
                    return;
                  },
                  msTitle: 'Gửi biên bản điều chỉnh hóa đơn',
                  msContent: 'Biên bản điều chỉnh hóa đơn đã được gửi cho khách hàng. Bạn có muốn gửi lại không?',
                },
                nzFooter: null
              });


            }

            else this.send(rs, rawValue);

          });

        });
      }
    }
  }

  capNhatSoBienBan() {
    if (this.data.trangThaiBienBan == 2) {
      this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((rs: any) => {
        rs.soBienBan = `BBDC-${this.hoaDonBiDieuChinh.mauSo}${this.hoaDonBiDieuChinh.kyHieu}-${this.hoaDonBiDieuChinh.soHoaDon}-${moment().format('DD/MM/YYYY-HH:MM:SS')}`;
        this.bienBanDieuChinhService.Update(rs).subscribe();
      })
    }
  }
  send(rs: any, rawValue: any) {
    const params = {
      bienBanDieuChinhId: this.data.bienBanDieuChinhId,
      hoaDon: rs,
      tenNguoiNhan: rawValue.hoTenNguoiNhanHD,
      toMail: rawValue.emailNguoiNhanHD,
      cC: rawValue.cC,
      bCC: rawValue.bCC,
      soDienThoaiNguoiNhan: rawValue.soDienThoaiNguoiNhanHD,
      loaiEmail: this.loaiEmail,
      link: this.env.apiUrl
    }

    this.hoaDonDienTuService.SendEmailAsync(params).subscribe((result) => {
      if (result) {
        var phanQuyen = localStorage.getItem('KTBKUserPermission');
        var thaoTacs = [];
        if (phanQuyen != 'true') {
          this.permission = false;
          var pq = JSON.parse(phanQuyen);
          thaoTacs = pq.functions.find(x => x.functionName == "KhachHang").thaoTacs;
        }
        if (this.hoaDonBiDieuChinh.khachHangId && (this.permission == true || (this.permission == false && thaoTacs.indexOf("DM_UPDATE") >= 0))) {
          this.doiTuongService.GetById(this.data.khachHangId).subscribe((rs: any) => {
            rs.hoTenNguoiNhanHD = rawValue.hoTenNguoiNhanHD;
            rs.emailNguoiNhanHD = rawValue.emailNguoiNhanHD;
            rs.soDienThoaiNguoiNhanHD = rawValue.soDienThoaiNguoiNhanHD;
            this.doiTuongService.Update(rs).subscribe();
          });
        }

        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.GuiBienBanDieuChinhHoaDon,
          doiTuongThaoTac: 'Biên bản điều chỉnh',
          refType: RefType.BienBanDieuChinh,
          thamChieu: null,
          moTaChiTiet: `Gửi biên bản điều chỉnh hóa đơn thành công.\nMẫu số: <${this.hoaDonBiDieuChinh.mauSo}>; Ký hiệu: <${this.hoaDonBiDieuChinh.kyHieu}>; Số hóa đơn: <${this.hoaDonBiDieuChinh.soHoaDon || '<Chưa cấp số>'}>; Ngày hóa đơn: <${moment(this.hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${rawValue.emailNguoiNhanHD}>; Email người nhận: <${getEmailWithBCCAndCC(rawValue.emailNguoiNhanHD, rawValue.cC, rawValue.bCC)}>;`,
          refId: this.data.bienBanDieuChinhId
        }).subscribe();

        this.capNhatSoBienBan();
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
  }

  ngAfterViewChecked() {

  }

  destroyModal() {
    this.modal.destroy();
  }
}

