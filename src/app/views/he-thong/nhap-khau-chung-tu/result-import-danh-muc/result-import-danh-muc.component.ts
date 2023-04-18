import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { ChonTepNguonComponent } from '../chon-tep-nguon/chon-tep-nguon.component';

@Component({
  selector: 'app-result-import-danh-muc',
  templateUrl: './result-import-danh-muc.component.html',
  styleUrls: ['./result-import-danh-muc.component.scss']
})
export class ResultImportDanhMucComponent implements OnInit {
  subscription: Subscription;
  numberSuccess: number = 0;
  listAll: any[] = [];
  listError: any[] = [];
  numberDanhMuc: number = 0;
  key: any;
  isLoading = false;
  status = true;

  constructor(private sharesv: SharedService,
    private doiTuongsv: DoiTuongService,
    private vthhsv: HangHoaDichVuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private chonTepNguonComponent: ChonTepNguonComponent) {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && rs.type === 'ResultImportDanhMuc') {
          status = rs.status;
          this.key = rs.key;
          if (this.key === '1001' || this.key === '1002' || this.key === '1003') {
            this.numberSuccess = rs.result.numSuccess;
            this.numberDanhMuc = rs.result.numDanhMuc;
            this.listAll = rs.value;
            this.listError = this.listAll.filter(x => x.hasError === true);

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.NhapKhau,
              refType: RefType.NhapKhauTuExcel,
              thamChieu: `Danh mục phân hệ ${this.chonTepNguonComponent.nodesDanhMuc.find(x => x.key === this.key).title}`,
              moTaChiTiet: `Nhập khẩu thành công ${this.numberSuccess} bản ghi`
            }).subscribe();
          }
        }
        if (rs != null && rs.type === "Loading") {
          this.isLoading = true;
        }
        if (rs != null && rs.type === "Loaded") {
          this.isLoading = false;
        }
      });
  }

  ngOnInit() {
  }

  downloadFilesError() {
    this.isLoading = true;
    switch (this.key) {
      case '1001': {
        this.doiTuongsv.CreateFileImportKhachHangError(this.listError).subscribe((rs: any) => {
          if (rs.status) {
            window.open(rs.link);
            this.isLoading = false;
          }
        });
        break;
      }
      case '1002': {
        this.doiTuongsv.CreateFileImportNhanVienError(this.listError).subscribe((rs: any) => {
          if (rs.status) {
            window.open(rs.link);
            this.isLoading = false;
          }
        });
        break;
      }
      case '1003': {
        this.vthhsv.CreateFileImportVTHHError(this.listError).subscribe((rs: any) => {
          if (rs.status) {
            window.open(rs.link);
            this.isLoading = false;
          }
        });
        break;
      }
      default: {
        this.isLoading = false;
        break;
      }
    }
  }

}
