import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
@Injectable({
  providedIn: 'root'
})
export class ESignCloudService {


  public apiURL = this.env.apiUrl + '/api/ESignCloud/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  public getHeader() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Content-Type': 'application/json'
      })
    };
  }

  SignCloudFile(dataJson: any) {
    const url = `${this.apiURL}SignCloudFile`;
    return this.http.post(url, dataJson, this.getHeader());
  }

  GetInfoSignCloud(data: any) {
    const url = `${this.apiURL}GetInfoSignCloud/` + data;
    return this.http.get(url, this.getHeader());
  }
}
