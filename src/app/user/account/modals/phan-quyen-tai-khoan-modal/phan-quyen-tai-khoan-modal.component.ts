import { Component, OnInit, Input, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { ModalBuilderForService } from 'ng-zorro-antd/modal/nz-modal.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { FunctionService } from 'src/app/services/function.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { Message } from 'src/app/shared/Message';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getListEmptyBangKeTmp } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

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
  selector: 'phan-quyen-tai-khoan-modal',
  templateUrl: './phan-quyen-tai-khoan-modal.component.html',
  styleUrls: ['./phan-quyen-tai-khoan-modal.component.css']
})
export class PhanQuyenTaiKhoanModalComponent implements OnInit {
  nhomTaiKhoanForm: FormGroup;
  loading: boolean = false;
  loadingDSChucNang: boolean = false;
  listThaoTac: any[] = [];
  loadingDSThaoTac: boolean = false;
  pageSize = 10000; //cho hiển thị tất cả function
  listFunction: any[] = [];
  listRole: any[] = [];
  listCheckedFunctionRole = [];
  selectedRoleId = 'new';
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  listCheckedFunctionUser = [];
  listCurrFunctions = [];
  listCheckedRole = [];
  nhomTaiKhoanDaChon = '';
  checkAll: boolean = true;
  checkIndeterminate: boolean = true;
  @Input() userId = '';
  @Input() isAdmin;
  @Input() userName = '';
  isSaved = false;
  isSaveDisabled = true;
  isSaveClicked = false;
  lstBangKeEmpty = [];
  scrollConfig = { x: '300px', y: '500px' };
  widthConfigM = ['50px', '80px', '50px', '120px', '200px'];
  scrollConfigM = { x: SumwidthConfig(this.widthConfigM), y: '500px' };
  numberBangKeCols: any[];
  listMauHoaDon: any[] = [];
  totalM = 0;
  isAllDisplayDataCheckedM: boolean;
  isIndeterminateM: boolean;
  numberBangKeMCols: any[];
  lstBangKeEmptyM: any[];
  chucNangTitle = "";
  setOfCheckedRoldId = new Set<string>();
  constructor(
    public modal: NzModalRef,
    private usersv: UserService,
    private rolesv: RoleService,
    private functionsv: FunctionService,
    private fb: FormBuilder,
    private message: NzMessageService,
    public modalService: NzModalService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.createForm();
    this.loadRoleByUserData();
    this.loadFunctionData(this.userId);
    this.numberBangKeMCols = Array(5).fill(0);
    this.lstBangKeEmptyM = getListEmptyBangKeTmp(this.listMauHoaDon);
    this.selectedTab(0);
  }

  // createForm() {
  //   this.nhomTaiKhoanForm = this.fb.group({ tenNhomTaiKhoan: [''], nhomTaiKhoan: this.fb.array([]) });
  // }
  GetMauHoaDonDaDuocPhanQuyen(roleId: string) {
    this.rolesv.GetListHoaDonDaPhanQuyen(roleId).subscribe((rs: any[]) => {
      console.log("🚀 ~ file: phan-quyen-tai-khoan-modal.component.ts:94 ~ PhanQuyenTaiKhoanModalComponent ~ this.rolesv.GetListHoaDonDaPhanQuyen ~ rs", rs)
      this.listMauHoaDon = rs;
      this.listMauHoaDon.forEach(element => {
        if(element.mauHoaDons.lenght > 0) {
          console.log('huvq');
          
        }
      });
      this.totalM = rs.length;

    })
  }

  loadRoleByUserData() {
    this.loading = true;
    this.usersv.GetAllByUserId(this.userId).subscribe((res: any) => {
      this.listRole = res;
      for (let i = 0; i < res.length; i++) {
        if (res[i].userId != null) {
          this.listCheckedRole.push(res[i].roleId);
          if(res[i].selected == false)this.checkAll =false;
        }
      }

      if (this.isAdmin) {
        for (let i = 0; i < this.listRole.length; i++) {
          this.listRole[i].disabledCheck = true;
        }

      } else {
        for (let i = 0; i < this.listRole.length; i++) {
          this.listRole[i].disabledCheck = false;
        }
      }
      this.loading = false;
    });
  }

