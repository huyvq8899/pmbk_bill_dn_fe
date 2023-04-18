import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NoWhitespaceValidator } from 'src/app/customValidators/no-whitespace-validator';
import { GetDate } from 'src/app/shared/getDate';
import { ValidatorsDupcateName } from 'src/app/customValidators/validatorsDupcateName';
import { ValidatorsDupcateMail } from 'src/app/customValidators/validatorsDupcateMail';
import { UserService } from 'src/app/services/user.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { SharedService } from 'src/app/services/share-service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  isAddNew = false;
  data = JSON.parse(localStorage.getItem('currentUser'));
  userForm: FormGroup;
  roles: any = [];
  isLoading = false;
  isAdmin = false;

  constructor(
    private usersv: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private shareService: SharedService,
    private nhatKyTruyCapService: NhatKyTruyCapService) { }
  ngOnInit() {
    if (this.isAddNew === true) {
      this.createformInsert();
    } else {
      this.isAdmin = this.data.userName === 'admin';

      this.data.title = this.isAdmin ? 'Quản trị viên' : this.data.title;

      this.createformUpdate();
      this.userForm.patchValue({
        ...this.data,
      });
      this.userForm.get('dateOfBirth').setValue(GetDate(this.data.dateOfBirth));
    }
  }
  createformInsert() {
    this.userForm = this.fb.group({
      userId: [null],
      userName: [null, [Validators.required, NoWhitespaceValidator], [ValidatorsDupcateName(this.usersv)]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, NoWhitespaceValidator], [ValidatorsDupcateMail(this.usersv, '')]],
      title: [null],
      roleId: [null],
      isAdmin: [false]
    });
  }
  createformUpdate() {
    this.userForm = this.fb.group({
      userId: [null, [Validators.required]],
      userName: [{ value: null, disabled: true }, [Validators.required, NoWhitespaceValidator], [ValidatorsDupcateName(this.usersv)]],
      fullName: [null, [Validators.required]],
      // tslint:disable-next-line: max-line-length
      email: [{ value: null, disabled: false }, [Validators.required, Validators.email, NoWhitespaceValidator], [ValidatorsDupcateMail(this.usersv, this.data.email)]],
      title: [{ value: null, disabled: this.isAdmin }],
      roleId: [null],
      dateOfBirth: [null],
      phone: [null],
      address: [null],
      isAdmin: [this.data.isAdmin]
    });
  }
  saveChanges(): void {
    if (this.userForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.userForm.controls) {
        this.userForm.controls[i].markAsDirty();
        this.userForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const data = this.userForm.getRawValue();
    if (this.isAddNew === true) {
      this.usersv.Insert(data).subscribe((rs: any) => {
        if (rs === 1) {
          this.message.create('success', `Thêm người dùng thành công`);
        } else {
          this.message.create('error', `Thêm lỗi`);

        }
      });
    } else {
      this.isLoading = true;
      this.usersv.Update(data).subscribe(
        (result: any) => {
          if (result === 1) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.NguoiDung,
              thamChieu: 'Họ tên người dùng: ' + data.fullName,
              refId: data.userId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            this.data.fullName = data.fullName;
            this.data.email = data.email;
            this.data.title = data.title;
            this.data.dateOfBirth = data.dateOfBirth;
            this.data.phone = data.phone;
            this.data.address = data.address;
            localStorage.setItem('currentUser', JSON.stringify(this.data));

            this.shareService.emitChange({
              type: 'UpdateUser',
              value: this.data
            });

            this.message.create('success', `Cập nhật tài khoản thành công`);
            this.LoadData();

            this.isLoading = false;
          } else {
            this.message.create('error', `Sửa lỗi`);

            this.isLoading = false;
          }
        }
      );
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }

  LoadData() {
    this.usersv.GetById(this.data.userId).subscribe(
      (res: any) => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.data = res;
      },
      err => {

      }
    );
  }
}
