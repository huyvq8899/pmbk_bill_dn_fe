import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { LoaiChiTietTuyChonNoiDung } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-setting-truong-mo-rong',
  templateUrl: './setting-truong-mo-rong.component.html',
  styleUrls: ['./setting-truong-mo-rong.component.scss']
})
export class SettingTruongMoRongComponent implements OnInit, OnChanges {
  @Output() confirmSettingTruongMoRong = new EventEmitter<any>();
  @Input() data: MauHoaDonTuyChonChiTiet;
  kieuDuLieus: Array<{ value: any, text: string }> = [
    { text: 'Chữ', value: 1 },
    { text: 'Tiền tệ', value: 2 },
    { text: 'Số lượng', value: 3 },
    { text: 'Ngày', value: 4 },
    { text: 'Phần trăm', value: 5 },
  ];
  formData = {
    tenTruongDuLieu: '',
    tieuDeCot: '',
    tieuDeCotTiengAnh: '',
    kieuDuLieu: 1,
    giaTriMacDinh: null
  };

  constructor(
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.setValue();
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.setValue();
    }
  }

  cancelSetting() {
    this.confirmSettingTruongMoRong.emit({
      status: false
    });
  }

  acceptSetting() {
    if (!this.formData.tieuDeCot) {
      this.showWarning('Tiêu đề cột không được bỏ trống.');
      return;
    }

    this.data.kieuDuLieuThietLap = this.formData.kieuDuLieu;
    this.data.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
      item.kieuDuLieuThietLap = this.formData.kieuDuLieu;

      switch (item.loaiContainer) {
        case 1:
          item.giaTri = this.formData.tieuDeCot;
          break;
        case 2:
          item.placeholder = `[${this.formData.tieuDeCot}]`;
          item.giaTriMacDinh = this.formData.giaTriMacDinh;
          break;
        case 4:
          item.giaTri = this.formData.tieuDeCotTiengAnh;
          break;
        default:
          break;
      }
    });

    this.confirmSettingTruongMoRong.emit({
      status: true,
      data: this.data
    });
  }

  setValue() {
    if (this.data) {
      const tieuDe = this.data.children.find(x => x.loaiContainer === 1);
      const noiDung = this.data.children.find(x => x.loaiContainer === 2);
      const tieuDeSongNgu = this.data.children.find(x => x.loaiContainer === 4);
      const loaiChiTiet = this.data.loaiChiTiet;

      if (loaiChiTiet >= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1 && loaiChiTiet <= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung10) {
        let idx = 0;
        const idxStart = LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1;
        const idxEnd = LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung10;

        for (let i = idxStart; i <= idxEnd; i++) {
          idx += 1;
          if (i === loaiChiTiet) {
            this.formData.tenTruongDuLieu = `Trường thông tin bổ sung ${idx}`;
            break;            
          }
        }
      }

      if (loaiChiTiet >= LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1 && loaiChiTiet <= LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet10) {
        let idx = 0;
        const idxStart = LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1;
        const idxEnd = LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet10;

        for (let i = idxStart; i <= idxEnd; i++) {
          idx += 1;
          if (i === loaiChiTiet) {
            this.formData.tenTruongDuLieu = `Trường thông tin mở rộng ${idx}`;
            break;            
          }
        }
      }

      this.formData.tieuDeCot = tieuDe ? tieuDe.giaTri : '';
      this.formData.tieuDeCotTiengAnh = tieuDeSongNgu ? tieuDeSongNgu.giaTri : '';
      this.formData.kieuDuLieu = this.data.kieuDuLieuThietLap;
      this.formData.giaTriMacDinh = noiDung ? noiDung.giaTriMacDinh : '';
    }
  }

  changeKieuDuLieu(event: any) {
    this.formData.giaTriMacDinh = null;
  }

  showWarning(message: any) {
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
        msContent: message,
        msOnClose: () => {
        },
      }
    });
  }
}
