import { Form, FormArray } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { CookieConstant } from "../constants/constant";
import { DinhDangThapPhan } from "./DinhDangThapPhan";
import { mathRound } from "./SharedFunction";

export class HangHoaDichVu {
    soLuong?: any;

    donGia?: any;

    thanhTien?: any;

    thanhTienNgoaiTe?: any;

    tyLeChietKhau?: any;

    tienChietKhau?: any;

    tienChietKhauNgoaiTe?: any;

    thueGTGT?: any;

    tienThueGTGT?: any;

    tienThueGTGTNgoaiTe?: any;

    phiTruocHaiQuan?: any;
    phiHangVeKho?: any;
    giaTriNhapKho?: any;
    giaTinhThueNK?: any;
    thueNK?: any;
    tienThueNK?: any;
    thueTTDB?: any;
    tienThueTTDB?: any;

    tyGia?: any;

    tongTienThanhToan?: any;
    tongTienThanhToanNgoaiTe?: any;

    // SUM
    tongSoLuong?: any;
    tongSoLuongNhan?: any;
    tongThanhTien?: any;
    tongThanhTienNgoaiTe?: any;
    tongChietKhau?: any;
    tongChietKhauNgoaiTe?: any;
    tongTienThueGTGT?: any;
    tongTienThueGTGTNgoaiTe?: any;
    tongGiaTinhThueNK?: any;
    tongTienThueNK?: any;
    tongTienThueTTDB?: any;
    tongPhiTruocHaiQuan?: any;
    tongPhiHangVeKho?: any;
    tongGiaTriNhapKho?: any;
    tongThanhTienSauCKTheoTGXQ?: any;
    tongChenhLech?: any;
    tongTienThueGTGTTheoTGXQ?: any;
    tongChenhLechTienThueGTGT?: any;
    soLuongTrongKho?: any;
    soLuongThucTe?: any;
    chechLech?: any;
    conTot?: any;
    kemPhamChat?: any;
    matPhamChat?: any;
    giaTritheoSokeToan?: any;
    gtTheoKiemKe?: any;
    gtTheochenhLech?: any;

    constructor() {
        this.soLuong = 0;
        this.donGia = 0;
        this.thanhTien = 0;
        this.thanhTienNgoaiTe = 0;
        this.tyLeChietKhau = 0;
        this.tienChietKhau = 0;
        this.tienChietKhauNgoaiTe = 0;
        this.thueGTGT = 0;
        this.tienThueGTGT = 0;
        this.tienThueGTGTNgoaiTe = 0;
        this.tongTienThanhToan = 0;
        this.tongTienThanhToanNgoaiTe = 0;
        this.phiTruocHaiQuan = 0;
        this.phiHangVeKho = 0;
        this.giaTriNhapKho = 0;
        this.giaTinhThueNK = 0;
        this.thueNK = 0;
        this.tienThueNK = 0;
        this.thueTTDB = 0;
        this.tienThueTTDB = 0;
        this.tyGia = 1;
        this.tongSoLuong = 0;
        this.tongSoLuongNhan = 0;
        this.tongChietKhau = 0;
        this.tongThanhTienNgoaiTe = 0;
        this.tongThanhTien = 0;
        this.tongThanhTienNgoaiTe = 0;
        this.tongTienThueGTGT = 0;
        this.tongTienThueGTGTNgoaiTe = 0;
        this.tongGiaTinhThueNK = 0;
        this.tongTienThueNK = 0;
        this.tongTienThueTTDB = 0;
        this.tongPhiTruocHaiQuan = 0;
        this.tongGiaTriNhapKho = 0;
        this.tongPhiHangVeKho = 0;
        this.tongThanhTienSauCKTheoTGXQ = 0;
        this.tongChenhLech = 0;
        this.tongTienThueGTGTTheoTGXQ = 0;
        this.tongChenhLechTienThueGTGT = 0;
        this.soLuongTrongKho = 0;
        this.soLuongThucTe = 0;
        this.chechLech = 0;
        this.conTot = 0;
        this.kemPhamChat = 0;
        this.matPhamChat = 0;
        this.giaTritheoSokeToan = 0;
        this.gtTheoKiemKe = 0;
        this.gtTheochenhLech = 0;
    }
}

export class TotalHangHoaChiTiet {

    tongSoLuong?: any;

    tongSoLuongNhan?: any;

    tongThanhTien?: any;

    tongThanhTienNgoaiTe?: any;

    tongTienThueGTGT?: any;

    tongTienThueGTGTNgoaiTe?: any;

    tongTienChietKhau?: any;

    tongTienChietKhauNgoaiTe?: any;

    tongTienThanhToan?: any;

    tongTienThanhToanNgoaiTe?: any;

    giaTriHHDichVuChuaThue?: any;

    thueGiaTriGT?: any;

    tongTienSauThue?: any;

