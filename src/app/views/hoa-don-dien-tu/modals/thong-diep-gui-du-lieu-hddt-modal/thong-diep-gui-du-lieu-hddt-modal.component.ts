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
import { SelectHDDTForThongDiepModalComponent } from './select-hddt-for-thong-diep-modal/select-hddt-for-thong-diep-modal.component';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { SharedService } from 'src/app/services/share-service';

@Component({
  selector: 'app-thong-diep-gui-du-lieu-hddt-modal',
  templateUrl: './thong-diep-gui-du-lieu-hddt-modal.component.html',
  styleUrls: ['./thong-diep-gui-du-lieu-hddt-modal.component.scss']
})
export class ThongDiepGuiDuLieuHddtModalComponent extends ESCDanhMucKeyEventHandler implements OnInit, iModalHeaderButton {
  @Input() isAddNew: boolean;
  @Input() data: any;
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
  widthConfig = ['50px', '150px', '150px', '100px', '100px', '150px', '120px', '180px', '140px', '140px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  ddtp = new DinhDangThapPhan();
  title: any;
  isDaGuiEmailHoaDon = false;
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

  kyOption = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'KyNopBaoCaoTinhHinhSuDungHoaDon').giaTri;

  constructor(
    private env: EnvService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private hoSoHDDTService: HoSoHDDTService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit() {
    console.log('data.trangThaiGuiHoaDon: ', this.data.trangThaiGuiHoaDon);

    this.title = this.modal.getInstance().nzTitle.toString().slice(4).toUpperCase();

    this.generateEmptyRow();
    this.createForm();

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.hoSoHDDT = res[0];
      this.isDaGuiEmailHoaDon = res[1];

      this.mainForm.patchValue({
        phienBan: '2.0.0',
        maNoiGui: `${this.env.taxCodeTCGP}`,
        maNoiNhan: `${this.env.taxCodeTCTN}`,
        maLoaiThongDiep: this.loaiThongDiep,
        maThongDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
        maSoThue: this.hoSoHDDT.maSoThue,
        soLuong: 1
      });

      this.spinning = false;
      // if (this.isAddNew) {
      //   this.mainForm.patchValue({
      //     phienBan: '2.0.0',
      //     maNoiGui: this.env.taxCodeTCTN,
      //     maNoiNhan: this.env.tVANTaxCode,
      //     maLoaiThongDiep: this.loaiThongDiep,
      //     maThongDiep: `${this.env.taxCodeTCTN}` + generateUUIDV4(),
      //     maSoThue: this.hoSoHDDT.maSoThue,
      //     soLuong: 1
      //   });
      // } else {
      //   this.mainForm.patchValue({
      //     ...this.data
      //   });

      //   if (this.data.hoaDonDienTu) {
      //     this.mainForm.patchValue({
      //       mauSo: this.data.hoaDonDienTu.mauSo,
      //       kyHieu: this.data.hoaDonDienTu.kyHieu,
      //       ngayHoaDon: moment(this.data.hoaDonDienTu.ngayHoaDon).format('YYYY-MM-DD'),
      //       soHoaDon: this.data.hoaDonDienTu.soHoaDon,
      //     });
      //   }

      //   this.loaiThongDiep = parseInt(this.data.maLoaiThongDiep);
      //   this.data.thongDiepGuiDuLieuHDDTChiTiets.forEach((item: any) => {
      //     this.hoaDonDienTus = [...this.hoaDonDienTus, { ...item.hoaDonDienTu }];
      //   });
      // }

      //hiển thị thông tin hóa đơn gửi CQT nếu mở từ tab hóa đơn thay thế
      this.getDataByIdToSendCQT();
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoaDonDienTuService.IsDaGuiEmailChoKhachHang(this.data.hoaDonDienTuId)
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
      hoaDonDienTuId: [this.data.hoaDonDienTuId],
      kyHieu: [{ value: this.data.boKyHieuHoaDon.kyHieu, disabled: true }],
      tongTienThanhToan: [{ value: this.data.tongTienThanhToan, disabled: true }],
      soHoaDon: [{ value: this.data.soHoaDon, disabled: true }],
      ngayHoaDon: [{ value: moment(this.data.ngayHoaDon).format("DD/MM/YYYY"), disabled: true }],
      tenKhachHang: [{ value: this.data.tenKhachHang, disabled: true }],
      hoTenNguoiNhanHD: [{ value: this.data.hoTenNguoiNhanHD, disabled: true }],
      emailNguoiNhanHD: [{ value: this.data.emailNguoiNhanHD, disabled: true }],
      soDienThoaiNguoiNhanHD: [{ value: this.data.soDienThoaiNguoiNhanHD, disabled: true }],
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
    const data = this.mainForm.getRawValue();

    data.duLieuGuiHDDT = {
      hoaDonDienTuId: data.hoaDonDienTuId,
      hoaDonDienTu: this.data
    };

    this.thongDiepGuiDuLieuHDDTService.Insert(data) // insert thongDiep
      .subscribe((res: any) => {
        this.thongDiepGuiDuLieuHDDTService.GuiThongDiepDuLieuHDDT(res.thongDiepChungId) // gửi thongDiep tới CQT
          .subscribe((res2: any) => {
            if (res2 === TrangThaiQuyTrinh.GuiKhongLoi || res2 === TrangThaiQuyTrinh.GuiTCTNLoi) {
              this.hoaDonDienTuService.WaitForTCTResonse(data).subscribe((res3) => { // đợi phản hồi từ CQT
                if (res3) {
                  this.spinning = false;
                  this.openPopupGuiThanhCongHoaDonKhongMa();
                  this.modal.destroy(true);
                } else {
                  this.spinning = false;
                  this.hoaDonDienTuService.GetTrangThaiQuyTrinhById(this.data.hoaDonDienTuId)
                    .subscribe((res3: any) => {
                      // trường hợp đợi quá 60s và gửi TCTN có lỗi
                      if (res3 === TrangThaiQuyTrinh.GuiTCTNLoi) {
                        this.modalService.create({
                          nzContent: MessageBoxModalComponent,
                          nzMaskClosable: false,
                          nzClosable: false,
                          nzKeyboard: false,
                          nzWidth: 430,
                          nzStyle: { top: '100px' },
                          nzBodyStyle: { padding: '1px' },
                          nzComponentParams: {
                            msMessageType: MessageType.Warning,
                            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                            msTitle: `Gửi dữ liệu hóa đơn không có mã của CQT`,
                            msContent: `Không gửi được hóa đơn đến <b>TCTN</b> (Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử). Vui lòng thực hiện lại!`,
                            msOnClose: () => {
                              this.modal.destroy();
                            },
                          }
                        });
                        this.sharedService.emitChange({
                          type: 'LoadDataAfterAddNew',
                          status: true
                        });
                      } else {
                        this.openPopupGuiThanhCongHoaDonKhongMa();
                        this.modal.destroy(true);
                      }
                    });
                }
              });
            } else {
              this.spinning = false;
              this.modal.destroy(true);
            }
          });
      }, _ => {
        this.spinning = false;
        this.message.success(TextGlobalConstants.SEND_DATA_FAIL);
      });
  }

  openPopupGuiThanhCongHoaDonKhongMa() {
    // this.modalService.create({
    //   nzContent: MessageBoxModalComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzKeyboard: false,
    //   nzWidth: 430,
    //   nzStyle: { top: '100px' },
    //   nzBodyStyle: { padding: '1px' },
    //   nzComponentParams: {
    //     msMessageType: MessageType.Info,
    //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //     msTitle: `Gửi dữ liệu hóa đơn không có mã của CQT`,
    //     msContent: `<div>Đã hoàn thành việc gửi dữ liệu hóa đơn không có mã đến CQT qua phương thức chuyển dữ liệu là <b>Chuyển đầy đủ nội dung từng hóa đơn</b>.</div>
    //     <div>Bạn cần theo dõi <b>Trạng thái và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b></div>`,
    //     msOnClose: () => {
    //       this.modal.destroy();
    //     },
    //   }
    // });
    this.message.success('Gửi dữ liệu hóa đơn không có mã của CQT thành công',{
      nzDuration:5000
    })
  }

  closeModal() {
    if (this.mainForm.dirty && this.isAddNew !== true) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.ConfirmBeforeClosing,
          msOnOk: () => {
            this.submitForm()
          },
          msOnClose: () => {
            this.modal.destroy();
          }
        },
        nzFooter: null
      });
    } else {
      this.modal.destroy();
    }
  }

  selectItems() {
    // const modal = this.modalService.create({
    //   nzTitle: 'Chọn hóa đơn',
    //   nzContent: SelectHDDTForThongDiepModalComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzKeyboard: false,
    //   nzWidth: 1100,
    //   nzStyle: { top: '10px' },
    //   nzBodyStyle: { padding: '1px' },
    //   nzComponentParams: {
    //     loaiThongDiep: this.loaiThongDiep
    //   },
    //   nzFooter: null
    // });
    // modal.afterClose.subscribe((rs: any) => {
    //   if (rs) {
    //     this.hoaDonDienTus = [...rs];
    //     this.hoaDonDienTusTemp = [...rs];

    //     if (this.loaiThongDiep === MLTDiep.TDGHDDTTCQTCapMa) {
    //       this.mainForm.patchValue({
    //         hoaDonDienTuId: rs[0].hoaDonDienTuId,
    //         mauSo: rs[0].mauSo,
    //         kyHieu: rs[0].kyHieu,
    //         ngayHoaDon: moment(rs[0].ngayHoaDon).format('YYYY-MM-DD'),
    //         soHoaDon: rs[0].soHoaDon,
    //       });
    //     }

    //     this.generateEmptyRow();
    //     this.mainForm.get('soLuong').setValue(this.hoaDonDienTus.length);
    //     this.mainForm.markAsDirty();
    //   }
    // });
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
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 400,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: `Xóa thông điệp`,
        msContent: '<span>Bạn có thực sự muốn xóa không?</span>',
        msOnClose: () => {
          return;
        },
        msOnOk: () => {
          this.thongDiepGuiDuLieuHDDTService.Delete(this.data.thongDiepGuiDuLieuHDDTId).subscribe((rs: any) => {
            if (rs) {
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.modal.destroy(true);
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
}
