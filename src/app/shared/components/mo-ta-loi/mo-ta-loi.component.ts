import { Component, Input, OnInit } from '@angular/core';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { htmlDecode } from '../../SharedFunction';

@Component({
  selector: 'app-mo-ta-loi',
  templateUrl: './mo-ta-loi.component.html',
  styleUrls: ['./mo-ta-loi.component.scss']
})
export class MoTaLoiComponent implements OnInit {
  @Input() hoaDonDienTuId = null;
  @Input() thongDiepChungId = null;
  @Input() maThongDiep = null;
  @Input() trangThaiQuyTrinh = null;
  spinning = false;
checkIn = false;
  motaloi: any;
  constructor(
    private hoaDonDienTuService: HoaDonDienTuService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
  ) { }

  ngOnInit() {
    this.spinning = true;
    if (this.hoaDonDienTuId) {
      if (this.trangThaiQuyTrinh === TrangThaiQuyTrinh.KyDienTuLoi) {
        this.nhatKyThaoTacLoiService.GetByDetail(this.hoaDonDienTuId, 0)
          .subscribe((res: any[]) => {
            this.motaloi = '';

            for (let i = 0; i < res.length; i++) {
              const item = res[i];
              this.motaloi += `• ${i + 1}. Mô tả: ${item.moTa} | Hướng dẫn xử lý: ${item.huongDanXuLy} <br/>`;
            }

            this.spinning = false;
          });
      } else {
        this.hoaDonDienTuService.GetMaThongDiepInXMLSignedById(this.hoaDonDienTuId)
          .subscribe((res: any) => {
            if (res.result) {
              this.quyDinhKyThuatService.GetAllThongDiepTraVe(res.result).subscribe((list: any[]) => {
                if (list.length > 0) {
                  var tdNew = list[0];
                  this.quyDinhKyThuatService.ShowThongDiepFromFileById(tdNew.thongDiepChungId).subscribe((rs: any) => {
                    this.motaloi = rs.thongDiepChiTiet1s.map(x => x.moTaLoi).join("<br/>");
                    this.spinning = false;
                  });
                }
              });
            }
          });
      }
    }
    if (this.thongDiepChungId) {
      this.quyDinhKyThuatService.ShowThongDiepFromFileById(this.thongDiepChungId).subscribe((rs: any) => {
                    this.motaloi = rs.thongDiepChiTiet1s.map(x => x.moTaLoi).join("<br/>");
        this.spinning = false;
      });
    }
    if (this.maThongDiep) {
      this.quyDinhKyThuatService.GetAllThongDiepTraVe(this.maThongDiep).subscribe((list: any[]) => {
        if (list.length > 0) {
          var tdNew = list[0];
          this.quyDinhKyThuatService.ShowThongDiepFromFileById(tdNew.thongDiepChungId).subscribe((rs: any) => {
                    this.motaloi = rs.thongDiepChiTiet1s.map(x => x.moTaLoi).join("<br/>");
            this.spinning = false;
          });
        }
      });
    }
  }
  toHTML(input): any {
    if(document.getElementById('motaloi33') && !this.checkIn){
      if(input == undefined) input= "Đang tải...";
      console.log(input);
      document.getElementById('motaloi33').innerHTML = input;
      this.checkIn = true;
    }else{
      this.checkIn = false;
    }
    return '';
  }
}