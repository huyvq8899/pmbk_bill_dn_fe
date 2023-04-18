import { Component, OnInit, Input, HostListener, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import { ModalBuilderForService } from 'ng-zorro-antd/modal/nz-modal.service';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { FunctionService } from 'src/app/services/function.service';
import { RoleService } from 'src/app/services/role.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { UserService } from 'src/app/services/user.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { Message } from 'src/app/shared/Message';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getHeightBangKe, getHeightBangKe2, getHeightBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeTmp } from 'src/app/shared/SharedFunction';
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
  selector: 'chon-chuc-nang-modal',
  templateUrl: './chon-chuc-nang-modal.component.html',
  styleUrls: ['./chon-chuc-nang-modal.component.css']
})
export class ChonChucNangModalComponent implements OnInit {
  nhomTaiKhoanForm: FormGroup;
  loading: boolean = false;
  loadingSaveChanges: boolean = false;
  loadingDSChucNang: boolean = false;
  loadingDSThaoTac: boolean = false;
  pageSize = 10000; //cho hiển thị tất cả function
  listFunction: any[] = [];
  listRole: any[] = [];
  listCheckedFunctionRole = [];
  listThaoTac: any[]=[];
  selectedRoleId = 'new';
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  listCheckedFunctionUser = [];
  listCheckedRole = [];
  nhomTaiKhoanDaChon = '';
  checkAll: boolean = false;
  checkIndeterminate: boolean = false;
  @Input() roleId = "";
  @Input() roleName = "";
  isSaved = false;
  isSaveDisabled = true;
  isSaveClicked = false;
  numberBangKeCols: any[];
  lstBangKeEmpty = [];
  lstBangKeEmptyQ: any[];
  numberBangKeQCols: any[];
  listMauHoaDon: any[]=[];
  totalM = 0;
  isAllDisplayDataCheckedM: boolean;
  isIndeterminateM: boolean;
  numberBangKeMCols: any[];
  lstBangKeEmptyM: any[];
  widthConfigM = ['50px', '120px', '80px', '120px', '300px'];
  scrollConfigM = { x: SumwidthConfig(this.widthConfigM), y: '500px'};
  scrollConfig = { x: '300px', y: '500px'};
  scrollConfigQ = { x: '100%', y: '500px'};
  constructor(
    public modal: NzModalRef,
    private usersv: UserService,
    private functionsv: FunctionService,
    private rolesv: RoleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    public modalService: NzModalService,
    private cdr: ChangeDetectorRef,
    private nhatKyTruyCapService: NhatKyTruyCapService
    ) { }

  ngOnInit() {
    // this.createForm();
    this.loadingDSChucNang = true;
    this.loadFunctionData(this.roleId);
    this.GetMauHoaDonDaDuocPhanQuyen(this.roleId);
  }

  GetMauHoaDonDaDuocPhanQuyen(roleId: string){
    this.rolesv.GetListHoaDonDaPhanQuyen(roleId).subscribe((rs: any[])=>{
      this.listMauHoaDon = rs;
      this.totalM = rs.length;

      this.numberBangKeMCols = Array(5).fill(0);
      this.lstBangKeEmptyM = getListEmptyBangKeKhongChiTiet2(this.listMauHoaDon);
      this.scrollConfigM.y = getHeightBangKeKhongChiTiet2() + 'px';
      this.refreshStatusM()   
    })
  }


