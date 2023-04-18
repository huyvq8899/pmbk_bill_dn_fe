import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UserService } from 'src/app/services/user.service';
import { CheckChangePasswordConfirmValidator } from 'src/app/customValidators/check-change-password-confirm-validator';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account-changepass',
  templateUrl: './account-changepass.component.html',
  styleUrls: ['./account-changepass.component.css']
})
export class AccountChangepassComponent implements OnInit {
  @Input() id: any;
  @Input() data: any;
  @Input() forgotPassword: boolean = true;
  changePasswordForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private authService: AuthService) {
    }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: [this.forgotPassword ? this.data.password : null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [
        Validators.required,
        CheckChangePasswordConfirmValidator
      ]]
    });

    this.changePasswordForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }

  saveChanges() {
    let invalidFormChung = false;
    if (this.changePasswordForm.invalid) {
      // tslint:disable-next-line:forin
      for (const key in this.changePasswordForm.controls) {
        invalidFormChung = true;
        this.changePasswordForm.controls[key].markAsDirty();
        this.changePasswordForm.controls[key].updateValueAndValidity();
      }

      if (invalidFormChung) {
        setStyleTooltipError(true);
        return;
      }
    }
    const data = this.changePasswordForm.getRawValue();

    const obj: any = {
      userId: this.id,
      password: data.password,
      currentPassword: data.currentPassword
    };
    this.userService.UpdatePassWord(obj).subscribe((res: any) => {
      if (res === 1) {
        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.Sua,
          refType: RefType.NguoiDung,
          thamChieu: 'Tên đăng nhập: ' + this.data.userName,
          moTaChiTiet: "Đã thay đổi mật khẩu",
          refId: this.data.userId
        }).subscribe();

        //this.message.success('Đặt lại mật khẩu thành công');
        const modal1 = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: `Đặt lại mật khẩu`,
            msContent: `Đặt lại mật khẩu thành công. ${this.forgotPassword ? '' : "Bạn có muốn đăng nhập lại bằng mật khẩu mới không?"}`,
            msMessageType: this.forgotPassword ? MessageType.Info : MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { },
            msOnOk: ()=>{
              this.modal.destroy(true);
              this.authService.logout();
            },
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT
          }
        });

        this.changePasswordForm.reset();
        this.modal.destroy(true);
      } else if(res == -1){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: `Kiểm tra lại`,
            msContent: `Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        });

        return;
      } else {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: `Kiểm tra lại`,
            msContent: `Đặt lại mật khẩu không thành công<br> Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        });
        this.modal.destroy(false);
      }
    }, _ => {
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      this.modal.destroy(false);
    });
  }

  closeModal() {
    this.modal.destroy();
  }
}
