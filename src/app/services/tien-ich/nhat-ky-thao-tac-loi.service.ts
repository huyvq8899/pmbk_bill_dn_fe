import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/env.service';
import { getHeader, getNoiDungLoiKyDienTuChoNhatKy } from 'src/app/shared/SharedFunction';

@Injectable({
  providedIn: 'root'
})
export class NhatKyThaoTacLoiService {
  public apiURL = this.env.apiUrl + '/api/NhatKyThaoTacLoi';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  GetByDetail(id: string, thaoTacLoi: any) {
    return this.http.get(`${this.apiURL}/GetByDetail/${id}/${thaoTacLoi}`, getHeader());
  }

  GetByRefId(id: string) {
    return this.http.get(`${this.apiURL}/GetByRefId/` + id, getHeader());
  }

  Insert(refId: any, inputMessage: any) {
    var msgData = getNoiDungLoiKyDienTuChoNhatKy(inputMessage);
    const model = {
      moTa: msgData.moTa,
      huongDanXuLy: msgData.huongDanXuLy,
      refId: refId
    };

    return this.http.post(`${this.apiURL}/Insert`, model, getHeader());
  }
}
