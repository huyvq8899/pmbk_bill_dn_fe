import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';
import { PagingParams } from 'src/app/models/PagingParams';
import { MauHoaDonThietLapMacDinh, MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { LoaiChiTietTuyChonNoiDung, LoaiThietLapMacDinh, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { map } from 'rxjs/operators';
import { CookieConstant } from 'src/app/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class MauHoaDonService {
  public apiURL = this.env.apiUrl + '/api/MauHoaDon';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  CheckAllowUpdate(data: any) {
    return this.http.post(`${this.apiURL}/CheckAllowUpdate`, data, getHeader());
  }

  GetListMauDaDuocChapNhan() {
    return this.http.get(`${this.apiURL}/GetListMauDaDuocChapNhan`, getHeader());
  }

  GetListMauHoaDon(params: any) {
    return this.http.post(`${this.apiURL}/GetListMauHoaDon`, params, getHeader());
  }

  GetChiTietByMauHoaDon(mauHoaDonId: string) {
    return this.http.get(`${this.apiURL}/GetChiTietByMauHoaDon/` + mauHoaDonId, getHeader());
  }

  GetMauHoaDonBackgrounds() {
    return this.http.get(`${this.apiURL}/GetMauHoaDonBackgrounds`, getHeader());
  }

  GetBackgrounds() {
    return this.http.get(`${this.apiURL}/GetBackgrounds`, getHeader());
  }

  GetBorders() {
    return this.http.get(`${this.apiURL}/GetBorders`, getHeader());
  }

  GetBorderA5s() {
    return this.http.get(`${this.apiURL}/GetBorderA5s`, getHeader());
  }

  GetAll(params: any = null) {
    if (!params) {
      params = {};
    }
    return this.http.post(`${this.apiURL}/GetAll`, params, getHeader());
  }

  GetAllPaging(params: PagingParams) {
    return this.http.post(`${this.apiURL}/GetAllPaging`, params, getHeader());
  }

  GetById(id: string) {
    return this.http.get(`${this.apiURL}/GetById/` + id, getHeader())
      .pipe(
        map((res: any) => {
          if (res.mauHoaDonThietLapMacDinhs && res.mauHoaDonThietLapMacDinhs.length > 0) {
            res.mauHoaDonThietLapMacDinhs.forEach((item: any) => {
              if (item.loai === LoaiThietLapMacDinh.Logo) {
                res.anhLogo = item.giaTri ? item.imgBase64 : null;

                console.log('res.anhLogo: ', res.anhLogo);

                res.tenLogo = item.giaTri;
                const giaTriBoSungs = (item.giaTriBoSung as string).split(';').map(x => parseFloat(x));
                res.topLogo = giaTriBoSungs[0];
                res.leftLogo = giaTriBoSungs[1];
                res.widthLogo = giaTriBoSungs[2];
                res.heightLogo = giaTriBoSungs[3];
                res.viTriLogo = giaTriBoSungs[4];
              }
              if (item.loai === LoaiThietLapMacDinh.KieuChu) {
                res.fontChu = item.giaTri;
              }
              if (item.loai === LoaiThietLapMacDinh.CoChu) {
                res.coChu = parseInt(item.giaTri);
              }
              if (item.loai === LoaiThietLapMacDinh.MauChu) {
                res.mauChu = item.giaTri;
              }
              if (item.loai === LoaiThietLapMacDinh.HienThiQRCode) {
                res.isHienThiQRCode = item.giaTri === 'true';
              }
              if (item.loai === LoaiThietLapMacDinh.LapLaiThongTinKhiHoaDonCoNhieuTrang) {
                res.isLapLaiTTHDCoNhieuTrang = item.giaTri === 'true';
              }
              if (item.loai === LoaiThietLapMacDinh.ThietLapDongKyHieuCot) {
                res.isThietLapDongKyHieuCot = item.giaTri === 'true';
              }
              if (item.loai === LoaiThietLapMacDinh.SoDongTrang) {
                res.soDongTrang = parseInt(item.giaTri);
              }
              if (item.loai === LoaiThietLapMacDinh.HinhNenMacDinh) {
                res.codeHinhNenMacDinh = item.giaTri ? parseInt(item.giaTri) : null;
                const giaTriBoSungs = ((item.giaTriBoSung || 'null') as string).split(';');
                res.hinhNenMacDinh = giaTriBoSungs[0] === 'null' ? null : giaTriBoSungs[0];

                if (giaTriBoSungs.length > 1 && giaTriBoSungs[1]) {
                  res.mauHinhNenMacDinh = giaTriBoSungs[1];
                } else {
                  res.mauHinhNenMacDinh = '#000000';
                }

                if (giaTriBoSungs.length > 1 && giaTriBoSungs[2]) {
                  res.opacityHinhNenMacDinh = parseFloat(giaTriBoSungs[2]);
                } else {
                  res.opacityHinhNenMacDinh = 0.35;
                }
                res.opacityHinhNenMacDinhPer = Math.round(res.opacityHinhNenMacDinh * 100);
              }
              if (item.loai === LoaiThietLapMacDinh.HinhNenTaiLen) {
                res.hinhNenTaiLen = item.giaTri ? item.imgBase64 : null;
                res.tenHinhNenTaiLen = item.giaTri;
                const giaTriBoSungs = (item.giaTriBoSung as string).split(';');
                res.topHinhNenTaiLen = parseFloat(giaTriBoSungs[0]);
                res.leftHinhNenTaiLen = parseFloat(giaTriBoSungs[1]);
                res.widthHinhNenTaiLen = parseFloat(giaTriBoSungs[2]);
                res.heightHinhNenTaiLen = parseFloat(giaTriBoSungs[3]);
                res.opacityHinhNenTaiLen = parseFloat(giaTriBoSungs[4]);
                res.opacityHinhNenTaiLenPer = Math.round(res.opacityHinhNenTaiLen * 100);

                if (giaTriBoSungs[5]) {
                  res.loaiHinhNenRieng = parseInt(giaTriBoSungs[5]);
                } else {
                  res.loaiHinhNenRieng = 1;
                }

                if (giaTriBoSungs[6]) {
                  res.viTriHinhNen = parseInt(giaTriBoSungs[6]);
                } else {
                  res.viTriHinhNen = 2;
                }

                if (giaTriBoSungs.length > 7 && giaTriBoSungs[7]) {
                  let chuChimData = null;
                  if (giaTriBoSungs[7]) {
                    chuChimData = JSON.parse(decodeURIComponent(atob(giaTriBoSungs[7])));
                  }

                  if (chuChimData && Object.keys(chuChimData).length !== 0) {
                    res.kieuChuChim = chuChimData.kieuChuChim;
                    res.coChuChim = parseInt(chuChimData.coChuChim);
                    res.boldChuChim = chuChimData.boldChuChim;
                    res.italicChuChim = chuChimData.italicChuChim;
                    res.mauChuChim = chuChimData.mauChuChim;
                    res.doNetChuChim = parseFloat(chuChimData.doNetChuChim);
                    res.doNetChuChimPer = Math.round(res.doNetChuChim * 100);
                    res.noiDungChuChim = chuChimData.noiDungChuChim;
                  } else {
                    res.kieuChuChim = 'Arial';
                    res.coChuChim = 80;
                    res.boldChuChim = false;
                    res.italicChuChim = false;
                    res.mauChuChim = '#000000';
                    res.doNetChuChim = 0.35;
                    res.doNetChuChimPer = 35;
                    res.noiDungChuChim = null;
                  }
                } else {
                  res.kieuChuChim = 'Arial';
                  res.coChuChim = 80;
                  res.boldChuChim = false;
                  res.italicChuChim = false;
                  res.mauChuChim = '#000000';
                  res.doNetChuChim = 0.35;
                  res.doNetChuChimPer = 35;
                  res.noiDungChuChim = null;
                }
              }
              if (item.loai === LoaiThietLapMacDinh.KhungVienMacDinh) {
                res.codeKhungVienMacDinh = item.giaTri ? parseInt(item.giaTri) : null;
                const giaTriBoSungs = ((item.giaTriBoSung || 'null') as string).split(';');
                res.khungVienMacDinh = giaTriBoSungs[0] === 'null' ? null : giaTriBoSungs[0];

                if (giaTriBoSungs.length > 1 && giaTriBoSungs[1]) {
                  res.mauKhungVienMacDinh = giaTriBoSungs[1];
                } else {
                  res.mauKhungVienMacDinh = '#000000';
                }
              }
            });

            res.mauHoaDonTuyChinhChiTiets.forEach((parent: MauHoaDonTuyChonChiTiet) => {
              parent.children.forEach((child: MauHoaDonTuyChonChiTiet) => {
                if (child.loai === LoaiTuyChinhChiTiet.ThongTinNguoiBan &&
                  child.tuyChonChiTiet.isTuyChinhGiaTri == null &&
                  child.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.CustomNguoiBan) {
                  child.tuyChonChiTiet.isTuyChinhGiaTri = false;
                }

                if (child.loaiContainer === 1) {
                  parent.tieuDe = child;
                } else if (child.loaiContainer === 2) {
                  parent.noiDung = child;
                } else {
                  parent.kyHieuCot = child;
                }

                if (child.loaiChiTiet < 0 || child.loaiChiTiet === LoaiChiTietTuyChonNoiDung.GhiChuBenMua) {
                  child.dataFieldName = LoaiChiTietTuyChonNoiDung[child.loaiChiTiet] + child.customKey;
                } else {
                  child.dataFieldName = LoaiChiTietTuyChonNoiDung[child.loaiChiTiet];
                }
              });
            });
            res.tuyChonChiTiets = res.mauHoaDonTuyChinhChiTiets;
          }

          return res;
        })
      );
  }

  GetNgayKyById(id: string) {
    return this.http.get(`${this.apiURL}/GetNgayKyById/` + id, getHeader());
  }

  GetNgayKyByIdAsync(id: string) {
    return this.http.get(`${this.apiURL}/GetNgayKyById/` + id, getHeader()).toPromise();
  }

  GetListQuyDinhApDung() {
    return this.http.get(`${this.apiURL}/GetListQuyDinhApDung`, getHeader());
  }

  GetListLoaiHoaDon() {
    return this.http.get(`${this.apiURL}/GetListLoaiHoaDon`, getHeader());
  }

  GetListLoaiMau() {
    return this.http.get(`${this.apiURL}/GetListLoaiMau`, getHeader());
  }

  GetListLoaiThueGTGT() {
    return this.http.get(`${this.apiURL}/GetListLoaiThueGTGT`, getHeader());
  }

  GetListLoaiNgonNgu() {
    return this.http.get(`${this.apiURL}/GetListLoaiNgonNgu`, getHeader());
  }

  GetListLoaiKhoGiay() {
    return this.http.get(`${this.apiURL}/GetListLoaiKhoGiay`, getHeader());
  }

  CheckTrungTenMauHoaDon(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungTenMauHoaDon`, data, getHeader());
  }

  CheckTrungTenMauHoaDonAsync(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungTenMauHoaDon`, data, getHeader()).toPromise();
  }

  CheckTrungTenMauHoaDon1Async(data: any) {
    return this.http.post(`${this.apiURL}/CheckTrungTenMauHoaDon`, data, getHeader());
  }

  CheckPhatSinh(id: string) {
    return this.http.get(`${this.apiURL}/CheckPhatSinh/` + id, getHeader());
  }
  Delete(id: string) {
    return this.http.delete(`${this.apiURL}/Delete/` + id, getHeader());
  }

  Insert(data: any) {
    data.mauHoaDonThietLapMacDinhs = this._ConvertObjectToListThietLapMacDinh(data);
    data.mauHoaDonTuyChinhChiTiets = this._ConvertListTuyChonChiTietToListMauHoaDonTuyChinhChiTiet(data);
    return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
  }
  Update(data: any) {
    data.mauHoaDonThietLapMacDinhs = this._ConvertObjectToListThietLapMacDinh(data);
    data.mauHoaDonTuyChinhChiTiets = this._ConvertListTuyChonChiTietToListMauHoaDonTuyChinhChiTiet(data);
    return this.http.put(`${this.apiURL}/Update`, data, getHeader());
  }

  _ConvertListTuyChonChiTietToListMauHoaDonTuyChinhChiTiet(data: any) {
    const result: MauHoaDonTuyChonChiTiet[] = [];

    data.tuyChonChiTiets.forEach((parent: MauHoaDonTuyChonChiTiet) => {
      parent.mauHoaDonTuyChinhChiTietId = null;
      parent.mauHoaDonId = null;
      result.push(parent);

      parent.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
        item.mauHoaDonTuyChinhChiTietId = null;
        item.mauHoaDonId = null;
        item.tuyChinhChiTiet = JSON.stringify(item.tuyChonChiTiet);
        result.push(item);
      });
    });

    return result;
  };

  _ConvertObjectToListThietLapMacDinh(data: any) {
    let chuChimData = null;
    if (data.loaiHinhNenRieng) {
      chuChimData = {
        kieuChuChim: data.kieuChuChim,
        coChuChim: data.coChuChim,
        boldChuChim: data.boldChuChim,
        italicChuChim: data.italicChuChim,
        mauChuChim: data.mauChuChim,
        doNetChuChim: data.doNetChuChim,
        noiDungChuChim: data.noiDungChuChim
      };
    };

    data.topLogo = data.topLogo || 0;
    data.leftLogo = data.leftLogo || -2;
    data.widthLogo = data.widthLogo || 0;
    data.heightLogo = data.heightLogo || 0;
    data.viTriLogo = data.viTriLogo || 1;

    const thietLapMacDinhs: MauHoaDonThietLapMacDinh[] = [
      { Loai: LoaiThietLapMacDinh.Logo, GiaTri: data.tenLogo, GiaTriBoSung: `${data.topLogo};${data.leftLogo};${data.widthLogo};${data.heightLogo};${data.viTriLogo}` },
      { Loai: LoaiThietLapMacDinh.KieuChu, GiaTri: data.fontChu, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.CoChu, GiaTri: data.coChu, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.MauChu, GiaTri: data.mauChu, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.HienThiQRCode, GiaTri: data.isHienThiQRCode, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.LapLaiThongTinKhiHoaDonCoNhieuTrang, GiaTri: data.isLapLaiTTHDCoNhieuTrang, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.ThietLapDongKyHieuCot, GiaTri: data.isThietLapDongKyHieuCot, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.SoDongTrang, GiaTri: data.soDongTrang, GiaTriBoSung: null },
      { Loai: LoaiThietLapMacDinh.HinhNenMacDinh, GiaTri: data.codeHinhNenMacDinh, GiaTriBoSung: `${data.hinhNenMacDinh};${data.mauHinhNenMacDinh};${data.opacityHinhNenMacDinh}` },
      { Loai: LoaiThietLapMacDinh.HinhNenTaiLen, GiaTri: data.tenHinhNenTaiLen, GiaTriBoSung: `${data.topHinhNenTaiLen};${data.leftHinhNenTaiLen};${data.widthHinhNenTaiLen};${data.heightHinhNenTaiLen};${data.opacityHinhNenTaiLen};${data.loaiHinhNenRieng};${data.viTriHinhNen};${btoa(encodeURIComponent(JSON.stringify(chuChimData)))}` },
      { Loai: LoaiThietLapMacDinh.KhungVienMacDinh, GiaTri: data.codeKhungVienMacDinh, GiaTriBoSung: `${data.khungVienMacDinh};${data.mauKhungVienMacDinh}` },
    ];

    return thietLapMacDinhs;
  }

  UpdateNgayKy(data: any) {
    return this.http.put(`${this.apiURL}/UpdateNgayKy`, data, getHeader());
  }

  GetAllMauHoaDon() {
    return this.http.get(`${this.apiURL}/GetAllMauHoaDon`, getHeader());
  }

  GetListNhatKyHoaDon(id: string) {
    return this.http.get(`${this.apiURL}/GetListNhatKyHoaDon/` + id, getHeader());
  }

  GetAllKyHieuHoaDon(ms: string = "") {
    const params = { mauSo: ms };
    return this.http.post(`${this.apiURL}/GetAllKyHieuHoaDon`, params, getHeader());
  }

  GetListFromBoKyHieuHoaDon(params: any) {
    return this.http.post(`${this.apiURL}/GetListFromBoKyHieuHoaDon`, params, getHeader());
  }

  PreviewPdf(mauHoaDonId: string, loai: any, kyHieu = '', loaiFile = 0) {
    const params = {
      mauHoaDonId,
      loai,
      loaiFile,
      kyHieu
    };

    return this.http.post(`${this.apiURL}/PreviewPdf`, params, { ...getHeader(), responseType: 'blob' });
  }

  DownloadFile(mauHoaDonId: string, loai: any, kyHieu = '', loaiFile = 0) {
    const params = {
      mauHoaDonId,
      loai,
      loaiFile,
      kyHieu
    };

    return this.http.post(`${this.apiURL}/DownloadFile`, params, { ...getHeader(), responseType: 'blob' });
  }

  ExportMauHoaDon(params: any) {
    return this.http.post(`${this.apiURL}/ExportMauHoaDon`, params, { ...getHeader(), responseType: 'blob' });
  }

  GetFileToSign() {
    return this.http.get(`${this.apiURL}/GetFileToSign`, getHeader());
  }

  CheckXoaKyDienTu(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/CheckXoaKyDienTu/${mauHoaDonId}`, getHeader());
  }

  CheckAllowEditAsync(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/CheckXoaKyDienTu/${mauHoaDonId}`, getHeader()).toPromise();
  }

  GetByIdBasic(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/GetByIdBasic/${mauHoaDonId}`, getHeader());
  }

  PreviewPdfOfXacThuc(nhatKyXacThucBoKyHieuId: any, loai: any) {
    const params = {
      nhatKyXacThucBoKyHieuId,
      loai
    };

    return this.http.post(`${this.apiURL}/PreviewPdfOfXacThuc`, params, { ...getHeader(), responseType: 'blob' });
  }
  
  AddDocFiles(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/AddDocFiles/${mauHoaDonId}`, getHeader());
  }
  CheckExist(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/CheckExist/${mauHoaDonId}`, getHeader());
  }
  CheckExistAsync(mauHoaDonId: any) {
    return this.http.get(`${this.apiURL}/CheckExist/${mauHoaDonId}`, getHeader()).toPromise();
  }
}
