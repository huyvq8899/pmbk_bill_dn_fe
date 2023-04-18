import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { DownloadFile, getHeightBangKe, getHeightBangKeKhongChiTiet2, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3 } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { SumwidthConfig } from 'src/app/shared/global';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { GetList } from 'src/app/shared/chon-ky';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent } from '../../modals/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal.component';
import { BaoCaoService } from 'src/app/services/bao-cao/bao-cao.service';

@Component({
  selector: 'app-tab-tong-hop-gia-tri-hoa-don-da-su-dung',
  templateUrl: './tab-tong-hop-gia-tri-hoa-don-da-su-dung.component.html',
  styleUrls: ['./tab-tong-hop-gia-tri-hoa-don-da-su-dung.component.scss']
})
export class TabTongHopGiaTriHoaDonDaSuDungComponent extends TabShortKeyEventHandler implements OnInit {
  @ViewChild('fImportExcel', { static: false })
  _validFileExtensions = ['.xlsx', '.xls'];
  listBaoCao: any[] = [];
  filePath: string;
  kyBaoCao: string;
  thongTinVeLoaiTienVaTrangThai: string;
  loaiTiens: any[] = [];
  loaiTiensAll: any[] = [];
  khachHangSelected: any;
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  // paging param
  loading = false;
  total = 0;
  pageSizeOptions = [];
  
  filterVisible = false;
  dataSelected = null;
  kys = GetList();
  baoCao = null;
  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  listOfSelected: any[] = [];
  mapOfCheckedId: any = {};
  // fix table
  widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  lstBangKeEmpty: any;
  numberBangKeCols: any;

  constructor(
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private baoCaoService: BaoCaoService,
    private loaiTienService: LoaiTienService
  ) {
    super();
  }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "BaoCao").thaoTacs;
    }
    if(!this.baoCao || this.baoCao.mau == 1){
      this.numberBangKeCols = Array(9).fill(0);
    }
    else this.numberBangKeCols = Array(14).fill(0);
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listBaoCao);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listBaoCao);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
  }

  LoadData() {
    this.loading = true;
    this.baoCaoService.TongHopGiaTriHoaDonDaSuDung(this.baoCao).subscribe((data: any) => {
      this.listBaoCao = data.data;

      this.total = data.length;
      this.loading = false;
      this.getSubTitle();
      this.config(this.baoCao.mau);

      if(!this.baoCao || this.baoCao.mau == 1){
        this.numberBangKeCols = Array(9).fill(0);
      }
      else this.numberBangKeCols = Array(14).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listBaoCao);
      this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + 'px';
      if (this.listBaoCao && this.listBaoCao.length > 0) {
        this.selectedRow(this.listBaoCao[0]);
      }
    });
  }

  clickThem() {
    
  }

  clickSua() {
    
  }

  clickXoa() {
    
  }
  changeSearch(event: any) {
    if (event.keyCode == 13) {
      // if(this.valueSearch) {
      //   this.displayData.Keyword = this.valueSearch;
      // } else {
      //   this.displayData.Keyword = '';
      // }
      this.LoadData();
    }
  }
  selectedRow(data: any) {
    this.khachHangSelected = data;

    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;
      this.listBaoCao.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }
  }

  searchData(reset: boolean = false): void {
    this.LoadData();
  }

  exportExcel() {
    
  }

  search(colName: any) {
    this.LoadData();
  }

  sort(sort: { key: string; value: string }): void {
    this.LoadData();
  }

  clickXem() {

  }

  change(colName: any, event: any) {
    if (!event) {
      this.LoadData();
    }
  }

  exportPdf() {
    //
  }

  config(event: any) {
    if (event === 1) {
      this.widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
    } else {
      this.widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
    }
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
  }

  clickChonBaoCao() {
    const modal1 = this.modalService.create({
      nzTitle: 'Tổng hợp giá trị hóa đơn đã sử dụng',
      nzContent: ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        baoCao: this.baoCao,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.baoCao = {
          ...rs,
          tuNgay2: moment(rs.tuNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          denNgay2: moment(rs.denNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        };

        this.LoadData();
      }
    });
  }

  getSubTitle() {
    this.kyBaoCao = `Từ ngày ${this.baoCao.tuNgay2} đến ngày ${this.baoCao.denNgay2}`;
    this.thongTinVeLoaiTienVaTrangThai = '';
    
    if (this.baoCao.maLoaiTien) {
      this.thongTinVeLoaiTienVaTrangThai += `Loại tiền: ${this.baoCao.maLoaiTien}; `;
    }
    const arrayTrangThai = [];
    if (!this.baoCao.isKhongTinhGiaTriHoaDonGoc) {
      arrayTrangThai.push('Hóa đơn gốc');
    }
    if (!this.baoCao.isKhongTinhGiaTriHoaDonXoaBo) {
      arrayTrangThai.push('Hóa đơn xóa bỏ');
    }
    if (!this.baoCao.isKhongTinhGiaTriHoaDonThayThe) {
      arrayTrangThai.push('Hóa đơn thay thế');
    }
    if (!this.baoCao.isKhongTinhGiaTriHoaDonDieuChinh) {
      arrayTrangThai.push('Hóa đơn điều chỉnh');
    }
    this.thongTinVeLoaiTienVaTrangThai += 'Trạng thái hóa đơn: ' + (arrayTrangThai.length === 4 ? 'Tất cả' : arrayTrangThai.join(', '));
  }

  onPrintClick() {
    this.baoCao.kyBaoCao = this.kyBaoCao;
    this.baoCao.thongTinVeLoaiTienVaTrangThai = this.thongTinVeLoaiTienVaTrangThai;
    this.baoCao.tongHopGiaTriHoaDonDaSuDungs = this.listBaoCao;
    this.baoCao.loaiMau = this.baoCao.mau;
    this.baoCao.isPrint = true;

    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.ExportExcelTongHopGiaTriHoaDonDaSuDung(this.baoCao)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        window.open(link, '_blank');
        this.message.remove(id);
      });
  }

  onExportClick() {
    this.baoCao.kyBaoCao = this.kyBaoCao;
    this.baoCao.thongTinVeLoaiTienVaTrangThai = this.thongTinVeLoaiTienVaTrangThai;
    this.baoCao.tongHopGiaTriHoaDonDaSuDungs = this.listBaoCao;
    this.baoCao.loaiMau = this.baoCao.mau;
    this.baoCao.isPrint = false;

    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.ExportExcelTongHopGiaTriHoaDonDaSuDung(this.baoCao)
      .subscribe((res: any) => {
        const link = window.URL.createObjectURL(res);
        DownloadFile(link, `Tong_hop_gia_tri_hoa_don_da_su_dung.xlsx`);
        this.message.remove(id);
      });
  }

  onHelpClick() {
    ////
  }
}
