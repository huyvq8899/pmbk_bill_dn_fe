import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';
import { NhatKyTruyCap } from 'src/app/models/nhat-ky-truy-cap';
import { CookieConstant } from 'src/app/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class NhatKyTruyCapService {
  public apiURL = this.env.apiUrl + '/api/NhatKyTruyCap';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  Delete(id: string) {
    return this.http.delete(`${this.apiURL}/Delete/` + id, getHeader());
  }

  Insert(data: NhatKyTruyCap) {
    data.diaChiIP = localStorage.getItem(CookieConstant.IPADDRESS) || null;
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }

  InsertAsync(data: NhatKyTruyCap) {
    data.diaChiIP = localStorage.getItem(CookieConstant.IPADDRESS) || null;
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader()).toPromise();
  }

  ExportExcel(data: any) {
    return this.http.post(`${this.apiURL}/ExportExcel`, data, { ...getHeader(), responseType: 'blob' });
  }

  GetByRefId(id: string) {
    return this.http.get(`${this.apiURL}/GetByRefId/` + id, getHeader());
  }
}
