import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { PagingParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { BaoCaoService } from 'src/app/services/bao-cao/bao-cao.service';
import { ChonBaoCaoModalComponent } from '../chon-bao-cao-modal/chon-bao-cao-modal.component';
import { ThietLapTruongDuLieuModalComponent } from '../thiet-lap-truong-du-lieu-modal/thiet-lap-truong-du-lieu-modal.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin } from 'rxjs';
import { ChonKyTinhThueModalComponent } from '../chon-ky-tinh-thue-modal/chon-ky-tinh-thue-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { SumwidthConfig } from 'src/app/shared/global';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from '../modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { SharedService } from 'src/app/services/share-service';
import { saveAs } from 'file-saver';
import { showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-bao-cao-tinh-hinh-su-dung-hoa-don-content',
  templateUrl: './bao-cao-tinh-hinh-su-dung-hoa-don-content.component.html',
  styleUrls: ['./bao-cao-tinh-hinh-su-dung-hoa-don-content.component.scss']
})
export class BaoCaoTinhHinhSuDungHoaDonContentComponent implements OnInit {
  @Input() fbEnableEdit: boolean;
  @Input() baoCao: any;
  @Input() isView: boolean

  public domain = environment.apiurl;

  spinning = false;

  baoCaoForm: FormGroup;

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

  scrollConfig = { x: '0px', y: '0px' };
  widthConfig = ["50px", "50px", "200px", "150px", "150px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "100px", "130px", "100px", "130px", "100px", "130px", "100px", "100px", "100px"];
  permission: boolean=false;
  thaoTacs: any[]=[];
  ddtp = new DinhDangThapPhan();

  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnSaveDisable: boolean;
  thongTinCty: any;
  excelPath: any;
  
  constructor(
    private modalService: NzModalService,
    private baoCaoService: BaoCaoService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private hoSoHDDTService: HoSoHDDTService,
    private message: NzMessageService,
    private modal: NzModalRef,
   ) { 
    this.getThongTinCty();
   }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if(phanQuyen == 'true'){
      this.permission = true;
    }
    else{
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.find(x=>x.functionName == "BaoCao").thaoTacs;
    }
    //this.baoCao.tuNgay2 = this.baoCao.tuNgay.format("DD/MM/YYYY");
    // this.baoCao.denNgay2 = this.baoCao.denNgay.format("DD/MM/YYYY");

    this.createForm();
    this.scrollConfig.y = (window.innerHeight - 200) + 'px';
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.disableOrEnableHeaderButtons();
  }

  disableOrEnableHeaderButtons() {
    if (this.fbEnableEdit === false) {
      this.disableControls(true);
      this.fbBtnSaveDisable = true;
      this.fbBtnPlusDisable = false;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = false;
    } else {
      this.disableControls(false);
      this.fbBtnSaveDisable = false;
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = true;
      this.fbBtnDeleteDisable = true;
      this.fbBtnPrinterDisable = true;
    }
  }

  disableControls(disabled = true) {
    if (disabled) {
      
      this.fbBtnPlusDisable = false;
      this.fbBtnEditDisable = false;
      this.fbBtnDeleteDisable = false;
      this.fbBtnPrinterDisable = false;
      this.fbBtnSaveDisable = true;
      this.baoCaoForm.disable();
      (this.baoCaoForm.get('chiTiets') as FormArray)
        .controls
        .forEach(control => {
          control.disable();
        });
    } else {
      this.fbBtnPlusDisable = true;
      this.fbBtnEditDisable = true;
      this.fbBtnDeleteDisable = true;
      this.fbBtnPrinterDisable = true;
      this.fbBtnSaveDisable = false;
      this.baoCaoForm.enable();
      (this.baoCaoForm.get('chiTiets') as FormArray)
        .controls
        .forEach(control => {
          control.enable();
        });
    }
  }

