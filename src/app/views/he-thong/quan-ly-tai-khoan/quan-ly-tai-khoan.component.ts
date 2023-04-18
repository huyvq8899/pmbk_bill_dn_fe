import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { AccountChangepassComponent } from 'src/app/user/account/modals/account-changepass/account-changepass.component';
import { AccountAddEditModalComponent } from 'src/app/user/account/modals/account-add-edit-modal/account-add-edit-modal.component';
import { go_full_screen } from 'src/app/customValidators/set-full-screen';
import { NhomTaiKhoanAddEditModalComponent } from 'src/app/user/account/modals/nhom-tai-khoan-add-edit-modal/nhom-tai-khoan-add-edit-modal.component';
import { PhanQuyenTaiKhoanModalComponent } from 'src/app/user/account/modals/phan-quyen-tai-khoan-modal/phan-quyen-tai-khoan-modal.component';
import { getHeightBangKe, getHeightBangKe4, getHeightSimpleTable } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { FilterColumn, FilterCondition, PagingParams } from 'src/app/models/PagingParams';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';

@Component({
  selector: 'app-quan-ly-tai-khoan',
  templateUrl: './quan-ly-tai-khoan.component.html',
  styleUrls: ['./quan-ly-tai-khoan.component.scss']
})
export class QuanLyTaiKhoanComponent extends TabShortKeyEventHandler implements OnInit {
  scrollConfig = { y: '480px' };
  widthConfig = ['20%', '11%', '15%', '15%', '7%', '8%', '17%', '7%'];
  fullScreen = false;
  userListView: any[] = [];
  userAll: any[] = [];
  loadingTable = false;
  selectedUserId: any = null;
  currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
  selectedUser: any;
  total: number = 0;
  params: PagingParams = {
    PageNumber: 1,
    PageSize: -1,
    Keyword: '',
    SortKey: '',
    Filter: {},
    filterColumns: []
  };
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  displayDataTemp = Object.assign({}, this.params);
  rowScrollerToViewEdit = new RowScrollerToViewEdit();

