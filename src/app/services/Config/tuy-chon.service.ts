import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';

@Injectable({
  providedIn: 'root'
})
export class TuyChonService {
  public apiURL = this.env.apiUrl + '/api/TuyChon/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  public getHeader() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
      })
    };
  }

  GetAll(keyword = '') {
    const url = `${this.apiURL}GetAll?keyword=${keyword}`;
    return this.http.get(url, this.getHeader());
  }

  GetAllAsync(keyword = '') : any{
    const url = `${this.apiURL}GetAll?keyword=${keyword}`;
    return this.http.get(url, this.getHeader()).toPromise();
  }

  CheckDaPhatSinhHangNhanHoGiaCong() {
    const url = `${this.apiURL}CheckDaPhatSinhHangNhanHoGiaCong`;
    return this.http.get(url, this.getHeader());
  }

  GetAllNoiDungEmail(){
    const url = `${this.apiURL}GetAllNoiDungEmail`;
    return this.http.get(url, this.getHeader());
  }

  UpdateRangeNoiDungEmailAsync(data: any){
    const url = `${this.apiURL}UpdateRangeNoiDungEmailAsync`;
    return this.http.post(url, data, this.getHeader());
  }

  GetDetail(ma: string) {
    return this.http.get(`${this.apiURL}GetDetail/` + ma, this.getHeader());
  }

  GetDetailAsync(ma: string): any {
    return this.http.get(`${this.apiURL}GetDetail/` + ma, this.getHeader()).toPromise();
  }

  Update(data: any) {
    return this.http.put(`${this.apiURL}Update`, data, this.getHeader());
  }

  GetThongTinHienThiTruongDL(tenChucNang: string){
    return this.http.get(`${this.apiURL}GetThongTinHienThiTruongDL/` + tenChucNang, this.getHeader());
  }

  UpdateHienThiTruongDuLieu(datas: any[]){
    const url = `${this.apiURL}UpdateHienThiTruongDuLieu`;
    return this.http.post(url, datas, this.getHeader());
  }

  GetThongTinHienThiTruongDLHoaDon(isChiTiet: boolean, loaiHoaDon: number){
    return this.http.get(`${this.apiURL}GetThongTinHienThiTruongDLHoaDon?isChiTiet=${isChiTiet}&loaiHoaDon=${loaiHoaDon}`, this.getHeader());
  }

  GetThongTinHienThiTruongDLHoaDonAll(isChiTiet: boolean){
    return this.http.get(`${this.apiURL}GetThongTinHienThiTruongDLHoaDonAll?isChiTiet=${isChiTiet}`, this.getHeader());
  }


  GetThongTinHienThiTruongDLMoRong(LoaiHoaDon: number){
    return this.http.get(`${this.apiURL}GetThongTinHienThiTruongDLMoRong/${LoaiHoaDon}`, this.getHeader());
  }

  UpdateHienThiTruongDuLieuHoaDon(datas: any[]){
    const url = `${this.apiURL}UpdateHienThiTruongDuLieuHoaDon`;
    return this.http.post(url, datas, this.getHeader());
  }

  UpdateThietLapTruongDuLieuMoRong(datas: any[]){
    const url = `${this.apiURL}UpdateThietLapTruongDuLieuMoRong`;
    return this.http.post(url, datas, this.getHeader());
  }

  LayLaiThietLapEmailMacDinh(LoaiEmail: number){
    const url = `${this.apiURL}LayLaiThietLapEmailMacDinh`;
    return this.http.post(url, LoaiEmail, this.getHeader());
  }

  CheckCoPhatSinhNgoaiTe() {
    return this.http.get(`${this.apiURL}CheckCoPhatSinhNgoaiTe`, this.getHeader())
  }
  GetTypeChuKi(){
    return this.http.get(`${this.apiURL}GetTypeChuKi`, this.getHeader())
  }
  UpdateLoaiChuKi(data: any) {
    return this.http.post(`${this.apiURL}UpdateLoaiChuKi`, data, this.getHeader())
  }
  
  GetListByHoaDonId(hoaDonId: any) {
    return this.http.get(`${this.apiURL}GetListByHoaDonId/${hoaDonId}`, this.getHeader())
  }
}
