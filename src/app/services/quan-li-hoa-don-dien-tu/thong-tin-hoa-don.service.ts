import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class ThongTinHoaDonService {
  public apiURL = this.env.apiUrl + '/api/ThongTinHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  Insert(data: any) {
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }

  Update(data: any) {
    return this.http.put(`${this.apiURL}/Update`, data, getHeader());
  }

  CheckTrungThongTin(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungThongTin`, data, getHeader());
  }

  CheckTrungThongTinThayThe(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungThongTinThayThe`, data, getHeader());
  }

  CheckTrungThongTinDieuChinh(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungThongTinDieuChinh`, data, getHeader());
  }

  CheckTrungHoaDonHeThong(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungHoaDonHeThong`, data, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/${id}`, getHeader())
      .pipe(
        map((res: any) => {
          if (res) {
            res.soHoaDon = res.soHoaDon || res.strSoHoaDon;
          }
          return res;
        })
      );
  }

  CheckHoaDonNgoaiHeThongDaLapBienBanHuyHoaDon(id: any) {
    return this.http.get(`${this.apiURL}/CheckHoaDonNgoaiHeThongDaLapBienBanHuyHoaDon/${id}`, getHeader());
  }
}
