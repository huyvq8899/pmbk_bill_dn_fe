import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-popup-video-modal',
  templateUrl: './popup-video-modal.component.html',
  styleUrls: ['./popup-video-modal.component.scss']
})
export class PopupVideoModalComponent implements OnInit {
@Input() keyVideo:any = '';
urlYoutube:any;
  constructor(
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    this.urlYoutube = 'https://www.youtube.com/embed/'+ this.keyVideo + '?autoplay=1';
  }
  destroyModal(){
    this.modal.destroy();
  }
}
