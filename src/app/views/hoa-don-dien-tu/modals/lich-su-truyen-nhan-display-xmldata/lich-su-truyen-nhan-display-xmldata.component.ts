import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import beautify from "xml-beautifier";

@Component({
  selector: 'app-lich-su-truyen-nhan-display-xmldata',
  templateUrl: './lich-su-truyen-nhan-display-xmldata.component.html',
  styleUrls: ['./lich-su-truyen-nhan-display-xmldata.component.scss']
})
export class LichSuTruyenNhanDisplayXmldataComponent implements OnInit {
  @Input() fileData: any;
  spinning = false;
  formattedXml: any;
  constructor(
    private modal: NzModalRef,

  ) { }

  ngOnInit() {
    // var format = require('xml-formatter');
    this.formattedXml = beautify(this.fileData);
    // this.formattedXml = this.fileData;

  }
  destroyModal() {
    this.modal.destroy();
  }
}
