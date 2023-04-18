import { Component, OnInit } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { VersionService } from 'src/app/services/version.service';
import * as moment from 'moment';
@Component({
  selector: 'app-tro-giup',
  templateUrl: './tro-giup.component.html',
  styleUrls: ['./tro-giup.component.scss']
})
export class TroGiupComponent implements OnInit {
  listVersion: any[] = [];
  currentVersion: any;
  currentVersionName: any;
  currentVersionDate: any;
  newestVersion: any;
  newestVersionName: any;
  newestVersionDate: any;

  constructor(
    private env: EnvService,
    private versionsv: VersionService

  ) {


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
  }

  clickTroGiup() {
    const url = this.env.apiUrl + '/FilesUpload/docs/samples/HuongDanSuDung.pdf'
    //this.CollapseMenu();
    //this.router.navigate(['/tro-giup'])
    window.open(url);
  }

  clickDetail() {
    //
  }
}
