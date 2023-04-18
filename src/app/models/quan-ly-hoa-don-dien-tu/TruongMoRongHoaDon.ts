import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from "src/app/enums/LoaiThietLapMacDinh.enums";
import { KieuDuLieuThietLapTuyChon } from "../danh-muc/MauHoaDonThietLapMacDinh";

export class TruongMoRongHoaDon {
    tenTruong?: any;
    tenTruongTiengAnh?: any;
    loai?: LoaiTuyChinhChiTiet;
    loaiChiTiet?: LoaiChiTietTuyChonNoiDung;
    kieuDuLieu?: KieuDuLieuThietLapTuyChon;
    doRong?: any;
    isHienThi?: any;
}