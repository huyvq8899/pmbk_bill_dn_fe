import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class QuanLyThongTinHoaDonService {
  public apiURL = this.env.apiUrl + '/api/QuanLyThongTinHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetListByLoaiThongTin(loaiThongTin: any = '') {
    return this.http.get(`${this.apiURL}/GetListByLoaiThongTin?loaiThongTin=` + loaiThongTin, getHeader());
  }

  GetListByLoaiThongTinAsync(loaiThongTin: any = '') : Promise<any> {
    return this.http.get(`${this.apiURL}/GetListByLoaiThongTin?loaiThongTin=` + loaiThongTin, getHeader()).toPromise<any>();
  }

  GetLoaiHoaDonDangSuDung() {
    return this.http.get(`${this.apiURL}/GetLoaiHoaDonDangSuDung`, getHeader());
  }

  GetHinhThucHoaDonDangSuDung() {
    return this.http.get(`${this.apiURL}/GetHinhThucHoaDonDangSuDung`, getHeader());
  }

  GetListByHinhThucVaLoaiHoaDon(hinhThucHoaDon: any, loaiHoaDon: any) {
    return this.http.get(`${this.apiURL}/GetListByHinhThucVaLoaiHoaDon/${hinhThucHoaDon}/${loaiHoaDon}`, getHeader());
  }

  GetByLoaiThongTinChiTiet(loaiThongTinChiTiet: any) {
    return this.http.get(`${this.apiURL}/GetByLoaiThongTinChiTiet/${loaiThongTinChiTiet}`, getHeader());
  }

  GetHistorySinhSoHoaDonCMMTTien(year: number) {
    return this.http.get(`${this.apiURL}/GetHistorySinhSoHoaDonCMMTTien/${year}`, getHeader());
  }

  UpdateSoBatDauSinhSoHoaDonCMMTTien(year: number) {
    return this.http.get(`${this.apiURL}/UpdateSoBatDauSinhSoHoaDonCMMTTien/${year}`, getHeader());
  }

  UpdateSoDaSinhMoiNhatHoaDonCMMTTien(year: number) {
    return this.http.get(`${this.apiURL}/UpdateSoDaSinhMoiNhatHoaDonCMMTTien/${year}`, getHeader());
  }

  UpdateSoDaSinhMoiNhatHoaDonCMMTTienByNSD(year: number) {
    return this.http.get(`${this.apiURL}/UpdateSoDaSinhMoiNhatHoaDonCMMTTienByNSD/${year}`, getHeader());
  }

  GetHistorySinhSoHoaDonCMMTTienInNhatKyTruyCap(id: string) {
    return this.http.get(`${this.apiURL}/GetHistorySinhSoHoaDonCMMTTienInNhatKyTruyCap/${id}`, getHeader());
  }

  GetSoCuoiMaxMaCQTCapMTTAsync(year: number){
    return this.http.get(`${this.apiURL}/GetSoCuoiMaxMaCQTCapMTTAsync?year=${year}`, getHeader());
  }
}
