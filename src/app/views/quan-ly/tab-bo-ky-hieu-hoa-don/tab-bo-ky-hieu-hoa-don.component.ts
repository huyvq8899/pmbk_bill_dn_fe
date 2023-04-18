import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FilterColumn, FilterCondition } from "src/app/models/PagingParams";
import { FilterColumnComponent } from "src/app/shared/components/filter-column/filter-column.component";
import { TabShortKeyEventHandler } from "src/app/shared/KeyboardEventHandler";
import * as moment from 'moment';
import { GetKy, GetList, SetDate } from "src/app/shared/chon-ky";
import { DinhDangThapPhan } from "src/app/shared/DinhDangThapPhan";
import { RowScrollerToViewEdit } from "src/app/shared/utils";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { EnvService } from "src/app/env.service";
import { Message } from "src/app/shared/Message";
import { CheckValidDateV2 } from "src/app/shared/getDate";
import { getHeightBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3, getTrangThaiSuDungs, getUyNhiemLapHoaDons } from "src/app/shared/SharedFunction";
import { SumwidthConfig } from "src/app/shared/global";
import { AddEditBoKyHieuHoaDonComponent } from "../modals/add-edit-bo-ky-hieu-hoa-don/add-edit-bo-ky-hieu-hoa-don.component";
import { XacNhanSuDungModalComponent } from "../modals/xac-nhan-su-dung-modal/xac-nhan-su-dung-modal.component";
import { BoKyHieuHoaDonService } from "src/app/services/quan-ly/bo-ky-hieu-hoa-don.service";
import { CanhBaoXacThucSuDungComponent } from "../modals/canh-bao-xac-thuc-su-dung/canh-bao-xac-thuc-su-dung.component";
import { XemMauHoaDonModalComponent } from "../../danh-muc/quan-ly-hoa-don-dien-tu/modals/xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component";
import { TextGlobalConstants } from "src/app/shared/TextGlobalConstants";
import { SharedService } from "src/app/services/share-service";
import { Subscription } from "rxjs";
import { MauHoaDonService } from "src/app/services/danh-muc/mau-hoa-don.service";
import { CookieConstant } from "src/app/constants/constant";
import { MessageBoxModalComponent, MessageType } from "src/app/shared/modals/message-box-modal/message-box-modal.component";
import { OptionDangKyUyNhiemLapHoaDonModalComponent } from "../modals/option-dang-ky-uy-nhiem-lap-hoa-don-modal/option-dang-ky-uy-nhiem-lap-hoa-don-modal.component";
import { ActivatedRoute } from "@angular/router";
import { TabThongDiepGuiComponent } from "../tab-thong-diep-gui/tab-thong-diep-gui.component";
import { CookieService } from "ngx-cookie-service";
import { HoSoHDDTService } from "src/app/services/danh-muc/ho-so-hddt.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: 'app-tab-bo-ky-hieu-hoa-don',
  templateUrl: './tab-bo-ky-hieu-hoa-don.component.html',
  styleUrls: ['./tab-bo-ky-hieu-hoa-don.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabBoKyHieuHoaDonComponent extends TabShortKeyEventHandler implements OnInit, OnDestroy {
  @ViewChild('filterColumnTemp', { static: false }) filterColumnTemp: FilterColumnComponent;
  widthConfig = ['50px', '150px', '90px', '170px', '200px', '350px', '130px', '130px', '150px', '130px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '250px' };
  modal = '';
  mapOfExpandedData: { [key: number]: any[] } = {};
  mapOfExpandedData_luyKe: { [key: number]: any[] } = {};
  listPaging: any[] = [];
  listAll: any[] = [];
  loading = false;
  total = 0;
  pageSizeOptions = [];
  chiTiets: any[] = [];
  loadingChiTiets: boolean;
  filterColVisible = false;
  displayData: any = {
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    Ky: 5,
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    kyHieus: [null],
    trangThaiSuDungs: [-1],
    uyNhiemLapHoaDon: -1,
    TimKiemTheo: null,
    GiaTri: null,
    filterColumns: [],
    loaiHoaDons: [-1],
    MauHoaDonDuocPQ: [],
  };
  displayDataTemp: any = Object.assign({}, this.displayData);
  displayDataRaw: any = Object.assign({}, this.displayData);
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
  numberChiTietCols = [];
  lstChiTietEmpty = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  permission: boolean = false;
  thaoTacs: any[] = [];
  timKiemTheos: Array<{ value: any, name: any, checked: boolean }> = [
    { value: 'KyHieu', name: 'Ký hiệu', checked: false },
    { value: 'TenTrangThaiSuDung', name: 'Trạng thái sử dụng', checked: false },
    { value: 'TenUyNhiemLapHoaDon', name: 'Ủy nhiệm lập hóa đơn', checked: false },
    { value: 'TenMauHoaDon', name: 'Tên mẫu hóa đơn', checked: false },
    { value: 'NgayCapNhatFilter', name: 'Ngày cập nhật', checked: false },
  ];
  loaiThongDiepNhans = [];
  trangThaiSuDungs = getTrangThaiSuDungs(true);
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons(true);
  tab1TitleChiTiet = '';
  tab2TitleChiTiet = '';
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  hasToKhaiDuocChapNhan = false;
  //
  sub: Subscription;
  boKyHieuHoaDonDuocSuDungs: any;
  //
  boolCoPhatSinhUyNhiemLapHoaDon = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCoPhatSinhUyNhiemLapHoaDon').giaTri;
  coPhatSinhUyNhiemLapHoaDon = this.boolCoPhatSinhUyNhiemLapHoaDon === 'true' || this.boolCoPhatSinhUyNhiemLapHoaDon === true;
  swHoadon = true;
  swPhieuXuatKho = true;
  swVeDienTu = true;
  isHoaDon = true;
  selectContentHD = 3;
  obj_nghiepvu: any = [];
  obj_nghiepvu_name = 'obj_nghiepvu_' + localStorage.getItem("userId");
  thaoTacNNTs: any[] = [];
  mauHoaDonDuocPQ: any;

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private env: EnvService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private userService: UserService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private hoSoHDDTService: HoSoHDDTService,
    private cookieService: CookieService,
  ) {
    super();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.lstBangKeEmpty = getListEmptyBangKe(this.listPaging);
  //   this.scrollConfig.y = (getHeightBangKeKhongChiTiet5()) + "px";
  // }
  checkPermission() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.displayData.MauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
        this.LoadData();
      })
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "BoKyHieuHoaDon").thaoTacs;
      this.boKyHieuHoaDonDuocSuDungs = pq.mauHoaDonIds;
      this.displayData.MauHoaDonDuocPQ = pq.mauHoaDonIds;

    }
  }
  ngOnInit() {
    this.checkPermission();
    if (this.cookieService.get(this.obj_nghiepvu_name)) {
      this.obj_nghiepvu = JSON.parse(this.cookieService.get(this.obj_nghiepvu_name));
      this.selectContentHD = this.obj_nghiepvu[0].nghiepvu.hoadondt ? 3 : this.obj_nghiepvu[0].nghiepvu.phieuXuatKho ? 4 : 5;
      this.isHoaDon = this.obj_nghiepvu[0].loainghiepvu == 1;
      this.swHoadon = this.obj_nghiepvu[0].nghiepvu.hoadondt;
      this.swPhieuXuatKho = this.obj_nghiepvu[0].nghiepvu.phieuXuatKho;
      this.swVeDienTu = this.obj_nghiepvu[0].nghiepvu.veDienTu;
    }
    //set mặc định load nghiệp vụ là hóa đơn thì chọn loại là hóa đơn
    if (this.selectContentHD == 3) this.displayData.loaiHoaDons = [1, 2, 9, 10];

    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res.type === 'loadData' && res.value) {
        this.checkPermission();
        this.LoadData();
      }
    });
    // this.getAll();
    this.getThongTinToKhaiMoiNhat();

    this.loadViewConditionList();
    //khi click ở bảng điều khiển
    this.activatedRoute.queryParams.subscribe(params => {
      const tabIndex = params['tbkh'];
      if (tabIndex) {
        this.showAddNewModal(tabIndex);
      }
    });
    this.changeNVHD(3);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // getAll() {
  //   this.boKyHieuHoaDonService.GetAll().subscribe((res: any[]) => {
  //     this.listAll = res;

  //     this.listAll.forEach((item: any) => {
  //       item.checked = true;
  //     });

  //     this.listAll.unshift({
  //       boKyHieuHoaDonId: null,
  //       kyHieu: 'Tất cả',
  //       checked: true
  //     });
  //   });
  // }

  getThongTinToKhaiMoiNhat() {
    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        this.hasToKhaiDuocChapNhan = !!res;
      });
  }

  LoadData(reset: boolean = false) {
    if (reset) {
      this.displayData.PageNumber = 1;
    }
    this.loading = true;
    this.boKyHieuHoaDonService.GetAllPaging(this.displayData).subscribe((data: any) => {
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
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet3(this.listPaging);
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';

      if (this.listPaging && this.listPaging.length > 0) {
        this.selectedRow(this.listPaging[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listPaging, "thongDiepChungId").then((result) => {
        this.selectedRow(result);
      });
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

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;
    this.listPaging.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });
  }

  sort(sort: { key: string; value: string }): void {
    this.displayData.SortKey = sort.key;
    this.displayData.SortValue = sort.value;
    this.LoadData();
  }

  xemMauHoaDon() {
    if (!this.dataSelected) {
      return;
    }

    const modal = this.modalService.create({
      nzTitle: 'Xem mẫu hóa đơn',
      nzContent: XemMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1000,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '5px' },
      nzComponentParams: {
        id: this.dataSelected.mauHoaDon.mauHoaDonId,
        kySo: !this.dataSelected.mauHoaDon.ngayKy,
        fromBoKyHieuHoaDon: true
      },
      nzFooter: null
    });
  }

  async clickSua(isCopy: any, isView = false) {
    if (!this.dataSelected) {
      return;
    }

    if (!isView) {
      if (!isCopy && this.permission != true && this.boKyHieuHoaDonDuocSuDungs.indexOf(this.dataSelected.boKyHieuHoaDonId) < 0) {
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
            msTitle: `Sửa bộ ký hiệu hóa đơn`,
            msContent: `Bạn không có quyền sửa ký hiệu <b>${this.dataSelected.kyHieu}</b>. Hãy liên hệ với người dùng có quyền Quản trị hệ thống để được cấp quyền.`,
            msOnClose: () => {
            },
          }
        });
        return;
      }
    }
    // if (this.dataSelected.soLonNhatDaLapDenHienTai >= 1 && !isView) {
    //   const modal = this.ActivedModal = this.modalService.create({
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
    //       msOkButtonInBlueColor: false,
    //       msTitle: 'Kiểm tra lại',
    //       msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.dataSelected.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn không được phép sửa. Vui lòng kiểm tra lại!`,
    //       msOnClose: () => {
    //         ///////////////////////////
    //       }
    //     },
    //     nzFooter: null
    //   });
    //   modal.afterClose.subscribe(() => {
    //     this.ActivedModal = null;
    //   })
    //   return;
    // }
    this.boKyHieuHoaDonService.GetById(this.dataSelected.boKyHieuHoaDonId)
      .subscribe((res: any) => {
        if (res) {
          if (isCopy) {
            res.boKyHieuHoaDonId = null;
            res.soLonNhatDaLapDenHienTai = null;
            res.trangThaiSuDung = 0;
          }

          // call modal
          const modal = this.ActivedModal = this.modalService.create({
            nzTitle: 'Bộ ký hiệu hóa đơn',
            nzContent: AddEditBoKyHieuHoaDonComponent,
            nzMaskClosable: true,
            nzClosable: true,
            nzKeyboard: false,
            nzWidth: '90%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '0', height: `${window.innerHeight - 50}px` },
            nzComponentParams: {
              isAddNew: false,
              isView,
              isCopy,
              data: res
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
            if (rs) {
              this.checkPermission();
              this.LoadData();
            }
          });
        }
      });
  }

  clickXoa() {
    if (!this.dataSelected) {
      return;
    }
    if (this.ActivedModal != null) return;

    if (this.permission != true && this.boKyHieuHoaDonDuocSuDungs.indexOf(this.dataSelected.boKyHieuHoaDonId) < 0) {
      const modal = this.ActivedModal = this.modalService.create({
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
          msTitle: `Xóa bộ ký hiệu hóa đơn`,
          msContent: `Bạn không có quyền xóa ký hiệu <b>${this.dataSelected.kyHieu}</b>.Hãy liên hệ với người dùng có quyền Quản trị hệ thống để được cấp quyền.`,
          msOnClose: () => {
          },
        }
      });
      modal.afterClose.subscribe(() => {
        this.ActivedModal = null;
      })
      return;
    }

    if (this.dataSelected.soLonNhatDaLapDenHienTai >= 1) {
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
          msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.dataSelected.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn không được phép xóa. Vui lòng kiểm tra lại!`,
          msOnClose: () => {
            ///////////////////////////
          }
        },
        nzFooter: null
      });
      modal.afterClose.subscribe(() => {
        this.ActivedModal = null;
      })
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
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: `Xóa bộ ký hiệu hóa đơn`,
        msContent: 'Bạn có thực sự muốn xóa bộ ký hiệu hóa đơn này không?',
        msOnClose: () => {
          return;
        },
        msOnOk: () => {
          this.boKyHieuHoaDonService.Delete(this.dataSelected.boKyHieuHoaDonId).subscribe((rs: any) => {
            if (rs.result === 'DbUpdateException') {
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
                  msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.dataSelected.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn chỉ được phép xóa khi xóa hóa đơn liên quan. Vui lòng kiểm tra lại!`,
                  msOnClose: () => {
                    ///////////////////////////
                  }
                },
                nzFooter: null
              });
              modal.afterClose.subscribe(() => {
                this.ActivedModal = null;
              })
              return;
            }
            if (rs) {
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.LoadData();
            } else {
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
                  msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.dataSelected.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn chỉ được phép xóa khi xóa hóa đơn liên quan. Vui lòng kiểm tra lại!`,
                  msOnClose: () => {
                    ///////////////////////////
                  }
                },
                nzFooter: null
              });
              modal.afterClose.subscribe(() => {
                this.ActivedModal = null;
              })
              return;
            }
          }, _ => {
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
                msContent: `Ký hiệu <b class = "colorChuYTrongThongBao">${this.dataSelected.kyHieu}</b> đã phát sinh hóa đơn sử dụng.<br/>Bạn chỉ được phép xóa khi xóa hóa đơn liên quan. Vui lòng kiểm tra lại!`,
                msOnClose: () => {
                  ///////////////////////////
                }
              },
              nzFooter: null
            });
            modal.afterClose.subscribe(() => {
              this.ActivedModal = null;
            })
            return;
          })
        },
      }
    });
    modal.afterClose.subscribe(() => {
      this.ActivedModal = null;
    })
  }

  clickXem() {

  }

  clickThem() {
    if (this.hasToKhaiDuocChapNhan) {
      if (this.coPhatSinhUyNhiemLapHoaDon) {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: 'Đăng ký ủy nhiệm lập hóa đơn',
          nzContent: OptionDangKyUyNhiemLapHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {},
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          if (rs != null) {
            if (rs) { // ủy nhiệm lập hóa đơn
              /////////////////////
            } else {
              this.showAddNewModal(rs);
            }
          }
        });
      } else {
        this.showAddNewModal();
      }
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
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msOkButtonInBlueColor: true,
          msTitle: 'Lập tờ khai đăng ký sử dụng',
          msContent: `<div>Không thể tạo ký hiệu hóa đơn do chưa tồn tại tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử được cơ quan thuế chấp nhận.</div>
          <br />
          <div>Bạn có muốn lập tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử không?</div>`,
          msOnOk: () => {
            this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
              if (!rs || !rs.tenDonVi || rs.tenDonVi == '' || !rs.diaChi || rs.diaChi == '' || !rs.phuongPhapTinhThueGTGT || !rs.coQuanThueQuanLy || !rs.coQuanThueCapCuc) {
                if (this.thaoTacNNTs.indexOf('SYS_VIEW') >= 0 || this.permission == true) {
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
                      msOnCapNhatThongTinNNT: () => {
                        window.location.href = "he-thong/thong-tin-nguoi-nop-thue";
                      },
                      msOnClose: () => {
                        return;
                      }
                    },
                    nzFooter: null
                  });

                }
                else {
                  this.userService.getAdminUser().subscribe((rs: any[]) => {
                    let content = '';
                    if (rs && rs.length > 0) {
                      if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                      }
                      else {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                      }
                    }
                    else {
                      if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
                      }
                      else {
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
                        msOnClose: () => {
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  })
                }
              }
              else this.tabThongDiepGuiComponent.clickThem();

            })
          },
          msOnClose: () => { }
        },
        nzFooter: null
      });
      return;
    }
  }

  showAddNewModal(isUyNhiemLapHoaDon = false) {
    // call modal
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Bộ ký hiệu hóa đơn',
      nzContent: AddEditBoKyHieuHoaDonComponent,
      nzMaskClosable: true,
      nzClosable: true,
      nzKeyboard: false,
      nzWidth: '90%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '0', height: `${window.innerHeight - 50}px` },
      nzComponentParams: {
        isAddNew: true,
        isUyNhiemLapHoaDon
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        this.checkPermission();
        this.LoadData();
      }
    });
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

    if (this.displayData.kyHieus.some(x => x != null)) {
      this.viewConditionList.push({ key: 'KyHieu', label: 'Ký hiệu: ', value: this.getNameOfKyHieuFilter() });
    }
    if (this.displayData.trangThaiSuDungs.some(x => x !== -1)) {
      this.viewConditionList.push({ key: 'TrangThaiSuDung', label: 'Trạng thái sử dụng: ', value: this.getNameOfTrangThaiSuDungFilter() });
    }
    if (this.displayData.uyNhiemLapHoaDon !== -1) {
      this.viewConditionList.push({ key: 'UyNhiemLapHoaDon', label: 'Ủy nhiệm lập hóa đơn: ', value: this.getNameOfUyNhiemLapHoaDonFilter() });
    }

    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }

    this.displayData.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        const data = {
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: [{ key: item.colKey, value: item.colValue, type: item.colKey }]
        };

        this.viewConditionList.push(data);
      }
    });

    this.LoadData(true);
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

  getNameOfKyHieuFilter() {
    const result = this.listAll
      .filter(x => this.displayData.kyHieus.includes(x.boKyHieuHoaDonId))
      .map(x => {
        return {
          key: x.boKyHieuHoaDonId,
          value: x.kyHieu,
          type: 'KyHieu'
        };
      });

    return result;
  }

  getNameOfTrangThaiSuDungFilter() {
    const result = this.trangThaiSuDungs
      .filter(x => this.displayData.trangThaiSuDungs.includes(x.key))
      .map(x => {
        return {
          key: x.key,
          value: x.value,
          type: 'TrangThaiSuDung'
        };
      });

    return result;
  }

  getNameOfUyNhiemLapHoaDonFilter() {
    const findData = this.uyNhiemLapHoaDons.find(x => x.key === this.displayData.uyNhiemLapHoaDon);
    if (findData) {
      var data = [{
        key: findData.key,
        value: findData.value,
        type: 'UyNhiemLapHoaDon'
      }];
      return data;
    }

    return [];
  }

  removeFilter(filter: any) {
    switch (filter.type) {
      case 'KyHieu':
        this.displayDataTemp.kyHieus = this.displayDataTemp.kyHieus.filter(x => x !== filter.key);
        if (this.displayDataTemp.kyHieus.length === 0) {
          this.displayDataTemp.kyHieus = [null];
        }
        break;
      case 'TrangThaiSuDung':
        this.displayDataTemp.trangThaiSuDungs = this.displayDataTemp.trangThaiSuDungs.filter(x => x !== filter.key);
        if (this.displayDataTemp.trangThaiSuDungs.length === 0) {
          this.displayDataTemp.trangThaiSuDungs = [-1];
        }
        break;
      case 'UyNhiemLapHoaDon':
        this.displayDataTemp.uyNhiemLapHoaDon = -1;
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
    var giaTris = this.displayData.GiaTri ? this.displayData.GiaTri.split(',') : [];
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

  changeKyHieu(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == null)) {
          this.displayDataTemp.kyHieus = event.filter(x => x != null);
        }
      } else {
        this.displayDataTemp.kyHieus = [null];
      }
    }
  }

  changeTrangThaiSuDung(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem !== -1) {
        if (event.some(x => x === -1)) {
          this.displayDataTemp.trangThaiSuDungs = event.filter(x => x !== -1);
        }
      } else {
        this.displayDataTemp.trangThaiSuDungs = [-1];
      }
    }
  }

  confirmSuDung() {
    if (!this.dataSelected) {
      return;
    }

    this.boKyHieuHoaDonService.GetById(this.dataSelected.boKyHieuHoaDonId)
      .subscribe((res: any) => {
        if (!res.mauHoaDon.ngayKy && res.toKhaiForBoKyHieuHoaDon.trangThaiGui !== 5) {
          if (!res.mauHoaDon.ngayKy) {
            const modal = this.modalService.create({
              nzTitle: '<b>Kiểm tra lại</b>',
              nzContent: CanhBaoXacThucSuDungComponent,
              nzClassName: 'no-button-confirm',
              nzComponentParams: {
                message: `<div>- Mẫu hóa đơn &lt;<strong>${res.mauHoaDon.ten}</strong>&gt; chưa ký điện tử.</div>
                <div>Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử &lt;<strong>${res.toKhaiForBoKyHieuHoaDon.maThongDiepGui}</strong>&gt; chưa được CQT chấp nhận.</div>
                <div>Vui lòng kiểm tra lại!</div>`,
                dataSelected: res
              },
              nzOkText: null,
              nzCancelText: null,
            });
            modal.afterClose.subscribe((rs: any) => {
              if (rs) {
                this.showXacThucHoaDon(false, res);
              }
            });
            return;
          }
        } else {
          if (!res.mauHoaDon.ngayKy) {
            const modal = this.modalService.create({
              nzTitle: '<b>Kiểm tra lại</b>',
              nzContent: CanhBaoXacThucSuDungComponent,
              nzClassName: 'no-button-confirm',
              nzComponentParams: {
                message: `Mẫu hóa đơn &lt;<strong>${res.mauHoaDon.ten}</strong>&gt; chưa ký điện tử. Vui lòng kiểm tra lại!`,
                dataSelected: res
              },
              nzOkText: null,
              nzCancelText: null,
            });
            modal.afterClose.subscribe((rs: any) => {
              if (rs) {
                this.showXacThucHoaDon(false, res);
              }
            });
            return;
          }

          if (res.toKhaiForBoKyHieuHoaDon.trangThaiGui !== 5) {
            const modal = this.modalService.create({
              nzTitle: '<b>Kiểm tra lại</b>',
              nzContent: CanhBaoXacThucSuDungComponent,
              nzClassName: 'no-button-confirm',
              nzComponentParams: {
                message: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử
                &lt;<strong>${res.toKhaiForBoKyHieuHoaDon.maThongDiepGui}</strong>&gt;
                chưa được CQT chấp nhận. Vui lòng kiểm tra lại!`,
                dataSelected: res
              },
              nzOkText: null,
              nzCancelText: null,
            });
            modal.afterClose.subscribe((rs: any) => {
              if (rs) {
                this.showXacThucHoaDon(false, res);
              }
            });
            return;
          }
        }

        this.showXacThucHoaDon(true, res);
      });
  }

  showXacThucHoaDon(isXacThuc: boolean, data: any) {
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: 'Xác thực sử dụng',
      nzContent: XacNhanSuDungModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 550,
      nzClassName: "my-modal",
      nzStyle: { top: '0', right: '0', position: 'absolute' },
      nzBodyStyle: { padding: '0', height: `${window.innerHeight - 80}px` },
      nzComponentParams: {
        isXacThuc,
        data
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.ActivedModal = null;
      if (rs) {
        data.trangThaiSuDung = rs;
        this.LoadData();
      }
    });
  }

  checkFilterKyHieu(data: any) {
    if (!data.boKyHieuHoaDonId) { // check all
      this.listAll.filter(x => !!x.boKyHieuHoaDonId).forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.listAll[0].checked = this.listAll.filter(x => !!x.boKyHieuHoaDonId).every(x => x.checked);
    }

    setTimeout(() => {
      this.displayDataTemp.kyHieus = this.listAll[0].checked ? [null] : this.listAll.filter(x => !!x.boKyHieuHoaDonId && x.checked).map(x => x.boKyHieuHoaDonId);
    }, 0);
  }

  checkFilterTrangThaiSuDung(data: any) {
    if (data.key === -1) { // check all
      this.trangThaiSuDungs.filter(x => x.key !== -1).forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.trangThaiSuDungs[0].checked = this.trangThaiSuDungs.filter(x => x.key !== -1).every(x => x.checked);
    }

    setTimeout(() => {
      this.displayDataTemp.trangThaiSuDungs = this.trangThaiSuDungs[0].checked ? [-1] : this.trangThaiSuDungs.filter(x => x.key !== -1 && x.checked).map(x => x.key);
    }, 0);
  }
  changeNVHD(event: any) {
    let radioButton = document.getElementsByClassName("btn-nvhd");
    for (let i = 0; i < radioButton.length; ++i) {
      let el = radioButton[i] as HTMLElement;
      let nzvalue = radioButton[i].getAttribute('data-value');
      if (event == nzvalue) {
        if (event == 3) {
          el.classList.add('hoaDonActive');
        } if (event == 4) {
          el.classList.add('phieuXuatKhoActive');
        }
        if (event == 5) {
          el.classList.add('veDienTuActive');
        }
        el.classList.remove('switchSelectHover');
      } else {
        if (event == 3) {
          el.classList.remove('phieuXuatKhoActive');
          el.classList.remove('veDienTuActive');
        } if (event == 4) {
          el.classList.remove('hoaDonActive');
          el.classList.remove('veDienTuActive');
        }
      } if (event == 5) {
        el.classList.remove('phieuXuatKhoActive');
        el.classList.remove('hoaDonActive');
      }
      el.classList.add('switchSelectHover');
    }

    if (event == 3) {
      this.displayData.loaiHoaDons = [1, 2, 9, 10];
      this.LoadData(true);
    } else if (event == 4) {
      this.displayData.loaiHoaDons = [7, 8];
      this.LoadData(true);
    } else if (event == 5) {
      this.displayData.loaiHoaDons = [14, 15];
      this.LoadData(true);
    } else {
      this.listPaging = [];
      this.chiTiets = [];
      this.total = 0;
    }
  }
}
