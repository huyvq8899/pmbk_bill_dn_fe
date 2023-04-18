import { LoaiMauHoaDon } from './../../../../../../enums/HinhThucHoaDon.enum';
import { LoaiHoaDon } from './../../../../../../enums/LoaiHoaDon.enum';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieConstant } from 'src/app/constants/constant';
import { EnvService } from 'src/app/env.service';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { getHinhThucHoaDons, getKhoGiays, getKieuThueSuats, getKyHieu, getLoaiHoaDons, getLoaiMaus, getNgonNgus, getTenHoaDonByLoai, getUyNhiemLapHoaDons } from 'src/app/shared/SharedFunction';
import { InitCreateMauHD } from 'src/assets/ts/init-create-mau-hd';
import { HinhThucHoaDon } from 'src/app/enums/HinhThucHoaDon.enum';
import { InitCreateVeDienTu } from 'src/assets/ts/init-create-ve-dien-tu';

@Component({
  selector: 'app-tab-chon-mau-hoa-don',
  templateUrl: './tab-chon-mau-hoa-don.component.html',
  styleUrls: ['./tab-chon-mau-hoa-don.component.scss']
})
export class TabChonMauHoaDonComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter<number>();
  @Output() valueChangesEvent = new EventEmitter<any>();
  @Input() data: any;
  list: any[] = [];
  hoSoHDDT = null;
  mauHoaDonForm: FormGroup;
  hinhThucHoaDons = getHinhThucHoaDons();
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons();
  loaiHoaDons = getLoaiHoaDons();
  loaiMauAlls = getLoaiMaus();
  loaiMaus = this.loaiMauAlls;
  loaiThueGTGTs = getKieuThueSuats();
  loaiNgonNgus = getNgonNgus();
  loaiKhoGiays = getKhoGiays();
  overlayStyle = {
    width: '277px' // không sửa
  };
  boolCoPhatSinhUyNhiemLapHoaDon = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCoPhatSinhUyNhiemLapHoaDon').giaTri;
  coPhatSinhUyNhiemLapHoaDon = this.boolCoPhatSinhUyNhiemLapHoaDon === 'true' || this.boolCoPhatSinhUyNhiemLapHoaDon === true;
  loaiHoaDonAlls: any[] = [];
  constructor(
    public env: EnvService,
    private fb: FormBuilder,
    private mauHoaDonService: MauHoaDonService,
    private hoSoHDDTService: HoSoHDDTService
  ) { }

  ngOnInit() {
    this.createForm();
    this.loadHoSoHDDT();
    this.loadData();
  }

  createForm() {
    this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key != 3 && x.key != 4 && x.key != 13);
    this.loaiHoaDonAlls = JSON.parse(JSON.stringify(this.loaiHoaDons));
    this.mauHoaDonForm = this.fb.group({
      uyNhiemLapHoaDon: [0],
      hinhThucHoaDon: [1],
      loaiHoaDon: [1],
      loaiThueGTGT: [1],
      loaiMau: [1],
      loaiNgonNgu: [1],
      loaiKhoGiay: [1]
    });

    this.changeHinhThucHoaDon(HinhThucHoaDon.CoMa);
  }

  loadHoSoHDDT() {
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        this.hoSoHDDT = res;
      });
  }

  loadData() {
    const params = this.mauHoaDonForm.getRawValue();
    if (params.hinhThucHoaDon === 2) {
      // params.loaiHoaDon = LoaiHoaDon.HoaDonGTGTCMTMTT;
    }
    this.mauHoaDonService.GetListMauHoaDon(params)
      .subscribe((res: any[]) => {
        this.list = res;
      });
  }

  changeHinhThucHoaDon(hinhThuc: any) {
    switch (hinhThuc) {
      case 1:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13 && x.key !== 14 && x.key !== 15
        });
        this.mauHoaDonForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGT);
        this.loaiMaus = this.loaiMaus.filter(x => {
          return x.key < 3;
        });
        this.mauHoaDonForm.get('loaiMau').setValue(LoaiMauHoaDon.MauCoBan);
        this.mauHoaDonForm.get('loaiThueGTGT').enable();
        this.mauHoaDonForm.get('loaiNgonNgu').enable();
        break;

      case 0:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 9 && x.key !== 10 && x.key !== 13 && x.key !== 14 && x.key !== 15
        });
        this.mauHoaDonForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGT);
        this.loaiMaus = this.loaiMaus.filter(x => {
          return x.key < 3;
        });
        this.mauHoaDonForm.get('loaiMau').setValue(LoaiMauHoaDon.MauCoBan);
        break;
      case 2:
        this.loaiHoaDons = this.loaiHoaDonAlls.filter(x => {
          return x.key !== 1 && x.key !== 2 && x.key !== 5 && x.key !== 7 && x.key !== 8 && x.key !== 13 && x.key !== 15  && x.key !== 16 && x.key !== 17
        });
        this.mauHoaDonForm.get('loaiHoaDon').setValue(LoaiHoaDon.HoaDonGTGTCMTMTT);
        //nếu là hóa đơn MTT thì set mặc định chọn nhiều thế suất
        // this.mauHoaDonForm.get('loaiThueGTGT').setValue(2);
        // this.mauHoaDonForm.get('loaiThueGTGT').disable();
        // Nếu là hóa đơn có mã MTT => ẩn song ngữ
        // this.mauHoaDonForm.get('loaiNgonNgu').setValue(1);
        // this.mauHoaDonForm.get('loaiNgonNgu').disable();
        this.mauHoaDonForm.get('loaiNgonNgu').enable();
        break;
      default:
        break;
    }
    this.loadData();
  }

  changeLoaiHoaDon(loaiHoaDon: any) {

    switch (loaiHoaDon) {
      case 10:
        this.mauHoaDonForm.get('loaiThueGTGT').setValue(1);
        break;
      case 14:
        this.mauHoaDonForm.get('loaiKhoGiay').setValue(2);
      case 9:
        this.mauHoaDonForm.get('loaiThueGTGT').setValue(1);
        break;

      default:
        break;
    }
    this.loadData();
  }

  changeLoaiThueGTGT(loaiThue: any) {
    this.loadData();
  }
  changeLoaiNgonNgu() {
    this.loadData();
  }

  changeLoaiKhoGiay() {
    this.loadData();
  }

  selectedMau(item: any) {
    if (!this.hoSoHDDT) {
      return;
    }
    let init = null;
    // Cài đặt giá trị để cho biết Không cần lọc theo ngôn ngữ ở hàm InitCreateMauHD sau khi chọn mẫu ở bước này.
    // Việc chọn ngôn ngữ sẽ được chuyển sang bước Thiết lập chung.
    item.isAllowedToChooseLanguage = false;

    const formData = this.mauHoaDonForm.getRawValue();
    if (formData.loaiHoaDon != 14) {
      console.log("🚀 ~ file: tab-chon-mau-hoa-don.component.ts:105 ~ TabChonMauHoaDonComponent ~ selectedMau ~ formData.loaiHoaDon", formData.loaiHoaDon)
      init = InitCreateMauHD(this.hoSoHDDT, item);
    } else {
      // switch (this.MaSoThue) {
      //   case '00000000000':
      //     item.loaiXe = LoaiXe.XeKhach

      //     break;

      //   default:
      //     break;
      // }
      init = InitCreateVeDienTu(this.hoSoHDDT, item);
    }


    item = {
      ...init,
      ...item,
      ...formData
    };

    const data = {
      ...item,
      quyDinhApDung: 0,
      ten: getTenHoaDonByLoai(item.loaiHoaDon),
      kyHieu: '',
      tenBoMau: item.code,
      fileMau: item.file,
      position: 1
    };
    this.valueChangesEvent.emit(data);
    this.nextStepEvent.emit(1);
  }
}
