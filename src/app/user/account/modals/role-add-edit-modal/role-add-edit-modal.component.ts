import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RoleService } from 'src/app/services/role.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-role-add-edit-modal',
  templateUrl: './role-add-edit-modal.component.html',
  styleUrls: ['./role-add-edit-modal.component.scss']
})
export class RoleAddEditModalComponent implements OnInit {
  @Input() data: any;
  @Input() isAddNew: boolean;
  myFormGroup: FormGroup;
  spinning: boolean;
  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private message: NzMessageService,
    private roleService: RoleService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
    if(!this.isAddNew) {
      this.myFormGroup.patchValue({
        ...this.data
      });
    }
  }

  createForm() {
    return this.myFormGroup = this.fb.group({
      roleId: [null],
      roleName: [null, [Validators.required]],
      createdDate: [null],
      createdBy: [null],
      modifyDate: [null],
      status: [null]
    });
  }

  closeModal() {
    this.modal.destroy();
  }

  submitForm() {
    if (this.myFormGroup.invalid) {
      for (const i in this.myFormGroup.controls) {
        this.myFormGroup.controls[i].markAsDirty();
        this.myFormGroup.controls[i].updateValueAndValidity();
      }
      this.spinning = false;
      return;
    }

    const myData = this.myFormGroup.getRawValue();
    if(this.isAddNew) {
      this.roleService.Insert(myData).subscribe((res: any) => {
        if (res) {
          this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
          this.spinning = false;
          this.modal.destroy(true);
        }
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      });
    } else {
      this.roleService.Update(myData).subscribe((res: any) => {
        if (res) {
          this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
          this.spinning = false;
          this.modal.destroy(true);
        }
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      });
    }
  }
}
