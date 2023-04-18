import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { EnvService } from 'src/app/env.service';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { IsSVG } from 'src/app/shared/SharedFunction';
import { GroupThongTinNguoiKy } from 'src/assets/ts/init-create-mau-hd';

@Component({
  selector: 'app-mau-hoa-don-html-raw',
  templateUrl: './mau-hoa-don-html-raw.component.html',
  styleUrls: ['./mau-hoa-don-html-raw.component.scss']
})
export class MauHoaDonHtmlRawComponent implements OnInit {
  @Input() inputData: any;
  @Input() dinhDangHoaDon: any;
  emptyArrayRows = [];
  emptyArrayCols = [];
  company: any;
  tuyChonChiTiets: MauHoaDonTuyChonChiTiet[];
  listMaSoThueNguoiBan = [];
  listHinhThucTTSoTaiKhoan = [];
  listTenDonViVaMSTNguoiBan = [];
  listDiaChiVaTenNguoiXuatHang = [];
  listCanCuSoVaNgayCanCuNguoiBan = [];
  listCuaVeViecNguoiBan = [];
  listTenNguoiVanChuyenVaHopDongSoNguoiBan = [];
  listCanCuSoVaNgayCanCu = [];
  listCuaVeViec = [];
  listTenNguoiVanChuyenVaHopDongSo = [];
  listPhuongTienVanChuyen = [];
  listXuatKho = [];
  listNhapKho = [];
  listCuaVoiMaSoThue = [];
  listBoSungNguoiMua = [];
  listThongTinNguoiBan: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinHoaDon: MauHoaDonTuyChonChiTiet[] = [];
  listMauSoKyHieuSoHoaDon: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNguoiMua: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinVeHangHoaDichVu: MauHoaDonTuyChonChiTiet[] = [];
  listSoLuongNhapXuat: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNgoaiTe: MauHoaDonTuyChonChiTiet[] = [];
  listThongTinNguoiKy: MauHoaDonTuyChonChiTiet[] = [];
  listTenNguoiNhanHangNguoiMua: MauHoaDonTuyChonChiTiet[] = [];
  listGroupThongTinNguoiKy: Array<{ key: any, children: any[] }> = [];
  listTieuDeTongHopThueGTGT: MauHoaDonTuyChonChiTiet[] = [];
  listTongTienChiuThueSuat: MauHoaDonTuyChonChiTiet[] = [];
  listDongKyHieuCot: MauHoaDonTuyChonChiTiet[] = [];
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
    console.log("🚀 ~ file: mau-hoa-don-html-raw.component.ts:75 ~ MauHoaDonHtmlRawComponent ~ changeInput ~ this.inputData:", this.inputData)
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
          } else if (child.loaiContainer === 4) {
            item.tieuDeSongNgu = child;
          } else {
            item.tieuDeSongNgu = null;
          }
        });
        if(item.children.findIndex(x => x.loaiContainer == 4) < 0) {
          item.tieuDeSongNgu = null;
        }
      }
   
      this.mapOfData[item.dataFieldName] = item;

    });

    this.tuyChonChiTiets = this.tuyChonChiTiets.sort((a, b) => a.stt - b.stt);

    this.listThongTinNguoiBan = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiBan && x.checked === true);
    this.listThongTinHoaDon = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinHoaDon && x.checked === true);
    this.listMauSoKyHieuSoHoaDon = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon && x.checked === true);

    if (this.inputData.tenBoMau === '01.CB.04' && this.inputData.loaiHoaDon === 1) {
      this.listThongTinNgoaiTe = null;
    }

    this.listThongTinVeHangHoaDichVu = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu && x.checked === true);
    if (this.dinhDangHoaDon !== 4) {
      this.listThongTinVeHangHoaDichVu = this.listThongTinVeHangHoaDichVu.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TyGiaHHDV);
    }
    this.listDongKyHieuCot = this.listThongTinVeHangHoaDichVu;

    this.emptyArrayRows = new Array(this.inputData.soDongTrang).fill(0);
    this.emptyArrayCols = new Array(this.listThongTinVeHangHoaDichVu.length).fill(0);

    // Hiển thị col hàng hóa dịch vụ trong TH loại hóa đơn là phiếu xuất kho
    if (this.inputData.loaiHoaDon === 7) {
      if (this.mapOfData[this.dataField[this.dataField.SoLuongNhapXuat]].checked) {
        this.listSoLuongNhapXuat = this.listThongTinVeHangHoaDichVu.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoLuong || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoLuongNhap);
        this.listThongTinVeHangHoaDichVu = this.listThongTinVeHangHoaDichVu.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoLuong && x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoLuongNhap);
        this.listDongKyHieuCot = this.listDongKyHieuCot.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoLuongNhapXuat);
        this.emptyArrayCols.splice(0, 1);
      } else {
        this.listSoLuongNhapXuat = [];
      }
    }

    this.listBoSungNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && ((x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1 && x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung10) || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuBenMua));
    this.listThongTinNgoaiTe = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNgoaiTe && x.checked === true);
    this.listThongTinNguoiKy = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiKy && x.checked === true);

    if (this.inputData.loaiHoaDon === 1 || this.inputData.loaiHoaDon === 2 || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonGTGTCMTMTT || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonBanHangCMTMTT || this.inputData.loaiHoaDon === LoaiHoaDon.HoaDonKhacCMTMTT || this.inputData.loaiHoaDon === LoaiHoaDon.TemVeBanHang ) {
      this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && ( x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.HoTenNguoiMua && x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua ) || (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua && x.checked == true) 
      || (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua && x.checked == true) || (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenPhuongTien && x.checked == true));
      this.listHinhThucTTSoTaiKhoan = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HinhThucThanhToan || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua || (this.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan)));
    } else {
      if (this.inputData.loaiHoaDon === 7 && this.inputData.tenBoMau === '01.CB.02') {
        this.listTenDonViVaMSTNguoiBan = this.listThongTinNguoiBan.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan);
        this.listCanCuSoVaNgayCanCuNguoiBan = this.listThongTinNguoiBan.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu);
        this.listCuaVeViecNguoiBan = this.listThongTinNguoiBan.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.VeViecDienGiai);
        this.listDiaChiVaTenNguoiXuatHang = this.listThongTinNguoiBan.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang);
        this.listTenNguoiVanChuyenVaHopDongSoNguoiBan = this.listThongTinNguoiBan.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo);

        this.listThongTinNguoiBan = this.listThongTinNguoiBan.filter(x => !(x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan ||
          x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu ||
          x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.VeViecDienGiai ||
          x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo ||
          x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang));

        this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang));
        this.listTenNguoiNhanHangNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang || (this.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan)));
      } else if (this.inputData.loaiHoaDon === 8) {
        this.listCanCuSoVaNgayCanCu = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu));
        this.listCuaVoiMaSoThue = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua));
        this.listTenNguoiVanChuyenVaHopDongSo = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo));

        if (this.inputData.tenBoMau === '01.CB.01') {
          this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || (this.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan)));
        } else {
          this.listPhuongTienVanChuyen = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen);
          this.listXuatKho = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang));
          this.listNhapKho = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang));
          this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && this.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan);
        }
      } else {
        this.listThongTinNguoiMua = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang || (this.dinhDangHoaDon === 4 && x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan)));
        this.listCanCuSoVaNgayCanCu = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CanCuSo || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayCanCu));
        this.listCuaVeViec = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.Cua || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.VeViecDienGiai));
        this.listTenNguoiVanChuyenVaHopDongSo = this.tuyChonChiTiets.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiMua && x.checked === true && (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen || x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo));
      }
    }

    this.listGroupThongTinNguoiKy = GroupThongTinNguoiKy(this.listThongTinNguoiKy);

    if (this.dinhDangHoaDon !== 2) {
      this.listGroupThongTinNguoiKy = this.listGroupThongTinNguoiKy.filter(x => x.key !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi);
    }

    this.listTieuDeTongHopThueGTGT = this.tuyChonChiTiets
      .filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongHopThueGTGT ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CongTienHang ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TienThueGTGT ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongTienThanhToan);

    this.listTieuDeTongHopThueGTGT.forEach((item: MauHoaDonTuyChonChiTiet) => {
      if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongHopThueGTGT) {
        item.width = 194.469;
      } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CongTienHang) {
        item.width = 191.719;
      } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TienThueGTGT) {
        item.width = 192.047;
      } else {
        item.width = 191.766;
      }
    });

    this.listTongTienChiuThueSuat = this.tuyChonChiTiets
      .filter(x => x.loaiChiTiet >= LoaiChiTietTuyChonNoiDung.TongTienKhongKeKhaiThue &&
        x.loaiChiTiet <= LoaiChiTietTuyChonNoiDung.TongCongTongHopThueGTGT && x.checked === true);

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
