import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { GetDate } from 'src/app/shared/getDate';
import { NoWhitespaceValidator } from 'src/app/customValidators/no-whitespace-validator';
import { ValidatorsDupcateName } from 'src/app/customValidators/validatorsDupcateName';
import { ValidatorsDupcateMail } from 'src/app/customValidators/validatorsDupcateMail';
import { Message } from 'src/app/shared/Message';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-account-add-edit-modal',
  templateUrl: './account-add-edit-modal.component.html',
  styleUrls: ['./account-add-edit-modal.component.css']
})
export class AccountAddEditModalComponent implements OnInit {
  @Input() isAddNew: boolean;
  @Input() data: any;
  userForm: FormGroup;
  roles: any = [];
  listChucDanh: any[] = [];

  constructor(
    private rolesv: RoleService,
    private usersv: UserService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modal: NzModalRef) { }
  ngOnInit() {
    //cài đặt list chức danh
    this.listChucDanh.push('Giám đốc');
    this.listChucDanh.push('Kế toán trưởng');
    this.listChucDanh.push('Kế toán tổng hợp');
    this.listChucDanh.push('Kế toán');
    this.listChucDanh.push('Thủ kho');
    this.listChucDanh.push('Thủ quỹ');

    this.rolesv.GetAll().subscribe(rs => {
      this.roles = rs;
    });
    if (this.isAddNew === true) {
      this.createformInsert();
      this.getThongTinGanNhat();
    } else {
      this.createformUpdate();
      this.userForm.patchValue(this.data);
      this.userForm.get('dateOfBirth').setValue(GetDate(this.data.dateOfBirth));
    }
  }

  createformInsert() {
    this.userForm = this.fb.group({
      userId: [null],
      userName: [null, [Validators.required, NoWhitespaceValidator]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, NoWhitespaceValidator], [ValidatorsDupcateMail(this.usersv, '')]],
      title: [null],
      roleId: [null],
      dateOfBirth: [null],
      phone: [null],
      address: [null],
      isAdmin: [false]
    });

  }

  createformUpdate() {
    this.userForm = this.fb.group({
      userId: [null, [Validators.required]],
      userName: [{ value: null, disabled: true }, [Validators.required, NoWhitespaceValidator]],
      fullName: [null, [Validators.required]],
      // tslint:disable-next-line: max-line-length
      email: [{ value: null, disabled: false }, [Validators.required, Validators.email, NoWhitespaceValidator], [ValidatorsDupcateMail(this.usersv, this.data.email)]],
      title: [null],
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
      this.usersv.CheckTrungTenDangNhap(data).subscribe((res: number) => {
        if (res > 0) {
          this.message.warning(Message.CODE_EXISTED);
          return;
        }
        this.usersv.Insert(data).subscribe((rs: any) => {
          if (rs) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Them,
              refType: RefType.NguoiDung,
              thamChieu: 'Họ tên người dùng: ' + rs.fullName,
              refId: rs.userId,
            }).subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Info,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: `Thêm người dùng`,
                msContent: `Thêm người dùng thành công. Mật khẩu mặc định truy cập hệ thống của người dùng <span class="TBAOINFO"><b>${data.userName}</b></span> là <b>123456</b>. Vui lòng yêu cầu người dùng thay đổi mật khẩu mặc định khi truy cập.`,
                msOnClose: () => {
                }
              }
            });
            this.modal.destroy(rs);
          } else {
            this.message.create('error', `Thêm lỗi`);

            this.modal.destroy(rs);
          }
        });
      });
    } else {
      this.usersv.CheckTrungTenDangNhap(data).subscribe((res: number) => {
        if (res > 1 || (res == 1 && data.userName != this.data.userName)) {
          this.message.warning(Message.CODE_EXISTED);
          return;
        }
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

              this.message.create('success', `Cập nhật tài khoản thành công`);
              this.modal.destroy(result);
            } else {
              this.message.create('error', `Sửa lỗi`);

              this.modal.destroy(result);
            }
          }
        );
      });
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }

  destroyModal() {
    this.modal.destroy();
  }

  getThongTinGanNhat() {
    this.usersv.GetThongTinGanNhat().subscribe((res: any) => {
      if (res != null) {
        this.userForm.get('title').setValue(res.title);
      }
    });
  }
}
