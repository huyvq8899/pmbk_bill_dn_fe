//Enum độ rộng các cột của bảng, tính theo đơn vị px
export enum DoRongCacCot {
    FirstItem = 50, //Cột có icon chức năng add/remove item
    MaHang = 120,
    TenHang = 250,
    DVT = 90,
    MaKhachHang = 150,
    MaSoThue = 150,
    TrangThaiHoaDon = 150,
    TrangThaiGhiNhan = 150,
    ThueGTGT = 100,
    SoLuong = 110,
    DonGia = 150,
    ThanhTien = 150,
    ThanhTienQuyDoi = 150,
    TyLeCK = 90, //CK = chiết khấu
    TienCK = 150,
    TienCKQuyDoi = 150,
    PTThueGTGT = 100, //PT = phần trăm, GTGT = giá trị gia tăng
    TienThueGTGT = 150,
    TienThueGTGTQuyDoi = 150,
    TinhTrangDonHang = 120,
    NgayThangNam = 150, //cột ngày
    DienGiai = 200,
    NhanVien = 150, //cột tên nhân viên hoặc mã nhân viên
    GTDaXuatHoaDon = 180, //giá trị đã xuất hóa đơn,
    TKKho = 100, //tài khoản kho
    LoaiChungTu = 270,
    DaLapHoaDon = 120,
    SoLo = 120,
    HanSuDung = 140,
    XuatBanPhi = 150,
    SoKhung = 120,
    SoMay = 120,
    GhiChu = 170,
    Kho = 130,
    HangKhuyenMai = 120,
}

//Enum cố định cột nào đó về bên trái
export enum CoDinhCotBenTrai {
    Zero = 0
}

//Enum tiêu đề các dòng tổng tiền ở footer của modal
export enum TieuDeTongTien_ModalFooter {
    TongTienHang = 'Tổng tiền hàng: ',
    TongTienThueGTGT = 'Tổng thuế GTGT: ',
    TongTienThueGTGT2 = 'Tiền thuế GTGT: ',
    TongChietKhau = 'Tổng chiết khấu: ',
    TongTienThanhToan = 'Tổng tiền thanh toán: ',

    TongTienThueGTGT_ToolTip = 'Tổng tiền thuế giá trị gia tăng',
    TongTienThueGTGT_ToolTip2 = 'Tiền thuế giá trị gia tăng'
}
