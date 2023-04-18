import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Message } from 'src/app/shared/Message';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { CheckValidPhone } from 'src/app/customValidators/check-valid-phone.validator';
import { Placeholder } from 'src/app/shared/placeholder';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { CheckValidMst } from 'src/app/customValidators/check-valid-mst.validator';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';

@Component({
  selector: 'app-add-edit-khach-hang-modal',
  templateUrl: './add-edit-khach-hang-modal.component.html',
  styleUrls: ['./add-edit-khach-hang-modal.component.scss']
})
export class AddEditKhachHangModalComponent extends ESCDanhMucKeyEventHandler implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  khachhangForm: FormGroup;
  spinning = false;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  permission: boolean = false;
  thaoTacs: any[] = [];
  isNgungTheoDoi = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private doiTuongService: DoiTuongService,
    private modalService: NzModalService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private hoaDonDienTuService: HoaDonDienTuService
  ) {
    super();
  }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "KhachHang").thaoTacs;
    }
    this.createForm();
  }

  createForm() {
    this.khachhangForm = this.fb.group({
      doiTuongId: [null],
      loaiKhachHang: [2],
      tenLoaiKhachHang: [null],
      maSoThue: [null, [CheckValidMst]],
      ma: [null, [Validators.required, Validators.maxLength(50)]],
      ten: [null, [Validators.required, Validators.maxLength(400)]],
      diaChi: [null, [Validators.maxLength(400)]],
      soTaiKhoanNganHang: [null, [Validators.maxLength(30)]],
      tenNganHang: [null, [Validators.maxLength(400)]],
      chiNhanh: [null],
      canCuocCongDan: [null, [Validators.maxLength(12)]],
      hoTenNguoiMuaHang: [null, [Validators.maxLength(100)]],
      emailNguoiMuaHang: [null, [CheckValidEmail, Validators.maxLength(50)]],
      soDienThoaiNguoiMuaHang: [null, [CheckValidPhone, Validators.maxLength(20)]],
      hoTenNguoiNhanHD: [null],
      emailNguoiNhanHD: [null, [CheckValidEmail, Validators.maxLength(50)]],
      soDienThoaiNguoiNhanHD: [null, [CheckValidPhone, Validators.maxLength(20)]],
      chucDanh: [null],
      tenDonVi: [null],
      isKhachHang: [true],
      isNhanVien: [false],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.khachhangForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.data) {
      this.isNgungTheoDoi = !this.data.status;
      this.khachhangForm.patchValue({
        ...this.data,
        doiTuongId: this.isCopy ? null : this.data.doiTuongId
      });
    }
  }

  async submitForm() {
    if (this.khachhangForm.invalid) {
      for (const i in this.khachhangForm.controls) {
        this.khachhangForm.controls[i].markAsTouched();
        this.khachhangForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.khachhangForm.getRawValue();
    data.status = !this.isNgungTheoDoi;

    const mstPattern1 = "^[0-9\-]{10}$";
    const mstPattern2 = "^[0-9\-]{14}$";
    if (data.maSoThue != null && data.maSoThue != '' && !data.maSoThue.match(mstPattern1) && !data.maSoThue.match(mstPattern2)) {
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
          msContent: 'Mã số thuế hợp lệ là: 1-Để trống; 2-Số ký tự của MST bằng 10 hoặc bằng 14.',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {  return; }
        },
      });
      this.spinning = false;
      return;
    } else {
      await this.saveChanges(data);
    }
  }

  async saveChanges(data: any) {
    let checkTrungMa = await this.doiTuongService.CheckTrungMaAsync(data);
    if (checkTrungMa) {
      if (this.isAddNew || this.isCopy) {

      } else {
        if (data.ma === this.data.ma) {
          checkTrungMa = false;
        }
      }
    }

    if (checkTrungMa) {
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
          msContent: 'Đã có khách hàng hoặc nhân viên sử dụng mã khách hàng <span class="colorChuYTrongThongBao"><b>' + data.ma + '</b></span> này. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {  return; }
        },
      });
      this.spinning = false;
      return;
    }

    if (this.isAddNew || this.isCopy) {
      this.doiTuongService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.KhachHang,
            thamChieu: 'Mã: ' + result.ma,
            refId: result.doiTuongId,
          }).subscribe();
          this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
          this.modal.destroy(result);
        } else {
          this.message.error('Lỗi thêm mới');
          this.modal.destroy(false);
        }
      }, _ => {
        this.spinning = false;
        this.message.success(TextGlobalConstants.TEXT_ERROR_API);

      });
    } else {
      this.doiTuongService.Update(data).subscribe(
        (result: any) => {
          this.spinning = false;
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.KhachHang,
              thamChieu: 'Mã: ' + data.ma,
              refId: data.doiTuongId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            if (this.data.ma !== data.ma) {
              this.hoaDonDienTuService.UpdateTruongMaKhiSuaTrongDanhMuc(0, data.doiTuongId, data.ma).subscribe();
            }

            this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
            this.modal.destroy(true);
          } else {
            this.message.error('Lỗi cập nhật');
            this.modal.destroy(false);
          }
        }, _ => {
          this.spinning = false;
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        });
    }
  }

  closeModal() {
    if (this.khachhangForm.dirty && this.isAddNew !== true) {
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
          }
        },
        nzFooter: null
      });
    } else {
      this.modal.destroy();
    }
  }

  blurHoTenNguoiMuaHang(value: any) {
    if (!this.khachhangForm.get('hoTenNguoiNhanHD').dirty && !this.data) {
      this.khachhangForm.get('hoTenNguoiNhanHD').setValue(value);
    }else if(!this.khachhangForm.get('hoTenNguoiNhanHD').dirty && !this.data.hoTenNguoiNhanHD){
      this.khachhangForm.get('hoTenNguoiNhanHD').setValue(value);
    }
  }

  blurEmailNguoiMuaHang(value: any) {
    if (!this.khachhangForm.get('emailNguoiNhanHD').dirty && !this.data) {
      this.khachhangForm.get('emailNguoiNhanHD').setValue(value);
    }else if(!this.khachhangForm.get('emailNguoiNhanHD').dirty && !this.data.emailNguoiNhanHD){
      this.khachhangForm.get('emailNguoiNhanHD').setValue(value);
    }
  }

  changeLoaiKhachHang(event: any) {
    this.khachhangForm.get('tenLoaiKhachHang').setValue(event === 1 ? 'Cá nhân' : 'Tổ chức');
  }
}
