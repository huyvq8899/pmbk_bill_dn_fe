import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class BienBanDieuChinhService {
  public apiURL = this.env.apiUrl + '/api/BienBanDieuChinh';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader())
    .pipe(
      map((res: any) => {
        if (res) {
          res.hoaDonBiDieuChinh.soHoaDon = res.hoaDonBiDieuChinh.soHoaDon || res.hoaDonBiDieuChinh.strSoHoaDon;
        }
        return res;
      })
    );
  }

  GetById_NM(id: string) {
    return this.http.get(`${this.apiURL}/GetById_NM/` + id)
    .pipe(
      map((res: any) => {
        if (res) {
          res.hoaDonBiDieuChinh.soHoaDon = res.hoaDonBiDieuChinh.soHoaDon || res.hoaDonBiDieuChinh.strSoHoaDon;
        }
        return res;
      })
    );
  }

  PreviewBienBan(id: string) {
    return this.http.get(`${this.apiURL}/PreviewBienBan/` + id, getHeader());
  }

  PreviewBienBan_NM(id: string) {
    return this.http.get(`${this.apiURL}/PreviewBienBan_NM/` + id);
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

  GateForWebSocket(data: any) {
    return this.http.post(`${this.apiURL}/GateForWebSocket`, data, getHeader())
  }

  GateForWebSocket_NM(data: any) {
    return this.http.post(`${this.apiURL}/GateForWebSocket_NM`, data)
  }
}