  loadFunctionData(userId: string) {
    this.loading = true;
    this.functionsv.GetAllForTreeByUser(userId).subscribe((res2: any) => {
      this.listFunction = res2.functionByTreeViewModel;
      this.listFunction.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

      for (let i = 0; i < res2.selectedFunctions.length; i++) {
        this.listCheckedFunctionUser.push(res2.selectedFunctions[i].functionId);
        this.listCurrFunctions.push(res2.selectedFunctions[i].functionId);
      }

      if (this.isAdmin) {
        for (let i = 0; i < this.listFunction.length; i++) {
          this.listFunction[i].disabledCheck2 = true;
          this.checkAllOfTree(this.listFunction[i]);
        }
      } else {
        for (let i = 0; i < this.listFunction.length; i++) {
          this.listFunction[i].disabledCheck2 = false;
        }
      }
      if (this.listCheckedRole.length > 0) {
        var checked = this.listRole.find(x => x.roleId == this.listCheckedRole[0]);
        this.selectedRow(checked);
        this.changeChonNhomTaiKhoan(checked, true);
      }
      this.loading = false;
    });
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
        this.selectRow(this.listFunction[0].children[0]);
        this.loadingDSChucNang = false;
      });

    this.GetMauHoaDonDaDuocPhanQuyen(this.selectedRoleId);
    this.selectedTab(0);
  }

  changeCheckAll(event: any) {
    this.listRole.forEach(item => this.updateCheckedSet(item.roleId, event));
    this.refreshCheckedStatus();
  }

  getUsedFunction(tree: any) {
    var usedFunction = [];
    if (tree.suDung == true) {
      if (tree.children == null || tree.children == undefined || tree.children.length == 0) {
        usedFunction.push(tree.functionId);
      }
      else {
        usedFunction.push(tree.functionId);
        if (tree.children != null && tree.children != undefined && tree.children.length != 0) {
          for (let i = 0; i < tree.children.length; i++) {
            var lstTree = this.getUsedFunction(tree.children[i]);
            if (lstTree.length != 0) {
              for (let idx = 0; idx < lstTree.length; idx++)
                usedFunction.push(lstTree[idx]);
            }
          }
        }
      }
    }
    else {
      if (tree != null && tree != undefined) {
        if (tree.children != null && tree.children != undefined && tree.children.length != 0) {
          for (let i = 0; i < tree.children.length; i++) {
            var lstTree = this.getUsedFunction(tree.children[i]);
            if (lstTree.length != 0) {
              for (let idx = 0; idx < lstTree.length; idx++)
                usedFunction.push(lstTree[idx]);
            }
          }
        }
      }
    }

    return usedFunction;
  }
  changeCheckAllOfTree(tree: any, listCheckedFunctions: any[]) {
    if (tree.children == null || tree.children == undefined || tree.children.length == 0) {
      if (listCheckedFunctions.indexOf(tree.functionId) != -1) {
        tree.suDung = true;
      }
      else {
        tree.suDung = false;
      };
    }
    else {
      if (listCheckedFunctions.indexOf(tree.functionId) != -1) {
        tree.suDung = true;
      }
      else {
        tree.suDung = false;
      }
      for (let i = 0; i < tree.children.length; i++) {
        this.changeCheckAllOfTree(tree.children[i], listCheckedFunctions);
      }
    }
  }

  checkAllOfTree(tree: any) {
    if (tree.children == null || tree.children == undefined || tree.children.length == 0) {
      tree.suDung = true;
      if (this.listCheckedFunctionUser.indexOf(tree.functionId) == -1) this.listCheckedFunctionUser.push(tree.functionId);
    }
    else {
      tree.suDung = true;
      if (this.listCheckedFunctionUser.indexOf(tree.functionId) == -1) this.listCheckedFunctionUser.push(tree.functionId);

      for (let i = 0; i < tree.children.length; i++) {
        this.checkAllOfTree(tree.children[i]);
      }
    }
  }

  removeAllOfTree(tree: any) {
    if (tree.children == null || tree.children == undefined || tree.children.length == 0) {
      tree.suDung = false;
    }
    else {
      tree.suDung = false;
      for (let i = 0; i < tree.children.length; i++) {
        this.removeAllOfTree(tree.children[i]);
      }
    }
  }

  addAllOfTree(tree: any) {
    if (tree.children == null || tree.children == undefined || tree.children.length == 0) {
      if (this.listCheckedFunctionUser.indexOf(tree.functionId) == -1) this.listCheckedFunctionUser.push(tree.functionId);
    }
    else {
      if (this.listCheckedFunctionUser.indexOf(tree.functionId) == -1) this.listCheckedFunctionUser.push(tree.functionId);
      for (let i = 0; i < tree.children.length; i++) {
        this.addAllOfTree(tree.children[i]);
      }
    }
  }
  refreshCheckedStatus(): void {
    this.checkAll = this.listRole.every(item => this.setOfCheckedRoldId.has(item.roleId));
    this.checkIndeterminate = this.listRole.some(item => this.setOfCheckedRoldId.has(item.roleId)) && !this.checkAll;
  }
  updateCheckedSet(roleId: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedRoldId.add(roleId);
    } else {
      this.setOfCheckedRoldId.delete(roleId);
    }
  }

  changeChonNhomTaiKhoan(event: any, data: any) {
    if (this.isSaveDisabled == true) this.isSaveDisabled = false;
    this.updateCheckedSet(data.roleId,event);
    this.refreshCheckedStatus();
    if (event) {
      this.listCheckedRole.push(data.roleId);
      this.GetMauHoaDonDaDuocPhanQuyen(data.roleId);
    }
    else {
      this.listCheckedRole.forEach((element, index) => {
        if (element == data.roleId) this.listCheckedRole.splice(index, 1);
      });
      this.listMauHoaDon = [];
    }
    if (this.isSaveClicked == true) this.isSaveClicked = false;

    this.listCheckedFunctionUser = [];
    this.loadingDSChucNang = true;
    console.log("this.listCheckedRole.length > 0: " + (this.listCheckedRole.length > 0));
    console.log(this.listCheckedRole);
    if (this.listCheckedRole.length > 0) {
      let observables: Observable<any>[] = [];
      for (let i = 0; i < this.listCheckedRole.length; i++) {
        if (this.listCheckedRole[i] != null && this.listCheckedRole[i] != undefined) {
          observables.push(this.functionsv.GetAllForTreeByRole(this.listCheckedRole[i]));
        }
      }
      forkJoin(observables)
        .subscribe((dataArray: any[]) => {

          // All observables in `observables` array have resolved and `dataArray` is an array of result of each observable
          for (let idx = 0; idx < dataArray.length; idx++) {
            for (let i = 0; i < dataArray[idx].functionByTreeViewModel.length; i++) {
              var lstTree = dataArray[idx].selectedFunctions.map(x => x.functionId);
              if (lstTree.length > 0) {
                for (let j = 0; j < lstTree.length; j++) {
                  if (this.listCheckedFunctionUser.indexOf(lstTree[j]) == -1 && lstTree[j] != null && lstTree[j] != undefined)
                    this.listCheckedFunctionUser.push(lstTree[j]);
                }
              }
            }
          }
          this.loadingDSChucNang = false;

          console.log(this.listRole);
          console.log(this.listCheckedRole[0]);
          if (this.listCheckedRole[0] != undefined)
            this.selectedRow(this.listRole.find(x => x.roleId == this.listCheckedRole[0]));

        });
    }
    else {

      this.selectedRow(this.listRole[0]);
      this.listCheckedFunctionUser = [];
      this.loadingDSChucNang = false;
    }
    if (this.isSaved == true) this.isSaved = false;
  }

  changeSuDung(event: any, data: any, array: any[], indeterminate: boolean = false) {

    if (event) {
      if (this.listCheckedFunctionUser.indexOf(data.functionId) < 0) {
        this.listCheckedFunctionUser.push(data.functionId);
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
        data.parent.suDung = data.parent.children.filter(item => item.suDung === false).length < 1;
        data.parent.indeterminate = data.parent.children.filter(item => item.suDung === true
          || item.indeterminate === true).length > 0 && !data.parent.suDung;
        this.changeSuDung(true, data.parent, array, true);
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
        data.parent.suDung = data.parent.children.filter(item => item.suDung === false).length < 1;
        data.parent.indeterminate = data.parent.children.filter(item => item.suDung === true
          || item.indeterminate === true).length > 0 && !data.parent.suDung;
        if (data.parent.suDung === false) {
          this.changeSuDung(false, data.parent, array, true);
        }
      }
      if (indeterminate === false || (data.suDung === false && data.indeterminate === false)) {
        const index = this.listCheckedFunctionUser.indexOf(data.functionId);
        if (index > -1) {
          this.listCheckedFunctionUser.splice(index, 1);
        }
      }
    }
  }

  changeIsAdmin(event: any) {
    if (this.isSaveDisabled == true) this.isSaveDisabled = false;
    this.isAdmin = event;
    if (this.isSaveClicked == true) this.isSaveClicked = false;
    if (this.isAdmin) {
      for (let i = 0; i < this.listRole.length; i++) {
        this.listRole[i].disabledCheck = true;
      }

      this.loadingDSChucNang = true;
      for (let i = 0; i < this.listFunction.length; i++) {
        this.listFunction[i].disabledCheck2 = true;
        this.checkAllOfTree(this.listFunction[i]);
      }

      this.listFunction.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

      this.loadingDSChucNang = false;
    } else {
      for (let i = 0; i < this.listRole.length; i++) {
        this.listRole[i].disabledCheck = false;
      }

      this.listCheckedFunctionUser = [];
      if (this.listCheckedRole.length > 0) {
        let observables: Observable<any>[] = [];
        for (let i = 0; i < this.listCheckedRole.length; i++) {
          console.log(this.listCheckedRole[i]);
          if (this.listCheckedRole[i] != null && this.listCheckedRole[i] != undefined) {

            observables.push(this.functionsv.GetAllForTreeByRole(this.listCheckedRole[i]));
          }
        }

        var lstFuncsIds = [];
        forkJoin(observables)
          .subscribe((dataArray: any[]) => {

            // All observables in `observables` array have resolved and `dataArray` is an array of result of each observable
            for (let idx = 0; idx < dataArray.length; idx++) {
              for (let i = 0; i < dataArray[idx].functionByTreeViewModel.length; i++) {
                var lstTree = this.getUsedFunction(dataArray[idx].functionByTreeViewModel[i]);
                if (lstTree.length > 0) {
                  for (let j = 0; j < lstTree.length; j++) {
                    if (lstFuncsIds.indexOf(lstTree[j]) == -1 && lstTree[j] != null && lstTree[j] != undefined)
                      lstFuncsIds.push(lstTree[j]);
                  }
                }
              }

            }

            for (let i = 0; i < lstFuncsIds.length; i++) {
              this.listCheckedFunctionUser.push(lstFuncsIds[i]);
            }

            for (let i = 0; i < this.listFunction.length; i++) {
              this.changeCheckAllOfTree(this.listFunction[i], this.listCheckedFunctionUser);
            }

            this.listFunction.forEach(item => {
              this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
            });
            this.loadingDSChucNang = false;
          });
      }
      else {
        for (let i = 0; i < this.listFunction.length; i++) {
          this.changeCheckAllOfTree(this.listFunction[i], this.listCheckedFunctionUser);
        }
        this.listFunction.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        this.loadingDSChucNang = false;
      }
    }
  }

  selectedTab(event: number) {
    if (event == 0) {
      this.chucNangTitle = "Tài khoản [ " + this.userName + " ] được sử dụng các chức năng";
    }
    else {
      this.chucNangTitle = "Tài khoản [ " + this.userName + " ] được sử dụng bộ ký hiệu hóa đơn";
    }
  }

  selectRow(data: any) {
    data.selected = true;
    this.loadingDSThaoTac = true;
    this.listThaoTac = [];
    this.listFunction.forEach(element => {
      const stack: any[] = [];
      this.mapOfExpandedData[element.key].forEach(item => {
        stack.push(item);
        while (stack.length !== 0) {
          const node = stack.pop();
          if (node.functionId !== data.functionId) {
            node.selected = false;
          } else {
            node.selected = true;
          }
          if (node.children && node.children.length > 0) {
            stack.push(...node.children);
          }
        }
      });
    });

    if (data.children == null || data.children.length == 0) {
      if (data.functionName == "ThongDiepNhan") {
        data.thaoTacs = data.thaoTacs.filter(x => x.ma != "MNG_DELETE" && x.ma != "MNG_CREATE" && x.ma != "MNG_UPDATE");
      }
      if(data.functionName == "ThongTinHoaDon"){
        data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_DELETE" && x.ma != "MNG_SEND" && x.ma != "MNG_CREATE");
      }

      if (data.functionName != "ThongDiepNhan" && data.functionName != "ThongDiepGui") {
        data.thaoTacs = data.thaoTacs.filter(x => x.ma != "MNG_EXPORT");
      }

      if (data.functionName != "BoKyHieuHoaDon") {
        data.thaoTacs = data.thaoTacs.filter(x => x.ma != "MNG_CONFIRM");
      }

      data.thaoTacs.forEach(x=>{
        if(x.ma == "DM_CREATE"){
          if(data.functionName == "KhachHang" || data.functionName == "NhanVien" || data.functionName == "HangHoaDichVu"){
            x.ten = "Thêm/Nhân bản/Nhập khẩu";
          } 
          else x.ten = "Thêm/Nhân bản";
        }
        else if(x.ma == "MNG_CREATE"){
          x.ten = "Thêm/Nhân bản";
        }
      })
      this.listThaoTac = data.thaoTacs;
    }
    this.numberBangKeCols = Array(2).fill(0);
    this.lstBangKeEmpty = getListEmptyBangKeTmp(this.listThaoTac);
    this.loadingDSThaoTac = false;
  }

  saveChanges(): void {
    if (this.userId === '' || this.userId === null) return;
    this.isSaveClicked = true;
    var data: any = new Object();
    data.userId = this.userId;
    data.roleIds = this.listCheckedRole.filter(x=>x!=null) ;
    data.functionIds = this.listCheckedFunctionUser;
    data.isNodeAdmin = this.isAdmin;

    this.usersv.GetById(data.userId).subscribe((user: any) => {
      if (user != null) {
        if (user.isOnline == false) {
          this.usersv.PhanQuyenUser(data).subscribe((res: any) => {
            if (res) {
              this.message.success('Lưu dữ liệu thành công');
              this.isSaveDisabled = true;
              this.isSaved = true;
              this.modal.destroy(true);
            } else {
              this.message.error('Lỗi lưu dữ liệu');
              this.modal.destroy(false);
            }
          });
        }
        else {
          var msg = "Người dùng này đang truy cập hệ thống, bạn cần phải yêu cầu người dùng thoát ra khỏi hệ thống để đảm bảo cập nhật thành công."
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth:420,
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: `Bạn đã thay đổi chức năng được sử dụng của người dùng <b>${user.userName}</b> <br>`+msg,
              msOnClose: () => {
              },
            }
          });

          return;
        }
      }
    })
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }

  @HostListener('document:keyup.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.cdr.detectChanges();
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

  closeModal() {
    if (!this.isSaveClicked && this.isSaved) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.ConfirmBeforeClosing,
          msOnOk: () => {
            this.saveChanges();
          },
          msOnClose: () => {
            this.modal.destroy();
          }
        },
        nzFooter: null
      });
    }
    else {
      this.modal.destroy();
    }
  }

}
