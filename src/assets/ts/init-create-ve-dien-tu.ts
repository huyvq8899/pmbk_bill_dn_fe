import { LoaiHoaDon } from "src/app/enums/LoaiHoaDon.enum";
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from "src/app/enums/LoaiThietLapMacDinh.enums";
import { KieuDuLieuThietLapTuyChon, MauHoaDonTuyChonChiTiet } from "src/app/models/danh-muc/MauHoaDonThietLapMacDinh";

export function InitCreateVeDienTu(hoSoDienTuData: any, objData = null) {
    return {
        tenDichVu: null,
        fontChu: 'Times New Roman',
        coChu: 0,
        chieuCaoGiuaCacDong: 0,
        hinhThucHienThiSoVe: 1, // 1: đầy đủ, 2 rút gọn
        giamThueTheoNQ: null,
        tyLePhanTramDoanhThu: null,
        tongTienChuaThue: null,
        tienThue: null,
        tongTien: null,
        thueGTGT: '10',
        viTriHienThiTongTien: 1, // 1: căn giữa, 2: căn 2 bên
        hienThiDonViTienTeSauSoTien: true,
        donViTienTe: 'đ',
        hienThiQRCodeTaiViTri: true,
        viTriQRCode: 1,  // 1: trên mã tra cứu, 2: ký hiệu, số vé
        isDaKy: false,
        status: true,
        hinhThucNhapLieu: 1,
        tuyenDuongId: null,
        tuyChonChiTiets: CreateTuyChonChiTiets(hoSoDienTuData, objData)
    };
}