  listFunctions=[];
  loadFunctionData(roleId: string) {
    this.functionsv.GetAllForTreeByRole(roleId, true).subscribe((res2: any) => {

      this.listFunction = res2.functionByTreeViewModel;
      this.listFunction.forEach(x=>{
        this.listFunctions.push(x);
        if(x.children){
          x.children.forEach(ele=>{
            this.listFunctions.push(ele);
          })
        }
      })
      this.listFunction.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });

      for (let i = 0; i < res2.selectedFunctions.length; i++) {
        this.listCheckedFunctionUser.push(res2.selectedFunctions[i].functionId);
      }


      this.loadingDSChucNang = false;
      this.numberBangKeCols = Array(2).fill(0);
      this.numberBangKeQCols = Array(1).fill(0);
      this.lstBangKeEmptyQ = getListEmptyBangKeKhongChiTiet2(this.listFunctions);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet2() + 'px';
      this.scrollConfigQ.y = getHeightBangKeKhongChiTiet2() + 'px';
      this.selectRow(this.listFunction[0].children[0]);
      this.loading = false;

    });
  }

  selectRow(data: any){
    this.listThaoTac = [];
    data.selected = true;
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
    if(data.children == null || data.children.length == 0) {
      this.loadingDSThaoTac = true;
      this.listThaoTac = data.thaoTacs;
      this.loadingDSThaoTac = false;
    }
    else{
      data.thaoTacs[0].active = true;
      this.listFunction.forEach(element => {
        const stack: any[] = [];
        this.mapOfExpandedData[element.key].forEach(item => {
          stack.push(item);
          while (stack.length !== 0) {
            const node = stack.pop();
            if(node.functionId == data.functionId){
              if (node.children && node.children.length > 0) {
                node.children.forEach(_i => {
                  if(_i.children == null || _i.children.length == 0){
                    for(var i=0; i<_i.thaoTacs.length; i++){
                      if(_i.thaoTacs[i].active == false) {
                        data.thaoTacs[0].active = false;
                        break;
                      }
                    }
                  }
                  else{
                    console.log(_i);
                    if(_i.thaoTacs[0].active == false) {
                      data.thaoTacs[0].active = false;
                    }
                    stack.push(..._i.children);
                  }
                });
              }
            }
            else{
              if(node.children && node.children.length > 0){
                stack.push(...node.children);
              }
            }
          }
        });
      });
    }

    if(data.functionName == "ThongDiepNhan"){
      data.thaoTacs = data.thaoTacs.filter(x=>x.ma != "MNG_DELETE" && x.ma != "MNG_CREATE" && x.ma != "MNG_UPDATE");
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
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listThaoTac);
  }

  saveChanges(): void {
    if (this.roleId === '' || this.roleId === null) return;
    this.loading = true;
    this.isSaveClicked = true;
    var data: any = new Object();
    data.thaoTacs = [];
    this.listFunction.forEach(element => {
      const stack: any[] = [];
      this.mapOfExpandedData[element.key].forEach(item => {
        stack.push(item);
        while (stack.length !== 0) {
          const node = stack.pop();
          if (node.children && node.children.length > 0) {
            stack.push(...node.children);
            if(this.listCheckedFunctionUser.indexOf(node.functionId) >= 0){
              var p = this.listCheckedFunctionUser.indexOf(node.functionId);
              this.listCheckedFunctionUser.splice(p, 1);
            }
          }
          else{
            if(node.thaoTacs && node.thaoTacs.length > 0){
              var actives = node.thaoTacs.filter(x=>x.active == true);
              if(actives.length != 0){
                if(this.listCheckedFunctionUser.indexOf(node.functionId) < 0)
                  this.listCheckedFunctionUser.push(node.functionId);
                actives.forEach(element => {
                  if(data.thaoTacs.indexOf(element) < 0) data.thaoTacs.push(element);
                });
                node.suDung = true;
              }
              else{
                if(this.listCheckedFunctionUser.indexOf(node.functionId) >= 0){
                  var p = this.listCheckedFunctionUser.indexOf(node.functionId);
                  this.listCheckedFunctionUser.splice(p, 1);
                }
                node.suDung = false;
              }
            }
          }
        }
      });
    });
    console.log(this.listCheckedFunctionUser.includes('9795e666-00a7-4945-8445-6bddea49d9a4'));
    data.roleId = this.roleId;
    data.roleName = this.roleName;
    data.functionIds = this.listCheckedFunctionUser;

    var msg = "Bạn cần phải yêu cầu người dùng được phân quyền sử dụng chức năng theo nhóm vai trò kế toán đang truy cập thoát ra khỏi hệ thống để đảm bảo cập nhật thành công.<br>Danh sách người dùng đang truy cập:";
    var user = "";
    this.usersv.getUserOnline().subscribe((rs: any[])=>{
      if(rs.length > 0 && data.roleId != null){
        var _currentUser = JSON.parse(localStorage.getItem('currentUser'));
        for(let i=0; i<rs.length;i++){
          this.usersv.GetAllByUserId(rs[i].userId).subscribe((result: any[])=>{
            var rolesIds = [];
            if(result != null && result != undefined && result.length != 0){
              rolesIds = result.map(x=>x.roleId);
            }

            if(rs[i].userName != _currentUser.userName && rolesIds.includes(data.roleId)){
              user += `<br> - ${rs[i].userName}`;
            }
          });
        }
      }

      if(user != ""){
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
            msTitle: `Bạn đã thay đổi chức năng được sử dụng của nhóm vai trò kế toán`,
            msContent: msg + user,
            msOnClose: () => {
            },
          }
        });
        this.loading = false;
        return;
      }

      var actives = this.listMauHoaDon.filter(x=>x.actived == true).map(x=>x.boKyHieuHoaDonId);
      console.log(this.listMauHoaDon.filter(x=>x.actived == true));
      console.log(actives);
      var listPQ = [];
      actives.forEach(x=>{
        listPQ.push({
          roleId: this.roleId,
          boKyHieuHoaDonId: x,
          mauHoaDonIds: this.listMauHoaDon.find(o=>o.boKyHieuHoaDonId == x).mauHoaDons.filter(x=>x.actived == true).map(x=>x.mauHoaDonId).join(';')
        })
      });

      const params = {
        roleId: this.roleId,
        listPQ: listPQ
      };

      this.rolesv.InsertMultiFunctionRole(data).subscribe((res: any) => {
        this.rolesv.PhanQuyenMauHoaDon(params).subscribe((rs: boolean)=>{
          if(rs){
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.PhanQuyen,
              refType: RefType.PhanQuyenChucNang,
              thamChieu: `Tên vai trò kế toán: ${this.roleName}`,
              moTaChiTiet: `Phân quyền chức năng cho vai trò kế toán: ${this.roleName}`,
              refId: this.roleId
            }).subscribe();

            this.message.success('Lưu dữ liệu thành công');
            this.loading = false;
            this.isSaveClicked = true;

            this.isSaved = true;
            this.modal.destroy(true);
          }
          else {
            this.message.error('Lỗi lưu dữ liệu');
            this.loading = false;
            this.isSaveClicked = true;
            this.modal.destroy(false);
          }
        });
      });
    });
  }

  refreshStatusM(data: any = null): void {
    console.log(this.isAllDisplayDataCheckedM)
    const allChecked = this.listMauHoaDon.every(value => value.actived === true);
    const allUnChecked = this.listMauHoaDon.every(value => !value.actived);
    this.isAllDisplayDataCheckedM = allChecked;
    this.isIndeterminateM = (!allChecked) && (!allUnChecked);

    if (data != null) {
      this.listMauHoaDon.forEach((item: any) => {
        if (item.boKyHieuHoaDonId === data.boKyHieuHoaDonId) {
          item.actived = data.actived;
          if(item.actived){
            item.mauHoaDons.forEach(x=>{
              x.actived = true;
            })
          }
          else{
            item.mauHoaDons.forEach((x: any)=>{{
              x.actived = false;
            }})
          }
        }
      });
    } else {
      if (allChecked) {
        this.listMauHoaDon.forEach((item: any) => {
          item.actived = true;
          this.refreshStatusM(item);
        });
      }
      if (allUnChecked) {
        this.listMauHoaDon.forEach((item: any) => {
          item.actived = false;
          this.refreshStatusM(item);
        });
      }
    }
  }

  refreshStatusMH(item,data){
    let actived = data.mauHoaDons.filter(x=>x.actived == true);
    console.log(actived.length);
    if(actived.length > 0){
      data.mauHoaDonIds = actived.map(x=>x.mauHoaDonId).join(";");
      if(!data.actived) data.actived = true;
    }
    else{
      console.log('trường hợp xóa hết active');
      data.mauHoaDonId = null;
      data.actived = false;
    }
  }

  checkAllM(value: boolean): void {
    this.listMauHoaDon.forEach(data => data.actived = value);
    this.refreshStatusM();
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
          this.listFunctions.splice(this.listFunctions.indexOf(d), 1);
        });
        this.lstBangKeEmptyQ = getListEmptyBangKeTmp(this.listFunctions);
      } else {
        this.lstBangKeEmptyQ = getListEmptyBangKeTmp(this.listFunctions);
        return;

      }
    }
  }

  changeActive(event, item){
    console.log(item);
    item.active = event;
    for(var i = 0; i<this.listFunction.length; i++){
      if(this.listFunction[i].functionId == item.functionId && item.thaoTacId != ""){
        if(this.listFunction[i].thaoTacs != null){
          var index =  this.listFunction[i].thaoTacs.indexOf(x=>x.thaoTacId == item.thaoTacId);
          if(index != -1)  this.listFunction[i].thaoTacs[index]=event;
        }
      }

    }
    if(item.thaoTacId == this.listThaoTac[0].thaoTacId && item.ma.includes("FULL")){
      for(var idx=1; idx<this.listThaoTac.length; idx++){
        this.changeActive(event, this.listThaoTac[idx]);
      }
    }

    if(item.ma && item.ma.includes("VIEW")){
      if(event == false){
        for(var idx=this.listThaoTac.indexOf(item) + 1; idx<this.listThaoTac.length; idx++){
          this.changeActive(event, this.listThaoTac[idx]);
        }
      }
    }

    if(item.ma && !item.ma.includes("VIEW") && !item.ma.includes("FULL") && item.ma != "PARENT_FULL"){
      if(event == true){
        var objView = this.listThaoTac.find(x=>x.ma.includes("VIEW"));
        if(objView && objView.active == false){
          this.listThaoTac[this.listThaoTac.indexOf(objView)].active = event;
        }
      }
    }

    if(event == true && item.ma == "PARENT_FULL"){

      this.listFunction.forEach(element => {
        const stack: any[] = [];
        this.mapOfExpandedData[element.key].forEach((it: any) => {
          stack.push(it);
          while (stack.length !== 0) {
            const node = stack.pop();
            if (node.parentFunctionId === item.functionId) {
              if(node.children && node.children.length > 0){
                node.children.forEach(ele => {
                  if(ele.children == null || ele.children.length == 0){
                    for(let idx = 0; idx < ele.thaoTacs.length; idx++){
                      ele.thaoTacs[idx].active = event;
                    }
                  }
                  else{

                    ele.thaoTacs[0].active = event;
                    this.changeActive(event, ele);
                  }
                });
              }
              else{
                for(let idx = 0; idx < node.thaoTacs.length; idx++){
                  node.thaoTacs[idx].active = event;
                }
              }
            }
            if (node.children && node.children.length > 0) {
              stack.push(...node.children);
            }
          }
        });
      });
    }

    if(event == false && item.thaoTacId != this.listThaoTac[0].thaoTacId)
    {
      this.listThaoTac[0].active = event;
    }

    if(event == false){
      var data = null;
      this.listFunction.forEach(element => {
        const stack: any[] = [];
        this.mapOfExpandedData[element.key].forEach(it => {
          stack.push(it);
          while (stack.length !== 0) {
            const node = stack.pop();
            if (node.functionId === item.functionId) {
              data = node;
              break;
            }
            if (node.children && node.children.length > 0) {
              stack.push(...node.children);
            }
          }
        });
      });

      if(data != null){
        this.listFunction.forEach(element => {
          const stack: any[] = [];
          this.mapOfExpandedData[element.key].forEach(it => {
            stack.push(it);
            while (stack.length !== 0) {
              const node = stack.pop();
              if(node.functionId == data.parentFunctionId){
                console.log(node);
                if(node.thaoTacs != null){
                  node.thaoTacs[0].active = event;
                }
                else{
                  node.thaoTacs = [];
                  node.thaoTacs.push({thaoTacId: "", ma: 'PARENT_FULL', ten: "Toàn quyền", functionId: node.functionId, active: event})
                }
                this.changeActive(event, node);
                break;
              }
              if (node.children && node.children.length > 0) {
                stack.push(...node.children);
              }
            }
          });
        });
      }
    }

    var updateObj = this.listThaoTac.find(x=>x.ma == 'DM_UPDATE');
    var deleteObj = this.listThaoTac.find(x=>x.ma == 'DM_DELETE');
    var viewObj = this.listThaoTac.find(x=>x.ma == 'DM_VIEW');

    if(event == false && item.ma == 'DM_VIEW' && this.listThaoTac.indexOf(updateObj) >= 0 &&
    this.listThaoTac.indexOf(deleteObj) >= 0){
      this.listThaoTac[this.listThaoTac.indexOf(updateObj)].active = event;
      this.listThaoTac[this.listThaoTac.indexOf(deleteObj)].active = event;
    }

    if(event == true && (item.ma == 'DM_UPDATE' || item.ma == "DM_DELETE") && this.listThaoTac.indexOf(viewObj) >= 0){
      this.listThaoTac[this.listThaoTac.indexOf(viewObj)].active = event;
    }

    var viewHDObj = this.listThaoTac.find(x=>x.ma == 'HD_VIEW');

    if(event == true && (item.ma == "HD_UPDATE" || item.ma == "HD_DELETE" || item.ma == "HD_PUBLISH" || item.ma == "HD_CONVERT" || item.ma == "HD_SEND") && viewHDObj){
      this.listThaoTac[this.listThaoTac.indexOf(viewHDObj)].active = event;
    }

    var viewToolObj = this.listThaoTac.find(x=>x.ma == "TOOL_VIEW");
    if(event == true && item.ma == "TOOL_EXPORT" && viewToolObj){
      this.listThaoTac[this.listThaoTac.indexOf(viewToolObj)].active = event;
    }

    var checkedCount = this.listThaoTac.filter(x=>x.active == true).length;
    if(event == true && checkedCount == this.listThaoTac.length - 1 && item.thaoTacId != this.listThaoTac[0].thaoTacId){
      this.listThaoTac[0].active = event;
    }
  }
  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true, thaoTacs: root.thaoTacs });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node, thaoTacs: node.children[i].thaoTacs });
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
    if(!this.isSaveClicked && this.isSaved){
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
    else{
      this.modal.destroy();
    }
  }
}
