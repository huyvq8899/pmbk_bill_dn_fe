import { Component, OnInit } from '@angular/core';
import { VersionService } from 'src/app/services/version.service';
import * as moment from 'moment';
@Component({
  selector: 'app-version-detail',
  templateUrl: './version-detail.component.html',
  styleUrls: ['./version-detail.component.scss']
})
export class VersionDetailComponent implements OnInit {
  listVersion: any[] = [];


  constructor(
    private versionsv: VersionService
  ) { }

  ngOnInit() {
    this.versionsv.GetVersion().subscribe((rs: any) => {
      
      this.listVersion = rs;
      this.listVersion.forEach(element => {
        element.ngayPhatHanh = moment(element.ngayPhatHanh).format('DD/MM/YYYY');
        element.header = 'Phiên bản: ' + element.phienBanHienTai + ' ( ' + element.ngayPhatHanh + ' ) ';
      });
    });
  }
}
