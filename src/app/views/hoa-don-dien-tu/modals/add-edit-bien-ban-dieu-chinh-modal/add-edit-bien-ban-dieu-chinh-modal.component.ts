import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Message } from 'src/app/shared/Message';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { DownloadFile, GetFileUrl, getNoiDungLoiPhatHanhHoaDon, setStyleTooltipError, showModalPreviewPDF, getTenHoaDonByLoai, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import { Placeholder } from 'src/app/shared/placeholder';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { iModalHeaderButton } from 'src/app/shared/interfaces/imodal-header-buttons';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import { LyDoDieuChinh } from 'src/app/models/LyDoThayTheModel';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { SharedService } from 'src/app/services/share-service';
import { TabHoaDonDienTuComponent } from '../../tabs/tab-hoa-don-dien-tu/tab-hoa-don-dien-tu.component';
import { EnvService } from 'src/app/env.service';
import { MessageInvTT78 } from 'src/app/models/messageInv';
import { WebSocketService } from 'src/app/services/websocket.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { GuiBienBanXoaBoModalComponent } from '../gui-bien-ban-xoa-bo-modal/gui-bien-ban-xoa-bo-modal.component';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { CheckValidMst, CheckValidMst2 } from 'src/app/customValidators/check-valid-mst.validator';
import { Router } from '@angular/router';
import { TroGiupModule } from 'src/app/user/tro-giup/tro-giup.module';
import { mainModule } from 'process';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-add-edit-bien-ban-dieu-chinh-modal',
  templateUrl: './add-edit-bien-ban-dieu-chinh-modal.component.html',
  styleUrls: ['./add-edit-bien-ban-dieu-chinh-modal.component.scss']
})
export class AddEditBienBanDieuChinhModalComponent extends ESCDanhMucKeyEventHandler implements OnInit, OnDestroy, iModalHeaderButton {
  @Input() isAddNew: boolean;
  @Input() fbEnableEdit: boolean;
  @Input() hoaDonBiDieuChinh: any;
  @Input() hoaDonDieuChinhId: any;
  @Input() data: any;
  @Input() isCopy: any;
  @Input() isMoTrenGD: boolean;
  @Input() isMoTuGDGuiHoaDon: boolean;
  @Input() hoaDonLienQuan: any[] = [];
  @Input() trangThaiCu: number;
  @Input() isFromGP: boolean;
  bienBanDieuChinhForm: FormGroup;
  spinning = false;
  ddtp = new DinhDangThapPhan();
  placeholder = new Placeholder();
  tienLuiModel: any;
  permission: boolean = false;
  thaoTacs: any[] = [];
  detailTotal = 0;
  formData: FormData;
  salerInfo = null;
  wsSubscription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  blockDownloadTool = true;
  //checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfSelected: any[] = [];
  isAllDisplayDataChecked2 = false;
  isIndeterminate2 = false;
  listOfSelected2: any[] = [];
  ///////
  overlayStyle = {
    width: '450px'
  };
  isKy = false;
  noiDungBienBanDefault =
    "- Căn cứ Luật Quản lý thuế ngày 13 tháng 6 năm 2019;\n" +
    "- Căn cứ Luật Giao dịch điện tử ngày 29 tháng 11 năm 2005;\n" +
    "- Căn cứ Luật Công nghệ thông tin ngày 29 tháng 6 năm 2006;\n" +
    "- Căn cứ Nghị định số 123/2020/NĐ-CP ngày 19/10/2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
    "- Căn cứ Thông tư số 78/2021/TT-BTC ngày 17/09/2021 của Bộ Tài chính hướng dẫn thực hiện một số điều của Luật Quản lý thuế ngày 13 tháng 6 năm 2019, Nghị định số 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
    "- Căn cứ vào thỏa thuận giữa các bên.";
  listFile: TaiLieuDinhKem[] = [];
  listUploadedFile: TaiLieuDinhKem[] = [];
  hoaDonDieuChinh: any;
  serials = [];
  isPhieuXuatKho = false;

