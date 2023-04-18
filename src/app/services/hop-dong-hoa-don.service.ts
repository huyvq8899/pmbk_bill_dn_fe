import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env.service';



@Injectable({
  providedIn: 'root'
})
export class HopDongHoaDonService {
  baseUrl = this.env.apiUrl + '/api/HopDongHoaDon/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }
  public getHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('tokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
      })
    };
  }
  InsertList(data: any) {
    return this.http.post(`${this.baseUrl}Insert`, data, this.getHeader());
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + id);
  }

  getHopDongByTaxcode(taxcode: any) {
    return this.http.get(`${this.baseUrl}GetHopDongByTaxcode/` + taxcode, this.getHeader());
  }
  getListHopDongQlkhByTaxcode(taxcode: any) {
    return this.http.get(`${this.env.apiUrlQlkh}/api/HopDongHoaDon/GetAllByTaxCodeAsync/` + taxcode);
  }

}
