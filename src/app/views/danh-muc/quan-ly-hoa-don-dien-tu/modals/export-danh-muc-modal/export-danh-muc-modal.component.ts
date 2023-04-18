import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RefType } from 'src/app/models/nhat-ky-truy-cap';
import { QuyetDinhApDungHoaDonService } from 'src/app/services/danh-muc/quyet-dinh-ap-dung-hoa-don.service';
import { ThongBaoDieuChinhThongTinHoaDonService } from 'src/app/services/danh-muc/thong-bao-dieu-chinh-thong-tin-hoa-don.service';
import { ThongBaoKetQuaHuyHoaDonService } from 'src/app/services/danh-muc/thong-bao-ket-qua-huy-hoa-don.service';
import { ThongBaoPhatHanhService } from 'src/app/services/danh-muc/thong-bao-phat-hanh.service';
import { DownloadFile } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-export-danh-muc-modal',
  templateUrl: './export-danh-muc-modal.component.html',
  styleUrls: ['./export-danh-muc-modal.component.scss']
})
export class ExportDanhMucModalComponent implements OnInit {
  @Input() refType: RefType;
  @Input() link: any;
  @Input() refId: any;
  refTypeCompare = {
    QuyetDinhApDungHoaDon: RefType.QuyetDinhApDungHoaDon,
    ThongBaoPhatHanhHoaDon: RefType.ThongBaoPhatHanhHoaDon,
    ThongBaoKetQuaHuyHoaDon: RefType.ThongBaoKetQuaHuyHoaDon,
    ThongBaoDieuChinhThongTinHoaDon: RefType.ThongBaoDieuChinhThongTinHoaDon,
  };
  spinning = false;
  dinhDangTep = 0;
  radioType = 1;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  constructor(
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private quyetDinhApDungHoaDonService: QuyetDinhApDungHoaDonService,
    private thongBaoPhatHanhService: ThongBaoPhatHanhService,
    private thongBaoKetQuaHuyHoaDonService: ThongBaoKetQuaHuyHoaDonService,
    private thongBaoDieuChinhThongTinHoaDonService: ThongBaoDieuChinhThongTinHoaDonService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modal.destroy();
  }

  getExtByType(type: any) {
    if (type === 0) {
      return 'pdf';
    } else if (type === 1) {
      return 'doc';
    } else if (type === 2) {
      return 'docx';
    } else {
      return 'xml';
    }
  }

  downloadFile(type: any) {
    this.spinning = true;
    if (this.refType === RefType.QuyetDinhApDungHoaDon) {
      this.quyetDinhApDungHoaDonService.ExportFile(this.refId, type)
        .subscribe((res: any) => {
          const link = window.URL.createObjectURL(res);
          DownloadFile(link, `Quyet_dinh_ap_dung_HDDT.${this.getExtByType(type)}`);
          this.spinning = false;
        });
    } else if (this.refType === RefType.ThongBaoPhatHanhHoaDon) {
      this.thongBaoPhatHanhService.ExportFile(this.refId, type)
        .subscribe((res: any) => {
          const link = window.URL.createObjectURL(res);
          DownloadFile(link, `Thong_bao_phat_hanh_HDDT.${this.getExtByType(type)}`);
          this.spinning = false;
        });
    } else if (this.refType === RefType.ThongBaoKetQuaHuyHoaDon) {
      this.thongBaoKetQuaHuyHoaDonService.ExportFile(this.refId, type)
        .subscribe((res: any) => {
          const link = window.URL.createObjectURL(res);
          DownloadFile(link, `Thong_bao_ket_qua_huy_HDDT.${this.getExtByType(type)}`);
          this.spinning = false;
        });
    } else if (this.refType === RefType.ThongBaoDieuChinhThongTinHoaDon) {
      this.thongBaoDieuChinhThongTinHoaDonService.ExportFile(this.refId, type, this.radioType)
        .subscribe((res: any) => {
          const link = window.URL.createObjectURL(res);
          let fileName = 'Thong_bao_dieu_chinh_thong_tin_hoa_don';
          if (type !== 3) {
            fileName = this.radioType === 1 ? 'Thong_bao_dieu_chinh_thong_tin_hoa_don' : 'Bang_ke_hoa_don_chua_su_dung';
          }
          DownloadFile(link, `${fileName}.${this.getExtByType(type)}`);
          this.spinning = false;
        });
    }
  }

  changeLoaiThongBaoDieuChinh(event: any) {
    this.spinning = true;
    this.radioType = event;
    this.thongBaoDieuChinhThongTinHoaDonService.ExportFile(this.refId, 0, event)
      .subscribe((res: any) => {
        this.link = window.URL.createObjectURL(res);
        this.spinning = false;
      });
  }
}
