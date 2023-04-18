import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { SharedService } from 'src/app/services/share-service';

@Component({
  selector: 'app-import-khach-hang',
  templateUrl: './import-khach-hang.component.html',
  styleUrls: ['./import-khach-hang.component.scss']
})
export class ImportKhachHangComponent implements OnInit {
  subscription: Subscription;
  fileData: any;
  selectedMode: any;
  spinning = false;
  widthConfig = ['4%', '6%', '6%', '11%', '6%', '7%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%'];
  scrollConfig = { x: '2000px', y: '500px' };
  listData: any[] = [];
  isLoading = false;
  hasError = false;

  constructor(private sharesv: SharedService, private doiTuongsv: DoiTuongService, private msg: NzMessageService) {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && rs.type === 'ImportKhachHang') {
          this.fileData = rs.fileData;
          this.loadingData();
        }
      });
  }

  ngOnInit() {
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
    this.doiTuongsv.ImportKhachHang(this.fileData).subscribe((rs: any) => {
      this.listData = rs;
      const data: any = {
        type: 'CheckingImportKhachHang',
        value: this.listData
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
        type: 'CheckingImportKhachHang',
        value: this.listData
      }
      this.sharesv.emitChange(data);
      const loaded: any = {
        type: 'Loaded',
      }
      this.sharesv.emitChange(loaded);
      this.isLoading = false;
    });
  }

}
