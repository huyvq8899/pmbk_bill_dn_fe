import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class NhatKyGuiEmailService {
  public apiURL = this.env.apiUrl + '/api/NhatKyGuiEmail';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  Delete(id: string) {
    return this.http.delete(`${this.apiURL}/Delete/` + id, getHeader());
  }

  ExportExcel(data: any) {
    return this.http.post(`${this.apiURL}/ExportExcel`, data, { ...getHeader(), responseType: 'blob' });
  }

  KiemTraDaGuiEmailChoKhachHang(id: string) {
    return this.http.get(`${this.apiURL}/KiemTraDaGuiEmailChoKhachHang/` + id, getHeader());
  }
  KiemTraDaGuiTBSSKhongLapHd(id: string) {
    return this.http.get(`${this.apiURL}/KiemTraDaGuiTBSSKhongLapHd/` + id, getHeader());
  }

  GetThongTinEmailDaGuiChoKHGanNhat(refId: any) {
    return this.http.get(`${this.apiURL}/GetThongTinEmailDaGuiChoKHGanNhat/${refId}`, getHeader());
  }
}
