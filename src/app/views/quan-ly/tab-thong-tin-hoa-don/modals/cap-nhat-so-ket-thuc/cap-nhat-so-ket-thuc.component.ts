import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-cap-nhat-so-ket-thuc',
  templateUrl: './cap-nhat-so-ket-thuc.component.html',
  styleUrls: ['./cap-nhat-so-ket-thuc.component.scss']
})
export class CapNhatSoKetThucComponent implements OnInit {
  soLonNhatDaSinh: any;
  soCapNhat: any;
  soKeTiep: any;
  soCapNhatView: any;
  isAccept: any;
  isPassCondition = false;
  curentYear = new Date().getFullYear();
  sinhSoCurrentYear: any;
  isPassErrorValue = false;
  constructor(
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private message: NzMessageService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    this.GetHistorySinhSoHoaDonCMMTTien();
  }

  FoCusSoCapNhat() {
    this.soCapNhatView = this.soCapNhat;
  }

  BlurSoCapNhat() {
    this.soCapNhat = this.soCapNhatView;
    if(this.soCapNhatView) {
      this.soCapNhatView = this.viewNumber11KyTu(this.soCapNhatView);
    }
  }

  GetHistorySinhSoHoaDonCMMTTien(year: number = this.curentYear) {
    this.quanLyThongTinHoaDonService.GetHistorySinhSoHoaDonCMMTTien(year).subscribe(
      (res: any[]) => {
        console.log("🚀 ~ file: tab-thong-tin-hoa-don.component.ts ~ line 353 ~ TabThongTinHoaDonComponent ~ SaveSoBatDauToTbSinhSo ~ res", res)
        if (res) {
          this.sinhSoCurrentYear = res.find(x => x.namPhatHanh = this.curentYear);
          this.soLonNhatDaSinh = this.viewNumber11KyTu(this.sinhSoCurrentYear.soKetThuc);
        } else {
          
        }
      },
      err => {
        return;
      }
    );
  }

  ChangeValueSoCapNhat(soCapNhatView: number) {
    this.isPassCondition = false;
    this.isPassErrorValue = false;
    if (soCapNhatView >= 99999999999) {
      this.isPassErrorValue = true;
      this.soKeTiep = this.viewNumber11KyTu(99999999999);
      return;
    } else if (soCapNhatView == 0 || !soCapNhatView) {
      this.soKeTiep = this.viewNumber11KyTu(0);
    } else {
      this.soKeTiep = this.viewNumber11KyTu(soCapNhatView + 1);
    }
  }
  changeAccept() {

  }

  ConfirmUpdateSoLonNhat(year: number = this.curentYear) {
    this.quanLyThongTinHoaDonService.GetHistorySinhSoHoaDonCMMTTien(year).subscribe(
      (res: any[]) => {
        if (res) {
          this.sinhSoCurrentYear = res.find(x => x.namPhatHanh = this.curentYear);
          this.soLonNhatDaSinh = this.viewNumber11KyTu(this.sinhSoCurrentYear.soKetThuc);
          if (parseInt(this.soCapNhat) < this.sinhSoCurrentYear.soKetThuc) {
            this.isPassCondition = true;
          } else {
            if(!this.isPassCondition && !this.isPassErrorValue)
            this.UpdateSoDaSinhMoiNhatHoaDonCMMTTien();
          }
        }
      },
      err => {
        return;
      }
    );
  }



  UpdateSoDaSinhMoiNhatHoaDonCMMTTien() {
    this.quanLyThongTinHoaDonService.UpdateSoDaSinhMoiNhatHoaDonCMMTTienByNSD(this.soCapNhat).subscribe(
      (res: any) => {
        if (res) {
          this.GetHistorySinhSoHoaDonCMMTTien(this.curentYear);
          // this.nhatKyTruyCapService.Insert({
          //   loaiHanhDong: LoaiHanhDong.Sua,
          //   refType: RefType.ThongTinHoaDon,
          //   doiTuongThaoTac: 'Chỉnh sửa số bắt đầu',
          //   thamChieu: `Chỉnh sửa số bắt đầu trong dãy số 11 ký tự`,
          //   moTaChiTiet: `Cập nhật số đã sinh mới nhất hiện tại thành ${this.soCapNhat}`,
          //   duLieuCu: this.soLonNhatDaSinh,
          //   duLieuMoi: this.soCapNhat,
          // }).subscribe();
          this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
          this.closeModal();
        } else {
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        }

      },
      err => {
        return;
      }
    );
  }

  viewNumber11KyTu(input: number) {
    let stringInit = '00000000000';
    let numberOfZezo = stringInit.substring(0, (11 - input.toString().length))
    return numberOfZezo + input.toString();
  }

  closeModal() {
    this.modal.destroy();
  }
}
