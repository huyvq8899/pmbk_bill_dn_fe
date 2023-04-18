import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PagingParams } from '../models/PagingParams';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public apiURL = this.env.apiUrl + '/api/';

    constructor(private http: HttpClient,
        private env: EnvService) { }

  public getHeader() {
    return {
       // tslint:disable-next-line:object-literal-key-quotes
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('tokenKey')}` })
    };
  }

  GetAll() {
    return this.http.get(`${this.apiURL}Role/GetAllRole`, this.getHeader());
  }

  Insert(data: any) {
    return this.http.post(`${this.apiURL}Role/Insert`, data, this.getHeader());
  }

  Update(data: any) {
    return this.http.put(`${this.apiURL}Role/Update`, data, this.getHeader());
  }

  InsertMultiFunctionRole(data: any) {
    return this.http.post(`${this.apiURL}FunctionRole/InsertMultiFunctionRole`, data, this.getHeader());
  }

  Delete(Id: string) {
    return this.http.delete(`${this.apiURL}Role/Delete/` + Id, this.getHeader());
  }

  GetReports(param: PagingParams) {
    const str = `${this.apiURL}Role/GetReports?SortValue=` + param.SortValue
      + `&SortKey=` + param.SortKey
      + `&PageSize=` + param.PageSize
      + `&PageNumber=` + param.PageNumber
      + `&Keyword=` + param.Keyword
      + `&fromDate=` + param.fromDate
      + `&toDate=` + param.toDate
      + `&userId=` + param.userId;
    return this.http.get(str, this.getHeader());
  }
  CheckTrungMaWithObjectInput(data: any) {
    return this.http.post(`${this.apiURL}Role/CheckTrungMaWithObjectInput`, data, this.getHeader());
  }
  CheckPhatSinh(roleId: string){
    return this.http.get(`${this.apiURL}Role/CheckPhatSinh/${roleId}`, this.getHeader());
  }
  GetListHoaDonDaPhanQuyen(roleId: string){
    return this.http.get(`${this.apiURL}Role/GetListHoaDonDaPhanQuyen/${roleId}`, this.getHeader());
  }
  PhanQuyenMauHoaDon(data: any){
    return this.http.post(`${this.apiURL}Role/PhanQuyenMauHoaDon`, data, this.getHeader());
  }
}
