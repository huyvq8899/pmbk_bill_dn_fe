import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { EnvService } from 'src/app/env.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { SumwidthConfig } from 'src/app/shared/global';
import { iModalHeaderButton } from 'src/app/shared/interfaces/imodal-header-buttons';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { Message } from 'src/app/shared/Message';
import { generateUUIDV4, getHeightBangKeKhongChiTiet2, getListEmptyBangKeKhongChiTiet3, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { SelectHDDTForThongDiepModalComponent } from '../thong-diep-gui-du-lieu-hddt-modal/select-hddt-for-thong-diep-modal/select-hddt-for-thong-diep-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-thong-diep-gui-du-lieu-hddt-hang-loat-modal',
  templateUrl: './thong-diep-gui-du-lieu-hddt-hang-loat-modal.component.html',
  styleUrls: ['./thong-diep-gui-du-lieu-hddt-hang-loat-modal.component.scss']
})
export class ThongDiepGuiDuLieuHddtHangLoatModalComponent extends ESCDanhMucKeyEventHandler implements OnInit, iModalHeaderButton {
  @Input() isAddNew: boolean;
  @Input() data: any[];
  @Input() loaiThongDiep: any;
  //trường hoaDonDienTuId để truyền riêng từ bên hóa đơn thay thế - khi chọn hóa đơn thay thế rồi gửi CQT
  @Input() hoaDonDienTuId: string = null;
  mainForm: FormGroup;
  spinning = false;
  hoSoHDDT: any;
  hoaDonDienTus: any[] = [];
  hoaDonDienTusTemp: any[] = [];
  lstHoaDonDienTuEmpty: any[] = [];
  total = 0;
  numberListCols: any[] = [];
  widthConfig = ['150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  ddtp = new DinhDangThapPhan();
  title: any;
  tienLuiModel: any;
  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnBackwardDisable: boolean;
  fbBtnForwardDisable: boolean;
  fbBtnSaveDisable: boolean;
  fbBtnFirst: boolean;
  fbBtnLast: boolean;

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  // fix table
  permission: boolean = false;
  thaoTacs: any[] = [];
  isShowChecked = true;
  dataSelected = null;
  kyOption = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'KyNopBaoCaoTinhHinhSuDungHoaDon').giaTri;
  listThongDieps = [];

  constructor(
    private env: EnvService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private hoSoHDDTService: HoSoHDDTService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private hoaDonDienTuService: HoaDonDienTuService
  ) {
    super();
  }

  ngOnInit() {
    this.title = this.modal.getInstance().nzTitle.toString().slice(4).toUpperCase();

    this.generateEmptyRow();
    this.createForm();

    this.forkJoin().subscribe((res: any[]) => {
      this.hoSoHDDT = res[0];

      this.data.forEach((item: any) => {
        this.hoaDonDienTuService.GetMaThongDiepInXMLSignedById(item.hoaDonDienTuId)
          .subscribe((res: any) => {
            this.listThongDieps.push({
              phienBan: '2.0.0',
              maNoiGui: this.hoSoHDDT.maSoThue,
              maNoiNhan: this.env.taxCodeTCTN,
              maLoaiThongDiep: this.loaiThongDiep,
              maThongDiep: res.result,
              maSoThue: this.hoSoHDDT.maSoThue,
              soLuong: 1,
              duLieuGuiHDDT: {
                hoaDonDienTuId: item.hoaDonDienTuId,
              }
            })
          });
      });

      //hiển thị thông tin hóa đơn gửi CQT nếu mở từ tab hóa đơn thay thế
      this.getDataByIdToSendCQT();
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      // this.hoaDonDienTuService.GetMaThongDiepInXMLSignedById(this.data.hoaDonDienTuId)
    ]);
  }

  createForm() {
    this.mainForm = this.fb.group({
      thongDiepChungId: [null],
      phienBan: [{ value: null, disabled: true }],
      maNoiGui: [{ value: null, disabled: true }],
      maNoiNhan: [{ value: null, disabled: true }],
      maLoaiThongDiep: [{ value: null, disabled: true }],
      maThongDiep: [{ value: null, disabled: true }],
      maThongDiepThamChieu: [{ value: null, disabled: true }],
      maSoThue: [{ value: null, disabled: true }],
      soLuong: [{ value: null, disabled: true }],
      fileXML: [null],
      hinhThuc: [0],
      thongDiepGuiDi: [true],
      trangThaiGui: [0],
      tenTrangThaiGui: [{ value: 'Chưa gửi', disabled: true }],
      trangThaiTiepNhan: [0],
      tenTrangThaiTiepNhan: [{ value: 'Chưa phản hồi', disabled: true }],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });
  }

