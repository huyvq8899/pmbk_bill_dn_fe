import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import * as moment from 'moment';
import { LyDoDieuChinh } from 'src/app/models/LyDoThayTheModel';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { FilterColumn, FilterCondition, HoaDonDieuChinhParams } from 'src/app/models/PagingParams';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { GetKy, GetKyMacDinh, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig, GlobalConstants } from 'src/app/shared/global';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { DownloadFile, getHeightBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3, getTenLoaiHoaDon, getTimKiemTheo, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { AddEditBienBanDieuChinhModalComponent } from '../../modals/add-edit-bien-ban-dieu-chinh-modal/add-edit-bien-ban-dieu-chinh-modal.component';
import { HoaDonDienTuModalComponent } from '../../modals/hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { LapBienBanHoaDonDieuChinhModalComponent } from '../../modals/lap-bien-ban-hoa-don-dieu-chinh-modal/lap-bien-ban-hoa-don-dieu-chinh-modal.component';
import { TabHoaDonDienTuComponent } from '../tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { GuiBienBanXoaBoModalComponent } from '../../modals/gui-bien-ban-xoa-bo-modal/gui-bien-ban-xoa-bo-modal.component';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { DinhKemHoaDonModalComponent } from '../../modals/dinh-kem-hoa-don-modal/dinh-kem-hoa-don-modal.component';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { GuiHoaDonModalComponent } from '../../modals/gui-hoa-don-modal/gui-hoa-don-modal.component';
import { XemLoiHoaDonModalComponent } from '../../modals/xem-loi-hoa-don-modal/xem-loi-hoa-don-modal.component';
import { TabThongDiepGuiComponent } from 'src/app/views/quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { TrangThaiSuDung2 } from 'src/app/enums/TrangThaiSuDung.enum';
import { UserService } from 'src/app/services/user.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { CookieConstant } from 'src/app/constants/constant';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { EnvService } from 'src/app/env.service';

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
  selector: 'app-tab-hoa-don-dieu-chinh',
  templateUrl: './tab-hoa-don-dieu-chinh.component.html',
  styleUrls: ['./tab-hoa-don-dieu-chinh.component.scss']
})
export class TabHoaDonDieuChinhComponent extends TabShortKeyEventHandler implements OnInit, OnDestroy {
  listData = [];
  loaiTrangThaiHoaDonDieuChinhs = [];
  loaiTrangThaiPhatHanhs = [];
  loaiTrangThaiBienBanDieuChinhHoaDons = [];
  timKiemTheos = getTimKiemTheo();
  searchOverlayStyle = {
    width: '400px'
  };
  loading = false;
  total = 0;
  pageSizeOptions = [];
  params: HoaDonDieuChinhParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    Filter: {},
    LoaiTrangThaiHoaDonDieuChinh: -1,
    LoaiTrangThaiPhatHanh: -1,
    LoaiTrangThaiBienBanDieuChinhHoaDon: -1,
    TrangThaiGuiHoaDon: -1,
    TimKiemTheo: null,
    GiaTri: null,
    filterColumns: [],
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
  listDSRutGonBoKyHieuHoaDon: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  kys: any[] = GetList();
  widthConfig = ['350px', '280px', '180px', '110px', '200px', '200px', '80px', '120px', '130px', '300px', '230px', '100px', '380px'];
  scrollConfig = { x: '', y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  subscription: Subscription;
  ///////////////////////////////////
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  ddtp = new DinhDangThapPhan();
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  textButtonMoRongThuGon = 'Thu gọn';
  tongTienThanhToan = 0;
  mauHoaDonDuocPQ: any[];
  trangThaiGuiHoaDons: any[] = [];
  disabledGuiCQT = false;
  isShowGuiCQT = false;
  isChuyenDayDuNoiDungTungHoaDon = false;
  isPhieuXuatKho = false;
  thaoTacHoaDonSaiSot: any[] = [];
  txtHD_PXK = 'hóa đơn';
  txtHD_PXK_UPPER = 'Hóa đơn';
  userPermissions: any;
  hoSoHDDT: any;
  serials: any[] = [];
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = false;
  isPos = false;
  checkPermission = true;
  userNamePermission = '';
  isTaxCodeNotAddMtt: boolean = false;
  taxcodeLogin = localStorage.getItem(CookieConstant.TAXCODE);
  boolChoPhepLapHDDTMTT = false;
  constructor(
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private bienBanDieuChinhService: BienBanDieuChinhService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private nzContextMenuService: NzContextMenuService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private uploadFileService: UploadFileService,
    private sharedService: SharedService,
    private userService: UserService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private activatedRoute: ActivatedRoute,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private tuyChonService: TuyChonService,
    private env: EnvService,
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
    else if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
      this.isTaxCodeNotAddMtt = this.env.taxCodeNotAddMtt.includes(this.taxcodeLogin);
    }

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    this.params.Ky = GetKyMacDinh();
    if (phanQuyen == 'true') {
      this.permission = true;
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.mauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
        this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
        this.scrollConfig.x = SumwidthConfig(this.widthConfig);

        this.changeKy(this.params.Ky);
        this.displayDataTemp = Object.assign({}, this.params)
        this.displayDataRaw = Object.assign({}, this.params)

        this.subscription = this.sharedService.changeEmitted$
          .subscribe((res: any) => {
            if (res && res.type === 'loadData' && res.value) {
              this.LoadData();
            }
          });

        this.forkJoin().subscribe((res: any[]) => {
          if (this.isPhieuXuatKho) {
            res[0].forEach((item: any) => {
              item.name = item.name.replace("Hóa đơn", 'PXK');
            });
          }
          this.loaiTrangThaiHoaDonDieuChinhs = res[0];
          this.loaiTrangThaiPhatHanhs = res[1];
          this.loaiTrangThaiBienBanDieuChinhHoaDons = res[2];
          // this.timKiemTheos = res[3];
          this.listDSRutGonBoKyHieuHoaDon = res[4];
          this.trangThaiGuiHoaDons = res[5];
          this.hoSoHDDT = res[8];
          this.serials = res[9];
          this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = res[10].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail") ? res[10].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail").giaTri == "true" : false;
          this.boolChoPhepLapHDDTMTT = res[10].find(x => x.ma == "BoolChoPhepLapHDDTMTT") ? res[10].find(x => x.ma == "BoolChoPhepLapHDDTMTT").giaTri == "true" : false;

          this.displayGuiCQT(res);
        });

        this.loadViewConditionList();
      });

      //khi click ở bảng điều khiển
      this.activatedRoute.queryParams.subscribe(params => {
        const tabIndex = params['hddc'];
        console.log(tabIndex);
        if (tabIndex) {
          this.clickLapHoaDon();
        }
      })
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = this.isPhieuXuatKho ? pq.functions.find(x => x.functionName == "PhieuXuatKho").thaoTacs : pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
      this.thaoTacHoaDonSaiSot = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == 'ThongDiepGui').thaoTacs : [];
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
      this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
      if (this.thaoTacs && ((!this.isPhieuXuatKho && this.thaoTacs.indexOf('HD_ADJUST') < 0) || (this.isPhieuXuatKho && this.thaoTacs.indexOf('PXK_ADJUST') < 0))) {
        this.checkPermission = false;
        this.userService.getAdminUser().subscribe((users: any[]) => {
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
      this.scrollConfig.x = SumwidthConfig(this.widthConfig);

      this.changeKy(this.params.Ky);
      this.displayDataTemp = Object.assign({}, this.params)
      this.displayDataRaw = Object.assign({}, this.params)

      this.subscription = this.sharedService.changeEmitted$
        .subscribe((res: any) => {
          if (res && res.type === 'loadData' && res.value) {
            this.LoadData();
          }
        });

      this.forkJoin().subscribe((res: any[]) => {
        if (this.isPhieuXuatKho) {
          res[0].forEach((item: any) => {
            item.name = item.name.replace("Hóa đơn", 'PXK');
          });
        }
        this.loaiTrangThaiHoaDonDieuChinhs = res[0];
        this.loaiTrangThaiPhatHanhs = res[1];
        this.loaiTrangThaiBienBanDieuChinhHoaDons = res[2];
        // this.timKiemTheos = res[3];
        this.listDSRutGonBoKyHieuHoaDon = res[4];
        this.trangThaiGuiHoaDons = res[5];
        this.hoSoHDDT = res[8];
        this.serials = res[9];
        this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = res[10].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail") ? res[10].find(x => x.ma == "BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail").giaTri == "true" : false;
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

  GetTrangThaiGuiHoaDons() {
    this.hoaDonDienTuService.GetTrangThaiGuiHoaDon().subscribe((rs: any[]) => {
      this.trangThaiGuiHoaDons = rs;
      this.displayDataTemp.TrangThaiGuiHoaDon = -1;
    })
  }


  public get trangThaiQuyTrinh(): typeof TrangThaiQuyTrinh {
    return TrangThaiQuyTrinh;
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  forkJoin() {
    return forkJoin([
      this.hoaDonDienTuService.GetTrangThaiHoaDonDieuChinhs(), // 0
      this.hoaDonDienTuService.GetLoaiTrangThaiPhatHanhs(), // 1
      this.hoaDonDienTuService.GetLoaiTrangThaiBienBanDieuChinhHoaDons(), // 2
      this.hoaDonDienTuService.GetListTimKiemTheoHoaDonThayThe(), // 3
      this.hoaDonDienTuService.GetDSRutGonBoKyHieuHoaDon(), // 4
      this.hoaDonDienTuService.GetTrangThaiGuiHoaDon(), // 5
      this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat(), // get thông tin tờ khai mới nhất
      this.quanLyThongTinHoaDonService.GetByLoaiThongTinChiTiet(2), // không mã
      this.hoSoHDDTService.GetDetail(),
      this.quyDinhKyThuatService.GetAllListCTS(),
      this.tuyChonService.GetAll()
    ]);
  }

  displayGuiCQT(res: any[]) {
    // Tại tab Thông tin ${txtHD_PXK}, bảng thông tin hình thức ${txtHD_PXK} mà cột Trạng thái sử dụng của dòng Không có mã của cơ quan thuế có giá trị là <Đang sử dụng> và <Ngừng sử dụng>
    // Và tại tờ khai mẫu 01 đang được chấp nhận thì tại mục Phương thức chuyển dữ liệu ${txtHD_PXK} điện tử có tích chọn <Chuyển đầy đủ nội dung từng ${txtHD_PXK}>
    if ((res[6] && res[6].hinhThucHoaDon === 0 && res[6].isChuyenDayDuNoiDungTungHoaDon) && (res[7] && (res[7].trangThaiSuDung === TrangThaiSuDung2.DangSuDung || res[7].trangThaiSuDung === TrangThaiSuDung2.NgungSuDung))) {
      this.isChuyenDayDuNoiDungTungHoaDon = true;
      this.isShowGuiCQT = true;
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedRow(data);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listData);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
  }

  LoadData(reset = false) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.tongTienThanhToan = 0;
    this.params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    this.params.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;
    this.hoaDonDienTuService.GetAllPagingHoaDonDieuChinh(this.params).subscribe((data: any) => {
      this.listData = data.items;
      this.listOfDisplayData = data.items;
      this.total = data.totalCount;
      this.params.PageNumber = data.currentPage;

      this.listData.forEach(x => {
        if (x.kyHieu) {
          let boKyHieuHD = this.listDSRutGonBoKyHieuHoaDon.find(y => y.kyHieu == (x.kyHieu));
          if (boKyHieuHD != null && boKyHieuHD != undefined) {
            if (boKyHieuHD.uyNhiemLapHoaDon == 0) {
              x.tenUyNhiemLapHoaDon = 'Không đăng ký';
              x.uyNhiemLapHoaDon = 0;
            }
            if (boKyHieuHD.uyNhiemLapHoaDon == 1) {
              x.tenUyNhiemLapHoaDon = 'Đăng ký';
              x.uyNhiemLapHoaDon = 1;
            }
          }
        }

        if (x.children && x.children.length > 0) {
          x.children.forEach(x => {
            this.tongTienThanhToan += x.tongTienThanhToan;
            if (x.lyDoDieuChinh && x.lyDoDieuChinh != '') {
              var obj = JSON.parse(x.lyDoDieuChinh);
              x.lyDo = obj.lyDo;
              x.loaiApDungHoaDon = obj.hinhThucHoaDonBiDieuChinh;
            };

            if (x.kyHieu) {
              let boKyHieuHD = this.listDSRutGonBoKyHieuHoaDon.find(y => y.kyHieu.toLowerCase() == (x.kyHieu).toLowerCase());
              if (boKyHieuHD != null && boKyHieuHD != undefined) {
                if (boKyHieuHD.uyNhiemLapHoaDon == 0) {
                  x.tenUyNhiemLapHoaDon = 'Không đăng ký';
                  x.uyNhiemLapHoaDon = 0;
                }
                if (boKyHieuHD.uyNhiemLapHoaDon == 1) {
                  x.tenUyNhiemLapHoaDon = 'Đăng ký';
                  x.uyNhiemLapHoaDon = 1;
                }
              }
            }
          });
        }
      });

      this.listData.forEach(x => {
        x.tongTien = x.tongTienThanhToan;
        if (x.children && x.children.length > 0) {
          x.children.forEach(element => {
            if (element.hoaDonDienTuId) {
              if (element.boKyHieuHoaDon.hinhThucHoaDon == 0) {
                if (element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.DaKyDienTu || element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.GuiTCTNLoi || element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.ChoPhanHoi || element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.GuiLoi || element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.GuiKhongLoi)
                  x.tongTien += element.tongTienThanhToan;
              }
              else {
                if (element.trangThaiQuyTrinh == this.trangThaiQuyTrinh.CQTDaCapMa) {
                  x.tongTien += element.tongTienThanhToan;
                }
              }
            }
          });
        }
        this.tongTienThanhToan += x.tongTienThanhToan;
        this.mapOfExpandedData[x.key] = this.convertTreeToList(x);

      })
      console.log(this.mapOfExpandedData)
      this.loading = false;

      // delete all
      if (this.listData.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      this.numberBangKeCols = Array(this.widthConfig.length).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listData);
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
      if (this.listData && this.listData.length > 0) {
        this.selectedRow(this.listData[0]);
      }

      //nếu có đăng ký sự kiện tải lại thống kê số lượng ${txtHD_PXK} sai sót
      if (GlobalConstants.CallBack != null) {
        GlobalConstants.CallBack();
      }
    });
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
    stack.push({ ...root, level: 0, expand: this.textButtonMoRongThuGon == 'Thu gọn', parent: null });

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

  moRongThuGonCayDuLieu() {
    if (this.textButtonMoRongThuGon == 'Thu gọn') {
      this.textButtonMoRongThuGon = 'Mở rộng';
    }
    else {
      this.textButtonMoRongThuGon = 'Thu gọn';
    }
    this.filterGeneral();
  }

  clickThem() {
    ///////////////////
  }

  clickSua(isCopy = false, isView = false) {
    //////////////
  }

  deleteCheckedItem(id: any) {
    this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== id);
    delete this.mapOfCheckedId[id];
  }

  clickXoa() {
    ////////////////
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

  // selectedRow(data: any) {
  //   this.dataSelected = data;

  //   if (this.listOfSelected.length === 0) {
  //     this.dataSelected = data;
  //     data.selected = true;
  //     this.listData.forEach(element => {
  //       if (element !== data) {
  //         element.selected = false;
  //       }
  //     });
  //   }
  // }

  selectedRow(data: any, autoSet = true) {
    this.dataSelected = data;

    if (this.listOfSelected.length === 0) {
      if (data && autoSet) {
        this.dataSelected = data;
        data.selected = true;
      } else {
        this.dataSelected = null;
      }

      // nếu là có mã hoặc chuyển bảng tổng hợp thì disable
      if (this.dataSelected.boKyHieuHoaDon && (this.dataSelected.boKyHieuHoaDon.hinhThucHoaDon === 1 || this.dataSelected.boKyHieuHoaDon.phuongThucChuyenDL === 1)) {
        this.disabledGuiCQT = true;
      } else {
        this.disabledGuiCQT = false;
      }

      let entries = Object.entries(this.mapOfExpandedData);
      for (const [prop, val] of entries) {
        const list = val as TreeNodeInterface[];
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

  openDinhKem(item: any) {
    const modal = this.modalService.create({
      nzTitle: Message.ATTACH_ESC,
      nzContent: DinhKemHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '30%',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        hoaDonDienTuId: item.hoaDonDienTuId || item.bienBanDieuChinhIdTmp,
        loaiNghiepVu: item.hoaDonDienTuId ? RefType.HoaDonDienTu : RefType.BienBanDieuChinh
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any) => {
      this.LoadData(true);
    })
  }

  doubleClick(data: any) {
    if (data.daDieuChinh == true || (data.daDieuChinh == false && data.bienBanDieuChinhId && data.children)) {
      if (data.loaiApDungHoaDonDieuChinh == 1 && data.lapTuPMGP == true)
        this.tabHoaDonDienTuComponent.viewReceipt(data);
    }
    else {
      this.loading = true;
      if (data.bienBanDieuChinhIdTmp != '') {
        console.log('truong hop co bien ban dieu chinh')
        this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhIdTmp).subscribe((bb: any) => {
          this.hoaDonDienTuService.GetById(data.dieuChinhChoHoaDonId).subscribe((hdbdc: any) => {
            this.thongTinHoaDonService.GetById(data.dieuChinhChoHoaDonId).subscribe((ttbdc: any) => {
              this.loading = false;
              var bdc = hdbdc != null ? hdbdc : ttbdc;
              if (this.ActivedModal) return;
              this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
                const modal1 = this.ActivedModal = this.modalService.create({
                  nzTitle: `Biên bản điều chỉnh ${this.txtHD_PXK}`,
                  nzContent: AddEditBienBanDieuChinhModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '100%',
                  nzStyle: { top: '0px' },
                  nzBodyStyle: { padding: '1px', height: '96%' },
                  nzComponentParams: {
                    isAddNew: false,
                    fbEnableEdit: false,
                    data: bb,
                    hoaDonBiDieuChinh: bdc,
                    hoaDonDieuChinhId: data.hoaDonDienTuId,
                    hoaDonLienQuan: hdlq,
                    isFromGP: hdbdc != null && hdbdc != undefined
                  },
                  nzFooter: null
                });
                modal1.afterClose.subscribe((rs: any) => {
                  this.ActivedModal = null;
                  this.LoadData();
                });
              });
            });
          })
        });
      }
      else {
        if (this.permission != true && ((!this.isPhieuXuatKho && this.thaoTacs.indexOf('HD_FULL') < 0 && this.thaoTacs.indexOf('HD_ADJUST') < 0) || (this.isPhieuXuatKho && this.thaoTacs.indexOf('PXK_FULL') < 0 && this.thaoTacs.indexOf('PXK_ADJUST') < 0))) return;
        this.hoaDonDienTuService.GetById(data.dieuChinhChoHoaDonId).subscribe((hdbdc: any) => {
          this.thongTinHoaDonService.GetById(data.dieuChinhChoHoaDonId).subscribe((ttbdc: any) => {
            this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
              this.loading = false;
              var bdc = hdbdc != null ? hdbdc : ttbdc;
              const modal1 = this.ActivedModal = this.modalService.create({
                nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
                nzContent: AddEditBienBanDieuChinhModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: '100%',
                nzStyle: { top: '0px' },
                nzBodyStyle: { padding: '1px', height: '96%' },
                nzComponentParams: {
                  isAddNew: true,
                  hoaDonBiDieuChinh: bdc,
                  hoaDonDieuChinhId: data.hoaDonDienTuId,
                  data: data,
                  hoaDonLienQuan: hdlq,
                  isFromGP: hdbdc != null && hdbdc != undefined
                },
                nzFooter: null
              });
              modal1.afterClose.subscribe((rs: any) => {
                this.ActivedModal = null;
                this.LoadData();
              });
            })
          })
        });
      }
    }
  }

  selectForm(isCopy = false, isView = false, data: any) {
    // call modal
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        if (res) {
          if ((res.kyHieu.indexOf('C') >= 0 && res.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaKyDienTu && res.trangThaiQuyTrinh != TrangThaiQuyTrinh.DangKyDienTu) ||
            ((res.kyHieu.indexOf('K') >= 0 && res.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaKyDienTu && res.trangThaiQuyTrinh != TrangThaiQuyTrinh.DangKyDienTu))) {
            this.tabHoaDonDienTuComponent.viewReceipt(data);
          }
          else {
            const title = res.tenLoaiHoaDon;
            const modal1 = this.ActivedModal = this.modalService.create({
              nzTitle: title,
              nzContent: HoaDonDienTuModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: window.innerWidth / 100 * 90,
              nzStyle: { top: '100px' },
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
              this.LoadData();
            });
          }
        }
      });
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.params.PageNumber = 1;
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
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.LoadData();
  }

  clickXem() {

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
      this.LoadData();
    }
  }

  changeKy(event: any) {
    SetDate(event, this.params);
    if (this.displayDataTemp) {
      this.displayDataTemp.fromDate = this.params.fromDate;
      this.displayDataTemp.toDate = this.params.toDate;
    }
  }

  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }

  filterTable() {
    if (this.displayDataTemp.toDate < this.displayDataTemp.fromDate) {
      this.message.warning('Đến ngày phải lớn hơn hoặc bằng từ ngày');
      return;
    }

    this.getData();
  }

  getData() {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
    var giaTris = (this.params.GiaTri != "" && this.params.GiaTri != null) ? this.params.GiaTri.split(",") : [];
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

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  clickLapBienBan() {
    this.tabHoaDonDienTuComponent.lapBBDCallback(() => {
      this.LoadData();
    });

  }

  async clickLapHoaDon() {
    this.tabHoaDonDienTuComponent.lapHoaDonDieuChinhCallback(() => {
      this.LoadData();
    });
  }

  clickThemMoiBienBan(data: any) {
    //console.log(data);
    // if ((data.bienBanDieuChinhId  && data.bienBanDieuChinhId != "")) {
    //   return;
    // }

    const rs = this.getHoaDonBiThayThe(data);
    this.loading = true;

    if (data.dieuChinhChoHoaDonId) {
      console.log('hoa don da dieu chinh');
      this.hoaDonDienTuService.GetById(data.dieuChinhChoHoaDonId).subscribe((rs: any) => {
        this.thongTinHoaDonService.GetById(data.dieuChinhChoHoaDonId).subscribe((tt: any) => {
          this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
            this.loading = false;
            let hdbdc = rs ? rs : tt;
            const modal = this.ActivedModal = this.modalService.create({
              nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
              nzContent: AddEditBienBanDieuChinhModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '100%',
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px', height: '96%' },
              nzComponentParams: {
                isAddNew: true,
                hoaDonBiDieuChinh: hdbdc,
                data: data,
                hoaDonDieuChinhId: data.hoaDonDienTuId,
                hoaDonLienQuan: hdlq,
                isFromGP: rs != null && rs != undefined
              },
              nzFooter: null
            });
            modal.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
              if (rs) {
                this.LoadData();
              }
            });

          });
        });
      })
    }
    else {
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((rs: any) => {
        this.thongTinHoaDonService.GetById(data.hoaDonDienTuId).subscribe((tt: any) => {
          this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.hoaDonDienTuId, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
            var chuaBiDieuChinh = hdlq.filter(x => x.trangThaiBienBanDieuChinh == 0)[0];
            let hdbdc = rs ? rs : tt;
            this.hoaDonDienTuService.GetAllListHoaDonLienQuan(hdbdc.hoaDonDienTuId, moment().format('YYYY-MM-DD hh:mm:ss')).subscribe((hdlq: any[]) => {
              this.loading = false;
              if (!hdlq || hdlq.length == 0) {
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '55%',
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    msTitle: `Chọn hình thức điều chỉnh ${this.txtHD_PXK} sai sót`,
                    msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
                    <span class="clsspan">“Trường hợp ${this.txtHD_PXK} điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện ${this.txtHD_PXK} tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
                    Theo đó, khi đã chọn hình thức điều chỉnh cho ${this.txtHD_PXK} (${this.txtHD_PXK} gốc) có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> thì:<br>
                    &nbsp;- Không được tiếp tục xử lý theo hình thức thay thế<br>
                    &nbsp;- Tiếp tục được lập ${this.txtHD_PXK} điều chỉnh nếu phát hiện còn sai sót.<br>
                    &nbsp;- Khi ${this.txtHD_PXK} điều chỉnh đã lập có sai sót thì: <br>
                    &nbsp;&nbsp;+ Không được phép: hủy hoá đơn điều chỉnh; xóa bỏ ${this.txtHD_PXK} điều chỉnh để lập ${this.txtHD_PXK} thay thế để thay thế ${this.txtHD_PXK} điều chỉnh; lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} điều chỉnh; <br>
                    &nbsp;&nbsp;+ Được phép: lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} gốc có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> (đã chuyển trạng thái ${this.txtHD_PXK} thành ${this.txtHD_PXK_UPPER} gốc bị điều chỉnh) những sai sót phát hiện tại ${this.txtHD_PXK} điều chỉnh đã ảnh hưởng đến ${this.txtHD_PXK} gốc<br>
                    <br>
                    <strong class="cssbrown">Khuyến nghị người bán xử lý ${this.txtHD_PXK} đã lập có sai sót theo hình thức thay thế.</strong><br>
                    Chọn <strong class='cssblue'>Đồng ý</strong> nếu bạn vẫn muốn thực hiện xử lý sai sót theo hình thức điều chỉnh, chọn <strong class="cssred">Không</strong> trở lại giao diện lúc đầu.
                    `,
                    msMessageType: MessageType.Confirm,
                    msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                    msOkButtonInBlueColor: true,
                    msOnOk: () => {
                      const modal = this.ActivedModal = this.modalService.create({
                        nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
                        nzContent: AddEditBienBanDieuChinhModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: '100%',
                        nzStyle: { top: '0px' },
                        nzBodyStyle: { padding: '1px', height: '96%' },
                        nzComponentParams: {
                          isAddNew: true,
                          hoaDonBiDieuChinh: hdbdc,
                          hoaDonDieuChinhId: chuaBiDieuChinh ? chuaBiDieuChinh.hoaDonDienTuId : null,
                          hoaDonLienQuan: hdlq,
                          isFromGP: rs != null && rs != undefined
                        },
                        nzFooter: null
                      });
                      modal.afterClose.subscribe((rs: any) => {
                        this.ActivedModal = null;
                        this.LoadData(true);
                      });
                    },
                    msOnClose: () => {
                    }
                  }
                });

              }
              else {
                var hddc = `Tồn tại ${this.txtHD_PXK} điều chỉnh có`;
                var hdlqs = '';
                var isGui = false;
                var pos = 0;
                for (var i = 0; i < hdlq.length; i++) {
                  if (hdlq[i].trangThaiGuiHoaDon == TrangThaiGuiHoaDon.ChuaGui && (hdlq[i].boKyHieuHoaDon.hinhThucHoaDon != 2 || this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == true)) {
                    isGui = true;
                    hdlqs += ` ký hiệu <span class="cssyellow">${hdlq[i].mauSo}${hdlq[i].kyHieu}</span> số ${this.txtHD_PXK} <span class="cssyellow">${!hdlq[i].soHoaDon ? "&ltChưa cấp số&gt;" : hdlq[i].soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(hdlq[i].ngayHoaDon).format('DD/MM/YYYY')}</span>`
                    pos = i;
                    break;
                  }
                }

                hddc += hdlqs + ` liên quan đến ${this.txtHD_PXK} bị điều chỉnh Chưa gửi cho khách hàng. Vui lòng kiểm tra lại!`
                if (hdlqs != '' && isGui == true) {
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: 600,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msTitle: "Kiểm tra lại",
                      msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến ${this.txtHD_PXK} bị điều chỉnh thì tất cả các ${this.txtHD_PXK} điều chỉnh liên quan đến ${this.txtHD_PXK} bị điều chỉnh cần thực hiện Gửi ${this.txtHD_PXK} cho khách hàng trước khi tiếp tục điều chỉnh ${this.txtHD_PXK} bị điều chỉnh.
                      <br>
                      <br>
                      ${hddc}
                      `,
                      msMessageType: MessageType.Warning,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msHasGuiHoaDon: true,
                      msButtonLabelGuiHoaDon: `Gửi ${this.txtHD_PXK} cho khách hàng tại đây`,
                      msOnGuiHoaDon: () => {
                        this.hoaDonDienTuService.GetById(hdlq[pos].hoaDonDienTuId)
                          .subscribe((res: any) => {
                            if (res) {
                              var title = res.boKyHieuHoaDon.hinhThucHoaDon == 1 ? `Gửi ${this.txtHD_PXK} có mã của cơ quan thuế đến khách hàng` : `Gửi ${this.txtHD_PXK} không có mã của cơ quan thuế đến khách hàng`
                              const modal1 = this.modalService.create({
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
                                  loaiEmail: LoaiEmail.ThongBaoPhatHanhHoaDon,
                                  hanhDong: title
                                },
                                nzFooter: null
                              });
                              modal1.afterClose.subscribe((rs: any) => {
                                if (rs != null) {
                                  if (rs) {
                                    // this.GetTreeTrangThai();
                                    // this.GetTreeTrangThaiLuyKe();
                                    // this.modalService.create({
                                    //   nzContent: MessageBoxModalComponent,
                                    //   nzMaskClosable: false,
                                    //   nzClosable: false,
                                    //   nzKeyboard: false,
                                    //   nzWidth: 400,
                                    //   nzStyle: { top: '100px' },
                                    //   nzBodyStyle: { padding: '1px' },
                                    //   nzComponentParams: {
                                    //     msTitle: "Gửi ${txtHD_PXK} đến khách hàng",
                                    //     msContent: `Đã hoàn thành việc gửi ${txtHD_PXK} đến khách hàng`,
                                    //     msMessageType: MessageType.Info,
                                    //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                                    //     msOnClose: () => { }
                                    //   }
                                    // })
                                    this.message.success(`Gửi ${this.txtHD_PXK} thành công`);
                                  }
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
                                  msTitle: `Kiểm tra lại`,
                                  msContent: `Gửi ${this.txtHD_PXK} không thành công. Vui lòng kiểm tra lại!`,
                                  msMessageType: MessageType.Warning,
                                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                                  msOnClose: () => { }
                                }
                              })
                            }
                          });
                      },
                      msOnClose: () => {
                      }
                    }
                  });
                  return;
                }

                this.hoaDonDienTuService.GetById(hdbdc.hoaDonDienTuId).subscribe((hd: any) => {
                  if (hd && hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                    this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdbdc.hoaDonDienTuId).subscribe((rs: any) => {
                      if (!rs.isDaGuiThongBao || !rs.isDaLapThongBao) {
                        if (!rs.isDaLapThongBao) {
                          //nếu chưa lập thông báo
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                          var cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> nhưng chưa lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK}. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: `Lập và gửi thông báo ${this.txtHD_PXK} điện tử có sai sót tại đây`,
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
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                  let modal = this.modalService.create({
                                    nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                                    nzMaskClosable: false,
                                    nzClosable: false,
                                    nzKeyboard: false,
                                    nzWidth: '100%',
                                    nzStyle: { top: '0px' },
                                    nzBodyStyle: { padding: '1px' },
                                    nzComponentParams: {
                                      loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                                      lapTuHoaDonDienTuId: hdbdc.hoaDonDienTuId,
                                      isTraVeThongDiepChung: true
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
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
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');

                          var cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(ngayHoaDon).format("DD/MM/YYYY")}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> đã thực hiện lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK}. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: `Gửi thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT tại đây`,
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
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                      isTraVeThongDiepChung: true,
                                      thongDiepGuiCQTId: hdbdc.thongDiepGuiCQTId
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
                                      window.location.href = "quan-ly/thong-diep-gui";
                                    }
                                  });
                                }
                              }
                            },
                            nzFooter: null
                          });
                        }
                      }
                      else {
                        this.hoaDonDienTuService.GetById(hdlq[0].hoaDonDienTuId).subscribe((hd: any) => {
                          if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {

                            this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdlq[0].hoaDonDienTuId).subscribe((res: any) => {
                              if (!res.isDaGuiThongBao || !res.isDaLapThongBao) {
                                if (!res.isDaLapThongBao) {
                                  //nếu chưa lập thông báo
                                  let mauHoaDon = hdbdc.mauSo;
                                  let kyHieuHoaDon = hdbdc.kyHieu;
                                  let soHoaDon = hdbdc.soHoaDon;
                                  let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                                  let mauHoaDonLQ = hdlq[0].mauSo;
                                  let kyHieuHoaDonLQ = hdlq[0].kyHieu;
                                  let soHoaDonLQ = hdlq[0].soHoaDon;
                                  let ngayHoaDonLQ = moment(hdlq[0].ngayHoaDon).format('DD/MM/YYYY');
                                  var cauThongBao = '';
                                  if (!hdbdc.daBiDieuChinh) {
                                    cauThongBao = `
                                    ${this.txtHD_PXK_UPPER} bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. ${this.txtHD_PXK_UPPER} điều chỉnh này có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> nhưng chưa lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK} cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                    `;

                                    this.modalService.create({
                                      nzContent: MessageBoxModalComponent,
                                      nzMaskClosable: false,
                                      nzClosable: false,
                                      nzKeyboard: false,
                                      nzStyle: { top: '100px' },
                                      nzBodyStyle: { padding: '1px' },
                                      nzComponentParams: {
                                        msHasThongBaoSaiSot: true,
                                        msButtonLabelThongBaoSaiSot: `Lập và gửi thông báo ${this.txtHD_PXK} điện tử có sai sót tại đây`,
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
                                                Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                              }
                                              else {
                                                content = `
                                                Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                            let modal = this.modalService.create({
                                              nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                                              nzContent: ThongBaoHoaDonSaiSotModalComponent,
                                              nzMaskClosable: false,
                                              nzClosable: false,
                                              nzKeyboard: false,
                                              nzWidth: '100%',
                                              nzStyle: { top: '0px' },
                                              nzBodyStyle: { padding: '1px' },
                                              nzComponentParams: {
                                                loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                                                lapTuHoaDonDienTuId: hdlq[0].hoaDonDienTuId,
                                                isTraVeThongDiepChung: true
                                              },
                                              nzFooter: null
                                            });
                                            modal.afterClose.subscribe((rs: any) => {
                                              if (rs) {
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
                                  // else{
                                  //   cauThongBao = `
                                  //   ${txtHD_PXK_UPPER} có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> có sai sót được xử lý theo hình thức Lập ${txtHD_PXK} điều chỉnh nhưng chưa lập Thông báo ${txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT) cho lần điều chỉnh gần nhất bởi ${txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. Bạn cần lập và gửi Thông báo ${txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${txtHD_PXK} cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                  //   `;
                                  // }

                                }
                                if (res.isDaLapThongBao && !res.isDaGuiThongBao) {
                                  //nếu đã lập thông báo nhưng chưa gửi CQT
                                  let mauHoaDon = hdbdc.mauSo;
                                  let kyHieuHoaDon = hdbdc.kyHieu;
                                  let soHoaDon = hdbdc.soHoaDon;
                                  let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                                  let mauHoaDonLQ = hdlq[0].mauSo;
                                  let kyHieuHoaDonLQ = hdlq[0].kyHieu;
                                  let soHoaDonLQ = hdlq[0].soHoaDon;
                                  let ngayHoaDonLQ = moment(hdlq[0].ngayHoaDon).format('DD/MM/YYYY');
                                  let cauThongBao = null;

                                  if (!hdbdc.daBiDieuChinh) {
                                    cauThongBao = `
                                    ${this.txtHD_PXK_UPPER} bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. ${this.txtHD_PXK_UPPER} điều chỉnh này có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> đã thực hiện lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi đến CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK} cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                    `;

                                    this.modalService.create({
                                      nzContent: MessageBoxModalComponent,
                                      nzMaskClosable: false,
                                      nzClosable: false,
                                      nzKeyboard: false,
                                      nzStyle: { top: '100px' },
                                      nzBodyStyle: { padding: '1px' },
                                      nzComponentParams: {
                                        msHasThongBaoSaiSot: true,
                                        msButtonLabelThongBaoSaiSot: 'Gửi thông báo ${txtHD_PXK} điện tử có sai sót đến CQT tại đây',
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
                                                Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                              }
                                              else {
                                                content = `
                                                Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                                isTraVeThongDiepChung: true,
                                                thongDiepGuiCQTId: hdbdc.thongDiepGuiCQTId
                                              },
                                              nzFooter: null
                                            });
                                            modal.afterClose.subscribe((rs: any) => {
                                              if (rs) {
                                                window.location.href = "quan-ly/thong-diep-gui";
                                              }
                                            });
                                          }
                                        }
                                      },
                                      nzFooter: null
                                    });
                                  }
                                  // else{
                                  //   cauThongBao = `
                                  //   ${txtHD_PXK_UPPER} có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> có sai sót được xử lý theo hình thức Lập ${txtHD_PXK} điều chỉnh nhưng chưa lập Thông báo ${txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT) cho lần điều chỉnh gần nhất bởi ${txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. Bạn cần gửi Thông báo ${txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${txtHD_PXK} cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                  //   `;
                                  // }


                                }
                              }
                              else {
                                const modal = this.ActivedModal = this.modalService.create({
                                  nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
                                  nzContent: AddEditBienBanDieuChinhModalComponent,
                                  nzMaskClosable: false,
                                  nzClosable: false,
                                  nzKeyboard: false,
                                  nzWidth: '100%',
                                  nzStyle: { top: '0px' },
                                  nzBodyStyle: { padding: '1px', height: '96%' },
                                  nzComponentParams: {
                                    isAddNew: true,
                                    hoaDonBiDieuChinh: hdbdc,
                                    hoaDonDieuChinhId: chuaBiDieuChinh ? chuaBiDieuChinh.hoaDonDienTuId : null,
                                    hoaDonLienQuan: hdlq,
                                    isFromGP: !tt
                                  },
                                  nzFooter: null
                                });
                                modal.afterClose.subscribe((rs: any) => {
                                  this.ActivedModal = null;
                                  this.LoadData(true);
                                });
                              }
                            });
                          }
                          else {
                            const modal = this.ActivedModal = this.modalService.create({
                              nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
                              nzContent: AddEditBienBanDieuChinhModalComponent,
                              nzMaskClosable: false,
                              nzClosable: false,
                              nzKeyboard: false,
                              nzWidth: '100%',
                              nzStyle: { top: '0px' },
                              nzBodyStyle: { padding: '1px', height: '96%' },
                              nzComponentParams: {
                                isAddNew: true,
                                hoaDonBiDieuChinh: hdbdc,
                                hoaDonDieuChinhId: chuaBiDieuChinh ? chuaBiDieuChinh.hoaDonDienTuId : null,
                                data: data,
                                hoaDonLienQuan: hdlq,
                                isFromGP: !tt
                              },
                              nzFooter: null
                            });
                            modal.afterClose.subscribe((rs: any) => {
                              this.ActivedModal = null;
                              this.LoadData(true);
                            });
                          }
                        });
                      }

                    });
                  }
                  else {
                    const modal = this.ActivedModal = this.modalService.create({
                      nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
                      nzContent: AddEditBienBanDieuChinhModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzWidth: '100%',
                      nzStyle: { top: '0px' },
                      nzBodyStyle: { padding: '1px', height: '96%' },
                      nzComponentParams: {
                        isAddNew: true,
                        hoaDonBiDieuChinh: hdbdc,
                        hoaDonDieuChinhId: chuaBiDieuChinh ? chuaBiDieuChinh.hoaDonDienTuId : null,
                        data: data,
                        hoaDonLienQuan: hdlq,
                        isFromGP: !tt
                      },
                      nzFooter: null
                    });
                    modal.afterClose.subscribe((rs: any) => {
                      this.ActivedModal = null;
                      this.LoadData(true);
                    });
                  }
                })
              }
            });
          });
        })
      });
    }
  }

  clickSuaBienBan(data: any) {
    if (!data.bienBanDieuChinhIdTmp) {
      return;
    }

    if (data.trangThaiBienBanDieuChinhTmp == 2) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Sửa biên bản điều chỉnh ${this.txtHD_PXK}`,
          msContent: `Biên bản điều chỉnh ${this.txtHD_PXK} này đã được ký điện tử, nếu bạn thực hiện sửa thì chữ ký sẽ bị xóa và bạn cần ký lại. Bạn có muốn tiếp tục thực hiện không?
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhIdTmp)
              .subscribe((res: any) => {
                var ngayTao = data.hoaDonDienTuId ? moment(data.createdDate) : moment();
                this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, ngayTao.format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
                  let trangThaiCu = 2;
                  res.trangThaiBienBan = 1;
                  res.ngayKyBenA = null;
                  this.moGiaoDienSuaBB(res, hdlq, trangThaiCu);
                })
              });
          },
          msOnClose: () => {
            return;
          }
        },
      });
    }
    else if (data.trangThaiBienBanDieuChinhTmp == 3) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Sửa biên bản điều chỉnh ${this.txtHD_PXK}`,
          msContent: `Biên bản điều chỉnh ${this.txtHD_PXK} đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện sửa thì biên bản điều chỉnh ${this.txtHD_PXK} sẽ bị xóa và người mua sẽ không ký được biên bản điều chỉnh ${this.txtHD_PXK} đã gửi trước đó. Hệ thống sẽ nhân bản biên bản điều chỉnh ${this.txtHD_PXK} này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhIdTmp)
              .subscribe((res: any) => {
                var ngayTao = data.hoaDonDienTuId ? moment(data.createdDate) : moment();
                this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, ngayTao.format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
                  let trangThaiCu = 3;
                  res.trangThaiBienBan = 1;
                  res.ngayKyBenA = null;
                  this.moGiaoDienSuaBB(res, hdlq, trangThaiCu);
                });
              })
          },
          msOnClose: () => {
            return;
          }
        },
      });
    }
    else if (data.trangThaiBienBanDieuChinhTmp == 4) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Sửa biên bản điều chỉnh ${this.txtHD_PXK}`,
          msContent: `Biên bản điều chỉnh ${this.txtHD_PXK} đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện sửa thì biên bản điều chỉnh ${this.txtHD_PXK} sẽ bị xóa và người mua sẽ không xem được biên bản điều chỉnh ${this.txtHD_PXK} đã gửi trước đó. Hệ thống sẽ nhân bản biên bản điều chỉnh ${this.txtHD_PXK} này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?`,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhIdTmp)
              .subscribe((res: any) => {
                var ngayTao = data.hoaDonDienTuId ? moment(data.createdDate) : moment();
                this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, ngayTao.format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
                  let trangThaiCu = 4;
                  res.trangThaiBienBan = 1;
                  res.ngayKyBenA = null;
                  res.ngayKyBenB = null;
                  this.moGiaoDienSuaBB(res, hdlq, trangThaiCu);
                });
              })
          },
          msOnClose: () => {
            return;
          }
        }
      });
    }
    else {
      var ngayTao = data.hoaDonDienTuId ? moment(data.createdDate) : moment();
      this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhIdTmp)
        .subscribe((res: any) => {
          this.hoaDonDienTuService.GetAllListHoaDonLienQuan(data.dieuChinhChoHoaDonId, ngayTao.format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
            this.moGiaoDienSuaBB(res, hdlq);
          });
        });
    }
  }

  moGiaoDienSuaBB(data, hdlq, trangThaiCu = 1) {
    this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhId)
      .subscribe((res: any) => {
        res.trangThaiBienBan = data.trangThaiBienBan;
        res.ngayKyBenA = data.ngayKyBenA;
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `Lập biên bản điều chỉnh ${this.txtHD_PXK}`,
          nzContent: AddEditBienBanDieuChinhModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px', height: '96%' },
          nzComponentParams: {
            isAddNew: false,
            fbEnableEdit: true,
            data: res,
            hoaDonBiDieuChinh: res.hoaDonBiDieuChinh,
            hoaDonDieuChinhId: res.hoaDonDieuChinhId,
            hoaDonLienQuan: hdlq,
            trangThaiCu: trangThaiCu,
            isFromGP: res.hoaDonBiDieuChinh.loaiApDungHoaDonDieuChinh == 1 && res.hoaDonBiDieuChinh.trangThaiQuyTrinh != null
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.LoadData();
          }
        });
      });
  }

  clickXoaBienBan(data: any) {
    if (!data.bienBanDieuChinhIdTmp || data.trangThaiBienBanDieuChinhTmp == 0) {
      return;
    }

    var tb = '';
    if (data.trangThaiBienBanDieuChinhTmp == 1 || data.trangThaiBienBanDieuChinhTmp == 2) {
      tb = 'Bạn có chắc chắn muốn xóa không?'
    }
    else if (data.trangThaiBienBanDieuChinhTmp == 3) {
      tb = `Biên bản điều chỉnh ${this.txtHD_PXK} đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không ký được biên bản điều chỉnh ${this.txtHD_PXK} đã gửi trước đó. Bạn có muốn tiếp tục xóa không?`
    }
    else {
      tb = `Biên bản điều chỉnh ${this.txtHD_PXK} đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không xem được biên bản điều chỉnh ${this.txtHD_PXK} đã gửi trước đó. Bạn có muốn tiếp tục xóa không?`
    }

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: (data.trangThaiBienBanDieuChinhTmp == 1 || data.trangThaiBienBanDieuChinhTmp == 2) ? '430px' : 500,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: `Xóa biên bản điều chỉnh ${this.txtHD_PXK}`,
        msContent: tb,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOkButtonInBlueColor: (data.trangThaiBienBanDieuChinhTmp == 1 || data.trangThaiBienBanDieuChinhTmp == 2) ? false : true,
        msOKText: (data.trangThaiBienBanDieuChinhTmp == 1 || data.trangThaiBienBanDieuChinhTmp == 2) ? TextGlobalConstants.TEXT_CONFIRM_ACCEPT : TextGlobalConstants.TEXT_CONFIRM_CONT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          this.bienBanDieuChinhService.Delete(data.bienBanDieuChinhIdTmp).subscribe((rs: any) => {
            if (rs.result === 'DbUpdateException') {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
              return;
            }
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.BienBanDieuChinh,
                thamChieu: `Số ${this.txtHD_PXK} ${data.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: rs.bienBanDieuChinhIdTmp,
              }).subscribe();

              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.LoadData();
            } else {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
            }
          }, _ => {
            this.message.error(Message.DONT_DELETE_DANH_MUC);
          })
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }

  clickGuiBienBan(data: any) {
    if (!data.bienBanDieuChinhIdTmp || data.trangThaiBienBanDieuChinhTmp < 2) {
      return;
    }

    this.moGiaoDienGuiBB(data);
  }

  moGiaoDienGuiBB(data: any) {
    const res = {
      bienBanDieuChinhId: data.bienBanDieuChinhIdTmp,
      trangThaiBienBan: data.trangThaiBienBanDieuChinhTmp,
      tenNguoiNhan: data.hoTenNguoiNhanHD,
      emailNguoiNhan: data.emailNguoiNhanHD,
      soDienThoaiNguoiNhan: data.soDienThoaiNguoiNhanHD,
      hoaDonDienTuId: data.dieuChinhChoHoaDonId
    };

    this.hoaDonDienTuService.GetById(res.hoaDonDienTuId).subscribe((hd: any) => {
      this.thongTinHoaDonService.GetById(res.hoaDonDienTuId).subscribe((tt: any) => {
        const modal1 = this.modalService.create({
          nzTitle: `Gửi biên bản điều chỉnh ${this.txtHD_PXK} cho khách hàng`,
          nzContent: GuiBienBanXoaBoModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 700,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            hoaDonBiDieuChinh: hd ? hd : tt,
            data: res,
            isBBView: true,
            isAddNew: true,
            loaiEmail: this.isPhieuXuatKho ? LoaiEmail.ThongBaoBienBanDieuChinhPXK : LoaiEmail.ThongBaoBienBanDieuChinhHoaDon,
            isSystem: hd != null && hd != undefined
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs == true) {
            // this.modalService.create({
            //   nzContent: MessageBoxModalComponent,
            //   nzMaskClosable: false,
            //   nzClosable: false,
            //   nzKeyboard: false,
            //   nzWidth: 400,
            //   nzStyle: { top: '100px' },
            //   nzBodyStyle: { padding: '1px' },
            //   nzComponentParams: {
            //     msTitle: `Gửi biên bản điều chỉnh ${this.txtHD_PXK} đến khách hàng`,
            //     msContent: `Đã hoàn thành việc gửi biên bản điều chỉnh ${this.txtHD_PXK} đến khách hàng`,
            //     msMessageType: MessageType.Info,
            //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            //     msOnClose: () => { }
            //   }
            // })
            this.message.success(`Gửi biên bản điều chỉnh ${this.txtHD_PXK} đến khách hàng thành công`,{
              nzDuration : 5000
            })
            this.LoadData();
          }
          else if (rs == false) {
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
                msContent: `Gửi biên bản điều chỉnh ${this.txtHD_PXK} không thành công. Vui lòng kiểm tra lại!`,
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => { }
              }
            })
            return;
          }
        });
      })
    })
  }
  showThongBaoKhongTonTaiBoKyHieu(type) {

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
        msContent: `Bạn không thể lập <b> ${getTenHoaDonByLoai(type)} </b> do không tồn tại bộ ký hiệu hóa đơn có trạng thái sử dụng là <b>Đang sử dụng</b>, <b>Đã xác thực</b>. Vui lòng kiểm tra lại!`,
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
  async clickThemMoiHoaDon(data: any) {
    console.log('Thao tac chuot phai chon them hoa don');
    //const loaiHD = getLoaiLoaiHoaByMoTa(data.mauSoBiDieuChinh);
    //chỉnh sửa theo thông tư 78
    let loaiHD = 0;
    if (data.mauSo != null && data.mauSo != '') {
      let value = Number(data.mauSo);
      if (value.toString().toLowerCase() != 'nan') {
        loaiHD = value;
      }
    }

        /// Yêu cầu mới - trước khi tạo hóa đơn thay thế check - bộ ký hiệu
        let type = loaiHD;
        if (type == null) {
          this.showThongBaoKhongTonTaiBoKyHieu(type);
          return;
        }

        var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);
        if (listKyHieus.length === 0) {
          this.showThongBaoKhongTonTaiBoKyHieu(type);
          return;
        }

    if (data.dieuChinhChoHoaDonId && data.dieuChinhChoHoaDonId != '')
      this.hoaDonDienTuService.GetById(data.dieuChinhChoHoaDonId).subscribe((hd: any) => {
        this.thongTinHoaDonService.GetById(data.dieuChinhChoHoaDonId).subscribe((tt: any) => {
          var hdbdc = null;
          var isSystem = true;
          if (hd) {
            if (hd.mauSo != null && hd.mauSo != '') {
              let value = Number(hd.mauSo);
              if (value.toString().toLowerCase() != 'nan') {
                loaiHD = value;
              }
            }
            hdbdc = hd;
          }
          else {
            loaiHD = tt.loaiHoaDon;
            hdbdc = tt;
            isSystem = false;
          }

          if (isSystem == false) {
            this.clickAdd(loaiHD, {
              dieuChinhChoHoaDonId: data.dieuChinhChoHoaDonId || null,
              hinhThucHoaDonBiDieuChinh: null,
              mauSo: hdbdc.mauSo,
              kyHieu: hdbdc.kyHieu,
              ngayHoaDon: hdbdc.ngayHoaDon,
              soHoaDon: hdbdc.soHoaDon,
              lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
              maTraCuu: hdbdc.maTraCuu || null,
              loaiTienId: hdbdc.loaiTienId,
              isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
              isSystem: isSystem
            }, data.bienBanDieuChinhId);
          }
          else {
            this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdbdc.hoaDonDienTuId).subscribe((rs: any) => {
              if (!rs.isDaGuiThongBao || !rs.isDaLapThongBao) {
                if (!rs.isDaLapThongBao) {
                  //nếu chưa lập thông báo
                  let mauHoaDon = hdbdc.mauSo;
                  let kyHieuHoaDon = hdbdc.kyHieu;
                  let soHoaDon = hdbdc.soHoaDon;
                  let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                  let cauThongBao = `${this.txtHD_PXK_UPPER} có Ký hiệu <span class = "colorChuYTrongThongBao"><b>` + mauHoaDon + kyHieuHoaDon + `</b></span> Số ${this.txtHD_PXK} <span class = "colorChuYTrongThongBao"><b>` + soHoaDon + `</b></span> Ngày ${this.txtHD_PXK} <span class = "colorChuYTrongThongBao"><b>` + ngayHoaDon + `</b></span> có sai sót chưa lập <b>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện chức năng này. Vui lòng kiểm tra lại!`;

                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msHasThongBaoSaiSot: true,
                      msButtonLabelThongBaoSaiSot: `Lập và gửi thông báo ${this.txtHD_PXK} điện tử có sai sót tại đây`,
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
                              Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                            }
                            else {
                              content = `
                              Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                          let modal = this.modalService.create({
                            nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                            nzContent: ThongBaoHoaDonSaiSotModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzWidth: '100%',
                            nzStyle: { top: '0px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                              lapTuHoaDonDienTuId: hdbdc.hoaDonDienTuId,
                              isTraVeThongDiepChung: true
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
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
                  let mauHoaDon = hdbdc.mauSo;
                  let kyHieuHoaDon = hdbdc.kyHieu;
                  let soHoaDon = hdbdc.soHoaDon;
                  let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                  let cauThongBao = `${this.txtHD_PXK_UPPER} có Ký hiệu <span class = "colorChuYTrongThongBao"><b>` + mauHoaDon + kyHieuHoaDon + `</b></span> Số ${this.txtHD_PXK} <span class = "colorChuYTrongThongBao"><b>` + soHoaDon + `</b></span> Ngày ${this.txtHD_PXK} <span class = "colorChuYTrongThongBao"><b>` + ngayHoaDon + `</b></span> có sai sót đã lập <b>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện chức năng này. Vui lòng kiểm tra lại!`;

                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msHasThongBaoSaiSot: true,
                      msButtonLabelThongBaoSaiSot: `Gửi thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT tại đây`,
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
                              Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                            }
                            else {
                              content = `
                              Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                              isTraVeThongDiepChung: true,
                              thongDiepGuiCQTId: hdbdc.thongDiepGuiCQTId
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
                              window.location.href = "quan-ly/thong-diep-gui";
                            }
                          });
                        }
                      }
                    },
                    nzFooter: null
                  });
                }
              }
              else {
                this.clickAdd(loaiHD, {
                  dieuChinhChoHoaDonId: data.dieuChinhChoHoaDonId || null,
                  hinhThucHoaDonBiDieuChinh: null,
                  mauSo: hdbdc.mauSo,
                  kyHieu: hdbdc.kyHieu,
                  ngayHoaDon: hdbdc.ngayHoaDon,
                  soHoaDon: hdbdc.soHoaDon,
                  lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                  maTraCuu: hdbdc.maTraCuu || null,
                  loaiTienId: hdbdc.loaiTienId,
                  isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                  isSystem: isSystem
                }, data.bienBanDieuChinhId);
              }
            });

          }
        })
      })
    else {

      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((hd: any) => {
        this.thongTinHoaDonService.GetById(data.hoaDonDienTuId).subscribe((tt: any) => {
          var hdbdc = null;
          var isSystem = true;
          if (hd) {
            if (hd.mauSo != null && hd.mauSo != '') {
              let value = Number(hd.mauSo);
              if (value.toString().toLowerCase() != 'nan') {
                loaiHD = value;
              }
            }
            hdbdc = hd;
          }
          else {
            loaiHD = tt.loaiHoaDon;
            hdbdc = tt;
            isSystem = false;
          }
          if (isSystem == false) {

            this.clickAdd(loaiHD, {
              dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
              hinhThucHoaDonBiDieuChinh: null,
              mauSo: hdbdc.mauSo,
              kyHieu: hdbdc.kyHieu,
              ngayHoaDon: hdbdc.ngayHoaDon,
              soHoaDon: hdbdc.soHoaDon,
              lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
              maTraCuu: hdbdc.maTraCuu || null,
              loaiTienId: hdbdc.loaiTienId,
              isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
              isSystem: isSystem
            }, data.bienBanDieuChinhId);
          }
          else {
            if (hdbdc.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.ChuaKyDienTu
              || hdbdc.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.DangKyDienTu
              || hdbdc.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.GuiTCTNLoi) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: '30%',
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: "Kiểm tra lại",
                  msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến ${this.txtHD_PXK} bị điều chỉnh thì tất cả các ${this.txtHD_PXK} điều chỉnh liên quan đến ${this.txtHD_PXK} bị điều chỉnh cần <strong>Phát hành thành công</strong> và thực hiện <strong>Gửi ${this.txtHD_PXK} cho khách hàng</strong> trước khi tiếp tục điều chỉnh ${this.txtHD_PXK} bị điều chỉnh.<br>
                  <br>
                  Tồn tại ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class="cssyellow">${hdbdc.mauSoHoaDonLanDieuChinhGanNhat}${hdbdc.kyHieuHoaDonLanDieuChinhGanNhat}</span> số ${this.txtHD_PXK} <span class="cssyellow">Chưa cấp số</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(hdbdc.ngayHoaDonLanDieuChinhGanNhat).format("DD/MM/YYYY")}</span> liên quan đến ${this.txtHD_PXK} bị điều chỉnh có trạng thái quy trình là <strong>${hdbdc.tenTrangThaiLanDieuChinhGanNhat}</strong>. Vui lòng kiểm tra lại!
                  `,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => { }
                }
              })
              return;
            }
            else if (hdbdc.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.ChoPhanHoi) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: '30%',
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: "Kiểm tra lại",
                  msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến ${this.txtHD_PXK} bị điều chỉnh thì tất cả các ${this.txtHD_PXK} điều chỉnh liên quan đến ${this.txtHD_PXK} bị điều chỉnh cần <strong>Phát hành thành công</strong> và thực hiện <strong>Gửi ${this.txtHD_PXK} cho khách hàng</strong> trước khi tiếp tục điều chỉnh ${this.txtHD_PXK} bị điều chỉnh.<br>
                  <br>
                  Tồn tại ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class="cssyellow">${hdbdc.mauSoHoaDonLanDieuChinhGanNhat}${hdbdc.kyHieuHoaDonLanDieuChinhGanNhat}</span> số ${this.txtHD_PXK} <span class="cssyellow">${hdbdc.soHoaDonLanDieuChinhGanNhat}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(hdbdc.ngayHoaDonLanDieuChinhGanNhat).format("DD/MM/YYYY")}</span> liên quan đến ${this.txtHD_PXK} bị điều chỉnh có trạng thái quy trình là <strong>Chờ phản hồi</strong>. Vui lòng kiểm tra lại!
                  `,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => { }
                }
              })
              return;
            }

            this.hoaDonDienTuService.GetAllListHoaDonLienQuan(hdbdc.hoaDonDienTuId, moment().format('YYYY-MM-DD hh:mm:ss')).subscribe((hdlq: any[]) => {
              if (!hdlq || hdlq.length == 0) {
                this.hoaDonDienTuService.GetById(hdbdc.hoaDonDienTuId).subscribe((hd: any) => {
                  if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                    this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdbdc.hoaDonDienTuId).subscribe((rs: any) => {
                      if (!rs.isDaGuiThongBao || !rs.isDaLapThongBao) {
                        if (!rs.isDaLapThongBao) {
                          //nếu chưa lập thông báo
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');

                          let cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> nhưng chưa lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK}. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: 'Lập và gửi thông báo ${txtHD_PXK} điện tử có sai sót tại đây',
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
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                  let modal = this.modalService.create({
                                    nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                                    nzMaskClosable: false,
                                    nzClosable: false,
                                    nzKeyboard: false,
                                    nzWidth: '100%',
                                    nzStyle: { top: '0px' },
                                    nzBodyStyle: { padding: '1px' },
                                    nzComponentParams: {
                                      loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                                      lapTuHoaDonDienTuId: hdbdc.hoaDonDienTuId,
                                      isTraVeThongDiepChung: true
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
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
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');

                          var cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(ngayHoaDon).format("DD/MM/YYYY")}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> đã thực hiện lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập ${this.txtHD_PXK} điều chỉnh. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: `Gửi thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT tại đây`,
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
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                      isTraVeThongDiepChung: true,
                                      thongDiepGuiCQTId: hdbdc.thongDiepGuiCQTId
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
                                      window.location.href = "quan-ly/thong-diep-gui";
                                    }
                                  });
                                }
                              }
                            },
                            nzFooter: null
                          });
                        }
                      }
                      else {

                        this.modalService.create({
                          nzContent: MessageBoxModalComponent,
                          nzMaskClosable: false,
                          nzClosable: false,
                          nzKeyboard: false,
                          nzWidth: '55%',
                          nzStyle: { top: '100px' },
                          nzBodyStyle: { padding: '1px' },
                          nzComponentParams: {
                            msTitle: `Chọn hình thức điều chỉnh ${this.txtHD_PXK} sai sót`,
                            msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
                            <span class="clsspan">“Trường hợp ${this.txtHD_PXK} điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện ${this.txtHD_PXK} tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
                            Theo đó, khi đã chọn hình thức điều chỉnh cho ${this.txtHD_PXK} (${this.txtHD_PXK} gốc) có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> thì:<br>
                            &nbsp;- Không được tiếp tục xử lý theo hình thức thay thế<br>
                            &nbsp;- Tiếp tục được lập ${this.txtHD_PXK} điều chỉnh nếu phát hiện còn sai sót.<br>
                            &nbsp;- Khi ${this.txtHD_PXK} điều chỉnh đã lập có sai sót thì: <br>
                            &nbsp;&nbsp;+ Không được phép: hủy hoá đơn điều chỉnh; xóa bỏ ${this.txtHD_PXK} điều chỉnh để lập ${this.txtHD_PXK} thay thế để thay thế ${this.txtHD_PXK} điều chỉnh; lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} điều chỉnh; <br>
                            &nbsp;&nbsp;+ Được phép: lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} gốc có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> (đã chuyển trạng thái ${this.txtHD_PXK} thành ${this.txtHD_PXK_UPPER} gốc bị điều chỉnh) những sai sót phát hiện tại ${this.txtHD_PXK} điều chỉnh đã ảnh hưởng đến ${this.txtHD_PXK} gốc<br>
                            <br>
                            <strong class="cssbrown">Khuyến nghị người bán xử lý ${this.txtHD_PXK} đã lập có sai sót theo hình thức thay thế.</strong><br>
                            Chọn <strong class='cssblue'>Đồng ý</strong> nếu bạn vẫn muốn thực hiện xử lý sai sót theo hình thức điều chỉnh, chọn <strong class="cssred">Không</strong> trở lại giao diện lúc đầu.
                            `,
                            msMessageType: MessageType.Confirm,
                            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                            msOkButtonInBlueColor: true,
                            msOnOk: () => {
                              this.clickAdd(loaiHD, {
                                dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                                hinhThucHoaDonBiDieuChinh: null,
                                mauSo: hdbdc.mauSo,
                                kyHieu: hdbdc.kyHieu,
                                ngayHoaDon: hdbdc.ngayHoaDon,
                                soHoaDon: hdbdc.soHoaDon,
                                lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                                maTraCuu: hdbdc.maTraCuu || null,
                                loaiTienId: hdbdc.loaiTienId,
                                isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                                isSystem: isSystem
                              }, data.bienBanDieuChinhId);
                            },
                            msOnClose: () => {
                            }
                          }
                        });
                      }
                    });
                  }
                  else {
                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzWidth: '55%',
                      nzStyle: { top: '100px' },
                      nzBodyStyle: { padding: '1px' },
                      nzComponentParams: {
                        msTitle: "Chọn hình thức điều chỉnh ${txtHD_PXK} sai sót",
                        msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
                        <span class="clsspan">“Trường hợp ${this.txtHD_PXK} điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện ${this.txtHD_PXK} tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
                        Theo đó, khi đã chọn hình thức điều chỉnh cho ${this.txtHD_PXK} (${this.txtHD_PXK} gốc) có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> thì:<br>
                        &nbsp;- Không được tiếp tục xử lý theo hình thức thay thế<br>
                        &nbsp;- Tiếp tục được lập ${this.txtHD_PXK} điều chỉnh nếu phát hiện còn sai sót.<br>
                        &nbsp;- Khi ${this.txtHD_PXK} điều chỉnh đã lập có sai sót thì: <br>
                        &nbsp;&nbsp;+ Không được phép: hủy hoá đơn điều chỉnh; xóa bỏ ${this.txtHD_PXK} điều chỉnh để lập ${this.txtHD_PXK} thay thế để thay thế ${this.txtHD_PXK} điều chỉnh; lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} điều chỉnh; <br>
                        &nbsp;&nbsp;+ Được phép: lập ${this.txtHD_PXK} điều chỉnh để điều chỉnh ${this.txtHD_PXK} gốc có ký hiệu mẫu số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.mauSo}</span>, ký hiệu ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.kyHieu}</span>, số ${this.txtHD_PXK} <span class='cssyellow'>${hdbdc.soHoaDon}</span>, ngày ${this.txtHD_PXK} <span class='cssyellow'>${moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY')}</span> (đã chuyển trạng thái ${this.txtHD_PXK} thành ${this.txtHD_PXK_UPPER} gốc bị điều chỉnh) những sai sót phát hiện tại ${this.txtHD_PXK} điều chỉnh đã ảnh hưởng đến ${this.txtHD_PXK} gốc<br>
                        <br>
                        <strong class="cssbrown">Khuyến nghị người bán xử lý ${this.txtHD_PXK} đã lập có sai sót theo hình thức thay thế.</strong><br>
                        Chọn <strong class='cssblue'>Đồng ý</strong> nếu bạn vẫn muốn thực hiện xử lý sai sót theo hình thức điều chỉnh, chọn <strong class="cssred">Không</strong> trở lại giao diện lúc đầu.
                        `,
                        msMessageType: MessageType.Confirm,
                        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                        msOkButtonInBlueColor: true,
                        msOnOk: () => {
                          this.clickAdd(loaiHD, {
                            dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                            hinhThucHoaDonBiDieuChinh: null,
                            mauSo: hdbdc.mauSo,
                            kyHieu: hdbdc.kyHieu,
                            ngayHoaDon: hdbdc.ngayHoaDon,
                            soHoaDon: hdbdc.soHoaDon,
                            lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                            maTraCuu: hdbdc.maTraCuu || null,
                            loaiTienId: hdbdc.loaiTienId,
                            isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                            isSystem: isSystem
                          }, data.bienBanDieuChinhId);
                        },
                        msOnClose: () => {
                        }
                      }
                    });
                  }
                })
              }
              else {
                var hddc = `Tồn tại ${this.txtHD_PXK} điều chỉnh có`;
                var isGui = false;
                var pos = 0;
                for (var i = 0; i < hdlq.length; i++) {
                  if (hdlq[i].trangThaiGuiHoaDon == TrangThaiGuiHoaDon.ChuaGui && (hdlq[i].boKyHieuHoaDon.hinhThucHoaDon != 2 || this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == true)) {
                    isGui = true;
                    hddc += ` ký hiệu <span class="cssyellow">${hdlq[i].mauSo}${hdlq[i].kyHieu}</span> số ${this.txtHD_PXK} <span class="cssyellow">${!hdlq[i].soHoaDon ? "&ltChưa cấp số&gt;" : hdlq[i].soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(hdlq[i].ngayHoaDon).format('DD/MM/YYYY')}</span>`
                    pos = i;
                    break;
                  }
                }

                hddc += ` liên quan đến ${this.txtHD_PXK} bị điều chỉnh Chưa gửi cho khách hàng. Vui lòng kiểm tra lại!`
                if (hddc != '' && isGui == true) {
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: 600,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msTitle: "Kiểm tra lại",
                      msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến ${this.txtHD_PXK} bị điều chỉnh thì tất cả các ${this.txtHD_PXK} điều chỉnh liên quan đến ${this.txtHD_PXK} bị điều chỉnh cần thực hiện Gửi ${this.txtHD_PXK} cho khách hàng trước khi tiếp tục điều chỉnh ${this.txtHD_PXK} bị điều chỉnh.
                      <br>
                      <br>
                      ${hddc}
                      `,
                      msMessageType: MessageType.Warning,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msHasGuiHoaDon: true,
                      msButtonLabelGuiHoaDon: `Gửi ${this.txtHD_PXK} cho khách hàng tại đây`,
                      msOnGuiHoaDon: () => {
                        this.hoaDonDienTuService.GetById(hdlq[pos].hoaDonDienTuId)
                          .subscribe((res: any) => {
                            if (res) {
                              var title = res.boKyHieuHoaDon.hinhThucHoaDon == 1 ? `Gửi ${this.txtHD_PXK} có mã của cơ quan thuế đến khách hàng` : `Gửi ${this.txtHD_PXK} không có mã của cơ quan thuế đến khách hàng`
                              const modal1 = this.modalService.create({
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
                                  loaiEmail: LoaiEmail.ThongBaoPhatHanhHoaDon,
                                  hanhDong: title
                                },
                                nzFooter: null
                              });
                              modal1.afterClose.subscribe((rs: any) => {
                                if (rs != null) {
                                  if (rs) {
                                    // this.GetTreeTrangThai();
                                    // this.GetTreeTrangThaiLuyKe();
                                    /*                                     this.modalService.create({
                                                                          nzContent: MessageBoxModalComponent,
                                                                          nzMaskClosable: false,
                                                                          nzClosable: false,
                                                                          nzKeyboard: false,
                                                                          nzWidth: 400,
                                                                          nzStyle: { top: '100px' },
                                                                          nzBodyStyle: { padding: '1px' },
                                                                          nzComponentParams: {
                                                                            msTitle: "Gửi ${txtHD_PXK} đến khách hàng",
                                                                            msContent: `Đã hoàn thành việc gửi ${txtHD_PXK} đến khách hàng`,
                                                                            msMessageType: MessageType.Info,
                                                                            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                                                                            msOnClose: () => { }
                                                                          }
                                                                        }) */

                                    this.message.success(`Gửi ${this.txtHD_PXK} thành công`);
                                  }
                                }
                              });
                            }
                          });
                      },
                      msOnClose: () => {
                      }
                    }
                  });
                  return;
                }

                this.hoaDonDienTuService.GetById(hdbdc.hoaDonDienTuId).subscribe((hd: any) => {
                  if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                    this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdbdc.hoaDonDienTuId).subscribe((rs: any) => {
                      if (rs && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
                        if (!rs.isDaLapThongBao) {
                          //nếu chưa lập thông báo
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                          let cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> nhưng chưa lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK}. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: `Lập và gửi thông báo ${this.txtHD_PXK} điện tử có sai sót tại đây`,
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
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                  let modal = this.modalService.create({
                                    nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                                    nzMaskClosable: false,
                                    nzClosable: false,
                                    nzKeyboard: false,
                                    nzWidth: '100%',
                                    nzStyle: { top: '0px' },
                                    nzBodyStyle: { padding: '1px' },
                                    nzComponentParams: {
                                      loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                                      lapTuHoaDonDienTuId: hdbdc.hoaDonDienTuId,
                                      isTraVeThongDiepChung: true
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
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
                          let mauHoaDon = hdbdc.mauSo;
                          let kyHieuHoaDon = hdbdc.kyHieu;
                          let soHoaDon = hdbdc.soHoaDon;
                          let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');

                          var cauThongBao = `${this.txtHD_PXK_UPPER} có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class="cssyellow">${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class="cssyellow">${moment(ngayHoaDon).format("DD/MM/YYYY")}</span> có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> đã thực hiện lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập ${this.txtHD_PXK} điều chỉnh. Vui lòng kiểm tra lại!`;

                          this.modalService.create({
                            nzContent: MessageBoxModalComponent,
                            nzMaskClosable: false,
                            nzClosable: false,
                            nzKeyboard: false,
                            nzStyle: { top: '100px' },
                            nzBodyStyle: { padding: '1px' },
                            nzComponentParams: {
                              msHasThongBaoSaiSot: true,
                              msButtonLabelThongBaoSaiSot: `Gửi thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT tại đây`,
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
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                    }
                                    else {
                                      content = `
                                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                      isTraVeThongDiepChung: true,
                                      thongDiepGuiCQTId: hd.thongDiepGuiCQTId
                                    },
                                    nzFooter: null
                                  });
                                  modal.afterClose.subscribe((rs: any) => {
                                    if (rs) {
                                      window.location.href = "quan-ly/thong-diep-gui";
                                    }
                                  });
                                }
                              }
                            },
                            nzFooter: null
                          });
                        }
                      }
                      else {
                        var hdgns = hdlq.filter(x => x.thongBaoSaiSot && x.thongBaoSaiSot.trangThaiLapVaGuiThongBao <= -1);
                        if (hdgns.length > 0) {
                          var hdgn = hdgns[hdgns.length - 1];
                          this.hoaDonDienTuService.GetById(hdgn.hoaDonDienTuId).subscribe((hd: any) => {
                            if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                              this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdgn.hoaDonDienTuId).subscribe((res: any) => {
                                if (!res.isDaGuiThongBao || !res.isDaLapThongBao) {
                                  if (!res.isDaLapThongBao) {
                                    //nếu chưa lập thông báo
                                    let mauHoaDon = hdbdc.mauSo;
                                    let kyHieuHoaDon = hdbdc.kyHieu;
                                    let soHoaDon = hdbdc.soHoaDon;
                                    let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                                    let mauHoaDonLQ = hdgn.mauSo;
                                    let kyHieuHoaDonLQ = hdgn.kyHieu;
                                    let soHoaDonLQ = hdgn.soHoaDon;
                                    let ngayHoaDonLQ = moment(hdgn.ngayHoaDon).format('DD/MM/YYYY');
                                    var cauThongBao = '';

                                    cauThongBao = `
                                    ${this.txtHD_PXK_UPPER} bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. ${this.txtHD_PXK_UPPER} điều chỉnh này có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> nhưng chưa lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập ${this.txtHD_PXK} điều chỉnh cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                    `;


                                    this.modalService.create({
                                      nzContent: MessageBoxModalComponent,
                                      nzMaskClosable: false,
                                      nzClosable: false,
                                      nzKeyboard: false,
                                      nzStyle: { top: '100px' },
                                      nzBodyStyle: { padding: '1px' },
                                      nzComponentParams: {
                                        msHasThongBaoSaiSot: true,
                                        msButtonLabelThongBaoSaiSot: `Lập và gửi thông báo ${this.txtHD_PXK} điện tử có sai sót tại đây`,
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
                                                Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                              }
                                              else {
                                                content = `
                                                Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                            let modal = this.modalService.create({
                                              nzTitle: `Thông báo ${this.txtHD_PXK} điện tử có sai sót`,
                                              nzContent: ThongBaoHoaDonSaiSotModalComponent,
                                              nzMaskClosable: false,
                                              nzClosable: false,
                                              nzKeyboard: false,
                                              nzWidth: '100%',
                                              nzStyle: { top: '0px' },
                                              nzBodyStyle: { padding: '1px' },
                                              nzComponentParams: {
                                                loaiThongBao: 1, //để mặc định, vì các ${txtHD_PXK} hệ thống là 1
                                                lapTuHoaDonDienTuId: hdlq[0].hoaDonDienTuId,
                                                isTraVeThongDiepChung: true
                                              },
                                              nzFooter: null
                                            });
                                            modal.afterClose.subscribe((rs: any) => {
                                              if (rs) {
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
                                  if (res.isDaLapThongBao && !res.isDaGuiThongBao) {
                                    //nếu đã lập thông báo nhưng chưa gửi CQT
                                    let mauHoaDon = hdbdc.mauSo;
                                    let kyHieuHoaDon = hdbdc.kyHieu;
                                    let soHoaDon = hdbdc.soHoaDon;
                                    let ngayHoaDon = moment(hdbdc.ngayHoaDon).format('DD/MM/YYYY');
                                    let mauHoaDonLQ = hdgn.mauSo;
                                    let kyHieuHoaDonLQ = hdgn.kyHieu;
                                    let soHoaDonLQ = hdgn.soHoaDon;
                                    let ngayHoaDonLQ = moment(hdgn.ngayHoaDon).format('DD/MM/YYYY');
                                    let cauThongBao =
                                      `${this.txtHD_PXK_UPPER} bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDon}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi ${this.txtHD_PXK} điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số ${this.txtHD_PXK} <span class='cssyellow'>${soHoaDonLQ}</span> ngày ${this.txtHD_PXK} <span class='cssyellow'>${ngayHoaDonLQ}</span>. ${this.txtHD_PXK_UPPER} điều chỉnh này có sai sót <strong>Không phải lập lại ${this.txtHD_PXK}</strong> đã thực hiện lập <strong>Thông báo ${this.txtHD_PXK} điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh ${this.txtHD_PXK} cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                    `;

                                    this.modalService.create({
                                      nzContent: MessageBoxModalComponent,
                                      nzMaskClosable: false,
                                      nzClosable: false,
                                      nzKeyboard: false,
                                      nzStyle: { top: '100px' },
                                      nzBodyStyle: { padding: '1px' },
                                      nzComponentParams: {
                                        msHasThongBaoSaiSot: true,
                                        msButtonLabelThongBaoSaiSot: `Gửi thông báo ${this.txtHD_PXK} điện tử có sai sót đến CQT tại đây`,
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
                                                Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                                              }
                                              else {
                                                content = `
                                                Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                                                isTraVeThongDiepChung: true,
                                                thongDiepGuiCQTId: hd.thongDiepGuiCQTId
                                              },
                                              nzFooter: null
                                            });
                                            modal.afterClose.subscribe((rs: any) => {
                                              if (rs) {
                                                window.location.href = "quan-ly/thong-diep-gui";
                                              }
                                            });
                                          }
                                        }
                                      },
                                      nzFooter: null
                                    });
                                  }
                                }
                                else {
                                  this.clickAdd(loaiHD, {
                                    dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                                    hinhThucHoaDonBiDieuChinh: null,
                                    mauSo: hdbdc.mauSo,
                                    kyHieu: hdbdc.kyHieu,
                                    ngayHoaDon: hdbdc.ngayHoaDon,
                                    soHoaDon: hdbdc.soHoaDon,
                                    lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                                    maTraCuu: hdbdc.maTraCuu || null,
                                    loaiTienId: hdbdc.loaiTienId,
                                    isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                                    isSystem: isSystem
                                  }, data.bienBanDieuChinhId);
                                }
                              });
                            }
                            else {
                              this.clickAdd(loaiHD, {
                                dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                                hinhThucHoaDonBiDieuChinh: null,
                                mauSo: hdbdc.mauSo,
                                kyHieu: hdbdc.kyHieu,
                                ngayHoaDon: hdbdc.ngayHoaDon,
                                soHoaDon: hdbdc.soHoaDon,
                                lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                                maTraCuu: hdbdc.maTraCuu || null,
                                loaiTienId: hdbdc.loaiTienId,
                                isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                                isSystem: isSystem
                              }, data.bienBanDieuChinhId);
                            }
                          });
                        }
                        else {
                          this.clickAdd(loaiHD, {
                            dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                            hinhThucHoaDonBiDieuChinh: null,
                            mauSo: hdbdc.mauSo,
                            kyHieu: hdbdc.kyHieu,
                            ngayHoaDon: hdbdc.ngayHoaDon,
                            soHoaDon: hdbdc.soHoaDon,
                            lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                            maTraCuu: hdbdc.maTraCuu || null,
                            loaiTienId: hdbdc.loaiTienId,
                            isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                            isSystem: isSystem
                          }, data.bienBanDieuChinhId);
                        }
                      }
                    });
                  }
                  else {
                    this.clickAdd(loaiHD, {
                      dieuChinhChoHoaDonId: hdbdc.hoaDonDienTuId || null,
                      hinhThucHoaDonBiDieuChinh: null,
                      mauSo: hdbdc.mauSo,
                      kyHieu: hdbdc.kyHieu,
                      ngayHoaDon: hdbdc.ngayHoaDon,
                      soHoaDon: hdbdc.soHoaDon,
                      lyDo: hdbdc.lyDoDieuChinh || hdbdc.lyDoBiDieuChinh,
                      maTraCuu: hdbdc.maTraCuu || null,
                      loaiTienId: hdbdc.loaiTienId,
                      isLapVanBanThoaThuan: hdbdc.isLapVanBanThoaThuan || false,
                      isSystem: isSystem
                    }, data.bienBanDieuChinhId);
                  }
                })
              }
            });
          }
        })
      })
    }
  }

  clickSuaHoaDon(data: any, isCopy = false) {
    if ((isCopy == false && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi && data.trangThaiQuyTrinh != TrangThaiQuyTrinh.ChuaPhatHanh)) {
      if (data.boKyHieuHoaDon.hinhThucHoaDon != 2) {
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
      if (data.boKyHieuHoaDon.hinhThucHoaDon == 2) {
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

      return;
    }


    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        const title = res.tenLoaiHoaDon;
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
            isCopy: isCopy,
            isAddNew: false,
            data: res,
            loaiHD: res.loaiHoaDon,
            fbEnableEdit: true,
            lyDoDieuChinh: res.lyDoDieuChinhModel
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs) {
            this.LoadData();
          }
        });
      });
  }

  async clickXoaHoaDon(data: any) {
    var checkDaPhatSinhThongDiepTN = await this.hoaDonDienTuService.CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(data.hoaDonDienTuId);

    if (data.boKyHieuHoaDon.hinhThucHoaDon != 2 && ((data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaKyDienTu && data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KyDienTuLoi) || checkDaPhatSinhThongDiepTN)) {
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
          msContent: `<div>Hệ thống chỉ cho phép thực hiện <b>Xóa</b> ${this.txtHD_PXK} khi:</div>
          <div>- ${this.txtHD_PXK_UPPER} có trạng thái quy trình là <b>Chưa ký điện tử</b>, <b>Ký điện tử lỗi</b>;</div>
          <div>Và ${this.txtHD_PXK} chưa phát sinh thông điệp truyền nhận với CQT</div>
          <div>Vui lòng kiểm tra lại!</div>`,
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      return;
    }
    else if (data.boKyHieuHoaDon.hinhThucHoaDon == 2 && ((data.trangThaiQuyTrinh !== TrangThaiQuyTrinh.ChuaPhatHanh) || checkDaPhatSinhThongDiepTN)) {
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
          msContent: `Hệ thống chỉ cho phép thực hiện <b>Xóa</b> hóa đơn <b>Có mã từ máy tính tiền</b> có trạng thái quy trình là <b>Chưa phát hành</b>. Vui lòng kiểm tra lại`,
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      return;
    }

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '430px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: `Xóa ${this.txtHD_PXK}`,
        msContent: `Bạn có thực sự muốn xóa ${this.txtHD_PXK} này không?`,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOkButtonInBlueColor: false,
        msOkButtonContinueIcon: false,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          this.hoaDonDienTuService.Delete(data.hoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.HoaDonDienTu,
                doiTuongThaoTac: 'Tên loại ${txtHD_PXK}: ' + getTenLoaiHoaDon(data.loaiHoaDon),
                thamChieu: `Số ${this.txtHD_PXK} ${data.soHoaDon || '<Chưa cấp số>'}\nNgày ${this.txtHD_PXK} ${moment(data.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: data.hoaDonDienTuId,
              }).subscribe();

              if (data.bienBanDieuChinhId) {
                this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhId).subscribe((rs: any) => {
                  if (rs) {
                    rs.hoaDonDieuChinhId = null;
                    this.bienBanDieuChinhService.Update(rs).subscribe();
                  }
                })
              }
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.LoadData();
            } else {
              this.message.error('Lỗi xóa dữ liệu');
            }
          }, _ => {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
          });
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }

  clickNhanBanHoaDon(data: any) {
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe((res: any) => {
        const title = res.tenLoaiHoaDon;
        res.trangThai = 1;
        res.lyDoDieuChinhModel = null;
        res.loaiDieuChinh = null;
        res.dieuChinhChoHoaDonId = null;
        res.createdDate = null;
        res.createdBy = null;
        res.modifyDate = null;
        res.modifyBy = null;

        const modal1 = this.modalService.create({
          nzTitle: title,
          nzContent: HoaDonDienTuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            isCopy: true,
            isAddNew: false,
            data: res,
            loaiHD: res.loaiHoaDon,
            fbEnableEdit: true,
            lyDoDieuChinh: res.lyDoDieuChinhModel
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs) {
            this.LoadData();
          }
        });
      });
  }

  clickXemHoaDon(data: any) {
    this.tabHoaDonDienTuComponent.viewReceipt(data);
  }

  clickPhatHanhHoaDon(data: any) {
    this.tabHoaDonDienTuComponent.publishReceipt(data, () => {
      this.LoadData();
    });
  }

  clickGuiHoaDon(data: any) {
    this.tabHoaDonDienTuComponent.sendReceipt(false, data, () => {
      this.LoadData();
    });
  }

  clickGuiHoaDonNhap(data: any) {
    this.tabHoaDonDienTuComponent.sendReceipt(true, data, () => {
      this.LoadData();
    });
  }

  clickTaiHoaDon(data: any) {
    this.tabHoaDonDienTuComponent.downloadReceipt(data);
  }

  clickChuyenThanhHoaDonGiay(data: any) {
    this.tabHoaDonDienTuComponent.convertReceipt(data, () => {
      this.LoadData();
    });
  }

  getHoaDonBiThayThe(data: any) {
    if (data.dieuChinhChoHoaDonId) {

      this.hoaDonDienTuService.GetById(data.dieuChinhChoHoaDonId).subscribe((rs: any) => {
        return rs;
      });
    }
    else {
      if (data.loaiApDungHoaDonDieuChinh == 1) {

        this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((rs: any) => {
          return rs;
        })
      }
      else {
        this.thongTinHoaDonService.GetById(data.hoaDonDienTuId).subscribe((rs: any) => {
          return rs;
        })
      }
    }
  }

  clickAdd(type: number, lyDoDieuChinh: LyDoDieuChinh, bienBanDieuChinhId = null) {
    if (this.ActivedModal) return;
    const modal1 = this.ActivedModal = this.modalService.create({
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
      this.ActivedModal = null;
      this.LoadData();
    });
  }

  clickXoaKyDienTu(item: any) {
    this.tabHoaDonDienTuComponent.RemoveDigitalSignature(item);
  }

  downloadFile(item: any) {
    DownloadFile(item.link, item.tenGoc);
  }

  deleteFile(item: any, data: any) {
    this.modalService.create({
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
        msTitle: `Xóa tài liệu đính kèm`,
        msContent: 'Bạn có muốn xóa tài liệu đính kèm này không?',
        msOnClose: () => {
          return;
        },
        msOnOk: () => {
          data.taiLieuDinhKems = data.taiLieuDinhKems.filter(x => x !== item);

          this.uploadFileService.DeleteFileAttach({
            nghiepVuId: data.hoaDonDieuChinhId,
            loaiNghiepVu: RefType.HoaDonDienTu,
            tenGoc: item.tenGoc,
            tenGuid: item.tenGuid,
            taiLieuDinhKemId: item.taiLieuDinhKemId
          }).subscribe();
        },
      }
    });
  }

  filterGeneral() {
    this.filterGeneralVisible = false;
    this.params = this.displayDataTemp;
    this.loadViewConditionList();
  }

  filterDefault() {
    this.filterGeneralVisible = false;
    this.displayDataTemp = Object.assign({}, this.displayDataRaw);
    this.params = Object.assign({}, this.displayDataRaw);

    this.loadViewConditionList();
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: `Ngày ${this.txtHD_PXK}: `, value: GetTenKy(this.params.Ky) });
    if (this.params.LoaiTrangThaiHoaDonDieuChinh !== -1) {
      this.viewConditionList.push({ key: 'LoaiTrangThaiHoaDonDieuChinh', label: `Trạng thái ${this.txtHD_PXK}: `, value: this.loaiTrangThaiHoaDonDieuChinhs.find(x => x.key === this.params.LoaiTrangThaiHoaDonDieuChinh).name });
    }
    if (this.params.LoaiTrangThaiPhatHanh !== -1) {
      this.viewConditionList.push({ key: 'LoaiTrangThaiPhatHanh', label: 'Trạng thái phát hành: ', value: this.loaiTrangThaiPhatHanhs.find(x => x.value === this.params.LoaiTrangThaiPhatHanh).name });
    }
    if (this.params.LoaiTrangThaiBienBanDieuChinhHoaDon !== -1) {
      this.viewConditionList.push({ key: 'LoaiTrangThaiBienBanDieuChinhHoaDon', label: `Trạng thái biên bản điều chỉnh ${this.txtHD_PXK}: `, value: this.loaiTrangThaiBienBanDieuChinhHoaDons.find(x => x.value === this.params.LoaiTrangThaiBienBanDieuChinhHoaDon).name });
    }

    if (this.viewConditionList.length > 1 || this.params.Ky !== 5) {
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

    this.LoadData(true);
  }

  removeFilter(filter: any) {
    switch (filter.key) {
      case 'LoaiTrangThaiHoaDonDieuChinh':
        this.displayDataTemp.LoaiTrangThaiHoaDonDieuChinh = -1;
        break;
      case 'LoaiTrangThaiPhatHanh':
        this.displayDataTemp.LoaiTrangThaiPhatHanh = -1;
        break;
      case 'LoaiTrangThaiBienBanDieuChinhHoaDon':
        this.displayDataTemp.LoaiTrangThaiBienBanDieuChinhHoaDon = -1;
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

    this.params = Object.assign({}, this.displayDataTemp);
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

  //kiểm tra lập thông báo sai sót
  kiemTraLapThongBaoSaiSot(data: any) {
    //Ghi chú: nếu data.thongBaoSaiSot.hoaDonDienTuId != null hoặc data.thongBaoSaiSot.thongDiepGuiCQTId thì là trường hợp của ${txtHD_PXK} điều chỉnh
    //và khi đó data.thongBaoSaiSot.hoaDonDienTuId là id của ${txtHD_PXK} bị điều chỉnh,
    //và data.thongBaoSaiSot.thongDiepGuiCQTId là giá trị thongDiepGuiCQTId của dòng ${txtHD_PXK} bị điều chỉnh

    let modalThongBaoSaiSot = null;
    if (data.thongBaoSaiSot.trangThaiLapVaGuiThongBao == -2) {
      //chưa lập thì mở thêm 04
      if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0) {
        this.userService.getAdminUser().subscribe((rs: any[]) => {
          let content = '';
          if (rs && rs.length > 0) {
            content = `
            Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
            content = `
            Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
          loaiThongBao: (data.thongBaoSaiSot.isHoaDonNgoaiHeThong == true) ? 3 : 1, //3 là các ${txtHD_PXK} nhập từ phần mềm khác
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
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
          }
          else {
            content = `
            Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo ${this.txtHD_PXK} điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
        nzTitle: `Tình trạng lỗi khi thực hiện gửi ${this.txtHD_PXK}`,
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

  //hàm này để gửi ${txtHD_PXK} tới CQT
  sendDataHoaDon(item: any) {
    if (this.disabledGuiCQT) {
      return;
    }

    this.tabHoaDonDienTuComponent.dataSelected = item;
    this.tabHoaDonDienTuComponent.isChuyenDayDuNoiDungTungHoaDon = this.isChuyenDayDuNoiDungTungHoaDon;
    this.tabHoaDonDienTuComponent.sendDataHoaDon(MLTDiep.TDCDLHDKMDCQThue, () => {
      this.LoadData();
    });
  }

  viewLichSuTruyenNhan(data) {
    if (data.lapTuPMGP == false) {
      return;
    }
    this.tabHoaDonDienTuComponent.viewLichSuTruyenNhan(data);
  }

  clickGuiCQT(item: any) {
    this.tabHoaDonDienTuComponent.hoSoHDDT = this.hoSoHDDT;
    this.tabHoaDonDienTuComponent.serials = this.serials;
    this.tabHoaDonDienTuComponent.guiHoaDonDenCQT(item, () => {
      this.LoadData();
    })
  }

  xacNhanHoaDonDaGuiChoKhachHang(data: any) {
    this.tabHoaDonDienTuComponent.xacNhanTrangThaiDaGui(data, RefType.HoaDonDieuChinh, () => this.LoadData());
  }
}
