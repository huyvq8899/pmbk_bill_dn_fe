// Lớp này dữ nguyên, ko thêm trường gì, muốn thêm thì tạo lớp khác rồi kế thừa lớp này

import { AnimationStyleMetadata } from "@angular/animations";
import { NumberValueAccessor } from "@angular/forms";

// vd: DoiTuongParams : PagingParams
export class PagingParams {
    PageNumber?: number;
    PageSize?: number;
    Keyword?: string;
    SortValue?: string;
    SortKey?: string;
    Ky?: number;
    nam?: number;
    fromDate?: string;
    toDate?: string;
    oldFromDate?: string;
    oldToDate?: string;
    Filter?: any;
    userId?: any;
    isActive?: boolean;
    isExportPDF?: boolean;
    IsPos?: boolean;
    filterColumns?: FilterColumn[];
    Type?: number;
}

export class FilterColumn {
    colKey?: string;
    colValue?: any;
    filterCondition?: FilterCondition;
    isFilter?: boolean;
    isString?: boolean;
    stt?: number;
    colNameVI?: string;
}

export enum FilterCondition {
    Chua = 1,
    KhongChua = 2,
    Bang = 3,
    Khac = 4,
    BatDau = 5,
    KetThuc = 6,
    NhoHon = 7,
    NhoHonHoacBang = 8,
    LonHon = 9,
    LonHonHoacBang = 10,
    Trong = 11,
    KhongTrong = 12
}

export class MauHoaDonParams extends PagingParams {
    MauHoaDonDuocPQ?: any[];
    IsAdmin?: boolean;
}

export class HoaDonParams extends PagingParams {
    KhachHangId?: string;
    LoaiHoaDon?: number;
    HinhThucHoaDon?: number;
    UyNhiemLapHoaDon?: number;
    TrangThaiHoaDonDienTu?: number;
    TrangThaiPhatHanh?: number;
    TrangThaiGuiHoaDon?: number;
    TrangThaiChuyenDoi?: number;
    TrangThaiBienBanXoaBo?: number;
    TrangThaiXoaBo?: number;
    GiaTri?: string;
    TimKiemTheo?: any;
    MauHoaDonDuocPQ?: any[];
    LocHoaDonCoSaiSotChuaLapTBao04?: boolean;
    HoaDonDienTus?: any[];
    HoaDonDienTuIds?: any[];
    LoaiNghiepVu?: number; // 2: phiếu xuất kho
}

export class HoaDonThayTheParams extends PagingParams {
    LoaiTrangThaiPhatHanh?: any;
    LoaiTrangThaiGuiHoaDon?: any;
    TrangThaiQuyTrinh?: any;
    TimKiemTheo?: any;
    GiaTri?: string;
    TimKiemBatKy?: string;
    MauHoaDonDuocPQ?: any[];
    LoaiNghiepVu?: number;
}

export class HoaDonDieuChinhParams extends PagingParams {
    LoaiTrangThaiHoaDonDieuChinh?: any;
    LoaiTrangThaiPhatHanh?: any;
    LoaiTrangThaiBienBanDieuChinhHoaDon?: any;
    TrangThaiGuiHoaDon?: any;
    TimKiemTheo?: any;
    GiaTri?: string;
    MauHoaDonDuocPQ?: any[];
    LoaiNghiepVu?: number;
}

export class TongHopGiaTriHoaDonDaSuDungParams extends PagingParams {
    LoaiMau?: any;
    LoaiTienId?: any;
    IsKhongTinhGiaTriGoc?: boolean;
    IsKhongTinhGiaTriHoaDonXoaBo?: boolean;
    IsKhongTinhGiaTriHoaDonThayThe?: boolean;
    IsKhongTinhGiaTriHoaDonDieuChinh?: boolean;
}

export class ThongDiepChungParams extends PagingParams{
    LoaiThongDiep?: number;
    TrangThaiGui?: number;
    IsThongDiepGui?: boolean;
    LocThongBaoHoaDonCanRaSoat?: boolean;
    TimKiemTheo?: any;
    GiaTri?: string;
}

export class NhatKyGuiEmailParams extends PagingParams {
    TimKiemTheo?: any;
    GiaTri?: string;
    TimKiemBatKy?: string;
    LoaiEmail?: number;
    TrangThaiGuiEmail?: number;
    LoaiHoaDon?: number;
}

export class NhatKyTruyCapParams extends PagingParams {
    TimKiemTheo?: any;
    GiaTri?: string;
    TimKiemBatKy?: string;
}

export class BangTongHopParams extends PagingParams{
    LoaiHangHoa?: number;
    TrangThaiQuyTrinh?: number;
    LanDau?: number;
    TimKiemTheo?: any;
    GiaTri?: string;
}