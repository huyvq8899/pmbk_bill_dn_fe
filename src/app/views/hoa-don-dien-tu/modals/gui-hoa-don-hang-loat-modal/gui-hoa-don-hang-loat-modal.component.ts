import { Component, Input, OnInit } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { SumwidthConfig } from 'src/app/shared/global';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { TabHoaDonDienTuComponent } from '../../tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { forkJoin, Observable, of } from 'rxjs';
import { DownloadFile, getTenLoaiHoaDon } from 'src/app/shared/SharedFunction';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import * as moment from 'moment';

@Component({
  selector: 'app-gui-hoa-don-hang-loat-modal',
  templateUrl: './gui-hoa-don-hang-loat-modal.component.html',
  styleUrls: ['./gui-hoa-don-hang-loat-modal.component.scss']
})
export class GuiHoaDonHangLoatModalComponent implements OnInit {
  @Input() isDraft: boolean;
  @Input() listSelectedIdFromTab = []; // danh sách id chọn từ tab 
  @Input() fromDate = null;
  @Input() toDate = null;
  selectedIndex = 0;
  isLoading = false;
  kys = GetList();
  displayData = {
    PageNumber: 1,
    PageSize: 100,
    ky: 5,
    fromDate: '',
    toDate: '',
    giaTri: '',
    mauHoaDonDuocPQ: [],
    timKiemTheo: null,
    permission: false,
    boKyHieuHoaDonId: '-1',
    hoaDonDienTuId: null,
    HoaDonDienTuIds: [],
    isBanNhap: false,
    LoaiNghiepVu: 1
  };
  displayDataRaw = null;
  timKiemTheos: Array<{ value: any, label: any, checked: boolean }> = [
    { value: 'MauSo', label: 'Ký hiệu mẫu số hóa đơn', checked: false },
    { value: 'KyHieu', label: 'Ký hiệu hóa đơn', checked: false },
    { value: 'SoHoaDon', label: 'Số hóa đơn', checked: true },
    { value: 'MaSoThue', label: 'Mã số thuế', checked: false },
    { value: 'MaKhachHang', label: 'Mã khách hàng', checked: false },
    { value: 'TenKhachHang', label: 'Tên khách hàng', checked: false },
    { value: 'NguoiMuaHang', label: 'Người mua hàng', checked: false },
  ];
  listData = [];
  widthConfig = ['50px', '150px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '61vh' };
  total = 0;
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
  numberSuccess = 0;
  numberTotal = 0;
  listError = [];
  totalPages = 0;
  percentGuiEmail = 0;
  countGuiEmail = 0;
  isLoadBangKe = false;
  titleHoaDon = 'hóa đơn'
  isPhieuXuatKho: boolean;
  isPos: boolean;

  constructor(
    private env: EnvService,
    private message: NzMessageService,
    private modal: NzModalRef,
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nzContextMenuService: NzContextMenuService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private hoSoHDDTService: HoSoHDDTService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private doiTuongService: DoiTuongService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
  ) { }

  ngOnInit() {
    this.displayData.isBanNhap = this.isDraft;
    this.titleHoaDon = this.isDraft == false ? 'hóa đơn' : 'hóa đơn nháp';
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.displayData.LoaiNghiepVu = 2;
    }
    else if(_url.includes('hoa-don-tu-mtt')){
      this.isPos = true;
      this.displayData.LoaiNghiepVu = 3;
    }
    else {
      this.displayData.LoaiNghiepVu = 1;
    }

    this.displayData.HoaDonDienTuIds = this.listSelectedIdFromTab;
    this.displayData.fromDate = this.fromDate;
    this.displayData.toDate = this.toDate;

    if (this.isDraft) {
      this.timKiemTheos = this.timKiemTheos.filter(x => x.value !== 'SoHoaDon');
    }

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
      this.hoSoHDDT = res[0];

      if (this.displayData.fromDate && this.displayData.toDate) { 
        this.displayData.ky = GetKy(this.displayData);
      } else {
        if (res[0].kyTinhThue === 0) {
          this.displayData.ky = 4;
          this.changeKy(4);
        } else {
          this.displayData.ky = 6;
          this.changeKy(6);
        }
      }

      if (res[1]) {
        this.listData = res[1].items;
        this.total = res[1].totalCount;
        this.totalPages = res[1].totalPages;
        this.checkAll(true);
      }

      this.isLoading = false;
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.listSelectedIdFromTab.length > 0 ? this.hoaDonDienTuService.GetListHoaDonDeGuiEmailDongLoat(this.displayData) : of(null)
    ]);
  }

  destroyModal() {
    this.modal.destroy();
  }

  clickBack() {
    this.selectedIndex--;
    this.isClickedSave = false;
    if (this.selectedIndex === 0) {
      this.widthConfig = ['50px', '150px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
    } else if (this.selectedIndex === 1) {
      this.widthConfig = ['150px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
    }

    this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
  }

  clickNext() {
    if (this.selectedIndex === 0) {
      if (this.listOfSelected.length === 0) {
        this.message.warning('Vui lòng chọn hóa đơn để gửi');
        return;
      }
      this.isClickedSave = true;
      for (const item of this.listData) {
        if (item.selected && item.invalid) {
          this.isLoading = false;
          return;
        }
      }

      this.widthConfig = ['150px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
      this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
      this.selectedIndex++;
    } else if (this.selectedIndex === 1) {
      const listSendEmail: Observable<any>[] = [];
      this.isLoading = true;
      let stringMoTaChiTiet = '';
      let stringMoTaChiTietThanhCong = '';
      let stringRefId = '';
      this.listOfSelected.forEach((item: any) => {
        const params = {
          hoaDon: item,
          tenNguoiNhan: item.hoTenNguoiNhanHD,
          toMail: item.emailNguoiNhanHD,
          loaiEmail: LoaiEmail.ThongBaoPhatHanhHoaDon,
          link: this.env.apiUrl,
          linkTraCuu: this.env.apiUrl + '/tra-cuu-hoa-don'
        };

        listSendEmail.push(this.hoaDonDienTuService.SendEmailAsync(params));
      });

      this.modal.getInstance().nzClosable = false;
      this.countGuiEmail = 0;
      this.listError = [];

      forkJoin(listSendEmail.map(x => x.pipe(tap(() => {
        this.countGuiEmail++;
        this.calculateProgressPercent();
      })))).subscribe((res: any[]) => {
        const listUpdateDoiTuong = [];

        res.forEach((rsSend: any, index: any) => {
          const itemHD = this.listOfSelected[index];
          if (!rsSend) {
            this.listError.push(this.listOfSelected[index]);
          } else {
            var phanQuyen = localStorage.getItem('KTBKUserPermission');
            var thaoTacs = [];
            let permission = true;
            if (phanQuyen != 'true') {
              permission = false;
              var pq = JSON.parse(phanQuyen);
              thaoTacs = pq.functions.find(x => x.functionName == "KhachHang").thaoTacs;
            }
            if (itemHD.khachHangId && (permission == true || (this.permission == false && thaoTacs.indexOf("DM_UPDATE") >= 0))) {
              this.doiTuongService.GetById(itemHD.khachHangId).subscribe((rs: any) => {
                rs.hoTenNguoiNhanHD = itemHD.hoTenNguoiNhanHD;
                rs.emailNguoiNhanHD = itemHD.emailNguoiNhanHD;
                listUpdateDoiTuong.push(this.doiTuongService.Update(rs));
              });
            }
            stringRefId += itemHD.hoaDonDienTuId +';'; 
            /// Case rối
          //   stringMoTaChiTietThanhCong += `Mẫu số: <${itemHD.mauSo}>;` + 
          //  ` Ký hiệu: <${itemHD.kyHieu}>; Số hóa đơn: <${itemHD.soHoaDon != null ? itemHD.soHoaDon : `Chưa cấp số`}>;` +
          //  ` Ngày hóa đơn: <${moment(itemHD.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${itemHD.hoTenNguoiNhanHD}>; Email người nhận: <${itemHD.emailNguoiNhanHD}>.` + `\n`;

           stringMoTaChiTietThanhCong += `Hóa đơn số: ${itemHD.soHoaDon != null ? itemHD.soHoaDon : `<Chưa cấp số>`} - ${itemHD.mauSo} - ${itemHD.kyHieu} -` + 
           ` ${moment(itemHD.ngayHoaDon).format('DD/MM/YYYY')} - Tên người nhận: <${itemHD.hoTenNguoiNhanHD}> -` + ` Email người nhận: <${itemHD.emailNguoiNhanHD}>. \n`
          }
        });



        forkJoin(listUpdateDoiTuong).subscribe();

        this.isLoadBangKe = true;
        this.numberSuccess = res.filter(x => !!x).length;
        this.numberTotal = res.length;
        this.selectedIndex++;
        this.isLoading = false;
        this.modal.getInstance().nzClosable = true;
        if(this.numberSuccess > 0) {
        stringMoTaChiTiet += `- Gửi ${this.titleHoaDon} đồng loạt thành công ${this.numberSuccess}/${this.numberTotal} hóa đơn` + `\n`
        }
        if(this.numberSuccess > 0) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.GuiHoaDonChoKhachHang,
            hanhDong: `Gửi ${this.titleHoaDon} đồng loạt`,
            doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.listOfSelected[0].loaiHoaDon),
            refType: RefType.HoaDonDienTu,
            thamChieu: `Gửi ${this.titleHoaDon} thành công ${this.numberSuccess} hóa đơn`,
            moTaChiTiet: stringMoTaChiTiet + stringMoTaChiTietThanhCong,
            refId: stringRefId,
          }).subscribe();
        }
      }, () => {
        this.isLoadBangKe = true;
        this.modal.getInstance().nzClosable = true;
      });
    }
  }

  updateRangeTrangThaiQuyTrinh(list: any[], trangThaiQuyTrinh: TrangThaiQuyTrinh) {
    const listObservable = [];
    list.forEach((item: any) => {
      listObservable.push(this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(item.hoaDonDienTuId, trangThaiQuyTrinh));
    });
    forkJoin(listObservable).subscribe();
  }

  insertRangeNhatKyThaoTacLoi(list: any[], message: any) {
    const listObservable = [];
    list.forEach((item: any) => {
      listObservable.push(this.nhatKyThaoTacLoiService.Insert(item.hoaDonDienTuId, message));
    });
    forkJoin(listObservable).subscribe();
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

    this.hoaDonDienTuService.GetListHoaDonDeGuiEmailDongLoat(this.displayData)
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
    this.listOfSelected = this.listData.filter(item => this.mapOfCheckedId[item.hoaDonDienTuId]);

    this.listData.forEach((item: any) => {
      if (this.mapOfCheckedId[item.hoaDonDienTuId]) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: any): void {
    this.nzContextMenuService.create($event, menu);
    this.selectedRow(data);
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;
    this.listData.forEach(element => {
      if (element !== data && !this.mapOfCheckedId[element.hoaDonDienTuId]) {
        element.selected = false;
      }
    });
  }

  clickSua(isCopy = false, isView = false, item: any = null) {
    this.tabHoaDonDienTuComponent.dataSelected = item;
    this.tabHoaDonDienTuComponent.clickSua(isCopy, isView, item, () => {
      const param = Object.assign({}, this.displayData);
      param.hoaDonDienTuId = item.hoaDonDienTuId;
      param.PageNumber = 1;
      this.isLoadBangKe = true;

      this.hoaDonDienTuService.GetListHoaDonDeGuiEmailDongLoat(param)
        .subscribe((res: any) => {
          var items = res.items;

          for (let item of this.listData) {
            if (item.hoaDonDienTuId === items[0].hoaDonDienTuId) {
              this.updateItem(item, items[0]);
              return;
            }
          }

          for (let item of this.listOfSelected) {
            if (item.hoaDonDienTuId === items[0].hoaDonDienTuId) {
              this.updateItem(item, items[0]);
              return;
            }
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
    this.hoaDonDienTuService.TaiTepGuiHoaDonLoi(this.listError).subscribe((rs: any) => {
      if (rs) {
        const link = window.URL.createObjectURL(rs);
        DownloadFile(link, `Tệp gửi ${this.titleHoaDon} cho khách hàng lỗi.xlsx`);
        this.isLoading = false;
      }
    });
  }

  thucHienLai() {
    this.selectedIndex = 1;
    this.listOfSelected = this.listOfSelected.filter(x => this.listError.some(y => y.hoaDonDienTuId === x.hoaDonDienTuId));
    this.percentGuiEmail = 0;
    this.countGuiEmail = 0;
  }

  phatHanhTiep() {
    this.selectedIndex = 0;
    this.listData = [];
    this.listOfSelected = [];
    this.mapOfCheckedId = {};
    this.mapOfThongDiepChungId = {};
    this.mapOfHoaDonId = {};
    this.isClickedSave = false;
    this.percentGuiEmail = 0;
    this.countGuiEmail = 0;
    this.widthConfig = ['50px', '150px', '150px', '150px', '110px', '100px', '110px', '120px', '200px', '120px', '200px', '80px', '150px'];
    this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '65vh' };
    this.refreshStatus();
  }

  calculateProgressPercent() {
    this.percentGuiEmail = Math.round(100 * this.countGuiEmail / this.listOfSelected.length);
  }
}
