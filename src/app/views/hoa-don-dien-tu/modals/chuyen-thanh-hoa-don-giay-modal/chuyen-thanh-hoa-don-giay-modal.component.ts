import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import * as printJS from 'print-js';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { getTenLoaiHoaDon, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { formatNumber } from '@angular/common';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-chuyen-thanh-hoa-don-giay-modal',
  templateUrl: './chuyen-thanh-hoa-don-giay-modal.component.html',
  styleUrls: ['./chuyen-thanh-hoa-don-giay-modal.component.scss']
})
export class ChuyenThanhHoaDonGiayModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() isTraCuu: boolean;
  mainForm: FormGroup;
  nguoiChuyenDois: any[] = [];
  ngayChuyenDoiLaNgayHoaDon = false;
  user: any;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private doiTuongService: DoiTuongService,
    private nhatKyTruyCapService: NhatKyTruyCapService
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

    // this.getDoiTuongs();
    this.createForm();
  }

  getDoiTuongs() {
    if(!this.isTraCuu)
    this.doiTuongService.GetAllNhanVien().subscribe((rs: any) => {
      this.nguoiChuyenDois = rs;
    })
    else{
      this.doiTuongService.GetAllNhanVien_TraCuu(this.data.hoaDonDienTuId).subscribe((rs: any) => {
        this.nguoiChuyenDois = rs;
      })
    }
  }
  createForm() {
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.data.mauSo + this.data.kyHieu, disabled: true }],
      soHoaDonShow: [{ value: this.data.soHoaDon || "<Chưa cấp số>", disabled: true }],
      ngayHoaDonShow: [{ value: moment(this.data.ngayHoaDon).format("DD/MM/YYYY"), disabled: true }],
      tenKhachHangShow: [{ value: this.data.tenKhachHang || this.data.hoTenNguoiMuaHang, disabled: true }],
      tongTienThanhToanShow: [{value: formatNumber(Number(this.data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + this.data.loaiTien.ma, disabled: true}],
      nguoiChuyenDoi: [this.user ? this.user.fullName : null, [Validators.required]],
      ngayChuyenDoi: [moment().format("YYYY-MM-DD"), [Validators.required]],
    });
  }

  view() {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    if(!this.isTraCuu){
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
            const pathPrint = rs.filePDF;
            showModalPreviewPDF(this.modalService, `${this.env.apiUrl}/${pathPrint}`);
            this.message.remove(id);
          }, (err) => {
            this.message.warning("Lỗi khi xem hóa đơn");
            this.message.remove(id);
          });
      });
    }
    else{
      this.hoaDonDienTuService.GetById_TraCuu(this.data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF_TraCuu(res).subscribe((rs: any) => {
            const pathPrint = rs.filePDF;
            showModalPreviewPDF(this.modalService, `${this.env.apiUrl}/${pathPrint}`);
            this.message.remove(id);
          }, (err) => {
            this.message.warning("Lỗi khi xem hóa đơn");
            this.message.remove(id);
          });
      });
    }
  }

  changeCheckNgayCD(event: any) {
    if (event == true) {
      const ngayKy = this.data.ngayKy;
      this.mainForm.get('ngayChuyenDoi').setValue(moment(ngayKy).format("YYYY-MM-DD"));
      this.mainForm.get('ngayChuyenDoi').disable();
    }
    else{
      this.mainForm.get('ngayChuyenDoi').setValue(this.data.ngayChuyenDoi ? moment(this.data.ngayChuyenDoi).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"));
      this.mainForm.get('ngayChuyenDoi').enable();
    }
  }

  ChuyenDoiHoaDon() {
    if (this.mainForm.invalid) {
      let invalid = false;
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
        if (invalid === false && this.mainForm.controls[i].invalid) {
          invalid = true;
        }
      }

      if(invalid){
        setStyleTooltipError(true);
      }

      return;
    }

    const rawValue = this.mainForm.getRawValue();
    if(moment(rawValue.ngayChuyenDoi).format("YYYY-MM-DD") < moment(this.data.ngayKy).format("YYYY-MM-DD")){
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
          msContent: `Ngày chuyển đổi thành hóa đơn giấy không được nhỏ hơn ngày ký điện tử <span class="cssyellow">${moment(this.data.ngayKy).format("DD/MM/YYYY")}</span>. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      return;
    }

    const params = {
      hoaDonDienTuId: this.data.hoaDonDienTuId,
      nguoiChuyenDoi: rawValue.nguoiChuyenDoi,
      ngayChuyenDoi: rawValue.ngayChuyenDoi,
      hoaDonDienTuViewModel : this.data
    };

    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    if(!this.isTraCuu){
      this.hoaDonDienTuService.ConvertToHoaDonGiay(params).subscribe((result: any) => {
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonGiay,
            doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.data.loaiHoaDon),
            refType: RefType.HoaDonDienTu,
            thamChieu: null,
            moTaChiTiet: `Mẫu số: <${this.data.mauSo}>; Ký hiệu: <${this.data.kyHieu}>; Số hóa đơn: <${this.data.soHoaDon}>`,
            refId: this.data.hoaDonDienTuId
          }).subscribe();

          // this.modalService.create({
          //   nzContent: MessageBoxModalComponent,
          //   nzMaskClosable: false,
          //   nzClosable: false,
          //   nzKeyboard: false,
          //   nzWidth: 400,
          //   nzStyle: { top: '100px' },
          //   nzBodyStyle: { padding: '1px' },
          //   nzComponentParams: {
          //     msTitle: `Chuyển đổi thành hóa đơn giấy`,
          //     msContent: `Đã hoàn thành việc chuyển đổi thành hóa đơn giấy`,
          //     msMessageType: MessageType.Info,
          //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          //     msOnClose: ()=>{}
          //   }
          // })
          this.message.success('Chuyển đổi thành hóa đơn giấy thành công',{
            nzDuration:5000
          })

          const link = window.URL.createObjectURL(result);
          printJS(link);
          this.message.remove(id);
          this.modal.destroy(true);
        }
        else {
          this.message.remove(id);
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
              msContent: `Chuyển đổi hóa đơn thành hóa đơn giấy không thành công. Vui lòng kiểm tra lại!`,
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: ()=>{}
            }
          })
          this.modal.destroy(false);
        }
      });
    }
    else{
      this.hoaDonDienTuService.ConvertToHoaDonGiay_TraCuu(params).subscribe((result: any) => {
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonGiay,
            doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.data.loaiHoaDon),
            refType: RefType.HoaDonDienTu,
            thamChieu: null,
            moTaChiTiet: `Mẫu số: <${this.data.mauSo}>; Ký hiệu: <${this.data.kyHieu}>; Số hóa đơn: <${this.data.soHoaDon}>`,
            refId: this.data.hoaDonDienTuId
          }).subscribe();

          this.message.success('Chuyển đổi thành công');

          const link = window.URL.createObjectURL(result);
          printJS(link);
          this.message.remove(id);
          this.modal.destroy(true);
        }
        else {
          this.message.remove(id);
          this.message.error(result.loi);
          this.modal.destroy(false);
        }
      });
    }
  }
  ngAfterViewChecked() {

  }

  destroyModal() {
    this.modal.destroy();
  }
}
