import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RoleService } from 'src/app/services/role.service';
import { FunctionService } from 'src/app/services/function.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { RoleAddEditModalComponent } from '../role-add-edit-modal/role-add-edit-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'nhom-tai-khoan-add-edit-modal',
  templateUrl: './nhom-tai-khoan-add-edit-modal.component.html',
  styleUrls: ['./nhom-tai-khoan-add-edit-modal.component.css']
})
export class NhomTaiKhoanAddEditModalComponent implements OnInit {
  nhomTaiKhoanForm: FormGroup;
  loading: boolean = false;
  loadingDSChucNang: boolean = false;
  pageSize = 10000; //cho hiển thị tất cả function
  listFunction: any[] = [];
  listRole: any[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  listCheckedFunctionRole = [];
  selectedRoleId = 'new';
  nhomTaiKhoanDaChon = '';
  checkAll: boolean = false;
  checkIndeterminate: boolean = false;

  constructor(
    private rolesv: RoleService,
    private functionsv: FunctionService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modal: NzModalRef) { }

  ngOnInit() {
    this.createForm();
    this.loadRoleData();
    this.loadFunctionData();
  }

  createForm() {
    this.nhomTaiKhoanForm = this.fb.group({ tenNhomTaiKhoan: [''], nhomTaiKhoan: this.fb.array([]) });
  }

  clickThem() {
    const modal1 = this.modalService.create({
      nzTitle: 'Thêm mới',
      nzContent: RoleAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px',
      nzStyle: { top: '30px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        data: {},
        isAddNew: true,
        //isTienMat: this.displayData.IsTienMat
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.loadRoleData();
        this.loadFunctionData();
      }
    });
  }

  clickSua(data) {
    const modal1 = this.modalService.create({
      nzTitle: 'Cập nhật',
      nzContent: RoleAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px',
      nzStyle: { top: '30px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        data: data,
        isAddNew: false,
        //isTienMat: this.displayData.IsTienMat
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.loadRoleData();
        this.loadFunctionData();
      }
    });
  }

  clickXoa(data) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_OK,
        msTitle: 'Xóa vai trò kế toán đã chọn',
        msContent: '<span>Bạn có chắc chắn muốn xóa vai trò kế toán này không?</span><br><span>Hãy cân nhắc thật kỹ trước khi xóa!</span>',
        msOnClose: () => {
        },
        msOnOk: () => {
          this.rolesv.Delete(data.roleId).subscribe((res: any) => {
            if (res) {
              if (res > 0) {
                this.message.success('Xóa dữ liệu thành công');
                this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').setValue('');
                this.nhomTaiKhoanDaChon = '';
                this.listCheckedFunctionRole = [];
                this.selectedRoleId = 'new';
                this.loadRoleData();
                this.loadFunctionData();
              } else {
                this.message.error('Lỗi xóa dữ liệu');
              }
            } else {
              this.message.error('Lỗi xóa dữ liệu');
            }
          });
        },
      }
    });
  }

  addNhomTaiKhoan(): void {
    this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').setValue('');
    this.nhomTaiKhoanDaChon = '';
    this.selectedRow(null);
    this.selectedRoleId = 'new';
    this.listCheckedFunctionRole = [];
  }

  deleteNhomTaiKhoan(): void {
    if (this.selectedRoleId === '' || this.selectedRoleId === 'none' || this.selectedRoleId === 'new') return;
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_OK,
        msTitle: 'Xóa vai trò kế toán đã chọn',
        msContent: '<span>Bạn có chắc chắn muốn xóa vai trò kế toán này không?</span><br><span>Hãy cân nhắc thật kỹ trước khi xóa!</span>',
        msOnClose: () => {
        },
        msOnOk: () => {
          this.rolesv.Delete(this.selectedRoleId).subscribe((res: any) => {
            if (res) {
              if (res > 0) {
                this.message.success('Xóa dữ liệu thành công');
                this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').setValue('');
                this.nhomTaiKhoanDaChon = '';
                this.listCheckedFunctionRole = [];
                this.selectedRoleId = 'new';
                this.loadRoleData();
                this.loadFunctionData();
              } else {
                this.message.error('Lỗi xóa dữ liệu');
              }
            } else {
              this.message.error('Lỗi xóa dữ liệu');
            }
          });
          },
      }
    });

  }

  loadRoleData() {
    this.loading = true;
    this.rolesv.GetAll().subscribe((res: any) => {
      this.listRole = res;

      for (let i = 0; i < this.listRole.length; i++) {
        if (this.listRole[i].roleId === this.selectedRoleId) {
          this.listRole[i].selected = true;
        }
      }
      this.loading = false;
    });
  }

  loadFunctionData() {
    this.loading = true;
    this.functionsv.GetAllForTreeByRole('none')
      .subscribe((res2: any) => {
        this.listFunction = res2.functionByTreeViewModel;
        this.listFunction.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        this.loading = false;
      });
  }



  changeCheckAll(event: any) {
    this.listFunction.forEach(item => {
      item.suDung = event;
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      this.mapOfExpandedData[item.key].forEach(element => {
        this.changeSuDung(event, element, this.mapOfExpandedData[item.key]);
      });
    });
    this.checkIndeterminate = false;
  }

  changeSuDung(event: any, data: any, array: any[], indeterminate: boolean = false) {
    if (event) {
      if (this.listCheckedFunctionRole.indexOf(data.functionId) < 0) {
        this.listCheckedFunctionRole.push(data.functionId);
      }
      if (indeterminate === false) {
        data.indeterminate = false;
      }
      if (data.children && indeterminate === false) {
        const child = array.filter(x => x.parentFunctionId === data.functionId);
        child.forEach(item => {
          item.indeterminate = false;
          item.suDung = event;
          data.children.find(x => x.functionId === item.functionId).suDung = event;
          this.changeSuDung(true, item, array);
        });
      }
      if (data.parent) {
        if (indeterminate) {
          if (data.indeterminate === true || (data.indeterminate === false && data.suDung === false)) {
            data.parent.children.find(x => x.functionId === data.functionId).indeterminate = data.indeterminate;
            data.parent.children.find(x => x.functionId === data.functionId).suDung = false;
          } else {
            data.parent.children.find(x => x.functionId === data.functionId).suDung = true;
          }
        } else {
          data.parent.children.find(x => x.functionId === data.functionId).suDung = true;
        }
        data.parent.suDung = data.parent.children.every(item => item.suDung === true);
        data.parent.indeterminate = data.parent.children.some(item => item.suDung === true
          || item.indeterminate === true) && !data.parent.suDung;
        this.changeSuDung(true, data.parent, array, true);
      } else {
        const parent = this.listFunction.find(x => x.functionId === data.functionId);
        if (data.indeterminate === true) {
          parent.suDung = false;
          parent.indeterminate = data.indeterminate;
        } else {
          parent.suDung = true;
        }
        this.checkAll = this.listFunction.every(x => x.suDung === true);
        this.checkIndeterminate = this.listFunction.some(x => x.suDung === true || x.indeterminate === true)
          && !this.checkAll;
      }
    } else {
      if (data.children && indeterminate === false) {
        const child = array.filter(x => x.parentFunctionId === data.functionId);
        child.forEach(item => {
          item.indeterminate = false;
          item.suDung = event;
          data.children.find(x => x.functionId === item.functionId).suDung = event;
          this.changeSuDung(false, item, array);
        });
      }
      if (data.parent) {
        if (indeterminate) {
          if (data.indeterminate === true || (data.indeterminate === false && data.suDung === false)) {
            data.parent.children.find(x => x.functionId === data.functionId).indeterminate = data.indeterminate;
            data.parent.children.find(x => x.functionId === data.functionId).suDung = false;
          } else {
            data.parent.children.find(x => x.functionId === data.functionId).suDung = true;
          }
        } else {
          data.parent.children.find(x => x.functionId === data.functionId).suDung = false;
        }
        data.parent.suDung = data.parent.children.every(item => item.suDung === true);
        data.parent.indeterminate = data.parent.children.some(item => item.suDung === true
          || item.indeterminate === true) && !data.parent.suDung;
        if (data.parent.suDung === false) {
          this.changeSuDung(false, data.parent, array, true);
        }
      } else {
        const parent = this.listFunction.find(x => x.functionId === data.functionId);
        parent.suDung = false;
        this.checkAll = false;
        this.checkIndeterminate = this.listFunction.some(x => x.suDung === true || x.indeterminate === true);
      }
      if (indeterminate === false || (data.suDung === false && data.indeterminate === false)) {
        const index = this.listCheckedFunctionRole.indexOf(data.functionId);
        if (index > -1) {
          this.listCheckedFunctionRole.splice(index, 1);
        }
      }
    }
  }

  selectedRow(data: any) {
    for (let i = 0; i < this.listRole.length; i++) {
      this.listRole[i].selected = false;
    }

    if (data === null) {
      this.selectedRoleId = 'none';
    } else {
      this.selectedRoleId = data.roleId;
      data.selected = true;
      this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').setValue(data.roleName);
      this.nhomTaiKhoanDaChon = '[ ' + data.roleName + ' ]';
    }
    this.listCheckedFunctionRole = [];
    this.loadingDSChucNang = true;
    this.functionsv.GetAllForTreeByRole(this.selectedRoleId)
      .subscribe((res2: any) => {
        this.listFunction = res2.functionByTreeViewModel;
        this.listFunction.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });

        for (let i = 0; i < res2.selectedFunctions.length; i++) {
          this.listCheckedFunctionRole.push(res2.selectedFunctions[i].functionId);
        }

        this.checkAll = this.listFunction.every(elem => this.listCheckedFunctionRole.indexOf(elem.functionId) > -1);
        this.checkIndeterminate = this.listFunction.some(elem => this.listCheckedFunctionRole.indexOf(elem.functionId) < 0)
          && !this.checkAll && this.listCheckedFunctionRole.length > 0;
        this.loadingDSChucNang = false;
      });
  }

  saveChanges(): void {
    if (this.selectedRoleId === '' || this.selectedRoleId === 'none') return;
    if (this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').value.toString().trim() === '') {
      this.message.warning('Bạn chưa nhập tên vai trò kế toán');
      return;
    }

    var data: any = new Object();
    if (this.selectedRoleId === 'new') {
      data.roleId = null;
      data.roleName = this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').value;
    }
    else {
      data.roleId = this.selectedRoleId;
      data.roleName = this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').value;
    }
    data.functionIds = this.listCheckedFunctionRole;

    this.rolesv.InsertMultiFunctionRole(data).subscribe((res: any) => {
      if (res) {
        this.message.success('Lưu dữ liệu thành công');
        this.loadRoleData();
      } else {
        this.message.error('Lỗi lưu dữ liệu');
      }
    });
  }

  changeTenNhomTaiKhoan(event: any) {
    if (event.toString().trim() === '') {
      this.nhomTaiKhoanDaChon = '';
      return;
    }
    this.nhomTaiKhoanDaChon = '[ ' + event + ' ]';
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }

  collapse(array: any[], data: any, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }
    array.forEach(element => {
      if (element.children && element.suDung === true) {
        const child = array.filter(x => x.parentFunctionId === element.functionId && x.suDung === true);
        if (element.children.length > child.length && child.length > 0) {
          element.indeterminate = true;
          this.checkIndeterminate = true;
        }
      }
    });
    return array;
  }

  visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
}
