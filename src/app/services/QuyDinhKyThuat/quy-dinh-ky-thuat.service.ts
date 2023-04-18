import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
    providedIn: 'root'
})
export class QuyDinhKyThuatService {
    public apiURL = this.env.apiUrl + '/api/ThongDiepGuiToKhaiDKTTHoaDon';
    public apiURL_2 = this.env.apiUrl + '/api/ThongDiepPhanHoi';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    GetXMLToKhai(data: any) {
        return this.http.post(`${this.apiURL}/GetXMLToKhai`, data, getHeader());
    }

    GetXMLThongDiepToKhai(data: any) {
        return this.http.post(`${this.apiURL}/GetXMLThongDiepToKhai`, data, getHeader());
    }

    LuuToKhaiDangKyThongTin(data: any) {
        return this.http.post(`${this.apiURL}/LuuToKhaiDangKyThongTin`, data, getHeader());
    }

    SuaToKhaiDangKyThongTin(data: any) {
        return this.http.post(`${this.apiURL}/SuaToKhaiDangKyThongTin`, data, getHeader());
    }

    XoaToKhai(id: string) {
        return this.http.delete(`${this.apiURL}/XoaToKhai/${id}`, getHeader());
    }

    GetToKhaiById(id: string) {
        return this.http.get(`${this.apiURL}/GetToKhaiById/${id}`, getHeader());
    }

    LuuDuLieuKy(data: any) {
        return this.http.post(`${this.apiURL}/LuuDuLieuKy`, data, getHeader());
    }

    LuuDuLieuGuiToKhai(data: any) {
        return this.http.post(`${this.apiURL}/LuuDuLieuGuiToKhai`, data, getHeader());
    }

    GuiToKhai(data: any) {
        return this.http.post(`${this.apiURL}/GuiToKhai`, data, getHeader());
    }

    CheckToKhaiThayDoiThongTinTruocKhiKyVaGui(id: any) {
        return this.http.get(`${this.apiURL}/CheckToKhaiThayDoiThongTinTruocKhiKyVaGui/${id}`, getHeader());
    }

    NhanPhanHoiCQT(data: any) {
        return this.http.post(`${this.apiURL}/NhanPhanHoiCQT`, data, getHeader());
    }

    GetAllPagingThongDiepChung(data: any) {
        return this.http.post(`${this.apiURL}/GetAllPagingThongDiepChung`, data, getHeader());
    }

    InsertThongDiepChung(data: any) {
        return this.http.post(`${this.apiURL}/InsertThongDiepChung`, data, getHeader());
    }

    UpdateThongDiepChung(data: any) {
        return this.http.post(`${this.apiURL}/UpdateThongDiepChung`, data, getHeader());
    }

    DeleteThongDiepChung(id: string) {
        return this.http.delete(`${this.apiURL}/DeleteThongDiepChung/${id}`, getHeader());
    }

    GetThongDiepChungById(id: string) {
        return this.http.get(`${this.apiURL}/GetThongDiepChungById/${id}`, getHeader());
    }

    GetListDangKyUyNhiem(idToKhai: string) {
        return this.http.get(`${this.apiURL}/GetListDangKyUyNhiem/${idToKhai}`, getHeader());
    }

    GetListTrungKyHieuTrongHeThong(data: any) {
        return this.http.post(`${this.apiURL}/GetListTrungKyHieuTrongHeThong`, data, getHeader());
    }

    GetAllThongDiepTraVe(thongDiepGocId: string) {
        return this.http.get(`${this.apiURL}/GetAllThongDiepTraVe/${thongDiepGocId}`, getHeader());
    }

    GetListLoaiThongDiepNhan() {
        return this.http.get(`${this.apiURL}/GetListLoaiThongDiepNhan`, getHeader());
    }

    GetListLoaiThongDiepGui() {
        return this.http.get(`${this.apiURL}/GetListLoaiThongDiepGui`, getHeader());
    }

    GetThongDiepByThamChieu(thamChieuId: string) {
        return this.http.get(`${this.apiURL}/GetThongDiepByThamChieu/${thamChieuId}`, getHeader());
    }

    GetLanThuMax(MaLoaiThongDiep: number) {
        return this.http.get(`${this.apiURL}/GetLanThuMax?MaLoaiThongDiep=${MaLoaiThongDiep}`, getHeader());
    }

    GetLanGuiMax(td: any) {
        return this.http.post(`${this.apiURL}/GetLanGuiMax`, td, getHeader());
    }

    GetThongDiepThemMoiToKhai() {
        return this.http.get(`${this.apiURL}/GetThongDiepThemMoiToKhai`, getHeader());
    }

    CheckChuaLapToKhai() {
        return this.http.get(`${this.apiURL}/CheckChuaLapToKhai`, getHeader());
    }

    GetThongDiepThemMoiToKhaiDuocChapNhan() {
        return this.http.get(`${this.apiURL}/GetThongDiepThemMoiToKhaiDuocChapNhan`, getHeader());
    }

    GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu(maTraCuu: string) {
        return this.http.get(`${this.apiURL}/GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu1/${maTraCuu}`);
    }

    GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu1(inputTraCuu: any) {
        return this.http.post(`${this.apiURL}/GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu2`, inputTraCuu);
    }

    ConvertToThongDiepTiepNhan(encodedContent: string) {
        return this.http.post(`${this.apiURL}/ConvertToThongDiepTiepNhan`, encodedContent, getHeader());
    }

    ConvertToThongDiepKUNCQT(encodedContent: string) {
        return this.http.post(`${this.apiURL}/ConvertToThongDiepKUNCQT`, encodedContent, getHeader());
    }

