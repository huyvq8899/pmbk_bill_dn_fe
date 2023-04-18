import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';

@Injectable({
  providedIn: 'root'
})
export class DoiTuongService {
  public apiURL = this.env.apiUrl + '/api/DoiTuong';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAll(params: DoiTuongParams) {
    return this.http.post(`${this.apiURL}/GetAll`, params, getHeader());
  }

  GetAllPaging(params: DoiTuongParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  } 
  GetAllPagingKhachHangXuatKhauAsync(params: DoiTuongParams) {
    return this.http.post(`${this.apiURL}/GetAllPagingKhachHangXuatKhauAsync`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  GetByIdAsync(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader()).toPromise();
  }

  GetAllKhachHang(){
    return this.http.get(`${this.apiURL}/GetAllKhachHang`, getHeader());
  }

  GetKhachHangByMaSoThue(maSoThue: string){
    return this.http.get(`${this.apiURL}/GetKhachHangByMaSoThue/${maSoThue}`, getHeader());
  }

  GetAllNhanVien_TraCuu(hoaDonDienTuId: string){
    return this.http.get(`${this.apiURL}/GetAllNhanVien_TraCuu?hoaDonDienTuId=${hoaDonDienTuId}`, getHeader());
  }

  GetAllNhanVien(){
    return this.http.get(`${this.apiURL}/GetAllNhanVien`, getHeader());
  }

  CheckTrungMa(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungMa`, data, getHeader());
  }

  CheckPhatSinh(data: any) {
    return this.http.post(`${this.apiURL}/CheckPhatSinh`, data, getHeader());
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

  ExportExcel(data: any) {
    return this.http.post(`${this.apiURL}/ExportExcel`, data, { ...getHeader(), responseType: 'blob' });
  }
  
  ImportKhachHang(data: any) {
    return this.http.post(`${this.apiURL}/ImportKhachHang`, data, getHeader());
  }
  InsertKhachHangImport(data: any) {
    return this.http.post(`${this.apiURL}/InsertKhachHangImport`, data, getHeader());
  }
  CreateFileImportKhachHangError(data: any) {
    return this.http.post(`${this.apiURL}/CreateFileImportKhachHangError`, data, getHeader());
  }

  ImportNhanVien(data: any) {
    return this.http.post(`${this.apiURL}/ImportNhanVien`, data, getHeader());
  }
  InsertNhanVienImport(data: any) {
    return this.http.post(`${this.apiURL}/InsertNhanVienImport`, data, getHeader());
  }
  CreateFileImportNhanVienError(data: any) {
    return this.http.post(`${this.apiURL}/CreateFileImportNhanVienError`, data, getHeader());
  }
}
