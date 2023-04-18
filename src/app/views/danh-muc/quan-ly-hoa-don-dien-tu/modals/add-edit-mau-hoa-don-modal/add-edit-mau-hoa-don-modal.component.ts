import { MauVeTabThietLapHinhNenComponent } from './mau-ve-dien-tu-modal/mau-ve-tab-thiet-lap-hinh-nen/mau-ve-tab-thiet-lap-hinh-nen.component';
import { MauVeTabTuyChinhChiTietComponent } from './mau-ve-dien-tu-modal/mau-ve-tab-tuy-chinh-chi-tiet/mau-ve-tab-tuy-chinh-chi-tiet.component';
import { MauVeTabThietLapChungComponent } from './mau-ve-dien-tu-modal/mau-ve-tab-thiet-lap-chung/mau-ve-tab-thiet-lap-chung.component';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { Placeholder } from 'src/app/shared/placeholder';
import { TabThietLapChungComponent } from './tab-thiet-lap-chung/tab-thiet-lap-chung.component';
import { TabThietLapHinhNenComponent } from './tab-thiet-lap-hinh-nen/tab-thiet-lap-hinh-nen.component';
import { TabTuyChinhChiTietComponent } from './tab-tuy-chinh-chi-tiet/tab-tuy-chinh-chi-tiet.component';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { SharedService } from 'src/app/services/share-service';
import { forkJoin, Subscription } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Message } from 'src/app/shared/Message';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { ExportMauHoaDonModalComponent } from './export-mau-hoa-don-modal/export-mau-hoa-don-modal.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { CreateTuyChonChiTiets } from 'src/assets/ts/init-create-mau-hd';

@Component({
  selector: 'app-add-edit-mau-hoa-don-modal',
  templateUrl: './add-edit-mau-hoa-don-modal.component.html',
  styleUrls: ['./add-edit-mau-hoa-don-modal.component.scss']
})
export class AddEditMauHoaDonModalComponent extends ESCDanhMucKeyEventHandler implements OnInit, OnDestroy {
  @ViewChild('tabThietLapChung', { static: false }) tabThietLapChung: TabThietLapChungComponent;
  @ViewChild('tabThietLapHinhNen', { static: false }) tabThietLapHinhNen: TabThietLapHinhNenComponent;
  @ViewChild('tabTuyChinhChiTiet', { static: false }) tabTuyChinhChiTiet: TabTuyChinhChiTietComponent;
  @ViewChild('tabThietLapChungVe', { static: false }) tabThietLapChungVe: MauVeTabThietLapChungComponent;
  @ViewChild('tabTuyChinhChiTietVe', { static: false }) tabTuyChinhChiTietVe: MauVeTabTuyChinhChiTietComponent;
  @ViewChild('tabThietLapHinhNenVe', { static: false }) tabThietLapHinhNenVe: MauVeTabThietLapHinhNenComponent;
  @Input() isAddNew: boolean;
  @Input() data: any;
  @Input() isCopy: any;
  @Input() isView: any;
  mauHoaDonForm: FormGroup;
  spinning = false;
  position = 0;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  passdedStep1 = false;
  sub: Subscription;
  formData = new FormData();
  tenLogo = null;
  tenHinhNenTaiLen = null;
  oldTen = null;
  tabStatus: Array<{ tabPosition: any, isDirty: any, isInvalid: any }> = [
    { tabPosition: 1, isDirty: false, isInvalid: false },
    { tabPosition: 2, isDirty: false, isInvalid: false },
    { tabPosition: 3, isDirty: false, isInvalid: false },
    { tabPosition: 4, isDirty: false, isInvalid: false },
  ];
  oldData = null;
  isSelectBackground = false;
  isSettingTruongMoRong = false;
  disabledEdit = false;
  disabledSaveChanges = false;
  permission = false;
  thaoTacs = [];
  checkTrungMa : any;
  isVe = false;

