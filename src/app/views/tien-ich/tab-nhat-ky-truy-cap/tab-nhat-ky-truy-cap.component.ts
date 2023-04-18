import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { DownloadFile, getHeightBangKeKhongChiTiet3, getHeightBangKeKhongChiTiet6, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet3, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { GetKy, GetKyMacDinh, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { ChiTietHanhDongModalComponent } from '../modals/chi-tiet-hanh-dong-modal/chi-tiet-hanh-dong-modal.component';
import { NhatKyTruyCapParams } from 'src/app/models/PagingParams';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-tab-nhat-ky-truy-cap',
  templateUrl: './tab-nhat-ky-truy-cap.component.html',
  styleUrls: ['./tab-nhat-ky-truy-cap.component.scss']
})
export class TabNhatKyTruyCapComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listNhatKyTruyCap: any[] = [];
  khachHangSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: NhatKyTruyCapParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    Filter: {},
    Ky: 5,
    TimKiemTheo: null,
    GiaTri: null,
    TimKiemBatKy: null
  };
  paramsDefault: NhatKyTruyCapParams = Object.assign({}, this.params);

  filterVisible = false;
  dataSelected = null;
  kys = GetList();
  timKiemTheos = [
    {value: 'HanhDong', name: 'Hành động', checked: false},
    {value: 'DiaChiIP', name: 'Địa chỉ IP', checked: false},
    {value: 'TenMayTinh', name: 'Tên máy tính', checked: false},
    {value: 'NguoiThucHien', name: 'Người thực hiện', checked: false},
    {value: 'ThamChieu', name: 'Tham chiếu', checked: false},
  ];
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  widthConfig = ['120px', '100px', '200px', '150px', '150px', '300px', '100px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  timKiemForm: FormGroup;
  filterGeneralVisible = false;
  isFitering = false;

  constructor(
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private env: EnvService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.params.Ky = this.paramsDefault.Ky = GetKyMacDinh();
    this.changeKy(this.params.Ky);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "NhatKyTruyCap").thaoTacs;
    }

    this.timKiemForm = this.fb.group({
      timKiemTheo: [null]
    });
    this.timKiemForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
    this.loadViewConditionList();
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Ngày gửi: ', value: GetTenKy(this.params.Ky) });

    if (this.viewConditionList.length > 1 || (this.params.Ky !== 4 && this.params.Ky !== 6)) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.LoadData(true);
  }

  changeTimKiemTheo()
  {
    let timKiemTheo = this.timKiemForm.get('timKiemTheo').value;
    this.params.GiaTri = timKiemTheo;

    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      if (this.timKiemForm.controls['timKiemTheo'].value == null || this.timKiemForm.controls['timKiemTheo'].value == '')
      {
        this.timKiemForm.controls['timKiemTheo'].markAsTouched();
        this.timKiemForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);
      }
    }
    else
    {
      this.timKiemForm.controls['timKiemTheo'].clearValidators();
      this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
    }
  }


  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  //filter
  filterGeneral() {
    this.filterGeneralVisible = false;
    //this.params = this.paramsDefault;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;
    this.params = Object.assign({}, this.paramsDefault);

    this.loadViewConditionList();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listNhatKyTruyCap);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet6()) + 'px';
  }

  LoadData(reset = false) {
    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      if (this.timKiemForm.controls['timKiemTheo'].value == null || this.timKiemForm.controls['timKiemTheo'].value == '')
      {
        this.timKiemForm.controls['timKiemTheo'].markAsTouched();
        this.timKiemForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.timKiemForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else
    {
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
    this.nhatKyTruyCapService.GetAllPaging(this.params).subscribe((data: any) => {
      this.listNhatKyTruyCap = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.loading = false;
      this.pageSizeOptions = [100, 150, 200,500];

      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listNhatKyTruyCap);
      this.scrollConfig.y =  getHeightBangKeKhongChiTiet3()+5 + 'px';
      if (this.listNhatKyTruyCap && this.listNhatKyTruyCap.length > 0) {
        this.selectedRow(this.listNhatKyTruyCap[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listNhatKyTruyCap, "doiTuongId").then((result) => {
        this.selectedRow(result);
      });
    });
  }

  getDataToFind(): any
  {
    let dataToFind: any = {};
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && this.params.GiaTri) {
      var result = {};
      var giaTris = this.params.GiaTri.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = (giaTris[i] != null && giaTris[i] != undefined)?giaTris[i]: null;
      }
      dataToFind.TimKiemTheo = result;
    } else {
      dataToFind.TimKiemTheo = null;
      dataToFind.TimKiemBatKy = this.params.GiaTri;
    }
    dataToFind.GiaTri = this.params.GiaTri;

    return dataToFind;
  }

  removeFilter(filter: any) {
    if (this.params.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
      const idx = this.params.filterColumns.findIndex(x => x.colKey === filter.key);
      this.params.filterColumns[idx].isFilter = false;
      this.params.filterColumns[idx].colValue = null;
    }

    if(filter.key == 'Ky'){
      this.params.Ky = GetKyMacDinh();
      SetDate(this.params.Ky, this.params);
    }
    this.loadViewConditionList();
  }


  clickThem() {

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
    const vals: any[] = this.listNhatKyTruyCap.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    const data: any = vals[0];
    this.rowScrollerToViewEdit.getRowToViewEdit(data.doiTuongId);
    // call modal
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
      this.listNhatKyTruyCap.forEach(element => {
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
    this.nhatKyTruyCapService.ExportExcel(this.params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Danh_sach_nhat_ky_truy_cap.${type === 1 ? 'xlsx' : 'pdf'}`);
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
  //   this.listNhatKyTruyCap.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.doiTuongId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.doiTuongId === prop);
  //     const index = this.listNhatKyTruyCap.findIndex(x => x.doiTuongId === prop);

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
  //       this.listNhatKyTruyCap[index].selected = val;
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

  changeKy(event: any) {
    SetDate(event, this.params);
  }

  blurDate() {
    const ky = GetKy(this.params);
    this.params.Ky = ky;
  }

  exportPdf() {
    //
  }

  xemThem(data: any) {
    this.modalService.create({
      nzTitle: 'Chi tiết hành động',
      nzContent: ChiTietHanhDongModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data
      },
      nzFooter: null
    });
  }
}
