import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { WebSocketService } from 'src/app/services/websocket.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';


@Component({
  selector: 'app-xac-nhan-chuoi-ma-cqt',
  templateUrl: './xac-nhan-chuoi-ma-cqt.component.html',
  styleUrls: ['./xac-nhan-chuoi-ma-cqt.component.scss']
})
export class XacNhanChuoiMaCqtComponent implements OnInit {
  @Input() dataReader: any;
  @Input() msTitle: any;
  @Input() fileData: any;
  @Input() maCCQT: any;
  constructor(
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private Message: NzMessageService,
    private modal: NzModalRef,
    private nhatKyTruyCapService: NhatKyTruyCapService,
  ) { }

  ngOnInit() {
  }
  ConfirmImportMCQT() {
    /// Import file 103
    this.quyDinhKyThuatService.UpdateFile103AndMCQTToHoSo(this.fileData, this.dataReader.dltBao.mccqt).subscribe((fileId: string) => {
      if (fileId) {
        this.Message.success("Xác nhận thành công");
        this.nhatKyTruyCapService.Insert({
          loaiHanhDong: LoaiHanhDong.NhapKhau,
          refType: RefType.ThongTinHoaDon,
          doiTuongThaoTac: 'Nhập khẩu xml thông báo chấp nhận tờ khai 01/ĐKTĐ-HĐĐT',
          thamChieu: `Mã của cơ quan thuế từ file xml ${this.dataReader.dltBao.mccqt}`,
          moTaChiTiet: `Mã của cơ quan thuế từ file xml: ${this.dataReader.dltBao.mccqt}` + ` Thông báo số ${this.dataReader.stBao.so}` + ` ngày thông báo ${ moment(this.dataReader.stBao.ntBao).format('DD/MM/YYYY')}` ,
        }).subscribe();
        this.modal.destroy();
      } else {
        this.Message.error(TextGlobalConstants.TEXT_ERROR_API);
      }
    },
    err => {
      this.Message.error(TextGlobalConstants.TEXT_ERROR_API);
    })
  }

  closeModal() {
    this.modal.destroy();
  }
  changeAccept() {

  }
}
