import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy, GetKy2, GetList2, SetDate2 } from 'src/app/shared/chon-ky';

@Component({
  selector: 'app-chon-bao-cao-modal',
  templateUrl: './chon-bao-cao-modal.component.html',
  styleUrls: ['./chon-bao-cao-modal.component.scss']
})
export class ChonBaoCaoModalComponent implements OnInit {
  @Input() baoCao: PagingParams;
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
  kyBaoCaos = GetList2();
  displayData: PagingParams={
    nam: moment().year(),
    Ky: 1,
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
  }
  kyBaoCao: any;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.spinning = true;
    this.congGop = false;
    this.hienThiLuyKe = false;

    if (this.baoCao) {
      this.displayData = this.baoCao;
    }

    this.spinning = false;
  }

  xoaDieuKien(){
    this.ngOnInit();
  }

  saveChanges() {
    if (this.displayData.toDate < this.displayData.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    
    this.modal.destroy(this.displayData);
  }

  destroyModal() {
    this.modal.destroy();
  }

  changeKyBaoCao(event: any) {
    SetDate2(event, this.displayData.nam, this.displayData);
  }

  setDate() {
    this.displayData.Ky = GetKy2(this.displayData, this.displayData.nam)
    if(this.displayData.Ky != 0){
      this.displayData.nam = (moment(this.displayData.toDate).year());
    }
  }

  changeNam(event: number){
    SetDate2(this.displayData.Ky, event, this.displayData);
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
    CheckValidDateV2(displayData);
    this.displayData.Ky = GetKy2(this.displayData, this.displayData.nam)

  }

}
