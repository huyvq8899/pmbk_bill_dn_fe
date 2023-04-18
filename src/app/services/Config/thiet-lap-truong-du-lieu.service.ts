import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { LoaiTruongDuLieu } from 'src/app/enums/LoaiTruongDuLieu.enum';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';

@Injectable({
    providedIn: 'root'
})
export class ThietLapTruongDuLieuService {
    public apiURL = this.env.apiUrl + '/api/ThietLapTruongDuLieu';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    GetListTruongDuLieuByLoaiTruong(loaiTruong: LoaiTruongDuLieu, loaiHoaDon: LoaiHoaDon) {
        return this.http.get(`${this.apiURL}/GetListTruongDuLieuByLoaiTruong/${loaiTruong}/${loaiHoaDon}`, getHeader());
    }

    GetListThietLapMacDinh(loaiTruong: LoaiTruongDuLieu, loaiHoaDon: LoaiHoaDon) {
        return this.http.get(`${this.apiURL}/GetListThietLapMacDinh/${loaiTruong}/${loaiHoaDon}`, getHeader());
    }

    CheckDaPhatSinhThongBaoPhatHanh(data: any[]) {
        return this.http.post(`${this.apiURL}/CheckDaPhatSinhThongBaoPhatHanh`, data, getHeader());
    }

    UpdateRange(data: any[]) {
        return this.http.put(`${this.apiURL}/UpdateRange`, data, getHeader());
    }

    Update(data: any) {
        return this.http.put(`${this.apiURL}/Update`, data, getHeader());
    }

    UpdateHienThiTruongBanHangTheoDonGiaSauThues(data: any) {
        return this.http.put(`${this.apiURL}/UpdateHienThiTruongBanHangTheoDonGiaSauThues`, data, getHeader());
    }
}
