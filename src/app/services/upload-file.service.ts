import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';
import { getHeader } from '../shared/SharedFunction';
import { TaiLieuDinhKem } from '../models/UploadFileModel';

@Injectable({
    providedIn: 'root'
})
export class UploadFileService {
    public apiURL = this.env.apiUrl + '/api/UploadFile';

    constructor(private http: HttpClient,
        private env: EnvService) { }

    InsertFileAttaches(model: TaiLieuDinhKem, formData: FormData) {
        formData.append('nghiepVuId', model.nghiepVuId);
        formData.append('loaiNghiepVu', model.loaiNghiepVu.toString());
        model.removedFileIds.forEach((item) => formData.append('removedFileIds[]', item));
        return this.http.post(`${this.apiURL}/InsertFileAttaches`, formData, getHeader());
    }

    InsertFileMauHoaDon(formData: FormData) {
        return this.http.post(`${this.apiURL}/InsertFileMauHoaDon`, formData, getHeader());
    }

    DeleteFileAttach(model: TaiLieuDinhKem) {
        return this.http.post(`${this.apiURL}/DeleteFileAttach`, model, getHeader());
    }

    GetFilesById(id: string) {
        return this.http.get(`${this.apiURL}/GetFilesById/` + id, getHeader());
    }

    CheckExistsFilesById(id: string) {
        return this.http.get(`${this.apiURL}/CheckExistsFilesById/` + id, getHeader());
    }

    DownloadFile(urlFile: string)
    {
        return this.http.get(urlFile, { responseType: 'blob' });
    }
}
