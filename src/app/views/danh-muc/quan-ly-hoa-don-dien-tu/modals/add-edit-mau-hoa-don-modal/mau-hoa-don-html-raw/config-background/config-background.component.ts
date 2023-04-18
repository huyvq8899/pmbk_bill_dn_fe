import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-background',
  templateUrl: './config-background.component.html',
  styleUrls: ['./config-background.component.scss']
})
export class ConfigBackgroundComponent implements OnInit {
  @Input() color: any;
  @Input() type: any;

  constructor() { }

  ngOnInit() {
  }

}
