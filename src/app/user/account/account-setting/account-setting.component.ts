import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  setReverse = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.JPG', '.JPGE', '.BMP', '.GIF', '.PNG'];
  constructor(
    private usersv: UserService,
    private message: NzMessageService
  ) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
  this.setResize();
  }
  setResize() {
    if (window.innerWidth < 992) {
      this.setReverse = true;
    } else {
      this.setReverse = false;
    }
  }
  ngOnInit() {
    this.setResize();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //this.LoadData();
  }
  importFile(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      if (!this.hasExtension(event.target.files[0].name, this._validFileExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!this.hasFileSize(event.target.files[0].size)) {
        this.message.error('Dung lượng file vượt quá 2MB.');
        return;
      }
      let fileData: any = null;
      // this.fileName = event.target.files[0].name;
      fileData = new FormData();
      fileData.append('fileName', event.target.files[0].name);
      fileData.append('fileSize', event.target.files[0].size); // tính theo byte
      fileData.append('userId', this.currentUser.userId);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < files.length; i++) {
        fileData.append('files', files[i]);
      }
      // gọi api update avatar
      //
      this.usersv.UpdateAvatar(fileData).subscribe((rs: any) => {
        if (rs.result === true) {
          
          this.currentUser.avatar = rs.user.avatar;
          //localStorage.setItem('currentUser',  JSON.stringify(this.currentUser));
          this.LoadData();
        } else {

        }
      }, _ => {
      });
    }
  }
  hasExtension(fileName, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
  hasFileSize(fileSize) {
    if ((fileSize / 1024 / 1024) < 2048) { return true; }
    return false;
  }

  LoadData() {
    this.usersv.GetById(this.currentUser.userId).subscribe(
      (res: any) => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUser = res;
      },
      err => {
        
      }
    );
  }
}
