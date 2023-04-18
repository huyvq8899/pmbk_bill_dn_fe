import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { SharedService } from 'src/app/services/share-service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';

@Component({
  selector: 'app-import-vat-tu-hang-hoa',
  templateUrl: './import-vat-tu-hang-hoa.component.html',
  styleUrls: ['./import-vat-tu-hang-hoa.component.scss']
})
export class ImportVatTuHangHoaComponent implements OnInit {
  subscription: Subscription;
  fileData: any;
  spinning = false;
  scrollConfig = { x: '1300px', y: '500px' };
  listData: any[] = [];
  isLoading = false;
  hasError = false;
  ddtp = new DinhDangThapPhan();
  
  constructor(private sharesv: SharedService, private vthhsv: HangHoaDichVuService, private msg: NzMessageService) { 
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && rs.type === 'ImportVTHH') {
          console.log('rsvt: ', rs);
          

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
    this.vthhsv.ImportVTHH(this.fileData).subscribe((rs: any) => {
      this.listData = rs;
      const data: any = {
        type: 'CheckingImportVTHH',
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
        type: 'CheckingImportVTHH',
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
