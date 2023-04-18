import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AlertStartup } from '../models/alert-startup.model';
import { EnvService } from '../env.service';
import { getHeader } from '../shared/SharedFunction';



@Injectable({
  providedIn: 'root'
})
export class AlertStartupService {
  baseUrl = this.env.apiUrl + '/api/AlertStartup/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  addNew(orderCancel: any) {
    return this.http.post(this.baseUrl, orderCancel);
  }

  update(data: AlertStartup) {
    return this.http.put(`${this.baseUrl}Update`, data, getHeader());
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + id);
  }

  getAlertStartupActive() {
    return this.http.get(`${this.env.apiUrlQlkh}/api/AlertStartup/GetThongBaoDoanhNghiepPopup`);
    // return this.http.get(`${this.baseUrl}GetAlertStartupActive`, getHeader());
  }

}