  constructor(
    private router: Router,
    private env: EnvService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private bienBanDieuChinhService: BienBanDieuChinhService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private hoSoHDDTService: HoSoHDDTService,
    private tabHoaDonDienTuComponent: TabHoaDonDienTuComponent,
    private wsService: WebSocketService,
    private modalService: NzModalService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private uploadFileService: UploadFileService,
    private tuyChonService: TuyChonService
  ) {
    super();
  }
  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnBackwardDisable: boolean;
  fbBtnForwardDisable: boolean;
  fbBtnSaveDisable: boolean;
  fbBtnFirst: boolean;
  fbBtnLast: boolean;
  noiDungHoaDonLienQuan: string = '';
  titleHoaDonLienQuan = "&nbsp;<strong>Danh sách hóa đơn điều chỉnh có liên quan</strong>"

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
    console.log(this.hoaDonBiDieuChinh.trangThaiBienBanDieuChinh);
    if (this.data.trangThaiBienBan == 2) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Sửa biên bản điều chỉnh hóa đơn",
          msContent: `Biên bản điều chỉnh hóa đơn này đã được ký điện tử, nếu bạn thực hiện sửa thì chữ ký sẽ bị xóa và bạn cần ký lại. Bạn có muốn tiếp tục thực hiện không?
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.trangThaiCu = 2;
            this.data.ngayKyBenA = null;
            this.fbBtnSaveDisable = false;
            this.data.trangThaiBienBan = 1;
            this.disableEnableHeaderAction();
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else if (this.data.trangThaiBienBan == 3) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Sửa biên bản điều chỉnh hóa đơn",
          msContent: `Biên bản điều chỉnh hóa đơn đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện sửa thì biên bản điều chỉnh hóa đơn sẽ bị xóa và người mua sẽ không ký được biên bản điều chỉnh hóa đơn đã gửi trước đó. Hệ thống sẽ nhân bản biên bản điều chỉnh hóa đơn này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.trangThaiCu = 3;
            this.data.ngayKyBenA = null;
            this.data.trangThaiBienBan = 1;
            this.fbBtnSaveDisable = false;
            this.disableEnableHeaderAction();
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else if (this.data.trangThaiBienBan == 4) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 500,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Sửa biên bản điều chỉnh hóa đơn",
          msContent: `Biên bản điều chỉnh hóa đơn đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện sửa thì biên bản điều chỉnh hóa đơn sẽ bị xóa và người mua sẽ không xem được biên bản điều chỉnh hóa đơn đã gửi trước đó. Hệ thống sẽ nhân bản biên bản điều chỉnh hóa đơn này để tạo biên bản mới, bạn cần ký lại và gửi lại cho người mua. Bạn có muốn tiếp tục thực hiện không?
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOnOk: () => {
            this.trangThaiCu = 4;
            this.data.ngayKyBenA = null;
            this.data.ngayKyBenB = null;
            this.data.trangThaiBienBan = 1;
            this.fbBtnSaveDisable = false;
            this.disableEnableHeaderAction();
          },
          msOnCancel: () => {
            return;
          }
        },
      });
    }
    else {
      this.fbBtnSaveDisable = false;
      this.disableEnableHeaderAction();
    }
  }

  onDeleteClick(): void {
    var tb = '';
    if (this.data.trangThaiBienBan == 1 || this.data.trangThaiBienBan == 2) {
      tb = 'Bạn có chắc chắn muốn xóa không?'
    }
    else if (this.data.trangThaiBienBan == 3) {
      tb = "Biên bản điều chỉnh hóa đơn đang ở trạng thái <b>Chờ khách hàng ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không ký được biên bản điều chỉnh hóa đơn đã gửi trước đó. Bạn có muốn tiếp tục xóa không?"
    }
    else {
      tb = "Biên bản điều chỉnh hóa đơn đang ở trạng thái <b>Khách hàng đã ký</b>. Nếu bạn thực hiện xóa thì người mua sẽ không xem được biên bản điều chỉnh hóa đơn đã gửi trước đó. Bạn có muốn tiếp tục xóa không?"
    }

    if (this.hoaDonDieuChinh) {
      if (this.hoaDonDieuChinh.isLapVanBanThoaThuan == true) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 500,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Xóa biên bản điều chỉnh hóa đơn",
            msContent: `Hóa đơn điều chỉnh gần đây nhất đã có tùy chọn lập biên bản thỏa thuận khi có sai sót. Bạn không được xóa biên bản điều chỉnh`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { return; }
          }
        });

        return;
      }
    }
    else {
      if (this.hoaDonBiDieuChinh.isLapVanBanThoaThuan == true) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 500,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: "Xóa biên bản điều chỉnh hóa đơn",
            msContent: `Hóa đơn bị điều chỉnh đã có tùy chọn lập biên bản thỏa thuận khi có sai sót. Bạn không được xóa biên bản điều chỉnh`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { return; }
          }
        });

        return;
      }
    }

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: (this.data.trangThaiBienBan == 1 || this.data.trangThaiBienBan == 2) ? '430px' : 500,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msTitle: "Xóa biên bản điều chỉnh hóa đơn",
        msContent: tb,
        msMessageType: MessageType.ConfirmBeforeSubmit,
        msOkButtonInBlueColor: (this.data.trangThaiBienBan == 1 || this.data.trangThaiBienBan == 2) ? false : true,
        msOkButtonContinueIcon: false,
        msOKText: (this.data.trangThaiBienBan == 1 || this.data.trangThaiBienBan == 2) ? TextGlobalConstants.TEXT_CONFIRM_ACCEPT : TextGlobalConstants.TEXT_CONFIRM_CONT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOnOk: () => {
          this.bienBanDieuChinhService.Delete(this.data.bienBanDieuChinhId).subscribe((rs: any) => {
            if (rs.result === 'DbUpdateException') {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
              return;
            }
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.BienBanDieuChinh,
                thamChieu: `Số hóa đơn ${this.hoaDonBiDieuChinh.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(this.hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}`,
                refId: rs.bienBanDieuChinhId,
              }).subscribe();

              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              this.modal.destroy(true);
            } else {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
            }
          }, _ => {
            this.message.error(Message.DONT_DELETE_DANH_MUC);

          })
        },
        msOnClose: () => {
          return;
        }
      }
    });
  }
  onPrintClick(): void {
    const id = this.data.bienBanDieuChinhId;
    this.bienBanDieuChinhService.PreviewBienBan(id)
      .subscribe((res: any) => {
        showModalPreviewPDF(this.modalService, `${this.env.apiUrl}/${res.filePath}`);
      });
  }

  guiBienBanDieuChinh() {
    if (!this.data.bienBanDieuChinhId) {
      return;
    }

    const res = {
      bienBanDieuChinhId: this.data.bienBanDieuChinhId,
      tenNguoiNhan: this.data.tenNguoiNhanBienBan,
      emailNguoiNhan: this.data.emailNguoiNhanBienBan,
      soDienThoaiNguoiNhan: this.data.soDienThoaiNguoiNhanBienBan,
      hoaDonDienTuId: this.data.hoaDonBiDieuChinhId,
      trangThaiBienBan: 0
    };

    this.hoaDonDienTuService.GetById(res.hoaDonDienTuId).subscribe((hd: any) => {
      this.thongTinHoaDonService.GetById(res.hoaDonDienTuId).subscribe((tt: any) => {
        this.bienBanDieuChinhService.GetById(res.bienBanDieuChinhId).subscribe((bb: any) => {
          if (tt != null) tt.tenKhachHang = bb.tenDonViBenB;
          res.trangThaiBienBan = bb.trangThaiBienBan;
          const modal1 = this.modalService.create({
            nzTitle: "Gửi biên bản điều chỉnh hóa đơn cho khách hàng",
            nzContent: GuiBienBanXoaBoModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 700,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              hoaDonBiDieuChinh: hd ? hd : tt,
              data: res,
              isAddNew: true,
              isBBView: false,
              loaiEmail: this.isPhieuXuatKho ? LoaiEmail.ThongBaoBienBanDieuChinhPXK : LoaiEmail.ThongBaoBienBanDieuChinhHoaDon,
              isSystem: hd != null && hd != undefined,
            },
            nzFooter: null
          });
          modal1.afterClose.subscribe((rs: any) => {
            if (rs == true) {
              // this.modalService.create({
              //   nzContent: MessageBoxModalComponent,
              //   nzMaskClosable: false,
              //   nzClosable: false,
              //   nzKeyboard: false,
              //   nzWidth: 400,
              //   nzStyle: { top: '100px' },
              //   nzBodyStyle: { padding: '1px' },
              //   nzComponentParams: {
              //     msTitle: "Gửi biên bản điều chỉnh hóa đơn đến khách hàng",
              //     msContent: `Đã hoàn thành việc gửi biên bản điều chỉnh hóa đơn đến khách hàng`,
              //     msMessageType: MessageType.Info,
              //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              //     msOnClose: () => { }
              //   }
              // })
              this.message.success("Gửi biên bản điều chỉnh hóa đơn thành công");
              this.bienBanDieuChinhService.GetById(this.data.bienBanDieuChinhId).subscribe((rs: any) => {
                this.data = rs;
                this.ngOnInit();
              })
            }
            else if (rs == false) {
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
                  msContent: `Gửi biên bản điều chỉnh hóa đơn không thành công<br>Vui lòng kiểm tra lại!`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => { }
                }
              })
            }
          });
        });
      })
    })
  }


  onHelpClick(): void {
    throw new Error('Method not implemented.');
  }

  disableEnableHeaderAction() {
    if (this.fbBtnSaveDisable) {
      Object.keys(this.bienBanDieuChinhForm.controls).forEach(key => {
        this.bienBanDieuChinhForm.controls[key].disable();
      });
    } else {
      Object.keys(this.bienBanDieuChinhForm.controls).forEach(key => {
        if (key !== 'tenDonViBenA' && key !== 'diaChiBenA' && key !== 'maSoThueBenA') {
          this.bienBanDieuChinhForm.controls[key].enable();
        }
      });
    }
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }
    this.createForm();

    if (this.isAddNew || this.isCopy || this.fbEnableEdit) {
      this.fbBtnSaveDisable = false;
    } else {
      this.fbBtnSaveDisable = true;
    }

    if (this.hoaDonLienQuan.length > 0) {
      for (var i = 0; i < this.hoaDonLienQuan.length; i++) {
        var data = this.hoaDonLienQuan[i];
        this.noiDungHoaDonLienQuan += `&nbsp;&nbsp;${i + 1}.Hóa đơn có Ký hiệu mẫu số hóa đơn <strong>${this.hoaDonLienQuan[i].mauSo}</strong> Ký hiệu hóa đơn <strong>${this.hoaDonLienQuan[i].kyHieu}</strong> Số <a style="color: black!important" (click)="xemHoaDonLQ(this.hoaDonLienQuan[${i}])"><strong>${this.hoaDonLienQuan[i].soHoaDon ? this.hoaDonLienQuan[i].soHoaDon : "&lt;Chưa cấp số&gt;"}</strong></a> Ngày <strong>${moment(this.hoaDonLienQuan[i].ngayHoaDon).format('DD/MM/YYYY')}</strong> Mã tra cứu <strong>${this.hoaDonLienQuan[i].maTraCuu ? this.hoaDonLienQuan[i].maTraCuu : "&lt;Chưa có mã&gt;"}</strong><br>`
      }
    }

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      console.log(res[0]);
      this.salerInfo = res[0];
      this.hoaDonDieuChinh = res[1];
      this.serials = res[2].map(x => x.seri);

      if (this.isAddNew) {
        this.bienBanDieuChinhForm.patchValue({
          tenDonViBenA: this.salerInfo.tenDonVi,
          diaChiBenA: this.salerInfo.diaChi,
          maSoThueBenA: this.salerInfo.maSoThue,
          soDienThoaiBenA: this.salerInfo.soDienThoaiNguoiDaiDienPhapLuat,
          daiDienBenA: this.salerInfo.hoTenNguoiDaiDienPhapLuat,
          tenDonViBenB: this.hoaDonDieuChinh ? (this.hoaDonDieuChinh.khachHang ? this.hoaDonDieuChinh.khachHang.ten : this.hoaDonDieuChinh.tenKhachHang) : (this.hoaDonBiDieuChinh.khachHang ? this.hoaDonBiDieuChinh.khachHang.ten : (this.hoaDonBiDieuChinh.tenKhachHang ? this.hoaDonBiDieuChinh.tenKhachHang : this.hoaDonBiDieuChinh.hoTenNguoiMuaHang)),
          diaChiBenB: this.hoaDonDieuChinh ? (this.hoaDonDieuChinh.diaChi ? this.hoaDonDieuChinh.diaChi : '') : this.hoaDonBiDieuChinh.diaChi,
          maSoThueBenB: this.hoaDonDieuChinh ? (this.hoaDonDieuChinh.khachHang ? this.hoaDonDieuChinh.khachHang.maSoThue : '') : (this.hoaDonBiDieuChinh.khachHang ? this.hoaDonBiDieuChinh.khachHang.maSoThue : this.hoaDonBiDieuChinh.maSoThue),
          ngayBienBan: moment().format('YYYY-MM-DD'),
          noiDungBienBan: this.noiDungBienBanDefault,
          lyDoDieuChinh: this.hoaDonDieuChinh ? (this.hoaDonDieuChinh.lyDoDieuChinhModel ? this.hoaDonDieuChinh.lyDoDieuChinhModel.lyDo : '') : ''
        });
      } else {
        this.bienBanDieuChinhForm.patchValue({
          ...this.data,
          ngayBienBan: moment(this.data.ngayBienBan).format('YYYY-MM-DD')
        });
      }

      this.spinning = false;
      this.disableEnableHeaderAction();
    });

    if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') this.observableSocket();
  }

  observableSocket() {
    this.wsSubscription =  this.wsService.createObservableSocket('ws://localhost:15872/bksoft')
      .subscribe(
        data => {
          let obj = JSON.parse(data);
          console.log(obj);
          obj.bienBanDieuChinhId = this.data.bienBanDieuChinhId;
          if (obj.TypeOfError === 0) {
            this.bienBanDieuChinhService.GateForWebSocket(obj)
              .subscribe((res) => {
                this.spinning = false;
                if (res) {
                  this.data = res;
                  this.bienBanDieuChinhForm.get('fileDaKy').setValue(this.data.fileDaKy);
                  this.bienBanDieuChinhForm.get('ngayKyBenA').setValue(this.data.ngayKyBenA);
                  this.bienBanDieuChinhForm.get('trangThaiBienBan').setValue(this.data.trangThaiBienBan);
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzWidth: '450px',
                    nzComponentParams: {
                      msMessageType: MessageType.Info,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: 'Ký biên bản điều chỉnh',
                      msContent: `Ký biên bản điều chỉnh thành công!`,
                    },
                    nzFooter: null
                  });
                }
              }, err => {
                console.log(err);
              });
          } else {
            this.spinning = false;

            this.nhatKyThaoTacLoiService.Insert(this.data.bienBanDieuChinhId, obj.Exception).subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '450px',
              nzComponentParams: {
                msMessageType: MessageType.Error,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: `Ký biên bản điều chỉnh không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
          }
        },
        err => {
          this.spinning = false;

          if (this.blockDownloadTool) {
            this.blockDownloadTool = false;
            return;
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.WarningAndInstall,
              msOKText: "Tải bộ cài",
              msOnOk: () => {
                const link = document.createElement('a');
                link.href = `${this.env.apiUrl}/${this.urlTools}`;
                link.download = 'BKSOFT-KYSO-SETUP.zip';
                link.click();
              },
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              },
              msTitle: 'Hãy cài đặt công cụ ký số',
              msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
              <br>Để ký biên bản điều chỉnh, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
            },
            nzFooter: null
          });
        },
        () => console.log('The observable stream is complete')
      );
  }
  kiMem(dataKy: any) {
    this.wsSubscription = this.wsService.createObservableSocket('', dataKy)
      .subscribe(
        data => {
          let obj = data;
          console.log(obj);
          obj.bienBanDieuChinhId = this.data.bienBanDieuChinhId;
          if (obj.TypeOfError === 0) {
            this.bienBanDieuChinhService.GateForWebSocket(obj)
              .subscribe((res) => {
                this.spinning = false;
                if (res) {
                  this.data = res;
                  this.bienBanDieuChinhForm.get('fileDaKy').setValue(this.data.fileDaKy);
                  this.bienBanDieuChinhForm.get('ngayKyBenA').setValue(this.data.ngayKyBenA);
                  this.bienBanDieuChinhForm.get('trangThaiBienBan').setValue(this.data.trangThaiBienBan);
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzWidth: '450px',
                    nzComponentParams: {
                      msMessageType: MessageType.Info,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: 'Ký biên bản điều chỉnh',
                      msContent: `Ký biên bản điều chỉnh thành công!`,
                    },
                    nzFooter: null
                  });
                }
              }, err => {
                console.log(err);
              });
          } else {
            this.spinning = false;

            this.nhatKyThaoTacLoiService.Insert(this.data.bienBanDieuChinhId, obj.Exception).subscribe();

            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '450px',
              nzComponentParams: {
                msMessageType: MessageType.Error,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: `Ký biên bản điều chỉnh không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
          }
        },
        err => {
          this.spinning = false;

          if (this.blockDownloadTool) {
            this.blockDownloadTool = false;
            return;
          }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              },
              msTitle: 'Kiểm tra lại',
              msContent: `Ký không thành công. Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });
        },
        () => console.log('The observable stream is complete')
      );
  }
  ngOnDestroy() {
    this.wsSubscription.unsubscribe();
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoaDonDienTuService.GetById(this.hoaDonDieuChinhId),
      this.hoSoHDDTService.GetDanhSachChungThuSoSuDung()
    ]);
  }

  taiLaiThongTinNNT() {
    this.hoSoHDDTService.GetDetail().subscribe((salerInfo: any) => {
      this.bienBanDieuChinhForm.patchValue({
        tenDonViBenA: salerInfo.tenDonVi,
        diaChiBenA: salerInfo.diaChi,
        maSoThueBenA: salerInfo.maSoThue,
        soDienThoaiBenA: salerInfo.soDienThoaiNguoiDaiDienPhapLuat,
        daiDienBenA: salerInfo.hoTenNguoiDaiDienPhapLuat,
      });
    })
  }

  createForm() {
    this.bienBanDieuChinhForm = this.fb.group({
      soBienBan: [null],
      bienBanDieuChinhId: [null],
      noiDungBienBan: [null],
      isCheckNgay: [false],
      ngayBienBan: [null, [Validators.required]],
      tenDonViBenA: [{ value: null, disabled: true }],
      diaChiBenA: [{ value: null, disabled: true }],
      maSoThueBenA: [{ value: null, disabled: true }],
      soDienThoaiBenA: [null],
      daiDienBenA: [null, [Validators.required]],
      chucVuBenA: [null],
      ngayKyBenA: [null],
      tenDonViBenB: [null, [Validators.required]],
      diaChiBenB: [null, [Validators.required]],
      maSoThueBenB: [null, [CheckValidMst, CheckValidMst2]],
      soDienThoaiBenB: [null],
      daiDienBenB: [null, [Validators.required]],
      chucVuBenB: [null],
      ngayKyBenB: [null],
      moTa: [null],
      lyDoDieuChinh: [null, Validators.required],
      trangThaiBienBan: [1],
      hoaDonBiDieuChinhId: [null],
      hoaDonDieuChinhId: [this.hoaDonDieuChinhId || null],
      fileDaKy: [null],
      fileChuaKy: [null],
      xmlChuaKy: [null],
      xmlDaKy: [null],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });

    this.bienBanDieuChinhForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.hoaDonBiDieuChinh) {
      this.bienBanDieuChinhForm.get('hoaDonBiDieuChinhId').setValue(this.hoaDonBiDieuChinh.hoaDonDienTuId);
      this.getMoTa(this.hoaDonBiDieuChinh);
    }

    if (this.data) {
      this.bienBanDieuChinhForm.patchValue({
        ...this.data,
        bienBanDieuChinhId: this.isCopy ? null : this.data.bienBanDieuChinhId
      });

      this.listFile = this.data.taiLieuDinhKems;
      this.listUploadedFile = this.data.taiLieuDinhKems;
    }
  }


  checkNgay(data: any) {
    let hdlqs = this.hoaDonLienQuan.map(x => x.hoaDonDienTuId);

    if (!this.hoaDonDieuChinhId) {
      if (hdlqs.length == 0) {
        if (moment(data.ngayBienBan).format("YYYY-MM-DD") < moment(this.hoaDonBiDieuChinh.ngayHoaDon).format("YYYY-MM-DD")) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 600,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: `Kiểm tra lại`,
              msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ nhất không được nhỏ hơn ngày người bán ký điện tử trên hóa đơn bị điều chỉnh là ngày ${moment(this.hoaDonBiDieuChinh.ngayHoaDon).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại`,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              }
            },
          });

          this.spinning = false;
          return;
        }
        else this.saveChanges(data);
      }
      else {
        if (moment(data.ngayBienBan).format('YYYY-MM-DD') > moment(this.hoaDonLienQuan[0].ngayKy).format("YYYY-MM-DD")) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: 600,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: `Kiểm tra lại`,
              msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ ${this.hoaDonLienQuan.length + 1} không được nhỏ hơn ngày người bán ký điện tử trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${this.hoaDonLienQuan.length} là hóa đơn có Ký hiệu ${this.hoaDonLienQuan[this.hoaDonLienQuan.length - 1].mauSo}${this.hoaDonLienQuan[this.hoaDonLienQuan.length - 1].kyHieu} Số hóa đơn ${this.hoaDonLienQuan[this.hoaDonLienQuan.length - 1].soHoaDon} Ngày hóa đơn ${moment(this.hoaDonLienQuan[this.hoaDonLienQuan.length - 1].ngayHoaDon).format("DD/MM/YYYY")}. Ngày người bán ký điện từ hóa đơn này là ngày ${moment(this.hoaDonLienQuan[this.hoaDonLienQuan.length - 1].ngayKy).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              }
            },
          });

          this.spinning = false;
          return;
        }
        else this.saveChanges(data);
      }
    }
    else {
      this.hoaDonDienTuService.GetById(this.hoaDonDieuChinhId).subscribe((hd: any) => {
        if (hdlqs.length == 1 || hdlqs.indexOf(this.hoaDonDieuChinhId) == 0 || hdlqs.length == 0) {
          if (hd.ngayKy == null && this.hoaDonBiDieuChinh.ngayKy) {
            if (moment(data.ngayBienBan).format('YYYY-MM-DD') > moment(hd.ngayHoaDon).format('YYYY-MM-DD') || moment(data.ngayBienBan).format('YYYY-MM-DD') < moment(this.hoaDonBiDieuChinh.ngayKy).format("YYYY-MM-DD")) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 600,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: `Kiểm tra lại`,
                  msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ nhất không được phép:<br>
                  1-Nhỏ hơn ngày người bán ký điện tử trên hóa đơn bị điều chỉnh là ngày ${moment(this.hoaDonBiDieuChinh.ngayKy).format("DD/MM/YYYY")}.<br>
                  2-Không được lớn hơn ngày hóa đơn trên hóa đơn điều chỉnh của lần điều chỉnh thứ nhất là ngày ${moment(hd.ngayHoaDon).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại.`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });

              this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              this.spinning = false;
              return;
            }
            else {
              data.hoaDonDieuChinhId = this.hoaDonDieuChinhId;
              this.saveChanges(data);
            }
          }
          else {
            if (this.hoaDonBiDieuChinh.ngayKy && (moment(data.ngayBienBan).format('YYYY-MM-DD') > moment(hd.ngayKy).format("YYYY-MM-DD") || moment(data.ngayBienBan).format('YYYY-MM-DD') < moment(this.hoaDonBiDieuChinh.ngayKy).format("YYYY-MM-DD"))) {
              console.log('tra ve false')
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 600,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: `Kiểm tra lại`,
                  msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ nhất không được phép:<br>
                  1-Nhỏ hơn ngày người bán ký điện tử trên hóa đơn bị điều chỉnh là ngày ${moment(this.hoaDonBiDieuChinh.ngayKy).format("DD/MM/YYYY")}.<br>
                  2-Không được lớn hơn ngày hóa đơn trên hóa đơn điều chỉnh của lần điều chỉnh thứ nhất là ngày ${moment(hd.ngayKy).format("DD/MM/YYYY")}. Vui lòng kiểm tra lại. `,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });

              this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              console.log(data);
              this.spinning = false;
              return;
            }
            else {
              data.hoaDonDieuChinhId = this.hoaDonDieuChinhId;
              this.saveChanges(data);
            }
          }
        }
        else {
          console.log(hd.ngayKy)
          if (hd.ngayKy == null) {
            console.log('chua ky hoa don');
            if ((hdlqs.indexOf(this.hoaDonDieuChinhId) < this.hoaDonLienQuan.length - 1) && (moment(data.ngayBienBan).format('YYYY-MM-DD') > moment(hd.ngayHoaDon).format('YYYY-MM-DD') || moment(data.ngayBienBan).format('YYYY-MM-DD') < moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) + 1].ngayKy).format("YYYY-MM-DD"))) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 600,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: `Kiểm tra lại`,
                  msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId) + 1} không được phép:<br>
                  1-Nhỏ hơn ngày người bán ký điện tử trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId)} là ngày ${moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) + 1].ngayKy).format("DD/MM/YYYY")}.<br>
                  2-Không được lớn hơn ngày hóa đơn trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId)} là ngày ${moment(hd.ngayHoaDon).format("DD/MM/YYYY")}.<br>
                  Vui lòng kiểm tra lại.`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });

              this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              this.spinning = false;
              return;
            }
            else {
              if ((hdlqs.indexOf(this.hoaDonDieuChinhId) < this.hoaDonLienQuan.length - 1) || (moment(data.ngayBienBan).format('YYYY-MM-DD') <= moment(hd.ngayHoaDon).format('YYYY-MM-DD') && moment(data.ngayBienBan).format('YYYY-MM-DD') >= moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) + 1].ngayKy).format("YYYY-MM-DD"))) this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              data.hoaDonDieuChinhId = this.hoaDonDieuChinhId;
              this.saveChanges(data);
            }
          }
          else {
            console.log('da ky hoa don');
            if ((hdlqs.indexOf(this.hoaDonDieuChinhId) < this.hoaDonLienQuan.length - 1) && (moment(data.ngayBienBan).format('YYYY-MM-DD') > moment(hd.ngayKy).format('YYYY-MM-DD') || moment(data.ngayBienBan).format('YYYY-MM-DD') < moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) + 1].ngayKy).format("YYYY-MM-DD"))) {
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: 600,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: `Kiểm tra lại`,
                  msContent: `Ngày biên bản điều chỉnh hóa đơn của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId) + 1} không được phép:<br>
                    1-Nhỏ hơn ngày người bán ký điện tử trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId)} là ngày ${moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) - 1].ngayKy).format("DD/MM/YYYY")}.<br>
                    2-Không được lớn hơn ngày hóa đơn trên hóa đơn điều chỉnh của lần điều chỉnh thứ ${hdlqs.indexOf(this.hoaDonDieuChinhId) + 1} là ngày ${moment(hd.ngayHoaDon).format("DD/MM/YYYY")}.<br>
                    Vui lòng kiểm tra lại.`,
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                },
              });

              this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              this.spinning = false;
              return;
            }
            else {
              if ((hdlqs.indexOf(this.hoaDonDieuChinhId) < this.hoaDonLienQuan.length - 1) || (moment(data.ngayBienBan).format('YYYY-MM-DD') <= moment(hd.ngayHoaDon).format('YYYY-MM-DD') && moment(data.ngayBienBan).format('YYYY-MM-DD') >= moment(this.hoaDonLienQuan[hdlqs.indexOf(this.hoaDonDieuChinhId) - 1].ngayKy).format("YYYY-MM-DD"))) this.bienBanDieuChinhForm.get('isCheckNgay').setValue(true);
              data.hoaDonDieuChinhId = this.hoaDonDieuChinhId;
              this.saveChanges(data);
            }
          }
        }
      })
    }
  }

  submitForm() {
    if (this.bienBanDieuChinhForm.invalid) {
      let invalidFormChung = false;
      for (const i in this.bienBanDieuChinhForm.controls) {
        this.bienBanDieuChinhForm.controls[i].markAsTouched();
        this.bienBanDieuChinhForm.controls[i].updateValueAndValidity();
        if (invalidFormChung === false && this.bienBanDieuChinhForm.controls[i].invalid && i !== 'thongTinDieuChinhChiTiets') {
          invalidFormChung = true;
        }
      }

      if (invalidFormChung) {
        setStyleTooltipError(true);
        return;
      }
    }

    this.spinning = true;
    const data = this.bienBanDieuChinhForm.getRawValue();
    data.hoaDonBiDieuChinh = this.hoaDonBiDieuChinh;
    data.danhSachHoaDonLienQuan = this.noiDungHoaDonLienQuan;

    this.checkNgay(data);
  }

  saveChanges(data: any) {
    console.log('vào lưu');
    if (this.trangThaiCu == 2) {
      console.log('truong hop hoa don da ky')
      data.soBienBan = null;
      data.trangThaiBienBan = 1;
      data.ngayKyBenA = null;
      data.certA = null;
      data.fileDaKy = null;
    }
    else if (this.trangThaiCu == 3) {
      this.isCopy = true;
      this.bienBanDieuChinhService.Delete(data.bienBanDieuChinhId).subscribe();
      data.soBienBan = null;
      data.trangThaiBienBan = 1;
      data.ngayKyBenA = null;
      data.certA = null;
      data.fileDaKy = null;
    }
    else if (this.trangThaiCu == 4) {
      this.isCopy = true;
      this.bienBanDieuChinhService.Delete(data.bienBanDieuChinhId).subscribe();
      data.soBienBan = null;
      data.trangThaiBienBan = 1;
      data.ngayKyBenA = null;
      data.certA = null;
      data.ngayKyBenB = null;
      data.certB = null;
      data.fileDaKy = null;
    }

    if (this.hoaDonDieuChinhId) data.hoaDonDieuChinhId = this.hoaDonDieuChinhId;
    if (moment(data.ngayBienBan).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 550,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Kiểm tra lại`,
          msContent: `Ngày biên bản điều chỉnh hóa đơn không được lớn hơn ngày hiện tại. Vui lòng kiểm tra lại.`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        },
      });

      this.spinning = false;
      return;
    }

    if (!data.lyDoDieuChinh || data.lyDoDieuChinh == '') {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 550,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Kiểm tra lại`,
          msContent: `Trường &lt;Lý do điều chỉnh hóa đơn&gt; không được để trống.
          `,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        },
      });

      this.spinning = false;
      return;
    }

    if (this.isAddNew || this.isCopy) {
      data.bienBanDieuChinhId = null;
      this.bienBanDieuChinhService.Insert(data).subscribe((result: any) => {
        if (result) {
          this.nhatKyTruyCapService.Insert({
            loaiHanhDong: LoaiHanhDong.Them,
            refType: RefType.BienBanDieuChinh,
            thamChieu: `Số hóa đơn ${this.hoaDonBiDieuChinh.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(this.hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}`,
            refId: result.bienBanDieuChinhId,
          }).subscribe();

          if (this.router.url.includes('/hoa-don-dien-tu/quan-li-hoa-don-dien-tu')) {
            this.router.navigate(['/hoa-don-dien-tu/hoa-don-dieu-chinh']);
          }

          this.message.success(TextGlobalConstants.INSERT_SUCCESS_API);
          this.fbBtnSaveDisable = true;
          this.disableEnableHeaderAction();
          this.data = result;
          this.isAddNew = false;
          this.spinning = false;
        } else {
          this.message.error('Lỗi thêm mới');
          this.spinning = false;
        }
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);

      });
    } else {
      if (this.data) data.bienBanDieuChinhId = this.data.bienBanDieuChinhId;
      this.bienBanDieuChinhService.Update(data).subscribe(
        (result: any) => {
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.Sua,
              refType: RefType.BienBanDieuChinh,
              thamChieu: `Số hóa đơn ${this.hoaDonBiDieuChinh.soHoaDon || '<Chưa cấp số>'}\nNgày hóa đơn ${moment(this.hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}`,
              refId: data.bienBanDieuChinhId,
              duLieuCu: this.data,
              duLieuMoi: data
            }).subscribe();

            this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
            this.fbBtnSaveDisable = true;
            this.disableEnableHeaderAction();
            this.bienBanDieuChinhService.GetById(data.bienBanDieuChinhId).subscribe((rs: any) => {
              this.data = rs;
              this.spinning = false;
            });
          } else {
            this.message.error('Lỗi cập nhật');
            this.spinning = false;
          }
        }, _ => {
          this.spinning = false;
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        });
    }
  }

  xemCTS(type = 1) {
    if (this.wsSubscription && this.wsSubscription.closed || !this.wsSubscription) {
      this.wsSubscription = this.wsService.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      });
    }

    var info = type == 1 ? this.data.certA : this.data.certB;
    if (!info) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Error,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Xem thông tin chứng thư số ' + (type == 1 ? 'người bán' : 'người mua'),
          msContent: `Không tìm thấy thông tin chứng thư số ${type == 1 ? 'người bán' : 'người mua'}`
        },
        nzFooter: null
      });

      return;
    }
    let msg = {
      mLTDiep: 60,
      cert: info
    };
    console.log('msg: ', msg);

    // Sending
    const rsSend = this.wsService.sendMessage(JSON.stringify(msg));
  }

  closeModal() {
    if (this.bienBanDieuChinhForm.dirty && this.isAddNew !== true) {
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
      this.modal.destroy(this.data);
    }
  }

  getMoTa(hoaDonBiDieuChinh: any) {
    console.log(hoaDonBiDieuChinh);
    let moTa = `Hai bên thống nhất lập biên bản này để điều chỉnh hóa đơn có mẫu số <strong>${hoaDonBiDieuChinh.mauSo}</strong> ký hiệu <strong>${hoaDonBiDieuChinh.kyHieu}</strong> số <strong>${hoaDonBiDieuChinh.soHoaDon}</strong> ngày <strong>${moment(hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}</strong> ` + (hoaDonBiDieuChinh.maTraCuu ? `mã tra cứu <strong>${hoaDonBiDieuChinh.maTraCuu}</strong>` : '') + ` theo quy định.`;
    this.bienBanDieuChinhForm.get('moTa').setValue(moTa);
  }

  kyDienTu() {
    this.spinning = true;
    this.blockDownloadTool = false;
    // let msg: MessageInv = {};
    // msg.type = 1004;
    // const databaseName = localStorage.getItem(CookieConstant.DATABASENAME);
    const data = this.data;
    // msg.DataPDF = `${this.env.apiUrl}/FilesUpload/${databaseName}/BienBanDieuChinh/${data.bienBanDieuChinhId}/pdf/unsigned/${data.fileChuaKy}`;
    // msg.NBan = {
    //   mST: this.salerInfo.maSoThue,
    //   ten: this.salerInfo.tenDonVi || '',
    //   dChi: this.salerInfo.diaChi || '',
    //   sDThoai: this.salerInfo.soDienThoaiLienHe || '',
    //   tenP1: this.salerInfo.tenDonVi,
    //   tenP2: '',
    // }

    if (moment(data.ngayBienBan).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD") && data.isCheckNgay == false) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 550,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Kiểm tra lại`,
          msContent: `Ngày biên bản điều chỉnh hóa đơn phải bằng với ngày ký biên bản điều chỉnh hóa đơn &lt;${moment().format("DD/MM/YYYY")}&gt;. Bạn có muốn cập nhật ngày biên bản điều chỉnh hóa đơn thành &lt;${moment().format("DD/MM/YYYY")}&gt; không?.
          `,
          msMessageType: MessageType.ConfirmBeforeSubmit,
          msOkButtonInBlueColor: true,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msOnOk: () => {
            data.ngayBienBan = moment().format("YYYY-MM-DD");
            this.bienBanDieuChinhService.Update(data).subscribe((bbdc: any) => {
              this.bienBanDieuChinhService.PreviewBienBan(data.bienBanDieuChinhId).subscribe((rs: any) => {
                let msg: any = {};
                msg.mLTDiep = 10;
                msg.mst = this.salerInfo.maSoThue;
                msg.serials = this.serials;
                msg.urlPdf = `${this.env.apiUrl}/${rs.filePath}`;
                //msg.dataXML = `https://localhost:44383/uploaded/${user.databaseName}/xml/unsign/${orderData.bill.lookupCode}.xml`;
                msg.tTNKy = {
                  mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
                  ten: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
                  diaChi: this.salerInfo.diaChi == null ? '' : this.salerInfo.diaChi,
                  sDThoai: this.salerInfo.soDienThoaiLienHe == null ? '' : this.salerInfo.soDienThoaiLienHe,
                  tenP1: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
                  tenP2: '',
                }
                // console.log(msg);
                // Sending
                //this.wsService.sendMessage(JSON.stringify(msg));
                if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
                  const isConnected = this.wsService.isOpenSocket();
                  if (isConnected) {
                    this.wsService.sendMessage(JSON.stringify(msg));
                    this.observableSocket();
                  }
                } else {
                  this.kiMem(msg);
                }

              })
            });
          },
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
            this.spinning = false;
            return;
          }
        },
      });
    }
    else {
      this.bienBanDieuChinhService.PreviewBienBan(data.bienBanDieuChinhId).subscribe((rs: any) => {
        let msg:any = {};
        msg.mLTDiep = 10;
        msg.mst = this.salerInfo.maSoThue;
        msg.serials = this.serials;
        msg.urlPdf = `${this.env.apiUrl}/${rs.filePath}`;
        //msg.dataXML = `https://localhost:44383/uploaded/${user.databaseName}/xml/unsign/${orderData.bill.lookupCode}.xml`;
        msg.tTNKy = {
          mst: this.salerInfo.maSoThue == null ? '' : this.salerInfo.maSoThue,
          ten: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          diaChi: this.salerInfo.diaChi == null ? '' : this.salerInfo.diaChi,
          sDThoai: this.salerInfo.soDienThoaiLienHe == null ? '' : this.salerInfo.soDienThoaiLienHe,
          tenP1: this.salerInfo.tenDonVi == null ? '' : this.salerInfo.tenDonVi,
          tenP2: '',
        }
        // console.log(msg);
        // Sending
        //this.wsService.sendMessage(JSON.stringify(msg));
        if (isSelectChuKiCung(this.tuyChonService) == 'KiCung') {
          const isConnected = this.wsService.isOpenSocket();
          if (isConnected) {
            this.wsService.sendMessage(JSON.stringify(msg));
            this.observableSocket();
          }
        } else {
          this.kiMem(msg);
        }
      })
    }
  }

  lapHoaDonDieuChinh() {
    if (this.hoaDonBiDieuChinh && this.hoaDonBiDieuChinh.hoaDonDienTuId) {
      //const loaiHD = getLoaiLoaiHoaByMoTa(this.hoaDonBiDieuChinh.mauSo);
      //chỉnh sửa theo thông tư 78
      let loaiHD = 0;
      if (this.hoaDonBiDieuChinh.mauSo != null && this.hoaDonBiDieuChinh.mauSo != '') {
        let value = Number(this.hoaDonBiDieuChinh.mauSo);
        if (value.toString().toLowerCase() != 'nan') {
          loaiHD = value;
        }
      }

      this.clickAdd(loaiHD, {
        dieuChinhChoHoaDonId: this.hoaDonBiDieuChinh.hoaDonDienTuId,
        hinhThucHoaDonBiDieuChinh: null,
        mauSo: this.hoaDonBiDieuChinh.mauSo,
        kyHieu: this.hoaDonBiDieuChinh.kyHieu,
        ngayHoaDon: this.hoaDonBiDieuChinh.ngayHoaDon,
        soHoaDon: this.hoaDonBiDieuChinh.soHoaDon,
        lyDo: this.bienBanDieuChinhForm.get('lyDoDieuChinh').value,
        maTraCuu: this.hoaDonBiDieuChinh.maTraCuu
      });
    }
  }

  clickAdd(type: number, lyDoDieuChinh: LyDoDieuChinh) {
    const modal = this.modalService.create({
      nzTitle: getTenHoaDonByLoai(type),
      nzContent: HoaDonDienTuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
        loaiHD: type,
        fbEnableEdit: true,
        lyDoDieuChinh,
        bienBanDieuChinhId: this.bienBanDieuChinhForm.get('bienBanDieuChinhId').value,
        isMoTuGiaoDienBienBan: true
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.bienBanDieuChinhForm.get('hoaDonDieuChinhId').setValue(rs.hoaDonDienTuId);
        this.updateForm(() => {
          this.ngOnInit();
          this.isMoTrenGD = true;
        });
      }
    });
  }

  updateForm(callback: () => any) {
    const data = this.bienBanDieuChinhForm.getRawValue();
    data.hoaDonBiDieuChinh = this.hoaDonBiDieuChinh;
    if (this.data) data.bienBanDieuChinhId = this.data.bienBanDieuChinhId;
    this.bienBanDieuChinhService.Update(data).subscribe(
      (result: any) => {
        if (result) {
          callback();
        } else {
          this.message.error('Lỗi cập nhật');
        }
      }, _ => {
        this.spinning = false;
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
      });
  }

  xemHoaDon() {
    const data = { hoaDonDienTuId: this.hoaDonBiDieuChinh != null ? this.hoaDonBiDieuChinh.hoaDonDienTuId : this.bienBanDieuChinhForm.get('hoaDonBiDieuChinhId').value }
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((hd: any)=>{
      this.tabHoaDonDienTuComponent.viewReceipt(hd);
    })
  }

  xemHoaDonLQ(data: any) {
    console.log(data);
    this.tabHoaDonDienTuComponent.viewReceipt(data);
  }

  export() {
    const id = this.bienBanDieuChinhForm.get('bienBanDieuChinhId').value;
    this.bienBanDieuChinhService.PreviewBienBan(id)
      .subscribe((res: any) => {
        DownloadFile(`${this.env.apiUrl}/${res.filePath}`, 'Bien_ban_dieu_chinh_hoa_don.pdf');
      });
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
      loaiNghiepVu: RefType.BienBanDieuChinh,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        console.log(res);
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
  }

  downloadFile(item: TaiLieuDinhKem) {
    DownloadFile(item.link, item.tenGoc);
  }

  deleteFile(item: TaiLieuDinhKem) {
    this.listFile = this.listFile.filter(x => x !== item);
  }
}
