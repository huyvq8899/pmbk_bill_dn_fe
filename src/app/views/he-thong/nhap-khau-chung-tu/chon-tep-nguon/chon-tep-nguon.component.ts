import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode, NzDropdownMenuComponent, NzContextMenuService, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SharedService } from 'src/app/services/share-service';
import { EnvService } from 'src/app/env.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import * as moment from 'moment';
import { DownloadFile, GetFileName, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TabThongDiepGuiComponent } from 'src/app/views/quan-ly/tab-thong-diep-gui/tab-thong-diep-gui.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chon-tep-nguon',
  templateUrl: './chon-tep-nguon.component.html',
  styleUrls: ['./chon-tep-nguon.component.scss']
})
export class ChonTepNguonComponent implements OnInit, OnDestroy {
  @Output() changeLoaiChungTuEvent: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('fImportExcel', { static: false })
  myInputVariable: ElementRef;
  activatedNode?: NzTreeNode;
  selectedLoaiChungTu: any;
  boxTitle = "Chọn loại danh mục";
  linkFile = '';
  tenLoaiTepMau = '';
  modeValue = 1;
  boKyHieuHoaDonId = null;
  boKyHieuHoaDons = [];
  fileType = 1; //1: excel, 2: xml
  thaoTacHoaDons = [];
  thaoTacHangHoa_DichVus = [];
  thaoTacKhachHangs = [];
  thaoTacNhanViens = [];
  permission: boolean = false;
  nodesModeNhap = [
    { title: 'Nhập khẩu thêm mới', key: 1, disabled: false },
    // { title: 'Nhập khẩu cập nhật', key: 2, disabled: false },
  ];
  nodesModeNhapAll = JSON.parse(JSON.stringify(this.nodesModeNhap));
  nodesDanhMuc = [
    { title: 'Khách hàng', key: '1001', disabled: false },
    { title: 'Nhân viên', key: '1002', disabled: false },
    { title: 'Hàng hóa dịch vụ', key: '1003', disabled: false },

  ];
  nodesHoaDon = [];
  nodesHoaDonAll = [];
  thaoTacs: any;
  mauHoaDonIds = []
  fileData = null;
  loaiChungTuData = null;
  hasToKhaiDuocChapNhan = false;
  clickedContinue = false;
  subscription: Subscription;
  boolQuanLyNhanVienBanHangTrenHoaDon = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolQuanLyNhanVienBanHangTrenHoaDon').giaTri;

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  _excelExtensions = ['.xlsx', '.xls'];
  _xmlExtensions = ['.xml'];
  radioValue = 'A';

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private message: NzMessageService,
    private sharesv: SharedService,
    private env: EnvService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent
  ) { }

  ngOnInit() {
    if (!JSON.parse(this.boolQuanLyNhanVienBanHangTrenHoaDon)) {
      this.nodesDanhMuc = this.nodesDanhMuc.filter(x => x.key !== '1002');
    }

    this.subscription = this.sharesv.changeEmitted$.subscribe((res: any) => {
      if (res) {
        if (res.type === 'ImportFileData') {
          this.clickedContinue = true;
        }
      }
    });

    this.boKyHieuHoaDonService.GetThongTinTuToKhaiMoiNhat()
      .subscribe((res: any) => {
        this.hasToKhaiDuocChapNhan = !!res;

        if (res && res.loaiHoaDons.length > 0) {
          res.loaiHoaDons.forEach((item: any) => {
            if (item !== 6) {
              var tenLoaiHoaDon = getTenHoaDonByLoai(item);
              this.nodesHoaDon.push({ title: tenLoaiHoaDon, key: `200${item}`, disabled: false });
            }
          });
          this.nodesHoaDonAll = JSON.parse(JSON.stringify(this.nodesHoaDon));
          localStorage.setItem('nodesHoaDon', JSON.stringify(this.nodesHoaDon));
        }

        var phanQuyen = localStorage.getItem('KTBKUserPermission');
        console.log(phanQuyen);
        if (phanQuyen == 'true') {
          this.permission = true;
        }
        else {
          var pq = JSON.parse(phanQuyen);
          this.mauHoaDonIds = pq.mauHoaDonIds;
          console.log(pq);

          if (pq.functions.map(x => x.functionName).indexOf("HoaDon") >= 0)
            this.thaoTacHoaDons = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
          if (pq.functions.map(x => x.functionName).indexOf("KhachHang") >= 0)
            this.thaoTacKhachHangs = pq.functions.find(x => x.functionName == "KhachHang").thaoTacs;
          if (pq.functions.map(x => x.functionName).indexOf("NhanVien") >= 0)
            this.thaoTacNhanViens = pq.functions.find(x => x.functionName == "NhanVien").thaoTacs;
          if (pq.functions.map(x => x.functionName).indexOf("HangHoaDichVu") >= 0)
            this.thaoTacHangHoa_DichVus = pq.functions.find(x => x.functionName == "HangHoaDichVu").thaoTacs;

          if (this.thaoTacHoaDons.indexOf("HD_CREATE") < 0 && this.thaoTacHoaDons.indexOf("HD_UPDATE") < 0) {
            this.nodesHoaDon.forEach((item: any) => {
              item.disabled = true;
            });
          }


          if (this.thaoTacKhachHangs.indexOf("DM_CREATE") < 0 && this.thaoTacKhachHangs.indexOf("DM_UPDATE") < 0) {
            this.nodesDanhMuc[0].disabled = true;
          }


          if (this.thaoTacNhanViens.indexOf("DM_CREATE") < 0 && this.thaoTacNhanViens.indexOf("DM_UPDATE") < 0) {
            this.nodesDanhMuc[1].disabled = true;
          }

          if (this.thaoTacHangHoa_DichVus.indexOf("DM_CREATE") < 0 && this.thaoTacHangHoa_DichVus.indexOf("DM_UPDATE") < 0) {
            this.nodesDanhMuc[2].disabled = true;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ImportFile(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      if (!this.hasExtension(event.target.files[0].name, this.fileType === 1 ? this._excelExtensions : this._xmlExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!this.hasFileSize(event.target.files[0].size)) {
        this.message.error('Dung lượng file vượt quá 10MB.');
        return;
      }

      let loaiHoaDon = 1;
      switch (this.selectedLoaiChungTu) {
        case '2001':
          loaiHoaDon = 1;
          break;
        case '2002':
          loaiHoaDon = 2;
          break;
        case '2007':
          loaiHoaDon = 7;
          break;
        case '2008':
          loaiHoaDon = 8;
          break;
        default:
          break;
      }

      let fileData: any = new FormData();
      this.linkFile = event.target.files[0].name;
      fileData.append('userId', localStorage.getItem('userId'));
      fileData.append('fileName', event.target.files[0].name);
      fileData.append('modeValue', this.modeValue);
      fileData.append('fileType', this.fileType);
      fileData.append('boKyHieuHoaDonId', this.boKyHieuHoaDonId || '');
      fileData.append('loaiHoaDon', loaiHoaDon);

      for (let i = 0; i < files.length; i++) {
        fileData.append('files', files[i]);
      }
      if (fileData != null) {
        this.fileData = {
          type: 'FileData',
          value: fileData,
          loaiDuLieu: this.boxTitle,
        }
        this.sharesv.emitChange(this.fileData);
        this.reset();
      }
    }
  }
  reset() {
    this.myInputVariable.nativeElement.value = "";
  }
  hasExtension(fileName, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
  hasFileSize(fileSize) {
    if ((fileSize / 1024 / 1024) < 10240) { return true; }
    return false;
  }
  changeLoaiChungTu(event: any) {
    //kiểm tra text đã được chọn
    this.modeValue = 1;
    this.linkFile = null;
    this.clickedContinue = false;
    this.fileData = null;
    this.changeLoaiChungTuEvent.emit(this.fileData);

    this.sharesv.emitChange(this.fileData);
    let items = this.nodesDanhMuc.filter(x => x.key == event);
    if (items != null && items.length > 0) {
      this.tenLoaiTepMau = items[0].title;

      if (items[0].key == "1001") {
        if (this.thaoTacKhachHangs.indexOf("DM_CREATE") < 0) {
          this.nodesModeNhap[0].disabled = true;
        }

        if (this.thaoTacKhachHangs.indexOf("DM_UPDATE") < 0) {
          // this.nodesModeNhap[1].disabled = true;
        }

        if (this.thaoTacKhachHangs.indexOf("DM_CREATE") >= 0) {
          this.modeValue = 1;
        }
        else if (this.thaoTacKhachHangs.indexOf("DM_UPDATE") >= 0) {
          this.modeValue = 2;
        }
      }
      else if (items[0].key == "1002") {
        if (this.thaoTacNhanViens.indexOf("DM_CREATE") < 0) {
          this.nodesModeNhap[0].disabled = true;
        }

        if (this.thaoTacNhanViens.indexOf("DM_UPDATE") < 0) {
          // this.nodesModeNhap[1].disabled = true;
        }

        if (this.thaoTacNhanViens.indexOf("DM_CREATE") >= 0) {
          this.modeValue = 1;
        }
        else if (this.thaoTacNhanViens.indexOf("DM_UPDATE") >= 0) {
          this.modeValue = 2;
        }
      }
      else {
        if (this.thaoTacHangHoa_DichVus.indexOf("DM_CREATE") < 0) {
          this.nodesModeNhap[0].disabled = true;
        }

        if (this.thaoTacHangHoa_DichVus.indexOf("DM_UPDATE") < 0) {
          // this.nodesModeNhap[1].disabled = true;
        }

        if (this.thaoTacHangHoa_DichVus.indexOf("DM_CREATE") >= 0) {
          this.modeValue = 1;
        }
        else if (this.thaoTacHangHoa_DichVus.indexOf("DM_UPDATE") >= 0) {
          this.modeValue = 2;
        }
      }

      this.loaiChungTuData = {
        type: 'LoaiChungTu',
        value: event,
        loaiDuLieu: this.boxTitle
      }
      this.sharesv.emitChange(this.loaiChungTuData);
    } else {
      let items2 = this.nodesHoaDon.filter(x => x.key == event);
      if (items2 != null && items2.length > 0) {
        this.tenLoaiTepMau = items2[0].title;

        if (this.thaoTacHoaDons.indexOf("HD_CREATE") < 0) {
          this.nodesModeNhap[0].disabled = true;
        }

        /*         if(this.thaoTacHoaDons.indexOf("HD_UPDATE") < 0){
                  this.nodesModeNhap[1].disabled = true;
                } */

        if (this.thaoTacHoaDons.indexOf("HD_CREATE") >= 0) {
          this.modeValue = 1;
        }
        // else if(this.thaoTacHoaDons.indexOf("HD_UPDATE") >= 0){
        //   this.modeValue = 2;
        // }

        let loaiHD;
        switch (event) {
          case '2001':
            loaiHD = 1;
            break;
          case '2002':
            loaiHD = 2;
            break;
          case '2007':
            loaiHD = 7;
            break;
          case '2008':
            loaiHD = 8;
            break;
          default:
            break;
        }

        const ngayHoaDon = moment().format('YYYY-MM-DD');

        this.boKyHieuHoaDonService.GetListForHoaDon(loaiHD, ngayHoaDon)
          .subscribe((res: any[]) => {
            if (this.permission != true) {
              this.boKyHieuHoaDons = res.filter(x => this.mauHoaDonIds.indexOf(x.boKyHieuHoaDonId) >= 0);
            } else {
              this.boKyHieuHoaDons = res
            };
            this.boKyHieuHoaDonId = null;
            if (this.boKyHieuHoaDons.length > 0) {
              this.boKyHieuHoaDonId = this.boKyHieuHoaDons[0].boKyHieuHoaDonId;
            } else {
              this.showThongBaoKhongTonTaiBoKyHieu();
            }

            this.loaiChungTuData = {
              type: 'LoaiChungTu',
              value: event,
              loaiDuLieu: this.boxTitle,
              boKyHieuHoaDonId: this.boKyHieuHoaDonId
            }
            this.sharesv.emitChange(this.loaiChungTuData);
          });
      }
    }
  }
  changeKyHieu(event: any) {
    this.boKyHieuHoaDonId = event;

    if (this.fileData && this.fileData.type === 'FileData') {
      var fileData = this.fileData.value as FormData;
      fileData.set('boKyHieuHoaDonId', event);
      this.sharesv.emitChange(this.fileData);
    }

    this.loaiChungTuData.boKyHieuHoaDonId = event;
    this.sharesv.emitChange(this.loaiChungTuData);
  }
  downloadTemplate() {
    if (this.selectedLoaiChungTu == null || this.selectedLoaiChungTu === undefined || this.selectedLoaiChungTu === '') {
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
          msContent: `Bạn chưa ${this.boxTitle.toLowerCase()}. Vui lòng kiểm tra lại.`,
          msOnClose: () => { }
        },
        nzFooter: null
      });
      return;
    }
    if (this.selectedLoaiChungTu === '1001') {
      const link = this.env.apiUrl + '/docs/Template/ImportDanhMuc/Danh_Muc_Khach_Hang_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '1002') {
      const link = this.env.apiUrl + '/docs/Template/ImportDanhMuc/Danh_Muc_Nhan_Vien_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '1003') {
      const link = this.env.apiUrl + '/docs/Template/ImportDanhMuc/Danh_Muc_Hang_Hoa_Dich_Vu_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '2001') {
      const link = this.env.apiUrl + '/docs/Template/ImportHoaDon/Hoa_Don_Gia_Tri_Gia_Tang_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '2002') {
      const link = this.env.apiUrl + '/docs/Template/ImportHoaDon/Hoa_Don_Ban_Hang_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '2007') {
      const link = this.env.apiUrl + '/docs/Template/ImportHoaDon/Phieu_Xuat_Kho_Kiem_Van_Chuyen_Noi_Bo_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
    if (this.selectedLoaiChungTu === '2008') {
      const link = this.env.apiUrl + '/docs/Template/ImportHoaDon/Phieu_Xuat_Kho_Hang_Gui_Ban_Dai_Ly_Import.xlsx'
      DownloadFile(link, GetFileName(link))
    }
  }

  changeLoaiNhapKhau(event: any) {
    this.nodesModeNhap = this.nodesModeNhapAll;
    this.nodesModeNhap = this.nodesModeNhapAll;
    if (event == 'A') {
      this.boxTitle = "Chọn loại danh mục";
    }
    else if (event == 'B') {
      this.boxTitle = "Chọn loại hóa đơn";
      this.nodesModeNhap = this.nodesModeNhapAll.filter(x => x.key === 1);

      this.nodesHoaDon = this.nodesHoaDonAll.filter(x => x.key === '2001' || x.key === '2002');

      if (!this.hasToKhaiDuocChapNhan) {
        this.showThongBaoKhongTonTaiToKhai();
      } else {
        if (this.nodesHoaDon.length === 1) {
          setTimeout(() => {
            this.selectedLoaiChungTu = this.nodesHoaDon[0].key;
            this.changeLoaiChungTu(this.selectedLoaiChungTu);
          }, 0);
        }
      }
    }
    else if (event == 'C') {
      this.boxTitle = "Chọn loại phiếu xuất kho";
      this.nodesModeNhap = this.nodesModeNhapAll.filter(x => x.key === 1);

      this.nodesHoaDon = this.nodesHoaDonAll.filter(x => x.key === '2007' || x.key === '2008');

      if (!this.hasToKhaiDuocChapNhan) {
        this.showThongBaoKhongTonTaiToKhai();
      } else {
        if (this.nodesHoaDon.length === 1) {
          setTimeout(() => {
            this.selectedLoaiChungTu = this.nodesHoaDon[0].key;
            this.changeLoaiChungTu(this.selectedLoaiChungTu);
          }, 0);
        }
      }
    }

    this.tenLoaiTepMau = '';
    this.selectedLoaiChungTu = null;
    this.loaiChungTuData = {
      type: 'LoaiChungTu',
      value: null,
      loaiDuLieu: this.boxTitle,
      boKyHieuHoaDonId: this.boKyHieuHoaDonId
    }
    this.sharesv.emitChange(this.loaiChungTuData);
  }

  changeModeNhap(event: any) {
    this.modeValue = event;
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

  showThongBaoKhongTonTaiBoKyHieu() {
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
        msOkButtonInBlueColor: false,
        msTitle: 'Kiểm tra lại',
        msContent: 'Bạn không thể lập hóa đơn do không tồn tại bộ ký hiệu hóa đơn có trạng thái sử dụng là <b>Đang sử dụng</b>, <b>Đã xác thực</b>. Vui lòng kiểm tra lại!',
        msXemDanhMucBoKyHieuHoaDon: true,
        msOnOk: () => {
          this.router.navigate(['quan-ly/bo-ky-hieu-hoa-don']);
        },
        msOnClose: () => { }
      },
      nzFooter: null
    });
  }
}
