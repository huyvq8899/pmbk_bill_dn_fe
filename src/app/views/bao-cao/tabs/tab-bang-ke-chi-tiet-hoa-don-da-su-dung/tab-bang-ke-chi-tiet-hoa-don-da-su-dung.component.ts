import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { PagingParams } from 'src/app/models/PagingParams';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { BaoCaoService } from 'src/app/services/bao-cao/bao-cao.service';
import { ChonBaoCaoModalComponent } from '../../modals/chon-bao-cao-modal/chon-bao-cao-modal.component';
import { ChonBaoCaoChiTietHoaDonModalComponent } from '../../modals/chon-bao-cao-chi-tiet-hoa-don-modal/chon-bao-cao-chi-tiet-hoa-don-modal.component';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { ThietLapTruongDuLieuModalComponent } from '../../modals/thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-modal.component';
import { SumwidthConfig } from 'src/app/shared/global';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from '../../modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { SharedService } from 'src/app/services/share-service';
import { saveAs } from 'file-saver';
import { getHeightBangKeKhongChiTiet, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet4, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, showModalPreviewPDF } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-tab-bang-ke-chi-tiet-hoa-don-da-su-dung',
  templateUrl: './tab-bang-ke-chi-tiet-hoa-don-da-su-dung.component.html',
  styleUrls: ['./tab-bang-ke-chi-tiet-hoa-don-da-su-dung.component.scss']
})
export class TabBangKeChiTietHoaDonDaSuDungComponent implements OnInit {

  public domain = environment.apiurl;

  baoCao: any;

  filePath: string;

  filePathPrint: string;

  listOfData: any[] = [];

  loading: boolean;

  total: any = 0;

  totalThanhTienSauThue: any = 0;

  totalThanhTien: any = 0;

  totalThanhTienQuyDoi: any = 0;

  totalTienChietKhau: any = 0;

  totalTienChietKhauQuyDoi: any = 0;

  totalDoanhThuChuaThue: any = 0;

  totalDoanhThuChuaThueQuyDoi: any = 0;

  totalTienThueGTGT: any = 0;

  totalTienThueGTGTQuyDoi: any = 0;

  totalTongTienThanhToan: any = 0;

  totalTongTienThanhToanQuyDoi: any = 0;

  numberLine: any = 0;

  loadingExportExcel: boolean;

  displayData: PagingParams = {
    PageNumber: 1,
    PageSize: 1
  };

  sortField: any[]=[];
  scrollConfig = { x: '0px', y: '800px' };
  widthConfig = [];
  permission: boolean=false;
  thaoTacs: any[]=[];
  numberBangKeCols: any[];
  lstBangKeEmpty: any;
  
