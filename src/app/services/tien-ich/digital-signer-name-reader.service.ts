import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { EnvService } from 'src/app/env.service';
import { getHeader } from 'src/app/shared/SharedFunction';

/**
 * Lớp này thực hiện các nhiệm vụ:
  - Đọc thông tin người bán từ mẫu hóa đơn theo các trường hợp khác nhau.
  - Đọc ra tên người ký theo các điều kiện/trường hợp khác nhau.
  - Gửi lệnh socket để đọc thông tin người ký từ chữ ký số.
*/
@Injectable({
  providedIn: 'root'
})
export class DigitalSignerNameReaderService {
  baseUrl = this.env.apiUrl + '/api/DigitalSignerNameReader/';

  constructor(
    private http: HttpClient,
    private env: EnvService) { }

  /**
   * Đọc ra thông tin của người bán trên mẫu hóa đơn của hóa đơn điện tử.
   * @param hoaDonDienTuIds Là mảng các id của hóa đơn điện tử cần đọc thông tin.
  */
  GetThongTinNguoiBanTuHoaDonAsync(hoaDonDienTuIds: string[]) {
    return this.http.post(`${this.baseUrl}GetThongTinNguoiBanTuHoaDon`, hoaDonDienTuIds, getHeader()).toPromise();
  }

  /**
   * Đọc ra tên người ký theo các điều kiện/trường hợp khác nhau.
   * @param signerNameParams Là tham số điều kiện.
   */
  GetUnifiedSignerName(signerNameParams: any) {
    return this.http.post(`${this.baseUrl}GetUnifiedSignerName`, signerNameParams, getHeader());
  }

  /**
   * Đọc ra tên người ký theo các điều kiện/trường hợp khác nhau sử dụng phương thức toPromise.
   * @param signerNameParams Là tham số điều kiện.
   */
   GetUnifiedSignerNameAsync(signerNameParams: any) {
    return this.http.post(`${this.baseUrl}GetUnifiedSignerName`, signerNameParams, getHeader()).toPromise();
  }
}
