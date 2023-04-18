import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { LyDoThayThe } from 'src/app/models/LyDoThayTheModel';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { FilterColumn, FilterCondition, HoaDonThayTheParams } from 'src/app/models/PagingParams';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { GetKy, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig, GlobalConstants } from 'src/app/shared/global';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { getHeightBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3, getLoaiLoaiHoaByMoTa, getTenLoaiHoaDon, getTimKiemTheo, getTrangThaiQuyTrinhs, kiemTraHoaDonHopLeTheoKyKeKhai, showModalPreviewPDF, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { LapHoaDonThayTheModalComponent } from 'src/app/views/hoa-don-dien-tu/modals/lap-hoa-don-thay-the-modal/lap-hoa-don-thay-the-modal.component';
import { HoaDonDienTuModalComponent } from '../../modals/hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { TabHoaDonDienTuComponent } from '../tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { TabHoaDonXoaBoComponent } from '../tab-hoa-don-xoa-bo/tab-hoa-don-xoa-bo.component';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { DinhKemHoaDonModalComponent } from '../../modals/dinh-kem-hoa-don-modal/dinh-kem-hoa-don-modal.component';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { ThongDiepGuiDuLieuHddtModalComponent } from '../../modals/thong-diep-gui-du-lieu-hddt-modal/thong-diep-gui-du-lieu-hddt-modal.component';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { CookieConstant } from 'src/app/constants/constant';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { XemLoiHoaDonModalComponent } from '../../modals/xem-loi-hoa-don-modal/xem-loi-hoa-don-modal.component';
import { TabThongDiepGuiComponent } from 'src/app/views/quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { TrangThaiSuDung2 } from 'src/app/enums/TrangThaiSuDung.enum';
import { UserService } from 'src/app/services/user.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

export interface TreeNodeInterface {
  key: number;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  selected?: boolean;
}

@Component({
  selector: 'app-tab-hoa-don-thay-the',
  templateUrl: './tab-hoa-don-thay-the.component.html',
  styleUrls: ['./tab-hoa-don-thay-the.component.scss']
})
export class TabHoaDonThayTheComponent extends TabShortKeyEventHandler implements OnInit, OnDestroy {
  listData = [];
  trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true);
  trangThaiGuiHoaDons = [];
  timKiemTheos = getTimKiemTheo();
  searchOverlayStyle = {
    width: '400px'
  };
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: HoaDonThayTheParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    Filter: {},
    Ky: 5,
    LoaiTrangThaiGuiHoaDon: -1,
    TrangThaiQuyTrinh: -1,
    TimKiemTheo: null,
    GiaTri: null,
    filterColumns: [],
    TimKiemBatKy: null,
    MauHoaDonDuocPQ: []
  };
  displayDataTemp: any;
  displayDataRaw: any;
  dataSelected = null;
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  kys: any[] = GetList();
  widthConfig = ['350px', '280px', '210px', '110px', '120px', '210px', '170px', '80px', '120px', '140px', '450px', '150px', '100px', '380px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  sub: Subscription;
  tongTienThanhToan = 0;
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  ddtp = new DinhDangThapPhan();
  textButtonMoRongThuGon = 'Thu gọn';
  loaiThongDiep = MLTDiep;
  trangThaiQuyTrinh = TrangThaiQuyTrinh;
  mauHoaDonDuocPQ: any;
  isShowGuiCQT = false;
  isChuyenDayDuNoiDungTungHoaDon = false;
  disabledGuiCQT = false;
  isPhieuXuatKho = false;
  txtHD_PXK = 'hóa đơn';
  txtHD_PXK_UPPER = 'Hóa đơn';
  thaoTacHoaDonSaiSot: any[]=[];
  hoSoHDDT: any;
  serials: any[]=[];
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = false;
  isPos = false;
  checkPermission = true;
  userNamePermission ='';
  boolChoPhepXacNhanHDDaGuiKhachHang = false;
  isTaxCodeNotAddMtt: boolean = false;
  taxcodeLogin = localStorage.getItem(CookieConstant.TAXCODE);
  boolChoPhepLapHDDTMTT = false;
  constructor(
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private message: NzMessageService,
    private sharedService: SharedService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private tabHoaDonXoaBoComponent: TabHoaDonXoaBoComponent,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private env: EnvService,
    private userService: UserService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private activatedRoute: ActivatedRoute,
    private hoSoHDDTService: HoSoHDDTService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private tuyChonService: TuyChonService
  ) {
    super();
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK = 'PXK';
      this.txtHD_PXK_UPPER = 'PXK';
    }
    else if(_url.includes('hoa-don-tu-mtt')){
      this.isPos = true;
    this.isTaxCodeNotAddMtt = this.env.taxCodeNotAddMtt.includes(this.taxcodeLogin);
  }

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.mauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
        this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
        this.setDefaulThoiGian();

        this.sub = this.sharedService.changeEmitted$
          .subscribe((res: any) => {
            if (res && res.type === 'loadData' && res.value) {
              this.loadData();
            }
          });

        this.displayDataTemp = Object.assign({}, this.params)
        this.displayDataRaw = Object.assign({}, this.params)

        this.forkJoin().subscribe((res: any[]) => {
          this.trangThaiGuiHoaDons = res[0];
          this.hoSoHDDT = res[3];
          this.serials = res[4];
          this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = res[5].find(x=>x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail") ? res[5].find(x=>x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail").giaTri == "true" : false;
          this.boolChoPhepXacNhanHDDaGuiKhachHang = res[5].find(x => x.ma == "BoolChoPhepXacNhanHDDaGuiKhachHang") ? res[5].find(x => x.ma == "BoolChoPhepXacNhanHDDaGuiKhachHang").giaTri == "true" : false;
          this.boolChoPhepLapHDDTMTT = res[5].find(x => x.ma == "BoolChoPhepLapHDDTMTT") ? res[5].find(x => x.ma == "BoolChoPhepLapHDDTMTT").giaTri == "true" : false;

          this.displayGuiCQT(res);
        });

        this.loadViewConditionList();
      });
      //khi click ở bảng điều khiển
      this.activatedRoute.queryParams.subscribe(params => {
        const tabIndex = params['hdtt'];
        console.log(tabIndex);
        if (tabIndex) {
          this.clickThem();
        }
      })
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = this.isPhieuXuatKho? pq.functions.find(x => x.functionName == "PhieuXuatKho").thaoTacs:pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
      this.thaoTacHoaDonSaiSot = pq.functions.find(x=>x.functionName == "ThongDiepGui") ? pq.functions.find(x=>x.functionName == 'ThongDiepGui').thaoTacs : [];
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
      this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
      if(this.thaoTacs && this.isPhieuXuatKho?(this.thaoTacs.indexOf('PXK_REPLACE') < 0):(this.thaoTacs.indexOf('HD_REPLACE') < 0)) {
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
      this.setDefaulThoiGian();

      this.sub = this.sharedService.changeEmitted$
        .subscribe((res: any) => {
          if (res && res.type === 'loadData' && res.value) {
            this.loadData();
          }
        });

      this.displayDataTemp = Object.assign({}, this.params)
      this.displayDataRaw = Object.assign({}, this.params)

      this.forkJoin().subscribe((res: any[]) => {
        this.trangThaiGuiHoaDons = res[0];
        this.hoSoHDDT = res[3];
        this.serials = res[4];

        this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = res[5].find(x=>x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail") ? res[5].find(x=>x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail").giaTri == "true" : false;

        this.displayGuiCQT(res);
      });

      this.loadViewConditionList();
    }
    window.addEventListener('scroll', this.scrollEvent, true);
  }
  scrollEvent = (event: any): void => {
    let menuRightclick = document.getElementById('menu-rightclick');
    if (menuRightclick != null) this.nzContextMenuService.close();
  }
  displayGuiCQT(res: any[]) {
    // Tại tab Thông tin hóa đơn, bảng thông tin hình thức hóa đơn mà cột Trạng thái sử dụng của dòng Không có mã của cơ quan thuế có giá trị là <Đang sử dụng> và <Ngừng sử dụng>
    // Và tại tờ khai mẫu 01 đang được chấp nhận thì tại mục Phương thức chuyển dữ liệu hóa đơn điện tử có tích chọn <Chuyển đầy đủ nội dung từng hóa đơn>
    if ((res[1] && res[1].hinhThucHoaDon === 0 && res[1].isChuyenDayDuNoiDungTungHoaDon) && (res[2] && (res[2].trangThaiSuDung === TrangThaiSuDung2.DangSuDung || res[2].trangThaiSuDung === TrangThaiSuDung2.NgungSuDung))) {
      this.isChuyenDayDuNoiDungTungHoaDon = true;
      this.isShowGuiCQT = true;
    }
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedRow(data);
  }

  forkJoin() {
    return forkJoin([
      this.hoaDonDienTuService.GetTrangThaiGuiHoaDon(),
      this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat(), // get thông tin tờ khai mới nhất
      this.quanLyThongTinHoaDonService.GetByLoaiThongTinChiTiet(2), // không mã
      this.hoSoHDDTService.GetDetail(),
      this.quyDinhKyThuatService.GetAllListCTS(),
      this.tuyChonService.GetAll()
    ]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listData);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
  }

  loadData(reset = false) {
    let dataToFind = this.getDataToFind();
    this.params.GiaTri = dataToFind.GiaTri;
    this.params.TimKiemTheo = dataToFind.TimKiemTheo;
    this.params.TimKiemBatKy = dataToFind.TimKiemBatKy;
    this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    this.params.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;

    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.hoaDonDienTuService.GetAllPagingHoaDonThayThe(this.params).subscribe((data: any) => {
      //reset widthconfig khi chưa có hóa đơn thay thế bị xóa bỏ
      // this.widthConfig = ['250px', '250px', '110px', '150px', '210px', '210px', '80px', '190px', '120px', '250px','150px', '450px', '150px', '120px', '380px'];
      this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
      console.log(data.items);
      this.listData = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;
      this.loading = false;
      this.listData.forEach(item => {
        const listChildren = this.convertTreeToList(item);
        listChildren.forEach((child: any) => {
          if (this.txtHD_PXK == 'PXK') child.tenTrangThaiHoaDon = child.tenTrangThaiHoaDon.replace("Hóa đơn", 'PXK');
        });
        this.mapOfExpandedData[item.key] = listChildren;

        if (this.txtHD_PXK == 'PXK') item.tenTrangThaiHoaDon = item.tenTrangThaiHoaDon.replace("Hóa đơn", 'PXK');

        //kiểm tra xem có hóa đơn thay thế bị xóa bỏ ko
        if (item.dienGiaiTrangThaiHoaDon == 'Đã hủy theo lý do phát sinh') {
          if (this.widthConfig[0] != '250px') {
            // this.widthConfig = ['290px', '300px', '110px', '150px', '210px', '210px', '80px', '190px', '120px', '250px', '150px', '450px', '150px', '120px', '380px'];
            this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
          }
        }
      });

      // delete all
      if (this.listData.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.loadData();
      }

      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listData);
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
      if (this.listData && this.listData.length > 0) {
        this.selectedRow(this.listData[0]);
      }

      //nếu có đăng ký sự kiện tải lại thống kê số lượng hóa đơn sai sót
      if (GlobalConstants.CallBack != null) {
        GlobalConstants.CallBack();
      }
    });
  }

  clickThem() {
    this.tabHoaDonDienTuComponent.isPhieuXuatKho = this.isPhieuXuatKho;
    this.tabHoaDonDienTuComponent.LapHoaDonThayTheCallback(() => {
      this.loadData();
    });
  }

  clickSua(isCopy = false, isView = false) {
    ////
  }

  selectForm(isCopy = false, isView = false, data: any) {
    console.log('selectForm');
    console.log(data);
    // if (data.hoaDonNgoaiHeThong == true) {
    //   return;
    // }
    if (data.trangThai === 3 && data.hinhThucXoabo == null) {
      if (isView && data.soHoaDon && !((data.maCuaCQT == '' || data.maCuaCQT == '<Chưa cấp mã>') && data.trangThaiQuyTrinh == TrangThaiQuyTrinh.GuiTCTNLoi)) {
        //mở ra giao diện xem hóa đơn
        this.tabHoaDonDienTuComponent.viewReceipt(data);
      }
      else {
        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
          if (isCopy) {
            res.lyDoThayThe = null;
            res.thayTheChoHoaDonId = null;
            res.trangThai = 1;
            res.maCuaCQT = null;
            res.soHoaDon = null;
            res.idHoaDonSaiSotBiThayThe = null;
            res.ghiChuThayTheSaiSot = null;
            res.isDaLapThongBao04 = null;
            res.lanGui04 = null;
            res.ngayGuiTBaoSaiSotKhongPhaiLapHD = null;
            res.trangThaiGui04 = null;
            res.thongDiepGuiCQTId = null;
            res.createdDate = null;
            res.createdBy = null;
            res.modifyDate = null;
            res.modifyBy = null;
          }
          else {
            if (data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
              data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi && data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh && data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaGuiCQT) {
              //this.message.warning('Bạn không được phép sửa hóa đơn này. Vui lòng kiểm tra lại trạng thái quy trình của nó.');
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
                  msOkButtonInBlueColor: false,
                  msTitle: 'Kiểm tra lại',
                  msContent: `Hệ thống chỉ cho phép thực hiện <strong>Sửa</strong> hóa đơn có trạng thái quy trình là
                  <strong>Chưa ký điện tử</strong>, <strong>Ký điện tử lỗi</strong> hoặc hóa đơn từ máy tính tiền có trạng thái quy trình là <b>Chưa gửi CQT</b>, <b>Chưa phát hành</b>. Vui lòng kiểm tra lại!`,
                  msOnClose: () => {
                  }
                },
                nzFooter: null
              });
              return;
            }
          }

          const title = res.tenLoaiHoaDon;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: title,
            nzContent: HoaDonDienTuModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: window.innerWidth / 100 * 90,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isCopy,
              isAddNew: false,
              data: res,
              loaiHD: res.loaiHoaDon,
              fbEnableEdit: !isView
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.loadData();
            }
          });
        });
      }
    } else {

      let hoaDonThayTheCha = this.listData.find(x => x.thayTheChoHoaDonId == data.hoaDonDienTuId);
      // if (hoaDonThayTheCha != null) {
      //   data.tenKhachHang = hoaDonThayTheCha.tenKhachHang;
      //   data.diaChi = hoaDonThayTheCha.diaChi;
      //   data.maSoThue = hoaDonThayTheCha.maSoThue;
      //   data.soDienThoai = hoaDonThayTheCha.soDienThoaiNguoiMuaHang;
      //   data.hoTenNguoiMuaHang = hoaDonThayTheCha.hoTenNguoiMuaHang;
      //   // data.lyDoXoaBo = '';
      //   data.khachHangId = hoaDonThayTheCha.khachHangId;

      // }
      if (data.hoaDonNgoaiHeThong == true) {
        data.thongTinHoaDonId = data.thongTinHoaDonId == null ? data.hoaDonDienTuId : data.thongTinHoaDonId;
        data.hoaDonDienTuId = data.bienBanXoaBoId == null ? null : data.thongTinHoaDonId;
      }
      else {
        data.thongTinHoaDonId = null;
      }
      data.checkHideBtnXoa = true;
      data.checkHideBtnXemHd = data.hoaDonNgoaiHeThong;

      this.tabHoaDonXoaBoComponent.clickRow(data, () => this.loadData());
    }
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== id);
    delete this.mapOfCheckedId[id];
  }

  async clickXoa() {
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_DELETE);
      return;
    }

    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
    }

    var checkDaPhatSinhThongDiepTN = await this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(this.dataSelected.hoaDonDienTuId);

    if ((this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi && this.dataSelected.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) || checkDaPhatSinhThongDiepTN) {
      if (this.ActivedModal != null) return;
      this.ActivedModal = this.modalService.create({
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
          msOkButtonInBlueColor: false,
          msTitle: 'Kiểm tra lại',
          msContent: `<div>Hệ thống chỉ cho phép thực hiện <b>Xóa</b> hóa đơn khi:</div>
          <div>- Hóa đơn có trạng thái quy trình là <b>Chưa ký điện tử</b>, <b>Ký điện tử lỗi</b>;</div>
          <div>- Hóa đơn từ máy tính tiền có trạng thái quy trình là <b>Chưa phát hành</b>;</div>
          <div>Và hóa đơn chưa phát sinh thông điệp truyền nhận với CQT</div>
          <div>Vui lòng kiểm tra lại!</div>`,
          msOnClose: () => {
          }
        },
        nzFooter: null
      });
      return;
    }

    if (this.dataSelected) {
      if (this.dataSelected.thayTheChoHoaDonId != null) {
        forkJoin([
          this.thongTinHoaDonService.GetById(this.dataSelected.thayTheChoHoaDonId),
          this.thongTinHoaDonService.CheckHoaDonNgoaiHeThongDaLapBienBanHuyHoaDon(this.dataSelected.thayTheChoHoaDonId)
        ]).subscribe((res: any[]) => {
          if (res[0] != null && res[1]) { // là hd ngoài hệ thống và đã lập biên bản huy
            let msContent = 'Bạn đã lập biên bản hủy hóa đơn cho hóa đơn bị thay thế. Tuy nhiên, hóa đơn bị thay thế là hóa đơn không được lập từ hệ thống. Theo đó, khi thực hiện <b>Xóa</b> hóa đơn thay thế thì hệ thống sẽ đồng thời <b>Xóa</b> biên bản hủy hóa đơn đã lập cho hóa đơn bị thay thế. Bạn có thực sự muốn xóa hóa đơn thay thế này không?';
            this.XoaHD(msContent, true, res[0]);
          } else {
            this.XoaHD("Bạn có thực sự muốn xóa hóa đơn này không?", false);
          }
        });
      } else {
        this.XoaHD("Bạn có thực sự muốn xóa hóa đơn này không?", false);
      }
    }
  }
  XoaHD(msContent, hoaDonNgoaiHeThong, item: any = null) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '400px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa hóa đơn",
        msContent: msContent,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          //là hd ngoài hệ thống thì lúc xóa hd thay thế đồng thời xóa cả biên bản đã lập của hd bị thay thế
          if (hoaDonNgoaiHeThong) {
            this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(item.hoaDonDienTuId).subscribe((res: any) => {
              if (res) {
                this.hoaDonDienTuService.DeleteBienBanXoaHoaDon(res.id).subscribe();
              }
            });
          }
          this.hoaDonDienTuService.Delete(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.HoaDonDienTu,
                doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.dataSelected.loaiHoaDon),
                thamChieu: `Số hóa đơn ${this.dataSelected.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: this.dataSelected.hoaDonDienTuId,
              }).subscribe();

              this.deleteCheckedItem(this.dataSelected.hoaDonDienTuId);
              this.message.remove();
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.loadData();
            } else {
              this.message.remove();
              this.message.error('Lỗi xóa dữ liệu');
            }
          }, _ => {
            this.message.remove();
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
          });
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }
  changeSearch(event: any) {
    if (event.keyCode == 13) {
      // if(this.valueSearch) {
      //   this.displayData.Keyword = this.valueSearch;
      // } else {
      //   this.displayData.Keyword = '';
      // }
      this.loadData();
    }
  }
  selectedRow(data: any) {
    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;

      // nếu là có mã hoặc chuyển bảng tổng hợp thì disable
      if (this.dataSelected.boKyHieuHoaDon && (this.dataSelected.boKyHieuHoaDon.hinhThucHoaDon === 1 || this.dataSelected.boKyHieuHoaDon.phuongThucChuyenDL === 1)) {
        this.disabledGuiCQT = true;
      } else {
        this.disabledGuiCQT = false;
      }

      let entries = Object.entries(this.mapOfExpandedData);
      for (const [prop, val] of entries) {
        const list = val;
        for (const item of list) {
          if (!this.dataSelected) {
            item.selected = false;
          } else {
            if (this.dataSelected.key !== item.key) {
              item.selected = false;
            }
          }
        }
      }
    }
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.params.PageNumber = 1;
    }
    this.loadData();
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
    this.loadData();
  }

  sort(sort: { key: string; value: string }): void {
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.loadData();
  }

  clickXem() {
  }
  view(data: any) {
    if (data.hoaDonNgoaiHeThong == true) {
      return;
    }
    if (data != null) {
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.message.remove(id);
        }, (err) => {
          this.message.warning("Lỗi khi xem hóa đơn");
          this.message.remove(id);
        });
      }, (err) => {
        console.log(err);
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      })
    }
  }
  viewReceipt(item: any) {
    console.log(item);
    if (item.trangThaiQuyTrinh == TrangThaiQuyTrinh.GuiTCTNLoi) return;

    this.tabHoaDonDienTuComponent.viewReceipt(item);
  }

  async publishReceipt(item: any) {
    if (item.soHoaDon) return;

    let ngayHienTai: any = await this.hoaDonDienTuService.GetNgayHienTai();

    let ngayHoaDon = moment(item.ngayHoaDon).format("YYYY-MM-DD");
    //kiểm tra xem ngày hóa đơn theo kỳ kế toán có hợp lệ
    if (kiemTraHoaDonHopLeTheoKyKeKhai(this.modalService, ngayHoaDon, 'phatHanhHoaDon', ngayHienTai.result, item.boKyHieuHoaDon.kyHieu) == false) {
      return;
    }

    this.tabHoaDonDienTuComponent.publishReceipt(item, () => {
      this.loadData();
    });
  }

  sendReceipt(isDraft: boolean, item: any) {
    if (isDraft) {
      if (item.soHoaDon) return;
    }
    else {
      if (!item.soHoaDon) return;
    }
    this.tabHoaDonDienTuComponent.sendReceipt(isDraft, item, () => {
      this.loadData();
    });
  }

  downloadReceipt(item: any) {
    this.tabHoaDonDienTuComponent.downloadReceipt(item);
  }

  convertReceipt(item: any) {
    if (!item.soHoaDon) return;

    this.tabHoaDonDienTuComponent.convertReceipt(item, () => {
      this.loadData();
    });
  }

  lapBienBanXoaBo(item: any) {

    if (item.trangThaiBienBanXoaBo !== 0) {
      return;
    }
    if (item.hoaDonNgoaiHeThong == true) {
      item.thongTinHoaDonId = item.hoaDonDienTuId;
    }
    else {
      item.thongTinHoaDonId = null;
    }
    item.checkHideBtnXoa = true;
    item.checkHideBtnXemHd = item.hoaDonNgoaiHeThong;

    let hoaDonThayTheCha = this.listData.find(x => x.thayTheChoHoaDonId == item.hoaDonDienTuId);
    if (hoaDonThayTheCha != null) {
      item.tenKhachHang = hoaDonThayTheCha.tenKhachHang;
      item.diaChi = hoaDonThayTheCha.diaChi;
      item.maSoThue = hoaDonThayTheCha.maSoThue;
      item.soDienThoai = hoaDonThayTheCha.soDienThoaiNguoiMuaHang;
      item.hoTenNguoiMuaHang = hoaDonThayTheCha.hoTenNguoiMuaHang;
      item.lyDoXoaBo = '';
      item.khachHangId = hoaDonThayTheCha.khachHangId;

      if (item.hoaDonNgoaiHeThong == true) {
        item.hoaDonDienTuId = null;
      }
    }
    this.tabHoaDonXoaBoComponent.LapBienBanHuyHoaDon(item, () => this.loadData());
  }

  suaBienBanXoaBo(item: any) {
    if (item.trangThaiBienBanXoaBo > 1 || item.trangThaiBienBanXoaBo == 0) {
      return;
    }

    if (item.hoaDonNgoaiHeThong == true) {
      item.thongTinHoaDonId = item.hoaDonDienTuId;
    }
    else {
      item.thongTinHoaDonId = null;
    }
    this.tabHoaDonXoaBoComponent.SuaBienBan(item, () => this.loadData());
  }

  xoaBienBanXoaBo(item: any) {
    if (item.trangThaiBienBanXoaBo > 1 || item.trangThaiBienBanXoaBo == 0) {
      return;
    }

    this.tabHoaDonXoaBoComponent.XoaBienBanHuyHD(item, () => this.loadData());
  }

  guiBienBanXoaBo(item: any) {
    if (this.dataSelected.trangThaiBienBanXoaBo == 4 || this.dataSelected.trangThaiBienBanXoaBo == 0 || this.dataSelected.trangThaiBienBanXoaBo == 3 || this.dataSelected.trangThaiBienBanXoaBo == 1) {
      return;
    }

    if (this.dataSelected.hoaDonNgoaiHeThong == true) {
      this.dataSelected.thongTinHoaDonId = this.dataSelected.hoaDonDienTuId;
    }
    else {
      this.dataSelected.thongTinHoaDonId = null;
    }
console.log(this.dataSelected);
    this.tabHoaDonXoaBoComponent.GuiBienBanHuyHD(this.dataSelected, () => this.loadData());
  }
  // // Checkbo
  // refreshStatus(): void {
  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.hoaDonDienTuId]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.hoaDonDienTuId]) && !this.isAllDisplayDataChecked;

  //   this.dataSelected = null;
  //   this.listHHDV.forEach((item: any) => {
  //     item.selected = false;
  //   });

  //   let entries = Object.entries(this.mapOfCheckedId);
  //   for (const [prop, val] of entries) {
  //     const item = this.listOfDisplayData.find(x => x.hoaDonDienTuId === prop);
  //     const selectedIndex = this.listOfSelected.findIndex(x => x.hoaDonDienTuId === prop);
  //     const index = this.listHHDV.findIndex(x => x.hoaDonDienTuId === prop);

  //     if (val) {
  //       if (selectedIndex === -1) {
  //         this.listOfSelected.push(item);
  //       }
  //     } else {
  //       if (selectedIndex !== -1) {
  //         this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== prop);
  //       }
  //     }

  //     if (index !== -1) {
  //       this.listHHDV[index].selected = val;
  //     }
  //   }
  // }

  // checkAll(value: boolean): void {
  //   this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.hoaDonDienTuId] = value));
  //   this.refreshStatus();
  // }

  change(colName: any, event: any) {
    if (!event) {
      this.params.Filter[colName] = event;
      this.loadData();
    }
  }

  changeKy(event: any) {
    SetDate(event, this.params);
  }

  blurDate() {
    CheckValidDateV2(this.params);
    const ky = GetKy(this.params);
    this.params.Ky = ky;
  }

  filterTable() {
    if (this.params.toDate < this.params.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    this.loadData();
  }

  //hàm này để lấy ra các giá trị tìm kiếm đã nhập
  getDataToFind(): any {
    let dataToFind: any = {};
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
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

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: this.textButtonMoRongThuGon == 'Thu gọn' });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: this.textButtonMoRongThuGon == 'Thu gọn', parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  clickAdd(type: number, lyDoThayThe: LyDoThayThe) {
    const modal1 = this.modalService.create({
      nzTitle: getTenHoaDonByLoai(type),
      nzContent: HoaDonDienTuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
        loaiHD: type,
        fbEnableEdit: true,
        lyDoThayThe
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.loadData();
      }
    });
  }

  filterGeneral() {
    this.filterGeneralVisible = false;

    let dataToFind = this.getDataToFind();
    this.displayDataTemp = this.params;
    this.displayDataTemp.GiaTri = dataToFind.GiaTri;
    this.displayDataTemp.TimKiemTheo = dataToFind.TimKiemTheo;
    this.displayDataTemp.TimKiemBatKy = dataToFind.TimKiemBatKy;
    //this.displayDataTemp.TrangThaiQuyTrinh = this.params.TrangThaiQuyTrinh;
    //this.displayDataTemp.LoaiTrangThaiGuiHoaDon = this.params.LoaiTrangThaiGuiHoaDon;

    this.params = this.displayDataTemp;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;

    let dataToFind = this.getDataToFind();
    this.displayDataRaw.GiaTri = dataToFind.GiaTri;
    this.displayDataRaw.TimKiemTheo = dataToFind.TimKiemTheo;
    this.displayDataRaw.TimKiemBatKy = dataToFind.TimKiemBatKy;

    this.displayDataTemp = Object.assign({}, this.displayDataRaw);
    this.params = Object.assign({}, this.displayDataRaw);
    this.loadViewConditionList();
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Ngày hóa đơn: ', value: GetTenKy(this.params.Ky) });
    if (this.params.TrangThaiQuyTrinh !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiQuyTrinh', label: 'Trạng thái quy trình: ', value: this.trangThaiQuyTrinhs.find(x => x.key === this.params.TrangThaiQuyTrinh).value });
    }
    if (this.params.LoaiTrangThaiGuiHoaDon !== -1) {
      this.viewConditionList.push({ key: 'LoaiTrangThaiGuiHoaDon', label: 'Trạng thái gửi hóa đơn: ', value: this.trangThaiGuiHoaDons.find(x => x.trangThaiId === this.params.LoaiTrangThaiGuiHoaDon).ten });
    }

    if (this.viewConditionList.length > 1 || (this.params.Ky !== 4 && this.params.Ky !== 6)) {
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

    this.loadData(true);
  }

  removeFilter(filter: any) {
    switch (filter.key) {
      case 'TrangThaiQuyTrinh':
        this.params.TrangThaiQuyTrinh = -1;
        break;
      case 'LoaiTrangThaiGuiHoaDon':
        this.params.LoaiTrangThaiGuiHoaDon = -1;
        break;
      default:
        break;
    }

    if (this.params.filterColumns.filter(x => x.colKey === filter.key).length > 0) {
      const idx = this.params.filterColumns.findIndex(x => x.colKey === filter.key);
      this.params.filterColumns[idx].isFilter = false;
      this.params.filterColumns[idx].colValue = null;
      this.mapOfHightlightFilter[filter.key] = false;
    }

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

  openDinhKem(item: any) {
    const modal = this.modalService.create({
      nzTitle: Message.ATTACH_ESC,
      nzContent: DinhKemHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '30%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        hoaDonDienTuId: item.hoaDonDienTuId,
        loaiNghiepVu: RefType.HoaDonThayThe
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.loadData(true);
      }
    })
  }

  //hàm này để mở rộng/thu gọn cây dữ liệu
  moRongThuGonCayDuLieu() {
    if (this.textButtonMoRongThuGon == 'Thu gọn') {
      this.textButtonMoRongThuGon = 'Mở rộng';
    }
    else {
      this.textButtonMoRongThuGon = 'Thu gọn';
    }
    this.loadData();
  }

  //hàm này để gửi hóa đơn tới CQT
  sendDataHoaDon(item: any) {
    if (this.disabledGuiCQT) {
      return;
    }

    this.tabHoaDonDienTuComponent.dataSelected = item;
    this.tabHoaDonDienTuComponent.isChuyenDayDuNoiDungTungHoaDon = this.isChuyenDayDuNoiDungTungHoaDon;
    this.tabHoaDonDienTuComponent.sendDataHoaDon(MLTDiep.TDCDLHDKMDCQThue, () => {
      this.loadData();
    });
  }

  setDefaulThoiGian() {
    let kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (kyKeKhaiThue == 'Quy') {
      SetDate(6, this.params);
      this.params.Ky = 6;
    }
    else if (kyKeKhaiThue == 'Thang') {
      SetDate(4, this.params);
      this.params.Ky = 4;
    }
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
        nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
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
          callBackAfterClosing: this.loadData,
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
          daKyVaGuiCQT: true,
          thongDiepGuiCQTId: (data.thongBaoSaiSot.thongDiepGuiCQTId != null) ? data.thongBaoSaiSot.thongDiepGuiCQTId : data.thongDiepGuiCQTId
        },
        nzFooter: null
      });
    }

    if (modalThongBaoSaiSot != null) {
      modalThongBaoSaiSot.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.loadData();
        }
      });
    }
  }


  //hàm này để click vào dòng trạng thái biên bản xóa bỏ
  clickTrangThaiBienBanXoaBo(data: any, addnew: false) {
    if (data.hoaDonNgoaiHeThong == true) {
      data.thongTinHoaDonId = data.hoaDonDienTuId;
    }
    else {
      data.thongTinHoaDonId = null;
    }
    data.checkHideBtnXoa = true;
    data.checkHideBtnXemHd = data.hoaDonNgoaiHeThong;

    let hoaDonThayTheCha = this.listData.find(x => x.thayTheChoHoaDonId == data.hoaDonDienTuId);
    if (hoaDonThayTheCha != null) {
      data.tenKhachHang = hoaDonThayTheCha.tenKhachHang;
      data.diaChi = hoaDonThayTheCha.diaChi;
      data.maSoThue = hoaDonThayTheCha.maSoThue;
      data.soDienThoai = hoaDonThayTheCha.soDienThoaiNguoiMuaHang;
      data.hoTenNguoiMuaHang = hoaDonThayTheCha.hoTenNguoiMuaHang;
      // data.lyDoXoaBo = '';
      data.khachHangId = hoaDonThayTheCha.khachHangId;

      if (data.hoaDonNgoaiHeThong == true && addnew) {
        data.hoaDonDienTuId = null;
      }
    }
    this.tabHoaDonXoaBoComponent.clickRow(data, () => this.loadData());
  }
  viewError(loaiHD: number, data: any) {
    if (loaiHD == 1) {
      data.loadingViewError = true;
      this.hoaDonDienTuService.GetMaThongDiepInXMLSignedById(data.hoaDonDienTuId)
        .subscribe((res: any) => {
          data.maThongDiep = res.result;
          this.tabThongDiepGuiComponent.viewLoi(data, () => {
            data.loadingViewError = false;
          });
        });
    }
    else {
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: "Tình trạng lỗi khi thực hiện gửi hóa đơn",
        nzContent: XemLoiHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: window.innerWidth / 100 * 90,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          hoaDonDienTuId: data.hoaDonDienTuId,
          loaiLoi: data.trangThaiQuyTrinh != TrangThaiQuyTrinh.DaKyDienTu ? 5 : 4
        },
        nzFooter: null
      });
    }
  }
  viewLichSuTruyenNhan(data) {
    if (data.hoaDonNgoaiHeThong == true) {
      return;
    }
    this.tabHoaDonDienTuComponent.viewLichSuTruyenNhan(data);
  }

  clickGuiCQT(item: any){
    this.tabHoaDonDienTuComponent.hoSoHDDT = this.hoSoHDDT;
    this.tabHoaDonDienTuComponent.serials = this.serials;
    this.tabHoaDonDienTuComponent.guiHoaDonDenCQT(item, ()=>{
      this.loadData();
    })
  }

  xacNhanHoaDonDaGuiChoKhachHang(data: any){
    this.tabHoaDonDienTuComponent.xacNhanTrangThaiDaGui(data, RefType.HoaDonThayThe, () => this.loadData());
  }
}
