import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService, NzTdComponent } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { EnvService } from 'src/app/env.service';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { base64ToArrayBuffer, DownloadFile, getHeightBangKeKhongChiTiet3, getListEmptyBangKeKhongChiTiet5, saveByteArray } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { FilterColumn, FilterCondition, PagingParams, ThongDiepChungParams } from 'src/app/models/PagingParams';
import { HinhThucThanhToanService } from 'src/app/services/danh-muc/hinh-thuc-thanh-toan.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { GetKy, GetKyMacDinh, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import * as moment from 'moment';
import { AddEditToKhaiDangKyThayDoiThongTinModalComponent } from '../modals/add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal/add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal.component';
import { WebSocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';
import { AddThongDiepGuiModalComponent } from '../modals/add-thong-diep-gui-modal/add-thong-diep-gui-modal.component';
import { GUID } from 'src/app/shared/Guid';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { ThongBaoHoaDonSaiSotModalComponent } from '../modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { CookieConstant } from 'src/app/constants/constant';
import { MoTaLoiModalComponent } from '../modals/mo-ta-loi-modal/mo-ta-loi-modal.component';
import { DinhKemHoaDonModalComponent } from '../../hoa-don-dien-tu/modals/dinh-kem-hoa-don-modal/dinh-kem-hoa-don-modal.component';
import { LichSuTruyenNhanComponent } from '../../hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ChonThamSoBangKeSaiSotModalComponent } from '../modals/bang-ke-hoa-don-sai-sot/chon-tham-so/chon-tham-so-bang-ke-sai-sot-modal.component';
import { ChiTietThongDiepModalComponent } from '../modals/chi-tiet-thong-diep-modal/chi-tiet-thong-diep-modal.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { XacNhanToKhaiMau01ModalComponent } from '../modals/xac-nhan-to-khai-01-modal/xac-nhan-to-khai-mau-01-modal.component';

@Component({
  selector: 'app-thong-diep-gui',
  templateUrl: './tab-thong-diep-gui.component.html',
  styleUrls: ['./tab-thong-diep-gui.component.scss']
})
export class TabThongDiepGuiComponent implements OnInit {
  @ViewChild('filterColumnTemp', { static: false }) filterColumnTemp: FilterColumnComponent;
  _validFileExtensions = ['.xlsx', '.xls'];
  listThongDiepChung: any[] = [];
  listDuLieu: any[] = [];
  listThongDiepCQT: any[] = [];
  ActivedModal: any = null;
  toKhaiSelected: any;
  searchOverlayStyle = {
    width: '400px'
  };
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  totalCQT = 0;
  totalDL = 0;
  pageSizeOptions = [100, 150, 200];
  params: any = {
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().endOf('month').format('YYYY-MM-DD'),
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    LoaiThongDiep: -99,
    TrangThaiGui: -99,
    IsThongDiepGui: true,
    filterColumns: []
  };
  paramsDefault: ThongDiepChungParams = Object.assign({}, this.params);
  displayDataRaw: ThongDiepChungParams = Object.assign({}, this.params);
  kys = GetList();
  filterVisible = false;
  isDisabled = false;
  dataSelected = null;
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  widthConfig = ['100px', '120px', '580px', '300px', '120px', '100px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '250px' }
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  lstBangKeDLEmpty: any;
  numberBangKeDLCols: any;
  lstBangKeCQTEmpty: any;
  numberBangKeCQTCols: any;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  timKiemTheos: any[] = [];
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;

  listThongTinChung: any[] = [];
  lstBangKeTTCEmpty: any;
  numberBangKeTTCCols: any;
  totalTTC = 0;

  loaiHoaDonSelected: string = '';
  loaiHoaDonSelectedNum: number;
  loaiThongDiepGuis: any[];

  ddtp = new DinhDangThapPhan();
  numberBangKeCQT1Cols: any[];
  lstBangKeCQT1Empty: any[];

  numberBangKeCQT2Cols: any[];
  lstBangKeCQT2Empty: any[];

  lstBangKeTTC1Empty: any[];
  numberBangKeTTC1Cols: any[];

  listHoaDonSS: any[] = [];
  lstBangKeHDSSEmpty: any;
  numberBangKeHDSSCols: any;
  totalHDSS = 0;

  listThongDiepPHKT: any[] = [];
  lstBangKePHKTEmpty: any;
  numberBangKePHKTCols: any;
  totalPHKT = 0;
  countLoad = 0;
  firstLoad = true;
  hoSo: any;
  loaiTrangThais: any[] = [];
  thongKeSoLuongChuaGui = 0;
  loadingThongKeSoLuong = false;
  loaiThongDieps = [
    { id: 200, type: 1, name: "200 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã " },
    { id: 201, type: 1, name: "201 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã theo từng lần phát sinh" },
    { id: 203, type: 1, name: "203 - Thông điệp chuyển dữ liệu hóa đơn điện tử không mã đến cơ quan thuế" },
    { id: 300, type: 2, name: "300 - Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót" },
    { id: 202, type: 3, name: "202 - Thông điệp thông báo kết quả cấp mã hóa đơn điện tử của cơ quan thuế" },
    { id: 204, type: 3, name: "204 - Thông điệp thông báo mẫu số 01/TB-KTDL về việc kết quả kiểm tra dữ liệu hóa đơn điện tử" },
    { id: 205, type: 3, name: "205 - Thông điệp phản hồi về hồ sơ đề nghị cấp hóa đơn điện tử có mã của cơ quan thuế theo từng lần pháp sinh." },
    { id: 206, type: 1, name: "206 - Thông điệp gửi hóa đơn khởi tạo từ máy tính tiền đã cấp mã tới cơ quan thuế." },
    { id: 301, type: 4, name: "301 - Thông điệp gửi thông báo về việc tiếp nhận và kết quả xử lý về việc hóa đơn điện tử đã lập có sai sót" },
    { id: 302, type: 4, name: "302 - Thông điệp thông báo về hóa đơn điện tử cần rà soát" },
    { id: 303, type: 4, name: "303 - Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót từ máy tính tiền" },
    { id: 400, type: 10, name: "400 - Thông điệp bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế" },
    { id: 999, type: 5, name: "999 - Thông điệp phản hồi kỹ thuật" },
    { id: 100, type: 6, name: "100 - Thông điệp gửi tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
    { id: 101, type: 7, name: "101 - Thông điệp gửi tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 102, type: 8, name: "102 - Thông điệp thông báo về việc tiếp nhận/không tiếp nhận tờ khai đăng ký/thay đổi thông tin sử dụng HĐĐT, tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 103, type: 9, name: "103 - Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
  ];
  thongKe = false;
  disabledBtnNhanBan = false;
  thaoTacNNTs: any[]=[];

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private hoSoHDDTService: HoSoHDDTService,
    private userService: UserService,
    private env: EnvService,
    private webSocket: WebSocketService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.params.Ky = GetKyMacDinh();
    this.paramsDefault.Ky = this.displayDataRaw.Ky = this.params.Ky;
    this.changeKy(this.params.Ky);
    this.GetDieuKienTimKiem();
    this.getListLoaiThongDiepGuis();
    this.changeLoaiThongDiepGui(-99);
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs;
    }

    this.getHoSoHDDT();

    this.loadViewConditionList();
    //khi click ở bảng điều khiển
    this.activatedRoute.queryParams.subscribe(params => {
      const ltk100 = params['ltk'];
      const ltk300 = params['ltbss'];
      if (ltk100) {
        this.clickThem();
      }
      if (ltk300) {
        this.clickThem(300);
      }
    });

  }

  getHoSoHDDT() {
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.hoSo = rs;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet5(this.listThongDiepChung);
    this.scrollConfig.y = getHeightBangKeKhongChiTiet3()-10 + 'px';
  }

  getListLoaiThongDiepGuis() {
    this.quyDinhKyThuatService.GetListLoaiThongDiepGui()
      .subscribe((res: any[]) => {
        this.loaiThongDiepGuis = res;
      });
  }

  changeLoaiThongDiepGui(event: any) {
    this.params.LoaiThongDiep = event;
    if (event == -1) {
      this.loaiTrangThais.unshift({ value: -99, name: "Tất cả" });
      this.params.TrangThaiGui = -99;
    }
    else {
      this.quyDinhKyThuatService.GetTrangThaiGuiPhanHoiTuCQT(event).subscribe((rs: any[]) => {
        this.loaiTrangThais = rs;
        this.params.TrangThaiGui = -99;
      });
    }
  }

  changeTrangThaiGui(event: any) {
    this.params.TrangThaiGui = event;
  }

  getData() {
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

    this.LoadData(true);
  }

  removeFilter(filter: any) {
    console.log(filter);
    if (this.params.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
      const idx = this.params.filterColumns.findIndex(x => x.colKey === filter.key);
      this.params.filterColumns[idx].isFilter = false;
      this.params.filterColumns[idx].colValue = null;
      this.mapOfHightlightFilter[filter.key] = false;
    }

    if(filter.key == 'Ky'){
      this.params.Ky = GetKyMacDinh();
      SetDate(this.params.Ky, this.params);
    }

    if(filter.key == 'TrangThaiGui'){
      this.params.TrangThaiGui = -99;
      // if(this.thongKe == true){
      //   this.params.Ky = GetKyMacDinh();
      //   SetDate(this.params.Ky, this.params);
      //   this.thongKe = false;
      // }
    }

    console.log(this.params)

    if(filter.key == 'LoaiThongDiep'){
      this.params.LoaiThongDiep = -99;
    }

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

  LoadData(reset = false) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;

    //thống kê số lượng chưa gửi
    this.thongKeSoLuongThongDiepChuaGui(1, 'onlyLoad');

    console.log(this.params);
    this.quyDinhKyThuatService.GetAllPagingThongDiepChung(this.params).subscribe((data: any) => {
      if (data) {
        console.log(data);
        console.log(this.pageSizeOptions);
        this.pageSizeOptions = this.pageSizeOptions.filter(x=>x!=0);
        this.listThongDiepChung = data.items;
        this.total = data.totalCount;
        this.params.PageNumber = data.currentPage;

        // // delete all
        if (this.listThongDiepChung.length === 0 && this.params.PageNumber > 1) {
          this.params.PageNumber -= 1;
          this.LoadData();
        }
        // this.refreshStatus();
        this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
        this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet5(this.listThongDiepChung);
        this.scrollConfig.y = getHeightBangKeKhongChiTiet3()-10 + 'px';


        if (this.listThongDiepChung && this.listThongDiepChung.length > 0) {
          this.selectedRow(this.listThongDiepChung[0]);
        }
        this.rowScrollerToViewEdit.scrollToRow(this.listThongDiepChung, "thongDiepChungId").then((result) => {
          this.selectedRow(result)
        });

        if(!this.params.PageSize) this.params.PageSize = data.pageSize;

        this.loading = false;
      }
    });
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

    console.log(template);
    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }

  viewLoi(data: any, callback: () => any = null) {
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
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Kỳ: ', value: GetTenKy(this.params.Ky) });
    console.log(this.params);
    if (this.params.LoaiThongDiep !== -99) {

      this.viewConditionList.push({ key: 'LoaiThongDiep', label: 'Loại thông điệp: ', value: this.params.LoaiThongDiep });
    }

    if (this.params.TrangThaiGui !== -99) {
      this.viewConditionList.push({ key: 'TrangThaiGui', label: 'Trạng thái gửi và phản hồi của CQT: ', value: this.loaiTrangThais.find(x => x.value == this.params.TrangThaiGui).name });
    }

    if (this.viewConditionList.length > 1 || this.params.Ky !== GetKyMacDinh()) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.params.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        this.viewConditionList.push({
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: item.colValue
        });
      }
    });


    this.LoadData();
  }


  clickThem(loaiTD = 100) {
    if(this.permission != true && this.thaoTacs.length == 0){
      var phanQuyen = localStorage.getItem('KTBKUserPermission');
      if (phanQuyen == 'true') {
        this.permission = true;
      }
      else {
        var pq = JSON.parse(phanQuyen);
        this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs : [];
        this.thaoTacNNTs = pq.functions.find(x=>x.functionName == "ThongTinNguoiNopThue") ? pq.functions.find(x=>x.functionName == "ThongTinNguoiNopThue").thaoTacs : [];
      }
    }

    if(loaiTD == 100){
      if(this.permission != true && this.thaoTacs.indexOf('MNG_CREATE') < 0){
        this.userService.getAdminUser().subscribe((rs: any[])=>{
          let content = '';
          if(rs && rs.length > 0){
            if(this.thaoTacs.indexOf('MNG_VIEW') >= 0){
              content = `Bạn không có quyền <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssblue'>${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
            }
            else{
              content = `Bạn không có quyền <b>Xem</b> và <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssblue'>${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
            }
          }
          else{
            console.log(this.thaoTacs);
            if(this.thaoTacs.indexOf('MNG_VIEW') >= 0){
              content = `Bạn không có quyền <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            else{
              content = `Bạn không có quyền <b>Xem</b> và <b>Thêm</b> Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi). Để lập Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Lập tờ khai đăng ký sử dụng',
              msContent: content,
              msOnClose: ()=>{
                return;
              }
            },
            nzFooter: null
          });

        });
        return;
      }
    }
    if (loaiTD == 300) {
      if (this.permission != true && this.thaoTacs.indexOf('MNG_CREATE') < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            let userList = `<b class="css-blue">` + rs.map(x => x.fullName).join(", ") + "</b>";
            if (this.thaoTacs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> và <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng ${userList} có quyền <b>Quản trị</b> để được phân quyền.`
            }
          }
          else {
            if (this.thaoTacs.indexOf('MNG_VIEW') >= 0) {
              content = `Bạn không có quyền <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            else {
              content = `Bạn không có quyền <b>Xem</b> và <b>Thêm</b> Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi). Để lập Thông báo hóa đơn điện tử có sai sót (Thông điệp gửi), vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Lập thông báo hóa đơn sai sót',
              msContent: content,
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
        });
      }
    }

    this.hoSoHDDTService.GetDetail().subscribe((rs: any)=>{
      if(!rs || !rs.tenDonVi || rs.tenDonVi == '' || !rs.diaChi || rs.diaChi == '' || !rs.phuongPhapTinhThueGTGT || !rs.coQuanThueQuanLy || !rs.coQuanThueCapCuc){
        if(this.thaoTacNNTs.indexOf('SYS_VIEW') >= 0 || this.permission == true){
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại!`,
              msHasThongTinNNT: true,
              msButtonLabelThongTinNNT: "Xem thông tin người nộp thuế tại đây",
              msOnCapNhatThongTinNNT: ()=>{
                window.location.href = "he-thong/thong-tin-nguoi-nop-thue";
              },
              msOnClose: ()=>{
                return;
              }
            },
            nzFooter: null
          });

        }
        else{
          this.userService.getAdminUser().subscribe((rs: any[])=>{
            let content = '';
            if(rs && rs.length > 0){
              if(this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0){
                content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                <br>
                Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
              }
              else{
                content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                <br>
                Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
              }
            }
            else{
              if(this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0){
                content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                <br>
                Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
              }
              else{
                content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                <br>
                Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
              }
            }

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '430px',
              nzComponentParams: {
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: content,
                msOnClose: ()=>{
                  return;
                }
              },
              nzFooter: null
            });
          })
        }
      }
      else{
      // call modal
        this.quyDinhKyThuatService.GetThongDiepThemMoiToKhaiDuocChapNhan().subscribe((rs: any) => {
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: 'Thêm thông điệp gửi',
            nzContent: AddThongDiepGuiModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '85%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '10px 10px 0px 10px' },
            nzComponentParams: {
              callBackAfterClosing: () => { this.LoadData() },
              isExistAcceptedRegister: rs != null,
              selectedLoaiTD: loaiTD
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            console.log(rs);
            if (rs != null) {

              this.LoadData();
            }
          });
        })
      }
    })
  }

  clickSua(isCopy: boolean, isView = false, input = null) {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
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
    let data = null;

    if (input) {
      data = input;
    } else {
      const vals: any[] = this.listThongDiepChung.filter(x => x.selected === true);
      if (vals == null || vals.length < 1) {
        return;
      }

      data = vals[0];
    }

    if (data.maLoaiThongDiep == 200 && isCopy) {
      //nếu là nhân bản với thông điệp 200 thì cảnh báo ko cho nhân bản
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
              nzWidth:400,
              nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: 'Hệ thống không cho phép nhân bản loại thông điệp <b>200 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã</b>. Vui lòng kiểm tra lại!',
        },
        nzFooter: null
      });

      return;
    }

    this.rowScrollerToViewEdit.getRowToViewEdit(data.hinhThucThanhToanId);
    // call modal
    if (data.maLoaiThongDiep == 100 || data.maLoaiThongDiep == 101) {
      console.log(data);
      this.quyDinhKyThuatService.GetToKhaiById(data.idThamChieu).subscribe(
        (res: any) => {
          console.log(res);
          if (data.trangThaiGui != -1 && !isCopy && !isView) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth:400,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: `Kiểm tra lại`,
                msContent: 'Hệ thống chỉ cho phép thực hiện <b>Sửa</b> thông điệp có trạng thái gửi và phản hồi từ TCTN và CQT là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
                msOnClose: () => {
                },
              }
            });
            return;
          }
          const _data = res.nhanUyNhiem ? res.toKhaiUyNhiem : res.toKhaiKhongUyNhiem;
          if (data.maThongDiep == null || data.maThongDiep == '' || isCopy) res.signedStatus = false;
          console.log(res);
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
            nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isAddNew: false,
              data: _data,
              isCopy: isCopy,
              phuongPhapTinh: res.ppTinh,
              dTKhai: res,
              isThemMoi: res.isThemMoi,
              nhanUyNhiem: res.nhanUyNhiem,
              loaiUyNhiem: res.loaiUyNhiem,
              hoSoHDDT: this.hoSo,
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
    else if (data.maLoaiThongDiep == 300 || data.maLoaiThongDiep == 303) {
      if (data.maThongDiep != null && data.maThongDiep != '' && !isCopy) {
        if (isView) {
          let title = data.maLoaiThongDiep == 300 ? 'Thông báo hóa đơn điện tử có sai sót' : 'Thông báo hóa đơn máy tính tiền có sai sót';
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: title,
            nzContent: ThongBaoHoaDonSaiSotModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isView: true,
              daKyVaGuiCQT: true,
              thongDiepGuiCQTId: data.idThamChieu,
              thongDiepChung: data,
              loaiThongBao: data.loaiThongBao
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
        else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 400,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'Hệ thống chỉ cho phép thực hiện <b>Sửa</b> thông điệp có trạng thái gửi và phản hồi từ TCTN và CQT là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
              msOnClose: () => {
              },
            }
          });

          return;
        }
      }
      else {
        if (isCopy) {
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
            nzContent: ThongBaoHoaDonSaiSotModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isCopy: true,
              thongDiepGuiCQTId: data.idThamChieu,
              loaiThongBao: data.loaiThongBao
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
        else {
          if (isView) {
            const modal = this.ActivedModal = this.modalService.create({
              nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
              nzContent: ThongBaoHoaDonSaiSotModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '100%',
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                isView: true,
                thongDiepGuiCQTId: data.idThamChieu,
                thongDiepChung: data,
                loaiThongBao: data.loaiThongBao
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
          else {
            const modal = this.ActivedModal = this.modalService.create({
              nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
              nzContent: ThongBaoHoaDonSaiSotModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '100%',
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                isEdit: true,
                thongDiepGuiCQTId: data.idThamChieu,
                loaiThongBao: data.loaiThongBao
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
      }
    }
  }

  eSign() {
    const vals: any[] = this.listThongDiepChung.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    const data: any = vals[0];
    if (data.maLoaiThongDiep == 100 || data.maLoaiThongDiep == 101) {
      if (data.trangThaiGui != -1) {
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
            msTitle: 'Kiểm tra lại',
            msContent: 'Hệ thống chỉ cho phép thực hiện <b>Ký và Gửi</b> thông điệp có trạng thái gửi và phản hồi từ TCTN và CQT là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
          },
          nzFooter: null
        });

        return;
      }

      this.quyDinhKyThuatService.GetToKhaiById(data.idThamChieu).subscribe(
        (res: any) => {
          const _data = res.nhanUyNhiem ? res.toKhaiUyNhiem : res.toKhaiKhongUyNhiem;
          console.log(res);
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
            nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isAddNew: false,
              data: _data,
              dTKhai: res,
              isThemMoi: res.isThemMoi,
              nhanUyNhiem: res.nhanUyNhiem,
              loaiUyNhiem: res.loaiUyNhiem,
              hoSoHDDT: this.hoSo,
              fbEnableEdit: false,
              autoSign: true
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
    else {
      if (data.maThongDiep != '' && data.maThongDiep != null) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '400px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: 'Hệ thống chỉ cho phép thực hiện <b>Ký và Gửi</b> thông điệp có trạng thái gửi và phản hồi từ TCTN và CQT là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
          },
          nzFooter: null
        });

        return;
      }

      const modal = this.ActivedModal = this.modalService.create({
        nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
        nzContent: ThongBaoHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          autoSign: true,
          thongDiepGuiCQTId: data.idThamChieu,
          thongDiepChung: data
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

  sendMessageToServer(tKhai: any, xmlGui: string) {
    let domain = this.env.apiUrl;
    //let domain = 'https://hdbk.pmbk.vn';
    this.quyDinhKyThuatService.GetToKhaiById(tKhai.id).subscribe((rs: any) => {
      // this.getXmlThongDiep(tDiep, rs);
      if (xmlGui != "") {
        const databaseName = localStorage.getItem(CookieConstant.DATABASENAME);
        var fileUrl = `${this.env.apiUrl}/FilesUpload/${databaseName}/xml/unsign/${xmlGui}`;

        const dtToKhai = rs.nhanUyNhiem ? rs.toKhaiUyNhiem : rs.toKhaiKhongUyNhiem;
        var serials = dtToKhai.dltKhai.ndtKhai.dsctssDung.map(x => x.seri);
        console.log(serials);
        const msg = {
          mLTDiep: !rs.nhanUyNhiem ? 100 : 101,
          urlXML: fileUrl,
          serials: serials,
          mst: dtToKhai.dltKhai.ttChung.mst
        };

        console.log(msg);
        // Sending
        this.webSocket.sendMessage(JSON.stringify(msg));
      }
    });
  }

  GuiToKhai(tKhai: any) {
    var tDiep = this.taoThongDiepGui(tKhai);
    this.quyDinhKyThuatService.GetThongDiepByThamChieu(tKhai.id).subscribe((td: any) => {
      var paramGuiTKhai = {
        id: td.thongDiepChungId,
        maThongDiep: tDiep.TTChung.MTDiep,
        mST: tDiep.TTChung.MST
      };
      this.quyDinhKyThuatService.GuiToKhai(paramGuiTKhai).subscribe((rs: boolean) => {
        if (rs) {
          var thongDiepChung = {
            thongDiepChungId: td.thongDiepChungId,
            maThongDiep: tDiep.TTChung.MTDiep,
            maNoiGui: tDiep.TTChung.MNGui,
            maNoiNhan: tDiep.TTChung.MNNhan,
            thongDiepGuiDi: td.thongDiepGuiDi,
            hinhThuc: td.hinhThuc,
            maLoaiThongDiep: tDiep.TTChung.MLTDiep,
            maThongDiepThamChieu: tDiep.TTChung.MTDTChieu,
            phienBan: tDiep.TTChung.PBan,
            soLuong: tDiep.TTChung.SLuong,
            maSoThue: tDiep.TTChung.MST,
            createdDate: td.createdDate,
            modifyDate: moment().format("YYYY-MM-DD"),
            ngayGui: moment().format("YYYY-MM-DD"),
            idThamChieu: td.idThamChieu,
            trangThaiGui: 0
          }
          this.quyDinhKyThuatService.UpdateThongDiepChung(thongDiepChung).subscribe((res: boolean) => {
            if (res == true) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzWidth: 500,
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: 'Hoàn thành thao tác gửi dữ liệu đến CQT',
                  msContent: `Đã hoàn thành thao tác gửi dữ liệu đến CQT.
                  <br>Bạn cần theo dõi <b>Trạng thái gửi và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b>`,
                  msOnClose: () => {
                  }
                },
                nzFooter: null
              });
            }
            else {
              var thongDiepChung = {
                thongDiepChungId: td.thongDiepChungId,
                maThongDiep: td.TTChung.MTDiep,
                maNoiGui: td.TTChung.MNGui,
                maNoiNhan: td.TTChung.MNNhan,
                thongDiepGuiDi: td.thongDiepGuiDi,
                hinhThuc: td.hinhThuc,
                maLoaiThongDiep: td.TTChung.MLTDiep,
                maThongDiepThamChieu: td.TTChung.MTDTChieu,
                phienBan: td.TTChung.PBan,
                soLuong: td.TTChung.SLuong,
                maSoThue: td.TTChung.MST,
                createdDate: td.createdDate,
                modifyDate: moment().format("YYYY-MM-DD"),
                ngayGui: moment().format("YYYY-MM-DD"),
                idThamChieu: td.idThamChieu,
                trangThaiGui: 15
              }
              this.quyDinhKyThuatService.UpdateThongDiepChung(thongDiepChung).subscribe();
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzWidth: 500,
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: 'Kiểm tra lại',
                  msContent: `Không gửi được <b>Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử</b>(Mẫu số 01/ĐKTĐ-HĐĐT) đến <b>TCTN</b>(Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử).
                  <br>Vui lòng thực hiện <span class="cssyellow">Lập mới, Ký và Gửi</span> lại!`,
                  msOnClose: () => {
                  }
                },
                nzFooter: null
              });
            }
            this.LoadData();
          });

        }
        else {
          this.message.error("Có lỗi trong quá trình ký và gửi")
        }
      })
    });
  }

  taoThongDiepGui(tKhai): any {
    var tDiep = null;
    if (!tKhai.nhanUyNhiem) {
      var tDiepKUN = {
        TTChung: {
          PBan: "2.0.0",
          MNGui: `${this.env.taxCodeTCGP}`,
          MNNhan: `TCT`,
          MLTDiep: "100",
          MTDiep: `${this.env.taxCodeTCGP}${new GUID().toString().replace('-', '').toUpperCase()}`,
          MTDTChieu: null,
          MST: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mst,
          SLuong: 1
        },
        DLieu: {
          TKhai: {
            DLTKhai: {
              TTChung: {
                PBan: "2.0.0",
                MSo: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mSo,
                Ten: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.ten,
                HThuc: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.hThuc,
                TNNT: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.tnnt,
                MST: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mst,
                CQTQLy: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.cqtqLy,
                MCQTQLy: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.mcqtqLy,
                NLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.nlHe,
                DCLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dclHe,
                DCTDTu: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dctdTu,
                DTLHe: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dtlHe,
                DDanh: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.dDanh,
                NLap: tKhai.toKhaiKhongUyNhiem.dltKhai.ttChung.nLap
              },
              NDTKhai: {
                HTHDon: {
                  CMa: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.cMa,
                  KCMa: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.kcMa
                },
                HTGDLHDDT: {
                  NNTDBKKhan: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.nntdbkKhan,
                  NNTKTDNUBND: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.nntktdnubnd,
                  CDLTTDCQT: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.cdlttdcqt,
                  CDLQTCTN: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.htgdlhddt.cdlqtctn
                },
                PThuc: {
                  CDDu: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu,
                  CBTHop: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cbtHop
                },
                LHDSDung: {
                  HDGTGT: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdgtgt,
                  HDBHang: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbHang,
                  HDBTSCong: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbtsCong,
                  HDBHDTQGia: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdbhdtqGia,
                  HDKhac: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.hdKhac,
                  CTu: tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.lhdsDung.cTu,
                },
                DSCTSSDung: []
              }
            },
            DSCKS: {
              NNT: tKhai.toKhaiKhongUyNhiem.dscks.nnt,
              CCKSKhac: tKhai.toKhaiKhongUyNhiem.dscks.ccksKhac
            }
          }
        }
      };

      tKhai.toKhaiKhongUyNhiem.dltKhai.ndtKhai.dsctssDung.forEach(element => {
        tDiepKUN.DLieu.TKhai.DLTKhai.NDTKhai.DSCTSSDung.push({
          sTT: element.stt,
          tTChuc: element.ttChuc,
          seri: element.seri,
          tNgay: element.tNgay,
          dNgay: element.dNgay,
          hThuc: element.hThuc
        });
      });

      tDiep = tDiepKUN;
    }
    else {
      var tDiepUN = {
        TTChung: {
          PBan: '2.0.0',
          MNGui: `${this.env.taxCodeTCGP}`,
          MNNhan: `TCT`,
          MLTDiep: `101`,
          MTDiep: `${this.env.taxCodeTCGP}${new GUID().toString().replace('-', '').toUpperCase()}`,
          MTDTChieu: null,
          MST: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mst,
          SLuong: 1
        },
        DLieu: {
          TKhai: {
            DLTKhai: {
              TTChung: {
                PBan: '2.0.0',
                MSo: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mSo,
                Ten: tKhai.toKhaiUyNhiem.dltKhai.ttChung.ten,
                HThuc: tKhai.toKhaiUyNhiem.dltKhai.ttChung.hThuc,
                TNNT: tKhai.toKhaiUyNhiem.dltKhai.ttChung.tnnt,
                MST: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mst,
                CQTQLy: tKhai.toKhaiUyNhiem.dltKhai.ttChung.cqtqLy,
                MCQTQLy: tKhai.toKhaiUyNhiem.dltKhai.ttChung.mcqtqLy,
                NLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.nlHe,
                DCLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dclHe,
                DCTDTu: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dctdTu,
                DTLHe: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dtlHe,
                DDanh: tKhai.toKhaiUyNhiem.dltKhai.ttChung.dDanh,
                NLap: tKhai.toKhaiUyNhiem.dltKhai.ttChung.nLap
              },
              NDTKhai: {
                DSCTSSDung: [],
                DSDKUNhiem: []
              }
            },
            DSCKS: {
              NNT: " ",
              CCKSKhac: tKhai.toKhaiUyNhiem.dscks.ccksKhac
            }
          }
        }
      }

      tKhai.toKhaiUyNhiem.dltKhai.ndtKhai.dsctssDung.forEach(element => {
        tDiepUN.DLieu.TKhai.DLTKhai.NDTKhai.DSCTSSDung.push({
          sTT: element.stt,
          tTChuc: element.ttChuc,
          seri: element.seri,
          tNgay: element.tNgay,
          dNgay: element.dNgay,
          hThuc: element.hThuc
        });
      });

      tKhai.toKhaiUyNhiem.dltKhai.ndtKhai.dsdkuNhiem.forEach(element => {
        tDiepUN.DLieu.TKhai.DLTKhai.NDTKhai.DSDKUNhiem.push({
          sTT: element.stt,
          tLHDon: element.tlhDon,
          kHMSHDon: element.khmshDon,
          kHHDon: element.khhDon,
          mST: element.mst,
          tTChuc: element.ttChuc,
          mDich: element.mDich,
          tNgay: element.tNgay,
          dNgay: element.dNgay,
          pThuc: element.pThuc,
        });
      });

      tDiep = tDiepUN;
    }

    return tDiep;
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
      this.dataSelected = this.listOfSelected[0];
    }

    if (this.dataSelected) {
      this.quyDinhKyThuatService.GetThongDiepChungById(this.dataSelected.thongDiepChungId).subscribe((rs: any) => {
        if (rs.trangThaiGui != -1) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 400,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'Hệ thống chỉ cho phép thực hiện <b>Xóa</b> thông điệp có trạng thái gửi và phản hồi từ TCTN và CQT là <b>Chưa gửi</b>. Vui lòng kiểm tra lại!',
              msOnClose: () => {
              },
            }
          });
          return;
        }

        const modal = this.ActivedModal = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msTitle: `Xóa thông điệp`,
            msContent: '<span>Bạn có thực sự muốn xóa thông điệp này không?</span>',
            msOnClose: () => {
              return;
            },
            msOnOk: () => {
              if (this.dataSelected.maLoaiThongDiep == 100 || this.dataSelected.maLoaiThongDiep == 101) {
                console.log(this.dataSelected.idThamChieu);
                this.quyDinhKyThuatService.XoaToKhai(this.dataSelected.idThamChieu).subscribe((res: any) => {
                  if (res) {
                    this.quyDinhKyThuatService.DeleteThongDiepChung(this.dataSelected.thongDiepChungId).subscribe((rs: boolean) => {
                      if (rs) {
                        this.nhatKyTruyCapService.Insert({
                          loaiHanhDong: LoaiHanhDong.Xoa,
                          refType: RefType.ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
                          thamChieu: 'Tờ khai tạo ngày: ' + moment(this.dataSelected.ngayTao).format("YYYY-MM-DD"),
                          refId: this.dataSelected.id
                        }).subscribe();
                        this.deleteCheckedItem(this.dataSelected.id);
                        this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                        this.LoadData();
                      } else {
                        this.message.error(Message.DONT_DELETE_DANH_MUC);
                      }

                    });
                  }
                  else {
                    this.message.error(Message.DONT_DELETE_DANH_MUC);
                  }
                }, _ => {
                  this.message.error(Message.DONT_DELETE_DANH_MUC);
                })

              }
              else if (this.dataSelected.maLoaiThongDiep == 400) {
                this.quyDinhKyThuatService.DeleteThongDiepChung(this.dataSelected.thongDiepChungId).subscribe((rs: boolean) => {
                  if (rs) {
                    this.nhatKyTruyCapService.Insert({
                      loaiHanhDong: LoaiHanhDong.Xoa,
                      refType: RefType.BangTongHopDuLieu,
                      thamChieu: 'Thông điệp tạo ngày: ' + moment(this.dataSelected.createdDate).format("YYYY-MM-DD"),
                      refId: this.dataSelected.id
                    }).subscribe();
                    this.deleteCheckedItem(this.dataSelected.id);
                    this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
                    this.LoadData();
                  } else {
                    this.message.error(Message.DONT_DELETE_DANH_MUC);
                  }
                });
              }
              else if (this.dataSelected.maLoaiThongDiep == 300 || this.dataSelected.maLoaiThongDiep == 303) {
                this.thongDiepGuiCQTService.Delete(this.dataSelected.idThamChieu).subscribe((res: any) => {
                  if (res) {
                    this.message.success('Xóa dữ liệu thành công');
                    //thêm nhật ký truy cập
                    this.nhatKyTruyCapService.Insert({
                      loaiHanhDong: LoaiHanhDong.Xoa,
                      refType: RefType.ThongBaoHoaDonSaiSot,
                      thamChieu: 'Thông báo hóa đơn sai sót',
                      moTaChiTiet: 'Xóa thông báo',
                      refId: this.dataSelected.idThamChieu,
                    }).subscribe();
                    this.LoadData();
                  } else {
                    this.message.error('Lỗi xóa dữ liệu');
                  }
                });
              }
            },
          }
        });
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.LoadData();
          }
        });
      });
    } else {
    }
  }
  changeSearch(event: any) {
    if (event.keyCode == 13) {
      this.LoadData();
    }
  }
  displayLichSuTruyenNhan(data: any) {
    if (data.trangThaiGui == -1) return;
    this.dataSelected = data;
    this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(this.dataSelected.maThongDiep).subscribe((rs: any) => {
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
            maTD: this.dataSelected.maThongDiep,
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
  }
  selectedRow(data: any) {
    this.dataSelected = data;
    this.disabledBtnNhanBan = false;
    data.selected = true;
    this.isDisabled = false;
    if (data.maLoaiThongDiep != 100 && data.maLoaiThongDiep != 101 && data.maLoaiThongDiep != 300 && data.maLoaiThongDiep != 303) {
      this.isDisabled = true;
    }

    if (data.maLoaiThongDiep === 300 || data.maLoaiThongDiep === 303) {
      this.disabledBtnNhanBan = true;
    }

    this.listThongDiepChung.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.params.PageNumber = 1;
    }
    this.LoadData();
  }

  search(colName: any) {
    this.LoadData();
  }

  GetDieuKienTimKiem() {
    this.quyDinhKyThuatService.GetListTimKiemTheoThongDiep().subscribe((rs: any[]) => {
      this.timKiemTheos = rs;
    })
  }

  sort(sort: { key: string; value: string }): void {
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.LoadData();
  }

  clickXem() {

  }

  export() {
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      this.message.error(TextGlobalConstants.TEXT_PLEASE_CHOOSE_MESSAGE_TO_EXPORT);
      return;
    }

    if (this.listOfSelected.length > 0) {
      this.dataSelected = this.listOfSelected[0];
    }

    if (this.dataSelected.maThongDiep == null || this.dataSelected.maThongDiep == '') {
      this.message.error("Thông điệp chưa gửi không được xuất khẩu");
      return;
    }

    this.quyDinhKyThuatService.GetThongDiepChungById(this.dataSelected.thongDiepChungId).subscribe((rs: any) => {
      const params = {
        thongDiep: rs,
        signed: true
      };

      this.quyDinhKyThuatService.GetLinkFileXml(params).subscribe((res: any) => {
        var bytes = base64ToArrayBuffer(res.bytes);
        saveByteArray(`${moment().format("YYYYMMDDHHMMSS")}.xml`, bytes, res.type);
      });
    })
  }

  change(colName: any, event: any) {
    if (!event) {
      this.params.Filter[colName] = event;
      this.LoadData();
    }
  }

  blurDate() {
    CheckValidDateV2(this.params);
    const ky = GetKy(this.params);
    this.params.Ky = ky;
  }

  changeKy(event: any) {
    SetDate(event, this.params);
  }

  viewMoTaLoi(data) {
    if (data.moTaLoi) {
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
          moTaLoi: data.moTaLoi
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
        }
      });
    }
  }

  openDinhKem(item: any) {
    console.log(item);
    const modal = this.modalService.create({
      nzTitle: Message.ATTACH_ESC,
      nzContent: DinhKemHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '30%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        hoaDonDienTuId: item.thongDiepChungId,
        loaiNghiepVu: RefType.ThongDiepChung
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any) => {
      this.LoadData(true);
    })
  }

  //hàm này thống kê số lượng thông điệp chưa gửi
  thongKeSoLuongThongDiepChuaGui(coThongKeSoLuong: number, thaoTac: string) {
    let chuaGui = -1;
    this.loadingThongKeSoLuong = true;
    this.quyDinhKyThuatService.ThongKeSoLuongThongDiep(chuaGui, coThongKeSoLuong).subscribe((rs: any) => {
      this.thongKeSoLuongChuaGui = rs.soLuong;
      this.loadingThongKeSoLuong = false;
      this.paramsDefault = Object.assign({}, this.params);

      if (thaoTac != 'onlyLoad') //nếu thao tác là click vào nút, khác load dữ liệu
      {
        this.thongKe = true;
        this.params.fromDate = rs.tuNgay;
        this.params.toDate = rs.denNgay;
        const ky = GetKy(this.params);
        this.params.Ky = ky;
        this.loaiTrangThais.unshift({ value: -1, name: "Chưa gửi" });
        this.params.TrangThaiGui = -1;

        this.filterGeneral();
      }
    });
  }

  //hàm này mở form chọn tham số xem bảng kê hóa đơn sai sót
  chonThamSoBangKeHoaDonSaiSot() {
    this.modalService.create({
      nzTitle: 'Chọn tham số lọc hóa đơn xử lý sai sót',
      nzContent: ChonThamSoBangKeSaiSotModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '580px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzFooter: null
    });
  }
  viewAllThongDiepLienQuan(data: any) {
    const modal = this.modalService.create({
      nzTitle: 'Chi tiết ',
      nzContent: ChiTietThongDiepModalComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '90%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '20px' },
      nzComponentParams: {
        thongDiepDoc: data
      },
      nzFooter: null
    });
  }
  //Lấy tên thông điệp theo mã loại thông điệp
  getLoaiThongDiep(maLoaiThongDiep) {
    let loaiThongDiep = '';
    this.loaiThongDieps.forEach((val, ind) => {
      if (maLoaiThongDiep == val.id) loaiThongDiep = val.name;
    });
    return loaiThongDiep;
  }
  exportFile(type: any) {
    this.params.isPrint =type === 2;
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.quyDinhKyThuatService.ExportBangKe(this.params)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Bang_ke_thong_diep_gui.${type === 1 ? 'xlsx' : 'pdf'}`);
        this.message.remove(id);
      });
  }

  xacNhanToKhai01(){
    if(!this.dataSelected || this.dataSelected.maLoaiThongDiep != 100|| this.dataSelected.trangThaiGui != -1){
      return;
    }

    this.quyDinhKyThuatService.GetToKhaiById(this.dataSelected.idThamChieu).subscribe((rs: any)=>{
      const modal1 = this.modalService.create({
        nzTitle: "Xác nhận tờ khai đã được CQT chấp nhận",
        nzContent: XacNhanToKhaiMau01ModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 700,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '10px' },
        nzComponentParams: {
          data: rs.toKhaiKhongUyNhiem,
          dTKhai: rs,
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if(rs){
          this.LoadData();
        }
      });
    })
  }

}
