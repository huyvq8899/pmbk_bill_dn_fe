import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

import { VersionService } from 'src/app/services/version.service';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-thongTin',
  templateUrl: './thongTin.component.html',
  styleUrls: ['./thongTin.component.scss']
})

export class ThongTinComponent {
  isVisible = false;
  checked = false;

  listVersion: any[] = [];
  currentVersion: any;
  currentVersionName: any;
  currentVersionDate: any;
  newestVersion: any;
  newestVersionName: any;
  newestVersionDate: any;
  @Input() value: any;



  constructor(
    private modal: NzModalRef,
    private cookieService: CookieService,
    private versionsv: VersionService
  ) {

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    
    this.isVisible = false;
  }

  handleCancel(): void {
    
    this.isVisible = false;
  }
  clickDetail() {
    this.modal.destroy();
  }

  onTick(event) {
    
    this.cookieService.set('notshowagain', event);
  }

  ngOnInit() {
    this.versionsv.GetVersion().subscribe((rs: any) => {
      this.listVersion = rs;
      this.listVersion.forEach(element => {
        element.ngayPhatHanh = moment(element.ngayPhatHanh).format('DD/MM/YYYY');
        element.header = 'Phiên bản: ' + element.phienBanHienTai + ' ( ' + element.ngayPhatHanh + ' ) ';
      });
      this.newestVersion = this.listVersion[this.listVersion.length - 1];
      this.newestVersionName = this.newestVersion.phienBanHienTai;
      this.newestVersionDate = this.newestVersion.ngayPhatHanh;

    });

    const version = this.cookieService.get('version');
  }

}
