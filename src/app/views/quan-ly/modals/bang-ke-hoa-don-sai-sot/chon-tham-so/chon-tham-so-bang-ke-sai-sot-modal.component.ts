import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GetList, SetDate, GetKy } from 'src/app/shared/chon-ky';
import { CookieConstant } from 'src/app/constants/constant';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { BangKeHoaDonSaiSotModalComponent } from '../bang-ke-hoa-don-sai-sot-modal.component';
@Component({
  selector: 'app-chon-tham-so-bang-ke-sai-sot-modal',
  templateUrl: './chon-tham-so-bang-ke-sai-sot-modal.component.html',
  styleUrls: ['./chon-tham-so-bang-ke-sai-sot-modal.component.scss']
})
export class ChonThamSoBangKeSaiSotModalComponent implements OnInit {
  @Input() params: any = null;
  timKiemTheos = [
    {value: 'MauHoaDon', name: 'Ký hiệu hóa đơn', checked: false},
    {value: 'SoHoaDon', name: 'Số hóa đơn', checked: false},
    {value: 'NgayLapHoaDon', name: 'Ngày hóa đơn', checked: false},
  ];
  loaiThongBaos = [
    {value: 0, name: 'Tất cả'},
    {value: 1, name: 'Thông báo hủy/giải trình của NNT'},
    {value: 3, name: 'Thông báo hủy/giải trình của NNT (KHÁC)'},
    {value: 2, name: 'Thông báo hủy/giải trình của NNT theo thông báo của CQT'},
  ];

  form: FormGroup;
  kys: any[] = GetList();

  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.setDefaulThoiGian();

    if (this.params != null)
    {
      this.form.get('fromDate').setValue(this.params.tuNgay);
      this.form.get('toDate').setValue(this.params.denNgay);
      this.form.get('loaiThongke').setValue(this.params.loaiThongke.toString());
      this.form.get('loaiThongBao').setValue(this.params.loaiThongBaoSaiSot);
      this.blurDate();
      if (this.params.TimKiemTheo != null && this.params.TimKiemTheo != undefined)
      {
        if (this.params.TimKiemTheo.mauHoaDon != null && this.params.TimKiemTheo.mauHoaDon != '')
        {
          this.timKiemTheos.forEach(item2 => {
            if (item2.value == 'MauHoaDon')
            {
              item2.checked = true;
            }
          });
        }

        if (this.params.TimKiemTheo.soHoaDon != null && this.params.TimKiemTheo.soHoaDon != '')
        {
          this.timKiemTheos.forEach(item2 => {
            if (item2.value == 'SoHoaDon')
            {
              item2.checked = true;
            }
          });
        }

        if (this.params.TimKiemTheo.ngayLapHoaDon != null && this.params.TimKiemTheo.ngayLapHoaDon != '')
        {
          this.timKiemTheos.forEach(item2 => {
            if (item2.value == 'NgayLapHoaDon')
            {
              item2.checked = true;
            }
          });
        }
      }
      this.form.get('giaTri').setValue(this.params.giaTri);
    }
  }

  createForm() {
    this.form = this.fb.group({
      loaiThongke: '1',
      ky: 5,
      fromDate: [null],
      toDate: [null],
      giaTri: [null],
      loaiThongBao: 0
    });

    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }

  submitForm()
  {
    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      let giaTri = this.form.get('giaTri').value;
      if (giaTri == null || giaTri == '')
      {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }

    let params: any =
    {
      loaiThongke: parseInt(this.form.get('loaiThongke').value),
      tuNgay: this.form.get('fromDate').value,
      denNgay: this.form.get('toDate').value,
      loaiThongBaoSaiSot: this.form.get('loaiThongBao').value,
      khongHienThiThongTinGiongNhau: false,
      giaTri: this.form.get('giaTri').value,
      filterColumns: []
    };

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && this.form.get('giaTri').value) {
      var result = {};
      var giaTris = this.form.get('giaTri').value.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = (giaTris[i] != null && giaTris[i] != undefined)?giaTris[i]: null;
      }
      params.TimKiemTheo = result;
    } else {
      params.TimKiemTheo = null;
      params.TimKiemBatKy = params.giaTri;
    }

    if (this.params == null) //nếu là lần đầu mở form
    {
      this.modalService.create({
        nzTitle: 'Bảng kê hóa đơn xử lý sai sót',
        nzContent: BangKeHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '99%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          params: params
        },
        nzFooter: null
      });
    }

    this.modalRef.destroy(params);
  }

  //hàm này để bắt sự kiện onchange của textbox GiaTri
  changeGiaTri(event:any)
  {
    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      if (event == null || event == '')
      {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else
    {
      this.form.controls['giaTri'].clearValidators();
      this.form.controls['giaTri'].updateValueAndValidity();
    }
  }

  blurDate() {
    const params = this.form.getRawValue();
    const ky = GetKy(params);
    this.form.get('ky').setValue(ky);
  }

  changeKy(event: any) {
    const params = this.form.getRawValue();
    SetDate(event, params);
    this.form.patchValue({
      fromDate: params.fromDate,
      toDate: params.toDate
    });
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  setDefaulThoiGian()
  {
    let kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (kyKeKhaiThue == 'Quy')
    {
      this.changeKy(6);
      this.form.get('ky').setValue(6);
    }
    else if (kyKeKhaiThue == 'Thang')
    {
      this.changeKy(4);
      this.form.get('ky').setValue(4);
    }
  }

  //hàm này thay đổi loại thống kê
  changeLoaiThongKe(event: any)
  {
    if (event == '1')
    {
      //no code
    }
    else
    {
      this.timKiemTheos.forEach(item => {
        item.checked = false;
      });
      this.form.get('giaTri').setValue('');
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }
}
