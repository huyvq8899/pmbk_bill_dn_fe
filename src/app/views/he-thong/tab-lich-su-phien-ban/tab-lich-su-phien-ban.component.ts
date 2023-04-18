import { element } from 'protractor';
import { forEach } from 'jszip';
import { AuthService } from 'src/app/services/auth.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { ThietLapTruongDuLieuService } from 'src/app/services/Config/thiet-lap-truong-du-lieu.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { NumberGlobalConstants } from 'src/app/shared/NumberGlobalConstants';
import { forkJoin } from 'rxjs';
import { PagingParams } from 'src/app/models/PagingParams';

@Component({
  selector: 'app-tab-lich-su-phien-ban',
  templateUrl: './tab-lich-su-phien-ban.component.html',
  styleUrls: ['./tab-lich-su-phien-ban.component.scss']
})
export class TabLichSuPhienBanComponent implements OnInit {
  selectedTab = 0;
  spinning = false;
  thaoTacs: any[] = [];
  phanQuyen: any;
  listQuyens: any;
  permission: boolean;
  listTenQuyens: any;
  listVersionRoots: any;
  listVersionRootAlls: any;
  listVersionChilds: any;
  listVersionChildAlls: any;
  textButtonMoRongThuGon = 'Mở rộng';
  displayData: PagingParams = {
    PageNumber: 1,
    PageSize: 10,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    fromDate: '',
    toDate: '',
    userId: '',
    Type: 3,
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.spinning = true;
    this.phanQuyen = localStorage.getItem('KTBKUserPermission');

    if (this.phanQuyen == 'true') {
      this.permission = true;
    }
    //khi click á»Ÿ báº£ng Ä‘iá»u khiá»ƒn
    this.activatedRoute.queryParams.subscribe(params => {
      const tabIndex = params['tab'];
      if (tabIndex) {
        this.selectedTab = tabIndex;
      }
    });
    //this.GetAllVersionRoot();
    this.forkJoinHoSo().subscribe((res: any[]) => {
      this.listVersionRoots = res[0].items;
      this.GetAllVersionChildByParentId(this.listVersionRoots[0]);
    });
    this.spinning = false;
  }

  OnSelectedRootVersion(data: any) {
    this.GetAllVersionChildByParentId(data);
  }

  changeTab() {

  }
  /// Láº¥y version gá»‘c
  GetAllVersionRoot() {
    this.authService.GetAllVersionRootByType(this.displayData).subscribe((rs: any) => {
      this.listVersionRoots = rs.items;
      this.listVersionRootAlls = rs.items;
    });
  }
  /// Láº¥y version gá»‘c
  GetAllVersionChildByParentId(dataInput: any) {
    this.authService.GetAllVersionChildByParentId({ typeNumber: NumberGlobalConstants.NUMBER_VERSION_TYPE, parentVersionId: dataInput.versionId }).subscribe((rs: any) => {
      this.listVersionChilds = rs;
      this.listVersionChildAlls = rs;
    });
  }
  forkJoinHoSo() {
    return forkJoin([
      this.authService.GetAllVersionRootByType(this.displayData),
    ]);
  }
  clickOpenChild(dataInput) {
    this.listVersionChilds.forEach(x => {
      if (x.versionId === dataInput.versionId) {
        x.active = !x.active;
      }
    });

  }

  clickChangeAllActiveVersionChild() {
    if (this.textButtonMoRongThuGon === 'Thu gọn') {
      this.textButtonMoRongThuGon = 'Mở rộng';
      this.listVersionChilds.forEach(x => {
        x.active = false;
      });
    } else {
      this.textButtonMoRongThuGon = 'Thu gọn';
      this.listVersionChilds.forEach(x => {
        x.active = true;
      });
    }
  }
}