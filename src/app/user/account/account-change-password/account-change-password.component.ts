import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CheckChangePasswordConfirmValidator } from 'src/app/customValidators/check-change-password-confirm-validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-account-change-password',
  templateUrl: './account-change-password.component.html',
  styleUrls: ['./account-change-password.component.css']
})
export class AccountChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isLoading= false;
  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      password: [null, [Validators.required]],
      confirmPassword: [null, [
        Validators.required,
        CheckChangePasswordConfirmValidator
      ]]
    });
  }

  saveChanges() {
    if (this.changePasswordForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.changePasswordForm.controls) {
        this.changePasswordForm.controls[key].markAsDirty();
        this.changePasswordForm.controls[key].updateValueAndValidity();
      }
      return;
    }
    const obj: any = {
      userId: localStorage.getItem('userId'),
      password: this.changePasswordForm.get('password').value
    };
    this.isLoading= true;
    this.userService.UpdatePassWord(obj).subscribe((res: any) => {
      if (res === 1) {
        this.message.success('Đặt lại mật khẩu thành công');
        this.changePasswordForm.reset();
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/dang-nhap']);
        this.isLoading= false;
      } else {
        this.isLoading= false;
      }
    }, _ => {
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      this.isLoading= false;
    });
  }
}
