import { forEach } from 'jszip';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { SumwidthConfig } from 'src/app/shared/global';
import { KieuDuLieuThietLapTuyChon, MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/share-service';
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { CreateTuyChonChiTiets } from 'src/assets/ts/init-create-mau-hd';
import { NzModalService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { SettingTruongMoRongComponent } from './setting-truong-mo-rong/setting-truong-mo-rong.component';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-tab-tuy-chinh-chi-tiet',
  templateUrl: './tab-tuy-chinh-chi-tiet.component.html',
  styleUrls: ['./tab-tuy-chinh-chi-tiet.component.scss']
})
export class TabTuyChinhChiTietComponent implements OnInit, OnDestroy {
  @ViewChild('appSettingTruongMoRong', { static: false }) appSettingTruongMoRong: SettingTruongMoRongComponent;
  @Input() data: any;
  @Output() valueChangesEvent = new EventEmitter<any>();
  @Output() tabStatusEvent = new EventEmitter<any>();
  thietLapMauForm: FormGroup;
  coChus: any[] = [];
  widthConfig = ['20px', '30px', '300', '20px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig) };
  mapOfExpandData: { [key: string]: boolean } = {};
  dragDisabled = false;
  listOfData = [];
  listOfDataAll = [];
  listHinhThucTTSoTaiKhoan = [];
  listCanCuSoVaNgayCanCu = [];
  listCuaVeViec = [];
  listTenNguoiVanChuyenVaHopDongSo = [];
  listPhuongThucVanChuyen = [];
  listXuatKho = [];
  listNhapKho = [];
  listBoSung = [];
  listTenVaMaSoThueNguoiBan = [];
  listDiaChiVaTenNguoiXuatHangBan = [];
  doRongCot = 0;
  visibleAddRowMenu = false;
  sub: Subscription;
  defaultTextColor = '#000000';
  mapOfHiddenAddNewRow: { [key: string]: boolean } = {};
  isSettingTruongMoRong = false;
  settingTruongMoRongData = null;
  loadingTaiLaiThongTinNguoiNopThue = false;
  loai = {
    ThongTinNguoiBan: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
    ThongTinHoaDon: LoaiTuyChinhChiTiet.ThongTinHoaDon,
    MauSoKyHieuSoHoaDon: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
    ThongTinNguoiMua: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
    MaQRCode: LoaiTuyChinhChiTiet.MaQRCode,
    ThongTinVeHangHoaDichVu: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
    ThongTinVeTongGiaTriHHDV: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
    ThongTinNgoaiTe: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
    ThongTinNguoiKy: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
    ThongTinTraCuu: LoaiTuyChinhChiTiet.ThongTinTraCuu,
  };
  selectedTCCT: MauHoaDonTuyChonChiTiet;
  mapOfTieuDe: { [key: string]: MauHoaDonTuyChonChiTiet } = {};
  mapOfNoiDung: { [key: string]: MauHoaDonTuyChonChiTiet } = {};
  mapOfKyHieuCot: { [key: string]: MauHoaDonTuyChonChiTiet } = {};
  mapOfTieuDeSongNgu: { [key: string]: MauHoaDonTuyChonChiTiet } = {};
  isErorrEmpty: boolean;
  isErorrMaxlengt: boolean;
  Maxlength: boolean;
  StringErorr: string;


  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private sharedService: SharedService,
    private hoSoHDDTService: HoSoHDDTService
  ) { }

  ngOnInit() {
    for (let i = 11; i <= 30; i++) {
      this.coChus.push(i);
    }

    this.data.dinhDangHoaDon = this.data.dinhDangHoaDon || 1;

    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res && res.type === 'updatePickedFieldByUser') {
        this.data.loaiTuyChonChiTiet = res.value;
        this.listOfData = this.data.tuyChonChiTiets.filter(x => x.loai === res.value).sort((a, b) => a.stt - b.stt);
        console.log("🚀 ~ file: tab-tuy-chinh-chi-tiet.component.ts:96 ~ TabTuyChinhChiTietComponent ~ this.sub=this.sharedService.changeEmitted$.subscribe ~ this.listOfData:", this.listOfData)
        this.listOfDataAll = this.data.tuyChonChiTiets.filter(x => x.loai === res.value).sort((a, b) => a.stt - b.stt);
        this.getPalaceHolderInput();
      }
      if (res && res.type === 'updateDinhDangHoaDon') {
        this.data.dinhDangHoaDon = res.value;

        this.data.tuyChonChiTiets.forEach((item: any) => {
          if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenMauHoaDon) {
            item.children.forEach((child: any) => {
              if (child.loaiContainer === 1) {
                switch (this.data.loaiHoaDon) {
                  case LoaiHoaDon.HoaDonGTGT:
                  case LoaiHoaDon.HoaDonBanHang:
                    child.giaTri = (res.value === 2) ? '(Hóa đơn chuyển đổi từ hóa đơn điện tử)' : '(Bản thể hiện của hóa đơn điện tử)';
                    break;
                  case LoaiHoaDon.PXKKiemVanChuyenNoiBo:
                    child.giaTri = (res.value === 2) ? '(Bản chuyển đổi của phiếu xuất kho kiêm vận chuyển nội bộ điện tử)' : '(Bản thể hiện của phiếu xuất kho kiêm vận chuyển nội bộ điện tử)';
                    break;
                  case LoaiHoaDon.PXKHangGuiBanDaiLy:
                    child.giaTri = (res.value === 2) ? '(Bản chuyển đổi của phiếu xuất kho hàng gửi bán đại lý điện tử)' : '(Bản thể hiện của phiếu xuất kho hàng gửi bán đại lý điện tử)';
                    break;
                  default:
                    break;
                }
              } else if (child.loaiContainer === 4) {
                child.giaTri = (res.value === 2) ? '(Invoice converted from E-invoice)' : '(E-Invoice viewer)';
              }
            });
          }
        });

