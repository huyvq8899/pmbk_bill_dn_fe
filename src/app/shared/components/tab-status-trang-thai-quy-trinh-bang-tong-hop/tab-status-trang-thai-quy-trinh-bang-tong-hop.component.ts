import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-status-quy-trinh-bang-tong-hop',
  templateUrl: './tab-status-trang-thai-quy-trinh-bang-tong-hop.component.html',
  styleUrls: ['./tab-status-trang-thai-quy-trinh-bang-tong-hop.component.scss']
})
export class TabStatusQuyTrinhBangTongHopComponent implements OnInit {
  @Input() loai: any;
  @Input() ten: any;
  
  constructor() { }

  ngOnInit() {
  }

}
