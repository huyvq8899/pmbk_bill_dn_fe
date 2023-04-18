import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NzModalService, NzMessageService, NzDropdownMenuComponent, NzContextMenuService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { DownloadFile, getHeightBangKe, getHeightBangKe4, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet3, getHeightBangKeKhongChiTiet6, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet3, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { PagingParams, NhatKyGuiEmailParams, FilterColumn, FilterCondition } from 'src/app/models/PagingParams';
import { NhatKyGuiEmailService } from 'src/app/services/tien-ich/nhat-ky-gui-email.service';
import { GetKy, GetList, SetDate, GetTenKy } from 'src/app/shared/chon-ky';
import { CookieConstant } from 'src/app/constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { GuiTBaoSaiSotKhongPhaiLapHDonModalComponent } from '../../hoa-don-dien-tu/modals/gui-tbao-sai-sot-khong-phai-lap-hdon-modal/gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component';
import * as moment from 'moment';
import { CheckValidDate } from 'src/app/shared/getDate';
import { CheckValidDate2 } from 'src/app/customValidators/check-valid-date';

@Component({
  selector: 'app-tab-nhat-ky-gui-email',
  templateUrl: './tab-nhat-ky-gui-email.component.html',
  styleUrls: ['./tab-nhat-ky-gui-email.component.scss']
})
export class TabNhatKyGuiEmailComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listNhatKyGuiEmail: any[] = [];
  khachHangSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: NhatKyGuiEmailParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    Filter: {},
    Ky: 5,
    TrangThaiGuiEmail: -1,
    LoaiEmail: -1,
    LoaiHoaDon: -1,
    TimKiemTheo: null,
    GiaTri: null,
    TimKiemBatKy: null,
    filterColumns: []
  };
  filterVisible = false;
  dataSelected = null;
  kys = GetList();
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  widthConfig = ['170px', '150px', '150px', '200px', '150px', '150px', '150px', '150px', '150px', '200px', '200px', '200px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  loaiHoaDons = [
    { value: -1, name: 'Tất cả' },
    { value: 1, name: 'Hóa đơn điện tử' },
    { value: 2, name: 'Phiếu xuất kho điện tử' },
  ];
  timKiemTheos = [
    { value: 'MauHoaDon', name: 'Ký hiệu mẫu số hóa đơn', checked: false },
    { value: 'KyHieuHoaDon', name: 'Ký hiệu hóa đơn', checked: false },
    { value: 'SoHoaDon', name: 'Số hóa đơn', checked: false },
    { value: 'NguoiThucHien', name: 'Người thực hiện', checked: false },
  ];
  filterGeneralVisible = false;
  isFitering = false;
  loaiEmailAlls = [
    { value: -1, name: 'Tất cả' },
    { value: 0, name: 'Gửi hóa đơn cho khách hàng' },
    { value: 1, name: 'Gửi thông báo xóa bỏ hóa đơn cho khách hàng' },
    { value: 2, name: 'Gửi biên bản hủy hóa đơn cho khách hàng' },
    { value: 3, name: 'Gửi biên bản điều chỉnh hóa đơn cho khách hàng' },
    { value: 4, name: 'Gửi thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn cho khách hàng' },
    {
      value: 5, name: 'Gửi thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn cho khách hàng (Cho hình thức: Có mã từ máy tính tiền)'
    },
    {
      value: 6, name: 'Gửi phiếu xuất kho cho khách hàng'
    },
    {
      value: 7, name: 'Gửi thông báo xóa bỏ phiếu xuất kho cho khách hàng'
    },
    {
      value: 8, name: 'Gửi biên bản hủy phiếu xuất kho cho khách hàng'
    },
    {
      value: 9, name: 'Gửi biên bản điều chỉnh phiếu xuất kho cho khách hàng'
    },
    {
      value: 10, name: 'Gửi thông báo phiếu xuất kho có thông tin sai sót không phải lập lại phiếu xuất kho cho khách hàng'
    },

  ];
  loaiEmails = [
  ];
  trangThaiGuiEmails = [
    { value: -1, name: 'Tất cả' },
    { value: 2, name: 'Đang gửi cho khách hàng' },
    { value: 0, name: 'Gửi cho khách hàng bị lỗi' },
    { value: 1, name: 'Đã gửi cho khách hàng' },
    { value: 3, name: 'Khách hàng đã nhận' }
  ];
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  timKiemForm: FormGroup;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;

  constructor(
    private nhatKyGuiEmailService: NhatKyGuiEmailService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService,
    private hoaDonDienTuService: HoaDonDienTuService,
  ) {
    super();
  }

  ngOnInit() {
    this.setDefaulThoiGian();
    this.changeLoaiHoaDon(-1);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "NhatKyGuiEmail").thaoTacs;
    }

    //create form
    this.timKiemForm = this.fb.group({
      timKiemTheo: [null]
    });
    this.timKiemForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    this.LoadData();
    this.loadViewConditionList();
    window.addEventListener('scroll', this.scrollEvent, true);
  }
  scrollEvent = (event: any): void => {
    let menuRightclick = document.getElementById('menu-rightclick');
    if (menuRightclick != null) this.nzContextMenuService.close();
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }
  changeTimKiemTheo() {
    let timKiemTheo = this.timKiemForm.get('timKiemTheo').value;
    this.params.GiaTri = timKiemTheo;

    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (this.timKiemForm.controls['timKiemTheo'].value == null || this.timKiemForm.controls['timKiemTheo'].value == '') {
        this.timKiemForm.controls['timKiemTheo'].markAsTouched();
        this.timKiemForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);
      }
    }
    else {
      this.timKiemForm.controls['timKiemTheo'].clearValidators();
      this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listNhatKyGuiEmail);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet6()) + 'px';
  }

  changeLoaiHoaDon(event: number){
    if(event == -1){
      this.loaiEmails = this.loaiEmailAlls.filter(x=>x.value == -1);
    }
    else if(event == 1){
      this.loaiEmails = this.loaiEmailAlls.filter(x=>x.value == -1 || x.value <= 5);
    }
    else{
      this.loaiEmails = this.loaiEmailAlls.filter(x=>x.value == -1 || x.value > 5);
    }

    this.params.LoaiHoaDon = event;
    this.params.LoaiEmail = -1;
  }

  LoadData(reset = false) {
    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (this.timKiemForm.controls['timKiemTheo'].value == null || this.timKiemForm.controls['timKiemTheo'].value == '') {
        this.timKiemForm.controls['timKiemTheo'].markAsTouched();
        this.timKiemForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else {
      this.timKiemForm.controls['timKiemTheo'].clearValidators();
      this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
    }

    let dataToFind = this.getDataToFind();
    this.params.GiaTri = dataToFind.GiaTri;
    this.params.TimKiemTheo = dataToFind.TimKiemTheo;
    this.params.TimKiemBatKy = dataToFind.TimKiemBatKy;

    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.nhatKyGuiEmailService.GetAllPaging(this.params).subscribe((data: any) => {
      console.log(data);
      this.listNhatKyGuiEmail = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.loading = false;
      this.pageSizeOptions = [100, 150, 200, 500];
      if (data.currentPage != 0) this.params.PageNumber = data.currentPage;
      this.params.PageSize = data.pageSize;
      // delete all
      if (this.listNhatKyGuiEmail.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listNhatKyGuiEmail);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet3() + 5 + 'px';

      if (this.listNhatKyGuiEmail && this.listNhatKyGuiEmail.length > 0) {
        this.selectedRow(this.listNhatKyGuiEmail[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listNhatKyGuiEmail, "nhatKyGuiEmailId").then((result) => {
        this.selectedRow(result);
      });
    });
  }

  onFilterCol(rs: any) {
    const filterColData = this.params.filterColumns.find(x => x.colKey === rs.colKey);
    console.log(filterColData);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = filterColData.isFilter;
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
        filterCondition: (colName != 'Ngay') ? FilterCondition.Chua : FilterCondition.Bang,
        isFilter: false
      };
      this.params.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }


  clickThem() {
    //////////
  }

  clickSua(isCopy = false, isView = false) {
    if (isView == true && this.permission != true && this.thaoTacs.indexOf('TOOL_VIEW') < 0) {
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

    if (this.ActivedModal != null) return;
    const vals: any[] = this.listNhatKyGuiEmail.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    /////////////////////////
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.nhatKyGuiEmailId !== id);
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

    //////////////////////////////
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
      this.listNhatKyGuiEmail.forEach(element => {
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

  exportFile(type: any) {
    this.params.isExportPDF = type === 2;
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.nhatKyGuiEmailService.ExportExcel(this.params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Danh_sach_nhat_ky_gui_email.${type === 1 ? 'xlsx' : 'pdf'}`);
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
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.nhatKyGuiEmailId]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.nhatKyGuiEmailId]) && !this.isAllDisplayDataChecked;

  //   this.dataSelected = null;
  //   this.listNhatKyGuiEmail.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.nhatKyGuiEmailId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.nhatKyGuiEmailId === prop);
  //     const index = this.listNhatKyGuiEmail.findIndex(x => x.nhatKyGuiEmailId === prop);

  //     if (val) {
  //       if (selectedIndex === -1) {
  //         this.listOfSelected.push(item);
  //       }
  //     } else {
  //       if (selectedIndex !== -1) {
  //         this.listOfSelected = this.listOfSelected.filter(x => x.nhatKyGuiEmailId !== prop);
  //       }
  //     }

  //     if (index !== -1) {
  //       this.listNhatKyGuiEmail[index].selected = val;
  //     }
  //   }
  // }

  // checkAll(value: boolean): void {
  //   this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.nhatKyGuiEmailId] = value));
  //   this.refreshStatus();
  // }

  change(colName: any, event: any) {
    if (!event) {
      this.params.Filter[colName] = event;
      this.LoadData();
    }
  }

  changeKy(event: any) {
    SetDate(event, this.params);
  }

  blurDate() {
    const ky = GetKy(this.params);
    this.params.Ky = ky;
  }

  exportPdf() {
    //////////////////////
  }

  //hàm này để lấy ra các giá trị tìm kiếm đã nhập
  getDataToFind(): any {
    let dataToFind: any = {};
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && this.params.GiaTri) {
      var result = {};
      var giaTris = this.params.GiaTri.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = (giaTris[i] != null && giaTris[i] != undefined) ? giaTris[i] : null;
      }
      dataToFind.TimKiemTheo = result;
    } else {
      dataToFind.TimKiemTheo = null;
      dataToFind.TimKiemBatKy = this.params.GiaTri;
    }
    dataToFind.GiaTri = this.params.GiaTri;

    return dataToFind;
  }

  filterTable() {
    if (this.params.toDate < this.params.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }
    this.LoadData(true);
  }

  filterGeneral() {
    this.filterGeneralVisible = false;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.setDefaulThoiGian();
    this.filterGeneralVisible = false;
    this.params.LoaiEmail = -1;
    this.params.TrangThaiGuiEmail = -1;
    this.loadViewConditionList();
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  setDefaulThoiGian() {
    let setting = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (setting == 'Quy') {
      SetDate(6, this.params);
      this.params.Ky = 6;
    }
    else if (setting == 'Thang') {
      SetDate(4, this.params);
      this.params.Ky = 4;
    }
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Ngày gửi: ', value: GetTenKy(this.params.Ky) });
    if (this.params.LoaiEmail !== -1) {
      this.viewConditionList.push({ key: 'LoaiEmail', label: 'Loại email: ', value: this.loaiEmails.find(x => x.value === this.params.LoaiEmail).name });
    }
    if (this.params.TrangThaiGuiEmail !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiGuiEmail', label: 'Trạng thái gửi email: ', value: this.trangThaiGuiEmails.find(x => x.value === this.params.TrangThaiGuiEmail).name });
    }

    if (this.viewConditionList.length > 1 || (this.params.Ky !== 4 && this.params.Ky !== 6)) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.params.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        console.log(item)
        var isDate = !CheckValidDate2(item.colValue) && moment(item.colValue).isValid();
        console.log(isDate)

        this.viewConditionList.push({
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: isDate ? moment(item.colValue).format('DD/MM/YYYY') : item.colValue
        });
      }
    });

    this.LoadData(true);
  }

  removeFilter(filter: any) {
    switch (filter.key) {
      case 'LoaiEmail':
        this.params.LoaiEmail = -1;
        break;
      case 'TrangThaiGuiEmail':
        this.params.TrangThaiGuiEmail = -1;
        break;
      default:
        break;
    }

    const idxdisplayData = this.params.filterColumns.findIndex(x => x.colKey === filter.key);
    this.params.filterColumns.splice(idxdisplayData, 1);
    const idx = this.viewConditionList.findIndex(x => x.key === filter.key);
    this.viewConditionList.splice(idx, 1);
    this.mapOfHightlightFilter[filter.key] = false;
    this.loadViewConditionList();
  }

  contextMenu($event: MouseEvent, menu: any, data: any): void {
    this.selectedRow(data);
    this.nzContextMenuService.create($event, menu);
  }
  xemChiTiet(data: any) {
    this.hoaDonDienTuService.GetById(data.refId)
      .subscribe(async (res: any) => {
        res.nhatKyGuiEmailId= data.nhatKyGuiEmailId;
        const modal = this.modalService.create({
          nzTitle: 'Gửi thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn cho khách hàng',
          nzContent: GuiTBaoSaiSotKhongPhaiLapHDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 600,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: res,
            isView:true,
            isPhieuXuatKho: data.loaiEmail == 10
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          if (rs) {
          }
        });
      });
  }
}
