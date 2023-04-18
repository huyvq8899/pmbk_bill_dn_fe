import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy } from 'src/app/shared/chon-ky';

@Component({
  selector: 'app-chon-bao-cao-chi-tiet-hoa-don-modal',
  templateUrl: './chon-bao-cao-chi-tiet-hoa-don-modal.component.html',
  styleUrls: ['./chon-bao-cao-chi-tiet-hoa-don-modal.component.scss']
})
export class ChonBaoCaoChiTietHoaDonModalComponent implements OnInit {
  @Input() baoCao: any;
  searchCustomerOverlayStyle = {
    width: '200px'
  };
  baoCaoForm: FormGroup;
  spinning: boolean;
  indeterminate = false;
  maLoaiTien: string;
  congGop = false;
  hienThiLuyKe = false;
  tuNgay: any;
  denNgay:any;
  kyBaoCaos: any[] = [
    {
      ma: 0,
      ten: "Hôm nay"
    },
    {
      ma: 1,
      ten: "Tuần này"
    },
    {
      ma: 2,
      ten: "Đầu tuần đến hiện tại"
    },
    {
      ma: 3,
      ten: "Tháng này"
    },
    {
      ma: 4,
      ten: "Đầu tháng đến hiện tại"
    },
    {
      ma: 5,
      ten: "Quý này"
    },
    {
      ma: 6,
      ten: "Đầu quý đến hiện tại"
    },
    {
      ma: 7,
      ten: "Năm nay"
    },
    {
      ma: 8,
      ten: "Đầu năm đến hiện tại"
    },
    {
      ma: 9,
      ten: "6 tháng đầu năm"
    },
    {
      ma: 10,
      ten: "6 tháng cuối năm"
    },
    {
      ma: 11,
      ten: "Tháng 1"
    },
    {
      ma: 12,
      ten: "Tháng 2"
    },
    {
      ma: 13,
      ten: "Tháng 3"
    },
    {
      ma: 14,
      ten: "Tháng 4"
    },
    {
      ma: 15,
      ten: "Tháng 5"
    },
    {
      ma: 16,
      ten: "Tháng 6"
    },
    {
      ma: 17,
      ten: "Tháng 7"
    },
    {
      ma: 18,
      ten: "Tháng 8"
    },
    {
      ma: 19,
      ten: "Tháng 9"
    },
    {
      ma: 20,
      ten: "Tháng 10"
    },
    {
      ma: 21,
      ten: "Tháng 11"
    },
    {
      ma: 22,
      ten: "Tháng 12"
    },
    {
      ma: 23,
      ten: 'Quý 1'
    },
    {
      ma: 24,
      ten: 'Quý 2'
    },
    {
      ma: 25,
      ten: 'Quý 3'
    },
    {
      ma: 26,
      ten: 'Quý 4'
    },
    {
      ma: 27,
      ten: "Hôm qua"
    },
    {
      ma: 28,
      ten: "Tuần trước"
    },
    {
      ma: 29,
      ten: "Tháng trước"
    },
    {
      ma: 30,
      ten: "Quý trước"
    },
    {
      ma: 31,
      ten: "Năm trước"
    },
    {
      ma: 32,
      ten: "Tuần sau"
    },
    {
      ma: 33,
      ten: "Tháng sau"
    },
    {
      ma: 34,
      ten: "Quý sau"
    },
    {
      ma: 35,
      ten: "Năm sau"
    },
    {
      ma: 36,
      ten: "Tùy chọn"
    },
  ];
  loaiKey=1;
  key = "";
  keyword = "";
  kyBaoCao: any;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.baoCaoForm.reset();

    this.spinning = true;
    this.congGop = false;
    this.hienThiLuyKe = false;
    this.tuNgay = moment().startOf('month').format('YYYY-MM-DD');
    this.denNgay = moment().format('YYYY-MM-DD');

