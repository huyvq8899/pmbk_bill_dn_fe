import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { EnvService } from 'src/app/env.service';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { IsSVG } from 'src/app/shared/SharedFunction';
import { GroupThongTinNguoiKy } from 'src/assets/ts/init-create-mau-hd';

@Component({
  selector: 'app-mau-ve-du-lich',
  templateUrl: './mau-ve-du-lich.component.html',
  styleUrls: ['./mau-ve-du-lich.component.scss']
})
export class MauVeDuLichComponent implements OnInit {
  @Input() inputData: any;
  @Input() dinhDangHoaDon: any;
  emptyArrayRows = [];
  emptyArrayCols = [];
  company: any;
  tuyChonChiTiets: MauHoaDonTuyChonChiTiet[];
  listMaSoThueNguoiBan = [];
  listTenDonViVaMSTNguoiBan = [];
  listDiaChiVaTenNguoiXuatHang = [];
  listThongTinNguoiBan: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinHoaDon: MauHoaDonTuyChonChiTiet[] = [];
  listMauSoKyHieuSoHoaDon: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNguoiMua: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinVeHangHoaDichVu: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNgoaiTe: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNguoiKy: MauHoaDonTuyChonChiTiet[] = [];
  listTenNguoiNhanHangNguoiMua: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinTraCuu: MauHoaDonTuyChonChiTiet[] = [];
  listGroupThongTinNguoiKy: Array<{ key: any, children: any[] }> = [];
  listDongKyHieuCot: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinQRCode: MauHoaDonTuyChonChiTiet[] = [];
  mapOfData: { [key: string]: MauHoaDonTuyChonChiTiet } = {};
  isSVGKhungVien = false;
  isSVGHinhNen = false;
  bgUrlKhungVien = null;
  bgUrlHinhNen = null;

  constructor(
    private env: EnvService,
    private hoSoHDDTService: HoSoHDDTService) { }

  ngOnInit() {
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        this.company = res;
      });

    this.changeInput();
  }

  changeInput() {
    if (!this.inputData) {
      return;
    }

    this.tuyChonChiTiets = this.inputData.tuyChonChiTiets;
    this.tuyChonChiTiets.forEach((item: MauHoaDonTuyChonChiTiet) => {
      if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomNguoiBan ||
        item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CustomThongTinHoaDon ||
        item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuBenMua) {
        item.dataFieldName = LoaiChiTietTuyChonNoiDung[item.loaiChiTiet] + item.customKey;
      } else {
        item.dataFieldName = LoaiChiTietTuyChonNoiDung[item.loaiChiTiet];
      }

      if (item.children && item.children.length > 0) {
        item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
          if (child.loaiContainer === 1) {
            item.tieuDe = child;
          } else if (child.loaiContainer === 2) {

            item.noiDung = child;

            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan && item.noiDung) {
              this.listMaSoThueNguoiBan = item.noiDung.giaTri.split('');
            }
          } else if (child.loaiContainer === 3) {
            item.kyHieuCot = child;
          } else {
            item.tieuDeSongNgu = child;
          }
        });
      }

      this.mapOfData[item.dataFieldName] = item;
    });

    this.tuyChonChiTiets = this.tuyChonChiTiets.sort((a, b) => a.stt - b.stt);

    this.listThongTinNguoiBan = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiBan && x.checked === true);
    this.listThongTinHoaDon = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinHoaDon && x.checked === true);
    this.listMauSoKyHieuSoHoaDon = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon && x.checked === true);
    this.listThongTinTraCuu = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinTraCuu && x.checked === true);
    this.listThongTinQRCode = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.MaQRCode && x.checked === true);
    console.log("🚀 ~ file: mau-ve-du-lich.component.ts:100 ~ MauVeDuLichComponent ~ changeInput ~ listThongTinQRCode:", this.listThongTinHoaDon)
    /// Thông tin đi kèm với mã QR Code

    this.emptyArrayRows = new Array(this.inputData.soDongTrang).fill(0);

    // Hiển thị col hàng hóa dịch vụ trong TH loại hóa đơn là phiếu xuất kho

    this.listThongTinNgoaiTe = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNgoaiTe && x.checked === true);
    this.listThongTinNguoiKy = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiKy && x.checked === true);

    if (this.inputData.loaiHoaDon === 1 || this.inputData.loaiHoaDon === 2 || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonGTGTCMTMTT || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonBanHangCMTMTT || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonKhacCMTMTT ) {
      this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && ( x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.HoTenNguoiMua && x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua ) || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua);
    
    }

    this.listGroupThongTinNguoiKy = GroupThongTinNguoiKy(this.listThongTinNguoiKy);

    if (this.dinhDangHoaDon !== 2) {
      this.listGroupThongTinNguoiKy = this.listGroupThongTinNguoiKy.filter(x => x.key !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi);
    }


    this.checkIsSVG();
    this.getBackgroundUrl();
  }

  checkIsSVG() {
    this.isSVGKhungVien = IsSVG(this.inputData.khungVienMacDinh);
    this.isSVGHinhNen = IsSVG(this.inputData.hinhNenMacDinh);
  }

  getBackgroundUrl() {
    if (this.isSVGKhungVien) {
      this.bgUrlKhungVien = 'unset';
    } else {
      if (this.inputData.khungVienMacDinh) {
        this.bgUrlKhungVien = `url(${this.env.apiUrl + this.inputData.khungVienMacDinh})`;
      } else {
        this.bgUrlKhungVien = 'unset';
      }
    }

    if (this.isSVGHinhNen) {
      this.bgUrlHinhNen = 'unset';
    } else {
      if (this.inputData.hinhNenMacDinh) {
        this.bgUrlHinhNen = `url(${this.env.apiUrl + this.inputData.hinhNenMacDinh})`;
      } else {
        this.bgUrlHinhNen = 'unset';
      }
    }
  }

  public get groupField(): typeof LoaiTuyChinhChiTiet {
    return LoaiTuyChinhChiTiet;
  }

  public get dataField(): typeof LoaiChiTietTuyChonNoiDung {
    return LoaiChiTietTuyChonNoiDung;
  }

  public get loaiHoaDon(): typeof LoaiHoaDon {
    return LoaiHoaDon;
  }

}
