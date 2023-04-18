import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class DonViTinhService {
  public apiURL = this.env.apiUrl + '/api/DonViTinh';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAll(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAll`, params, getHeader());
  }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  CheckTrungMa(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungMa`, data, getHeader());
  }

  CheckTrungMaAsync(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungMa`, data, getHeader()).toPromise();
  }

  CheckPhatSinh(id: string) {
    return this.http.get(`${this.apiURL}/CheckPhatSinh/` + id, getHeader());
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

  ExportExcel(data: any) {
    return this.http.post(`${this.apiURL}/ExportExcel`, data, { ...getHeader(), responseType: 'blob' });
  }
}
