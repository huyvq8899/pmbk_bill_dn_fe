import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-tag-status-su-dung',
  templateUrl: './tag-status-su-dung.component.html',
  styleUrls: ['./tag-status-su-dung.component.scss']
})
export class TagStatusSuDungComponent implements OnInit, OnChanges {
  @Input() loai: any;
  ten: any;

  constructor() { }

  ngOnInit() {
    this.loadTen();
  }

  ngOnChanges(changes: any) {
    if (changes.loai) {
      this.loadTen();
    }
  }

  loadTen() {
    if (this.loai === 0) {
      this.ten = 'Chưa xác thực';
    } else if (this.loai === 1) {
      this.ten = 'Đã xác thực';
    } else if (this.loai === 2) {
      this.ten = 'Đang sử dụng';
    } else if (this.loai === 3) {
      this.ten = 'Ngừng sử dụng';
    } else {
      this.ten = 'Hết hiệu lực';
    }
  }
}
