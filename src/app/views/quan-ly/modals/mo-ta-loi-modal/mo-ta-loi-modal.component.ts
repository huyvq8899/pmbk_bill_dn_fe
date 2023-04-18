import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { SharedService } from 'src/app/services/share-service';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { GetFileUrl } from 'src/app/shared/SharedFunction';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { RefType } from 'src/app/models/nhat-ky-truy-cap';
import { UploadFileService } from 'src/app/services/upload-file.service';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';

@Component({
  selector: 'app-mo-ta-loi-modal',
  templateUrl: './mo-ta-loi-modal.component.html',
  styleUrls: ['./mo-ta-loi-modal.component.scss']
})
export class MoTaLoiModalComponent implements OnInit {
  @Input() moTaLoi: any;
  formData: any;
  uploadedFile: any[]=[];
  listFile: any[]=[];
  //daSuaFile = true: đã có xóa hoặc thêm file chưa
  daSuaFile = false;

  constructor(
    private message: NzMessageService,
    private modal: NzModalRef,
    private env: EnvService,
    private modalService: NzModalService,
    private uploadFileService: UploadFileService,
    private sharedService: SharedService,
    private thongTinHoaDonService: ThongTinHoaDonService
  ) { 

  }

  ngOnInit() {
  }

  destroyModal(){
    this.modal.destroy(this.daSuaFile);
  }
  
  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if($event.keyCode == 27)
    {
      this.modal.destroy(this.daSuaFile);
    }
  }
}


