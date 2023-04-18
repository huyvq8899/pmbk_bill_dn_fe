import { LoaiChiTietTuyChonNoiDung, LoaiThietLapMacDinh, LoaiTuyChinhChiTiet } from "src/app/enums/LoaiThietLapMacDinh.enums";

export class MauHoaDonThietLapMacDinh {
    MauHoaDonThietLapMacDinhId?: any;
    MauHoaDonId?: any;
    Loai?: LoaiThietLapMacDinh;
    GiaTri?: any;
    GiaTriBoSung?: any;
}

export class MauHoaDonTuyChonChiTiet {
    mauHoaDonTuyChinhChiTietId?: any;
    mauHoaDonId?: string;
    giaTri?: string;
    tuyChonChiTiet?: TuyChinhChiTietModel;
    tuyChinhChiTiet?: string;
    giaTriMacDinh?: any;
    kieuDuLieuThietLap?: KieuDuLieuThietLapTuyChon;
    loai?: LoaiTuyChinhChiTiet;
    loaiChiTiet?: LoaiChiTietTuyChonNoiDung;
    loaiContainer?: number; // 1 tiêu đề, 2 nội dung, 3 ký hiệu cột, 4 song ngữ
    isParent?: any;
    checked?: boolean;
    disabled?: boolean;
    stt?: any;
    customKey?: number;
    children?: MauHoaDonTuyChonChiTiet[];
    ///////////////////////////////////
    tieuDe?: MauHoaDonTuyChonChiTiet;
    noiDung?: MauHoaDonTuyChonChiTiet;
    kyHieuCot?: MauHoaDonTuyChonChiTiet;
    tieuDeSongNgu?: MauHoaDonTuyChonChiTiet;
    dataFieldName?: string;
    placeholder?: string;
    disabledDrag?: boolean;
    selected?: boolean;
    expand?: boolean;
    width?: number;
    isTieuDeKy?: boolean;
}

export enum KieuDuLieuThietLapTuyChon {
    Chu = 1,
    TienTe = 2,
    SoLuong = 3,
    Ngay = 4,
    PhanTram = 5
}

export class TuyChinhChiTietModel {
    doRong?: number;
    coChu?: number;
    canTieuDe?: number;  // 1: căn theo tiêu đề, 2: căn theo tiêu đề dài nhất, 3: căn theo tiêu đề dài nhất bao gồm " : "
    chuDam?: boolean;
    chuNghieng?: boolean;
    maSoThue?: boolean;
    mauNenTieuDeBang?: any;
    mauChu?: any;
    canChu?: number; // 1: trái, 2: giữa, 3: phải,
    canChuDoc?: number; // 1: trên, 2: giữa, 3: dưới,
    isTuyChinhGiaTri?: boolean; // tự tùy chỉnh giá trị
    chieuCao?: number;
}