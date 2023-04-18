import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class ThongBaoDieuChinhThongTinHoaDonService {
  public apiURL = this.env.apiUrl + '/api/ThongBaoDieuChinhThongTinHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetBangKeHoaDonChuaSuDung(id: string) {
    return this.http.get(`${this.apiURL}/GetBangKeHoaDonChuaSuDung?id=` + id, getHeader());
  }

  GetTrangThaiHieuLucs() {
    return this.http.get(`${this.apiURL}/GetTrangThaiHieuLucs`, getHeader());
  }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  GetThongBaoDieuChinhThongTinChiTietById(id: string) {
    return this.http.get(`${this.apiURL}/GetThongBaoDieuChinhThongTinChiTietById/` + id, getHeader());
  }

  CheckTrungMa(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungMa`, data, getHeader());
  }

  CheckTrungMaAsync(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungMa`, data, getHeader()).toPromise();
  }

  Delete(id: string) {
    return this.http.delete(`${this.apiURL}/Delete/` + id, getHeader());
  }

  Insert(data: any) {
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }

  Update(data: any) {
    return this.http.put(`${this.apiURL}/Update`, data, getHeader());
  }

  ExportFile(id: string, dinhDangTepMau: any, loai: any) {
    return this.http.get(`${this.apiURL}/ExportFile/${id}/${dinhDangTepMau}/${loai}`, { ...getHeader(), responseType: 'blob' });
  }

  TienLuiChungTu(id: string) {
    const params = { chungTuId: id };
    return this.http.post(`${this.apiURL}/TienLuiChungTu`, params, getHeader());
  }
}
