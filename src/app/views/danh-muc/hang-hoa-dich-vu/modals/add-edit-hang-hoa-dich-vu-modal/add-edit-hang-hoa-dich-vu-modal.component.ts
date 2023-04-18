import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { getThueGTGTs, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { Placeholder } from 'src/app/shared/placeholder';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { forkJoin } from 'rxjs';
import { DonViTinhService } from 'src/app/services/danh-muc/don-vi-tinh.service';
import { AddEditDonViTinhModalComponent } from '../add-edit-don-vi-tinh-modal/add-edit-don-vi-tinh-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';

@Component({
  selector: 'app-add-edit-hang-hoa-dich-vu-modal',
  templateUrl: './add-edit-hang-hoa-dich-vu-modal.component.html',
  styleUrls: ['./add-edit-hang-hoa-dich-vu-modal.component.scss']
})
export class AddEditHangHoaDichVuModalComponent extends ESCDanhMucKeyEventHandler implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  donViTinhs = [];
  thueGTGTs = getThueGTGTs();
  hhdvForm: FormGroup;
  spinning = false;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  overlayStyle = {
    width: '400px'
  };
  boolPhatSinhBanHangTheoDGSauThue = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'PhatSinhBanHangTheoDGSauThue').giaTri;
  permission: boolean=false;
  thaoTacs: any[]=[];
  isNgungTheoDoi = false;
  loadingSearchDropdown = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hangHoaDichVuService: HangHoaDichVuService,
    private donViTinhService: DonViTinhService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
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
      this.thaoTacs = pq.functions.find(x => x.functionName == "HangHoaDichVu").thaoTacs;
    }
    this.createForm();
  }

  createForm() {
    this.hhdvForm = this.fb.group({
      hangHoaDichVuId: [null],
      ma: [null, [Validators.required, Validators.maxLength(50)]],
      ten: [null, [Validators.required, Validators.maxLength(500)]],
      donGiaBan: [0],
      isGiaBanLaDonGiaSauThue: [false],
      //vì code cũ lấy ra danh sách thuế đang để kiểu chuỗi nên cho giá trị chuỗi = '10'
      thueGTGT: ['10'],
      tyLeChietKhau: [0],
      moTa: [null],
      donViTinhId: [null],
      tenDonViTinh: [null],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.hhdvForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.spinning = false;

      this.donViTinhs = res[0];

      if (this.data) {
      this.isNgungTheoDoi = !this.data.status;
      this.hhdvForm.patchValue({
          ...this.data,
          hangHoaDichVuId: this.isCopy ? null : this.data.hangHoaDichVuId,
          //vì code cũ lấy ra danh sách thuế đang để kiểu chuỗi nên chuyển sang chuỗi
          thueGTGT: this.data.thueGTGT.toString()
        });
      }
    });
  }

  forkJoin() {
    return forkJoin([
      this.donViTinhService.GetAll({ isActive: true })
    ]);
  }

  async submitForm() {
    if (this.hhdvForm.invalid) {
      for (const i in this.hhdvForm.controls) {
        this.hhdvForm.controls[i].markAsTouched();
        this.hhdvForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.hhdvForm.getRawValue();
    data.status = !this.isNgungTheoDoi;

    let checkTrungMa = await this.hangHoaDichVuService.CheckTrungMaAsync(data);
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
          msContent: 'Mã hàng hóa vật tư đã tồn tại. Vui lòng kiểm tra lại!.',
          msOnClose: () => {
          },
        }
      });
      this.spinning = false;
      return;
    }

    if (this.isAddNew || this.isCopy) {
      this.hangHoaDichVuService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.HangHoaDichVu,
            thamChieu: 'Mã: ' + result.ma,
            refId: result.hangHoaDichVuId,
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
      this.hangHoaDichVuService.Update(data).subscribe(
        (result: any) => {
          this.spinning = false;
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.HangHoaDichVu,
              thamChieu: 'Mã: ' + data.ma,
              refId: data.hangHoaDichVuId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            if (this.data.ma !== data.ma) {
              this.hoaDonDienTuService.UpdateTruongMaKhiSuaTrongDanhMuc(2, data.hangHoaDichVuId, data.ma).subscribe();
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
    if (this.hhdvForm.dirty && this.isAddNew !== true) {
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

  addItemDonViTinhModal() {
    const modal2 = this.modalService.create({
      nzTitle: 'Thêm đơn vị tính',
      nzContent: AddEditDonViTinhModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: null
    });
    modal2.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.donViTinhService.GetAll({ isActive: true })
          .subscribe((res: any[]) => {
            this.donViTinhs = res;
            this.hhdvForm.get('donViTinhId').setValue(rs.donViTinhId);
          });
      }
    });
  }

  changeDonViTinh(event: any) {
    if (event) {
      const item = this.donViTinhs.find(x => x.donViTinhId === event);
      this.hhdvForm.get('tenDonViTinh').setValue(item.ten);
    } else {
      this.hhdvForm.get('tenDonViTinh').setValue(null);
    }
  }

  blurDecimal(event: any, key: any) {
    if (!event.target.value) {
      this.hhdvForm.get(key).setValue(0);
    }
  }
}