    ConvertToThongDiepUNCQT(encodedContent: string) {
        return this.http.post(`${this.apiURL}/ConvertToThongDiepUNCQT`, encodedContent, getHeader());
    }

    ShowThongDiepFromFileById(id: string) {
        return this.http.get(`${this.apiURL}/ShowThongDiepFromFileById/${id}`, getHeader());
    }

    ExportBangKe(data: any) {
        return this.http.post(`${this.apiURL}/ExportBangKe`, data, { ...getHeader(), responseType: 'blob' });
    }

    GetNoiDungThongDiepPhanHoi(model: any) {
        return this.http.post(`${this.apiURL_2}/GetNoiDungThongDiepPhanHoi`, model, getHeader());
    }

    GetListToKhaiFromBoKyHieuHoaDon(model: any) {
        return this.http.post(`${this.apiURL}/GetListToKhaiFromBoKyHieuHoaDon`, model, getHeader());
    }

    AddRangeDangKyUyNhiem(models: any[]) {
        return this.http.post(`${this.apiURL}/AddRangeDangKyUyNhiem`, models, getHeader());
    }

    GetLinkFileXml(params: any) {
        return this.http.post(`${this.apiURL}/GetLinkFileXml`, params, getHeader());
    }

    AddRangeChungThuSo(models: any[]) {
        return this.http.post(`${this.apiURL}/AddRangeChungThuSo`, models, getHeader());
    }

    DeleteRangeChungThuSo(models: any[]) {
        return this.http.post(`${this.apiURL}/DeleteRangeChungThuSo`, models, getHeader());
    }

    GetListTimKiemTheoThongDiep() {
        return this.http.get(`${this.apiURL}/GetListTimKiemTheoThongDiep`, getHeader());
    }

    GetAllListCTS() {
        return this.http.get(`${this.apiURL}/GetAllListCTS`, getHeader());
    }

    GetNoiDungThongDiepXMLChuaKy(thongDiepId: any) {
        console.log(thongDiepId);
        return this.http.get(`${this.apiURL}/GetNoiDungThongDiepXMLChuaKy/${thongDiepId}`, getHeader());
    }

    GetTrangThaiGuiPhanHoiTuCQT(maLoaiThongDiep: any) {
        return this.http.get(`${this.apiURL}/GetTrangThaiGuiPhanHoiTuCQT/${maLoaiThongDiep}`, getHeader());
    }

    GetAllThongDiepTraVeV2(giaTriTimKiem: string, phanLoai: string) {
        return this.http.get(`${this.apiURL}/GetAllThongDiepTraVeV2/${giaTriTimKiem}/${phanLoai}`, getHeader());
    }

    GetXmlContentThongDiep(maThongDiep: string) {
        return this.http.get(`${this.apiURL}/GetXmlContentThongDiep/${maThongDiep}`, getHeader());
    }

    ThongKeSoLuongThongDiep(trangThaiGuiThongDiep: number, coThongKeSoLuong: number) {
        return this.http.get(`${this.apiURL}/ThongKeSoLuongThongDiep?trangThaiGuiThongDiep=${trangThaiGuiThongDiep}&coThongKeSoLuong=${coThongKeSoLuong}`, getHeader());
    }

    ThongKeSoLuongThongDiepHoaDonCanRaSoat(coThongKeSoLuong: number) {
        return this.http.get(`${this.apiURL}/ThongKeSoLuongThongDiepHoaDonCanRaSoat?coThongKeSoLuong=${coThongKeSoLuong}`, getHeader());
    }

    HasChuyenTheoBangTongHopDuLieuHDDT(boKyHieuHoaDonId: any) {
        return this.http.get(`${this.apiURL}/HasChuyenTheoBangTongHopDuLieuHDDT/${boKyHieuHoaDonId}`, getHeader());
    }

    ConvertThongDiepToFilePDF(data: any) {
        return this.http.post(`${this.apiURL_2}/ConvertThongDiepToFilePDF`, data, getHeader());
    }

    GetThongDiepChungByMaThongDiep(maThongDiep: string) {
        return this.http.get(`${this.apiURL}/GetThongDiepChungByMaThongDiep/${maThongDiep}`, getHeader());
    }

    IsHasToKhaiDuocChapNhan() {
        return this.http.get(`${this.apiURL}/IsHasToKhaiDuocChapNhan`, getHeader())
    }

    GetThongDiep103FromFile(formData: any) {
        return this.http.post(`${this.apiURL}/GetThongDiep103FromFile`, formData, getHeader());
    }

    XacNhanToKhai01(formData: any) {
        return this.http.post(`${this.apiURL}/XacNhanToKhai01`, formData, getHeader());
    }

    VerifyFile103(formData: any) {
        return this.http.post(`${this.apiURL}/VerifyFile103`, formData, getHeader());
    }

    CheckThongDiep103(formData: any) {
        return this.http.post(`${this.apiURL}/CheckThongDiep103`, formData, getHeader());
    }

    UpdateFile103(data: any) {
        return this.http.post(`${this.apiURL}/UpdateFile103`, data, getHeader());
    }

    UpdateFile103AndMCQTToHoSo(data: any, maCQT: string) {
        return this.http.post(`${this.apiURL}/UpdateFile103AndMCQTToHoSo?MaCQT=${maCQT}`, data, getHeader());
    }

    
    GetFile103Imported(data: any) {
        return this.http.get(`${this.apiURL}/GetFile103Imported?FileId=${data}`,getHeader());
    }
}
 