import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-thong-diep-hoa-don',
  templateUrl: './tab-thong-diep-hoa-don.component.html',
  styleUrls: ['./tab-thong-diep-hoa-don.component.scss']
})
export class TabThongDiepHoaDonComponent implements OnInit {
  selectedTab = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('/hoa-don-dien-tu/thong-diep/gui-du-lieu-hddt-khong-ma')) {
      this.selectedTab = 0;
    }
    else if (_url.includes('/hoa-don-dien-tu/thong-diep/gui-du-lieu-hddt-de-cap-ma')) {
      this.selectedTab = 1;
    }
  }

  clickTab(link: string) {
    this.router.navigate([link]);
  }
}
