import { LoaiHoaDon } from "src/app/enums/LoaiHoaDon.enum";
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from "src/app/enums/LoaiThietLapMacDinh.enums";
import { KieuDuLieuThietLapTuyChon, MauHoaDonTuyChonChiTiet } from "src/app/models/danh-muc/MauHoaDonThietLapMacDinh";

export function InitCreateMauHD(hoSoDienTuData: any, objData = null) {
    return {
        fontChu: 'Times New Roman',
        coChu: 0,
        mauChu: '#000000',
        isHienThiQRCode: true,
        isLapLaiTTHDCoNhieuTrang: true,
        isThietLapDongKyHieuCot: false,
        soDongTrang: 5,
        codeHinhNenMacDinh: null,
        hinhNenMacDinh: null,
        mauHinhNenMacDinh: '#000000',
        codeKhungVienMacDinh: null,
        khungVienMacDinh: null,
        mauKhungVienMacDinh: '#000000',
        opacityHinhNenMacDinh: 0.35,
        opacityHinhNenTaiLen: 0.35,
        loaiHinhNenRieng: 1,
        viTriHinhNen: 2,
        topHinhNenTaiLen: 0,
        leftHinhNenTaiLen: 0,
        widthHinhNenTaiLen: 0,
        heightHinhNenTaiLen: 0,
        tenHinhNenTaiLen: null,
        isDaKy: false,
        status: true,
        tuyChonChiTiets: CreateTuyChonChiTiets(hoSoDienTuData, objData)
    };
}

