import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/share-service';
import { Subscription } from 'rxjs';
import { NzMessageService, NzModalService, NZ_ICONS } from 'ng-zorro-antd';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TabThongDiepGuiComponent } from '../../quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';

@Component({
  selector: 'app-nhap-khau-chung-tu',
  templateUrl: './nhap-khau-chung-tu.component.html',
  styleUrls: ['./nhap-khau-chung-tu.component.scss']
})
export class NhapKhauChungTuComponent implements OnInit {
  selectedIndex = 0;
  selectedLoaiChungTu: any;
  selectedLoaiDuLieu = "Chọn loại danh mục";
  selectedMode: any;
  fileData: any = null;
  subscription: Subscription;
  dataImport: any;
  listTruongDuLieu: any[] = [];
  isLoading: boolean = false;
  loaiHoaDon = 1;
  boKyHieuHoaDonId = null;
  innerHeight:any;
  hasToKhaiDuocChapNhan = false;

  constructor(
    private sharesv: SharedService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private doiTuongsv: DoiTuongService,
    private vthhsv: HangHoaDichVuService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent
  ) {
    this.subscription = this.sharesv.changeEmitted$.subscribe(
      (rs: any) => {
        if (rs != null && rs.type === 'LoaiChungTu') {
          this.selectedLoaiChungTu = rs.value;
          this.selectedLoaiDuLieu = rs.loaiDuLieu;
          this.boKyHieuHoaDonId = rs.boKyHieuHoaDonId;
        }
        if (rs != null && rs.type === 'FileData') {
          this.fileData = rs.value;
        }
        if (rs != null && rs.type === "Error") {
          this.isLoading = false;
        }
        if (rs != null && rs.type === "Loading") {
          this.isLoading = true;
        }
        if (rs != null && rs.type === "Loaded") {
          this.isLoading = false;
        }
        if (rs != null && rs.type === 'CheckingImportKhachHang') {
          this.dataImport = rs.value;
        }
        if (rs != null && rs.type === 'CheckingImportNhanVien') {
          this.dataImport = rs.value;
        }
        if (rs != null && rs.type === 'CheckingImportVTHH') {
          this.dataImport = rs.value;
        }
        if (rs != null && rs.type === 'CheckingImportHoaDonGTGT') {
          this.dataImport = rs.value;
          this.listTruongDuLieu = rs.listTruongDuLieu;
          this.loaiHoaDon = 1;
        }
        if (rs != null && rs.type === 'CheckingImportHoaDonBanHang') {
          this.dataImport = rs.value;
          this.listTruongDuLieu = rs.listTruongDuLieu;
          this.loaiHoaDon = 2;
        }
        if (rs != null && rs.type === 'CheckingImportPXKVanChuyenNoiBo') {
          this.dataImport = rs.value;
          this.listTruongDuLieu = rs.listTruongDuLieu;
          this.loaiHoaDon = 7;
        }
        if (rs != null && rs.type === 'CheckingImportPXKGuiBanDaiLy') {
          this.dataImport = rs.value;
          this.listTruongDuLieu = rs.listTruongDuLieu;
          this.loaiHoaDon = 8;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        this.hasToKhaiDuocChapNhan = !!res;
      });
  }

  changeTab(event: any) {
    if (event.index !== 0) {
      if (!this.selectedLoaiChungTu) {
        this.message.error('Vui lòng chọn loại chứng từ', { nzDuration: 5000 });
        this.selectedIndex = 0;
        return;
      }
      if (!this.fileData) {
        this.message.error('Vui lòng chọn file', { nzDuration: 5000 });
        this.selectedIndex = 0;
        return;
      }
    }
    if (event.index === 1) {
      if (this.selectedLoaiChungTu === '1001' && this.fileData != null) {
        const data: any = {
          type: 'ImportKhachHang',
          fileData: this.fileData,
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '1002' && this.fileData != null) {
        const data: any = {
          type: 'ImportNhanVien',
          fileData: this.fileData,
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '1003' && this.fileData != null) {
        const data: any = {
          type: 'ImportVTHH',
          fileData: this.fileData,
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '2001' && this.fileData != null) {
        const data: any = {
          type: 'ImportHoaDonGTGT',
          fileData: this.fileData
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '2002' && this.fileData != null) {
        const data: any = {
          type: 'ImportHoaDonBanHang',
          fileData: this.fileData
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '2007' && this.fileData != null) {
        const data: any = {
          type: 'ImportPXKVanChuyenNoiBo',
          fileData: this.fileData
        }
        this.sharesv.emitChange(data);
      }
      if (this.selectedLoaiChungTu === '2008' && this.fileData != null) {
        const data: any = {
          type: 'ImportPXKGuiBanDaiLy',
          fileData: this.fileData
        }
        this.sharesv.emitChange(data);
      }
    }
    if (event.index === 2) {
      if (this.selectedLoaiChungTu === '1001' && this.dataImport != null) {
        const successData = this.dataImport.filter(x => x.hasError === false);
        this.doiTuongsv.InsertKhachHangImport(successData).subscribe((rs: any) => {
          const data: any = {
            type: 'ResultImportDanhMuc',
            value: this.dataImport,
            result: rs,
            key: '1001'
          }
          this.sharesv.emitChange(data);
        });
      }
      if (this.selectedLoaiChungTu === '1002' && this.dataImport != null) {
        const successData = this.dataImport.filter(x => x.hasError === false);
        this.doiTuongsv.InsertNhanVienImport(successData).subscribe((rs: any) => {
          const data: any = {
            type: 'ResultImportDanhMuc',
            value: this.dataImport,
            result: rs,
            key: '1002'
          }
          this.sharesv.emitChange(data);
        });
      }
      if (this.selectedLoaiChungTu === '1003' && this.dataImport != null) {
        const successData = this.dataImport.filter(x => x.hasError === false);
        this.vthhsv.InsertVTHHImport(successData).subscribe((rs: any) => {
          const data: any = {
            type: 'ResultImportDanhMuc',
            value: this.dataImport,
            result: rs,
            key: '1003'
          }
          this.sharesv.emitChange(data);
        });
      }
      if ((this.selectedLoaiChungTu === '2001' || this.selectedLoaiChungTu === '2002' || this.selectedLoaiChungTu === '2007' || this.selectedLoaiChungTu === '2008') && this.dataImport != null) {
        const successData = this.dataImport.filter(x => x.hasError === false);
        this.hoaDonDienTuService.InsertImportHoaDon(successData).subscribe((rs: any) => {
          console.log('insertimport: ', rs);

          if (rs) {
            let type = '';
            switch (this.selectedLoaiChungTu) {
              case '2001':
                type = 'ResultImportHoaDonGTGT';
                break;
              case '2002':
                type = 'ResultImportHoaDonBanHang';
                break;
              case '2007':
                type = 'ResultImportPXKVanChuyenNoiBo';
                break;
              case '2008':
                type = 'ResultImportPXKGuiBanDaiLy';
                break;
              default:
                break;
            }

            const data: any = {
              type: type,
              value: this.dataImport,
              listTruongDuLieu: this.listTruongDuLieu,
              result: {
                numError: this.dataImport.filter(x => x.hasError === true).length,
                numSuccess: this.dataImport.filter(x => x.hasError === false).length,
                numTotal: this.dataImport.length
              },
              key: this.selectedLoaiChungTu
            }
            this.sharesv.emitChange(data);
          } else {
            // this.message.error('Nhập khẩu không thành công!', { nzDuration: 5000 });
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
                msContent: `Nhập khẩu không thành công.
                <br>Vui lòng kiểm tra lại!`,
                msOnClose: () => {
                },
              }
            });
            return;
          }
        });
      }
    }
  }

  clickBack() {
    if (this.selectedIndex > 0) {
      this.selectedIndex -= 1;
    }
  }

  clickNext() {
    if (this.selectedIndex === 0) {
      if (!this.selectedLoaiChungTu) {
        if (!this.hasToKhaiDuocChapNhan && this.selectedLoaiDuLieu === 'Chọn loại hóa đơn') {
          this.showThongBaoKhongTonTaiToKhai();
        } else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '430px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `Bạn chưa ${this.selectedLoaiDuLieu.toLowerCase()}. Vui lòng kiểm tra lại.`,
              msOnClose: () => { }
            },
            nzFooter: null
          });
        }

        return;
      }
      if (!this.fileData) {
        const data: any = {
          type: 'ImportFileData',
          fileData: this.fileData,
        }
        this.sharesv.emitChange(data);
        return;
      }
      if ((this.selectedLoaiChungTu === '2001' || this.selectedLoaiChungTu === '2002') && !this.boKyHieuHoaDonId) {
        this.message.error('Vui lòng chọn ký hiệu hóa đơn để nhập khẩu', { nzDuration: 5000 });
        return;
      }
      this.selectedIndex += 1;
    } else if (this.selectedIndex === 1) {
      if (!this.dataImport || this.dataImport.length === 0 || this.dataImport == null) {
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
            msContent: 'Dữ liệu nhập khẩu trống. Vui lòng kiểm tra lại!',
            msOnClose: () => {
            },
          }
        });
        return;
      }
      if (this.dataImport) {
        if (this.dataImport.filter(x => x.hasError === false).length <= 0) {
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
              msTitle: 'Kiểm tra lại',
              msContent: 'Không thể thực hiện nhập khẩu do không có dòng dữ liệu nào hợp lệ. Vui lòng kiểm tra lại!',
            },
            nzFooter: null
          });
          return;
        }
        if (this.dataImport.filter(x => x.hasError === true).length > 0) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Nhập khẩu dữ liệu`,
              msContent: 'Có dòng dữ liệu không hợp lệ. Bạn có muốn tiếp tục không?',
              msOnClose: () => {
              },
              msOnOk: ()=>{
                this.selectedIndex += 1;
              }
            }
          });
        } else {
          this.selectedIndex += 1;
        }
      }
    } else {
      this.selectedIndex = 0;
    }
  }

  showThongBaoKhongTonTaiToKhai() {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzWidth: '430px',
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOkButtonInBlueColor: true,
        msTitle: 'Lập tờ khai đăng ký sử dụng',
        msContent: `Không thể nhập khẩu dữ liệu hóa đơn từ Excel do chưa tồn tại tờ khai đăng ký/thay đổi thông tin sử dụng
        hóa đơn điện tử được cơ quan thuế chấp nhận.<br/><br/>
        Bạn có muốn lập tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử không?`,
        msOnOk: () => {
          this.tabThongDiepGuiComponent.clickThem();
        },
        msOnClose: () => { }
      },
      nzFooter: null
    });
  }

  onChangeLoaiChungTu(event: any) {
    this.fileData = event;
  }
}
