export enum TrangThaiQuyTrinh {
    // Tất cả
    TatCa = -1,
    // Chưa ký điện tử
    ChuaKyDienTu,
    // Đang ký điện tử
    DangKyDienTu,
    // Ký điện tử lỗi
    KyDienTuLoi,
    // Đã ký điện tử
    DaKyDienTu,
    // gửi tctn lỗi
    GuiTCTNLoi, // có mã cqt
    // Chờ phản hồi
    ChoPhanHoi,
    // Gửi lỗi
    GuiLoi,
    // Gửi không lỗi
    GuiKhongLoi,
    // không đủ điều kiện cấp mã
    KhongDuDieuKienCapMa, // có mã cqt
    // cqt đã cấp mã
    CQTDaCapMa, // có mã cqt
    // hóa đơn không hợp lệ
    HoaDonKhongHopKe, // không có mã cqt,
    HoaDonHopLe,
    ChuaGuiCQT,
    ChuaPhatHanh
}

export const TrangThaiQuyTrinhLabel = new Map<number, string>([
    [TrangThaiQuyTrinh.TatCa, 'Tất cả'],
    [TrangThaiQuyTrinh.ChuaKyDienTu, 'Chưa ký điện tử'],
    [TrangThaiQuyTrinh.DangKyDienTu, 'Đang ký điện tử'],
    [TrangThaiQuyTrinh.KyDienTuLoi, 'Ký điện tử lỗi'],
    [TrangThaiQuyTrinh.DaKyDienTu, 'Đã ký điện tử'],
    [TrangThaiQuyTrinh.GuiTCTNLoi, 'Gửi TCTN lỗi'],
    [TrangThaiQuyTrinh.ChoPhanHoi, 'Chờ phản hồi'],
    [TrangThaiQuyTrinh.GuiLoi, 'Gửi CQT có lỗi'],
    [TrangThaiQuyTrinh.GuiKhongLoi, 'Gửi CQT không lỗi'],
    [TrangThaiQuyTrinh.KhongDuDieuKienCapMa, 'Không đủ điều kiện cấp mã'],
    [TrangThaiQuyTrinh.CQTDaCapMa, 'CQT đã cấp mã'],
    [TrangThaiQuyTrinh.HoaDonKhongHopKe, 'Hóa đơn không hợp lệ'],
    [TrangThaiQuyTrinh.HoaDonHopLe, 'Hóa đơn hợp lệ'],
    [TrangThaiQuyTrinh.ChuaGuiCQT, 'Chưa gửi'],
    [TrangThaiQuyTrinh.ChuaPhatHanh, 'Chưa phát hành']
]);

export enum TrangThaiQuyTrinh_BangTongHop{
    ChuaGui = 0,
    GuiTCTNLoi = 1,
    ChoPhanHoi = 2,
    GuiLoi = 3,
    GuiKhongLoi = 4,
    BangTongHopKhongHopLe = 5, // không có mã cqt
    BangTongHopHopLe = 6, // không có mã cqt
    BangTongHopCoHoaDonKhongHopLe = 7
}