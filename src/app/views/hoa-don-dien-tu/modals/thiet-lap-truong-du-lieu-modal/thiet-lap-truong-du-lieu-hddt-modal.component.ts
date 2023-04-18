import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { LoaiTruongDuLieu } from 'src/app/enums/LoaiTruongDuLieu.enum';
import { ThietLapTruongDuLieuService } from 'src/app/services/Config/thiet-lap-truong-du-lieu.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { CookieConstant } from 'src/app/constants/constant';
import { SumwidthConfig } from 'src/app/shared/global';

@Component({
  selector: 'app-thiet-lap-truong-du-lieu-hddt-modal',
  templateUrl: './thiet-lap-truong-du-lieu-hddt-modal.component.html',
  styleUrls: ['./thiet-lap-truong-du-lieu-hddt-modal.component.scss']
})
export class ThietLapTruongDuLieuHoaDonModalComponent implements OnInit {
  @Input() loaiTruong: LoaiTruongDuLieu;
  @Input() loaiHoaDon: LoaiHoaDon;
  @Input() listTruongDuLieu: any[] = [];
  listTruongDuLieuTemp: any[] = [];
  listTruongDuLieuTempNew: any[] = [];
  searchCustomerOverlayStyle = {
    width: '200px'
  };
  widthConfig = [];
  scrollConfig = { x: '', y: '450px' }
  baoCaoForm: FormGroup;
  spinning: boolean;
  indeterminate = false;
  maLoaiTien: string;
  ddtp = new DinhDangThapPhan();
  dataSelected = null;
  listTruongDuLieuHoaDon_Default = [
    { TenCot: "KyHieu", HienThi: true, Disabled: true },
    { TenCot: "TrangThai", HienThi: true, Disabled: true },
    { TenCot: "MaTraCuu", HienThi: false, Disabled: false },
    { TenCot: "TrangThaiQuyTrinh", HienThi: true, Disabled: true },
    { TenCot: "MaCuaCQT", HienThi: false, Disabled: false },
    { TenCot: "SoHoaDon", HienThi: true, Disabled: true },
    { TenCot: "NgayHoaDon", HienThi: false, Disabled: false },
    { TenCot: "TrangThaiGuiHoaDon", HienThi: true, Disabled: false },
    { TenCot: "MaKhachHang", HienThi: true, Disabled: false },
    { TenCot: "TenKhachHang", HienThi: true, Disabled: true },
    { TenCot: "MaSoThue", HienThi: false, Disabled: false },
    { TenCot: "HoTenNguoiMuaHang", HienThi: false, Disabled: false },
    { TenCot: "TongTienThanhToan", HienThi: true, Disabled: true },
    { TenCot: "HinhThucHoaDon", HienThi: true, Disabled: true },
    { TenCot: "UyNhiemLapHoaDon", HienThi: false, Disabled: false },
    { TenCot: "ThongTinSaiSot", HienThi: true, Disabled: false },
    { TenCot: "ThongTinTao", HienThi: true, Disabled: true },
    { TenCot: "ThongTinCapNhat", HienThi: false, Disabled: false },
  ];
  constructor(
    private modal: NzModalRef,
    private thietLapTruongDuLieuService: ThietLapTruongDuLieuService
  ) { }

  ngOnInit() {
    this.listTruongDuLieuTemp = JSON.parse(JSON.stringify(this.listTruongDuLieu));
    // this.listTruongDuLieuTemp.forEach(element => {
    //   if (this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot && x.Disabled == true) != undefined) {
    //     element.hienThi = this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot).HienThi;
    //     element.disabled = true;
    //   } else if (this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot && x.Disabled == false) != undefined) {
    //     element.hienThi = this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot).HienThi;
    //     element.disabled = false;
    //   } else {
    //     element.disabled = false;
    //   }
    // });
    this.selectedRow(this.listTruongDuLieuTemp[0]);
    this.setWidthConfig();
  }

