import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-borderA5',
  templateUrl: './config-borderA5.component.html',
  styleUrls: ['./config-borderA5.component.scss']
})
export class ConfigBorderA5Component implements OnInit {
  @Input() color: any;
  @Input() type: any;
  
  constructor() { }

  ngOnInit() {
  }
}
