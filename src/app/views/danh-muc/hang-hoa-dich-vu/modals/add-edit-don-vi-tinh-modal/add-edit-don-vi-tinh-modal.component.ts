import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Message } from 'src/app/shared/Message';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { Placeholder } from 'src/app/shared/placeholder';
import { DonViTinhService } from 'src/app/services/danh-muc/don-vi-tinh.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';

@Component({
  selector: 'app-add-edit-don-vi-tinh-modal',
  templateUrl: './add-edit-don-vi-tinh-modal.component.html',
  styleUrls: ['./add-edit-don-vi-tinh-modal.component.scss']
})
export class AddEditDonViTinhModalComponent extends ESCDanhMucKeyEventHandler implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  donViTinhForm: FormGroup;
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
      this.thaoTacs = pq.functions.find(x => x.functionName == "DonViTinh").thaoTacs;
    }

    this.createForm();
  }

  createForm() {
    this.donViTinhForm = this.fb.group({
      donViTinhId: [null],
      ten: [null, [Validators.required, Validators.maxLength(50)]],
      moTa: [null],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.donViTinhForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.data) {
      this.isNgungTheoDoi = !this.data.status;
      this.donViTinhForm.patchValue({
        ...this.data,
        donViTinhId: this.isCopy ? null : this.data.donViTinhId
      });
    }
  }

  async submitForm() {
    if (this.donViTinhForm.invalid) {
      for (const i in this.donViTinhForm.controls) {
        this.donViTinhForm.controls[i].markAsTouched();
        this.donViTinhForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.donViTinhForm.getRawValue();
    data.status = !this.isNgungTheoDoi;
    let checkTrungMa = await this.donViTinhService.CheckTrungMaAsync(data);
    if (checkTrungMa) {
      if (this.isAddNew || this.isCopy) {

      } else {
        if (data.ten === this.data.ten) {
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
          msContent: 'Tên đơn vị đã tồn tại. Vui lòng kiểm tra lại!.',
          msOnClose: () => {
          },
        }
      });
      this.spinning = false;
      return;
    }

    if (this.isAddNew || this.isCopy) {
      this.donViTinhService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.DonViTinh,
            thamChieu: 'ĐVT: ' + result.ten,
            refId: result.donViTinhId,
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
      this.donViTinhService.Update(data).subscribe(
        (result: any) => {
          this.spinning = false;
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.DonViTinh,
              thamChieu: 'ĐVT: ' + data.ten,
              refId: data.donViTinhId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            if (this.data.ten !== data.ten) {
              this.hoaDonDienTuService.UpdateTruongMaKhiSuaTrongDanhMuc(4, data.donViTinhId, data.ten).subscribe();
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
    if (this.donViTinhForm.dirty && this.isAddNew !== true) {
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
}
