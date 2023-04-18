import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RoleService } from 'src/app/services/role.service';
import { FunctionService } from 'src/app/services/function.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { AddEditRoleModalComponent } from "../modals/add-edit-role-modal/add-edit-role-modal.component";
import { getHeightBangKe, getHeightBangKeKhongChiTiet, getHeightBangKeKhongChiTiet2, getHeightSimpleTable, getHeightSimpleTable2, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet5, getListEmptyBangKeTmp } from 'src/app/shared/SharedFunction';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/share-service';
import { ChonChucNangModalComponent } from '../modals/chon-chuc-nang-modal/chon-chuc-nang-modal.component';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { SumwidthConfig } from 'src/app/shared/global';
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
  selector: 'app-quan-ly-nhom-tai-khoan',
  templateUrl: './quan-ly-nhom-tai-khoan.component.html',
  styleUrls: ['./quan-ly-nhom-tai-khoan.component.css']
})
export class QuanLyNhomTaiKhoanComponent extends TabShortKeyEventHandler implements OnInit {
  nhomTaiKhoanForm: FormGroup;
  subscription: Subscription;
  loading: boolean = false;
  loadingDSChucNang: boolean = false;
  loadingDSThaoTac: boolean = false;
  pageSize = 10000; //cho hiển thị tất cả function
  listFunction: any[] = [];
  listRole: any[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  listThaoTac: any[]=[];
  listCheckedFunctionRole = [];
  selectedRoleId = 'new';
  changed = false;
  nhomTaiKhoanDaChon = '';
  checkAll: boolean = false;
  checkIndeterminate: boolean = false;
  loadingSaveChanges = false;
  isSaveClicked = false;
  changeCount = 0;
  lstBangKeEmpty = [];
  scrollConfig = {x: "100%",  y: getHeightSimpleTable2() - 330 + "px"};
  widthConfigM = ['30px', '120px', '80px', '120px', '400px'];
  scrollConfigM = { x: SumwidthConfig(this.widthConfigM), y: getHeightSimpleTable2() - 30 + "px"};
  numberBangKeCols: any[];
  listMauHoaDon: any[]=[];
  totalM = 0;
  isAllDisplayDataCheckedM: boolean;
  isIndeterminateM: boolean;
  numberBangKeMCols: any[];
  lstBangKeEmptyM: any[];
  chucNangTitle = "";
  lstBangKeEmptyQ: any[];
  numberBangKeQCols: any[];
  dataSelected:any;

  constructor(
    private rolesv: RoleService,
    private userSv: UserService,
    private functionsv: FunctionService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private shareService: SharedService
  ) {
    super();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) - 30 + 'px';
    this.scrollConfigM.y = (getHeightBangKeKhongChiTiet2()) - 30 + 'px';
  }

