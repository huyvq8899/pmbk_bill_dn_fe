import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { SearchEngine } from 'src/app/shared/searchEngine';

@Component({
  selector: 'app-chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal',
  templateUrl: './chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal.component.html',
  styleUrls: ['./chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal.component.scss']
})
export class ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent implements OnInit {
  @Input() baoCao: any;
  baoCaoForm: FormGroup;
  spinning: boolean;
  loaiTiens = [];
  loaiTiensAll = [];
  kys = GetList();
  searchOverlayStyle = {
    width: '400px'
  };
  
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private message: NzMessageService,
    private loaiTienService: LoaiTienService,
  ) { }

  ngOnInit() {
    this.createForm();

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      res[0].unshift({
        loaiTienId: '',
        ma: 'TH',
        ten: 'Tổng hợp'
      });
      this.loaiTiens = res[0];
      this.loaiTiensAll = res[0];

      if (this.baoCao) {
        this.baoCaoForm.patchValue({
          ...this.baoCao,
        });
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.loaiTienService.GetAll({ isActive: true })
    ]);
  }

  xoaDieuKien() {
    this.createForm();
  }

  createForm() {
    this.baoCaoForm = this.fb.group({
      ky: [5],
      tuNgay: [null, [Validators.required]],
      denNgay: [null, [Validators.required]],
      loaiTienId: [''],
      mau: [1],
      isKhongTinhGiaTriHoaDonGoc: [false],
      isKhongTinhGiaTriHoaDonXoaBo: [false],
      isKhongTinhGiaTriHoaDonThayThe: [false],
      isKhongTinhGiaTriHoaDonDieuChinh: [false]
    });

    this.loadDate();
  }

  loadDate() {
    const data = this.baoCaoForm.getRawValue();
    const params = {
      fromDate: data.tuNgay,
      toDate: data.denNgay
    };
    SetDate(data.ky, params);
    this.baoCaoForm.patchValue({
      tuNgay: params.fromDate,
      denNgay: params.toDate
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
    data.maLoaiTien = this.loaiTiensAll.find(x => x.loaiTienId === data.loaiTienId).ma;
    this.modal.destroy(data);
  }
  
  destroyModal() {
    this.modal.destroy();
  }

  changeKy(event: any) {
    this.loadDate();
  }

  blurDate() {
    const data = this.baoCaoForm.getRawValue();
    const params = {
      fromDate: data.tuNgay,
      toDate: data.denNgay
    };

    const ky = GetKy(params);
    this.baoCaoForm.get('ky').setValue(ky);
  }

  searchLoaiTien(event: any) {
    const arrCondition = ['ma', 'ten'];
    this.loaiTiens = SearchEngine(this.loaiTiensAll, arrCondition, event);
  }
}
