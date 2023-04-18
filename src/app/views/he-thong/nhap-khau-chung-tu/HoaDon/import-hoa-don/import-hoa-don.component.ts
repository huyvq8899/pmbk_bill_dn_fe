import { Component, HostListener, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { MaTruongDLHDExcel } from 'src/app/enums/MaTruongDLHDExcel.enum';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { SumwidthConfig } from 'src/app/shared/global';
import { getHeightBangKe, getHeightBangKeKhongChiTiet2, getHeightSimpleTable } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-import-hoa-don',
  templateUrl: './import-hoa-don.component.html',
  styleUrls: ['./import-hoa-don.component.scss']
})
export class ImportHoaDonComponent implements OnInit {
  subscription: Subscription;
  fileData: any;
  spinning = false;
  widthConfig = ['100px', '200px', '200px', '200px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: (window.innerHeight - 70) + "px" };
  listData: any[] = [];
  listTruongDuLieu: any[] = [];
  isLoading = false;
  hasError = false;
  ddtp = new DinhDangThapPhan();
  loaiHoaDon = 1;

  constructor(private sharesv: SharedService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private msg: NzMessageService) { }

  ngOnInit() {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && (rs.type === 'ImportHoaDonGTGT' || rs.type === 'ImportHoaDonBanHang')) {
          this.loaiHoaDon = rs.type === 'ImportHoaDonGTGT' ? 1 : 2;
          this.fileData = rs.fileData;

          this.loadingData();
        }
      });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollConfig.y = (window.innerHeight - 70) + "px";
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadingData() {
    this.isLoading = true;
    const loading: any = {
      type: 'Loading',
    }
    this.sharesv.emitChange(loading);
    this.hoaDonDienTuService.ImportHoaDon(this.fileData).subscribe((rs: any) => {
      this.listData = rs.listResult;
      this.listTruongDuLieu = rs.listTruongDuLieu;

      this.widthConfig = ['100px', '100px', '120px'];
      this.listTruongDuLieu.forEach((item: any) => {
        this.widthConfig.push(`${item.doRong}px`);
      });
      this.widthConfig.push('300px');

      this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
      const data: any = {
        type: this.loaiHoaDon === 1 ? 'CheckingImportHoaDonGTGT' : 'CheckingImportHoaDonBanHang',
        value: this.listData,
        listTruongDuLieu: this.listTruongDuLieu
      }
      this.sharesv.emitChange(data);
      const loaded: any = {
        type: 'Loaded',
      }
      this.sharesv.emitChange(loaded);
      this.isLoading = false;
    }, _ => {
      this.msg.error('Lỗi nhập khẩu.Vui lòng chọn lại file!');
      this.listData = [];
      const data: any = {
        type: this.loaiHoaDon === 1 ? 'CheckingImportHoaDonGTGT' : 'CheckingImportHoaDonBanHang',
        value: this.listData,
        listTruongDuLieu: this.listTruongDuLieu
      }
      this.sharesv.emitChange(data);
      const loaded: any = {
        type: 'Loaded',
      }
      this.sharesv.emitChange(loaded);
      this.isLoading = false;
    });
  }

  public get MaTruong(): typeof MaTruongDLHDExcel {
    return MaTruongDLHDExcel;
  }
}
