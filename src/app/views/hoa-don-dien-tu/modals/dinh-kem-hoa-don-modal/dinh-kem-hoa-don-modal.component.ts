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
  selector: 'app-dinh-kem-hoa-don-modal',
  templateUrl: './dinh-kem-hoa-don-modal.component.html',
  styleUrls: ['./dinh-kem-hoa-don-modal.component.scss']
})
export class DinhKemHoaDonModalComponent implements OnInit {
  @Input() hoaDonDienTuId: any;
  @Input() loaiNghiepVu: RefType = null;
  formData: any;
  uploadedFile: any[] = [];
  listFile: any[] = [];
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
    this.uploadFileService.GetFilesById(this.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs) {
        this.uploadedFile = rs;
        this.listFile = rs;
      } else {
        if (this.loaiNghiepVu == RefType.HoaDonDienTu) {
          this.thongTinHoaDonService.GetById(this.hoaDonDienTuId).subscribe((res: any) => {
            if (res) {
              this.uploadedFile = res.taiLieuDinhKems;
              this.listFile = res.taiLieuDinhKems;
            }
          })
        }
      }
    })
  }

  destroyModal() {
    this.modal.destroy(this.daSuaFile);
  }

  viewFile(tldk: any) {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    /*
    var fileArray = [
      {
        path: tldk.link,
        fileName: tldk.tenGoc
      }
    ];
    */
    //var fileName = `Hoa_don_Bach_khoa_${moment().format("DD.MM.YYYY")}_${moment().format("hh.mm")}`;
    //this.downloadFileZip(fileArray, fileName);
    this.uploadFileService.CheckExistsFilesById(tldk.taiLieuDinhKemId).subscribe((rs) => {
      this.downloadFile(tldk.link, tldk.tenGoc);
    });
    this.message.remove(id);
  }

  downloadFile(fileURL, fileName) {
    this.uploadFileService.DownloadFile(fileURL.replaceAll("\\", "/")).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  downloadFileZip(filesArray, fileZipName) {
    this.createZip(filesArray, fileZipName);
  }

  async createZip(files: any[], zipName: string) {
    const zip = new JSZip();
    const name = zipName + '.zip';
    // tslint:disable-next-line:prefer-for-of
    for (let counter = 0; counter < files.length; counter++) {
      const element = files[counter];
      const fileData: any = await this.sharedService.getFile(element.path);
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
      zip.file(element.fileName, b);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        saveAs(content, name);
      }
    });
  }

  deleteFile(tldk: any) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '360px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: 'Xóa tài liệu đính kèm',
        msContent: `Bạn có chắc chắn muốn xóa không?`,
        msOnOk: () => {
          this.listFile = this.listFile.filter(x => x.taiLieuDinhKemId != tldk.taiLieuDinhKemId);
          if (this.listFile.length == 0) {
            //lúc đầu upload chưa có taiLieuDinhKemId thì dùng tên file
            this.listFile = this.listFile.filter(x => x.tenGoc != tldk.tenGoc);
          }
          this.callUploadApi();
        }
      },
      nzFooter: null
    });
  }

  uploadFile(event: any) {
    if (event && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];

        this.listFile.push({
          tenGoc: file.name,
          file: file,
          link: GetFileUrl(file),
        });
      }
    }

    this.callUploadApi();
  }

  callUploadApi() {
    var files = this.listFile.filter(x => x.file).map(x => x.file);
    var removedFiles = this.uploadedFile.filter(x => !this.listFile.map(y => y.taiLieuDinhKemId).includes(x.taiLieuDinhKemId));

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: this.hoaDonDienTuId,
      loaiNghiepVu: (this.loaiNghiepVu == null) ? RefType.HoaDonDienTu : this.loaiNghiepVu,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        this.daSuaFile = true;
        //sau khi insert thành công thì tải lại các file để nhận về taiLieuDinhKemId
        this.ngOnInit();
      });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if ($event.keyCode == 27) {
      this.modal.destroy(this.daSuaFile);
    }
  }
}


