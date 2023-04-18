import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { PagingParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { BaoCaoService } from 'src/app/services/bao-cao/bao-cao.service';
import { ChonBaoCaoModalComponent } from '../../modals/chon-bao-cao-modal/chon-bao-cao-modal.component';
import { ThietLapTruongDuLieuModalComponent } from '../../modals/thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-modal.component';
import * as printJS from 'print-js';
import { ModalPreviewMutiplePdfComponent } from '../../modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { Message } from 'src/app/shared/Message';
import { SharedService } from 'src/app/services/share-service';
import { saveAs } from 'file-saver';
import { getHeightBangKeKhongChiTiet2, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { SumwidthConfig } from 'src/app/shared/global';

@Component({
  selector: 'app-tab-thong-ke-so-luong-hoa-don-da-phat-hanh',
  templateUrl: './tab-thong-ke-so-luong-hoa-don-da-phat-hanh.component.html',
  styleUrls: ['./tab-thong-ke-so-luong-hoa-don-da-phat-hanh.component.scss']
})
export class TabThongKeSoLuongHoaDonDaPhatHanhComponent implements OnInit {

  public domain = environment.apiurl;

  baoCao: any;

  filePath: string;

  filePathPrint: string;

  listOfData: any[] = [];

  loading: boolean;

  total: any = 0;

  totalTongSo: any = 0;

  totalDaSuDung: any = 0;

  totalDaXoaBo: any = 0;

  numberLine: any = 0;

  loadingExportExcel: boolean;

  displayData: PagingParams = {
    PageNumber: 1,
    PageSize: 1
  };
  displayData1: PagingParams = null;
  widthConfig = ['50px','300px', '300px', '300px', '350px', '350px', '350px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '800px' };
  permission: boolean=false;
  thaoTacs: any[]=[];
  ddtp = new DinhDangThapPhan();
  numberBangKeCols: any[];
  lstBangKeEmpty: any;
  
  constructor(
    private modalService: NzModalService,
    private baoCaoService: BaoCaoService,
    private message: NzMessageService,
    private sharedService: SharedService,
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
    //this.baoCao.tuNgay2 = this.baoCao.tuNgay.format("DD/MM/YYYY");
    // this.baoCao.denNgay2 = this.baoCao.denNgay.format("DD/MM/YYYY");
    this.numberBangKeCols = Array(7).fill(0);
    console.log(this.numberBangKeCols);
    this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listOfData);
    this.scrollConfig.y = (window.innerHeight - 220) + 'px';
  }

  filterData(_params: any) {
    this.loading = true;
    this.baoCaoService.ThongKeSoLuongHoaDonDaPhatHanhAsync(_params).subscribe((res: any) => {
      this.listOfData = res.data;
      this.baoCao.listSoLuongHoaDonDaPhatHanhs = res.data;

      // Update total
      this.numberLine = 0;
      this.totalTongSo = 0;
      this.totalDaSuDung = 0;
      this.totalDaXoaBo = 0;
      this.listOfData.forEach(element => {
        this.numberLine += 1;
        this.totalTongSo += element.tongSo;
        this.totalDaSuDung += element.daSuDung;
        this.totalDaXoaBo += element.daXoaBo;
      });

      this.total = this.listOfData.length;
      this.displayData.PageSize = this.total;
      this.filePath = res.filePath;
      this.loading = false;
    });
  }

  exportExcel() {
    this.loadingExportExcel = true;
    window.open(this.filePath);
    this.loadingExportExcel = false;
  }

  onPrintClick(){
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.PrintSoLuongHoaDonDaPhatHanhAsync(this.baoCao).subscribe((rs: any) => {
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
    this.baoCaoService.PrintSoLuongHoaDonDaPhatHanhAsync(this.baoCao).subscribe((rs: any) => {
      const pathPrint = rs.path;
      this.sharedService.DownloadPdf(pathPrint).subscribe((rs)=>{
        saveAs(rs, "THONG_KE_SO_LUONG_HOA_DON_DA_PHAT_HANH.pdf");
        this.loadingExportExcel = false;
      });
    });
  }


  clickChonBaoCao() {
    const modal1 = this.modalService.create({
      nzTitle: 'Thống kê số lượng hóa đơn đã phát hành',
      nzContent: ChonBaoCaoModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '50%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        baoCao: this.displayData1,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.displayData1 = rs;
        this.baoCao = {
          tuNgay: this.displayData1.fromDate,
          denNgay: this.displayData1.toDate,
          tuNgay2: moment(this.displayData1.fromDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          denNgay2: moment(this.displayData1.toDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        };
        
        
        this.filterData(this.baoCao);
      }
    });
  }

  onHelpClick() { }
  closeModal() {
  }
}
