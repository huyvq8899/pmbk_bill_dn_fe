import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { BangTongHopParams, PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class BangTongHopDuLieuService {
  public apiURL = this.env.apiUrl + '/api/BangTongHopDuLieuHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetListTimKiemTheoBangTongHop() {
    return this.http.get(`${this.apiURL}/GetListTimKiemTheoBangTongHop`, getHeader());
  }

  GetListTrangThaiQuyTrinh() {
    return this.http.get(`${this.apiURL}/GetListTrangThaiQuyTrinh`, getHeader());
  }

  GetAllPaging(params: BangTongHopParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  Insert(model: any){
    return this.http.post(`${this.apiURL}/InsertBangTongHopDuLieuHoaDonAsync`, model, getHeader());
  }

  Update(model: any){
    return this.http.post(`${this.apiURL}/UpdateBangTongHopDuLieuHoaDonAsync`, model, getHeader());
  }

  Delete(id: string){
    return this.http.delete(`${this.apiURL}/DeleteBangTongHopDuLieuHoaDonAsync/${id}`, getHeader());
  }

  GetSoBangTongHopDuLieu(params: any){
    return this.http.post(`${this.apiURL}/GetSoBangTongHopDuLieu`, params, getHeader());
  }

  GetDuLieuBangTongHopGuiDenCQT(params: any){
    return this.http.post(`${this.apiURL}/GetDuLieuBangTongHopGuiDenCQT`, params, getHeader());
  }

  CreateXMLBangTongHopDuLieu(params: any){
    return this.http.post(`${this.apiURL}/CreateXMLBangTongHopDuLieu`, params, getHeader());
  }

  GuiBangDuLieu(params: any){
    return this.http.post(`${this.apiURL}/GuiBangDuLieu`, params, getHeader());
  }

  CheckLanDau(params: any){
    return this.http.post(`${this.apiURL}/CheckLanDau`, params, getHeader());
  }

  CheckBoSung(params: any){
    return this.http.post(`${this.apiURL}/CheckBoSung`, params, getHeader());
  }

  CheckSuaDoi(params: any){
    return this.http.post(`${this.apiURL}/CheckSuaDoi`, params, getHeader());
  }

  CheckSuaDoiChuaGui(params: any){
    return this.http.post(`${this.apiURL}/CheckSuaDoiChuaGui`, params, getHeader());
  }

  GetLanBoSung(params: any){
    return this.http.post(`${this.apiURL}/GetLanBoSung`, params, getHeader());
  }

  GetLanSuaDoi(params: any){
    return this.http.post(`${this.apiURL}/GetLanSuaDoi`, params, getHeader());
  }

  LuuDuLieuKy(params: any){
    return this.http.post(`${this.apiURL}/LuuDuLieuKy`, params, getHeader());
  }
}
