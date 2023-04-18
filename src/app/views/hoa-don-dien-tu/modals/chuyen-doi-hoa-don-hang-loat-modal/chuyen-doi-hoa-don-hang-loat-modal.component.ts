import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { DoiTuongService } from 'src/app/services/danh-muc/doi-tuong.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import * as printJS from 'print-js';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoaDonParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { getListEmptyBangKe, getTenLoaiHoaDon, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { Message } from 'src/app/shared/Message';
import { SumwidthConfig } from 'src/app/shared/global';
import { SharedService } from 'src/app/services/share-service';
import { DoiTuongParams } from 'src/app/models/params/DoiTuongParams';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-chuyen-doi-hoa-don-hang-loat-modal',
  templateUrl: './chuyen-doi-hoa-don-hang-loat-modal.component.html',
  styleUrls: ['./chuyen-doi-hoa-don-hang-loat-modal.component.scss']
})
export class ChuyenDoiHoaDonHangLoatModalComponent implements OnInit, AfterViewChecked {
  @Input() datas: any;
  subcription: Subscription;
  mainForm: FormGroup;
  displayData: any = {
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
    GiaTri: '',
    LoaiHoaDon: -1,
    TrangThaiHoaDonDienTu: -1,
    TrangThaiPhatHanh: -1,
    TrangThaiGuiHoaDon: -1,
    TrangThaiChuyenDoi: -1,
    TrangThaiBienBanXoaBo: -1,
    TrangThaiXoaBo: -1,
    HinhThucHoaDon: -1,
    UyNhiemLapHoaDon: -1,
    filterColumns: [],
    MauHoaDonDuocPQ: [],
    IsChuyenDoi: true
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
  widthConfigB = ['50px', '240px', '180px', '150px', '150px', '150px', '150px', '150px', '250px', '250px', '150px', '200px', '100px', '150px'];
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
  nguoiChuyenDoi: string;
  ngayChuyenDoi: any;
  isNgayChuyenDoiLaNgayKy: boolean;
  isNgayChuyenDoiLaNgayCQTCapMa: boolean;
  ngayChuyenDoiLaNgayCQTCapMa : any;
  timKiemTheos = [];
  thaoTacs: any[] = [];

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private modalService: NzModalService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private thongDiepGuiNhanCQTService : ThongDiepGuiNhanCQTService
  ) {

  }
  ngOnInit() {
    this.GetDieuKienTimKiem();
    this.permissionMauHoaDons();

    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
      this.nguoiChuyenDoi = this.user ? this.user.fullName : null;
    }

    this.ngayChuyenDoi = moment().format("YYYY-MM-DD");

