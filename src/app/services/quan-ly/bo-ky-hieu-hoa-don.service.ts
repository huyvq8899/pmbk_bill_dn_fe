import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BoKyHieuHoaDonService {
  public apiURL = this.env.apiUrl + '/api/BoKyHieuHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetAll() {
    return this.http.get(`${this.apiURL}/GetAll`, getHeader());
  }

  GetAllPaging(params: any) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader());
  }

  GetListByMauHoaDonId(id: string) {
    return this.http.get(`${this.apiURL}/GetListByMauHoaDonId/` + id, getHeader());
  }

  GetListNhatKyXacThucById(id: string) {
    return this.http.get(`${this.apiURL}/GetListNhatKyXacThucById/` + id, getHeader());
  }

  GetSoSeriChungThuById(id: string) {
    return this.http.get(`${this.apiURL}/GetSoSeriChungThuById/` + id, getHeader());
  }

  CheckTrungKyHieu(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungKyHieu`, data, getHeader());
  }

  CheckTrungKyHieuAsync(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungKyHieu`, data, getHeader()).toPromise();
  }

  Delete(id: string) {
    return this.http.delete(`${this.apiURL}/Delete/` + id, getHeader());
  }

  Insert(data: any) {
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }

  XacThucBoKyHieuHoaDon(data: any) {
    return this.http.post(`${this.apiURL}/XacThucBoKyHieuHoaDon`, data, getHeader());
  }

  Update(data: any) {
    return this.http.put(`${this.apiURL}/Update`, data, getHeader());
  }

  CheckSoSeriChungThu(data: any) {
    return this.http.post(`${this.apiURL}/CheckSoSeriChungThu`, data, getHeader());
  }

  CheckThoiHanChungThuSo(data: any) {
    return this.http.post(`${this.apiURL}/CheckThoiHanChungThuSo`, data, getHeader());
  }

  GetListForHoaDon(loaiHoaDon: any, ngayHoaDon = null, boKyHieuHoaDonId = null, roleId = null, loaiNghiepVu = null) {
    const data = {
      boKyHieuHoaDonId,
      loaiHoaDon,
      ngayHoaDon: ngayHoaDon || moment().format('YYYY-MM-DD'),
      roleId: roleId,
      loaiNghiepVu : loaiNghiepVu
    };

    return this.http.post(`${this.apiURL}/GetListForHoaDon`, data, getHeader());
  }

  GetListForHoaDonAsync(loaiHoaDon: any, ngayHoaDon = null, boKyHieuHoaDonId = null) {
    const data = {
      boKyHieuHoaDonId,
      loaiHoaDon,
      ngayHoaDon: ngayHoaDon || moment().format('YYYY-MM-DD'),
   
    };

    return this.http.post(`${this.apiURL}/GetListForHoaDon`, data, getHeader()).toPromise();
  }

  GetListForPhatHanhDongLoat(param: any) {
    return this.http.post(`${this.apiURL}/GetListForPhatHanhDongLoat`, param, getHeader());
  }

  GetChungThuSoById(id: any) {
    return this.http.get(`${this.apiURL}/GetChungThuSoById/${id}`, getHeader());
  }
  GetMultiChungThuSoById(data: any) {
    return this.http.post(`${this.apiURL}/GetMultiChungThuSoById`,data, getHeader());
  }

  CheckDaKySoBatDau(id: any) {
    return this.http.get(`${this.apiURL}/CheckDaKySoBatDau/${id}`, getHeader());
  }

  GetNhatKyXacThucBoKyHieuIdForXemMauHoaDon(id: any) {
    return this.http.get(`${this.apiURL}/GetNhatKyXacThucBoKyHieuIdForXemMauHoaDon/${id}`, getHeader());
  }

  CheckHasToKhaiMoiNhat(data: any) {
    return this.http.post(`${this.apiURL}/CheckHasToKhaiMoiNhat`, data, getHeader());
  }

  CheckHasToKhaiMoiNhatAsync(data: any) {
    return this.http.post(`${this.apiURL}/CheckHasToKhaiMoiNhat`, data, getHeader()).toPromise();
  }

  GetThongTinTuToKhaiMoiNhat() {
    return this.http.get(`${this.apiURL}/GetThongTinTuToKhaiMoiNhat`, getHeader());
  }

  HasChuyenTheoBangTongHopDuLieuHDDT(id: any) {
    return this.http.get(`${this.apiURL}/HasChuyenTheoBangTongHopDuLieuHDDT/${id}`, getHeader());
  }

  CheckTrangThaiSuDungTruocKhiSua(id: any) {
    return this.http.get(`${this.apiURL}/CheckTrangThaiSuDungTruocKhiSua/${id}`, getHeader());
  }

  CheckTrangThaiSuDungTruocKhiSuaAsync(id: any) {
    return this.http.get(`${this.apiURL}/CheckTrangThaiSuDungTruocKhiSua/${id}`, getHeader()).toPromise();
  }

  CheckBoKyHieuDangPhatHanh(ids: any[]) {
    return this.http.post(`${this.apiURL}/CheckBoKyHieuDangPhatHanh`, ids, getHeader());
  }

  ClearBoKyHieuDaPhatHanh() {
    return this.http.delete(`${this.apiURL}/ClearBoKyHieuDaPhatHanh`, getHeader());
  }

  CheckDaHetSoLuongHoaDonVaXacThuc(data: any) {
    return this.http.post(`${this.apiURL}/CheckDaHetSoLuongHoaDonVaXacThuc`, data, getHeader());
  }
  
  CheckUsedBoKyHieuHoaDon(id: any) {
    return this.http.get(`${this.apiURL}/CheckUsedBoKyHieuHoaDon?Id=${id}`, getHeader());
  }
}
