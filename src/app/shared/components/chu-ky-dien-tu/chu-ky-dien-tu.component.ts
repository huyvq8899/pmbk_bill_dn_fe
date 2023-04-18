import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chu-ky-dien-tu',
  templateUrl: './chu-ky-dien-tu.component.html',
  styleUrls: ['./chu-ky-dien-tu.component.scss']
})
export class ChuKyDienTuComponent implements OnInit {
  @Input() tenDonVi: any;
  @Input() ngayKy: any;
  @Input() isSongNgu: any;

  constructor() { }

  ngOnInit() {
  }

}
