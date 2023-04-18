import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { DownloadFile, getHeightBangKe, getHeightBangKe4, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet3, getHeightBangKeKhongChiTiet4, getHeightSimpleTable, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3 } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { BangTongHopDuLieuService } from 'src/app/services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { AddEditBangTongHopDuLieuModalComponent } from '../../modals/add-edit-bang-tong-hop-du-lieu-hoa-don-modal/add-edit-bang-tong-hop-du-lieu-hoa-don-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ChonBangTongHopModalComponent } from '../../modals/chon-bang-tong-hop/chon-bang-tong-hop-modal.component';
import { BangTongHopParams, FilterColumn, FilterCondition } from 'src/app/models/PagingParams';
import * as moment from 'moment';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { GetKy, GetKyMacDinh, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { ChonKyDuLieuModalComponent } from '../../modals/chon-ky-du-lieu-modal/chon-ky-du-lieu-modal.component';
import { TrangThaiQuyTrinh_BangTongHop } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { LichSuTruyenNhanComponent } from '../../modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { MoTaLoiModalComponent } from 'src/app/views/quan-ly/modals/mo-ta-loi-modal/mo-ta-loi-modal.component';

@Component({
  selector: 'app-tab-bang-tong-hop-du-lieu-hoa-don',
  templateUrl: './tab-bang-tong-hop-du-lieu-hoa-don.component.html',
  styleUrls: ['./tab-bang-tong-hop-du-lieu-hoa-don.component.scss']
})
export class TabBangTongHopDuLieuHoaDonComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listBangTongHopDuLieu: any[] = [];
  bangTongHopSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();

  loaiHHs = [
    {value: -1, name: "Tất cả"},
    {value: 1, name: "Xăng dầu"},
    {value: 2, name: "Vận tải hàng không"},
    {value: 9, name: "Khác"},
  ];
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: BangTongHopParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    Ky: 5,
    TrangThaiQuyTrinh: -1,
    LoaiHangHoa: -1,
    filterColumns: [],
    GiaTri: ""
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
  widthConfig = ['50px', '50px', '170px', '200px', '180px', '120px', '100px', '70px', '125px', '125px', '110px', '120px', '170px', '170px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '100%' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  timKiemTheos: any[]=[];
  trangThais: any[];
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  displayDataRaw: BangTongHopParams = Object.assign({}, this.params);
  paramsDefault: BangTongHopParams = Object.assign({}, this.params);
  kys = GetList();
  hinhThucHoaDon: any;
  isChuyenBangTongHop: any;

  constructor(
    private doiTuongService: DoiTuongService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private bangTongHopDuLieuService: BangTongHopDuLieuService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
    private env: EnvService
  ) {
    super();
    this.GetBoKyHieuTheoToKhaiMoiNhat();
  }

  ngOnInit() {
    this.params.Ky = GetKyMacDinh();
    this.paramsDefault.Ky = this.displayDataRaw.Ky = this.params.Ky;
    this.changeKy(this.params.Ky);
    this.GetDieuKienTimKiem();

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs;
    }
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.GetTrangThaiGui();
    this.getData();
    this.loadViewConditionList();
  }

  GetBoKyHieuTheoToKhaiMoiNhat() {
    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        if (res) {
          this.hinhThucHoaDon = res.hinhThucHoaDon;
          this.isChuyenBangTongHop = res.isChuyenBangTongHop;
        }
      });
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }
  
  removeFilter(filter: any) {
    if (this.params.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
      const idx = this.params.filterColumns.findIndex(x => x.colKey === filter.key);
      this.params.filterColumns[idx].isFilter = false;
      this.params.filterColumns[idx].colValue = null;
      this.mapOfHightlightFilter[filter.key] = false;
    }

    this.params = Object.assign({}, this.paramsDefault);
    this.loadViewConditionList();
  }

  onFilterCol(rs: any) {
    const filterColData = this.params.filterColumns.find(x => x.colKey === rs.colKey);
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
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.params.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listBangTongHopDuLieu);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet3()) + 'px';
  }

  getData(){
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    var giaTris = this.params.GiaTri != "" ? this.params.GiaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0 && giaTris.length == timKiemTheoChecked.length) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i];
      }
      this.params.TimKiemTheo = result;
    } else {
      this.params.TimKiemTheo = null;
    }

    this.LoadData();
  }

  LoadData(reset = false) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.bangTongHopDuLieuService.GetAllPaging(this.params).subscribe((data: any) => {
      this.listBangTongHopDuLieu = data.items;
      console.log(this.listBangTongHopDuLieu);
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.pageSizeOptions = [50, 100, 200];
      this.loading = false;

      // delete all
      if (this.listBangTongHopDuLieu.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      // this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listBangTongHopDuLieu);
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet3()) + 'px';
      if (this.listBangTongHopDuLieu && this.listBangTongHopDuLieu.length > 0) {
        this.selectedRow(this.listBangTongHopDuLieu[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listBangTongHopDuLieu, "id").then((result) => {
        this.selectedRow(result);
      });
    });
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Kỳ: ', value: GetTenKy(this.params.Ky) });
    if (this.params.LoaiHangHoa !== -1) {

      this.viewConditionList.push({ key: 'LoaiHangHoa', label: 'Loại hàng hóa: ', value: this.loaiHHs.find(x=>x.value == this.params.LoaiHangHoa).name });
    }

    if (this.params.TrangThaiQuyTrinh !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiQuyTrinh', label: 'Trạng thái quy trình: ', value: this.trangThais.find(x => x.value == this.params.TrangThaiQuyTrinh).name });
    }

    if (this.viewConditionList.length > 1 || this.params.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }
    this.LoadData(true);
  }
  
  GetDieuKienTimKiem() {
    this.bangTongHopDuLieuService.GetListTimKiemTheoBangTongHop().subscribe((rs: any[]) => {
      this.timKiemTheos = rs;
    })
  }

  viewLoi(data: any, callback: () => any = null) {
    this.quyDinhKyThuatService.GetThongDiepChungById(data.thongDiepChungId).subscribe((td: any)=>{
      this.quyDinhKyThuatService.GetAllThongDiepTraVe(data.maThongDiep).subscribe((list: any[]) => {
        console.log(list);
        var tdNew = list[0];
        console.log(tdNew);
        this.quyDinhKyThuatService.ShowThongDiepFromFileById(tdNew.thongDiepChungId).subscribe((rs: any) => {
          var input = rs.thongDiepChiTiet1s.map(x => x.moTaLoi).join("<br>");
  
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: `Mô tả lỗi`,
            nzContent: MoTaLoiModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '40%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              moTaLoi: input
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
            }
          });
          if (callback) {
            callback();
          }
        });
      })
    })
  }

  GetTrangThaiGui(){
    this.bangTongHopDuLieuService.GetListTrangThaiQuyTrinh().subscribe((rs: any[])=>{
      this.trangThais = rs;
    })
  }

  //filter
  filterGeneral() {
    this.filterGeneralVisible = false;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;
    this.params = Object.assign({}, this.displayDataRaw);

    this.loadViewConditionList();
  }

    
  clickThem() {
    // call modal
    if(this.isChuyenBangTongHop == false){
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
          msContent: 'Bạn không thực hiện được chức năng này do đã không đăng ký hoặc đã ngừng đăng ký gửi dữ liệu hóa đơn đến cơ quan thuế qua phương thức <b>Chuyển theo bảng tổng hợp dữ liệu hóa đơn điện tử</b>. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          },
        }
      });
      return;
    }

    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Chọn kỳ dữ liệu',
      nzContent: ChonKyDuLieuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '70%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px 10px 0px 10px' },
      nzComponentParams: {
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: 'Thêm bảng tổng hợp dữ liệu hóa đơn',
          nzContent: AddEditBangTongHopDuLieuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            dataTTC: rs,
            isAddNew: true
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any)=>{
          if(rs){
            this.LoadData();
          }
        })
      }
    });
  }

  clickSua(isCopy = false, isView = false, item: any=null) {
    if (isView == true && this.permission != true && this.thaoTacs.indexOf('MNG_VIEW') < 0) {
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

    if(!item){
      const vals: any[] = this.listBangTongHopDuLieu.filter(x => x.selected === true);
      if (vals == null || vals.length < 1) {
        return;
      }

      item = vals[0];
    }

    if(isCopy == false && isView == false && item.trangThaiGui != -1){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Hệ thống chỉ cho phép thực hiện <b>Sửa</b> bảng tổng hợp dữ liệu hóa đơn có trạng thái quy trình là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      return;
    }

    this.rowScrollerToViewEdit.getRowToViewEdit(item.id);
    // call modal
    this.bangTongHopDuLieuService.GetById(item.id).subscribe(
      (res: any) => {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `Bảng tổng hợp dữ liệu hóa đơn > ${isCopy ? 'Thêm' : 'Sửa'}`,
          nzContent: AddEditBangTongHopDuLieuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isAddNew: false,
            data: res,
            isCopy,
            fbEnableEdit: !isView
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.LoadData();
          }
        });
      },
      err => {

      }
    );
  }

  
  changeKy(event: any) {
    SetDate(event, this.params);
  }
  
  eSign(){
    if(this.isChuyenBangTongHop == false){
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
          msContent: 'Bạn không thực hiện được chức năng này do đã không đăng ký hoặc đã ngừng đăng ký gửi dữ liệu hóa đơn đến cơ quan thuế qua phương thức <b>Chuyển theo bảng tổng hợp dữ liệu hóa đơn điện tử</b>. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          },
        }
      });
      return;
    }

    const vals = this.listOfDisplayData.filter(item => this.mapOfCheckedId[item.id]);
    if(vals.length > 0){
      const unsent = vals.some(x=>x.trangThaiQuyTrinh != TrangThaiQuyTrinh_BangTongHop.ChuaGui);
      if(unsent){
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
            msContent: 'Hệ thống chỉ cho phép thực hiện <b>Ký và Gửi</b> bảng tổng hợp dữ liệu hóa đơn có trạng thái quy trình là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
            msOnClose: () => {
            },
          }
        });
        return;
      }
    }

    if(vals.length == 1){
      this.bangTongHopDuLieuService.GetById(vals[0].id).subscribe((rs: any)=>{
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `Bảng tổng hợp dữ liệu hóa đơn`,
          nzContent: AddEditBangTongHopDuLieuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: rs,
            autoSign: true,
            fbEnableEdit: false
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.LoadData();
          }
        });
      })
    }
    else{
      const modal = this.ActivedModal = this.modalService.create({
        nzTitle: `Bảng tổng hợp dữ liệu hóa đơn > Ký và gửi`,
        nzContent: ChonBangTongHopModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 900,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          selectedData: vals
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          this.LoadData();
        }
      });
    }
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.id !== id);
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
      if(this.dataSelected.trangThaiGui != -1){
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: `Hệ thống chỉ cho phép thực hiện <b>Xóa</b> bảng tổng hợp dữ liệu hóa đơn có trạng thái quy trình là <b>Chưa gửi</b>. Vui lòng kiểm tra lại! `,
          },
          nzFooter: null
        });
  
        return;
      }

      const modal = this.ActivedModal = this.modalService.create({
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
          msTitle: `Xóa bảng tổng hợp dữ liệu đã chọn`,
          msContent: '<span>Bạn có chắc chắn muốn xóa bảng tổng hợp dữ liệu này không?</span><br><span>Hãy cân nhắc thật kỹ trước khi xóa!</span>',
          msOnClose: () => {
            return;
          },
          msOnOk: () => {
            this.bangTongHopDuLieuService.Delete(this.dataSelected.id).subscribe((rs: any) => {
              if (rs) {
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.Xoa,
                  refType: RefType.BangTongHopDuLieu,
                  thamChieu: 'Số bảng tổng hợp dữ liệu: ' + this.dataSelected.soBTHDLieu,
                  refId: this.dataSelected.id
                }).subscribe();
                this.deleteCheckedItem(this.dataSelected.id);
                this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                this.LoadData();
              } else {
                this.message.error(Message.DONT_DELETE_DANH_MUC);
              }
            }, _ => {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
  
            })
          },
        }
      });
      modal.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          this.LoadData();
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
    this.bangTongHopSelected = data;

    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;
      this.listBangTongHopDuLieu.forEach(element => {
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
        DownloadFile(link, `Bang_ke_khach_hang.xlsx`);
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

  displayLichSuTruyenNhan(data: any){
    if(data.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.ChuaGui) return;
    this.quyDinhKyThuatService.GetThongDiepChungById(data.thongDiepChungId).subscribe((res: any)=>{
      console.log(res);
      this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(res.maThongDiep).subscribe((rs: any) => {
        if (rs != null) {
          if (this.ActivedModal != null) return;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: "Lịch sử truyền nhận",
            nzContent: LichSuTruyenNhanComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: window.innerWidth / 100 * 96,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: [rs],
              maTD: res.maThongDiep,
              showForm: false,
              loaiTD: 100,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
          });
        }
      });
    })
  }
  clickXem() {

  }

  // Checkbo
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;

    this.dataSelected = null;
    this.listBangTongHopDuLieu.forEach((item: any) => {
      item.selected = false;
    });

    let entries = Object.entries(this.mapOfCheckedId);
    for (const [prop, val] of entries) {
      const item = this.listOfDisplayData.find(x => x.id === prop);
      const selectedIndex = this.listOfSelected.findIndex(x => x.id === prop);
      const index = this.listBangTongHopDuLieu.findIndex(x => x.id === prop);

      if (val) {
        if (selectedIndex === -1) {
          this.listOfSelected.push(item);
        }
      } else {
        if (selectedIndex !== -1) {
          this.listOfSelected = this.listOfSelected.filter(x => x.id !== prop);
        }
      }

      if (index !== -1) {
        this.listBangTongHopDuLieu[index].selected = val;
      }
    }
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  change(colName: any, event: any) {
    if (!event) {
      this.params.Filter[colName] = event;
      this.LoadData();
    }
  }
}
