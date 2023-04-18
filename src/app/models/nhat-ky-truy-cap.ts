export class NhatKyTruyCap {
    loaiHanhDong: LoaiHanhDong;
    hanhDong?: string;
    thamChieu: string;
    doiTuongThaoTac?: string;
    moTaChiTiet?: string;
    refFile?: string;
    refId?: string;
    refType: RefType;
    diaChiIP?: string;
    duLieuCu?: any;
    duLieuMoi?: any;

    duLieuChiTietCu?: any[];
    duLieuChiTietMoi?: any[];
}

export enum LoaiHanhDong {
    DangNhap,
    DangXuat,
    Them,
    Sua,
    Xoa,
    NhapKhau,
    XuatKhau,
    In,
    KyDienTu,
    PhatHanhHoaDonThanhCong,
    PhatHanhHoaDonThatBai,
    ChuyenThanhHoaDonGiay,
    ChuyenThanhHoaDonThayThe,
    GuiHoaDonChoKhachHang,
    XoaBoHoaDon,
    PhanQuyen,
    KyToKhai,
    KyToKhaiLoi,
    KyGuiThongBaoToiCQT,
    NhanBan,
    CapNhatNgayHoaDon,
    GuiBienBanDieuChinhHoaDon,
    GuiThongBaoHoaDonCoThongTinSaiSot,
    GuiThongBaoXoaBoHoaDon,
    GuiBienBanHuyHoaDon,
    PhatHanhHoaDonDongLoat,
    CapNhatSoLonNhatDaSinh,
    GuiHoaDonDongLoat,
    GuiHoaDonNhapDongLoat,
    GuiPXKChoKhachHang,
    GuiBienBanDieuChinhPXK,
    GuiThongBaoPXKCoThongTinSaiSot,
    GuiThongBaoXoaBoPXK,
    GuiBienBanHuyPXK,
    ThemBoiBKPOS,
    XacNhanHoaDonDaGuiChoKhachHang,
    GuiCQTDongLoat,
    GuiCQT
}

export enum RefType {
    KhachHang,
    NhanVien,
    HangHoaDichVu,
    DonViTinh,
    LoaiTien,
    HinhThucThanhToan,
    HoSoHoaDonDienTu,
    MauHoaDon,
    QuyetDinhApDungHoaDon,
    ThongBaoPhatHanhHoaDon,
    ThongBaoKetQuaHuyHoaDon,
    ThongBaoDieuChinhThongTinHoaDon,

    HoaDonDienTu,
    HoaDonXoaBo,
    HoaDonThayThe,
    HoaDonDieuChinh,
    BienBanDieuChinh,
    BienBanXoaBo,

    PXKDienTu,
    PXKXoaBo,
    PXKThayThe,
    PXKDieuChinh,
    BienBanDieuChinhPXK,
    BienBanXoaBoPXK,

    NguoiDung,
    DangNhap,
    DangXuat,
    NhapKhauTuExcel,
    PhanQuyenChucNang,

    ToKhaiDangKyThayDoiThongTinSuDungHoaDon,
    ThongBaoHoaDonSaiSot,
    ThongDiepChung,
    BangTongHopDuLieu,
    ThongDiepGuiNhanCQT,

    TuyChon,
    MayChuGuiEmail,
    EmailGuiHoaDon,
    ThongTinHoaDon
}