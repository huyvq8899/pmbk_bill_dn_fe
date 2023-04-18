import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { SumwidthConfig } from 'src/app/shared/global';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { getTitleTheoLoaiHoaDon } from 'src/app/shared/SharedFunction';
import { ChonThamSoBangKeSaiSotModalComponent } from './chon-tham-so/chon-tham-so-bang-ke-sai-sot-modal.component';
import { EnvService } from 'src/app/env.service';
import * as moment from 'moment';
import { TabHoaDonXoaBoComponent } from 'src/app/views/hoa-don-dien-tu/tabs/tab-hoa-don-xoa-bo/tab-hoa-don-xoa-bo.component';
import { LichSuTruyenNhanDisplayXmldataComponent } from 'src/app/views/hoa-don-dien-tu/modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { TabThongDiepGuiComponent } from '../../tab-thong-diep-gui/tab-thong-diep-gui.component';
import { TabHoaDonDienTuComponent } from 'src/app/views/hoa-don-dien-tu/tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { TabNhatKyGuiEmailComponent } from 'src/app/views/tien-ich/tab-nhat-ky-gui-email/tab-nhat-ky-gui-email.component';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { LichSuTruyenNhanComponent } from 'src/app/views/hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { FilterColumn, FilterCondition } from 'src/app/models/PagingParams';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bang-ke-hoa-don-sai-sot-modal',
  templateUrl: './bang-ke-hoa-don-sai-sot-modal.component.html',
  styleUrls: ['./bang-ke-hoa-don-sai-sot-modal.component.scss']
})
export class BangKeHoaDonSaiSotModalComponent implements OnInit {
  @Input() params: any;
  widthConfig_TheoHoaDon = ['170px', '130px', '270px', '130px', '110px', '160px', '240px', '240px', '150px', '250px', '110px', '220px', '170px', '320px', '200px', '250px'];
  widthConfig_TheoThongBao = ['110px', '210px', '170px', '320px', '200px', '250px', '140px', '110px', '270px', '150px', '110px', '160px', '240px', '240px', '150px', '190px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig_TheoHoaDon), y: '65vh' };
  listData: any = [];
  loading = false;
  ddtp = new DinhDangThapPhan();
  getTitleLoaiHoaDon = getTitleTheoLoaiHoaDon;
  ActivedModal: any;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isPhieuXuatKho=false;
  txtHD_PXK_UPPER = "Hóa đơn";
  constructor(
    private env: EnvService,
    private router: Router,
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private tabNhatKyGuiEmailComponent: TabNhatKyGuiEmailComponent,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private tabHoaDonXoaBoComponent: TabHoaDonXoaBoComponent,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
    private hoaDonDienTuService: HoaDonDienTuService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
  ) { }

  ngOnInit() {
    const _url = this.router.url;
    if(_url.includes('phieu-xuat-kho')){
      this.isPhieuXuatKho = true;
      this.txtHD_PXK_UPPER = "PXK"
    }
    this.loadData();
    this.params.fromDate = moment(this.params.tuNgay);
    this.params.toDate = moment(this.params.denNgay);
  }

  loadData() {
    this.loading = true;
    this.thongDiepGuiCQTService.GetBangKeHoaDonSaiSot(this.params).subscribe((res: any) => {
      console.log(res);
      this.listData = res;
      this.loading = false;
    });
  }
  sort(sort: { key: string; value: string }): void {
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.loadData();
  }
  onFilterCol(rs: any) {
    const filterColData = this.params.filterColumns.find(x => x.colKey === rs.colKey && x.isFilter==true);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    //remove
    if (rs.status == false) {
      this.params.filterColumns = [];
      this.viewConditionList = [];
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = rs.isFilter;
    }
    // if(!rs.isFilter){
    //   this.params.filterColumns = [];
    //   this.viewConditionList = [];
    // }
    // this.loadData();
    this.loadViewConditionList();
  }
  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfVisbleFilterCol[colName] = event;

    this.inputFilterColData = this.params.filterColumns.find(x => x.colKey === colName) || null;

    if (!this.inputFilterColData) {
      this.inputFilterColData = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.params.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }

  loadViewConditionList() {

    this.params.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        var isDate = moment(item.colValue, 'YYYY-MM-DD', true).isValid();

        this.viewConditionList.push({
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: isDate ? moment(item.colValue).format('DD/MM/YYYY') : item.colValue
        });
      }
    });

    this.loadData();
  }
  //hàm này để tách ra chuỗi chứng từ liên quan
  //chuỗi chứng từ liên quan có kèm cả id của chứng từ
  getChungTuLienQuan(chungTuLienQuan: string) {
    if (chungTuLienQuan == null || chungTuLienQuan == '') return '';
    if (chungTuLienQuan.indexOf(';') >= 0) {
      let chuoiChungTu = chungTuLienQuan.split(';');
      return chuoiChungTu[0]; //index = 0 là tên hiển thị của chứng từ liên quan
      //index = 1: id của chứng từ liên quan
    }
    else {
      return chungTuLienQuan;
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }

  //hàm này để xem lỗi
  viewLoi(maThongDiepGui: string) {
    let data: any = { maThongDiep: maThongDiepGui };
    this.tabThongDiepGuiComponent.viewLoi(data);
  }

  //hàm này mở form chọn tham số xem bảng kê hóa đơn sai sót
  chonThamSoBangKeHoaDonSaiSot() {
    let modal = this.modalService.create({
      nzTitle: 'Chọn tham số lọc hóa đơn xử lý sai sót',
      nzContent: ChonThamSoBangKeSaiSotModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '580px',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        params: this.params
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.params = rs;
        this.params.fromDate = moment(this.params.tuNgay);
        this.params.toDate = moment(this.params.denNgay);
        this.loadData();
      }
    });
  }

  //xuất excel
  exportExcel() {
    let paramsToExport: any = {
      params: this.params,
      listBangKeSaiSot: this.listData
    };
    this.loading = true;
    this.thongDiepGuiCQTService.ExportExcelBangKeSaiSot(paramsToExport).subscribe((res: any) => {
      let chuoiTenFiles = res.result.split('/');
      let tenFile = chuoiTenFiles[chuoiTenFiles.length - 1];
      let URLFileTaiVe = this.env.apiUrl + '/' + res.result;

      this.thongDiepGuiCQTService.DownloadFile(URLFileTaiVe).subscribe(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = tenFile;
        a.click();
        URL.revokeObjectURL(objectUrl);
      });

      this.loading = false;
    });
  }

  //hàm này để xem hóa đơn
  xemHoaDon(hoaDonId: string) {
    let data: any = { hoaDonDienTuId: hoaDonId };
    this.tabHoaDonDienTuComponent.viewReceipt(data);
  }

  //hàm này để xem hóa đơn/chứng từ liên quan
  xemHoaDonChungTuLienQuan(data: any) {
    let chungTuLienQuan = data.chungTuLienQuan;
    console.log(data);
    //chungTuLienQuan là một chuỗi gồm tên và id; id đặt sau dấu ;, trừ trường hợp xóa hóa đơn có thêm chữ XHD- để mở ra form
    //xem biên bản hủy hóa đơn
    if (chungTuLienQuan == null || chungTuLienQuan == '') return;
    if (chungTuLienQuan.indexOf(';') >= 0) {
      let chuoiChungTu = chungTuLienQuan.split(';');
      let chuoiIdChungTuLienQuan = chuoiChungTu[1]; //index = 1: id của chứng từ liên quan
      let idChungTuLienQuan = '';
      let isHuyHoaDon = false;
      if (chuoiIdChungTuLienQuan.indexOf('XHD-') >= 0) {
        idChungTuLienQuan = chuoiIdChungTuLienQuan.substring(4);
        isHuyHoaDon = true;
      } else if (chungTuLienQuan.indexOf('TBSSTT-Email') >= 0) {
        let hoaDon: any = { refId: data.hoaDonDienTuId };
        this.tabNhatKyGuiEmailComponent.xemChiTiet(hoaDon);
      }
      else {
        idChungTuLienQuan = chuoiIdChungTuLienQuan;
      }

      if (idChungTuLienQuan) {

        if (isHuyHoaDon) //nếu hủy hóa đơn thì mở xem biên bản hủy hóa đơn
        {
          this.hoaDonDienTuService.GetById(idChungTuLienQuan).subscribe((rs: boolean) => {
            this.tabHoaDonXoaBoComponent.XoaBoHoaDon(rs);
          })
        }
        else //nếu không thì xem hóa đơn hoặc chứng từ
        {
          let hoaDon: any = { hoaDonDienTuId: idChungTuLienQuan, trangThaiQuyTrinh: data.trangThaiQuyTrinh };
          this.tabHoaDonDienTuComponent.viewReceipt(hoaDon);
          // this.tabHoaDonDienTuComponent.clickSua(false, true, hoaDon);
        }
      }
    }
  }

  //xem lịch sử truyền nhận
  viewLichSuTruyenNhan(data: any = null) {
    this.loading = true;
    if (data == null) {
      return;
    }
    if (!data.hoaDonDienTuId) {
      this.displayLichSuTruyenNhan(data);
      return;
    } else {
      if (this.ActivedModal != null) return;
      this.hoaDonDienTuService.GetById(data.hoaDonDienTuId)
        .subscribe(async (res: any) => {
          this.loading = false;

          if (this.ActivedModal != null) return;
          const modal1 = this.ActivedModal = this.modalService.create({
            nzTitle: "Lịch sử truyền nhận",
            nzContent: LichSuTruyenNhanComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: window.innerWidth / 100 * 96,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              data: [res],
              showForm: true,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            this.ActivedModal = null;
          });
        });
    }

  }
  displayLichSuTruyenNhan(data: any) {
    this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(data.maThongDiepGui).subscribe((rs: any) => {
    this.loading = false;
    if (rs != null) {
        if (this.ActivedModal != null) return;
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Lịch sử truyền nhận",
          nzContent: LichSuTruyenNhanComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 96,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: [rs],
            maTD: data.maThongDiepGui,
            showForm: false,
            loaiTD: 100,

          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      }
    });
  }
  xemthongdiep300(data: any = null) {
    if (data) {
      this.quyDinhKyThuatService.GetThongDiepChungById(data.thongDiepChungId).subscribe((rs: any) => {
        this.tabThongDiepGuiComponent.clickSua(false, true, rs);
      });

    }
  }

  //xem file xml của thông điệp 204, 301
  xemFileXML(thongDiepChungId: string) {
    this.thongDiepGuiCQTService.GetXMLContent(thongDiepChungId).subscribe((res: any) => {
      this.modalService.create({
        nzTitle: "Chi tiết thông điệp",
        nzContent: LichSuTruyenNhanDisplayXmldataComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: window.innerWidth / 100 * 80,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          fileData: res.result,
        },
        nzFooter: null
      });
    });
  }
}
