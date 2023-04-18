import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Message } from 'src/app/shared/Message';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { Placeholder } from 'src/app/shared/placeholder';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { PagingParams } from 'src/app/models/PagingParams';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';

@Component({
  selector: 'app-add-edit-loai-tien-modal',
  templateUrl: './add-edit-loai-tien-modal.component.html',
  styleUrls: ['./add-edit-loai-tien-modal.component.scss']
})
export class AddEditLoaiTienModalComponent extends ESCDanhMucKeyEventHandler implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  loaiTienForm: FormGroup;
  spinning = false;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  permission: boolean = false;
  thaoTacs: any[] = [];
  listLoaiTien: any[] = [];
  isNgungTheoDoi = false;
  params: PagingParams = {
    PageNumber: 1,
    PageSize: -1,
    Keyword: '',
    SortKey: '',
    Filter: {}
  };
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private loaiTienService: LoaiTienService,
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
      this.thaoTacs = pq.functions.find(x => x.functionName == "LoaiTien").thaoTacs;
    }
    this.createForm();
  }

  createForm() {
    this.loaiTienForm = this.fb.group({
      loaiTienId: [null],
      ma: [null, [Validators.required, Validators.maxLength(3)]],
      ten: [null, [Validators.required]],
      tyGiaQuyDoi: [0],
      sapXep: [1],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.loaiTienForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.data) {
      this.isNgungTheoDoi = !this.data.status;

      this.loaiTienForm.patchValue({
        ...this.data,
        loaiTienId: this.isCopy ? null : this.data.loaiTienId,
      });
    }
  }

  async submitForm() {
    if (this.loaiTienForm.invalid) {
      for (const i in this.loaiTienForm.controls) {
        this.loaiTienForm.controls[i].markAsTouched();
        this.loaiTienForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.spinning = true;
    const data = this.loaiTienForm.getRawValue();
    data.status = !this.isNgungTheoDoi;

    let checkTrungMa = await this.loaiTienService.CheckTrungMaAsync(data);
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
          msContent: 'Mã loại tiền đã tồn tại. Vui lòng kiểm tra lại!.',
          msOnClose: () => {
          },
        }
      });

      this.spinning = false;
      return;
    }

    if (this.isAddNew || this.isCopy) {

      this.loaiTienService.Insert(data).subscribe((result: any) => {
        this.spinning = false;
        if (result) {
          this.loaiTienService.GetAllPaging(this.params).subscribe(async (dataList: any) => {
            await dataList.items.forEach((item: any, index: any) => {
              item.sapXep = index==0 ? 1 : index + 1;
            });
            this.listLoaiTien = dataList.items;
            this.loaiTienService.UpdateRange(this.listLoaiTien).subscribe();
          });
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.LoaiTien,
            thamChieu: 'Mã: ' + result.ma,
            refId: result.loaiTienId,
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
      this.loaiTienService.Update(data).subscribe(
        (result: any) => {
          this.spinning = false;
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.LoaiTien,
              thamChieu: 'Mã: ' + data.ma,
              refId: data.loaiTienId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            if (this.data.ma !== data.ma) {
              this.hoaDonDienTuService.UpdateTruongMaKhiSuaTrongDanhMuc(3, data.loaiTienId, data.ma).subscribe();
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
    if (this.loaiTienForm.dirty && this.isAddNew !== true) {
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