    constructor() {
        this.tongSoLuong = 0;
        this.tongSoLuongNhan = 0;
        this.tongThanhTien = 0;
        this.tongThanhTienNgoaiTe = 0;
        this.tongTienThueGTGT = 0;
        this.tongTienThueGTGTNgoaiTe = 0;
        this.tongTienChietKhau = 0;
        this.tongTienChietKhauNgoaiTe = 0;
        this.tongTienThanhToan = 0;
        this.tongTienThanhToanNgoaiTe = 0;
        this.giaTriHHDichVuChuaThue = 0;
        this.thueGiaTriGT = 0;
        this.tongTienSauThue = 0;
    }
}

export class TongBangKeChungTu {

    // Hợp đồng mua hàng
    tongSoDong?: any;
    tongGiaTriHopDong?: any;
    tongGiaTriThanhLy?: any;
    tongGiaTriDaThucHien?: any;
    tongSoDaTra?: any;
    tongSoConPhaiTraDuKien?: any;
    tongSoConPhaiTra?: any;

    // Chứng từ mua hàng
    tongTongTienhang?: any;
    tongChietKhau?: any;
    tongTienThueGTGT?: any;
    tongTongTienThanhToan?: any;
    tongChiPhiMuaHang?: any;
    tongGiaTriNhapKho?: any;

    constructor() {
        this.tongSoDong = 0;
        this.tongGiaTriHopDong = 0;
        this.tongGiaTriThanhLy = 0;
        this.tongGiaTriDaThucHien = 0;
        this.tongSoDaTra = 0;
        this.tongSoConPhaiTraDuKien = 0;
        this.tongSoConPhaiTra = 0;

        this.tongTongTienhang = 0;
        this.tongChietKhau = 0;
        this.tongTienThueGTGT = 0;
        this.tongTongTienThanhToan = 0;
        this.tongChiPhiMuaHang = 0;
        this.tongGiaTriNhapKho = 0;
    }
}

export enum BlurPosition {
    NONE,
    SO_LUONG,

    DON_GIA,
    DON_GIA_SAU_THUE,
    DON_GIA_QUY_DOI,

    THANH_TIEN,
    THANH_TIEN_QUY_DOI,

    THANH_TIEN_SAU_THUE,
    THANH_TIEN_SAU_THUE_QUY_DOI,


    TI_LE_CK,
    TIEN_CK,
    TIEN_CK_QUY_DOI,

    THUE_GTGT,
    TIEN_THUE_GTGT,
    TIEN_THUE_GTGT_QUY_DOI,

    TY_LE_PHAN_TRAM_DOANH_THU,

    TIEN_GIAM,
    TIEN_GIAM_QUY_DOI,

    TONG_TIEN,
    TONG_TIEN_QUY_DOI,
    TY_GIA,
}
export class TongTaiSanCoDinh {
    tongNguyenGia?: any;
    tongGiaTriKhauHao?: any;
    tongHaoMonLuyKe?: any;
    tongGiaTriConLai?: any;
    constructor() {
        this.tongNguyenGia = 0;
        this.tongGiaTriKhauHao = 0;
        this.tongHaoMonLuyKe = 0;
        this.tongGiaTriConLai = 0;
    }
}

export class TinhToanHangHoaDichVu {
    form: FormGroup;
    details: any[];
    isVND: boolean;
    ddtp: DinhDangThapPhan;
    phatSinhBanHangTheoDGSauThue: boolean;
    tinhTienTheoDGSauThue: boolean;
    tinhTienTheoSLvaDGSauThue: boolean;
    tinhSLTheoDGvaTienSauThue: boolean;