  constructor(
    private modalService: NzModalService,
    private baoCaoService: BaoCaoService,
    private tuyChonService: TuyChonService,
    private sharedService: SharedService,
    private message: NzMessageService
   ) { }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if(phanQuyen == 'true'){
      this.permission = true;
    }
    else{
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x=>x.functionName == "BaoCao").thaoTacs;
    }
    this.getSortField();
    //this.baoCao.tuNgay2 = this.baoCao.tuNgay.format("DD/MM/YYYY");
    // this.baoCao.denNgay2 = this.baoCao.denNgay.format("DD/MM/YYYY");
    this.scrollConfig.y = (window.innerHeight - 200) + 'px';
  }

  filterData(_params: any) {
    this.loading = true;
    this.baoCaoService.BangKeChiTietHoaDonAsync(_params).subscribe((res: any) => {
      this.listOfData = res.data;
      this.baoCao.bangKeChiTietHoaDons = res.data;
      this.getSortField();
      console.log(this.listOfData);
      // Update total
      this.numberLine = 0;
      this.totalThanhTienSauThue = 0;
      this.totalThanhTien = 0;
      this.totalThanhTienQuyDoi = 0;
      this.totalTienChietKhau = 0;
      this.totalTienChietKhauQuyDoi = 0;
      this.totalDoanhThuChuaThue = 0;
      this.totalDoanhThuChuaThueQuyDoi = 0;
      this.totalTienThueGTGT = 0;
      this.totalTienThueGTGTQuyDoi = 0;
      this.totalTongTienThanhToan = 0;
      this.totalTongTienThanhToanQuyDoi = 0;
      this.listOfData.forEach(element => {
        this.numberLine += 1;
        this.totalThanhTienSauThue += element.thanhTienSauThue;
        this.totalThanhTien += element.thanhTien;
        this.totalThanhTienQuyDoi += element.thanhTienQuyDoi;
        this.totalTienChietKhau += element.tienChietKhau;
        this.totalTienChietKhauQuyDoi += element.tienChietKhauQuyDoi;
        this.totalDoanhThuChuaThue += element.doanhThuChuaThue;
        this.totalDoanhThuChuaThueQuyDoi += element.doanhThuChuaThueQuyDoi;
        this.totalTienThueGTGT += element.tienThueGTGT;
        this.totalTienThueGTGTQuyDoi += element.tienThueGTGTQuyDoi;
        this.totalTongTienThanhToan += element.tongTienThanhToan;
        this.totalTongTienThanhToanQuyDoi += element.tongTienThanhToanQuyDoi;
      });

      this.total = this.listOfData.length;
      this.displayData.PageSize = this.total;
      this.filePath = res.filePath;
      this.loading = false;
    });
  }

  getSortField(){
    this.widthConfig = []; 
    this.tuyChonService.GetThongTinHienThiTruongDL("BangKeChiTietHoaDon").subscribe((rs: any[])=>{
      this.sortField = rs;
      var x = 0;
      this.sortField.forEach(ele=>{
        if(ele.status == true){
        ele.sizePx = ele.size + "px";
        this.widthConfig.push(ele.sizePx);
        }
      })

      this.scrollConfig.x = SumwidthConfig(this.widthConfig);
      this.numberBangKeCols = Array(this.sortField.length).fill(0);
      console.log(this.numberBangKeCols);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listOfData);
      this.scrollConfig.y = (window.innerHeight - 200) + 'px';
    });
  }
  exportExcel() {
    this.loadingExportExcel = true;
    window.open(this.filePath);
    this.loadingExportExcel = false;
  }

  onPrintClick(){
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.PrintBangKeChiTietHoaDonAsync(this.baoCao).subscribe((rs: any) => {
      const pathPrint = rs.path;
      showModalPreviewPDF(this.modalService, pathPrint);
      this.message.remove(id);
    }, (err) => {
      this.message.warning("Lỗi khi in");
      this.message.remove(id);
    });
  }

  ExportPDF(){
    this.loadingExportExcel = true;
    this.baoCaoService.PrintBangKeChiTietHoaDonAsync(this.baoCao).subscribe((rs: any) => {
      const pathPrint = rs.path;
      this.sharedService.DownloadPdf(pathPrint).subscribe((rs)=>{
        saveAs(rs, "BANG_KE_CHI_TIET_HOA_DON.pdf");
        this.loadingExportExcel = false;
      });
    });
  }
  
  clickChonBaoCao() {
    const modal1 = this.modalService.create({
      nzTitle: 'Bảng kê chi tiết hóa đơn đã sử dụng',
      nzContent: ChonBaoCaoChiTietHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '50%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        baoCao: this.baoCao,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.baoCao = rs;
        this.baoCao = {
          ...rs,
          congGopTheoHoaDon: rs.congGopTheoHoaDon == null ? false : rs.congGopTheoHoaDon,
          tuNgay2: moment(rs.tuNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          denNgay2: moment(rs.denNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        };
        console.log(this.baoCao);
        
        this.filterData(this.baoCao);
      }
    });
  }

  thietLapTruongDuLieu(){
    const modal1 = this.modalService.create({
      nzTitle: 'Thiết lập trường dữ liệu',
      nzContent: ThietLapTruongDuLieuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        ChucNang: 'BangKeChiTietHoaDon',
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        
        this.getSortField();
      }
    });
  }

  onHelpClick() { }
  closeModal() {
  }

  getDataWithFieldName(fieldName: any, data: any){
    switch(fieldName){
      case 'stt':
        return data.stt;
      case 'ngayHoaDon':
        return data.ngayHoaDon;
      case 'soHoaDon':
        return data.soHoaDon;
      case 'mauSoHoaDon':
        return data.mauSoHoaDon;
      case 'kyHieuHoaDon':
        return data.kyHieuHoaDon;
      case 'maKhachHang':
        return data.maKhachHang;
      case 'tenKhachHang':
        return data.tenKhachHang;
      case 'diaChi':
        return data.diaChi;
      case 'maSoThue':
        return data.maSoThue;
      case 'nguoiMuaHang':
        return data.nguoiMuaHang;
      case 'loaiTien':
        return data.loaiTien;
      case 'tyGia':
        return data.tyGia;
      case 'maHang':
        return data.maHang;
      case 'tenHang':
        return data.tenHang;
      case 'donViTinh':
        return data.donViTinh;
      case 'soLuong':
        return data.soLuong;
      case 'donGiaSauThue':
        return data.donGiaSauThue;
      case 'donGia':
        return data.donGia;
      case 'thanhTienSauThue':
        return data.thanhTienSauThue;
      case 'thanhTienQuyDoi':
        return data.thanhTienQuyDoi;
      case 'tyLeChietKhau':
        return data.tyLeChietKhau;
      case 'tienChietKhau':
        return data.tienChietKhau;
      case 'tienChietKhauQuyDoi':
        return data.tienChietKhauQuyDoi;
      case 'doanhSoBanChuaThue':
        return data.doanhSoBanChuaThue;
      case 'doanhSoBanChuaThueQuyDoi':
        return data.doanhSoBanChuaThueQuyDoi;
      case 'thueGTGT':
        return data.thueGTGT;
      case 'tienThueGTGT':
        return data.tienThueGTGT;
      case 'tienThueGTGTQuyDoi':
        return data.tienThueGTGTQuyDoi;
      case 'tongTienThanhToan':
        return data.tongTienThanhToan;
      case 'tongTienThanhToanQuyDoi':
        return data.tongTienThanhToanQuyDoi;
      case 'hangKhuyenMai':
        return data.hangKhuyenMai;
      case 'maQuyCach':
        return data.maQuyCach;
      case 'soLo':
        return data.soLo;
      case 'hanSuDung':
        return data.hanSuDung;
      case 'soKhung':
        return data.soKhung;
      case 'soMay':
        return data.soMay;
      case 'xuatBanPhi':
        return data.xuatBanPhi;
      case 'ghiChu':
        return data.ghiChu;
      case 'maNhanVien':
        return data.maNhanVien;
      case 'tenNhanVien':
        return data.tenNhanVien;
      case 'loaiHoaDon':
        return data.loaiHoaDon;
      case 'trangThaiHoaDon':
        return data.trangThaiHoaDon;
      case 'trangThaiPhatHanh':
        return data.trangThaiQuyTrinh;
      case 'maTraCuu':
        return data.maTraCuu;
      case 'lyDoXoaBo':
        return data.lyDoXoaBo;
      case 'ngayLap':
        return data.ngayLap;
      case 'nguoiLap':
        return data.nguoiLap;
     }
  }
}
