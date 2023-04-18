import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-view-xml-content-modal',
  templateUrl: './view-xml-content-modal.component.html',
  styleUrls: ['./view-xml-content-modal.component.scss']
})
export class ViewXmlContentModalComponent implements OnInit {
  @Input() data: any;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
  }

  closeModal() {
    this.modal.destroy();
  }
}
