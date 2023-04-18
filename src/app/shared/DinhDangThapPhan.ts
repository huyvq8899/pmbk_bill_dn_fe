import { CookieConstant } from "../constants/constant";

export class DinhDangThapPhan {
    tienQuyDoi = 1;
    tienNgoaiTe = 2;
    donGiaQuyDoi = 3;
    donGiaNgoaiTe = 4;
    soLuong = 5;
    tyGia = 6;
    heSoTyLe = 7;
    tyLePhanBo = 8;
    soCong = 9;
    maxIntegerHeSoTyLe = 2;
    maxIntegerTyGia = 5;
    tuyChonHoaDon = [];

    constructor (tuyChonHoaDon?: any[]) { 
        this.tuyChonHoaDon = tuyChonHoaDon;
    }
    getTienQuyDoi() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanTienQuyDoi');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanTienQuyDoi')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanTienQuyDoi');
        }

        if (result) {
            return +result.giaTri;
        } else {
            return 0;
        }
    }

    getTienNgoaiTe() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanTienNgoaiTe');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanTienNgoaiTe')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanTienNgoaiTe');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 2;
        }
    }

    getDonGiaQuyDoi() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanDonGiaQuyDoi');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanDonGiaQuyDoi')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanDonGiaQuyDoi');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 0;
        }
    }

    getDonGiaNgoaiTe() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanDonGiaNgoaiTe');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanDonGiaNgoaiTe')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanDonGiaNgoaiTe');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 2;
        }
    }

    getSoLuong() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanSoLuong');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanSoLuong')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanSoLuong');
        }

        if (result) {
            return +result.giaTri;
        } else {
            return 2;
        }
    }

    getTyGia() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanTyGia');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanTyGia')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanTyGia');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 2;
        }
    }

    getHeSoTyLe() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanHeSoTyLe');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanHeSoTyLe')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanHeSoTyLe');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 2;
        }
    }

    getTyLePhanBo() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanTyLePhanBo');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanTyLePhanBo')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanTyLePhanBo');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 10;
        }
    }

    getSoCong() {
        let result = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IntDinhDangSoThapPhanSoCong');
        
        if (this.tuyChonHoaDon && this.tuyChonHoaDon.some(x => x.ma === 'IntDinhDangSoThapPhanSoCong')) {
            result = this.tuyChonHoaDon.find(x => x.ma === 'IntDinhDangSoThapPhanSoCong');
        }
        if (result) {
            return +result.giaTri;
        } else {
            return 0;
        }
    }
}
