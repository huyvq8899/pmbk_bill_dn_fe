import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

@Injectable({
    providedIn: 'root'
})
export class HoSoHDDTService {
    public apiURL = this.env.apiUrl + '/api/HoSoHDDT';

    constructor(
        private http: HttpClient,
        private env: EnvService) { }

    GetDetail() {
        return this.http.get(`${this.apiURL}/GetDetail`, getHeader());
    }

    GetDetailAsync() {
        return this.http.get(`${this.apiURL}/GetDetail`, getHeader()).toPromise();
    }

    GetListCoQuanThueCapCuc() {
        return this.http.get(`${this.apiURL}/GetListCoQuanThueCapCuc`, getHeader());
    }

    GetListCoQuanThueQuanLy() {
        return this.http.get(`${this.apiURL}/GetListCoQuanThueQuanLy`, getHeader());
    }

    GetListCity() {
        return this.http.get(`${this.apiURL}/GetListCity`, getHeader());
    }

    GetDanhSachChungThuSoSuDung() {
        return this.http.get(`${this.apiURL}/GetDanhSachChungThuSoSuDung`, getHeader());
    }

    Insert(data: any) {
        return this.http.post(`${this.apiURL}/Insert`, data, getHeader());
    }

    Update(data: any) {
        return this.http.put(`${this.apiURL}/Update`, data, getHeader());
    }
}
