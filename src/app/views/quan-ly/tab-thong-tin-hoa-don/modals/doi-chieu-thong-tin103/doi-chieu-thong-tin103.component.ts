import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
export interface DoiChieuThongTinInterface {
  Id?: string,
  Stt?: number,
  ThongTin?: string,
  ThongTinYeuCau?: string,
  ThongTinDoiChieu?: string,
  KetQuaDoiChieu?: string,
  IsNotPassed?: boolean
}

@Component({
  selector: 'app-doi-chieu-thong-tin103',
  templateUrl: './doi-chieu-thong-tin103.component.html',
  styleUrls: ['./doi-chieu-thong-tin103.component.scss']
})


export class DoiChieuThongTin103Component implements OnInit {
  @Input() data: any;
  listOutPuts: any[] = [];
  hoSoHDDT: any;
  constructor(
    private hoSoHDDTService: HoSoHDDTService,
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.hoSoHDDT = rs;
    });

  }


  XuLyInPut() {
    if (this.data) {
      console.log("🚀 ~ file: doi-chieu-thong-tin103.component.ts ~ line 24 ~ DoiChieuThongTin103Component ~ ngOnInit ~ this.data", this.data)
      for (let index = 0; index < 4; index++) {
        let newItem = {
          Stt: index,
        } as DoiChieuThongTinInterface;
        switch (index) {
          /// Mẫu số
          case 0:
            newItem.ThongTin = "Mẫu số";
            newItem.ThongTinYeuCau = "01/TB-ĐKĐT";
            newItem.ThongTinDoiChieu = this.data.dltBao.mSo;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? true : false;
            break;
          /// Trạng thái xác nhận của cơ quan thuế
          case 1:
            newItem.ThongTin = "Trạng thái xác nhận cơ quan thuế";
            newItem.ThongTinYeuCau = "1";
            newItem.ThongTinDoiChieu = this.data.dltBao.ttxncqt;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? true : false;
            break;
          /// Mã số thuế
          case 2:
            newItem.ThongTin = "Mã số thuế";
            newItem.ThongTinYeuCau = this.hoSoHDDT.maSoThue;
            newItem.ThongTinDoiChieu = this.data.dltBao.mst;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.ThongTinYeuCau == newItem.KetQuaDoiChieu ? true : false;
            break;
          /// Mã của cơ quan thuế
          case 3:
            newItem.ThongTin = "Mã của cơ quan thuế";
            newItem.ThongTinYeuCau = "Không để trống và tối đa 5 ký tự";
            newItem.ThongTinDoiChieu = this.data.dltBao.mccqt;
            newItem.KetQuaDoiChieu = newItem.ThongTinDoiChieu != null ? ((newItem.ThongTinDoiChieu.length > 4 && newItem.ThongTinDoiChieu.length < 6) ? "Thỏa mãn" : "Không thỏa mãn") : "Không thỏa mãn";
            newItem.IsNotPassed = newItem.KetQuaDoiChieu == "Thỏa mãn" ? true : false;
            break;
          default:
            break;
        }

        this.listOutPuts.push(newItem);
        console.log("🚀 ~ file: doi-chieu-thong-tin103.component.ts ~ line 76 ~ DoiChieuThongTin103Component ~ ngOnInit ~ this.listOutPuts", this.listOutPuts)
      }

    }
  }
  destroyModal() {
    this.modal.destroy();
  }

}