export function CreateTuyChonChiTiets(hoSoDienTuData: any, objData: any): Array<MauHoaDonTuyChonChiTiet> {
    const defaultTextColor = '#000000';
    let stringPhatHanhBoi= 'Phát hành bởi Hóa đơn Bách Khoa - Công ty Cổ phần Phát triển và Ứng dụng phần mềm Bách Khoa  - MST: 0202029650';
    var data = [
        // MauSoKyHieuSoHoaDon
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'Ký hiệu',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                },
                {
                    giaTri: '(Serial)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoHoaDon,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Số',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                },
                {
                    giaTri: '(No.)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieuKH,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'PT',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                 },
                // {
                //     giaTri: '(No.)',
                //     tuyChonChiTiet: {
                //         coChu: 13,
                //         canTieuDe: null,
                //         chuDam: false,
                //         chuNghieng: true,
                //         maSoThue: null,
                //         canChu: null,
                //         chieuCao: 0
                //     },
                //     loaiContainer: 4,
                //     disabled: false
                // }
            ]
        },
        // ThongTinNguoiBan
        // {
        //     kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        //     loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
        //     loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaCuaCQT,
        //     isParent: true,
        //     checked: true,
        //     disabled: false,
        //     stt: 1,
        //     children: [
        //         {
        //             giaTri: 'Mã CQT cấp',
        //             tuyChonChiTiet: {
        //                 coChu: 14,
        //                 canTieuDe: 1,
        //                 chuDam: false,
        //                 chuNghieng: false,
        //                 maSoThue: null,
        //                 canChu: 1,
        //                 isTuyChinhGiaTri: false,
        //                 chieuCao: 0
        //             },
        //             loaiContainer: 1,
        //             disabled: false
        //         },
        //         {
        //             giaTri: '',
        //             tuyChonChiTiet: {
        //                 coChu: 14,
        //                 canTieuDe: 1,
        //                 chuDam: false,
        //                 chuNghieng: false,
        //                 maSoThue: null,
        //                 canChu: 1,
        //                 isTuyChinhGiaTri: false,
        //                 chieuCao: 0
        //             },
        //             loaiContainer: 2,
        //             disabled: true
        //         },
        //         {
        //             giaTri: '(Code)',
        //             tuyChonChiTiet: {
        //                 coChu: 13,
        //                 canTieuDe: 1,
        //                 chuDam: false,
        //                 chuNghieng: true,
        //                 maSoThue: null,
        //                 canChu: 1,
        //                 isTuyChinhGiaTri: false,
        //                 chieuCao: 0
        //             },
        //             loaiContainer: 4,
        //             disabled: false
        //         }
        //     ]
        // },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.tenDonVi.toUpperCase() : null,
                    tuyChonChiTiet: {
                        coChu: 20,
                        canTieuDe: 1,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 1,
                        isTuyChinhGiaTri: false,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.diaChi : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 1,
                        isTuyChinhGiaTri: false,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: 'Mã số thuế',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: false,
                        canChu: 1,
                        isTuyChinhGiaTri: false,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.maSoThue : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: false,
                        canChu: 1,
                        isTuyChinhGiaTri: false,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                },
                {
                    giaTri: '(Tax code)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: false,
                        canChu: 1,
                        isTuyChinhGiaTri: false,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                }
            ]
        },
        // ThongTinHoaDon
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 1,
            children: [
                {
                    giaTri: 'VÉ THAM QUAN TUYẾN CÁC VỊNH THUỘC QUẦN ĐẢO CÁT BÀ',
                    tuyChonChiTiet: {
                        coChu: 20,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '(BAYS OF CAT BA AECHIPELAGO)',
                    tuyChonChiTiet: {
                        coChu: 16,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MaQRCode,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.NoiDungQrCode,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 1,
            children: [
                {
                    giaTri: 'Quét mã QR để qua cổng soát vé',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0,
                        isTuyChinhGiaTri: false,
                    },
                    loaiContainer: 1,
                    disabled: false
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDichVu,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 2,
            children: [
                {
                    giaTri: 'DÀNH CHO NGƯỜI LỚN',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0,
                        isTuyChinhGiaTri: false,
                    },
                    loaiContainer: 1,
                    disabled: false
                },
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Ngày tháng năm',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: true
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: 'Giá vé',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '0 đồng/người/lượt',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: false
                },
                {
                    giaTri: '(Total amount)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToanBangChu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 5,
            children: [
                {
                    giaTri: 'Bằng chữ',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: 'Không đồng',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: false
                },
                {
                    giaTri: ('Amount in words'),
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                },
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DaBaoGom,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 6,
            children: [
                {
                    giaTri: '(Giá đã bao gồm bảo hiểm/ The Price includes insuarance)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 2,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
            ]
        },
        /// ThongTinNguoiKy
        // {
        //     giaTri: 'Chữ ký số người bán',
        //     kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        //     loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
        //     loaiChiTiet: LoaiChiTietTuyChonNoiDung.ChuKySoNguoiBan,
        //     isParent: true,
        //     checked: true,
        //     disabled: true,
        //     stt: 1,
        //     children: [],
        //     tuyChonChiTiet: {
        //         coChu: 14,
        //         canTieuDe: null,
        //         chuDam: true,
        //         chuNghieng: false,
        //         maSoThue: null,
        //         canChu: null,
        //         chieuCao: 0
        //     }
        // },
        // {
        //     giaTri: 'Chữ ký số cơ quan thuế',
        //     kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        //     loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
        //     loaiChiTiet: LoaiChiTietTuyChonNoiDung.ChuKySoCoQuanThue,
        //     isParent: true,
        //     checked: true,
        //     disabled: false,
        //     stt: 2,
        //     children: [],
        //     tuyChonChiTiet: {
        //         coChu: 14,
        //         canTieuDe: null,
        //         chuDam: true,
        //         chuNghieng: false,
        //         maSoThue: null,
        //         canChu: null,
        //         chieuCao: 0
        //     }
        // },
        {
            giaTri: 'QR Code',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.QRCode,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 5,
            children: [],
            tuyChonChiTiet: {
                coChu: 14,
                canTieuDe: null,
                chuDam: false,
                chuNghieng: false,
                maSoThue: null,
                canChu: null,
                chieuCao: 0
            }
        },
        {
            giaTri: 'Người bán hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 5,
            children: [
                {
                    giaTri: 'Người bán hàng',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Seller)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuChanTrang,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 1,
            children: [
                {
                    giaTri: `Vé được sử dụng cho một lượt tham quan và có giá trị trong ngày. Khách giữ vé trong suốt hành trình tham quan, xuất trình vé để kiểm tra, kiểm soát theo quy định.`
                    ,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: null,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
            ]
        },
         
        {
            giaTri: 'Tra cứu tại Website',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TraCuuTai,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Tra cứu tại Website',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TraCuuTai,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: true,
                },
                {
                    giaTri: '(Search in website)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TraCuuTai,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: true,
                }
            ]
        },
        {
            giaTri: 'https://hdbk.pmbk.vn/tra-cuu-hoa-don',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.LinkTraCuu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'https://hdbk.pmbk.vn/tra-cuu-hoa-don',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.LinkTraCuu,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                }
            ]
        },
        {
            giaTri: '- Mã tra cứu hóa đơn',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaTraCuu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: '- Mã tra cứu hóa đơn',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaTraCuu,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: true,
                },
                {
                    giaTri: '(Invoice code)',
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaTraCuu,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: true,
                }
            ]
        },
        {
            giaTri: stringPhatHanhBoi,
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.PhatHanhBoi,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 5,
            children: [
                {
                    giaTri: stringPhatHanhBoi,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.PhatHanhBoi,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: true,
                }
            ]
        },
        {
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.NguoiLap,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 6,
            children: [
                {
                    giaTri: 'Người lập',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 1,
                        chieuCao: 0
                    },
                    loaiContainer: 1,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        canChu: 1,
                        chieuCao: 0
                    },
                    loaiContainer: 2,
                    disabled: false
                },
                {
                    giaTri: ('Creaeted By'),
                    tuyChonChiTiet: {
                        coChu: 11,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        canChu: 1,
                        chieuCao: 0
                    },
                    loaiContainer: 4,
                    disabled: false
                },
            ]
        },
    ];

    if (objData != null) {
        // điều chỉnh các trường dữ liệu theo loại hóa đơn
        // switch (objData.loaiHoaDon) {
        //     case LoaiHoaDon.TemVeTheLaHoaDonGTGT:
        //         /////////////////////////////////////
        //         break;
        //     case LoaiHoaDon.TemVeTheLaHoaDonBanHang:
        //         data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHang &&
        //             x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
        //             x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT);

        //         var idxTongTienThanhToan = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongTienThanhToan);

        //         const daGiamTheoNQ = {
        //             kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
        //             loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
        //             loaiChiTiet: LoaiChiTietTuyChonNoiDung.DaGiamTheoNQ,
        //             isParent: true,
        //             checked: false,
        //             disabled: true,
        //             stt: 5,
        //             children: [
        //                 {
        //                     giaTri: '',
        //                     tuyChonChiTiet: {
        //                         coChu: 14,
        //                         canTieuDe: null,
        //                         chuDam: false,
        //                         chuNghieng: true,
        //                         maSoThue: null,
        //                         canChu: 2,
        //                         chieuCao: 0Vé
        //                     },
        //                     loaiContainer: 2,
        //                     disabled: true
        //                 }
        //             ]
        //         };

        //         data.splice(idxTongTienThanhToan + 1, 0, daGiamTheoNQ);

        //         var lisTongTienHHDV = data.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV);
        //         lisTongTienHHDV.forEach((item: any, index: any) => {
        //             item.stt = index + 1;
        //         });
        //         break;
        //     default:
        //         break;
        // }

        // không mã
        if (objData.hinhThucHoaDon === 0) {
            data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaCuaCQT);
        }
    }

    data.forEach((item: MauHoaDonTuyChonChiTiet) => {
        item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
            child.kieuDuLieuThietLap = item.kieuDuLieuThietLap;
            child.loai = item.loai;
            child.loaiChiTiet = item.loaiChiTiet;
            child.isParent = false;

            if (child.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CongTienHang ||
                child.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TienThueGTGT ||
                child.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongTienThanhToan) {
                if (child.loaiContainer === 3) {
                    child.giaTri = objData.donViTienTe;
                }

                if (child.loaiContainer === 2 && (objData.loaiMauHoaDon === 2 || objData.loaiMauHoaDon === 4 || objData.loaiMauHoaDon === 6)) {
                    child.giaTri = '0';
                }
            }

            if (child.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThueSuatGTGT && (objData.loaiMauHoaDon === 3 || objData.loaiMauHoaDon === 5)) {
                if (child.loaiContainer === 2) { 
                    child.giaTri = '';
                }
            }
        });
    });

    if (objData && objData.loaiNgonNgu === 1) {
        data.forEach((item: MauHoaDonTuyChonChiTiet) => {
            if(item.loaiChiTiet != LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon) {
            item.children = item.children.filter(x => x.loaiContainer !== 4);
            }
        });
    } else {
        data.forEach((item: MauHoaDonTuyChonChiTiet) => {
            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe) {
                item.children[0].giaTri = 'Ngày(Date) tháng(month) năm(year)';
            }
        });
    }

    return data;
}

export function GetRawTuyChinhChiTiet(loaiChiTiet: LoaiChiTietTuyChonNoiDung, data: any) {
    const list = CreateTuyChonChiTiets(null, data);
    const item = list.find(x => x.loaiChiTiet === loaiChiTiet);
    return item;
}