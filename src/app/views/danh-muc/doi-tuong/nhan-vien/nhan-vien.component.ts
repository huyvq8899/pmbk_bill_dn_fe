import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { DownloadFile, getHeightBangKe, getHeightBangKe4, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet2_1, getHeightSimpleTable, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3 } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { AddEditNhanVienModalComponent } from '../modals/add-edit-nhan-vien-modal/add-edit-nhan-vien-modal.component';
import { FilterColumn, FilterCondition, PagingParams } from 'src/app/models/PagingParams';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';

@Component({
  selector: 'app-nhan-vien',
  templateUrl: './nhan-vien.component.html',
  styleUrls: ['./nhan-vien.component.scss']
})
export class NhanVienComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listNhanVien: any[] = [];
  khachHangSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: DoiTuongParams = {
    PageNumber: 1,
    PageSize: 50,
    Keyword: '',
    SortKey: '',
    Filter: {},
    LoaiDoiTuong: 2,
    filterColumns: []
  };
  filterVisible = false;
  dataSelected = null;
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  widthConfig = ['150px', '200px', '150px', '150px', '150px', '200px', '150px', '200px', '200px', '150px', '150px'];
  scrollConfig = { x: '', y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  displayDataTemp = Object.assign({}, this.params);
  constructor(
    private doiTuongService: DoiTuongService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private env: EnvService
  ) {
    super();
  }

  ngOnInit() {
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "NhanVien").thaoTacs;
    }

    this.LoadData(true);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listNhanVien);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2_1()) + 'px';
  }

  LoadData(init = false, reset = false, added = null) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.doiTuongService.GetAllPaging(this.params).subscribe((data: any) => {
      this.listNhanVien = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.loading = false;

      // delete all
      if (this.listNhanVien.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2_1()) + 'px';
      // if (this.listNhanVien && this.listNhanVien.length > 0) {
      //   this.selectedRow(this.listNhanVien[0]);
      // }
      if(added) {
        var itemAdd = this.listNhanVien.find(x=>x.doiTuongId == added.doiTuongId);
        var indexAdd = this.listNhanVien.indexOf(itemAdd);
        if(indexAdd != -1){
          this.selectedRow(this.listNhanVien[indexAdd]);
        }       
        else{
          this.params.PageNumber += 1;
          this.LoadData(false, false, added);
        } 
      }
      else{
        console.log('khong add')
        if(init && this.listNhanVien.length > 0) this.selectedRow(this.listNhanVien[0]);
        else{
          this.rowScrollerToViewEdit.scrollToRow(this.listNhanVien, "doiTuongId").then((result) => {
            this.selectedRow(result);
          });
        }
      }
    });
  }

  clickThem() {
    // call modal
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm nhân viên',
      nzContent: AddEditNhanVienModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.LoadData(false, true, rs);
      }
    });
  }

  clickSua(isCopy = false, isView = false) {
    if (isView == true && this.permission != true && this.thaoTacs.indexOf('DM_VIEW') < 0) {
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
          msContent: 'Bạn không có quyền sử dụng chức năng này. Vui lòng liên hệ người dùng có quyền Quản trị để được phân quyền.',
          msOnClose: () => {
          },
        }
      });

      return;
    }

    const vals: any[] = this.listNhanVien.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    const data: any = vals[0];
    this.rowScrollerToViewEdit.getRowToViewEdit(data.doiTuongId);
    // call modal
    this.doiTuongService.GetById(data.doiTuongId).subscribe(
      (res: any) => {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `${isCopy ? 'Thêm' : 'Sửa'} nhân viên`,
          nzContent: AddEditNhanVienModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 600,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isAddNew: false,
            data: res,
            isCopy
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            if(!isCopy){
              this.LoadData();
            }
            else this.LoadData(false, false, rs);
          }
        });
      },
      err => {

      }
    );
  }


  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.doiTuongId !== id);
    delete this.mapOfCheckedId[id];
  }

  clickXoa() {
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_CATEGORY_TO_DELETE);
      return;
    }

    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
    }

    if (this.dataSelected) {
      this.doiTuongService.CheckPhatSinh(this.dataSelected).subscribe((rs: any) => {
        if (rs) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: 400,
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: `Mã nhân viên <b class = "colorChuYTrongThongBao">${this.dataSelected.ma}</b> đã có phát sinh trên hóa đơn. Để xóa mã nhân viên này, bạn cần xóa hóa đơn liên quan. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
              },
            }
          });
          //this.message.error(Message.DONT_DELETE_DANH_MUC);
          return;
        }
        else {
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
                msTitle: "Xóa nhân viên",
                msContent: '<span>Bạn có thực sự muốn xóa không?</span>',
                msMessageType: MessageType.ConfirmBeforeSubmit,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnOk: () => {
                  this.doiTuongService.Delete(this.dataSelected.doiTuongId).subscribe((rs: any) => {

                    if (rs) {
                      this.nhatKyTruyCapService.Insert({
                        loaiHanhDong: LoaiHanhDong.Xoa,
                        refType: RefType.NhanVien,
                        thamChieu: 'Mã: ' + this.dataSelected.ma,
                        refId: this.dataSelected.doiTuongId
                      }).subscribe();
                      this.deleteCheckedItem(this.dataSelected.doiTuongId);
                      this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                      this.LoadData();
                    } else {
                      this.message.error(Message.DONT_DELETE_DANH_MUC);
                    }
                  }, _ => {
                    this.message.error(Message.DONT_DELETE_DANH_MUC);

                  })
                },
                msOnClose: () => { return; }
              },
            });

          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.LoadData();
            }
          });
        }
      });


    } else {
      // this.modalService.confirm({
      //   nzTitle: '<b>Cảnh báo</b>',
      //   nzContent: TextGlobalConstants.CONFIRM_DELETE_RANGE_CATEGORY,
      //   nzOkText: TextGlobalConstants.TEXT_CONFIRM_OK,
      //   nzCancelText: TextGlobalConstants.TEXT_CONFIRM_CANCLE,
      //   nzOnOk: () => {
      //     const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      //     this.doituongService.DeleteRange(this.listOfSelected, 1)
      //       .subscribe((res: any) => {
      //         if (res.removedList.length > 0) {
      //           res.removedList.forEach((id: any) => {
      //             this.deleteCheckedItem(id);
      //           });

      //           this.LoadData();
      //         }

      //         if (res.soChungTuKhongThanhCong !== 0) {
      //           showKetQuaXoaDanhMucHangLoat(res, this.modalService);
      //         }

      //         this.message.remove(id);
      //       });
      //   },
      //   nzOnCancel: () => { }
      // });
    }
  }
  changeSearch(event: any) {
    if (event.keyCode == 13) {
      // if(this.valueSearch) {
      //   this.displayData.Keyword = this.valueSearch;
      // } else {
      //   this.displayData.Keyword = '';
      // }
      this.LoadData();
    }
  }
  selectedRow(data: any) {
    this.khachHangSelected = data;

    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;
      this.listNhanVien.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.params.PageNumber = 1;
    }
    this.LoadData();
  }

  exportExcel() {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.doiTuongService.ExportExcel(this.params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Bang_ke_nhan_vien.xlsx`);
        this.message.remove(id);
      });
  }

  search(colName: any) {
    this.LoadData();
  }

  sort(sort: { key: string; value: string }): void {
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.LoadData();
  }

  clickXem() {

  }

  // // Checkbo
  // refreshStatus(): void {
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.doiTuongId]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.doiTuongId]) && !this.isAllDisplayDataChecked;

  //   this.dataSelected = null;
  //   this.listNhanVien.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.doiTuongId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.doiTuongId === prop);
  //     const index = this.listNhanVien.findIndex(x => x.doiTuongId === prop);

  //     if (val) {
  //       if (selectedIndex === -1) {
  //         this.listOfSelected.push(item);
  //       }
  //     } else {
  //       if (selectedIndex !== -1) {
  //         this.listOfSelected = this.listOfSelected.filter(x => x.doiTuongId !== prop);
  //       }
  //     }

  //     if (index !== -1) {
  //       this.listNhanVien[index].selected = val;
  //     }
  //   }
  // }

  // checkAll(value: boolean): void {
  //   this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.doiTuongId] = value));
  //   this.refreshStatus();
  // }

  change(colName: any, event: any) {
    if (!event) {
      this.params.Filter[colName] = event;
      this.LoadData();
    }
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

    this.LoadData(true);
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
}
