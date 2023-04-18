import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';

@Injectable({
  providedIn: 'root'
})
export class BaoCaoService {
  public apiURL = this.env.apiUrl + '/api/BaoCao';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

    ThongKeSoLuongHoaDonDaPhatHanhAsync(params: any) {
        return this.http.post(`${this.apiURL}/ThongKeSoLuongHoaDonDaPhatHanhAsync`, params, getHeader());
    }

    PrintSoLuongHoaDonDaPhatHanhAsync(params: any) {
      return this.http.post(`${this.apiURL}/PrintSoLuongHoaDonDaPhatHanhAsync`, params, getHeader());
    }

    ExportExcelBangKeHangHoaBanRa(data: any) {
      return this.http.post(`${this.apiURL}/ExportExcelBangKeHangHoaBanRa`, data, getHeader());
    }
    BangKeChiTietHoaDonAsync(params: any){
        return this.http.post(`${this.apiURL}/BangKeChiTietHoaDonAsync`, params, getHeader());
    }

    PrintBangKeChiTietHoaDonAsync(params: any) {
      return this.http.post(`${this.apiURL}/PrintBangKeChiTietHoaDonAsync`, params, getHeader());
    }

    ThemBaoCaoTinhHinhSuDungHoaDon(params: any){
      return this.http.post(`${this.apiURL}/ThemBaoCaoTinhHinhSuDungHoaDon`, params, getHeader());
    }

    CapNhatBaoCaoTinhHinhSuDungHoaDon(params: any){
      return this.http.post(`${this.apiURL}/CapNhatBaoCaoTinhHinhSuDungHoaDon`, params, getHeader());
    }

    GetListTinhHinhSuDungHoaDon(params: PagingParams){
      return this.http.post(`${this.apiURL}/GetListTinhHinhSuDungHoaDon`, params, getHeader());
    }

    GetById(idBaoCao: string){
      return this.http.get(`${this.apiURL}/GetById/`+ idBaoCao, getHeader());
    }

    CheckNgayThangBaoCaoTinhHinhSuDungHD(params: any){
      return this.http.post(`${this.apiURL}/CheckNgayThangBaoCaoTinhHinhSuDungHD`, params, getHeader());
    }
    
    TongHopGiaTriHoaDonDaSuDung(params: any){
      return this.http.post(`${this.apiURL}/TongHopGiaTriHoaDonDaSuDung`, params, getHeader());
    }

    XoaBaoCaoTinhHinhSuDungHoaDon(id: string){
      return this.http.delete(`${this.apiURL}/XoaBaoCaoTinhHinhSuDungHoaDon/` + id, getHeader());
    }

    GetBaoCaoByKyTinhThue(params: any){
        return this.http.post(`${this.apiURL}/GetBaoCaoByKyTinhThue`, params, getHeader());
    }

    PrintBaoCaoTinhHinhSuDungHoaDonAsync(data: any) {
      return this.http.post(`${this.apiURL}/PrintBaoCaoTinhHinhSuDungHoaDonAsync`, data, getHeader());
    }

    ExportExcelTongHopGiaTriHoaDonDaSuDung(data: any) {
      return this.http.post(`${this.apiURL}/ExportExcelTongHopGiaTriHoaDonDaSuDung`, data, { ...getHeader(), responseType: 'blob' });
    }
}
