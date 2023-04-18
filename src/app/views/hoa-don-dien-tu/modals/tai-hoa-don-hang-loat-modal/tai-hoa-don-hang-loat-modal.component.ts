import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, observable, Observable, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { SearchEngine } from 'src/app/shared/searchEngine';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HinhThucThanhToanService } from 'src/app/services/danh-muc/hinh-thuc-thanh-toan.service';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { DonViTinhService } from 'src/app/services/danh-muc/don-vi-tinh.service';
import { HangHoaDichVuService } from 'src/app/services/danh-muc/hang-hoa-dich-vu.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { LoiTrangThaiPhatHanh } from 'src/app/enums/LoiTrangThaiPhatHanh.enum';
import * as printJS from 'print-js';
import { WebSocketService } from 'src/app/services/websocket.service';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { HoaDonParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { getHeightBangKe, getListEmptyBangKe, getTenLoaiHoaDon, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { ModalBuilderForService } from 'ng-zorro-antd/modal/nz-modal.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { MessageInv } from 'src/app/models/messageInv';
import { GuiBienBanXoaBoModalComponent } from '../gui-bien-ban-xoa-bo-modal/gui-bien-ban-xoa-bo-modal.component';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { Message } from 'src/app/shared/Message';
import { SumwidthConfig } from 'src/app/shared/global';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { TraCuuHoaDonModalComponent } from '../tra-cuu-hoa-don-modal/tra-cuu-hoa-don-modal.component';
import { element } from 'protractor';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver'
import { SharedService } from 'src/app/services/share-service';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-tai-hoa-don-hang-loat-modal',
  templateUrl: './tai-hoa-don-hang-loat-modal.component.html',
  styleUrls: ['./tai-hoa-don-hang-loat-modal.component.scss']
})
export class TaiHoaDonHangLoatModalComponent implements OnInit, AfterViewChecked {
  subcription: Subscription;
  mainForm: FormGroup;
  displayData: HoaDonParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    Ky: 5,
    LoaiHoaDon: -1,
    KhachHangId: ''
  };

  displayDataDT: DoiTuongParams = {
    PageNumber: 1,
    PageSize: 20,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true,
    LoaiDoiTuong: 1
  };

  spinning = false;
  ddtp = new DinhDangThapPhan();
  keyword: string = '';
  pageSizeOptions: number[] = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  loading = false;
  kys = GetList();
  hoaDonDienTuForm: any;
  loadingSearchDropdown: boolean;
  waitingType = false;
  typingTimer;
  doneTypingInterval = 500;
  totalPages = 0;
  doiTuongs: any[] = [];
  isLoadingMore: boolean;
  comboboxFocusKey = ''; //key định danh nhấn vào combobox nào
  comboboxControlId = ''; //id của combobox được nhấn
  comboboxDetailTableId = ''; //id của comboxbox trong bảng chi tiết được nhấn vào
  widthConfigB = ['50px', '180px', '150px', '150px', '150px', '150px', '150px', '250px', '250px', '150px', '200px', '100px', '150px'];
  scrollConfigB = { x: SumwidthConfig(this.widthConfigB), y: '450px' };

  ActivedModal: any;
  isAllDisplayDatasPHChecked: boolean = false;
  isIndeterminatePH: boolean = false;
  mapOfCheckedIdPH: any = {};
  listOfPhatHanh: any[] = [];
  listOfSend: any[] = [];
  numberBangKeBCols: any[];
  lstBangKeBEmpty: any[];
  totalPH = 0;
  user = JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private hoSoHDDTService: HoSoHDDTService,
    private sharedService: SharedService,
    private modalService: NzModalService,
    private websocketService: WebSocketService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private doiTuongService: DoiTuongService
  ) {

  }
  ngOnInit() {
    this.getDoiTuong();
    this.numberBangKeBCols = Array(13).fill(0);
    this.lstBangKeBEmpty = getListEmptyBangKe(this.listOfPhatHanh);
  }

  getData() {
    this.filterTable();
  }

  getDoiTuong() {
    this.doiTuongService.GetAllPaging(this.displayDataDT)
      .subscribe((res: any) => {
        this.totalPages = res.totalPages;
        this.doiTuongs = [];
        this.doiTuongs = [...this.doiTuongs, ...res.items];
        this.loadingSearchDropdown = false;
      });
  }

  searchDoiTuong(event: any) {
    this.displayDataDT.Keyword = event;
    this.displayDataDT.PageNumber = 1;
    this.loadingSearchDropdown = true;

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {
          this.totalPages = res.totalPages;
          this.doiTuongs = [];
          this.doiTuongs = [...this.doiTuongs, ...res.items];
          this.loadingSearchDropdown = false;
        });
    }, this.doneTypingInterval);
  }

  loadMoreDoiTuong(): void {
    this.isLoadingMore = true;

    if (this.displayDataDT.PageNumber > this.totalPages) {
      this.isLoadingMore = false;
      return;
    }

    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.displayDataDT.PageNumber += 1;

      if (this.displayDataDT.PageNumber > this.totalPages) {
        this.isLoadingMore = false;
        return;
      }

      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {
          this.totalPages = res.totalPages;
          this.doiTuongs = [...this.doiTuongs, ...res.items];
          this.isLoadingMore = false;
        });
    }, this.doneTypingInterval);
  }

  openChangeDropDown(event: any) {
    if (event) {
      this.displayDataDT.Keyword = '';
      this.displayDataDT.PageNumber = 1;
      this.loadingSearchDropdown = true;
      this.doiTuongService.GetAllPaging(this.displayDataDT)
        .subscribe((res: any) => {
          this.totalPages = res.totalPages;
          this.doiTuongs = [];
          this.doiTuongs = [...this.doiTuongs, ...res.items];
          this.loadingSearchDropdown = false;
        });
    }
  }

  focusComboBox(key, controlId, detailTableId) {
    this.comboboxFocusKey = key;
    this.comboboxControlId = controlId;
    this.comboboxDetailTableId = detailTableId;
  }

  changeKy(event: any) {
    SetDate(event, this.displayData);
  }

  blurDate() {
    CheckValidDateV2(this.displayData);
    const ky = GetKy(this.displayData);
    this.displayData.Ky = ky;
  }

  refreshStatusPH(): void {
    this.isAllDisplayDatasPHChecked = this.listOfPhatHanh.every(item => this.mapOfCheckedIdPH[item.hoaDonDienTuId]);
    this.isIndeterminatePH =
      this.listOfPhatHanh.some(item => this.mapOfCheckedIdPH[item.hoaDonDienTuId]) && !this.isAllDisplayDatasPHChecked;

    this.listOfPhatHanh.forEach((item: any) => {
      item.isSend = false;
      item.selected = false;
    });

    let entries = Object.entries(this.mapOfCheckedIdPH);
    for (const [prop, val] of entries) {
      const item = this.listOfPhatHanh.find(x => x.hoaDonDienTuId === prop);
      const selectedIndex = this.listOfSend.findIndex(x => x.hoaDonDienTuId === prop);
      const index = this.listOfPhatHanh.findIndex(x => x.hoaDonDienTuId === prop);

      if (val) {
        if (selectedIndex === -1) {
          this.listOfSend.push(item);
          item.isSended = true;
          item.selected = true;
        }
      } else {
        if (selectedIndex !== -1) {
          this.listOfSend = this.listOfSend.filter(x => x.hoaDonDienTuId !== prop);
          item.isSended = false;
          item.selected = false;
        }
      }

      if (index !== -1) {
        this.listOfPhatHanh[index].selected = item.selected;
        this.listOfPhatHanh[index].isSended = item.isSended;
      }
    }

  }

  checkAllPH(value: boolean): void {
    this.listOfPhatHanh.forEach(item => (this.mapOfCheckedIdPH[item.hoaDonDienTuId] = value));
    this.refreshStatusPH();
  }

  xemHoaDon(data: any = null) {
    if (data == null) {
      const vals = this.listOfPhatHanh.filter(x => x.selected == true);
      if (vals.length == 0) return;
      data = vals[0];
    }

    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    this.hoaDonDienTuService.GetById(data.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
        const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
        showModalPreviewPDF(this.modalService, pathPrint);
        this.message.remove(id);
      }, (err) => {
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      });
    }, (err) => {
      console.log(err);
      this.message.warning("Lỗi khi xem hóa đơn");
      this.message.remove(id);
    })
  }

  filterTable() {
    this.loading = true;
    this.hoaDonDienTuService.GetAllPaging(this.displayData).subscribe((res: any) => {
      this.listOfPhatHanh = res.items.filter(x => x.trangThaiQuyTrinh == TrangThaiQuyTrinh.DaKyDienTu);
      res.totalCount = res.length;
      this.totalPH = res.totalCount;
      if (res.currentPage != 0) this.displayData.PageNumber = res.currentPage;
      this.displayData.PageSize = res.pageSize;
      this.pageSizeOptions = [100, 150, 200];

      if (this.listOfPhatHanh && this.listOfPhatHanh.length > 0) {
        this.selectedRow(this.listOfPhatHanh[0]);
      }

      this.rowScrollerToViewEdit.scrollToRow(this.listOfPhatHanh, "hoaDonDienTuId").then((result) => {
        this.selectedRow(result);
      });
      this.loading = false;
    })
  }

  selectedRow(data: any) {
    if (this.listOfSend.length === 0) {
      data.selected = true;
      this.listOfPhatHanh.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }

  }

  download() {
    if (this.listOfSend.length == 0) {
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
          msContent: 'Bạn chưa chọn hóa đơn. Vui lòng kiểm tra lại! ',
          msOnClose: () => {
          },
        }
      });
      this.loading = false;
      return;
    }
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    let observables: Observable<any>[] = [];
    this.listOfSend.forEach(element => {
      observables.push(this.hoaDonDienTuService.GetById(element.hoaDonDienTuId));
    });

    if (observables.length > 0 && observables.length == this.listOfSend.length) {
      forkJoin(observables).subscribe((res: any[]) => {
        if (res.length == observables.length) {
          let observables1: Observable<any>[] = [];
          res.forEach(ele => {
            observables1.push(this.hoaDonDienTuService.TaiHoaDon(ele));
          });

          var fileArray = [];
          if (observables1.length == res.length) {
            forkJoin(observables1).subscribe((rs: any[]) => {
              for (let i = 0; i < rs.length; i++) {
                if (rs[i] != null) {
                  const pathPrintPDF = this.env.apiUrl + `/${rs[i].filePDF}`;
                  const pathPrintXML = this.env.apiUrl + `/${rs[i].fileXML}`;
                  fileArray.push({
                    path: pathPrintPDF,
                    fileName: rs[i].pdfName
                  });
                  fileArray.push({
                    path: pathPrintXML,
                    fileName: rs[i].xmlName
                  })
                }
              }
              var fileName = `Hoa_don_Bach_khoa_${moment().format("DD.MM.YYYY")}_${moment().format("hh.mm")}`;
              this.downloadFile(fileArray, fileName);
              this.message.remove(id);
              this.modal.destroy(true);
            });
          }

        }
      })
    }
    else {
      this.message.remove(id);
      this.modal.destroy(true);
    }
  }

  downloadFile(filesArray, fileZipName) {
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

  view() {
    if (this.listOfSend.length == 0) {
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
          msContent: 'Bạn chưa chọn hóa đơn. Vui lòng kiểm tra lại! ',
          msOnClose: () => {
          },
        }
      });
      this.loading = false;
      return;
    }
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    let observables: Observable<any>[] = [];

    for (let i = 0; i < this.listOfSend.length; i++) {
      if (this.listOfSend[i] != null && this.listOfSend[i] != undefined) {
        
        observables.push(this.hoaDonDienTuService.GetById(this.listOfSend[i].hoaDonDienTuId));
      }
    }
    forkJoin(observables).subscribe((res: any[]) => {
      if (res.length == this.listOfSend.length) {
        let observables1: Observable<any>[] = [];
        for (let i = 0; i < res.length; i++) {
          observables1.push(this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res[i]));
          forkJoin(observables1).subscribe((rs: any) => {
            if (rs.length == res.length) {
              var fileArray = [];
              console.log(rs);
              rs.forEach(element => {
                fileArray.push(element.filePDF);
              });
              if (fileArray.length == res.length) {
                this.hoaDonDienTuService.XemHoaDonDongLoat(fileArray).subscribe((result: any) => {
                  const link = window.URL.createObjectURL(result);
                  showModalPreviewPDF(this.modalService, link);
                  this.message.remove(id);
                }), err => {
                  this.message.remove(id);
                }
              }
            }
          })
        }
      }
    })
  }


  changeNgayHoaDon(i: number, event: any) {
    this.hoaDonDienTuService.GetById(this.listOfPhatHanh[i].hoaDonDienTuId).subscribe((res: any) => {
      res.ngayHoaDon = moment(event.target.value).format("YYYY-MM-DD");
      this.hoaDonDienTuService.Update(res).subscribe();
    })
  }

  changeNguoiNhanHoaDon(i: number, option: string, event: any) {
    this.hoaDonDienTuService.GetById(this.listOfPhatHanh[i].hoaDonDienTuId).subscribe((res: any) => {
      if (option == "hoten")
        res.hoTenNguoiNhanHD = event.target.value;
      else if (option == 'email')
        res.emailNguoiNhanHD = event.target.value;
      else if (option == 'sdt')
        res.soDienThoaiNguoiNhanHD = event.target.value;
      else return;
      this.hoaDonDienTuService.Update(res).subscribe();
    })
  }

  cancel() {
    this.modal.destroy();
  }

  ngAfterViewChecked() {

  }

  destroyModal() {
    this.modal.destroy();
  }
}