    if (this.datas && this.datas.length > 0) {
      this.listOfPhatHanh = this.datas;
      this.totalPH = this.datas.length;
      this.checkAllPH(true);
    }
    this.numberBangKeBCols = Array(14).fill(0);
    this.lstBangKeBEmpty = getListEmptyBangKe(this.listOfPhatHanh);
  }

  permissionMauHoaDons() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.displayData.MauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
      });
    } else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "HoaDon").thaoTacs;
      this.displayData.MauHoaDonDuocPQ = pq.mauHoaDonIds;
    }
  }

  getData() {
    if (this.listOfSend.length > 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msTitle: `Lấy dữ liệu`,
          msContent: `Các hóa đơn đã chọn sẽ bị xóa khỏi danh mục hóa đơn đã chọn để chuyển đổi thành hóa đơn giấy khi lấy lại dữ liệu. Bạn có chắc chắn muốn lấy lại dữ liệu không?`,
          msOnClose: () => {
          },
          msOnOk: ()=>{
            this.listOfSend = [];
            this.mapOfCheckedIdPH = {};
            this.searchKeyword();
          }
        }
      });

      return;
    } else {
      this.searchKeyword();
    }
  }

  searchKeyword() {
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    var giaTris = this.displayData.GiaTri != "" ? this.displayData.GiaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0 && giaTris.length == timKiemTheoChecked.length) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i];
      }
      this.displayData.TimKiemTheo = result;
    } else {
      this.displayData.TimKiemTheo = null;
    }

    this.filterTable();
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
      this.listOfPhatHanh = res.items;
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

  convert() {
    if (this.listOfSend.length == 0) {
      this.message.error("Bạn phải chọn ít nhất 1 dòng hóa đơn");
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
            const params = {
              hoaDonDienTuId: ele.hoaDonDienTuId,
              nguoiChuyenDoi: this.nguoiChuyenDoi,
              ngayChuyenDoi: this.isNgayChuyenDoiLaNgayKy == true ? moment(ele.ngayKy).format('YYYY-MM-DD') : this.ngayChuyenDoi,
              isKeepFile: true,
              hoaDonDienTuViewModel : ele
            };
            if(this.isNgayChuyenDoiLaNgayCQTCapMa){
              if(ele.ngayCapMa) params.ngayChuyenDoi = moment(ele.ngayCapMa).format('YYYY-MM-DD');
              else params.ngayChuyenDoi = moment(ele.ngayKy).format('YYYY-MM-DD');
            }
            observables1.push(this.hoaDonDienTuService.ConvertToHoaDonGiay2(params));
          });

          let fileArray = [];
          if (observables1.length == res.length) {
            console.log(observables1);
            forkJoin(observables1).subscribe((rs: any[]) => {
              for (let i = 0; i < rs.length; i++) {
                console.log(rs[i]);
                if (rs[i]) {
                  this.nhatKyTruyCapService.Insert({
                    loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonGiay,
                    doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(res[i].loaiHoaDon),
                    refType: RefType.HoaDonDienTu,
                    thamChieu: null,
                    moTaChiTiet: `Mẫu số: <${res[i].mauSo}>; Ký hiệu: <${res[i].kyHieu}>; Số hóa đơn: <${res[i].soHoaDon}>`,
                    refId: res[i].hoaDonDienTuId
                  }).subscribe();

                  fileArray.push(
                    rs[i].result
                  );
                }
                else {
                  this.nhatKyTruyCapService.Insert({
                    loaiHanhDong: LoaiHanhDong.ChuyenThanhHoaDonGiay,
                    doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(res[i].loaiHoaDon),
                    refType: RefType.HoaDonDienTu,
                    thamChieu: null,
                    moTaChiTiet: `Mẫu số: <${res[i].mauSo}>; Ký hiệu: <${res[i].kyHieu}>; Số hóa đơn: <${res[i].soHoaDon}>`,
                    refId: res[i].hoaDonDienTuId
                  }).subscribe();
                }
              }

              this.hoaDonDienTuService.XemHoaDonDongLoat2(fileArray).subscribe((result: any) => {
                const link = window.URL.createObjectURL(result);
                printJS(link);
                this.message.remove(id);
                this.modal.destroy(true);
              })
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
          msContent: "Bạn chưa chọn hóa đơn. Vui lòng kiểm tra lại!",
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

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  GetDieuKienTimKiem() {
    this.hoaDonDienTuService.GetListTimKiemTheoHoaDonThayThe().subscribe((rs: any[]) => {
      this.timKiemTheos = rs;
    })
  }

  changeCheckNgayCD(event: any) {
    this.isNgayChuyenDoiLaNgayKy = event;
    if(event){
      console.log(event)
      this.isNgayChuyenDoiLaNgayCQTCapMa = !event;
        const ngayChuyenDoi = document.getElementById("ngayChuyenDoi") as HTMLFormElement;
        ngayChuyenDoi.disabled = true;
    }else{
      if(this.isNgayChuyenDoiLaNgayCQTCapMa == false){
        const ngayChuyenDoi = document.getElementById("ngayChuyenDoi") as HTMLFormElement;
        ngayChuyenDoi.disabled = false;
      }
    }
  }

  changeCheckNgayCDCQTCapMa(event: any) {
    this.isNgayChuyenDoiLaNgayCQTCapMa = event;
    if(event){
      this.isNgayChuyenDoiLaNgayKy = !event;
      const ngayChuyenDoi = document.getElementById("ngayChuyenDoi") as HTMLFormElement;
        ngayChuyenDoi.disabled = true;
    }else{
      if(this.isNgayChuyenDoiLaNgayKy == false){
        const ngayChuyenDoi = document.getElementById("ngayChuyenDoi") as HTMLFormElement;
        ngayChuyenDoi.disabled = false;
      }
    }
  }
}