        this.getPalaceHolderInput();
      }
      if (res && res.type === 'saveTruongMoRongFromParent') {
        if (res.value) {
          this.appSettingTruongMoRong.acceptSetting();
        } else {
          this.isSettingTruongMoRong = false;
        }
      }
    });

    if (this.data.loaiTuyChonChiTiet) {
      this.listOfData = (this.data.tuyChonChiTiets as MauHoaDonTuyChonChiTiet[]).filter(x => x.loai === this.data.loaiTuyChonChiTiet).sort((a, b) => a.stt - b.stt);
      this.listOfDataAll = (this.data.tuyChonChiTiets as MauHoaDonTuyChonChiTiet[]).filter(x => x.loai === this.data.loaiTuyChonChiTiet).sort((a, b) => a.stt - b.stt);
      this.getPalaceHolderInput();
    }

    this.createForm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  detectValueChanges(isDirty = true, isError = true) {

    let count = 0;
    this.listOfData.forEach(element => {
      if (element.isErorrMaxlengt || element.isErorrEmpty || element.isErorrMST) {
        count++;

      }
    });

    if (count > 0) {
      isError = true;
    } else {
      isError = false;
    }

    this.tabStatusEvent.emit({ tabPosition: 4, isDirty: isDirty, isInvalid: isError })
  }

  drop(event: CdkDragDrop<string[]>, list: any[]): void {
    moveItemInArray(list, event.previousIndex, event.currentIndex);

    list.forEach((item: any, index: any) => {
      item.stt = index + 1;
    });
    list = [...list.sort((a, b) => a.stt - b.stt)];

    var loaiChiTiets = list.map(x => x.loaiChiTiet);

    this.data.tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => !loaiChiTiets.includes(x.loaiChiTiet));
    this.data.tuyChonChiTiets = [
      ...this.data.tuyChonChiTiets,
      ...list
    ];

    this.emitValueChangesEvent();
  }

  createForm() {
    this.thietLapMauForm = this.fb.group({

    });


  }

  submitForm() {
    this.listOfData.forEach(element => {
      if (element.isErorrMaxlengt || element.isErorrEmpty || element.isErorrMST) {
        element.expand = true;
        setTimeout(() => {
          let elementError = document.getElementById('noidung ' + element.dataFieldName);
          elementError.focus();
        }, 100);
      }
    });
    if (this.thietLapMauForm.invalid) {
      for (const i in this.thietLapMauForm.controls) {
        this.thietLapMauForm.controls[i].markAsTouched();
        this.thietLapMauForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return false;
    }

    return true;

  }


  changeCoChu(event: any) {
    this.selectedTCCT.tuyChonChiTiet.coChu = event;
    this.emitSelectedTCCT();
  }

  expandRow(data: any) {
    data.expand = !data.expand;
    this.selectedRow(data);

    setTimeout(() => {
      const input = document.querySelector(`.type-detail-${data.dataFieldName} input`) as any;
      if (input) {
        input.focus();
      }
    }, 0);
  }

  selectedRow(data: any) {
    data.selected = true;

    this.listOfData.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listHinhThucTTSoTaiKhoan.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listCanCuSoVaNgayCanCu.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listCuaVeViec.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listTenNguoiVanChuyenVaHopDongSo.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listPhuongThucVanChuyen.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listXuatKho.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listXuatKho.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listNhapKho.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listTenVaMaSoThueNguoiBan.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.listDiaChiVaTenNguoiXuatHangBan.forEach((item: any) => {
      if (item !== data) {
        item.expand = false;
        item.selected = false;
      }
    });
    this.emitSelectedTCCT();
  }

  getClassName(data: any) {
    return `type-detail-${data.dataFieldName} ant-row`;
  }

  focusInput(data: any, item: MauHoaDonTuyChonChiTiet) {
    this.selectedTCCT = item;

    if (this.data.loaiTuyChonChiTiet === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu) {
      this.doRongCot = this.selectedTCCT.tuyChonChiTiet.doRong;
    } else {
      this.doRongCot = null;
    }
    this.selectedRow(data);
  }

  inputChange(data: any, item: MauHoaDonTuyChonChiTiet) {
    if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon) {
      item.giaTri = item.giaTri ? (item.giaTri.toUpperCase()) : item.giaTri;
    }
    this.detectValueChanges();

    this.joinValueOfContainerType(data);
  }

  joinValueOfContainerType(data: MauHoaDonTuyChonChiTiet) {
    data.giaTri = '';
    const tieuDe = data.children.find(x => x.loaiContainer === 1) as MauHoaDonTuyChonChiTiet;
    const noiDung = data.children.find(x => x.loaiContainer === 2) as MauHoaDonTuyChonChiTiet;
    const tieuDeSongNgu = data.children.find(x => x.loaiContainer === 4) as MauHoaDonTuyChonChiTiet;
    if (tieuDe && tieuDe.giaTri) {
      data.giaTri += tieuDe.giaTri;
    }
    // if (tieuDeSongNgu && tieuDeSongNgu.giaTri) {
    //   data.giaTri += ((tieuDe ? ' ' : '') + tieuDeSongNgu.giaTri);
    // }
    if (noiDung && noiDung.giaTri) {
      data.giaTri += (((tieuDe) ? ': ' : '') + noiDung.giaTri);
    }
  }

  emitValueChangesEvent() {
    this.detectValueChanges();
    this.valueChangesEvent.emit(this.data);
  }

  getPalaceHolderInput() {
    let isFirst = true;
    this.listHinhThucTTSoTaiKhoan = [];
    this.listBoSung = [];
    this.listCanCuSoVaNgayCanCu = [];
    this.listCuaVeViec = [];
    this.listTenNguoiVanChuyenVaHopDongSo = [];
    this.listPhuongThucVanChuyen = [];
    this.listXuatKho = [];
    this.listNhapKho = [];
    this.listTenVaMaSoThueNguoiBan = [];
    this.listDiaChiVaTenNguoiXuatHangBan = [];

    this.listOfData.forEach((item: MauHoaDonTuyChonChiTiet) => {
      if (item.loai === LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV || item.loai === LoaiTuyChinhChiTiet.ThongTinNguoiKy || item.loai === LoaiTuyChinhChiTiet.ThongTinNgoaiTe || item.loai === LoaiTuyChinhChiTiet.ThongTinTraCuu || item.loai === LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue) {
        item.disabledDrag = true;
      }

      if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThoiHanThanhToan || item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiGiaoHang) {
        this.mapOfHiddenAddNewRow[LoaiChiTietTuyChonNoiDung[item.loaiChiTiet]] = true;
      }

      if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenKhacLoaiHoaDon) {
        item.giaTri = 'Tên khác (VD: Phiếu bảo hành,...)';
      }

      this.joinValueOfContainerType(item);

      item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        if (!child.placeholder) {
          if (child.loaiContainer === 1) {
            child.placeholder = '[Tiêu đề]';
          } else if (child.loaiContainer === 2) {
            child.placeholder = '[Nội dung]';
          } else if (child.loaiContainer === 3) {
            child.placeholder = '';
          } else {
            child.placeholder = '[Tiêu đề song ngữ]';
          }
        }

        child.dataFieldName = item.dataFieldName;

        if (child.loaiContainer === 1) {
          this.mapOfTieuDe[child.dataFieldName] = child;
        } else if (child.loaiContainer === 2) {
          this.mapOfNoiDung[child.dataFieldName] = child;
        } else if (child.loaiContainer === 3) {
          this.mapOfKyHieuCot[child.dataFieldName] = child;
        } else {
          this.mapOfTieuDeSongNgu[child.dataFieldName] = child;
        }
      });

      item.selected = false;
    });

    switch (this.data.loaiTuyChonChiTiet) {
      case LoaiTuyChinhChiTiet.ThongTinNguoiBan:
        if (this.data.loaiHoaDon === LoaiHoaDon.PXKKiemVanChuyenNoiBo && this.data.tenBoMau === '01.CB.02') {
          this.listTenVaMaSoThueNguoiBan = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan);
          this.listCanCuSoVaNgayCanCu = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu);
          this.listCuaVeViec = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.VeViecDienGiai);
          this.listTenNguoiVanChuyenVaHopDongSo = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo);
          this.listDiaChiVaTenNguoiXuatHangBan = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang);
          this.listOfData = this.listOfDataAll.filter(x =>
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CanCuSo &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.NgayCanCu &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.Cua &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.VeViecDienGiai &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang &&
            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang);
        }
        break;
      case LoaiTuyChinhChiTiet.ThongTinHoaDon:
        break;
      case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
        if (this.data.loaiHoaDon === LoaiHoaDon.PXKKiemVanChuyenNoiBo || this.data.loaiHoaDon === LoaiHoaDon.PXKHangGuiBanDaiLy) {
          if (this.data.loaiHoaDon === LoaiHoaDon.PXKKiemVanChuyenNoiBo) {
            if (this.data.tenBoMau === '01.CB.01') {
              this.listOfData = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || (this.data.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan));
              this.listCanCuSoVaNgayCanCu = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu);
              this.listCuaVeViec = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.VeViecDienGiai);
              this.listTenNguoiVanChuyenVaHopDongSo = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo);
            } else {
              this.listOfData = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang);
              this.listHinhThucTTSoTaiKhoan = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang || (this.data.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan));
            }
          } else {
            this.listCanCuSoVaNgayCanCu = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu);
            this.listCuaVeViec = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua);
            this.listTenNguoiVanChuyenVaHopDongSo = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo);

            if (this.data.tenBoMau === '01.CB.01') {
              this.listOfData = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || (this.data.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan));
            } else {
              this.listPhuongThucVanChuyen = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen);
              this.listXuatKho = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang);
              this.listNhapKho = this.listOfDataAll.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang);
              this.listOfData = this.listOfDataAll.filter(x => this.data.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan);
            }
          }
        } else {
          this.listOfData = this.listOfDataAll.filter(x => (x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.HoTenNguoiMua && x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua) || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua ||  x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenPhuongTien);
          this.listHinhThucTTSoTaiKhoan = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HinhThucThanhToan || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan);
        }
        console.log("🚀 ~ file: tab-tuy-chinh-chi-tiet.component.ts:464 ~ TabTuyChinhChiTietComponent ~ getPalaceHolderInput ~  this.listOfData :",  this.listOfData )


        this.listBoSung = this.data.tuyChonChiTiets.filter(x => (x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1 && x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung10) || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuBenMua);
        break;
      case LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV:
        if (this.data.dinhDangHoaDon !== 3) {
          this.listOfData = this.listOfDataAll.filter(x => !(x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyLeChietKhau || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTienChietKhau || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK));
        } else {
          this.listOfData = this.listOfDataAll.filter(x => 1 === 1);
        }
        break;
      case LoaiTuyChinhChiTiet.ThongTinNguoiKy:
        if (this.data.dinhDangHoaDon !== 2) {
          this.listOfData = this.listOfDataAll.filter(x => !(x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi));
        } else {
          this.listOfData = this.listOfDataAll.filter(x => 1 === 1);
        }
        break;
      case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
        if (this.data.dinhDangHoaDon !== 4) {
          this.listOfData = this.listOfDataAll.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TyGiaHHDV);
        } else {
          this.listOfData = this.listOfDataAll.filter(x => 1 === 1);
        }
        break;
      default:
        break;
    }

    let dataFieldName = '';

    if (this.listCanCuSoVaNgayCanCu.length > 0 && this.listCanCuSoVaNgayCanCu[0].loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua) {
      this.listCanCuSoVaNgayCanCu[0].expand = true;
      dataFieldName = this.listCanCuSoVaNgayCanCu[0].dataFieldName;
      this.selectedTCCT = this.listCanCuSoVaNgayCanCu[0].children[0];
    } else if (this.listTenVaMaSoThueNguoiBan.length > 0) {
      this.listTenVaMaSoThueNguoiBan[0].expand = true;
      dataFieldName = this.listTenVaMaSoThueNguoiBan[0].dataFieldName;
      this.selectedTCCT = this.listTenVaMaSoThueNguoiBan[0].children[0];
    } else {
      this.listOfData[0].expand = true;
      dataFieldName = this.listOfData[0].dataFieldName;
      this.selectedTCCT = this.listOfData[0].children[0];
    }

    setTimeout(() => {
      let input = document.querySelector(`.type-detail-${dataFieldName} input`) as any;
      input.focus();
    }, 0);
  }

  checkedData(data: any) {
    // this.calculateWidthCol(data);
    this.expandRow(data);
    // this.selectedRow(data);
    this.emitSelectedTCCT();
    this.emitValueChangesEvent();
  }

  calculateWidthCol(data: any) {
    if (data.loai === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu) {
      let minCol = null;
      let totalCol = 0;

      const listWidthColHHDV: Array<{ key: string, width: number }> = [];

      const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === data.loai) as MauHoaDonTuyChonChiTiet[];
      tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
        if (item.checked) {
          item.children.forEach((child: MauHoaDonTuyChonChiTiet, idx: any) => {
            if (child.loaiContainer === 1) {
              if (child.tuyChonChiTiet.doRong != null && child.dataFieldName !== LoaiChiTietTuyChonNoiDung[LoaiChiTietTuyChonNoiDung.STT]) {
                if (minCol == null) {
                  minCol = child.tuyChonChiTiet.doRong;
                } else {
                  if (child.tuyChonChiTiet.doRong < minCol) {
                    minCol = child.tuyChonChiTiet.doRong;
                  }
                }
              }
            }
          });
        }
      });

      tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
        if (item.checked) {
          item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
            if (child.loaiContainer === 1) {
              listWidthColHHDV.push({
                key: child.dataFieldName,
                width: child.tuyChonChiTiet.doRong || minCol
              });
            }
          });
        }
      });

      totalCol += listWidthColHHDV.reduce((a, b) => a + b.width, 0);

      this.deQuySetColHHDV(listWidthColHHDV, totalCol, (totalCol > 100 ? minCol : data.children[0].tuyChonChiTiet.doRong), data);

      tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
        item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
          const widthCol = listWidthColHHDV.find(x => x.key === child.dataFieldName);
          if (widthCol) {
            child.tuyChonChiTiet.doRong = widthCol.width;
          }
        });
      });
    }
  }

  deQuySetColHHDV(listWidthColHHDV: any[], totalCol: any, minCol: any, data: MauHoaDonTuyChonChiTiet, colResult = 0) {
    let result = colResult;
    const isOutOfWidthCol = totalCol > 100;

    for (const item of listWidthColHHDV) {
      if (item.key !== LoaiChiTietTuyChonNoiDung[LoaiChiTietTuyChonNoiDung.STT] && item.key !== data.dataFieldName && result < minCol) {
        result += 1;
        if (isOutOfWidthCol) {
          item.width -= 1;
          if (item.key === LoaiChiTietTuyChonNoiDung[LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu]) {
          }
        } else {
          item.width += 1;
        }
      }

      if (result === minCol) {
        return;
      }
    }

    if (result < minCol) {
      this.deQuySetColHHDV(listWidthColHHDV, totalCol, minCol, data, result);
    }
  }

  clickInDam() {
    if (!this.selectedTCCT || this.selectedTCCT.tuyChonChiTiet.chuDam == null) {
      return;
    }
    this.selectedTCCT.tuyChonChiTiet.chuDam = !this.selectedTCCT.tuyChonChiTiet.chuDam;
    this.emitSelectedTCCT();
  }

  clickInNghieng() {
    if (!this.selectedTCCT || this.selectedTCCT.tuyChonChiTiet.chuNghieng == null) {
      return;
    }
    this.selectedTCCT.tuyChonChiTiet.chuNghieng = !this.selectedTCCT.tuyChonChiTiet.chuNghieng;
    this.emitSelectedTCCT();
  }

  canTieuDe(type: any) {
    if (!this.selectedTCCT || !this.selectedTCCT.tuyChonChiTiet.canTieuDe) {
      return;
    }

    const iframeDynamic = document.getElementById('iframeDynamic') as any;
    const container = iframeDynamic.contentDocument
    let groupField = container.querySelector(`[group-field="${LoaiTuyChinhChiTiet[this.selectedTCCT.loai]}"]`);
    const twoDots = groupField.querySelectorAll(`.two-dot:not(.display-none):not(.no-width)`);
    let maxWidth = 0;

    twoDots.forEach((item: HTMLElement) => {
      if (item.offsetLeft > maxWidth) {
        maxWidth = item.offsetLeft;
      }
    });

    this.selectedTCCT.tuyChonChiTiet.canTieuDe = type;
    const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === this.selectedTCCT.loai) as MauHoaDonTuyChonChiTiet[];
    tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
      item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        child.tuyChonChiTiet.canTieuDe = type;
        if (child.loaiContainer === 1) {
          child.tuyChonChiTiet.doRong = maxWidth;
        }
      });
    });

    this.emitSelectedTCCT();
  }

  clickMaSoThue() {
    if (!this.selectedTCCT || this.selectedTCCT.tuyChonChiTiet.maSoThue == null) {
      return;
    }

    this.selectedTCCT.tuyChonChiTiet.maSoThue = !this.selectedTCCT.tuyChonChiTiet.maSoThue;
    var tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === this.selectedTCCT.loai) as MauHoaDonTuyChonChiTiet[];
    for (const item of tuyChonChiTiets) {
      if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan) {
        item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
          child.tuyChonChiTiet.maSoThue = this.selectedTCCT.tuyChonChiTiet.maSoThue;
        });
      }
    }
    this.emitSelectedTCCT();
  }

  clickCanChu(type: any) {
    if (!this.selectedTCCT || !this.selectedTCCT.tuyChonChiTiet.canChu) {
      return;
    }

    this.selectedTCCT.tuyChonChiTiet.canChu = type;

    switch (this.data.loaiHoaDon) {
      case LoaiHoaDon.HoaDonGTGT:
        this.listOfData.forEach((item: MauHoaDonTuyChonChiTiet) => {
          if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai ||
            item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu ||
            item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu) {
            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
              child.tuyChonChiTiet.canChu = type;
            });
          }
        });
        break;
      case LoaiHoaDon.HoaDonBanHang:
        if (this.selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai ||
          this.selectedTCCT.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu) {
          this.listOfData.forEach((item: MauHoaDonTuyChonChiTiet) => {
            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai ||
              item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu) {
              item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                child.tuyChonChiTiet.canChu = type;
              });
            }
          });
        }
        break;
      default:
        break;
    }

    this.emitSelectedTCCT();
  }

  clickCanChuDoc(type: any) {
    if (!this.selectedTCCT) {
      return;
    }

    this.selectedTCCT.tuyChonChiTiet.canChuDoc = type;
    // this.emitSelectedTCCT();
  }

  async datLaiGiaTriMacDinh() {
    const hoSoHDDT = await this.hoSoHDDTService.GetDetailAsync();
    const rawMauHoaDonTuyChonChiTiet = CreateTuyChonChiTiets(hoSoHDDT, this.data);
    let rawTuyChonChiTiets = [];
    rawMauHoaDonTuyChonChiTiet.map(x => {
      rawTuyChonChiTiets = [...rawTuyChonChiTiets, ...x.children]
    });
    const rawTCCT = rawTuyChonChiTiets.find(x => x.loaiChiTiet === this.selectedTCCT.loaiChiTiet);
    if (rawTCCT) {
      this.selectedTCCT.tuyChonChiTiet = rawTCCT.tuyChonChiTiet;
      this.doRongCot = rawTCCT.tuyChonChiTiet.doRong;
    }
    this.emitSelectedTCCT();
  }

  clickMauNen(colorMauNen: any) {
    if (!colorMauNen || !this.selectedTCCT.tuyChonChiTiet.mauNenTieuDeBang) {
      return;
    }

    if (colorMauNen) {
      colorMauNen.click();
    }
  }

  changeMauNen(event: any) {
    this.selectedTCCT.tuyChonChiTiet.mauNenTieuDeBang = event;
    const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === this.selectedTCCT.loai) as MauHoaDonTuyChonChiTiet[];
    tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
      item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        child.tuyChonChiTiet.mauNenTieuDeBang = event;
      });
    });
    this.emitSelectedTCCT();
  }

  changeMauChu(event: any) {
    this.selectedTCCT.tuyChonChiTiet.mauChu = event;
    this.emitSelectedTCCT();
  }

  emitSelectedTCCT() {
    this.sharedService.emitChange({
      type: "updateSelectedTCCT",
      value: this.selectedTCCT
    });
  }

  afterChangeColWidthSize(event: any) {
    this.selectedTCCT.tuyChonChiTiet.doRong = event;
    const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loaiChiTiet === this.selectedTCCT.loaiChiTiet) as MauHoaDonTuyChonChiTiet[];
    tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
      item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        child.tuyChonChiTiet.doRong = event;
      });
    });
    this.emitSelectedTCCT();
  }

  addTHTT_DCGH(loaiChiTiet: LoaiChiTietTuyChonNoiDung) {
    let maxStt = 0;
    this.listBoSung.forEach((item: MauHoaDonTuyChonChiTiet) => {
      if (item.stt > maxStt) {
        maxStt = item.stt;
      }
    });

    let giaTri = '';
    if (loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThoiHanThanhToan) {
      giaTri = 'Thời hạn thanh toán';
    } else {
      giaTri = 'Địa chỉ giao hàng';
    }

    const data = this.createNewRow(loaiChiTiet, maxStt, null, true, giaTri, false, null, true, '', true, '');

    this.listBoSung.push(data);
    this.data.tuyChonChiTiets.push(data);

    this.visibleAddRowMenu = false;
    this.mapOfHiddenAddNewRow[LoaiChiTietTuyChonNoiDung[loaiChiTiet]] = true;

    this.emitValueChangesEvent();
  }

  removeData(item: MauHoaDonTuyChonChiTiet) {
    this.listBoSung = this.listBoSung.filter(x => x !== item);
    this.listOfData = this.listOfData.filter(x => x !== item);
    this.data.tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => !(x.loaiChiTiet === item.loaiChiTiet && x.stt === item.stt));
    if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThoiHanThanhToan || item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiGiaoHang) {
      this.mapOfHiddenAddNewRow[LoaiChiTietTuyChonNoiDung[item.loaiChiTiet]] = false;
    }

    this.calculateWidthCol(item);
    this.emitValueChangesEvent();
  }

  public get loaiChiTiet(): typeof LoaiChiTietTuyChonNoiDung {
    return LoaiChiTietTuyChonNoiDung;
  }

  public get type(): typeof LoaiTuyChinhChiTiet {
    return LoaiTuyChinhChiTiet;
  }

  addNewRow() {
    let maxStt = 0;
    let maxCustomKey = 0;
    let countCustomField = 0;
    this.visibleAddRowMenu = false;

    if (this.data.loaiTuyChonChiTiet !== LoaiTuyChinhChiTiet.ThongTinNguoiMua) {
      this.listOfData.forEach((item: MauHoaDonTuyChonChiTiet) => {
        if (item.stt > maxStt) {
          maxStt = item.stt;
        }
        if (item.loaiChiTiet < 0) {
          countCustomField += 1;
        }
      });
      maxCustomKey = this.getCustomKey(this.listOfData);
    } else {
      this.listBoSung.forEach((item: MauHoaDonTuyChonChiTiet) => {
        if (item.stt > maxStt) {
          maxStt = item.stt;
        }
        if (item.loaiChiTiet < 0) {
          countCustomField += 1;
        }
      });
      maxCustomKey = this.getCustomKey(this.listBoSung);
    }

    if (countCustomField > 10) {
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
          msContent: 'Hiện tại chương trình chỉ hỗ trợ tối đa 10 trường mở rộng.',
          msOnClose: () => {
          },
        }
      });
      return;
    }

    let data = null;
    switch (this.data.loaiTuyChonChiTiet) {
      case LoaiTuyChinhChiTiet.ThongTinNguoiBan:
        data = this.createNewRow(LoaiChiTietTuyChonNoiDung.CustomNguoiBan, maxStt, maxCustomKey, true, 'Trường mở rộng', false, null, true, '', false, null);
        break;
      case LoaiTuyChinhChiTiet.ThongTinHoaDon:
        data = this.createNewRow(LoaiChiTietTuyChonNoiDung.CustomThongTinHoaDon, maxStt, maxCustomKey, false, null, null, null, true, '', false, null);
        break;
      case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
        // data = this.createNewRow(LoaiChiTietTuyChonNoiDung.CustomNguoiMua, maxStt, maxCustomKey, true, '', true, null, true, '', true, null, true);
        break;
      case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
        // data = this.createNewRow(LoaiChiTietTuyChonNoiDung.CustomHangHoaDichVu, maxStt, maxCustomKey, true, '', true, null, true, '', true, null, true);
        break;
      default:
        break;
    }

    if (data) {
      switch (this.data.loaiTuyChonChiTiet) {
        case LoaiTuyChinhChiTiet.ThongTinNguoiBan:
        case LoaiTuyChinhChiTiet.ThongTinHoaDon:
          this.listOfData.push(data);
          this.data.tuyChonChiTiets.push(data);
          this.emitValueChangesEvent();
          break;
        case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
        case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
          this.settingTruongMoRongData = data;
          this.isSettingTruongMoRong = true;
          this.sharedService.emitChange({
            type: "updateSettingTruongMoRong",
            value: this.isSettingTruongMoRong
          });
          break;
        default:
          break;
      }
    }
  }

  getCustomKey(list: any[], isCustom = true) {
    switch (this.data.loaiTuyChonChiTiet) {
      case LoaiTuyChinhChiTiet.ThongTinNguoiBan:
        list = list.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomNguoiBan);
        break;
      case LoaiTuyChinhChiTiet.ThongTinHoaDon:
        list = list.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomThongTinHoaDon);
        break;
      case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
        if (isCustom) {
          // list = list.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomNguoiMua);
        } else {
          list = list.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuBenMua);
        }
        break;
      case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
        // list = list.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomHangHoaDichVu);
        break;
      default:
        break;
    }

    const listCustomKey = list.map(x => x.customKey);

    if (listCustomKey.length > 0) {
      for (let i = 1; i <= 10; i++) {
        if (!listCustomKey.includes(i)) {
          return i;
        }
      }
    }

    return 1;
  }

  createNewRow(loaiChiTiet: LoaiChiTietTuyChonNoiDung, maxStt: any, maxCustomKey: number, hasTieuDe: boolean, tieuDe: string, disableTieuDe: boolean, placeHolderTieuDe: string, hasNoiDung: boolean, noiDung: string, disableNoiDung: boolean, placeHolderNoiDung: string, hasSongNgu = false) {
    const dataFieldName = LoaiChiTietTuyChonNoiDung[loaiChiTiet] + (loaiChiTiet < 0 ? (`${maxCustomKey}`) : '');

    const data = {
      giaTri: '',
      kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
      loai: this.data.loaiTuyChonChiTiet,
      loaiChiTiet: loaiChiTiet,
      tenTiengAnh: null,
      isParent: true,
      checked: true,
      disabled: false,
      stt: maxStt + 1,
      customKey: maxCustomKey,
      dataFieldName: dataFieldName,
      children: [
        ///
      ]
    };

    const canTieuDe = this.data.tuyChonChiTiets.filter(x => x.loai === this.data.loaiTuyChonChiTiet)[0].children[0].tuyChonChiTiet.canTieuDe;

    if (hasTieuDe) {
      const item = {
        giaTri: tieuDe,
        tuyChonChiTiet: {
          doRong: 10,
          coChu: 14 + this.data.coChu,
          canTieuDe: canTieuDe,
          chuDam: this.data.loaiTuyChonChiTiet === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu ? true : false,
          chuNghieng: false,
          maSoThue: null,
          mauNenTieuDeBang: null,
          mauChu: this.data.mauChu,
          canChu: this.data.loaiTuyChonChiTiet === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu ? 2 : null
        },
        kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        loai: this.data.loaiTuyChonChiTiet,
        loaiChiTiet: loaiChiTiet,
        customKey: maxCustomKey,
        loaiContainer: 1,
        isParent: false,
        disabled: disableTieuDe,
        placeholder: placeHolderTieuDe || '[Tiêu đề]',
        dataFieldName: dataFieldName
      };

      this.mapOfTieuDe[item.dataFieldName] = item;
      data.children.push(item);
    }

    if (hasNoiDung) {
      const item = {
        giaTri: noiDung,
        tuyChonChiTiet: {
          doRong: 10,
          coChu: 14 + this.data.coChu,
          canTieuDe: canTieuDe,
          chuDam: false,
          chuNghieng: false,
          maSoThue: null,
          mauNenTieuDeBang: null,
          mauChu: this.data.mauChu,
          canChu: null
        },
        kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        loai: this.data.loaiTuyChonChiTiet,
        loaiChiTiet: loaiChiTiet,
        customKey: maxCustomKey,
        loaiContainer: 2,
        isParent: false,
        disabled: disableNoiDung,
        placeholder: placeHolderNoiDung || '[Nội dung]',
        dataFieldName: dataFieldName
      };

      this.mapOfNoiDung[item.dataFieldName] = item;
      data.children.push(item);
    }

    if (this.data.loaiTuyChonChiTiet === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu) {
      const item = {
        giaTri: noiDung,
        tuyChonChiTiet: {
          doRong: 10,
          coChu: 14 + this.data.coChu,
          canTieuDe: canTieuDe,
          chuDam: true,
          chuNghieng: false,
          maSoThue: null,
          mauNenTieuDeBang: null,
          mauChu: this.data.mauChu,
          canChu: 2
        },
        kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        loai: this.data.loaiTuyChonChiTiet,
        loaiChiTiet: loaiChiTiet,
        customKey: maxCustomKey,
        loaiContainer: 3,
        isParent: false,
        disabled: false,
        dataFieldName: dataFieldName
      };

      this.mapOfKyHieuCot[item.dataFieldName] = item;
      data.children.push(item);
    }

    if (hasSongNgu) {
      const item = {
        giaTri: '',
        tuyChonChiTiet: {
          doRong: 10,
          coChu: 13 + this.data.coChu,
          canTieuDe: canTieuDe,
          chuDam: false,
          chuNghieng: true,
          maSoThue: null,
          mauNenTieuDeBang: null,
          mauChu: this.data.mauChu,
          canChu: null
        },
        kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        loai: this.data.loaiTuyChonChiTiet,
        loaiChiTiet: loaiChiTiet,
        customKey: maxCustomKey,
        loaiContainer: 4,
        isParent: false,
        disabled: disableTieuDe,
        dataFieldName: dataFieldName
      };
      data.children.push(item);
    }

    if (data.children.length > 0) {
      this.joinValueOfContainerType(data);
    }

    return data;
  }

  settingData(data: any) {
    this.settingTruongMoRongData = data;
    this.isSettingTruongMoRong = true;
    this.sharedService.emitChange({
      type: "updateSettingTruongMoRong",
      value: this.isSettingTruongMoRong
    });
  }

  onConfirmSettingData(res: any) {
    if (res.status) {
      this.isSettingTruongMoRong = false;
      this.sharedService.emitChange({
        type: "updateSettingTruongMoRong",
        value: this.isSettingTruongMoRong
      });
      const data = res.data as MauHoaDonTuyChonChiTiet;
      this.joinValueOfContainerType(data);
      let findIndex = -1;
      let findIndexMain = -1;

      switch (this.data.loaiTuyChonChiTiet) {
        case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
          findIndex = this.listBoSung.findIndex(x => x.loaiChiTiet === data.loaiChiTiet && x.customKey === data.customKey);
          findIndexMain = this.data.tuyChonChiTiets.findIndex(x => x.loaiChiTiet === data.loaiChiTiet && x.customKey === data.customKey);
          break;
        case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
          findIndex = this.listOfData.findIndex(x => x.loaiChiTiet === data.loaiChiTiet && x.customKey === data.customKey);
          findIndexMain = this.data.tuyChonChiTiets.findIndex(x => x.loaiChiTiet === data.loaiChiTiet && x.customKey === data.customKey);
          break;
        default:
          break;
      }

      if (findIndex === -1 && findIndexMain === -1) {
        switch (this.data.loaiTuyChonChiTiet) {
          case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
            this.listBoSung.push(data);
            break;
          case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
            this.listOfData.push(data);
            break;
          default:
            break;
        }

        this.data.tuyChonChiTiets.push(data);
      } else {
        switch (this.data.loaiTuyChonChiTiet) {
          case LoaiTuyChinhChiTiet.ThongTinNguoiMua:
            this.listBoSung[findIndex] = data;
            break;
          case LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu:
            this.listOfData[findIndex] = data;
            break;
          default:
            break;
        }

        this.data.tuyChonChiTiets[findIndexMain] = data;
      }

      if (data) {
        const tieuDe = data.children.find(x => x.loaiContainer === 1);
        const noiDung = data.children.find(x => x.loaiContainer === 2);
        console.log("🚀 ~ file: tab-tuy-chinh-chi-tiet.component.ts:1153 ~ TabTuyChinhChiTietComponent ~ onConfirmSettingData ~ noiDung:", noiDung)
        const tieuDeSongNgu = data.children.find(x => x.loaiContainer === 4);

        if (tieuDe) {
          this.mapOfTieuDe[data.dataFieldName] = tieuDe;
        }
        if (noiDung) {
          this.mapOfNoiDung[data.dataFieldName] = noiDung;
        }
        if (tieuDeSongNgu) {
          this.mapOfTieuDeSongNgu[data.dataFieldName] = tieuDeSongNgu;
        }
      }

      this.calculateWidthCol(data);
      this.emitValueChangesEvent();
    }
  }

  addGhiChuThongTinNguoiMua() {
    let maxStt = 0;
    let maxCustomKey = 0;
    this.visibleAddRowMenu = false;

    this.listBoSung.forEach((item: MauHoaDonTuyChonChiTiet) => {
      if (item.stt > maxStt) {
        maxStt = item.stt;
      }
    });

    maxCustomKey = this.getCustomKey(this.listBoSung, false);

    let data = this.createNewRow(LoaiChiTietTuyChonNoiDung.GhiChuBenMua, maxStt, maxCustomKey, true, '', false, null, true, '', false, null);

    this.listBoSung.push(data);
    this.data.tuyChonChiTiets.push(data);
    this.emitValueChangesEvent();
  }

  changeTuyChinhGiaTriNoiDung(event: any) {
    if (!this.selectedTCCT) {
      return;
    }

    const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === this.selectedTCCT.loai) as MauHoaDonTuyChonChiTiet[];
    tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
      item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
        child.tuyChonChiTiet.isTuyChinhGiaTri = event;
        if (child.loaiContainer === 2 && child.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CustomNguoiBan) {
          child.disabled = !event;
        }
      });
    });

    this.emitSelectedTCCT();
  }

  inputNoiDung(data: any) {
    if (data && data.giaTri && data.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan) {
      data.giaTri = data.giaTri.toUpperCase();
    }
  }

  taiLaiThongTinNguoiNopThue() {
    this.loadingTaiLaiThongTinNguoiNopThue = true;
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        const tuyChonChiTiets = this.data.tuyChonChiTiets.filter(x => x.loai === this.selectedTCCT.loai) as MauHoaDonTuyChonChiTiet[];

        tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
          item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
            if (child.loaiContainer === 2) {
              switch (child.loaiChiTiet) {
                case LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan:
                  child.giaTri = (res.tenDonVi || '').toUpperCase()
                  break;
                case LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan:
                  child.giaTri = res.maSoThue;
                  break;
                case LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan:
                  child.giaTri = res.diaChi;
                  break;
                case LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan:
                  child.giaTri = res.soDienThoaiLienHe;
                  break;
                case LoaiChiTietTuyChonNoiDung.FaxNguoiBan:
                  child.giaTri = res.fax;
                  break;
                case LoaiChiTietTuyChonNoiDung.WebsiteNguoiBan:
                  child.giaTri = res.website;
                  break;
                case LoaiChiTietTuyChonNoiDung.EmailNguoiBan:
                  child.giaTri = res.emailLienHe;
                  break;
                case LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan:
                  const soTaiKhoans = [res.soTaiKhoanNganHang, res.tenNganHang, res.chiNhanh];
                  child.giaTri = soTaiKhoans.filter(x => !!x).join(' - ');
                  break;
                default:
                  break;
              }
            }
          });
        });

        this.emitValueChangesEvent();
        this.loadingTaiLaiThongTinNguoiNopThue = false;
      });
  }
  CheckChangeValue(item: any, title: any, value: any) {
    this.detectValueChanges();
    this.isErorrEmpty = false;
    this.isErorrMaxlengt = false;
    this.StringErorr = '';
    switch (title.dataFieldName) {
      case "TenDonViNguoiBan":
        item.Maxlength = 401;
        this.checkMaxLengthOfData(item, value, 400, true);
        break;
      case "MaSoThueNguoiBan":
        item.Maxlength = 15;
        this.checkMaxLengthOfData(item, value, 14, true, true);
        break;
      case "DiaChiNguoiBan":
        item.Maxlength = 401;
        this.checkMaxLengthOfData(item, value, 400, true);
        break;
      case "DienThoaiNguoiBan":
        item.Maxlength = 21;
        this.checkMaxLengthOfData(item, value, 20, false);
        break;
      case "FaxNguoiBan":
        item.Maxlength = 21;
        this.checkMaxLengthOfData(item, value, 20, false);
        break;
      case "WebsiteNguoiBan":
        item.Maxlength = 101;
        this.checkMaxLengthOfData(item, value, 100, false);
        break;
      case "EmailNguoiBan":
        item.Maxlength = 51;
        this.checkMaxLengthOfData(item, value, 50, false);
        break;
      case "SoTaiKhoanNguoiBan":
        item.Maxlength = 421;
        this.checkMaxLengthOfData(item, value, 420, false);
        break;
      default:
        break;
    }

  }
  checkMaxLengthOfData(item: any, value: any, maxlength: number, isRequred: boolean = false, isMaSoThue: boolean = false) {
    item.StringErorr = '';
    item.isErorrEmpty = false;
    item.isErorrMaxlengt = false;
    item.isErorrMST = false;
    if (isRequred && value.length < 1 && !isMaSoThue) {
      item.isErorrEmpty = true;
      item.StringErorr = 'Không để trống. '
    }
    if (isMaSoThue && value.length != 10 && value.length != 14) {
      item.isErorrMST = true;
      item.StringErorr += `Số ký tự của MST phải bằng 10 hoặc 14.`;
    }
    if (value.length > maxlength && !isMaSoThue) {
      item.isErorrMaxlengt = true;
      item.StringErorr += `Không được vượt quá ${maxlength} ký tự.`;
    }
  }
}