    if (this.baoCao) {
      
      this.baoCaoForm.patchValue({
        ...this.baoCao
      });
      this.tuNgay = this.baoCao.tuNgay;
      this.denNgay = this.baoCao.denNgay;
    } else {
      this.baoCaoForm.patchValue({
        tuNgay: this.tuNgay,
        denNgay: this.denNgay,
      });
    }

    
    this.setDate(this.tuNgay, 1);
    this.setDate(this.denNgay, 2);
    this.spinning = false;
  }

  xoaDieuKien(){
    this.ngOnInit();
  }

  createForm() {
    this.baoCaoForm = this.fb.group({
      tuNgay: [null, [Validators.required]],
      denNgay: [null, [Validators.required]],
      congGopTheoHoaDon: [{value: false}]
    });
  }

  saveChanges() {
    if (this.baoCaoForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.baoCaoForm.controls) {
        this.baoCaoForm.controls[i].markAsDirty();
        this.baoCaoForm.controls[i].updateValueAndValidity();
      }

      return;
    }

    const data = this.baoCaoForm.getRawValue();
    console.log(data);
    data.kyBaoCao = this.kyBaoCao;
    data.key = this.key;
    data.keyword = this.keyword;


    if (data.denNgay < data.tuNgay) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    
    this.modal.destroy(data);
  }

  destroyModal() {
    this.modal.destroy();
  }

  changeLoaiKey(event: any){
    if(event == "1"){
      this.key = "soHoaDon";
    }
    else if(event == "2"){
      this.key = "maSoThue";
    }
    else if(event == "3"){
      this.key = "tenKhachHang";
    }
    else{
      this.key = "hoTenNguoiMuaHang";
    }
  }

  changeKyBaoCao(event: any) {
    this.kyBaoCao = event;

    switch (this.kyBaoCao) {
      case 0: {
        this.tuNgay = moment().format('YYYY-MM-DD');
        this.denNgay = moment().format('YYYY-MM-DD');
        break;
      }
      case 1: {
        this.tuNgay = moment().startOf('week').add(1, 'd' ).format('YYYY-MM-DD');
        this.denNgay = moment().endOf('week').add(1, 'd' ).format('YYYY-MM-DD');
        break;
      }
      case 2: {
        this.tuNgay = moment().weekday() == 0 ? moment().add(-1, 'w').startOf('week').add(1, 'd' ).format('YYYY-MM-DD') : moment().startOf('week').add(1, 'd' ).format('YYYY-MM-DD');
        this.denNgay = moment().format('YYYY-MM-DD');
        break;
      }
      case 3: {
        this.tuNgay = moment().startOf('month').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 4: {
        this.tuNgay = moment().startOf('month').format('YYYY-MM-DD');
        this.denNgay = moment().format('YYYY-MM-DD');
        break;
      }
      case 5: {
        this.tuNgay = moment().startOf('quarter').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('quarter').format('YYYY-MM-DD');
        break;
      }
      case 6: {
        this.tuNgay = moment().startOf('quarter').format('YYYY-MM-DD');
        this.denNgay = moment().format('YYYY-MM-DD');
        break;
      }
      case 7: {
        this.tuNgay = moment().startOf('year').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').format('YYYY-MM-DD');
        break;
      }
      case 8: {
        this.tuNgay = moment().startOf('year').format('YYYY-MM-DD');
        this.denNgay = moment().format('YYYY-MM-DD');
        break;
      }
      case 9: {
        this.tuNgay = moment().startOf('year').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').add(-6, 'M').format('YYYY-MM-DD');
        break;
      }
      case 10: {
        this.tuNgay = moment().startOf('year').add(6, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').format('YYYY-MM-DD');
        break;
      }
      case 11: {
        this.tuNgay = moment().startOf('year').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 12: {
        this.tuNgay = moment().startOf('year').add(1, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(1, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 13: {
        this.tuNgay = moment().startOf('year').add(2, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(2, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 14: {
        this.tuNgay = moment().startOf('year').add(1, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(1, 'Q').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 15: {
        this.tuNgay = moment().startOf('year').add(4, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(4, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 16: {
        this.tuNgay = moment().startOf('year').add(5, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(5, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 17: {
        this.tuNgay = moment().startOf('year').add(2, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(2, 'Q').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 18: {
        this.tuNgay = moment().startOf('year').add(7, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(7, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 19: {
        this.tuNgay = moment().startOf('year').add(8, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(8, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 20: {
        this.tuNgay = moment().startOf('year').add(3, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(3, 'Q').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 21: {
        this.tuNgay = moment().startOf('year').add(10, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(10, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 22: {
        this.tuNgay = moment().startOf('year').add(11, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').format('YYYY-MM-DD');
        break;
      }
      case 23: {
        this.tuNgay = moment().startOf('year').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(2, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 24: {
        this.tuNgay = moment().startOf('year').add(1, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(5, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 25: {
        this.tuNgay = moment().startOf('year').add(2, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(8, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 26: {
        this.tuNgay = moment().startOf('year').add(3, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().startOf('year').add(11, 'M').endOf('month').format('YYYY-MM-DD');
        break;
      }
      case 27: {
        this.tuNgay = moment().add(-1, 'd').format('YYYY-MM-DD');
        this.denNgay = moment().add(-1, 'd').format('YYYY-MM-DD');
        break;
      }
      case 28: {
        this.tuNgay = moment().startOf('week').add(-1, 'w').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('week').add(-1, 'w').format('YYYY-MM-DD');
        break;
      }
      case 29: {
        this.tuNgay = moment().startOf('month').add(-1, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('month').add(-1, 'M').format('YYYY-MM-DD');
        break;
      }
      case 30: {
        this.tuNgay = moment().startOf('quarter').add(-1, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('quarter').add(-1, 'Q').format('YYYY-MM-DD');
        break;
      }
      case 31: {
        this.tuNgay = moment().startOf('year').add(-1, 'y').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').add(-1, 'y').format('YYYY-MM-DD');
        break;
      }
      case 32: {
        this.tuNgay = moment().startOf('week').add(1, 'd' ).add(1, 'w').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('week').add(1, 'd' ).add(1, 'w').format('YYYY-MM-DD');
        break;
      }
      case 33: {
        this.tuNgay = moment().startOf('month').add(1, 'M').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('month').add(1, 'M').format('YYYY-MM-DD');
        break;
      }
      case 34: {
        this.tuNgay = moment().startOf('quarter').add(1, 'Q').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('quarter').add(1, 'Q').format('YYYY-MM-DD');
        break;
      }
      case 35: {
        this.tuNgay = moment().startOf('year').add(1, 'y').format('YYYY-MM-DD');
        this.denNgay = moment().endOf('year').add(1, 'y').format('YYYY-MM-DD');
        break;
      }
      case 36: {
        break;
      }
    }

    this.baoCaoForm.patchValue({
      tuNgay: this.tuNgay,
      denNgay: this.denNgay
    });
  }

  setDate(event: any, fromTo: any) {
    if (!moment(event, moment.ISO_8601, true).isValid()) return;
    var tuNgayTmp = this.tuNgay;
    var denNgayTmp = this.denNgay;

    if (fromTo === 1) {
      this.tuNgay = event;
      this.denNgay = denNgayTmp;
    }
    else {
      this.tuNgay = tuNgayTmp;
      this.denNgay = event;
    }

    if (this.tuNgay === moment().format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 0;
    else if ((this.tuNgay === moment().startOf('week').add(1, 'd' ).format('YYYY-MM-DD') || (this.tuNgay === moment().add(-1, 'w').startOf('week').add(1, 'd' ).format('YYYY-MM-DD') && moment().weekday() == 0)) && this.denNgay === moment().endOf('week').add(1, 'd' ).format('YYYY-MM-DD'))
      this.kyBaoCao = 1;
    else if (this.tuNgay === moment().startOf('week').add(1, 'd' ).format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 2;
    else if (this.tuNgay === moment().startOf('month').format('YYYY-MM-DD') && this.denNgay === moment().endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 3;
    else if (this.tuNgay === moment().startOf('month').format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 4;
    else if (this.tuNgay === moment().startOf('quarter').format('YYYY-MM-DD') && this.denNgay === moment().endOf('quarter').format('YYYY-MM-DD'))
      this.kyBaoCao = 5;
    else if (this.tuNgay === moment().startOf('quarter').format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 6;
    else if (this.tuNgay === moment().startOf('year').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').format('YYYY-MM-DD'))
      this.kyBaoCao = 7;
    else if (this.tuNgay === moment().startOf('year').format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 8;
    else if (this.tuNgay === moment().startOf('year').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').add(-6, 'M').format('YYYY-MM-DD'))
      this.kyBaoCao = 9;
    else if (this.tuNgay === moment().startOf('year').add(6, 'M').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').format('YYYY-MM-DD'))
      this.kyBaoCao = 10;
    else if (this.tuNgay === moment().startOf('year').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 11;
    else if (this.tuNgay === moment().startOf('year').add(1, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(1, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 12;
    else if (this.tuNgay === moment().startOf('year').add(2, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(2, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 13;
    else if (this.tuNgay === moment().startOf('week').format('YYYY-MM-DD') && this.denNgay === moment().format('YYYY-MM-DD'))
      this.kyBaoCao = 14;
    else if (this.tuNgay === moment().startOf('year').add(1, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(1, 'Q').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 15;
    else if (this.tuNgay === moment().startOf('year').add(5, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(5, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 16;
    else if (this.tuNgay === moment().startOf('year').add(2, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(2, 'Q').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 17;
    else if (this.tuNgay === moment().startOf('year').add(7, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(7, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 18;
    else if (this.tuNgay === moment().startOf('year').add(8, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(8, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 19;
    else if (this.tuNgay === moment().startOf('year').add(3, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(3, 'Q').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 20;
    else if (this.tuNgay === moment().startOf('year').add(10, 'M').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(10, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 21;
    else if (this.tuNgay === moment().startOf('year').add(11, 'M').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').format('YYYY-MM-DD'))
      this.kyBaoCao = 22;
    else if (this.tuNgay === moment().startOf('year').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(2, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 23;
    else if (this.tuNgay === moment().startOf('year').add(1, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(5, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 24;
    else if (this.tuNgay === moment().startOf('year').add(2, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(8, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 25;
    else if (this.tuNgay === moment().startOf('year').add(3, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().startOf('year').add(11, 'M').endOf('month').format('YYYY-MM-DD'))
      this.kyBaoCao = 26;
    else if (this.tuNgay === moment().add(-1, 'd').format('YYYY-MM-DD') && this.denNgay === moment().add(-1, 'd').format('YYYY-MM-DD'))
      this.kyBaoCao = 27;
    else if (this.tuNgay === moment().startOf('week').add(1, 'd' ).add(-1, 'w').format('YYYY-MM-DD') && moment().endOf('week').add(1, 'd' ).add(-1, 'w').format('YYYY-MM-DD'))
      this.kyBaoCao = 28;
    else if (this.tuNgay === moment().startOf('month').add(-1, 'M').format('YYYY-MM-DD') && this.denNgay === moment().endOf('month').add(-1, 'M').format('YYYY-MM-DD'))
      this.kyBaoCao = 29;
    else if (this.tuNgay === moment().startOf('quarter').add(-1, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().endOf('quarter').add(-1, 'Q').format('YYYY-MM-DD'))
      this.kyBaoCao = 30;
    else if (this.tuNgay === moment().startOf('year').add(-1, 'y').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').add(-1, 'y').format('YYYY-MM-DD'))
      this.kyBaoCao = 31;
    else if (this.tuNgay === moment().startOf('week').add(1, 'd' ).add(1, 'w').format('YYYY-MM-DD') && this.denNgay === moment().endOf('week').add(1, 'd' ).add(1, 'w').format('YYYY-MM-DD'))
      this.kyBaoCao = 32;
    else if (this.tuNgay === moment().startOf('month').add(1, 'M').format('YYYY-MM-DD') && this.denNgay === moment().endOf('month').add(1, 'M').format('YYYY-MM-DD'))
      this.kyBaoCao = 33;
    else if (this.tuNgay === moment().startOf('quarter').add(1, 'Q').format('YYYY-MM-DD') && this.denNgay === moment().endOf('quarter').add(1, 'Q').format('YYYY-MM-DD'))
      this.kyBaoCao = 34;
    else if (this.tuNgay === moment().startOf('year').add(1, 'y').format('YYYY-MM-DD') && this.denNgay === moment().endOf('year').add(1, 'y').format('YYYY-MM-DD'))
      this.kyBaoCao = 35;
    else
      this.kyBaoCao = 36;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }
  blurDate() {
    var displayData: PagingParams={
      fromDate: moment().format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD")
    }
    displayData.fromDate = this.baoCaoForm.get('tuNgay').value;
    displayData.toDate = this.baoCaoForm.get('denNgay').value;
    CheckValidDateV2(displayData);
    const ky = GetKy(displayData);
    this.baoCaoForm.patchValue({
      kyBaoCao: ky,
      tuNgay: displayData.fromDate,
      denNgay: displayData.toDate
    });
  }

}
