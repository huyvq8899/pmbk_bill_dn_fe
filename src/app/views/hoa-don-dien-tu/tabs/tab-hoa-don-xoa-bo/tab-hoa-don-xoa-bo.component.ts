import { data } from 'jquery';
import { NullAstVisitor } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { EnvService } from 'src/app/env.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { FilterColumn, FilterCondition, HoaDonParams } from 'src/app/models/PagingParams';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { GetKy, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GlobalConstants, SumwidthConfig } from 'src/app/shared/global';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { getHeightBangKe, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet6, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3, getTimKiemTheo, KeyCode, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { GuiBienBanXoaBoModalComponent } from '../../modals/gui-bien-ban-xoa-bo-modal/gui-bien-ban-xoa-bo-modal.component';
import { GuiHoaDonModalComponent } from '../../modals/gui-hoa-don-modal/gui-hoa-don-modal.component';
import { GuiHoaDonXoaBoModalComponent } from '../../modals/gui-hoa-don-xoa-bo-modal/gui-hoa-don-xoa-bo-modal.component';
import { LapBienBanXoaBoHoaDonModalComponent } from '../../modals/lap-bien-ban-xoa-bo-hoa-don/lap-bien-ban-xoa-bo-hoa-don.modal.component';
import { ListHoaDonXoaBoModalComponent } from '../../modals/list-hoa-don-xoa-bo-modal/list-hoa-don-xoa-bo-modal.modal.component';
import { ListLapBienBanHuyHoaDonComponent } from '../../modals/list-lap-bien-ban-huy-hoa-don/list-lap-bien-ban-huy-hoa-don.component';
import { TepDinhKemModalComponent } from '../../modals/tep-dinh-kem-modal/tep-dinh-kem-modal.component';
import { XoaBoHoaDonModalComponent } from '../../modals/xoa-bo-hoa-don-modal/xoa-bo-hoa-don-modal.component';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tab-hoa-don-xoa-bo',
  templateUrl: './tab-hoa-don-xoa-bo.component.html',
  styleUrls: ['./tab-hoa-don-xoa-bo.component.scss']
})
export class TabHoaDonXoaBoComponent extends TabShortKeyEventHandler implements OnInit {
  mauHoaDonDuocPQ: any[] = [];
  thaoTacHoaDonSaiSot: any[]=[];
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.keyCode) {

      case 120:      // F9 - Xem thông tin
        this.ShowListHoaDonXoaBo();
        break;
      case KeyCode.F8:      // F8 – Sửa một bản ghi
        this.ShowListLBB();
        break;
    }
  }
  subscription: Subscription;
  scrollConfig = { x: '', y: '35vh' };
  globalConstants = GlobalConstants;
  kys = GetList();
  selectedTab = 0;
  oldSelectTab = 0;
  dataSelected: any;
  listOfSelected: any[] = []
  listKy: any[];
  listPaging: any[] = [];
  listTemp: any[] = [];
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listDSRutGonBoKyHieuHoaDon: any[] = [];
  loading = false;
  total = 0;
  SoHoaDonChuaLapThayThe = 0;
  SoHoaDonChuaXoaBo = 0;
  countFileDinhKem = 0;
  pageSizeOptions = [];
  filterVisible = false;
  mapOfCheckedId: any = {};
  kyKeKhaiThueGTGT = localStorage.getItem(CookieConstant.KYKEKHAITHUE) == 'Quy' ? 6 : 4;
  tempToDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).endOf('quarter').format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD');
  tempFormDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).startOf('quarter').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');
  displayData: HoaDonParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: this.tempFormDate,
    oldToDate: this.tempToDate,
    fromDate: this.tempFormDate,
    toDate: this.tempToDate,
    Ky: this.kyKeKhaiThueGTGT,
    LoaiHoaDon: -1,
    TrangThaiPhatHanh: -1,
    TrangThaiGuiHoaDon: -1,
    TrangThaiChuyenDoi: -1,
    TrangThaiHoaDonDienTu: -1,
    TrangThaiBienBanXoaBo: -1,
    TrangThaiXoaBo: -1,
    Filter: {},
    TimKiemTheo: {},
    GiaTri: "",
    filterColumns: []
  };

  displayDataTemp: HoaDonParams = Object.assign({}, this.displayData);
  displayDataRaw: HoaDonParams = Object.assign({}, this.displayData);
  ddtp = new DinhDangThapPhan();
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  permission: boolean;
  thaoTacs: any[] = [];
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  //
  widthConfig = ["340px", "300px", "300px", "200px", "80px", "120px", "180px", "400px", "150px", "380px"];
  selectedValue = null;
  trangThaiXoaBos = [
    { id: -1, ten: "Tất cả", level: 0 },
    { id: 0, ten: "Hóa đơn đã xóa bỏ", isParent: true, level: 0 },
    { id: 1, ten: "Hóa đơn xóa bỏ đã lập thay thế", level: 1 },
    { id: 2, ten: "Hóa đơn xóa bỏ chưa lập thay thế", level: 1 },
    { id: 4, ten: "Hóa đơn xóa bỏ không lập thay thế", level: 1 },
    { id: 5, ten: "Hóa đơn xóa bỏ CQT không tiếp nhận", level: 1 },
    { id: 3, ten: "Hóa đơn chưa xóa bỏ", level: 0 },
  ]
  trangThaiBienBanXoaBos = [
    { id: -1, ten: "Tất cả" },
    { id: -10, ten: "Không cần lập biên bản" },
    { id: 0, ten: "Chưa lập biên bản" },
    { id: 1, ten: "Chưa ký biên bản" },
    { id: 2, ten: "Chưa gửi cho khách hàng" },
    { id: 3, ten: "Chờ khách hàng ký" },
    { id: 4, ten: "Khách hàng đã ký" },
  ]
  timKiemTheos = getTimKiemTheo();
  hinhThucXoabos = [
    { id: 1, name: "Hủy hóa đơn do sai sót", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
    { id: 2, name: "Xóa để lập hóa đơn thay thế", show: false, tooltipContent: "" },
    { id: 3, name: "Hủy hóa đơn theo lý do phát sinh", show: false, tooltipContent: "Trường hợp người bán lập hóa đơn khi thu tiền trước hoặc trong khi cung cấp dịch vụ theo quy định tại Khoản 2 Điều 9 Nghị định số 123/2020/NĐ-CP sau đó có phát sinh việc hủy hoặc chấm dứt việc cung cấp dịch vụ thì người bán thực hiện hủy hóa đơn điện tử đã lập và thông báo với cơ quan thuế về việc hủy hóa đơn theo Mẫu số 04/SS-HĐĐT tại Phụ lục IA ban hành kèm theo Nghị định số 123/2020/NĐ-CP (điểm b, khoản 1, điều 7 của Thông tư số 78/2021/TT-BTC)" },
    { id: 4, name: "Hủy hóa đơn để lập hóa đơn thay thế mới", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
    { id: 5, name: "Xóa để lập hóa đơn thay thế mới", show: false, tooltipContent: "Trường hợp hóa đơn điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu (điểm c, khoản 1, điều 7 của Thông tư số 78/2021/TT-BTC)" },
    { id: 6, name: "Hủy hóa đơn để lập hóa đơn điều chỉnh mới", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
  ];
  loaiTiens = [];
  isAllDisplayDataChecked: boolean;
  isIndeterminate: boolean;
  isCheckInput = false;
  isShowTotal = false;
  isPhieuXuatKho = false;
  txtHD_PXK = 'hóa đơn';
  txtHD_PXK_UPPER = 'Hóa đơn';
  isPos = false;
checkPermission = true;
  userNamePermission ='';
  constructor(
    private env: EnvService,
    private router: Router,
    private nzContextMenuService: NzContextMenuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private uploadFileService: UploadFileService,
    private loaiTienService: LoaiTienService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK = 'PXK';
      this.txtHD_PXK_UPPER = 'PXK';

      this.trangThaiXoaBos.forEach((item: any) => {
        item.ten = item.ten.replace("Hóa đơn", 'PXK');
      });
    }
    else if(_url.includes('hoa-don-tu-mtt')){
      this.isPos = true;
    }


    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (!phanQuyen) {
      phanQuyen = localStorage.getItem('KTBKUserPermission');
      this.ngOnInit();
    }
    else {
      if (phanQuyen == 'true') {
        this.permission = true;
        this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
          this.mauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
          this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
          this.scrollConfig.x = SumwidthConfig(this.widthConfig);
          this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';

          this.forkJoin().subscribe((res: any[]) => {
            this.loadViewConditionList();
            this.listDSRutGonBoKyHieuHoaDon = res[1];
          });
        });
        //khi click ở bảng điều khiển
        this.activatedRoute.queryParams.subscribe(params => {
          const tabIndex = params['hdxb'];
          console.log(tabIndex);
          if (tabIndex) {
            this.ShowListHoaDonXoaBo();
          }
        });
      }
      else {
        var pq = JSON.parse(phanQuyen);
        this.thaoTacs = this.isPhieuXuatKho? pq.functions.find(x => x.functionName == "PhieuXuatKho").thaoTacs:pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
        if(this.thaoTacs && this.isPhieuXuatKho?(this.thaoTacs.indexOf('PXK_CRASH') < 0):(this.thaoTacs.indexOf('HD_CRASH') < 0 )) {
          this.checkPermission=false;
          this.userService.getAdminUser().subscribe((users: any[])=>{
          if (users && users.length > 0) {
            let textUserName = '';
            let stt = 0;
            users.forEach(item => {
              stt++;
              let uName = item.fullName ? item.fullName : item.userName;
              if (textUserName == '') {
                textUserName = uName;
              } else {
                if (users.length == 2) {
                  textUserName += ' và ' + uName;
                } else {
                  if (stt == users.length) {
                    textUserName += ' và ' + uName;
                  } else {
                    textUserName += ', ' + uName;
                  }
                }
              }
            });
            this.userNamePermission = textUserName;
          }
          });
          return;
        }

        this.thaoTacHoaDonSaiSot = pq.functions.find(x=>x.functionName == "ThongDiepGui") ? pq.functions.find(x=>x.functionName == 'ThongDiepGui').thaoTacs : [];
        this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
        this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
        this.scrollConfig.x = SumwidthConfig(this.widthConfig);
        this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';

        this.forkJoin().subscribe((res: any[]) => {
          this.loadViewConditionList();
          this.listDSRutGonBoKyHieuHoaDon = res[1];
        });
      }
    }
    window.addEventListener('scroll', this.scrollEvent, true);

  }
  scrollEvent = (event: any): void => {
    let menuRightclick = document.getElementById('menu-rightclick');
    if (menuRightclick != null) this.nzContextMenuService.close();
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  clickRow(data: any, callback: () => any = null) {
    if (data.trangThaiGuiHoaDon <= 2) return;
    if (data.trangThaiBienBanXoaBo != 0) {
      this.XemBienBan(data);
    }
    else {
      this.LapBienBanHuyHoaDon(data, callback);
    }

    this.getData();
  }

  getData() {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
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

    this.LoadData();
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }

  sort(sort: { key: string; value: string }): void {
    this.displayData.SortKey = sort.key;
    this.displayData.SortValue = sort.value;
    this.LoadData();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.hoaDonDienTuId]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.hoaDonDienTuId]) && !this.isAllDisplayDataChecked;

    this.dataSelected = null;
    this.listPaging.forEach((item: any) => {
      item.selected = false;
    });

    let entries = Object.entries(this.mapOfCheckedId);
    for (const [prop, val] of entries) {
      const item = this.listOfDisplayData.find(x => x.hoaDonDienTuId === prop);
      const selectedIndex = this.listOfSelected.findIndex(x => x.hoaDonDienTuId === prop);
      const index = this.listPaging.findIndex(x => x.hoaDonDienTuId === prop);

      if (val) {
        if (selectedIndex === -1) {
          this.listOfSelected.push(item);
        }
      } else {
        if (selectedIndex !== -1) {
          this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== prop);
        }
      }

      if (index !== -1) {
        this.listPaging[index].selected = val;
      }
    }
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.hoaDonDienTuId] = value));
    this.refreshStatus();
  }


  forkJoin() {
    return forkJoin([
      this.loaiTienService.GetAll(this.displayData),
      this.hoaDonDienTuService.GetDSRutGonBoKyHieuHoaDon()
    ]);
  }

  changeKy(event: any) {
    SetDate(event, this.displayDataTemp);
  }

  filterTable() {
    if (this.displayDataTemp.toDate < this.displayDataTemp.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    this.getData();
  }

  GetStatusThayTheHoaDon(hoaDonId) {
    this.hoaDonDienTuService.GetStatusThayTheHoaDon(hoaDonId).subscribe((rs: boolean) => {
      return rs;
    })
  }

  LoadData(reset: boolean = false) {
    if (reset) {
      this.displayData.PageNumber = 1;
    }
    this.loading = true;
    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    this.displayData.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;
    //Lấy tổng số lượng hóa đơn xóa bỏ chưa lập thay thế
    this.hoaDonDienTuService.GetDSXoaBoChuaLapThayThe(this.displayData.LoaiNghiepVu).subscribe((data: any) => {
      data = data.filter(x => this.mauHoaDonDuocPQ.indexOf(x.boKyHieuHoaDonId) >= 0);
      var centers1 = data.filter(element => {
        return element.trangThai == 2 && element.daLapHoaDonThayThe == false && (element.isNotCreateThayThe == false);
      })
      var centers2 = data.filter(element => {
        return element.trangThai == 2 && element.daLapHoaDonThayThe == false && (element.hinhThucXoabo == 2 || element.hinhThucXoabo == 5);
      })
      this.SoHoaDonChuaLapThayThe = centers1.length + centers2.length;
    });
    //lấy tổng hóa đơn chưa xóa bỏ
    this.hoaDonDienTuService.GetHoaDonDaLapBbChuaXoaBo(this.displayData.LoaiNghiepVu).subscribe((data: any) => {
      data = data.filter(x => this.mauHoaDonDuocPQ.indexOf(x.boKyHieuHoaDonId) >= 0);
      this.SoHoaDonChuaXoaBo = data.length;
    });
    this.hoaDonDienTuService.GetDSHdDaXoaBo(this.displayData).subscribe((data: any) => {
      if (this.SoHoaDonChuaLapThayThe > 0 || this.SoHoaDonChuaXoaBo > 0) this.isShowTotal = true;
      this.listPaging = data;
      this.listPaging.forEach(x => {
        this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(x.hoaDonDienTuId).subscribe((rs: any) => {
          if (rs && rs.soBienBan != null)
            x.soBienBanXoaBo = rs.soBienBan;
        });
        //cài đặt giá trị ủy nhiệm lập hóa đơn
        if (x.mauSo == null) x.mauSo = '';
        if (x.kyHieu == null) x.kyHieu = '';
        let boKyHieuHD = this.listDSRutGonBoKyHieuHoaDon.find(y => y.kyHieu.toLowerCase() == (x.mauSo + x.kyHieu).toLowerCase());
        if (boKyHieuHD != null) {
          if (boKyHieuHD.uyNhiemLapHoaDon == 0) {
            x.uyNhiemLapHoaDon = 0;
          }
          if (boKyHieuHD.uyNhiemLapHoaDon == 1) {
            x.uyNhiemLapHoaDon = 1;
          }
        }
      })
      this.total = data.length;
      this.numberBangKeCols = Array(23).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listPaging);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet2() + 'px';
      if (this.listPaging && this.listPaging.length > 0) {
        this.selectedRow(this.listPaging[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listPaging, "hoaDonDienTuId").then((result) => {
        this.selectedRow(result);
      });
      this.loading = false;
      //nếu có đăng ký sự kiện tải lại thống kê số lượng hóa đơn sai sót
      if (GlobalConstants.CallBack != null) {
        GlobalConstants.CallBack();
      }
    }, _ => {
      this.loading = false;
    });
  }

  showDinhKem(files: any, hoaDonId: any) {
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Tài liệu đính kèm",
      nzContent: TepDinhKemModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 30,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        fileDinhKem: files,
        hoaDonId: hoaDonId,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      this.LoadData();
    });
  }
  selectedRow(data: any) {
    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      console.log(this.dataSelected)
      data.selected = true;
      this.listPaging.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }

    this.dataSelected = data;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listPaging);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
  }

  GetSoBienBanXoaBo(data: any) {
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
      return rs.soBienBan;
    });
  }

  LapBienBanHuyHoaDon(data: any = null, callback: () => any = null) {
    if (data.trangThaiBienBanXoaBo != 0 || data.trangThaiGuiHoaDon <= 2) return;
    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
      if (data == null) data = this.dataSelected;
    }

    if (data == null) {
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: "Lập biên bản hủy hóa đơn",
        nzContent: LapBienBanXoaBoHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: "100%",
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          data: data,
          isAddNew: true,
          isEdit: true,
          isShowFromBangKeXoaBo: true,
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          this.filterGeneral();
        }
      });
    }
    else {
      this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
        if (rs == null) {
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: "Lập biên bản hủy hóa đơn",
            nzContent: LapBienBanXoaBoHoaDonModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: data,
              isAddNew: true,
              isEdit: true,
              isShowFromBangKeXoaBo: true,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.LoadData();
              if (callback != null) {
                callback();
              }
            }
          });
        }
        else {
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: "Lập biên bản hủy hóa đơn",
            nzContent: LapBienBanXoaBoHoaDonModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '100%',
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: data,
              formData: rs,
              isAddNew: false,
              isShowFromBangKeXoaBo: true,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.LoadData();
              if (callback != null) {
                callback();
              }
            }
          });
        }
      })
    }
  }

  XemBienBan(data) {
    console.log(data);
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: "Biên bản hủy hóa đơn",
        nzContent: LapBienBanXoaBoHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: "100%",
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          data: data,
          formData: rs,
          isAddNew: false,
          isEdit: false,
          isShowFromBangKeXoaBo: true
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          this.LoadData();
        }
      });
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedRow(data);
  }

  SuaBienBan(data, callback: () => any = null) {
    if (data.trangThaiBienBanXoaBo == 0) return;
    if (data.trangThaiBienBanXoaBo == 2) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '35%',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Sửa biên bản hủy hóa đơn",
          msContent: `Biên bản hủy hóa đơn này đã được ký điện tử, nếu bạn thực hiện sửa thì chữ ký sẽ bị xóa và bạn cần ký lại. Bạn có muốn tiếp tục thực hiện không?`,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
              if (rs) {
                rs.ngayKyBenA = null;
                rs.hoaDonDienTu = null;
                this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((rsHD: any) => {
                  if (rsHD) {
                    rsHD.trangThaiBienBanXoaBo = 1;
                    const modal1 = this.ActivedModal = this.modalService.create({
                      nzTitle: "Sửa biên bản hủy hóa đơn",
                      nzContent: LapBienBanXoaBoHoaDonModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzWidth: "100%",
                      nzStyle: { top: '0px' },
                      nzBodyStyle: { padding: '1px' },
                      nzComponentParams: {
                        data: rsHD,
                        formData: rs,
                        isAddNew: true,
                        isEdit: true,
                        fbEnableEdit: true,
                        isShowFromBangKeXoaBo: true
                      },
                      nzFooter: null
                    });
                    modal1.afterClose.subscribe((rs: any) => {
                      this.ActivedModal = null;
                      if (rs) {
                        this.LoadData();
                        if (callback != null) {
                          callback();
                        }
                      }
                    });
                  }
                });
              }
            })
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else if (data.trangThaiBienBanXoaBo == 3 || data.trangThaiBienBanXoaBo == 4) {
      let noidung = data.trangThaiBienBanXoaBo == 3 ? 'Biên bản hủy hóa đơn đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện sửa thì biên bản hủy hóa đơn sẽ bị xóa và người mua sẽ không ký được biên bản hủy hóa đơn đã gửi trước đó. Hệ thống sẽ nhân bản biên bản hủy hóa đơn này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?' : 'Biên bản hủy hóa đơn đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện sửa thì biên bản hủy hóa đơn sẽ bị xóa và người mua sẽ không xem được biên bản hủy hóa đơn đã gửi trước đó. Hệ thống sẽ nhân bản biên bản hủy hóa đơn này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?';

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '35%',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Sửa biên bản hủy hóa đơn",
          msContent: noidung,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
              if (rs) {
                rs.ngayKyBenA = null;
                rs.ngayKyBenB = null;
                rs.hoaDonDienTu = null;
                data.trangThaiBienBanXoaBo = 0;

                const modal1 = this.ActivedModal = this.modalService.create({
                  nzTitle: "Sửa biên bản hủy hóa đơn",
                  nzContent: LapBienBanXoaBoHoaDonModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: "100%",
                  nzStyle: { top: '0px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    data: data,
                    isAddNew: true,
                    isEdit: true,
                    isDeleteBB: true,
                    bbIdDetele: rs.id,
                    isShowFromBangKeXoaBo: true
                  },
                  nzFooter: null
                });
                modal1.afterClose.subscribe((rs: any) => {
                  this.ActivedModal = null;
                  if (rs) {
                    this.LoadData();
                    if (callback != null) {
                      callback();
                    }
                  }
                });

              }
            });
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else {
      this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {

        if (data.thongTinHoaDonId != null) {
          data.hoaDonDienTuId = null;//tránh ko bị conflict khóa ngoại
        }
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Sửa biên bản hủy hóa đơn",
          nzContent: LapBienBanXoaBoHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: "100%",
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: data,
            formData: rs,
            isAddNew: true,
            isEdit: true,
            fbEnableEdit: true,
            isShowFromBangKeXoaBo: true,
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.LoadData();
            if (callback != null) {
              callback();
            }
          }
        });
      });
    }

  }
  ShowListHoaDonXoaBo(callback: () => any = null) {
    const modalListHoaDonXoaBo = this.ActivedModal = this.modalService.create({
      nzTitle: "Chọn hóa đơn bị xóa bỏ",
      nzContent: ListHoaDonXoaBoModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: null
    });
    modalListHoaDonXoaBo.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.LoadData();
      }
      if (callback != null) {
        callback();
        this.LoadData();
      }
    });
  }
  ShowListLBB() {
    const modalListHoaDonXoaBo = this.ActivedModal = this.modalService.create({
      nzTitle: "Chọn hóa đơn lập biên bản hủy hóa đơn",
      nzContent: ListLapBienBanHuyHoaDonComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: null
    });
    modalListHoaDonXoaBo.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.LoadData();
      }
    });
  }

  XoaBoHoaDon(data: any = null, isView = false) {
    console.log(data);
    if (data == null && !this.dataSelected && this.listOfSelected.length === 0) {
      this.message.error(TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_DELETE);
      return;
    }

    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
    }

    if (data == null) data = this.dataSelected;

    if (data && data.trangThai == 2 && isView == false) {
      isView = true;
    }

    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Xóa bỏ hóa đơn",
      nzContent: XoaBoHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 45,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: !isView,
        data: data,
        isCheckViewFromBB: false
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.LoadData();
      }
    });
  }

  XoaBienBanHuyHD(data: any, callback: () => any = null) {
    if (data.trangThaiBienBanXoaBo == 0) return;

    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((res: any) => {
      if (res) {
        var tb = '';
        if (data.trangThaiBienBanXoaBo <= 2) {
          tb = 'Bạn có chắc chắn muốn xóa không?'
        }
        else if (data.trangThaiBienBanXoaBo == 3) {
          tb = "Biên bản hủy hóa đơn đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không ký được biên bản hủy hóa đơn đã gửi trước đó. Bạn có muốn tiếp tục xóa không?"
        }
        else {
          tb = "Biên bản hủy hóa đơn đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không xem được biên bản hủy hóa đơn đã gửi trước đó. Bạn có muốn tiếp tục xóa không?"
        }
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '400px',
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Xóa biên bản hủy hóa đơn",
            msContent: tb,
            msMessageType: MessageType.ConfirmBeforeSubmit,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOnOk: () => {
              this.hoaDonDienTuService.DeleteBienBanXoaHoaDon(res.id).subscribe((rs: boolean) => {
                if (rs) {
                  this.nhatKyTruyCapService.Insert({
                    loaiHanhDong: LoaiHanhDong.Xoa,
                    refType: RefType.BienBanXoaBo,
                    thamChieu: `Số hóa đơn ${res.hoaDonDienTu.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(res.hoaDonDienTu.ngayHoaDon).format('DD/MM/YYYY')}`,
                    refId: data.hoaDonDienTuId
                  }).subscribe();

                  // Không xóa file
                  //xóa file
                  // data.taiLieuDinhKems.forEach(element => {
                  //   this.uploadFileService.DeleteFileAttach({
                  //     nghiepVuId: data.hoaDonDienTuId,
                  //     loaiNghiepVu: RefType.HoaDonXoaBo,
                  //     tenGoc: element.tenGoc,
                  //     tenGuid: element.tenGuid,
                  //     taiLieuDinhKemId: element.taiLieuDinhKemId
                  //   }).subscribe();
                  // });
                  // this.message.success("Xóa biên bản thành công");
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzWidth: '400px',
                    nzComponentParams: {
                      msMessageType: MessageType.Info,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: 'Xóa biên bản hủy hóa đơn',
                      msContent: `Xóa biên bản hủy hóa đơn thành công!`,
                    },
                    nzFooter: null
                  });
                  this.filterDefault();
                  if (callback != null) {
                    callback();
                  }
                }
                else {
                  this.message.error("Lỗi khi xóa");
                }
              })
            },
            msOnClose: () => {
              return;
            }
          }
        });
      }
    });
  }

  GuiBienBanHuyHD(data: any, callback: () => any = null) {
    console.log(data);
    if (data.trangThaiBienBanXoaBo != 2 && data.trangThaiBienBanXoaBo != 3) return;
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((res: any) => {
      if (res) {
        res.thongTinHoaDonId = data.thongTinHoaDonId;
        const modal1 = this.modalService.create({
          nzTitle: `Gửi biên bản hủy ${this.txtHD_PXK}`,
          nzContent: GuiHoaDonXoaBoModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 45,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: !this.dataSelected ? data : this.dataSelected,
            loaiEmail: LoaiEmail.ThongBaoBienBanHuyBoHoaDon
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs == true) {
            this.message.success(`Gửi biên bản hủy ${this.txtHD_PXK} thành công!`);
            this.LoadData();
          }
          else if (rs == false) {
            this.message.error(`Lỗi gửi biên bản hủy ${this.txtHD_PXK}`);
          }
        });
      }
    });
  }

  filterGeneral() {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0) {
      if (this.displayData.GiaTri == "" || this.displayData.GiaTri == undefined) {
        this.isCheckInput = true;
        return;
      } else {
        this.isCheckInput = false;
      }
    } else {
      this.isCheckInput = false;
    }

    this.filterGeneralVisible = false;
    this.displayData = this.displayDataTemp;
    this.loadViewConditionList();
  }

  filterDefault() {

    this.isCheckInput = false;
    this.filterGeneralVisible = false;
    this.displayDataTemp = Object.assign({}, this.displayDataRaw);
    this.displayData = Object.assign({}, this.displayDataRaw);

    this.loadViewConditionList();
  }
  filterGeneralByOneClick(type: any) {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0) {
      if (this.displayData.GiaTri == "" || this.displayData.GiaTri == undefined) {
        this.isCheckInput = true;
        return;
      } else {
        this.isCheckInput = false;
      }
    } else {
      this.isCheckInput = false;
    }

    this.filterGeneralVisible = false;


    this.displayData = this.displayDataTemp;
    if (type === 1) { this.displayData.TrangThaiXoaBo = 2; }
    if (type === 2) { this.displayData.TrangThaiXoaBo = 3; }
    //set kỳ
    var myDate = new Date();
    var previousYear = new Date(myDate);
    previousYear.setFullYear(myDate.getFullYear() - 1);
    this.displayData.Ky = 0;
    this.displayData.fromDate = moment(previousYear).startOf('year').format('YYYY-MM-DD');
    this.displayData.toDate = moment().endOf('month').format('YYYY-MM-DD');
    this.loadViewConditionList();
  }
  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Ngày xóa bỏ: ', value: GetTenKy(this.displayData.Ky) });
    if (this.displayData.TrangThaiBienBanXoaBo !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiBienBanXoaBo', label: 'Trạng thái biên bản hóa đơn: ', value: this.trangThaiBienBanXoaBos.find(x => x.id === this.displayData.TrangThaiBienBanXoaBo).ten });
    }
    if (this.displayData.TrangThaiXoaBo !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiXoaBo', label: 'Trạng thái hóa đơn: ', value: this.trangThaiXoaBos.find(x => x.id === this.displayData.TrangThaiXoaBo).ten });
    }

    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.displayData.filterColumns.forEach((item: FilterColumn) => {
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
    switch (filter.key) {
      case 'TrangThaiBienBanXoaBo':
        this.displayDataTemp.TrangThaiBienBanXoaBo = -1;
        break;
      case 'TrangThaiXoaBo':
        this.displayDataTemp.TrangThaiXoaBo = -1;
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

  GuiThongBaoXoaBoHoaDon(data: any) {
    if (data.trangThai != 2 || data.trangThaiGuiHoaDon <= 2) return;
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      this.message.error(TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_DELETE);
      return;
    }
    if (data == null) data = this.dataSelected;
    if (this.ActivedModal != null) return;

    if (data != null) {
      if (this.ActivedModal != null) return;
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: `Gửi thông báo xóa bỏ ${this.txtHD_PXK}`,
        nzContent: GuiHoaDonXoaBoModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: window.innerWidth / 100 * 45,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          data: data,
          loaiEmail: this.isPhieuXuatKho ? LoaiEmail.ThongBaoXoaBoPXK : LoaiEmail.ThongBaoXoaBoHoaDon
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        console.log(rs);
        if (rs != null) {
          if (rs) {
            this.message.success(`Gửi thông báo xóa bỏ ${this.txtHD_PXK} thành công`)
            this.LoadData();
          }
          else {
            this.message.error(`Có lỗi xảy ra khi gửi thông báo xóa bỏ ${this.txtHD_PXK}`)
            this.LoadData();
          }
        }
      });
    }
  }
  view(data: any) {
    if (data != null) {
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.message.remove(id);
        }, (err) => {
          this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
          this.message.remove(id);
        });
      }, (err) => {
        console.log(err);
        this.message.warning(`Lỗi khi xem ${this.txtHD_PXK}`);
        this.message.remove(id);
      })
    }
  }

  clickThem() {
    throw new Error('Method not implemented.');
  }
  clickXem() {
    throw new Error('Method not implemented.');
  }
  clickSua(isCopy: any) {
    throw new Error('Method not implemented.');
  }
  clickXoa() {
    throw new Error('Method not implemented.');
  }

  //kiểm tra lập thông báo sai sót
  kiemTraLapThongBaoSaiSot(data: any) {
    //Ghi chú: nếu data.thongBaoSaiSot.hoaDonDienTuId != null hoặc data.thongBaoSaiSot.thongDiepGuiCQTId thì là trường hợp của hóa đơn điều chỉnh
    //và khi đó data.thongBaoSaiSot.hoaDonDienTuId là id của hóa đơn bị điều chỉnh,
    //và data.thongBaoSaiSot.thongDiepGuiCQTId là giá trị thongDiepGuiCQTId của dòng hóa đơn bị điều chỉnh

    let modalThongBaoSaiSot = null;
    if (data.thongBaoSaiSot.trangThaiLapVaGuiThongBao == -2) {
      //chưa lập thì mở thêm 04
      if(this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0){
        this.userService.getAdminUser().subscribe((rs: any[])=>{
          let content = '';
          if(rs && rs.length > 0){
            content = `
            Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else{
            content = `
            Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
              msTitle: 'Phân quyền người dùng',
              msContent: content,
              msOnClose: ()=>{
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else modalThongBaoSaiSot = this.modalService.create({
        nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
        nzContent: ThongBaoHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          loaiThongBao: 1,
          lapTuHoaDonDienTuId: (data.thongBaoSaiSot.hoaDonDienTuId != null) ? data.thongBaoSaiSot.hoaDonDienTuId : data.hoaDonDienTuId,
          callBackAfterClosing: this.LoadData,
          hoaDonDienTuIdLienQuan: (data.thongBaoSaiSot.isHoaDonDieuChinh == true) ? data.hoaDonDienTuId : ((data.thongBaoSaiSot.isCoGuiEmailSaiThongTin == true) ? 'KhongLapLaiHoaDon' : null)
        },
        nzFooter: null
      });
    }
    else if (data.thongBaoSaiSot.trangThaiLapVaGuiThongBao == -1) {
      //-1 chưa gửi (sẽ có nút ký gửi)
      //còn lại là xem thông điệp
      if(this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0){
        this.userService.getAdminUser().subscribe((rs: any[])=>{
          let content = '';
          if(rs && rs.length > 0){
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else{
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
              msTitle: 'Phân quyền người dùng',
              msContent: content,
              msOnClose: ()=>{
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else modalThongBaoSaiSot = this.modalService.create({
        nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
        nzContent: ThongBaoHoaDonSaiSotModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          isView: true,
          daKyVaGuiCQT: false,
          thongDiepGuiCQTId: (data.thongBaoSaiSot.thongDiepGuiCQTId != null) ? data.thongBaoSaiSot.thongDiepGuiCQTId : data.thongDiepGuiCQTId
        },
        nzFooter: null
      });
    }
    else {
      //còn lại là xem thông điệp
      if(this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0){
        this.userService.getAdminUser().subscribe((rs: any[])=>{
          let content = '';
          if(rs && rs.length > 0){
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else{
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
              msTitle: 'Phân quyền người dùng',
              msContent: content,
              msOnClose: ()=>{
                return;
              }
            },
            nzFooter: null
          });
        });
      }
      else modalThongBaoSaiSot = this.modalService.create({
        nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
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
          thongDiepGuiCQTId: (data.thongBaoSaiSot.thongDiepGuiCQTId != null) ? data.thongBaoSaiSot.thongDiepGuiCQTId : data.thongDiepGuiCQTId
        },
        nzFooter: null
      });
    }

    if (modalThongBaoSaiSot != null) {
      modalThongBaoSaiSot.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.LoadData();
        }
      });
    }
  }
}
