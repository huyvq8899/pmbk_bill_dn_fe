import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewChecked, NgZone, IterableDiffers } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, Form } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalRef, NzModalService, NzSelectComponent } from 'ng-zorro-antd';

import * as moment from 'moment';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams, HoaDonParams } from 'src/app/models/PagingParams';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { ModalShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { CheckValidDateV2, CheckValidDateV3 } from 'src/app/shared/getDate';
import { CookieConstant } from 'src/app/constants/constant';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HinhThucThanhToanService } from 'src/app/services/danh-muc/hinh-thuc-thanh-toan.service';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { DonViTinhService } from 'src/app/services/danh-muc/don-vi-tinh.service';
import { CoDinhCotBenTrai, DoRongCacCot } from '../../hoa-don-setting';
import { DownloadFile, GetFileUrl, getLyDoDieuChinh, getLyDoThayThe, getTenLoaiHoaDon, loaiThueGTGTs, mathRound, getThueGTGTs, getKyKeKhaiTheoThang, getKyKeKhaiTheoQuy, kiemTraHoaDonHopLeTheoKyKeKhai, showModalPreviewPDF, setStyleTooltipError, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { CheckValidCCCD, CheckValidMst, CheckValidMst2 } from 'src/app/customValidators/check-valid-mst.validator';
import { BlurPosition, TinhToanHangHoaDichVu, tinhToanTongTien } from 'src/app/shared/hang-hoa-dich-vu-chi-tiet';
import { SetPoiterNumber } from 'src/app/functions/get-selected-array';
import { LyDoDieuChinh, LyDoThayThe } from 'src/app/models/LyDoThayTheModel';
import { AddEditBienBanDieuChinhModalComponent } from '../add-edit-bien-ban-dieu-chinh-modal/add-edit-bien-ban-dieu-chinh-modal.component';
import { LapBienBanHoaDonDieuChinhModalComponent } from '../lap-bien-ban-hoa-don-dieu-chinh-modal/lap-bien-ban-hoa-don-dieu-chinh-modal.component';
import { ChonHhdvTuHoaDonGocModalComponent } from '../chon-hhdv-tu-hoa-don-goc-modal/chon-hhdv-tu-hoa-don-goc-modal.component';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { EnvService } from 'src/app/env.service';
import * as printJS from 'print-js';
import { PhatHanhHoaDonModalComponent } from '../phat-hanh-hoa-don-modal/phat-hanh-hoa-don-modal.component';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { AddEditNhanVienModalComponent } from 'src/app/views/danh-muc/doi-tuong/modals/add-edit-nhan-vien-modal/add-edit-nhan-vien-modal.component';
import { AddEditKhachHangModalComponent } from 'src/app/views/danh-muc/doi-tuong/modals/add-edit-khach-hang-modal/add-edit-khach-hang-modal.component';
import { ThietLapTruongDuLieuHoaDonModalComponent } from '../thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-hddt-modal.component';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';
import { LoaiChiTietTuyChonNoiDung, } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { TruongMoRongHoaDon } from 'src/app/models/quan-ly-hoa-don-dien-tu/TruongMoRongHoaDon';
import { ThietLapTruongDuLieuService } from 'src/app/services/Config/thiet-lap-truong-du-lieu.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { AddEditHangHoaDichVuModalComponent } from 'src/app/views/danh-muc/hang-hoa-dich-vu/modals/add-edit-hang-hoa-dich-vu-modal/add-edit-hang-hoa-dich-vu-modal.component';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TabHoaDonDienTuComponent } from '../../tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { AddEditDonViTinhModalComponent } from 'src/app/views/danh-muc/hang-hoa-dich-vu/modals/add-edit-don-vi-tinh-modal/add-edit-don-vi-tinh-modal.component';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { CheckValidEmail } from 'src/app/customValidators/check-valid-email.validator';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { Router } from '@angular/router';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { ChonCachLapHoaDonMoiModalComponent } from '../chon-cach-lap-hoa-don-moi-modal/chon-cach-lap-hoa-don-moi-modal.component';

@Component({
  selector: 'app-hoa-don-dien-tu-modal',
  templateUrl: './hoa-don-dien-tu-modal.component.html',
  styleUrls: ['./hoa-don-dien-tu-modal.component.scss']
})
export class HoaDonDienTuModalComponent extends ModalShortKeyEventHandler implements OnInit, AfterViewChecked {
  @Input() fbEnableEdit: any;
  @Input() isCopy: boolean;
  @Input() isAddNew: boolean;
  @Input() isView: boolean;
  @Input() isPhatHanhLai: boolean;
  @Input() loaiHD: number;
  @Input() data: any;
  @Input() lyDoThayThe: LyDoThayThe;
  @Input() lyDoDieuChinh: LyDoDieuChinh;
  @Input() isMoTuGiaoDienBienBan: boolean;
  @Input() bienBanDieuChinhId: any;
  @Input() thongTinHoaDonSaiSotBiThayThe: any = null;
  @Input() isChuyenHoaDonGocThanhThayThe: boolean = false;
  @Input() viewDetail: boolean;
  @ViewChild('fieldsetLeft', { static: true }) fieldsetLeft: ElementRef;
  @ViewChild('fieldsetRight', { static: true }) fieldsetRight: ElementRef;
  forwardItem: any;
  backwardItem: any;
  firstItem: any;
  lastItem: any;
  boxHeight: any;
  hoaDonDienTuForm: FormGroup;
  doRongCacCot = DoRongCacCot;
  coDinhCotBenTrai = CoDinhCotBenTrai;
  doiTuongs: any[] = [];
  nhanViens: any[] = [];
  nhanViensSearch: any[] = [];
  spinning = false;
  pendingApi = false;
  loaiTiens: any[] = [];
  loaiTiensSearch: any[] = [];
  maLoaiTien: string;
  thamChieus: any[] = [];
  widthConfig = ['50px', '200px', '150px', '150px', '200px', '250px', '200px', '200px', '200px', '200px', '200px',
    '200px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '150px', '200px'];
  scrollConfig = { x: '4350px', y: '280px' };
  widthConfig2 = ['50px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '200px', '250px', '200px', '200px', '200px', '250px', '200px'];
  scrollConfig2 = { x: SumwidthConfig(this.widthConfig2), y: '280px' };
  widthConfigTabChiTiet = [];
  scrollConfigTabChiTiet = { x: '0px', y: '280px' };
  selectedIndexTabDetail = 0;
  tbodymaxheight = 280;
  searchCustomerOverlayStyle = {
    width: '400px'
  };
  searchCustomerOverlayStyle1 = {
    width: '550px'
  };
  searchCustomerOverlayStyle2 = {
    width: '300px'
  };
  tooltipStyle = {
    width: '300px'
  };
  isLoadingMore = false;
  loadingSearchDropdown = false;
  displayData: PagingParams = {
    PageNumber: 1,
    PageSize: 20,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true
  };

  displayDataDT: DoiTuongParams = {
    PageNumber: 1,
    PageSize: 20,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true,
    LoaiDoiTuong: 1
  };

  displayDataVT: PagingParams = {
    PageNumber: 1,
    PageSize: -1,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true,
  };

  totalPages = 0;
  waitingType = false;
  typingTimer;
  doneTypingInterval = 1000;
  phanTramThueGTGTs: any[] = getThueGTGTs();
  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnViewDisable: boolean;
  fbBtnPublishDisable: boolean;
  fbBtnBackwardDisable: boolean;
  fbBtnForwardDisable: boolean;
  fbBtnSaveDisable: boolean;
  fbBtnFirst: boolean;
  fbBtnLast: boolean;
  tienLuiModel: any;
  isFocusPoiter = false;
  ddtp = new DinhDangThapPhan();
  tinhToanHDDV: TinhToanHangHoaDichVu;
  blurPosition = BlurPosition;
  nzFilterOption = () => true;
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  mauHoaDons: any[] = [];
  listVT_HH: any[] = [];
  listDonViTinhs: any[] = [];
  listFile: TaiLieuDinhKem[] = [];
  listUploadedFile: TaiLieuDinhKem[] = [];
  formData: FormData;
  boolQuanLyNhanVienBanHangTrenHoaDon = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolQuanLyNhanVienBanHangTrenHoaDon').giaTri);
  boolPhatSinhBanHangTheoDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'PhatSinhBanHangTheoDGSauThue').giaTri);
  boolTinhTienTheoDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhTienTheoDGSauThue').giaTri);
  boolTinhTienTheoSLvaDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhTienTheoSLvaDGSauThue').giaTri);
  boolTinhSLTheoDGvaTienSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhSLTheoDGvaTienSauThue').giaTri);
  boolCoPhatSinhNghiepVuNgoaiTe = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCoPhatSinhNghiepVuNgoaiTe').giaTri;
  boolChoPhepNhapGiaTriAm = false;
  isVND = true;
  canhBaoKhiKhongChonNhanVienBanHangTrenHoaDon = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon').giaTri
  intCanhBaoKhiKhongLapVBDTTT = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntCanhBaoKhiKhongLapVBDTTT').giaTri
  noiDungThayTheHoaDon = null;
  noiDungDieuChinhHoaDon = null;
  comboboxFocusKey = ''; //key định danh nhấn vào combobox nào
  comboboxControlId = ''; //id của combobox được nhấn
  comboboxDetailTableId = ''; //id của comboxbox trong bảng chi tiết được nhấn vào
  mapOfTruongDefault: { [key: string]: TruongMoRongHoaDon } = {};
  permission: boolean = true;
  thaoTacs: any[] = [];
  truongDuLieuHoaDonChiTietsAll: any[] = [];
  truongDuLieuHoaDonChiTiets: any[] = [];
  truongThongTinBoSungs: any[] = [];
  thietLapMauHoaDon: string = "";
  truongThongTinBoSung1: FormGroup;
  truongThongTinBoSung2: FormGroup;
  truongThongTinBoSung3: FormGroup;
  truongThongTinBoSung4: FormGroup;
  truongThongTinBoSung5: FormGroup;
  truongThongTinBoSung6: FormGroup;
  truongThongTinBoSung7: FormGroup;
  truongThongTinBoSung8: FormGroup;
  truongThongTinBoSung9: FormGroup;
  truongThongTinBoSung10: FormGroup;
  mauHoaDonDuocPQ: any[] = [];
  rightMouseField = null;
  loaiThueSuat = 1; // 1- 1 thue , 2 nhieu thue
  isCloseModal = false;
  isOpenNestedModal = false;
  continue = null;
  isClickedSave = false;
  loaiDieuChinhCu: number;
  soLanChangeLoaiDieuChinh = 0;
  txtHoaDon = 'Hóa đơn';
  txtHD_PXK = "hóa đơn";
  isGiamTheoNghiQuyet = false;
  tinhChats = [
    { id: 1, name: "Hàng hóa, dịch vụ" },
    { id: 2, name: "Khuyến mại" },
    { id: 3, name: "Chiết khấu thương mại" },
    { id: 4, name: "Ghi chú/diễn giải" },
  ];
  tinhChatsAll = this.tinhChats;

  hThucThanhToans = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tiền mặt/Chuyển khoản" },
    { id: 4, name: "Đối trừ công nợ" },
    { id: 5, name: "Không thu tiền" },
    { id: 6, name: "Khác" },
  ];
  hinhThucThanhToans = [
    "Tiền mặt",
    "Chuyển khoản",
    "Tiền mặt/Chuyển khoản",
    "Đối trừ công nợ",
    "Không thu tiền",
    "Khác"
  ];
  paramCheckSaveForm = {
    skipCheckHetHieuLucTrongKhoang: false,
    skipChecNgayKyLonHonNgayHoaDon: false,
    isPhatHanh: false,
    hoaDon: null
  };
  boKyHieuHoaDons: any[] = [];
  boKyHieuHoaDonsRaw: any[] = [];
  isSaved = false;
  kyOption = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
  isGiamTheoNghiQuyetSo432022QH15 = false;
  isGiamTheoNghiQuyetSo432022QH15_DC_TT = false;
  hoaDonChiTiets: any[] = [];
  firstThue = -1;
  isShow = false;
  subscription: Subscription;
  isPhieuXuatKho: boolean;
  userPermissions: any;
  loaiThues = [];
  tenLoaiHoaDonFull = null;
  soTienBangChu = null;
  ddMMYY = {
    dd: moment().format('DD'),
    mm: moment().format('MM'),
    yy: moment().format('YYYY'),
  }
  hinhThucHoaDon: any;
  isChuyenBangTongHop: any;
  isNopThueTheoThongTu1032014BTC: boolean = false;
  isEdited = false;
  isTinhLaiThue = true;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  hoSoNguoiNop: any;
  isPos = false;
  boolChoPhepLapHDDTMTT = false;
  isTaxCodeNotAddMtt: boolean = false;
  taxcodeLogin = localStorage.getItem(CookieConstant.TAXCODE);
  constructor(
    private router: Router,
    private zone: NgZone,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private doiTuongService: DoiTuongService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private bienBanDieuChinhService: BienBanDieuChinhService,
    private hinhThucThanhToanService: HinhThucThanhToanService,
    private loaiTienService: LoaiTienService,
    private donViTinhService: DonViTinhService,
    private hangHoaDichVuService: HangHoaDichVuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private mauHoaDonService: MauHoaDonService,
    private uploadFileService: UploadFileService,
    private env: EnvService,
    private thietLapTruongDuLieuService: ThietLapTruongDuLieuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private tuyChonService: TuyChonService,
    private hoSoHDDTService: HoSoHDDTService
  ) {
    super();
  }

  blurAField() {
    if (this.isEdited == false) this.isEdited = true;
    this.hoaDonDienTuForm.markAsDirty();
    console.log(this.isEdited);
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.txtHD_PXK = "PXK";
    }
    if (_url.includes('hoa-don-tu-mtt')) {
      this.isTaxCodeNotAddMtt = this.env.taxCodeNotAddMtt.includes(this.taxcodeLogin);
      this.isPos = true;
    }
    // Nếu là phiếu xuất kho chỉ có tính chất là hhdv và diễn giải
    if (this.loaiHD === 7 || this.loaiHD === 8) {
      this.tinhChats = this.tinhChats.filter(x => x.id === 1 || x.id === 4);
      this.tinhChatsAll = this.tinhChats;
    }

    this.spinning = true;
    if (this.isCopy) {
      this.data.soHoaDon = null;
      this.data.lyDoThayThe = null;
      this.data.lyDoDieuChinh = null;
      this.thongTinHoaDonSaiSotBiThayThe = null;

      if (this.data.khachHang && this.data.khachHang.ma) {
        this.data.maKhachHang = this.data.khachHang.ma;
      }

      if (this.data.nhanVienBanHang && this.data.nhanVienBanHang.ma) {
        this.data.maNhanVienBanHang = this.data.nhanVienBanHang.ma;
      }
    }
    else {
      if (this.data != null && this.data != undefined) {
        this.thongTinHoaDonSaiSotBiThayThe =
        {
          idHoaDonSaiSotBiThayThe: this.data.idHoaDonSaiSotBiThayThe,
          ghiChuThayTheSaiSot: this.data.ghiChuThayTheSaiSot
        };
        this.isGiamTheoNghiQuyet = this.data.isGiamTheoNghiQuyet;
      }
    }

    this.createForm();

    if (this.isView) {
      this.fbBtnSaveDisable = true;
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = true;
      this.fbBtnBackwardDisable = true;
      this.fbBtnForwardDisable = true;
      this.fbBtnFirst = true;
      this.fbBtnLast = true;
    }

    if (this.tienLuiModel) {
      this.disableOrEnableHeaderButtons();
    }
  }
  ngAfterViewChecked(): void {
    var fieldsetRight = document.querySelector('.fieldsetRight') as HTMLElement;
    if (fieldsetRight) {
      fieldsetRight.style.height = this.fieldsetLeft.nativeElement.offsetHeight + 'px';
    }
    if (!this.isShow) {
      var tbodyantElement = document.querySelector('#table-detail .ant-table-body') as HTMLElement;
      var contentsaisot = document.querySelector('.content-saisot') as HTMLElement;
      if (tbodyantElement) {
        tbodyantElement.style.maxHeight = (280) - (contentsaisot.offsetHeight + 40) + 'px';
      }
    }
  }

  disableOrEnableHeaderButtons() {
    if (this.fbEnableEdit === false) {
      this.disableControls(true);
    } else {
      this.disableControls(false);
      //this.changeLoaiDieuChinh(this.hoaDonDienTuForm.get('loaiDieuChinh').value);
      if (this.lyDoDieuChinh) {
        this.hoaDonDienTuForm.get('loaiDieuChinh').enable();
      }
    }

    this.fbBtnFirst = !this.tienLuiModel.veDauId || !this.fbBtnSaveDisable || this.isPhatHanhLai;
    this.fbBtnLast = !this.tienLuiModel.veCuoiId || !this.fbBtnSaveDisable || this.isPhatHanhLai;
    this.fbBtnBackwardDisable = !this.tienLuiModel.sauId || !this.fbBtnSaveDisable || this.isPhatHanhLai;
    this.fbBtnForwardDisable = !this.tienLuiModel.truocId || !this.fbBtnSaveDisable || this.isPhatHanhLai;

    this.hoaDonDienTuForm.get('soHoaDon').disable();
  }

  tinhDoRong() {
    var doRong = this.doRongCacCot.FirstItem;
    this.truongDuLieuHoaDonChiTiets.forEach(element => {
      if (element.status) {
        doRong += element.size;
      }
    });
    this.scrollConfigTabChiTiet.x = doRong + 'px';
  }

  getNhanVien() {
    this.doiTuongService.GetAllNhanVien().subscribe((rs: any[]) => {
      this.nhanViens = rs;
      this.nhanViensSearch = rs;
    })
  }

  LayThongTin() {
    var maSoThue = this.hoaDonDienTuForm.get('maSoThue').value;
    if (maSoThue && maSoThue != '') {
      this.doiTuongService.GetKhachHangByMaSoThue(maSoThue).subscribe((kh: any) => {
        if (kh != null) {
          this.hoaDonDienTuForm.get('khachHangId').setValue(kh.doiTuongId);
          this.hoaDonDienTuForm.get('khachHangId').markAsDirty();
          this.ChangeKhachHang(kh.doiTuongId);
        }
      })
    }
  }

  changeNoiDungLyDoDieuChinh(event: any) {
    if (event.target.value) {
      this.lyDoDieuChinh.lyDo = event.target.value;
    }
  }

  changeNoiDungLyDoThayThe(event: any) {
    if (event.target.value) {
      this.lyDoThayThe.lyDo = event.target.value;
    }
  }

  thietLapTruongDuLieu() {
    let loaiHoaDon = (this.loaiHD == 9 || this.loaiHD == 14) ? 1 : (this.loaiHD == 10 || this.loaiHD == 15) ? 2 : this.loaiHD;
    if (this.fbBtnSaveDisable == true || this.hoaDonDienTuForm.getRawValue().loaiDieuChinh === 3) {
      return;
    }
    const loaiTruong = this.selectedIndexTabDetail === 0 ? 2 : 1;
    let listTruongDuLieu = this.selectedIndexTabDetail === 0 ? this.truongDuLieuHoaDonChiTietsAll : this.truongThongTinBoSungs;

    const modal1 = this.modalService.create({
      nzTitle: 'Thiết lập trường dữ liệu',
      nzContent: ThietLapTruongDuLieuHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1100px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiTruong: loaiTruong,
        loaiHoaDon: loaiHoaDon,
        listTruongDuLieu
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.LoadTruongDuLieuHoaDon(rs);
      }
    });
  }

  LoadTruongDuLieuHoaDon(rs: any[]) {
    var data = this.hoaDonDienTuForm.getRawValue();

    if (this.selectedIndexTabDetail === 0) {
      this.truongDuLieuHoaDonChiTiets = rs.filter(x => x.hienThi === true);
      this.truongDuLieuHoaDonChiTietsAll = JSON.parse(JSON.stringify(rs));

      this.LoadTruongDuLieuHoaDonTheoLoaiChietKhau(data.loaiChietKhau);
    } else {
      this.truongThongTinBoSungs = rs;
    }
  }

  LoadTruongDuLieuHoaDonTheoLoaiChietKhau(loaiChietKhau: any) {
    var filters = this.truongDuLieuHoaDonChiTietsAll.filter(x => x.hienThi === true);

    if (loaiChietKhau === 0) {
      filters = filters.filter(x => x.tenCot !== 'TyLeChietKhau' && x.tenCot !== 'TienChietKhau' && x.tenCot !== 'TienChietKhauQuyDoi');
    }

    this.truongDuLieuHoaDonChiTiets = JSON.parse(JSON.stringify(filters));

    if (!this.hoaDonDienTuForm.getRawValue().isGiamTheoNghiQuyet) {
      this.truongDuLieuHoaDonChiTiets = this.truongDuLieuHoaDonChiTiets.filter(x => x.tenCot !== 'IsMatHangDuocGiam' && x.tenCot !== 'TyLePhanTramDoanhThu' && x.tenCot !== 'TienGiam' && x.tenCot !== 'TienGiamQuyDoi');
    }

    this.widthConfigTabChiTiet = ['50px'];
    for (const item of this.truongDuLieuHoaDonChiTiets) {
      if (!this.boolQuanLyNhanVienBanHangTrenHoaDon && (item.tenCot === 'MaNhanVien' || item.tenCot === 'TenNhanVien')) {
        continue;
      }
      this.widthConfigTabChiTiet.push(item.doRong + 'px');
    }
    this.scrollConfigTabChiTiet.y = '280px';
    this.scrollConfigTabChiTiet.x = SumwidthConfig(this.widthConfigTabChiTiet);
  }

  themNhanVien(index = null) {
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Thêm nhân viên bán hàng",
      nzContent: AddEditNhanVienModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.nhanViens.unshift(rs);

        // Thêm nhân viên chi tiết
        if (index != null) {
          this.hoaDonChiTiets[index].nhanVienBanHangId = rs.doiTuongId;
          this.hoaDonChiTiets[index].maNhanVien = rs.ma;
          this.hoaDonChiTiets[index].tenNhanVien = rs.ten;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);
        } else {
          this.hoaDonDienTuForm.get('nhanVienBanHangId').setValue(rs.doiTuongId);
          this.hoaDonDienTuForm.get('tenNhanVienBanHang').setValue(rs.ten);
        }
      }
    });
  }

  themHangHoaDichVu(data: any, index: any) {
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm hàng hóa dịch vụ',
      nzContent: AddEditHangHoaDichVuModalComponent,
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
        this.listVT_HH.unshift(rs);
        data.hangHoaDichVuId = rs.hangHoaDichVuId;
        //this.hoaDonDienTuForm.get(`hoaDonChiTiets.${index}.hangHoaDichVuId`).markAsDirty();
        this.ChangeVatTu(index, rs.hangHoaDichVuId);
      }
    });
  }

  themKhachHang() {
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: "Thêm khách hàng",
      nzContent: AddEditKhachHangModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 900,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.doiTuongs.unshift(rs);
        this.hoaDonDienTuForm.get('khachHangId').setValue(rs.doiTuongId);
        this.hoaDonDienTuForm.get('khachHangId').markAsDirty();
        this.ChangeKhachHang(rs.doiTuongId);
      }
    });
  }
  themDonViTinh(data: any, index: any) {
    const modal1 = this.ActivedModal = this.modalService.create({
      nzTitle: 'Thêm đơn vị tính',
      nzContent: AddEditDonViTinhModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.listDonViTinhs.unshift(rs);
        data.donViTinhId = rs.donViTinhId;
        //this.hoaDonDienTuForm.get(`hoaDonChiTiets.${index}.donViTinhId`).markAsDirty();
        this.changeDonViTinh(rs.donViTinhId, index);
      }
    });
  }

  changeKyHieu(event: any) {
    if (!this.hoaDonDienTuForm.get('boKyHieuHoaDonId').dirty) {
      return;
    }

    const model = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === event);
    if (model) {
      var loaiChietKhau = this.hoaDonDienTuForm.get('loaiChietKhau').value;

      // từ nhiều thuế suất về 1 thuế suất thì bật thông báo
      if (this.data && this.data.loaiThue === 2 && model.mauHoaDons[0].loaiThueGTGT === 1) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 440,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: `Thay đổi ký hiệu hóa đơn`,
            msContent: `Bạn đã thay đổi ký hiệu hóa đơn <span class='colorChuYTrongThongBao'><b>${this.data.kyHieuHoaDon}</b></span> sử dụng mẫu hóa đơn <b>Nhiều thuế suất</b> sang ký hiệu hóa đơn <span class='colorChuYTrongThongBao'><b>${model.kyHieu}</b></span> sử dụng mẫu hóa đơn <b>Một thuế suất</b>. Sau khi thay đổi, cột <b>% Thuế suất GTGT</b> sẽ tự động chọn mức thuế suất GTGT của hóa đơn theo thuế suất GTGT của dòng hàng hóa dịch vụ đầu tiên có tính chất là <b>Hàng hóa, dịch vụ.</b> Các cột <b>Tiền thuế GTGT, Tiền chiết khấu, Thành tiền</b>,... sẽ không thay đổi. Người dùng cần kiểm tra lại và cập nhật lại số liệu (nếu muốn).
            <br><br>Bạn có chắc chắn thay đổi không?`,
            msMessageType: MessageType.Confirm,
            msOkButtonInBlueColor: true,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnOk: () => {
              // từ 1 thuế sang nhiều thuế thì clear data về CK
              if (!this.fbBtnSaveDisable && loaiChietKhau === 2 && this.loaiThueSuat === 1 && model.mauHoaDons[0].loaiThueGTGT === 2) {
                this.hoaDonDienTuForm.get('loaiChietKhau').setValue(1);
                this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(0);
                this.blurTyLeChietKhauTong(false);
              }

              this.loaiThues = model.mauHoaDons;
              this.hoaDonDienTuForm.get('mauHoaDonId').setValue(model.mauHoaDons[0].mauHoaDonId);
              this.loaiThueSuat = model.mauHoaDons[0].loaiThueGTGT;
              this.tenLoaiHoaDonFull = model.mauHoaDons[0].tenLoaiHoaDonFull;
              this.hoaDonDienTuForm.get('loaiThue').setValue(this.loaiThueSuat);
              this.detectChangeLoaiThueSuat();
            },
            msOnClose: () => {
              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').markAsPristine();
              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').setValue(this.data.boKyHieuHoaDonId);
            }
          },
        });
      } else {
        // từ 1 thuế sang nhiều thuế thì clear data về CK
        if (!this.fbBtnSaveDisable && loaiChietKhau === 2 && this.loaiThueSuat === 1 && model.mauHoaDons[0].loaiThueGTGT === 2) {
          this.hoaDonDienTuForm.get('loaiChietKhau').setValue(1);
          this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(0);
          this.blurTyLeChietKhauTong(false);
        }

        this.loaiThues = model.mauHoaDons;
        console.log(this.loaiThues);
        this.hoaDonDienTuForm.get('mauHoaDonId').setValue(model.mauHoaDons[0].mauHoaDonId);
        this.loaiThueSuat = model.mauHoaDons[0].loaiThueGTGT;
        this.tenLoaiHoaDonFull = model.mauHoaDons[0].tenLoaiHoaDonFull;
        this.hoaDonDienTuForm.get('loaiThue').setValue(this.loaiThueSuat);
        this.detectChangeLoaiThueSuat();
      }


      this.hoaDonDienTuForm.get('isNopThueTheoThongTu1032014BTC').setValue(this.loaiThueSuat == 2 && (this.loaiHD === 9 || this.loaiHD == 1 || this.loaiHD == 5 || this.loaiHD == 13) ? this.isNopThueTheoThongTu1032014BTC : false);
    }
  }

  detectChangeLoaiThueSuat(hasTinhThue = true) {
    if (this.fbBtnSaveDisable === false) {
      if (this.loaiThueSuat === 1) {
        let thueGTGT = null;
        let firstThueIdx = -1;

        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          const item = this.hoaDonChiTiets[i];
          if ((item.tinhChat === 1 || item.tinhChat === 3) && !thueGTGT) {
            thueGTGT = item.thueGTGT;
            firstThueIdx = i;
            break;
          }
        }

        if (thueGTGT) {

          for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
            this.hoaDonChiTiets[i].thueGTGT = thueGTGT;

            if (hasTinhThue) {
              this.hoaDonChiTiets[i].thueGTGTDirty = true;
              this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.THUE_GTGT, true, null, false);
            }

            if (i === firstThueIdx) {
              if (i > 0) this.hoaDonChiTiets[i].disabledThueGTGT = true; /// disable all thue
            } else {
              this.hoaDonChiTiets[i].disabledThueGTGT = true;
            }
          }
          /// Gọi hàm này cx tính laik tổng tiền 
          this.isTinhLaiThue = false;
          this.hoaDonDienTuForm.get('thueGTGT').setValue(thueGTGT);

          //this.tinhLaiTongTien();
        }


      } else {
        for (const key in this.hoaDonChiTiets) {
          const tinhChat = this.hoaDonChiTiets[key].tinhChat;
          if (tinhChat === 1 || tinhChat === 3) {
            this.hoaDonChiTiets[key].disabledThueGTGT = false;
          }
        }
      }
    }

  }

  getHHDV() {
    this.hangHoaDichVuService.GetAll(this.displayData).subscribe((rs: any[]) => {
      this.listVT_HH = rs;
    })
  }

  getDonViTinh() {
    this.donViTinhService.GetAll(this.displayData).subscribe((rs: any[]) => {
      this.listDonViTinhs = rs;
    })
  }

  getHinhThucThanhToan() {
    this.hinhThucThanhToanService.GetAll(this.displayData).subscribe((rs: any[]) => {
      this.hinhThucThanhToans = rs;
    })
  }

  getLoaiTien() {
    this.loaiTienService.GetAll(this.displayData).subscribe((rs: any[]) => {
      this.loaiTiens = rs;
      this.loaiTiensSearch = rs;
    })
  }
  GetTienLuiChungTu() {
    this.hoaDonDienTuService.TienLuiChungTu(this.isAddNew === true ? null : this.data.hoaDonDienTuId)
      .subscribe((res: any) => {
        this.tienLuiModel = res;
      });
  }

  viewReceipt() {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
        const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
        this.isOpenNestedModal = true;
        showModalPreviewPDF(this.modalService, pathPrint, () => {
          this.isOpenNestedModal = false;
        });
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

  async publishReceipt(callback: () => any = null) {
    if (this.spinning != true && this.isPhatHanhLai) {
      this.submitForm();
      return;
    }

    if (this.lyDoThayThe != null) {
      let ngayHienTai: any = await this.hoaDonDienTuService.GetNgayHienTai();

      let ngayHoaDon = this.hoaDonDienTuForm.get('ngayHoaDon').value;
      if (ngayHoaDon != null && ngayHoaDon != '') {
        //kiểm tra xem ngày hóa đơn theo kỳ kế toán có hợp lệ
        if (kiemTraHoaDonHopLeTheoKyKeKhai(this.modalService, ngayHoaDon, 'phatHanhHoaDon', ngayHienTai.result, this.data.boKyHieuHoaDon.kyHieu) == false) {
          return;
        }
      }
    }

    //trường hợp này ít xảy ra: nhưng kiểm tra với dữ liệu cũ
    //kiểm tra xem hóa đơn thay thế đã được cấp mã hay chưa
    //đây là trường hợp: dữ liệu cũ; mà ở đó hóa đơn bị thay thế nhiều lần, trong đó có hóa đơn thay thế đã được cấp mã thì
    //hóa đơn thay thế phát hành sẽ ko được phát hành nữa
    var thongBaoKiemTraHoaDonThayThe: any = await this.hoaDonDienTuService.KiemTraHoaDonThayTheDaDuocCapMa(this.data.hoaDonDienTuId);
    if (thongBaoKiemTraHoaDonThayThe.result != null && !this.isCopy) {
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
          msTitle: 'Kiểm tra lại',
          msContent: thongBaoKiemTraHoaDonThayThe.result,
        },
        nzFooter: null
      });

      return;
    }

    this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId)
      .subscribe(async (res: any) => {
        if (this.ActivedModal != null) return;
        this.isOpenNestedModal = true;
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
            data: res,
            isPhatHanhLai: this.isPhatHanhLai,
            formModal: this
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          this.isOpenNestedModal = false;
          if (rs) {
            if (rs && rs.isNgungChucNangVaXemChiTiet) {
              this.sharedService.emitChange({
                type: 'LoadDataWhenNgungChucNangVaXemChiTiet',
                status: true,
                value: rs
              });
            } else {
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

            this.modal.destroy(true);
            if (callback) {
              callback();
            }
          } else {
            if (this.isPhatHanhLai && callback) {
              callback();
            }
          }
        });
      });
  }

  forkJoin() {
    const ngayHoaDon = this.isAddNew ? moment().format('YYYY-MM-DD') : this.data.ngayHoaDon;
    const boKyHieuHoaDonId = this.isAddNew ? null : this.data.boKyHieuHoaDonId;
    const loaiHoaDon = this.loaiHD == 9 ? 1 : this.loaiHD == 10 ? 2 : (this.loaiHD == 13 || this.loaiHD == 14) ? 1 : this.loaiHD == 5 ? 1 : this.loaiHD;
    const roleId = this.currentUser.roleId;
    console.log(roleId);

    return forkJoin([
      this.loaiTienService.GetAll(this.displayData),
      this.mauHoaDonService.GetAll({ isThongBaoPhatHanh: true }),
      this.doiTuongService.GetAllNhanVien(),
      this.donViTinhService.GetAll(this.displayData),
      this.hangHoaDichVuService.GetAll(this.displayData),
      this.hoaDonDienTuService.TienLuiChungTu(this.data ? this.data.hoaDonDienTuId : null),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(1, loaiHoaDon),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(2, loaiHoaDon),
      this.boKyHieuHoaDonService.GetListForHoaDon(this.loaiHD, ngayHoaDon, boKyHieuHoaDonId, roleId),
      this.doiTuongService.GetAllPaging(this.displayDataDT),
      this.viewDetail ? this.tuyChonService.GetListByHoaDonId(this.data.hoaDonDienTuId) : this.tuyChonService.GetAll(),
      (this.data == null || (this.data && !this.data.thayTheChoHoaDonId)) ? of(null) : this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId),
      this.hoSoHDDTService.GetDetail()
    ]);
  }

  blurThanhTienDetail(index: number, event: any) {
    let soTien: number;
    if (event) {
      soTien = event;
    }
    else {
      this.hoaDonChiTiets[index].thanhTien = 0;
      if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].thanhTienQuyDoi = 0;
      soTien = 0;
    }

    const tyGia = this.hoaDonDienTuForm.get('tyGia').value;
    const thanhTienQuyDoi = soTien * tyGia;
    if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].thanhTienQuyDoi = thanhTienQuyDoi;

    const ck = this.hoaDonDienTuForm.get('tyLeChietKhau').value;
    const tienCK = ck * soTien / 100;
    this.hoaDonChiTiets[index].tienChietKhau = tienCK;
    if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].tienChietKhauQuyDoi = tienCK * tyGia;

    const thueGTGT = this.hoaDonDienTuForm.get('thueGTGT').value;
    const tienThueGTGT = (soTien - tienCK) * thueGTGT / 100;
    this.hoaDonChiTiets[index].tienThueGTGT = tienThueGTGT;
    if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].tienThueGTGTQuyDoi = tienThueGTGT * tyGia;

    this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);
  }

  blurTyLeChietKhau(index: number, event: any) {
    if (event) {
      const phanTham = parseInt(event, 0);
      const thanhTien = this.hoaDonChiTiets[index].thanhTien;
      const chietKhau = mathRound(thanhTien * phanTham / 100, this.ddtp.getTienQuyDoi());
      this.hoaDonChiTiets[index].tienChietKhau = chietKhau;

      const tyGia = this.hoaDonDienTuForm.get('tyGia').value;
      const chietKhauQuyDoi = chietKhau * tyGia;
      if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].tienChietKhauQuyDoi = chietKhauQuyDoi;
    } else {
      this.hoaDonChiTiets[index].tienChietKhau = 0;
      if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].tienChietKhauQuyDoi = 0;

    }

    this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);
  }

  blurTienChietKhau(index: number, event: any) {
    let tienCk: number;
    if (event) {
      tienCk = event;
    }
    else tienCk = 0;

    const tyGia = this.hoaDonDienTuForm.get('tyGia').value;
    const thanhTien = this.hoaDonChiTiets[index].thanhTien;
    const thueGTGT = this.hoaDonDienTuForm.get('thueGTGT').value;
    const tienThueGTGT = (thanhTien - tienCk) * thueGTGT / 100;
    this.hoaDonChiTiets[index].tienThueGTGT = tienThueGTGT;
    if (this.maLoaiTien != "VND") this.hoaDonChiTiets[index].tienThueGTGTQuyDoi = tienThueGTGT * tyGia;

    this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);

  }

  focusComboBox(key, controlId, detailTableId) {
    this.comboboxFocusKey = key;
    this.comboboxControlId = controlId;
    this.comboboxDetailTableId = detailTableId;
  }

  ChangeKhachHang(event: any) {
    if (event && this.hoaDonDienTuForm.get('khachHangId').dirty) {
      this.doiTuongService.GetById(event).subscribe((rs: any) => {
        if (rs) {
          this.hoaDonDienTuForm.get('maSoThue').setValue(rs.maSoThue);
          this.hoaDonDienTuForm.get('maKhachHang').setValue(rs.ma);
          this.hoaDonDienTuForm.get('tenKhachHang').setValue(rs.ten);
          this.hoaDonDienTuForm.get('diaChi').setValue(rs.diaChi);
          this.hoaDonDienTuForm.get('canCuocCongDan').setValue(rs.canCuocCongDan);
          this.hoaDonDienTuForm.get('hoTenNguoiMuaHang').setValue(rs.hoTenNguoiMuaHang);
          this.hoaDonDienTuForm.get('soTaiKhoanNganHang').setValue(rs.soTaiKhoanNganHang);
          this.hoaDonDienTuForm.get('soDienThoaiNguoiMuaHang').setValue(rs.soDienThoaiNguoiMuaHang);
          this.hoaDonDienTuForm.get('tenNganHang').setValue(rs.tenNganHang);
          this.hoaDonDienTuForm.get('emailNguoiMuaHang').setValue(rs.emailNguoiMuaHang);
        }
      })
    }
  }

  ChangeNhanVien(event: any) {
    if (event) {
      const nhanVien = this.nhanViens.find(x => x.doiTuongId === event);
      if (nhanVien) {
        this.hoaDonDienTuForm.get('maNhanVienBanHang').setValue(nhanVien.ma);
        this.hoaDonDienTuForm.get('tenNhanVienBanHang').setValue(nhanVien.ten);

        this.hoaDonChiTiets.forEach((item: any) => {
          if (!item.nhanVienBanHangId) {
            item.nhanVienBanHangId = nhanVien.doiTuongId;
            item.maNhanVien = nhanVien.ma;
            item.tenNhanVien = nhanVien.ten;
          }
        });
      }
    } else {
      this.hoaDonDienTuForm.get('maNhanVienBanHang').setValue(null);
    }
  }

  ChangeNhanVienChiTiet(event: any, i: number) {
    if (event) {
      const nhanVien = this.nhanViens.find(x => x.doiTuongId === event);
      if (nhanVien) {
        this.hoaDonChiTiets[i].maNhanVien = nhanVien.ma;
        this.hoaDonChiTiets[i].tenNhanVien = nhanVien.ten;
      }
    } else {
      this.hoaDonChiTiets[i].maNhanVien = null;
    }

    this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);

  }


  ChangeVatTu(index: number, event: any) {
    this.hoaDonChiTiets[index].hangHoaDichVuId = event;

    this.hangHoaDichVuService.GetById(event).subscribe((rs: any) => {
      if (rs) {
        this.hoaDonChiTiets[index].hangHoaDichVu = rs;
        this.hoaDonChiTiets[index].maHang = rs.ma;
        this.hoaDonChiTiets[index].tenHang = rs.ten;

        this.hoaDonChiTiets[index].donViTinhId = rs.donViTinhId;
        this.hoaDonChiTiets[index].tenDonViTinh = rs.tenDonViTinh;

        if (this.hoaDonDienTuForm.get('loaiDieuChinh').value != 3) {
          this.hoaDonChiTiets[index].donGia = rs.donGiaBan;
          this.hoaDonChiTiets[index].donGiaDirty = true;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);

          this.tinhToanHDDV.blurTinhToan(index, BlurPosition.DON_GIA);

          if (this.boolPhatSinhBanHangTheoDGSauThue) {
            this.hoaDonChiTiets[index].donGiaSauThue = rs.isGiaBanLaDonGiaSauThue ? rs.donGiaBan : 0;
            this.hoaDonChiTiets[index].donGiaSauThueDirty = true;
            this.hoaDonChiTiets[index].isChangeVatTu = true;
            this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);

            this.tinhToanHDDV.blurTinhToan(index, BlurPosition.DON_GIA_SAU_THUE, false);
            // this.hoaDonChiTiets[index].isChangeVatTu = false;
          }

          if (this.hoaDonDienTuForm.get('loaiChietKhau').value === 1) {
            this.hoaDonChiTiets[index].tyLeChietKhau = rs.tyLeChietKhau;
            this.hoaDonChiTiets[index].tyLeChietKhauDirty = true;
            this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);

            this.tinhToanHDDV.blurTinhToan(index, BlurPosition.TI_LE_CK);
          }
          if (!this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').value) {
            if (this.loaiHD === 1) {
              if (index === 0) {
                console.log(rs.thueGTGT);
                this.hoaDonChiTiets[index].thueGTGT = rs.thueGTGT;
              } else {
                if (this.loaiThueSuat === 1) { // loại 1 thuế suất
                  const firstThueGTGT = this.hoaDonChiTiets[index - 1].thueGTGT;
                  this.hoaDonChiTiets[index].thueGTGT = firstThueGTGT;
                } else { // loại nhiều thuế suất
                  this.hoaDonChiTiets[index].thueGTGT = rs.thueGTGT;
                }
              }

              if (this.loaiThueSuat === 1) {
                this.hoaDonDienTuForm.get('thueGTGT').setValue(this.hoaDonChiTiets[0].thueGTGT);
              }

              this.hoaDonChiTiets[index].thueGTGTDirty = true;
              this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);

              this.tinhToanHDDV.blurTinhToan(index, BlurPosition.THUE_GTGT);
            }
          }

        }
        this.hoaDonChiTiets[index].isChangeVatTu = false;
      } else {
        // this.hoaDonDienTuForm.get(`hoaDonChiTiets.${index}.maHang`).setValue(null);
      }

      //this.tinhLaiTongTien();
    });
  }

  changeDonViTinh(event: any, index: any) {
    if (event) {
      const model = this.listDonViTinhs.find(x => x.donViTinhId === event);
      this.hoaDonChiTiets[index].tenDonViTinh = model ? model.ten : null;
    } else {
      this.hoaDonChiTiets[index].tenDonViTinh = null;
    }
  }

  createForm() {
    this.hoaDonChiTiets = [];
    this.hoaDonDienTuForm = this.fb.group({
      hoaDonDienTuId: [null],
      maSoThue: [null, [CheckValidMst]],
      khachHangId: [null],
      maKhachHang: [null],
      isNopThueTheoThongTu1032014BTC: [false],
      tenKhachHang: [null, [Validators.maxLength(400)]],
      diaChi: [null, [Validators.maxLength(400)]],
      hoTenNguoiMuaHang: [null, [Validators.maxLength(100)]],
      soTaiKhoanNganHang: [null, [Validators.maxLength(30)]],
      soDienThoaiNguoiMuaHang: [null, [Validators.maxLength(20)]],
      tenNganHang: [null, [Validators.maxLength(400)]],
      emailNguoiMuaHang: [null, [CheckValidEmail, Validators.maxLength(50)]],
      hinhThucThanhToanId: [null],
      tenHinhThucThanhToan: [null, [Validators.maxLength(50)]],
      mauHoaDonId: [null],
      mauSo: [null],
      kyHieu: [null],
      boKyHieuHoaDonId: [null],
      soHoaDon: [null],
      ngayHoaDon: [null],
      ngayLap: [null],
      nhanVienBanHangId: [null],
      maNhanVienBanHang: [null],
      tenNhanVienBanHang: [null],
      hoTenNguoiNhanHD: [null],
      emailNguoiNhanHD: [null],
      soDienThoaiNguoiNhanHD: [null],
      canCuocCongDan: [null, [CheckValidCCCD]],
      taiLieuDinhKem: [null],
      loaiTienId: [null],
      maLoaiTien: [null],
      tyGia: [null],
      trangThai: [null],
      trangThaiQuyTrinh: [null],
      isLapVanBanThoaThuan: [null],
      maTraCuu: [null],
      maCuaCQT: [null],
      ngayKy: [null],
      loaiChietKhau: [0],
      fileChuaKy: [null],
      fileDaKy: [null],
      xmlChuaKy: [null],
      xmlDaKy: [null],
      trangThaiGuiHoaDon: [null],
      khachHangDaNhan: [null],
      soLanChuyenDoi: [null],
      lyDoXoaBo: [null],
      loaiHoaDon: [this.loaiHD],
      thayTheChoHoaDonId: [null],
      lyDoThayThe: [null],
      dieuChinhChoHoaDonId: [null],
      lyDoDieuChinh: [null],
      noiDungLyDoDieuChinh: [null],
      loaiDieuChinh: [null],
      loaiApDungHoaDonDieuChinh: [null],
      thoiHanThanhToan: [null],
      diaChiGiaoHang: [null],
      bienBanDieuChinhId: [this.bienBanDieuChinhId || null],
      isThongTinNguoiBanHoacNguoiMua: [null],
      isTheHienLyDoTrenHoaDon: [null],
      loaiThueSuat: [1],
      tyLeChietKhau: [0],
      isGiamTheoNghiQuyet: [false],
      tyLePhanTramDoanhThu: [0],
      // pxk
      canCuSo: [null],
      ngayCanCu: [null],
      cua: [null, [Validators.maxLength(400)]],
      dienGiai: [null, [Validators.maxLength(400)]],
      diaChiKhoNhanHang: [null],
      hoTenNguoiNhanHang: [null, [Validators.maxLength(100)]],
      diaChiKhoXuatHang: [null],
      hoTenNguoiXuatHang: [null, [Validators.maxLength(100)]],
      hopDongVanChuyenSo: [null, [Validators.maxLength(255)]],
      tenNguoiVanChuyen: [null, [Validators.maxLength(100)]],
      phuongThucVanChuyen: [null],
      isKemGuiEmail: [null],
      emailNhanKemTheo: [null],
      tenNguoiNhanKemTheo: [null],
      tongTienThanhToan: [0],
      tongTienHang: [0],
      tongTienChietKhau: [0],
      tongTienThueGTGT: [0],
      tongTienThanhToanQuyDoi: [0],
      tongTienHangQuyDoi: [0],
      tongTienChietKhauQuyDoi: [0],
      tongTienThueGTGTQuyDoi: [0],
      tongTienGiam: [0],
      tongTienGiamQuyDoi: [0],
      createdDate: [null],
      createdBy: [null],
      status: [null],
      stt: [null],
      loaiThue: [1],
      thueGTGT: ['10'],
      thueKhac: [0],
      truongThongTinBoSung1: [null],
      truongThongTinBoSung2: [null],
      truongThongTinBoSung3: [null],
      truongThongTinBoSung4: [null],
      truongThongTinBoSung5: [null],
      truongThongTinBoSung6: [null],
      truongThongTinBoSung7: [null],
      truongThongTinBoSung8: [null],
      truongThongTinBoSung9: [null],
      truongThongTinBoSung10: [null],

      /// Lưu lại thông tin người nộp thuế vào hóa đơn
      hoSoMaSoThue: [null],
      hoSoTenDonVi: [null],
      hoSoDiaChi: [null],
    });

    this.hoaDonDienTuForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    //add validation PXK
    if (this.loaiHD === 7 || this.loaiHD === 8) {
      this.hoaDonDienTuForm.get('canCuSo').setValidators([Validators.required, Validators.maxLength(255)]);
      this.hoaDonDienTuForm.get('diaChiKhoXuatHang').setValidators([Validators.required, Validators.maxLength(400)]);
      this.hoaDonDienTuForm.get('phuongThucVanChuyen').setValidators([Validators.required, Validators.maxLength(50)]);
      this.hoaDonDienTuForm.get('diaChiKhoNhanHang').setValidators([Validators.required, Validators.maxLength(400)]);
      if (this.loaiHD === 8) {
        this.hoaDonDienTuForm.get('ngayCanCu').setValidators([Validators.required]);
        this.hoaDonDienTuForm.get('tenNguoiVanChuyen').setValidators([Validators.required, Validators.maxLength(100)]);
      }
    }

    this.spinning = true;
    this.pendingApi = true;
    this.forkJoin().subscribe((res: any[]) => {
      console.log(res);
      this.loaiTiens = res[0];
      this.loaiTiensSearch = res[0];
      //this.hinhThucThanhToans = res[1];
      this.mauHoaDons = res[1];
      this.nhanViens = res[2];
      this.nhanViensSearch = res[2];
      this.listDonViTinhs = res[3];
      this.listVT_HH = res[4];
      this.tienLuiModel = res[5];
      this.truongThongTinBoSungs = res[6];
      this.LoadTruongDuLieuHoaDon(res[7]);
      this.boKyHieuHoaDons = res[8];
      this.boKyHieuHoaDonsRaw = res[8];
      this.doiTuongs = res[9].items;

      if (res[10]) {
        // var kyTuNganCach = res[10].find(x => x.ma === 'IntKyTuNganCach');
        // if (kyTuNganCach) {
        //   this.currencyThousands = kyTuNganCach.giaTri === '1' ? '.' : ',';
        //   this.currencyDecimal = kyTuNganCach.giaTri == '1' ? ',' : '.';
        //   this.intKyTuNganCach = kyTuNganCach.giaTri;
        // }
        if (this.isCopy) {
          //nếu là copy thì lấy thiết lập định dạng số hiện tại
          this.tuyChonService.GetAll().subscribe((rs: any) => {
            this.ddtp = new DinhDangThapPhan(rs);
          })
        } else {
          this.ddtp = new DinhDangThapPhan(res[10]);
        }
      }

      this.boolChoPhepNhapGiaTriAm = res[10].find(x => x.ma == "BoolChoPhepNhapSoAm") ? res[10].find(x => x.ma == "BoolChoPhepNhapSoAm").giaTri == "true" : false;
      this.boolChoPhepLapHDDTMTT = res[10].find(x => x.ma == "BoolChoPhepLapHDDTMTT") ? res[10].find(x => x.ma == "BoolChoPhepLapHDDTMTT").giaTri == "true" : false;
      this.isNopThueTheoThongTu1032014BTC = res[10].find(x => x.ma == "IsNopThueTheoThongTu1032014BTC") ? res[10].find(x => x.ma == "IsNopThueTheoThongTu1032014BTC").giaTri == "true" : false;
      this.hoSoNguoiNop = res[12];

      this.hoaDonDienTuForm.get('soHoaDon').disable();
      var phanQuyen = localStorage.getItem('KTBKUserPermission');
      if (phanQuyen != 'true') {
        this.permission = false;
        var pq = JSON.parse(phanQuyen);
        console.log(pq);
        this.thaoTacs = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
        this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
        this.boKyHieuHoaDons = this.boKyHieuHoaDonsRaw.filter(x => this.mauHoaDonDuocPQ.indexOf(x.boKyHieuHoaDonId) >= 0);
      }

      console.log(this.boKyHieuHoaDons);
      //this.disableOrEnableHeaderButtons();
      const vnd = this.loaiTiensSearch.find(x => x.ma == "VND");
      if (this.isAddNew) {
        //Lưu lại thông tin người nộp thuế vào hóa đơn
        this.hoaDonDienTuForm.get('hoSoDiaChi').setValue(this.hoSoNguoiNop.diaChi);
        this.hoaDonDienTuForm.get('hoSoMaSoThue').setValue(this.hoSoNguoiNop.maSoThue);
        this.hoaDonDienTuForm.get('hoSoTenDonVi').setValue(this.hoSoNguoiNop.tenDonVi);

        const loaiTien = (this.boolCoPhatSinhNghiepVuNgoaiTe == "true" || this.boolCoPhatSinhNghiepVuNgoaiTe == true) ? this.loaiTiens[0] : vnd;
        this.maLoaiTien = loaiTien.ma;

        this.hoaDonDienTuForm.get('loaiTienId').setValue(loaiTien.loaiTienId);
        this.hoaDonDienTuForm.get('maLoaiTien').setValue(loaiTien.ma);
        this.hoaDonDienTuForm.get('tyGia').setValue(loaiTien.tyGiaQuyDoi);

        if (this.maLoaiTien === 'VND') {
          this.hoaDonDienTuForm.get('tyGia').disable();
          this.isVND = true;

        } else {
          this.isVND = false;
        }

        this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);
        console.log(this.isNopThueTheoThongTu1032014BTC);
        this.hoaDonDienTuForm.patchValue({
          ngayHoaDon: moment().format("YYYY-MM-DD"),
          status: true,
          hinhThucThanhToanId: 3,
          tenHinhThucThanhToan: this.hThucThanhToans.find(x => x.id == 3).name,
          mauHoaDonId: this.boKyHieuHoaDons.length > 0 ? this.boKyHieuHoaDons[0].mauHoaDons[0].mauHoaDonId : null,
          boKyHieuHoaDonId: this.boKyHieuHoaDons.length > 0 ? this.boKyHieuHoaDons[0].boKyHieuHoaDonId : null,
          isNopThueTheoThongTu1032014BTC: this.loaiThueSuat == 2 && (this.loaiHD === 9 || this.loaiHD == 1 || this.loaiHD == 5 || this.loaiHD == 13) ? this.isNopThueTheoThongTu1032014BTC : false
        });

        this.detectChangeLoaiThueSuat();

        console.log(this.boKyHieuHoaDons);
        if (this.boKyHieuHoaDons.length > 0) {
          this.loaiThues = this.boKyHieuHoaDons[0].mauHoaDons;
          console.log(this.loaiThues);
          this.loaiThueSuat = this.boKyHieuHoaDons[0].mauHoaDons[0].loaiThueGTGT;
          this.hoaDonDienTuForm.get('loaiThue').setValue(this.loaiThueSuat);
        }
        var boKyHieuHoaDonId = this.hoaDonDienTuForm.get('boKyHieuHoaDonId').value;
        const model = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === boKyHieuHoaDonId);
        const mauHoaDon = model.mauHoaDons.find(x => x.loaiThueGTGT === this.loaiThueSuat);
        if (mauHoaDon) {
          this.hoaDonDienTuForm.get('mauHoaDonId').setValue(mauHoaDon.mauHoaDonId)
          this.tenLoaiHoaDonFull = mauHoaDon.tenLoaiHoaDonFull;
        }
        else {
          const mauHoaDon = model.mauHoaDons.find(x => x.mauHoaDonId == this.hoaDonDienTuForm.get('mauHoaDonId').value);
          if (mauHoaDon) {
            this.tenLoaiHoaDonFull = mauHoaDon.tenLoaiHoaDonFull;
          }
        }


        if ((this.lyDoThayThe != null && this.lyDoThayThe != undefined) || (this.thongTinHoaDonSaiSotBiThayThe != null && this.thongTinHoaDonSaiSotBiThayThe != undefined)) {
          let isNhanBan = false;
          let hoaDonId = '';
          if (this.lyDoThayThe != null && this.lyDoThayThe != undefined) {
            isNhanBan = this.lyDoThayThe.tichChonNhanBanThongTin;
            hoaDonId = this.lyDoThayThe.thayTheChoHoaDonId;
          }
          if (this.thongTinHoaDonSaiSotBiThayThe != null && this.thongTinHoaDonSaiSotBiThayThe != undefined) {
            isNhanBan = this.thongTinHoaDonSaiSotBiThayThe.tichChonNhanBanThongTin;
            hoaDonId = this.thongTinHoaDonSaiSotBiThayThe.idHoaDonSaiSotBiThayThe;
          }

          if (isNhanBan) {
            this.hoaDonDienTuService.GetById(hoaDonId).subscribe(async (res: any) => {
              let chiTiets = res.hoaDonChiTiets;

              this.hoaDonDienTuForm.get('maSoThue').setValue(res.maSoThue);
              this.hoaDonDienTuForm.get('tenKhachHang').setValue(res.tenKhachHang);
              this.hoaDonDienTuForm.get('khachHangId').setValue(res.khachHangId);
              this.hoaDonDienTuForm.get('diaChi').setValue(res.diaChi);
              this.hoaDonDienTuForm.get('canCuocCongDan').setValue(res.canCuocCongDan);
              this.hoaDonDienTuForm.get('hoTenNguoiMuaHang').setValue(res.hoTenNguoiMuaHang);
              this.hoaDonDienTuForm.get('soTaiKhoanNganHang').setValue(res.soTaiKhoanNganHang);
              this.hoaDonDienTuForm.get('soDienThoaiNguoiMuaHang').setValue(res.soDienThoaiNguoiMuaHang);
              this.hoaDonDienTuForm.get('tenNganHang').setValue(res.tenNganHang);
              this.hoaDonDienTuForm.get('emailNguoiMuaHang').setValue(res.emailNguoiMuaHang);
              this.hoaDonDienTuForm.get('tenHinhThucThanhToan').setValue(res.tenHinhThucThanhToan);
              this.hoaDonDienTuForm.get('nhanVienBanHangId').setValue(res.nhanVienBanHangId);
              this.hoaDonDienTuForm.get('tenNhanVienBanHang').setValue(res.tenNhanVienBanHang);
              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').setValue(res.boKyHieuHoaDonId);
              this.hoaDonDienTuForm.get('loaiTienId').setValue(res.loaiTienId || ((this.boolCoPhatSinhNghiepVuNgoaiTe == "true" || this.boolCoPhatSinhNghiepVuNgoaiTe == true) ? this.loaiTiens[0].loaiTienId : vnd.loaiTienId));
              this.hoaDonDienTuForm.get('maLoaiTien').setValue(this.maLoaiTien);
              this.hoaDonDienTuForm.get('tyGia').setValue(res.tyGia || 1);
              this.hoaDonDienTuForm.get('hinhThucThanhToanId').setValue(!isNaN(res.hinhThucThanhToanId) ? parseInt(res.hinhThucThanhToanId) : res.hinhThucThanhToanId);
              this.hoaDonDienTuForm.get('truongThongTinBoSung1').setValue(res.truongThongTinBoSung1);
              this.hoaDonDienTuForm.get('truongThongTinBoSung2').setValue(res.truongThongTinBoSung2);
              this.hoaDonDienTuForm.get('truongThongTinBoSung3').setValue(res.truongThongTinBoSung3);
              this.hoaDonDienTuForm.get('truongThongTinBoSung4').setValue(res.truongThongTinBoSung4);
              this.hoaDonDienTuForm.get('truongThongTinBoSung5').setValue(res.truongThongTinBoSung5);
              this.hoaDonDienTuForm.get('truongThongTinBoSung6').setValue(res.truongThongTinBoSung6);
              this.hoaDonDienTuForm.get('truongThongTinBoSung7').setValue(res.truongThongTinBoSung7);
              this.hoaDonDienTuForm.get('truongThongTinBoSung8').setValue(res.truongThongTinBoSung8);
              this.hoaDonDienTuForm.get('truongThongTinBoSung9').setValue(res.truongThongTinBoSung9);
              this.hoaDonDienTuForm.get('truongThongTinBoSung10').setValue(res.truongThongTinBoSung10);

              if (res.khachHang) {
                this.doiTuongs.push(res.khachHang);
              }

              this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(res.tyLeChietKhau);

              if (chiTiets != null) {
                this.hoaDonChiTiets = chiTiets;
                // this.hoaDonChiTiets = [];
                // chiTiets.forEach((item: any) => {
                //   item.hoaDonDienTuChiTietId = null;
                //   const formGroup = this.createHoaDonChiTiets(item);
                //   this.hoaDonChiTiets.push(formGroup.getRawValue());
                // });
                this.hoaDonChiTiets = chiTiets;
                // this.hoaDonChiTiets = [];
                // chiTiets.forEach((item: any) => {
                //   item.hoaDonDienTuChiTietId = null;
                //   const formGroup = this.createHoaDonChiTiets(item);
                //   this.hoaDonChiTiets.push(formGroup.getRawValue());
                // });
                this.tinhLaiTongTien();
              }

              this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);
            });
          }

          if (this.lyDoThayThe) {
            this.hoaDonDienTuForm.get('lyDoXoaBo').setValidators([Validators.required, Validators.maxLength(255)]);
            this.hoaDonDienTuForm.get('lyDoXoaBo').updateValueAndValidity();
            this.hoaDonDienTuForm.get('lyDoXoaBo').setValue(this.lyDoThayThe.lyDo);

            this.checkAnHienGiamTheoNghiQuyetSo432022QH15(this.lyDoThayThe.thayTheChoHoaDonId, 'tt');

            this.hoaDonDienTuService.GetById(this.lyDoThayThe.thayTheChoHoaDonId).subscribe((hdbtt: any) => {
              if (hdbtt) {
                if (hdbtt.khachHang) {
                  this.doiTuongs.push(hdbtt.khachHang);
                }
                // set thông tin hóa đơn bị thay thế vào hóa đơn thay thế
                this.hoaDonDienTuForm.get('khachHangId').setValue(hdbtt.khachHangId);
                this.hoaDonDienTuForm.get('tenKhachHang').setValue(hdbtt.tenKhachHang);
                this.hoaDonDienTuForm.get('maSoThue').setValue(hdbtt.maSoThue);
                this.hoaDonDienTuForm.get('diaChi').setValue(hdbtt.diaChi);
                this.hoaDonDienTuForm.get('canCuocCongDan').setValue(hdbtt.canCuocCongDan);
                this.hoaDonDienTuForm.get('hoTenNguoiMuaHang').setValue(hdbtt.hoTenNguoiMuaHang);
                this.hoaDonDienTuForm.get('soTaiKhoanNganHang').setValue(hdbtt.soTaiKhoanNganHang);
                this.hoaDonDienTuForm.get('soDienThoaiNguoiMuaHang').setValue(hdbtt.soDienThoaiNguoiMuaHang);
                this.hoaDonDienTuForm.get('tenNganHang').setValue(hdbtt.tenNganHang);
                this.hoaDonDienTuForm.get('emailNguoiMuaHang').setValue(hdbtt.emailNguoiMuaHang);

                this.hoaDonDienTuForm.get('hinhThucThanhToanId').setValue(hdbtt.hinhThucThanhToanId);
                this.hoaDonDienTuForm.get('tenHinhThucThanhToan').setValue(hdbtt.tenHinhThucThanhToan);

                this.hoaDonDienTuForm.get('loaiTienId').markAsDirty();
                this.hoaDonDienTuForm.get('loaiTienId').setValue(hdbtt.loaiTienId);
                this.hoaDonDienTuForm.get('maLoaiTien').setValue(hdbtt.maLoaiTien);

                this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => x.phuongThucChuyenDL == hdbtt.boKyHieuHoaDon.phuongThucChuyenDL);
                this.boKyHieuHoaDonsRaw = this.boKyHieuHoaDonsRaw.filter(x => x.phuongThucChuyenDL == hdbtt.boKyHieuHoaDon.phuongThucChuyenDL);

              }
            });

            this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
            if (this.lyDoThayThe.thayTheChoHoaDonId) {
              this.hoaDonDienTuForm.get('thayTheChoHoaDonId').setValue(this.lyDoThayThe.thayTheChoHoaDonId);
            }
          }
        }

        if (this.lyDoDieuChinh) {
          this.noiDungDieuChinhHoaDon = getLyDoDieuChinh(this.lyDoDieuChinh);
          this.checkAnHienGiamTheoNghiQuyetSo432022QH15(this.lyDoDieuChinh.dieuChinhChoHoaDonId, 'dc');

          this.hoaDonDienTuService.GetById(this.lyDoDieuChinh.dieuChinhChoHoaDonId).subscribe((hdbdc: any) => {
            if (hdbdc) {
              if (hdbdc.khachHang) {
                this.doiTuongs.push(hdbdc.khachHang);
              }
              // set thông tin hóa đơn bị điều chỉnh vào hóa đơn điều chỉnh
              this.hoaDonDienTuForm.get('khachHangId').setValue(hdbdc.khachHangId);
              this.hoaDonDienTuForm.get('tenKhachHang').setValue(hdbdc.tenKhachHang);
              this.hoaDonDienTuForm.get('maSoThue').setValue(hdbdc.maSoThue);
              this.hoaDonDienTuForm.get('diaChi').setValue(hdbdc.diaChi);
              this.hoaDonDienTuForm.get('canCuocCongDan').setValue(hdbdc.canCuocCongDan);
              this.hoaDonDienTuForm.get('hoTenNguoiMuaHang').setValue(hdbdc.hoTenNguoiMuaHang);
              this.hoaDonDienTuForm.get('soTaiKhoanNganHang').setValue(hdbdc.soTaiKhoanNganHang);
              this.hoaDonDienTuForm.get('soDienThoaiNguoiMuaHang').setValue(hdbdc.soDienThoaiNguoiMuaHang);
              this.hoaDonDienTuForm.get('tenNganHang').setValue(hdbdc.tenNganHang);
              this.hoaDonDienTuForm.get('emailNguoiMuaHang').setValue(hdbdc.emailNguoiMuaHang);

              this.hoaDonDienTuForm.get('hinhThucThanhToanId').setValue(hdbdc.hinhThucThanhToanId);
              this.hoaDonDienTuForm.get('tenHinhThucThanhToan').setValue(hdbdc.tenHinhThucThanhToan);

              if (this.lyDoDieuChinh.lyDo) {
                this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(this.lyDoDieuChinh.lyDo);
              }

              this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => x.phuongThucChuyenDL == hdbdc.boKyHieuHoaDon.phuongThucChuyenDL);
              this.boKyHieuHoaDonsRaw = this.boKyHieuHoaDonsRaw.filter(x => x.phuongThucChuyenDL == hdbdc.boKyHieuHoaDon.phuongThucChuyenDL);
            }
          });

          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValidators([Validators.required, Validators.maxLength(255)]);
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').updateValueAndValidity();
          this.hoaDonDienTuForm.get('loaiDieuChinh').setValue(1);

          this.hoaDonDienTuForm.get('loaiApDungHoaDonDieuChinh').setValue(1);
          if (this.lyDoDieuChinh.dieuChinhChoHoaDonId) {
            this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').setValue(this.lyDoDieuChinh.dieuChinhChoHoaDonId);
          }

          if (this.lyDoDieuChinh.isSystem == true) {
            this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').disable();
            this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').setValue(this.lyDoDieuChinh.isLapVanBanThoaThuan);
          }

          if (this.lyDoDieuChinh.loaiTienId) {
            this.hoaDonDienTuForm.get('loaiTienId').disable();
            this.hoaDonDienTuForm.get('loaiTienId').markAsDirty();
            this.hoaDonDienTuForm.get('loaiTienId').setValue(this.lyDoDieuChinh.loaiTienId);
            this.hoaDonDienTuForm.get('maLoaiTien').setValue(this.lyDoDieuChinh.maLoaiTien);
          }
        }

        if (this.lyDoThayThe) {
          if (this.lyDoThayThe.tichChonNhanBanThongTin != true) {
            this.hoaDonChiTiets.push(this.createHoaDonChiTiets(null).getRawValue());
          }
        }
        else {
          this.hoaDonChiTiets.push(this.createHoaDonChiTiets(null).getRawValue());
        }

        this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);
        this.disableOrEnableHeaderButtons();
      } else {
        if (this.isCopy) {
          this.data.hoSoMaSoThue = this.hoSoNguoiNop.maSoThue;
          this.data.hoSoTenDonVi = this.hoSoNguoiNop.tenDonVi;
          this.data.hoSoDiaChi = this.hoSoNguoiNop.diaChi;
        }
        if (this.data.soHoaDon == null) this.hoaDonDienTuForm.get('soHoaDon').setValue("<Chưa cấp số>");
        if (this.data.loaiTienId) {
          this.maLoaiTien = this.loaiTiens.find(x => x.loaiTienId === this.data.loaiTienId).ma;
        } else {
          this.maLoaiTien = 'VND';
        }

        if (this.maLoaiTien === 'VND') {
          this.hoaDonDienTuForm.get('tyGia').disable();
          this.isVND = true;
        } else {
          this.isVND = false;
          if (!this.data.tyGia) {
            const tyGia = this.loaiTiens.find(x => x.loaiTienId === this.data.loaiTienId).tyGiaQuyDoi;
            this.hoaDonDienTuForm.get('tyGia').setValue(tyGia);
          }
        }

        this.listFile = this.data.taiLieuDinhKems;
        this.listUploadedFile = this.data.taiLieuDinhKems;

        this.displayData.oldFromDate = moment(this.data.ngayHoaDon).format('YYYY-MM-DD');
        this.displayData.oldToDate = moment(this.data.ngayHoaDon).format('YYYY-MM-DD');

        const model = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === this.data.boKyHieuHoaDonId);
        const mauHoaDon = this.mauHoaDons.find(x => x.mauHoaDonId == this.data.mauHoaDonId);
        this.data.loaiThue = this.data.loaiThue ? this.data.loaiThue : mauHoaDon.loaiThueGTGT;
        console.log(model.mauHoaDons);
        this.loaiThues = model.mauHoaDons;
        this.loaiThueSuat = mauHoaDon.loaiThueGTGT;
        this.hoaDonDienTuForm.patchValue({
          ...this.data,
          maSoThue: this.data.maSoThue,
          loaiTienId: this.data.loaiTienId || ((this.boolCoPhatSinhNghiepVuNgoaiTe == "true" || this.boolCoPhatSinhNghiepVuNgoaiTe == true) ? this.loaiTiens[0].loaiTienId : vnd.loaiTienId),
          maLoaiTien: this.maLoaiTien,
          tyGia: this.data.tyGia || 1,
          hinhThucThanhToanId: !isNaN(this.data.hinhThucThanhToanId) ? parseInt(this.data.hinhThucThanhToanId) : this.data.hinhThucThanhToanId,
          ngayHoaDon: moment(this.data.ngayHoaDon).format('YYYY-MM-DD'),
          ngayCanCu: this.data.ngayCanCu ? moment(this.data.ngayCanCu).format('YYYY-MM-DD') : null,
          hoaDonChiTiets: []
        });

        console.log(this.hoaDonDienTuForm.get('loaiThue').value);
        this.detectChangeLoaiThueSuat(false);

        if (this.data.lyDoThayThe) {
          this.checkAnHienGiamTheoNghiQuyetSo432022QH15(this.data.lyDoThayThe.thayTheChoHoaDonId, 'tt');
        }
        if (this.lyDoThayThe) {
          this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
          this.hoaDonDienTuForm.get('lyDoXoaBo').setValue(this.lyDoThayThe.lyDo);
          this.hoaDonDienTuForm.get('lyDoXoaBo').setValidators([Validators.required, Validators.maxLength(255)]);
          this.hoaDonDienTuForm.get('lyDoXoaBo').updateValueAndValidity();
        }
        else {
          if (this.data.lyDoThayThe) {
            this.lyDoThayThe = JSON.parse(this.data.lyDoThayThe);
            this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
            this.hoaDonDienTuForm.get('lyDoXoaBo').setValue(this.lyDoThayThe.lyDo);
            this.hoaDonDienTuForm.get('lyDoXoaBo').setValidators([Validators.required, Validators.maxLength(255)]);
            this.hoaDonDienTuForm.get('lyDoXoaBo').updateValueAndValidity();
          }
          else {
            if (this.data.trangThai == 3) {
              let hoaDonBiThayThe = res[11];
              this.lyDoThayThe = new LyDoThayThe();
              this.lyDoThayThe.thayTheChoHoaDonId = this.data.thayTheChoHoaDonId;
              this.lyDoThayThe.mauSo = hoaDonBiThayThe.mauSo;
              this.lyDoThayThe.kyHieu = hoaDonBiThayThe.kyHieu;
              this.lyDoThayThe.loaiHoaDon = hoaDonBiThayThe.loaiHoaDon;
              this.lyDoThayThe.hinhThucHoaDonCanThayThe = hoaDonBiThayThe.hinhThucHoaDon;
              this.lyDoThayThe.ngayHoaDon = hoaDonBiThayThe.ngayHoaDon;
              this.lyDoThayThe.soHoaDon = hoaDonBiThayThe.soHoaDon;
              this.lyDoThayThe.lyDo = this.data.lyDoXoaBo;
              this.lyDoThayThe.isSystem = true;
              this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
            }
          }
        }
        if (this.isChuyenHoaDonGocThanhThayThe) {
          if (this.lyDoThayThe.thayTheChoHoaDonId) {
            this.hoaDonDienTuForm.get('thayTheChoHoaDonId').setValue(this.lyDoThayThe.thayTheChoHoaDonId);
          }
        }
        if (this.data.lyDoDieuChinh) {
          this.checkAnHienGiamTheoNghiQuyetSo432022QH15(this.data.dieuChinhChoHoaDonId, 'dc');
        }
        if (this.data.lyDoDieuChinh) {
          this.lyDoDieuChinh = JSON.parse(this.data.lyDoDieuChinh);
          if (!this.lyDoDieuChinh.dieuChinhChoHoaDonId) this.lyDoDieuChinh.dieuChinhChoHoaDonId = this.data.dieuChinhChoHoaDonId;
          this.noiDungDieuChinhHoaDon = getLyDoDieuChinh(this.lyDoDieuChinh);
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(this.lyDoDieuChinh.lyDo);
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValidators([Validators.required, Validators.maxLength(255)]);
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').updateValueAndValidity();
        }

        if (this.isCopy && !this.boKyHieuHoaDons.some(x => x.boKyHieuHoaDonId === this.data.boKyHieuHoaDonId)) {
          this.boKyHieuHoaDons.push(this.data.boKyHieuHoaDon);
        }

        if (this.boKyHieuHoaDons.length > 0) {
          var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === this.data.boKyHieuHoaDonId);
          if (boKyHieuHoaDon) {
            this.loaiThueSuat = this.data.loaiThue;
            if (this.loaiThueSuat === 1 && this.data.hoaDonChiTiets.length > 0) {
              let thueGTGT = this.data.hoaDonChiTiets[0].thueGTGT;
              if (thueGTGT) {
                if (thueGTGT && thueGTGT.includes('KHAC')) {
                  const splitThue = thueGTGT.split(':') as any[];
                  if (splitThue.length > 1) {
                    this.hoaDonDienTuForm.get('thueGTGT').setValue(splitThue[0]);
                    this.hoaDonDienTuForm.get('thueKhac').setValue(parseFloat(splitThue[1]));
                  }
                } else {
                  this.hoaDonDienTuForm.get('thueGTGT').setValue(thueGTGT);
                }
              }
            }

            this.hoaDonDienTuForm.get('loaiThue').setValue(this.loaiThueSuat);
          }
        }

        if (this.data.khachHang) {
          this.doiTuongs.push(this.data.khachHang);
        }
        this.hoaDonChiTiets = this.data.hoaDonChiTiets;

        // const hoaDonChiTietFormArray = this.hoaDonDienTuForm.get('hoaDonChiTiets') as FormArray;
        // hoaDonChiTietFormArray.clear();
        // const chiTiets = this.data.hoaDonChiTiets;
        // chiTiets.forEach((item: any) => {
        //   const formGroup = this.createHoaDonChiTiets(item);
        //   this.hoaDonChiTiets.push(formGroup.getRawValue());
        // });

        this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);

        if (this.data.tongTienThueGTGT != this.hoaDonDienTuForm.get('tongTienThueGTGT').value) {
          this.hoaDonDienTuForm.get('tongTienThueGTGT').setValue(this.data.tongTienThueGTGT);
          this.hoaDonDienTuForm.get('tongTienThueGTGTQuyDoi').setValue(this.data.tongTienThueGTGTQuyDoi);
        }

        if (this.data.tongTienThanhToan != this.hoaDonDienTuForm.get('tongTienThanhToan').value) {
          this.hoaDonDienTuForm.get('tongTienThanhToan').setValue(this.data.tongTienThanhToan);
          this.hoaDonDienTuForm.get('tongTienThanhToanQuyDoi').setValue(this.data.tongTienThanhToanQuyDoi);
        }

        if (this.data.tongTienHang != this.hoaDonDienTuForm.get('tongTienHang').value) {
          this.hoaDonDienTuForm.get('tongTienHang').setValue(this.data.tongTienHang);
        }
      }

      this.hoaDonDienTuForm.get('soHoaDon').disable();

      this.hoaDonDienTuForm.get('ngayHoaDon').markAsDirty();
      this.changeNgayHoaDon(this.hoaDonDienTuForm.get('ngayHoaDon').value, true, false, false);

      if (this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').value) {
        this.changeGiamTheoNghiQuyet(this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').value, true);
      } else {
        if (this.data != null && this.data.isGiamTheoNghiQuyet) {
          this.hoaDonDienTuForm.get(`isGiamTheoNghiQuyet`).setValue(this.data.isGiamTheoNghiQuyet);
          this.hoaDonDienTuForm.get(`isGiamTheoNghiQuyet`).markAsDirty();
          this.changeGiamTheoNghiQuyet(this.data.isGiamTheoNghiQuyet, true);
        }
      }


      this.disableOrEnableHeaderButtons();

      // if (this.lyDoThayThe) {
      //   //kiểm tra để tích chọn sẵn trường lập văn bản thỏa thuận khi lập hóa đơn thay thế
      //   if (this.lyDoThayThe.isSystem == true) //nếu là hóa đơn trong hệ thống
      //   {
      //     this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').disable();
      //     this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').setValue(this.lyDoThayThe.isLapVanBanThoaThuan);
      //   }
      // }

      if (this.data && this.viewDetail && this.fbBtnEditDisable && this.fbBtnSaveDisable) {
        const indexKH = this.doiTuongs.findIndex(x => x.doiTuongId === this.data.khachHangId);
        if (indexKH !== -1) {
          this.doiTuongs[indexKH].ma = this.data.maKhachHang;
        }

        const indexNV = this.nhanViensSearch.findIndex(x => x.doiTuongId === this.data.nhanVienBanHangId);
        if (indexNV !== -1) {
          this.nhanViensSearch[indexNV].ma = this.data.maNhanVienBanHang;
        }

        const indexLT = this.loaiTiensSearch.findIndex(x => x.loaiTienId === this.data.loaiTienId);
        if (indexLT !== -1) {
          this.loaiTiensSearch[indexLT].ma = this.data.maLoaiTien;
        }
      }

      if (this.isChuyenHoaDonGocThanhThayThe && this.hoaDonDienTuForm.invalid) {
        // tslint:disable-next-line:forin
        for (const i in this.hoaDonDienTuForm.controls) {
          this.hoaDonDienTuForm.controls[i].markAsDirty();
          this.hoaDonDienTuForm.controls[i].updateValueAndValidity();
        }
        setStyleTooltipError(true);
        this.spinning = false;
        this.pendingApi = false;
        return;
      }
      else {
        this.spinning = false;
        this.pendingApi = false;
      }
    });
  }
  checkAnHienGiamTheoNghiQuyetSo432022QH15(choHoaDonId: any, loai: any) {
    //Kiểm tra nếu hđ bị thay thế nằm trong khoảng thời gian ưu đãi của thuế suất thì khi thay thế vẫn dc hưởng ưu đãi (thời gian ưu đãi từ 01/2/2022 - 31/12/2022)
    this.hoaDonDienTuService.GetHoaDonGocCuaHDBi(choHoaDonId, loai).subscribe((hdbttgoc: any) => {
      console.log('hdbttgoc', hdbttgoc);

      if (hdbttgoc) {
        if (parseInt(moment(hdbttgoc.ngayHoaDon).format('MM')) >= 2 && parseInt(moment(hdbttgoc.ngayHoaDon).format('MM')) <= 12 && moment(hdbttgoc.ngayHoaDon).format('YYYY') === '2022') {
          this.isGiamTheoNghiQuyetSo432022QH15 = true;
          this.isGiamTheoNghiQuyetSo432022QH15_DC_TT = true;
        }
      }
    });
  }
  loadForm() {
    this.disableOrEnableHeaderButtons();

    if (this.permission != true) {
      this.mauHoaDons = this.mauHoaDons.filter(x => this.mauHoaDonDuocPQ.indexOf(x.mauHoaDonId));
    }

    //this.disableOrEnableHeaderButtons();
    const vnd = this.loaiTiensSearch.find(x => x.ma == "VND");
    if (this.isAddNew) {
      const loaiTien = (this.boolCoPhatSinhNghiepVuNgoaiTe == "true" || this.boolCoPhatSinhNghiepVuNgoaiTe == true) ? this.loaiTiens[0] : vnd;
      this.maLoaiTien = loaiTien.ma;

      this.hoaDonDienTuForm.get('loaiTienId').setValue(loaiTien.loaiTienId);
      this.hoaDonDienTuForm.get('maLoaiTien').setValue(loaiTien.maLoaiTien);
      this.hoaDonDienTuForm.get('tyGia').setValue(loaiTien.tyGiaQuyDoi);

      if (this.maLoaiTien === 'VND') {
        this.hoaDonDienTuForm.get('tyGia').disable();
        this.isVND = true;

      } else {
        this.isVND = false;
      }

      this.hoaDonDienTuForm.patchValue({
        ngayHoaDon: moment().format("YYYY-MM-DD"),
        status: true,
        hinhThucThanhToanId: 3,
        tenHinhThucThanhToan: this.hThucThanhToans.find(x => x.id == 3).name,
        mauHoaDonId: this.boKyHieuHoaDons.length > 0 ? this.boKyHieuHoaDons[0].mauHoaDonId : null,
        boKyHieuHoaDonId: this.boKyHieuHoaDons.length > 0 ? this.boKyHieuHoaDons[0].boKyHieuHoaDonId : null
      });

      if (this.lyDoThayThe) {
        this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
        if (this.lyDoThayThe.thayTheChoHoaDonId) {
          this.hoaDonDienTuForm.get('thayTheChoHoaDonId').setValue(this.lyDoThayThe.thayTheChoHoaDonId);
        }

        //kiểm tra để tích chọn sẵn trường lập văn bản thỏa thuận khi lập hóa đơn thay thế
        if (this.lyDoThayThe.isSystem == true) //nếu là hóa đơn trong hệ thống
        {
          this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').disable();
          this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').setValue(this.lyDoThayThe.isLapVanBanThoaThuan);
        }
      }

      if (this.lyDoDieuChinh) {
        this.noiDungDieuChinhHoaDon = getLyDoDieuChinh(this.lyDoDieuChinh);
        if (this.lyDoDieuChinh.lyDo)
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(this.lyDoDieuChinh.lyDo);
        else {
          this.hoaDonDienTuService.GetById(this.lyDoDieuChinh.dieuChinhChoHoaDonId).subscribe((hdbdc: any) => {
            if (hdbdc) {
              this.bienBanDieuChinhService.GetById(hdbdc.bienBanDieuChinhId).subscribe((res: any) => {
                if (res) {
                  var lyDoDC = JSON.parse(res.lyDoDieuChinh);
                  if (lyDoDC)
                    this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(lyDoDC.lyDo);
                }
              })
            }
          })
        }
        this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValidators([Validators.required, Validators.maxLength(255)]);
        this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').updateValueAndValidity();
        this.hoaDonDienTuForm.get('loaiDieuChinh').setValue(1);

        this.hoaDonDienTuForm.get('loaiApDungHoaDonDieuChinh').setValue(1);
        if (this.lyDoDieuChinh.dieuChinhChoHoaDonId) {
          this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').setValue(this.lyDoDieuChinh.dieuChinhChoHoaDonId);
        }

        if (this.lyDoDieuChinh.isSystem == true) {
          this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').disable();
          this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').setValue(this.lyDoDieuChinh.isLapVanBanThoaThuan);
        }

        if (this.lyDoDieuChinh.loaiTienId) {
          this.hoaDonDienTuForm.get('loaiTienId').disable();
          this.hoaDonDienTuForm.get('loaiTienId').setValue(this.lyDoDieuChinh.loaiTienId);
          this.hoaDonDienTuForm.get('maLoaiTien').setValue(this.lyDoDieuChinh.maLoaiTien);
          this.changeNgoaiTe(this.lyDoDieuChinh.loaiTienId);
        }
      }

      const hoaDonChiTietFormGroup = this.createHoaDonChiTiets(null)
      hoaDonChiTietFormGroup.get('isEdit').setValue(true);
      this.hoaDonChiTiets.push(hoaDonChiTietFormGroup.getRawValue());

      this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);
    } else {
      if (this.data.soHoaDon == null) this.hoaDonDienTuForm.get('soHoaDon').setValue(null);
      if (this.data.loaiTienId) {
        this.maLoaiTien = this.loaiTiens.find(x => x.loaiTienId === this.data.loaiTienId).ma;
      } else {
        this.maLoaiTien = 'VND';
      }

      if (this.maLoaiTien === 'VND') {
        this.hoaDonDienTuForm.get('tyGia').disable();
        this.isVND = true;
      } else {
        this.isVND = false;
        if (!this.data.tyGia) {
          const tyGia = this.loaiTiens.find(x => x.loaiTienId === this.data.loaiTienId).tyGiaQuyDoi;
          this.hoaDonDienTuForm.get('tyGia').setValue(tyGia);
        }
      }

      this.listFile = this.data.taiLieuDinhKems;
      this.listUploadedFile = this.data.taiLieuDinhKems;

      this.displayData.oldFromDate = moment(this.data.ngayHoaDon).format('YYYY-MM-DD');
      this.displayData.oldToDate = moment(this.data.ngayHoaDon).format('YYYY-MM-DD');

      this.hoaDonDienTuForm.patchValue({
        ...this.data,
        maSoThue: this.data.maSoThue,
        loaiTienId: this.data.loaiTienId || ((this.boolCoPhatSinhNghiepVuNgoaiTe == "true" || this.boolCoPhatSinhNghiepVuNgoaiTe == true) ? this.loaiTiens[0].loaiTienId : vnd.loaiTienId),
        maLoaiTien: this.maLoaiTien,
        tyGia: this.data.tyGia || 1,
        hinhThucThanhToanId: !isNaN(this.data.hinhThucThanhToanId) ? parseInt(this.data.hinhThucThanhToanId) : this.data.hinhThucThanhToanId,
        ngayHoaDon: moment(this.data.ngayHoaDon).format('YYYY-MM-DD'),
        ngayCanCu: this.data.ngayCanCu ? moment(this.data.ngayCanCu).format('YYYY-MM-DD') : null,
        hoaDonChiTiets: []
      });

      if (this.data.lyDoThayThe) {
        this.lyDoThayThe = JSON.parse(this.data.lyDoThayThe);
        this.noiDungThayTheHoaDon = getLyDoThayThe(this.lyDoThayThe);
        this.hoaDonDienTuForm.get('lyDoXoaBo').setValue(this.lyDoThayThe.lyDo);
        this.hoaDonDienTuForm.get('lyDoXoaBo').setValidators([Validators.required, Validators.maxLength(255)]);
        this.hoaDonDienTuForm.get('lyDoXoaBo').updateValueAndValidity();
      }

      if (this.data.lyDoDieuChinh) {
        this.lyDoDieuChinh = JSON.parse(this.data.lyDoDieuChinh);
        if (!this.lyDoDieuChinh.dieuChinhChoHoaDonId) {
          this.lyDoDieuChinh.dieuChinhChoHoaDonId = this.data.dieuChinhChoHoaDonId;
        }
        this.noiDungDieuChinhHoaDon = getLyDoDieuChinh(this.lyDoDieuChinh);
        this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(this.lyDoDieuChinh.lyDo);
        this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValidators([Validators.required, Validators.maxLength(255)]);
        this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').updateValueAndValidity();
      }

      if (this.isCopy && !this.boKyHieuHoaDons.some(x => x.boKyHieuHoaDonId === this.data.boKyHieuHoaDonId)) {
        this.boKyHieuHoaDons.push(this.data.boKyHieuHoaDon);
      }

      if (this.data.khachHang) {
        this.doiTuongs.push(this.data.khachHang);
      }

      if (this.boKyHieuHoaDons.length > 0) {
        var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === this.data.boKyHieuHoaDonId);
        if (boKyHieuHoaDon) {
          this.loaiThueSuat = this.data.loaiThue;
          if (this.loaiThueSuat === 1 && this.data.hoaDonChiTiets.length > 0) {
            let thueGTGT = this.data.hoaDonChiTiets[0].thueGTGT;
            console.log(thueGTGT);

            if (thueGTGT && thueGTGT.includes('KHAC')) {
              const splitThue = thueGTGT.split(':') as any[];
              if (splitThue.length > 1) {
                this.hoaDonDienTuForm.get('thueGTGT').setValue(splitThue[0]);
                this.hoaDonDienTuForm.get('thueKhac').setValue(parseFloat(splitThue[1]));
              }
            } else {
              this.hoaDonDienTuForm.get('thueGTGT').setValue(thueGTGT);
            }
          }

          this.hoaDonDienTuForm.get('loaiThue').setValue(this.loaiThueSuat);
        }
      }
      this.hoaDonChiTiets = this.data.hoaDonChiTiets;
      //const chiTiets = this.data.hoaDonChiTiets;
      // this.hoaDonChiTiets = [];
      // chiTiets.forEach((item: any) => {
      //   const formGroup = this.createHoaDonChiTiets(item);
      //   this.hoaDonChiTiets.push(formGroup.getRawValue());
      // });

      this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);

      if (this.data.tongTienThueGTGT != this.hoaDonDienTuForm.get('tongTienThueGTGT').value) {
        this.hoaDonDienTuForm.get('tongTienThueGTGT').setValue(this.data.tongTienThueGTGT);
        this.hoaDonDienTuForm.get('tongTienThueGTGTQuyDoi').setValue(this.data.tongTienThueGTGTQuyDoi);
      }

      if (this.data.tongTienThanhToan != this.hoaDonDienTuForm.get('tongTienThanhToan').value) {
        this.hoaDonDienTuForm.get('tongTienThanhToan').setValue(this.data.tongTienThanhToan);
        this.hoaDonDienTuForm.get('tongTienThanhToanQuyDoi').setValue(this.data.tongTienThanhToanQuyDoi);
      }
    }

    this.hoaDonDienTuForm.get('soHoaDon').disable();
    this.disableOrEnableHeaderButtons();
    this.spinning = false;
    this.pendingApi = false;
  }

  createHoaDonChiTiets(data: any = null): FormGroup {
    if (data) {
      if (this.isCopy) {
        data.hoaDonDienTuChiTietId = null;

        if (data.hangHoaDichVu && data.hangHoaDichVu.ma) {
          data.maHang = data.hangHoaDichVu.ma;
        }

        if (data.donViTinh && data.donViTinh.ten) {
          data.tenDonViTinh = data.donViTinh.ten;
        }

        if (data.nhanVien && data.nhanVien.ma) {
          data.maNhanVien = data.nhanVien.ma;
        }
        //Lấy lại định dạng thập phân theo hiện tại khi copy
        data.soLuong = mathRound(data.soLuong, this.ddtp.getSoLuong());
        data.donGia = mathRound(data.donGia, this.isVND ? this.ddtp.getDonGiaQuyDoi() : this.ddtp.getDonGiaNgoaiTe());
      }

      const thueGTGT = data.thueGTGT;
      if (thueGTGT && thueGTGT.includes('KHAC')) {
        const splitThue = thueGTGT.split(':') as any[];
        if (splitThue.length > 1) {
          data.thueGTGT = splitThue[0];
          data.thueKhac = parseFloat(splitThue[1]);
        }
      }

      if (!this.boolPhatSinhBanHangTheoDGSauThue) {
        data.disabledDonGiaSauThue = true;
        data.disabledThanhTienSauThue = true;
      } else {
        if (!(this.boolTinhTienTheoSLvaDGSauThue || this.boolTinhSLTheoDGvaTienSauThue)) {
          data.disabledThanhTienSauThue = true;
        }
      }
    }

    return this.fb.group({
      hoaDonDienTuChiTietId: [data == null ? null : data.hoaDonDienTuChiTietId],
      hoaDonDienTuId: [data == null ? null : data.hoaDonDienTuId],
      hangHoaDichVuId: [data == null ? null : data.hangHoaDichVuId],
      hangHoaDichVu: [data == null ? null : data.hangHoaDichVu],
      maHang: [data == null ? null : data.maHang],
      tenHang: [data == null ? null : data.tenHang],
      tinhChat: [data == null ? 1 : data.tinhChat],
      tenTinhChat: [data == null ? 1 : data.tenTinhChat],
      donViTinhId: [data == null ? null : data.donViTinhId],
      donViTinh: [data == null ? null : data.donViTinh],
      tenDonViTinh: [data == null ? null : data.tenDonViTinh],
      soLuong: [data == null ? 1 : data.soLuong],
      soLuongNhap: [data == null ? 1 : data.soLuongNhap],
      donGia: [data == null ? 0 : data.donGia],
      donGiaQuyDoi: [data == null ? 0 : data.donGiaQuyDoi],
      donGiaSauThue: [data == null ? 0 : data.donGiaSauThue],
      thanhTien: [data == null ? 0 : data.thanhTien],
      thanhTienSauThue: [data == null ? 0 : data.thanhTienSauThue],
      thanhTienQuyDoi: [data == null ? 0 : data.thanhTienQuyDoi],
      thanhTienSauThueQuyDoi: [data == null ? 0 : data.thanhTienSauThueQuyDoi],
      tyLeChietKhau: [data == null ? 0 : data.tyLeChietKhau],
      tienChietKhau: [data == null ? 0 : data.tienChietKhau],
      tienChietKhauQuyDoi: [data == null ? 0 : data.tienChietKhauQuyDoi],
      thueGTGT: [data == null ? '10' : data.thueGTGT],
      thueKhac: [data == null ? null : data.thueKhac],
      tienThueGTGT: [data == null ? 0 : data.tienThueGTGT],
      tienThueGTGTQuyDoi: [data == null ? 0 : data.tienThueGTGTQuyDoi],
      maQuyCach: [data == null ? null : data.maQuyCach],
      soLo: [data == null ? "" : data.soLo],
      hanSuDung: [data == null ? null : data.hanSuDung],
      xuatBanPhi: [data == null ? 0 : data.xuatBanPhi],
      soKhung: [data == null ? null : data.soKhung],
      soMay: [data == null ? null : data.soMay],
      ghiChu: [data == null ? null : data.ghiChu],
      nhanVienBanHangId: [data == null ? null : data.nhanVienBanHangId],
      maNhanVien: [data == null ? null : data.maNhanVien],
      tenNhanVien: [data == null ? null : data.tenNhanVien],
      tongTienThanhToan: [data == null ? 0 : data.tongTienThanhToan],
      tongTienThanhToanQuyDoi: [data == null ? 0 : data.tongTienThanhToanQuyDoi],
      isMatHangDuocGiam: [data == null ? false : data.isMatHangDuocGiam],
      tyLePhanTramDoanhThu: [data == null ? 0 : data.tyLePhanTramDoanhThu],
      tienGiam: [data == null ? 0 : data.tienGiam],
      tienGiamQuyDoi: [data == null ? 0 : data.tienGiamQuyDoi],
      createdDate: [data == null ? null : data.createdDate],
      createdBy: [data == null ? null : data.createdBy],
      status: [data == null ? true : data.status],
      stt: [{ value: data == null ? 1 : data.stt, disabled: true }],
      disabledSTT: [true],
      truongMoRongChiTiet1: [data == null ? null : data.truongMoRongChiTiet1],
      truongMoRongChiTiet2: [data == null ? null : data.truongMoRongChiTiet2],
      truongMoRongChiTiet3: [data == null ? null : data.truongMoRongChiTiet3],
      truongMoRongChiTiet4: [data == null ? null : data.truongMoRongChiTiet4],
      truongMoRongChiTiet5: [data == null ? null : data.truongMoRongChiTiet5],
      truongMoRongChiTiet6: [data == null ? null : data.truongMoRongChiTiet6],
      truongMoRongChiTiet7: [data == null ? null : data.truongMoRongChiTiet7],
      truongMoRongChiTiet8: [data == null ? null : data.truongMoRongChiTiet8],
      truongMoRongChiTiet9: [data == null ? null : data.truongMoRongChiTiet9],
      truongMoRongChiTiet10: [data == null ? null : data.truongMoRongChiTiet10],
      isEdit: [(this.isAddNew || this.fbEnableEdit) ? true : false],
      disabled: [data == null ? false : data.disabled],
      disabledTyLeChietKhau: [data == null ? false : data.disabledTyLeChietKhau],
      disabledDonGiaSauThue: [data == null ? false : data.disabledDonGiaSauThue],
      disabledThanhTienSauThue: [data == null ? false : data.disabledThanhTienSauThue],
    });
  }

  checkNgayHoaDonDieuChinh(data: any) {
    if (this.lyDoDieuChinh != null) {
      if (!this.lyDoDieuChinh.dieuChinhChoHoaDonId) {
        if (data) this.lyDoDieuChinh.dieuChinhChoHoaDonId = data.dieuChinhChoHoaDonId;
      }
      this.hoaDonDienTuService.GetById(this.lyDoDieuChinh.dieuChinhChoHoaDonId).subscribe((hd: any) => {
        this.thongTinHoaDonService.GetById(this.lyDoDieuChinh.dieuChinhChoHoaDonId).subscribe((tt: any) => {
          var hdbdc = hd ? hd : tt;
          this.hoaDonDienTuService.GetAllListHoaDonLienQuan(this.lyDoDieuChinh.dieuChinhChoHoaDonId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((rs: any[]) => {
            if (rs.length == 0 || (rs.length == 1 && rs[0].hoaDonDienTuId == data.hoaDonDienTuId)) {
              if (hdbdc.trangThaiBienBanDieuChinh == 0) {
                if (this.lyDoDieuChinh.hinhThucHoaDonBiDieuChinh == 1 && this.lyDoDieuChinh.isSystem == true) {
                  if (moment(data.ngayHoaDon).format("YYYY-MM-DD") < moment(hdbdc.ngayKy).format("YYYY-MM-DD")) {
                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzWidth: 600,
                      nzStyle: { top: '10px' },
                      nzBodyStyle: { padding: '1px' },
                      nzComponentParams: {
                        msTitle: `Kiểm tra lại`,
                        msContent: `Ngày hóa đơn điều chỉnh của lần điều chỉnh thứ nhất không được nhỏ hơn ngày người bán ký điện tử trên hóa đơn bị điều chỉnh là ngày ${moment(hdbdc.ngayKy).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                        msMessageType: MessageType.Warning,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                        msOnClose: () => {

                        }
                      },
                    });

                    this.spinning = false;
                    return;
                  }
                  else {
                    delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                    delete this.lyDoDieuChinh.maTraCuu;
                    data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                    this.saveChanges0(data);
                  }
                }
                else {
                  if (moment(data.ngayHoaDon).format("YYYY-MM-DD") < moment(hdbdc.ngayHoaDon).format("YYYY-MM-DD")) {
                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzWidth: 600,
                      nzStyle: { top: '10px' },
                      nzBodyStyle: { padding: '1px' },
                      nzComponentParams: {
                        msTitle: `Kiểm tra lại`,
                        msContent: `Ngày hóa đơn điều chỉnh của lần điều chỉnh thứ nhất không được nhỏ hơn ngày người bán ký điện tử trên hóa đơn bị điều chỉnh là ngày ${moment(hdbdc.ngayHoaDon).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                        msMessageType: MessageType.Warning,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                        msOnClose: () => {
                        }
                      },
                    });

                    this.spinning = false;
                    return;
                  }
                  else {
                    delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                    delete this.lyDoDieuChinh.maTraCuu;
                    data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                    this.saveChanges0(data);
                  }
                }
              }
              else {
                this.bienBanDieuChinhService.GetById(hdbdc.bienBanDieuChinhId).subscribe((bb: any) => {
                  if (!bb.ngayKyBenA) {
                    if (moment(bb.ngayBienBan).format("YYYY-MM-DD") > moment(data.ngayHoaDon).format("YYYY-MM-DD")) {
                      this.modalService.create({
                        nzContent: MessageBoxModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: 600,
                        nzStyle: { top: '10px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          msTitle: "Kiểm tra lại",
                          msContent: `Ngày hóa đơn của hóa đơn điều chỉnh của lần điều chỉnh thứ nhất không được phép nhỏ hơn ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ nhất là ngày ${moment(bb.ngayBienBan).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                          msMessageType: MessageType.Warning,
                          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                          msOnClose: () => {
                          }
                        },
                      });

                      this.spinning = false;
                      return;
                    }
                    else {
                      delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                      delete this.lyDoDieuChinh.maTraCuu;
                      data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                      this.saveChanges0(data);
                    }
                  }
                  else {
                    if (moment(bb.ngayKyBenA).format("YYYY-MM-DD") > moment(data.ngayHoaDon).format("YYYY-MM-DD")) {
                      this.modalService.create({
                        nzContent: MessageBoxModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: 600,
                        nzStyle: { top: '10px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          msTitle: "Kiểm tra lại",
                          msContent: `Ngày hóa đơn của hóa đơn điều chỉnh của lần điều chỉnh thứ nhất không được phép nhỏ hơn ngày người bán ký điện tử biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ nhất là ngày ${moment(bb.ngayKyBenA).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại.  `,
                          msMessageType: MessageType.Warning,
                          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                          msOnClose: () => {
                          }
                        },
                      });

                      this.spinning = false;
                      return;
                    }
                    else {
                      delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                      delete this.lyDoDieuChinh.maTraCuu;
                      data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                      this.saveChanges0(data);
                    }
                  }
                })
              }
            }
            else {
              if (data.hoaDonDienTuId != rs[0].hoaDonDienTuId && rs[0].trangThaiBienBanDieuChinh == 0) {
                if (rs[rs.length - 1].boKyHieuHoaDon.hinhThucHoaDon != 2 && rs[rs.length - 1].ngayKy && moment(data.ngayHoaDon).format("YYYY-MM-DD") < moment(rs[rs.length - 1].ngayKy).format("YYYY-MM-DD")) {
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: 600,
                    nzStyle: { top: '10px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msTitle: "Kiểm tra lại",
                      msContent: `Ngày hóa đơn điều chỉnh của lần điều chỉnh thứ ${rs.length + 1} không được nhỏ hơn ngày người bán ký điện tử trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${rs.length} là ngày ${moment(rs[rs.length - 1].ngayKy).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                      msMessageType: MessageType.Warning,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msOnClose: () => {
                      }
                    },
                  });

                  this.spinning = false;
                  return;
                }
                else {
                  delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                  delete this.lyDoDieuChinh.maTraCuu;
                  data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                  this.saveChanges0(data);
                }
              }
              else {
                this.bienBanDieuChinhService.GetById(rs[0].bienBanDieuChinhId).subscribe((bb: any) => {
                  if (bb && !bb.ngayKyBenA) {
                    if (moment(bb.ngayBienBan).format("YYYY-MM-DD") > moment(data.ngayHoaDon).format("YYYY-MM-DD")) {
                      this.modalService.create({
                        nzContent: MessageBoxModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: 600,
                        nzStyle: { top: '10px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          msTitle: "Kiểm tra lại",
                          msContent: `Ngày hóa đơn của hóa đơn điều chỉnh của lần điều chỉnh thứ ${rs.length + 1} không được phép nhỏ hơn ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh ${rs.length} là ngày ${moment(bb.ngayBienBan).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                          msMessageType: MessageType.Warning,
                          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                          msOnClose: () => {
                          }
                        },
                      });

                      this.spinning = false;
                      return;
                    }
                    else {
                      delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                      delete this.lyDoDieuChinh.maTraCuu;
                      data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                      this.saveChanges0(data);
                    }
                  }
                  else {
                    if (bb && moment(bb.ngayKyBenA).format("YYYY-MM-DD") > moment(data.ngayHoaDon).format("YYYY-MM-DD")) {
                      this.modalService.create({
                        nzContent: MessageBoxModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: 600,
                        nzStyle: { top: '10px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          msTitle: "Kiểm tra lại",
                          msContent: `Ngày hóa đơn của hóa đơn điều chỉnh của lần điều chỉnh thứ ${rs.length + 1} không được phép nhỏ hơn ngày người bán ký điện tử biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ ${rs.length} là ngày ${moment(bb.ngayKyBenA).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại.  `,
                          msMessageType: MessageType.Warning,
                          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                          msOnClose: () => {
                          }
                        },
                      });

                      this.spinning = false;
                      return;
                    }
                    else {
                      delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
                      delete this.lyDoDieuChinh.maTraCuu;
                      data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
                      this.saveChanges0(data);
                    }
                  }
                })
              }
            }
          })
        });
      })
    }
    else {
      delete this.lyDoDieuChinh.dieuChinhChoHoaDonId;
      delete this.lyDoDieuChinh.maTraCuu;
      data.lyDoDieuChinh = JSON.stringify(this.lyDoDieuChinh);
      this.saveChanges0(data);
    }
  }

  chenDong(index: any, isChenDongTren: boolean) {
    const srcItem = this.hoaDonChiTiets[index];
    const destIndex = isChenDongTren ? index : (index + 1);

    const formGroup = this.createHoaDonChiTiets({
      stt: 1,
      tinhChat: 1,
      soLuong: 1,
      donGia: 0,
      donGiaQuyDoi: 0,
      donGiaSauThue: 0,
      thanhTien: 0,
      thanhTienSauThue: 0,
      thanhTienQuyDoi: 0,
      tyLeChietKhau: 0,
      tienChietKhau: 0,
      tienChietKhauQuyDoi: 0,
      thueGTGT: srcItem.thueGTGT,
      thueKhac: srcItem.thueKhac,
      tienThueGTGT: 0,
      tienThueGTGTQuyDoi: 0,
      tongTienThanhToan: 0,
      tongTienThanhToanQuyDoi: 0,
      tienGiam: 0,
      tienGiamQuyDoi: 0,
      status: true
    });

    const data = formGroup.getRawValue();
    data.isEdit = true;

    this.hoaDonChiTiets.splice(destIndex, 0, data);
    this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
    this.detectChangeLoaiThueSuat();
    this.updateSTTWhenChangeTinhChat();
  }

  saoChep(index: any) {
    const copyItem = this.hoaDonChiTiets[index];
    for (let i = index + 1; i < this.hoaDonChiTiets.length; i++) {
      if (this.rightMouseField === 'stt') {
        Object.keys(copyItem).forEach((key) => {
          this.hoaDonChiTiets[i][key] = copyItem[key];
          if (key == 'hangHoaDichVuId') {
            this.hoaDonChiTiets[i].maHang = copyItem.maHang;

          }
          if (key == 'donViTinhId') {
            this.hoaDonChiTiets[i].tenDonViTinh = copyItem.tenDonViTinh;
          }
          if (key == 'nhanVienBanHangId') {
            this.hoaDonChiTiets[i].maNhanVien = copyItem.maNhanVien;
          }
        });
      } else {
        this.hoaDonChiTiets[i][this.rightMouseField] = copyItem[this.rightMouseField];
        if (this.rightMouseField == 'hangHoaDichVuId') {
          this.hoaDonChiTiets[i].maHang = copyItem.maHang;

        }
        if (this.rightMouseField == 'donViTinhId') {
          this.hoaDonChiTiets[i].tenDonViTinh = copyItem.tenDonViTinh;
        }
        if (this.rightMouseField == 'nhanVienBanHangId') {
          this.hoaDonChiTiets[i].maNhanVien = copyItem.maNhanVien;
        }
      }

      this.hoaDonChiTiets[i].soLuongDirty = true;
      this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);

      this.tinhToanHDDV.blurTinhToan(i, BlurPosition.SO_LUONG, true, null, false);
    }

    this.tinhLaiTongTien();
  }

  danhLaiSoThuTu(index: any) {
    if (this.hoaDonChiTiets[index].stt != null) {
      this.hoaDonChiTiets[index].stt = null;
    } else {
      this.hoaDonChiTiets[index].stt = index;
    }

    this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);

    this.updateSTTWhenChangeTinhChat();
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any, index: any): void {
    data.selected = true;
    this.hoaDonChiTiets.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });
    this.nzContextMenuService.create($event, menu);

    var formItem = ($event.target as HTMLElement).closest('.cus-form-item');

    if (formItem) {

      formItem.classList.forEach((item: any) => {
        if (item.includes('cus-form-item')) {
          const arrayCus = item.split('-') as any[];
          this.rightMouseField = arrayCus[arrayCus.length - 1];
          return;
        }
      });
    }
  }

  addItem() {
    if (this.hoaDonChiTiets.length === 0) {
      const formGroup = this.createHoaDonChiTiets({
        stt: 1,
        tinhChat: 1,
        thanhTien: 0,
        thanhTienQuyDoi: 0,
        tienChietKhau: 0,
        tienThueGTGT: 0,
        tienThueGTGTQuyDoi: 0,
        xuatBanPhi: 0,
        status: true
      });
      const data = formGroup.getRawValue();

      this.hoaDonChiTiets.push(data);
      this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
      this.scrollConfigTabChiTiet.y = '280px';
    } else {
      const lastItem = this.hoaDonChiTiets[this.hoaDonChiTiets.length - 1];
      const item = Object.assign({}, lastItem);
      item.hoaDonDienTuChiTietId = null;
      item.stt = this.getMaxSTT();
      item.tinhChat = 1;
      item.soLuong = 1;
      item.donGia = 0;
      item.donGiaQuyDoi = 0;
      item.donGiaSauThue = 0;
      item.thanhTien = 0;
      item.thanhTienSauThue = 0;
      item.thanhTienQuyDoi = 0;
      item.thanhTienSauThueQuyDoi = 0;
      item.tyLeChietKhau = 0;
      item.tienChietKhau = 0;
      item.tienChietKhauQuyDoi = 0;
      item.tienThueGTGT = 0;
      item.tienThueGTGTQuyDoi = 0;
      item.tongTienThanhToan = 0;
      item.tongTienThanhToanQuyDoi = 0;
      item.tienGiam = 0;
      item.tienGiamQuyDoi = 0;

      let formGroup = this.createHoaDonChiTiets(item);

      // nếu hình thức chiết khấu là theo Tổng giá trị hóa đơn thì set tỷ lệ ck hhdv theo tổng + disable
      const formData = this.hoaDonDienTuForm.getRawValue();
      if (formData.loaiChietKhau === 2) {
        formGroup.get('tyLeChietKhau').setValue(formData.tyLeChietKhau);
      }
      if (formData.loaiDieuChinh === 3) {
        formGroup.get('soLuong').setValue(0);
        formGroup.get('soLuongNhap').setValue(0);
        formGroup.get('donGia').setValue(0);
        formGroup.get('donGiaQuyDoi').setValue(0);
        formGroup.get('donGiaSauThue').setValue(0);
        formGroup.get('thanhTien').setValue(0);
        formGroup.get('thanhTienSauThue').setValue(0);
        formGroup.get('thanhTienQuyDoi').setValue(0);
        formGroup.get('thanhTienSauThueQuyDoi').setValue(0);
        formGroup.get('tyLeChietKhau').setValue(0);
        formGroup.get('tienChietKhau').setValue(0);
        formGroup.get('tienChietKhauQuyDoi').setValue(0);
        formGroup.get('tienThueGTGT').setValue(0);
        formGroup.get('tienThueGTGTQuyDoi').setValue(0);
        formGroup.get('tongTienThanhToan').setValue(0);
        formGroup.get('tongTienThanhToanQuyDoi').setValue(0);
        formGroup.get('tienGiam').setValue(0);
        formGroup.get('tienGiamQuyDoi').setValue(0);
      }

      formGroup.get('isEdit').setValue(true);
      const data = formGroup.getRawValue();
      this.changeMatHangDuocGiam(data.isMatHangDuocGiam, data);
      this.hoaDonChiTiets.push(data);
      this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
      this.disabledOrEnableItemHoaDonChiTiet(this.hoaDonChiTiets.length - 1, false);
      this.detectChangeLoaiThueSuat();
      this.scrollConfigTabChiTiet.y = '280px';

      this.hoaDonDienTuForm.markAsDirty();
    }
  }

  getMaxSTT() {
    var listSTT = this.hoaDonChiTiets.map(x => x.stt).filter(x => !!x);
    if (listSTT && listSTT.length > 0) {
      const maxSTT = Math.max(...this.hoaDonChiTiets.map(x => x.stt).filter(x => !!x));
      return maxSTT + 1;
    }

    return 1;
  }

  removeRow(i: any) {
    this.hoaDonChiTiets.splice(i, 1);
    this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
    this.tinhLaiTongTien();
    this.detectChangeLoaiThueSuat();
    this.updateSTTWhenChangeTinhChat();
    this.hoaDonDienTuForm.markAsDirty();
  }

  closeModal() {
    if (this.isOpenNestedModal) {
      return;
    }

    if (this.hoaDonDienTuForm.dirty && this.isAddNew !== true && this.isView !== true && this.isEdited == true && this.isSaved != true) {
      if (this.isPhatHanhLai) {
        if (this.ActivedModal != null) return;
        const modal1 = this.ActivedModal = this.modalService.create({
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
            msTitle: `Dữ liệu đã thay đổi`,
            msContent: 'Bạn đã thay đổi thông tin hóa đơn, bạn có chắc chắn muốn đóng không?',
            msOnClose: () => {
            },
            msOnOk: () => {
              this.modal.destroy();
            },

          }
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      } else {
        const modal1 = this.ActivedModal = this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: '465px',
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.ConfirmBeforeClosing,
            msOnOk: () => {
              this.isCloseModal = true;
              this.submitForm()
            },
            msOnClose: () => {
              this.modal.destroy();
            }
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      }
    } else {
      if (this.isSaved) {
        if (this.isMoTuGiaoDienBienBan) this.modal.destroy(this.data);
        this.modal.destroy(true);
      }
      else {
        if (this.isMoTuGiaoDienBienBan) this.modal.destroy(this.data);
        this.modal.destroy(false);
      }
    }
  }

  changeTabDetail(event: any) {
    this.selectedIndexTabDetail = event;
  }

  changeTinhChat(event: any, index: any) {
    this.hoaDonChiTiets[index].tinhChat = event;

    this.disabledOrEnableItemHoaDonChiTiet(index, false);

    this.hoaDonChiTiets[index].disabledSTT = true;

    if (event == 3) {
      this.hoaDonChiTiets[index].stt = null;
      this.hoaDonChiTiets[index].disabledTyLeChietKhau = true;
      this.hoaDonChiTiets[index].disabledTienChietKhau = true;
      this.hoaDonChiTiets[index].disabledTienThueGTGT = true;
    } else if (event == 4) {
      this.disabledOrEnableItemHoaDonChiTiet(index, true);

      this.hoaDonChiTiets[index].stt = null;
      this.hoaDonChiTiets[index].disabledHangHoaDichVuId = false;
      this.hoaDonChiTiets[index].disabledTenHang = false;
      this.hoaDonChiTiets[index].disabledTinhChat = false;
    } else if (event == 2) {
      this.hoaDonChiTiets[index].disabledThueGTGT = true;
      this.hoaDonChiTiets[index].disabledTienThueGTGT = true;

      this.hoaDonChiTiets[index].donGia = 0;
      this.hoaDonChiTiets[index].donGiaSauThue = 0;
      this.hoaDonChiTiets[index].thanhTienSauThue = 0
      this.hoaDonChiTiets[index].thanhTien = 0
      this.hoaDonChiTiets[index].thanhTienQuyDoi = 0
      this.hoaDonChiTiets[index].tienChietKhau = 0
      this.hoaDonChiTiets[index].tienChietKhauQuyDoi = 0
      this.hoaDonChiTiets[index].tienThueGTGT = 0
      this.hoaDonChiTiets[index].tienThueGTGTQuyDoi = 0
      this.hoaDonChiTiets[index].tienGiam = 0
      this.hoaDonChiTiets[index].tienGiamQuyDoi = 0
    }

    if (this.hoaDonChiTiets[index].tinhChat != null) {
      //this.hoaDonDienTuForm.get(`hoaDonChiTiets.${index}.soLuong`).markAsDirty();
      this.hoaDonChiTiets[index].soLuongDirty = true;
      this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[index], index);
      this.tinhToanHDDV.blurTinhToan(index, BlurPosition.SO_LUONG);
      this.updateSTTWhenChangeTinhChat();

      if (this.loaiThueSuat === 1) {
        this.detectChangeLoaiThueSuat();
      }
    }
  }

  // disabled or enable all prop of item
  disabledOrEnableItemHoaDonChiTiet(index: any, disabled: boolean) {
    const item = this.hoaDonChiTiets[index];
    Object.keys(item).forEach(key => {
      var keyName = key.charAt(0).toUpperCase() + key.slice(1);
      item['disabled' + keyName] = disabled;

      // nếu là đơn giá sau thuế || thành tiền sau thuế thì sẽ disable theo tùy chọn bán hàng sau thuế
      if (!disabled && (keyName === 'DonGiaSauThue' || keyName === 'ThanhTienSauThue')) {
        if (!this.boolPhatSinhBanHangTheoDGSauThue) {
          item['disabled' + keyName] = true;
        } else {
          if (keyName === 'ThanhTienSauThue' && !(this.boolTinhTienTheoSLvaDGSauThue || this.boolTinhSLTheoDGvaTienSauThue)) {
            item['disabled' + keyName] = true;
          }
        }
      }

      // Nếu loại chiết khấu là tổng mặt hàng thì disable tỷ lệ chiết khấu
      if (!disabled && (keyName === 'TyLeChietKhau')) {
        item['disabled' + keyName] = true;
      }
    });
  }

  updateSTTWhenChangeTinhChat() {
    let idx = 1;
    for (const key in this.hoaDonChiTiets) {
      if (this.hoaDonChiTiets[key].stt != null) {
        this.hoaDonChiTiets[key].stt = idx;
        idx += 1;
      }
    }
  }

  // checkMatchTienThue(callBack: () => any) {
  //   const phieuChiChiTietFormArray = this.hoaDonDienTuForm.get('hoaDonChiTiets') as FormArray;
  //   const hoaDonChiTiets = phieuChiChiTietFormArray.value as any[];

  //   const thueChiTietFormArray = this.hoaDonDienTuForm.get('hoaDonChiTiets') as FormArray;
  //   if (thueChiTietFormArray.length > 0) {
  //     const hoaDonChiTiets = thueChiTietFormArray.value as any[];

  //     const totalTienThueHachToan = hoaDonChiTiets.filter(x => {
  //       return this.taiKhoanThueGTGTs.some(y => {
  //         return x.taiKhoanNo === y.soTaiKhoan || x.taiKhoanCo === y.soTaiKhoan;
  //       });
  //     }).reduce((a, b) => a + b.soTien, 0);

  //     const totalTienThueGTGT = hoaDonChiTiets.reduce((a, b) => a + b.tienThueGTGT, 0);
  //     if (totalTienThueHachToan !== totalTienThueGTGT) {
  //       const formatTienHachToan = FormatPrice(totalTienThueHachToan);
  //       const formatTienThue = FormatPrice(totalTienThueGTGT);

  //       this.modalService.warning({
  //         nzTitle: '<b>Cảnh báo</b>',
  //         nzContent: `<div>Số tiền thuế GTGT hạch toán là <strong>${formatTienHachToan}</strong> không khớp với tiền thuế GTGT kê khai ở
  //          mục Thuế <strong>${formatTienThue}</strong>. Xem thêm các nghiệp vụ cần đảm bảo hạch toán và kê khai thuế GTGT khớp nhau
  //           <a href='http://help.sme2020.misa.vn/nhung_nghiep_vu_nao_can_va_khong_can_ke_khai_thue_gtgt_tai_muc_thue.htm'
  //            target='_blank'>TẠI ĐÂY</a>.</div>
  //         <div>Bạn có muốn lưu chứng từ này không?</div>`,
  //         nzOkText: TextGlobalConstants.TEXT_CONFIRM_OK,
  //         nzCancelText: TextGlobalConstants.TEXT_CONFIRM_CANCLE,
  //         nzOnOk: () => {
  //           callBack();
  //         },
  //         nzOnCancel: () => {
  //           this.spinning = false;
  //         }
  //       });
  //     } else {
  //       callBack();
  //     }
  //   } else {
  //     const totalTienThueHachToan = hoaDonChiTiets.filter(x => {
  //       return this.taiKhoanThueGTGTs.some(y => {
  //         return x.taiKhoanNo === y.soTaiKhoan || x.taiKhoanCo === y.soTaiKhoan;
  //       });
  //     }).reduce((a, b) => a + b.soTien, 0);

  //     if (totalTienThueHachToan !== 0) {
  //       const formatTienHachToan = FormatPrice(totalTienThueHachToan);

  //       this.modalService.warning({
  //         nzTitle: '<b>Cảnh báo</b>',
  //         nzContent: `<div>Số tiền thuế GTGT hạch toán là <strong>${formatTienHachToan}</strong> không khớp với tiền thuế GTGT kê khai ở
  //          mục Thuế <strong>${0}</strong>. Xem thêm các nghiệp vụ cần đảm bảo hạch toán và kê khai thuế GTGT khớp nhau
  //           <a href='http://help.sme2020.misa.vn/nhung_nghiep_vu_nao_can_va_khong_can_ke_khai_thue_gtgt_tai_muc_thue.htm'
  //            target='_blank'>TẠI ĐÂY</a>.</div>
  //         <div>Bạn có muốn lưu chứng từ này không?</div>`,
  //         nzOkText: TextGlobalConstants.TEXT_CONFIRM_OK,
  //         nzCancelText: TextGlobalConstants.TEXT_CONFIRM_CANCLE,
  //         nzOnOk: () => {
  //           callBack();
  //         },
  //         nzOnCancel: () => {
  //           this.spinning = false;
  //         }
  //       });
  //     } else {
  //       callBack();
  //     }
  //   }
  // }


  async submitForm() {
    if (this.spinning) {
      return;
    }

    // this.fbBtnSaveDisable = true;
    this.spinning = true;
    this.isClickedSave = true;
    if (this.hoaDonDienTuForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.hoaDonDienTuForm.controls) {
        this.hoaDonDienTuForm.controls[i].markAsDirty();
        this.hoaDonDienTuForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      this.spinning = false;
      return;
    }

    const data = this.hoaDonDienTuForm.getRawValue();
    /* trường hợp nhân bản khi tick chọn ở thay thế => kiểm tra boKyHieuHoaDonId truyền vào có trong list bộ ký hiệu hay không nếu không có gán bằng mặc định bộ ký hiệu đầu tiên
      Để tránh lỗi bộ ký hiệu ngừng sử dụng
    */
    if (this.lyDoThayThe && this.lyDoThayThe.tichChonNhanBanThongTin) {
      var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === data.boKyHieuHoaDonId);
      if (!boKyHieuHoaDon && this.boKyHieuHoaDons) data.boKyHieuHoaDonId = this.boKyHieuHoaDons[0].boKyHieuHoaDonId;
    }


    if (data.hoaDonDienTuId && !this.isAddNew && !this.isCopy && !this.isPhatHanhLai) {
      const trangThaiQuyTrinh = await this.hoaDonDienTuService.GetTrangThaiQuyTrinhByIdAsync(data.hoaDonDienTuId);
      if (trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu &&
        trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi &&
        trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) {
        if (boKyHieuHoaDon.hinhThucHoaDon != 2) {
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
                <strong>Chưa ký điện tử</strong>, <strong>Ký điện tử lỗi</strong>.
                Vui lòng kiểm tra lại!`,
              msOnClose: () => {
              }
            },
            nzFooter: null
          });
        }
        else {
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

        this.spinning = false;
        return;
      }
    }

    const model = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === data.boKyHieuHoaDonId);
    // Thiết lập như thao tác SỬA/LƯU liên quan đến bộ ký hiệu chuyển đổi trạng thái sử dụng
    if (model.mauHoaDons.length === 1 && !model.mauHoaDons.some(x => x.loaiThueGTGT === data.loaiThue)) {
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
          msContent: `Ký hiệu <span class='colorChuYTrongThongBao'><b>${model.kyHieu}</b></span> đã không chọn sử dụng mẫu hóa đơn <b>${data.loaiThue === 1 ? 'Một thuế suất' : 'Nhiều thuế suất'}</b>. Vui lòng kiểm tra lại!`,
          msOnClose: () => {
            this.spinning = false;
          }
        },
        nzFooter: null
      });
      return;
    }

    data.hoaDonChiTiets = this.hoaDonChiTiets as any[];
    // nếu còn tồn tại tên hàng trống thì return
    if (data.hoaDonChiTiets.some((item: any) => !item.tenHang) || data.hoaDonChiTiets.some((item: any) => item.tenHang && item.tenHang.length > 500)) {
      this.spinning = false;
      return;
    }
    // nếu maHang, tenDonVi quá 50 ký tự thì return
    if (data.hoaDonChiTiets.some((item: any) => item.maHang && item.maHang.length > 50) ||
      data.hoaDonChiTiets.some((item: any) => item.tenDonViTinh && item.tenDonViTinh.length > 50)) {
      this.spinning = false;
      return;
    }
    // nếu chọn mặt hàng giảm và nhập tỷ lệ giảm = 0 thì return
    if (data.hoaDonChiTiets.some((item: any) => item.isMatHangDuocGiam && item.tyLePhanTramDoanhThu === 0)) {
      this.spinning = false;
      return;
    }

    if (this.isChuyenHoaDonGocThanhThayThe == true) {
      delete this.lyDoThayThe.thayTheChoHoaDonId;
      data.lyDoThayThe = JSON.stringify(this.lyDoThayThe);
      data.trangThai = 3;
    }
    this.checkBoKyHieu_NgayHoaDon(data);
  }

  checkBoKyHieu_NgayHoaDon(data: any) {
    this.paramCheckSaveForm.hoaDon = data;
    this.hoaDonDienTuService.CheckHoaDonPhatHanh(this.paramCheckSaveForm).subscribe((res: any) => {
      if (res) {
        if (res.isYesNo) {
          this.modalService.create({
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
              msTitle: res.titleMessage,
              msContent: res.errorMessage,
              msOnOk: () => {
                if (res.isAcceptHetHieuLucTrongKhoang) {
                  this.paramCheckSaveForm.skipCheckHetHieuLucTrongKhoang = true;
                }
                if (res.isAcceptNgayKyLonHonNgayHoaDon) {
                  this.paramCheckSaveForm.skipChecNgayKyLonHonNgayHoaDon = true;
                }

                this.checkBoKyHieu_NgayHoaDon(data);
              },
              msOnClose: () => {
                this.spinning = false;
              }
            },
            nzFooter: null
          });
        } else {
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
              msTitle: res.titleMessage,
              msContent: res.errorMessage,
              msOnClose: () => {
                this.spinning = false;
              }
            },
            nzFooter: null
          });
        }
      } else {
        this.checkHoaDonSaveChanges(data);
      }
    });
  }

  checkHoaDonSaveChanges(data: any) {
    if (!data.boKyHieuHoaDonId) {
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
          msContent: 'Ký hiệu không được để trống. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { return; }
        },
      });
      this.spinning = false;
      return;
    }

    if (this.loaiHD === 1 || this.loaiHD === 2) {
      if (!data.tenHinhThucThanhToan) {
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
            msContent: 'Hình thức thanh toán không được để trống. Vui lòng kiểm tra lại!',
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { return; }
          },
        });
        this.spinning = false;
        return;
      } else {
        if (data.tenHinhThucThanhToan.length > 50) {
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
              msContent: 'Hình thức thanh toán không được nhập quá 50 ký tự. Vui lòng kiểm tra lại!',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => { return; }
            },
          });
          this.spinning = false;
          return;
        }
      }
    }

    const mstPattern1 = "^[0-9\-]{10}$";
    const mstPattern2 = "^[0-9\-]{14}$";
    if (data.maSoThue != null && data.maSoThue != '' && !data.maSoThue.match(mstPattern1) && !data.maSoThue.match(mstPattern2)) {
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
          msContent: 'Mã số thuế hợp lệ là: 1-Để trống; 2-Số ký tự của MST bằng 10 hoặc bằng 14. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        },
      });
      this.spinning = false;
      this.fbBtnSaveDisable = false;
      return;
    }

    // trường hợp nhập mã số thuế nhưng không nhập tên khách hàng thì cảnh báo
    if (data.maSoThue && !data.tenKhachHang) {
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
          msContent: 'Bạn bắt buộc phải nhập thông tin <strong>Tên khách hàng</strong> khi đã có thông tin <strong>Mã số thuế</strong>. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        },
      });
      this.spinning = false;
      return;
    }

    if (data.maSoThue && !data.diaChi) {
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
          msContent: 'Bạn bắt buộc phải nhập thông tin <strong>Địa chỉ người mua</strong> khi đã có thông tin <strong>Mã số thuế</strong>. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        },
      });
      this.spinning = false;
      return;
    }

    if (this.loaiHD === 1 || this.loaiHD === 2) {
      if (!data.tenKhachHang && !data.hoTenNguoiMuaHang) {
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
            msContent: 'Bạn bắt buộc phải nhập ít nhất một trong hai thông tin <strong>Tên khách hàng</strong> hoặc <strong>Người mua hàng</strong>. Vui lòng kiểm tra lại!',
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        this.spinning = false;
        return;
      }
    }

    if (this.loaiHD === 9 || this.loaiHD === 10) {
      if (!data.tenKhachHang && !data.hoTenNguoiMuaHang) {
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
            msContent: 'Bạn bắt buộc phải nhập thông tin <strong>Tên khách hàng</strong>. Vui lòng kiểm tra lại!',
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        this.spinning = false;
        return;
      }
    }

    // Check nếu tỷ lệ chiết khấu >= 100% thì báo lỗi
    if (data.loaiChietKhau !== 0) {
      var invalidTyLeChietKhau = data.hoaDonChiTiets
        .map((item: any) => item.tyLeChietKhau)
        .filter((tyLeChietKhau: any) => tyLeChietKhau != null)
        .some((tyLeChietKhau: any) => Math.trunc(tyLeChietKhau).toString().length > 2);

      if (invalidTyLeChietKhau) {
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
            msContent: 'Đối với các hóa đơn có thông tin chiết khấu thì <b>Tỷ lệ chiết khấu</b> phải luôn <b>nhỏ hơn 100%</b>. Vui lòng kiểm tra lại!',
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
        this.spinning = false;
        return;
      }
    }

    if (this.canhBaoKhiKhongChonNhanVienBanHangTrenHoaDon == true) {
      if (!data.nhanVienBanHangId) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Chọn nhân viên bán hàng",
            msContent: 'Bạn chưa chọn nhân viên bán hàng. Bạn có muốn lưu không?',
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOnOk: () => {
              this.save(data);
            },
            msOnClose: () => {
              this.spinning = false;
              return;
            }
          },
        });
      } else {
        this.save(data);
      }
    } else {
      this.save(data);
    }
  }

  save(data: any) {
    data.loaiHoaDon = this.loaiHD;
    data.loaiChungTu = 3;
    data.fromGP = true;

    if (this.isCopy) {
      data.soHoaDon = null;
      data.maTraCuu = null;
      data.fileDaKy = null;
      data.xmlDaKy = null;
      data.maCuaCQT = null;
      data.ngayKy = null;
      data.idHoaDonSaiSotBiThayThe = null;
      data.ghiChuThayTheSaiSot = null;
      data.thayTheChoHoaDonId = null;
      data.isDaLapThongBao04 = null;
      data.lanGui04 = null;
      data.ngayGuiTBaoSaiSotKhongPhaiLapHD = null;
      data.trangThaiGui04 = null;
      data.thongDiepGuiCQTId = null;
      data.lyDoDieuChinhModel = null;
      data.loaiDieuChinh = null;
      data.dieuChinhChoHoaDonId = null;
    }
    else {
      if (this.thongTinHoaDonSaiSotBiThayThe != null && this.thongTinHoaDonSaiSotBiThayThe != undefined) {
        data.idHoaDonSaiSotBiThayThe = this.thongTinHoaDonSaiSotBiThayThe.idHoaDonSaiSotBiThayThe;
        data.ghiChuThayTheSaiSot = this.thongTinHoaDonSaiSotBiThayThe.ghiChuThayTheSaiSot;
      }
    }

    if (this.isAddNew || this.isCopy) {
      data.trangThaiQuyTrinh = TrangThaiQuyTrinh.ChuaKyDienTu;
      data.trangThaiGuiHoaDon = TrangThaiGuiHoaDon.ChuaGui;
      data.trangThai = 1;
      if (this.lyDoDieuChinh) {
        data.trangThai = 4;
      }
      if (this.lyDoThayThe) {
        data.trangThai = 3;
      }
      data.trangThaiBienBanXoaBo = 0;
      data.soLanChuyenDoi = 0;
      data.lyDoThayThe = null;
      data.lyDoDieuChinh = null;
      data.lyDoXoaBo = null;
    }

    if (this.lyDoThayThe && !this.isChuyenHoaDonGocThanhThayThe) {
      delete this.lyDoThayThe.thayTheChoHoaDonId;
      data.lyDoThayThe = JSON.stringify(this.lyDoThayThe);
    }

    if (this.lyDoDieuChinh) {
      this.checkNgayHoaDonDieuChinh(data)
    }

    else this.saveChanges0(data);
  }

  async saveChanges0(data: any) {
    if (data.hoaDonChiTiets.length === 0) {
      this.message.warning('Vui lòng nhập chi tiết hóa đơn');
      this.spinning = false;
      return;
    } else {
      for (const item of data.hoaDonChiTiets) {
        if (this.hoaDonDienTuForm.get('isNopThueTheoThongTu1032014BTC').value == false) {
          if (item.thueGTGT === 'KHAC') {
            if (item.thueKhac) {
              item.thueGTGT = item.thueGTGT + ':' + item.thueKhac;
            } else {
              this.message.warning('Vui lòng nhập thuế GTGT');
              this.spinning = false;
              return;
            }
          }
        } else {
          if (item.thueGTGT === 'KHAC') {
            if (item.thueKhac) {
              item.thueGTGT = item.thueGTGT + ':' + item.thueKhac;
            } else {
              item.thueGTGT = item.thueGTGT + ':' + 0.00;
            }
          }
        }
      }
    }

    if (data.loaiHoaDon == 2) {
      if (this.hoaDonDienTuForm.get('tongTienHang').value < 0) {
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
            msContent: 'Tổng tiền hàng phải lớn hơn hoặc bằng 0',
            msOnClose: () => {
            },
          }
        });
        this.spinning = false;
        return;
      }
    }

    // Cảnh báo khi không lặp văn bản thỏa thuận / Tùy Chọn
    if (this.intCanhBaoKhiKhongLapVBDTTT === '0') {
      this.saveChanges(data);
    } else if (this.intCanhBaoKhiKhongLapVBDTTT === '1') {
      // if (!data.isLapVanBanThoaThuan) {
      //   this.modalService.create({
      //     nzContent: MessageBoxModalComponent,
      //     nzMaskClosable: false,
      //     nzClosable: false,
      //     nzKeyboard: false,
      //     nzStyle: { top: '100px' },
      //     nzWidth: '430px',
      //     nzBodyStyle: { padding: '1px' },
      //     nzComponentParams: {
      //       msMessageType: MessageType.Confirm,
      //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
      //       msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
      //       msTitle: 'Chọn lập văn bản thỏa thuận khi hóa đơn có sai sót',
      //       msContent: `Bạn chưa chọn &lt;Lập văn bản thỏa thuận khi hóa đơn có sai sót&gt;.<br>Bạn có muốn lưu không?`,
      //       msOnOk: () => {
      //         this.saveChanges(data, callback);
      //       },
      //       msOnClose: () => {
      //         this.spinning = false;
      //         if (callback) {
      //           callback(false);
      //         }
      //       }
      //     },
      //     nzFooter: null
      //   });
      // } else {
      this.saveChanges(data);
      // }
    } else {
      // if (!data.isLapVanBanThoaThuan) {
      //   this.modalService.create({
      //     nzContent: MessageBoxModalComponent,
      //     nzMaskClosable: false,
      //     nzClosable: false,
      //     nzKeyboard: false,
      //     nzStyle: { top: '100px' },
      //     nzWidth: '410px',
      //     nzBodyStyle: { padding: '1px' },
      //     nzComponentParams: {
      //       msMessageType: MessageType.Warning,
      //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
      //       msTitle: 'Kiểm tra lại',
      //       msContent: 'Bạn chưa chọn <b>Lập văn bản thỏa thuận khi hóa đơn có sai sót</b>.<br>Vui lòng kiểm tra lại!',
      //       msOnClose: () => {
      //         this.spinning = false;
      //         if (callback) {
      //           callback(false);
      //         }
      //       }
      //     },
      //     nzFooter: null
      //   });
      // } else {
      this.saveChanges(data);
      // }
    }
  }

  async saveChanges(data: any) {
    data.isVND = this.isVND;

    //kiểm tra ngày hóa đơn thay thế
    if (this.lyDoThayThe != null) {
      let ngayHienTai: any = await this.hoaDonDienTuService.GetNgayHienTai();

      let ngayHoaDon = this.hoaDonDienTuForm.get('ngayHoaDon').value;
      if (!data.boKyHieuHoaDon) data.boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId == data.boKyHieuHoaDonId);
      if (ngayHoaDon != null && ngayHoaDon != '') {
        //kiểm tra xem ngày hóa đơn theo kỳ kế toán có hợp lệ
        if (kiemTraHoaDonHopLeTheoKyKeKhai(this.modalService, ngayHoaDon, 'luuDuLieu', ngayHienTai.result, data.boKyHieuHoaDon.kyHieu) == false) {
          return;
        }

        //kiểm tra xem ngày hóa đơn có lớn hơn ngày hóa đơn hoặc ngày xóa bỏ của hóa đơn bị thay thế
        let thongBao = '';
        let ngayHoaDonBiThayThe = moment().format('YYYY-MM-DD');
        if (this.lyDoThayThe.ngayXoaBo != null && this.lyDoThayThe.ngayXoaBo != '') {
          ngayHoaDonBiThayThe = this.lyDoThayThe.ngayXoaBo;
          thongBao = 'Ngày hóa đơn thay thế không được nhỏ hơn ngày xóa bỏ hóa đơn <b>' + moment(this.lyDoThayThe.ngayXoaBo).format('DD/MM/YYYY') + '</b> của hóa đơn cần thay thế. Vui lòng kiểm tra lại!';
        }
        else {
          ngayHoaDonBiThayThe = this.lyDoThayThe.ngayHoaDon;
          thongBao = 'Ngày hóa đơn thay thế không được nhỏ hơn ngày hóa đơn cần thay thế <b>' + moment(this.lyDoThayThe.ngayHoaDon).format('DD/MM/YYYY') + '</b>. Vui lòng kiểm tra lại!';
        }

        if ((new Date(moment(ngayHoaDon).format('YYYY-MM-DD'))) < (new Date(moment(ngayHoaDonBiThayThe).format('YYYY-MM-DD')))) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzWidth: '500px',
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: thongBao,
            },
            nzFooter: null
          });
          this.spinning = false;
          return;
        }
      }
    }

    if (this.lyDoThayThe != null) {
      if ((data.tongTienThanhToan < 0 || data.tongTienThanhToanQuyDoi < 0 || data.tongTienChietKhau < 0 || data.tongTienChietKhauQuyDoi < 0 || data.tongTienThueGTGT < 0 || data.tongTienThueGTGTQuyDoi < 0 || data.tongTienHang < 0 || data.tongTienHangQuyDoi < 0 || data.thanhTien < 0 || data.thanhTienQuyDoi < 0 || data.tienThueGTGT < 0 || data.tienThueGTGTQuyDoi || data.tienChietKhau < 0 || data.tienChietKhauQuyDoi < 0) && this.boolChoPhepNhapGiaTriAm != true) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '500px',
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Kiểm tra lại",
            msContent: `Bạn đang lập hóa đơn thay thế. Theo đó:<br>
            - Giá trị <b>Số lượng</b>, <b>Đơn giá</b> không đồng thời ghi dấu âm.<br>
            - <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không được có giá trị âm
            Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => {

            }
          }
        })
        this.spinning = false;
        return;
      }
    }
    else if (this.lyDoDieuChinh != null || data.loaiDieuChinh) {
      // if (moment(data.ngayHoaDon).format("YYYY-MM-DD") < moment(this.lyDoDieuChinh.ngayHoaDon).format('YYYY-MM-DD')) {
      //   this.modalService.create({
      //     nzContent: MessageBoxModalComponent,
      //     nzMaskClosable: false,
      //     nzClosable: false,
      //     nzKeyboard: false,
      //     nzWidth: '45%',
      //     nzStyle: { top: '10px' },
      //     nzBodyStyle: { padding: '1px' },
      //     nzComponentParams: {
      //       msTitle: "Kiểm tra lại",
      //       msContent: `Ngày hóa đơn điều chỉnh không được nhỏ hơn ngày hóa đơn bị điều chỉnh &lt;${moment(this.lyDoDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}&lt;. Vui lòng kiểm tra lại!`,
      //       msMessageType: MessageType.Warning,
      //       msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
      //       msOnClose: () => {

      //       }
      //     }
      //   });
      //   this.spinning = false;
      //   if (callback) {
      //     callback(false);
      //   }
      //   return;
      // }

      if (data.loaiDieuChinh == 1) {
        if (data.tongTienThanhToan < 0 || data.tongTienThanhToanQuyDoi < 0 || (data.tongTienChietKhau < 0 && data.tongTienChietKhauQuyDoi < 0 && data.tongTienThueGTGT < 0 && data.tongTienThueGTGTQuyDoi < 0 && data.tongTienHang < 0 && data.tongTienHangQuyDoi < 0)) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '500px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Kiểm tra lại",
              msContent: `Bạn đang lập hóa đơn điều chỉnh tăng. Theo đó:<br>
              - Giá trị <b>Số lượng</b>, <b>Đơn giá</b> không thể hiện ghi dấu âm.<br>
              - <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không được có giá trị âm.<br>
              Vui lòng kiểm tra lại!`,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              }
            }
          })
          this.spinning = false;
          return;
        }
        else {
          let isError = false;
          for (let i = 0; i < data.hoaDonChiTiets.length; i++) {
            if (data.hoaDonChiTiets[i].soLuong < 0 || data.hoaDonChiTiets[i].donGia < 0) {
              isError = true;
              break;
            }
          }

          if (isError == true) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '500px',
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: "Kiểm tra lại",
                msContent: `Bạn đang lập hóa đơn điều chỉnh tăng. Theo đó:<br>
                - Giá trị <b>Số lượng</b>, <b>Đơn giá</b> không thể hiện ghi dấu âm.<br>
                - <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không được có giá trị âm.<br>
                Vui lòng kiểm tra lại!`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => {
                }
              }
            })
            this.spinning = false;
            return;
          }
        }
      }
      else if (data.loaiDieuChinh == 2) {
        if (data.tongTienThanhToan > 0 || data.tongTienThanhToanQuyDoi > 0 || data.tongTienChietKhau > 0 || data.tongTienChietKhauQuyDoi > 0 || data.tongTienThueGTGT > 0 || data.tongTienThueGTGTQuyDoi > 0 || data.tongTienHang > 0 || data.tongTienHangQuyDoi > 0) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '500px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Kiểm tra lại",
              msContent: `Bạn đang lập hóa đơn điều chỉnh giảm. Theo đó:<br>
              - Giá trị <b>Số lượng</b>, <b>Đơn giá</b> không đồng thời ghi dấu âm.<br>
              - <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không được có giá trị dương<br>
              Vui lòng kiểm tra lại!`,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              }
            }
          })
          this.spinning = false;
          return;
        }
        else {
          let isError = false;
          for (let i = 0; i < data.hoaDonChiTiets.length; i++) {
            if (data.hoaDonChiTiets[i].soLuong < 0 && data.hoaDonChiTiets[i].donGia < 0) {
              isError = true;
              break;
            }
          }

          if (isError == true) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '500px',
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: "Kiểm tra lại",
                msContent: `Bạn đang lập hóa đơn điều chỉnh tăng. Theo đó:<br>
                - Giá trị <b>Số lượng</b>, <b>Đơn giá</b> không đồng thời ghi dấu âm.<br>
                - <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không được có giá trị dương<br>
                Vui lòng kiểm tra lại!`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => {
                }
              }
            })
            this.spinning = false;
            return;
          }
        }
      }
      else if (data.loaiDieuChinh == 3) {
        for (let i = 0; i < data.hoaDonChiTiets.length; i++) {
          data.hoaDonChiTiets[i].donGia = 0;
          data.hoaDonChiTiets[i].donGiaSauThue = 0;
          data.hoaDonChiTiets[i].tyLeChietKhau = 0;
        }
      }
    }
    else {
      console.log(this.boolChoPhepNhapGiaTriAm);
      if ((data.tongTienThanhToan < 0 || data.tongTienThanhToanQuyDoi < 0 || data.tongTienChietKhau < 0 || data.tongTienChietKhauQuyDoi < 0 || data.tongTienThueGTGT < 0 || data.tongTienThueGTGTQuyDoi < 0 || data.tongTienHang < 0 || data.tongTienHangQuyDoi < 0 || data.thanhTien < 0 || data.thanhTienQuyDoi < 0 || data.tienThueGTGT < 0 || data.tienThueGTGTQuyDoi || data.tienChietKhau < 0 || data.tienChietKhauQuyDoi < 0) && this.boolChoPhepNhapGiaTriAm != true) {
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
            msContent: `<div>Đối với hóa đơn có trạng thái hóa đơn là <b>Hóa đơn gốc</b> và <b>Hóa đơn thay thế</b> thì:</div>
            <div>- Giá trị: <b>Số lượng</b>, <b>Đơn giá</b> không thể hiện ghi dấu âm.</div>
            <div>- <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không có giá trị âm.</div>
            <div>Vui lòng kiểm tra lại!</div>`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => {
            }
          }
        })
        this.spinning = false;
        return;
      }
      else {
        for (let i = 0; i < data.hoaDonChiTiets.length; i++) {
          if ((data.hoaDonChiTiets[i].soLuong < 0 || data.hoaDonChiTiets[i].donGia < 0 || data.hoaDonChiTiets[i].thanhTien < 0 || data.hoaDonChiTiets[i].tienChietKhau < 0 || data.hoaDonChiTiets[i].tienThueGTGT < 0) && this.boolChoPhepNhapGiaTriAm != true) {
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
                msContent: `<div>Đối với hóa đơn có trạng thái hóa đơn là <b>Hóa đơn gốc</b> và <b>Hóa đơn thay thế</b> thì:</div>
                <div>- Giá trị: <b>Số lượng</b>, <b>Đơn giá</b> không thể hiện ghi dấu âm.</div>
                <div>- <b>Thành tiền</b>, <b>Tiền chiết khấu</b>, <b>Tiền thuế GTGT</b> và <b>Tổng tiền thanh toán</b> không có giá trị âm.</div>
                <div>Vui lòng kiểm tra lại!</div>`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => {
                }
              }
            })
            this.spinning = false;
            return;
          }
        }
      }
    }

    if (this.isAddNew || this.isCopy) {
      this.insert(data);
    } else {
      this.update(data);
    }
  }

  getMoTaChiTietWhenInsert(data: any) {
    if (this.lyDoThayThe) {
      return `Thay thế cho hóa đơn ${this.lyDoThayThe.mauSo} - ${this.lyDoThayThe.kyHieu} - ${this.lyDoThayThe.soHoaDon}`;
    }

    if (this.lyDoDieuChinh) {
      let tenLoaiDieuChinh = '';
      if (data.loaiDieuChinh === 1) {
        tenLoaiDieuChinh = 'Điều chỉnh tăng';
      } else if (data.loaiDieuChinh === 2) {
        tenLoaiDieuChinh = 'Điều chỉnh giảm';

      } else {
        tenLoaiDieuChinh = 'Điều chỉnh thông tin';
      }

      return `${tenLoaiDieuChinh} cho hóa đơn ${this.lyDoDieuChinh.mauSo} - ${this.lyDoDieuChinh.kyHieu} - ${this.lyDoDieuChinh.soHoaDon}`;
    }

    return null;
  }


  forkJoinAfterInsert(hoaDonDienTuId: any) {
    return forkJoin([
      this.hoaDonDienTuService.GetById(hoaDonDienTuId),
      this.hoaDonDienTuService.TienLuiChungTu(hoaDonDienTuId),
      this.tuyChonService.GetAll()
    ]);
  }

  insert(data: any) {
    // if(this.fbBtnEditDisable === false)return;
    data.timeUpdateByNSD = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.hoaDonDienTuService.Insert(data).subscribe((res: any) => {
      if (res) {
        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: this.isCopy ? LoaiHanhDong.NhanBan : LoaiHanhDong.Them,
          refType: RefType.HoaDonDienTu,
          doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(data.loaiHoaDon),
          thamChieu: `Số hóa đơn ${data.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
          moTaChiTiet: this.getMoTaChiTietWhenInsert(data),
          refId: res.hoaDonDienTuId,
        }).subscribe();

        this.callUploadApi(res.hoaDonDienTuId);
        this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
        this.fbEnableEdit = false;
        this.isAddNew = false;
        this.isCopy = false;
        //this.hoaDonDienTuForm.markAsPristine();

        if (this.bienBanDieuChinhId) {
          this.bienBanDieuChinhService.GetById(this.bienBanDieuChinhId).subscribe((rs: any) => {
            if (!rs.hoaDonDieuChinhId && this.lyDoDieuChinh) rs.hoaDonDieuChinhId = res.hoaDonDienTuId;
            this.bienBanDieuChinhService.Update(res).subscribe();
          })
        }

        var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId == data.boKyHieuHoaDonId);
        if (data.trangThai == 1 && boKyHieuHoaDon.hinhThucHoaDon == 2) {
          this.fbBtnPublishDisable = true;
          this.fbBtnDeleteDisable = true;
        }

        this.forkJoinAfterInsert(res.hoaDonDienTuId).subscribe((fork: any[]) => {
          this.data = fork[0];
          this.tienLuiModel = fork[1];
          let listTuyChon: any[] = fork[2];
          this.boolChoPhepNhapGiaTriAm = listTuyChon.find(x => x.ma == 'BoolChoPhepNhapSoAm') ? listTuyChon.find(x => x.ma == 'BoolChoPhepNhapSoAm').giaTri == "true" : false;

          this.hoaDonDienTuForm.reset();
          if (this.data.loaiDieuChinh != 3)
            this.loadForm();
          else this.createForm();
          //this.loadDataAfterAddEdit(true);
          this.isSaved = true;
          this.isClickedSave = false;
        });
      }
    }, _ => {
      this.spinning = false;
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      this.fbBtnSaveDisable = false;
    });
  }

  update(data: any) {
    if (this.isAddNew === true) return;
    data.timeUpdateByNSD = moment().format("YYYY-MM-DDTHH:mm:ss");
    this.hoaDonDienTuService.Update(data).subscribe((res: any) => {
      console.log(res);
      if (res) {
        if (this.isChuyenHoaDonGocThanhThayThe == false) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Sua,
            refType: RefType.HoaDonDienTu,
            doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(data.loaiHoaDon),
            thamChieu: `Số hóa đơn ${data.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
            moTaChiTiet: this.getMoTaChiTietWhenInsert(data),
            refId: data.hoaDonDienTuId,
            duLieuCu: this.data,
            duLieuMoi: data,
            duLieuChiTietCu: this.data.hoaDonChiTiets,
            duLieuChiTietMoi: data.hoaDonChiTiets
          }).subscribe();

          this.callUploadApi(data.hoaDonDienTuId);
          this.hoaDonDienTuForm.markAsPristine();

          if (!this.isPhatHanhLai) {
            this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
            this.fbEnableEdit = false;
          }

          if (this.isCloseModal) {
            this.modal.destroy(true);
            this.disableOrEnableHeaderButtons();
            this.spinning = false;
          } else {
            this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
              .subscribe((model: any) => {
                this.data = model;
                //this.loadDataAfterAddEdit(false, res.hoaDonDienTuId);

                if (this.isPhatHanhLai) {
                  this.publishReceipt(() => {
                    this.spinning = false;
                  });
                } else {
                  this.hoaDonDienTuForm.reset();
                  if (this.data.loaiDieuChinh != 3)
                    this.loadForm();
                  else this.createForm();
                }

                var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId == data.boKyHieuHoaDonId);
                if (data.trangThai == 1 && boKyHieuHoaDon.hinhThucHoaDon == 2) {
                  this.fbBtnPublishDisable = true;
                  this.fbBtnDeleteDisable = true;
                }

                this.isSaved = true;
                this.isClickedSave = false;
              });
          }
        }
        else {
          this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
            .subscribe((model: any) => {
              this.data = model;
              this.hoaDonDienTuService.GetById(model.thayTheChoHoaDonId).subscribe((hdg: any) => {
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonThayThe,
                  refType: RefType.HoaDonDienTu,
                  doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(model.loaiHoaDon),
                  thamChieu: `Số hóa đơn ${model.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(model.ngayHoaDon).format('DD/MM/YYYY')}`,
                  moTaChiTiet: `Chuyển ${this.txtHD_PXK} gốc thành ${this.txtHD_PXK} thay thế cho ${this.txtHD_PXK} ${hdg.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(hdg.ngayHoaDon).format('DD/MM/YYYY')} mẫu số ${hdg.boKyHieuHoaDon.kyHieuMauSoHoaDon} ký hiệu ${hdg.boKyHieuHoaDon.kyHieuHoaDon}`,
                  refId: model.hoaDonDienTuId
                }).subscribe();

                if (this.isCloseModal) {
                  this.modal.destroy(true);
                  this.disableOrEnableHeaderButtons();
                  this.spinning = false;
                }
                else {
                  this.callUploadApi(data.hoaDonDienTuId);
                  this.hoaDonDienTuForm.markAsPristine();
                  this.isSaved = true;
                  this.isClickedSave = false;
                }
              })

            });
        }
      }
      else {
        this.hoaDonDienTuService.GetById(data.thayTheChoHoaDonId).subscribe((hdg: any) => {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonThayThe,
            refType: RefType.HoaDonDienTu,
            doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(data.loaiHoaDon),
            thamChieu: `Số hóa đơn ${data.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
            moTaChiTiet: `Chuyển ${this.txtHD_PXK} gốc thành ${this.txtHD_PXK} thay thế cho ${this.txtHD_PXK} ${hdg.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(hdg.ngayHoaDon).format('DD/MM/YYYY')} mẫu số ${hdg.boKyHieuHoaDon.kyHieuMauSoHoaDon} ký hiệu ${hdg.boKyHieuHoaDon.kyHieuHoaDon} không thành công`,
            refId: data.hoaDonDienTuId
          }).subscribe();
          this.modal.destroy(false);
        });
      }
    }, _ => {
      this.spinning = false;
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      this.fbBtnSaveDisable = false;
    });
  }

  showFormHoaDon(data: any) {

  }

  searchDoiTuong(event: any) {
    this.displayDataDT.Keyword = event;
    this.displayDataDT.PageNumber = 1;
    this.loadingSearchDropdown = true;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {
          this.loadingSearchDropdown = false;
          this.totalPages = res.totalPages;
          this.doiTuongs = [];
          this.doiTuongs = [...this.doiTuongs, ...res.items];
        });
    });
  }

  searchDoiTuongVT(event: any) {
    this.displayDataVT.Keyword = event;
    this.displayDataVT.PageNumber = 1;
    this.loadingSearchDropdown = true;

    this.hangHoaDichVuService.GetAllPaging(this.displayDataVT)
      .subscribe((res: any) => {
        this.totalPages = res.totalPages;
        this.listVT_HH = [];
        this.listVT_HH = [...this.listVT_HH, ...res.items];
        this.loadingSearchDropdown = false;
      });
  }

  searchNhanVien(event: any) {
    if (event) {
      const arrCondition = ['ma', 'ten'];
      this.nhanViensSearch = SearchEngine(this.nhanViens, arrCondition, event);
    } else {
      this.nhanViensSearch = this.nhanViens;
    }
  }

  loadMoreDoiTuong(): void {
    this.isLoadingMore = true;

    if (this.displayDataDT.PageNumber >= this.totalPages) {
      this.isLoadingMore = false;
      return;
    }

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.displayData.PageNumber += 1;

      if (this.displayData.PageNumber > this.totalPages) {
        this.isLoadingMore = false;
        return;
      }

      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {

          this.totalPages = res.totalPages;
          this.doiTuongs = [...this.doiTuongs, ...res.items];
          this.isLoadingMore = false;
        });
    }, this.doneTypingInterval);
  }

  openChangeDropDown(event: any, element = null) {
    if (event) {
      this.displayDataDT.Keyword = '';
      this.displayDataDT.PageNumber = 1;
      this.loadingSearchDropdown = true;
      this.doiTuongs = [];
      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {
          this.totalPages = res.totalPages;
          this.doiTuongs = [...this.doiTuongs, ...res.items];
          this.loadingSearchDropdown = false;
        });


      if (element) {
        const component = element as NzSelectComponent;
        // Nếu chiều ngang select bị khuất thì điều chỉnh vị trí căn bên phải
        setTimeout(() => {
          var cdkOverlay = document.querySelector('.cdk-overlay-connected-position-bounding-box .ant-select-dropdown--single') as HTMLElement;
          var rect = cdkOverlay.getBoundingClientRect();
          if (rect.left + rect.width > window.innerWidth) {
            cdkOverlay.style.left = -(rect.width - component.triggerWidth) + 'px';
          }
        }, 0);
      }

    }
  }

  openChangeBKH(event: any) {
    if (event) {
      this.boKyHieuHoaDons = this.boKyHieuHoaDonsRaw.filter(x => x.trangThaiSuDung != 3);
    }
    else this.boKyHieuHoaDons = this.boKyHieuHoaDonsRaw;
  }

  openDanhMuc(link: string) {
    window.open(link);
  }

  forward() {
    this.clickSua(this.tienLuiModel.truocId);
  }

  backward() {
    this.clickSua(this.tienLuiModel.sauId);
  }

  first() {
    this.clickSua(this.tienLuiModel.veDauId);
  }

  last() {
    this.clickSua(this.tienLuiModel.veCuoiId);
  }

  clickSua(id: any) {
    this.hoaDonDienTuService.GetById(id)
      .subscribe((res: any) => {
        this.data = res;
        this.ngOnInit();
      });
  }

  changeNgoaiTe(data: any) {
    if (this.hoaDonDienTuForm.get('loaiTienId').dirty) {
      const oldMaLoaiTien = this.maLoaiTien;
      const loaiTien = this.loaiTiens.find(x => x.loaiTienId === data);
      this.maLoaiTien = loaiTien.ma;
      this.hoaDonDienTuForm.get('tyGia').setValue(loaiTien.tyGiaQuyDoi);
      this.hoaDonDienTuForm.get('maLoaiTien').setValue(this.maLoaiTien);
      this.isVND = this.maLoaiTien === 'VND';
      this.tinhToanHDDV = new TinhToanHangHoaDichVu(this.hoaDonDienTuForm, this.hoaDonChiTiets, this.isVND);
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        this.hoaDonChiTiets[i].soLuongDirty = true;
        this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.SO_LUONG, true, null, false);
      }

      this.tinhLaiTongTien();

      if (this.maLoaiTien === 'VND' && oldMaLoaiTien !== 'VND') {
        this.hoaDonDienTuForm.get('tyGia').disable();
        const x = this.scrollConfig.x.substring(0, this.scrollConfig.x.length - 2);
        this.scrollConfig.x = (parseInt(x, 0) - this.doRongCacCot.ThanhTienQuyDoi - this.doRongCacCot.TienThueGTGTQuyDoi - this.doRongCacCot.TienCKQuyDoi) + 'px';
      }
      if (this.maLoaiTien !== 'VND' && oldMaLoaiTien === 'VND') {
        this.hoaDonDienTuForm.get('tyGia').enable();
        const x = this.scrollConfig.x.substring(0, this.scrollConfig.x.length - 2);
        this.scrollConfig.x = (parseInt(x, 0) + this.doRongCacCot.ThanhTienQuyDoi + this.doRongCacCot.TienThueGTGTQuyDoi + this.doRongCacCot.TienCKQuyDoi) + 'px';
      }
    }
  }

  changeValueCT(data: any, position: BlurPosition) {
    switch (position) {
      case BlurPosition.SO_LUONG:
        {
          data.soLuongDirty = true;
          break;
        }
      case BlurPosition.DON_GIA:
        {
          data.donGiaDirty = true;
          break;
        }
      case BlurPosition.DON_GIA_SAU_THUE:
        {
          data.donGiaSauThueDirty = true;
          break;
        }
      case BlurPosition.THANH_TIEN:
        {
          data.thanhTienDirty = true;
          break;
        }
      case BlurPosition.THANH_TIEN_SAU_THUE:
        {
          data.thanhTienSauThueDirty = true;
          break;
        }
      case BlurPosition.THANH_TIEN_QUY_DOI:
        {
          data.thanhTienQuyDoiDirty = true;
          break;
        }
      case BlurPosition.TI_LE_CK:
        {
          data.tyLeChietKhauDirty = true;
          break;
        }
      case BlurPosition.TIEN_CK:
        {
          data.tienCKDirty = true;
          break;
        }
      case BlurPosition.TIEN_CK_QUY_DOI:
        {
          data.tienCKQuyDoiDirty = true;
          break;
        }
      case BlurPosition.THUE_GTGT:
        {
          data.thueGTGTDirty = true;
          break;
        }
      case BlurPosition.TIEN_THUE_GTGT:
        {
          data.tienThueGTGTDirty = true;
          break;
        }
      case BlurPosition.TIEN_THUE_GTGT_QUY_DOI:
        {
          data.tienThueGTGTQuyDoiDirty = true;
          break;
        }
      case BlurPosition.TY_LE_PHAN_TRAM_DOANH_THU:
        {
          data.tyLePhanTramDoanhThuDirty = true;
          break;
        }
      case BlurPosition.TIEN_GIAM:
        {
          data.tienGiamDirty = true;
          break;
        }
      case BlurPosition.TIEN_GIAM_QUY_DOI:
        {
          data.tienGiamQuyDoiDirty = true;
          break;
        }
      default:
        break;
    }
  }

  blurTyGia() {
    const tyGia = this.hoaDonDienTuForm.get('tyGia').value;

    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      const item = this.hoaDonChiTiets[i];
      item.thanhTienQuyDoi = mathRound(item.thanhTien * tyGia, this.ddtp.getTienQuyDoi());
      item.tienChietKhauQuyDoi = mathRound(item.tienChietKhau * tyGia, this.ddtp.getTienQuyDoi());
      item.tienThueGTGTQuyDoi = mathRound(item.tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
      item.tienGiamQuyDoi = mathRound(item.tienGiam * tyGia, this.ddtp.getTienQuyDoi());
    }

    this.tinhLaiTongTien();
  }

  tinhLaiTongTien() {
    tinhToanTongTien(this.hoaDonDienTuForm, this.hoaDonChiTiets, BlurPosition.NONE, this.ddtp, this.isVND, true);
  }

  blurTyLeChietKhauTong(isTinhLaiThue = true) {
    let tyLeChietKhau = this.hoaDonDienTuForm.get('tyLeChietKhau').value;

    if (!tyLeChietKhau) {
      tyLeChietKhau = 0;
      this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(tyLeChietKhau);
    }

    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      this.hoaDonChiTiets[i].tyLeChietKhau = tyLeChietKhau;
      this.hoaDonChiTiets[i].tyLeChietKhauDirty = true;
      if (isTinhLaiThue) {
        this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.TI_LE_CK, true, null, false);
      }
    }

    this.tinhLaiTongTien();
  }

  onAddObjClick(): void {
    if (this.isAddNew === true) return;
    this.fbEnableEdit = true;
    this.isAddNew = true;
    this.hoaDonChiTiets = [];
    this.disableOrEnableHeaderButtons();
    if (this.lyDoThayThe) {
      this.data.lyDoThayThe = null;
      this.data.thayTheChoHoaDonId = null;
      this.data.trangThai = 1;
      this.data.maCuaCQT = null;
      this.data.soHoaDon = null;

      this.hoaDonDienTuForm.get('soHoaDon').setValue(null);
      this.hoaDonDienTuForm.get('trangThai').setValue(1);
      this.hoaDonDienTuForm.get('maCuaCQT').setValue(null);
      this.hoaDonDienTuForm.get('thayTheChoHoaDonId').setValue(null);
      this.hoaDonDienTuForm.get('lyDoThayThe').setValue(null);

      this.lyDoThayThe = null;
      this.noiDungThayTheHoaDon = null;
    }
    if (this.lyDoDieuChinh) {
      this.data.lyDoDieuChinh = null;
      this.data.dieuChinhChoHoaDonId = null;
      this.data.trangThai = 1;
      this.data.maCuaCQT = null;
      this.data.soHoaDon = null;

      this.hoaDonDienTuForm.get('soHoaDon').setValue(null);
      this.hoaDonDienTuForm.get('trangThai').setValue(1);
      this.hoaDonDienTuForm.get('maCuaCQT').setValue(null);
      this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').setValue(null);
      this.hoaDonDienTuForm.get('lyDoDieuChinh').setValue(null);
      this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(null);

      this.lyDoDieuChinh = null;
      this.noiDungDieuChinhHoaDon = null;
    }
    this.createForm();
  }

  onEditClick() {
    if (this.isAddNew === true) return;
    this.fbEnableEdit = true;

    this.disableOrEnableHeaderButtons();

    //this.loadForm();
    if (this.lyDoThayThe) {
      //kiểm tra để tích chọn sẵn trường lập văn bản thỏa thuận khi lập hóa đơn thay thế
      //ko cần kiểm tra this.lyDoThayThe.isSystem = true nữa vì đã sửa là chỉ có hóa đơn hệ thống
      this.hoaDonDienTuForm.get('isLapVanBanThoaThuan').disable();
    }
  }

  async clickAdd() {
    let type = this.loaiHD;
    if (type == null) {
      this.showThongBaoKhongTonTaiBoKyHieu();
      return;
    }

    var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);

    if (listKyHieus.length === 0) {
      this.showThongBaoKhongTonTaiBoKyHieu();
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
      },
      nzFooter: null
    });
    this.modal.destroy(false);
  }

  showThongBaoKhongTonTaiBoKyHieu() {
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
        }
      },
      nzFooter: null
    });
  }

  async onDeleteClick(): Promise<void> {
    if (this.isAddNew === true) return;
    if (this.fbBtnEditDisable === true) return;

    var checkDaPhatSinhThongDiepTN = await this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(this.data.hoaDonDienTuId);
    var trangThaiQuyTrinh = await this.hoaDonDienTuService.GetTrangThaiQuyTrinhByIdAsync(this.data.hoaDonDienTuId);

    if ((trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi && trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh) || checkDaPhatSinhThongDiepTN) {
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
          this.spinning = true;
          this.hoaDonDienTuService.Delete(this.data.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.HoaDonDienTu,
                doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.data.loaiHoaDon),
                thamChieu: `Số hóa đơn ${this.data.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(this.data.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: this.data.hoaDonDienTuId,
              }).subscribe();

              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.modal.destroy(true);
            } else {
              this.message.error('Lỗi xóa dữ liệu');
            }
            this.spinning = false;
          }, _ => {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);

            this.spinning = false;
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
        this.modal.destroy(true);
      }
    });
  }

  onPrintClick(): void {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
        const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
        printJS(pathPrint);
        this.message.remove(id);
      }, (err) => {
        this.message.warning("Lỗi khi in hóa đơn");
        this.message.remove(id);
      });
    }, (err) => {
      console.log(err);
      this.message.warning("Lỗi khi in hóa đơn");
      this.message.remove(id);
    })
  }

  onExportClick() {
    this.tabHoaDonDienTuComponent.listOfSelected = [this.data];
    this.tabHoaDonDienTuComponent.ExportDetail();
  }

  onHelpClick(): void {
    ///
  }

  disableControls(disabled = true) {
    if (disabled) {
      this.fbBtnSaveDisable = true;
      this.fbBtnPlusDisable = false;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = false;
      this.fbBtnPublishDisable = false;
      this.fbBtnViewDisable = false;

      if (this.data && this.data.hoaDonDienTuId) {
        if (this.data.trangThaiQuyTrinh >= TrangThaiQuyTrinh.DaKyDienTu && this.data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh && this.data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaGuiCQT) {
          this.fbBtnEditDisable = true;
          this.fbBtnDeleteDisable = true;
          this.fbBtnPublishDisable = true;
        }

        if (this.data.trangThaiQuyTrinh == TrangThaiQuyTrinh.GuiTCTNLoi) {
          this.fbBtnEditDisable = false;
          this.fbBtnPublishDisable = false;
        }
      }

      this.hoaDonDienTuForm.disable();
      // (this.hoaDonDienTuForm.get('hoaDonChiTiets') as FormArray)
      //   .controls
      //   .forEach(control => {
      //     control.disable();
      //   });
    } else {
      this.fbBtnSaveDisable = false;
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = true;
      this.fbBtnDeleteDisable = true;
      this.fbBtnPrinterDisable = true;
      this.fbBtnPublishDisable = true;
      this.fbBtnViewDisable = true;
      this.hoaDonDienTuForm.enable();

      if (this.maLoaiTien === 'VND') {
        this.hoaDonDienTuForm.get('tyGia').disable();
      }

      if (this.isPhatHanhLai) {
        this.hoaDonDienTuForm.get('ngayHoaDon').disable();
        this.hoaDonDienTuForm.get('boKyHieuHoaDonId').disable();
        this.fbBtnSaveDisable = true;
        this.fbBtnPublishDisable = false;
      }

      const loaiChietKhau = this.hoaDonDienTuForm.get('loaiChietKhau').value;
      if (loaiChietKhau === 1) {
        this.hoaDonDienTuForm.get('tyLeChietKhau').disable();
      } else {
        this.hoaDonDienTuForm.get('tyLeChietKhau').enable();
      }

      if (this.data && this.data.trangThaiQuyTrinh == TrangThaiQuyTrinh.GuiTCTNLoi) {
        this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQT(this.data.hoaDonDienTuId)
          .subscribe((res: any) => {
            if (res) { // Nếu có phát sinh phản hồi từ CQT
              this.hoaDonDienTuForm.get('ngayHoaDon').disable();
              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').disable();
            }
          });
      }

      // (this.hoaDonDienTuForm.get('hoaDonChiTiets') as FormArray)
      //   .controls.forEach(control => {
      //     control.enable();
      //   });

      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        const element = this.hoaDonChiTiets[i];
        // this.changeTinhChat(element.tinhChat, i);

        this.disabledOrEnableItemHoaDonChiTiet(i, false);

        this.hoaDonChiTiets[i].disabledSTT = true;

        if (!this.hoaDonChiTiets[i].isMatHangDuocGiam) {
          this.hoaDonChiTiets[i].disabledTyLePhanTramDoanhThu = true;
          this.hoaDonChiTiets[i].disabledTienGiam = true;
          this.hoaDonChiTiets[i].disabledTienGiamQuyDoi = true;
        }

        if (element.tinhChat == 3) {
          this.hoaDonChiTiets[i].disabledTyLeChietKhau = true;
          this.hoaDonChiTiets[i].disabledTienChietKhau = true;
          this.hoaDonChiTiets[i].disabledTienThueGTGT = true;
        } else if (element.tinhChat == 4) {
          this.disabledOrEnableItemHoaDonChiTiet(i, true);

          this.hoaDonChiTiets[i].disabledHangHoaDichVuId = false;
          this.hoaDonChiTiets[i].disabledTenHang = false;
          this.hoaDonChiTiets[i].disabledTinhChat = false;
        } else if (element.tinhChat === 2) {
          this.hoaDonChiTiets[i].disabledThueGTGT = true;
          this.hoaDonChiTiets[i].disabledTienThueGTGT = true;
        }

        //Nếu loại chiết khấu là tổng giá trị hóa đơn thì disable cột tỷ lệ chiết khấu hhdv
        if (this.hoaDonDienTuForm.get('loaiChietKhau').value === 2) {
          this.hoaDonChiTiets[i].disabledTyLeChietKhau = true;
        }
      }

      this.detectChangeLoaiThueSuat(false);
      this.hoaDonDienTuForm.get('loaiDieuChinh').enable();
    }
  }
  clickXem() {

  }

  tinhTongCot(dataTable: any, columnName: string) {
    let tongCot = 0;
    (dataTable as FormArray).controls
      .forEach(control => {
        let val = control.get(columnName).value;
        if (val == null) val = 0;
        tongCot += val;
      });

    return tongCot;
  }

  checkValidDate(loai: string, index = 0) {
    if (loai === 'ngayHoaDon') {
      this.displayData.fromDate = this.hoaDonDienTuForm.get('ngayHoaDon').value;
      CheckValidDateV2(this.displayData);
      this.hoaDonDienTuForm.patchValue({
        ngayHoaDon: this.displayData.fromDate,
      });
    }

    // this.getBoKyHieuByNgayHoaDon();
  }

  getBoKyHieuByNgayHoaDon(updateLoaiThue: any, isChangeAuTo = true) {
    const ngayHoaDon = this.hoaDonDienTuForm.get('ngayHoaDon').value;
    const dirty = this.hoaDonDienTuForm.get('ngayHoaDon').dirty;
    var boKyHieuHoaDonIda = this.hoaDonDienTuForm.get('boKyHieuHoaDonId').value
    const roleId = this.currentUser.roleId;

    if (ngayHoaDon && dirty) {
      this.boKyHieuHoaDonService.GetListForHoaDon(this.loaiHD, ngayHoaDon, boKyHieuHoaDonIda, roleId)
        .subscribe((res: any[]) => {
          this.boKyHieuHoaDons = res;

          var phanQuyen = localStorage.getItem('KTBKUserPermission');
          if (phanQuyen != 'true') {
            var pq = JSON.parse(phanQuyen);
            this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
            this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => this.mauHoaDonDuocPQ.indexOf(x.boKyHieuHoaDonId) >= 0);
          }

          if (this.boKyHieuHoaDons.length > 0) {
            /// Nếu list res có bọ ký hiệu cũ => k thay đổi bộ ký hiệu
            let found = res.some(el => el.boKyHieuHoaDonId == boKyHieuHoaDonIda);
            if (isChangeAuTo && !found) {
              const boKyHieuHoaDonIdAfterChange = this.boKyHieuHoaDons[0].boKyHieuHoaDonId

              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').setValue(boKyHieuHoaDonIdAfterChange);
              this.hoaDonDienTuForm.get('boKyHieuHoaDonId').markAsDirty();
              this.changeKyHieu(boKyHieuHoaDonIdAfterChange);
            }

          } else {
            this.hoaDonDienTuForm.get('boKyHieuHoaDonId').setValue(null);
          }

          const boKyHieuHoaDonId = this.hoaDonDienTuForm.get('boKyHieuHoaDonId').value;
          var boKyHieuHoaDon = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === boKyHieuHoaDonId);
          this.loaiThues = JSON.parse(JSON.stringify(boKyHieuHoaDon.mauHoaDons));

          if (!this.isAddNew) {
            var loaiThue = this.hoaDonDienTuForm.get('loaiThue').value;
            if (!this.loaiThues.some(x => x.loaiThueGTGT === loaiThue)) {
              if (loaiThue === 1) {
                this.loaiThues.unshift({
                  loaiThueGTGT: 1,
                  tenLoaiThueGTGT: 'Một thuế suất'
                });
              } else {
                this.loaiThues.push({
                  loaiThueGTGT: 2,
                  tenLoaiThueGTGT: 'Nhiều thuế suất'
                });
              }
            }
          }

          if (updateLoaiThue) {
            this.loaiThueSuat = boKyHieuHoaDon.mauHoaDons[0].loaiThueGTGT;
            console.log('this.loaiThueSuat: ', this.loaiThueSuat);
            this.tenLoaiHoaDonFull = boKyHieuHoaDon.mauHoaDons[0].tenLoaiHoaDonFull;
            this.hoaDonDienTuForm.get('mauHoaDonId').setValue(boKyHieuHoaDon.mauHoaDons[0].mauHoaDonId);
          }
        });

      this.hoaDonDienTuForm.get('ngayHoaDon').markAsPristine();
    }
  }

  getFieldWithFieldName(fieldName: any) {
    switch (fieldName) {
      case 'MaHang':
        return 'hangHoaDichVuId';
      case 'TenHang':
        return 'tenHang';
      case 'HangKhuyenMai':
        return 'hangKhuyenMai';
      case 'MaQuyCach':
        return 'maQuyCach';
      case 'DonViTinh':
        return 'donViTinhId';
      case 'SoLuong':
        return 'soLuong';
      case 'DonGia':
        return 'donGia';
      case 'DonGiaSauThue':
        return 'donGiaSauThue';
      case 'ThanhTien':
        return 'thanhTien';
      case 'ThanhTienSauThue':
        return 'thanhTienSauThue';
      case 'ThanhTienQuyDoi':
        return 'thanhTienQuyDoi';
      case 'TyLeChietKhau':
        return 'tyLeChietKhau';
      case 'TienChietKhau':
        return 'tienChietKhau';
      case 'TienChietKhauQuyDoi':
        return 'tienChietKhauQuyDoi';
      case 'ThueGTGT':
        return 'thueGTGT';
      case 'TienThueGTGT':
        return 'tienThueGTGT';
      case 'TienThueGTGTQuyDoi':
        return 'tienThueGTGTQuyDoi';
      case 'SoLo':
        return 'soLo';
      case 'HanSuDung':
        return 'hanSuDung';
      case 'SoKhung':
        return 'soKhung';
      case 'SoMay':
        return 'soMay';
      case 'XuatBanPhi':
        return 'xuatBanPhi';
      case 'GhiChu':
        return 'ghiChu';
      case 'MaNhanVien':
        return 'nhanVienBanHangId';
      case 'TenNhanVien':
        return 'tenNhanVien';
    }

  }

  focusPoiterNumber() {
    this.isFocusPoiter = true;
  }
  setPoiterNumber(form: FormGroup, formChiTiet: string, input: any, index: number, name: string) {
    this.isFocusPoiter = SetPoiterNumber(form, formChiTiet, input, index, name, this.isFocusPoiter);
  }

  getListDonGia(index: any) {
    ////
  }

  inputKyHieu(event: any) {
    if (event.target.value) {
      this.hoaDonDienTuForm.get('kyHieu').setValue(event.target.value.toUpperCase());
    }
  }

  chonLaiHoaDonBiDieuChinh() {
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Chọn hóa đơn điều chỉnh',
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
        this.lyDoDieuChinh = {
          dieuChinhChoHoaDonId: rs.hoaDonDienTuId || null,
          hinhThucHoaDonBiDieuChinh: rs.hinhThucHoaDonBiDieuChinh || null,
          mauSo: rs.mauSo,
          kyHieu: rs.kyHieu,
          ngayHoaDon: rs.ngayHoaDon,
          soHoaDon: rs.soHoaDon,
          lyDo: rs.lyDoDieuChinh || null,
          maTraCuu: rs.maTraCuu || null
        };

        this.noiDungDieuChinhHoaDon = getLyDoDieuChinh(this.lyDoDieuChinh);

        this.hoaDonChiTiets.push(this.createHoaDonChiTiets(null).getRawValue());
        this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
        if (this.lyDoDieuChinh.dieuChinhChoHoaDonId) {
          this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').setValue(this.lyDoDieuChinh.dieuChinhChoHoaDonId);
          this.hoaDonDienTuForm.get('loaiApDungHoaDonDieuChinh').setValue(this.lyDoDieuChinh.hinhThucHoaDonBiDieuChinh);
        }
        this.blurTyGia();
      }
    });
  }

  lapBienBanDieuChinhHoaDon() {
    const rs = this.getHoaDonBiThayThe();
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Lập biên bản điều chỉnh hóa đơn',
      nzContent: AddEditBienBanDieuChinhModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '100%',
      nzStyle: { top: '0px' },
      nzBodyStyle: { padding: '1px', height: '92vh' },
      nzComponentParams: {
        isAddNew: true,
        hoaDonBiDieuChinh: rs,
        hoaDonDieuChinhId: this.hoaDonDienTuForm.get('hoaDonDienTuId').value,
        isFromGP: this.lyDoDieuChinh.isSystem
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.hoaDonDienTuForm.get('bienBanDieuChinhId').setValue(rs.bienBanDieuChinhId);
        if (!this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').dirty) {
          this.hoaDonDienTuForm.get('noiDungLyDoDieuChinh').setValue(rs.lyDoDieuChinh);
          this.lyDoDieuChinh.lyDo = rs.lyDoDieuChinh;
        }
        this.sharedService.emitChange({
          type: 'loadData',
          value: true
        });
      }
    });
  }

  getHoaDonBiThayThe() {
    if (this.lyDoDieuChinh) {
      return {
        hoaDonDienTuId: this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').value,
        ngayHoaDon: this.lyDoDieuChinh.ngayHoaDon,
        soHoaDon: this.lyDoDieuChinh.soHoaDon,
        mauSo: this.lyDoDieuChinh.mauSo,
        kyHieu: this.lyDoDieuChinh.kyHieu,
        maTraCuu: this.lyDoDieuChinh.maTraCuu
      };
    }
    return null;
  }

  chonHangHoaDichVuBiDieuChinh() {
    const dieuChinhChoHoaDonId = this.hoaDonDienTuForm.get('dieuChinhChoHoaDonId').value;
    const loaiTienId = this.hoaDonDienTuForm.get('loaiTienId').value;
    const tyGia = this.hoaDonDienTuForm.get('tyGia').value;
    if (dieuChinhChoHoaDonId) {
      const modal = this.ActivedModal = this.modalService.create({
        nzTitle: 'Chọn hàng hóa, dịch vụ bị điều chỉnh',
        nzContent: ChonHhdvTuHoaDonGocModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: window.innerWidth / 100 * 90,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '5px' },
        nzComponentParams: {
          lyDoDieuChinh: this.lyDoDieuChinh,
          hoaDonBiDieuChinhId: dieuChinhChoHoaDonId,
          loaiTienId: loaiTienId,
          tyGia: tyGia
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any[]) => {
        this.ActivedModal = null;
        if (rs && rs.length) {
          if (this.hoaDonChiTiets.length == 1 && this.hoaDonChiTiets[0].maHang == null) {
            this.tinhToanHDDV.removeChiTiets(0);
            this.hoaDonChiTiets = [];
          }
          rs.forEach((item: any) => {
            item.hoaDonDienTuChiTietId = null;
            item.stt = rs.indexOf(item) + 1;
            var arr = this.createHoaDonChiTiets(item).getRawValue();
            this.hoaDonChiTiets.push(arr);
            this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
            if (item.hangHoaDichVuId) this.ChangeVatTu(item.stt - 1, item.hangHoaDichVuId);
            this.tinhLaiTongTien();
          });
          if (rs[0].loaiTienId) {
            this.hoaDonDienTuForm.markAsDirty();
            this.hoaDonDienTuForm.updateValueAndValidity();
            this.hoaDonDienTuForm.get('loaiTienId').setValue(rs[0].loaiTienId);
            this.hoaDonDienTuForm.get('maLoaiTien').setValue(rs[0].maLoaiTien);
            this.hoaDonDienTuForm.get('tyGia').setValue(rs[0].tyGia);
          }
        }
      });
    }
  }

  callUploadApi(id: any) {
    var files = this.listFile.filter(x => x.file).map(x => x.file);
    var removedFiles = this.listUploadedFile.filter(x => !this.listFile.map(y => y.taiLieuDinhKemId).includes(x.taiLieuDinhKemId));

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: id,
      loaiNghiepVu: RefType.HoaDonDienTu,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        console.log(res);
      });
  }


  uploadFile(event: any) {
    if (event && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];

        this.listFile.push({
          tenGoc: file.name,
          file: file,
          link: GetFileUrl(file),
        });
      }
    }
  }

  downloadFile(item: TaiLieuDinhKem) {
    this.uploadFileService.CheckExistsFilesById(item.taiLieuDinhKemId).subscribe((rs) => {
      DownloadFile(item.link, item.tenGoc);
    });
  }

  deleteFile(item: TaiLieuDinhKem) {
    this.listFile = this.listFile.filter(x => x !== item);
  }

  changeHinhThucThanhToan(event: any) {
    // if (!this.hoaDonDienTuForm.get('hinhThucThanhToanId').dirty) {
    //   return;
    // }

    // const model = this.hinhThucThanhToans.find(x => x.hinhThucThanhToanId === event);
    // this.hoaDonDienTuForm.get('tenHinhThucThanhToan').setValue(model != null ? model.ten : null);
  }

  changeTenHinhThucTT(event: any) {
    if (event) {
      var item = this.hThucThanhToans.find(x => x.name.toUpperCase() === event.toUpperCase());
      this.hoaDonDienTuForm.get('hinhThucThanhToanId').setValue(item ? item.id : event);
    }
  }

  selectedHinhThucTT(data: any) {
    this.hoaDonDienTuForm.get('hinhThucThanhToanId').setValue(data.id);
    this.hoaDonDienTuForm.get('tenHinhThucThanhToan').setValue(data.name);
  }

  changeLoaiChietKhau(event: any) {
    if (!this.hoaDonDienTuForm.get('loaiChietKhau').dirty) {
      return;
    }

    if (event === 1) {
      this.hoaDonDienTuForm.get('tyLeChietKhau').disable();
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        if (this.hoaDonChiTiets[i].tinhChat === 3) {
          this.hoaDonChiTiets[i].disabledTyLeChietKhau = true;
        } else {
          this.hoaDonChiTiets[i].disabledTyLeChietKhau = false;
        }
        this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
      }
    } else {
      this.hoaDonDienTuForm.get('tyLeChietKhau').enable();
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        this.hoaDonChiTiets[i].disabledTyLeChietKhau = true;
        this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
      }
    }

    this.LoadTruongDuLieuHoaDonTheoLoaiChietKhau(event);

    this.resetChietKhauCT(event);
  }

  resetChietKhauCT(loaiChietKhau: any) {
    this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(0);

    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      if (this.boolPhatSinhBanHangTheoDGSauThue && this.boolTinhSLTheoDGvaTienSauThue && this.hoaDonChiTiets[i].hangHoaDichVu && loaiChietKhau !== 0) {
        this.hoaDonChiTiets[i].tyLeChietKhau = this.hoaDonChiTiets[i].hangHoaDichVu.tyLeChietKhau;
      } else {
        this.hoaDonChiTiets[i].tyLeChietKhau = 0;
        this.hoaDonChiTiets[i].tienChietKhau = 0;
        this.hoaDonChiTiets[i].tienChietKhauQuyDoi = 0;
      }

      this.hoaDonChiTiets[i].tyLeChietKhauDirty = true;
      this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
      this.tinhToanHDDV.blurTinhToan(i, BlurPosition.TI_LE_CK, true, null, false);
    }

    this.tinhLaiTongTien();
  }

  changeLoaiDieuChinh(event: any) {
    if (!this.noiDungDieuChinhHoaDon) {
      return;
    }
    if (event === 3) {
      this.hoaDonDienTuForm.get('loaiTienId').disable();
      this.hoaDonDienTuForm.get('tyGia').disable();

      for (const i in this.hoaDonChiTiets) {
        this.hoaDonChiTiets[i].soLuong = 0;
        this.hoaDonChiTiets[i].soLuongDirty = true;
        this.hoaDonChiTiets[i].donGia = 0;
        this.hoaDonChiTiets[i].donGiaQuyDoi = 0;
        this.hoaDonChiTiets[i].thueGTGT = null;
        this.hoaDonChiTiets[i].thanhTien = 0;
        this.hoaDonChiTiets[i].thanhTienQuyDoi = 0;
        this.hoaDonChiTiets[i].tienThueGTGT = 0;
        this.hoaDonChiTiets[i].tienThueGTGTQuyDoi = 0;
        this.hoaDonChiTiets[i].tyLeChietKhau = 0;
        this.hoaDonChiTiets[i].tienChietKhau = 0;
        this.hoaDonChiTiets[i].tienChietKhauQuyDoi = 0;
        this.hoaDonChiTiets[i].thanhTien = 0;
        this.hoaDonChiTiets[i].thanhTienQuyDoi = 0;
      }

      this.tinhToanHDDV.updateAllChiTiets(this.hoaDonChiTiets);
      this.tinhLaiTongTien();
    } else {
      this.hoaDonDienTuForm.get('loaiTienId').enable();
      this.hoaDonDienTuForm.get('tyGia').enable();

      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        if (this.loaiDieuChinhCu == 3) {
          this.ChangeVatTu(i, this.hoaDonChiTiets[i].hangHoaDichVuId);
        }
        this.hoaDonChiTiets[i].soLuong = 1;
        this.hoaDonChiTiets[i].soLuongDirty = true;
        this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
        this.tinhToanHDDV.blurTinhToan(i, BlurPosition.SO_LUONG, true, null, false);
      }

      this.tinhLaiTongTien();
    }

    this.loaiDieuChinhCu = event;
    this.hoaDonDienTuForm.get('loaiDieuChinh').enable();
  }

  public get loaiChiTiet(): typeof LoaiChiTietTuyChonNoiDung {
    return LoaiChiTietTuyChonNoiDung;
  }

  changeThueGTGT(data: any, index: any) {
    console.log('change thuế gtgt');
    const thueGTGT = this.hoaDonChiTiets[index].thueGTGT;

    console.log(this.hoaDonChiTiets[index].thanhTien);
    if (this.loaiThueSuat === 1) {
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        if (i !== index) {
          this.hoaDonChiTiets[i].thueGTGT = data.thueGTGT;
          this.hoaDonChiTiets[i].thueGTGTDirty = true;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
          if (thueGTGT === 'KHAC') {
            this.hoaDonChiTiets[i].thueKhac = 0;
            this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          }
        }
      }

      this.tinhLaiTongTien();
    }

    setTimeout(() => {
      var element = document.getElementById(`inputThueKhac${index}`) as any;
      if (element) {
        element.focus();
        element.selectionStart = 0;
        element.selectionEnd = 0;
        element.click();
      }
    }, 0);
  }

  selectedThueGTGT(data: any, item: any, index: any) {
    console.log('change thuế gtgt');
    if (this.loaiThueSuat === 1) { // 1 thuế suất
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        this.hoaDonChiTiets[i].thueGTGT = item.value;
        this.hoaDonChiTiets[i].thueKhac = 0;
        this.hoaDonChiTiets[i].thueGTGTDirty = true;
        this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
        this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
      }

      this.tinhLaiTongTien();
    } else {
      data.thueGTGT = item.value;
      data.thueKhac = 0;
      data.thueGTGTDirty = true;
      this.tinhToanHDDV.updateChiTiet(data, index);
      this.tinhToanHDDV.blurTinhToan(index, BlurPosition.THUE_GTGT)
    }
  }

  blurThueGTGT(data: any, index: any) {
    data.thueKhac = data.thueKhac || 0;

    if (this.loaiThueSuat === 1) {
      for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
        if (i !== index) {
          this.hoaDonChiTiets[i].thueKhac = data.thueKhac;
          this.hoaDonChiTiets[i].thueGTGTDirty = true;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
        }
      }

      this.tinhLaiTongTien();
    }
  }

  changeNgayHoaDon(event: any, updateLoaiThue = true, isAutoChange = true, updateChiTiet = true) {
    if (!this.hoaDonDienTuForm.get('ngayHoaDon').dirty) {
      return;
    }

    if (event) {
      this.isGiamTheoNghiQuyetSo432022QH15 = false;

      this.phanTramThueGTGTs = getThueGTGTs();

      const month = moment(event).format('MM');
      const year = moment(event).format('YYYY');

      if ((month === '11' || month === '12') && year === '2021') {
        this.phanTramThueGTGTs.push({
          value: '3.5', text: '3,5%',
        });
        this.phanTramThueGTGTs.push({
          value: '7', text: '7%',
        });
      } else if (parseInt(month) >= 2 && parseInt(month) <= 12 && year === '2022' || this.isGiamTheoNghiQuyetSo432022QH15_DC_TT) {
        this.isGiamTheoNghiQuyetSo432022QH15 = true;

        if (this.hoaDonDienTuForm.get(`isGiamTheoNghiQuyet`).value) {
          const indexTenPercent = this.phanTramThueGTGTs.findIndex(x => x.value === '10');
          this.phanTramThueGTGTs.splice(indexTenPercent, 0, { value: '8', text: '8%' });
        }
      } else {
        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          let thueGTGT = this.hoaDonChiTiets[i].thueGTGT;

          if (thueGTGT === '3.5' || thueGTGT === '7') {
            thueGTGT = thueGTGT.toString().replace('.', ',');
            this.hoaDonChiTiets[i].thueGTGT = 'KHAC';
            this.hoaDonChiTiets[i].thueKhac = thueGTGT + '%';
            this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          }
        }
      }

      if (!this.isGiamTheoNghiQuyetSo432022QH15 && updateChiTiet) {
        this.hoaDonDienTuForm.get(`isGiamTheoNghiQuyet`).setValue(false);
        this.hoaDonDienTuForm.get(`tyLePhanTramDoanhThu`).setValue(0);

        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          this.hoaDonChiTiets[i].thueGTGT = this.hoaDonChiTiets[i].thueGTGT === '8' ? '10' : this.hoaDonChiTiets[i].thueGTGT;
          this.hoaDonChiTiets[i].isMatHangDuocGiam = false;
          this.hoaDonChiTiets[i].tyLePhanTramDoanhThu = 0;
          this.hoaDonChiTiets[i].tienGiam = 0;
          this.hoaDonChiTiets[i].tienGiamQuyDoi = 0;
          this.hoaDonChiTiets[i].thueGTGTDirty = true;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.THUE_GTGT, true, null, false);
        }

        this.tinhLaiTongTien();
      }

      this.LoadTruongDuLieuHoaDonTheoLoaiChietKhau(this.hoaDonDienTuForm.get('loaiChietKhau').value);

      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.getBoKyHieuByNgayHoaDon(updateLoaiThue, isAutoChange);
      }, this.doneTypingInterval);
    }
  }

  // get lại thuế gtgt gốc theo hàng hóa dịch vụ không theo NQ 43
  getThueGTGTKhongTheoNQ43(callback: (thueGTGTs: any[]) => any) {
    const getByIds = [];
    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      const item = this.hoaDonChiTiets[i];
      if (item.hangHoaDichVuId) {
        getByIds.push(this.hangHoaDichVuService.GetByIdAsync(item.hangHoaDichVuId))
      } else {
        getByIds.push(of(null));
      }
    }

    forkJoin(getByIds).subscribe((res: any[]) => {
      const result = [];
      if (this.loaiThueSuat === 1) { // 1 thuế suất
        let thueGTGT = null;
        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          const item = this.hoaDonChiTiets[i];

          if (item.tinhChat === 1 || item.tinhChat === 3) {
            if (res[i]) {
              thueGTGT = res[i].thueGTGT;
              break;
            }
          }
        }

        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          result.push(thueGTGT || '10');
        }
      } else {
        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          result.push(res[i] != null ? res[i].thueGTGT : '10');
        }
      }

      callback(result);
    });
  }

  editFormDetail(index: any) {
    if (this.fbBtnSaveDisable) {
      return;
    }

    this.hoaDonChiTiets[index].isEdit = true;
  }

  changeGiamTheoNghiQuyet(event: any, asDirty = false) {
    console.log('changeGiamTheoNghiQuyet', this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').dirty);

    if (!this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').dirty && !asDirty) {
      return;
    }

    this.phanTramThueGTGTs = getThueGTGTs();

    if (event) {
      const indexTenPercent = this.phanTramThueGTGTs.findIndex(x => x.value === '10');
      this.phanTramThueGTGTs.splice(indexTenPercent, 0, { value: '8', text: '8%' })
    } else {
      this.hoaDonDienTuForm.get('tyLePhanTramDoanhThu').setValue(0);
    }

    this.LoadTruongDuLieuHoaDonTheoLoaiChietKhau(this.hoaDonDienTuForm.get('loaiChietKhau').value);

    if (this.hoaDonDienTuForm.get('isGiamTheoNghiQuyet').dirty) {
      if (event) {
        if (this.loaiHD === 2) {
          for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
            this.changeMatHangDuocGiam(false, this.hoaDonChiTiets[i], false);
          }
        } else {
          if (this.loaiThueSuat === 1) { // loại 1 thuế suất thì set 8%
            for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
              this.hoaDonChiTiets[i].thueGTGT = '8';
              this.hoaDonChiTiets[i].thueGTGTDirty = true;
              this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
              this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.THUE_GTGT, true, null, false);
            }

            this.hoaDonDienTuForm.get('thueGTGT').setValue(this.hoaDonChiTiets[0].thueGTGT);
          }
        }
      } else {
        for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
          this.hoaDonChiTiets[i].thueGTGT = this.hoaDonChiTiets[i].thueGTGT === '8' ? '10' : this.hoaDonChiTiets[i].thueGTGT;
          this.hoaDonChiTiets[i].isMatHangDuocGiam = false;
          this.hoaDonChiTiets[i].tyLePhanTramDoanhThu = 0;
          this.hoaDonChiTiets[i].tienGiam = 0;
          this.hoaDonChiTiets[i].tienGiamQuyDoi = 0;
          this.hoaDonChiTiets[i].thueGTGTDirty = true;
          this.tinhToanHDDV.updateChiTiet(this.hoaDonChiTiets[i], i);
          this.tinhToanHDDV.blurTinhToan(i, this.blurPosition.THUE_GTGT, true, null, false);
        }

        if (this.loaiThueSuat === 1) {
          this.hoaDonDienTuForm.get('thueGTGT').setValue(this.hoaDonChiTiets[0].thueGTGT);
        }
      }

      this.tinhLaiTongTien();
    }
  }

  //hàm này để mở rộng/thu gọn thông tin chung
  moRongThuGonDuLieu() {
    this.isShow = !this.isShow;

    let getLeft = document.querySelector('.getLeft .field-content') as HTMLElement;
    let fieldsetRight = document.querySelector('.fieldsetRight .field-content') as HTMLElement;
    let heightSet = getLeft.offsetHeight;
    var tbodyantElement = document.querySelector('#table-detail .ant-table-body') as HTMLElement;
    var contentsaisot = document.querySelector('.content-saisot') as HTMLElement;
    if (this.isShow) {
      getLeft.style.display = 'none';
      fieldsetRight.style.display = 'none';
      tbodyantElement.style.maxHeight = (heightSet + 280) - (contentsaisot.offsetHeight + 40) + 'px';
    } else {
      getLeft.style.display = 'block';
      fieldsetRight.style.display = 'block';
      tbodyantElement.style.maxHeight = (280) - (contentsaisot.offsetHeight + 40) + 'px';
    }
  }
  onResize({ width }: NzResizeEvent, col: string): void {
    this.truongDuLieuHoaDonChiTiets = this.truongDuLieuHoaDonChiTiets.map(e => (e.tenCot === col ? { ...e, doRong: Math.floor(width) } : e));
  }

  changeMatHangDuocGiam(event: any, data: any, hasTinhTongTien = true) {
    if (event) {
      data.disabledTyLePhanTramDoanhThu = false;
      data.disabledTienGiam = false;
      data.disabledTienGiamQuyDoi = false;
    } else {
      data.tyLePhanTramDoanhThu = 0;
      data.tienGiam = 0;
      data.tienGiamQuyDoi = 0;

      data.disabledTyLePhanTramDoanhThu = true;
      data.disabledTienGiam = true;
      data.disabledTienGiamQuyDoi = true;
    }

    if (hasTinhTongTien) {
      this.tinhLaiTongTien();
    }
  }
  changeThueGTGTChung(event: any) {
    console.log(event);
    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      this.hoaDonChiTiets[i].thueGTGT = event;
      this.hoaDonChiTiets[i].thueGTGTDirty = true;
      console.log('Có tính lại không', this.isTinhLaiThue)
      if (this.isTinhLaiThue) {
        this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
      }
      if (event === 'KHAC') {
        this.hoaDonChiTiets[i].thueKhac = 0;
      }
    }

    this.tinhLaiTongTien();

    setTimeout(() => {
      this.isTinhLaiThue = true;
    }, 1000);
  }

  selectThueGTGTChung(event: any) {
    this.hoaDonDienTuForm.get('thueGTGT').setValue(event.value);
    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      this.hoaDonChiTiets[i].thueGTGT = event.value;
      this.hoaDonChiTiets[i].thueKhac = 0;
      this.hoaDonChiTiets[i].thueGTGTDirty = true;
      this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
    }
    this.tinhLaiTongTien();
  }

  blurThueGTGTChung() {
    const thueKhac = this.hoaDonDienTuForm.get('thueKhac').value;
    for (let i = 0; i < this.hoaDonChiTiets.length; i++) {
      this.hoaDonChiTiets[i].thueKhac = thueKhac;
      this.hoaDonChiTiets[i].thueGTGTDirty = true;
      this.tinhToanHDDV.blurTinhToan(i, BlurPosition.THUE_GTGT, true, null, false);
    }
    this.tinhLaiTongTien();
  }

  changeLoaiThue(event: any) {
    if (!this.hoaDonDienTuForm.get('loaiThue').dirty) {
      return;
    }

    var loaiChietKhau = this.hoaDonDienTuForm.get('loaiChietKhau').value;
    var boKyHieuHoaDonId = this.hoaDonDienTuForm.get('boKyHieuHoaDonId').value;
    const model = this.boKyHieuHoaDons.find(x => x.boKyHieuHoaDonId === boKyHieuHoaDonId);

    // từ nhiều thuế suất về 1 thuế suất thì bật thông báo
    if (this.data && this.data.loaiThue === 2 && event === 1) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 440,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Thay đổi mẫu hóa đơn`,
          msContent: `Bạn đã thay đổi sử dụng mẫu hóa đơn <b>Nhiều thuế suất</b> sang sử dụng mẫu hóa đơn <b>Một thuế suất</b>. Sau khi thay đổi, cột <b>% Thuế suất GTGT</b> sẽ tự động chọn mức thuế suất GTGT của hóa đơn theo thuế suất GTGT của dòng hàng hóa dịch vụ đầu tiên có tính chất là <b>Hàng hóa, dịch vụ.</b> Các cột <b>Tiền thuế GTGT, Tiền chiết khấu, Thành tiền</b>,... sẽ không thay đổi. Người dùng cần kiểm tra lại và cập nhật lại số liệu (nếu muốn).
          <br><br>Bạn có chắc chắn thay đổi không?`,
          msMessageType: MessageType.Confirm,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnOk: () => {
            // từ 1 thuế sang nhiều thuế thì clear data về CK
            if (!this.fbBtnSaveDisable && loaiChietKhau === 2 && this.loaiThueSuat === 1 && event === 2) {
              this.hoaDonDienTuForm.get('loaiChietKhau').setValue(1);
              this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(0);
              this.blurTyLeChietKhauTong(false);
            }

            const mauHoaDon = model.mauHoaDons.find(x => x.loaiThueGTGT === event);
            this.hoaDonDienTuForm.get('mauHoaDonId').setValue(mauHoaDon.mauHoaDonId)
            this.loaiThueSuat = event;
            this.tenLoaiHoaDonFull = mauHoaDon.tenLoaiHoaDonFull;
            this.detectChangeLoaiThueSuat(false);
          },
          msOnClose: () => {
            this.hoaDonDienTuForm.get('loaiThue').markAsPristine();
            this.hoaDonDienTuForm.get('loaiThue').setValue(2);
          }
        },
      });
    } else {
      // từ 1 thuế sang nhiều thuế thì clear data về CK
      if (!this.fbBtnSaveDisable && loaiChietKhau === 2 && this.loaiThueSuat === 1 && event === 2) {
        this.hoaDonDienTuForm.get('loaiChietKhau').setValue(1);
        this.hoaDonDienTuForm.get('tyLeChietKhau').setValue(0);
        this.blurTyLeChietKhauTong(false);
      }

      const mauHoaDon = model.mauHoaDons.find(x => x.loaiThueGTGT === event);
      this.hoaDonDienTuForm.get('mauHoaDonId').setValue(mauHoaDon.mauHoaDonId)
      this.loaiThueSuat = event;
      this.tenLoaiHoaDonFull = mauHoaDon.tenLoaiHoaDonFull;
      this.detectChangeLoaiThueSuat();
    }
  }
}

