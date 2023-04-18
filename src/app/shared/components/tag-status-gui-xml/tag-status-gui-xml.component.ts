import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tag-status-gui-xml',
  templateUrl: './tag-status-gui-xml.component.html',
  styleUrls: ['./tag-status-gui-xml.component.scss']
})
export class TagStatusGuiXmlComponent implements OnInit {
  @Input() loai: any;
  @Input() ten: any;
  @Input() soLuong: any;
  @Input() displaySoLuong: boolean = false;

  constructor() { }

  ngOnInit() { }
}