  forkJoin(){
    return forkJoin([
      this.hoSoHDDTService.GetDetail()
    ]);
  }

  getThongTinCty(){
    this.hoSoHDDTService.GetDetail().subscribe((res: any)=>{
      this.thongTinCty = res;
    })
  }
  createForm() {
    this.baoCaoForm = this.fb.group({
      baoCaoTinhHinhSuDungHoaDonId: [this.baoCao.baoCaoTinhHinhSuDungHoaDonId],
      tenNguoiLap: [this.baoCao.tenNguoiLap],
      tenNguoiDaiDienPhapLuat: [this.baoCao.tenNguoiDaiDienPhapLuat],
      ngayLap: [moment(this.baoCao.ngayLap).format("YYYY-MM-DD")],
      chiTiets: this.fb.array([])
    });

    this.spinning = true;
    console.log(this.baoCao);
    this.baoCaoForm.patchValue({
      ...this.baoCao,
    });

    const chiTiets = this.baoCao.chiTiets;
    const chiTietFormArray = this.baoCaoForm.get('chiTiets') as FormArray;
    chiTietFormArray.clear();
    if(chiTiets.length > 0){
      chiTiets.forEach((item: any) => {
        const formGroup = this.createBaoCaoChiTiets(item);
        if (this.fbEnableEdit == false) formGroup.disable();
        chiTietFormArray.push(formGroup);
      });
    }
    else{
      const formGroup = this.createBaoCaoChiTiets(null);
      if (this.fbEnableEdit == false) formGroup.disable();
      chiTietFormArray.push(formGroup);
    }

    this.excelPath = this.baoCao.excelPath;
    this.spinning = false;
  }

  createBaoCaoChiTiets(data: any = null): FormGroup {
    return this.fb.group({
      baoCaoTinhHinhSuDungHoaDonChiTietId: [data == null ? null : data.baoCaoTinhHinhSuDungHoaDonChiTietId],
      baoCaoTinhHinhSuDungHoaDonId: [data == null ? null : data.baoCaoTinhHinhSuDungHoaDonId],
      loaiHoaDon: [data == null ? null : data.loaiHoaDon],
      mauSo: [data == null ? null : data.mauSo],
      kyHieu: [data == null ? null : data.kyHieu],
      tongSo: [data == null ? 0 : data.tongSo],
      tonDauKyTu: [data == null ? null : data.tonDauKyTu],
      tonDauKyDen: [data == null ? null : data.tonDauKyDen],
      trongKyTu: [data == null ? null : data.trongKyTu],
      trongKyDen: [data == null ? null : data.trongKyDen],
      suDungTu: [data == null ? null : data.suDungTu],
      suDungDen: [data == null ? null : data.suDungDen],
      tongSoSuDung: [data == null ? 0 : data.tongSoSuDung],
      daSuDung: [{ value: data == null ? 0 : data.daSuDung}],
      daXoaBo: [data == null ? 0 : data.daXoaBo],
      soXoaBo: [data == null ? null : data.soXoaBo],
      daMat: [data == null ? 0 : data.daMat],
      soMat: [data == null ? null : data.soMat],
      daHuy: [data == null ? 0 : data.daHuy],
      soHuy: [data == null ? null : data.soHuy],
      tonCuoiKyTu: [data == null ? null : data.tonCuoiKyTu],
      tonCuoiKyDen: [data == null ? null : data.tonCuoiKyDen],
      soLuongTon: [data == null ? 0 : data.soLuongTon]
    });
  }
  
