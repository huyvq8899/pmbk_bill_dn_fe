import { Component, OnInit, ViewChild } from "@angular/core";
import { FilterColumn, FilterCondition, ThongDiepChungParams } from "src/app/models/PagingParams";
import { FilterColumnComponent } from "src/app/shared/components/filter-column/filter-column.component";
import { TabShortKeyEventHandler } from "src/app/shared/KeyboardEventHandler";
import * as moment from 'moment';
import { GetKy, GetKyMacDinh, GetList, GetTenKy, SetDate } from "src/app/shared/chon-ky";
import { DinhDangThapPhan } from "src/app/shared/DinhDangThapPhan";
import { RowScrollerToViewEdit } from "src/app/shared/utils";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { HoaDonDienTuService } from "src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service";
import { EnvService } from "src/app/env.service";
import { ModalPreviewMutiplePdfComponent } from "../../bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component";
import { Message } from "src/app/shared/Message";
import { CheckValidDateV2 } from "src/app/shared/getDate";
import { QuyDinhKyThuatService } from "src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service";
import { DownloadFile, getHeightBangKeKhongChiTiet3, getHeightBangKeKhongChiTiet5, getHeightBangKeKhongChiTiet6, getListEmptyBangKe2, getListEmptyBangKeKhongChiTiet3, getListEmptyBangKeKhongChiTiet5, getListEmptyChiTiet, showModalPreviewPDF } from "src/app/shared/SharedFunction";
import { SumwidthConfig } from "src/app/shared/global";
import { MoTaLoiModalComponent } from '../modals/mo-ta-loi-modal/mo-ta-loi-modal.component';
import { LichSuTruyenNhanDisplayXmldataComponent } from "../../hoa-don-dien-tu/modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component";
import { ThongDiepGuiDuLieuHDDTService } from "src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service";
import { LichSuTruyenNhanComponent } from "../../hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component";

