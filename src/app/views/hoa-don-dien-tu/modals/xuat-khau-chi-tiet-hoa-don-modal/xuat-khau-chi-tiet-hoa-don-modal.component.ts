import { forEach } from 'jszip';
import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService, NzSelectComponent } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { SearchEngine } from 'src/app/shared/searchEngine';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HinhThucThanhToanService } from 'src/app/services/danh-muc/hinh-thuc-thanh-toan.service';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { DonViTinhService } from 'src/app/services/danh-muc/don-vi-tinh.service';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { LoiTrangThaiPhatHanh } from 'src/app/enums/LoiTrangThaiPhatHanh.enum';
import * as printJS from 'print-js';
import { WebSocketService } from 'src/app/services/websocket.service';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { getHinhThucHoaDons, getLoaiHoaDon, getLoaiHoaDons, getTimKiemTheo, getTimKiemTheoKhachHang, getTrangThaiQuyTrinhs, getUyNhiemLapHoaDons } from 'src/app/shared/SharedFunction';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { Router } from '@angular/router';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { HinhThucHoaDon } from 'src/app/enums/HinhThucHoaDon.enum';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';

@Component({
  selector: 'app-xuat-khau-chi-tiet-hoa-don-modal',
  templateUrl: './xuat-khau-chi-tiet-hoa-don-modal.component.html',
  styleUrls: ['./xuat-khau-chi-tiet-hoa-don-modal.component.scss']
})
export class XuatKhauChiTietHoaDonModalComponent implements OnInit, AfterViewChecked {
  mainForm: FormGroup;
  khachHangs: any[] = [];
  mauHoaDons: any[] = [];
  kyHieuHoaDons: any[] = [];
  kys = GetList();
  trangThaiHoaDons: any[] = [];
  trangThaiGuiHoaDons: any[] = [];
  hoaDonGoc: boolean = false;
  hoaDonXoaBo: boolean = false;
  hoaDonThayThe: boolean = false;
  hoaDonDieuChinh: boolean = false;
  khongChons: string = "";
  ky = 5;
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons(true);
  hinhThucHoaDons = getHinhThucHoaDons(true);
  loaiHoaDons = getLoaiHoaDons(true) as any[];
  trangThaiQuyTrinhs = getTrangThaiQuyTrinhs(true) as any[];
  spinning = false;
  isPhieuXuatKho = false;
  textHD_PXK = 'hóa đơn';
  textHD_PXK_UPPER = 'Hóa đơn';
  IsPos = false;
  timKiemTheos = getTimKiemTheoKhachHang();
  displayDataDT: any = {
    PageNumber: 1,
    PageSize: 20,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true,
    LoaiDoiTuong: 1,
    IsSearchKhachHangDeTrong: true,
  };
  typingTimer;
  loadingSearchDropdown: boolean;
  totalPages: any;
  isLoadingMore: boolean;
  listKhachHangBeforeChange: any[];
  LoaiNghiepVu: number;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private doiTuongService: DoiTuongService,
    private mauHoaDonService: MauHoaDonService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService
  ) {
  }
  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('quan-li-hoa-don-dien-tu')) {
      this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x => !(x.key == HinhThucHoaDon.CoMaTuMayTinhTien));
      this.loaiHoaDons = this.loaiHoaDons.filter(x=>x.key == LoaiHoaDon.TatCa || x.key <= LoaiHoaDon.CacCTDuocInPhatHanhSuDungVaQuanLyNhuHD);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != TrangThaiQuyTrinh.ChuaPhatHanh && x.key != TrangThaiQuyTrinh.ChuaGuiCQT)
    }
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.textHD_PXK = 'PXK';
      this.textHD_PXK_UPPER = 'PXK';
      this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key === -1 || x.key === LoaiHoaDon.PXKKiemVanChuyenNoiBo || x.key === LoaiHoaDon.PXKHangGuiBanDaiLy);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != TrangThaiQuyTrinh.ChuaPhatHanh && x.key != TrangThaiQuyTrinh.ChuaGuiCQT)
    }
    if (_url.includes('hoa-don-tu-mtt')) {
      this.IsPos = true;
      this.loaiHoaDons = this.loaiHoaDons.filter(x => x.key == LoaiHoaDon.TatCa || x.key == LoaiHoaDon.HoaDonGTGTCMTMTT || x.key == LoaiHoaDon.HoaDonBanHangCMTMTT || x.key == LoaiHoaDon.HoaDonKhacCMTMTT);
      this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x => x.key == HinhThucHoaDon.CoMaTuMayTinhTien || x.key == HinhThucHoaDon.TatCa);
      this.trangThaiQuyTrinhs = this.trangThaiQuyTrinhs.filter(x=>x.key != TrangThaiQuyTrinh.ChuaKyDienTu && x.key != TrangThaiQuyTrinh.DangKyDienTu && x.key != TrangThaiQuyTrinh.DaKyDienTu && x.key != TrangThaiQuyTrinh.CQTDaCapMa)
      // this.displayDataTemp.HinhThucHoaDon = HinhThucHoaDon.CoMaTuMayTinhTien;
    }
    this.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.IsPos ? 3 : 1;
    this.loadForm();
  }

  loadForm() {
    this.spinning = true;
    this.createForm();
    this.forkJoin().subscribe((res: any[]) => {
      this.khachHangs = res[0];

      if (this.isPhieuXuatKho) {
        res[1].forEach((item) => {
          item.ten = item.ten.replace("Hóa đơn", 'PXK');
        });
      }
      this.trangThaiHoaDons = res[1];
      this.trangThaiGuiHoaDons = res[2];
      this.kyHieuHoaDons = res[3];
      this.AddOptionDefault();
      this.listKhachHangBeforeChange = this.khachHangs;
      this.checkFilterKhachHang(this.khachHangs[0]);



      this.kyHieuHoaDons.unshift({ boKyHieuHoaDonId: "-1", kyHieu: 'Tất cả', checked: true });
      this.checkFilterKyHieu(this.kyHieuHoaDons[0]);

      this.loaiHoaDons[0].checked = true;
      this.checkFilterLoaiHoaDon(this.loaiHoaDons[0]);

      this.trangThaiHoaDons[0].checked = true;
      this.checkFilterTrangThaiHoaDon(this.trangThaiHoaDons[0]);

      this.trangThaiQuyTrinhs[0].checked = true;
      this.checkFilterTrangThaiQuyTrinh(this.trangThaiQuyTrinhs[0]);

      this.trangThaiGuiHoaDons[0].checked = true;
      this.checkFilterTrangThaiGuiHoaDon(this.trangThaiGuiHoaDons[0]);

      this.spinning = false;
    });
  }

  changeKyHieu(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == "-1")) {
          var kyHieus = this.kyHieuHoaDons.map(x => x.boKyHieuHoaDonId);
          this.mainForm.get('boKyHieuHoaDonId').setValue(kyHieus);
          this.kyHieuHoaDons.forEach(x => {
            x.checked = false;
            if (event.indexOf(x.boKyHieuHoaDonId) > -1) x.checked = true;
          })
        } else {
          this.kyHieuHoaDons.forEach((item: any) => {
            if (event.includes(item.boKyHieuHoaDonId)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('boKyHieuHoaDonId').setValue(["-1"]);
        this.kyHieuHoaDons.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.kyHieuHoaDons.forEach(x => {
        x.checked = false;
      })
    } else {
      if (event[0] !== '-1') {
        this.kyHieuHoaDons.forEach((item: any) => {
          if (event.includes(item.boKyHieuHoaDonId)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
    }
  }


  checkFilterKyHieu(data: any) {
    console.log(data);
    if (data.boKyHieuHoaDonId == "-1") { // check all
      this.kyHieuHoaDons.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.kyHieuHoaDons[0].checked = this.kyHieuHoaDons.filter(x => x.boKyHieuHoaDonId != "-1").every(x => x.checked);
    }

    console.log(this.kyHieuHoaDons[0])
    var kyHieus = this.kyHieuHoaDons[0].checked ? ["-1"] : this.kyHieuHoaDons.filter(x => x.boKyHieuHoaDonId != "-1" && x.checked).map(x => x.boKyHieuHoaDonId);
    console.log(kyHieus);
    this.mainForm.get('boKyHieuHoaDonId').setValue(kyHieus);
    console.log(this.mainForm.get('boKyHieuHoaDonId').value)
  }

  changeKhachHang(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == "-1")) {
          setTimeout(() => {
            let kHangs = this.listKhachHangBeforeChange.filter(x => x.doiTuongId != "-1" && x.checked).map(x => x.doiTuongId);
            console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:217 ~ XuatKhauChiTietHoaDonModalComponent ~ changeKhachHang ~ kHangs", kHangs)
            this.mainForm.get('khachHangId').setValue(kHangs);
          }, 100);
          this.listKhachHangBeforeChange.forEach(x => {
            x.checked = true;
            if (event.indexOf(x.doiTuongId) > -1) x.checked = false;
          })
        } else {
          this.listKhachHangBeforeChange.forEach((item: any) => {
            if (event.includes(item.doiTuongId)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('khachHangId').setValue(["-1"]);
        this.listKhachHangBeforeChange.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.listKhachHangBeforeChange.forEach(x => {
        x.checked = false;
      })
    } else {
      const khachHangId = this.mainForm.get('khachHangId').value;
      if (event[0] !== '-1') {
        this.listKhachHangBeforeChange.forEach((item: any) => {
          if (event.includes(item.doiTuongId)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.listKhachHangBeforeChange.forEach((item: any) => {
          if (khachHangId.includes(item.doiTuongId)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
      else {
        this.listKhachHangBeforeChange.forEach(x => {
          x.checked = true;
        })
      }
    }

  }


  checkFilterKhachHang(data: any) {
    console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:277 ~ XuatKhauChiTietHoaDonModalComponent ~ checkFilterKhachHang ~ data", data)
    let IsCheckAll = false;
    if (data.doiTuongId == "-1") {
      if (data.checked == true) {
        IsCheckAll = true;// check all
      }
      this.listKhachHangBeforeChange.forEach((item: any) => {
        item.checked = data.checked;
      });
    }
    else {
      this.listKhachHangBeforeChange.forEach((item: any) => {
        if (data.doiTuongId == item.doiTuongId) {
          item.checked = data.checked;
        }
      });
      IsCheckAll = this.listKhachHangBeforeChange.filter(x => x.doiTuongId != "-1").every(x => x.checked);
      console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:286 ~ XuatKhauChiTietHoaDonModalComponent ~ checkFilterKhachHang ~ IsCheckAll", IsCheckAll)
      this.listKhachHangBeforeChange[0].checked = IsCheckAll;


    }
    var kHangs = IsCheckAll ? ["-1"] : this.listKhachHangBeforeChange.filter(x => x.doiTuongId != "-1" && x.checked).map(x => x.doiTuongId);
    this.mainForm.get('khachHangId').setValue(kHangs);
  }

  changeLoaiHoaDon(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == -1)) {
          var lHDons = this.loaiHoaDons.map(x => x.key);
          this.mainForm.get('loaiHoaDon').setValue(lHDons);
          this.loaiHoaDons.forEach(x => {
            x.checked = false;
            if (event.indexOf(x.key) > -1) x.checked = true;
          })
        } else {
          this.loaiHoaDons.forEach((item: any) => {
            if (event.includes(item.key)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('loaiHoaDon').setValue([-1]);
        this.loaiHoaDons.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.loaiHoaDons.forEach(x => {
        x.checked = false;
      })
    } else {
      if (event[0] !== -1) {
        this.loaiHoaDons.forEach((item: any) => {
          if (event.includes(item.key)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
    }
  }

  checkFilterLoaiHoaDon(data: any) {
    if (data.key == -1) { // check all
      this.loaiHoaDons.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.loaiHoaDons[0].checked = this.loaiHoaDons.filter(x => x.key != -1).every(x => x.checked);
    }

    var lHDons = this.loaiHoaDons[0].checked ? [-1] : this.loaiHoaDons.filter(x => x.key != -1 && x.checked).map(x => x.key);
    this.mainForm.get('loaiHoaDon').setValue(lHDons);
  }

  changeTrangThaiHoaDon(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == -1)) {
          var ttHDons = this.trangThaiHoaDons.map(x => x.trangThaiId);
          this.mainForm.get('trangThaiHoaDon').setValue(ttHDons);
          this.trangThaiHoaDons.forEach(x => {
            x.checked = false;
            if (event.indexOf(x.trangThaiId) > -1) {
              x.checked = true;
              this.checkFilterTrangThaiHoaDon(x);
            }
          })
        } else {
          this.trangThaiHoaDons.forEach((item: any) => {
            if (event.includes(item.trangThaiId)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('trangThaiHoaDon').setValue([-1]);
        this.trangThaiHoaDons.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.trangThaiHoaDons.forEach(x => {
        x.checked = false;
      })
    } else {
      if (event[0] !== -1) {
        this.trangThaiHoaDons.forEach((item: any) => {
          if (event.includes(item.trangThaiId)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
    }
  }

  checkFilterTrangThaiHoaDon(data: any) {
    if (data.trangThaiId == -1) { // check all
      this.trangThaiHoaDons.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.trangThaiHoaDons[0].checked = this.trangThaiHoaDons.filter(x => x.trangThaiId != -1).every(x => x.checked);
      this.trangThaiHoaDons.forEach(x => {
        if (x.trangThaiChaId == data.trangThaiId) {
          x.checked = data.checked;
        }
      })
      if (data.trangThaiChaId) {
        if (this.trangThaiHoaDons.filter(x => x.trangThaiChaId == data.trangThaiChaId && x.checked == true).length
          == this.trangThaiHoaDons.filter(x => x.trangThaiChaId == data.trangThaiChaId).length) {
          this.trangThaiHoaDons.forEach(x => {
            if (x.trangThaiId == data.trangThaiChaId) {
              if (x.checked == false) x.checked = true;
            }
          })
        }
      }
    }

    var ttHDons = this.trangThaiHoaDons[0].checked ? [-1] : this.trangThaiHoaDons.filter(x => x.trangThaiId != -1 && x.checked).map(x => x.trangThaiId);
    this.mainForm.get('trangThaiHoaDon').setValue(ttHDons);
  }

  changeTrangThaiQuyTrinh(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == -1)) {
          var ttQtrinhs = this.trangThaiQuyTrinhs.map(x => x.key);
          this.mainForm.get('trangThaiQuyTrinh').setValue(ttQtrinhs);
          this.trangThaiQuyTrinhs.forEach(x => {
            x.checked = false;
            if (event.indexOf(x.key) > -1) x.checked = true;
          })
        } else {
          this.trangThaiQuyTrinhs.forEach((item: any) => {
            if (event.includes(item.key)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('trangThaiQuyTrinh').setValue([-1]);
        this.trangThaiQuyTrinhs.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.trangThaiQuyTrinhs.forEach(x => {
        x.checked = false;
      })
    } else {
      if (event[0] !== -1) {
        this.trangThaiQuyTrinhs.forEach((item: any) => {
          if (event.includes(item.key)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
    }
  }


  checkFilterTrangThaiQuyTrinh(data: any) {
    console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:477 ~ XuatKhauChiTietHoaDonModalComponent ~ checkFilterTrangThaiQuyTrinh ~ this.LoaiNghiepVu:", this.LoaiNghiepVu)

    switch (this.LoaiNghiepVu) {
      case 1:
        this.trangThaiQuyTrinhs =  this.trangThaiQuyTrinhs.filter(x => x.key != 12 && x.key != 13);
        break;
      case 2:
        this.trangThaiQuyTrinhs =  this.trangThaiQuyTrinhs.filter(x => {
          return x.key != 12 && x.key != 13
        })
        break;
      case 3:
        this.trangThaiQuyTrinhs =  this.trangThaiQuyTrinhs.filter(x => x.key == 12 || x.key == 13 || x.key == 4 || x.key == 5 || x.key == 6 || x.key == 7 || x.key == 10 || x.key == 11);
        break;
      default:
        break;
    }
    console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:484 ~ XuatKhauChiTietHoaDonModalComponent ~ checkFilterTrangThaiQuyTrinh ~ this.trangThaiQuyTrinhs:", this.trangThaiQuyTrinhs)

    if (data.key == -1) { // check all
      this.trangThaiQuyTrinhs.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.trangThaiQuyTrinhs[0].checked = this.trangThaiQuyTrinhs.filter(x => x.key != -1).every(x => x.checked);
    }

    var ttQtrinhs = this.trangThaiQuyTrinhs[0].checked ? [-1] : this.trangThaiQuyTrinhs.filter(x => x.key != -1 && x.checked).map(x => x.key);
    this.mainForm.get('trangThaiQuyTrinh').setValue(ttQtrinhs);
  }

  changeTrangThaiGuiHoaDon(event: any[]) {
    if (event.length > 1) {
      const lastOfItem = event[event.length - 1];
      if (lastOfItem) {
        if (event.some(x => x == -1)) {
          var ttGHDons = this.trangThaiGuiHoaDons.map(x => x.trangThaiId);
          this.mainForm.get('trangThaiGuiHoaDon').setValue(ttGHDons);
          this.trangThaiGuiHoaDons.forEach(x => {
            x.checked = false;
            if (event.indexOf(x.trangThaiId) > -1) {
              x.checked = true;
              this.checkFilterTrangThaiGuiHoaDon(x);
            }
          })
        } else {
          this.trangThaiGuiHoaDons.forEach((item: any) => {
            if (event.includes(item.trangThaiId)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
      } else {
        this.mainForm.get('trangThaiGuiHoaDon').setValue([-1]);
        this.trangThaiGuiHoaDons.forEach(x => {
          x.checked = true;
        })
      }
    } else if (event.length == 0) {
      this.trangThaiGuiHoaDons.forEach(x => {
        x.checked = false;
      })
    } else {
      if (event[0] !== -1) {
        this.trangThaiGuiHoaDons.forEach((item: any) => {
          if (event.includes(item.trangThaiId)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      }
    }
  }

  checkFilterTrangThaiGuiHoaDon(data: any) {
    if (data.trangThaiId == -1) { // check all
      this.trangThaiGuiHoaDons.forEach((item: any) => {
        item.checked = data.checked;
      });
    } else {
      this.trangThaiGuiHoaDons[0].checked = this.trangThaiGuiHoaDons.filter(x => x.trangThaiId != -1).every(x => x.checked);
      this.trangThaiGuiHoaDons.forEach(x => {
        if (x.trangThaiChaId == data.trangThaiId) {
          x.checked = data.checked;
        }
      })
      if (data.trangThaiChaId) {
        if (this.trangThaiGuiHoaDons.filter(x => x.trangThaiChaId == data.trangThaiChaId && x.checked == true).length
          == this.trangThaiGuiHoaDons.filter(x => x.trangThaiChaId == data.trangThaiChaId).length) {
          this.trangThaiGuiHoaDons.forEach(x => {
            if (x.trangThaiId == data.trangThaiChaId) {
              if (x.checked == false) x.checked = true;
            }
          })
        }
      }
    }

    var ttGHDons = this.trangThaiGuiHoaDons[0].checked ? [-1] : this.trangThaiGuiHoaDons.filter(x => x.trangThaiId != -1 && x.checked).map(x => x.trangThaiId);
    this.mainForm.get('trangThaiGuiHoaDon').setValue(ttGHDons);
  }

  forkJoin() {
    return forkJoin([
      this.doiTuongService.GetAllPagingKhachHangXuatKhauAsync(this.displayDataDT),
      this.hoaDonDienTuService.GetTrangThaiHoaDon(),
      this.hoaDonDienTuService.GetTrangThaiGuiHoaDon(),
      this.boKyHieuHoaDonService.GetListForHoaDon(-1, moment().format('YYYY-MM-DD'), null, null, this.LoaiNghiepVu)
    ]);
  }
  getDoiTuongs() {
    this.doiTuongService.GetAllKhachHang().subscribe((rs: any) => {
      this.khachHangs = rs;
    })
  }
  createForm() {
    this.spinning = true;
    this.mainForm = this.fb.group({
      mode: [1],
      tuNgay: [moment().startOf('month').format('YYYY-MM-DD')],
      denNgay: [moment().format('YYYY-MM-DD')],
      hinhThucHoaDon: [-1],
      uyNhiemLapHoaDon: [-1],
      boKyHieuHoaDonId: [null],
      khachHangId: [null],
      loaiHoaDon: [null],
      trangThaiHoaDon: [null],
      trangThaiQuyTrinh: [null],
      trangThaiGuiHoaDon: [null],
      trangThaiChuyenDoi: [-1],
    });
  }

  export() {
    const params = this.mainForm.getRawValue();
    if (!params.loaiHoaDon || params.loaiHoaDon.length == 0) {
      this.message.error(`Vui lòng chọn loại ${this.textHD_PXK}!`)
      return;
    }
    if (!params.boKyHieuHoaDonId || params.boKyHieuHoaDonId.length == 0) {
      this.message.error(`Vui lòng chọn bộ ký hiệu ${this.textHD_PXK}!`)
      return;
    }
    if (!params.trangThaiHoaDon || params.trangThaiHoaDon.length == 0) {
      this.message.error(`Vui lòng chọn trạng thái ${this.textHD_PXK}!`)
      return;
    }
    if (!params.trangThaiQuyTrinh || params.trangThaiQuyTrinh.length == 0) {
      this.message.error(`Vui lòng chọn trạng thái quy trình!`)
      return;
    }
    if (!params.trangThaiGuiHoaDon || params.trangThaiGuiHoaDon.length == 0) {
      this.message.error(`Vui lòng chọn trạng thái gửi ${this.textHD_PXK}!`)
      return;
    }
    if (!params.khachHangId || params.khachHangId.length == 0) {
      this.message.error(`Vui lòng chọn khách hàng!`)
      return;
    }
    this.modal.destroy(params);
  }

  ngAfterViewChecked() {

  }

  changeKy(event: any) {
    var params = {
      fromDate: this.mainForm.get('tuNgay').value,
      toDate: this.mainForm.get('denNgay').value
    }
    SetDate(event, params);
    this.mainForm.get('tuNgay').setValue(params.fromDate)
    this.mainForm.get('denNgay').setValue(params.toDate)
    // SetDate(event, this.displayData);
  }

  blurDate() {
    var displayData: PagingParams = {
      fromDate: "",
      toDate: ""
    }
    displayData.fromDate = this.mainForm.get('tuNgay').value;
    displayData.toDate = this.mainForm.get('denNgay').value;
    CheckValidDateV2(displayData);
    const ky = GetKy(displayData);
    this.ky = ky;
    this.mainForm.patchValue({
      tuNgay: displayData.fromDate,
      denNgay: displayData.toDate
    });
  }

  destroyModal() {
    this.modal.destroy();
  }
  getData() {

  }

  searchDoiTuong(event: any) {

    let AllItemOpton = document.getElementsByClassName('ant-select-dropdown-menu-item ng-star-inserted');
    setTimeout(() => {
      if (AllItemOpton[0]) {
        let FirtItem = AllItemOpton[0].children;
        if (FirtItem.length == 1) {
          AllItemOpton[0].remove();
        }
      }
    }, 0);

    ;
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
    var giaTris = event ? event.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0 && giaTris.length == timKiemTheoChecked.length) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i];
      }
      this.displayDataDT.TimKiemTheo = result;
    } else {
      this.displayDataDT.TimKiemTheo = null;
    }

    this.displayDataDT.Keyword = event;
    this.displayDataDT.IsSearchKhachHangDeTrong = this.khachHangs.find(x => x.doiTuongId == '2') != null ? true : false;
    this.loadingSearchDropdown = true;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      console.log("🚀 ~ file: xuat-khau-chi-tiet-hoa-don-modal.component.ts:700 ~ XuatKhauChiTietHoaDonModalComponent ~ this.khachHangs=this.listKhachHangBeforeChange.filter ~ this.listKhachHangBeforeChange:", this.listKhachHangBeforeChange)
      this.doiTuongService.GetAllPagingKhachHangXuatKhauAsync(this.displayDataDT)
        .subscribe((res: any) => {
          this.loadingSearchDropdown = false;
          this.khachHangs = this.listKhachHangBeforeChange.filter((el) => {
            return res.some((f) => {
              return f.doiTuongId === el.doiTuongId;
            });
          });
          if (this.listKhachHangBeforeChange.find(ex => ex.doiTuongId == '-2').checked == true) {
            this.khachHangs.unshift({ doiTuongId: "-2", ten: 'Mã khách hàng để trống', checked: true });
          }
          if (!event || event == "") {
            let CheckAll = this.khachHangs.findIndex(ex => ex.doiTuongId == '-1');
            let CheckMaHang = this.khachHangs.findIndex(ex => ex.doiTuongId == '-2');
            if (CheckMaHang == -1) {
              this.khachHangs.unshift({ doiTuongId: "-2", ten: 'Mã khách hàng để trống', checked: false });
            }
            if (CheckAll == -1) {
              this.khachHangs.unshift({ doiTuongId: "-1", ten: 'Tất cả', checked: false });
            }

          }
        });

    });

  }
  openChangeDropDown(event: any, element = null) {
    if (event) {
      this.loadingSearchDropdown = true;
      if (element) {
        const component = element as NzSelectComponent;
        // Nếu chiều ngang select bị khuất thì điều chỉnh vị trí căn bên phải
        setTimeout(() => {
          var cdkOverlay = document.querySelector('.cdk-overlay-connected-position-bounding-box .ant-select-dropdown--single') as HTMLElement;
          var rect = cdkOverlay.getBoundingClientRect();
          if (rect.left + rect.width > window.innerWidth) {
            cdkOverlay.style.left = -(rect.width - component.triggerWidth) + 'px';
          }
        }, 0);
      }
      this.loadingSearchDropdown = false;

    }
  }
  // loadMoreDoiTuong(): void {
  //   this.isLoadingMore = true;

  //   if (this.displayDataDT.PageNumber >= this.totalPages) {
  //     this.isLoadingMore = false;
  //     return;
  //   }

  //   clearTimeout(this.typingTimer);
  //   this.typingTimer = setTimeout(() => {
  //     this.displayDataDT.PageNumber += 1;

  //     if (this.displayDataDT.PageNumber > this.totalPages) {
  //       this.isLoadingMore = false;
  //       return;
  //     }
  //     this.doiTuongService.GetAllPagingKhachHangXuatKhauAsync(this.displayDataDT)
  //       .subscribe((res: any) => {
  //         this.totalPages = res.totalPages;
  //         this.khachHangs = [...this.khachHangs, ...this.setListValue(res.items)];
  //         this.isLoadingMore = false;
  //       });
  //   }, 1000);
  // }

  AddOptionDefault() {
    if (!this.checkSelectTatCa()) {
      this.khachHangs.unshift({ doiTuongId: "-2", ten: 'Mã khách hàng để trống', checked: true });
      this.khachHangs.unshift({ doiTuongId: "-1", ten: 'Tất cả', checked: true });
    }

  }
  setListValue(list: any[]) {
    let check = this.checkSelectTatCa() == true ? true : false;
    for (let i = 0; i < list.length; list[i++].checked = check);
    return list;
  }

  checkSelectTatCa() {
    return this.khachHangs.some(x => x.doiTuongId == "-1");
  }

}