import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-status-thong-tin-hoa-don',
  templateUrl: './tag-status-thong-tin-hoa-don.component.html',
  styleUrls: ['./tag-status-thong-tin-hoa-don.component.scss']
})
export class TagStatusThongTinHoaDonComponent implements OnInit {
  @Input() loai: any;
  @Input() ten: any;

  constructor() { }

  ngOnInit() {
    
  }
}