export function CreateTuyChonChiTiets(hoSoDienTuData: any, objData: any, isOnlyGetSongNgu: boolean = null): Array<MauHoaDonTuyChonChiTiet> {
    console.log("🚀 ~ file: init-create-mau-hd.ts:36 ~ CreateTuyChonChiTiets ~ objData:", objData)
    const defaultTextColor = '#000000';
    const defaultBackgroundColor = '#ffffff';

    let stringPhatHanhBoi = 'Phát hành bởi Hóa đơn Bách Khoa - Công ty Cổ phần Phát triển và Ứng dụng phần mềm Bách Khoa  - MST: 0202029650';

    const listSoTKNH = [];

    if (hoSoDienTuData) {
        for (const [key, value] of Object.entries(hoSoDienTuData)) {
            if ((key === 'soTaiKhoanNganHang' || key === 'tenNganHang' || key === 'chiNhanh') && value) {
                listSoTKNH.push(value);
            } else {
                hoSoDienTuData[key] = value ? value : '';
            }
        }
    }

    var data = [
        {
            giaTri: hoSoDienTuData ? hoSoDienTuData.tenDonVi.toUpperCase() : null,
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.tenDonVi.toUpperCase() : null,
                    tuyChonChiTiet: {
                        coChu: 20,
                        canTieuDe: 1,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                }
            ]
        },
        {
            giaTri: 'Mã số thuế' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.maSoThue : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Mã số thuế',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: false,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
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
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Tax code)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: false,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                },
            ]
        },
        {
            giaTri: 'Địa chỉ' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.diaChi : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Địa chỉ',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.diaChi : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Address)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                },
            ]
        },
        {
            giaTri: 'Điện thoại' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.soDienThoaiLienHe : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 4,
            children: [
                {
                    giaTri: 'Điện thoại',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.soDienThoaiLienHe : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Tel)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                },
            ]
        },
        {
            giaTri: 'Fax' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.fax : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.FaxNguoiBan,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 5,
            children: [
                {
                    giaTri: 'Fax',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.FaxNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.fax : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.FaxNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                }
            ]
        },
        {
            giaTri: 'Website' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.website : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.WebsiteNguoiBan,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 6,
            children: [
                {
                    giaTri: 'Website',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.WebsiteNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.website : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.WebsiteNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                }
            ]
        },
        {
            giaTri: 'Email' + GetGiaTriParent(hoSoDienTuData ? hoSoDienTuData.emailLienHe : null),
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.EmailNguoiBan,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 7,
            children: [
                {
                    giaTri: 'Email',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.EmailNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: hoSoDienTuData ? hoSoDienTuData.emailLienHe : null,
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.EmailNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                }
            ]
        },
        {
            giaTri: 'Số tài khoản',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 8,
            children: [
                {
                    giaTri: 'Số tài khoản',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: listSoTKNH.join(' - '),
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Bank account)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
                    tuyChonChiTiet: {
                        coChu: 20,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(VAT INVOICE)',
                    tuyChonChiTiet: {
                        coChu: 18,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: '',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenKhacLoaiHoaDon,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 2,
            children: [
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenKhacLoaiHoaDon,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: false,
                    placeholder: 'Tên khác (VD: Phiếu bảo hành,...)'
                }
            ]
        },
        {
            giaTri: '(Bản thể hiện của hóa đơn điện tử)',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenMauHoaDon,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 3,
            children: [
                {
                    giaTri: '(Bản thể hiện của hóa đơn điện tử)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenMauHoaDon,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(E-Invoice viewer)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenMauHoaDon,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: true
                }
            ]
        },
        {
            giaTri: 'Ngày tháng năm',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: 'Ngày tháng năm',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                }
            ]
        },
        {
            giaTri: 'Ký hiệu',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Ký hiệu',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieu,
                    loaiContainer: 1,
                    isParent: false,
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
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieu,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Serial)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyHieu,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoHoaDon,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Số',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoHoaDon,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoHoaDon,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(No.)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoHoaDon,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Mã của cơ quan thuế',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaCuaCQT,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'Mã của cơ quan thuế',
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
                    loai: LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaCuaCQT,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '',
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
                    loai: LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaCuaCQT,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '(Code)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinMaCuaCoQuanThue,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaCuaCQT,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Họ tên người mua hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiMua,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'Họ tên người mua hàng',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Họ tên người mua hàng]'
                },
                {
                    giaTri: '(Buyer)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tên đơn vị',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Tên đơn vị',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tên đơn vị]'
                },
                {
                    giaTri: `(Company's name)`,
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Mã số thuế',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Mã số thuế',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Mã số thuế]'
                },
                {
                    giaTri: '(Tax code)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Địa chỉ',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: 'Địa chỉ',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Địa chỉ]'
                },
                {
                    giaTri: '(Address)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tên phương tiện',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenPhuongTien,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 5,
            children: [
                {
                    giaTri: 'Tên phương tiện',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null,
                        isTuyChinhGiaTri: false
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenPhuongTien,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenPhuongTien,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tên phương tiện]'
                },
                {
                    giaTri: '(Vehicle)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenPhuongTien,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số điện thoại',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 6,
            children: [
                {
                    giaTri: 'Số điện thoại',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Số điện thoại]'
                },
                {
                    giaTri: '(Phone number)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Hình thức thanh toán',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.HinhThucThanhToan,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 7,
            children: [
                {
                    giaTri: 'Hình thức thanh toán',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HinhThucThanhToan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HinhThucThanhToan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Hình thức thanh toán]'
                },
                {
                    giaTri: '(Payment method)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.HinhThucThanhToan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số tài khoản',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 8,
            children: [
                {
                    giaTri: 'Số tài khoản',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Số tài khoản]'
                },
                {
                    giaTri: '(Bank account)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Căn cước công dân',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 9,
            children: [
                {
                    giaTri: 'Căn cước công dân',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Căn cước công dân]'
                },
                {
                    giaTri: '(Identification)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Đồng tiền thanh toán',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DongTienThanhToan,
            isParent: true,
            checked: false,
            disabled: true,
            stt: 10,
            children: [
                {
                    giaTri: 'Đồng tiền thanh toán',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DongTienThanhToan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DongTienThanhToan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Đồng tiền thanh toán]'
                },
                {
                    giaTri: '(Payment Currency)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DongTienThanhToan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Trường thông tin bổ sung 1',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 11,
            children: [
                {
                    giaTri: 'Trường thông tin bổ sung 1',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: 1,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'STT',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.STT,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'STT',
                    tuyChonChiTiet: {
                        doRong: 6,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.STT,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 6,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.STT,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[STT]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 6,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.STT,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(No)',
                    tuyChonChiTiet: {
                        doRong: 6,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.STT,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Mã hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaHang,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 2,
            children: [
                {
                    giaTri: 'Mã hàng',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaHang,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaHang,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Mã hàng]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaHang,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Item code)',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaHang,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tên hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Tên hàng',
                    tuyChonChiTiet: {
                        doRong: 38,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 38,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tên hàng]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 38,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Name of goods and services)',
                    tuyChonChiTiet: {
                        doRong: 38,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Quy cách',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyCach,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 4,
            children: [
                {
                    giaTri: 'Quy cách',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyCach,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyCach,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Quy cách]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyCach,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Specification)',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyCach,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Đơn vị tính',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonViTinh,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 5,
            children: [
                {
                    giaTri: 'Đơn vị tính',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonViTinh,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonViTinh,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Đơn vị tính]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonViTinh,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Unit)',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonViTinh,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số lượng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.SoLuong,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoLuong,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 6,
            children: [
                {
                    giaTri: 'Số lượng',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.SoLuong,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoLuong,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 3
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.SoLuong,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoLuong,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Số lượng]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.SoLuong,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoLuong,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Quantity)',
                    tuyChonChiTiet: {
                        doRong: 12,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.SoLuong,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoLuong,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Đơn giá',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonGia,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 7,
            children: [
                {
                    giaTri: 'Đơn giá',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonGia,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 3
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonGia,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Đơn giá]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonGia,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Unit price)',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.DonGia,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Thành tiền',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTien,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 8,
            children: [
                {
                    giaTri: 'Thành tiền',
                    tuyChonChiTiet: {
                        doRong: 17,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTien,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 17,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 3
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTien,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Thành tiền]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 17,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTien,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Amount)',
                    tuyChonChiTiet: {
                        doRong: 17,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTien,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Ghi chú',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuHHDV,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 9,
            children: [
                {
                    giaTri: 'Ghi chú',
                    tuyChonChiTiet: {
                        doRong: 10,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuHHDV,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 1
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuHHDV,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Ghi chú]'
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuHHDV,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '(Note)',
                    tuyChonChiTiet: {
                        doRong: 15,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuHHDV,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Trường thông tin mở rộng 1',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 10,
            children: [
                {
                    giaTri: 'Trường thông tin mở rộng 1',
                    tuyChonChiTiet: {
                        doRong: 16,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 16,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 3
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 16,
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1,
                    loaiContainer: 3,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        doRong: 16,
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: true,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: defaultBackgroundColor,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Cộng tiền hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHang,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'Cộng tiền hàng',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHang,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHang,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Cộng tiền hàng]'
                },
                {
                    giaTri: '(Total amount excl. VAT)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHang,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tỷ lệ CK',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyLeChietKhau,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 2,
            children: [
                {
                    giaTri: 'Tỷ lệ CK',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyLeChietKhau,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyLeChietKhau,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tỷ lệ CK]'
                },
                {
                    giaTri: '(Discount rate)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyLeChietKhau,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số tiền chiết khấu',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienChietKhau,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Số tiền chiết khấu',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienChietKhau,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienChietKhau,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Số tiền chiết khấu]'
                },
                {
                    giaTri: '(Discount amount)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienChietKhau,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Cộng tiền hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 4,
            children: [
                {
                    giaTri: 'Cộng tiền hàng',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Cộng tiền hàng]'
                },
                {
                    giaTri: '(Total amount excl. VAT)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Thuế suất GTGT',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThueSuatGTGT,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 5,
            children: [
                {
                    giaTri: 'Thuế suất GTGT',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThueSuatGTGT,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThueSuatGTGT,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Thuế suất GTGT]'
                },
                {
                    giaTri: '(VAT rate)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.PhanTram,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThueSuatGTGT,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tiền thuế GTGT',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueGTGT,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 6,
            children: [
                {
                    giaTri: 'Tiền thuế GTGT',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueGTGT,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueGTGT,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tiền thuế GTGT]'
                },
                {
                    giaTri: '(VAT amount)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueGTGT,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Tổng tiền thanh toán',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 7,
            children: [
                {
                    giaTri: 'Tổng tiền thanh toán',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tổng tiền thanh toán]'
                },
                {
                    giaTri: '(Total amount)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Số tiền viết bằng chữ',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienBangChu,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 8,
            children: [
                {
                    giaTri: 'Số tiền viết bằng chữ',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienBangChu,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false
                },
                {
                    giaTri: '',
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
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienBangChu,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Số tiền viết bằng chữ]'
                },
                {
                    giaTri: '(Total amount in words)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.SoTienBangChu,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Ghi chú',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuTongTien,
            isParent: true,
            checked: false,
            disabled: false,
            stt: 9,
            children: [
                {
                    giaTri: '',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.GhiChuTongTien,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: false,
                    placeholder: 'Ghi chú'
                }
            ]
        },
        {
            giaTri: 'Tỷ giá',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyGia,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 1,
            children: [
                {
                    giaTri: 'Tỷ giá',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyGia,
                    loaiContainer: 1,
                    isParent: false,
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
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyGia,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Tỷ giá]'
                },
                {
                    giaTri: '(Exchange Rate)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyGia,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Quy đổi',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
            loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyDoi,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 2,
            children: [
                {
                    giaTri: 'Quy đổi',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyDoi,
                    loaiContainer: 1,
                    isParent: false,
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
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyDoi,
                    loaiContainer: 2,
                    isParent: false,
                    disabled: true,
                    placeholder: '[Quy đổi]'
                },
                {
                    giaTri: '(Equivalence)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                    loai: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.QuyDoi,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false
                }
            ]
        },
        {
            giaTri: 'Người chuyển đổi',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 1,
            children: [
                {
                    giaTri: 'Người chuyển đổi',
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
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Converter)',
                    tuyChonChiTiet: {
                        coChu: 13,
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
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
            ]
        },
        {
            giaTri: '(Ký, ghi rõ họ, tên)',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 2,
            children: [
                {
                    giaTri: '(Ký, ghi rõ họ, tên)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Signature, full name)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
            ]
        },
        {
            giaTri: 'Người mua hàng',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua,
            isParent: true,
            checked: true,
            disabled: true,
            stt: 3,
            children: [
                {
                    giaTri: 'Người mua hàng',
                    tuyChonChiTiet: {
                        doRong: null,
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
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Buyer)',
                    tuyChonChiTiet: {
                        doRong: null,
                        coChu: 13,
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
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
            ]
        },
        {
            giaTri: '(Ký, ghi rõ họ, tên)',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiMua,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 4,
            children: [
                {
                    giaTri: '(Ký, ghi rõ họ, tên)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiMua,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Signature, full name)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiMua,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
            ]
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
                        coChu: 13,
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
            giaTri: '(Ký, ghi rõ họ, tên)',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiBan,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 6,
            children: [
                {
                    giaTri: '(Ký, ghi rõ họ, tên)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiBan,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(Signature, full name)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: null
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiBan,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
                }
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
            stt: 1,
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
                        coChu: 13,
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
            stt: 2,
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
            stt: 3,
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
                        coChu: 13,
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
            giaTri: '(Cần kiểm tra, đối chiếu khi lập, giao, nhận hóa đơn)',
            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
            loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
            loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanKiemTraDoiChieu,
            isParent: true,
            checked: true,
            disabled: false,
            stt: 4,
            children: [
                {
                    giaTri: '(Cần kiểm tra, đối chiếu khi lập, giao, nhận hóa đơn)',
                    tuyChonChiTiet: {
                        coChu: 14,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: false,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanKiemTraDoiChieu,
                    loaiContainer: 1,
                    isParent: false,
                    disabled: false,
                },
                {
                    giaTri: '(You need to check invoice when issuing, delivering and receiving)',
                    tuyChonChiTiet: {
                        coChu: 13,
                        canTieuDe: null,
                        chuDam: false,
                        chuNghieng: true,
                        maSoThue: null,
                        mauNenTieuDeBang: null,
                        mauChu: defaultTextColor,
                        canChu: 2
                    },
                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                    loai: LoaiTuyChinhChiTiet.ThongTinTraCuu,
                    loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanKiemTraDoiChieu,
                    loaiContainer: 4,
                    isParent: false,
                    disabled: false,
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
                        chuDam: false,
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
    ];

    if (objData != null) {
        // điều chỉnh các trường dữ liệu theo loại hóa đơn

        /// Filter lọc cột trc khi chỉnh sửa các thông tin khác
        switch (objData.loaiHoaDon) {
            case LoaiHoaDon.HoaDonGTGT:
                data = data.filter(x => x.loaiChiTiet != LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua && x.loaiChiTiet != LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua 
                    && x.loaiChiTiet != LoaiChiTietTuyChonNoiDung.TenPhuongTien);
                break;
            case LoaiHoaDon.HoaDonGTGTCMTMTT:
                break;



            default:
                break;
        }
        switch (objData.loaiHoaDon) {
            case LoaiHoaDon.HoaDonGTGT:
            case LoaiHoaDon.HoaDonGTGTCMTMTT:
            case LoaiHoaDon.HoaDonKhacCMTMTT:
                if (objData.hinhThucHoaDon === 2) {
                    var indexHinhThucThanhToan = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua);
                    data[indexHinhThucThanhToan].loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua;
                    data[indexHinhThucThanhToan].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                        child.loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua;
                        if (child.loaiContainer === 1) {
                            child.giaTri = 'Tên khách hàng';
                        }
                        if (child.loaiContainer === 4) {
                            child.giaTri = '(Customer name)';
                        }
                    });
                    const idxOfTenLoaiHoaDonBH = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon);
                    data[idxOfTenLoaiHoaDonBH].giaTri = 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG';
                    data[idxOfTenLoaiHoaDonBH].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                        if (child.loaiContainer === 1) {
                            child.giaTri = data[idxOfTenLoaiHoaDonBH].giaTri;
                        } else if (child.loaiContainer === 4) {
                            child.giaTri = 'SALES INVOICE';
                        }
                    });
                }
                if (objData.loaiThueGTGT === 2) { // nhiều thuế suất
                    if (objData.code === '01.CB.01') {
                        data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHang &&
                            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
                            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT &&
                            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK &&
                            x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TongTienThanhToan);

                        const tieuDeTongHops: Array<{ tieuDe: string, tieuDeSongNgu: string, loaiChiTiet: LoaiChiTietTuyChonNoiDung }> = [
                            { tieuDe: 'Tổng hợp', tieuDeSongNgu: '(In sumary)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongHopThueGTGT },
                            { tieuDe: 'Thành tiền trước thuế GTGT', tieuDeSongNgu: '(Total before VAT)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.CongTienHang },
                            { tieuDe: 'Tiền thuế GTGT', tieuDeSongNgu: '(VAT amount)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueGTGT },
                            { tieuDe: 'Cộng tiền thanh toán', tieuDeSongNgu: '(Total amount)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienThanhToan },
                            { tieuDe: 'Tổng tiền không kê khai thuế', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienKhongKeKhaiThue },
                            { tieuDe: 'Tổng tiền không chịu thuế GTGT', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienKhongChiuThueGTGT },
                            { tieuDe: 'Tổng tiền chịu thuế suất 0%', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienChiuThueSuat0 },
                            { tieuDe: 'Tổng tiền chịu thuế suất 5%', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienChiuThueSuat5 },
                            { tieuDe: 'Tổng tiền chịu thuế suất 10%', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienChiuThueSuat10 },
                            { tieuDe: 'Tổng tiền chịu thuế suất KHAC', tieuDeSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongTienChiuThueSuatKhac },
                            { tieuDe: 'Tổng cộng', tieuDeSongNgu: '(Total)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TongCongTongHopThueGTGT },
                        ];

                        // tiêu đề tổng hợp
                        for (let i = 0; i < 11; i++) {
                            let item = null;
                            if (i >= 0 && i <= 3) {
                                item = {
                                    giaTri: tieuDeTongHops[i].tieuDe,
                                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                    loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                    isParent: true,
                                    checked: true,
                                    disabled: true,
                                    stt: 3 + i,
                                    children: [
                                        {
                                            giaTri: tieuDeTongHops[i].tieuDe,
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
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 1,
                                            isParent: false,
                                            disabled: false
                                        },
                                        {
                                            giaTri: tieuDeTongHops[i].tieuDeSongNgu,
                                            tuyChonChiTiet: {
                                                coChu: 13,
                                                canTieuDe: null,
                                                chuDam: false,
                                                chuNghieng: true,
                                                maSoThue: null,
                                                mauNenTieuDeBang: null,
                                                mauChu: defaultTextColor,
                                                canChu: 2
                                            },
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 4,
                                            isParent: false,
                                            disabled: false
                                        }
                                    ]
                                };
                            } else if (i >= 4 && i <= 9) {
                                item = {
                                    giaTri: tieuDeTongHops[i].tieuDe,
                                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                    loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                    isParent: true,
                                    checked: true,
                                    disabled: false,
                                    stt: 3 + i,
                                    children: [
                                        {
                                            giaTri: tieuDeTongHops[i].tieuDe,
                                            tuyChonChiTiet: {
                                                coChu: 14,
                                                canTieuDe: null,
                                                chuDam: false,
                                                chuNghieng: false,
                                                maSoThue: null,
                                                mauNenTieuDeBang: null,
                                                mauChu: defaultTextColor,
                                                canChu: null
                                            },
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 1,
                                            isParent: false,
                                            disabled: false
                                        },
                                        {
                                            giaTri: '',
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
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 2,
                                            isParent: false,
                                            disabled: true
                                        }
                                    ]
                                };
                            } else {
                                item = {
                                    giaTri: tieuDeTongHops[i].tieuDe,
                                    kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                    loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                    loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                    isParent: true,
                                    checked: true,
                                    disabled: false,
                                    stt: 3 + i,
                                    children: [
                                        {
                                            giaTri: tieuDeTongHops[i].tieuDe,
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
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 1,
                                            isParent: false,
                                            disabled: false
                                        },
                                        {
                                            giaTri: '',
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
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.TienTe,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 2,
                                            isParent: false,
                                            disabled: true
                                        },
                                        {
                                            giaTri: tieuDeTongHops[i].tieuDeSongNgu,
                                            tuyChonChiTiet: {
                                                coChu: 13,
                                                canTieuDe: null,
                                                chuDam: true,
                                                chuNghieng: true,
                                                maSoThue: null,
                                                mauNenTieuDeBang: null,
                                                mauChu: defaultTextColor,
                                                canChu: null
                                            },
                                            kieuDuLieuThietLap: KieuDuLieuThietLapTuyChon.Chu,
                                            loai: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
                                            loaiChiTiet: tieuDeTongHops[i].loaiChiTiet,
                                            loaiContainer: 4,
                                            isParent: false,
                                            disabled: false
                                        }
                                    ]
                                };
                            }

                            if (item) {
                                data.push(item);
                            }
                        }

                        const chietKhau_SoTienBangChus = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyLeChietKhau ||
                            x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTienChietKhau ||
                            x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTienBangChu ||
                            x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuTongTien);

                        chietKhau_SoTienBangChus.forEach((item: MauHoaDonTuyChonChiTiet) => {
                            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyLeChietKhau) {
                                item.stt = 1;
                                item.disabled = false;
                            } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTienChietKhau) {
                                item.stt = 2;
                                item.disabled = false;
                            } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTienBangChu) {
                                var tongCongTopHopThueGTGT = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongCongTongHopThueGTGT);
                                if (tongCongTopHopThueGTGT) {
                                    item.stt = tongCongTopHopThueGTGT.stt + 1;
                                }
                            } else {
                                var tongCongTopHopThueGTGT = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongCongTongHopThueGTGT);
                                if (tongCongTopHopThueGTGT) {
                                    item.stt = tongCongTopHopThueGTGT.stt + 2;
                                }
                            }
                        });
                        // tiêu đề tổng hợp
                    } else {
                        data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT);

                        var listTongTien = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.CongTienHang ||
                            x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TienThueGTGT ||
                            x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TongTienThanhToan);

                        listTongTien.forEach((item: MauHoaDonTuyChonChiTiet) => {
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                if (child.loaiContainer === 1) {
                                    switch (child.loaiChiTiet) {
                                        case LoaiChiTietTuyChonNoiDung.CongTienHang:
                                            child.giaTri = 'Tổng tiền chưa có thuế GTGT';
                                            break;
                                        case LoaiChiTietTuyChonNoiDung.TienThueGTGT:
                                            child.giaTri = 'Tổng số tiền thuế giá trị gia tăng theo từng loại thuế suất';
                                            break;
                                        case LoaiChiTietTuyChonNoiDung.TongTienThanhToan:
                                            child.giaTri = 'Tổng tiền thanh toán đã có thuế GTGT';
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        });
                    }

                    // hàng hóa dịch vụ
                    const hhdvs = data.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu && x.checked === true);
                    let indexOfThanhTien = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTien);
                    let cloneThanhTien = null;

                    for (let i = 0; i < hhdvs.length; i++) {
                        const item = hhdvs[i];

                        switch (item.loaiChiTiet) {
                            case LoaiChiTietTuyChonNoiDung.STT:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.tuyChonChiTiet.doRong = 4;
                                });
                                break;
                            case LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.tuyChonChiTiet.doRong = 14;
                                });
                                break;
                            case LoaiChiTietTuyChonNoiDung.DonViTinh:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.tuyChonChiTiet.doRong = 5;
                                });
                                break;
                            case LoaiChiTietTuyChonNoiDung.SoLuong:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.tuyChonChiTiet.doRong = 5;
                                });
                                break;
                            case LoaiChiTietTuyChonNoiDung.DonGia:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.tuyChonChiTiet.doRong = 10;
                                });
                                break;
                            case LoaiChiTietTuyChonNoiDung.ThanhTien:
                                item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    if (objData.code === '01.CB.04' && child.loaiContainer === 1) {
                                        child.giaTri = 'Thành tiền chưa có thuế GTGT';
                                    }

                                    child.tuyChonChiTiet.doRong = 11;
                                });
                                cloneThanhTien = JSON.parse(JSON.stringify(item));
                                break;
                            default:
                                break;
                        }
                    }

                    if (indexOfThanhTien !== -1 && cloneThanhTien) {
                        const tieuDeHHDVs: Array<{ tieuDe: string, tieuDeSongNgu: string, loaiChiTiet: LoaiChiTietTuyChonNoiDung, doRong: number }> = [
                            { tieuDe: 'Tỷ lệ chiết khấu', tieuDeSongNgu: '(Discount rate)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyLeChietKhauHHDV, doRong: 5 },
                            { tieuDe: 'Tiền chiết khấu', tieuDeSongNgu: '(Discount amount)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienChietKhauHHDV, doRong: 8 },
                            { tieuDe: 'Thành tiền đã trừ chiết khấu', tieuDeSongNgu: '(Total amount)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTienDaTruCKHHDV, doRong: 11 },
                            { tieuDe: 'Thuế suất GTGT', tieuDeSongNgu: '(VAT rate)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThueSuatHHDV, doRong: 7 },
                            { tieuDe: 'Tiền thuế GTGT', tieuDeSongNgu: '(VAT amount)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TienThueHHDV, doRong: 8 },
                            { tieuDe: 'Thành tiền sau thuế GTGT', tieuDeSongNgu: '(Total amount with VAT)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.ThanhTienSauThueHHDV, doRong: 12 },
                            { tieuDe: 'Tỷ giá', tieuDeSongNgu: '(Exchange Rate)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TyGiaHHDV, doRong: 9 },
                        ];

                        for (let i = 0; i < tieuDeHHDVs.length; i++) {
                            const item = tieuDeHHDVs[i];
                            const clone = JSON.parse(JSON.stringify(cloneThanhTien)) as any;
                            clone.loaiChiTiet = item.loaiChiTiet;
                            clone.stt = clone.stt + i + 1;
                            clone.giaTri = item.tieuDe;

                            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyLeChietKhauHHDV ||
                                item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TienChietKhauHHDV ||
                                item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTienDaTruCKHHDV ||
                                item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTienSauThueHHDV ||
                                item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyGiaHHDV) {
                                clone.disabled = false;
                                clone.checked = false;

                                if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTienSauThueHHDV ||
                                    item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TyGiaHHDV) {
                                    clone.checked = objData.code === '01.CB.04';
                                }

                                if (objData.code === '01.CB.04' && item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTienSauThueHHDV) {
                                    item.tieuDe = 'Thành tiền có thuế GTGT';
                                }
                            }

                            clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.loaiChiTiet = clone.loaiChiTiet;
                                child.tuyChonChiTiet.doRong = item.doRong;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.tieuDe;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = item.tieuDeSongNgu;
                                }
                            });

                            data.splice(indexOfThanhTien + i + 1, 0, clone);

                            if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.ThanhTienSauThueHHDV) {
                                const ghiChuHHDV = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuHHDV);
                                ghiChuHHDV.stt = clone.stt + 1;
                                const truongMoRongChiTiet1 = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1);
                                truongMoRongChiTiet1.stt = clone.stt + 2;
                            }
                        }
                    }
                }
                break;
            case LoaiHoaDon.HoaDonBanHang:
                data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CanKiemTraDoiChieu &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CanCuocCongDanNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoDienThoaiNguoiMua)

                const idxOfTenLoaiHoaDon = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon);
                data[idxOfTenLoaiHoaDon].giaTri = 'HÓA ĐƠN BÁN HÀNG';
                data[idxOfTenLoaiHoaDon].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenLoaiHoaDon].giaTri;
                    } else if (child.loaiContainer === 4) {
                        child.giaTri = 'SALES INVOICE';
                    }
                });

                const cloneKVPTQ = JSON.parse(JSON.stringify(data[idxOfTenLoaiHoaDon]));
                cloneKVPTQ.giaTri = '(Dùng cho tổ chức cá nhân trong khu phi thuế quan)';
                cloneKVPTQ.loaiChiTiet = LoaiChiTietTuyChonNoiDung.KhuVucPhiThueQuan;
                cloneKVPTQ.checked = false;
                cloneKVPTQ.disabled = false;
                cloneKVPTQ.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = cloneKVPTQ.giaTri;
                        child.tuyChonChiTiet.coChu = 14;
                    }
                    else if (child.loaiContainer === 4) {
                        child.giaTri = '(For organizations and individuals in the non-tariff area)';
                        child.tuyChonChiTiet.coChu = 13;
                    }

                    child.tuyChonChiTiet.chuDam = false;
                    child.loaiChiTiet = cloneKVPTQ.loaiChiTiet;
                });

                data.splice(idxOfTenLoaiHoaDon + 1, 0, cloneKVPTQ)

                const traCuuAreas = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai ||
                    x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu ||
                    x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu);

                traCuuAreas.forEach((item: MauHoaDonTuyChonChiTiet) => {
                    if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu) {
                        item.giaTri = item.giaTri.replace('-', '').trim();
                        item.stt = 1;
                    } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai) {
                        item.stt = 2;
                    } else {
                        item.stt = 3;
                    }

                    item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                        if (child.loaiContainer === 1) {
                            child.giaTri = item.giaTri;
                        }
                        child.tuyChonChiTiet.canChu = 2;
                    });
                });
                break;
            case LoaiHoaDon.HoaDonBanHangCMTMTT:
                var indexHinhThucThanhToan = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua);
                data[indexHinhThucThanhToan].loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua;
                data[indexHinhThucThanhToan].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    child.loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua;
                    if (child.loaiContainer === 1) {
                        child.giaTri = 'Tên khách hàng';
                    }
                    if (child.loaiContainer === 4) {
                        child.giaTri = '(Customer name)';
                    }
                });
                data = data.filter(x => x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK)

                const idxOfTenLoaiHoaDonBH = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon);
                data[idxOfTenLoaiHoaDonBH].giaTri = 'HÓA ĐƠN BÁN HÀNG';
                data[idxOfTenLoaiHoaDonBH].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenLoaiHoaDonBH].giaTri;
                    } else if (child.loaiContainer === 4) {
                        child.giaTri = 'SALES INVOICE';
                    }
                });

                const cloneKVPTQBH = JSON.parse(JSON.stringify(data[idxOfTenLoaiHoaDonBH]));
                cloneKVPTQBH.giaTri = '(Dùng cho tổ chức cá nhân trong khu phi thuế quan)';
                cloneKVPTQBH.loaiChiTiet = LoaiChiTietTuyChonNoiDung.KhuVucPhiThueQuan;
                cloneKVPTQBH.checked = false;
                cloneKVPTQBH.disabled = false;
                cloneKVPTQBH.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = cloneKVPTQBH.giaTri;
                        child.tuyChonChiTiet.coChu = 14;
                    }
                    else if (child.loaiContainer === 4) {
                        child.giaTri = '(For organizations and individuals in the non-tariff area)';
                        child.tuyChonChiTiet.coChu = 13;
                    }

                    child.tuyChonChiTiet.chuDam = false;
                    child.loaiChiTiet = cloneKVPTQBH.loaiChiTiet;
                });

                data.splice(idxOfTenLoaiHoaDonBH + 1, 0, cloneKVPTQBH)

                const traCuuAreasBH = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai ||
                    x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.LinkTraCuu ||
                    x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu);

                traCuuAreasBH.forEach((item: MauHoaDonTuyChonChiTiet) => {
                    if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaTraCuu) {
                        item.giaTri = item.giaTri.replace('-', '').trim();
                        item.stt = 1;
                    } else if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TraCuuTai) {
                        item.stt = 2;
                    } else {
                        item.stt = 3;
                    }

                    item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                        if (child.loaiContainer === 1) {
                            child.giaTri = item.giaTri;
                        }
                        child.tuyChonChiTiet.canChu = 2;
                    });
                });
                break;
            case LoaiHoaDon.CacLoaiHoaDonKhac:
                break;
            case LoaiHoaDon.PXKKiemVanChuyenNoiBo:
                data = data.filter(x =>
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HinhThucThanhToan &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua &&

                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHang &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoTienBangChu &&

                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiBan &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenPhuongTien);

                var idxCloneThongTinMuaHang = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiMua);
                var cloneThongTinMuaHang = data[idxCloneThongTinMuaHang];
                var cloneNgayThangNam = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe);

                var idxCloneTieuDeChuyenDoi = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi);
                var cloneTieuDeChuyenDoi = data[idxCloneTieuDeChuyenDoi];

                var idxCloneHoTenChuyenDoi = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi);
                var cloneHoTenChuyenDoi = data[idxCloneHoTenChuyenDoi];

                var idxCloneDiaChiNguoiBan = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan);
                var cloneDiaChiNguoiBan = data[idxCloneDiaChiNguoiBan];

                // create table hhdv
                var hhdvPXKNoiBos = data.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu);
                var idxOfSoLuong = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoLuong);
                var cloneSoLuong = data[idxOfSoLuong];
                // clone so luong nhap xuat
                var soLuongNhapXuat = JSON.parse(JSON.stringify(cloneSoLuong));
                soLuongNhapXuat.children = soLuongNhapXuat.children.filter(x => x.loaiContainer !== 2);
                soLuongNhapXuat.loaiChiTiet = LoaiChiTietTuyChonNoiDung.SoLuongNhapXuat;
                soLuongNhapXuat.stt = 6;
                soLuongNhapXuat.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    child.loaiChiTiet = soLuongNhapXuat.loaiChiTiet;
                    child.tuyChonChiTiet.doRong = 14;
                });
                // clone so luong nhap
                var soLuongNhap = JSON.parse(JSON.stringify(cloneSoLuong));
                soLuongNhap.giaTri = 'Thực nhập';
                soLuongNhap.loaiChiTiet = LoaiChiTietTuyChonNoiDung.SoLuongNhap;
                soLuongNhap.stt = 8;
                soLuongNhap.disabled = true;
                soLuongNhap.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    child.tuyChonChiTiet.doRong = 7;
                    child.loaiChiTiet = soLuongNhap.loaiChiTiet;
                    if (child.loaiContainer === 1) {
                        child.giaTri = soLuongNhap.giaTri;
                    } else if (child.loaiContainer === 4) {
                        child.giaTri = '(Import)';
                    }
                });

                data.splice(idxOfSoLuong, 0, soLuongNhapXuat);
                data.splice(idxOfSoLuong + 2, 0, soLuongNhap);

                hhdvPXKNoiBos.forEach((item: MauHoaDonTuyChonChiTiet, index: any) => {
                    switch (item.loaiChiTiet) {
                        case LoaiChiTietTuyChonNoiDung.MaHang:
                            item.stt = 3;
                            item.checked = true;
                            item.giaTri = 'Mã số';
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 10;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Item code)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu:
                            item.stt = 2;
                            item.giaTri = 'Tên nhãn hiệu, quy cách, phẩm chất vật tư (sản phẩm, hàng hóa)';
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 32;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Brand, specifications and quality of supplies products, good)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.DonViTinh:
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 6;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Export)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.SoLuong:
                            item.stt = 7;
                            item.giaTri = 'Thực xuất';
                            item.disabled = true;
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 7;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Export)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.DonGia:
                            item.stt = 9;
                            break;
                        case LoaiChiTietTuyChonNoiDung.ThanhTien:
                            item.stt = 10;
                            break;
                        case LoaiChiTietTuyChonNoiDung.GhiChuHHDV:
                            item.stt = 11;
                            break;
                        case LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1:
                            item.stt = 12;
                            break;
                        default:
                            break;
                    }
                });

                if (objData.code === '01.CB.01') {
                    data = data.filter(x =>
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HoTenNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua);

                    for (let i = 1; i <= 9; i++) {
                        let cloneAdded = null;

                        if (i === 2) {
                            cloneAdded = JSON.parse(JSON.stringify(cloneNgayThangNam));
                        } else {
                            cloneAdded = JSON.parse(JSON.stringify(cloneThongTinMuaHang));
                        }

                        cloneAdded.stt = i;

                        switch (i) {
                            case 1:
                                cloneAdded.giaTri = 'Căn cứ lệnh điều động số';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.CanCuSo;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Pusuant to Delivery order No.)';
                                    }
                                });
                                break;
                            case 2:
                                cloneAdded.giaTri = capitalizeFirstLetter(cloneAdded.giaTri);
                                cloneAdded.loai = LoaiTuyChinhChiTiet.ThongTinNguoiMua;
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.NgayCanCu;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loai = cloneAdded.loai;
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    child.tuyChonChiTiet.chuNghieng = false;
                                });
                                break;
                            case 3:
                                cloneAdded.giaTri = 'Của';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.Cua;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Of)';
                                    }
                                });
                                break;
                            case 4:
                                cloneAdded.giaTri = 'về việc';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.VeViecDienGiai;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(about)';
                                    }
                                });
                                break;
                            case 5:
                                cloneAdded.giaTri = 'Họ tên người vận chuyển';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Carrier\'s name)';
                                    }
                                });
                                break;
                            case 6:
                                cloneAdded.giaTri = 'Hợp đồng số';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Contract no.)';
                                    }
                                });
                                break;
                            case 7:
                                cloneAdded.giaTri = 'Phương tiện vận chuyển';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Type of transport)';
                                    }
                                });
                                break;
                            case 8:
                                cloneAdded.giaTri = 'Xuất tại kho';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Export at warehouse)';
                                    }
                                });
                                break;
                            case 9:
                                cloneAdded.giaTri = 'Nhập tại kho';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Import at warehouse)';
                                    }
                                });
                                break;
                            default:
                                break;
                        }

                        data.splice(idxCloneThongTinMuaHang + (i - 1), 0, cloneAdded);
                    }

                    var thongTinNguoiKys: any[] = [
                        { giaTri: 'Người lập phiếu', giaTriSongNgu: '(Creator)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiLapPhieu },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiLapPhieu },
                        { giaTri: 'Thủ kho xuất', giaTriSongNgu: '(Export warehousekeeper)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoXuat },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuKhoXuat },
                        { giaTri: 'Người vận chuyển', giaTriSongNgu: '(Carrier)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiVanChuyen },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiVanChuyen },
                        { giaTri: 'Thủ kho nhập', giaTriSongNgu: '(Import warehousekeeper)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoNhap },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuKhoNhap }
                    ];

                    let stt = 3;
                    for (let i = 1; i <= 8; i++) {
                        var item = thongTinNguoiKys[i - 1];
                        var clone = null;

                        if (i % 2 === 1) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneTieuDeChuyenDoi));
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneHoTenChuyenDoi));
                        }

                        clone.giaTri = item.giaTri;
                        clone.stt = stt;
                        clone.loaiChiTiet = item.loaiChiTiet;
                        clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                            child.loaiChiTiet = item.loaiChiTiet;

                            if (child.loaiContainer === 1) {
                                child.giaTri = clone.giaTri;
                            } else if (child.loaiContainer === 4) {
                                child.giaTri = item.giaTriSongNgu;
                            }
                        });

                        stt += 1;
                        data.splice(idxCloneHoTenChuyenDoi + i, 0, clone);
                    }
                } else {
                    data = data.filter(x =>
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HoTenNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua);

                    var thongTinNguoiMuas: any[] = [
                        { giaTri: 'Đơn vị nhận hàng', giaTriSongNgu: 'Consignee unit)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua },
                        { giaTri: 'Mã số thuế', giaTriSongNgu: '(Consignee unit taxcode)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua },
                        { giaTri: 'Địa chỉ nhận hàng', giaTriSongNgu: '(Import at warehouse)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang },
                        { giaTri: 'Tên người nhận hàng', giaTriSongNgu: '(Importer\'s name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang },
                    ];

                    for (let i = 1; i <= 4; i++) {
                        var item = thongTinNguoiMuas[i - 1];
                        let cloneAdded = JSON.parse(JSON.stringify(cloneThongTinMuaHang));
                        cloneAdded.stt = i;

                        if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua ||
                            item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua ||
                            item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang) {
                            cloneAdded.disabled = false;
                        }

                        cloneAdded.giaTri = item.giaTri;
                        cloneAdded.loaiChiTiet = item.loaiChiTiet;
                        cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                            child.loaiChiTiet = cloneAdded.loaiChiTiet;
                            if (child.loaiContainer === 1) {
                                child.giaTri = cloneAdded.giaTri;
                            } else if (child.loaiContainer === 4) {
                                child.giaTri = item.giaTriSongNgu;
                            }
                        });

                        data.splice(idxCloneThongTinMuaHang + (i - 1), 0, cloneAdded);
                    }

                    let sttDiaChiNguoiBan = 3;
                    for (let i = 1; i <= 9; i++) {
                        let cloneAdded = null;

                        if (i === 2) {
                            cloneAdded = JSON.parse(JSON.stringify(cloneNgayThangNam));
                        } else {
                            cloneAdded = JSON.parse(JSON.stringify(cloneDiaChiNguoiBan));
                        }

                        cloneAdded.stt = 2 + i;

                        switch (i) {
                            case 1:
                                cloneAdded.giaTri = 'Căn cứ lệnh điều động số';
                                cloneAdded.disabled = true;
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.CanCuSo;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Pusuant to Delivery order No.)';
                                    }
                                });
                                break;
                            case 2:
                                cloneAdded.disabled = true;
                                cloneAdded.loai = LoaiTuyChinhChiTiet.ThongTinNguoiBan;
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.NgayCanCu;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loai = cloneAdded.loai;
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    child.tuyChonChiTiet.chuNghieng = false;
                                });
                                break;
                            case 3:
                                cloneAdded.giaTri = 'Của';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.Cua;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Of)';
                                    }
                                });
                                break;
                            case 4:
                                cloneAdded.giaTri = 'về việc';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.VeViecDienGiai;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(about)';
                                    }
                                });
                                break;
                            case 5:
                                cloneAdded.disabled = true;
                                cloneAdded.giaTri = 'Địa chỉ kho xuất hàng';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Export at warehouse)';
                                    }
                                });
                                break;
                            case 6:
                                cloneAdded.giaTri = 'Tên người xuất hàng';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Exporter\'s name)';
                                    }
                                });
                                break;
                            case 7:
                                cloneAdded.giaTri = 'Tên người vận chuyển';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Carrier\'s name)';
                                    }
                                });
                                break;
                            case 8:
                                cloneAdded.giaTri = 'Hợp đồng vận chuyển';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Contract no.)';
                                    }
                                });
                                break;
                            case 9:
                                cloneAdded.disabled = true;
                                cloneAdded.giaTri = 'Phương tiện vận chuyển';
                                cloneAdded.loaiChiTiet = LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen;
                                cloneAdded.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                    child.loaiChiTiet = cloneAdded.loaiChiTiet;
                                    if (child.loaiContainer === 1) {
                                        child.giaTri = cloneAdded.giaTri;
                                    } else if (child.loaiContainer === 2) {
                                        child.giaTri = '';
                                    } else if (child.loaiContainer === 4) {
                                        child.giaTri = '(Type of transport)';
                                    }
                                });
                                break;
                            default:
                                break;
                        }

                        data.splice(idxCloneDiaChiNguoiBan + (i - 1), 0, cloneAdded);

                        if (i === 9) {
                            sttDiaChiNguoiBan = cloneAdded.stt + 1;
                        }
                    }

                    var thongTinNguoiBanFromDiaChis = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DiaChiNguoiBan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DienThoaiNguoiBan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.FaxNguoiBan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.WebsiteNguoiBan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.EmailNguoiBan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiBan);

                    for (let i = 0; i < thongTinNguoiBanFromDiaChis.length; i++) {
                        const item = thongTinNguoiBanFromDiaChis[i];

                        item.stt = sttDiaChiNguoiBan + i;
                        item.checked = false;
                    }

                    var thongTinNguoiKys: any[] = [
                        { giaTri: 'Thủ trưởng đơn vị', giaTriSongNgu: '(Unit heads)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuTruongDonVi },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuTruongDonVi }
                    ];

                    let stt = 3;
                    for (let i = 1; i <= 2; i++) {
                        var item = thongTinNguoiKys[i - 1];
                        var clone = null;

                        if (i % 2 === 1) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneTieuDeChuyenDoi));
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneHoTenChuyenDoi));
                        }

                        clone.giaTri = item.giaTri;
                        clone.stt = stt;
                        clone.loaiChiTiet = item.loaiChiTiet;
                        clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                            child.loaiChiTiet = item.loaiChiTiet;

                            if (child.loaiContainer === 1) {
                                child.giaTri = clone.giaTri;
                            } else if (child.loaiContainer === 4) {
                                child.giaTri = item.giaTriSongNgu;
                            }
                        });

                        stt += 1;
                        data.splice(idxCloneHoTenChuyenDoi + i, 0, clone);
                    }
                }

                const idxOfTenPXKNoiBo = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon);
                data[idxOfTenPXKNoiBo].giaTri = 'PHIẾU XUẤT KHO KIÊM VẬN CHUYỂN NỘI BỘ';
                data[idxOfTenPXKNoiBo].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenPXKNoiBo].giaTri;
                    } else if (child.loaiContainer === 4) {
                        child.giaTri = '(DELIVERY NOTE OF INTERNAL TRANSPORTATION)';
                    }
                });

                const idxOfTenMauPXKVanChuyenNoiBo = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenMauHoaDon);
                data[idxOfTenMauPXKVanChuyenNoiBo].giaTri = '(Bản thể hiện của phiếu xuất kho kiêm vận chuyển nội bộ điện tử)';
                data[idxOfTenMauPXKVanChuyenNoiBo].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenMauPXKVanChuyenNoiBo].giaTri;
                    }
                });
                break;
            case LoaiHoaDon.PXKHangGuiBanDaiLy:
                data = data.filter(x =>
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HinhThucThanhToan &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoTaiKhoanNguoiMua &&

                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHang &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.ThueSuatGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TienThueGTGT &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CongTienHangDaTruCK &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoTienBangChu &&

                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiBan);

                var idxCloneThongTinMuaHang = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.HoTenNguoiMua);
                var cloneThongTinMuaHang = data[idxCloneThongTinMuaHang];
                var cloneNgayThangNam = data.find(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe);

                var idxCloneTieuDeChuyenDoi = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi);
                var cloneTieuDeChuyenDoi = data[idxCloneTieuDeChuyenDoi];

                var idxCloneHoTenChuyenDoi = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiChuyenDoi);
                var cloneHoTenChuyenDoi = data[idxCloneHoTenChuyenDoi];

                // create table hhdv
                var hhdvPXKNoiBos = data.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu);
                hhdvPXKNoiBos.forEach((item: MauHoaDonTuyChonChiTiet, index: any) => {
                    switch (item.loaiChiTiet) {
                        case LoaiChiTietTuyChonNoiDung.MaHang:
                            item.stt = 3;
                            item.checked = true;
                            item.giaTri = 'Mã số';
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 10;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Item code)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.TenHangHoaDichVu:
                            item.stt = 2;
                            item.giaTri = 'Tên nhãn hiệu, quy cách, phẩm chất vật tư (sản phẩm, hàng hóa)';
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 35;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = item.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = '(Brand, specifications and quality of supplies products, good)';
                                }
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.DonViTinh:
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 10;
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.SoLuong:
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 10;
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.DonGia:
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 14;
                            });
                            break;
                        case LoaiChiTietTuyChonNoiDung.ThanhTien:
                            item.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.tuyChonChiTiet.doRong = 15;
                            });
                            break;
                        default:
                            break;
                    }
                });

                data = data.filter(x =>
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.HoTenNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua &&
                    x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.DiaChiNguoiMua);

                if (objData.code === '01.CB.01') {
                    var thongTinNguoiMuas: any[] = [
                        { giaTri: 'Căn cứ hợp đồng kinh tế số', giaTriSongNgu: '(Based on co-economic no.)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuSo },
                        { giaTri: '', giaTriSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.NgayCanCu },
                        { giaTri: 'Của', giaTriSongNgu: '(Of)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.Cua },
                        { giaTri: 'Với (tổ chức, cá nhân)', giaTriSongNgu: 'With (organization, individual)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua },
                        { giaTri: 'Mã số thuế', giaTriSongNgu: '(Tax code)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua },
                        { giaTri: 'Họ tên người vận chuyển', giaTriSongNgu: '(Carrier\'s name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen },
                        { giaTri: 'Hợp đồng số', giaTriSongNgu: '(Contract no.)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo },
                        { giaTri: 'Phương tiện vận chuyển', giaTriSongNgu: '(Type of transport)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen },
                        { giaTri: 'Xuất tại kho', giaTriSongNgu: '(Export at warehouse)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang },
                        { giaTri: 'Nhập tại kho', giaTriSongNgu: '(Import at warehouse)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang }
                    ];

                    var lastSTTThongTinMuaHang = 0;
                    for (let i = 1; i <= thongTinNguoiMuas.length; i++) {
                        var item = thongTinNguoiMuas[i - 1];
                        var clone = null;

                        if (i !== 2) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneThongTinMuaHang));
                            clone.giaTri = item.giaTri;
                            clone.loaiChiTiet = item.loaiChiTiet;
                            clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.loaiChiTiet = clone.loaiChiTiet;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = clone.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = item.giaTriSongNgu;
                                }
                            });
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneNgayThangNam));
                            clone.giaTri = capitalizeFirstLetter(clone.giaTri);
                            clone.loai = LoaiTuyChinhChiTiet.ThongTinNguoiMua;
                            clone.loaiChiTiet = item.loaiChiTiet;
                            clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.loai = clone.loai;
                                child.loaiChiTiet = clone.loaiChiTiet;
                                child.tuyChonChiTiet.chuNghieng = false;
                            });
                        }

                        clone.stt = i;
                        data.splice(idxCloneThongTinMuaHang + (i - 1), 0, clone);

                        if (i === thongTinNguoiMuas.length) {
                            lastSTTThongTinMuaHang = i + 1;
                        }
                    }

                    var dongTienThanhToanVaTruongBoSungs = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1);

                    dongTienThanhToanVaTruongBoSungs.forEach((item: MauHoaDonTuyChonChiTiet, index: any) => {
                        item.stt = lastSTTThongTinMuaHang + index;
                    });

                    var thongTinNguoiKys: any[] = [
                        { giaTri: 'Người lập phiếu', giaTriSongNgu: '(Creator)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiLapPhieu },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiLapPhieu },
                        { giaTri: 'Người nhận hàng', giaTriSongNgu: '(Receiver)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiNhanHang },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiNhanHang },
                        { giaTri: 'Thủ kho xuất', giaTriSongNgu: '(Export warehousekeeper)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoXuat },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuKhoXuat },
                        { giaTri: 'Người vận chuyển', giaTriSongNgu: '(Carrier)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiVanChuyen },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenNguoiVanChuyen },
                        { giaTri: 'Thủ kho nhập', giaTriSongNgu: '(Import warehousekeeper)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoNhap },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuKhoNhap }
                    ];

                    for (let i = 1; i <= thongTinNguoiKys.length; i++) {
                        var item = thongTinNguoiKys[i - 1];
                        var clone = null;

                        if (i % 2 === 1) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneTieuDeChuyenDoi));
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneHoTenChuyenDoi));
                        }

                        clone.giaTri = item.giaTri;
                        clone.stt = (i + 2);
                        clone.loaiChiTiet = item.loaiChiTiet;
                        clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                            child.loaiChiTiet = item.loaiChiTiet;

                            if (child.loaiContainer === 1) {
                                child.giaTri = clone.giaTri;
                            } else if (child.loaiContainer === 4) {
                                child.giaTri = item.giaTriSongNgu;
                            }
                        });

                        data.splice(idxCloneHoTenChuyenDoi + i, 0, clone);
                    }
                } else {
                    var thongTinNguoiBans = data.filter(x => x.loai === LoaiTuyChinhChiTiet.ThongTinNguoiBan &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.TenDonViNguoiBan &&
                        x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan);

                    thongTinNguoiBans.forEach((item: MauHoaDonTuyChonChiTiet) => {
                        item.checked = false;
                    });

                    var thongTinNguoiMuas: any[] = [
                        { giaTri: 'Căn cứ hợp đồng kinh tế số', giaTriSongNgu: '(Based on co-economic no.)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.CanCuSo },
                        { giaTri: '', giaTriSongNgu: '', loaiChiTiet: LoaiChiTietTuyChonNoiDung.NgayCanCu },
                        { giaTri: 'Của', giaTriSongNgu: '(Of)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.Cua },
                        { giaTri: 'Với (tổ chức, cá nhân)', giaTriSongNgu: 'With (organization, individual)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenDonViNguoiMua },
                        { giaTri: 'Mã số thuế', giaTriSongNgu: '(Tax code)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.MaSoThueNguoiMua },
                        { giaTri: 'Họ tên người vận chuyển', giaTriSongNgu: '(Carrier\'s name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TenNguoiVanChuyen },
                        { giaTri: 'Hợp đồng số', giaTriSongNgu: '(Contract no.)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.HopDongVanChuyenSo },
                        { giaTri: 'Phương tiện vận chuyển', giaTriSongNgu: '(Type of transport)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.PhuongThucVanChuyen },
                        { giaTri: 'Xuất tại kho', giaTriSongNgu: '(Export at warehouse)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiKhoXuatHang },
                        { giaTri: 'Tên người xuất hàng', giaTriSongNgu: '(Exporter\'s name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiXuatHang },
                        { giaTri: 'Nhập tại kho', giaTriSongNgu: '(Import at warehouse)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.DiaChiKhoNhanHang },
                        { giaTri: 'Tên người nhận hàng', giaTriSongNgu: '(Importer\'s name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.HoTenNguoiNhanHang }
                    ];

                    var lastSTTThongTinMuaHang = 0;
                    for (let i = 1; i <= thongTinNguoiMuas.length; i++) {
                        var item = thongTinNguoiMuas[i - 1];
                        var clone = null;

                        if (i !== 2) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneThongTinMuaHang));
                            clone.giaTri = item.giaTri;
                            clone.loaiChiTiet = item.loaiChiTiet;
                            clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.loaiChiTiet = clone.loaiChiTiet;
                                if (child.loaiContainer === 1) {
                                    child.giaTri = clone.giaTri;
                                } else if (child.loaiContainer === 4) {
                                    child.giaTri = item.giaTriSongNgu;
                                }
                            });
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneNgayThangNam));
                            clone.loai = LoaiTuyChinhChiTiet.ThongTinNguoiMua;
                            clone.loaiChiTiet = item.loaiChiTiet;
                            clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                                child.loai = clone.loai;
                                child.loaiChiTiet = clone.loaiChiTiet;
                                child.tuyChonChiTiet.chuNghieng = false;
                            });
                        }

                        clone.stt = i;
                        data.splice(idxCloneThongTinMuaHang + (i - 1), 0, clone);

                        if (i === thongTinNguoiMuas.length) {
                            lastSTTThongTinMuaHang = i + 1;
                        }
                    }

                    var dongTienThanhToanVaTruongBoSungs = data.filter(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.DongTienThanhToan ||
                        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1);

                    dongTienThanhToanVaTruongBoSungs.forEach((item: MauHoaDonTuyChonChiTiet, index: any) => {
                        item.stt = lastSTTThongTinMuaHang + index;
                    });

                    var thongTinNguoiKys: any[] = [
                        { giaTri: 'Thủ trưởng đơn vị', giaTriSongNgu: '(Unit heads)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.TieuDeKyThuTruongDonVi },
                        { giaTri: '(Ký, ghi rõ họ, tên)', giaTriSongNgu: '(Signature, full name)', loaiChiTiet: LoaiChiTietTuyChonNoiDung.KyGhiRoHoTenThuTruongDonVi }
                    ];

                    for (let i = 1; i <= thongTinNguoiKys.length; i++) {
                        var item = thongTinNguoiKys[i - 1];
                        var clone = null;

                        if (i % 2 === 1) { // lẻ
                            clone = JSON.parse(JSON.stringify(cloneTieuDeChuyenDoi));
                        } else {
                            clone = JSON.parse(JSON.stringify(cloneHoTenChuyenDoi));
                        }

                        clone.giaTri = item.giaTri;
                        clone.stt = (i + 2);
                        clone.loaiChiTiet = item.loaiChiTiet;
                        clone.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                            child.loaiChiTiet = item.loaiChiTiet;

                            if (child.loaiContainer === 1) {
                                child.giaTri = clone.giaTri;
                            } else if (child.loaiContainer === 4) {
                                child.giaTri = item.giaTriSongNgu;
                            }
                        });

                        data.splice(idxCloneHoTenChuyenDoi + i, 0, clone);
                    }
                }

                const idxOfTenPXKDaiLy = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenLoaiHoaDon);
                data[idxOfTenPXKDaiLy].giaTri = 'PHIẾU XUẤT KHO HÀNG GỬI BÁN ĐẠI LÝ';
                data[idxOfTenPXKDaiLy].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenPXKDaiLy].giaTri;
                    } else if (child.loaiContainer === 4) {
                        child.giaTri = '(EXPORT FOR SALES AGENTS)';
                    }
                });

                const idxOfTenMauPXKBanHangGuiDaiLy = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TenMauHoaDon);
                data[idxOfTenMauPXKBanHangGuiDaiLy].giaTri = '(Bản thể hiện của phiếu xuất kho hàng gửi bán đại lý điện tử)';
                data[idxOfTenMauPXKBanHangGuiDaiLy].children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                    if (child.loaiContainer === 1) {
                        child.giaTri = data[idxOfTenMauPXKBanHangGuiDaiLy].giaTri;
                    }
                });
                break;
            default:
                break;
        }
    }

    // clone 9 trường thông tin bổ sung
    let idxThongTinBoSung = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1);
    if (idxThongTinBoSung !== -1) {
        var tttbs1Val = LoaiChiTietTuyChonNoiDung.TruongThongTinBoSung1 as number;
        const source = JSON.parse(JSON.stringify(data[idxThongTinBoSung]));

        for (let i = 1; i < 10; i++) {
            idxThongTinBoSung += i;
            const clone = JSON.parse(JSON.stringify(source));
            clone.loaiChiTiet = tttbs1Val + i;
            clone.stt = source.stt + i;
            clone.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
                item.loaiChiTiet = clone.loaiChiTiet;
                if (item.loaiContainer === 1) {
                    item.giaTri = `Trường thông tin bổ sung ${i + 1}`;
                }
            });
            data.splice(idxThongTinBoSung, 0, clone);
        }
    }

    // clone 9 trường mở rộng chi tiết
    let idxMoRongChiTiet = data.findIndex(x => x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1);
    if (idxMoRongChiTiet !== -1) {
        var tmrct1 = LoaiChiTietTuyChonNoiDung.TruongMoRongChiTiet1 as number;
        const source = JSON.parse(JSON.stringify(data[idxMoRongChiTiet]));

        for (let i = 1; i < 10; i++) {
            idxMoRongChiTiet += i;
            const clone = JSON.parse(JSON.stringify(source));
            clone.loaiChiTiet = tmrct1 + i;
            clone.stt = source.stt + i;
            clone.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
                item.loaiChiTiet = clone.loaiChiTiet;
                if (item.loaiContainer === 1) {
                    item.giaTri = `Trường thông tin mở rộng ${i + 1}`;
                }
            });
            data.splice(idxMoRongChiTiet, 0, clone)
        }
    }

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
    
    if (isOnlyGetSongNgu) {
        data.forEach((item: MauHoaDonTuyChonChiTiet) => {
            item.children = item.children.filter(x => x.loaiContainer === 4);
        });

        // data.forEach((item: MauHoaDonTuyChonChiTiet) => {
        //     if (item.loaiChiTiet === LoaiChiTietTuyChonNoiDung.NgayThangNamTieuDe) {
        //         item.children[0].giaTri = 'Ngày(Date) tháng(month) năm(year)';
        //     }
        // });
    }

    return data;
}

