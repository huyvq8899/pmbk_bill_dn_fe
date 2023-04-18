import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { DownloadFile } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import * as moment from 'moment';
import { MessageInv } from 'src/app/models/messageInv';
import { EnvService } from 'src/app/env.service';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';

@Component({
  selector: 'app-xem-mau-hoa-don-ra-soat-modal',
  templateUrl: './xem-mau-hoa-don-modal.component.html',
  styleUrls: ['./xem-mau-hoa-don-modal.component.scss']
})
export class XemMauHoaDonRaSoatModalComponent implements OnInit {
  @Input() fileUploadPath: string;
  @Input() fileNames: string;
  urlOfPdf: string;

  constructor(
    private env: EnvService,
    private modalRef: NzModalRef,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService
  ) { }

  ngOnInit() {
    this.urlOfPdf = this.getPdfFileUrl();
  }

  closeModal() {
    this.modalRef.destroy();
  }

  //hàm này sẽ trả về tên file theo phân loại loaiFileTraVe
  phanTachTenFile(tenFile: string, loaiFileTraVe: string)
  {
    if (tenFile == null || tenFile == '') return '';
    let tenFiles = tenFile.split(';');
    let fileKetQua = '';
    for(let i = 0; i < tenFiles.length; i++)
    {
      let item = tenFiles[i];
      if (item.lastIndexOf(loaiFileTraVe) >= 0)
      {
        fileKetQua = item;
        break;
      }
    }
    return fileKetQua;
  }

  //hàm này để tải file pdf/xml
  downloadFile(loaiFile: string)
  {
    let fileTaiVe = this.phanTachTenFile(this.fileNames , loaiFile);

    //url của file tải về
    let URLFileTaiVe = '';
    if (loaiFile === 'pdf') {
      URLFileTaiVe = this.env.apiUrl + '/' + this.fileUploadPath + '/pdf/unsign/' + fileTaiVe;
    }
    else
    {
      URLFileTaiVe = this.env.apiUrl + '/' + this.fileUploadPath + '/xml/signed/' + fileTaiVe;
    }

    this.thongDiepGuiCQTService.DownloadFile(URLFileTaiVe).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'thongBaoHoaDonRaSoat.' + loaiFile;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  //hàm này trả về đường link đến file thể hiện pdf
  getPdfFileUrl()
  {
    let filePdf = this.phanTachTenFile(this.fileNames , 'pdf');

    //url của file Pdf
    let URLFilePdf = this.env.apiUrl + '/' + this.fileUploadPath + '/pdf/unsign/' + filePdf;

    return URLFilePdf;
  }
}
