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
import { ChonKyTinhThueModalComponent } from '../../modals/chon-ky-tinh-thue-modal/chon-ky-tinh-thue-modal.component';
import { BaoCaoTinhHinhSuDungHoaDonContentComponent } from '../../modals/bao-cao-tinh-hinh-su-dung-hoa-don-content/bao-cao-tinh-hinh-su-dung-hoa-don-content.component';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { getHeightBangKe, getHeightBangKeKhongChiTiet2, getHeightBangKeKhongChiTiet4, getListEmptyBangKe, getListEmptyBangKeKhongChiTiet2 } from 'src/app/shared/SharedFunction';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from '../../modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { SumwidthConfig } from 'src/app/shared/global';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-tab-bao-cao-tinh-hinh-su-dung-hoa-don',
  templateUrl: './bao-cao-tinh-hinh-su-dung-hoa-don.component.html',
  styleUrls: ['./bao-cao-tinh-hinh-su-dung-hoa-don.component.scss']
})
export class TabBaoCaoTinhHinhSuDungHoaDonComponent implements OnInit {

  public domain = environment.apiurl;

  baoCao: any;

  kys = GetList();

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

  params: PagingParams = {
    Ky: 5,
    fromDate: moment().startOf('month').format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    PageNumber: 1,
    PageSize: 1
  };

  sortField: any[]=[];
  widthConfig=["850px", "200px", "200px", "200px"];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '800px' };
  permission: boolean=false;
  thaoTacs: any[]=[];
  numberBangKeCols: any[];
  lstBangKeEmpty: any;
  
  constructor(
    private modalService: NzModalService,
    private baoCaoService: BaoCaoService,
    private tuyChonService: TuyChonService,
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
    //this.baoCao.tuNgay2 = this.baoCao.tuNgay.format("DD/MM/YYYY");
    // this.baoCao.denNgay2 = this.baoCao.denNgay.format("DD/MM/YYYY");
    this.scrollConfig.y = (window.innerHeight - 200) + 'px';
    this.filterData();
  }

  filterData() {
    this.loading = true;
    this.baoCaoService.GetListTinhHinhSuDungHoaDon(this.params).subscribe((res: any) => {
      this.listOfData = res.data;

      this.total = this.listOfData.length;
      this.params.PageSize = this.total;
      this.filePath = res.filePath;

      this.numberBangKeCols = Array(4).fill(0);
      console.log(this.numberBangKeCols);
      this.lstBangKeEmpty = getListEmptyBangKeKhongChiTiet2(this.listOfData);
      this.scrollConfig.y = getHeightBangKeKhongChiTiet2() + 'px';
      
      if(this.listOfData.length > 0)
      this.selectedRow(this.listOfData[0]);
      this.loading = false;
    });
  }

  onDeleteClick(){
    const vals = this.listOfData.filter(x=>x.selected == true);
    const data = vals[0];
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: `Xóa báo cáo tình hình sử dụng hóa đơn`,
        msContent: "Bạn có muốn xóa báo cáo tình hình sử dụng hóa đơn này không?",
        msOnClose: () => {
        },
        msOnOk: ()=>{
          this.baoCaoService.XoaBaoCaoTinhHinhSuDungHoaDon(data.baoCaoTinhHinhSuDungHoaDonId).subscribe((rs: boolean)=>{
            if(rs){
              this.message.success("Xóa báo cáo thành công");
            }
            else{
              this.message.success("Xóa báo cáo thành công");
            }
  
            this.filterData();
          });
        }
      }
    });

  }
  selectedRow(data){
    if(data.selected == true) {
      data.selected = false;
      return;
    }
    this.listOfData.forEach(x=>{
      if(x.selected == true) x.selected = false;
    })
    
    data.selected = true;
  }

  exportExcel() {
    this.loadingExportExcel = true;
    window.open(this.filePath);
    this.loadingExportExcel = false;
  }

  clickChonBaoCao() {
    const modal1 = this.modalService.create({
      nzTitle: 'Chọn kỳ tính thuế',
      nzContent: ChonKyTinhThueModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400',
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
          tuNgay2: moment(rs.tuNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          denNgay2: moment(rs.denNgay, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          actionUser: JSON.parse(localStorage.getItem('currentUser'))
        };
        
        this.baoCaoService.CheckNgayThangBaoCaoTinhHinhSuDungHD(this.baoCao).subscribe(res=>{
          if(res){
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Confirm,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msTitle: `Kiểm tra lại`,
                msContent: `Đã tồn tại báo cáo được lập có kỳ trùng hoặc giao với kỳ đang chọn (từ ngày </b>${moment(this.baoCao.tuNgay).format("DD/MM/YYYY")}</b> đến ngày <b>${moment(this.baoCao.denNgay).format("DD/MM/YYYY")}</b>). Bạn có muốn xem lại không?`,
                msOnClose: () => {
                },
                msOnOk: ()=>{
                  this.viewDetail(res);
                }
              }
            });
          }
          else{
            this.baoCaoService.ThemBaoCaoTinhHinhSuDungHoaDon(this.baoCao).subscribe(rs=>{
              if(rs){
                this.filterData();
              }
            });
          }
        })

      }
    });
  }

  viewDetail(data: any){
    this.baoCaoService.GetBaoCaoByKyTinhThue(data).subscribe((rs: any)=>{
      this.xem(rs);
    });
  }

  changeKy(event: any) {
    SetDate(event, this.params);
  }
  
  blurDate() {
    const ky = GetKy(this.params);
    this.params.Ky = ky;
  }


  xem(data){
    this.baoCaoService.GetById(data.baoCaoTinhHinhSuDungHoaDonId).subscribe((rs: any)=>{
      const modal1 = this.modalService.create({
        nzTitle: 'Tình hình sử dụng hóa đơn',
        nzContent: BaoCaoTinhHinhSuDungHoaDonContentComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '80%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          baoCao: rs,
          fbEnableEdit: false
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.filterData();
        }
      });
    })
  }
  
  onHelpClick() { }
  closeModal() {
  }
}
