import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-status-quy-trinh',
  templateUrl: './tab-status-quy-trinh.component.html',
  styleUrls: ['./tab-status-quy-trinh.component.scss']
})
export class TabStatusQuyTrinhComponent implements OnInit {
  @Input() loai: any;
  @Input() ten: any;
  
  constructor() { }

  ngOnInit() {
  }

}