  constructor(
    public modal: NzModalRef,
    private message: NzMessageService,
    private modalService: NzModalService,
    private mauHoaDonService: MauHoaDonService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private uploadFileService: UploadFileService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit() {
    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res.type === 'updatePositionSizeImage') {
        this.data = res.value;
      }
      if (res.type === 'updateSelectBackgroundStatus') {
        this.isSelectBackground = res.value;
      }
      if (res.type === 'updateSettingTruongMoRong') {
        this.isSettingTruongMoRong = res.value;
      }
      if (res.type === 'updateDinhDangHoaDon') {
        this.data.dinhDangHoaDon = res.value;
      }
    });

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "MauHoaDon").thaoTacs;
    }

    console.log('this.permission: ', this.permission);
    console.log('this.thaoTacs: ', this.thaoTacs);


    this.init();
  }

  init() {
    if (!this.isAddNew) {
      this.disabledEdit = true;
      this.disabledSaveChanges = false;

      this.position = 1;
      this.tenLogo = this.data.tenLogo;
      this.oldTen = this.data.ten;
      this.tenHinhNenTaiLen = this.data.tenHinhNenTaiLen;
      this.oldData = JSON.parse(JSON.stringify(this.data));
    } else {
      this.disabledEdit = true;
      this.disabledSaveChanges = false;
    }
    this.data.position = this.position;
    if (this.isView) {
      this.disabledEdit = false;
      this.disabledSaveChanges = true;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async clickSua() {
    // check điều kiện bộ ký hiệu để sửa mẫu hóa đơn
    var isBlockEdit = await this.mauHoaDonService.CheckAllowEditAsync(this.data.mauHoaDonId);
    if (isBlockEdit) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: 'Mẫu hóa đơn đã phát sinh bộ ký hiệu hóa đơn sử dụng. Bạn chỉ được sửa mẫu hóa đơn khi trạng thái sử dụng của bộ ký hiệu hóa đơn là <strong>Ngừng sử dụng</strong>. Vui lòng kiểm tra lại!',
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        },
      });
      return;
    }

    // check mẫu hóa đơn đã ký hay chưa
    const dataNgayKy: any = await this.mauHoaDonService.GetNgayKyByIdAsync(this.data.mauHoaDonId);
    if (dataNgayKy && dataNgayKy.ngayKy) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 400,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: 'Sửa mẫu hóa đơn',
          msContent: 'Mẫu hóa đơn đã ký điện tử. Nếu sửa mẫu thì hệ thống sẽ xóa chữ ký điện tử và bạn sẽ phải ký lại. Bạn có muốn tiếp tục sửa không?',
          msMessageType: MessageType.Confirm,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.data.ngayKy = null;
            this.disabledEdit = true;
            this.disabledSaveChanges = false;
          },
          msOnClose: () => { }
        },
      });
    } else {
      this.disabledEdit = true;
      this.disabledSaveChanges = false;
    }
  }


  async submitForm() {
    this.isVe = this.data.loaiHoaDon === LoaiHoaDon.TemVeDuLich;

    if (this.isVe && this.data.hinhThucNhapLieu === 1 && !this.data.tuyenDuongId && (this.data.loaiMauHoaDon === 2 || this.data.loaiMauHoaDon === 3)) {
      this.tabStatus[1].isInvalid = true;
    }
    /// check tab1
    if (this.tabStatus[0].isInvalid) {
      this.position = 1;
      setTimeout(() => {
        if (this.isVe) {
          this.tabThietLapChungVe.submitForm();
        } else {
          this.tabThietLapChung.submitForm();
        }
      }, 0);
      return;
    }

    /// check tab2
    if (this.tabStatus[1].isInvalid) {
      this.position = 2;
      setTimeout(() => {
        if (this.isVe) {
          this.tabThietLapHinhNenVe.submitForm();
        } else {
          this.tabThietLapHinhNen.submitForm();
        }
      }, 0);
      return;
    }

    /// check tab3
    if (this.tabStatus[2].isInvalid) {
      this.position = 3;
      setTimeout(() => {
        if (this.isVe) {
          this.tabThietLapChungVe.submitForm();
        } else {
          this.tabThietLapChung.submitForm();
        }
      }, 0);
      return;
    }


    if (this.tabStatus[3].isInvalid) {
      this.position = 3;
      setTimeout(() => {
        if (this.isVe) {
          this.tabTuyChinhChiTietVe.submitForm();
        } else {
          this.tabTuyChinhChiTiet.submitForm();
        }
      }, 0);
      return
    }

     this.checkTrungMa = await this.mauHoaDonService.CheckTrungTenMauHoaDonAsync(this.data);
    if (this.checkTrungMa) {
      if (this.isAddNew || this.isCopy) {
        
      } else {
        if (this.data.ten === this.oldTen) {
          this.checkTrungMa = false;
        }
      }
    }

    if (this.checkTrungMa) {
      this.showPopup(`Tên mẫu số hóa đơn <b>${this.data.ten}</b> đã tồn tại. Bạn không được tạo tên mẫu số hóa đơn trùng nhau.`);
      this.spinning = false;
      return;
    }

    this.spinning = true;
    if (this.isAddNew || this.isCopy) {
      this.mauHoaDonService.Insert(this.data).subscribe((result: any) => {
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.MauHoaDon,
            thamChieu: 'Tên mẫu hóa đơn: ' + result.ten,
            refId: result.mauHoaDonId,
          }).subscribe();
          this.callUploadApi(result.mauHoaDonId, () => {
            this.mauHoaDonService.GetById(result.mauHoaDonId).subscribe((detail: any) => {
              this.data = detail;
              this.spinning = false;
              this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
              // this.modal.destroy(result);

              this.sharedService.emitChange({
                type: 'loadData',
                value: true
              });

              this.isAddNew = false;
              this.isView = true;
              this.init();
            });
          });
        } else {
          this.spinning = false;
          this.message.error('Lỗi thêm mới');
          this.modal.destroy(false);
        }
      }, _ => {
        this.spinning = false;
        this.message.success(TextGlobalConstants.TEXT_ERROR_API);
      });
    } else {
      this.update();
    }
  }

  update() {
    this.mauHoaDonService.Update(this.data).subscribe((result: any) => {
      if (result) {
        this.callUploadApi(this.data.mauHoaDonId, () => {
          this.mauHoaDonService.GetById(this.data.mauHoaDonId).subscribe((detail: any) => {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.MauHoaDon,
              thamChieu: 'Tên mẫu hóa đơn: ' + this.data.ten,
              refId: this.data.mauHoaDonId,
              duLieuCu: this.oldData,
              duLieuMoi: detail
            }).subscribe();

            this.data = detail;
            this.spinning = false;
            this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
            // this.modal.destroy(true);

            this.sharedService.emitChange({
              type: 'loadData',
              value: true
            });

            this.isView = true;
            this.init();
          });
        });
      } else {
        this.spinning = false;
        this.message.error('Lỗi cập nhật');
        this.modal.destroy(false);
      }
    }, _ => {
      this.spinning = false;
      this.message.error(TextGlobalConstants.TEXT_ERROR_API);
    });
  }

  showPopup(title: string) {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px'},
      nzWidth: '450px',
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Warning,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msTitle: `Kiểm tra lại`,
        msContent: title,
        msOnClose: () => {
          if(this.position != 1) {
            this.position = 1;
          }
          setTimeout(() => {
          this.tabThietLapChung.AfterShowFormCheckDuplicate();
          console.log("🚀 ~ file: add-edit-mau-hoa-don-modal.component.ts:330 ~ AddEditMauHoaDonModalComponent ~ setTimeout ~ this.checkTrungMa", this.checkTrungMa)

          this.tabThietLapChung.isDuplicate = true;
          }, 200);
        },
      }
    });

  }

  callUploadApi(id: any, callback: () => any) {
    this.formData.append('mauHoaDonId', id);
    if (this.tenLogo && !this.data.tenLogo) {
      this.formData.append('removedLogoFileName', this.tenLogo);
    }
    if (this.tenHinhNenTaiLen && !this.data.tenHinhNenTaiLen) {
      this.formData.append('removedBackgroundFileName', this.tenHinhNenTaiLen);
    }

    this.uploadFileService.InsertFileMauHoaDon(this.formData)
      .subscribe(() => {
        this.mauHoaDonService.AddDocFiles(id).subscribe(() => {
          callback();
        });
      });
  }

  closeModal(isAutoClose = true) {
    if (isAutoClose) {
      return;
    }

    if (this.disabledSaveChanges) {
      this.modal.destroy();
      return;
    }

    if ((this.tabStatus.some(x => x.isDirty === true)) && this.isAddNew !== true) {
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
            this.submitForm();
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

  changeStep(event: any) {
    this.position = event;
  }

  changeTab(event: any) {
    this.position = event;
  }

  changeValues(event: any) {
    this.data = {
      ...this.data,
      ...event
    };
  }

  selectedMenuItem(value: any) {
    if (this.position === 0 && !this.passdedStep1) {
      return;
    }

    if (value === 0 && this.isAddNew === false) {
      return;
    }

    if (this.isSelectBackground || this.isSettingTruongMoRong) {
      return;
    }

    this.data = {
      ...this.data,
      position: value
    };

    if (this.isAddNew && value === 0 && this.tabStatus.some(x => x.isDirty === true)) {
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
            this.submitForm();
          },
          msOnClose: () => {
            this.position = value;
          }
        },
        nzFooter: null
      });
    } else {
      this.position = value;
    }

    this.passdedStep1 = true;
  }

  export() {
    this.modalService.create({
      nzTitle: 'Xuất mẫu hóa đơn',
      nzContent: ExportMauHoaDonModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 400,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data: this.data
      },
      nzFooter: null
    });
  }

  detectTabStatus(event: any) {
    if (event) {
      const index = this.tabStatus.findIndex(x => x.tabPosition === event.tabPosition);
      this.tabStatus[index].isDirty = event.isDirty;
      this.tabStatus[index].isInvalid = event.isInvalid;
    }
  }

  changeLogo(event: any) {
    if (event) {
      this.formData.append('logo', event);
    } else {
      this.formData.delete('logo');
    }
  }

  changeBackground(event: any) {
    if (event) {
      this.formData.append('background', event);
    } else {
      this.formData.delete('background');
    }
  }

  cancelData() {
    this.sharedService.emitChange({
      type: this.getTypeNameChose(),
      value: false
    });

    this.isSelectBackground = false;
    this.isSettingTruongMoRong = false;
  }

  saveData() {
    this.sharedService.emitChange({
      type: this.getTypeNameChose(),
      value: true
    });

    this.isSelectBackground = false;
  }

  getTypeNameChose() {
    if (this.isSelectBackground) {
      return 'selectedBackgroundFromParent';
    }
    if (this.isSettingTruongMoRong) {
      return 'saveTruongMoRongFromParent';
    }
  }
}
