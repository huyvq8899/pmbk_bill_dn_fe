import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PagingParams } from 'src/app/models/PagingParams';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { SharedService } from 'src/app/services/share-service';
import { saveAs } from 'file-saver';
import { EnvService } from 'src/app/env.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import * as moment from 'moment';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { LichSuTruyenNhanDisplayXmldataComponent } from 'src/app/views/hoa-don-dien-tu/modals/lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { showModalPreviewPDF } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-chi-tiet-thong-diep-modal',
  templateUrl: './chi-tiet-thong-diep-modal.component.html',
  styleUrls: ['./chi-tiet-thong-diep-modal.component.scss']
})
export class ChiTietThongDiepModalComponent implements OnInit {
  @Input() thongDiepDoc: any;
  listThongDiepLienQuan: any = [];
  loading = false;
  scrollConfig = { y: '450px' };
  message: any;

  constructor(private modal: NzModalService, private thongTinGuiNhanCQTsv: ThongDiepGuiNhanCQTService, private sharedService: SharedService,
    private thongDiepGuiNhanCQTsv: ThongDiepGuiNhanCQTService, private env: EnvService, private quyDinhKyThuatsv: QuyDinhKyThuatService,
    private messager: NzMessageService,
    private modalService: NzModalService,) { }

  ngOnInit(): void {
    this.getAllListTDHDon();
  }

  getAllListTDHDon() {
    this.loading = true;
    if(this.thongDiepDoc.maThongDiep){
      this.thongTinGuiNhanCQTsv.GetAllThongDiepLienQuan(this.thongDiepDoc.maThongDiep).subscribe((rs: any) => {
        if(rs){
          this.listThongDiepLienQuan = rs;
        }
        this.loading = false;
      });
    }
    else this.loading = false;
  }

  // viewDetail(data: any) {
  //   const modal = this.modal.create({
  //     nzTitle: 'Chi tiết thông điệp',
  //     nzContent: ViewXmlModalComponent,
  //     nzMaskClosable: false,
  //     nzClosable: true,
  //     nzWidth: '60%',
  //     nzStyle: { top: '10px' },
  //     nzBodyStyle: { padding: '20px' },
  //     nzComponentParams: {
  //       chiTiet: data.dataXML
  //     },
  //     nzFooter: null
  //   });
  // }
  viewDetail(data: any) {
    const modal1 = this.modalService.create({
      nzTitle: "Chi tiết",
      nzContent: LichSuTruyenNhanDisplayXmldataComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 60,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        fileData: data.dataXML,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {

    });
  }

  viewPreviewPDF(data: any) {
    this.loading = true;
    switch (data.maLoaiThongDiep) {
      case 102:
      case 103:
        this.quyDinhKyThuatsv.ConvertThongDiepToFilePDF(data).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          this.sharedService.DownloadPdf(pathPrint).subscribe((rs) => {
            saveAs(rs, "THONG_DIEP_103.pdf");
            this.loading = false;
          });
        });
        break;
      case 301:
        this.thongDiepGuiNhanCQTsv.GetPdfFile301(data.thongDiepChungId).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.path}`;
          this.sharedService.DownloadPdf(pathPrint).subscribe((rs) => {
            saveAs(rs, "THONG_DIEP_301.pdf");
            this.loading = false;
          });
        });
        break;
      default: break;
    }

  }
    downloadFileXML(data: any) {
    /// decode xml
    var dataInput = window.btoa(unescape(encodeURIComponent(data.dataXML)));
    /// Create file xml to download
    this.thongDiepGuiNhanCQTsv.GetFileXMLSigned(dataInput,moment(data.createdDate).format("YYYYMMDD-hhmmss")).subscribe((res: any) => {
      if (res.result != '' && res.result != null) {
        ////// Get file
        this.thongDiepGuiNhanCQTsv.GetLinkFileXml(res.result.fileName).subscribe((res1: any) => {
          if (res1.result != '' && res1.result != null) {
            var url = `${this.env.apiUrl}${res1.result}`;
            /// download file by fileName
            this.thongDiepGuiNhanCQTsv.DownloadFile(url).subscribe(blob => {
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = `${res.result.fileName}`;
              a.click();
              URL.revokeObjectURL(objectUrl);
            });
          }
          else {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
            return;
          }
        })
      }
      else {
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        return;
      }
    })
  }
  DeleteFileXMLAfterDownload(data : any){
    this.thongDiepGuiNhanCQTsv.DeleteFileXMLAfterDownload(data.result.fileName).subscribe((res: any) => {
      if (res.result != '' && res.result != null) {

      }
      else {
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        return;
      }
    })
  }
  viewReceipt(data: any = null) {
    const id = this.messager.loading('Loading...', { nzDuration: 0 }).messageId;
    switch (data.maLoaiThongDiep) {
      case 102:
      case 103:
        this.quyDinhKyThuatsv.ConvertThongDiepToFilePDF(data).subscribe((rs: any) => {
          console.log(rs);
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.messager.remove(id);
        }, (err) => {
          this.messager.warning("Có lỗi xảy ra");
          this.messager.remove(id);
        });
        break;
      case 301:
        this.thongDiepGuiNhanCQTsv.GetPdfFile301(data.thongDiepChungId).subscribe((rs: any) => {
          console.log(rs);
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.messager.remove(id);
        }, (err) => {
          this.messager.warning("Có lỗi xảy ra");
          this.messager.remove(id);
        });
        break;
      default: break;
    }
  }

}