  async addItem() {
    const pndetail = this.baoCaoForm.get('chiTiets') as FormArray;
    const chiTiets = pndetail.value as any[];

    if (chiTiets.length === 0) {
      pndetail.push(this.createBaoCaoChiTiets({
        tongSo: 0,
        tongSoSuDung: 0,
        daSuDung: 0,
        daXoaBo: 0,
        daMat: 0,
        daHuy: 0,
        soLuongTon : 0
      }));
    } else {
        const lastItem = chiTiets[chiTiets.length - 1];
        pndetail.push(this.createBaoCaoChiTiets({
          loaiHoaDon: lastItem.loaiHoaDon,
          kyHieuMauSoHoaDon: lastItem.kyHieuMauSoHoaDon,
          kyHieuHoaDon: lastItem.kyHieuHoaDon,
          tongSo: lastItem.tongSo,
          tonDauKyTu: lastItem.tonDauKyTu,
          tonDauKyDen: lastItem.tonDauKyDen,
          trongKyTu: lastItem.trongKyTu,
          trongKyDen: lastItem.trongKyDen,
          suDungTu: lastItem.suDungTu,
          suDungDen: lastItem.suDungDen,
          tongSoSuDung: lastItem.tongSoSuDung,
          daSuDung: lastItem.daSuDung,
          daXoaBo: lastItem.daXoaBo,
          soXoaBo: lastItem.soXoaBo,
          daMat: lastItem.daMat,
          soMat: lastItem.soMat,
          daHuy: lastItem.daHuy,
          soHuy: lastItem.soHuy,
          tonCuoiKyTu: lastItem.tonCuoiKyTu,
          tonCuoiKyDen: lastItem.tonCuoiKyDen,
          soLuongTon: lastItem.soLuongTon
        }));
    }
  }

  removeRow(i: any) {
    const hoaDonChiTietFormArray = this.baoCaoForm.get('chiTiets') as FormArray;
    hoaDonChiTietFormArray.removeAt(i);
  }

  exportExcel() {
    this.loadingExportExcel = true;
    window.open(this.excelPath);
    this.loadingExportExcel = false;
  }

  exportPdf(){
    this.loadingExportExcel = true;
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.PrintBaoCaoTinhHinhSuDungHoaDonAsync(this.baoCao).subscribe((rs: any)=>{
      const pathPrint = rs.path;
      this.sharedService.DownloadPdf(pathPrint).subscribe((res: any)=>{
        saveAs(res, "TINH_HINH_SU_DUNG_HOA_DON.pdf");
        this.message.remove(id);
        this.loadingExportExcel = false;
      })
    })
  }

  onPrintClick(){
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.baoCaoService.PrintBaoCaoTinhHinhSuDungHoaDonAsync(this.baoCao).subscribe((rs: any) => {
      const pathPrint = rs.path;
      showModalPreviewPDF(this.modalService, pathPrint);
      this.message.remove(id);
    }, (err) => {
      this.message.warning("Lỗi khi in");
      this.message.remove(id);
    });
  }

  onEditClick() {
    this.fbEnableEdit = true;
    this.disableOrEnableHeaderButtons();
  }

  submitForm(){
    const data = this.baoCaoForm.getRawValue();
    this.baoCaoService.CapNhatBaoCaoTinhHinhSuDungHoaDon(data).subscribe((res: any) => {
      if (res) {
        this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
        this.spinning = false;
        this.modal.destroy(res);
      }
    }, _ => {
      this.spinning = false;
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
    }); 
  }

  onAddObjClick() {
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
        };
        
        this.baoCaoService.CheckNgayThangBaoCaoTinhHinhSuDungHD(this.baoCao).subscribe(res=>{
          if(res != null){
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
                this.message.success("Thêm thành công!")
              }
              else{
                this.message.error("Thêm bị lỗi")
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

  xem(data){
    this.baoCaoService.GetById(data.baoCaoTinhHinhSuDungHoaDonId).subscribe((rs: any)=>{
      const modal1 = this.modalService.create({
        nzTitle: 'Tình hình sử dụng hóa đơn',
        nzContent: BaoCaoTinhHinhSuDungHoaDonContentComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '400',
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
        }
      });
    })
  }

  onHelpClick() { }
  closeModal() {
    this.modal.destroy();
  }
}
