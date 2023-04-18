import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy } from 'src/app/shared/chon-ky';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';

@Component({
  selector: 'app-thiet-lap-truong-du-lieu-modal',
  templateUrl: './thiet-lap-truong-du-lieu-modal.component.html',
  styleUrls: ['./thiet-lap-truong-du-lieu-modal.component.scss']
})
export class ThietLapTruongDuLieuModalComponent implements OnInit {
  @Input() ChucNang: string;
  searchCustomerOverlayStyle = {
    width: '200px'
  };
  baoCaoForm: FormGroup;
  spinning: boolean;
  indeterminate = false;
  maLoaiTien: string;
  listTruongDLs: any[]=[];
  loading = false;
  pageSize = 0;
  ddtp = new DinhDangThapPhan();
  
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    private tuyChonService: TuyChonService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  selectedRow(data: any){
    if(data.selected == true){
      data.selected = false;
      return;
    }

    this.listTruongDLs.forEach(item =>{
      if(item.selected == true) item.selected = false;
    })

    data.selected = true;
  }

  layLaiThietLapMacDinh(){
    this.listTruongDLs.forEach(item=>{
      if(item.default == true){
        item.status = true;
      }
      else{
        item.status = false;
      }

      item.stt = item.defaultSTT;
    });
    console.log(this.listTruongDLs);
    this.tuyChonService.UpdateHienThiTruongDuLieu(this.listTruongDLs).subscribe(rs=>{
      if(rs){
        this.loadData();
      }
    })
  }

  loadData(){
    this.loading = true; 
    console.log(this.ChucNang);
    this.tuyChonService.GetThongTinHienThiTruongDL(this.ChucNang).subscribe((rs: any[])=>{
      console.log(rs);
      this.listTruongDLs = rs;
      this.pageSize = rs.length;
      this.selectedRow(this.listTruongDLs[0]);
      this.loading = false;
    })
  }

  saveChanges() {
    this.tuyChonService.UpdateHienThiTruongDuLieu(this.listTruongDLs).subscribe((res: boolean)=>{
      if(res){
        this.modal.destroy(res);
      }
    });
  }

  swap(item1: any, item2: any){
    let item = item1;
    item1 = item2;
    item2 = item;
  }

  next(item: any){
    
    let data = item;

    console.log(data);
    let index = this.listTruongDLs.indexOf(data);
    console.log(index);
    if(index < this.listTruongDLs.length - 1){
      var itemTmp = this.listTruongDLs[index];
      this.listTruongDLs[index] = this.listTruongDLs[index + 1];
      this.listTruongDLs[index + 1] = itemTmp;
    }
    else {
      var itemTmp = this.listTruongDLs[index];
      this.listTruongDLs[index] = this.listTruongDLs[0];
      this.listTruongDLs[0] = itemTmp;
    };

    for(let i=0; i<this.listTruongDLs.length; i++){
      this.listTruongDLs[i].stt = i+1;
    }

    this.listTruongDLs = this.listTruongDLs.sort(x=>x.stt);
  }

  prev(item: any){
    let data = item;
    let index = this.listTruongDLs.indexOf(data);
    if(index > 0){
      var itemTmp = this.listTruongDLs[index];
      this.listTruongDLs[index] = this.listTruongDLs[index - 1];
      this.listTruongDLs[index - 1] = itemTmp;
    }
    else {
      var itemTmp = this.listTruongDLs[index];
      this.listTruongDLs[index] = this.listTruongDLs[this.listTruongDLs.length - 1];
      this.listTruongDLs[this.listTruongDLs.length - 1] = itemTmp;
    };

    for(let i=0; i<this.listTruongDLs.length; i++){
      this.listTruongDLs[i].stt = i+1;
    }

    this.listTruongDLs = this.listTruongDLs.sort(x=>x.stt);
  }

  destroyModal() {
    this.modal.destroy();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }
}
