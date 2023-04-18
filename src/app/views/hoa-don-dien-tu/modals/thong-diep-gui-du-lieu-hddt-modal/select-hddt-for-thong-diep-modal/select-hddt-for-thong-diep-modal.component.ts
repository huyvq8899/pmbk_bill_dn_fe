import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig } from 'src/app/shared/global';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-select-hddt-for-thong-diep-modal',
  templateUrl: './select-hddt-for-thong-diep-modal.component.html',
  styleUrls: ['./select-hddt-for-thong-diep-modal.component.scss']
})
export class SelectHDDTForThongDiepModalComponent implements OnInit {
  @Input() timKiemTheos: any[];
  @Input() loaiThongDiep: any;
  form: FormGroup;
  kys: any[] = GetList();
  spinning = false;
  listData = [];
  total = 0;
  dataSelected = null;
  //checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  // fix table
  widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  isShowChecked = true;

  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.loaiThongDiep === MLTDiep.TDGHDDTTCQTCapMa) {
      this.isShowChecked = false;
      this.widthConfig.splice(0, 1);
      this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
    }

    this.createForm();

    this.changeKy(5);
  }

  createForm() {
    this.form = this.fb.group({
      ky: 5,
      fromDate: [null],
      toDate: [null],
      giaTri: [null]
    });

    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }

  changeKy(event: any) {
    const params = this.form.getRawValue();
    SetDate(event, params);
    this.form.patchValue({
      fromDate: params.fromDate,
      toDate: params.toDate
    });
  }

  blurDate() {
    const params = this.form.getRawValue();
    const ky = GetKy(params);
    this.form.get('ky').setValue(ky);
  }

  submitForm() {
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    const checkedList = this.listData.filter(x => x.checked === true);
    if (checkedList.length === 0) {
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
          msContent: 'Bạn cần phải chọn ít nhất 1 hóa đơn. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          },
        }
      });
      this.spinning = false;
      return;
    }

    this.modalRef.destroy(checkedList);
  }

  closeModal() {
    this.modalRef.destroy();
  }

  getData() {
    this.spinning = true;
    const params = this.form.getRawValue();

    this.hoaDonDienTuService.GetListHoaDonForThongDiep(this.loaiThongDiep, params)
      .subscribe((res: any[]) => {
        if (res) {
          this.listData = res;
          this.total = res.length;
          this.spinning = false;  
        }
      });
  }

  selectedRow(data: any) {
    if (this.isShowChecked) {
      return;
    }
    this.dataSelected = data;
    data.checked = true;
    this.listData.forEach(element => {
      if (element !== data) {
        element.checked = false;
      }
    });
  }

   // Checkbox
   refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listData.every(item => item.checked === true);
    this.isIndeterminate = this.listData.some(item => item.checked === true && !this.isAllDisplayDataChecked);
  }

  checkAll(value: boolean): void {
    this.listData.forEach(x => x.checked = value);
    this.refreshStatus();
  }
}
