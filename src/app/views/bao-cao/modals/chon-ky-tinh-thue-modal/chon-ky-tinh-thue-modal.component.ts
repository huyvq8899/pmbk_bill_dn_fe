import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

import * as moment from 'moment';
import { forkJoin, from } from 'rxjs';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy } from 'src/app/shared/chon-ky';
import { CookieConstant } from 'src/app/constants/constant';

@Component({
  selector: 'app-chon-ky-tinh-thue-modal',
  templateUrl: './chon-ky-tinh-thue-modal.component.html',
  styleUrls: ['./chon-ky-tinh-thue-modal.component.scss']
})
export class ChonKyTinhThueModalComponent implements OnInit {
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
  quys=[1, 2, 3, 4];
  thangs=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  kyOption = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'KyNopBaoCaoTinhHinhSuDungHoaDon').giaTri;


  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.baoCaoForm.reset();

    this.spinning = true;

    const currentQuanter = moment().quarter();
    const currentMonth = moment().month();
    console.log(currentMonth);
    const currentYear = moment().year();

    if (this.baoCao) {
      
      this.baoCaoForm.patchValue({
        ...this.baoCao
      });
      this.tuNgay = this.baoCao.tuNgay;
      this.denNgay = this.baoCao.denNgay;
    } else {
      if(this.kyOption == "Quy"){
        this.baoCaoForm.patchValue({
          quy: currentQuanter,
          nam: currentYear
        })
        this.changeQuy(currentQuanter);
      }
      else{ 
        this.baoCaoForm.patchValue({
          thang: currentMonth,
          nam: currentYear
        })
        this.changeThang(currentMonth);
      }
    }

    this.spinning = false;
  }

  xoaDieuKien(){
    this.ngOnInit();
  }

  changeKy(event: any){
    this.kyOption = event;
    console.log(this.kyOption);
    this.baoCao = null;
    this.ngOnInit();
  }

  createForm() {
    const currentYear = moment().year();
    const currentQuanter = moment().quarter();
    console.log(moment().month());
    const currentMonth = moment().month();

    this.baoCaoForm = this.fb.group({
      tuNgay: [null, [Validators.required]],
      denNgay: [null, [Validators.required]],
      quy: [currentQuanter],
      thang: [currentMonth],
      nam:[currentYear]
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

    if (data.denNgay < data.tuNgay) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }    
    
    this.modal.destroy(data);
  }

  destroyModal() {
    this.modal.destroy();
  }

  changeQuy(event: any){
    const nam = this.baoCaoForm.get('nam').value;
    console.log(event);
    switch(event){
      case 1:
        var fromDate = nam + "-01-01";
        var toDate=nam + "-03-31";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");
        break;
      case 2:
        var fromDate = nam + "-04-01";
        var toDate=nam + "-06-30";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");
        break;
      case 3:
        var fromDate = nam + "-07-01";
        var toDate=nam + "-09-30";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");
        break;
      case 4:
        var fromDate = nam + "-10-01";
        var toDate=nam + "-12-31";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");
        break;
    }

    this.baoCaoForm.get('tuNgay').setValue(this.tuNgay);
    console.log(this.tuNgay);
    this.baoCaoForm.get('denNgay').setValue(this.denNgay);
  }

  changeThang(event: any){
    const nam = this.baoCaoForm.get('nam').value;
    switch(event){
      case 1:
        this.tuNgay = moment(nam + "-01-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-01-31").format("YYYY-MM-DD");
        break;
      case 2:
        this.tuNgay = moment(nam + "-02-01").format("YYYY-MM-DD");
        if((nam % 4 == 0 && nam % 100 != 0) || (nam % 400 == 0))
          this.denNgay = moment(nam + "-02-29").format("YYYY-MM-DD");
        else this.denNgay = moment(nam + "-02-28").format("YYYY-MM-DD");
        break;
      case 3:
        this.tuNgay = moment(nam + "-03-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-03-31").format("YYYY-MM-DD");
        break;
      case 4:
        this.tuNgay = moment(nam + "-04-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-04-30").format("YYYY-MM-DD");
        break;
      case 5:
        this.tuNgay = moment(nam + "-05-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-05-31").format("YYYY-MM-DD");
        break;
      case 6:
        this.tuNgay = moment(nam + "-06-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-06-30").format("YYYY-MM-DD");
        break;
      case 7:
        this.tuNgay = moment(nam + "-07-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-07-31").format("YYYY-MM-DD");
        break;
      case 8:
        this.tuNgay = moment(nam + "-08-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-08-31").format("YYYY-MM-DD");
        break;
      case 9:
        this.tuNgay = moment(nam + "-09-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-09-30").format("YYYY-MM-DD");
        break;
      case 10:
        this.tuNgay = moment(nam + "-10-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-10-31").format("YYYY-MM-DD");
        break;
      case 11:
        this.tuNgay = moment(nam + "-11-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-11-30").format("YYYY-MM-DD");
        break;
      case 12:
        this.tuNgay = moment(nam + "-12-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-12-31").format("YYYY-MM-DD");
        break;
    }

    this.baoCaoForm.get('tuNgay').setValue(this.tuNgay);
    this.baoCaoForm.get('denNgay').setValue(this.denNgay);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }
}
