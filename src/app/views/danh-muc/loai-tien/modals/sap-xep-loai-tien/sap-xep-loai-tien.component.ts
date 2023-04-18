import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';

@Component({
  selector: 'app-sap-xep-loai-tien',
  templateUrl: './sap-xep-loai-tien.component.html',
  styleUrls: ['./sap-xep-loai-tien.component.scss']
})
export class SapXepLoaiTienComponent implements OnInit {
  @Input() listTruongDuLieu: any[] = [];
  listTruongDuLieuTemp: any[] = [];
  listTruongDuLieuTempNew: any[] = [];
  searchCustomerOverlayStyle = {
    width: '200px'
  };
  widthConfig = ['', '', '', '', '', ''];
  spinning: boolean;
  indeterminate = false;
  dataSelected = null;

  constructor(
    private modal: NzModalRef,
    private loaiTienService: LoaiTienService,

  ) { }

  ngOnInit() {
    this.listTruongDuLieuTemp = JSON.parse(JSON.stringify(this.listTruongDuLieu));

    this.selectedRow(this.listTruongDuLieuTemp[0]);
    this.setWidthConfig();
  }
  setWidthConfig() {
    this.widthConfig[0] = '7%';
    this.widthConfig[1] = '10%';
    this.widthConfig[2] = '45%';

  }
  selectedRow(data: any) {
    this.listTruongDuLieuTemp.forEach(item => {
      if (item.selected == true) {
        item.selected = false;
      }
    })
    this.dataSelected = data;
    data.selected = true;
  }
  saveChanges() {
    this.spinning = true;
    this.loaiTienService.UpdateRange(this.listTruongDuLieuTemp)
      .subscribe((res: boolean) => {
        if (res) {
          this.modal.destroy(this.listTruongDuLieuTemp);
          this.spinning = false;
        }
      });
  }

  first() {
    this.listTruongDuLieuTemp = this.listTruongDuLieuTemp.filter(x => x.loaiTienId !== this.dataSelected.loaiTienId);
    this.listTruongDuLieuTemp.unshift(this.dataSelected);
    this.updateSTT();
  }

  prev() {
    if (this.dataSelected.sapXep > 1) {
      const temp = Object.assign(this.listTruongDuLieuTemp[this.dataSelected.sapXep - 2]);
      this.listTruongDuLieuTemp[this.dataSelected.sapXep - 2] = this.dataSelected;
      this.listTruongDuLieuTemp[this.dataSelected.sapXep - 1] = temp;
      this.updateSTT();
    }
  }

  next() {
    if (this.dataSelected.sapXep < this.listTruongDuLieuTemp.length) {
      const temp = Object.assign(this.listTruongDuLieuTemp[this.dataSelected.sapXep]);
      this.listTruongDuLieuTemp[this.dataSelected.sapXep] = this.dataSelected;
      this.listTruongDuLieuTemp[this.dataSelected.sapXep - 1] = temp;
      this.updateSTT();
    }
  }

  last() {
    this.listTruongDuLieuTemp = this.listTruongDuLieuTemp.filter(x => x.loaiTienId !== this.dataSelected.loaiTienId);
    this.listTruongDuLieuTemp.push(this.dataSelected);
    this.updateSTT();
  }

  updateSTT() {
    this.listTruongDuLieuTemp.forEach((item: any, index: any) => {
      item.sapXep = index + 1;

      if (this.dataSelected.loaiTienId === item.loaiTienId) {
        this.dataSelected.sapXep = item.sapXep;
      }
    });
  }

  destroyModal() {
    this.modal.destroy();
  }
}