@Component({
  selector: 'app-tab-thong-diep-nhan',
  templateUrl: './tab-thong-diep-nhan.component.html',
  styleUrls: ['./tab-thong-diep-nhan.component.scss']
})
export class TabThongDiepNhanComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('filterColumnTemp', { static: false }) filterColumnTemp: FilterColumnComponent;
  widthConfig = ['100px', '120px', '580px', '300px', '120px', '100px'];
  // widthConfig = ['50px', '120px', '125px', '125px', '290px', '350px', '350px', '120px', '100px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '250px' };
  widthConfigA = [];
  scrollConfigA = { x: SumwidthConfig(this.widthConfigA), y: '150px' };
  widthConfigB = [];
  scrollConfigB = { x: SumwidthConfig(this.widthConfigB), y: '150px' };
  modal = '';
  mapOfExpandedData: { [key: number]: any[] } = {};
  mapOfExpandedData_luyKe: { [key: number]: any[] } = {};
  listKy: any[];
  listPaging: any[] = [];
  loading = false;
  total = 0;
  pageSizeOptions = [];
  thongDiepChiTiet1s: any[] = [];
  thongDiepChiTiet2s: any[] = [];
  loadingChiTiets: boolean;
  filterColVisible = false;
  displayData: any = {
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    LoaiThongDiep: -99,
    TrangThaiGui: -99,
    IsThongDiepGui: false,
    LocThongBaoHoaDonCanRaSoat: false,
    filterColumns: []
  };

  displayDataTemp: ThongDiepChungParams = Object.assign({}, this.displayData);
  displayDataRaw: ThongDiepChungParams = Object.assign({}, this.displayData);
  loadingPrint = false;
  loadingPreviewMutiple = false;
  dataSelected = null;
  // checkbox
  kys = GetList();
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  ddtp = new DinhDangThapPhan();
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  numberChiTiet1Cols = [];
  lstChiTiet1Empty = [];
  numberChiTiet2Cols = [];
  lstChiTiet2Empty = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  permission: boolean = false;
  thaoTacs: any[] = [];
  timKiemTheos: any[] = [];
  loaiThongDiepNhans = [];
  loaiPhis: Array<{ tenCot: string, giaTri: any }> = [];
  tab1TitleChiTiet = '';
  tab2TitleChiTiet = '';
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  //
  mapOfHasPropertyTab1: { [key: string]: boolean } = {};
  mapOfHasPropertyTab2: { [key: string]: boolean } = {};

  loaiTrangThais: any[] = []
  loaiThongDieps = [
    { id: 200, type: 1, name: "200 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã " },
    { id: 200, type: 1, name: "200 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã " },
    { id: 201, type: 1, name: "201 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã theo từng lần phát sinh" },
    { id: 203, type: 1, name: "203 - Thông điệp chuyển dữ liệu hóa đơn điện tử không mã đến cơ quan thuế" },
    { id: 300, type: 2, name: "300 - Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót" },
    { id: 202, type: 3, name: "202 - Thông điệp thông báo kết quả cấp mã hóa đơn điện tử của cơ quan thuế" },
    { id: 204, type: 3, name: "204 - Thông điệp thông báo mẫu số 01/TB-KTDL về việc kết quả kiểm tra dữ liệu hóa đơn điện tử" },
    { id: 205, type: 3, name: "205 - Thông điệp phản hồi về hồ sơ đề nghị cấp hóa đơn điện tử có mã của cơ quan thuế theo từng lần pháp sinh." },
    { id: 301, type: 4, name: "301 - Thông điệp gửi thông báo về việc tiếp nhận và kết quả xử lý về việc hóa đơn điện tử đã lập có sai sót" },
    { id: 302, type: 4, name: "302 - Thông điệp thông báo về hóa đơn điện tử cần rà soát" },
    { id: 400, type: 10, name: "400 - Thông điệp bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế" },
    { id: 999, type: 5, name: "999 - Thông điệp phản hồi kỹ thuật" },
    { id: -1, type: 5, name: "-1 - Thông điệp sai định dạng" },
    { id: 100, type: 6, name: "100 - Thông điệp gửi tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
    { id: 101, type: 7, name: "101 - Thông điệp gửi tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 102, type: 8, name: "102 - Thông điệp thông báo về việc tiếp nhận/không tiếp nhận tờ khai đăng ký/thay đổi thông tin sử dụng HĐĐT, tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 103, type: 9, name: "103 - Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
    { id: 104, type: 11, name: "104 - Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 105, type: 12, name: "105 - Thông điệp thông báo về việc hết thời gian sử dụng hóa đơn điện tử có mã qua cổng thông tin điện tử Tổng cục Thuế/qua ủy thác tổ chức cung cấp dịch vụ về hóa đơn điện tử; không thuộc trường hợp sử dụng hóa đơn điện tử không có mã" },

  ];
  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private env: EnvService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
  ) {
    super();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.lstBangKeEmpty = getListEmptyBangKe(this.listPaging);
  //   this.scrollConfig.y = (getHeightBangKeKhongChiTiet5()) + "px";
  // }

  ngOnInit() {
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    this.displayData.Ky = this.displayDataTemp.Ky = this.displayDataRaw.Ky = GetKyMacDinh();
    this.changeKy(this.displayData.Ky);
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepNhan").thaoTacs;
    }

    this.GetDieuKienTimKiem();
    this.getListLoaiThongDiepNhans();
    this.changeLoaiThongDiepGui(this.displayDataTemp.LoaiThongDiep);

    if (localStorage.getItem('TuDongLocThongBaoRaSoat') == 'true') {
      this.TuDongLocThongBaoRaSoat();
    }

    this.loadViewConditionList();
  }

  TuDongLocThongBaoRaSoat(){
    this.quyDinhKyThuatService.ThongKeSoLuongThongDiepHoaDonCanRaSoat(1).subscribe((rs: any)=>{
      this.displayDataTemp.fromDate = rs.tuNgay;
      this.displayDataTemp.toDate = rs.denNgay;
      this.displayDataTemp.LocThongBaoHoaDonCanRaSoat = true;
      localStorage.setItem('TuDongLocThongBaoRaSoat', 'false');
      const ky = GetKy(this.displayDataTemp);
      this.displayDataTemp.Ky = ky;
      this.filterGeneral();
    })
  }

  changeLoaiThongDiepGui(event: any) {
    console.log(event);
    if (event == -1) {
      this.loaiTrangThais.unshift({ value: -99, name: "Tất cả" });
      this.displayDataTemp.TrangThaiGui = -99;
    }
    else {
      this.quyDinhKyThuatService.GetTrangThaiGuiPhanHoiTuCQT(event).subscribe((rs: any[]) => {
        this.loaiTrangThais = rs;
        this.displayDataTemp.TrangThaiGui = -99;
      });
    }
  }

  LoadData(reset: boolean = false) {
    if (reset) {
      this.displayData.PageNumber = 1;
    }
    console.log("load")
    this.loading = true;
    this.quyDinhKyThuatService.GetAllPagingThongDiepChung(this.displayData).subscribe((data: any) => {
      this.listPaging = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.displayData.PageNumber = data.currentPage;
      this.loading = false;

      // delete all
      if (this.listPaging.length === 0 && this.displayData.PageNumber > 1) {
        this.displayData.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet5(this.listPaging);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet3()-10 + 'px';

      if (this.listPaging && this.listPaging.length > 0) {
        this.selectedRow(this.listPaging[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listPaging, "thongDiepChungId").then((result) => {
        this.selectedRow(result);
      });
      if (this.listPaging.length == 0) {
        this.thongDiepChiTiet1s = [];
        this.thongDiepChiTiet2s = [];
      }
    }, _ => {
      this.loading = false;
    });
  }

  getListLoaiThongDiepNhans() {
    this.quyDinhKyThuatService.GetListLoaiThongDiepNhan()
      .subscribe((res: any[]) => {
        this.loaiThongDiepNhans = res;
      });
  }

  filterTable() {
    if (this.displayDataTemp.toDate < this.displayDataTemp.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    this.LoadData(true);
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;
    this.listPaging.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });

    if (data.maLoaiThongDiep == 204 || data.maLoaiThongDiep == 999 ||
      data.maLoaiThongDiep == 301 || data.maLoaiThongDiep == 302) {
      this.quyDinhKyThuatService.GetAllThongDiepTraVeV2(data.thongDiepChungId, 'byId')
        .subscribe((res: any) => {
          if (res) {
            this.thongDiepChiTiet1s = res.thongDiepChiTiet1s;
            this.thongDiepChiTiet2s = res.thongDiepChiTiet2s;
            if (this.thongDiepChiTiet1s.length > 0) {
              if (this.thongDiepChiTiet1s[0].loaiThongBao == 3 && this.thongDiepChiTiet1s[0].maLoaiThongDiep == 204) {
                this.tab2TitleChiTiet = 'Thông tin hóa đơn không hợp lệ';
              }
              if (this.thongDiepChiTiet1s[0].loaiThongBao == 2 && this.thongDiepChiTiet1s[0].maLoaiThongDiep == 204) {
                this.tab2TitleChiTiet = '';
              }
              if (data.maLoaiThongDiep == 301 && this.thongDiepChiTiet2s.length == 0) {
                this.tab2TitleChiTiet = '';
              }
            }
          }
        });
    }
    else {
      this.quyDinhKyThuatService.ShowThongDiepFromFileById(data.thongDiepChungId)
        .subscribe((res: any) => {
          if (res) {
            this.thongDiepChiTiet1s = res.thongDiepChiTiet1s;
            this.thongDiepChiTiet2s = res.thongDiepChiTiet2s;
          }
        });
    }

    // this.showTabChiTiet();
  }

  showTabChiTiet() {
    this.tab2TitleChiTiet = '';
    switch (this.dataSelected.maLoaiThongDiep) {
      case 102:
        this.widthConfigA = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        break;
      case 103:
        this.widthConfigA = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        break;
      case 104:
        this.widthConfigA = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.widthConfigB = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        this.tab2TitleChiTiet = 'Danh sách thông tin ủy nhiệm';
        break;
      case 202:
        this.widthConfigA = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px',
          '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'
          , '150px', '150px', '150px', '150px'];
        this.tab1TitleChiTiet = 'Hóa đơn giá trị gia tăng';
        break;
      case 204:
        this.widthConfigA = ['100px', '150px', '250px', '150px', '110px', '150px', '150px', '150px', '200px', '110px', '110px', '150px', '90px', '550px'];
        this.widthConfigB = ['50px', '100px', '100px', '70px', '70px', '400px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        this.tab2TitleChiTiet = 'Thông báo hóa đơn không đủ điều kiện cấp mã';
        break;
      case 301:
        this.widthConfigA = ['100px', '150px', '250px', '150px', '110px', '150px', '150px', '150px', '200px', '150px', '150px', '150px', '110px', '100px', '550px'];
        this.widthConfigB = ['50px', '150px', '150px', '130px', '100px', '120px', '150px', '150px', '150px', '550px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        this.tab2TitleChiTiet = 'Danh sách hóa đơn không tiếp nhận';
        break;
      case 302:
        this.widthConfigA = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '200px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.widthConfigB = ['150px', '150px', '150px', '150px', '150px', '150px', '150px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        this.tab2TitleChiTiet = 'Danh sách hóa đơn cần rà soát';
        break;
      case 999:
        this.widthConfigA = ['320px', '150px', '130px', '150px', '550px'];
        this.tab1TitleChiTiet = 'Dữ liệu';
        break;
      default:
        break;
    }

    this.numberChiTiet1Cols = Array(this.widthConfigA.length).fill(0);
    this.lstChiTiet1Empty = getListEmptyChiTiet(this.thongDiepChiTiet1s);
    this.numberChiTiet2Cols = Array(this.widthConfigB.length).fill(0);
    this.lstChiTiet2Empty = getListEmptyChiTiet(this.thongDiepChiTiet2s);
    this.scrollConfigA.x = SumwidthConfig(this.widthConfigA);
    this.scrollConfigB.x = SumwidthConfig(this.widthConfigB);
  }

  sort(sort: { key: string; value: string }): void {
    this.displayData.SortKey = sort.key;
    this.displayData.SortValue = sort.value;
    this.LoadData();
  }

  // exportExcel() {
  //   this.loading = true;
  //   this.displayData.isPrint = false;
  //   this.quyDinhKyThuatService.ExportBangKe(this.displayData).subscribe(
  //     (res: any) => {
  //       const link = window.URL.createObjectURL(res);
  //       DownloadFile(link, 'Bang_ke_thong_diep_nhan.xlsx');
  //       this.loading = false;
  //     },
  //     err => {
  //       this.message.error("Lỗi xuất khẩu");
  //       return;
  //     }
  //   );
  // }
  exportFile(type: any) {
    this.displayData.isPrint =type === 2;
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.quyDinhKyThuatService.ExportBangKe(this.displayData)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Bang_ke_thong_diep_nhan.${type === 1 ? 'xlsx' : 'pdf'}`);
        this.message.remove(id);
      });
  }
  print() {
    this.loading = true;
    this.displayData.isPrint = true;
    this.quyDinhKyThuatService.ExportBangKe(this.displayData).subscribe(
      (res: any) => {
        const link = window.URL.createObjectURL(res);
        showModalPreviewPDF(this.modalService, link);
        this.loading = false;
      },
      err => {
        this.message.error("Lỗi in");
        return;
      }
    );
  }

  clickSua(isCopy: any) {
    throw new Error("Method not implemented.");
  }

  clickXoa() {
    throw new Error("Method not implemented.");
  }

  clickXem() {

  }
  clickThem() {

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

    this.viewConditionList.push({ key: 'Ky', label: 'Kỳ: ', value: GetTenKy(this.displayData.Ky) });
    if (this.displayData.LoaiThongDiep !== -99) {
      this.viewConditionList.push({ key: 'LoaiThongDiep', label: 'Loại thông điệp: ', value: this.loaiThongDiepNhans.find(x => x.maLoaiThongDiep === this.displayData.LoaiThongDiep).maLoaiThongDiep });
    }

    if (this.displayData.TrangThaiGui !== -99) {
      this.viewConditionList.push({ key: 'TrangThaiGui', label: 'Trạng thái gửi và phản hồi của CQT: ', value: this.loaiTrangThais.find(x => x.value == this.displayData.TrangThaiGui).name });
    }


    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    // this.displayData.filterColumns.forEach((item: FilterColumn) => {
    //   if (item.isFilter) {
    //     this.viewConditionList.push({
    //       key: item.colKey,
    //       label: `${item.colNameVI}: `,
    //       value: item.colValue
    //     });
    //   }
    // });

    this.LoadData(true);
  }

  GetDieuKienTimKiem() {
    this.quyDinhKyThuatService.GetListTimKiemTheoThongDiep().subscribe((rs: any[]) => {
      this.timKiemTheos = rs;
    })
  }

  removeFilter(filter: any) {
    switch (filter.key) {
      case 'LoaiThongDiep':
        this.displayDataTemp.LoaiThongDiep = -99;
        break;
      default:
        break;
    }

    // if (this.displayData.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
    //   const idx = this.displayData.filterColumns.findIndex(x => x.colKey === filter.key);
    //   this.displayData.filterColumns[idx].isFilter = false;
    //   this.displayData.filterColumns[idx].colValue = null;
    //   this.mapOfHightlightFilter[filter.key] = false;
    // }

    this.displayData = Object.assign({}, this.displayDataTemp);
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

  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }

  changeKy(event: any) {
    SetDate(event, this.displayDataTemp);
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

  replaceNewLine(data: any) {
    if (data == null) return "";
    return data.toString().replace(/<br>/g, ' ');
  }

  viewLoiById(data: any) {
    this.quyDinhKyThuatService.ShowThongDiepFromFileById(data.thongDiepChungId).subscribe((rs: any) => {
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
    });
  }
  displayXmlData(data: any) {
    this.thongDiepGuiDuLieuHDDTService.GetAllThongDiepTraVeInTransLogs(data.maThongDiep).subscribe((rs: any) => {
      if (rs != null) {
        console.log(rs);
        const modal1 = this.modalService.create({
          nzTitle: "Chi tiết",
          nzContent: LichSuTruyenNhanDisplayXmldataComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 80,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            fileData: rs.result.fileXML,
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {

        });
      }

    });

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

    console.log(template);
    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }
  displayLichSuTruyenNhan(data: any) {
    this.dataSelected = data;
    console.log(data);
    this.quyDinhKyThuatService.GetThongDiepChungByMaThongDiep(this.dataSelected.maThongDiepThamChieu).subscribe((rs: any) => {
      console.log("GetThongDiepChungByMaThongDiep");
      console.log(rs);

      if (rs != null) {
        this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(this.dataSelected.maThongDiepThamChieu).subscribe((rs: any) => {
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
}
