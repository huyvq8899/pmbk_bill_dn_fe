import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global';
import { HuongDanSuDungModalComponent } from './huong-dan-su-dung-modal/huong-dan-su-dung-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  globalConstants = GlobalConstants;
  gridStyle = {
    // width: '25%',
    textAlign: 'center'
  };

  constructor(
  ) { }

  ngOnInit() {
  }

}
