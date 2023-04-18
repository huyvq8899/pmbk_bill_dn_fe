import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { DownloadFile } from 'src/app/shared/SharedFunction';
import { ChonTepNguonComponent } from '../chon-tep-nguon/chon-tep-nguon.component';

@Component({
  selector: 'app-result-import-hoa-don',
  templateUrl: './result-import-hoa-don.component.html',
  styleUrls: ['./result-import-hoa-don.component.scss']
})
export class ResultImportHoaDonComponent implements OnInit {
  subscription: Subscription;
  numberSuccess: number = 0;
  listAll: any[] = [];
  listTruongDuLieu: any[] = [];
  numberTotal: number = 0;
  numberError: number = 0;
  key: any;
  isLoading = false;
  status = true;
  loaiHoaDon = 1;

  constructor(private sharesv: SharedService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private chonTepNguonComponent: ChonTepNguonComponent) {
  }

  ngOnInit() {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && (rs.type === 'ResultImportHoaDonGTGT' ||
          rs.type === 'ResultImportHoaDonBanHang' ||
          rs.type === 'ResultImportPXKVanChuyenNoiBo' ||
          rs.type === 'ResultImportPXKGuiBanDaiLy')) {
          this.key = rs.key;
          if (this.key === '2001' || this.key === '2002' || this.key === '2007' || this.key === '2008') {
            this.numberError = rs.result.numError;
            this.numberSuccess = rs.result.numSuccess;
            this.numberTotal = rs.result.numTotal;
            this.listAll = rs.value;
            this.listTruongDuLieu = rs.listTruongDuLieu;

            var nodesHoaDon = JSON.parse(localStorage.getItem('nodesHoaDon'));

            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.NhapKhau,
              refType: RefType.NhapKhauTuExcel,
              thamChieu: `${nodesHoaDon.find(x => x.key === this.key).title}`,
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

  downloadFilesError() {
    this.isLoading = true;
    const data = {
      listResult: this.listAll.filter(x => x.hasError === true),
      listTruongDuLieu: this.listTruongDuLieu
    };
    this.hoaDonDienTuService.CreateFileImportHoaDonError(data).subscribe((rs: any) => {
      if (rs) {
        const link = window.URL.createObjectURL(rs);
        DownloadFile(link, 'hoa-don-error.xlsx');
        this.isLoading = false;
      }
    });
  }
}
