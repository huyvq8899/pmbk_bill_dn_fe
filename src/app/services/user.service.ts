import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PagingParams } from '../models/PagingParams';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiURL = this.env.apiUrl + '/api/';

    constructor(private http: HttpClient,
        private env: EnvService) { }

  public getHeader() {
    return {
      // tslint:disable-next-line:object-literal-key-quotes
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('tokenKey')}` })
    };
  }
  getAll(params: any) {
    return this.http.post(`${this.apiURL}User/GetAll`, params, this.getHeader());
  }
  GetListManagersById(id: string) {
    return this.http.get(`${this.apiURL}User/GetListManagersById/` + id, this.getHeader());
  }
  GetById(id: string) {
    return this.http.get(`${this.apiURL}User/GetById/` + id, this.getHeader());
  }
  GetByUserName(userName: string) {
    return this.http.get(`${this.apiURL}User/GetByUserName/` + userName, this.getHeader());
  }
  GetDataLogin(userName: string) {
    return this.http.get(`${this.apiURL}User/GetDataLogin/` + userName, this.getHeader());
  }
  // GetRoleByUserId(data: PagingParams, userId: string) {
  //   // return this.http.get(`${this.apiURL}Role/GetRoleByUserId/` + userId, this.getHeader());
  //   const str = `${this.apiURL}Role/GetAllPagingByUserId?SortValue=` + data.SortValue
  //     + `&SortKey=` + data.SortKey
  //     + `&PageSize=` + data.PageSize
  //     + `&PageNumber=` + data.PageNumber
  //     + `&Keyword=` + data.Keyword
  //     + `&fromDate=` + data.fromDate
  //     + `&toDate=` + data.toDate
  //     + `&userId=` + userId;
  //   
  //   // tslint:disable-next-line: align
  //   return this.http.get(str, this.getHeader());
  // }
  checkUserName(userName: string) {
    return this.http.get(`${this.apiURL}User/CheckUserName/` + userName, this.getHeader());
  }
  checkMail(mail: string) {
    return this.http.get(`${this.apiURL}User/CheckEmail/` + mail, this.getHeader());
  }
  GetPermissionByUserName(userName: any) {
    return this.http.post(`${this.apiURL}User/GetPermissionByUserName`, userName, this.getHeader());
  }
  PhanQuyenUser(data: any) {
    return this.http.post(`${this.apiURL}User/PhanQuyenUser`, data, this.getHeader());
  }
  GetAllByUserId(userId: string) {
    return this.http.get(`${this.apiURL}UserRole/GetAllByUserId/` + userId, this.getHeader());
  }
  Delete(id: string) {
    return this.http.delete(`${this.apiURL}User?Id=` + id, this.getHeader());
  }
  Insert(data: any) {
    return this.http.post(`${this.apiURL}User`, data, this.getHeader());
  }
  Update(data: any) {
    
    return this.http.put(`${this.apiURL}User`, data, this.getHeader());
  }
  UpdateAvatar(data: any) {
    return this.http.post(`${this.apiURL}User/UpdateAvatar`, data, this.getHeader());
  }
  UpdatePassWord(data: any) {
    
    return this.http.put(`${this.apiURL}User/UpdatePassWord`, data, this.getHeader());
  }
  changeStatus(userId: string) {
    
    return this.http.get(`${this.apiURL}User/ChangeStatus/` + userId, this.getHeader());
  }
  getUserOnline(){
    return this.http.get(`${this.apiURL}User/GetUserOnline`, this.getHeader());
  }
  getAdminUser(){
    return this.http.get(`${this.apiURL}User/GetAdminUser`, this.getHeader());
  }
  SetOnline(userId: string, isOnline: boolean) {
    
    return this.http.get(`${this.apiURL}User/SetOnline/` + userId + '/' + isOnline, this.getHeader());
  }
  SetManager(data: any) {
    return this.http.post(`${this.apiURL}User/SetManager`, data, this.getHeader());
  }
  SetRole(data: any) {
    return this.http.post(`${this.apiURL}User/SetRole`, data, this.getHeader());
  }
  delteAll(userIds: any) {
    return this.http.post(`${this.apiURL}User/DeleteAll`, userIds, this.getHeader());
  }
  search(data: PagingParams) {
    
    const str = `${this.apiURL}User/GetAllPaging?SortValue=` + data.SortValue
      + `&SortKey=` + data.SortKey
      + `&PageSize=` + data.PageSize
      + `&PageNumber=` + data.PageNumber
      + `&Keyword=` + data.Keyword
      + `&fromDate=` + data.fromDate
      + `&toDate=` + data.toDate;
    
    return this.http.get(str, this.getHeader());
  }
  CheckTrungTenDangNhap(data: any) {
    return this.http.post(`${this.apiURL}User/CheckTrungTenDangNhap`, data, this.getHeader());
  }

  GetThongTinGanNhat(){
    return this.http.get(`${this.apiURL}User/GetThongTinGanNhat`, this.getHeader());
  }
}