  setWidthConfig() {
    if (this.loaiTruong === LoaiTruongDuLieu.NhomHangHoaDichVu) {
      this.widthConfig = ['50px', '100px', '170px', '170px', '200px', '50px', '50px'];
    } else if (this.loaiTruong === LoaiTruongDuLieu.NhomThongTinNguoiMua) {
      this.widthConfig = ['50px', '220px', '200px', '200px', '50px'];
    } else {
      this.widthConfig = ['50px', '220px', '200px', '200px', '50px', '50px'];
    }

    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
  }

  selectedRow(data: any) {
    this.listTruongDuLieuTemp.forEach(item => {
      if (item.selected == true) {
        item.selected = false;
      }
    })
    this.dataSelected = data;
    data.selected = true;
  }

  layLaiThietLapMacDinh() {
    this.spinning = true;
    this.thietLapTruongDuLieuService.GetListThietLapMacDinh(this.loaiTruong, this.loaiHoaDon)
      .subscribe((rs: any[]) => {
        this.listTruongDuLieuTemp = [...rs];

        // this.listTruongDuLieuTemp.forEach(element => {
        //   if (this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot && x.Disabled == true) != undefined) {
        //     element.hienThi = this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot).HienThi;
        //     element.disabled = true;
        //   } else if (this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot && x.Disabled == false) != undefined) {
        //     element.hienThi = this.listTruongDuLieuHoaDon_Default.find(x => x.TenCot == element.tenCot).HienThi;
        //     element.disabled = false;
        //   } else {
        //     element.disabled = false;
        //   }
        // });

        this.selectedRow(this.listTruongDuLieuTemp[0]);
        this.spinning = false;
      })
  }

  saveChanges() {
    this.spinning = true;
    this.thietLapTruongDuLieuService.UpdateRange(this.listTruongDuLieuTemp)
      .subscribe((res: boolean) => {
        if (res) {
          this.modal.destroy(this.listTruongDuLieuTemp);
          this.spinning = false;
        }
      });
  }

  first() {
    this.listTruongDuLieuTemp = this.listTruongDuLieuTemp.filter(x => x.thietLapTruongDuLieuId !== this.dataSelected.thietLapTruongDuLieuId);
    this.listTruongDuLieuTemp.unshift(this.dataSelected);
    this.updateSTT();
  }

  prev() {
    const sortedIndex = this.listTruongDuLieuTemp.findIndex(x => x.thietLapTruongDuLieuId === this.dataSelected.thietLapTruongDuLieuId);
    if (sortedIndex > 0) {
      const temp = Object.assign(this.listTruongDuLieuTemp[sortedIndex - 1]);
      this.listTruongDuLieuTemp[sortedIndex - 1] = this.dataSelected;
      this.listTruongDuLieuTemp[sortedIndex] = temp;
      this.updateSTT();
    }
  }

  next() {
    const sortedIndex = this.listTruongDuLieuTemp.findIndex(x => x.thietLapTruongDuLieuId === this.dataSelected.thietLapTruongDuLieuId);
    if (sortedIndex < this.listTruongDuLieuTemp.length - 1) {
      const temp = Object.assign(this.listTruongDuLieuTemp[sortedIndex + 1]);
      this.listTruongDuLieuTemp[sortedIndex + 1] = this.dataSelected;
      this.listTruongDuLieuTemp[sortedIndex] = temp;
      this.updateSTT();
    }
  }

  last() {
    this.listTruongDuLieuTemp = this.listTruongDuLieuTemp.filter(x => x.thietLapTruongDuLieuId !== this.dataSelected.thietLapTruongDuLieuId);
    this.listTruongDuLieuTemp.push(this.dataSelected);
    this.updateSTT();
  }

  updateSTT() {
    this.listTruongDuLieuTemp.forEach((item: any, index: any) => {
      item.stt = index + 1;

      if (this.dataSelected.thietLapTruongDuLieuId === item.thietLapTruongDuLieuId) {
        this.dataSelected.stt = item.stt;
      }
    });
  }

  public get LoaiTruongDuLieu(): typeof LoaiTruongDuLieu {
    return LoaiTruongDuLieu;
  }

  destroyModal() {
    this.modal.destroy();
  }
}
