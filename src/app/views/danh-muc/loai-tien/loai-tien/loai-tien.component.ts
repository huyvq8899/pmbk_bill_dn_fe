import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { DownloadFile, getHeightBangKe, getHeightBangKe4, getHeightBangKeKhongChiTiet, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet2_1, getHeightSimpleTable, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet3 } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { FilterColumn, FilterCondition, PagingParams } from 'src/app/models/PagingParams';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { AddEditLoaiTienModalComponent } from '../modals/add-edit-loai-tien-modal/add-edit-loai-tien-modal.component';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { SapXepLoaiTienComponent } from '../modals/sap-xep-loai-tien/sap-xep-loai-tien.component';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';


@Component({
  selector: 'app-loai-tien',
  templateUrl: './loai-tien.component.html',
  styleUrls: ['./loai-tien.component.scss']
})
export class LoaiTienComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listLoaiTien: any[] = [];
  khachHangSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [50, 100, 150];
  params: PagingParams = {
    PageNumber: 1,
    PageSize: 50,
    Keyword: '',
    SortKey: '',
    Filter: {},
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
  widthConfig = ['150px', '200px', '150px', '150px', '150px'];
  scrollConfig = { x: '', y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  ddtp = new DinhDangThapPhan();
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  displayDataTemp = Object.assign({}, this.params);
  constructor(
    private loaiTienService: LoaiTienService,
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
      this.thaoTacs = pq.functions.find(x => x.functionName == "LoaiTien").thaoTacs;
    }

    this.loaiTienService.GetAll(this.params).subscribe((rs : any) =>{
      this.listOfAllData = rs;
    })
    this.LoadData(true);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listLoaiTien);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2_1()) + 'px';
  }

  LoadData(init = false, reset = false, added = null) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.loaiTienService.GetAllPaging(this.params).subscribe(async (data: any) => {
      await data.items.forEach((item: any, index: any) => {
        item.sapXep = index == 0 ? 1 : index + 1;
      });
      this.listLoaiTien = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.loading = false;

      // delete all
      if (this.listLoaiTien.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2_1()) + 'px';
      // if (this.listLoaiTien && this.listLoaiTien.length > 0) {
      //   this.selectedRow(this.listLoaiTien[0]);
      // }
      if(init && this.listLoaiTien.length > 0) this.selectedRow(this.listLoaiTien[0]);
      if(added) {
        var itemAdd = this.listLoaiTien.find(x=>x.loaiTienId == added.loaiTienId);
        var indexAdd = this.listLoaiTien.indexOf(itemAdd);
        if(indexAdd != -1){
          this.selectedRow(this.listLoaiTien[indexAdd]);
        }
        else{
          this.params.PageNumber += 1;
          this.LoadData(false, false, added);
        }
      }
      else{
        this.rowScrollerToViewEdit.scrollToRow(this.listLoaiTien, "loaiTienId").then((result) => {
          this.selectedRow(result);
        });
      }
    });
  }

  clickThem() {
    // call modal
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm loại tiền',
      nzContent: AddEditLoaiTienModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 650,
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
        this.loading = true;
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

    const vals: any[] = this.listLoaiTien.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    const data: any = vals[0];
    this.rowScrollerToViewEdit.getRowToViewEdit(data.loaiTienId);
    // call modal
    this.loaiTienService.GetById(data.loaiTienId).subscribe(
      (res: any) => {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `${isCopy ? 'Thêm' : 'Sửa'} loại tiền`,
          nzContent: AddEditLoaiTienModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 650,
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
            if(!isCopy)
            this.LoadData();
            else this.LoadData(false, true, rs);
          }
        });
      },
      err => {

      }
    );
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.loaiTienId !== id);
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

      this.loaiTienService.CheckPhatSinh(this.dataSelected.loaiTienId).subscribe((rs: any) => {
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
              msContent: `Mã loại tiền <b class = "colorChuYTrongThongBao">${this.dataSelected.ma}</b> đã có phát sinh trên hóa đơn. Để xóa mã loại tiền này, bạn cần xóa hóa đơn liên quan. Vui lòng kiểm tra lại.`,
              msOnClose: () => {
              },
            }
          });
          return;
        }else{
          const modal = this.ActivedModal = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 400,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Xóa loại tiền",
              msContent: '<span>Bạn có thực sự muốn xóa không?</span>',
              msMessageType: MessageType.ConfirmBeforeSubmit,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnOk: () => {
                let sx = this.dataSelected.sapXep;

                this.loaiTienService.Delete(this.dataSelected.loaiTienId).subscribe((rs: any) => {
                  if (rs) {
                    this.loaiTienService.GetAllPaging(this.params).subscribe(async (dataList: any) => {
                      await dataList.items.forEach((item: any, index: any) => {
                        if (item.sapXep > sx) {
                          item.sapXep = item.sapXep - 1;
                        }
                      });
                      this.loaiTienService.UpdateRange(dataList.items).subscribe(rsUpdate => {
                        this.deleteCheckedItem(this.dataSelected.loaiTienId);
                        this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                        this.LoadData();
                      });
                      this.nhatKyTruyCapService.Insert({
                        loaiHanhDong: LoaiHanhDong.Xoa,
                        refType: RefType.LoaiTien,
                        thamChieu: 'Mã: ' + this.dataSelected.ma,
                        refId: this.dataSelected.loaiTienId
                      }).subscribe();

                    });
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
      this.listLoaiTien.forEach(element => {
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
    this.loaiTienService.ExportExcel(this.params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Bang_ke_loai_tien.xlsx`);
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
  sapXep() {
    this.listOfDisplayData
    const modal1 = this.modalService.create({
      nzTitle: 'Sắp xếp thứ tự loại tiền',
      nzContent: SapXepLoaiTienComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        listTruongDuLieu: this.listOfAllData
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.LoadData();
      }
    });
  }
  // // Checkbo
  // refreshStatus(): void {
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.loaiTienId]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.loaiTienId]) && !this.isAllDisplayDataChecked;

  //   this.dataSelected = null;
  //   this.listLoaiTien.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.loaiTienId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.loaiTienId === prop);
  //     const index = this.listLoaiTien.findIndex(x => x.loaiTienId === prop);

  //     if (val) {
  //       if (selectedIndex === -1) {
  //         this.listOfSelected.push(item);
  //       }
  //     } else {
  //       if (selectedIndex !== -1) {
  //         this.listOfSelected = this.listOfSelected.filter(x => x.loaiTienId !== prop);
  //       }
  //     }

  //     if (index !== -1) {
  //       this.listLoaiTien[index].selected = val;
  //     }
  //   }
  // }

  // checkAll(value: boolean): void {
  //   this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.loaiTienId] = value));
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
