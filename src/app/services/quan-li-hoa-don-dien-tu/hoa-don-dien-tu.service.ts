import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HoaDonDieuChinhParams, HoaDonParams, HoaDonThayTheParams, PagingParams } from '../../models/PagingParams';
import { EnvService } from 'src/app/env.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import * as moment from 'moment';
import { generateUUIDV4 } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class HoaDonDienTuService {
  public apiURL = this.env.apiUrl + '/api/HoaDonDienTu/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  public getHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('tokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      })
    };
  }

  GetAll() {
    return this.http.get(`${this.apiURL}GetAll`, this.getHeader());
  }

  CheckSoHoaDon(soHoaDon: string) {
    return this.http.get(`${this.apiURL}CheckSoHoaDon?soHoaDon=` + soHoaDon, this.getHeader());
  }

  GetAllPaging(data: HoaDonParams) {
    return this.http.post(`${this.apiURL}GetAllPaging`, data, this.getHeader())
      .pipe(map((res: any) => {
        res.items.forEach((item: any) => {
          // get title
          if (item.loaiHoaDon === 7 || item.loaiHoaDon === 8) {
            item.titleLenhDieuDongHopDongKinhTe = item.canCuSo || '';
            if (item.canCuSo && item.ngayCanCu) {
              item.titleLenhDieuDongHopDongKinhTe += ' - ';
            }
            if (item.ngayCanCu) {
              item.titleLenhDieuDongHopDongKinhTe += `Ngày: ${moment(item.ngayCanCu).format('DD/MM/YYYY')}`;
            }
            if (item.cua) {
              item.titleLenhDieuDongHopDongKinhTe += `\nCủa: ${item.cua}`;
            }

            item.titleThongTinXuatHang = '';
            if (item.diaChiKhoXuatHang) {
              item.titleThongTinXuatHang += `Kho xuất: ${item.diaChiKhoXuatHang}`;
            }
            if (item.hoTenNguoiXuatHang) {
              item.titleThongTinXuatHang += (item.diaChiKhoXuatHang ? '\n' : '') + `Người xuất: ${item.hoTenNguoiXuatHang}`;
            }

            item.titleThongTinVanChuyen = item.hopDongVanChuyenSo || '';
            item.titleThongTinVanChuyen += (item.hopDongVanChuyenSo ? '\n' : '') + `${item.tenNguoiVanChuyen}`;
            if (item.tenNguoiVanChuyen && item.phuongThucVanChuyen) {
              item.titleThongTinVanChuyen += ' - ';
            }
            item.titleThongTinVanChuyen += (item.phuongThucVanChuyen || '');
          }
        });

        return res;
      }));
  }

  GetAllPagingHoaDonThayThe(params: HoaDonThayTheParams) {
    return this.http.post(`${this.apiURL}GetAllPagingHoaDonThayThe`, params, this.getHeader());
  }

  GetListHoaDonXoaBoCanThayThe(params: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonXoaBoCanThayThe`, params, this.getHeader());
  }

  GetListHoaDonCanDieuChinh(params: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonCanDieuChinh`, params, this.getHeader());
  }

  GetChiTietHoaDon(id: any) {
    return this.http.get(`${this.apiURL}GetChiTietHoaDon/` + id, this.getHeader());
  }

  GetAllPagingHoaDonDieuChinh(params: HoaDonDieuChinhParams) {
    return this.http.post(`${this.apiURL}GetAllPagingHoaDonDieuChinh`, params, this.getHeader());
  }

  GetListHoaDonForThongDiep(loaiThongDiep: any, params: any) {
    switch (loaiThongDiep) {
      case MLTDiep.TDGHDDTTCQTCapMa:
        return this.GetListHoaDonCanCapMa(params);
      case MLTDiep.TDCDLHDKMDCQThue:
        return this.GetListHoaDonKhongMa(params);
      default:
        return of(null);
    }
  }

  GetListHoaDonKhongMa(params: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonKhongMa`, params, this.getHeader());
  }

  GetListHoaDonCanCapMa(params: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonCanCapMa`, params, this.getHeader());
  }

  GetTrangThaiHoaDonDieuChinhs() {
    return this.http.get(`${this.apiURL}GetTrangThaiHoaDonDieuChinhs`, this.getHeader());
  }

  GetLoaiTrangThaiBienBanDieuChinhHoaDons() {
    return this.http.get(`${this.apiURL}GetLoaiTrangThaiBienBanDieuChinhHoaDons`, this.getHeader());
  }

  GetLoaiTrangThaiPhatHanhs() {
    return this.http.get(`${this.apiURL}GetLoaiTrangThaiPhatHanhs`, this.getHeader());
  }

  GetLoaiTrangThaiGuiHoaDons() {
    return this.http.get(`${this.apiURL}GetLoaiTrangThaiGuiHoaDons`, this.getHeader());
  }

  GetListTimKiemTheoHoaDonThayThe() {
    return this.http.get(`${this.apiURL}GetListTimKiemTheoHoaDonThayThe`, this.getHeader());
  }

  GetListHinhThucHoaDonCanThayThe() {
    return this.http.get(`${this.apiURL}GetListHinhThucHoaDonCanThayThe`, this.getHeader());
  }

  GetAllListHoaDonLienQuan(id: string, ngayTao: any) {
    return this.http.get(`${this.apiURL}GetAllListHoaDonLienQuan?id=${id}&ngayTao=${ngayTao}`, this.getHeader());
  }

  GetAllListHoaDonLienQuan_TraCuu(id: string, ngayTao: any) {
    return this.http.get(`${this.apiURL}GetAllListHoaDonLienQuan_TraCuu?id=${id}&ngayTao=${ngayTao}`);
  }
  // CreateSoHoaDon() {
  //     return this.http.get(`${this.apiURL}CreateSoHoaDon`, {
  //         headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('tokenKey')}` }),
  //         responseType: 'text'
  //     });
  // }

  CreateSoHoaDonPromise() {
    return this.http.get(`${this.apiURL}CreateSoHoaDon`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('tokenKey')}` }),
      responseType: 'text'
    }).toPromise();
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}GetById/` + id, this.getHeader());
  }
  GetHoaDonGocCuaHDBi(id: string,loai:string) {
    return this.http.get(`${this.apiURL}GetHoaDonGocCuaHDBI/` + id+'/'+loai, this.getHeader());
  }

  GetBySoHoaDon(SoHoaDon: string, KyHieu: string, kyHieuMauSoHoaDon: string) {
    return this.http.get(`${this.apiURL}GetBySoHoaDon?SoHoaDon=${SoHoaDon}&KyHieu=${KyHieu}&KyHieuMauSo=${kyHieuMauSoHoaDon}`, this.getHeader());
  }

  GetById_TraCuu(id: string) {
    return this.http.get(`${this.apiURL}GetById_TraCuu/` + id, this.getHeader());
  }

  GetTrangThaiHoaDon() {
    return this.http.get(`${this.apiURL}GetTrangThaiHoaDon`, this.getHeader());
  }

  GetTrangThaiGuiHoaDon() {
    return this.http.get(`${this.apiURL}GetTrangThaiGuiHoaDon`, this.getHeader());
  }

  GetTreeTrangThai(data: HoaDonParams) {
    return this.http.get(`${this.apiURL}GetTreeTrangThai?LoaiHoaDon=${data.LoaiHoaDon}`
      + `&fromDate=${data.fromDate}`
      + `&toDate=${data.toDate}`
      , this.getHeader());
  }

  GetByIdPromise(id: string) {
    return this.http.get(`${this.apiURL}GetById/` + id, this.getHeader()).toPromise();
  }

  Delete(id: string) {
    return this.http.delete(`${this.apiURL}Delete/` + id, this.getHeader());
  }

  GetError(loaiLoi: number, hoaDonDienTuId: string) {
    return this.http.get(`${this.apiURL}GetError?LoaiLoi=${loaiLoi}&HoaDonDienTuId=${hoaDonDienTuId}`, this.getHeader());
  }

  ExportExcelError(data: any) {
    return this.http.post(`${this.apiURL}ExportExcelError`, data, this.getHeader());
  }

  Insert(data: any) {
    data.actionUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post(`${this.apiURL}Insert`, data, this.getHeader());
  }

  Update(data: any) {
    data.actionUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.put(`${this.apiURL}Update`, data, this.getHeader());
  }

  Update_TraCuu(data: any) {
    //data.actionUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.put(`${this.apiURL}Update`, data);
  }

  ExportExcelBangKe(data: any) {
    return this.http.post(`${this.apiURL}ExportExcelBangKe`, data, this.getHeader());
  }

  ExportExcelBangKeChiTiet(data: any) {
    return this.http.post(`${this.apiURL}ExportExcelBangKeChiTiet`, data, this.getHeader());
  }

  DeleteRangeHoaDonDienTu(data: any[]) {
    const param = {
      listHoaDon: data
    };
    return this.http.post(`${this.apiURL}DeleteRangeHoaDonDienTu`, param, this.getHeader())
      .pipe(
        map((res: any) => {
          const calls = [];
          res.removedList.forEach((item: any) => {
            let url = `${this.apiURL}Delete/` + item.chungTuId;
            calls.push(this.http.delete(url, this.getHeader()));
          });

          calls.unshift(of(res.removedList.map(x => x.chungTuId)));
          calls.unshift(of(res));
          return calls;
        }),
        switchMap((calls: any[]) => {
          return forkJoin(calls);
        }));
  }

  TienLuiChungTu(id: string) {
    const data = { chungTuId: id };
    return this.http.post(`${this.apiURL}TienLuiChungTu`, data, this.getHeader())
  }

  CreateSoHoaDon(data: any) {
    return this.http.post(`${this.apiURL}CreateSoHoaDon`, data, this.getHeader())
  }

  CreateSoCTXoaBoHoaDon() {
    return this.http.get(`${this.apiURL}CreateSoCTXoaBoHoaDon`, this.getHeader())
  }

  CreateSoBienBanXoaBoHoaDon() {
    return this.http.get(`${this.apiURL}CreateSoBienBanXoaBoHoaDon`, this.getHeader())
  }


  CapPhatSoHoaDon(data: any) {
    return this.http.post(`${this.apiURL}CapPhatSoHoaDon`, data, this.getHeader())
  }

  TaiHoaDon(data: any) {
    return this.http.post(`${this.apiURL}TaiHoaDon`, data, this.getHeader())
  }

  TaiHoaDon_Multiple(data: any) {
    return this.http.post(`${this.apiURL}TaiHoaDon_Multiple`, data, this.getHeader())
  }
  
  TaiHoaDon_TraCuu(data: any) {
    return this.http.post(`${this.apiURL}TaiHoaDon_TraCuu`, data, this.getHeader())
  }


  ConvertHoaDonToFilePDF(data: any) {
    if (data.isPhatHanh) {
      data.maTraCuu = generateUUIDV4().toLowerCase();
    }
    return this.http.post(`${this.apiURL}ConvertHoaDonToFilePDF`, data, this.getHeader())
  }
  ConvertHoaDonToFilePDF_Multiple(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToFilePDF_Multiple`, data, this.getHeader())
  }

  CreateXMLToSign(data: any) {
    if (data.isPhatHanh) {
      data.maTraCuu = generateUUIDV4().toLowerCase();
    }
    return this.http.post(`${this.apiURL}CreateXMLToSign`, data, this.getHeader())
  }
  CreateXMLToSignAsync(data: any) : Promise<any> {
    if (data.isPhatHanh) {
      data.maTraCuu = generateUUIDV4().toLowerCase();
    }
    return this.http.post(`${this.apiURL}CreateXMLToSign`, data, this.getHeader()).toPromise();
  }
  MultiCreateXMLToSign(data: any) {
    return this.http.post(`${this.apiURL}MultiCreateXMLToSign`, data, this.getHeader())
  }
  ConvertHoaDonToFilePDF_TraCuu(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToFilePDF_TraCuu`, data, this.getHeader())
  }

  GateForWebSocket(data: any) {
    return this.http.post(`${this.apiURL}GateForWebSocket`, data, this.getHeader())
  }

  WaitForTCTResonse(data: any) {
    return this.http.post(`${this.apiURL}WaitForTCTResonse`, data, this.getHeader())
  }

  GateForWebSocket_TraCuu(data: any) {
    return this.http.post(`${this.apiURL}GateForWebSocket_TraCuu`, data)
  }

  PhatHanhHoaDonCoMaTuMTT(data: any){
    data.actionUser = JSON.parse(localStorage.getItem('currentUser'));
    data.maTraCuu = generateUUIDV4().toLowerCase();
    return this.http.post(`${this.apiURL}PhatHanhHoaDonCoMaTuMTT`, data, this.getHeader()) 
  }

  
  PhatHanhHoaDonCoMaTuMTTDongLoat(datas: any[]){
    console.log('phat hanh dong loat');
    return this.http.post(`${this.apiURL}PhatHanhHoaDonCoMaTuMTTDongLoat`, datas, this.getHeader()) 
  }


  SendEmailAsync(data: any) {
    return this.http.post(`${this.apiURL}SendMailAsync`, data, this.getHeader())
  }

  SendEmailThongTinHoaDon(data: any) {
    return this.http.post(`${this.apiURL}SendEmailThongTinHoaDon`, data, this.getHeader());
  }

  SendEmailThongBaoSaiThongTin(data: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != null) {
      data.userId = currentUser.userId;
    }
    return this.http.post(`${this.apiURL}SendEmailThongBaoSaiThongTin`, data, this.getHeader());
  }

  XemLichSuHoaDon(id: string) {
    return this.http.get(`${this.apiURL}XemLichSuHoaDon/` + id, this.getHeader());
  }

  CapNhatBienBanXoaBoHoaDon(data: any) {
    return this.http.post(`${this.apiURL}CapNhatBienBanXoaBoHoaDon`, data, this.getHeader())
  }

  SaveBienBanXoaHoaDon(params: any) {
    return this.http.post(`${this.apiURL}SaveBienBanXoaHoaDon`, params, this.getHeader())
  }

  ConvertToHoaDonGiay(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToHoaDonGiay`, data, { ...this.getHeader(), responseType: 'blob' })
  }

  ConvertToHoaDonGiay_TraCuu(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToHoaDonGiay_TraCuu`, data, { responseType: 'blob' })
  }

  ConvertToHoaDonGiay2(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToHoaDonGiay2`, data, this.getHeader())
  }
  DeleteBienBanXoaHoaDon(Id: string) {
    return this.http.delete(`${this.apiURL}DeleteBienBanXoaHoaDon/${Id}`, this.getHeader());
  }

  ConvertBienBanXoaBoToFilePdf(data: any) {
    return this.http.post(`${this.apiURL}ConvertBienBanXoaBoToFilePDF`, data)
  }

  KyBienBanXoaBo(data: any) {
    return this.http.post(`${this.apiURL}KyBienBanXoaBo`, data)
  }

  ConvertBienBanXoaBoToFilePdf_NB(data: any) {
    return this.http.post(`${this.apiURL}ConvertBienBanXoaBoToFilePdf_NB`, data, this.getHeader())
  }

  KyBienBanXoaBo_NB(data: any) {
    return this.http.post(`${this.apiURL}KyBienBanXoaBo_NB`, data, this.getHeader())
  }


  GetBienBanXoaBoHoaDon(hoaDonDienTuId: string) {
    return this.http.get(`${this.apiURL}GetBienBanXoaBoHoaDon/` + hoaDonDienTuId, this.getHeader())
      .pipe(
        map((res: any) => {
          if (res) {
            res.hoaDonDienTu.soHoaDon = res.hoaDonDienTu.soHoaDon || res.hoaDonDienTu.strSoHoaDon;
          }
          return res;
        })
      );
  }

  GetBienBanXoaBoHoaDonById(bbxbId: string) {
    return this.http.get(`${this.apiURL}GetBienBanXoaBoHoaDonById/` + bbxbId);
  }

  XoaBoHoaDon(params: any) {
    return this.http.post(`${this.apiURL}XoaBoHoaDon`, params, this.getHeader())
  }

  GetStatusThayTheHoaDon(hoaDonDienTuId: any) {
    return this.http.get(`${this.apiURL}GetStatusDaThayTheHoaDon/` + hoaDonDienTuId, this.getHeader())
  }

  TraCuuByMa(maTraCuu: string) {
    return this.http.get(`${this.apiURL}TraCuuByMa/` + maTraCuu);
  }

  TraCuuBySoHoaDon(input: any) {
    return this.http.post(`${this.apiURL}TraCuuBySoHoaDon`, input);
  }

  GetMaTraCuuInXml(files: any) {
    return this.http.post(`${this.apiURL}GetMaTraCuuInXml`, files);
  }

  ThemNhatKyThaoTacHoaDon(model: any) {
    return this.http.post(`${this.apiURL}ThemNhatKyThaoTacHoaDon`, model, this.getHeader());
  }

  XemHoaDonDongLoat(model: any) {
    return this.http.post(`${this.apiURL}XemHoaDonHangLoat`, model, { ...this.getHeader(), responseType: 'blob' });
  }

  XemHoaDonDongLoat2(model: any) {
    return this.http.post(`${this.apiURL}XemHoaDonHangLoat2`, model, { ...this.getHeader(), responseType: 'blob' });
  }
  GetDSRutGonBoKyHieuHoaDon() {
    return this.http.get(`${this.apiURL}GetDSRutGonBoKyHieuHoaDon`, this.getHeader());
  }
  GetDSXoaBoChuaLapThayThe(loaiNghiepVu: any) {
    return this.http.get(`${this.apiURL}GetDSXoaBoChuaLapThayThe/${loaiNghiepVu}`, this.getHeader());
  }
  GetHoaDonDaLapBbChuaXoaBo(loaiNghiepVu: any) {
    return this.http.get(`${this.apiURL}GetHoaDonDaLapBbChuaXoaBo/${loaiNghiepVu}`, this.getHeader());
  }
  GetDSHdDaXoaBo(data: HoaDonParams) {
    return this.http.post(`${this.apiURL}GetDSHdDaXoaBo`, data, this.getHeader());
  }
  GetDSHoaDonDeXoaBo(data: HoaDonParams) {
    return this.http.post(`${this.apiURL}GetDSHoaDonDeXoaBo`, data, this.getHeader());
  }
  UpdateTrangThaiQuyTrinh(id: any, status: TrangThaiQuyTrinh) {
    const data = {
      hoaDonDienTuId: id,
      trangThaiQuyTrinh: status
    };
    return this.http.put(`${this.apiURL}UpdateTrangThaiQuyTrinh`, data, this.getHeader());
  }
  UpdateMultiTrangThaiQuyTrinh(data: any) {
    return this.http.put(`${this.apiURL}UpdateMultiTrangThaiQuyTrinh`, data, this.getHeader());
  }

  RemoveDigitalSignature(id: any) {
    return this.http.delete(`${this.apiURL}RemoveDigitalSignature/${id}`, this.getHeader())
  }

  FindSignatureElement(filePath: any) {
    return this.http.post(`${this.apiURL}FindSignatureElement`, filePath);
  }

  ImportHoaDon(params: any) {
    return this.http.post(`${this.apiURL}ImportHoaDon`, params, this.getHeader());
  }

  ImportPhieuXuatKho(params: any) {
    return this.http.post(`${this.apiURL}ImportPhieuXuatKho`, params, this.getHeader());
  }

  InsertImportHoaDon(data: any[]) {
    return this.http.post(`${this.apiURL}InsertImportHoaDon`, data, this.getHeader());
  }

  CreateFileImportHoaDonError(data: any) {
    return this.http.post(`${this.apiURL}CreateFileImportHoaDonError`, data, { ...this.getHeader(), responseType: 'blob' });
  }

  GetNgayHienTai() {
    return this.http.get(`${this.apiURL}GetNgayHienTai/`, this.getHeader()).toPromise();
  }

  KiemTraHoaDonDaLapTBaoCoSaiSot(id: string) {
    return this.http.get(`${this.apiURL}KiemTraHoaDonDaLapTBaoCoSaiSot/` + id, this.getHeader());
  }

  CheckLuuHoaDon(data: any) {
    return this.http.post(`${this.apiURL}CheckLuuHoaDon`, data, this.getHeader());
  }

  CheckHoaDonPhatHanh(data: any) {
    return this.http.post(`${this.apiURL}CheckHoaDonPhatHanh`, data, this.getHeader());
  }

  UpdateNgayHoaDonBangNgayHoaDonPhatHanh(data: any) {
    return this.http.post(`${this.apiURL}UpdateNgayHoaDonBangNgayHoaDonPhatHanh`, data, this.getHeader());
  }

  GetListHoaDonSaiSotCanThayThe(params: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonSaiSotCanThayThe`, params, this.getHeader());
  }

  ThongKeSoLuongHoaDonSaiSotChuaLapThongBao(coThongKeSoLuong: number, loaiNghiepVu: any) {
    return this.http.get(`${this.apiURL}ThongKeSoLuongHoaDonSaiSotChuaLapThongBao/${coThongKeSoLuong}/${loaiNghiepVu}`, this.getHeader());
  }

  KiemTraSoLanGuiEmailSaiSot(hoaDonDienTuId: string, loaiSaiSot: number) {
    return this.http.get(`${this.apiURL}KiemTraSoLanGuiEmailSaiSot/${hoaDonDienTuId}/${loaiSaiSot}`, this.getHeader());
  }

  KiemTraHoaDonThayTheDaDuocCapMa(id: string) {
    return this.http.get(`${this.apiURL}KiemTraHoaDonThayTheDaDuocCapMa/${id}`, this.getHeader()).toPromise();
  }

  CheckDaPhatSinhThongDiepTruyenNhanVoiCQT(id: string) {
    return this.http.get(`${this.apiURL}CheckDaPhatSinhThongDiepTruyenNhanVoiCQT/${id}`, this.getHeader());
  }

  CheckDaPhatSinhThongDiepTruyenNhanVoiCQTAsync(id: string) {
    return this.http.get(`${this.apiURL}CheckDaPhatSinhThongDiepTruyenNhanVoiCQT/${id}`, this.getHeader()).toPromise();
  }

  CheckLaHoaDonGuiTCTNLoi(id: string) {
    return this.http.get(`${this.apiURL}CheckLaHoaDonGuiTCTNLoi/${id}`, this.getHeader());
  }

  CheckLaHoaDonGuiTCTNLoiAsync(id: string) {
    return this.http.get(`${this.apiURL}CheckLaHoaDonGuiTCTNLoi/${id}`, this.getHeader()).toPromise();
  }

  GetTrangThaiQuyTrinhById(id: string) {
    return this.http.get(`${this.apiURL}GetTrangThaiQuyTrinhById/${id}`, this.getHeader());
  }

  GetTrangThaiQuyTrinhByIdAsync(id: string) {
    return this.http.get(`${this.apiURL}GetTrangThaiQuyTrinhById/${id}`, this.getHeader()).toPromise();
  }

  ViewHoaDonDongLoat(data: any[]) {
    return this.ConvertHoaDonToFilePDF_Multiple(data);

    // const callGetByIds = [];

    // data.forEach((item: any) => {
    //   callGetByIds.push(this.GetById(item.hoaDonDienTuId));
    // });

    // return forkJoin(callGetByIds)
    //   .pipe(
    //     map((res: any[]) => {
    //       var callConvertHoaDonToFilePDF = [];
    //       const length = res.length;
    //       for (let i = 0; i < length; i++) {
    //         const item = res[i];
    //         callConvertHoaDonToFilePDF.push(this.ConvertHoaDonToFilePDF(item));
    //       }
    //       return callConvertHoaDonToFilePDF;
    //     })
    //   );
  }

  SortListSelected(data: any) {
    return this.http.post(`${this.apiURL}SortListSelected`, data, this.getHeader());
  }

  ConvertHoaDonToFileXML(data: any) {
    return this.http.post(`${this.apiURL}ConvertHoaDonToFileXML`, data, this.getHeader());
  }

  GetMaThongDiepInXMLSignedById(id: any) {
    return this.http.get(`${this.apiURL}GetMaThongDiepInXMLSignedById/${id}`, this.getHeader());
  }

  GetListHoaDonByListId(datas: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonByListId`, datas, this.getHeader());
  }

  ConvertListHoaDonToListFileXML(data: any) {
    return this.http.post(`${this.apiURL}ConvertListHoaDonToListFileXML`, data, this.getHeader());
  }

  ConvertListHoaDonToFile203XML(data: any) {
    return this.http.post(`${this.apiURL}ConvertListHoaDonToFile203XML`, data, this.getHeader());
  }

  GetTaiLieuDinhKemsById(id: any) {
    return this.http.get(`${this.apiURL}GetTaiLieuDinhKemsById/${id}`, this.getHeader());
  }

  GetHoaDonByThayTheChoHoaDonId(id: any) {
    return this.http.get(`${this.apiURL}GetHoaDonByThayTheChoHoaDonId/${id}`, this.getHeader());
  }

  IsDaGuiEmailChoKhachHang(id: any) {
    return this.http.get(`${this.apiURL}IsDaGuiEmailChoKhachHang/${id}`, this.getHeader());
  }

  // loai: 0-KhachHang, 1-NhanVien, 2-HangHoa, 3-LoaiTien, 4-DonViTinh
  UpdateTruongMaKhiSuaTrongDanhMuc(loai: any, refId: any, ma: any) {
    const model = { loai, refId, ma };
    return this.http.post(`${this.apiURL}UpdateTruongMaKhiSuaTrongDanhMuc`, model, this.getHeader());
  }

  GetListHoaDonDePhatHanhDongLoat(param: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonDePhatHanhDongLoat`, param, this.getHeader());
  }

  GroupListDeXemDuLieuPhatHanhDongLoat(list: any[]) {
    const params = {
      hoaDonDienTus: list
    }

    let header = this.getHeader();
    // header.headers.append('Access-Control-Allow-Origin',  '*');
    return this.http.post(`${this.apiURL}GroupListDeXemDuLieuPhatHanhDongLoat`, params, header);
  }

  PhatHanhHoaDonDongLoat(list: any[]) {
    return this.http.post(`${this.apiURL}PhatHanhHoaDonDongLoat`, list, this.getHeader());
  }

  TaiTepPhatHanhHoaDonLoi(data: any[]) {
    return this.http.post(`${this.apiURL}TaiTepPhatHanhHoaDonLoi`, data, { ...this.getHeader(), responseType: 'blob' })
  }

  GetListHoaDonDeGuiEmailDongLoat(param: any) {
    return this.http.post(`${this.apiURL}GetListHoaDonDeGuiEmailDongLoat`, param, this.getHeader());
  }

  TaiTepGuiHoaDonLoi(data: any[]) {
    return this.http.post(`${this.apiURL}TaiTepGuiHoaDonLoi`, data, { ...this.getHeader(), responseType: 'blob' })
  }

  CheckMultiHoaDonPhatHanh(param: any[]) {
    return this.http.post(`${this.apiURL}CheckMultiHoaDonPhatHanh`, param, this.getHeader());
  }

  GetMultiTrangThaiQuyTrinhById(ids: any[]) {
    return this.http.post(`${this.apiURL}GetMultiTrangThaiQuyTrinhById`, ids, this.getHeader());
  }

  GetMultiById(ids: any[]) {
    return this.http.post(`${this.apiURL}GetMultiById`, ids, this.getHeader());
  }

  WaitMultiForTCTResonse(ids: any[]) {
    return this.http.post(`${this.apiURL}WaitMultiForTCTResonse`, ids, this.getHeader());
  }

  GetKetQuaThucHienPhatHanhDongLoat(ids: any[]) {
    return this.http.post(`${this.apiURL}GetKetQuaThucHienPhatHanhDongLoat`, ids, this.getHeader());
  }

  UpdateRangeNgayHoaDonVeNgayHienTai(ids: any[]) {
    return this.http.post(`${this.apiURL}UpdateRangeNgayHoaDonVeNgayHienTai`, ids, this.getHeader());
  }
  CheckExistInvoid(list: any[]){
    return this.http.post(`${this.apiURL}CheckExistInvoid`, list, this.getHeader());
  }

  UpdateIsTBaoHuyKhongDuocChapNhan() {
    return this.http.get(`${this.apiURL}UpdateIsTBaoHuyKhongDuocChapNhan`, this.getHeader());
  }

  GetHoaDonMttYeuCauHuy() {
    return this.http.get(`${this.apiURL}GetHoaDonMttYeuCauHuy`, this.getHeader());
  }

  XacNhanHoaDonDaGuiChoKhachHang(id: any){
    return this.http.get(`${this.apiURL}XacNhanHoaDonDaGuiChoKhachHang/${id}`, this.getHeader());
  }

  UpdateLanGui04() {
    return this.http.get(`${this.apiURL}UpdateLanGui04`, this.getHeader());
  }
}