  constructor(
    private usersv: UserService,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) {
    super();
   }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.scrollConfig.y = (getHeightBangKe4()) + 'px';
    this.load(true);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollConfig.y = (getHeightBangKe4()) + 'px';
  }

  load(init = false, reset = false, added = null) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loadingTable = true;
    this.usersv.getAll(this.params).subscribe((rs: any) => {
      this.userListView = rs.items;
      this.userAll = rs.items;
      this.total = this.userListView.length;
      this.loadingTable = false;

      if (this.userListView.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.load();
      }

      if(added) {
        var itemAdd = this.userListView.find(x=>x.userId == added.userId);
        var indexAdd = this.userListView.indexOf(itemAdd);
        if(indexAdd != -1){
        this.selectedRow(this.userListView[indexAdd]);
        }
        else {
          this.params.PageNumber += 1;
          this.load(false, false, added);
        }
      }
      else{
        if(init && this.userListView.length > 0) this.selectedRow(this.userListView[0]);
        else{
          this.rowScrollerToViewEdit.scrollToRow(this.userListView, "userId").then((result) => {
            this.selectedRow(result);
          });
        }
      }
    }, _ => {
      this.loadingTable = false;
    });
  }
  changeStatus(userId: string) {
    this.usersv.changeStatus(userId).subscribe(rs => {
      if (rs) {
        this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
      } else {
        this.message.error('Lỗi cập nhật trạng thái');
      }
    }, _ => {
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
    });
  }

  changePass() {
    if(this.selectedUserId == null) return;
    const vals = this.userListView.filter(x=>x.selected == true);
    if(vals.length == 0) return;
    const data = vals[0];

    var userId = data.userId;
    var isAdmin = data.isAdmin;
    if (isAdmin === null) isAdmin = false;

    this.usersv.GetById(userId).subscribe((rs: any)=>{
      const modal = this.modalService.create({
        nzTitle: 'Đặt lại mật khẩu',
        nzContent: AccountChangepassComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: 500,
        nzBodyStyle: { padding: '10px 10px 0px 10px' },
        nzComponentParams: {
          id: userId,
          data: rs
        },
        nzFooter: [
          {
            label: 'Lưu',
            type: 'default',
            onClick: (componentInstance) => {
              componentInstance.saveChanges();
            }
          },
          {
            label: 'Hủy',
            shape: 'default',
            onClick: () => modal.destroy(),
          }
        ]
      });
      modal.afterClose.subscribe((result: boolean) => {
        if (result) {
          // this.loadData();
        }
      });
    })
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.params.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        this.viewConditionList.push({
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: item.colValue
        });
      }
    });

    this.load();
  }
  removeFilter(filter: any) {

    const idxdisplayData = this.displayDataTemp.filterColumns.findIndex(x => x.colKey === filter.key);
    this.displayDataTemp.filterColumns.splice(idxdisplayData, 1);
    const idx = this.viewConditionList.findIndex(x => x.key === filter.key);
    this.viewConditionList.splice(idx, 1);
    this.mapOfHightlightFilter[filter.key] = false;
    this.params = Object.assign({}, this.displayDataTemp);

    this.loadViewConditionList();
  }
  onFilterCol(rs: any) {
    const filterColData = this.params.filterColumns.find(x => x.colKey === rs.colKey);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    //remove
    if (rs.status == false) {
      this.params.filterColumns = [];
      this.viewConditionList = [];
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    this.loadViewConditionList();
  }

  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfVisbleFilterCol[colName] = event;

    this.inputFilterColData = this.params.filterColumns.find(x => x.colKey === colName) || null;

    if (!this.inputFilterColData) {
      this.inputFilterColData = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.params.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }


  sort(sort: { key: string; value: string }): void {
    console.log(sort);
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.load();
  }


  phanQuyen() {
    if (this.selectedUserId == null) return;
    const vals = this.userListView.filter(x => x.selected == true);
    if (vals.length == 0) return;
    const data = vals[0];

    var userId = data.userId;
    var isAdmin = data.isNodeAdmin;
    var userName = data.userName;
    if (isAdmin === null) isAdmin = false;

    const modal = this.modalService.create({
      nzTitle: 'Phân quyền người dùng',
      nzContent: PhanQuyenTaiKhoanModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '75%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        userId: userId,
        isAdmin: isAdmin,
        userName: userName
      },
      nzFooter: [
        {
          label: 'Đóng',
          shape: 'default',
          onClick: (componentInstance) => {
            if(componentInstance.isSaveClicked){
            modal.destroy();
            }
            else{
              const modal = componentInstance.modalService.create({
                nzTitle: "<b>Lưu ý</b>",
                nzIconType: 'info',
                nzContent: "Bạn đã thay đổi chức năng được sử dụng của người dùng.<br>" +
                "Bạn có thể chọn <b>Đồng ý</b> để lưu, chọn <b>Không</b> để đóng giao diện, hoặc <b>Quay lại</b> để thao tác chỉnh sửa.",
                nzFooter: [
                  {
                    label: 'Quay lại',
                    type: 'primary',
                    onClick: ()=>{
                      modal.destroy();
                      return;
                    }
                  },
                  {
                    label: 'Không',
                    type: 'danger',
                    onClick: ()=>{
                      componentInstance.modal.destroy();
                      modal.destroy();
                    }
                  },
                  {
                    label: "Đồng ý",
                    type: 'success',
                    onClick: ()=>{
                      componentInstance.saveChanges();
                      modal.destroy();
                    }
                  }
                ]
              })
            }
          },
        },
        {
          label: 'Lưu',
          type: 'default',
          disabled: (componentInstance)=>componentInstance.isSaveDisabled,
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });
    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.load();
      }
    });
  }

  clickThem() {
  if(this.ActivedModal != null) return;
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm người dùng',
      nzContent: AccountAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 500,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: [
        {
          label: 'Hủy',
          type: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Lưu',
          type: 'default',
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });
    modal.afterClose.subscribe((result: any) => {
      this.ActivedModal =null;
      if (result != false) {
        this.load(false, true, result);
      }
    });
  }
  clickSua() {
    if(this.ActivedModal != null) return;
    this.loadingTable = true;
    if (this.selectedUserId == null) {
      this.loadingTable = false;
      return;
    }

    this.usersv.GetById(this.selectedUserId).subscribe((rs: any) => {
      this.loadingTable = false;
      if (rs) {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: 'Sửa thông tin người dùng',
          nzContent: AccountAddEditModalComponent,
          nzMaskClosable: true,
          nzClosable: false,
          nzWidth: 500,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isAddNew: false,
            data: rs
          },
          nzFooter: [
            {
              label: 'Lưu',
              type: 'default',
              onClick: (componentInstance) => {
                componentInstance.saveChanges();
              }
            },
            {
              label: 'Hủy',
              shape: 'default',
              onClick: () => modal.destroy(),
            }
          ]
        });
        modal.afterClose.subscribe((result: boolean) => {
          this.ActivedModal = null;
          if (result) {
            this.load();
          }
        });
      }
    });
  }
  setRole(roleName: string) {
    if (this.selectedUserId == null) return;
    const model: any = {
      userId: this.selectedUserId,
      roleName: roleName
    };
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
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: `Phân quyền người dùng`,
        msContent: `Bạn đang phân quyền <b>${roleName}</b> cho người dùng đã chọn. Bạn có chắc chắn không?`,
        msOnClose: () => {
        },
        msOnOk: () => {
          this.usersv.SetRole(model).subscribe(rs => {
            if (rs) {
              this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
              this.load();
            } else {
              this.message.error('Lỗi cập nhật');
            }
          }, _ => {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
          });
        }

      }
    });
  }
  changeSearch(event: any) {
    const arrCondition = ['userName', 'fullName', 'title', 'createdDate', 'email', 'phone', 'address'];
    this.userListView = SearchEngine(this.userAll, arrCondition, event);
  }

  selectedRow(data) {
    if (data.selected == true) {
      data.selected = false;
      this.selectedUserId = null;
      this.selectedUser = null;
      return;
    }


    for (var i = 0; i < this.userListView.length; i++) {
      this.userListView[i].selected = false;
    }

    if (this.selectedUserId != null) this.selectedUserId = null;
    data.selected = true;
    this.selectedUserId = data.userId;
    this.selectedUser = data;
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   // tslint:disable-next-line: deprecation
  //   if ((event.ctrlKey || event.metaKey) && event.keyCode === 73) {
  //     this.clickThem();
  //   }
  //   if ((event.ctrlKey || event.metaKey) && event.keyCode === 122) {
  //     this.toggleFullScreen();
  //   }
  // }

  toggleFullScreen() {
    this.fullScreen = !this.fullScreen;
    go_full_screen();
  }
  clickXem(){

  }
  clickXoa(){

  }
}