  ngOnInit() {
    this.loading = true;
    this.loadingDSThaoTac = true;
    this.createForm();
    this.loadRoleData();
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) - 30 + 'px';
    this.scrollConfigM.y = (getHeightBangKeKhongChiTiet2()) - 30 + 'px';
    this.loading = false;
    this.loadingDSThaoTac = false;
  }

  createForm() {
    this.nhomTaiKhoanForm = this.fb.group({ tenNhomTaiKhoan: [''], nhomTaiKhoan: this.fb.array([]) });
  }

  clickThem() {
    if (this.ActivedModal != null) return;
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm vai trò',
      nzContent: AddEditRoleModalComponent,
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
      this.ActivedModal = null;
      if (rs) {
        this.loadRoleData();
        this.loadFunctionData();
      }
    });
  }

  clickSua(isCopy = false) {
    if (this.ActivedModal != null) return;
    var vals = this.listRole.filter(x => x.selected == true);
    if (vals.length == 0) return;
    const data = vals[0];
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: isCopy != true ? 'Sửa vai trò' : 'Nhân bản vai trò',
      nzContent: AddEditRoleModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px',
      nzStyle: { top: '30px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        data: data,
        listFunctions: this.listCheckedFunctionRole,
        isAddNew: false,
        isCopy: isCopy
        //isTienMat: this.displayData.IsTienMat
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.loadRoleData();
        this.loadFunctionData();
      }
    });
  }

  clickXoa() {
    if (this.ActivedModal != null) return;
    var vals = this.listRole.filter(x => x.selected == true);
    if (vals.length == 0) return;
    const data = vals[0];
    const modal = this.ActivedModal =
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 400,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa vai trò",
        msContent: '<span>Bạn có thực sự muốn xóa vai trò này không?</span>',
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOnOk: () => {
          this.rolesv.CheckPhatSinh(data.roleId).subscribe((rs: any)=>{
            if(rs == true){
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Kiểm tra lại`,
                  msContent: 'Danh mục Nhóm vai trò kế toán đã được chọn phân quyền cho tài khoản. Không thể xóa Nhóm vai trò kế toán nếu chưa bỏ tích chọn phân quyền cho tài khoản.<br>Vui lòng kiểm tra lại!',
                  msOnClose: () => {
                  },
                }
              });
              return;
            }
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
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msMessageType: MessageType.Warning,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: `Kiểm tra lại`,
                      msContent: 'Danh mục Nhóm vai trò kế toán đã được chọn phân quyền cho tài khoản. Không thể xóa Nhóm vai trò kế toán nếu chưa bỏ tích chọn phân quyền cho tài khoản.<br>Vui lòng kiểm tra lại!',
                      msOnClose: () => {
                      },
                    }
                  });
                }
              } else {
                this.message.error('Lỗi xóa dữ liệu');
              }
            });
          });
        },
        msOnClose: () => {  return; }
      },
    });
    modal.afterClose.subscribe((res: any) => {
      this.ActivedModal = null;
      if (res) {
        this.loadRoleData();
        this.loadFunctionData();
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
        msTitle: `Xóa vai trò kế toán đã chọn`,
        msContent: '<span>Bạn có chắc chắn muốn xóa vai trò kế toán này không?</span><br><span>Hãy cân nhắc thật kỹ trước khi xóa!</span>',
        msOnClose: () => {
        },
        msOnOk: ()=>{
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
        }
      }
    });
  }

  refreshStatusM(data: any = null): void {
    const allChecked = this.listMauHoaDon.every(value => value.active === true);
    const allUnChecked = this.listMauHoaDon.every(value => !value.active);
    this.isAllDisplayDataCheckedM = allChecked;
    this.isIndeterminateM = (!allChecked) && (!allUnChecked);

    if (data != null) {
      this.listMauHoaDon.forEach((item: any) => {
        if (item.boKyHieuHoaDonId === data.boKyHieuHoaDonId) {
          item.active = data.active;
        }
      });
    } else {
      if (allChecked) {
        this.listMauHoaDon.forEach((item: any) => item.active = true);
      }
      if (allUnChecked) {
        this.listMauHoaDon.forEach((item: any) => item.active = false);
      }
    }
  }

  checkAllM(value: boolean): void {
    this.listMauHoaDon.forEach(data => data.active = value);
    this.refreshStatusM();
  }


  loadRoleData() {
    this.rolesv.GetAll().subscribe((res: any) => {
      this.listRole = res;

      if(this.selectedRoleId != 'new'){
        for (let i = 0; i < this.listRole.length; i++) {
          if (this.listRole[i].roleId === this.selectedRoleId) {
            this.listRole[i].selected = true;
          }
        }

        var selected = this.listRole.find(x=>x.roleId == this.selectedRoleId);
        this.selectedRow(selected);
      }
      else{
        if (this.listRole && this.listRole.length > 0) {
          this.selectedRow(this.listRole[0]);
        }
      }
    });
  }

  GetMauHoaDonDaDuocPhanQuyen(roleId: string){
    this.rolesv.GetListHoaDonDaPhanQuyen(roleId).subscribe((rs: any[])=>{
      this.listMauHoaDon = rs;
      this.totalM = rs.length;
      this.numberBangKeMCols = Array(5).fill(0);
      this.lstBangKeEmptyM = getListEmptyBangKeKhongChiTiet2(this.listMauHoaDon);
    })
  }

  loadFunctionData(functionId: string = 'none') {
    this.loading = true;
    this.functionsv.GetAllForTreeByRole(functionId)
      .subscribe((res2: any) => {
        this.listFunction = res2.functionByTreeViewModel;
        this.listFunction.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        this.selectRow(this.listFunction[0]);
        this.loading = false;
      });
  }

  selectRow(data: any){
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
            this.nhomTaiKhoanDaChon = node.roleName;
          }
          if (node.children && node.children.length > 0) {
            stack.push(...node.children);
          }
        }
      });
    });

    if(data.children == null || data.children.length == 0) {
      if(data.functionName == "ThongDiepNhan"){
        data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_DELETE" && x.ma != "MNG_SEND" && x.ma != "MNG_CREATE" && x.ma != "MNG_UPDATE");
      }
      if(data.functionName == "ThongTinHoaDon"){
        data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_DELETE" && x.ma != "MNG_SEND" && x.ma != "MNG_CREATE");
      }

      if(data.functionName != "ThongDiepNhan" && data.functionName != "ThongDiepGui"){
        data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_EXPORT");
      }

      if(data.functionName != "BoKyHieuHoaDon"){
        data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_CONFIRM");
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
      this.numberBangKeCols = Array(2).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listThaoTac);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet2() - 30 + 'px';

    }
    this.loadingDSThaoTac = false;
  }

  selectedTab(event: number){
    if(event == 0){
      this.chucNangTitle = "Vai trò [ " + this.dataSelected.roleName + " ] được sử dụng các chức năng";
    }
    else{
      this.chucNangTitle = "Vai trò [ " + this.dataSelected.roleName + " ] được sử dụng bộ ký hiệu hóa đơn";
    }
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
      this.changed = true;
      this.changeCount++;
      if (this.changeCount == 1 && this.changed == true) {
        const savedStatus: any = {
          type: "Saved",
          value: { saveClicked: this.isSaveClicked, changed: this.changed }
        }
        this.shareService.emitChange(savedStatus);
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
      this.changed = true;
      this.changeCount++;
      if (this.changeCount == 1 && this.changed == true) {
        const savedStatus: any = {
          type: "Saved",
          value: { saveClicked: this.isSaveClicked, changed: this.changed }
        }
        this.shareService.emitChange(savedStatus);
      }
    }
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    if (this.changeCount != 0) this.changeCount = 0;
    for (let i = 0; i < this.listRole.length; i++) {
      this.listRole[i].selected = false;
    }

    if (data === null) {
      this.selectedRoleId = 'none';
    } else {
      this.selectedRoleId = data.roleId;
      data.selected = true;
      this.nhomTaiKhoanForm.get('tenNhomTaiKhoan').setValue(data.roleName);
      this.nhomTaiKhoanDaChon = '[  ' + data.roleName + '  ]';
      this.selectedTab(0);
    }
    this.listCheckedFunctionRole = [];
    this.loading = true;
    this.functionsv.GetAllForTreeByRole(this.selectedRoleId)
      .subscribe((res2: any) => {
        this.listFunction = res2.functionByTreeViewModel;
        var listFunctions = [];
        this.listFunction.forEach(x=>{
          listFunctions.push(x);
          if(x.children){
            x.children.forEach(ele=>{
              listFunctions.push(ele);
            })
          }
        })
        this.listFunction.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });

        for (let i = 0; i < res2.selectedFunctions.length; i++) {
          this.listCheckedFunctionRole.push(res2.selectedFunctions[i].functionId);
        }

        this.checkAll = this.listFunction.every(elem => this.listCheckedFunctionRole.indexOf(elem.functionId) > -1);
        this.checkIndeterminate = this.listFunction.some(elem => this.listCheckedFunctionRole.indexOf(elem.functionId) < 0)
          && !this.checkAll && this.listCheckedFunctionRole.length > 0;

        this.numberBangKeQCols = Array(1).fill(0);
        this.lstBangKeEmptyQ = getListEmptyBangKeKhongChiTiet2(listFunctions);
        this.scrollConfig.y = getHeightBangKeKhongChiTiet2() - 30 + 'px';
        this.selectRow(this.listFunction[0].children[0]);
        this.loading = false;
      });

    if (this.isSaveClicked == true) {
      this.isSaveClicked = false;
    }


    this.GetMauHoaDonDaDuocPhanQuyen(data.roleId);
  }

  savePQHoaDon(){
    const vals = this.listRole.filter(x => x.selected == true);
    if (vals.length == 0) return;
    let data = vals[0];

    var actives = this.listMauHoaDon.filter(x=>x.active == true).map(x=>x.boKyHieuHoaDonId);
    var listPQ = [];
    actives.forEach(x=>{
      listPQ.push({
        roleId: data.roleId,
        boKyHieuHoaDonId: x
      })
    });

    const params = {
      roleId: data.roleId,
      listPQ: listPQ
    };

    this.rolesv.PhanQuyenMauHoaDon(params).subscribe((rs: boolean)=>{
      if(rs){
        this.message.success("Phân quyền sử dụng mẫu hóa đơn cho quyền " + data.roleName + " thành công.");
      }
      else{
        this.message.error("Phân quyền sử dụng mẫu hóa đơn cho quyền " + data.roleName + " bị lỗi.");
      }

      this.GetMauHoaDonDaDuocPhanQuyen(data.roleId);
    })
  }

  clickChonChucNang() {
    const vals = this.listRole.filter(x => x.selected == true);
    if (vals.length == 0) return;
    let data = vals[0];
    const modal = this.modalService.create({
      nzTitle: 'Chọn chức năng cho vai trò [ ' + data.roleName + ' ]',
      nzContent: ChonChucNangModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "800",
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        roleId: data.roleId,
        roleName: data.roleName,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((result: boolean) => {
      this.selectedRow(data);
    });
  }

  changeTenNhomTaiKhoan(event: any) {
    if (event.toString().trim() === '') {
      this.nhomTaiKhoanDaChon = '';
      return;
    }
    this.nhomTaiKhoanDaChon = '[ ' + event + ' ]';
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
  clickXem() {

  }
}
