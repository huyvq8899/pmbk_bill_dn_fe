import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PagingParams } from '../../models/PagingParams';
import { EnvService } from '../../env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class ThongDiepGuiNhanCQTService {
  public apiURL = this.env.apiUrl + '/api/';

    constructor(private http: HttpClient,
        private env: EnvService) { }

  GetDanhSachDiaDanh() {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetDanhSachDiaDanh`, getHeader());
  }

  GetListHoaDonSaiSot(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetListHoaDonSaiSot`, data, getHeader())
    .pipe(
      map((res: any[]) => {
        if (res == null) {
          res = [];
        }

        res.forEach((item: any) => {
          item.soHoaDon = item.soHoaDon || item.strSoHoaDon;
        });

         return res;
      })
    );
  }

  InsertThongBaoGuiHoaDonSaiSot(data: any) {
      return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/InsertThongBaoGuiHoaDonSaiSot`, data, getHeader());
  }
  InsertThongBaoGuiHoaDonSaiSot303(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/InsertThongBaoGuiHoaDonSaiSot303`, data, getHeader());
  }
  GateForWebSocket(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GateForWebSocket`, data, getHeader());
  }

  Delete(Id: string) {
    return this.http.delete(`${this.apiURL}ThongDiepGuiNhanCQT/Delete/${Id}`, getHeader());
  }

  DownloadFile(urlFile: string)
  {
    return this.http.get(urlFile, { responseType: 'blob' });
  }

  GuiThongDiepToiCQT(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GuiThongDiepToiCQT`, data, getHeader());
  }

  GetDSMauKyHieuHoaDon(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetDSMauKyHieuHoaDon`, data, getHeader());
  }

  GetListHoaDonRaSoat(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetListHoaDonRaSoat`, data, getHeader());
  }

  GetListChiTietHoaDonRaSoat(Id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetListChiTietHoaDonRaSoat/${Id}`, getHeader());
  }

  GetThongDiepGuiCQTById(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetThongDiepGuiCQTById`, data, getHeader());
  }

  GetListChungThuSo(Id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetListChungThuSo/${Id}`, getHeader());
  }

  GenerateFileIfNotExists(Id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GenerateFileIfNotExists/${Id}`, getHeader());
  }

  GetBase64XmlThongDiepChuaKy(Id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetBase64XmlThongDiepChuaKy/${Id}`, getHeader());
  }

  KiemTraHoaDonDaLapThongBaoSaiSot(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/KiemTraHoaDonDaLapThongBaoSaiSot`, data, getHeader());
  }

  KiemTraHoaDonDaNhapTrungVoiHoaDonHeThong(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/KiemTraHoaDonDaNhapTrungVoiHoaDonHeThong`, data, getHeader());
  }

  TaoSoThongBaoSaiSot() {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/TaoSoThongBaoSaiSot`, getHeader());
  }

  GetBangKeHoaDonSaiSot(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetBangKeHoaDonSaiSot`, data, getHeader());
  }

  ExportExcelBangKeSaiSot(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/ExportExcelBangKeSaiSot`, data, getHeader());
  }

  GetXMLContent(id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetXMLContent/${id}`, getHeader());
  }
  GetNgayCoQuanThueCapMa202(id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetNgayCoQuanThueCapMa202/${id}`, getHeader());
  }
  GetAllThongDiepLienQuan(maThongDiep: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetAllThongDiepLienQuan/${maThongDiep}`, getHeader());
  }
  GetPdfFile301(Id: string) {
    return this.http.get(`${this.apiURL}ThongDiepGuiNhanCQT/GetPdfFile301/${Id}`, getHeader());
  }
  //// DowloadFile
  GetFileXMLSigned(dataEndCode: any,createdDate:string) {
    var params = {
      dataXMLSigned: dataEndCode,
      createdDate: createdDate
    }
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/InsertFileXMLSigned`, params, getHeader());
  }
  GetLinkFileXml(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/GetLinkFileXml/` + data, getHeader());
  }
  DeleteFileXMLAfterDownload(data: any) {
    return this.http.post(`${this.apiURL}ThongDiepGuiNhanCQT/DeleteFileXML/` + data, getHeader());
  }
}
