import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { RefType } from 'src/app/models/nhat-ky-truy-cap';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { DownloadFile, GetFileUrl } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-tep-dinh-kem-modal',
  templateUrl: './tep-dinh-kem-modal.component.html',
  styleUrls: ['./tep-dinh-kem-modal.component.scss']
})
export class TepDinhKemModalComponent implements OnInit {
  @Input() fileDinhKem: any;
  @Input() hoaDonId: any;
  listFile: TaiLieuDinhKem[] = [];
  listUploadedFile: TaiLieuDinhKem[] = [];
  formData: FormData;
  spinning: boolean = false;
  validExtentions = ['.doc', '.docx', '.xls', '.xlsx', '.xml', '.pdf'];
  constructor(
    private uploadFileService: UploadFileService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.listFile = this.fileDinhKem;
  }
  uploadFile(event: any) {
    if (event && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > (1024 * 1024 * 3)) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'Dung lượng file vượt quá 3MB. ',
              msOnClose: () => {
              },
            }
          });
          return;
        }
        if (!this.utilityService.checkExtension(event.target.files[i].name, this.validExtentions)) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'File không hợp lệ. ',
              msOnClose: () => {
              },
            }
          });

          return;
        }
        const file = event.target.files[i];
        var li = GetFileUrl(file);
        this.listFile.push({ tenGoc: file.name, file: file, link: li });
      }
      // this.fbBtnSaveDisable = true;
      this.callUploadApi(this.hoaDonId);
    }
  }

  callUploadApi(id: any) {
    var files = this.listFile.filter(x => x.file).map(x => x.file);
    var removedFiles = this.listUploadedFile.filter(x => !this.listFile.map(y => y.taiLieuDinhKemId).includes(x.taiLieuDinhKemId));

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: id,
      loaiNghiepVu: RefType.HoaDonXoaBo,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  downloadFile(item: TaiLieuDinhKem) {
    this.uploadFileService.CheckExistsFilesById(item.taiLieuDinhKemId).subscribe((rs) => {
      DownloadFile(item.link, item.tenGoc);
    });
  }

  deleteFile(item: any, data: any) {
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
        msTitle: `Xóa tài liệu đính kèm`,
        msContent: 'Bạn có muốn xóa tài liệu đính kèm này không?',
        msOnClose: () => {
          this.spinning = false;
          return;
        },
        msOnOk: () => {
          this.listFile = this.listFile.filter(x => x !== item);

          this.uploadFileService.DeleteFileAttach({
            nghiepVuId: this.hoaDonId,
            loaiNghiepVu: RefType.HoaDonXoaBo,
            tenGoc: item.tenGoc,
            tenGuid: item.tenGuid,
            taiLieuDinhKemId: item.taiLieuDinhKemId
          }).subscribe();
        },
      }
    });
  }

  destroyModal() {
    this.modal.destroy();
  }
}
