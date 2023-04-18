import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class ThongDiepGuiDuLieuHDDTService {
  public apiURL = this.env.apiUrl + '/api/ThongDiepGuiDuLieuHDDT';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  GetAllThongDiepTraVeInTransLogs(id: string) {
    return this.http.get(`${this.apiURL}/GetAllThongDiepTraVeInTransLogs/` + id, getHeader());
  }

  GetThongDiepTraVeInTransLogs(id: string) {
    return this.http.get(`${this.apiURL}/GetThongDiepTraVeInTransLogs/` + id, getHeader());
  }
  GetByHoaDonDienTuId(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetByHoaDonDienTuId`, params, getHeader());
  }

  KetQuaKiemTraDuLieuHoaDon(id: string) {
    return this.http.get(`${this.apiURL}/KetQuaKiemTraDuLieuHoaDon/` + id, getHeader());
  }

  KetQuaPhanHoiKyThuat(id: string) {
    return this.http.get(`${this.apiURL}/KetQuaPhanHoiKyThuat/` + id, getHeader());
  }

  GuiThongDiepKiemTraDuLieuHoaDon(data: any) {
    return this.http.post(`${this.apiURL}/GuiThongDiepKiemTraDuLieuHoaDon`, data, getHeader());
  }

  GuiThongDiepKiemTraKyThuat(data: any) {
    return this.http.post(`${this.apiURL}/GuiThongDiepKiemTraKyThuat`, data, getHeader());
  }

  GuiThongDiepDuLieuHDDT(id: any) {
    return this.http.get(`${this.apiURL}/GuiThongDiepDuLieuHDDT/${id}`, getHeader());
  }

  NhanPhanHoiThongDiepKiemTraDuLieuHoaDon(data: any) {
    return this.http.post(`${this.apiURL}/NhanPhanHoiThongDiepKiemTraDuLieuHoaDon`, data, getHeader());
  }

  NhanPhanHoiThongDiepKyThuat(data: any) {
    return this.http.post(`${this.apiURL}/NhanPhanHoiThongDiepKyThuat`, data, getHeader());
  }

  UpdateTrangThaiGui(data: any) {
    return this.http.put(`${this.apiURL}/UpdateTrangThaiGui`, data, getHeader());
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

  ExportXMLGuiDi(id: string) {
    return this.http.get(`${this.apiURL}/ExportXMLGuiDi/${id}`, getHeader());
  }

  ExportXMLKetQua(id: string) {
    return this.http.get(`${this.apiURL}/ExportXMLKetQua/${id}`, getHeader());
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

  GetLanBoSung(params: any){
    return this.http.post(`${this.apiURL}/GetLanBoSung`, params, getHeader());
  }

  LuuDuLieuKy(params: any){
    return this.http.post(`${this.apiURL}/LuuDuLieuKy`, params, getHeader());
  }

  InsertRange(data: any[]) {
    return this.http.post(`${this.apiURL}/InsertRange`, data, getHeader());
  }

  InsertThongDiep206(data: any){
    return this.http.post(`${this.apiURL}/InsertThongDiep206`, data, getHeader());
  }

  GuiThongDiep206(datas: any[]){
    return this.http.post(`${this.apiURL}/GuiThongDiep206`, datas, getHeader());
  }

  LuuDuLieuDaKy(data: any){
    return this.http.post(`${this.apiURL}/LuuDuLieuDaKy`, data, getHeader());
  }

}