  submitForm() {
    this.spinning = true;

    this.listThongDieps.forEach((item: any) => {
      this.thongDiepGuiDuLieuHDDTService.Insert(item)
        .subscribe((res: any) => {
          this.thongDiepGuiDuLieuHDDTService.GuiThongDiepDuLieuHDDT(res.thongDiepChungId)
            .subscribe((res2: any) => {
              if (res2 !== TrangThaiQuyTrinh.DaKyDienTu) {
                this.spinning = false;
                this.modal.destroy(true);
              } else {
                this.spinning = false;
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
                    msTitle: `Không gửi được hóa đơn điện tử đến CQT`,
                    msContent: `Không gửi được Cơ Quan Thuế. Vui lòng phát hành lại hóa đơn!`,
                    msOnClose: () => {
                      return;
                    },
                  }
                });
              }
            });
        }, _ => {
          this.spinning = false;
          this.message.success(TextGlobalConstants.SEND_DATA_FAIL);
        });
    });
  }

  closeModal() {
    this.modal.destroy();
  }

  selectItems() {
    const modal = this.modalService.create({
      nzTitle: 'Chọn hóa đơn',
      nzContent: SelectHDDTForThongDiepModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 1100,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiThongDiep: this.loaiThongDiep
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.hoaDonDienTus = [...rs];
        this.hoaDonDienTusTemp = [...rs];

        if (this.loaiThongDiep === MLTDiep.TDGHDDTTCQTCapMa) {
          this.mainForm.patchValue({
            hoaDonDienTuId: rs[0].hoaDonDienTuId,
            mauSo: rs[0].mauSo,
            kyHieu: rs[0].kyHieu,
            ngayHoaDon: moment(rs[0].ngayHoaDon).format('YYYY-MM-DD'),
            soHoaDon: rs[0].soHoaDon,
          });
        }

        this.generateEmptyRow();
        this.mainForm.get('soLuong').setValue(this.hoaDonDienTus.length);
        this.mainForm.markAsDirty();
      }
    });
  }

  removeItem(index: any) {
    this.hoaDonDienTusTemp = this.hoaDonDienTusTemp.filter(x => x != this.hoaDonDienTusTemp[index]);
    this.hoaDonDienTus = this.hoaDonDienTusTemp.filter(x => !!x);
    this.total = this.hoaDonDienTus.length;
    this.mainForm.get('soLuong').setValue(this.hoaDonDienTus.length);
    this.mainForm.markAsDirty();
  }

  generateEmptyRow() {
    this.total = this.hoaDonDienTus.length;
    this.lstHoaDonDienTuEmpty = getListEmptyBangKeKhongChiTiet3(this.hoaDonDienTus);
    this.lstHoaDonDienTuEmpty.forEach((item: any) => {
      this.hoaDonDienTusTemp.push(null);
    });

    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.scrollConfig.y = (getHeightBangKeKhongChiTiet2()) + "px";
    this.numberListCols = Array(this.widthConfig.length).fill(0);
  }

  first(): void {
    throw new Error('Method not implemented.');
  }
  forward(): void {
    throw new Error('Method not implemented.');
  }
  backward(): void {
    throw new Error('Method not implemented.');
  }
  last(): void {
    throw new Error('Method not implemented.');
  }
  onAddObjClick(): void {
    throw new Error('Method not implemented.');
  }
  onEditClick(): void {
    throw new Error('Method not implemented.');
  }
  onDeleteClick(): void {
    throw new Error('Method not implemented.');
  }
  onPrintClick(): void {
    throw new Error('Method not implemented.');
  }
  onExportClick() {

  }
  onHelpClick(): void {
    throw new Error('Method not implemented.');
  }

  public get loaiThongDiepEnum(): typeof MLTDiep {
    return MLTDiep;
  }

  //hàm này để lấy dữ liệu hóa đơn theo hoaDonDienTuId để gửi CQT
  getDataByIdToSendCQT() {
    if (this.hoaDonDienTuId == null) return;
    let params: any = {};
    params.hoaDonDienTuId = this.hoaDonDienTuId;
    this.hoaDonDienTuService.GetListHoaDonForThongDiep(this.loaiThongDiep, params)
      .subscribe((rs: any[]) => {
        if (rs.length > 0) {
          this.hoaDonDienTus = [...rs];
          this.hoaDonDienTusTemp = [...rs];

          if (this.loaiThongDiep === MLTDiep.TDGHDDTTCQTCapMa) {
            this.mainForm.patchValue({
              hoaDonDienTuId: rs[0].hoaDonDienTuId,
              mauSo: rs[0].mauSo,
              kyHieu: rs[0].kyHieu,
              ngayHoaDon: moment(rs[0].ngayHoaDon).format('YYYY-MM-DD'),
              soHoaDon: rs[0].soHoaDon,
            });
          }

          this.generateEmptyRow();
          this.mainForm.get('soLuong').setValue(this.hoaDonDienTus.length);
          this.mainForm.markAsDirty();
        }
      });
  }

  view() {
    this.spinning = true;
    this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe((rs: any) => {
      const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
      showModalPreviewPDF(this.modalService, `${pathPrint}`);
      this.spinning = false;
    }, (err) => {
      this.message.warning("Lỗi khi xem hóa đơn");
      this.spinning = false;
    });
  }

  selectedRow(data: any) {
    if (this.isShowChecked) {
      return;
    }
    this.dataSelected = data;
    data.checked = true;
    this.data.forEach(element => {
      if (element !== data) {
        element.checked = false;
      }
    });
  }

  // Checkbox
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.data.every(item => item.checked === true);
    this.isIndeterminate = this.data.some(item => item.checked === true && !this.isAllDisplayDataChecked);
  }

  checkAll(value: boolean): void {
    this.data.forEach(x => x.checked = value);
    this.refreshStatus();
  }
}
