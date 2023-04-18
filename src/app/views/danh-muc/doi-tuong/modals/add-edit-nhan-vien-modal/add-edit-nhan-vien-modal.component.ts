import { Component, OnInit, Input } from '@angular/core';
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
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';

@Component({
  selector: 'app-add-edit-nhan-vien-modal',
  templateUrl: './add-edit-nhan-vien-modal.component.html',
  styleUrls: ['./add-edit-nhan-vien-modal.component.scss']
})
export class AddEditNhanVienModalComponent extends ESCDanhMucKeyEventHandler implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  nhanVienForm: FormGroup;
  spinning = false;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  permission: boolean=false;
  thaoTacs: any[]=[];
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
      this.thaoTacs = pq.functions.find(x => x.functionName == "NhanVien").thaoTacs;
    }
    this.createForm();
  }

  createForm() {
    this.nhanVienForm = this.fb.group({
      doiTuongId: [null],
      loaiKhachHang: [null],
      tenLoaiKhachHang: [null],
      maSoThue: [null],
      ma: [null, [Validators.required, Validators.maxLength(50)]],
      ten: [null, [Validators.required, Validators.maxLength(400)]],
      diaChi: [null],
      soTaiKhoanNganHang: [null],
      tenNganHang: [null],
      chiNhanh: [null],
      hoTenNguoiMuaHang: [null],
      emailNguoiMuaHang: [null],
      soDienThoaiNguoiMuaHang: [null],
      hoTenNguoiNhanHD: [null],
      emailNguoiNhanHD: [null, [CheckValidEmail]],
      soDienThoaiNguoiNhanHD: [null, [CheckValidPhone]],
      chucDanh: [null],
      tenDonVi: [null],
      isKhachHang: [false],
      isNhanVien: [true],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.nhanVienForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.data) {
      this.isNgungTheoDoi = !this.data.status;
      this.nhanVienForm.patchValue({
        ...this.data,
        doiTuongId: this.isCopy ? null : this.data.doiTuongId
      });
    }
  }

  async submitForm() {
    if (this.nhanVienForm.invalid) {
      for (const i in this.nhanVienForm.controls) {
        this.nhanVienForm.controls[i].markAsTouched();
        this.nhanVienForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.nhanVienForm.getRawValue();
    data.status = !this.isNgungTheoDoi;
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
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: `Kiểm tra lại`,
          msContent: `Đã có khách hàng hoặc nhân viên sử dụng mã nhân viên <b>${data.ma}</b> này. Vui lòng kiểm tra lại!. `,
          msOnClose: () => {
          },
        }
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
            refType: RefType.NhanVien,
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
              refType: RefType.NhanVien,
              thamChieu: 'Mã: ' + data.ma,
              refId: data.doiTuongId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            if (this.data.ma !== data.ma) {
              this.hoaDonDienTuService.UpdateTruongMaKhiSuaTrongDanhMuc(1, data.doiTuongId, data.ma).subscribe();
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
    if (this.nhanVienForm.dirty && this.isAddNew !== true) {
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

  changeIsKhachHang(event: any) {
    if (event) {
      this.nhanVienForm.get('loaiKhachHang').setValue(1);
    } else {
      this.nhanVienForm.get('loaiKhachHang').setValue(null);
    }
  }
}
