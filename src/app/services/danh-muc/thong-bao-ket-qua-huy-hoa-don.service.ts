import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ThongBaoKetQuaHuyHoaDonService {
  public apiURL = this.env.apiUrl + '/api/ThongBaoKetQuaHuyHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  CheckAllowDeleteWhenChuaNop(id: string) {
    return this.http.get(`${this.apiURL}/CheckAllowDeleteWhenChuaNop/` + id, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  GetThongBaoKetQuaHuyChiTietById(id: string) {
    return this.http.get(`${this.apiURL}/GetThongBaoKetQuaHuyChiTietById/` + id, getHeader());
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
    data.ngayGioHuy = `${data.ngay} ${moment(data.gio).format('HH:mm:ss')}`;
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }

  Update(data: any) {
    data.ngayGioHuy = `${data.ngay} ${moment(data.gio).format('HH:mm:ss')}`;
    return this.http.put(`${this.apiURL}/Update`, data, getHeader());
  }

  ExportFile(id: string, dinhDangTepMau: any) {
    return this.http.get(`${this.apiURL}/ExportFile/${id}/${dinhDangTepMau}`, { ...getHeader(), responseType: 'blob' });
  }

  TienLuiChungTu(id: string) {
    const params = { chungTuId: id };
    return this.http.post(`${this.apiURL}/TienLuiChungTu`, params, getHeader());
  }
}
