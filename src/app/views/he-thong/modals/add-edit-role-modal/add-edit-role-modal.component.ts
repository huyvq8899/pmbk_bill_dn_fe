import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RoleService } from 'src/app/services/role.service';
import { Message } from 'src/app/shared/Message';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-add-edit-role-modal',
  templateUrl: './add-edit-role-modal.component.html',
  styleUrls: ['./add-edit-role-modal.component.scss']
})
export class AddEditRoleModalComponent implements OnInit {
  @Input() data: any;
  @Input() listFunctions: any[];
  @Input() isAddNew: boolean;
  @Input() isCopy: boolean;
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

    var myData = this.myFormGroup.getRawValue();
    if(this.isCopy == true) myData.roleId = null;
    if(this.isAddNew || this.isCopy) {
      this.roleService.CheckTrungMaWithObjectInput(myData).subscribe((res: number) => {
        if(res > 0){
          this.message.warning(Message.CODE_EXISTED);
          this.spinning = false;
          return;
        }
        this.roleService.Insert(myData).subscribe((res: any) => {
          if (res != null) {
            if(this.listFunctions != null && this.listFunctions.length > 0){
              const params = {
                roleId: res.roleId,
                roleName: res.roleName,
                functionIds: this.listFunctions
              }

              console.log(params);
              this.roleService.InsertMultiFunctionRole(params).subscribe((rs: any)=>{
                if(rs){
                  this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
                  this.spinning = false;
                  this.modal.destroy(true);
                }
              },  _ => {
                this.spinning = false;
                this.message.error(TextGlobalConstants.TEXT_ERROR_API);
              });
            }
            else{
              this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
              this.spinning = false;
              this.modal.destroy(true);
            }
          }
        }, _ => {
          this.spinning = false;
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        });
      });
    } else {
      this.roleService.CheckTrungMaWithObjectInput(myData).subscribe((res: number) => {
        if(res == 1 && myData.roleName != this.data.roleName){
          this.message.warning(Message.CODE_EXISTED);
          this.spinning = false;
          return;
        }
        if(res > 1){
          this.message.warning(Message.CODE_EXISTED);
          this.spinning = false;
          return;
        }
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
      });
    }
  }
}
