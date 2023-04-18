import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-status-ky-dien-tu',
  templateUrl: './tag-status-ky-dien-tu.component.html',
  styleUrls: ['./tag-status-ky-dien-tu.component.scss']
})
export class TagStatusKyDienTuComponent implements OnInit {
  @Input() isDaKy: boolean;

  constructor() { }

  ngOnInit() {
  }

}
