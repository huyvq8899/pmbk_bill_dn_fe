import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/shared/global';

@Component({
  selector: 'app-tien-ich',
  templateUrl: './tien-ich.component.html',
  styleUrls: ['./tien-ich.component.scss']
})
export class TienIchComponent implements OnInit {
  globalConstants = GlobalConstants;
  selectedTab = 0;
  permission: boolean = false;
  thaoTacs: any[]=[];
  constructor(
    private router: Router,
  ) { }

  chucNangs = [
    { function: 'NhatKyTruyCap', link: '/tien-ich/nhat-ky-truy-cap' },
    { function: 'NhatKyGuiEmail', link: '/tien-ich/nhat-ky-gui-email' },
  ]

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
    }
    const _url = this.router.url;
    console.log(_url);
    if(this.permission == true){
      if (_url.includes('/tien-ich/nhat-ky-truy-cap')) {
        this.selectedTab = 0;
      }
      else if (_url.includes('/tien-ich/nhat-ky-gui-email')) {
        this.selectedTab = 1;
      }
    }
    else{
      var selected = this.chucNangs.find(x=>x.link == _url);
      this.selectedTab = this.chucNangs.indexOf(selected);
    }
  }

  clickTab(link: string) {
    this.router.navigate([link]);
  }
}
