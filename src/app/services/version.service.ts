import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  public apiURL = 'https://qlkh.pmbk.vn/api/';

  constructor(private http: HttpClient,
    private message: NzMessageService,
    private datepipe: DatePipe,
    private env: EnvService
  ) { }

  public getHeader() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
      })
    };
  }
 
  GetVersion() {
    return this.http.get(`${this.apiURL}Version/GetByType/1`, this.getHeader());
  }
  GetVersionPromise() {
    return this.http.get(`${this.apiURL}Version/GetByType/1`, this.getHeader()).toPromise();
  }
}
