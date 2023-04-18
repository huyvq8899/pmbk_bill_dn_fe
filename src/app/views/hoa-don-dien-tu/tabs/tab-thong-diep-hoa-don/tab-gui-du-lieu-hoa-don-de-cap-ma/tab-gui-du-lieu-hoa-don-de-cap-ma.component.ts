import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { EnvService } from 'src/app/env.service';
import { PagingParams } from 'src/app/models/PagingParams';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { DownloadFile } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { KetQuaThongDiepGuiDuLieuHDDTComponent } from '../../../modals/ket-qua-thong-diep-gui-du-lieu-hddt/ket-qua-thong-diep-gui-du-lieu-hddt.component';
import { ThongDiepGuiDuLieuHddtModalComponent } from '../../../modals/thong-diep-gui-du-lieu-hddt-modal/thong-diep-gui-du-lieu-hddt-modal.component';

@Component({
  selector: 'app-tab-gui-du-lieu-hoa-don-de-cap-ma',
  templateUrl: './tab-gui-du-lieu-hoa-don-de-cap-ma.component.html',
  styleUrls: ['./tab-gui-du-lieu-hoa-don-de-cap-ma.component.scss']
})
export class TabGuiDuLieuHoaDonDeCapMaComponent extends TabShortKeyEventHandler implements OnInit {
  dataSelected = null;
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  loading = false;
  loadingExport = false;
  loadingSend = false;
  listData: any[] = [];
  widthConfig = ['100px', '100px', '250px', '100px', '200px', '200px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '500px' };
  params: any = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    loaiThongDiep: MLTDiep.TDGHDDTTCQTCapMa
  };

  constructor(
    private env: EnvService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService
  ) {
    super();
  }

  ngOnInit() {
    this.LoadData();
  }

  LoadData(reset = false) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }

    this.loading = true;
    this.thongDiepGuiDuLieuHDDTService.GetAllPaging(this.params).subscribe((data: any) => {
      this.listData = data.items;
      this.params.PageNumber = data.currentPage;
      this.loading = false;

      // delete all
      if (this.listData.length === 0 && this.params.PageNumber > 1) {
        this.params.PageNumber -= 1;
        this.LoadData();
      }
      // this.refreshStatus();
      if (this.listData && this.listData.length > 0) {
        this.selectedRow(this.listData[0]);
      }
      this.rowScrollerToViewEdit.scrollToRow(this.listData, "thongDiepGuiDuLieuHDDTId").then((result) => {
        this.selectedRow(result);
      });
    });
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;
    this.listData.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });
  }

  clickThem() {
    const modal = this.modalService.create({
      nzTitle: 'Thông điệp',
      nzContent: ThongDiepGuiDuLieuHddtModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1100,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
        loaiThongDiep: this.params.loaiThongDiep
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.LoadData();
      }
    });
  }

  clickSua() {
    const vals: any[] = this.listData.filter(x => x.selected === true);
    if (vals == null || vals.length < 1) {
      return;
    }

    const data: any = vals[0];
    this.rowScrollerToViewEdit.getRowToViewEdit(data.thongDiepGuiDuLieuHDDTId);
    // call modal
    this.thongDiepGuiDuLieuHDDTService.GetById(data.thongDiepGuiDuLieuHDDTId)
      .subscribe((res: any) => {
        if (res) {
          const modal = this.modalService.create({
            nzTitle: 'Thông điệp',
            nzContent: ThongDiepGuiDuLieuHddtModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 1100,
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              isAddNew: false,
              data: res
            },
            nzFooter: null
          });
          modal.afterClose.subscribe((rs: any) => {
            if (rs) {
              this.LoadData();
            }
          });
        }
      });
  }

  clickXoa() {
    if (!this.dataSelected) {
      this.message.success(TextGlobalConstants.TEXT_PLEASE_CHOOSE_CATEGORY_TO_DELETE);
      return;
    }

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
          nzWidth:400,
          nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: `Xóa thông điệp đã chọn`,
        msContent: '<span>Bạn có thực sự muốn xóa không?</span>',
        msOnClose: () => {
          return;
        },
        msOnOk: () => {
          this.thongDiepGuiDuLieuHDDTService.Delete(this.dataSelected.thongDiepGuiDuLieuHDDTId)
          .subscribe((rs: any) => {
            if (rs) {
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.LoadData();
            } else {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
            }
          }, _ => {
            this.message.error(Message.DONT_DELETE_DANH_MUC);
          })
        },
      }
    });
  }

  clickXem() {
    throw new Error('Method not implemented.');
  }

  export() {
    if (!this.dataSelected) {
      return;
    }

    this.loadingExport = true;
    this.thongDiepGuiDuLieuHDDTService.ExportXMLGuiDi(this.dataSelected.thongDiepGuiDuLieuHDDTId)
      .subscribe((rs: any) => {
        if (rs) {
          const url = this.env.apiUrl + '/' + rs.result;
          DownloadFile(url, 'thong-diep.xml');
          this.loadingExport = false;
        }
      });
  }

  sendThongDiep() {
    if (!this.dataSelected) {
      return;
    }

    this.loadingSend = true;
    this.dataSelected.trangThaiGui = 1;
    this.thongDiepGuiDuLieuHDDTService.UpdateTrangThaiGui(this.dataSelected)
      .subscribe((res: any) => {
        if (res) {
          this.thongDiepGuiDuLieuHDDTService.ExportXMLGuiDi(this.dataSelected.thongDiepGuiDuLieuHDDTId)
            .subscribe((rs: any) => {
              if (rs) {
                const url = this.env.apiUrl + '/' + rs.result;
                const params = {
                  fileUrl: url
                };
                this.thongDiepGuiDuLieuHDDTService.GuiThongDiepKiemTraDuLieuHoaDon(params)
                  .subscribe((res1: any) => {
                    if (res1) {
                      this.thongDiepGuiDuLieuHDDTService.NhanPhanHoiThongDiepKiemTraDuLieuHoaDon({ fileByte: res1.result })
                        .subscribe((res2: any) => {
                          this.LoadData();
                          this.loadingSend = false;
                        });
                    }
                  });
              }
            });
        }
      });
  }

  viewKetQua(data: any) {
    this.thongDiepGuiDuLieuHDDTService.KetQuaKiemTraDuLieuHoaDon(data.thongDiepGuiDuLieuHDDTId)
      .subscribe((res: any) => {
        this.modalService.create({
          nzTitle: 'Kết quả thông điệp',
          nzContent: KetQuaThongDiepGuiDuLieuHDDTComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 1100,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            id: data.thongDiepGuiDuLieuHDDTId,
            data: res
          },
          nzFooter: null
        });
      });
  }
}
