import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-border',
  templateUrl: './config-border.component.html',
  styleUrls: ['./config-border.component.scss']
})
export class ConfigBorderComponent implements OnInit {
  @Input() color: any;
  @Input() type: any;
  
  constructor() { }

  ngOnInit() {
  }
}