export function GetRawTuyChinhChiTiet(loaiChiTiet: LoaiChiTietTuyChonNoiDung, data: any) {
    const list = CreateTuyChonChiTiets(null, data);
    const item = list.find(x => x.loaiChiTiet === loaiChiTiet);
    return item;
}

export function GetGiaTriParent(value: any) {
    return value ? (`: ${value}`) : '';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function GroupThongTinNguoiKy(data: any[]) {
    const tieuDes = data.filter(x => (x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiChuyenDoi ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiMua ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiBan ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiLapPhieu ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiNhanHang ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoXuat ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyNguoiVanChuyen ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyThuKhoNhap ||
        x.loaiChiTiet === LoaiChiTietTuyChonNoiDung.TieuDeKyThuTruongDonVi) && x.checked === true)
        .sort((a, b) => a.stt - b.stt);

    var result: Array<{ key: any, children: any[] }> = [];

    tieuDes.forEach((item: MauHoaDonTuyChonChiTiet) => {
        const keyKyGhiRoHoTen = 'KyGhiRoHoTen' + LoaiChiTietTuyChonNoiDung[item.loaiChiTiet].slice(8);
        var children = [];
        item.isTieuDeKy = true;
        children.push(item);

        const findKyGhiRoHoTen = data.find(x => LoaiChiTietTuyChonNoiDung[x.loaiChiTiet] === keyKyGhiRoHoTen);
        if (findKyGhiRoHoTen) {
            findKyGhiRoHoTen.isTieuDeKy = false;
            children.push(findKyGhiRoHoTen);
        }

        result.push({ key: item.loaiChiTiet, children: children });
    });

    return result;
}