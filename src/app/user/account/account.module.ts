import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { SharedModule } from 'src/app/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountCenterComponent } from './account-center/account-center.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountChangePasswordComponent } from './account-change-password/account-change-password.component';
//import { AccountListComponent } from './account-list/account-list.component';
//import { AccountChangepassComponent } from './modals/account-changepass/account-changepass.component';
import { AccountAddEditModalComponent } from './modals/account-add-edit-modal/account-add-edit-modal.component';
import { PhanQuyenTaiKhoanModalComponent } from './modals/phan-quyen-tai-khoan-modal/phan-quyen-tai-khoan-modal.component';
import { RoleAddEditModalComponent } from './modals/role-add-edit-modal/role-add-edit-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  declarations: [AccountComponent, AccountCenterComponent, AccountSettingComponent,
    AccountEditComponent, AccountChangePasswordComponent,
    AccountAddEditModalComponent, PhanQuyenTaiKhoanModalComponent],
  entryComponents: [
    //AccountChangepassComponent,
    AccountAddEditModalComponent,
    PhanQuyenTaiKhoanModalComponent,
  ],
})
export class AccountModule { }
