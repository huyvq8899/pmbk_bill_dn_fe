import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { getHeightBangKe, getHeightBangKe2, getHeightBangKe3, getHeightBangKe1, getHinhThucHoaDons, getListEmptyBangKe2, getListEmptyBangKe3, getListEmptyBangKe4, getListEmptyChiTiet, getLoaiHoaDons, getTrangThaiQuyTrinhs, getUyNhiemLapHoaDons } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { FilterColumn, FilterCondition, } from 'src/app/models/PagingParams';
import { AddEditMauHoaDonModalComponent } from '../modals/add-edit-mau-hoa-don-modal/add-edit-mau-hoa-don-modal.component';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { InitCreateMauHD } from 'src/assets/ts/init-create-mau-hd';
import { XemMauHoaDonModalComponent } from '../modals/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { XemNhatKyMauHoaDonModalComponent } from '../modals/xem-nhat-ky-mau-hoa-don-modal/xem-nhat-ky-mau-hoa-don-modal.component';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { SharedService } from 'src/app/services/share-service';
import { Subscription } from 'rxjs';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-mau-hoa-don',
  templateUrl: './mau-hoa-don.component.html',
  styleUrls: ['./mau-hoa-don.component.scss']
})
export class MauHoaDonComponent extends TabShortKeyEventHandler implements OnInit, OnDestroy {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listMauHoaDon: any[] = [];
  chiTiets: any[] = [];
  listThongBaoPhatHanh: any[] = [];
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  loadingCT = false;
  total = 0;
  pageSizeOptions = [];
  displayData: any = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    Filter: {},
    MauHoaDonDuocPQ: [],
    IsAdmin: false,
    TimKiemTheo: null,
    GiaTri: null,
    hinhThucHoaDon: -1,
    loaiHoaDons: [-1],
    uyNhiemLapHoaDon: -1,
    filterColumns: [],
  };
  displayDataTemp: any = Object.assign({}, this.displayData);
  displayDataRaw: any = Object.assign({}, this.displayData);
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
  widthConfig = ['50px', '150px', '100px', '150px', '250px', '150px', '100px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  widthConfigCT = ['50px', '150px', '100px', '120px', '100px', '100px', '150px'];
  scrollConfigCT = { x: SumwidthConfig(this.widthConfigCT), y: '136px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  timKiemTheos: Array<{ value: any, name: any, checked: boolean }> = [
    { value: 'Ten', name: 'Tên mẫu hóa đơn', checked: false },
    { value: 'TenLoaiMau', name: 'Loại mẫu', checked: false },
    { value: 'TenHinhThucHoaDon', name: 'Hình thức hóa đơn', checked: false },
    { value: 'TenLoaiHoaDon', name: 'Loại hóa đơn', checked: false },
    { value: 'TenUyNhiemLapHoaDon', name: 'Ủy nhiệm lập hóa đơn', checked: false },
    { value: 'NgayCapNhatFilter', name: 'Ngày cập nhật', checked: false },
  ];
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons(true);
  hinhThucHoaDons = getHinhThucHoaDons(true);
  loaiHoaDons = getLoaiHoaDons(true);
  lstBangKeEmpty: any[] = [];
  lstChiTietEmpty: any[] = [];
  numberBangKeCols: any;
  numberChiTietCols: any;
  mauHoaDonDuocPQ: any[] = [];
  // filter col
  filterColVisible = false;
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  sub: Subscription;
  isDev = true;
  selectContentHD = 3;
  listPaging: any[];
  swHoadon = true;
  swPhieuXuatKho = true;
  swVeDienTu = true;
  isHoaDon = true;
  obj_nghiepvu: any = [];
  obj_nghiepvu_name = 'obj_nghiepvu_' + localStorage.getItem("userId");

  constructor(
    private mauHoaDonService: MauHoaDonService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private sharedService: SharedService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private hoSoHDDTService: HoSoHDDTService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.cookieService.get(this.obj_nghiepvu_name)) {
      this.obj_nghiepvu = JSON.parse(this.cookieService.get(this.obj_nghiepvu_name));
      this.selectContentHD = this.obj_nghiepvu[0].nghiepvu.hoadondt ? 3 : this.obj_nghiepvu[0].nghiepvu.phieuXuatKho ? 4 : 5;
      this.isHoaDon = this.obj_nghiepvu[0].loainghiepvu == 1;
      this.swHoadon = this.obj_nghiepvu[0].nghiepvu.hoadondt;
      this.swPhieuXuatKho = this.obj_nghiepvu[0].nghiepvu.phieuXuatKho;
      this.swVeDienTu = this.obj_nghiepvu[0].nghiepvu.veDienTu;
    }
    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res.type === 'loadData' && res.value) {
        this.LoadData();
      }
    });

    this.isDev = environment.production === false;
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.scrollConfigCT.x = SumwidthConfig(this.widthConfigCT);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.displayData.IsAdmin = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "MauHoaDon").thaoTacs;
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
    }

    this.LoadData();
    //khi click ở bảng điều khiển
    this.activatedRoute.queryParams.subscribe(params => {
      const tabIndex = params['tmhd'];
      console.log(tabIndex);
      if (tabIndex) {
        this.clickThem();
      }
    });
    this.changeNVHD(3);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe2(this.listMauHoaDon);
    this.scrollConfig.y = (getHeightBangKe2()) + 'px';
  }

  LoadData(reset = false) {
    if (reset === true) {
      this.displayData.PageNumber = 1;
    }

    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    this.loading = true;
    this.mauHoaDonService.GetAllPaging(this.displayData).subscribe((data: any) => {
      this.listMauHoaDon = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.displayData.PageNumber = data.currentPage;
      this.loading = false;

      // delete all
      if (this.listMauHoaDon.length === 0 && this.displayData.PageNumber > 1) {
        this.displayData.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);

      if (this.viewConditionList.length > 0) {
        this.lstBangKeEmpty = getListEmptyBangKe3(this.listMauHoaDon);
        this.scrollConfig.y = getHeightBangKe2() + 'px';
      } else {
        this.lstBangKeEmpty = getListEmptyBangKe2(this.listMauHoaDon);
        this.scrollConfig.y = getHeightBangKe1() + 'px';
      }

      this.numberChiTietCols = Array(this.widthConfigCT.length).fill(0);
      this.lstChiTietEmpty = getListEmptyChiTiet(this.chiTiets);
      if (this.listMauHoaDon && this.listMauHoaDon.length > 0) {
        this.selectedRow(this.listMauHoaDon[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listMauHoaDon, "mauHoaDonId").then((result) => {
        this.selectedRow(result);
      });
    });
  }

  async clickThem() {
    const hoSoDienTuData = await this.hoSoHDDTService.GetDetailAsync();
    const data = InitCreateMauHD(hoSoDienTuData);

    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Mẫu hóa đơn',
      nzContent: AddEditMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '100%',
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '1px', height: `${window.innerHeight - 38}px` },
      nzComponentParams: {
        isAddNew: true,
        data
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.LoadData();
      }
    });
  }

  async clickSua(isCopy = false, isView = false) {
    if (isView == true && this.permission != true && this.thaoTacs.indexOf('MNG_VIEW') < 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Kiểm tra lại`,
          msContent: 'Bạn không có quyền sử dụng chức năng này. Vui lòng liên hệ người dùng có quyền Quản trị để được phân quyền.',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        },
      });
      return;
    }

    const vals: any[] = this.listMauHoaDon.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }
    const data: any = vals[0];
    this.rowScrollerToViewEdit.getRowToViewEdit(data.mauHoaDonId);
    // call modal

    if (!isView && !isCopy) {
      var isBlockEdit = await this.mauHoaDonService.CheckAllowEditAsync(data.mauHoaDonId);
      if (isBlockEdit) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: 'Mẫu hóa đơn đã phát sinh bộ ký hiệu hóa đơn sử dụng. Bạn chỉ được sửa mẫu hóa đơn khi trạng thái sử dụng của bộ ký hiệu hóa đơn là <strong>Ngừng sử dụng</strong>. Vui lòng kiểm tra lại!',
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        return;
      }

      if (data.ngayKy) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Sửa mẫu hóa đơn",
            msContent: 'Mẫu hóa đơn đã ký điện tử. Nếu sửa mẫu thì hệ thống sẽ xóa chữ ký điện tử và bạn sẽ phải ký lại. Bạn có muốn tiếp tục sửa không?',
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOnOk: () => {
              this.showModal(isCopy, isView, data, true);
            },
            msOnClose: () => { }
          },
        });
      } else {
        this.showModal(isCopy, isView, data);
      }
    } else {
      this.showModal(isCopy, isView, data);
    }
  }

  showModal(isCopy: boolean, isView: boolean, data: any, isXoaKyDienTu = false) {
    this.mauHoaDonService.GetById(data.mauHoaDonId).subscribe(
      (res: any) => {
        if (isCopy) {
          res.mauHoaDonId = null;
          res.mauHoaDonThietLapMacDinhs.forEach((item: any) => {
            item.mauHoaDonThietLapMacDinhId = null;
            item.mauHoaDonId = null;
          });
          res.mauHoaDonTuyChinhChiTiets.forEach((item: any) => {
            item.mauHoaDonTuyChinhChiTietId = null;
            item.mauHoaDonId = null;
          });
        }

        if (isXoaKyDienTu) {
          res.ngayKy = null;
        }

        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `Mẫu hóa đơn`,
          nzContent: AddEditMauHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px', height: `${window.innerHeight - 38}px` },
          nzComponentParams: {
            isAddNew: false,
            data: res,
            isCopy,
            isView: isView
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          if (rs) {
            this.LoadData();
          }
        });
      });
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.mauHoaDonId !== id);
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
      if (this.ActivedModal != null) return;

      this.mauHoaDonService.CheckPhatSinh(this.dataSelected.mauHoaDonId).subscribe((rs: any) => {
        if (rs) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 400,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: 'Kiểm tra lại',
              msContent: 'Mẫu hóa đơn đã phát sinh bộ ký hiệu hóa đơn sử dụng. Bạn không được phép xóa. Vui lòng kiểm tra lại!',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => { }
            },
          });
          return;
        } else {
          const modal = this.ActivedModal = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 400,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: 'Xóa mẫu hóa đơn',
              msContent: 'Bạn có thực sự muốn xóa mẫu hóa đơn này không?',
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msOnOk: () => {
                this.mauHoaDonService.Delete(this.dataSelected.mauHoaDonId).subscribe((rs: any) => {
                  if (rs) {
                    this.nhatKyTruyCapService.Insert({
                      loaiHanhDong: LoaiHanhDong.Xoa,
                      refType: RefType.MauHoaDon,
                      thamChieu: 'Mẫu số: ' + this.dataSelected.mauSo + '\nKý hiệu: ' + this.dataSelected.kyHieu,
                      refId: this.dataSelected.mauHoaDonId
                    }).subscribe();
                    this.deleteCheckedItem(this.dataSelected.mauHoaDonId);
                    this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                    this.LoadData();
                  } else {
                    this.message.error(Message.DONT_DELETE_DANH_MUC);
                  }
                }, _ => {
                  this.message.error(Message.DONT_DELETE_DANH_MUC);
                })
              },
              msOnClose: () => { }
            },
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
          })
        }
      });

    } else {
      return;
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
    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;
      this.listMauHoaDon.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }

    this.loadingCT = true;
    this.boKyHieuHoaDonService.GetListByMauHoaDonId(data.mauHoaDonId)
      .subscribe((res: any[]) => {
        this.chiTiets = res;
        this.lstChiTietEmpty = getListEmptyChiTiet(this.chiTiets);
        this.loadingCT = false;
      });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.displayData.PageNumber = 1;
    }
    this.LoadData();
  }

  exportExcel() {
    this.loading = true;
    // this.doituongService.ExportExcelKhachHang().subscribe((rs: any) => {
    //   this.message.success('Xuất khẩu thành công');
    //   window.open(rs);
    //   // setTimeout(() => {
    //   //   this.DeleteFile(rs);
    //   // }, 1000);
    //   this.loading = false;
    // }, _ => {
    //   this.message.error('Lỗi xuất khẩu');
    //   this.loading = false;
    // });
  }

  search(colName: any) {
    this.LoadData();
  }

  sort(sort: { key: string; value: string }): void {
    this.displayData.SortKey = sort.key;
    this.displayData.SortValue = sort.value;
    this.LoadData();
  }

  clickXem() {

  }

  // // Checkbo
  // refreshStatus(): void {
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.mauHoaDonId]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.mauHoaDonId]) && !this.isAllDisplayDataChecked;

  //   this.dataSelected = null;
  //   this.listMauHoaDon.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.mauHoaDonId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.mauHoaDonId === prop);
  //     const index = this.listMauHoaDon.findIndex(x => x.mauHoaDonId === prop);

  //     if (val) {
  //       if (selectedIndex === -1) {
  //         this.listOfSelected.push(item);
  //       }
  //     } else {
  //       if (selectedIndex !== -1) {
  //         this.listOfSelected = this.listOfSelected.filter(x => x.mauHoaDonId !== prop);
  //       }
  //     }

  //     if (index !== -1) {
  //       this.listMauHoaDon[index].selected = val;
  //     }
  //   }
  // }

  // checkAll(value: boolean): void {
  //   this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.mauHoaDonId] = value));
  //   this.refreshStatus();
  // }

  change(colName: any, event: any) {
    if (!event) {
      this.displayData.Filter[colName] = event;
      this.LoadData();
    }
  }

  xemNhatKy() {
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_CATEGORY);
      return;
    }

    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
    }

    if (!this.dataSelected) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_CATEGORY);
    }

    this.ActivedModal = this.modalService.create({
      nzTitle: 'Xem nhật ký',
      nzContent: XemNhatKyMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1000,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '5px' },
      nzComponentParams: {
        data: this.dataSelected
      },
      nzFooter: null
    });
  }

  xemMauHoaDon(data: any) {
    if (!this.dataSelected) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_CATEGORY);
      return;
    }

    this.ActivedModal = this.modalService.create({
      nzTitle: 'Xem mẫu hóa đơn',
      nzContent: XemMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1000,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '5px' },
      nzComponentParams: {
        id: data != null ? data.mauHoaDonId : this.dataSelected.mauHoaDonId,
        kySo: !(data != null && data.kyHieu),
        kyHieu: data != null ? data.kyHieu : null
      },
      nzFooter: null
    });
  }

  filterGeneral() {
    this.filterGeneralVisible = false;
    this.displayData = this.displayDataTemp;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;
    this.displayDataTemp = Object.assign({}, this.displayDataRaw);
    this.displayData = Object.assign({}, this.displayDataRaw);

    this.loadViewConditionList();
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    if (this.displayData.hinhThucHoaDon !== -1) {
      this.viewConditionList.push({ key: 'HinhThucHoaDon', label: 'Hình thức hóa đơn: ', value: this.getNameOfHinhThucHoaDonFilter() });
    }
    if (this.displayData.loaiHoaDons.some(x => x !== -1)) {
      this.viewConditionList.push({ key: 'LoaiHoaDon', label: 'Loại hóa đơn: ', value: this.getNameOfLoaiHoaDonFilter() });
    }
    if (this.displayData.uyNhiemLapHoaDon !== -1) {
      this.viewConditionList.push({ key: 'UyNhiemLapHoaDon', label: 'Ủy nhiệm lập hóa đơn: ', value: this.getNameOfUyNhiemLapHoaDonFilter() });
    }

    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.displayData.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        const data = {
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: [{ key: item.colKey, value: item.colValue, type: item.colKey }]
        };

        this.viewConditionList.push(data);
      }
    });

    this.LoadData(true);
  }

  onFilterCol(rs: any) {
    const filterColData = this.displayData.filterColumns.find(x => x.colKey === rs.colKey);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = filterColData.isFilter;
    }

    this.loadViewConditionList();
  }

  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfVisbleFilterCol[colName] = event;

    this.inputFilterColData = this.displayData.filterColumns.find(x => x.colKey === colName) || null;

    if (!this.inputFilterColData) {
      this.inputFilterColData = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.displayData.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }

  getNameOfHinhThucHoaDonFilter() {
    const findData = this.hinhThucHoaDons.find(x => x.key === this.displayData.hinhThucHoaDon);
    if (findData) {
      var data = [{
        key: findData.key,
        value: findData.value,
        type: 'HinhThucHoaDon'
      }];
      return data;
    }

    return [];
  }

  getNameOfUyNhiemLapHoaDonFilter() {
    const findData = this.uyNhiemLapHoaDons.find(x => x.key === this.displayData.uyNhiemLapHoaDon);
    if (findData) {
      var data = [{
        key: findData.key,
        value: findData.value,
        type: 'UyNhiemLapHoaDon'
      }];
      return data;
    }

    return [];
  }

  getNameOfLoaiHoaDonFilter() {
    const result = this.loaiHoaDons
      .filter(x => this.displayData.loaiHoaDons.includes(x.key))
      .map(x => {
        return {
          key: x.key,
          value: x.value,
          type: 'LoaiHoaDon'
        };
      });

    return result;
  }

  removeFilter(filter: any) {
    switch (filter.type) {
      case 'HinhThucHoaDon':
        this.displayDataTemp.hinhThucHoaDon = -1
        break;
      case 'LoaiHoaDon':
        this.displayDataTemp.loaiHoaDons = this.displayDataTemp.loaiHoaDons.filter(x => x !== filter.key);
        if (this.displayDataTemp.loaiHoaDons.length === 0) {
          this.displayDataTemp.loaiHoaDons = [-1];
        }
        break;
      case 'UyNhiemLapHoaDon':
        this.displayDataTemp.uyNhiemLapHoaDon = -1;
        break;
      default:
        break;
    }

    if (this.displayData.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
      const idx = this.displayData.filterColumns.findIndex(x => x.colKey === filter.key);
      this.displayData.filterColumns[idx].isFilter = false;
      this.displayData.filterColumns[idx].colValue = null;
      this.mapOfHightlightFilter[filter.key] = false;
    }

    this.displayData = Object.assign({}, this.displayDataTemp);
    this.loadViewConditionList();
  }

  changeLoaiHoaDon(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem !== -1) {
        if (event.some(x => x === -1)) {
          this.displayDataTemp.loaiHoaDons = event.filter(x => x !== -1);
        }
      } else {
        this.displayDataTemp.loaiHoaDons = [-1];
      }
    }
  }

  checkFilterLoaiHoaDon(data: any) {
    if (data.key === -1) { // check all
      this.loaiHoaDons.filter(x => x.key !== -1).forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.loaiHoaDons[0].checked = this.loaiHoaDons.filter(x => x.key !== -1).every(x => x.checked);
    }

    setTimeout(() => {
      this.displayDataTemp.loaiHoaDons = this.loaiHoaDons[0].checked ? [-1] : this.loaiHoaDons.filter(x => x.key !== -1 && x.checked).map(x => x.key);
    }, 0);
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  getData() {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    var giaTris = this.displayData.GiaTri != "" ? this.displayData.GiaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0 && giaTris.length == timKiemTheoChecked.length) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i];
      }
      this.displayData.TimKiemTheo = result;
    } else {
      this.displayData.TimKiemTheo = null;
    }

    this.LoadData(true);
  }
  changeNVHD(event: any) {
    let radioButton = document.getElementsByClassName("btn-nvhd");
    for (let i = 0; i < radioButton.length; ++i) {
      let el = radioButton[i] as HTMLElement;
      let nzvalue = radioButton[i].getAttribute('data-value');
      if (event == nzvalue) {
        if (event == 3) {
          el.classList.add('hoaDonActive');
        } if (event == 4) {
          el.classList.add('phieuXuatKhoActive');
        }
        if (event == 5) {
          el.classList.add('veDienTuActive');
        }
        el.classList.remove('switchSelectHover');
      } else {
        if (event == 3) {
          el.classList.remove('phieuXuatKhoActive');
          el.classList.remove('veDienTuActive');
        } if (event == 4) {
          el.classList.remove('hoaDonActive');
          el.classList.remove('veDienTuActive');
        }
      } if (event == 5) {
        el.classList.remove('phieuXuatKhoActive');
        el.classList.remove('hoaDonActive');
      }
      el.classList.add('switchSelectHover');
    }

    if (event == 3) {
      this.displayData.loaiHoaDons = [1, 2, 9, 10];
      this.LoadData(true);
    } else if (event == 4) {
      this.displayData.loaiHoaDons = [7, 8];
      this.LoadData(true);
    } else if (event == 5) {
      this.displayData.loaiHoaDons = [14, 15];
      this.LoadData(true);
    } else {
      this.listPaging = [];
      this.chiTiets = [];
      this.total = 0;
    }
  }
}
