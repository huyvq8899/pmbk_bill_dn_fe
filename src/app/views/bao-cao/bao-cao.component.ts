import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/share-service';
import { GlobalConstants } from 'src/app/shared/global';

@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {
  subscription: Subscription;
  globalConstants = GlobalConstants;
  selectedTab = 0;
  oldSelectTab = 0;
  constructor(
    private router: Router
  ) { 
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('/bao-cao/thong-ke-so-luong-hoa-don-da-phat-hanh')) {
      this.selectedTab = 0;
    }

    if (_url.includes('/bao-cao/bang-ke-chi-tiet-hoa-don-su-dung')) {
      this.selectedTab = 1;
    }

    // if (_url.includes('/bao-cao/tinh-hinh-su-dung-hoa-don')) {
    //   this.selectedTab = 2;
    // }

    if (_url.includes('/bao-cao/tong-hop-gia-tri-hoa-don-da-su-dung')) {
      this.selectedTab = 2;
    }
  }
 
  clickTab(link: string) {
    this.router.navigate([link]);
  }


}
