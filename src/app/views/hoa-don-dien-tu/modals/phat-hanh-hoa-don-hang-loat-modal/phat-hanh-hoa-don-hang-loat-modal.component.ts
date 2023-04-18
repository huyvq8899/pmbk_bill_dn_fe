import { Component, Input, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { SumwidthConfig } from 'src/app/shared/global';
import { LichSuTruyenNhanComponent } from '../lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { TabHoaDonDienTuComponent } from '../../tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import * as moment from 'moment';
import { DownloadFile, generateUUIDV4, getNoiDungLoiKyDienTuChoNhatKy, getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { Router } from '@angular/router';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { forEach } from 'jszip';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-phat-hanh-hoa-don-hang-loat-modal',
  templateUrl: './phat-hanh-hoa-don-hang-loat-modal.component.html',
  styleUrls: ['./phat-hanh-hoa-don-hang-loat-modal.component.scss']
})
export class PhatHanhHoaDonHangLoatModalComponent implements OnInit {
  @Input() listSelectedIdFromTab = []; // danh sách id chọn từ tab
  @Input() isGuiCQT: boolean = false;
  @Input() isTuMTT: boolean = false;
  @Input() fromDate = null;
  @Input() toDate = null;
  selectedIndex = 0;
  isLoading = false;
  kys = GetList();
  displayData = {
    PageNumber: 1,
    PageSize: 100,
    ky: 5,
    fromDate: null,
    toDate: null,
    giaTri: '',
    mauHoaDonDuocPQ: [],
    timKiemTheo: null,
    permission: false,
    boKyHieuHoaDonId: '-1',
    hoaDonDienTuId: null,
    HoaDonDienTuIds: [],
    LoaiNghiepVu: 1,
    GuiCQT: false
  };
  displayDataAll = {
    PageNumber: 1,
    PageSize: -1,
    ky: 5,
    fromDate: null,
    toDate: null,
    giaTri: '',
    mauHoaDonDuocPQ: [],
    timKiemTheo: null,
    permission: true,
    boKyHieuHoaDonId: '-1',
    hoaDonDienTuId: null,
    HoaDonDienTuIds: [],
    LoaiNghiepVu: 1,
    GuiCQT: false
  };
  displayDataRaw = null;
  timKiemTheos: Array<{ value: any, label: any, checked: boolean }> = [
    { value: 'MauSo', label: 'Ký hiệu mẫu số hóa đơn', checked: false },
    { value: 'KyHieu', label: 'Ký hiệu hóa đơn', checked: false },
    // { value: 'SoHoaDon', label: 'Số hóa đơn', checked: true },
    { value: 'MaSoThue', label: 'Mã số thuế', checked: false },
    { value: 'MaKhachHang', label: 'Mã khách hàng', checked: false },
    { value: 'TenKhachHang', label: 'Tên khách hàng', checked: false },
    { value: 'NguoiMuaHang', label: 'Người mua hàng', checked: false },
  ];
  listData = [];
  listGroup = [];
  listFlat = [];
  listObj = [];
  listResult = [];
  hasErrorResult = false;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  countToSend = 0;
  widthConfig = ['50px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
  total = 0;
  totalPages = 0;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: any = {};
  mapOfThongDiepChungId: any = {};
  mapOfHoaDonId: any = {};
  listOfSelected = [];
  dataSelected = null;
  ddtp = new DinhDangThapPhan();
  permission: boolean = false;
  thaoTacs: any[] = [];
  mauHoaDonDuocPQ = [];
  boKyHieuHoaDons = [];
  isClickedSave = false;
  hoSoHDDT = null;
  webSubcription: Subscription;
  isCoHoaDonNhoHonHoaDonDangPhatHanh = false;
  numberSuccess = 0;
  numberTotal = 0;
  listError = [];
  percentPhatHanh = 0;
  countPhatHanh = 0;
  totalPhatHanh = 0;
  isLoadBangKe = false;
  listMsgSocket = [];
  startTimeToListen = null;
  countListenResponse = 0;
  hasHoaDonCoMa = false;
  hasHoaDonCoMaTuMTT = false;
  disabledCapNhatNgayHoaDonVeHienTai = true;
  listBoKyHieuDuocPhepPhatHanh = [];
  isPhieuXuatKho = false;
  paramPhatHanh = {
    hoaDonDienTuId: null,
    skipCheckHetHieuLucTrongKhoang: true,
    skipChecNgayKyLonHonNgayHoaDon: true,
    skipCheckChenhLechThanhTien: true,
    skipCheckChenhLechTienChietKhau: true,
    skipCheckChenhLechTienThueGTGT: true,
    skipCheckHoaDonNhoHonHoaDonDangPhatHanh: true,
    isPhatHanh: true,
    hoaDon: null
  };
  serials: any[] = [];
  isPos: boolean = false;
  isSelectChuKiCung = isSelectChuKiCung(this.tuyChonService);

  constructor(
    private env: EnvService,
    private message: NzMessageService,
    private modal: NzModalRef,
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nzContextMenuService: NzContextMenuService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private hoSoHDDTService: HoSoHDDTService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private modalService: NzModalService,
    private webSocket: WebSocketService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private tabHoaDonDienTuComp: TabHoaDonDienTuComponent,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private tuyChonService: TuyChonService
  ) {

  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.displayData.LoaiNghiepVu = 2;
      this.displayDataAll.LoaiNghiepVu = 2;
    }
    else if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
      this.displayData.LoaiNghiepVu = 3;
      this.displayDataAll.LoaiNghiepVu = 3;
      this.displayData.GuiCQT = this.isGuiCQT;
      this.displayDataAll.GuiCQT = this.isGuiCQT;
    }
    else {
      this.displayData.LoaiNghiepVu = 1;
      this.displayDataAll.LoaiNghiepVu = 1;
    }

    if(this.isTuMTT){
      this.displayData.PageSize = 500;
    }

    this.displayData.HoaDonDienTuIds = this.listSelectedIdFromTab;
    this.displayData.fromDate = this.fromDate;
    this.displayData.toDate = this.toDate;

