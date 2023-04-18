import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { EnvService } from '../env.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieConstant } from '../constants/constant';
import { bkdecodeKT } from '../functions/BKDecode';
import { TuyChonService } from './Config/tuy-chon.service';
import { PagingParams } from '../models/PagingParams';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiURL = this.env.apiUrl + '/api/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: any;
  data: any = { "username": "admin", "password": "admin" };

  constructor(
    private http: HttpClient,
    private router: Router,
    private env: EnvService,
    private cookieService: CookieService,
    private tuyChonService: TuyChonService
  ) { }

  public getHeader() {
    return {
      // tslint:disable-next-line:object-literal-key-quotes
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('tokenKey')}` })
    };
  }
  login(data: any) {
    this.cookieService.set(CookieConstant.TAXCODE, data.taxCode);
    localStorage.setItem(CookieConstant.TAXCODE, data.taxCode);

    return this.http.post(`${this.apiURL}auth/Login`, data).pipe(
      map((rs: any) => {
        if (rs.result === 1) {
          rs.tokenKey = bkdecodeKT(rs.tokenKey);
          localStorage.setItem('userName', rs.userName);
          localStorage.setItem('userId', rs.userId);
          localStorage.setItem('tokenKey', rs.tokenKey);
          this.decodedToken = this.jwtHelper.decodeToken(rs.tokenKey);
          localStorage.setItem('currentUser', JSON.stringify(rs.model));
          localStorage.setItem('urlInvoice', rs.urlInvoice);
          //
          localStorage.setItem(CookieConstant.COMPANYNAME, rs.tenDonVi);
          localStorage.setItem(CookieConstant.TYPEDETAIL, rs.typeDetail);
          localStorage.setItem(CookieConstant.KYKEKHAITHUE, rs.kyTinhThue === 0 ? 'Thang' : 'Quy');
          //
          localStorage.setItem(CookieConstant.SETTING, JSON.stringify(rs.setting));
          localStorage.setItem(CookieConstant.DATABASENAME, this.decodedToken.databaseName);
          //set thời gian login
          localStorage.setItem('ktbk_loginDate', new Date(Date.now()).toISOString().slice(0,10));
        }
        return { result: rs.result, tokenKey: rs.tokenKey };
      })
    );
  }
  loggedIn() {
    const token = localStorage.getItem('tokenKey');
    return !this.jwtHelper.isTokenExpired(token);
  }
  logout() {
    localStorage.removeItem('tokenKey');
    this.decodedToken = null;
    this.router.navigate(['/dang-nhap']);
  }

  loginqlkh(){
    return this.http.post(`${this.env.apiUrlQlkh}/api/auth/Login`, this.data).pipe(
      map((rs: any) => {
        if (rs.result === 1) {
          localStorage.setItem('qlkhTokenKey', rs.tokenKey);
        }
        return { result: rs.result, tokenKey: rs.tokenKey };
      })
    );
  }
  public getHeaderQlkh() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('qlkhTokenKey')}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': this.env.apiUrl
      })
    };
  }
  getLinkBaiVietFormQlkh(id:any){
    return this.http.get(`${this.env.apiUrlQlkh}/api/LinkBaiViet/GetByDanhMucId?id=` + id, this.getHeaderQlkh());
  }

  getAlertByIdFormQlkh(){
    return this.http.get(`${this.env.apiUrlQlkh}/api/AlertStartup/GetThongBaoDoanhNghiepCarousel`);
  }

  /// Call api get all root version

  GetAllVersionRootByType(data: PagingParams) {
    const str = `${this.env.apiUrlQlkh}/api/Version/GetAllVersionRootByType?SortValue=` + data.SortValue
      + `&SortKey=` + data.SortKey
      + `&PageSize=` + data.PageSize
      + `&PageNumber=` + data.PageNumber
      + `&Keyword=` + data.Keyword
      + `&fromDate=` + data.fromDate
      + `&toDate=` + data.toDate
      + `&Type=` + data.Type;

    return this.http.get(str);
  }
  /// Call api get child version
  GetAllVersionChildByParentId(data: any) {
    return this.http.post(`${this.env.apiUrlQlkh}/api/Version/GetAllVersionChildByParentId`, data, this.getHeaderQlkh());
  }

    /// API QLKH get link bai viet
    GetByDanhMucIdAndTypeAsync(id: any, type: number) {
      return this.http.get(`${this.env.apiUrlQlkh}/api/LinkBaiViet/GetByDanhMucIdAndTypeAsync/${id}?Type=` + type, this.getHeaderQlkh());
    }
}
