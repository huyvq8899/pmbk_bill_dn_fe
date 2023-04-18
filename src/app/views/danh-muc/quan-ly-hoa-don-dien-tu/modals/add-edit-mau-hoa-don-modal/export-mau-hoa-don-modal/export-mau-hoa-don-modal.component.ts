import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { DownloadFile } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-export-mau-hoa-don-modal',
  templateUrl: './export-mau-hoa-don-modal.component.html',
  styleUrls: ['./export-mau-hoa-don-modal.component.scss']
})
export class ExportMauHoaDonModalComponent implements OnInit {
  @Input() data: any;
  hinhThucMauHoaDons: any[] = [
    { value: 0, label: 'Mẫu dạng thể hiện', checked: true },
    { value: 1, label: 'Mẫu dạng chuyển đổi', checked: false },
    { value: 2, label: 'Mẫu có chiết khấu', checked: false },
    { value: 3, label: 'Mẫu ngoại tệ', checked: false },
  ];
  dinhDangTepMaus: any[] = [
    { value: 0, label: '../../../../../../../assets/pdf.png', selected: true },
    { value: 1, label: '../../../../../../../assets/doc.png', selected: false },
    { value: 2, label: '../../../../../../../assets/docx.png', selected: false },
  ];
  spinning = false;
  disabledAccept = false;

  constructor(
    private modalRef: NzModalRef,
    private mauHoaDonService: MauHoaDonService,
  ) { }

  ngOnInit() {
  }

  submitForm() {
    this.spinning = true;

    const params = {
      mauHoaDonId: this.data.mauHoaDonId,
      hinhThucMauHoaDon: this.hinhThucMauHoaDons.filter(x => x.checked === true).map(x => x.value),
      dinhDangTepMau: this.dinhDangTepMaus.find(x => x.selected === true).value
    };
    this.mauHoaDonService.ExportMauHoaDon(params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        let fileName = '';
        if (params.hinhThucMauHoaDon.length === 1) {
          fileName = this.getFileName(params);
        } else {
          fileName = 'Bo_mau_hoa_don.zip';
        }

        DownloadFile(link, fileName);
        this.spinning = false;
      });
  }

  getFileName(params: any) {
    let extention = '';
    if (params.dinhDangTepMau === 0) {
      extention = 'pdf';
    } else if (params.dinhDangTepMau === 1) {
      extention = 'doc';
    } else {
      extention = 'docx';
    }

    let fileName = '';
    if (params.hinhThucMauHoaDon[0] === 0) {
      fileName = `Hoa_don_mau_dang_the_hien.${extention}`;
    } else if (params.hinhThucMauHoaDon[0] === 1) {
      fileName = `Hoa_don_mau_dang_chuyen_doi.${extention}`;
    } else if (params.hinhThucMauHoaDon[0] === 2) {
      fileName = `Hoa_don_mau_co_chiet_khau.${extention}`;
    } else {
      fileName = `Hoa_don_mau_ngoai_te.${extention}`;
    }

    return fileName;
  }

  closeModal() {
    this.modalRef.destroy();
  }

  onChecked(value: any[]) {
    this.disabledAccept = value.every(x => x.checked === false);
  }

  onSelected(data: any) {
    data.selected = true;

    this.dinhDangTepMaus.forEach((item: any) => {
      if (item !== data) {
        item.selected = false;
      }
    });
  }
}
