import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CookieConstant } from 'src/app/constants/constant';
import { ESignCloudService } from 'src/app/services/Config/eSignCloud.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-get-info-esigncloud',
  templateUrl: './get-info-esigncloud.component.html',
  styleUrls: ['./get-info-esigncloud.component.scss']
})
export class GetInfoEsigncloudComponent implements OnInit {
  url: string;
  loginForm: FormGroup;
  data: any;
  isLoadingLogin = false;
  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private eSignCloud: ESignCloudService,
    private modalService: NzModalService,
    private modal: NzModalRef) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      agreementUUID: [null, [Validators.required]],
      passCode: [null, [Validators.required]],
    });
  }
  async submitForm(): Promise<void> {
    if (this.loginForm.invalid) {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    // login
    this.isLoadingLogin = true;
    this.data = this.loginForm.value;
    this.eSignCloud.GetInfoSignCloud(this.data.agreementUUID).subscribe((rs: any) => {
      console.log('GetInfoSignCloud',rs);
      
      if (rs) {
        if (rs.certificateDN.indexOf(localStorage.getItem(CookieConstant.TAXCODE)) == -1) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Error,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Đăng nhập chữ ký HSM',
              msContent: `Tài khoản đăng nhập chữ ký HSM không khớp với mã số thuế hiện tại của doanh nghiệp.<br>Thông tin chữ ký HSM: <br>${rs.certificateDN} <br>Vui lòng thử lại.`,
            },
            nzFooter: null
          });
        this.isLoadingLogin = false;
        return;
        }

        this.message.success('Đăng nhập thành công');
        this.isLoadingLogin = false;
        this.modal.destroy(this.data);

      }
      else {
        this.message.error('Có lỗi xảy ra.');
        this.isLoadingLogin = false;
      }
    }, _ => {
      console.log(_);
      this.isLoadingLogin = false;
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
    });

  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm();
    }
  }
}
