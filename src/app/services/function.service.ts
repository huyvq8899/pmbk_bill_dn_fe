import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PagingParams } from '../models/PagingParams';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  public apiURL = this.env.apiUrl + '/api/';

    constructor(private http: HttpClient,
        private env: EnvService) { }

  public getHeader() {
    return {
       // tslint:disable-next-line:object-literal-key-quotes
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('tokenKey')}` })
    };
  }

  GetAllForTreeByRole(roleId: string, toanQuyen: boolean = false) {
    console.log(roleId);
    if(roleId != undefined && roleId != null){
      var params = {
        roleId: roleId,
        toanQuyen: toanQuyen
      }
      return this.http.post(`${this.apiURL}Function/GetAllForTreeByRole`, params, this.getHeader());
    }
  }

  GetAllForTreeByUser(userId: string) {
    return this.http.get(`${this.apiURL}Function/GetAllForTreeByUser/` + userId, this.getHeader());
  }

  GetThaoTacByFunction(functionId: string, roleId: string){
    return this.http.get(`${this.apiURL}Function/GetThaoTacByFunction?FunctionId=` + functionId + `&RoleId=` + roleId, this.getHeader());
  }

  InsertUpdateThaoTacToFunction(data: any){
    return this.http.post(`${this.apiURL}Function/InsertUpdateThaoTacToFunction`, data, this.getHeader());
  }

  InsertUpdateMultipleThaoTacToFunction(data: any[]){
    return this.http.post(`${this.apiURL}Function/InsertUpdateMultipleThaoTacToFunction`, data, this.getHeader());
  }
}
