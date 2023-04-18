import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { SharedService } from 'src/app/services/share-service';

@Component({
  selector: 'app-import-nhan-vien',
  templateUrl: './import-nhan-vien.component.html',
  styleUrls: ['./import-nhan-vien.component.scss']
})
export class ImportNhanVienComponent implements OnInit {
  subscription: Subscription;
  fileData: any;
  spinning = false;
  widthConfig = ['4%', '5%', '7%', '7%', '12%', '8%', '8%', '7%', '7%', '7%', '7%', '7%', '7%'];
  scrollConfig = { x: '2000px', y: '500px' };
  listData: any[] = [];
  isLoading = false;
  hasError = false;
  selectedMode: any;

  constructor(private sharesv: SharedService, private doiTuongsv: DoiTuongService, private msg: NzMessageService) {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && rs.type === 'ImportNhanVien') {
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
    this.doiTuongsv.ImportNhanVien(this.fileData).subscribe((rs: any) => {
      this.listData = rs;
      const data: any = {
        type: 'CheckingImportNhanVien',
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
        type: 'CheckingImportNhanVien',
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
