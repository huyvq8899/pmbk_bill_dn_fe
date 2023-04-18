import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  a = 1;
  b = 2;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  currentDate = new Date();
  constructor() { }

  ngOnInit() {
  }

}