    if(this.isSelectChuKiCung == 'KiCung') this.createSocket();

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.displayData.permission = this.permission;
    } else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
      this.displayData.mauHoaDonDuocPQ = this.mauHoaDonDuocPQ;
    }

    this.displayDataRaw = Object.assign({}, this.displayData);

    this.isLoading = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.boKyHieuHoaDons = res[0];
      /// Filter Bộ Ký Hiệu
      if (this.isPhieuXuatKho) {
        this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => x.loaiHoaDon != 1 && x.loaiHoaDon != 2 && x.hinhThucHoaDon != 2);
      }
      else if (this.isPos) {
        this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => (x.hinhThucHoaDon != 0 && x.hinhThucHoaDon != 1));
        this.boKyHieuHoaDons.unshift({ boKyHieuHoaDonId: '-1', kyHieu: 'Tất cả' })
        this.displayData.boKyHieuHoaDonId = '-1';

      } else if (this.displayData.LoaiNghiepVu == 1) {
        this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => x.loaiHoaDon != 7 && x.loaiHoaDon != 8 && x.hinhThucHoaDon != 2);
      }
      console.log("🚀 ~ file: phat-hanh-hoa-don-hang-loat-modal.component.ts:200 ~ PhatHanhHoaDonHangLoatModalComponent ~ this.forkJoin ~ this.boKyHieuHoaDons", this.boKyHieuHoaDons)

      this.hoSoHDDT = res[1];

      if (this.displayData.fromDate && this.displayData.toDate) {
        this.displayData.ky = GetKy(this.displayData);
      } else {
        if (res[1].kyTinhThue === 0) {
          this.displayData.ky = 4;
          this.changeKy(4);
        } else {
          this.displayData.ky = 6;
          this.changeKy(6);
        }
      }

      if (res[2]) {
        this.listData = res[2].items;
        this.total = res[2].totalCount;
        this.totalPages = res[2].totalPages;
        this.checkAll(true);
      }

      this.serials = res[3];

      this.isLoading = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.boKyHieuHoaDonService.GetListForPhatHanhDongLoat(this.displayData),
      this.hoSoHDDTService.GetDetail(),
      this.listSelectedIdFromTab.length > 0 ? this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(this.displayData) : of(null),
      this.quyDinhKyThuatService.GetAllListCTS()
    ]);
  }

  destroyModal() {
    this.modal.destroy();
  }

  clickBack() {
    this.selectedIndex--;
    this.isClickedSave = false;
    if (this.selectedIndex === 0) {
      this.widthConfig = ['50px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
    } else if (this.selectedIndex === 1) {
      this.widthConfig = ['150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px', '200px'];
    }

    this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
  }

  clickNext() {
    if (this.selectedIndex === 0) {
      let entries = Object.entries(this.mapOfCheckedId);
      var listIds = [];
      for (const [prop, val] of entries) {
        if (val) {
          listIds.push(prop);
        }
      }

      if (listIds.length === 0) {
        this.message.warning('Vui lòng chọn hóa đơn để phát hành');
        return;
      }

      this.isLoading = true;
      this.listOfSelected = this.listData.filter(x=>listIds.includes(x.hoaDonDienTuId));
      this.hoaDonDienTuService.GroupListDeXemDuLieuPhatHanhDongLoat(this.listOfSelected)
        .subscribe((resGroup: any[]) => {
          resGroup.forEach((item: any) => {
            if (item.hasHoaDonNhoHon && this.listBoKyHieuDuocPhepPhatHanh.includes(item.boKyHieuHoaDonId)) {
              item.hasHoaDonNhoHon = false;
            }
          });
          var listConfirmUpdate = resGroup.filter(x => x.hasHoaDonKhacNhau || x.hasHoaDonNhoHon);
          if (listConfirmUpdate.length > 0 && !this.isGuiCQT) {
            this.canhBaoNgayHoaDon(listConfirmUpdate, () => {
              var hasStopToNext = listConfirmUpdate.some(x => x.stopToNext);
              if (hasStopToNext) {
                this.isLoading = false;
                return;
              }

              // var everyUpdatedNgayHoaDon = listConfirmUpdate.every(x => x.updatedNgayHoaDon);
              // if (everyUpdatedNgayHoaDon) {
              //   this.clickNext();
              //   return;
              // }

              this.clickNext();
              return;
            });
          } else {
            this.listGroup = resGroup;
            this.widthConfig = ['150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px', '200px'];
            this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '480px' };
            this.mapOfThongDiepChungId = {};
            this.mapOfHoaDonId = {};
            this.selectedIndex++;
            this.checkHoaDonPhatHanh();
          }
        });
    } else if (this.selectedIndex === 1) {
      this.boKyHieuHoaDonService.GetListForPhatHanhDongLoat(this.displayData).subscribe((bokyhieu: any) => {
        if (this.canhBaoVuotSoLuongBoKyHieu(bokyhieu)) {

          this.isLoading = false;
          return;
        }
        if (this.listFlat.some(x => x.hasError === true)) {
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
              msContent: 'Không thể thực hiện do có dòng dữ liệu không hợp lệ. Vui lòng kiểm tra lại!',
            },
            nzFooter: null
          });
          return;
        } else {
          this.isLoading = true;
          this.PhatHanhHoaDon();
        }
      })
    } else if (this.selectedIndex === 2) {
      this.isLoadBangKe = true;
      this.modal.getInstance().nzClosable = true;
      this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();

      var hoaDonDienTuIds = this.listObj.map(x => x.hoaDonDienTuId);

      this.hoaDonDienTuService.GetKetQuaThucHienPhatHanhDongLoat(hoaDonDienTuIds)
        .subscribe((res: any[]) => {
          this.listResult = res;
          this.hasErrorResult = res.some(x => x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa && x.trangThaiQuyTrinh !== TrangThaiQuyTrinh.DaKyDienTu);
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        });
    }
  }
  canhBaoVuotSoLuongBoKyHieu(bokyhieu: any) {
    let listkyhieu = {}
    this.listOfSelected.forEach(val => {
      if (val.trangThaiQuyTrinh == 0) { listkyhieu[val.boKyHieuHoaDonId] = (listkyhieu[val.boKyHieuHoaDonId] || 0) + 1 }
    })
    var kyhieu;
    var sokyhieuconlai;
    var sokyhieucan;
    var Error = false
    bokyhieu.forEach((val: any) => {
      if ((val.soToiDa - val.soLonNhatDaLapDenHienTai) < listkyhieu[val.boKyHieuHoaDonId]) {
        kyhieu = val.kyHieu
        sokyhieucan = listkyhieu[val.boKyHieuHoaDonId]
        sokyhieuconlai = val.soToiDa - val.soLonNhatDaLapDenHienTai
        Error = true
      }
    })
    if (Error) {
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
          msContent: `Bộ ký hiệu <span class='colorChuYTrongThongBao'><b>${kyhieu}</b></span> chỉ có thể cấp tối đa thêm <span class='colorChuYTrongThongBao'><b>${sokyhieuconlai}</b></span> số hóa đơn,
          số hóa đơn cần phát hành hàng loạt của bộ ký hiệu này là <span class='colorChuYTrongThongBao'><b>${sokyhieucan}</b></span>.
          Vui lòng kiểm tra lại`
        }
      })
      return true;
    }
    return false;
  }
  canhBaoNgayHoaDon(list: any[], callback: () => any) {
    var listNgayHoaDonKhacNhau = list.filter(x => x.hasHoaDonKhacNhau);
    if (listNgayHoaDonKhacNhau.length > 0) {
      this.canhBaoNgayHoaDonKhacNhau(0, listNgayHoaDonKhacNhau, callback);
    } else {
      var listNgayHoaDonNhoHon = list.filter(x => x.hasHoaDonNhoHon);
      if (listNgayHoaDonNhoHon.length > 0) {
        this.canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(0, listNgayHoaDonNhoHon, callback);
      } else {
        callback();
      }
    }
  }

  canhBaoNgayHoaDonKhacNhau(index: any, list: any[], callback: () => any) {
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
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_BACK,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_UPDATE,
        msCloseButtonBlueColor: true,
        msCloseButtonBackIcon: true,
        msTitle: 'Phát hành hóa đơn đồng loạt',
        msContent: `Hệ thống chỉ cho phép phát hành đồng loạt các hóa đơn có cùng ngày hóa đơn.
        Bạn có thể cập nhật hóa đơn có ký hiệu <span class='colorChuYTrongThongBao'><b>${list[index].kyHieuHoaDon}</b></span> về ngày hóa đơn lớn nhất <span class='colorChuYTrongThongBao'><b>${moment(list[index].ngayHoaDon).format('DD/MM/YYYY')}</b></span>
        hoặc <span class='colorBlueTrongThongBao'><b>Quay lại</b></span> để thực hiện phát hành đồng loạt theo từng ngày.`,
        msOnOk: () => {
          var listHoaDonNhoHon = list[index].children.filter(x => moment(x.ngayHoaDon).format('YYYY-MM-DD') < moment(list[index].ngayHoaDon).format('YYYY-MM-DD'));
          var lastItem = list[index].children.at(-1);
          lastItem.children = listHoaDonNhoHon;
          this.hoaDonDienTuService.UpdateNgayHoaDonBangNgayHoaDonPhatHanh(lastItem)
            .subscribe((res: any) => {
              if (res) {
                if (res.status) {
                  list[index].updatedNgayHoaDon = true;
                  this.message.success('Cập nhật ngày hóa đơn thành công!');
                  this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(this.displayData)
                    .subscribe((res: any) => {
                      this.listData = res.items;
                      this.total = res.totalCount;
                      this.totalPages = res.totalPages;
                    });
                } else {
                  this.message.error('Cập nhật ngày hóa đơn thất bại!');
                }

                if ((index + 1) < list.length) {
                  index++;
                  this.canhBaoNgayHoaDonKhacNhau(index, list, callback);
                } else {
                  callback();
                }
              }
            })
        },
        msOnClose: () => {
          list[index].stopToNext = true;
          if ((index + 1) < list.length) {
            index++;
            this.canhBaoNgayHoaDonKhacNhau(index, list, callback);
          } else {
            callback();
          }
        }
      },
      nzFooter: null
    });
  }

  canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(index: any, list: any[], callback: () => any) {
    const modal = this.modalService.create({
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
        msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
        msOkButtonInBlueColor: false,
        msTitle: 'Kiểm tra lại',
        msContent: `<div class='mg-bottom-5'>Bạn đang thực hiện phát hành hóa đơn có ký hiệu <span class='colorChuYTrongThongBao'><b>${list[index].kyHieuHoaDon}</b></span> ngày hóa đơn <span class='colorChuYTrongThongBao'><b>${moment(list[index].ngayHoaDon).format("DD/MM/YYYY")}</b></span>.</div>
        <div class='mg-bottom-5'>Tồn tại <b>${list[index].count}</b> hóa đơn có ký hiệu <span class='colorChuYTrongThongBao'><b>${list[index].kyHieuHoaDon}</b></span> số hóa đơn <span class='colorChuYTrongThongBao'><b>Chưa cấp số</b></span> có ngày hóa đơn nhỏ hơn ngày hóa đơn của hóa đơn này.</div>
        <div class='mg-bottom-5'>Cụ thể số lượng hóa đơn chưa cấp số theo trạng thái quy trình:</div>`,
        msCapNhatNgayHoaDon: true,
        msListHoaDonChuaCapSo: list[index].hoaDons || [],
        msOnCapNhatNgayHoaDon: () => {
          const title = 'Cập nhật ngày hóa đơn';
          const content = `Bạn có chắc chắn muốn cập nhật ngày hóa đơn là ngày <span class="colorChuYTrongThongBao"><b>${moment(list[index].ngayHoaDon).format("DD/MM/YYYY")}</b></span>
          cho các hóa đơn có ký hiệu <span class="colorChuYTrongThongBao"><b>${list[index].kyHieuHoaDon}</b></span> số hóa đơn <span class="colorChuYTrongThongBao"><b>Chưa cấp số</b></span>
          đang có ngày hóa đơn nhỏ hơn ngày <span class="colorChuYTrongThongBao"><b>${moment(list[index].ngayHoaDon).format("DD/MM/YYYY")}</b></span> không?`;

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
              msCapNhatNgayHoaDon: true,
              msTitle: title,
              msContent: content,
              msOnOk: () => {
                this.hoaDonDienTuService.UpdateNgayHoaDonBangNgayHoaDonPhatHanh(list[index].children.at(-1))
                  .subscribe((res: any) => {
                    if (res.status) {
                      list[index].updatedNgayHoaDon = true;
                      this.message.success('Cập nhật ngày hóa đơn thành công!');
                      this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(this.displayData)
                        .subscribe((res: any) => {
                          this.listData = res.items;
                          this.total = res.totalCount;
                          this.totalPages = res.totalPages;
                        });
                    } else {
                      this.message.error('Cập nhật ngày hóa đơn thất bại!');
                    }

                    if ((index + 1) < list.length) {
                      index++;
                      this.canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(index, list, callback);
                    } else {
                      callback();
                    }
                  });
              },
              msOnClose: () => {
                list[index].stopToNext = true;
                if ((index + 1) < list.length) {
                  index++;
                  this.canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(index, list, callback);
                } else {
                  callback();
                }
              }
            },
            nzFooter: null
          });
        },
        msOnOk: () => {
          if ((index + 1) < list.length) {
            index++;
            this.canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(index, list, callback);
          } else {
            callback();
          }

          this.listBoKyHieuDuocPhepPhatHanh.push(list[index].boKyHieuHoaDonId);
        },
        msOnClose: () => {
          list[index].stopToNext = true;
          if ((index + 1) < list.length) {
            index++;
            this.canhBaoCoHoaDonNhoHonHoaDonDangPhatHanh(index, list, callback);
          } else {
            callback();
          }
        }
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((res: any) => {
      if (res && res.isNgungChucNangVaXemChiTiet) {
        this.modal.destroy(res);
      }
    });
  }

  capNhatNgayHoaDon() {
    let entries = Object.entries(this.mapOfCheckedId);
    var listIds = [];
    for (const [prop, val] of entries) {
      if (val) {
        listIds.push(prop);
      }
    }

    this.isLoading = true;
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
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CANCLE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msOkButtonInBlueColor: false,
        msTitle: 'Cập nhật ngày hóa đơn',
        msContent: `Bạn có thực sự muốn cập nhật ngày hóa đơn của các hóa đơn đã chọn sang ngày hiện tại <span class='colorChuYTrongThongBao'><b>${moment().format('DD/MM/YYYY')}</b></span> không?`,
        msOnOk: () => {
          this.hoaDonDienTuService.UpdateRangeNgayHoaDonVeNgayHienTai(listIds)
            .subscribe((res: any) => {
              if (res) {
                this.message.success('Cập nhật ngày hóa đơn thành công!');
                this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(this.displayData)
                  .subscribe((res: any) => {
                    this.listData = res.items;
                    this.total = res.totalCount;
                    this.totalPages = res.totalPages;
                    this.isLoading = false;
                    this.refreshStatus();
                  });
              } else {
                this.message.success('Cập nhật ngày hóa đơn thất bại!');
                this.isLoading = false;
              }
            });
        },
        msOnClose: () => {
          this.isLoading = false;
        }
      },
      nzFooter: null
    });
  }

  checkHoaDonPhatHanh() {
    const checkHoaDonPhatHanhs = [];
    const listParam = [];
    for (const group of this.listGroup) {
      if (group.children.some(x => x.checked && x.invalid)) {
        this.isLoading = false;
        return;
      }

      for (const item of group.children) {
        const param = Object.assign({}, this.paramPhatHanh);
        param.hoaDon = item;
        param.hoaDonDienTuId = item.hoaDonDienTuId;
        listParam.push(param);
      }
    }
    checkHoaDonPhatHanhs.push(this.hoaDonDienTuService.CheckMultiHoaDonPhatHanh(listParam));

    this.listFlat = [];
    forkJoin(checkHoaDonPhatHanhs).subscribe((res: any[]) => {
      for (const group of this.listGroup) {
        for (const item of group.children) {
          const check = res[0].find(x => x != null && x.hoaDon.hoaDonDienTuId === item.hoaDonDienTuId);

          if (check && check.isYesNo != true && this.isTuMTT == false) {
            var regex = /(<([^>]+)>)/ig;
            item.errorMessage = check.errorMessage.replace(regex, '').replace('&lt;', '<').replace('&gt;', '>');
            item.hasError = true;
            item.isCoHoaDonNhoHonHoaDonDangPhatHanh = check.isCoHoaDonNhoHonHoaDonDangPhatHanh;
            this.isCoHoaDonNhoHonHoaDonDangPhatHanh = check.isCoHoaDonNhoHonHoaDonDangPhatHanh;
          } else {
            item.errorMessage = '<Hợp lệ>';
            item.hasError = false;
            item.isCoHoaDonNhoHonHoaDonDangPhatHanh = null;
          }

          this.listFlat.push(item);
        }
      }

      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  UpdateNgayHoaDonBangNgayHoaDonPhatHanh(list: any[]) {
    this.isLoading = true;
    const updateNgayHoaDons = [];
    for (const item of list) {
      updateNgayHoaDons.push(this.hoaDonDienTuService.UpdateNgayHoaDonBangNgayHoaDonPhatHanh(item));
    }

    forkJoin(updateNgayHoaDons).subscribe((res: any[]) => {
      if (res.every(x => x.status === true)) {
        var listUpdated = [];
        res.forEach((item: any) => {
          listUpdated = [...listUpdated, ...item.data];
        })

        this.listData.forEach((item: any) => {
          var find = listUpdated.find(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
          if (find) {
            item.ngayHoaDon = find.ngayHoaDon;
          }
        });

        this.listGroup.forEach((group: any) => {
          group.children.forEach((item: any) => {
            var find = listUpdated.find(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
            if (find) {
              item.ngayHoaDon = find.ngayHoaDon;
            }
          });
        });

        this.listFlat.forEach((item: any) => {
          var find = listUpdated.find(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
          if (find) {
            item.ngayHoaDon = find.ngayHoaDon;
          }
        });

        this.checkHoaDonPhatHanh();
        this.message.success('Cập nhật ngày hóa đơn thành công!');
        this.isLoading = false;
        this.isLoadBangKe = true;
        this.isCoHoaDonNhoHonHoaDonDangPhatHanh = false;
      } else {
        this.isLoading = false;
        this.message.error('Cập nhật ngày hóa đơn thất bại!');
      }
    });
  }

  PhatHanhHoaDon() {
    const boKyHieuHoaDonIds = this.listFlat.map(x => x.boKyHieuHoaDonId);

    // this.boKyHieuHoaDonService.CheckBoKyHieuDangPhatHanh(boKyHieuHoaDonIds)
    //   .subscribe((rsChechDangPH: any) => {
    //     if (rsChechDangPH.message) {
    //       this.modalService.create({
    //         nzContent: MessageBoxModalComponent,
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzKeyboard: false,
    //         nzStyle: { top: '100px' },
    //         nzBodyStyle: { padding: '1px' },
    //         nzComponentParams: {
    //           msMessageType: MessageType.Warning,
    //           msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //           msTitle: `Phát hành hóa đơn điện tử`,
    //           msContent: rsChechDangPH.message,
    //           msOnClose: () => {
    //           },
    //         }
    //       });
    //       this.isLoading = false;
    //       return;
    //     } else {
    var checkTrangThaiQuyTrinh = [];
    var hoaDonDienTuIds = this.listFlat.map(x => x.hoaDonDienTuId);
    checkTrangThaiQuyTrinh.push(this.hoaDonDienTuService.GetMultiTrangThaiQuyTrinhById(hoaDonDienTuIds));

    forkJoin(checkTrangThaiQuyTrinh).subscribe((res: any[]) => {
      if ((this.isGuiCQT != true && res[0].some(x => x !== TrangThaiQuyTrinh.ChuaKyDienTu &&
        x !== TrangThaiQuyTrinh.DangKyDienTu &&
        x !== TrangThaiQuyTrinh.KyDienTuLoi &&
        x !== TrangThaiQuyTrinh.GuiTCTNLoi &&
        x !== TrangThaiQuyTrinh.ChuaPhatHanh)) || (this.isGuiCQT == true && res[0].some(x => x !== TrangThaiQuyTrinh.ChuaGuiCQT))) {
        var messages = [];
        this.listFlat.forEach((item: any, index: any) => {
          if (this.isGuiCQT) {
            if (res[0][index] != TrangThaiQuyTrinh.ChuaGuiCQT) {
              const message = `Hệ thống chỉ thực hiện gửi đến CQT các hóa đơn <b>${item.hinhThucHoaDon === 1 || item.hinhThucHoaDon == 2 ? 'Có' : 'Không'} mã của cơ quan thuế</b>
              có trạng thái quy trình là <b>Chưa gửi CQT</b>.`;

              if (messages.length === 0 || !messages.includes(message)) {
                messages.push(message);
              }
            }
          }
          else {
            if (res[0][index] !== TrangThaiQuyTrinh.ChuaKyDienTu &&
              res[0][index] !== TrangThaiQuyTrinh.DangKyDienTu &&
              res[0][index] !== TrangThaiQuyTrinh.KyDienTuLoi &&
              res[0][index] !== TrangThaiQuyTrinh.GuiTCTNLoi &&
              res[0][index] !== TrangThaiQuyTrinh.ChuaPhatHanh) {
              const message = `Hệ thống chỉ thực hiện phát hành các hóa đơn <b>${item.hinhThucHoaDon === 1 || item.hinhThucHoaDon == 2 ? 'Có' : 'Không'} mã của cơ quan thuế</b>
                      có trạng thái quy trình là <b>Chưa phát hành</b>, <b>Chưa ký điện tử</b> hoặc <b>Ký điện tử bị lỗi</b> hoặc <b>Gửi TCTN lỗi</b>.`;

              if (messages.length === 0 || !messages.includes(message)) {
                messages.push(message);
              }
            }
          }
        });

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
            msContent: messages.join('<br>') + '<br>Vui lòng kiểm tra lại!',
            msOnClose: () => {
            },
          }
        });
        this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
        this.isLoading = false;
        return;
      } else {
        if (this.isTuMTT) {
          if (!this.isGuiCQT) {
            this.hoaDonDienTuService.PhatHanhHoaDonCoMaTuMTTDongLoat(this.listFlat.map(x => x.hoaDonDienTuId)).subscribe((rs: any[]) => {
              const listXacThuc = this.listGroup.map(x => this.boKyHieuHoaDonService.CheckDaHetSoLuongHoaDonVaXacThuc(x));
              forkJoin(listXacThuc).subscribe()

              console.log('resPhatHanh: ', rs);

              this.hasHoaDonCoMaTuMTT = true;
              this.percentPhatHanh = 75;

              if (rs) {
                this.isLoadBangKe = true;

                this.numberSuccess = rs.filter(x => x.hasError === false).length;
                this.listError = rs.filter(x => x.hasError === true);
                this.numberTotal = rs.length;
                this.percentPhatHanh = 100;
                this.selectedIndex = 2;
                this.clickNext();
              }
            });
          }
          else {
            this.tabHoaDonDienTuComp.serials = this.serials;
            this.tabHoaDonDienTuComp.hoSoHDDT = this.hoSoHDDT;


            this.tabHoaDonDienTuComp.guiHoaDonFromPos(this.listFlat, this.modal, () => this.modal.destroy(true));
          }
        }
        else {
          // const listById: Observable<any>[] = [];
          // this.listFlat.forEach((item: any) => {
          //   listById.push(this.hoaDonDienTuService.GetById(item.hoaDonDienTuId));
          // });
          this.totalPhatHanh = this.listFlat.length * 2;
          this.modal.getInstance().nzClosable = false;

          var hoaDonDienTuIds = this.listFlat.map(x => x.hoaDonDienTuId);
          // this.hoaDonDienTuService.GetMultiById(hoaDonDienTuIds)
          //   .subscribe((resByIds: any[]) => {
          const listXMLBase64 = [];
          const listSerials = [];
          const listHD = [];
          const listboKyHieuHoaDonId = [];

          this.listFlat.forEach((item: any) => {
            if (item) {
              const ttChung = {
                PBan: '2.0.0',
                MNGui: `${this.env.taxCodeTCGP}`,
                MNNhan: this.env.taxCodeTCTN,
                MLTDiep: item.boKyHieuHoaDon.hinhThucHoaDon === 1 ? 200 : 203,
                MTDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
                MTDTChieu: '',
                MST: this.hoSoHDDT.maSoThue,
                SLuong: 1
              };
              item.TTChungThongDiep = ttChung;
              item.isPhatHanh = true;
              item.maTraCuu = generateUUIDV4().toLowerCase();
              item.TrangThaiQuyTrinh = 1;
              //const itemFlat = this.listFlat.find(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
              // item.soHoaDon = itemFlat.soHoaDon;
              // item.checked = itemFlat.checked;
              // item.hoTenNguoiNhanHD = itemFlat.hoTenNguoiNhanHD;
              // item.emailNguoiNhanHD = itemFlat.emailNguoiNhanHD;
              item.XMLDaKy = item.kyHieuHoaDon + '-' + item.soHoaDon + '-' + item.hoaDonDienTuId + '.xml';
              const thongDiepChung = {
                phienBan: ttChung.PBan,
                maNoiGui: ttChung.MNGui,
                maNoiNhan: ttChung.MNNhan,
                maLoaiThongDiep: ttChung.MLTDiep,
                maThongDiep: ttChung.MTDiep,
                maThongDiepThamChieu: '',
                maSoThue: ttChung.MST,
                soLuong: ttChung.SLuong
              };

              this.mapOfThongDiepChungId[item.hoaDonDienTuId] = thongDiepChung;
              this.mapOfHoaDonId[item.hoaDonDienTuId] = item;
              listHD.push(item);
              listboKyHieuHoaDonId.push(item.boKyHieuHoaDonId);
            }
          });
          listXMLBase64.push(this.hoaDonDienTuService.MultiCreateXMLToSign(listHD));

          listSerials.push(this.boKyHieuHoaDonService.GetMultiChungThuSoById(listboKyHieuHoaDonId));
          forkJoin([
            forkJoin(listXMLBase64),
            forkJoin(listSerials)
          ]).subscribe((res: any) => {
            let arraySerial = res[1][0].reduce((acc, curVal) => {
              return acc.concat(curVal)
            }, []);
            arraySerial = [...new Set(arraySerial)];
            this.countToSend = res[0][0].length;

            this.listMsgSocket = [];
            this.listObj = [];

            res[0][0].forEach((item: any, index: any) => {
              let msg: any = {
                mLTDiep: 2030,
                mst: this.hoSoHDDT.maSoThue,
                dataXML: item.base64,
                serials: arraySerial,
                isCompression: true,
                isMultipleEnd: (index + 1) === res[0][0].length,
                nBan: {
                  mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
                  ten: item.refId,
                  diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
                  sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
                  tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
                  tenP2: '',
                }
              };

              this.listMsgSocket.push(msg);
              if (index === 0) {
                this.sendSocket(msg, item.refId);
              }
            });
          }, () => {
            this.modal.getInstance().nzClosable = true;
            this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
          });
          // }, () => {
          //   this.modal.getInstance().nzClosable = true;
          //   this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
          // });
        }
      }
    }, () => {
      this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
    });
    //   }
    // });
  }

 sendSocket(msg: any, hoaDonDienTuId: any) {
    // Sending
    var isOpen = this.webSocket.isOpenSocket();
    if (isOpen == true) {
      //khi socket mở mới gửi và cập nhật trạng thái
      this.webSocket.sendMessage(JSON.stringify(msg));
      //kiểm tra lại trạng thái socket xem còn mở hay không. nếu mở mới cập nhật trạng thái thành đang ký, nếu đóng thì không cập nhật và ngắt quá trình ký.
      isOpen = this.webSocket.isOpenSocket();
      if (isOpen == true) {
        //this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(hoaDonDienTuId, TrangThaiQuyTrinh.DangKyDienTu).subscribe();
        return true;
      } else {
        //cập nhật lại trạng thái quy trình thành chưa ký để ký lại
        if (this.webSocket.isConnecting()) {
          //khi socket ở trạng thái đang kết nối
          //đợi 2000ms để socket được mở
          setTimeout(() => {
            if (this.webSocket.isOpenSocket()) {
              //nếu socket mở thì thoát time out
              this.webSocket.sendMessage(JSON.stringify(msg));
              this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(hoaDonDienTuId, TrangThaiQuyTrinh.DangKyDienTu).subscribe();
              return true;
            }
          }, 2000);

          //sau 2000ms vẫn k kết nối được thì ngắt
          if (!this.webSocket.isOpenSocket()) {
            this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(hoaDonDienTuId, TrangThaiQuyTrinh.ChuaKyDienTu).subscribe();
            return false;
          }
        } else {
          this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(hoaDonDienTuId, TrangThaiQuyTrinh.ChuaKyDienTu).subscribe();
          return false;
        }
      }
    } else {
      //cập nhật lại để chắc chắn hóa đơn vẫn đang ở trạng thái chưa ký
      this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(hoaDonDienTuId, TrangThaiQuyTrinh.ChuaKyDienTu).subscribe();
      return false;
    }
  }

  
 createSocket() {
    if (this.webSubcription) {
      this.webSubcription.unsubscribe();
    }
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      let obj = JSON.parse(rs);
      obj.dataXML = obj.XMLSigned;
      const hoaDon = this.mapOfHoaDonId[obj.NBan.Ten];
      obj.hoaDonDienTuId = hoaDon.hoaDonDienTuId;
      if (hoaDon.checked) {
        obj.isKemGuiEmail = hoaDon.checked;
        obj.tenNguoiNhanKemTheo = hoaDon.hoTenNguoiNhanHD;
        obj.emailNhanKemTheo = hoaDon.emailNguoiNhanHD;
      }
      obj.hoaDon = hoaDon;

      if (obj.TypeOfError !== 0) {
        var msgData = getNoiDungLoiKyDienTuChoNhatKy(obj.Exception);
        obj.noiDungLoiPhatHanh = getNoiDungLoiPhatHanhHoaDon(obj.Exception);
        obj.moTa = msgData.moTa;
        obj.huongDanXuLy = msgData.huongDanXuLy;
        console.log('LỖI: ', obj);
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Error,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Phát hành hóa đơn',
            msContent: `Đã có lỗi trong quá trình phát hành. <br>Lỗi : ` + obj.Exception + ` <br> Số hóa đơn: <strong>` + obj.hoaDon.soHoaDon
              + `</strong><br> Vui lòng thử lại.`,
          },
          nzFooter: null
        });
        this.modal.getInstance().nzClosable = true;
        this.isLoading = false;
        return;
      }
      obj.thongDiepChung = this.mapOfThongDiepChungId[hoaDon.hoaDonDienTuId];
      this.countPhatHanh++;
      this.calculateProgressPercent();

      this.listObj.push(obj);

      if (this.listMsgSocket.length > 0 && this.listMsgSocket[0].nBan.ten === obj.hoaDonDienTuId) {
        if (obj.TypeOfError === 0 && obj.XMLSigned) { // sign ok
          var listNextMsg = this.listMsgSocket.filter(x => x.nBan.ten !== obj.hoaDonDienTuId);
          listNextMsg.forEach((msg: any) => {
            this.sendSocket(msg, msg.nBan.ten);
          });
        } else { // sign fail
          this.percentPhatHanh = 0;
          this.countPhatHanh = 0;
          this.countListenResponse = 0;
          this.isLoading = false;
          this.modal.getInstance().nzClosable = true;
          this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();

          const listTrangThaiQuyTrinh = [];
          let entries = Object.entries(this.mapOfHoaDonId);
          for (const [prop] of entries) {
            var trangThaiQuyTrinh = this.mapOfHoaDonId[prop].trangThaiQuyTrinh;
            var data = {
              hoaDonDienTuId: prop,
              trangThaiQuyTrinh: trangThaiQuyTrinh
            }
            listTrangThaiQuyTrinh.push(data);
          }

          this.hoaDonDienTuService.UpdateMultiTrangThaiQuyTrinh(listTrangThaiQuyTrinh).subscribe();

          return;
        }
      }

      // send all done
      if (this.countToSend === this.listObj.length) {
        var isOpen = this.webSocket.isOpenSocket();
        if (!isOpen) {
          this.updateRangeTrangThaiQuyTrinh(this.listObj, TrangThaiQuyTrinh.ChuaKyDienTu);
          this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Error,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Phát hành hóa đơn',
              msContent: `Đã có lỗi trong quá trình phát hành. Vui lòng thử lại.`,
            },
            nzFooter: null
          });
          this.modal.getInstance().nzClosable = true;
          this.isLoading = false;
          return;
        }

        // sign multiple
        // const listPhatHanhHoaDonDongLoat = this.listObj.map(x => this.hoaDonDienTuService.PhatHanhHoaDonDongLoat(x));
        this.hoaDonDienTuService.PhatHanhHoaDonDongLoat(this.listObj).subscribe((res: any[]) => {
          // xac thuc so luong
          const listXacThuc = this.listGroup.map(x => this.boKyHieuHoaDonService.CheckDaHetSoLuongHoaDonVaXacThuc(x));
          forkJoin(listXacThuc).subscribe()
          this.hasHoaDonCoMa = false;
          this.percentPhatHanh = 75;

          if (res) {
            this.isLoadBangKe = true;
            const listParamThongDiep = [];
            res.forEach((item: any) => {
              const param = {
                ...this.mapOfThongDiepChungId[item.hoaDonDienTuId],
                duLieuGuiHDDT: {
                  hoaDonDienTuId: item.hoaDonDienTuId,
                  hoaDonDienTu: this.mapOfHoaDonId[item.hoaDonDienTuId]
                }
              };

              if (item.hasError !== true && param.maLoaiThongDiep === 200) {
                listParamThongDiep.push(param);
              } else {
                this.hasHoaDonCoMa = true;
              }
            });

            this.numberSuccess = res.filter(x => x.hasError === false).length;
            this.listError = res.filter(x => x.hasError === true);
            this.numberTotal = res.length;

            if (listParamThongDiep.length > 0) {
              this.thongDiepGuiDuLieuHDDTService.InsertRange(listParamThongDiep)
                .subscribe((resTTQT: any[]) => {
                  if (resTTQT) {
                    this.hasHoaDonCoMa = resTTQT.some(x => x === TrangThaiQuyTrinh.GuiKhongLoi);
                  }

                  this.percentPhatHanh = 100;
                  this.selectedIndex = 2;
                  this.clickNext();

                  // if (resTTQT.length > 0) {
                  //   if (resTTQT.some(x => x === TrangThaiQuyTrinh.GuiKhongLoi || x === TrangThaiQuyTrinh.GuiTCTNLoi)) {
                  //     this.startTimeToListen = new Date();
                  //     this.listenRessponseForTCT(() => {
                  //       this.percentPhatHanh = 100;
                  //       this.selectedIndex = 2;
                  //       this.clickNext();
                  //     });

                  //     // const listWaitForRes = [];
                  //     // listParamThongDiep.forEach((item: any) => {
                  //     //   const paramWait = this.listObj.find(x => x.hoaDonDienTuId === item.duLieuGuiHDDT.hoaDonDienTuId);
                  //     //   listWaitForRes.push(this.hoaDonDienTuService.WaitForTCTResonse(paramWait));
                  //     // });

                  //     // forkJoin(listWaitForRes.map(o => o.pipe(tap(() => {
                  //     //   this.countPhatHanh++;
                  //     //   this.calculateProgressPercent();
                  //     // })))).subscribe((resWait: any[]) => {
                  //     //   console.log('resWait: ', resWait);
                  //     //   this.selectedIndex = 2;
                  //     //   this.clickNext();
                  //     // }, () => {
                  //     //   this.modal.getInstance().nzClosable = true;
                  //     //   this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
                  //     //   this.isLoading = false;
                  //     // });

                  //     // var hoaDonDienTuIds = this.listObj.map(x => x.hoaDonDienTuId);
                  //     // this.hoaDonDienTuService.WaitMultiForTCTResonse(hoaDonDienTuIds)
                  //     //   .subscribe((resWait: any) => {
                  //     //     console.log('resWait: ', resWait);

                  //     //     this.percentPhatHanh = 100;
                  //     //     this.selectedIndex = 2;
                  //     //     this.clickNext();
                  //     //   }, () => {
                  //     //     this.modal.getInstance().nzClosable = true;
                  //     //     this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
                  //     //     this.isLoading = false;
                  //     //   });
                  //   } else {
                  //     this.selectedIndex = 2;
                  //     this.clickNext();
                  //   }
                  // } else {
                  //   this.selectedIndex = 2;
                  //   this.clickNext();
                  // }
                }, () => {
                  this.modal.getInstance().nzClosable = true;
                  this.updateRangeTrangThaiQuyTrinh(res, TrangThaiQuyTrinh.GuiTCTNLoi);
                  this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
                  this.isLoading = false;
                });
            } else {
              this.selectedIndex = 2;
              this.clickNext();
            }
          } else {
            this.numberSuccess = 0;
            this.listError = this.listObj.map(x => x.hoaDon);
            this.numberTotal = this.listObj.length;
            this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
            this.updateRangeTrangThaiQuyTrinh(this.listObj, TrangThaiQuyTrinh.KyDienTuLoi);
            this.insertRangeNhatKyThaoTacLoi(this.listObj, 'Lỗi hệ thống');
            this.selectedIndex = 2;
            this.clickNext();
          }
        }, () => {
          this.modal.getInstance().nzClosable = true;
          this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
          this.isLoading = false;
        });
      }
    }, err => {
      this.modal.getInstance().nzClosable = true;
      this.isLoading = false;
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.WarningAndInstall,
          msOKText: "Tải bộ cài",
          msOnOk: () => {
            const link = document.createElement('a');
            link.href = `${this.env.apiUrl}/${this.urlTools}`;
            link.download = 'BKSOFT-KYSO-SETUP.zip';
            link.click();
          },
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            this.modal.destroy(false);
          },
          msTitle: 'Hãy cài đặt công cụ ký số',
          msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
          <br>Để ký điện tử lên hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
        },
        nzFooter: null
      });
    });
  }

  listenRessponseForTCT(callback: () => any) {
    var diff = (new Date().getTime() - this.startTimeToListen.getTime()) / 1000;
    if (diff > 60) {
      callback();
      return;
    }

    const listWaitResponse: Observable<any>[] = [];

    this.listObj.forEach((item: any) => {
      listWaitResponse.push(this.hoaDonDienTuService.GetTrangThaiQuyTrinhById(item.hoaDonDienTuId));
    });

    forkJoin(listWaitResponse).subscribe((res: any[]) => {
      for (let i = 0; i < this.listObj.length; i++) {
        const item = this.listObj[i];
        item.trangThaiQuyTrinh = res[i];
        if (item.hoaDon.boKyHieuHoaDon.hinhThucHoaDon === 1 && item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.CQTDaCapMa && item.trangThaiQuyTrinh !== TrangThaiQuyTrinh.KhongDuDieuKienCapMa) { // có mã
          setTimeout(() => {
            this.listenRessponseForTCT(callback);
          }, 2000);
          return;
        }
      }

      callback();
    }, () => {
      this.modal.getInstance().nzClosable = true;
      this.boKyHieuHoaDonService.ClearBoKyHieuDaPhatHanh().subscribe();
      this.isLoading = false;
    });
  }

  updateRangeTrangThaiQuyTrinh(list: any[], trangThaiQuyTrinh: TrangThaiQuyTrinh) {
    const listObservable = [];
    list.forEach((item: any) => {
      var data = {
        hoaDonDienTuId: item.hoaDonDienTuId,
        trangThaiQuyTrinh: trangThaiQuyTrinh
      }
      listObservable.push(data);
    });
    this.hoaDonDienTuService.UpdateMultiTrangThaiQuyTrinh(listObservable).subscribe();
    this.isLoadBangKe = true;
  }

  insertRangeNhatKyThaoTacLoi(list: any[], message: any) {
    const listObservable = [];
    list.forEach((item: any) => {
      listObservable.push(this.nhatKyThaoTacLoiService.Insert(item.hoaDonDienTuId, message));
    });
    forkJoin(listObservable).subscribe();
    this.isLoadBangKe = true;
  }

  changeTab(event: any) {
    /////////////
  }

  changeKy(event: any) {
    SetDate(event, this.displayData);
  }

  blurDate() {
    CheckValidDateV2(this.displayData);
    this.displayData.ky = GetKy(this.displayData);
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.label.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  changeCheckboxTimKiemTheo() {
    let checkBoxes = document.querySelectorAll('.ckbcheckBox');
    if (this.timKiemTheos.filter(x => x.checked).length == 0) {
      checkBoxes.forEach((ckbFormControl: any) => {
        if (ckbFormControl.outerText != undefined) {
          if (ckbFormControl.outerText == "Số hóa đơn") {
            ckbFormControl.childNodes[0].childNodes[0].click();
            if (ckbFormControl.childNodes[0].childNodes[0].checked == false) {
              ckbFormControl.childNodes[0].childNodes[0].click();
            }
          }
        }
      });
    }
  }

  getData(reset = false) {
    if (!this.displayData.boKyHieuHoaDonId) {
      this.message.warning('Vui lòng chọn ký hiệu');
      return;
    }
    this.mapOfCheckedId = {};

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    var giaTris = this.displayData.giaTri != "" ? this.displayData.giaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i] || null;
      }
      this.displayData.timKiemTheo = result;
    } else {
      this.displayData.timKiemTheo = null;
    }

    this.isLoading = true;

    this.displayData.HoaDonDienTuIds = [];
    if (reset) {
      this.displayData.PageNumber = 1
    }
    this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(this.displayData)
      .subscribe((res: any) => {
        this.listData = res.items;
        this.total = res.totalCount;
        this.totalPages = res.totalPages;
        this.isLoading = false;
        this.refreshStatus();
      });
  }

  checkAll(event: any) {
    this.listData.forEach(item => (this.mapOfCheckedId[item.hoaDonDienTuId] = event));
    this.refreshStatus();
  }

  refreshStatus() {
    this.isAllDisplayDataChecked = this.listData.every(item => this.mapOfCheckedId[item.hoaDonDienTuId]);
    this.isIndeterminate = this.listData.some(item => this.mapOfCheckedId[item.hoaDonDienTuId]) && !this.isAllDisplayDataChecked;

    this.listData.forEach((item: any) => {
      if (this.mapOfCheckedId[item.hoaDonDienTuId]) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    let entries = Object.entries(this.mapOfCheckedId);
    var listIds = [];
    for (const [prop, val] of entries) {
      if (val) {
        listIds.push(prop);
      }
    }

    if (listIds.length > 0) {
      this.hoaDonDienTuService.GetMultiTrangThaiQuyTrinhById(listIds)
        .subscribe((res: any[]) => {
          this.disabledCapNhatNgayHoaDonVeHienTai = res.some(x => x === TrangThaiQuyTrinh.GuiTCTNLoi);
        });
    } else {
      this.disabledCapNhatNgayHoaDonVeHienTai = true;
    }
  }

  checkAll2(event: any, group: any, list: any[]) {
    list.forEach(item => item.checked = event);
    this.refreshStatus2(group, list);
  }

  refreshStatus2(group: any, list: any[]) {
    group.isAllDisplayDataChecked = list.every(item => item.checked);
    group.isIndeterminate = list.some(item => item.checked) && !group.isAllDisplayDataChecked;
  }

  viewLichSuTruyenNhan(data: any = null) {
    if (data == null) {
      const vals = this.listData.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
      .subscribe(async (res: any) => {
        this.modalService.create({
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
      });
  }

  public get trangThaiQuyTrinh(): typeof TrangThaiQuyTrinh {
    return TrangThaiQuyTrinh;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedRow(data);
    this.selectedRow2(data);
  }

  selectedRow(data: any) {
    this.dataSelected = data;

    if (this.listOfSelected.length === 0) {
      data.selected = true;
      this.listData.forEach(element => {
        if (element !== data && !this.mapOfCheckedId[element.hoaDonDienTuId]) {
          element.selected = false;
        }
      });
    }
  }

  selectedRow2(data: any) {
    this.listGroup.forEach((group: any) => {
      group.children.forEach((item: any) => {
        if (item !== data) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      });
    });
  }

  clickSua(isCopy = false, isView = false, item: any = null) {
    this.tabHoaDonDienTuComponent.dataSelected = item;
    this.tabHoaDonDienTuComponent.clickSua(isCopy, isView, item, () => {
      const param = Object.assign({}, this.displayData);
      param.hoaDonDienTuId = item.hoaDonDienTuId;
      param.PageNumber = 1;
      this.isLoadBangKe = true;
      this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(param)
        .subscribe((res: any) => {
          var items = res.items;

          if (items.length === 0) {
            return;
          }

          switch (this.selectedIndex) {
            case 0:
              for (let item of this.listData) {
                if (item.hoaDonDienTuId === items[0].hoaDonDienTuId) {
                  this.updateItem(item, items[0]);
                  return;
                }
              }
              break;
            case 1:
              this.listFlat = [];
              for (let group of this.listGroup) {
                for (const item of group.children) {
                  if (item.hoaDonDienTuId === items[0].hoaDonDienTuId) {
                    this.updateItem(item, items[0]);
                  }

                  this.listFlat.push(item);
                }
              }
              break;
            default:
              break;
          }
        });
    });
  }

  updateItem(source: any, dest: any) {
    source.boKyHieuHoaDonId = dest.boKyHieuHoaDonId;
    source.kyHieuHoaDon = dest.kyHieuHoaDon;
    source.mauSo = dest.mauSo;
    source.kyHieu = dest.kyHieu;
    source.ngayHoaDon = dest.ngayHoaDon;
    source.maKhachHang = dest.maKhachHang;
    source.tenKhachHang = dest.tenKhachHang;
    source.maSoThue = dest.maSoThue;
    source.hoTenNguoiMuaHang = dest.hoTenNguoiMuaHang;
    source.loaiTienId = dest.loaiTienId;
    source.maLoaiTien = dest.maLoaiTien;
    source.isVND = dest.isVND;
    source.tongTienThanhToan = dest.tongTienThanhToan;
    source.maTraCuu = dest.maTraCuu;
    source.maCuaCQT = dest.maCuaCQT;
    source.loaiDieuChinh = dest.loaiDieuChinh;
    source.loaiHoaDon = dest.loaiHoaDon;
    source.hinhThucHoaDon = dest.hinhThucHoaDon;
    source.hoTenNguoiNhanHD = dest.hoTenNguoiNhanHD;
    source.emailNguoiNhanHD = dest.emailNguoiNhanHD;
    source.hoaDonChiTiets = dest.hoaDonChiTiets;
  }

  viewReceipt() {
    this.tabHoaDonDienTuComponent.viewReceipt(this.dataSelected);
  }

  ToggleButton(item: any) {
    item.isboxEmailCcBcc = !item.isboxEmailCcBcc;
  }

  inValidForm(event: any, data: any) {
    data.invalid = event;
  }

  downloadFilesError() {
    this.isLoading = true;
    this.hoaDonDienTuService.TaiTepPhatHanhHoaDonLoi(this.listError).subscribe((rs: any) => {
      if (rs) {
        const link = window.URL.createObjectURL(rs);
        DownloadFile(link, 'Tệp phát hành hóa đơn lỗi.xlsx');
        this.isLoading = false;
      }
    });
  }

  thucHienLai() {
    this.selectedIndex = 1;
    this.isLoading = true;
    this.listObj = [];
    this.percentPhatHanh = 0;
    this.countPhatHanh = 0;
    this.countListenResponse = 0;

    const param = Object.assign({}, this.displayDataAll);
    param.HoaDonDienTuIds = this.listError.map(x => x.hoaDonDienTuId);

    this.hoaDonDienTuService.GetListHoaDonDePhatHanhDongLoat(param)
      .subscribe((res: any) => {
        var listThucHienLai = [];
        res.items.forEach((item: any) => {
          var itemError = this.listError.find(x => x.hoaDonDienTuId === item.hoaDonDienTuId);
          item.soHoaDon = itemError.soHoaDon;
          listThucHienLai.push(item);
        });

        this.hoaDonDienTuService.GroupListDeXemDuLieuPhatHanhDongLoat(listThucHienLai)
          .subscribe((resGroup: any[]) => {
            this.listGroup = resGroup;
            if (!this.isGuiCQT) {
              this.widthConfig = ['150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px', '200px'];
            }
            else {
              this.widthConfig = ['150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
            }
            this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '480' };
            this.isLoading = false;

            this.mapOfThongDiepChungId = {};
            this.mapOfHoaDonId = {};
            this.checkHoaDonPhatHanh();
          }, _error => {
            this.isLoading = false;
            return;
          });
      });
  }

  phatHanhTiep() {
    this.selectedIndex = 0;
    this.listData = [];
    this.listGroup = [];
    this.listFlat = [];
    this.listObj = [];
    this.listBoKyHieuDuocPhepPhatHanh = [];
    this.mapOfCheckedId = {};
    this.mapOfThongDiepChungId = {};
    this.mapOfHoaDonId = {};
    this.isClickedSave = false;
    this.countPhatHanh = 0;
    this.countListenResponse = 0;
    this.percentPhatHanh = 0;
    this.widthConfig = ['50px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
    this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
    this.refreshStatus();
  }

  calculateProgressPercent() {
    this.percentPhatHanh = Math.round(100 * (this.countPhatHanh + this.countListenResponse) / this.totalPhatHanh);
  }
}
