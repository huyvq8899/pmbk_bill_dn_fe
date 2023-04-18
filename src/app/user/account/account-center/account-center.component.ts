import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-center',
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.css']
})
export class AccountCenterComponent implements OnInit {
  a=1;
  b=2;
  listCard = [1,2,3,4,5,6];
  currentUser: any;
  userSelected: any;
  likes = 0;
  dislikes = 0;
  time = new Date();

  like(): void {
    this.likes = 1;
    this.dislikes = 0;
  }

  dislike(): void {
    this.likes = 0;
    this.dislikes = 1;
  }
  constructor(
    private route: ActivatedRoute,
    private usersv: UserService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.queryParams
      .subscribe(params => {
        
        if (params.userId!= null) {
          if (this.currentUser.userId === params.userId) {
            this.userSelected = this.currentUser;
          } else {
            this.usersv.GetById(params.userId).subscribe(rs => {
              this.userSelected = rs;
            });
          }
        } else {
          this.userSelected = this.currentUser;
        }
      });

  }

}
