import { HinhThucHoaDon } from 'src/app/enums/HinhThucHoaDon.enum';
import { data, map } from 'jquery';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService, NzContextMenuService, NzDropdownMenuComponent, FakeViewportRuler } from 'ng-zorro-antd';
import { FilterColumn, FilterCondition, HoaDonParams } from "../../../../../app/models/PagingParams";
import { TextGlobalConstants } from '../../../../../app/shared/TextGlobalConstants';
import * as moment from 'moment';
import { EnvService } from '../../../../../app/env.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetKy, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { forkJoin, from, Observable, Subscription } from 'rxjs';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { getHeightBangKe, getHinhThucHoaDons, getListEmptyBangKe, getListEmptyBangKe1, getListEmptyChiTiet, getLoaiHoaDons, getLoaiLoaiHoaByMoTa, getTenLoaiHoaDon, getTrangThaiQuyTrinhs, getUyNhiemLapHoaDons, showKetQuaXoaChungTuHangLoat, kiemTraHoaDonHopLeTheoKyKeKhai, showModalPreviewPDF, getTimKiemTheo, getHeightBangKeKhongChiTiet, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet3, getTenHoaDonByLoai, getNoiDungLoiPhatHanhHoaDon, generateUUIDV4, isSelectChuKiCung, toTrimAndToUpperCase } from 'src/app/shared/SharedFunction';
import { KiemTraBangDuLieu, RowScrollerToViewEdit } from '../../../../shared/Utils';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HoaDonDienTuModalComponent } from '../../modals/hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { PhatHanhHoaDonModalComponent } from '../../modals/phat-hanh-hoa-don-modal/phat-hanh-hoa-don-modal.component';
import { GuiHoaDonModalComponent } from '../../modals/gui-hoa-don-modal/gui-hoa-don-modal.component';
import { ChuyenThanhHoaDonGiayModalComponent } from '../../modals/chuyen-thanh-hoa-don-giay-modal/chuyen-thanh-hoa-don-giay-modal.component';
import { XuatKhauChiTietHoaDonModalComponent } from '../../modals/xuat-khau-chi-tiet-hoa-don-modal/xuat-khau-chi-tiet-hoa-don-modal.component';
import { XemLichSuModalComponent } from '../../modals/xem-lich-su-modal/xem-lich-su-modal.component';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { LapHoaDonThayTheModalComponent } from '../../modals/lap-hoa-don-thay-the-modal/lap-hoa-don-thay-the-modal.component';
import { LyDoDieuChinh, LyDoThayThe } from 'src/app/models/LyDoThayTheModel';
import { CookieConstant } from 'src/app/constants/constant';
import { SumwidthConfig, GlobalConstants } from 'src/app/shared/global';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { ThietLapTruongDuLieuHoaDonModalComponent } from '../../modals/thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-hddt-modal.component';
import { Message } from 'src/app/shared/Message';
import { saveAs } from 'file-saver';
import { SharedService } from 'src/app/services/share-service';
import { PhatHanhHoaDonHangLoatModalComponent } from '../../modals/phat-hanh-hoa-don-hang-loat-modal/phat-hanh-hoa-don-hang-loat-modal.component';
import { GuiHoaDonHangLoatModalComponent } from '../../modals/gui-hoa-don-hang-loat-modal/gui-hoa-don-hang-loat-modal.component';
import * as JSZip from 'jszip';
import { TaiHoaDonHangLoatModalComponent } from '../../modals/tai-hoa-don-hang-loat-modal/tai-hoa-don-hang-loat-modal.component';
import { ChuyenDoiHoaDonHangLoatModalComponent } from '../../modals/chuyen-doi-hoa-don-hang-loat-modal/chuyen-doi-hoa-don-hang-loat-modal.component';
import { ThietLapTruongDuLieuService } from 'src/app/services/Config/thiet-lap-truong-du-lieu.service';
import { LoaiTruongDuLieu } from 'src/app/enums/LoaiTruongDuLieu.enum';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { XemLoiHoaDonModalComponent } from '../../modals/xem-loi-hoa-don-modal/xem-loi-hoa-don-modal.component';
import { ThongDiepGuiDuLieuHddtModalComponent } from '../../modals/thong-diep-gui-du-lieu-hddt-modal/thong-diep-gui-du-lieu-hddt-modal.component';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { DinhKemHoaDonModalComponent } from '../../modals/dinh-kem-hoa-don-modal/dinh-kem-hoa-don-modal.component';
import { TrangThaiQuyTrinh, TrangThaiQuyTrinhLabel } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { GuiTBaoSaiSotKhongPhaiLapHDonModalComponent } from '../../modals/gui-tbao-sai-sot-khong-phai-lap-hdon-modal/gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component';
import { NhatKyGuiEmailService } from 'src/app/services/tien-ich/nhat-ky-gui-email.service';
import { TabHoaDonXoaBoComponent } from '../tab-hoa-don-xoa-bo/tab-hoa-don-xoa-bo.component';
import { LichSuTruyenNhanComponent } from '../../modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { BaoCaoService } from 'src/app/services/bao-cao/bao-cao.service';
import { ChonCachLapHoaDonMoiModalComponent } from '../../modals/chon-cach-lap-hoa-don-moi-modal/chon-cach-lap-hoa-don-moi-modal.component';
import { TabThongDiepGuiComponent } from 'src/app/views/quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { AddEditBangTongHopDuLieuModalComponent } from '../../modals/add-edit-bang-tong-hop-du-lieu-hoa-don-modal/add-edit-bang-tong-hop-du-lieu-hoa-don-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { TrangThaiSuDung2 } from 'src/app/enums/TrangThaiSuDung.enum';
import { ThongDiepGuiHoaDonKhongMaService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-hoa-don-khong-ma.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { AddEditBienBanDieuChinhModalComponent } from '../../modals/add-edit-bien-ban-dieu-chinh-modal/add-edit-bien-ban-dieu-chinh-modal.component';
import { LapBienBanHoaDonDieuChinhModalComponent } from '../../modals/lap-bien-ban-hoa-don-dieu-chinh-modal/lap-bien-ban-hoa-don-dieu-chinh-modal.component';
import { UserService } from 'src/app/services/user.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { DigitalSignerNameReaderService } from 'src/app/services/tien-ich/digital-signer-name-reader.service';
import { NguoiBanNguoiKyChecker } from 'src/app/shared/NguoiBanNguoiKyChecker';
import { XacNhanGuiHoaDonModalComponent } from '../../modals/xac-nhan-gui-hoa-don-cho-khach-hang-modal/xac-nhan-gui-hoa-don-cho-khach-hang-modal.component';

@Component({
  selector: 'app-tab-hoa-don-dien-tu',
  templateUrl: './tab-hoa-don-dien-tu.component.html',
  styleUrls: ['./tab-hoa-don-dien-tu.component.scss']
})
export class TabHoaDonDienTuComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('filterColumnTemp', { static: false }) filterColumnTemp: FilterColumnComponent;
  scrollConfig = { x: '', y: '250px' };
  scrollConfigB = { x: '', y: '180px' };
  scrollConfigTT = { x: '100%', y: '220px' };
  widthConfig = ['50px'];
  widthConfigB = ['50px', '150px', '200px', '100px', '100px', '150px', '200px', '200px', '150px', '200px', '150px', '200px'];
  modal = '';
  mapOfExpandedData: { [key: number]: any[] } = {};
  mapOfExpandedData_luyKe: { [key: number]: any[] } = {};
  chitietCollapse = false;
  listKy: any[];
  listPaging: any[] = [];
  listTemp: any[] = [];
  loading = false;
  total = 0;
  pageSizeOptions = [];
  chiTiets: any[] = [];
  loadingChiTiets: boolean;
  isDaLapThongBao: boolean;
  isDaGuiThongBao: boolean;
  filterColVisible = false;
  hasKyHieu = false;
  kyKeKhaiThueGTGT = localStorage.getItem(CookieConstant.KYKEKHAITHUE) === 'Thang' ? 4 : 6;
  tempToDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).endOf('quarter').format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD');
  tempFormDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).startOf('quarter').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');
  currentPageIndex = 1;
  displayData: any = {
    PageNumber: 1,
    PageSize: 50,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: this.tempFormDate,
    oldToDate: this.tempToDate,
    fromDate: this.tempFormDate,
    toDate: this.tempToDate,
    Ky: this.kyKeKhaiThueGTGT,
    LoaiHoaDon: -1,
    TrangThaiHoaDonDienTu: -1,
    TrangThaiHoaDonDienTus: [-1],
    TrangThaiPhatHanh: -1,
    TrangThaiPhatHanhs: [-1],
    TrangThaiGuiHoaDon: -1,
    TrangThaiChuyenDoi: -1,
    TrangThaiBienBanXoaBo: -1,
    TrangThaiXoaBo: -1,
    HinhThucHoaDon: -1,
    UyNhiemLapHoaDon: -1,
    /////////////////////////////
    filterColumns: [],
    MauHoaDonDuocPQ: [],
    LocHoaDonCoSaiSotChuaLapTBao04: false,
    LoaiNghiepVu: 1
  };
  displayDataTemp = Object.assign({}, this.displayData);
  displayDataRaw: any;
  subscription: Subscription;
  loadingPrint = false;
  loadingPreviewMutiple = false;
  previewMutipleForm: FormGroup;
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
  lstBangKeEmpty = [];
  lstChiTietEmpty = [];
  numberBangKeCols = [];
  numberChiTietCols = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  permission: boolean = false;
  thaoTacs: any[] = [];
  trangThaiGuiHoaDons: any[] = [];
  trangThaiHoaDons: any[] = [];
  treeTrangThais: any[] = [];
  treeTrangThaiLuyKes: any[] = [];
  totalTongTienTT = 0;
  timKiemTheos = getTimKiemTheo();
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons(true);
  hinhThucHoaDons = getHinhThucHoaDons(true);
  loaiHoaDons = getLoaiHoaDons(true);
  trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true);
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  //
  boolPhatSinhBanHangTheoDGSauThue = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'PhatSinhBanHangTheoDGSauThue').giaTri;
  truongDuLieuHoaDons: any[] = [];
  truongDuLieuHoaDonsAll: any[] = [];
  truongDuLieuHoaDonFooters: any[] = [];
  spanLeft = 2;
  mauHoaDonDuocPQ: any = [];
  spanLeftChiTiet = 0;
  truongDuLieuChiTiets: any[] = [];
  truongDuLieuChiTietFooters: any[] = [];
  mapOfLeftCol: { [key: number]: string } = {};
  mapOfTruongDuLieuHoaDons: { [key: string]: string } = {};
  thanhTien = 0;
  thanhTienQuyDoi = 0;
  tienThueGTGT = 0;
  tienThueGTGTQuyDoi = 0;
  disableMenuThongBaoSaiThongTin = true;
  globalConstants = GlobalConstants;
  mapOfLoaiHoaDon: { [key: number]: boolean } = {};
  hinhThucHoaDon = 0; // không mã
  hiddenPhatHanhLaiTrongNgay = false; // ẩn phát hành lại trong ngày
  isCoMaDangSuDungOrNgungSudung = false; // có mã của cqt đang sử dụng hoặc ngừng sử dụng
  isCoMaKhongSuDung = false; // có mã của cqt không sử dụng
  isShowGuiCQT = false;
  disabledGuiCQT = false;
  isChuyenDayDuNoiDungTungHoaDon = false; // là chuyển đầy đủ nội dung từng hóa đơn
  firstLoaiHoaDon = null;
  countLoaiHoaDon = 0; // số lượng loại hóa đơn được phép lập
  disabledPhatHanhDongLoat = false;
  disabledGuiHoaDon = false;
  disabledGuiBanNhap = false;
  tongTienThanhToan = 0;
  hasQueryParam = false;
  isPhieuXuatKho = false;
  isPos = false;
  thaoTacHoaDonSaiSot: any[] = [];
  isCMTMTT: boolean = false;
  hoSoHDDT: any;
  serials: any[] = [];
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  signing: boolean;
  webSubcription: Subscription;
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = false;
  boolChoPhepLapHDDTMTT = false;
  boolChoPhepXacNhanHDDaGuiKhachHang = false;
  txtHD_PXK = 'hóa đơn';
  txtHD_PXK_UPPER = 'Hóa đơn';
  isClickRowTrangThaiHoaDon: boolean = false;
  userEnter: boolean = false;
  userUpOrDown: boolean;
  userOnMouse: boolean = false;
  isClickRowTrangThaiQuyTrinh: boolean;
  itemIdSelected: string = '';
  menuContext: boolean = false;
  loaiHoaDonDuocSuDungs: any[] = [];
  isKMa = false;
  boolCanhBaoNguoiBanKhacNguoiKy = false;
  refType: RefType;
  disableGuiCQTMTT: boolean = false;
  isTaxCodeNotAddMtt:boolean = false;
  taxcodeLogin = localStorage.getItem(CookieConstant.TAXCODE);

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nzContextMenuService: NzContextMenuService,
    private env: EnvService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private router: Router,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private thietLapTruongDuLieuService: ThietLapTruongDuLieuService,
    private nhatKyGuiEmailService: NhatKyGuiEmailService,
    private tabHoaDonXoaBoComponent: TabHoaDonXoaBoComponent,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private baoCaoService: BaoCaoService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private thongDiepGuiHoaDonKhongMaService: ThongDiepGuiHoaDonKhongMaService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private activatedRoute: ActivatedRoute,
    private hoSoHHDTService: HoSoHDDTService,
    private userService: UserService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private webSocket: WebSocketService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private tuyChonService: TuyChonService,
    private signerNameReaderService: DigitalSignerNameReaderService
  ) {
    super();
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('hoa-don-dien-tu')) {
      this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x => !(x.key == HinhThucHoaDon.CoMaTuMayTinhTien));
      this.loaiHoaDons = this.loaiHoaDons.filter(x=>x.key == LoaiHoaDon.TatCa || x.key <= LoaiHoaDon.CacCTDuocInPhatHanhSuDungVaQuanLyNhuHD);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != this.trangThaiQuyTrinh.ChuaPhatHanh && x.key != this.trangThaiQuyTrinh.ChuaGuiCQT)
    }
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK = 'PXK';
      this.txtHD_PXK_UPPER = 'PXK';
      this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key === -1 || x.key === LoaiHoaDon.PXKKiemVanChuyenNoiBo || x.key === LoaiHoaDon.PXKHangGuiBanDaiLy);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != this.trangThaiQuyTrinh.ChuaPhatHanh && x.key != this.trangThaiQuyTrinh.ChuaGuiCQT)
    }
    else if (_url.includes('hoa-don-tu-mtt')) {
    this.isTaxCodeNotAddMtt = this.env.taxCodeNotAddMtt.includes(this.taxcodeLogin);
    this.isPos = true;
      this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key == LoaiHoaDon.TatCa || x.key == LoaiHoaDon.HoaDonGTGTCMTMTT || x.key == LoaiHoaDon.HoaDonBanHangCMTMTT || x.key == LoaiHoaDon.HoaDonKhacCMTMTT);
      this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x => x.key == HinhThucHoaDon.CoMaTuMayTinhTien || x.key == HinhThucHoaDon.TatCa);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != this.trangThaiQuyTrinh.ChuaKyDienTu && x.key != this.trangThaiQuyTrinh.DangKyDienTu && x.key != this.trangThaiQuyTrinh.DaKyDienTu && x.key != this.trangThaiQuyTrinh.CQTDaCapMa)
      // this.displayDataTemp.HinhThucHoaDon = HinhThucHoaDon.CoMaTuMayTinhTien;    
    }

    this.loaiHoaDons = this.loaiHoaDons.filter(x => !(x.key === LoaiHoaDon.TemVeBanHang || x.key === LoaiHoaDon.TemVeGTGT));
    this.changeHinhThucHoaDon()
    this.displayData.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;

    const query = this.activatedRoute.snapshot.queryParams['query'];
    const yeucauhuy = this.activatedRoute.snapshot.queryParams['yeucauhuy'];
    if (yeucauhuy) {
      this.displayDataTemp.LocHoaDonYeuCauHuy = true;
      this.displayDataTemp.fromDate = '2022-12-31';
      const ky = GetKy(this.displayDataTemp);
      this.displayDataTemp.Ky = ky;
      this.changeKy(ky);
    }
    this.hoSoHHDTService.GetDetail().subscribe((res: any) => {
      this.kyKeKhaiThueGTGT = res.kyTinhThue === 0 ? 4 : 6;
      if (!query) {
        if (res.kyTinhThue === 0) {
          this.displayDataTemp.Ky = 4;
          this.displayData.Ky = 4;
          this.changeKy(4);
          this.displayDataTemp.oldFromDate = this.displayDataTemp.fromDate;
          this.displayDataTemp.oldToDate = this.displayDataTemp.toDate;
        } else {
          this.displayDataTemp.Ky = 6;
          this.displayData.Ky = 6;
          this.changeKy(6);
          this.displayDataTemp.oldFromDate = this.displayDataTemp.fromDate;
          this.displayDataTemp.oldToDate = this.displayDataTemp.toDate;
        }
      }
    });
    window.addEventListener('scroll', this.scrollEvent, true);

    if (query) {
      const data = JSON.parse(decodeURIComponent(atob(query)));
      if (data) {
        this.setParamHoaDonNhoHonHoaDonDangPhatHanh(data);
      }
    }

    this.displayData = Object.assign({}, this.displayDataTemp);
    this.displayDataRaw = Object.assign({}, this.displayDataTemp);

    this.GetBoKyHieuTheoToKhaiMoiNhat();

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.mauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
        this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
        this.GetTrangThaiGuiHoaDons();
        this.GetTrangThaiHoaDons();
        this.GetTruongDuLieuHoaDon();

        this.createPreviewMutipleForm();
        // this.GetTreeTrangThai();
        // this.GetTreeTrangThaiLuyKe();
        if (localStorage.getItem('TuDongLocHoaDonCoSaiSot') == 'true') {
          this.locHoaDonCoSaiSotChuaLapThongBao();
        }
        else {
          this.loadViewConditionList();
        }
      })
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x=>x.functionName == 'HoaDon') ? pq.functions.find(x => x.functionName == "HoaDon").thaoTacs : [];
      console.log(this.thaoTacs);
      this.thaoTacHoaDonSaiSot = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == 'ThongDiepGui').thaoTacs : [];
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
      /*     this.subscription = this.sharesv.changeEmitted$.subscribe(
            (rs: any) => {
              if (rs != null && rs.content === 'ChungTuCongNoGuiBuTruCongNo' && rs.res === true) {
                this.LoadData();
              }
            }); */
      this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
      this.GetTrangThaiGuiHoaDons();
      this.GetTrangThaiHoaDons();
      this.GetTruongDuLieuHoaDon();

      this.createPreviewMutipleForm();
      // if (localStorage.getItem(this.locNgayChungTuNVK)) {
      //   const sessionFilterDate = JSON.parse(localStorage.getItem(this.locNgayChungTuNVK));
      //   this.displayData = {
      //     ...this.displayData,
      //     fromDate: sessionFilterDate.fromDate,
      //     toDate: sessionFilterDate.toDate
      //   };
      // }
      this.GetTreeTrangThai();
      this.GetTreeTrangThaiLuyKe();
      if (localStorage.getItem('TuDongLocHoaDonCoSaiSot') == 'true') {
        this.locHoaDonCoSaiSotChuaLapThongBao();
      }
      else {
        this.loadViewConditionList();
      }
    }

    this.subscription = this.sharedService.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null) {
          if (rs.type === 'LoadDataAfterAddNew' && rs.status === true) {
            this.LoadData();
          }
          if (rs.type === 'LoadDataWhenNgungChucNangVaXemChiTiet' && rs.status === true) {
            this.setParamHoaDonNhoHonHoaDonDangPhatHanh(rs.value);
            this.filterGeneral();
          }
          if (rs.type === 'LoadDataAfterUpdate' && rs.status === true && rs.value) {
            const checkExists = this.listPaging.some(x => x.hoaDonDienTuId === rs.value);
            if (checkExists) {
              this.LoadData();
            }
          }
        }
      });
    //khi click ở bảng điều khiển
    this.activatedRoute.queryParams.subscribe(params => {
      const tabIndex = params['lhd'];
      if (tabIndex) {
        this.GetBoKyHieuTheoToKhaiMoiNhat((res: any) => {
          if (res && res.loaiHoaDons.length > 0) {
            this.clickAdd(res.loaiHoaDons[0])
          } else {
            this.showThongBaoKhongTonTaiBoKyHieu();
          }
        });
      }
    });

    this.itemIdSelected = this.displayDataTemp.TrangThaiHoaDonDienTus[0].toString();
  }

  changeHinhThucHoaDon() {
    if (this.displayDataTemp.HinhThucHoaDon == HinhThucHoaDon.TatCa) {
      const _url = this.router.url;
      if (_url.includes('hoa-don-dien-tu')) {
        this.trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true).filter(x =>
          x.key != TrangThaiQuyTrinh.ChuaGuiCQT &&
          x.key != TrangThaiQuyTrinh.ChuaPhatHanh
        )
      }
      if (_url.includes('hoa-don-tu-mtt')) {
        this.trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true).filter(x =>
          x.key != TrangThaiQuyTrinh.ChuaKyDienTu &&
          x.key != TrangThaiQuyTrinh.DangKyDienTu &&
          x.key != TrangThaiQuyTrinh.KyDienTuLoi &&
          x.key != TrangThaiQuyTrinh.DaKyDienTu &&
          x.key != TrangThaiQuyTrinh.CQTDaCapMa &&
          x.key != TrangThaiQuyTrinh.KhongDuDieuKienCapMa
        )
      }
    }
    if (this.displayDataTemp.HinhThucHoaDon == HinhThucHoaDon.CoMa) {
      this.trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true).filter(x =>
        x.key != TrangThaiQuyTrinh.DaKyDienTu &&
        x.key != TrangThaiQuyTrinh.HoaDonKhongHopKe &&
        x.key != TrangThaiQuyTrinh.HoaDonHopLe &&
        x.key != TrangThaiQuyTrinh.ChuaGuiCQT &&
        x.key != TrangThaiQuyTrinh.ChuaPhatHanh
      )
    }
    if (this.displayDataTemp.HinhThucHoaDon == HinhThucHoaDon.KhongCoMa) {
      this.trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true).filter(x =>
        x.key != TrangThaiQuyTrinh.KhongDuDieuKienCapMa &&
        x.key != TrangThaiQuyTrinh.ChuaGuiCQT &&
        x.key != TrangThaiQuyTrinh.ChuaPhatHanh &&
        x.key != TrangThaiQuyTrinh.CQTDaCapMa
      )
    }
    if (this.displayDataTemp.HinhThucHoaDon == HinhThucHoaDon.CoMaTuMayTinhTien) {
      this.trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true, true).filter(x =>
        x.key != TrangThaiQuyTrinh.ChuaKyDienTu &&
        x.key != TrangThaiQuyTrinh.DangKyDienTu &&
        x.key != TrangThaiQuyTrinh.KyDienTuLoi &&
        x.key != TrangThaiQuyTrinh.DaKyDienTu &&
        x.key != TrangThaiQuyTrinh.CQTDaCapMa &&
        x.key != TrangThaiQuyTrinh.KhongDuDieuKienCapMa
      )
    }
  }

  loadDataAfterAddEdit(isAddNew: boolean, hoaDonDienTuId = null) {
    if (isAddNew) {
      this.sharedService.emitChange({
        type: 'LoadDataAfterAddNew',
        status: true
      });
    } else {
      this.sharedService.emitChange({
        type: 'LoadDataAfterUpdate',
        status: true,
        value: hoaDonDienTuId
      });
    }
  }

  scrollEvent = (event: any): void => {
    let menuRightclick = document.getElementById('menu-rightclick');
    if (menuRightclick != null) this.nzContextMenuService.close();
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true);
  }
  setParamHoaDonNhoHonHoaDonDangPhatHanh(rs: any) {
    this.displayDataTemp.Ky = this.kyKeKhaiThueGTGT;
    this.changeKy(this.kyKeKhaiThueGTGT);

    this.displayDataTemp.fromDate = '2021-11-21';
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
    this.displayDataTemp.TrangThaiPhatHanhs = [rs.trangThaiQuyTrinh];
    this.displayDataTemp.LoaiHoaDon = +rs.kyHieuHoaDon[0];
    this.displayDataTemp.filterColumns = [{ colKey: "KyHieu", colNameVI: "Ký hiệu", colValue: rs.kyHieuHoaDon.substring(1), filterCondition: 1, isFilter: true }];
    this.displayDataTemp.PageSize = -1;
    this.mapOfCheckedId = {};
    this.listOfSelected = [];
  }

  // get thông tin bộ ký hiệu theo tờ khai mới nhất
  GetBoKyHieuTheoToKhaiMoiNhat(callback: (res: any) => any = null) {
    forkJoin([
      this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat(),
      this.quanLyThongTinHoaDonService.GetByLoaiThongTinChiTiet(1), // get có mã
      this.quanLyThongTinHoaDonService.GetByLoaiThongTinChiTiet(2), // get không mã
      this.hoSoHHDTService.GetDetailAsync(),
      this.quyDinhKyThuatService.GetAllListCTS(),
      this.tuyChonService.GetAll()
    ]).subscribe((res: any[]) => {
      if (res[0]) {
        this.hinhThucHoaDon = res[0].hinhThucHoaDon;

        this.isCMTMTT = res[0].isCMTMTTien;
        this.isKMa = res[0].isKhongCoMa;
        this.isChuyenDayDuNoiDungTungHoaDon = res[0].isChuyenDayDuNoiDungTungHoaDon;
        this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = res[5].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail") ? res[5].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail").giaTri == "true" : false;
        this.boolChoPhepLapHDDTMTT = res[5].find(x => x.ma == "BoolChoPhepLapHDDTMTT") ? res[5].find(x => x.ma == "BoolChoPhepLapHDDTMTT").giaTri == "true" : false;
        this.boolChoPhepXacNhanHDDaGuiKhachHang = res[5].find(x => x.ma == "BoolChoPhepXacNhanHDDaGuiKhachHang") ? res[5].find(x => x.ma == "BoolChoPhepXacNhanHDDaGuiKhachHang").giaTri == "true" : false;
        this.boolCanhBaoNguoiBanKhacNguoiKy = res[5].find(x => x.ma == "BoolCanhBaoNguoiBanKhacNguoiKy") ? res[5].find(x => x.ma == "BoolCanhBaoNguoiBanKhacNguoiKy").giaTri == "true" : false;
        if (this.isPhieuXuatKho) {
          res[0].loaiHoaDons = res[0].loaiHoaDons.filter(x => x === LoaiHoaDon.PXKKiemVanChuyenNoiBo || x === LoaiHoaDon.PXKHangGuiBanDaiLy);
        } else {
          res[0].loaiHoaDons = res[0].loaiHoaDons.filter(x => !(x === LoaiHoaDon.PXKKiemVanChuyenNoiBo || x === LoaiHoaDon.PXKHangGuiBanDaiLy));
        }

        res[0].loaiHoaDons.map((x: number) => this.mapOfLoaiHoaDon[x] = true);
        console.log('this.mapOfLoaiHoaDon', this.mapOfLoaiHoaDon);
        this.loaiHoaDonDuocSuDungs = this.loaiHoaDons.filter(x => res[0].loaiHoaDons.indexOf(x.key) >= 0).map(x => x.key);
        console.log(this.loaiHoaDonDuocSuDungs);
        this.countLoaiHoaDon = this.loaiHoaDonDuocSuDungs.length;

        if (this.countLoaiHoaDon > 0) {
          this.firstLoaiHoaDon = this.loaiHoaDonDuocSuDungs[0];
        }
      }

      if (res[1]) { // có mã
        this.isCoMaDangSuDungOrNgungSudung = res[1].trangThaiSuDung === TrangThaiSuDung2.DangSuDung || res[1].trangThaiSuDung === TrangThaiSuDung2.NgungSuDung;
        this.isCoMaKhongSuDung = res[1].trangThaiSuDung === TrangThaiSuDung2.KhongSuDung;
      }

      if (res[2]) { // không mã
        this.hiddenPhatHanhLaiTrongNgay = res[2].trangThaiSuDung === TrangThaiSuDung2.KhongSuDung || res[2].trangThaiSuDung === TrangThaiSuDung2.NgungSuDung;
      }

      // check hien thi Gửi CQT
      if (this.isKMa && res[2] && (res[2].trangThaiSuDung === TrangThaiSuDung2.DangSuDung || res[2].trangThaiSuDung === TrangThaiSuDung2.NgungSuDung)) {
        this.isShowGuiCQT = true;
      }

      this.hoSoHDDT = res[3];
      this.serials = res[4];

      if (callback) {
        callback(res[0]);
      }
    });
  }

  GetTrangThaiGuiHoaDons() {
    this.hoaDonDienTuService.GetTrangThaiGuiHoaDon().subscribe((rs: any[]) => {
      this.trangThaiGuiHoaDons = rs;
      this.displayData.TrangThaiGuiHoaDon = -1;
    })
  }

  thietLapTruongDuLieu() {
    const modal1 = this.modalService.create({
      nzTitle: 'Thiết lập trường dữ liệu',
      nzContent: ThietLapTruongDuLieuHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1100px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiTruong: LoaiTruongDuLieu.NhomBangKe,
        loaiHoaDon: LoaiHoaDon.None,
        listTruongDuLieu: this.truongDuLieuHoaDonsAll
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.LoadTruongDuLieuHoaDon(rs);
      }
    });
  }

  xuatBangKeHangHoaBanRa() {
    this.baoCaoService.ExportExcelBangKeHangHoaBanRa(this.displayData).subscribe(
      (res: any) => {
        const link = document.createElement('a');
        link.href = res.path;
        link.target = '_blank';
        link.download = `BANG_KE_HANG_HOA_BAN_RA_${moment().format("YYYY-MM-DDThh:mm:ss")}.xlsx`;
        link.click();
      },
      err => {
        this.message.error("Lỗi xuất khẩu");
        return;
      }
    );
  }

  GetTrangThaiHoaDons() {
    this.hoaDonDienTuService.GetTrangThaiHoaDon().subscribe((rs: any[]) => {
      rs.forEach((item: any) => {
        if (this.isPhieuXuatKho) {
          item.ten = item.ten.replace("Hóa đơn", 'PXK');
        }
        item.checked = true;
      });

      this.trangThaiHoaDons = rs;
      this.displayData.TrangThaiHoaDonDienTu = -1;
    })
  }

  GetTruongDuLieuHoaDon() {
    let loai = this.isPhieuXuatKho ? -100 : 0;
    this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(0, loai)
      .subscribe((rs: any[]) => {
        this.LoadTruongDuLieuHoaDon(rs);
      })
  }

  LoadTruongDuLieuHoaDon(rs: any[]) {
    this.widthConfig = ['50px'];
    this.truongDuLieuHoaDonsAll = rs;
    this.truongDuLieuHoaDons = rs.filter(x => x.hienThi === true);
    let leftColWidth = 50;
    this.truongDuLieuHoaDons.forEach((item: any) => {
      this.widthConfig.push(item.doRong + 'px');
    });

    this.truongDuLieuHoaDonFooters = [];
    this.truongDuLieuHoaDonsAll.forEach((item: any, index: any) => {
      if (item.hienThi) {
        this.mapOfTruongDuLieuHoaDons[item.tenCot] = item.tenCot;

        if (index < this.spanLeft) {
          this.mapOfLeftCol[item.tenCot] = leftColWidth + 'px';
          leftColWidth += item.doRong;
        } else {
          this.truongDuLieuHoaDonFooters.push(item);
          this.mapOfLeftCol[item.tenCot] = null;
        }
      } else {
        this.mapOfTruongDuLieuHoaDons[item.tenCot] = null;
        this.mapOfLeftCol[item.tenCot] = null;
      }
    });

    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.numberBangKeCols = Array((this.truongDuLieuHoaDons.length + 1)).fill(0);
  }

  GetTreeTrangThai() {
    this.hoaDonDienTuService.GetTreeTrangThai(this.displayData).subscribe((rs: any[]) => {
      this.treeTrangThais = rs;
      this.treeTrangThais.forEach(ele => {
        const array = this.convertTreeToList(ele);
        this.mapOfExpandedData[ele.key] = array;
      })
    })
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
        hoaDonDienTuId: item.hoaDonDienTuId
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((res: any) => {
      if (res) {
        const indexOfItem = this.listPaging.findIndex(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
        if (indexOfItem !== -1) {
          this.hoaDonDienTuService.GetTaiLieuDinhKemsById(item.hoaDonDienTuId)
            .subscribe((taiLieuKinhKems: any[]) => {
              this.listPaging[indexOfItem].taiLieuDinhKems = taiLieuKinhKems;
            });
        }
      }
    });
  }

  GetTreeTrangThaiLuyKe() {
    var displayDataTmp: HoaDonParams = {
      toDate: moment().format("YYYY-MM-DD"),
      fromDate: this.displayData.fromDate,
      LoaiHoaDon: -1,
    };
    this.hoaDonDienTuService.GetTreeTrangThai(displayDataTmp).subscribe((rs: any[]) => {
      this.treeTrangThaiLuyKes = rs;

      this.treeTrangThaiLuyKes.forEach(ele => {
        const array = this.convertTreeToList(ele);
        this.mapOfExpandedData_luyKe[ele.key] = array;
      })
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKe(this.listPaging);
    // // this.scrollConfig.y = (getHeightBangKeKhongChiTiet5()) + "px";
    // if (!this.chitietCollapse) this.scrollConfig.y = (getHeightBangKe() + 160) + "px";
    // else
    //   this.scrollConfig.y = (getHeightBangKe() - 20) + "px";

    this.scrollConfig.y = getHeightBangKeKhongChiTiet3() + 10 + "px";
  }

  createPreviewMutipleForm() {
    this.previewMutipleForm = this.fb.group({
      listIds: [],
      isTienMat: [true]
    });
  }

  LoadData(reset: boolean = false) {

    if (reset) {
      this.displayData.PageNumber = 1;
    }

    //kiểm tra nếu còn LocHoaDonDaTichChon thì lúc tải lại chỉ hiển thị đã tích chọn
    if (this.viewConditionList.filter(x => x.key == 'LocHoaDonDaTichChon').length == 1) {
      this.hienThiChiHoaDonDaChon();
      return;
    }
    this.loading = true;
    this.displayData.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;
    //gán pageindex khi bỏ lọc tích chọn để trở về trang hiển thị hiện tại của nsd đang chọn
    if (this.currentPageIndex != 1 && this.listOfSelected.length > 0) this.displayData.PageNumber = this.currentPageIndex;

    this.hoaDonDienTuService.GetAllPaging(this.displayData).subscribe((data: any) => {
      this.listPaging = data.items;
      this.listOfAllData = data.items;
      this.listOfDisplayData = data.items;
      this.tongTienThanhToan = data.tongTienThanhToan;


      this.chiTiets = [];
      this.total = data.totalCount;
      this.totalTongTienTT = 0;


      if (data.currentPage != 0) this.displayData.PageNumber = data.currentPage;
      this.displayData.PageSize = data.pageSize;
      this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
      this.displayData.HoaDonDienTuIds = data.allItemIds;

      this.pageSizeOptions = [50, 100, 150];
      //reset
      this.currentPageIndex = 1;
      // delete all
      if (this.listPaging.length === 0 && this.displayData.PageNumber > 1) {
        this.displayData.PageNumber -= 1;
        this.LoadData();
      }

      this.listPaging.forEach(x => {
        this.totalTongTienTT += x.tongTienThanhToan;
      });


      this.lstBangKeEmpty = getListEmptyBangKe1(this.listPaging);
      this.scrollConfig.x = SumwidthConfig(this.widthConfig);
      // if (!this.chitietCollapse)
      //   this.scrollConfig.y = (getHeightBangKe() + 160) + "px";
      // else
      //   this.scrollConfig.y = (getHeightBangKe() - 20) + "px";

      this.scrollConfig.y = getHeightBangKeKhongChiTiet3() + 5 + "px";

      this.refreshStatus();
      this.rowScrollerToViewEdit.scrollToRow(this.listPaging, "hoaDonDienTuId").then((result) => {
        this.selectedRow(result);
      });
      if (this.listPaging && this.listPaging.length > 0) {
        this.selectedRow(this.listPaging[0]);
      }
      // (new KiemTraBangDuLieu()).kiemTraBangCoDuLieu(data.items, this.chiTiets);

      //nếu có đăng ký sự kiện tải lại thống kê số lượng hóa đơn sai sót
      if (GlobalConstants.CallBack != null) {
        GlobalConstants.CallBack();
      }

      this.listPaging.forEach(x => {
        if (x.trangThaiQuyTrinh == TrangThaiQuyTrinh.DangKyDienTu || (x.boKyHieuHoaDon.hinhThucHoaDon != HinhThucHoaDon.KhongCoMa && x.trangThaiQuyTrinh == TrangThaiQuyTrinh.DaKyDienTu)) {
          x.resetTrangThai = moment() >= moment(x.modifyDate).add(5, "minutes");
        }
      })

      // nếu trước đó có bấm lọc đã chọn thì vẫn giữ nguyên đã chọn
      // if (this.listOfSelected.length > 0 && this.viewConditionList.filter(x => x.key == 'LocHoaDonDaTichChon').length > 0) {
      //   this.hienThiChiHoaDonDaChon();
      // }

      this.loading = false;
    }, _ => {
      this.loading = false;
    });
  }

  filterTable() {
    if (this.displayDataTemp.toDate < this.displayDataTemp.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    this.LoadData(true);
  }

  async clickAdd(type: any) {
    if (type == null) {
      this.showThongBaoKhongTonTaiBoKyHieu();
      return;
    }

    var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);

    if (listKyHieus.length === 0) {
      this.showThongBaoKhongTonTaiBoKyHieu();
      return;
    }

    if (this.hinhThucHoaDon === 0) { // không mã
      this.clickAddKhongMa(type);
      return;
    }
    let textTitle = getTenHoaDonByLoai(type) + ' (Có mã của cơ quan thuế)';
    if (type == 9 || type == 10 || type == 13 || type == 14) textTitle = getTenHoaDonByLoai(type) + ' (Có mã của cơ quan thuế khởi tạo từ máy tính tiền)';
    this.modalService.create({
      nzTitle: textTitle,
      nzContent: ChonCachLapHoaDonMoiModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '798px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiHoaDon: type,
        callBack: () => {
          this.LoadData();
        }
      },
      nzFooter: null
    });
  }

  showThongBaoKhongTonTaiBoKyHieu() {
    console.log("🚀 ~ file: tab-hoa-don-dien-tu.component.ts:891 ~ TabHoaDonDienTuComponent ~ showThongBaoKhongTonTaiBoKyHieu ~ this.isPhieuXuatKho:", this.isPhieuXuatKho)

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
        msContent: `Bạn không thể lập ${this.isPhieuXuatKho == true ? 'PXK' : 'hóa đơn'} do không tồn tại bộ ký hiệu hóa đơn có trạng thái sử dụng là <b>Đang sử dụng</b>, <b>Đã xác thực</b>. Vui lòng kiểm tra lại!`,
        msXemDanhMucBoKyHieuHoaDon: true,
        msOnOk: () => {
          this.router.navigate(['quan-ly/bo-ky-hieu-hoa-don']);
        },
        msOnClose: () => {
          this.loading = false;
        }
      },
      nzFooter: null
    });
  }

  clickAddKhongMa(type: any) {
    if (this.ActivedModal != null) return;
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
        fbEnableEdit: true
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      this.loadDataAfterAddEdit(true);
    });
  }

  chuyenThanhHoaDonThayThe(data: any) {
    if (this.ActivedModal != null) return;
    var timKiems = this.timKiemTheos;
    timKiems.forEach(x=>{
      if(x.key == 'MauSo') {
        x.hidden = true;
      }
    })
    const modal1 = this.modalService.create({
      nzTitle: `Chọn ${this.txtHD_PXK} thay thế`,
      nzContent: LapHoaDonThayTheModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isChuyenHoaDonGocThanhThayThe: true,
        timKiemTheos: timKiems,
        mauSo: data.boKyHieuHoaDon.kyHieuMauSoHoaDon,
        loaiHoaDon: data.loaiHoaDon
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.loading = true;
        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((hd: any) => {
          let lyDoThayThe = new LyDoThayThe();
          lyDoThayThe.hinhThucHoaDonCanThayThe = rs.hinhThucHoaDon;
          lyDoThayThe.thayTheChoHoaDonId = rs.hoaDonDienTuId;
          lyDoThayThe.mauSo = rs.mauSo;
          lyDoThayThe.kyHieu = rs.kyHieu;
          lyDoThayThe.isSystem = true;
          lyDoThayThe.loaiHoaDon = rs.loaiHoaDon;
          lyDoThayThe.lyDo = rs.lyDoThayThe;
          lyDoThayThe.soHoaDon = rs.soHoaDon;
          lyDoThayThe.ngayHoaDon = rs.ngayHoaDon;
          hd.lyDoThayThe = lyDoThayThe;
          if (this.ActivedModal) return;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: getTenHoaDonByLoai(hd.loaiHoaDon),
            nzContent: HoaDonDienTuModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: window.innerWidth / 100 * 90,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isAddNew: false,
              data: hd,
              loaiHD: hd.loaiHoaDon,
              lyDoThayThe: lyDoThayThe,
              isChuyenHoaDonGocThanhThayThe: true,
              fbEnableEdit: true,
              isCloseModal: true
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
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
                  msTitle: `Chuyển ${this.txtHD_PXK} thành ${this.txtHD_PXK} thay thế`,
                  msContent: `Chuyển ${this.txtHD_PXK} thành ${this.txtHD_PXK} thay thế thành công.`,
                  msOnClose: () => {
                  }
                },
                nzFooter: null
              });
            }
            // if (rs != null && lyDoThayThe.lyDo !== null) {
            //   this.modalService.create({
            //     nzContent: MessageBoxModalComponent,
            //     nzMaskClosable: false,
            //     nzClosable: false,
            //     nzKeyboard: false,
            //     nzStyle: { top: '100px' },
            //     nzBodyStyle: { padding: '1px' },
            //     nzWidth: '430px',
            //     nzComponentParams: {
            //       msMessageType: MessageType.Warning,
            //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            //       msTitle: `Kiểm tra lại`,
            //       msContent: `Chuyển ${this.txtHD_PXK} thành ${this.txtHD_PXK} thay thế không thành công.<br>Vui lòng kiểm tra lại!`,
            //       msOnClose: () => {
            //       }
            //     },
            //     nzFooter: null
            //   });

            // }

            this.LoadData();
          });
        })
      }
      this.timKiemTheos = getTimKiemTheo();
    });

  }

  async clickSua(isCopy = false, isView = false, item: any = null, callback: () => any = null) {
    if (isView == true && this.permission != true && ((!this.isPhieuXuatKho && this.thaoTacs.indexOf('HD_VIEW') < 0) || (this.isPhieuXuatKho && this.thaoTacs.indexOf('PXK_VIEW') < 0))) {
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
    if (!this.dataSelected && this.listOfSelected.length === 0) {
      if (isView) {
        this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_VIEW);
      } else {
        this.message.success(isCopy ? TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_COPY : TextGlobalConstants.TEXT_PLEASE_CHOOSE_ITEM_TO_EDIT);
      }
      return;
    }

    if (this.listOfSelected.length > 0) {
      if (this.listOfSelected.length === 1) {
        this.dataSelected = this.listOfSelected[0];
      } else {
        this.dataSelected = null;
      }
    }

    if (item == null) item = this.dataSelected;

    if (((item.boKyHieuHoaDon.hinhThucHoaDon != 2 && item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi)
      || (item.boKyHieuHoaDon.hinhThucHoaDon == 2 && item.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh)) &&
      isCopy === false) {
      if (isView === true) {
        this.viewReceipt(item);
      } else {
        if (item.boKyHieuHoaDon.hinhThucHoaDon != 2) {
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
              msContent: `Hệ thống chỉ cho phép thực hiện <strong>Sửa</strong> hóa đơn có trạng thái quy trình là <strong>Chưa ký điện tử, Ký điện tử lỗi</strong>. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
        }
        if (item.boKyHieuHoaDon.hinhThucHoaDon == 2) {
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
              msContent: `Hệ thống chỉ cho phép thực hiện <strong>Sửa</strong> hóa đơn có trạng thái quy trình là <strong>Chưa phát hành</strong>. Vui lòng kiểm tra lại!`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
        }
      }

      return;
    }

    this.rowScrollerToViewEdit.getRowToViewEdit(item.hoaDonDienTuId);

    if (isCopy) {
      var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(item.loaiHoaDon);
      if (listKyHieus.length === 0) {
        this.showThongBaoKhongTonTaiBoKyHieu();
        return;
      }
    }

    this.showModal(isCopy, item, isView, callback);
  }

  clickSuaDePhatHanhLai(data: any) {
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        const title = res.loaiHoaDon === 1 ? 'Hóa đơn GTGT' : 'Hóa đơn bán hàng';
        const modal1 = this.modalService.create({
          nzTitle: title,
          nzContent: HoaDonDienTuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isPhatHanhLai: true,
            isAddNew: false,
            data: res,
            loaiHD: res.loaiHoaDon,
            fbEnableEdit: true
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.LoadData();
        });
      });
  }

  showModal(isCopy: any, data: any, isView: any, callback: () => any = null) {
    if (isCopy == false) {
      if (this.ActivedModal != null) return;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
        .subscribe(async (res: any) => {
          if (this.ActivedModal != null) return;
          const title = getTenHoaDonByLoai(res.loaiHoaDon);
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
              bienBanDieuChinhId: res.bienBanDieuChinhId,
              fbEnableEdit: !isView,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.loadDataAfterAddEdit(false, data.hoaDonDienTuId);
              if (callback) {
                callback();
              }
            }
          });
        });
    }
    else {
      if (this.ActivedModal != null) return;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
        .subscribe(async (res: any) => {
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

          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: `${getTenHoaDonByLoai(res.loaiHoaDon)}`,
            nzContent: HoaDonDienTuModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: window.innerWidth / 100 * 90,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isCopy: true,
              isAddNew: false,
              data: res,
              loaiHD: res.loaiHoaDon,
              fbEnableEdit: true
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.loadDataAfterAddEdit(true);
              if (callback) {
                callback();
              }
            }
          });
        });
    }
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== id);
    delete this.mapOfCheckedId[id];
  }


  async clickXoa(data: any = null) {
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

    if (data == null && this.dataSelected != null) data = this.dataSelected;

    if (data) {
      var checkDaPhatSinhThongDiepTN = await this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(data.hoaDonDienTuId);

      if ((data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi && data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) || checkDaPhatSinhThongDiepTN) {
        if (this.ActivedModal != null) return;
        if (data.hinhThucHoaDon != 2) {
          const modal = this.ActivedModal = this.modalService.create({
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
              <div>- Và hóa đơn chưa phát sinh thông điệp truyền nhận với CQT</div>
              <div>Vui lòng kiểm tra lại!</div>
              `,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
          });
        }
        if (data.hinhThucHoaDon == 2) {
          const modal = this.ActivedModal = this.modalService.create({
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
              msContent: `Hệ thống chỉ cho phép thực hiện <b>Xóa</b> hóa đơn <b>Có mã từ máy tính tiền</b> có trạng thái quy trình là <b>Chưa phát hành</b>. Vui lòng kiểm tra lại`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
          });
        }

        return;
      }

      this.deleteItem(data);
    } else {
      for (const item of this.listOfSelected) {
        var checkDaPhatSinhThongDiepTN = await this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(item.hoaDonDienTuId);


        if ((item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi && item.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) || item.boKyHieuHoaDon.hinhThucHoaDon == 2 || checkDaPhatSinhThongDiepTN) {
          if (this.ActivedModal != null) return;
          if (item.hinhThucHoaDon != 2) {
            const modal = this.ActivedModal = this.modalService.create({
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
                <div>Và hóa đơn chưa phát sinh thông điệp truyền nhận với CQT</div>
                <div>Vui lòng kiểm tra lại!</div>
                `,
                msOnClose: () => {
                }
              },
              nzFooter: null
            });
            modal.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
            });
          }
          if (item.hinhThucHoaDon == 2) {
            const modal = this.ActivedModal = this.modalService.create({
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
                msContent: `Hệ thống chỉ cho phép thực hiện <b>Xóa</b> hóa đơn <b>Có mã từ máy tính tiền</b> có trạng thái quy trình là <b>Chưa phát hành</b>. Vui lòng kiểm tra lại`,
                msOnClose: () => {
                }
              },
              nzFooter: null
            });
            modal.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
            });
          }
          return;
        }
      }

      if (this.ActivedModal != null) return;
      const modal = this.ActivedModal = this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '430px',
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msOkButtonInBlueColor: false,
          msTitle: 'Xóa hóa đơn',
          msContent: TextGlobalConstants.CONFIRM_DELETE_RANGE_INVOICE,
          msOnOk: () => {
            const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
            this.hoaDonDienTuService.DeleteRangeHoaDonDienTu(this.listOfSelected)
              .subscribe((res: any[]) => {
                if (res[1].length > 0) {
                  res[1].forEach((id: any) => {
                    this.deleteCheckedItem(id);
                  });

                  this.LoadData();
                }

                if (res[0].soChungTuKhongThanhCong !== 0) {
                  showKetQuaXoaChungTuHangLoat(res[0], this.modalService);
                }

                this.message.remove(id);
              });
          },
          msOnClose: () => {
          }
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
      });
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.menuContext = true;
    this.selectedRow(data);
  }

  @HostListener('document:click', ['$event'])
  closeContextMenu(event: any) {
    if (this.menuContext == true && this.listOfSelected.length > 0) {
      this.menuContext = false;
      this.listPaging.forEach(element => {
        if (!this.listOfSelected.includes(element)) {
          element.selected = false;
        }
      });
    }
  }

  deleteItem(data: any) {
    if (this.ActivedModal != null) return;
    const modal = this.ActivedModal = this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzWidth: '430px',
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msOkButtonInBlueColor: false,
        msTitle: 'Xóa hóa đơn',
        msContent: `Bạn có thực sự muốn xóa hóa đơn này không?`,
        msOnOk: () => {
          this.hoaDonDienTuService.Delete(data.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.HoaDonDienTu,
                doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(data.loaiHoaDon),
                thamChieu: `Số hóa đơn ${data.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: data.hoaDonDienTuId,
              }).subscribe();

              this.deleteCheckedItem(data.hoaDonDienTuId);
              this.message.remove();
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
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
        }
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((res: any) => {
      this.ActivedModal = null;
      if (res) {
        this.LoadData();
      }
    });
  }

  activeTabChiTiet(event: boolean) {
    this.chitietCollapse = event;
    this.LoadData();
  }

  activeTabTimKiem(event: boolean) {
    /*
    let y = this.scrollConfig.y.slice(0, this.scrollConfig.y.length - 2);

    if (event == false) {
      this.scrollConfig.y = (parseInt(y) + 108) + "px";
    }
    else {
      this.scrollConfig.y = (parseInt(y) - 108) + "px";
    }
    */
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;
    if (this.listOfSelected.length > 0 && this.menuContext == false) {
      this.listPaging.forEach(element => {
        if (!this.listOfSelected.includes(element)) {
          element.selected = false;
        }
      });
    } else if (this.menuContext == true) {
      this.listPaging.forEach(element => {
        if (element != data && !this.listOfSelected.includes(element)) {
          element.selected = false;
        }
      });
      // this.menuContext = false;
    }
    if (this.listOfSelected.length === 0) {
      this.listPaging.forEach((element: any) => {
        if (element !== data) {
          element.selected = false;
        }
      })
    }
    // nếu là có mã hoặc chuyển bảng tổng hợp thì disable
    if (this.dataSelected.boKyHieuHoaDon && (this.dataSelected.boKyHieuHoaDon.hinhThucHoaDon === 1 || this.dataSelected.boKyHieuHoaDon.phuongThucChuyenDL === 1)) {
      this.disabledGuiCQT = true;
    } else {
      this.disabledGuiCQT = false;
    }


    this.loadingChiTiets = true;
    this.dataSelected = data;
    const selectedIndex = this.listOfSelected.findIndex(x => x.hoaDonDienTuId === data.hoaDonDienTuId);
    if (selectedIndex !== -1) {
      this.listOfSelected[selectedIndex] = data;
    }

    this.thanhTien = 0;
    this.thanhTienQuyDoi = 0;
    this.tienThueGTGT = 0;
    this.tienThueGTGTQuyDoi = 0;

    //kiểm tra enable/disable menu ThongBaoSaiThongTin
    this.checkToDisableMenuThongBaoSaiThongTin();

    // this.forkJoinChiTiet(data).subscribe((res: any[]) => {
    //   this.chiTiets = res[0].hoaDonChiTiets;
    //   this.chiTiets.forEach((item: any) => {
    //     if (item.tinhChat !== 3) {
    //       this.thanhTien += item.thanhTien;
    //       this.thanhTienQuyDoi += item.thanhTienQuyDoi;
    //       this.tienThueGTGT += item.tienThueGTGT;
    //       this.tienThueGTGTQuyDoi += item.tienThueGTGTQuyDoi;
    //     } else {
    //       this.thanhTien -= item.thanhTien;
    //       this.thanhTienQuyDoi -= item.thanhTienQuyDoi;
    //       this.tienThueGTGT -= item.tienThueGTGT;
    //       this.tienThueGTGTQuyDoi -= item.tienThueGTGTQuyDoi;
    //     }
    //   });

    //   this.truongDuLieuChiTiets = res[1].filter(x => x.hienThi === true);
    //   this.truongDuLieuChiTietFooters = [];
    //   if (this.truongDuLieuChiTiets.length > 0) {
    //     let leftColWidth = 0;
    //     this.widthConfigB = [];
    //     this.truongDuLieuChiTiets.forEach((item: any, index: any) => {
    //       this.widthConfigB.push(item.doRong + 'px');
    //       if (index < this.spanLeft) {
    //         this.mapOfLeftCol[item.tenCot] = leftColWidth + 'px';
    //         leftColWidth += item.doRong;
    //       } else {
    //         this.mapOfLeftCol[item.tenCot] = null;
    //         this.truongDuLieuChiTietFooters.push(item);
    //       }
    //     });
    //   }

    //   this.lstChiTietEmpty = getListEmptyChiTiet(this.chiTiets);
    //   this.scrollConfigB.x = SumwidthConfig(this.widthConfigB);
    //   this.numberChiTietCols = Array(this.widthConfigB.length).fill(0);
    //   this.loadingChiTiets = false;
    // });
  }

  forkJoinChiTiet(data: any) {
    return forkJoin([
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(LoaiTruongDuLieu.NhomHangHoaDichVu, data.loaiHoaDon)
    ])
  }

  sort(sort: { key: string; value: string }): void {
    this.displayData.SortKey = sort.key;
    this.displayData.SortValue = sort.value;
    this.LoadData();
  }

  exportExcel() {
    this.loading = true;
    this.hoaDonDienTuService.ExportExcelBangKe(this.displayData).subscribe(
      (res: any) => {
        this.loading = false;
        const apiURL = this.env.apiUrl + '/FilesUpload/excels/';
        const link = document.createElement('a');
        link.href = apiURL + res.path;
        link.target = '_blank';
        link.download = 'BANG_KE_HOA_DON_DIEN_TU.xlsx';
        link.click();
      }, err => {
        this.message.error("Lỗi xuất khẩu");
        return;
      }
    );
  }

  publish(item = null) {
    if (!item && this.listOfSelected.length > 1) {
      return;
    }

    if (this.dataSelected == null && this.listOfSelected.length == 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '500px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Phát hành hóa đơn',
          msContent: `Vui lòng chọn một hóa đơn để phát hành`,
        },
        nzFooter: null
      });

      return;
    }

    if (item) {
      this.publishReceipt(item);
      return;
    }
    // if(!item && this.dataSelected && this.listOfSelected.length === 0){
    //   this.publishReceipt(this.dataSelected);
    //   return;
    // }


    if (this.listOfSelected.length > 1) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '500px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Phát hành hóa đơn',
          msContent: "Vui lòng chọn một hóa đơn để phát hành",
        },
        nzFooter: null
      });
      return;
    }
    else {
      if (this.listOfSelected.length == 1) {
        if (this.listOfSelected[0])
          this.publishReceipt(this.listOfSelected[0]);
      }
      else {
        const vals = this.listPaging.filter(x => x.selected == true);
        if (vals.length == 0) return;
        var data = vals[0];
        this.publishReceipt(data);
      }
    }
  }

  PublishAllReceipt() {
    let CoMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 1 && (x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu || x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi || x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi))));
    let KhongMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon == 0 && (x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu || x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi || x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi))));
    let CoMaMTT = this.listOfSelected.filter(x => ((x.hinhThucHoaDon == 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh)));
    if (this.disabledPhatHanhDongLoat) {
      if (CoMa.length > 0) {
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
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Phát hành</strong> hóa đơn <strong>Có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử, Ký điện tử lỗi, Gửi TCTN lỗi</strong>. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });
        return;
      }
      else if (KhongMa.length > 0) {
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
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Phát hành</strong> hóa đơn <strong>Không có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử, Ký điện tử lỗi, Gửi TCTN lỗi</strong>. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });
        return;
      }
      else if (CoMaMTT.length > 0) {
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
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Phát hành</strong> hóa đơn <strong>Có mã từ máy tính tiền</strong> có trạng thái quy trình là <strong>Chưa phát hành</strong>. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });
        return;
      }
    }

    let entries = Object.entries(this.mapOfCheckedId);
    const listSelectedIdFromTab = [];
    for (const [prop, val] of entries) {
      if (val) {
        listSelectedIdFromTab.push(prop);
      }
    }

    // Gọi hàm kiểm tra so sánh thông tin của người nộp thuế;
    // việc kiểm tra này sẽ đưa ra các thông báo trước các thông báo khác khi phát hành hóa đơn.
    this.soSanhThongTinNguoiNopThueVoiMauHoaDon(listSelectedIdFromTab,
      () => // Truyền vào code callBack
      {
        const modal = this.modalService.create({
          nzTitle: "Phát hành hóa đơn đồng loạt",
          nzContent: PhatHanhHoaDonHangLoatModalComponent,
          nzMaskClosable: false,
          nzClosable: true,
          nzKeyboard: false,
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '5px', 'max-height': '89vh' },
          nzClassName: "videoHD",
          nzWidth: '100%',
          nzComponentParams: {
            listSelectedIdFromTab,
            isTuMTT: this.isPos,
            fromDate: this.displayData.fromDate,
            toDate: this.displayData.toDate
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((res: any) => {
          var com: PhatHanhHoaDonHangLoatModalComponent = modal.getContentComponent();
          var isLoaded = false;
          if (res && res.isNgungChucNangVaXemChiTiet) {
            isLoaded = true;
            this.setParamHoaDonNhoHonHoaDonDangPhatHanh(res);
            this.filterGeneral();
          }

          if (!isLoaded && com.isLoadBangKe) {
            this.LoadData();
          }
        });
      });
  }

  async publishReceipt(data: any = null, callback: () => any = null) {
    if (data.boKyHieuHoaDon.hinhThucHoaDon !== 2 && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu &&
      data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
      data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi) {
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
          msContent: `Hệ thống chỉ cho phép thực hiện <strong>Phát hành</strong> hóa đơn ` + (data.hinhThucHoaDon == 1 ? `<strong>Có mã của CQT</strong>` : `<strong>Không có mã của CQT</strong>`) + ` có trạng thái quy trình là <strong>Chưa ký điện tử, Ký điện tử lỗi, Gửi TCTN lỗi</strong>. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      return;
    }
    if (data.boKyHieuHoaDon.hinhThucHoaDon == 2 && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh) {
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
          msContent: `Hệ thống chỉ cho phép thực hiện <strong>Phát hành</strong> hóa đơn <strong>Có mã từ máy tính tiền</strong> có trạng thái quy trình là <strong>Chưa phát hành</strong>. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      return;
    }

    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe(async (res: any) => {
        if (this.ActivedModal != null) return;
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Phát hành hóa đơn",
          nzContent: PhatHanhHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 600,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: res
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs != undefined) {
            if (rs == true) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '450px',
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: 'Phát hành hóa đơn',
                  msContent: `Phát hành hóa đơn thành công`,
                },
                nzFooter: null
              });
            }

            if (rs && rs.isNgungChucNangVaXemChiTiet) {
              this.setParamHoaDonNhoHonHoaDonDangPhatHanh(rs);
            }

            this.filterGeneral();
            if (callback) {
              callback();
            }
          }
        });
      });
  }

  send(isDraft: boolean, item = null) {
    if (!(this.listOfSelected.length === 1 || this.dataSelected)) {
      return;
    }
    if (this.listOfSelected.length > 1 && item == null) {
      return;
    }

    if (this.dataSelected == null && this.listOfSelected.length == 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '500px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Gửi hóa đơn' + (isDraft ? ' nháp' : ''),
          msContent: `Vui lòng chọn một hóa đơn để gửi`,
        },
        nzFooter: null
      });

      return;
    }

    if (item) {
      this.sendReceipt(isDraft, item);
      return;
    }

    if (this.listOfSelected.length == 1) {
      this.sendReceipt(isDraft, this.listOfSelected[0]);
    } else {
      const vals = this.listPaging.filter(x => x.selected == true);
      if (vals.length == 0) return;
      var data = vals[0];
      this.sendReceipt(isDraft, data);
    }
  }

  sendReceipt(isDraft: boolean, data: any = null, callback: () => any = null) {
    if (data == null) {
      const vals = this.listPaging.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    if (isDraft) {
      // let tt = data.hinhThucHoaDon != HinhThucHoaDon.CoMaTuMayTinhTien ? 'Chưa ký điện tử' : 'Chưa phát hành';
      let textContent = '';
      if (data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) {
        if (data.boKyHieuHoaDon.hinhThucHoaDon === 0) textContent = `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Không có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử</strong>. Vui lòng kiểm tra lại!`;
        if (data.boKyHieuHoaDon.hinhThucHoaDon === 1) textContent = `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử</strong>. Vui lòng kiểm tra lại!`;
        if (data.boKyHieuHoaDon.hinhThucHoaDon == 2) textContent = `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Có mã từ máy tính tiền</strong> có trạng thái quy trình là <strong>Chưa phát hành</strong>. Vui lòng kiểm tra lại!`;

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: textContent,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => {
              return;
            }
          }
        });
        return;
      }
    } else {
      if ((data.boKyHieuHoaDon.hinhThucHoaDon == 1 && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa) || (data.trangThai == 2 && data.hinhThucHoaDon == 1)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
                - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh và Hóa đơn bị điều chỉnh</strong>.<br>
                - Và hóa đơn có trạng thái quy trình:<br>
                + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong><br>
                + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong><br>
                Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      if ((data.boKyHieuHoaDon.hinhThucHoaDon == 0 && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) || (data.trangThai == 2 && data.hinhThucHoaDon == 0)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
                - Hóa đơn có trạng thái hóa đơn là Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh và Hóa đơn bị điều chỉnh.<br>
                - Và hóa đơn có trạng thái quy trình:<br>
                + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là CQT đã cấp mã<br>
                + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là Hóa đơn hợp lệ<br>
                Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      if ((data.boKyHieuHoaDon.hinhThucHoaDon == 2 && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) || (data.trangThai == 2 && data.hinhThucHoaDon == 2)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
                - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>;<br>
                - Hóa đơn có trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>.<br>
                Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
    }

    if (this.ActivedModal != null) return;
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe(async (res: any) => {
        if (res) {
          if (this.ActivedModal != null) return;
          var title = !isDraft ? `Gửi ${this.txtHD_PXK} cho khách hàng` : `Gửi ${this.txtHD_PXK} nháp cho khách hàng`;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: title,
            nzContent: GuiHoaDonModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 600,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: res,
              loaiEmail: !this.isPhieuXuatKho ? LoaiEmail.ThongBaoPhatHanhHoaDon : LoaiEmail.ThongBaoPhatHanhPXK,
              isDraft: isDraft,
              hanhDong: title
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs != null) {
              if (rs.status) {
                // this.modalService.create({
                //   nzContent: MessageBoxModalComponent,
                //   nzMaskClosable: false,
                //   nzClosable: false,
                //   nzKeyboard: false,
                //   nzWidth: 400,
                //   nzStyle: { top: '100px' },
                //   nzBodyStyle: { padding: '1px' },
                //   nzComponentParams: {
                //     msTitle: `Gửi hóa đơn ${isDraft == true ? 'nháp' : ''} đến khách hàng`,
                //     msContent: `Đã hoàn thành việc gửi hóa đơn ${isDraft == true ? 'nháp' : ''} đến khách hàng`,
                //     msMessageType: MessageType.Info,
                //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                //     msOnClose: () => {

                //     }
                //   }
                // })
                this.message.success(`Gửi hóa đơn ${isDraft == true ? 'nháp' : ''} đến khách hàng thành công`,{
                  nzDuration : 5000
                })
                this.afterCloseGuiHoaDon(rs.isDaGuiEmailHoaDon, res);
              } else {
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
                    msContent: `Gửi hóa đơn ${isDraft == true ? 'nháp' : ''} không thành công. Vui lòng kiểm tra lại!`,
                    msMessageType: MessageType.Info,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: () => {
                      this.afterCloseGuiHoaDon(rs.isDaGuiEmailHoaDon, res);
                    }
                  }
                })
              }

              this.LoadData();
            }
            if (callback) {
              callback();
            }
          });
        }
      });
  }

  afterCloseGuiHoaDon(isDaGuiEmailHoaDon: boolean, data: any) {
    if (!isDaGuiEmailHoaDon && data.boKyHieuHoaDon.hinhThucHoaDon === 0 && data.boKyHieuHoaDon.phuongThucChuyenDL === 0 && data.trangThaiQuyTrinh === TrangThaiQuyTrinh.DaKyDienTu) {
      this.thongDiepGuiHoaDonKhongMaService.data = data;
      this.thongDiepGuiHoaDonKhongMaService.init(() => {
        this.thongDiepGuiHoaDonKhongMaService.submitForm(() => {
          this.LoadData();
        });
      });
    }
  }

  sendAllReceipts(isDraft: boolean) {
    console.log(this.listOfSelected);

    if (isDraft && this.disabledGuiBanNhap) {
      let CoMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 1 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu)));
      let KhongMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 0 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu)));
      let CoMaMTT = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh)));
      if (CoMa.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử</strong>. Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (KhongMa.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Không có mã của CQT</strong> có trạng thái quy trình là <strong>Chưa ký điện tử</strong>. Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (CoMaMTT.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 430,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ cho phép thực hiện <strong>Gửi bản nháp</strong> hóa đơn <strong>Có mã từ máy tính tiền</strong> có trạng thái quy trình là <strong>Chưa phát hành</strong>. Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
    }

    if (!isDraft && this.disabledGuiHoaDon) {
      let CoMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 1 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa) || (x.trangThai == 2)));
      let KhongMa = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 0 && x.TrangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) || (x.trangThai == 2)));
      let CoMaMTT = this.listOfSelected.filter(x => ((x.hinhThucHoaDon === 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe) || (x.trangThai == 2)));
      if (CoMa.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>.<br>
            - Và hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong><br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong><br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (KhongMa.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>.<br>
            - Và hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong><br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong><br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (CoMaMTT.length > 0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 430,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Gửi hóa đơn</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>.<br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
    }


    let entries = Object.entries(this.mapOfCheckedId);
    const listSelectedIdFromTab = [];
    for (const [prop, val] of entries) {
      if (val) {
        listSelectedIdFromTab.push(prop);
      }
    }

    const modal = this.modalService.create({
      nzTitle: isDraft ? "Gửi hóa đơn nháp đồng loạt" : "Gửi hóa đơn đồng loạt",
      nzContent: GuiHoaDonHangLoatModalComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzKeyboard: false,
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '5px', 'overflow-y': 'auto', 'max-height': '94vh' },
      nzClassName: "videoHD",
      nzWidth: '100%',
      nzComponentParams: {
        isDraft: isDraft,
        listSelectedIdFromTab,
        fromDate: this.displayData.fromDate,
        toDate: this.displayData.toDate
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((res: any) => {
      var com: GuiHoaDonHangLoatModalComponent = modal.getContentComponent();
      if (com.isLoadBangKe) {
        this.LoadData();
      }
    });
  }

  viewError(loaiHD: number, data: any) {
    if (loaiHD == 1) { // lỗi phản hồi từ CQT
      data.loadingViewError = true;
      this.hoaDonDienTuService.GetMaThongDiepInXMLSignedById(data.hoaDonDienTuId)
        .subscribe((res: any) => {
          data.maThongDiep = res.result;
          this.tabThongDiepGuiComponent.viewLoi(data, () => {
            data.loadingViewError = false;
          });
        });
    } else {
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

  view() {
    if (this.listOfSelected.length > 1) {
      this.viewAllReceipts(this.listOfSelected);
    }
    else {
      if (this.listOfSelected.length == 1) {
        this.viewReceipt(this.listOfSelected[0]);
      }
      else {
        const vals = this.listPaging.filter(x => x.selected == true);
        if (vals.length == 0) return;
        var data = vals[0];
        this.viewReceipt(data);
      }
    }
  }

  viewReceipt(data: any = null) {
    if (data == null) {
      const vals = this.listPaging.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.ConvertHoaDonToFilePDF(data).subscribe((rs: any) => {
      this.message.remove(id);

      const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
      showModalPreviewPDF(this.modalService, pathPrint, null, 'Xem hóa đơn');
    }, (err) => {
      this.message.warning("Lỗi khi xem hóa đơn");
      this.message.remove(id);
    });
  }

  async viewAllReceipts(datas: any = null) {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;

    if (datas.length == 0) {
      return;
    }
    this.displayData.HoaDonDienTus = datas;
    this.hoaDonDienTuService.SortListSelected(this.displayData)
      .subscribe((sortedList: any[]) => {
        this.hoaDonDienTuService.ViewHoaDonDongLoat(sortedList)
          .subscribe((res: any[]) => {
            const links = res.map(x => x.filePDF);
            this.hoaDonDienTuService.XemHoaDonDongLoat(links).subscribe((result: any) => {
              const link = window.URL.createObjectURL(result);
              showModalPreviewPDF(this.modalService, link);
              this.message.remove(id);
            }), err => {
              this.message.remove(id);
            }
          }), err => {
            this.message.remove(id);
          };
      });
  }

  sortArr(items: any[], sort: any[]) {
    var result = []

    sort.forEach(function (key) {
      var found = false;
      items = items.filter(function (item) {
        if (!found && item.hoaDonDienTuId == key.hoaDonDienTuId) {
          result.push(item);
          found = true;
          return false;
        } else
          return true;
      })
    })

    return result;
  }
  DownloadAllReceipt(callback: any = null) {
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Tải hóa đơn đồng loạt",
      nzContent: TaiHoaDonHangLoatModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      this.GetTreeTrangThai();
      this.GetTreeTrangThaiLuyKe();
      this.LoadData();
      if (callback) {
        callback();
      }
    });
  }

  downloadReceipt(data: any = null) {


    if (this.listOfSelected.length <= 1) {
      if (data == null) {
        const vals = this.listPaging.filter(x => x.selected == true);
        if (vals.length == 0) return;
        data = vals[0];
      }

      // if (this.listOfSelected.length == 1) {
      //   data = this.listOfSelected[0];
      // }

      if (data.trangThai === 2) { // nếu là hóa đơn xóa bỏ thì không tải
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện tải hóa đơn có trạng thái hóa đơn là <b>Hóa đơn gốc</b>, <b>Hóa đơn thay thế</b>,
            <b>Hóa đơn điều chỉnh</b> và <b>Hóa đơn bị điều chỉnh</b>. Vui lòng kiểm tra lại`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }

      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.TaiHoaDon(res).subscribe((rs: any) => {
          var fileArray = [];
          if (rs.filePDF) {
            const pathPrintPDF = this.env.apiUrl + `/${rs.filePDF}`;
            fileArray.push({ path: pathPrintPDF, fileName: rs.pdfName });
          }

          if (rs.fileXML) {
            const pathPrintXML = this.env.apiUrl + `/${rs.fileXML}`;
            fileArray.push({ path: pathPrintXML, fileName: rs.xmlName });
          }

          var fileName = `HDBK_${moment().format("DD-MM-YYYY")}_${moment().format("HHmmss")}`;
          this.downloadFile(fileArray, fileName);
          this.message.remove(id);
        }, (err) => {
          this.message.warning("Lỗi khi tải hóa đơn");
          this.message.remove(id);
        });
      });
    } else {
      if (data != null) {
        const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
          this.hoaDonDienTuService.TaiHoaDon(res).subscribe((rs: any) => {
            var fileArray = [];
            if (rs.filePDF) {
              const pathPrintPDF = this.env.apiUrl + `/${rs.filePDF}`;
              fileArray.push({ path: pathPrintPDF, fileName: rs.pdfName });
            }

            if (rs.fileXML) {
              const pathPrintXML = this.env.apiUrl + `/${rs.fileXML}`;
              fileArray.push({ path: pathPrintXML, fileName: rs.xmlName });
            }

            var fileName = `HDBK_${moment().format("DD-MM-YYYY")}_${moment().format("HHmmss")}`;
            this.downloadFile(fileArray, fileName);
            this.message.remove(id);
          }, (err) => {
            this.message.warning("Lỗi khi tải hóa đơn");
            this.message.remove(id);
          });
        });
      } else {

        const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
        this.listOfSelected.forEach(element => {
          if (element.trangThai === 2) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: 450,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: "Kiểm tra lại",
                msContent: `Hệ thống chỉ thực hiện tải hóa đơn có trạng thái hóa đơn là <b>Hóa đơn gốc</b>, <b>Hóa đơn thay thế</b>,
                <b>Hóa đơn điều chỉnh</b> và <b>Hóa đơn bị điều chỉnh</b>. Vui lòng kiểm tra lại`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => { }
              }
            })
            return;
          }
        });

        var fileArray = [];
        this.hoaDonDienTuService.TaiHoaDon_Multiple(this.listOfSelected).subscribe((rs: any[]) => {
          for (let i = 0; i < rs.length; i++) {
            if (rs[i]) {
              if (rs[i].filePDF) {
                const pathPrintPDF = this.env.apiUrl + `/${rs[i].filePDF}`;
                fileArray.push({ path: pathPrintPDF, fileName: rs[i].pdfName });
              }

              if (rs[i].fileXML) {
                const pathPrintXML = this.env.apiUrl + `/${rs[i].fileXML}`;
                fileArray.push({ path: pathPrintXML, fileName: rs[i].xmlName });
              }
            }
          }
          var fileName = `HDBK_${moment().format("DD-MM-YYYY")}_${moment().format("HHmmss")}`;
          this.downloadFile(fileArray, fileName);
          this.message.remove(id);
        }, (err) => {
          this.message.warning("Lỗi khi tải hóa đơn");
          this.message.remove(id);
        });
      }
    }
  }

  downloadFile(filesArray, fileZipName) {
    this.createZip(filesArray, fileZipName);
  }

  async createZip(files: any[], zipName: string) {
    const zip = new JSZip();
    const name = zipName + '.zip';
    // tslint:disable-next-line:prefer-for-of
    for (let counter = 0; counter < files.length; counter++) {
      const element = files[counter];
      const fileData: any = await this.sharedService.getFile(element.path);
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
      zip.file(element.fileName, b);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        saveAs(content, name);
      }
    });
  }

  convertReceipt(data: any = null, callback: () => any = null) {
    if (this.listOfSelected.length <= 1) {
      if (data == null) {
        const vals = this.listPaging.filter(x => x.selected == true);
        if (vals.length == 0) return;
        data = vals[0];
      }

      if (this.listOfSelected.length == 1) {
        data = this.listOfSelected[0];
      }

      if (data.boKyHieuHoaDon.hinhThucHoaDon == 0 && !((data.trangThaiQuyTrinh === TrangThaiQuyTrinh.HoaDonHopLe) && data.trangThai !== 2)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh và Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong>;<br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>;<br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (data.boKyHieuHoaDon.hinhThucHoaDon == 1 && (data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa || data.trangThai === 2)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh và Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong>;<br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>;<br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
      else if (data.boKyHieuHoaDon.hinhThucHoaDon == 2 && (data.trangThai === 1 || data.trangThai === 2 || data.trangThai === 3 || data.trangThai === 4) && !((data.trangThaiQuyTrinh === TrangThaiQuyTrinh.HoaDonHopLe) && data.trangThai !== 2)) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh và Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>.<br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }

      if (this.ActivedModal != null) return;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
        .subscribe(async (res: any) => {
          if (this.ActivedModal != null) return;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: "Chuyển đổi thành hóa đơn giấy",
            nzContent: ChuyenThanhHoaDonGiayModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 630,
            nzStyle: { top: '0px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: res,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.LoadData();
              if (callback) {
                callback();
              }
            }
          });

        });
    } else {
      ////////////// disable
      var chuaPHs = this.listOfSelected
        .filter(x => (x.trangThaiQuyTrinh != TrangThaiQuyTrinh.HoaDonHopLe && x.trangThaiQuyTrinh != TrangThaiQuyTrinh.CQTDaCapMa) || x.trangThai == 2);

      if (chuaPHs.length > 0) {
        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
          .subscribe(async (res: any) => {
            if (this.ActivedModal != null) return;
            const modal1 = this.ActivedModal = this.modalService.create({
              nzTitle: "Chuyển đổi thành hóa đơn giấy",
              nzContent: ChuyenThanhHoaDonGiayModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: 630,
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                data: res,
              },
              nzFooter: null
            });
            modal1.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
              if (rs) {
                this.LoadData();
                if (callback) {
                  callback();
                }
              }
            });
          });
      } else { //sửa từ phát hành hành loạt sang phát hành hóa đơn đã chọn
        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
          .subscribe(async (res: any) => {
            if (this.ActivedModal != null) return;
            const modal1 = this.ActivedModal = this.modalService.create({
              nzTitle: "Chuyển đổi thành hóa đơn giấy",
              nzContent: ChuyenThanhHoaDonGiayModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: 630,
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                data: res,
              },
              nzFooter: null
            });
            modal1.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
              if (rs) {
                this.LoadData();
                if (callback) {
                  callback();
                }
              }
            });
          });
      }
    }
  }

  ConvertAllReceipt(datas: any[] = null, callback: any = null) {
    let CoMa = datas.filter(x => x.hinhThucHoaDon == 1 && (x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa || (x.trangThai == 2)))
    let khongMa = datas.filter(x => x.hinhThucHoaDon == 0 && (x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe || (x.trangThai == 2)))
    let CoMaMTT = datas.filter(x => x.hinhThucHoaDon == 2 && (x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe || (x.trangThai == 2)))
    if (CoMa.length <= 0 && khongMa.length <= 0 && CoMaMTT.length <= 0) {
      if (this.ActivedModal != null) return;
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: "Chuyển đổi thành hóa đơn giấy",
        nzContent: ChuyenDoiHoaDonHangLoatModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '5px' },
        nzBodyStyle: { padding: '5px' },
        nzComponentParams: {
          datas: datas
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          this.LoadData();
          if (callback) {
            callback();
          }
        }
      });
    } else {
      if (CoMa.length > 0) { // trường hợp có mã
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong>;<br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ;</strong><br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      } else if (khongMa.length > 0) { //không mã
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 450,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình:<br>
            + Đối với hóa đơn Có mã của cơ quan thuế thì trạng thái quy trình là <strong>CQT đã cấp mã</strong>;<br>
            + Đối với hóa đơn Không có mã của cơ quan thuế thì trạng thái quy trình là <strong>Hóa đơn hợp lệ;</strong><br>
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      } else if (CoMaMTT.length > 0) { //có mã MTT
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 900,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Hệ thống chỉ thực hiện <strong>Chuyển đổi hóa đơn thành hóa đơn giấy</strong> khi:<br>
            - Hóa đơn có trạng thái hóa đơn là <strong>Hóa đơn gốc, Hóa đơn thay thế, Hóa đơn điều chỉnh</strong> và <strong>Hóa đơn bị điều chỉnh</strong>;<br>
            - Hóa đơn có trạng thái quy trình là <strong>Hóa đơn hợp lệ</strong>.
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          }
        })
        return;
      }
    }
  }

  RemoveDigitalSignature(item: any = null) {
    if (item == null) {
      item = this.dataSelected;
    }

    if (this.listOfSelected.length > 1 || item.blockPhatHanhLai || (item.boKyHieuHoaDon.hinhThucHoaDon === 0 && this.isCoMaDangSuDungOrNgungSudung)) {
      return;
    }

    const boKyHieu = `Ký hiệu ${item.mauSo}${item.kyHieu} số ${item.soHoaDon} ngày ${moment(item.ngayHoaDon).format('DD/MM/YYYY')}`;

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzWidth: '500',
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msOnOk: () => {
          this.clickSuaDePhatHanhLai(item);
        },
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnClose: () => {
          return;
        },
        msTitle: `Phát hành lại hóa đơn trong ngày`,
        msContent: `<div>Hóa đơn có ${boKyHieu} có hình thức hóa đơn là <strong>Có mã của cơ quan thuế</strong> đã ký điện tử và gửi đến cơ quan thuế để cấp mã.
        Hóa đơn được cơ quan thuế phản hồi là &lt;${TrangThaiQuyTrinhLabel.get(item.trangThaiQuyTrinh)}&gt;.</div>
        <div>Khi thực hiện chức năng Phát hành lại hóa đơn trong ngày thì người dùng có thể thay đổi thông tin hóa đơn đang chưa đúng theo mô tả trong
        thông điệp phản hồi của cơ quan thuế. Thông tin hóa đơn được phép thay đổi không bao gồm &lt;Ký hiệu&gt;, &lt;Số hóa đơn&gt; và &lt;Ngày hóa đơn&gt;.
        Sau khi thay đổi thông tin người dùng cần ký điện tử lại (Ngày ký điện tử luôn là ngày hiện tại) và gửi lại hóa đơn đến cơ quan thuế để cấp mã.</div><br />
        <p>Bạn có muốn tiếp tục thực hiện chức năng này?</p>`,
      },
      nzFooter: null
    });
  }

  ExportDetail() {
    if (this.ActivedModal != null) return;
    if (this.listOfSelected.length == 1) {
      var params = {
        mode: 1,
        hoaDonDienTuId: this.listOfSelected[0].hoaDonDienTuId
      }
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.ExportExcelBangKeChiTiet(params).subscribe((res: any) => {
        if (res.path != "") {
          this.message.success("Xuất khẩu thành công");
          window.open(res.path);
          this.message.remove(id);
        }
        else {
          this.message.error("Lỗi xuất khẩu")
          this.message.remove(id);
        }
      })
    }
    else if (this.listOfSelected.length > 0) {
      var params_1 = {
        mode: 1,
        hoaDonDienTuIds: this.listOfSelected.map(x => x.hoaDonDienTuId)
      }
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.ExportExcelBangKeChiTiet(params_1).subscribe((res: any) => {
        if (res.path != "") {
          this.message.success("Xuất khẩu thành công");
          window.open(res.path);
          this.message.remove(id);
        }
        else {
          this.message.error("Lỗi xuất khẩu");
          this.message.remove(id);
        }
      })
    }
    else {
      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: `Xuất khẩu chi tiết  ${this.isPhieuXuatKho ? 'PXK' : this.isPos ? 'hóa đơn' : 'hóa đơn'}`,
        nzContent: XuatKhauChiTietHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 700,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
        if (rs) {
          const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
          rs.loaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;
          this.hoaDonDienTuService.ExportExcelBangKeChiTiet(rs).subscribe((res: any) => {
            if (res.path != "") {
              this.message.success("Xuất khẩu thành công");
              window.open(res.path);
              this.message.remove(id);
            }
            else {
              this.message.error("Lỗi xuất khẩu");
              this.message.remove(id);
            }
          })
        }
      });
    }
  }

  LapBienBanHuyHoaDon(data: any = null) {
    // if ((this.permission != true && this.thaoTacs.indexOf('HD_FULL') < 0 && this.thaoTacs.indexOf('HD_CRASH') < 0) || (data && (data.trangThaiBienBanXoaBo != 0 || data.trangThaiGuiHoaDon <= 2 || data.trangThai == 4 || (data.trangThaiQuyTrinh != 3 && data.trangThaiQuyTrinh != 7 && data.trangThaiQuyTrinh != 9)))) {
    //   return;
    // }

    if ((this.permission != true && ((!this.isPhieuXuatKho && this.thaoTacs.indexOf('HD_FULL') < 0 && this.thaoTacs.indexOf('HD_CRASH') < 0) || (this.isPhieuXuatKho && this.thaoTacs.indexOf('PXK_FULL') < 0 && this.thaoTacs.indexOf('PXK_CRASH') < 0)))) {
      return;
    }

    this.tabHoaDonXoaBoComponent.ShowListLBB();

    // if (data == null) {
    //   const modalListHoaDonXoaBo = this.ActivedModal = this.modalService.create({
    //     nzTitle: "Chọn hóa đơn lập biên bản hủy hóa đơn",
    //     nzContent: ListLapBienBanHuyHoaDonComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzKeyboard: false,
    //     nzWidth: window.innerWidth / 100 * 90,
    //     nzStyle: { top: '10px' },
    //     nzBodyStyle: { padding: '1px' },
    //     nzComponentParams: {
    //       isAddNew: true
    //     },
    //     nzFooter: null
    //   });
    //   modalListHoaDonXoaBo.afterClose.subscribe((rs: any) => {
    //     this.ActivedModal = null;
    //     if (rs) {
    //       this.LoadData();
    //     }
    //   });
    // }
    // else {
    //   this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(data.hoaDonDienTuId).subscribe((rs: any) => {
    //     if (rs == null) {
    //       const modal1 = this.ActivedModal = this.modalService.create({
    //         nzTitle: "Lập biên bản hủy hóa đơn",
    //         nzContent: LapBienBanXoaBoHoaDonModalComponent,
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzKeyboard: false,
    //         nzWidth: window.innerWidth / 100 * 90,
    //         nzStyle: { top: '10px' },
    //         nzBodyStyle: { padding: '1px' },
    //         nzComponentParams: {
    //           data: data,
    //           isAddNew: true,
    //           isEdit: true,
    //           isShowFromBangKeXoaBo: true,
    //         },
    //         nzFooter: null
    //       });
    //       modal1.afterClose.subscribe((rs: any) => {
    //         this.ActivedModal = null;
    //         if (rs) {
    //           this.LoadData();
    //         }
    //       });
    //     }
    //     else {
    //       const modal1 = this.ActivedModal = this.modalService.create({
    //         nzTitle: "Lập biên bản hủy hóa đơn",
    //         nzContent: LapBienBanXoaBoHoaDonModalComponent,
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzKeyboard: false,
    //         nzWidth: window.innerWidth / 100 * 90,
    //         nzStyle: { top: '10px' },
    //         nzBodyStyle: { padding: '1px' },
    //         nzComponentParams: {
    //           data: data,
    //           formData: rs,
    //           isAddNew: false,
    //           isShowFromBangKeXoaBo: true,
    //         },
    //         nzFooter: null
    //       });
    //       modal1.afterClose.subscribe((rs: any) => {
    //         this.ActivedModal = null;
    //         if (rs) {
    //           this.LoadData();
    //         }
    //       });
    //     }
    //   })
    // }
  }

  LapHoaDonThayThe(data = null) {
    if (data == null) {
      const modal = this.modalService.create({
        nzTitle: 'Chọn hóa đơn thay thế',
        nzContent: LapHoaDonThayTheModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '90%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          timKiemTheos: this.timKiemTheos
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        if (rs) {
          //thông tư 32: const loaiHD = getLoaiLoaiHoaByMoTa(rs.mauSo);
          //chỉnh sửa theo thông tư 78
          let loaiHD = 0;
          if (rs.mauSo != null && rs.mauSo != '') {
            let value = Number(rs.mauSo);
            if (value.toString().toLowerCase() != 'nan') {
              loaiHD = value;
            }
          }

          this.addHDTT(loaiHD, {
            thayTheChoHoaDonId: rs.hoaDonDienTuId || null,
            hinhThucHoaDonCanThayThe: rs.hinhThucHoaDonCanThayThe || null,
            mauSo: rs.mauSo,
            kyHieu: rs.kyHieu,
            ngayHoaDon: rs.ngayHoaDon,
            soHoaDon: rs.soHoaDon,
            ngayXoaBo: rs.ngayXoaBo,
            loaiHoaDon: rs.loaiHoaDon,
            isSystem: rs.isSystem,
            isLapVanBanThoaThuan: rs.isLapVanBanThoaThuan
          });
        }
      });
    } else {
      if (!data.isLapHoaDonThayThe) {
        return;
      }

      this.addHDTT(data.loaiHoaDon, {
        thayTheChoHoaDonId: data.hoaDonDienTuId || null,
        hinhThucHoaDonCanThayThe: data.hinhThucHoaDonCanThayThe || null,
        mauSo: data.mauSo,
        kyHieu: data.kyHieu,
        ngayHoaDon: data.ngayHoaDon,
        soHoaDon: data.soHoaDon,
        ngayXoaBo: data.ngayXoaBo,
        loaiHoaDon: data.loaiHoaDon,
        isSystem: data.isSystem,
        isLapVanBanThoaThuan: data.isLapVanBanThoaThuan
      });
    }
  }

  LapHoaDonThayThe2() {
    this.LapHoaDonThayTheCallback(() => {
      this.LoadData();
    });
  }

  LapHoaDonThayTheCallback(callback: () => any) {

    this.boKyHieuHoaDonService.GetListForHoaDon(-1, null, null, this.displayData.LoaiNghiepVu)
      .subscribe((listKyHieus: any[]) => {
        console.log("🚀 ~ file: tab-hoa-don-dien-tu.component.ts:3239 ~ TabHoaDonDienTuComponent ~ .subscribe ~ listKyHieus:", listKyHieus)
        if (listKyHieus.length === 0) {
          this.showThongBaoKhongTonTaiBoKyHieu();
          return;
        }

        //ẩn trường loại hóa đơn khi vào trong giao diện
        let timKiemTheos2 = this.timKiemTheos.filter(x => x.value != 'LoaiHoaDon');
        const modal = this.modalService.create({
          nzTitle: 'Chọn hóa đơn thay thế',
          nzContent: LapHoaDonThayTheModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '90%',
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            timKiemTheos: timKiemTheos2
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          if (rs) {
            //thông tư 32: const loaiHD = getLoaiLoaiHoaByMoTa(rs.mauSo);
            //chỉnh sửa theo thông tư 78
            let loaiHD = rs.loaiHoaDon;
            /*
            if (rs.mauSo != null && rs.mauSo != '')
            {
              let value = Number(rs.mauSo);
              if (value.toString().toLowerCase() != 'nan')

              {
                loaiHD = value;
              }
            }
            */

            this.clickAddHDTT(loaiHD, {
              thayTheChoHoaDonId: rs.hoaDonDienTuId || null,
              hinhThucHoaDonCanThayThe: rs.hinhThucHoaDonCanThayThe || null,
              mauSo: rs.mauSo,
              kyHieu: rs.kyHieu,
              ngayHoaDon: rs.ngayHoaDon,
              soHoaDon: rs.soHoaDon,
              ngayXoaBo: rs.ngayXoaBo,
              lyDo: rs.lyDoXoaBo,
              loaiHoaDon: rs.loaiHoaDon,
              isSystem: rs.isSystem,
              isLapVanBanThoaThuan: rs.isLapVanBanThoaThuan,
              tichChonNhanBanThongTin: rs.tichChonNhanBanThongTin,
            }, () => {
              callback();
            });
          }
          this.timKiemTheos = getTimKiemTheo()

        });
      });
  }

  clickAddHDTT(type: number, lyDoThayThe: LyDoThayThe, callback: () => any) {
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
        callback();
      }
    });
  }

  addHDTT(type: number, lyDoThayThe: LyDoThayThe) {
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
        this.LoadData();
      }
    });
  }

  LapBienBanDieuChinh() {
    this.lapBBDCallback(() => {
      this.LoadData();
    });
  }

  lapBBDCallback(callback: () => any) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '55%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Khuyến nghị",
        msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
        <span class="clsspan">“Trường hợp hóa đơn điện tử đã lập có sai sót <strong>(Hóa đơn điện tử có mã của cơ quan thuế hoặc hóa đơn điện tử không có mã của cơ quan thuế đã gửi cho người mua mà người mua hoặc người bán phát hiện có sai sót)</strong> và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP , sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
        Theo đó:<br>
        1-Khi hóa đơn gốc (Ví dụ: <strong class="cssred">hóa đơn số 1</strong>) nếu đã gửi người mua nhưng phát hiện có sai sót và người bán đã chọn xử lý theo hình thức điều chỉnh (Lập <strong class="cssred">hóa đơn số 2</strong> để điều chỉnh) thì không được tiếp tục xử lý theo hình thức thay thế.<br>
        2-Nếu hóa đơn điều chỉnh (<strong class="cssred">hóa đơn số 2</strong>) và tiếp tục có sai sót thì người bán:<br>
        2.1-Không hủy hoá đơn điều chỉnh; Không xóa bỏ hóa đơn điều chỉnh để lập hóa đơn thay thế cho hóa đơn điều chỉnh; Không lập hóa đơn điều chỉnh (<strong class="cssred">hóa đơn số 3</strong>) để điều chỉnh hóa đơn điều chỉnh<br>
        2.2-Xác định giá trị sai sót cần tiếp tục điều chỉnh:<br>
        <div class="box-border1">Giá trị sai sót = Giá trị của hóa đơn gốc (hóa đơn số 1) + Giá trị của hóa đơn điều chỉnh (hóa đơn số 2) - Giá trị hóa đơn mà người bán xác định là giá trị đúng</div>
        2.3-Lập hóa đơn điều chỉnh mới (<strong class="cssred">hóa đơn số 3</strong>) để điều chỉnh hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>), giá trị điều chỉnh là giá trị sai sót đã xác định ở bước 2.2. (Lưu ý: Điều chỉnh chi tiết từng nội dung hàng hóa, dịch vụ bị sai sót)<br>
        3-Nếu tiếp tục phát hiện hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>) hoặc các hóa đơn điều chỉnh đã lập trước đó (hóa đơn số 2, 3, ...) thì lặp lại bước 2 để xử lý giá trị sai sót theo hình thức điều chỉnh cho hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>).<br>
        <strong class="cssbrown">Khuyến nghị người bán xử lý hóa đơn đã lập có sai sót theo hình thức thay thế.</strong><br>
        Bạn có muốn tiếp tục chọn xử lý hóa đơn đã lập có sai sót theo hình thức điều chỉnh không?
        `,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOkButtonInBlueColor: true,
        msOkButtonContinueIcon: true,
        msOnOk: () => {
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: 'Chọn hóa đơn lập biên bản điều chỉnh',
            nzContent: LapBienBanHoaDonDieuChinhModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '90%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isBienBan: true
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            if (rs) {
              this.hoaDonDienTuService.GetAllListHoaDonLienQuan(rs.hoaDonDienTuId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((res: any[]) => {
                const modal = this.ActivedModal = this.modalService.create({
                  nzTitle: 'Biên bản điều chỉnh hóa đơn',
                  nzContent: AddEditBienBanDieuChinhModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '100%',
                  nzStyle: { top: '0px' },
                  nzBodyStyle: { padding: '1px', height: '96%' },
                  nzComponentParams: {
                    isAddNew: true,
                    hoaDonBiDieuChinh: rs,
                    hoaDonLienQuan: res,
                    hoaDonDieuChinhId: res && res.length > 0 ? res[0].hoaDonDienTuId : null,
                    isMoTrenGD: true,
                    isFromGP: true
                  },
                  nzFooter: null
                });
                modal.afterClose.subscribe((rs2: any) => {
                  this.ActivedModal = null;
                  if (rs2) {
                    callback();
                  }
                });
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

  LapHoaDonDieuChinh(callback: () => any) {
    this.lapHoaDonDieuChinhCallback(() => {
      callback();
    });
  }

  lapHoaDonDieuChinhCallback(callback: () => any) {
    this.boKyHieuHoaDonService.GetListForHoaDon(-1, null, null, this.displayData.LoaiNghiepVu)
      .subscribe((listKyHieus: any[]) => {
        if (listKyHieus.length === 0) {
          this.showThongBaoKhongTonTaiBoKyHieu();
          return;
        }

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '55%',
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Khuyến nghị",
            msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
          <span class="clsspan">“Trường hợp hóa đơn điện tử đã lập có sai sót <strong>(Hóa đơn điện tử có mã của cơ quan thuế hoặc hóa đơn điện tử không có mã của cơ quan thuế đã gửi cho người mua mà người mua hoặc người bán phát hiện có sai sót)</strong> và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP , sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
          Theo đó:<br>
          1-Khi hóa đơn gốc (Ví dụ: <strong class="cssred">hóa đơn số 1</strong>) nếu đã gửi người mua nhưng phát hiện có sai sót và người bán đã chọn xử lý theo hình thức điều chỉnh (Lập <strong class="cssred">hóa đơn số 2</strong> để điều chỉnh) thì không được tiếp tục xử lý theo hình thức thay thế.<br>
          2-Nếu hóa đơn điều chỉnh (<strong class="cssred">hóa đơn số 2</strong>) và tiếp tục có sai sót thì người bán:<br>
          2.1-Không hủy hoá đơn điều chỉnh; Không xóa bỏ hóa đơn điều chỉnh để lập hóa đơn thay thế cho hóa đơn điều chỉnh; Không lập hóa đơn điều chỉnh (<strong class="cssred">hóa đơn số 3</strong>) để điều chỉnh hóa đơn điều chỉnh<br>
          2.2-Xác định giá trị sai sót cần tiếp tục điều chỉnh:<br>
          <div class="box-border1">Giá trị sai sót = Giá trị của hóa đơn gốc (hóa đơn số 1) + Giá trị của hóa đơn điều chỉnh (hóa đơn số 2) - Giá trị hóa đơn mà người bán xác định là giá trị đúng</div>
          2.3-Lập hóa đơn điều chỉnh mới (<strong class="cssred">hóa đơn số 3</strong>) để điều chỉnh hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>), giá trị điều chỉnh là giá trị sai sót đã xác định ở bước 2.2. (Lưu ý: Điều chỉnh chi tiết từng nội dung hàng hóa, dịch vụ bị sai sót)<br>
          3-Nếu tiếp tục phát hiện hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>) hoặc các hóa đơn điều chỉnh đã lập trước đó (hóa đơn số 2, 3, ...) thì lặp lại bước 2 để xử lý giá trị sai sót theo hình thức điều chỉnh cho hóa đơn gốc (<strong class="cssred">hóa đơn số 1</strong>).<br>
          <strong class="cssbrown">Khuyến nghị người bán xử lý hóa đơn đã lập có sai sót theo hình thức thay thế.</strong><br>
          Bạn có muốn tiếp tục chọn xử lý hóa đơn đã lập có sai sót theo hình thức điều chỉnh không?
          `,
            msMessageType: MessageType.ConfirmBeforeSubmit,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOkButtonContinueIcon: true,
            msOkButtonInBlueColor: true,
            msOnOk: () => {
              const modal = this.ActivedModal = this.modalService.create({
                nzTitle: 'Chọn hóa đơn bị điều chỉnh',
                nzContent: LapBienBanHoaDonDieuChinhModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: '90%',
                nzStyle: { top: '10px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  isBienBan: false
                },
                nzFooter: null
              });
              modal.afterClose.subscribe((rs: any) => {
                if (rs) {
                  //const loaiHD = getLoaiLoaiHoaByMoTa(rs.mauSo);
                  //chỉnh sửa theo thông tư 78
                  let loaiHD = 0;
                  if (rs.loaiApDungHoaDonDieuChinh == 1 && rs.mauSo != null && rs.mauSo != '') {
                    let value = Number(rs.mauSo);
                    if (value.toString().toLowerCase() != 'nan') {
                      loaiHD = value;
                    }
                  }
                  else loaiHD = rs.loaiHoaDon;

                  this.clickAddHDDC(loaiHD, {
                    dieuChinhChoHoaDonId: rs.hoaDonDienTuId || null,
                    hinhThucHoaDonBiDieuChinh: rs.hinhThucHoaDonBiDieuChinh || null,
                    mauSo: rs.mauSo,
                    kyHieu: rs.kyHieu,
                    ngayHoaDon: rs.ngayHoaDon,
                    soHoaDon: rs.soHoaDon,
                    lyDo: null,
                    maTraCuu: rs.maTraCuu || null,
                    isSystem: true,
                    isLapVanBanThoaThuan: rs.isLapVanBanThoaThuan,
                    isMoTrenGD: true,
                    loaiTienId: rs.loaiTienId
                  }, rs.bienBanDieuChinhId, () => {
                    callback();
                  });
                }
              });
            },
            msOnCancel: () => {
              return;
            }
          },
        });
      });
  }

  clickAddHDDC(type: number, lyDoDieuChinh: LyDoDieuChinh, bienBanDieuChinhId = null, callback: () => any) {
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
        lyDoDieuChinh,
        bienBanDieuChinhId
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      callback();
    });
  }

  viewHistory(data: any = null) {
    if (data == null) {
      const vals = this.listPaging.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    if (this.ActivedModal != null) return;
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        if (this.ActivedModal != null) return;
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Xem nhật ký",
          nzContent: XemLichSuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: res,
            isPhieuXuatKho: this.isPhieuXuatKho
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      });
  }

  viewLichSuTruyenNhan(data: any = null) {
    if (data == null) {
      const vals = this.listPaging.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    if (this.ActivedModal != null) return;
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe(async (res: any) => {
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
            data: [res],
            showForm: true,
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      });
  }
  // Checkbox
  refreshStatus(): void {
    this.dataSelected = null;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.hoaDonDienTuId]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.hoaDonDienTuId]) && !this.isAllDisplayDataChecked;

    this.listPaging.forEach((item: any) => {
      if (this.listOfSelected.includes(item)) {
        item.selected = false;
      }

    });

    let entries = Object.entries(this.mapOfCheckedId);
    for (const [prop, val] of entries) {
      const item = this.listOfDisplayData.find(x => x.hoaDonDienTuId === prop);
      const selectedIndex = this.listOfSelected.findIndex(x => x.hoaDonDienTuId === prop);
      const index = this.listPaging.findIndex(x => x.hoaDonDienTuId === prop);

      if (val) {
        if (item != undefined) {
          if (selectedIndex === -1) {
            this.listOfSelected.push(item);
            this.selectedRow(item)
          } else {
            this.listOfSelected[selectedIndex] = item;
          }
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

    if (this.listOfSelected.length === 1) {
      this.dataSelected = this.listOfSelected[0];

      // nếu là có mã hoặc chuyển bảng tổng hợp thì disable
      if (this.dataSelected.boKyHieuHoaDon && (this.dataSelected.boKyHieuHoaDon.hinhThucHoaDon === 1 || this.dataSelected.boKyHieuHoaDon.phuongThucChuyenDL === 1)) {
        this.disabledGuiCQT = true;
      } else {
        this.disabledGuiCQT = false;
      }
    } else {
      this.disabledGuiCQT = true;
    }

    this.disabledPhatHanhDongLoat = this.listOfSelected
      .some(x => !((x.hinhThucHoaDon !== 2 && (x.trangThaiQuyTrinh === TrangThaiQuyTrinh.ChuaKyDienTu || x.trangThaiQuyTrinh === TrangThaiQuyTrinh.KyDienTuLoi || x.trangThaiQuyTrinh === TrangThaiQuyTrinh.GuiTCTNLoi))
        || (x.hinhThucHoaDon === 2 && x.trangThaiQuyTrinh === TrangThaiQuyTrinh.ChuaPhatHanh)));

    this.disabledGuiHoaDon = this.listOfSelected.some(x => ((x.hinhThucHoaDon === 1 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa)
      || (x.hinhThucHoaDon === 0 && x.TrangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe)
      || (x.hinhThucHoaDon === 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.HoaDonHopLe)
      || (x.trangThai == 2)));
    this.disabledGuiBanNhap = this.listOfSelected.some(x => ((x.hinhThucHoaDon !== 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu)
      || (x.hinhThucHoaDon === 2 && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh)));

  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.hoaDonDienTuId] = value));
    this.refreshStatus();
  }

  changeKy(event: any) {
    SetDate(event, this.displayDataTemp);
  }
  clickXem() {

  }
  clickThem() {

  }
  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }
  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }


    return array;
  }

  collapse(array: any[], data: any, $event: boolean): void {
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

  visitNode(node: any, hashMap: { [key: number]: boolean }, array: any[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  filterGeneral() {
    this.filterGeneralVisible = false;
    this.displayData = this.displayDataTemp;
    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;

    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;
    this.displayDataTemp = Object.assign({}, this.displayDataRaw);
    this.displayData = Object.assign({}, this.displayDataRaw);
    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    this.trangThaiHoaDons.forEach((item: any) => {
      item.checked = true;
    })


    this.loadViewConditionList();
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Ngày hóa đơn: ', value: GetTenKy(this.displayData.Ky) });
    if (this.displayData.HinhThucHoaDon !== -1) {
      this.viewConditionList.push({ key: 'HinhThucHoaDon', label: 'Hình thức hóa đơn: ', value: this.hinhThucHoaDons.find(x => x.key === this.displayData.HinhThucHoaDon).value });
    }

    if (!this.displayData.TrangThaiHoaDonDienTus.some(x => x === -1)) {
      this.viewConditionList.push({ key: 'TrangThaiHoaDonDienTu', label: 'Trạng thái hóa đơn: ', value: this.getNameOfTrangThaiHoaDonFilter() });
    }
    if (this.displayData.UyNhiemLapHoaDon !== -1) {
      this.viewConditionList.push({ key: 'UyNhiemLapHoaDon', label: 'Ủy nhiệm lập hóa đơn: ', value: this.uyNhiemLapHoaDons.find(x => x.key === this.displayData.UyNhiemLapHoaDon).value });
    }
    if (!this.displayData.TrangThaiPhatHanhs.some(x => x === -1)) {
      this.viewConditionList.push({ key: 'TrangThaiPhatHanh', label: 'Trạng thái quy trình: ', value: this.getNameOfTrangThaiQuyTrinhFilter() });
    }
    if (this.displayData.LoaiHoaDon !== -1) {
      this.viewConditionList.push({ key: 'LoaiHoaDon', label: 'Loại hóa đơn: ', value: this.loaiHoaDons.find(x => x.key === this.displayData.LoaiHoaDon).value });
    }
    if (this.displayData.TrangThaiGuiHoaDon !== -1) {
      this.viewConditionList.push({ key: 'TrangThaiGuiHoaDon', label: 'Trạng thái gửi hóa đơn: ', value: this.trangThaiGuiHoaDons.find(x => x.trangThaiId === this.displayData.TrangThaiGuiHoaDon).ten });
    }
    if (localStorage.getItem('TuDongLocHoaDonCoSaiSot') == 'true' || this.displayDataTemp.LocHoaDonCoSaiSotChuaLapTBao04) {
      this.viewConditionList.push({ key: 'TuDongLocHoaDonCoSaiSot', label: 'Thông báo hóa đơn điện tử có sai sót: ', value: 'Chưa lập thông báo' });
      localStorage.setItem('TuDongLocHoaDonCoSaiSot', 'false');
    }
    if (this.displayDataTemp.LocHoaDonYeuCauHuy) {
      this.viewConditionList.push({ key: 'LocHoaDonYeuCauHuy', label: 'Loại chứng từ: ', value: 'BKPOS Bách Khoa yêu cầu xóa bỏ' });
    }


    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.displayData.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        var isDate = moment(item.colValue, 'YYYY-MM-DD', true).isValid();

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
      case 'HinhThucHoaDon':
        this.displayDataTemp.HinhThucHoaDon = -1;
        break;
      case 'TrangThaiHoaDonDienTu':
        this.displayDataTemp.TrangThaiHoaDonDienTus = this.displayDataTemp.TrangThaiHoaDonDienTus.filter(x => x !== filter.value);
        if (this.displayDataTemp.TrangThaiHoaDonDienTus.length === 0) {
          this.displayDataTemp.TrangThaiHoaDonDienTus = [-1];
          isAll = true;
        }

        this.trangThaiHoaDons.forEach((item: any) => {
          item.checked = isAll || this.displayDataTemp.TrangThaiHoaDonDienTus.some(x => x === item.trangThaiId);
        });
        break;
      case 'UyNhiemLapHoaDon':
        this.displayDataTemp.UyNhiemLapHoaDon = -1;
        break;
      case 'TrangThaiPhatHanh':
        this.displayDataTemp.TrangThaiPhatHanhs = this.displayDataTemp.TrangThaiPhatHanhs.filter(x => x !== filter.value);
        var isAll = false;
        if (this.displayDataTemp.TrangThaiPhatHanhs.length === 0) {
          this.displayDataTemp.TrangThaiPhatHanhs = [-1];
          isAll = true;
        }

        this.trangThaiQuyTrinhs.forEach((item: any) => {
          item.checked = isAll || this.displayDataTemp.TrangThaiPhatHanhs.some(x => x === item.key);
        });
        break;
      case 'LoaiHoaDon':
        this.displayDataTemp.LoaiHoaDon = -1;
        break;
      case 'TrangThaiGuiHoaDon':
        this.displayDataTemp.TrangThaiGuiHoaDon = -1;
        break;
      case 'TuDongLocHoaDonCoSaiSot':
        this.displayDataTemp.LocHoaDonCoSaiSotChuaLapTBao04 = false;
        break;
      case 'LocHoaDonYeuCauHuy':
        this.displayDataTemp.LocHoaDonYeuCauHuy = false;
        var snapshot = this.activatedRoute.snapshot;
        const params = { ...snapshot.queryParams };
        delete params.yeucauhuy
        this.router.navigate([], { queryParams: params });
        break;
      default:
        break;
    }
    const idxdisplayData = this.displayDataTemp.filterColumns.findIndex(x => x.colKey === filter.key);
    this.displayDataTemp.filterColumns.splice(idxdisplayData, 1);
    const idx = this.viewConditionList.findIndex(x => x.key === filter.key);
    this.viewConditionList.splice(idx, 1);
    this.mapOfHightlightFilter[filter.key] = false;
    this.displayData = Object.assign({}, this.displayDataTemp);
    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;

    this.loadViewConditionList();
  }

  onFilterCol(rs: any) {
    const filterColData = this.displayData.filterColumns.find(x => x.colKey === rs.colKey);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    //remove
    if (rs.status == false) {
      this.displayData.filterColumns = [];
      this.viewConditionList = [];
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
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

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
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

    this.LoadData(true);
  }

  sendDataHoaDon(loaiThongDiep: MLTDiep, callback: () => any = null) {
    let modalTitle: string;

    switch (loaiThongDiep) {
      case MLTDiep.TDGHDDTTCQTCapMa:
        modalTitle = 'Gửi dữ liệu hóa đơn điện tử để cấp mã';
        break;
      case MLTDiep.TDCDLHDKMDCQThue:
        // if (!this.dataSelected || this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.DaKyDienTu) {
        //   return;
        // }
        modalTitle = 'Gửi dữ liệu hóa đơn điện tử không mã';
        break;
      case MLTDiep.TDCBTHDLHDDDTDCQThue:
        modalTitle = 'Gửi dữ liệu hóa đơn điện tử không mã dưới dạng bảng tổng hợp dữ liệu';
        break;
      default:
        break;
    }

    if (loaiThongDiep == MLTDiep.TDCBTHDLHDDDTDCQThue) {
      const modal = this.modalService.create({
        nzTitle: modalTitle,
        nzContent: AddEditBangTongHopDuLieuModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '5px' },
        nzComponentParams: {
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.LoadData();
          if (callback) {
            callback();
          }
        }
      });
    } else {
      if (this.disabledGuiCQT) {
        return;
      }

      if (!this.isChuyenDayDuNoiDungTungHoaDon) {
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
            msContent: `Bạn không thực hiện được chức năng này do không đăng ký hoặc đã ngừng đăng ký gửi dữ liệu hóa đơn đến cơ quan thuế
            quan phương thức <b>Chuyển đầy đủ nội dung từng hóa đơn</b>. Vui lòng kiểm tra lại!`,
            msOnClose: () => { }
          },
          nzFooter: null
        });
        return;
      }

      if (this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.DaKyDienTu &&
        this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiTCTNLoi &&
        this.dataSelected.trangThaiQuyTrinh !== TrangThaiQuyTrinh.GuiLoi) {
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
            msContent: 'Đối với hình thức hóa đơn <b>Không có mã của của cơ quan thuế</b>, hệ thống chỉ cho phép thực hiện gửi dữ liệu hóa đơn đến cơ quan thuế qua phương thức <b>Chuyển đầy đủ nội dung từng hóa đơn</b> khi hóa đơn có trạng thái quy trình là <b>Đã ký điện tử</b>, <b>Gửi TCTN lỗi</b> và <b>Gửi CQT có lỗi</b>. Vui lòng kiểm tra lại!',
            msOnClose: () => { }
          },
          nzFooter: null
        });
        return;
      }

      const modal = this.modalService.create({
        nzTitle: modalTitle,
        nzContent: ThongDiepGuiDuLieuHddtModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 600,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          loaiThongDiep,
          data: this.dataSelected
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.listOfSelected = [];
          this.mapOfCheckedId = {};
          this.LoadData();
          if (callback) {
            callback();
          }
        }
      });
    }
  }

  public get loaiThongDiep(): typeof MLTDiep {
    return MLTDiep;
  }

  public get trangThaiQuyTrinh(): typeof TrangThaiQuyTrinh {
    return TrangThaiQuyTrinh;
  }

  public get loaiHoaDon(): typeof LoaiHoaDon {
    return LoaiHoaDon;
  }

  //mở form gửi thông báo sai sót ko cần lập hóa đơn
  thongBaoSaiSotKhongLapHoaDon() {
    if (this.dataSelected == null || this.disableMenuThongBaoSaiThongTin) return;
    this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs) {
        this.isDaGuiThongBao = rs.isDaGuiThongBao;
        this.isDaLapThongBao = rs.isDaLapThongBao;
      }
      if (rs != null && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
        if (!rs.isDaLapThongBao) {
          //nếu chưa lập thông báo
          let mauHoaDon = this.dataSelected.mauSo;
          let kyHieuHoaDon = this.dataSelected.kyHieu;
          let soHoaDon = this.dataSelected.soHoaDon;
          let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
          let cauThongBao = 'Hóa đơn có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Thông báo sai sót không lập lại hóa đơn. Vui lòng kiểm tra lại!';
          // let hoaDonDieuChinh = rs.hoaDonDieuChinh;
          // if (hoaDonDieuChinh != null) //nếu != null thì là thông báo cho hóa đơn bị điều chỉnh
          // {
          //   let ngayHoaDonDieuChinh = '';
          //   if (hoaDonDieuChinh.ngayHoaDon != null && hoaDonDieuChinh.ngayHoaDon != '') {
          //     ngayHoaDonDieuChinh = moment(hoaDonDieuChinh.ngayHoaDon).format('DD/MM/YYYY');
          //   }
          //   cauThongBao = 'Hóa đơn có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót được xử lý theo hình thức <b>Lập hóa đơn điều chỉnh</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> cho lần điều chỉnh gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + hoaDonDieuChinh.mauSoHoaDon + hoaDonDieuChinh.kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + hoaDonDieuChinh.soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDonDieuChinh + '</b></span>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh cho lần điều chỉnh này. Vui lòng kiểm tra lại!';
          // }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msHasThongBaoSaiSot: true,
              msButtonLabelThongBaoSaiSot: 'Lập và gửi thông báo hóa đơn điện tử có sai sót tại đây',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: cauThongBao,
              msOnLapThongBaoSaiSot: () => {
                if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0) {
                  this.userService.getAdminUser().subscribe((rs: any[]) => {
                    let content = '';
                    if (rs && rs.length > 0) {
                      content = `
                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                    }
                    else {
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
                        msOnClose: () => {
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  });
                }
                else {
                  let modal = this.modalService.create({
                    nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: '100%',
                    nzStyle: { top: '0px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      loaiThongBao: 1, //để mặc định, vì các hóa đơn hệ thống là 1
                      lapTuHoaDonDienTuId: this.dataSelected.hoaDonDienTuId,
                      isTraVeThongDiepChung: true
                    },
                    nzFooter: null
                  });
                  modal.afterClose.subscribe((rs: any) => {
                    if (rs) {
                      GlobalConstants.ThongDiepChungId = rs;
                      window.location.href = "quan-ly/thong-diep-gui";
                    }
                  });
                }
              }
            },
            nzFooter: null
          });
          return;
        }
        if (rs.isDaLapThongBao && !rs.isDaGuiThongBao) {
          //nếu đã lập thông báo nhưng chưa gửi CQT
          let mauHoaDon = this.dataSelected.mauSo;
          let kyHieuHoaDon = this.dataSelected.kyHieu;
          let soHoaDon = this.dataSelected.soHoaDon;
          let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
          let cauThongBao = 'Hóa đơn có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> đã thực hiện lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Thông báo sai sót không lập lại hóa đơn. Vui lòng kiểm tra lại!';
          let hoaDonDieuChinh = rs.hoaDonDieuChinh;
          // if (hoaDonDieuChinh != null) //nếu != null thì là thông báo cho hóa đơn bị điều chỉnh
          // {
          //   let ngayHoaDonDieuChinh = '';
          //   if (hoaDonDieuChinh.ngayHoaDon != null && hoaDonDieuChinh.ngayHoaDon != '') {
          //     ngayHoaDonDieuChinh = moment(hoaDonDieuChinh.ngayHoaDon).format('DD/MM/YYYY');
          //   }
          //   cauThongBao = 'Hóa đơn có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót được xử lý theo hình thức <b>Lập hóa đơn điều chỉnh</b> đã thực hiện lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> cho lần điều chỉnh gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class = "colorChuYTrongThongBao"><b>' + hoaDonDieuChinh.mauSoHoaDon + hoaDonDieuChinh.kyHieuHoaDon + '</b></span> số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + hoaDonDieuChinh.soHoaDon + '</b></span> ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDonDieuChinh + '</b></span> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh cho lần điều chỉnh này. Vui lòng kiểm tra lại!';
          // }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msHasThongBaoSaiSot: true,
              msButtonLabelThongBaoSaiSot: 'Gửi thông báo hóa đơn điện tử có sai sót tại đây',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: cauThongBao,
              msOnLapThongBaoSaiSot: () => {
                if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0) {
                  this.userService.getAdminUser().subscribe((rs: any[]) => {
                    let content = '';
                    if (rs && rs.length > 0) {
                      content = `
                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                    }
                    else {
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
                        msOnClose: () => {
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  });
                }
                //chưa lập thì mở thêm 04
                else {
                  const modal = this.modalService.create({
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
                      isTraVeThongDiepChung: true,
                      thongDiepGuiCQTId: this.dataSelected.thongDiepGuiCQTId
                    },
                    nzFooter: null
                  });
                  modal.afterClose.subscribe((rs: any) => {
                    if (rs) {
                      GlobalConstants.ThongDiepChungId = rs;
                      window.location.href = "quan-ly/thong-diep-gui";
                    }
                  });
                }
              }
            },
            nzFooter: null
          });

          return;
        }
      }
      else {
        this.hoaDonDienTuService.GetById(this.dataSelected.hoaDonDienTuId)
          .subscribe(async (res: any) => {
            const modal = this.modalService.create({
              nzTitle: `Gửi thông báo ${this.txtHD_PXK} có thông tin sai sót không phải lập lại ${this.txtHD_PXK} cho khách hàng`,
              nzContent: GuiTBaoSaiSotKhongPhaiLapHDonModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: 600,
              nzStyle: { top: '10px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                data: res,
                isPhieuXuatKho: this.isPhieuXuatKho,
                isPos: this.isPos
              },
              nzFooter: null
            });
            modal.afterClose.subscribe((rs: any) => {
              if (rs) {
              }
            });
          });
      }
    });
  }

  //hàm này kiểm tra để enable/disable menu thông báo sai thông tin
  checkToDisableMenuThongBaoSaiThongTin() {
    if (this.dataSelected == null) return true;
    let res = this.isPos == true ? (this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == false && this.dataSelected.trangThaiGuiHoaDonMTT >= 3 || this.dataSelected.trangThaiGuiHoaDon >= 3 || this.dataSelected.isXacNhanDaGuiHDChoKhachHang == true) : (this.dataSelected.trangThaiGuiHoaDonMTT >= 3 || this.dataSelected.trangThaiGuiHoaDon >= 3 || this.dataSelected.isXacNhanDaGuiHDChoKhachHang == true);
    let ketQua = (this.dataSelected.trangThai == 1 || this.dataSelected.trangThai == 3 || this.dataSelected.trangThai == 4 || this.dataSelected.daBiDieuChinh) &&
      ((this.dataSelected.hinhThucHoaDon == 1 && this.dataSelected.trangThaiQuyTrinh == 9) || ((this.dataSelected.hinhThucHoaDon == 2 && this.dataSelected.trangThaiQuyTrinh == 11)) ||
        (this.dataSelected.hinhThucHoaDon == 0 && ((this.dataSelected.boKyHieuHoaDon.phuongThucChuyenDL == 0 && this.dataSelected.trangThaiQuyTrinh == 11))))
    this.disableMenuThongBaoSaiThongTin = ((ketQua == false) || (res == false));

    if (this.dataSelected.thongBaoSaiSot != null) {
      if (this.dataSelected.phanLoaiHDSaiSot == 4) { // đã gửi
        this.disableMenuThongBaoSaiThongTin = false
      } else { //nếu là chưa gửi
        if (this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == false) {
          this.disableMenuThongBaoSaiThongTin = false
        } else {
          this.nhatKyGuiEmailService.KiemTraDaGuiEmailChoKhachHang(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              this.disableMenuThongBaoSaiThongTin = ((ketQua == false) || (res == false));
            } else {
              this.disableMenuThongBaoSaiThongTin = !this.dataSelected.isXacNhanDaGuiHDChoKhachHang;
            }
          })
        }
      }
    } else {
      if (this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == true) {
        this.nhatKyGuiEmailService.KiemTraDaGuiEmailChoKhachHang(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
          console.log(rs);
          if (rs) {
            this.disableMenuThongBaoSaiThongTin = ((ketQua == false) || (res == false));
          } else {
            this.disableMenuThongBaoSaiThongTin = !this.dataSelected.isXacNhanDaGuiHDChoKhachHang;
          }
        })
      }
    }
  }

  viewDetilReceipt(data: any) {
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        const title = getTenHoaDonByLoai(res.loaiHoaDon);
        const modal1 = this.modalService.create({
          nzTitle: title,
          nzContent: HoaDonDienTuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isAddNew: false,
            data: res,
            loaiHD: res.loaiHoaDon,
            fbEnableEdit: false,
            isView: true,
            viewDetail: true,
            bienBanDieuChinhId: res.bienBanDieuChinhId
          },
          nzFooter: null
        });
      });
  }

  XoaBoHoaDon(data: any) {
    this.tabHoaDonXoaBoComponent.ShowListHoaDonXoaBo(() => {
      this.LoadData();
    });
    // let isView = false;

    // if (data && data.trangThai == 2) {
    //   isView = true;
    // }

    // const modal1 = this.ActivedModal = this.modalService.create({
    //   nzTitle: "Xóa bỏ hóa đơn",
    //   nzContent: XoaBoHoaDonModalComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzKeyboard: false,
    //   nzWidth: window.innerWidth / 100 * 45,
    //   nzStyle: { top: '10px' },
    //   nzBodyStyle: { padding: '1px' },
    //   nzComponentParams: {
    //     isAddNew: !isView,
    //     data: data,
    //     isCheckViewFromBB: false
    //   },
    //   nzFooter: null
    // });
    // modal1.afterClose.subscribe((rs: any) => {
    //   this.ActivedModal = null;
    //   if (rs) {
    //     this.LoadData();
    //   }
    // });
  }

  SuaBienBan(data: any) {
    this.tabHoaDonXoaBoComponent.SuaBienBan(data);
  }

  XoaBienBanHuyHD(data: any) {
    this.tabHoaDonXoaBoComponent.XoaBienBanHuyHD(data);
  }

  GuiBienBanHuyHD(data: any) {
    this.tabHoaDonXoaBoComponent.dataSelected = data;
    this.tabHoaDonXoaBoComponent.GuiBienBanHuyHD(data);
  }

  GuiThongBaoXoaBoHoaDon(data: any) {
    this.tabHoaDonXoaBoComponent.dataSelected = data;
    this.tabHoaDonXoaBoComponent.GuiThongBaoXoaBoHoaDon(data);
  }

  //kiểm tra lập thông báo sai sót
  kiemTraLapThongBaoSaiSot(data: any) {
    //Ghi chú: nếu data.thongBaoSaiSot.hoaDonDienTuId != null hoặc data.thongBaoSaiSot.thongDiepGuiCQTId thì là trường hợp của hóa đơn điều chỉnh
    //và khi đó data.thongBaoSaiSot.hoaDonDienTuId là id của hóa đơn bị điều chỉnh,
    //và data.thongBaoSaiSot.thongDiepGuiCQTId là giá trị thongDiepGuiCQTId của dòng hóa đơn bị điều chỉnh

    let modalThongBaoSaiSot = null;
    if (data.thongBaoSaiSot.trangThaiLapVaGuiThongBao == -2) {
      //chưa lập thì mở thêm 04
      if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            content = `
            Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
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
              msOnClose: () => {
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
      if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
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
              msOnClose: () => {
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
      if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
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
              msOnClose: () => {
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
  //hàm này để tự động lọc dữ liệu theo hóa đơn có sai sót chưa lập thông báo
  locHoaDonCoSaiSotChuaLapThongBao() {
    this.hoaDonDienTuService.ThongKeSoLuongHoaDonSaiSotChuaLapThongBao(1, this.isPhieuXuatKho ? 2 : 1).subscribe(async (res: any) => {
      this.displayDataTemp.fromDate = res.tuNgay;
      this.displayDataTemp.toDate = res.denNgay;
      this.displayDataTemp.LocHoaDonCoSaiSotChuaLapTBao04 = true;
      const ky = GetKy(this.displayDataTemp);
      this.displayDataTemp.Ky = ky;
      this.filterGeneral();
    });
  }

  //hàm này để hiển thị chỉ các hóa đơn đã chọn
  hienThiChiHoaDonDaChon() {
    //this.listOfSelected = []; // xóa trắng để làm mới lại danh sách listOfSelected nếu dữ liệu có cập nhật
    this.refreshStatus(); // thêm lại các dòng đã chọn trước đó vào biến listOfSelected
    this.currentPageIndex = this.displayData.PageNumber;
    if (this.listOfSelected != null) {
      this.listPaging = this.listOfSelected;
      this.chiTiets = [];
      this.total = this.listOfSelected.length;
      this.displayData.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
      this.listPaging.forEach(x => {
        this.totalTongTienTT += x.tongTienThanhToan;
      });
      this.lstBangKeEmpty = getListEmptyBangKe1(this.listPaging);
      this.scrollConfig.x = SumwidthConfig(this.widthConfig);
      // if (!this.chitietCollapse)
      //   this.scrollConfig.y = (getHeightBangKe() + 160) + "px";
      // else
      //   this.scrollConfig.y = (getHeightBangKe() - 20) + "px";

      this.scrollConfig.y = getHeightBangKeKhongChiTiet3() + 5 + "px";

      this.rowScrollerToViewEdit.scrollToRow(this.listPaging, "hoaDonDienTuId").then((result) => {
        this.selectedRow(result);
      });
      if (this.listPaging && this.listPaging.length > 0) {
        this.selectedRow(this.listPaging[0]);
      }

      if (this.viewConditionList.filter(x => x.key == 'LocHoaDonDaTichChon').length == 0) {
        this.viewConditionList.push({ key: 'LocHoaDonDaTichChon', label: 'Lọc hóa đơn: ', value: 'Đã chọn' });
      }
    }
  }

  changeTrangThaiQuyTrinh(event: any[]) {
    setTimeout(() => {
      if (this.isClickRowTrangThaiQuyTrinh == true && this.userEnter == false) {
        this.isClickRowTrangThaiHoaDon = false;
        return;
      }
      if (this.eventList.length > 0 && this.userEnter == true) {
        event = this.eventList
        if (event.some(x => x == -1)) {
          event.forEach((i: any) => {
            this.trangThaiQuyTrinhs.forEach((item: any) => {
              if (i == item.key) {
                if (item.checked == true) {
                  item.checked = false;
                } else {
                  item.checked = true;
                  if (item.key == -1 && item.checked == true) {
                    this.trangThaiQuyTrinhs.forEach((item2: any) => {
                      item2.checked = true;
                    })
                  }
                }

                // if(item.key == -1){
                //   this.trangThaiQuyTrinhs.forEach((item2 :any) =>{
                //     item2.checked = true
                //   })
                // }
              }
            })
          })
        } else {
          event.forEach((i: any) => {
            this.trangThaiQuyTrinhs.forEach((item: any) => {
              if (i == item.key) {
                if (item.checked == true) {
                  item.checked = false;
                } else {
                  item.checked = true;
                }
              }
            })
          })
        }
        this.trangThaiQuyTrinhs[0].checked = this.trangThaiQuyTrinhs.filter(x => x.key !== -1).every(x => x.checked);
        let listSelected = this.trangThaiQuyTrinhs[0].checked ? [-1] : this.trangThaiQuyTrinhs.filter(x => x.key !== -1 && x.checked).map(x => x.key);
        this.displayDataTemp.TrangThaiPhatHanhs = listSelected;
        this.eventList = [];
        if (this.userEnter == true) this.userEnter = false;

      } else {
        if (event.length > 0) {
          this.trangThaiQuyTrinhs.forEach((item: any) => {
            item.checked = event.some(x => x === item.key);
          });

        } else {
          this.trangThaiQuyTrinhs.forEach((item: any) => {
            item.checked = false;
          });
        }
      }

    }, 10)
    let elClass = document.getElementsByClassName('ant-select-dropdown-menu-item-active') as HTMLCollection
    if (elClass.length > 0) {
      this.itemIdSelected = elClass[0].firstElementChild.getAttribute('data-value')
    }
    else {
      let item = event[event.length - 1];
      let hideClass = document.getElementsByClassName('ant-select-dropdown-menu-item ng-star-inserted') as HTMLCollection;
      if (hideClass.length > 0) {
        for (let i = 0; i < hideClass.length; i++) {
          let dataValue = hideClass[i].firstElementChild.getAttribute('data-value')
          if (item.toString() == dataValue) {
            hideClass[i].classList.add('ant-select-dropdown-menu-item-active')
          }
        }
      }
    }
  }

  eventList = [];
  @HostListener('document:keydown', ['$event'])
  keyPress(event: any) {
    //lấy item cuối cùng khi kết thúc di chuyển
    if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
      let elClass = document.getElementsByClassName('ant-select-dropdown-menu-item-active') as HTMLCollection
      this.itemIdSelected = elClass[0].firstElementChild.getAttribute('data-value')
    }
    //xử lý sự kiện enter
    else if (event.key == 'Enter') {
      this.userEnter = true;
      let elClass = document.getElementsByClassName('ant-select-dropdown-menu-item-active') as HTMLCollection
      if (elClass.length > 0) {
        let itemId = elClass[0].firstElementChild.getAttribute('data-value')
        if (itemId == this.itemIdSelected) {
          this.eventList.push(itemId);
        }
        else this.eventList.push(this.itemIdSelected);
      }

    }
  }

  updateTrangThaiQuyTrinh(data: any) {
    this.loading = true;
    var trangThaiDich = data.trangThaiQuyTrinh == this.trangThaiQuyTrinh.DangKyDienTu ? this.trangThaiQuyTrinh.ChuaKyDienTu : this.trangThaiQuyTrinh.GuiTCTNLoi;
    this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(data.hoaDonDienTuId, trangThaiDich).subscribe((rs: any) => {
      if (rs) {
        this.LoadData();
      }
    })
  }

  changeTrangThaiHoaDon(event: any[]) {
    setTimeout(() => {
      if (this.isClickRowTrangThaiHoaDon == true && this.userEnter == false) {
        this.isClickRowTrangThaiHoaDon = false;
        return;
      }
      if (this.eventList.length > 0 && this.userEnter == true) {
        event = this.eventList;
        let listSelected = [];
        if (event.some(x => x == -1)) { //nếu chứa -1
          event.forEach((i: number) => {
            this.trangThaiHoaDons.forEach((item: any) => {
              if (item.trangThaiId == i) {
                if (item.checked == true) {
                  item.checked = false;
                  if (item.trangThaiChaId) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiId == item.trangThaiChaId) {
                        x.checked = false;
                      }
                    })
                  }
                }
                else {
                  item.checked = true;
                  if (item.trangThaiChaId) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiId == item.trangThaiChaId) {
                        x.checked = this.trangThaiHoaDons.filter(o => o.trangThaiChaId == x.trangThaiId).every(x => x.checked);;
                      }
                    })
                  }
                  if (item.isParent) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiChaId == item.trangThaiId) {
                        x.checked = true;
                      }
                    })
                  }
                  if (item.trangThaiId == -1 && item.checked == true) {
                    this.trangThaiHoaDons.forEach((item2: any) => {
                      item2.checked = true;
                    })
                  }
                }
              }

            });
          })
        }
        else { // nếu không chứa -1
          event.forEach((i: number) => {
            this.trangThaiHoaDons.forEach((item: any) => {
              if (item.trangThaiId == i) {
                if (item.checked == true) {
                  item.checked = false;
                  if (item.trangThaiChaId) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiId == item.trangThaiChaId) {
                        x.checked = false;
                      }
                    })
                  } else {
                    if (item.isParent) {
                      this.trangThaiHoaDons.forEach(x => {
                        if (x.trangThaiChaId == item.trangThaiId) {
                          x.checked = false;
                        }
                      })
                    } else {
                      item.checked = false
                      this.trangThaiHoaDons.forEach(x => {
                        if (x.trangThaiId == item.trangThaiId) {
                          x.checked = false;
                        }
                      })

                    }
                  }
                }
                else {
                  item.checked = true;
                  if (item.trangThaiChaId) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiId == item.trangThaiChaId) {
                        x.checked = this.trangThaiHoaDons.filter(o => o.trangThaiChaId == x.trangThaiId).every(x => x.checked);
                      }
                    })
                  }
                  if (item.isParent) {
                    this.trangThaiHoaDons.forEach(x => {
                      if (x.trangThaiChaId == item.trangThaiId) {
                        x.checked = true;
                      }
                    })
                  }
                }
              }

            })
          })
        }
        this.trangThaiHoaDons[0].checked = this.trangThaiHoaDons.filter(x => x.trangThaiId !== -1).every(x => x.checked);
        listSelected = this.trangThaiHoaDons[0].checked ? [-1] : this.trangThaiHoaDons.filter(x => x.trangThaiId !== -1 && x.checked).map(x => x.trangThaiId);
        if (!listSelected.includes(-1) && listSelected.length != this.trangThaiHoaDons.length && !(event.length == this.trangThaiGuiHoaDons.length - 1 && this.trangThaiHoaDons[0].checked == false)) {
          this.trangThaiHoaDons.forEach((item: any) => {
            if (item.checked && item.isParent == true) {
              var removeIds = this.trangThaiHoaDons.filter(x => x.trangThaiChaId === item.trangThaiId).map(x => x.trangThaiId);
              listSelected = listSelected.filter(x => removeIds.indexOf(x) < 0);
            }
          })
        }
        else {
          this.trangThaiHoaDons[0].checked = true;
          listSelected = this.trangThaiHoaDons[0].checked ? [-1] : this.trangThaiHoaDons.map(x => x.trangThaiId);
        }
        this.displayDataTemp.TrangThaiHoaDonDienTus = listSelected;
        event = listSelected;

        this.trangThaiHoaDons.forEach((item: any) => {
          if (item.trangThaiChaId) {
            var itemCha = this.trangThaiHoaDons.find(x => x.trangThaiId == item.trangThaiChaId);
            if (itemCha.checked == true) item.checked = itemCha.checked;
          }
        })
      }
      else {
        if (event.length > 0) {
          this.trangThaiHoaDons.forEach((item: any) => {
            item.checked = event.some(x => x === item.trangThaiId);
          });
        }
        else {
          this.trangThaiHoaDons.forEach((item: any) => {
            item.checked = false;
          });
        }

        this.trangThaiHoaDons.forEach((item: any) => {
          if (item.trangThaiChaId) {
            var itemCha = this.trangThaiHoaDons.find(x => x.trangThaiId == item.trangThaiChaId);
            if (itemCha.checked == true) item.checked = itemCha.checked;
          }
        })
      }

      if (this.userEnter == true) this.userEnter = false;
      this.eventList = [];
    }, 10)
    let elClass = document.getElementsByClassName('ant-select-dropdown-menu-item-active') as HTMLCollection;
    if (elClass.length > 0) {
      this.itemIdSelected = elClass[0].firstElementChild.getAttribute('data-value')
    } else {
      let item = event[event.length - 1];
      let hideClass = document.getElementsByClassName('ant-select-dropdown-menu-item ng-star-inserted') as HTMLCollection;
      if (hideClass.length > 0) {
        for (let i = 0; i < hideClass.length; i++) {
          let dataValue = hideClass[i].firstElementChild.getAttribute('data-value')
          if (item.toString() == dataValue) {
            hideClass[i].classList.add('ant-select-dropdown-menu-item-active')
          }
        }
      }
    }
  }
  openChangeDropDown(event: any) {
    if (event) {
      this.isClickRowTrangThaiHoaDon = false
    }
  }

  onMouse() {
    this.userOnMouse = true;
    let elClass = document.getElementsByClassName('ant-select-dropdown-menu-item-active') as HTMLCollection;
    if (elClass.length > 0) {
      elClass[0].classList.remove('ant-select-dropdown-menu-item-active');
    }
  }

  checkedFilterTrangThaiQuyTrinh(data: any) {
    setTimeout(() => {
      this.isClickRowTrangThaiQuyTrinh = true
      if (data.key === -1) { // check all
        this.trangThaiQuyTrinhs.forEach((item: any) => {
          item.checked = data.checked;
        });
      } else {
        this.trangThaiQuyTrinhs[0].checked = this.trangThaiQuyTrinhs.filter(x => x.key !== -1).every(x => x.checked);
      }
      var listSelected = this.trangThaiQuyTrinhs[0].checked ? [-1] : this.trangThaiQuyTrinhs.filter(x => x.key !== -1 && x.checked).map(x => x.key);
      this.displayDataTemp.TrangThaiPhatHanhs = listSelected;
      this.userEnter = false;
    }, 0)
  }

  checkedFilterTrangThaiHoaDon(data: any) {
    this.isClickRowTrangThaiHoaDon = true;
    if (data.trangThaiId === -1) { // check all
      this.trangThaiHoaDons.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      if (data.isParent) {
        this.trangThaiHoaDons.forEach((item: any) => {
          if (data.trangThaiId === item.trangThaiChaId) {
            item.checked = data.checked;
          }
        });
      } else {
        var parentIndex = this.trangThaiHoaDons.findIndex(x => x.trangThaiId === data.trangThaiChaId);
        if (parentIndex !== -1) {
          this.trangThaiHoaDons[parentIndex].checked = this.trangThaiHoaDons.filter(x => x.trangThaiChaId === data.trangThaiChaId).every(x => x.checked);
        }
      }
      this.trangThaiHoaDons[0].checked = this.trangThaiHoaDons.filter(x => x.trangThaiId !== -1).every(x => x.checked);
    }
    var listSelected = this.trangThaiHoaDons[0].checked ? [-1] : this.trangThaiHoaDons.filter(x => x.trangThaiId !== -1 && x.checked).map(x => x.trangThaiId);
    this.trangThaiHoaDons.forEach((item: any) => {
      if (item.checked && item.isParent) {
        var removeIds = this.trangThaiHoaDons.filter(x => x.trangThaiChaId === item.trangThaiId).map(x => x.trangThaiId);
        listSelected = listSelected.filter(x => !removeIds.includes(x));
      }
    });
    setTimeout(() => { ///chạy song song ngModelChange changeTrangThaiHoaDon($event)
      this.displayDataTemp.TrangThaiHoaDonDienTus = listSelected;
    }, 0);
    if (this.userEnter == true) this.userEnter = false;
  }

  getNameOfTrangThaiQuyTrinhFilter() {
    const result = this.trangThaiQuyTrinhs
      .filter(x => this.displayDataTemp.TrangThaiPhatHanhs.includes(x.key))
      .map(x => {
        return {
          key: 'TrangThaiPhatHanh',
          label: x.value,
          value: x.key,
        };
      });

    return result;
  }

  getNameOfTrangThaiHoaDonFilter() {
    const result = this.trangThaiHoaDons
      .filter(x => this.displayDataTemp.TrangThaiHoaDonDienTus.includes(x.trangThaiId))
      .map(x => {
        return {
          key: 'TrangThaiHoaDonDienTu',
          label: x.ten,
          value: x.trangThaiId,
        };
      });

    return result;
  }

  /**
   * Thông điệp 206
   */
  tDieps: any[] = [];
  id: any;
  guiHoaDonCQT(item = null){
    if(this.ActivedModal) return;
    if (this.dataSelected == null && this.listOfSelected.length == 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '500px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Gửi hóa đơn đến CQT',
          msContent: `Vui lòng chọn một hóa đơn để gửi CQT`,
        },
        nzFooter: null
      });

      return;
    }

    if (item) {
      this.guiHoaDonDenCQT(item, () => this.LoadData());
      return;
    }
    // if(!item && this.dataSelected && this.listOfSelected.length === 0){
    //   this.publishReceipt(this.dataSelected);
    //   return;
    // }


    if (this.listOfSelected.length > 1) {
      this.disableGuiCQTMTT = true;
      return;
    }
    else {
      this.disableGuiCQTMTT = false;
      if (this.listOfSelected.length == 1) {
        if (this.listOfSelected[0])
          this.guiHoaDonDenCQTDongLoat(true);
      }
      else {
        const vals = this.listPaging.filter(x => x.selected == true);
        if (vals.length == 0) return;
        var data = vals[0];
        this.guiHoaDonDenCQT(data, ()=>this.LoadData());
      }
    }
  }

  guiHoaDonDenCQTDongLoat(fromGuiCQT = false){
    let hoaDons: any[] = [];
    if(this.ActivedModal) return;
    if (this.listOfSelected.length > 0) {
      if(this.listOfSelected.length == 1 && fromGuiCQT == true) {
        if (this.listOfSelected[0].trangThaiQuyTrinh != this.trangThaiQuyTrinh.ChuaGuiCQT && this.listOfSelected[0].trangThaiQuyTrinh != this.trangThaiQuyTrinh.GuiTCTNLoi && this.listOfSelected[0].trangThaiQuyTrinh != this.trangThaiQuyTrinh.GuiLoi){
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
              msContent: "Hệ thống chỉ cho phép thực hiện <b<Gửi CQT</b> hóa đơn Có mã từ máy tính tiền có trạng thái quy trình là <b>Chưa gửi</b>, <b>Gửi TCTN lỗi</b> và <b>Gửi CQT lỗi</b>. Vui lòng kiểm tra lại!",
              msOnClose: () => {
              }
            },
            nzFooter: null
          });

          return;
        }
        else hoaDons = [this.listOfSelected[0]];
      }
      else hoaDons = this.listOfSelected.filter(x => x.boKyHieuHoaDon.hinhThucHoaDon == 2 && (x.trangThaiQuyTrinh == this.trangThaiQuyTrinh.ChuaGuiCQT || x.trangThaiQuyTrinh == this.trangThaiQuyTrinh.GuiTCTNLoi || this.trangThaiQuyTrinh.GuiLoi)  && x.mccqt && x.mccqt != '');
    }
    else {
      if(this.dataSelected){
        hoaDons = [];
      }
    }

    var listIds = hoaDons.map(x => x.hoaDonDienTuId);
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: "Gửi hóa đơn đến CQT đồng loạt",
      nzContent: PhatHanhHoaDonHangLoatModalComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzKeyboard: false,
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '5px', 'max-height': '89vh' },
      nzClassName: "videoHD",
      nzWidth: '100%',
      nzComponentParams: {
        listSelectedIdFromTab: listIds,
        isTuMTT: true,
        isGuiCQT: true,
        fromDate: this.displayData.fromDate,
        toDate: this.displayData.toDate
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((res: any) => {
      this.ActivedModal = null;
      this.filterGeneral();
    });
  }

  guiHoaDonDenCQT(item: any = null, callBack: () => any = null) {
    if (item) {
      if (item.trangThaiQuyTrinh != this.trangThaiQuyTrinh.ChuaGuiCQT && item.trangThaiQuyTrinh != this.trangThaiQuyTrinh.GuiTCTNLoi && item.trangThaiQuyTrinh != this.trangThaiQuyTrinh.GuiLoi){
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
            msContent: "Hệ thống chỉ cho phép thực hiện <b<Gửi CQT</b> hóa đơn Có mã từ máy tính tiền có trạng thái quy trình là <b>Chưa gửi</b>, <b>Gửi TCTN lỗi</b> và <b>Gửi CQT lỗi</b>. Vui lòng kiểm tra lại!",
            msOnClose: () => {
            }
          },
          nzFooter: null
        });

        return;
      }

      if (item.isPos == 1000) {
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
            msContent: `Hóa đơn máy tính tiền đang <b>sửa</b> bởi máy POS. Bạn không thể gửi đến CQT.<br/> Vui lòng kiểm tra lại!`,
            msOnClose: () => {
              return;
            }
          },
          nzFooter: null
        });
        return;
      }

      this.hoaDonDienTuService.GetById(item.hoaDonDienTuId).subscribe((res: any) => {
        //Kiểm tra xem có phải là hóa đơn MTT và đang bị sửa IsPos =1000 thì thông báo đang hđ đang bị sửa không được gửi đến cqt
        if (res && res.isPos == 1000) {
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
              msContent: "Hóa đơn đang bị sửa bởi máy POS. Bạn không thể gửi đến CQT.<br/> Vui lòng kiểm tra lại.",
              msOnClose: () => {
                return;
              }
            },
            nzFooter: null
          });
          return;
        }

        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Gửi hóa đơn đến CQT",
          nzContent: PhatHanhHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 600,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: res,
            isGuiCQT: true
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs != undefined) {
            if (rs == true) {
              // this.modalService.create({
              //   nzContent: MessageBoxModalComponent,
              //   nzMaskClosable: false,
              //   nzClosable: false,
              //   nzKeyboard: false,
              //   nzStyle: { top: '100px' },
              //   nzBodyStyle: { padding: '1px' },
              //   nzWidth: '450px',
              //   nzComponentParams: {
              //     msMessageType: MessageType.Info,
              //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              //     msTitle: 'Phát hành hóa đơn',
              //     msContent: `Phát hành hóa đơn thành công`,
              //   },
              //   nzFooter: null
              // });
            }

            if (rs && rs.isNgungChucNangVaXemChiTiet) {
              this.setParamHoaDonNhoHonHoaDonDangPhatHanh(rs);
            }

            this.filterGeneral();
            this.ActivedModal = null;
            if (callBack) {
              callBack();
            }
          }
        });
      })

    }
    else return;
  }

  guiHoaDonFromPos(hoaDons: any[] = [], modal: any=null, callback: () => any = null,) {
    this.loading = true;
    this.id = this.message.loading('Signing...', { nzDuration: 0 }).messageId;

    let ttChung1 = {
      PBan: '2.0.1',
      MNGui: `${this.env.taxCodeTCGP}`,
      MNNhan: this.env.taxCodeTCTN,
      MLTDiep: 206,
      MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
      MTDTChieu: '',
      MST: this.hoSoHDDT.maSoThue,
      SLuong: 1
    }
    let ttChung2 = {
      PBan: '2.0.1',
      MNGui: `${this.env.taxCodeTCGP}`,
      MNNhan: this.env.taxCodeTCTN,
      MLTDiep: 206,
      MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
      MTDTChieu: '',
      MST: this.hoSoHDDT.maSoThue,
      SLuong: 1
    }
    let ttChung3 = {
      PBan: '2.0.1',
      MNGui: `${this.env.taxCodeTCGP}`,
      MNNhan: this.env.taxCodeTCTN,
      MLTDiep: 206,
      MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
      MTDTChieu: '',
      MST: this.hoSoHDDT.maSoThue,
      SLuong: 1
    }
    let tDiep = {
      ttChung1: ttChung1,
      ttChung2: ttChung2,
      ttChung3: ttChung3,
      hoaDons: hoaDons
    }

    if (hoaDons.length == 0) {
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
          msContent: "Vui lòng chọn ít nhất một hóa đơn đã cấp mã từ máy tính tiền và có trạng thái <b>Chưa gửi CQT</b>",
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      return;
    }

    setTimeout(() => {
      this.thongDiepGuiDuLieuHDDTService.InsertThongDiep206(tDiep).subscribe((rs: any[]) => {
        if (rs && rs.length > 0) {
          this.tDieps = rs;
          this.KyThongDiep(modal, callback);
        }
        else{
        this.loading = false;
          this.message.remove(this.id);
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
              msContent: "Dữ liệu có dung lượng lớn hơn 2MB. Vui lòng kiểm tra lại!",
              msOnClose: () => {
              }
            },
            nzFooter: null
          });

          return;
        }
      });
    });
  }

  tDiep: any;
  pos = 0;
  sendMessageToServer(orderData: any) {
    setTimeout(() => {
      const msg = this.createXMLToSign(orderData);
      this.webSocket.sendMessage(JSON.stringify(msg));
    }, 1000);
  }

  createXMLToSign(orderData: any) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    orderData.actionUser = user;

    let msg: any = {
      mLTDiep: MLTDiep.TDGHDKTTMTT,
      // type: 1004,
      mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
      dataXML: orderData.dataXML,
      serials: this.serials,
      isCompression: true,
      tTNKy: {
        mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
        ten: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
        sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
        tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        tenP2: '',
      }
    };

    return msg;
  }

  continue = false;
  thongDiepGuis: any[] = [];
  selectKyCung: string = "KiCung";

  createSocket(modalRef: any=null, callback: () => any = null) {
    this.selectKyCung = isSelectChuKiCung(this.tuyChonService);
    if (this.selectKyCung == "KiCung") {
      this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe( (rs: string) => {
        this.XuLyThongDiep(rs, modalRef, callback);
      }, err => {
        if (this.signing == true) {
          this.modalService.create({
            nzTitle: "<strong>Hãy cài đặt công cụ ký số</strong>",
            nzContent: "Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại." +
              "<br>Để ký điện tử lên hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.",
            nzOkType: "primary",
            nzOkText: "Tải bộ cài",
            nzOnOk: () => {
              const link = document.createElement('a');
              link.href = `${this.env.apiUrl}/${this.urlTools}`;
              link.download = 'BKSOFT-KYSO-SETUP.zip';
              link.click();
              this.signing = false;
              this.loading = false;
              this.message.remove(this.id);

            },
            nzCancelText: "Đóng",
            nzOnCancel: () => {
              this.thongDiepGuis = [];
              this.signing = false;
              this.loading = false;
              this.message.remove(this.id);

            }
          });
        }
      });

      this.signing = true;

      this.tDiep = this.tDieps[this.pos];
      this.sendMessageToServer(this.tDiep);
    }
    else {
      this.signing = true;
      this.tDiep = this.tDieps[this.pos];
      const msg = this.createXMLToSign(this.tDiep);
      this.webSocket.createObservableSocket("", msg).subscribe((rs: any) => {
        this.XuLyThongDiep(rs, modalRef, callback);
      })
    }
  }

   KyThongDiep(modal: any=null, callback: () => any = null) {
     this.createSocket(modal, callback);
  }

   XuLyThongDiep(rs: any,modalRef: any =null, callback: () => any = null) {
    let obj = rs;
    if (this.selectKyCung == "KiCung")
      obj = JSON.parse(rs);
    if (obj.TypeOfError === 0) {
      this.tDiep.dataXML = obj.XMLSigned;
      this.thongDiepGuiDuLieuHDDTService.LuuDuLieuDaKy(this.tDiep).subscribe( (res: boolean) => {
        if (res) {
          this.thongDiepGuis.push(this.tDiep);
          if (this.thongDiepGuis.length == this.tDieps.length) {
            this.thongDiepGuiDuLieuHDDTService.GuiThongDiep206(this.thongDiepGuis).subscribe((res1: boolean) => {
              if (res1) {
                const modal = this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '400px',
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    msTitle: "Gửi hóa đơn khởi tạo từ máy tính tiền đến CQT",
                    msContent: `Gửi hóa đơn khởi tạo từ máy tính tiền đến CQT thành công.`,
                    msMessageType: MessageType.Info,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: () => {
                      this.thongDiepGuis = [];
                      if (!callback) {
                        this.LoadData(true);
                      }
                      else {
                        callback();
                        modalRef.destroy(true);
                      }
                    }
                  }
                });

                this.pos = 0;

              }
              else {
                const modal = this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '400px',
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    msTitle: "Kiểm tra lại",
                    msContent: `Gửi hóa đơn khởi tạo từ máy tính tiền đến CQT không thành công.
                    <br>Vui lòng kiểm tra lại!`,
                    msMessageType: MessageType.Warning,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: () => {
                      this.thongDiepGuis = [];
                      if (!callback) {
                        this.LoadData(true);
                      }
                      else callback();
                    }
                  }
                });
                this.pos = 0;

              }

              this.signing = false;
              this.listOfSelected = [];

              this.loading = false;

              this.message.remove(this.id);

            });
          }
          else {
            this.pos++;
            this.tDiep = this.tDieps[this.pos];
            if (this.selectKyCung == 'KiCung') {
              this.sendMessageToServer(this.tDiep);
            }
            else {
              const msg = this.createXMLToSign(this.tDiep);
              this.webSocket.createObservableSocket("", msg).subscribe((res: any) => {
                this.XuLyThongDiep(res, modalRef, callback);
              })
            }
          }
        }

      })
    } else {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '400px',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `Gửi hóa đơn khởi tạo từ máy tính tiền đến CQT không thành công.
          <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
          <br>Vui lòng kiểm tra lại!`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            if(callback) callback();
          }
        }
      });
      this.thongDiepGuis = [];
      this.listOfSelected = [];
      this.signing = false;
      this.loading = false;
      this.message.remove(this.id);

      return;
    }
  }

    /*
  Hàm này được dùng để so sánh thông tin của người nộp thuế với thông tin của người bán trên mẫu hóa đơn.
  Nếu các thông tin không giống nhau thì phải đưa ra câu hỏi dạng trả lời 'yes/no' để người dùng biết và chọn.
  */
  async soSanhThongTinNguoiNopThueVoiMauHoaDon(hoaDonDienTuId: string[], callBack: any) {
    // Gọi API đọc thông tin của người nộp thuế
    let hoSoDienTuData: any = await this.hoSoHHDTService.GetDetailAsync();
    if (hoSoDienTuData) {
      // Gọi API đọc thông tin của người bán trên mẫu hóa đơn của hóa đơn điện tử
      let listThongTinNguoiBan: any = await this.signerNameReaderService.GetThongTinNguoiBanTuHoaDonAsync(hoaDonDienTuId);

      // So sánh xem có giá trị nào không trùng nhau hay không
      let comparedResult: any[] = [];

      // So sánh có giá trị nào không đúng độ dài quy định
      let checkInvalid: any[] = [];

      // Nếu trả về nhiều hơn một bộ ký hiệu thì sẽ hiển thị theo nhóm
      let isNhomBoKyHieu: boolean = (listThongTinNguoiBan.length > 1);

      // Duyệt mảng kết quả để xử lý dữ liệu trả về
      listThongTinNguoiBan.forEach((item: any) => {
        if (isNhomBoKyHieu && comparedResult.find(x => x.tenBoKyHieu == item.tenBoKyHieu) == null) {
          comparedResult.push(
            {
              'isNhomBoKyHieu': isNhomBoKyHieu,
              'tenBoKyHieu': item.tenBoKyHieu
            });

          checkInvalid.push(
            {
              'isNhomBoKyHieu': isNhomBoKyHieu,
              'tenBoKyHieu': item.tenBoKyHieu
            });
        }

        // Thêm tiêu chí tên
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên',
          'thongTinNguoiNopThue': hoSoDienTuData.tenDonVi,
          'thongTinTrenMauHoaDon': item.tenDonViNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.tenDonVi) != toTrimAndToUpperCase(item.tenDonViNguoiBan))
        });

        // Thêm tiêu chí mã số thuế
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Mã số thuế',
          'thongTinNguoiNopThue': hoSoDienTuData.maSoThue,
          'thongTinTrenMauHoaDon': item.maSoThueNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.maSoThue) != toTrimAndToUpperCase(item.maSoThueNguoiBan))
        });

        // Thêm tiêu chí địa chỉ
        comparedResult.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ',
          'thongTinNguoiNopThue': hoSoDienTuData.diaChi,
          'thongTinTrenMauHoaDon': item.diaChiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(hoSoDienTuData.diaChi) != toTrimAndToUpperCase(item.diaChiNguoiBan))
        });

        // Thêm tiêu chí tên
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên',
          'thongTinTrenMauHoaDon': item.tenDonViNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.tenDonViNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.tenDonViNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí mã số thuế
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Mã số thuế',
          'thongTinTrenMauHoaDon': item.maSoThueNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.maSoThueNguoiBan).length > 14),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.maSoThueNguoiBan).length > 14 ? "Vượt quá 14 ký tự" : null
        });

        // Thêm tiêu chí địa chỉ
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ',
          'thongTinTrenMauHoaDon': item.diaChiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.diaChiNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.diaChiNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí số điện thoại
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Số điện thoại',
          'thongTinTrenMauHoaDon': item.dienThoaiNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.dienThoaiNguoiBan).length > 20),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.dienThoaiNguoiBan).length > 20 ? "Vượt quá 20 ký tự" : null
        });

        // Thêm tiêu chí địa chỉ thư điện tử
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Địa chỉ thư điện tử',
          'thongTinTrenMauHoaDon': item.emailNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.emailNguoiBan).length > 50),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.emailNguoiBan).length > 50 ? "Vượt quá 50 ký tự" : null
        });

        // Thêm tiêu chí số tài khoản ngân hàng
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Số tài khoản ngân hàng',
          'thongTinTrenMauHoaDon': item.soTaiKhoanNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.soTaiKhoanNguoiBan).length > 30),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.soTaiKhoanNguoiBan).length > 30 ? "Vượt quá 30 ký tự" : null
        });

        // Thêm tiêu chí tên ngân hàng
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Tên ngân hàng',
          'thongTinTrenMauHoaDon': item.tenNganHangNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.tenNganHangNguoiBan).length > 400),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.tenNganHangNguoiBan).length > 400 ? "Vượt quá 400 ký tự" : null
        });

        // Thêm tiêu chí fax
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Fax',
          'thongTinTrenMauHoaDon': item.faxNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.faxNguoiBan).length > 20),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.faxNguoiBan).length > 20 ? "Vượt quá 20 ký tự" : null
        });

        // Thêm tiêu chí website
        checkInvalid.push({
          'isNhomBoKyHieu': false,
          'tenBoKyHieu': item.tenBoKyHieu,
          'tieuChi': 'Website',
          'thongTinTrenMauHoaDon': item.websiteNguoiBan,
          'ketQuaDoiChieu': (toTrimAndToUpperCase(item.websiteNguoiBan).length > 100),
          'ketQuaDoiChieuText': toTrimAndToUpperCase(item.websiteNguoiBan).length > 100 ? "Vượt quá 100 ký tự" : null
        });
      });

      // Gọi class kiểm tra thông tin người nộp thuế, người bán, người ký hóa đơn
      let nguoiBanNguoiKyChecker = new NguoiBanNguoiKyChecker(this.webSocket, this.modalService);
      nguoiBanNguoiKyChecker.apiUrl = this.env.apiUrl;
      nguoiBanNguoiKyChecker.comparingData = comparedResult;
      nguoiBanNguoiKyChecker.checkValidHoaDon = checkInvalid;
      nguoiBanNguoiKyChecker.hasCoCanhBao = this.boolCanhBaoNguoiBanKhacNguoiKy;
      nguoiBanNguoiKyChecker.callBack = callBack;
      nguoiBanNguoiKyChecker.kiemTraNguoiNopThueTrenMauHoaDon();
    }
  }

  xacNhanHoaDonDaGuiChoKhachHang(data: any){
    this.xacNhanTrangThaiDaGui(data, RefType.HoaDonDienTu, ()=>this.LoadData());
  }

  xacNhanTrangThaiDaGui(data: any, type: RefType, callback: () => any = null){
    if(this.ActivedModal) return;
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Xác nhận hóa đơn đã gửi cho khách hàng",
      nzContent: XacNhanGuiHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 450,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        hoaDon: data,
        RefType: type
      },
      nzFooter: null
    });

    modal1.afterClose.subscribe((rs: boolean)=>{
      this.ActivedModal = null;
      if(rs){
        if(callback){
          callback();
        };
      }
    })
  }
}