    constructor(form: FormGroup, details: any[], isVND: boolean) {
        this.form = form;
        this.details = details;
        this.isVND = isVND;
        this.ddtp = new DinhDangThapPhan();
        this.phatSinhBanHangTheoDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'PhatSinhBanHangTheoDGSauThue').giaTri);
        this.tinhTienTheoDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhTienTheoDGSauThue').giaTri);
        this.tinhTienTheoSLvaDGSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhTienTheoSLvaDGSauThue').giaTri);
        this.tinhSLTheoDGvaTienSauThue = JSON.parse(JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'TinhSLTheoDGvaTienSauThue').giaTri);
    }

    updateChiTiets(detail: any){
        if(this.details.indexOf(detail) < 0) this.details.push(detail);
    }

    updateChiTiet(detail: any, i: number){
        this.details[i] = detail;
    }
    
    updateAllChiTiets(details: any[]){
        this.details = details;
    }
    
    removeChiTiets(index: number){
        this.details.splice(index, 1);
    }
    
    blurTinhToan(index: number, position: BlurPosition, isEventFromUI = true, prePosition: BlurPosition = null, isTinhTong = true) {
        let item = this.details[index];
        const tyGia = this.form.get('tyGia').value;
        this.isVND = tyGia == 1;
        const isGiamTheoNghiQuyet = this.form.get('isGiamTheoNghiQuyet').value || false;
        // const tyLePhanTramDoanhThu = this.form.get('tyLePhanTramDoanhThu').value || 0;
        const loaiHoaDon = this.form.get('loaiHoaDon').value;

        console.log(item);
        console.log(item.hangHoaDichVu);
        let boolPhatSinhSauThue = false;
        if (item.hangHoaDichVu || loaiHoaDon === 7 || loaiHoaDon === 8) {
            boolPhatSinhSauThue = true;
            if(!item.hangHoaDichVu || (item.hangHoaDichVu && !item.hangHoaDichVu.isGiaBanLaDonGiaSauThue)) boolPhatSinhSauThue = false;
            
            if(boolPhatSinhSauThue == true){
                this.phatSinhBanHangTheoDGSauThue = false;
                this.tinhTienTheoDGSauThue = false;
                this.tinhTienTheoSLvaDGSauThue = false;
                this.tinhSLTheoDGvaTienSauThue = false;
            }
        }

        let tinhChat = item.tinhChat || 0;

        let tyLeChietKhauTong = this.form.get(`tyLeChietKhau`).value || 0;

        let soLuong = item.soLuong || 0;
        let donGia = item.donGia || 0;
        let donGiaSauThue = item.donGiaSauThue || 0;

        let thanhTien = item.thanhTien || 0;
        let thanhTienQuyDoi = item.thanhTienQuyDoi || 0;
        let thanhTienSauThue = item.thanhTienSauThue || 0;

        let tyLeChietKhau = item.tyLeChietKhau || 0;
        let tienChietKhau = item.tienChietKhau || 0;
        let tienChietKhauQuyDoi = item.tienChietKhauQuyDoi || 0;

        let thueGTGT = item.thueGTGT || 0;
        let thueKhac = item.thueKhac || 0;

        if (thueGTGT === 'KCT' || thueGTGT === 'KKKNT') {
            thueGTGT = 0;
        } else if (thueGTGT === 'KHAC') {
            thueGTGT = thueKhac;
        } else {
            thueGTGT *= 1;
        }

        let tienThueGTGT = item.tienThueGTGT || 0;
        let tienThueGTGTQuyDoi = item.tienThueGTGTQuyDoi || 0;

        let tyLePhanTramDoanhThu = item.tyLePhanTramDoanhThu || 0;
        let tienGiam = item.tienGiam || 0;
        let tienGiamQuyDoi = item.tienGiamQuyDoi || 0;

        //fix làm tròn số, nếu có nhập tiền mới chạy tiếp, còn ko nhập mà blur thì return.
        switch (position) {
            case BlurPosition.SO_LUONG:
                if (!item.soLuongDirty || item.soLuongDirty == false) {
                    return;
                } else {
                    item.soLuongDirty = false;
                }
                break;
            case BlurPosition.DON_GIA:
                if (!item.donGiaDirty || item.donGiaDirty == false) {
                    return;
                } else {
                    item.donGiaDirty = false;
                }
                break;
            case BlurPosition.DON_GIA_SAU_THUE:
                if (!item.donGiaSauThueDirty || item.donGiaSauThueDirty == false) {
                    return;
                } else {
                    item.donGiaSauThueDirty = false;
                }
                break;
            case BlurPosition.THANH_TIEN_SAU_THUE:
                if (!item.thanhTienSauThueDirty || item.thanhTienSauThueDirty == false) {
                    return;
                } else {
                    item.thanhTienSauThueDirty = false;
                }
                break;
            case BlurPosition.THANH_TIEN:
                if (!item.thanhTienDirty || item.thanhTienDirty == false) {
                    return;
                } else {
                    item.thanhTienDirty = false;
                }
                break;
            case BlurPosition.THANH_TIEN_QUY_DOI:
                if (!item.thanhTienQuyDoiDirty || item.thanhTienQuyDoiDirty == false) {
                    return;
                } else {
                    item.thanhTienQuyDoiDirty = false;
                }
                break;
            case BlurPosition.TI_LE_CK:
                if (!item.tyLeChietKhauDirty || item.tyLeChietKhauDirty == false) {
                    return;
                } else {
                    item.tyLeChietKhauDirty = false;
                }
                break;
            case BlurPosition.TIEN_CK:
                if (!item.tienCKDirty || item.tienCKDirty == false) {
                    return;
                } else {
                    item.tienCKDirty = false;
                }
                break;
            case BlurPosition.TIEN_CK_QUY_DOI:
                if (!item.tienCKQuyDoiDirty || item.tienCKQuyDoiDirty == false) {
                    return;
                } else {
                    item.tienCKQuyDoiDirty = false;
                }
                break;
            case BlurPosition.TIEN_THUE_GTGT:
                if (!item.tienThueGTGTDirty || item.tienThueGTGTDirty == false) {
                    return;
                } else {
                    item.tienThueGTGTDirty = false;
                }
                break;
            case BlurPosition.TIEN_THUE_GTGT_QUY_DOI:
                if (!item.tienThueGTGTQuyDoiDirty || item.tienThueGTGTQuyDoiDirty == false) {
                    return;
                } else {
                    item.tienThueGTGTQuyDoiDirty = false;
                }
                break;
            case BlurPosition.TY_LE_PHAN_TRAM_DOANH_THU:
                if (!item.tyLePhanTramDoanhThuDirty || item.tyLePhanTramDoanhThuDirty == false) {
                    return;
                } else {
                    item.tyLePhanTramDoanhThuDirty = false;
                }
                break;
            case BlurPosition.TIEN_GIAM:
                if (!item.tienGiamDirty || item.tienGiamDirty == false) {
                    return;
                } else {
                    item.tienGiamDirty = false;
                }
                break;
            case BlurPosition.TIEN_GIAM_QUY_DOI:
                if (!item.tienGiamQuyDoiDirty || item.tienGiamQuyDoiDirty == false) {
                    return;
                } else {
                    item.tienGiamQuyDoiDirty = false;
                }
                break;
            default:
                break;
        }

        switch (position) {
            case BlurPosition.SO_LUONG:
            case BlurPosition.DON_GIA:
                // tính thành tiền theo đơn giá sau thuế || tính thành tiền sau thuế theo số lượng và đơn giá sau thuế + đon giá
                if ((this.tinhTienTheoDGSauThue || this.tinhTienTheoSLvaDGSauThue) && position === BlurPosition.DON_GIA) {
                    return;
                }

                // Nếu là hóa đơn xuất kho nội bộ và event soLuong
                if (isEventFromUI && position === BlurPosition.SO_LUONG && loaiHoaDon === 7) {
                    item.soLuongNhap = soLuong;
                }

                thanhTien = mathRound(soLuong * donGia, this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());

                if (this.tinhSLTheoDGvaTienSauThue && position === BlurPosition.SO_LUONG && !(thanhTienSauThue === 0 && donGiaSauThue === 0)) {
                    var thanhTienInputNotEqualTheoCongThuc = false;
                    // so sánh nếu thành tiền trên input != thành tiền theo công trức thì set input = công thức
                    const thanhTienCompared = mathRound((thanhTienSauThue / (1 + thueGTGT / 100)) / (1 - tyLeChietKhau / 100), this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
                    if (thanhTien !== thanhTienCompared) {
                        thanhTienInputNotEqualTheoCongThuc = true;
                        thanhTien = thanhTienCompared;
                    }

                    // so sánh nếu đơn giá trên input = đơn giá theo công thức thì return;
                    const donGiaCompared = mathRound((donGiaSauThue / (1 + thueGTGT / 100)) / (1 - tyLeChietKhau / 100), this.isVND ? this.ddtp.getDonGiaQuyDoi() : this.ddtp.getDonGiaNgoaiTe());
                    if (donGia === donGiaCompared && !thanhTienInputNotEqualTheoCongThuc) {
                        return;
                    } else {
                        donGia = donGiaCompared;
                    }
                }

                // tính thành tiền theo đơn giá sau thuế || tính thành tiền sau thuế theo số lượng và đơn giá sau thuế + số lượng
                if ((this.tinhTienTheoDGSauThue || this.tinhTienTheoSLvaDGSauThue) && position === BlurPosition.SO_LUONG) {
                    thanhTien = mathRound((soLuong * donGiaSauThue) / (1 + thueGTGT / 100), this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
                }

                if (!this.isVND) {
                    thanhTienQuyDoi = mathRound(thanhTien * tyGia, this.ddtp.getTienQuyDoi());
                }

                if (this.isVND) {
                    tienThueGTGT = mathRound((thanhTien - tienChietKhau) * thueGTGT / 100, this.ddtp.getTienQuyDoi());
                } else {
                    tienThueGTGT = mathRound((thanhTien - tienChietKhau) * thueGTGT / 100, this.ddtp.getTienNgoaiTe());
                    tienThueGTGTQuyDoi = mathRound(tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            case BlurPosition.DON_GIA_SAU_THUE:
                // có phát sinh bán hàng theo đơn giá sau thuế
                if (this.phatSinhBanHangTheoDGSauThue) {
                    // Tính số lượng theo đơn giá và thành tiền sau thuế
                    if (!this.tinhSLTheoDGvaTienSauThue) {
                        donGia = mathRound(donGiaSauThue / (1 + thueGTGT / 100), this.isVND ? this.ddtp.getDonGiaQuyDoi() : this.ddtp.getDonGiaNgoaiTe());
                        thanhTien = mathRound(soLuong * donGia, this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());

                        // tính thành tiền theo đơn giá sau thuế || tính thành tiền sau thuế theo số lượng và đơn giá sau thuế + đơn giá sau thuế
                        if (this.tinhTienTheoDGSauThue || this.tinhTienTheoSLvaDGSauThue) {
                            thanhTien = mathRound((soLuong * donGiaSauThue) / (1 + thueGTGT / 100), this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
                        }
                    }

                    if (!this.isVND) {
                        thanhTienQuyDoi = mathRound(thanhTien * tyGia, this.ddtp.getTienQuyDoi());
                    }
                }
                break;
            case BlurPosition.THANH_TIEN:
                // tính thành tiền theo đơn giá sau thuế
                if (!this.tinhTienTheoDGSauThue && !this.tinhSLTheoDGvaTienSauThue) {
                    if(soLuong == 0) donGia = 0;
                    else donGia = mathRound(thanhTien / soLuong, this.isVND ? this.ddtp.getDonGiaQuyDoi() : this.ddtp.getDonGiaNgoaiTe());
                }

                if (!this.isVND) {
                    thanhTienQuyDoi = mathRound(thanhTien * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            case BlurPosition.THANH_TIEN_SAU_THUE:
                if (this.tinhSLTheoDGvaTienSauThue && thanhTienSauThue === 0) {
                    return;
                }
                break;
            case BlurPosition.THANH_TIEN_QUY_DOI:
                break;
            case BlurPosition.THANH_TIEN_SAU_THUE_QUY_DOI:
                break;
            case BlurPosition.TI_LE_CK:
                if (this.isVND) {
                    tienChietKhau = mathRound(tyLeChietKhau * thanhTien / 100, this.ddtp.getTienQuyDoi());
                } else {
                    tienChietKhau = mathRound(tyLeChietKhau * thanhTien / 100, this.ddtp.getTienNgoaiTe());
                    tienChietKhauQuyDoi = mathRound(tienChietKhau * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            case BlurPosition.TIEN_CK:
                tyLeChietKhau = thanhTien === 0 ? 0 : mathRound(100 * tienChietKhau / thanhTien, this.ddtp.getHeSoTyLe());
                tienChietKhauQuyDoi = mathRound(tienChietKhau * tyGia, this.ddtp.getTienQuyDoi());
                break;
            case BlurPosition.TIEN_CK_QUY_DOI:
                tyLeChietKhau = thanhTien === 0 ? 0 : mathRound(100 * tienChietKhau / thanhTien, this.ddtp.getHeSoTyLe());
                break;
            case BlurPosition.THUE_GTGT:
                if (this.isVND) {
                    tienThueGTGT = mathRound((thanhTien - tienChietKhau) * thueGTGT / 100, this.ddtp.getTienQuyDoi());
                } else {
                    tienThueGTGT = mathRound((thanhTien - tienChietKhau) * thueGTGT / 100, this.ddtp.getTienNgoaiTe());
                    tienThueGTGTQuyDoi = mathRound(tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            case BlurPosition.TIEN_THUE_GTGT:
                if (!this.isVND) {
                    tienThueGTGTQuyDoi = mathRound(tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            case BlurPosition.TY_LE_PHAN_TRAM_DOANH_THU:
                if (this.isVND) {
                    tienGiam = mathRound(((thanhTien - tienChietKhau) * (tyLePhanTramDoanhThu / 100)) * 20 / 100, this.ddtp.getTienQuyDoi());
                } else {
                    tienGiam = mathRound(((thanhTien - tienChietKhau) * (tyLePhanTramDoanhThu / 100)) * 20 / 100, this.ddtp.getDonGiaNgoaiTe());
                    tienGiamQuyDoi = mathRound(tienGiam * tyGia, this.ddtp.getTienQuyDoi());
                }
                break;
            default:
                break;
        }

        // Tính thành tiền sau thuế theo số lượng và đơn giá sau thuế
        if (this.tinhTienTheoSLvaDGSauThue && (position === BlurPosition.DON_GIA_SAU_THUE || position === BlurPosition.TI_LE_CK || position === BlurPosition.TIEN_CK)) {
            thanhTienSauThue = mathRound((soLuong * donGiaSauThue) - (tienChietKhau * (1 + thueGTGT / 100)), this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
        }

        // Tính thành tiền sau thuế theo số lượng và đơn giá sau thuế + chagen thanh tien
        if (isEventFromUI && this.tinhTienTheoDGSauThue && position === BlurPosition.THANH_TIEN) {
            tienThueGTGT = mathRound((thanhTien - tienChietKhau) * thueGTGT / 100, this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());

            if (!this.isVND) {
                tienThueGTGTQuyDoi = mathRound(tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
            }
        }

        // Tính số lượng theo đơn giá và thành tiền sau thuế + số lượng
        if (this.tinhSLTheoDGvaTienSauThue && (position === BlurPosition.DON_GIA_SAU_THUE || position === BlurPosition.THANH_TIEN_SAU_THUE)) {
            // (trường hợp nếu cả donGiaSauThue và thanhTienSauThue === 0) và (thay đổi đơn giá sau thuế và change vật tư) thì không tính lại 
            if (!(thanhTienSauThue === 0 && donGiaSauThue === 0) && !(!isEventFromUI && position === BlurPosition.DON_GIA_SAU_THUE && item.isChangeVatTu)) {
                soLuong = mathRound(thanhTienSauThue / donGiaSauThue, this.ddtp.getSoLuong());
            }
        }

        // Tính số lượng theo đơn giá và thành tiền sau thuế + đơn giá
        if (isEventFromUI && this.tinhSLTheoDGvaTienSauThue && (position === BlurPosition.DON_GIA_SAU_THUE || position === BlurPosition.TI_LE_CK || position === BlurPosition.TIEN_CK || position === BlurPosition.THUE_GTGT)) {
            // trường hợp nếu cả donGiaSauThue và thanhTienSauThue === 0 thì không tính lại đơn giá
            if (!(thanhTienSauThue === 0 && donGiaSauThue === 0)) {
                donGia = mathRound((donGiaSauThue / (1 + thueGTGT / 100)) / (1 - tyLeChietKhau / 100), this.isVND ? this.ddtp.getDonGiaQuyDoi() : this.ddtp.getDonGiaNgoaiTe());
            } else {
                thanhTien = mathRound(soLuong * donGia, this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
                if (!this.isVND) {
                    thanhTienQuyDoi = mathRound(thanhTien * tyGia, this.ddtp.getTienQuyDoi());
                }
            }
        }

        // Tính số lượng theo đơn giá và thành tiền sau thuế + thành tiền
        if (isEventFromUI && this.tinhSLTheoDGvaTienSauThue && (position === BlurPosition.THANH_TIEN_SAU_THUE || position === BlurPosition.TI_LE_CK || position === BlurPosition.THUE_GTGT)) {
            thanhTien = mathRound((thanhTienSauThue / (1 + thueGTGT / 100)) / (1 - tyLeChietKhau / 100), this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
            if (position === BlurPosition.THANH_TIEN_SAU_THUE || position === BlurPosition.TI_LE_CK) {
                if (this.isVND) {
                    tienChietKhau = mathRound(tyLeChietKhau * thanhTien / 100, this.ddtp.getTienQuyDoi());
                } else {
                    tienChietKhau = mathRound(tyLeChietKhau * thanhTien / 100, this.ddtp.getTienNgoaiTe());
                    tienChietKhauQuyDoi = mathRound(tienChietKhau * tyGia, this.ddtp.getTienQuyDoi());
                }
            }
        }

        if (this.tinhSLTheoDGvaTienSauThue && position === BlurPosition.THUE_GTGT) {
            // trường hợp nếu cả donGiaSauThue và thanhTienSauThue === 0 thì không tính lại đơn giá
            if (!(thanhTienSauThue === 0 && donGiaSauThue === 0)) {
                tienThueGTGT = mathRound((thanhTienSauThue / (1 + thueGTGT / 100)) * thueGTGT / 100, this.isVND ? this.ddtp.getTienQuyDoi() : this.ddtp.getTienNgoaiTe());
                if (!this.isVND) {
                    tienThueGTGTQuyDoi = mathRound(tienThueGTGT * tyGia, this.ddtp.getTienQuyDoi());
                }
            }
        }

        if (this.isVND) { // nếu là vnd -> set tiền quy đổi = tiền (sau này sum báo cáo cho dễ)
            tienChietKhauQuyDoi = tienChietKhau;
            tienThueGTGTQuyDoi = tienThueGTGT;
            thanhTienQuyDoi = thanhTien;
            tienGiamQuyDoi = tienGiam;
        }

        if (tinhChat === 4) { // chỉ là diễn giải
            soLuong = 0;
            donGia = 0;
            donGiaSauThue = 0;
            thanhTien = 0;
            thanhTienSauThue = 0;
            thanhTien = 0;
            thanhTienQuyDoi = 0;
            tyLeChietKhau = 0;
            tienChietKhau = 0;
            tienChietKhauQuyDoi = 0;
            tienThueGTGT = 0;
            tienThueGTGTQuyDoi = 0;
            tienGiam = 0;
            tienGiamQuyDoi = 0;
        } else if (tinhChat === 3) { // chiết khấu thương mại
            tyLeChietKhau = 0;
            tienChietKhau = 0;
            tienChietKhauQuyDoi = 0;
        }

        if (loaiHoaDon === 2 || loaiHoaDon === 7 || loaiHoaDon === 8) {
            tienThueGTGT = 0;
            tienThueGTGTQuyDoi = 0;
        }

        // set value
        if (position !== BlurPosition.NONE) {
            item.soLuong = soLuong;
            item.donGia = donGia;
            item.donGiaSauThue = donGiaSauThue;            

            item.thanhTienSauThue = thanhTienSauThue;
            item.thanhTien = thanhTien;
            item.thanhTienQuyDoi = thanhTienQuyDoi;

            item.tyLeChietKhau = tyLeChietKhau;
            item.tienChietKhau = tienChietKhau;
            item.tienChietKhauQuyDoi = tienChietKhauQuyDoi;

            item.tienThueGTGT = tienThueGTGT;
            item.tienThueGTGTQuyDoi = tienThueGTGTQuyDoi;

            item.tienGiam = tienGiam;
            item.tienGiamQuyDoi = tienGiamQuyDoi;

            item.tongTienThanhToan = thanhTien - tienChietKhau + tienThueGTGT - tienGiam;
            item.tongTienThanhToanQuyDoi = thanhTienQuyDoi - tienChietKhauQuyDoi + tienThueGTGTQuyDoi - tienGiamQuyDoi;
        }

        // change soluong, dongia, thanhtien => tinh lai chiet khau
        if ((position === BlurPosition.SO_LUONG || position === BlurPosition.DON_GIA || position === BlurPosition.DON_GIA_SAU_THUE || position === BlurPosition.THANH_TIEN || position === BlurPosition.THANH_TIEN_QUY_DOI)) {
            if (this.tinhTienTheoDGSauThue && (position === BlurPosition.THANH_TIEN || (position === BlurPosition.DON_GIA_SAU_THUE && prePosition === BlurPosition.TIEN_CK))) {
                // nothing
            } else {
                if (this.tinhSLTheoDGvaTienSauThue && (position === BlurPosition.SO_LUONG || position === BlurPosition.DON_GIA || position === BlurPosition.DON_GIA_SAU_THUE || position === BlurPosition.THANH_TIEN)) {
                    isEventFromUI = false;
                } else {
                    if (position === BlurPosition.DON_GIA || position === BlurPosition.THANH_TIEN) {
                        isEventFromUI = false;
                    }
                }

                item.tyLeChietKhauDirty = true;
                this.blurTinhToan(index, BlurPosition.TI_LE_CK, isEventFromUI, position, false);
            }
        }

        // change chiet khau => tinh lai thue GTGT
        if (position === BlurPosition.TI_LE_CK || position === BlurPosition.TIEN_CK || position === BlurPosition.TIEN_CK_QUY_DOI) {
            if (isGiamTheoNghiQuyet) {
                item.tyLePhanTramDoanhThuDirty = true;
                this.blurTinhToan(index, BlurPosition.TY_LE_PHAN_TRAM_DOANH_THU, isEventFromUI, null, false);
            }

            if (loaiHoaDon !== 2 && !(this.tinhSLTheoDGvaTienSauThue && position === BlurPosition.TI_LE_CK && (prePosition === BlurPosition.DON_GIA || prePosition === BlurPosition.THANH_TIEN))) {
                if (this.tinhSLTheoDGvaTienSauThue && position === BlurPosition.TIEN_CK) {
                    // nothing                        
                } else {
                    if (position === BlurPosition.TIEN_CK && isEventFromUI) {
                        isEventFromUI = false;
                    }

                    item.thueGTGTDirty = true;
                    this.blurTinhToan(index, BlurPosition.THUE_GTGT, isEventFromUI, position, false);
                }
            }
        }

        // Nếu chỉ tích phatSinhBanHangTheoDGSauThue hoặc chọn tinhTienTheoDGSauThue hoặc tinhTienTheoSLvaDGSauThue
        if (((this.phatSinhBanHangTheoDGSauThue && !this.tinhTienTheoDGSauThue && !this.tinhTienTheoSLvaDGSauThue && !this.tinhSLTheoDGvaTienSauThue) ||
            this.tinhTienTheoDGSauThue || this.tinhTienTheoSLvaDGSauThue) &&
            position === BlurPosition.THUE_GTGT && isEventFromUI) {
            item.donGiaSauThueDirty = true;
            this.blurTinhToan(index, BlurPosition.DON_GIA_SAU_THUE, false, prePosition, false);
        }

        if (this.tinhSLTheoDGvaTienSauThue && (position === BlurPosition.THANH_TIEN_SAU_THUE || position === BlurPosition.THANH_TIEN) && isEventFromUI) {
            item.tyLeChietKhauDirty = true;
            this.blurTinhToan(index, BlurPosition.TI_LE_CK, false, null, false);
        }

        tinhToanTongTien(this.form, this.details, position, this.ddtp, this.isVND, isTinhTong);

        isEventFromUI = true;
    }
}

export function tinhToanTongTien(form: FormGroup, details: any[], position: BlurPosition, ddtp: DinhDangThapPhan, isVND: boolean, isTinhTong = true) {
    let loaiChietKhau = form.get(`loaiChietKhau`).value || 0;
    const loaiHoaDon = form.get('loaiHoaDon').value;
    const loaiDieuChinh = form.get('loaiDieuChinh').value;

    // tinh tong
    let tongTienHang = 0;
    let tongTienHangQuyDoi = 0;
    let tongTienChietKhau = 0;
    let tongTienChietKhauQuyDoi = 0;
    let tongTienThueGTGT = 0;
    let tongTienThueGTGTQuyDoi = 0;
    let tongTienGiam = 0;
    let tongTienGiamQuyDoi = 0;
    let tongTienThanhToan = 0;
    let tongTienThanhToanQuyDoi = 0;

    var hasHHDV = details.some(x => x.tinhChat === 1);
    let firstIdxOfHHDV = null;

    if(loaiDieuChinh != 3){
        for (let i = 0; i < details.length; i++) {
            const item = details[i];

            let thanhTien = item.thanhTien;
            let thanhTienQuyDoi = item.thanhTienQuyDoi;
            let tienThueGTGT = item.tienThueGTGT;
            let tienThueGTGTQuyDoi = item.tienThueGTGTQuyDoi;

            if (item.tinhChat === 2) {
                continue;
            } else if (item.tinhChat === 3) {
                if (hasHHDV) {
                    thanhTien = -thanhTien;
                    thanhTienQuyDoi = -thanhTienQuyDoi;
                    tienThueGTGT = -tienThueGTGT;
                    tienThueGTGTQuyDoi = -tienThueGTGTQuyDoi;
                }
            }

            if (item.tinhChat === 1 && firstIdxOfHHDV == null) {
                firstIdxOfHHDV = i;
            }

            tongTienHang += thanhTien;
            tongTienHangQuyDoi += thanhTienQuyDoi;
            tongTienChietKhau += item.tienChietKhau;
            tongTienChietKhauQuyDoi += item.tienChietKhauQuyDoi;
            tongTienGiam += item.tienGiam;
            tongTienGiamQuyDoi += item.tienGiamQuyDoi;

            if (loaiChietKhau === 2) {
                if (i !== firstIdxOfHHDV && position !== BlurPosition.TIEN_THUE_GTGT && position !== BlurPosition.TIEN_THUE_GTGT_QUY_DOI) {
                    details[i].disableThueGTGT = true;
                    details[i].tienThueGTGT = 0;
                    details[i].tienThueGTGTQuyDoi = 0;
                } else {
                    tongTienThueGTGT += tienThueGTGT;
                    tongTienThueGTGTQuyDoi += tienThueGTGTQuyDoi;
                }
            } else {
                tongTienThueGTGT += tienThueGTGT;
                tongTienThueGTGTQuyDoi += tienThueGTGTQuyDoi;
            }
        }

        // nếu loại chiết khấu là tổng giá trị hóa đơn thì set tiền thuế cho hàng hóa dịch vụ đầu tiền
        if (firstIdxOfHHDV !== -1 && loaiChietKhau === 2 && position !== BlurPosition.TIEN_THUE_GTGT && position !== BlurPosition.TIEN_THUE_GTGT_QUY_DOI) {
            let thueGTGT = details[firstIdxOfHHDV].thueGTGT || 0;
            let thueKhac = details[firstIdxOfHHDV].thueKhac || 0;

            if (thueGTGT === 'KCT' || thueGTGT === 'KKKNT') {
                thueGTGT = 0;
            } else if (thueGTGT === 'KHAC') {
                thueGTGT = thueKhac;
            } else {
                thueGTGT *= 1;
            }

            const tienThueGTGT = mathRound((tongTienHang - tongTienChietKhau) * thueGTGT / 100, isVND ? ddtp.getTienQuyDoi() : ddtp.getTienNgoaiTe());
            const tienThueGTGTQuyDoi = mathRound((tongTienHangQuyDoi - tongTienChietKhauQuyDoi) * thueGTGT / 100, ddtp.getTienQuyDoi());

            details[firstIdxOfHHDV].disableThueGTGT = false;
            details[firstIdxOfHHDV].tienThueGTGT = tienThueGTGT;
            details[firstIdxOfHHDV].tienThueGTGTQuyDoi = tienThueGTGTQuyDoi;

            tongTienThueGTGT = tienThueGTGT;
            tongTienThueGTGTQuyDoi = tienThueGTGTQuyDoi;
        }

        if (loaiHoaDon === 2) {
            tongTienThueGTGT = 0;
            tongTienThueGTGTQuyDoi = 0;
        }

        tongTienThanhToan = tongTienHang - tongTienChietKhau + tongTienThueGTGT - tongTienGiam;
        tongTienThanhToanQuyDoi = tongTienHangQuyDoi - tongTienChietKhauQuyDoi + tongTienThueGTGTQuyDoi - tongTienGiamQuyDoi;
    }
    if (isTinhTong) {
        // nếu loại chiết khấu theo mặt hàng hoặc tổng giá trị hóa đơn thì tính lại tỷ lệ ck tổng
        if (loaiChietKhau === 1 || (loaiChietKhau === 2 && position === BlurPosition.TIEN_CK)) {
            const tongTienHHDV = details.filter(x => x.tinhChat === 1).reduce((a, b) => a + b.thanhTien, 0);
            form.get('tyLeChietKhau').setValue(tongTienHHDV === 0 ? 0 : mathRound(tongTienChietKhau * 100 / tongTienHHDV, ddtp.getHeSoTyLe()));
        }

        form.get('tongTienHang').setValue(tongTienHang);
        form.get('tongTienHangQuyDoi').setValue(tongTienHangQuyDoi);
        form.get('tongTienChietKhau').setValue(tongTienChietKhau);
        form.get('tongTienChietKhauQuyDoi').setValue(tongTienChietKhauQuyDoi);
        form.get('tongTienThueGTGT').setValue(tongTienThueGTGT);
        form.get('tongTienThueGTGTQuyDoi').setValue(tongTienThueGTGTQuyDoi);
        form.get('tongTienGiam').setValue(tongTienGiam);
        form.get('tongTienGiamQuyDoi').setValue(tongTienGiamQuyDoi);
        form.get('tongTienThanhToan').setValue(tongTienThanhToan);
        form.get('tongTienThanhToanQuyDoi').setValue(tongTienThanhToanQuyDoi);
    }
}