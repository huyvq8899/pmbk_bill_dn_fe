import { HinhThucHoaDon } from './../../../../enums/HinhThucHoaDon.enum';
import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GetList, SetDate, GetKy } from 'src/app/shared/chon-ky';
import { HoaDonParams, FilterCondition } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import * as moment from 'moment';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { EnvService } from 'src/app/env.service';
import { XemMauHoaDonRaSoatModalComponent } from './xem-mau-hoa-don-modal/xem-mau-hoa-don-modal.component';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { CookieConstant } from 'src/app/constants/constant';
import { CheckValidHuyGiaiTrinh, CheckValidLyDoSaiSot } from 'src/app/customValidators/check-common-valid.validator';
import { NoWhitespaceValidator } from 'src/app/customValidators/no-whitespace-validator';

@Component({
  selector: 'app-chon-thong-bao-can-ra-soat',
  templateUrl: './chon-thong-bao-can-ra-soat-modal.component.html',
  styleUrls: ['./chon-thong-bao-can-ra-soat-modal.component.scss']
})
export class ChonThongBaoCanRaSoatModalComponent implements OnInit {
  @Input() ngayLapThongBao: string = '';
  @Input() data: any = null;
  mainForm: FormGroup;
  spinning = false;
  kys: any[] = GetList();
  displayDataTemp: HoaDonParams = {
    PageNumber: 1,
    PageSize: 10000,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    Ky: 5,
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    filterColumns: [],
    HinhThucHoaDon: 1
  };
  listLoaiSaiSot: any[] = [
    { value: -1, text: 'Tất cả' },
    { value: 2, text: 'Hủy' },
    { value: 0, text: 'Giải trình' }
  ];
  loading = false;
  loadingChiTiet = false;
  searchCustomOverlayStyle = {
    width: '210px'
  };
  totalRecords = 0;
  listHoaDonRaSoat: any[] = [];
  mapOfCheckedId: any = {};
  //tongChieuRong2CotChiTiet là biến lưu tổng chiều rộng của 2 cột [hủy/điều chỉnh/...] và lý do
  //biến tongChieuRong2CotChiTiet được dùng để cộng vào nzScroll.x khi ẩn hoặc hiện 2 cột trên
  tongChieuRong2CotChiTiet = 140 + 200; //140 là cột 1, 200 là cột 2
  tieuDeCacCotFilter: string[] = ['Số thông báo của CQT', 'Tên CQT cấp trên', 'Tên CQT ra thông báo', 'Tên người nộp thuế', 'Mã số thuế']
  mapOfStatusFilteredCols: any = {};
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  invalidMessageNgayThongBao = '';
  listGhiNhoDongDaTuBoTichChon: any = {}; //biến này ghi nhớ dòng đã tự bỏ tích chọn
  flagDaChinhSua = false; //biến này cho biết đã chỉnh sửa trên form chi tiết hay chưa
  thamSoForm: FormGroup;
  timKiemTheos = [
    { value: 'SoThongBao', name: 'Số thông báo của CQT', checked: false },
    { value: 'NgayThongBao', name: 'Ngày thông báo của CQT', checked: false }
  ];
  checkedSuDungLoai: boolean = true;
  checked = false;
  loaiSaiSot: number = -1;
  oldHinhThucHoaDon: 1;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
  ) {
  }


  ngOnInit() {
    if (this.ngayLapThongBao != '') {
      this.invalidMessageNgayThongBao = 'Ngày lập thông báo <' + moment(this.ngayLapThongBao).format('DD/MM/YYYY') + '> không được nhỏ hơn <Ngày thông báo của CQT>';
    }
    this.setDefaulThoiGian();

    this.createForm();
    // this.loadDSHoaDonRaSoat();
  }

  changeHinhThucHoaDon(event) {
    if (event != null) {
      if (event != this.displayDataTemp.HinhThucHoaDon) {
        if (this.listHoaDonRaSoat.length > 0) {
          let modal1 = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '400px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Thay đổi hình thức hóa đơn",
              msContent: "Dữ liệu sẽ bị xóa và sẽ phải nhập lại từ đầu khi bạn thay đổi hình thức hóa đơn. Bạn có chắc chắn muốn thay đổi không?",
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msOkButtonInBlueColor: true,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msOnOk: () => {
                let radioButton = document.getElementsByClassName("ant-radio-button-wrapper");
                for (let i = 0; i < radioButton.length; i++) {
                  let el = radioButton[i] as HTMLElement;
                  let nzvalue = radioButton[i].getAttribute('data-value');
                  if (event.toString() != nzvalue)
                    el.classList.remove('ant-radio-button-wrapper-checked');
                }

                for (let i = 0; i < radioButton.length; ++i) {
                  let el = radioButton[i] as HTMLElement;
                  let nzvalue = radioButton[i].getAttribute('data-value');
                  if (event.toString() == nzvalue) {
                    if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
                    el.classList.remove('switchSelectHover');
                  } else {
                    el.classList.add('switchSelectHover');
                  }
                }
                let hoaDonRaSoattFormArray = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
                hoaDonRaSoattFormArray.clear();
                hoaDonRaSoattFormArray.push(this.createChiTietHoaDonRaSoat(null));
                this.listHoaDonRaSoat = [];
                this.oldHinhThucHoaDon = event;
              },
              msOnClose: () => {
                this.displayDataTemp.HinhThucHoaDon = this.oldHinhThucHoaDon;
                return;
              }
            }
          });
          modal1.afterOpen.subscribe(() => {
            let checkedRadio = document.getElementsByClassName('switchSelectHover ant-radio-button-wrapper ant-radio-button-wrapper-checked')
            console.log(checkedRadio);
            for (let i = 0; i < checkedRadio.length; i++) {
              let el = checkedRadio[i] as HTMLElement;
              el.classList.remove('ant-radio-button-wrapper-checked');
            }
          })
        } else {
          console.log('ko sửa');
          let radioButton = document.getElementsByClassName("ant-radio-button-wrapper");
          for (let i = 0; i < radioButton.length; i++) {
            let el = radioButton[i] as HTMLElement;
            let nzvalue = radioButton[i].getAttribute('data-value');
            if (event.toString() != nzvalue)
              el.classList.remove('ant-radio-button-wrapper-checked');
          }

          for (let i = 0; i < radioButton.length; ++i) {
            let el = radioButton[i] as HTMLElement;
            let nzvalue = radioButton[i].getAttribute('data-value');
            if (event.toString() == nzvalue) {
              if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
              el.classList.remove('switchSelectHover');
            } else {
              el.classList.add('switchSelectHover');
            }
          }
          this.oldHinhThucHoaDon = event;

        }
      }

    }
  }

  //hàm này để tạo form
  createForm() {
    this.thamSoForm = this.fb.group({
      timKiemTheo: [null],
    });

    this.mainForm = this.fb.group({
      chiTietHoaDonRaSoats: this.fb.array([])
    });
  }

  //hàm này tạo các dòng dữ liệu chi tiết cho bảng hóa đơn cần rà soát
  createChiTietHoaDonRaSoat(data: any = null): FormGroup {
    console.log('zzzzzzzzzzzzzzzzzzzz');

    return this.fb.group({
      id: [data == null ? null : data.id],
      thongBaoHoaDonRaSoatId: [data == null ? null : data.thongBaoHoaDonRaSoatId],
      mauHoaDon: [data == null ? null : data.mauHoaDon],
      kyHieuHoaDon: [data == null ? '' : data.kyHieuHoaDon],
      soHoaDon: [data == null ? '' : data.soHoaDon],
      maCQTCap: [data == null ? '' : data.maCQTCap],
      ngayLapHoaDon: [data == null ? '' : data.ngayLapHoaDon],
      loaiApDungHD: [data == null ? '' : data.loaiApDungHD],
      lyDoRaSoat: [data == null ? '' : data.lyDoRaSoat, [CheckValidLyDoSaiSot]],
      phanLoaiHDSaiSot: [data == null ? null : data.phanLoaiHDSaiSot, [Validators.required]],
      lyDo: [null, [CheckValidLyDoSaiSot]]
    });
  }

  //hàm này để tích chọn 1 thông báo hóa đơn rà soát
  changeTichChonThongBao(data: any, event: any) {
    let selectedRow = this.listHoaDonRaSoat.find(x => x.selected);

    //bỏ tích tất cả các tích chọn khác nếu có
    this.listHoaDonRaSoat.forEach(item => {
      this.mapOfCheckedId[item.id] = false;
      item.daTichChon = false;
    }
    );

    //tích chọn lại thông báo cần tích chọn
    this.mapOfCheckedId[data.id] = event;

    //đánh dấu nếu đã có tích chọn
    data.daTichChon = event;

    //nếu bỏ tích chọn
    if (!event) {
      if (this.flagDaChinhSua) {
        let detailData = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
        this.listGhiNhoDongDaTuBoTichChon = { id: data.id, soThongBaoCuaCQT: data.soThongBaoCuaCQT, detail: detailData.value };
      }
    }

    //kiểm tra xem có tự bỏ tích hay ko
    if (this.listGhiNhoDongDaTuBoTichChon.id != undefined) {
      //kiểm tra xem có tích chọn sang dòng khác không
      if (this.listGhiNhoDongDaTuBoTichChon.id != data.id) {
        if (event) {
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
              msTitle: 'Bỏ chọn thông báo',
              msContent: `Dữ liệu bạn đã nhập sẽ bị xóa khi bạn bỏ tích chọn thông báo &lt;${this.listGhiNhoDongDaTuBoTichChon.soThongBaoCuaCQT}&gt;. Bạn có chắc chắn muốn bỏ tích chọn không?`,
              msOnOk: () => {
                this.listGhiNhoDongDaTuBoTichChon = {};
                this.flagDaChinhSua = false;
                this.selectedRow(data);
              },
              msOnClose: () => {
                this.mapOfCheckedId[data.id] = false;
                this.mapOfCheckedId[this.listGhiNhoDongDaTuBoTichChon.id] = false;
              }
            },
            nzFooter: null
          });
        }
      }
      else {
        if (event) {
          this.selectedRow(data);
        }
        else {
          this.tongChieuRong2CotChiTiet = 0;
        }
      }
    }
    else {
      if (selectedRow != null) {
        //kiểm tra dòng được chọn
        if (selectedRow.id != data.id) {
          if (event) {
            if (this.flagDaChinhSua) {
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
                  msTitle: 'Bỏ chọn thông báo',
                  msContent: `Dữ liệu bạn đã nhập sẽ bị xóa khi bạn bỏ tích chọn thông báo &lt;${selectedRow.soThongBaoCuaCQT}&gt;. Bạn có chắc chắn muốn bỏ tích chọn không?`,
                  msOnOk: () => {
                    this.flagDaChinhSua = false;
                    this.listGhiNhoDongDaTuBoTichChon = {};
                    this.selectedRow(data);
                  },
                  msOnClose: () => {
                    this.mapOfCheckedId[data.id] = false;
                    this.mapOfCheckedId[selectedRow.id] = true;
                  }
                },
                nzFooter: null
              });
            }
            else {
              this.selectedRow(data);
            }
          }
        }
        else {
          //nếu ở chế độ sửa thì có cảnh báo liên quan
          if (this.data != null) {
            if (event) {
              //nếu chọn đúng vào dòng đã tích thì cho hiện 2 cột chọn [hủy/thay thế....] và cột lý do
              this.tongChieuRong2CotChiTiet = 140 + 200; //140 là cột 1, 200 là cột 2
            }
            else {
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
                  msTitle: 'Bỏ chọn thông báo',
                  msContent: `Dữ liệu bạn đã nhập sẽ bị xóa khi bạn bỏ tích chọn thông báo &lt;${selectedRow.soThongBaoCuaCQT}&gt;. Bạn có chắc chắn muốn bỏ tích chọn không?`,
                  msOnOk: () => {
                    this.mapOfCheckedId[data.id] = false;
                    this.tongChieuRong2CotChiTiet = 0;
                    this.data = null; //xóa dữ liệu để cho phép tìm kiếm
                  },
                  msOnClose: () => {
                    this.mapOfCheckedId[data.id] = true;
                  }
                },
                nzFooter: null
              });
            }
          }
          else {
            if (this.mapOfCheckedId[selectedRow.id]) {
              //nếu chọn đúng vào dòng đã tích thì cho hiện 2 cột chọn [hủy/thay thế....] và cột lý do
              this.tongChieuRong2CotChiTiet = 140 + 200; //140 là cột 1, 200 là cột 2
            }
            else {
              this.tongChieuRong2CotChiTiet = 0;
            }
          }
        }
      }
    }
  }

  //hàm này để đọc ra các giá trị tìm kiếm theo đã nhập
  getDataToFind(): any {
    let dataToFind: any = {};
    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && this.displayDataTemp.GiaTri) {
      var result = {};
      var giaTris = this.displayDataTemp.GiaTri.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = (giaTris[i] != null && giaTris[i] != undefined) ? giaTris[i] : null;
      }
      dataToFind.TimKiemTheo = result;
    } else {
      dataToFind.TimKiemTheo = null;
      dataToFind.TimKiemBatKy = this.displayDataTemp.GiaTri;
    }
    dataToFind.GiaTri = this.displayDataTemp.GiaTri;

    return dataToFind;
  }

  //hàm này được dùng khi bấm nút lấy dữ liệu
  layDuLieu() {
    let invalidForm = false;
    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (this.thamSoForm.controls['timKiemTheo'].value == null || this.thamSoForm.controls['timKiemTheo'].value == '') {
        this.thamSoForm.controls['timKiemTheo'].markAsTouched();
        this.thamSoForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.thamSoForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);
        invalidForm = true;
      }
    }
    else {
      this.thamSoForm.controls['timKiemTheo'].clearValidators();
      this.thamSoForm.controls['timKiemTheo'].updateValueAndValidity();
    }

    if (invalidForm) {
      return;
    }

    //xóa các bộ lọc đi
    if (this.displayDataTemp.filterColumns != null) {
      this.displayDataTemp.filterColumns.forEach(item => {
        let thamSo = { key: item.colKey };
        this.removeFilter(thamSo, false);
      });
    }

    //tải lại dữ liệu
    this.loadDSHoaDonRaSoat();
  }

  //hàm này đọc ra danh sách hóa đơn rà sót
  loadDSHoaDonRaSoat() {
    this.loading = true;
    let timKiemTheos = this.getDataToFind();

    let thamSoTimKiem = {};
    this.listGhiNhoDongDaTuBoTichChon = {};
    this.flagDaChinhSua = false;

    if (this.data != null) {
      thamSoTimKiem = {
        thongBaoHoaDonRaSoatId: this.data.id
      };
    }
    else {
      thamSoTimKiem = {
        fromDate: this.displayDataTemp.fromDate,
        toDate: this.displayDataTemp.toDate,
        sortKey: this.displayDataTemp.SortKey,
        sortValue: this.displayDataTemp.SortValue,
        filterColumns: this.displayDataTemp.filterColumns,
        timKiemTheo: timKiemTheos.TimKiemTheo,
        timKiemBatKy: timKiemTheos.TimKiemBatKy,
        hinhThucHoaDon: this.displayDataTemp.HinhThucHoaDon,
        loaiSaiSot: this.loaiSaiSot
      };
    }

    this.thongDiepGuiCQTService.GetListHoaDonRaSoat(thamSoTimKiem).subscribe((res: any) => {
      let chiTietHoaDonRaSoats = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
      chiTietHoaDonRaSoats.clear(); //xóa các dòng chi tiết

      this.listHoaDonRaSoat = res;
      this.tongChieuRong2CotChiTiet = 0; //reset
      this.mapOfCheckedId = {} //reset


      //mặc định chọn dòng đầu tiên
      if (this.listHoaDonRaSoat.length > 0) {
        this.selectedRow(this.listHoaDonRaSoat[0]);
      }

      //kiểm tra xem ngày thông báo có hợp lệ
      this.listHoaDonRaSoat.forEach(item => {
        if (moment(moment(item.ngayThongBao).format('YYYY-MM-DD')) > moment(this.ngayLapThongBao)) {
          item.errorNgayThongBao = true;
        }
        else {
          item.errorNgayThongBao = false;
        }

        //nếu là sửa thì kiểm tra để đổi màu dòng tích chọn
        if (this.data != null) {
          item.daTichChon = true;
        }
      });

      this.loading = false;
    });

  }

  //hàm này để lưu dữ liệu sang modal thông báo hóa đơn sai sót
  submitForm() {
    if (this.tongChieuRong2CotChiTiet == 0) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '380px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: "Bạn chưa chọn thông báo về việc hóa đơn điện tử cần rà soát. Vui lòng kiểm tra lại!",
        },
        nzFooter: null
      });
    }
    else {
      for (const i in this.mainForm.get('chiTietHoaDonRaSoats').value) {
        if (this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value == null || this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value.length > 255 || this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value.length == 0
          || this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).value == null) {
          this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).markAsTouched();
          this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).updateValueAndValidity();
          if (this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).value == null) {
            this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).markAsTouched();
            this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).updateValueAndValidity();
            return;
          } else {
            this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).markAsTouched();
            this.mainForm.get(`chiTietHoaDonRaSoats.${i}.phanLoaiHDSaiSot`).updateValueAndValidity();
          }
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '380px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value.length > 255 ? `&lt;Lý do&gt; không được quá 255 ký tự` : ((this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value.length == 0 || this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value == null) ? `&lt;Lý do&gt; không được để trống` : (this.mainForm.get(`chiTietHoaDonRaSoats.${i}.lyDo`).value == null ? `&lt;Hủy/ Giải trình&gt; không được để trống` : '')),
            },
            nzFooter: null
          });
          return;
        }

      }
      let selectedRow = this.listHoaDonRaSoat.find(x => x.selected);
      let chiTietHoaDonRaSoats = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
      console.log('chiTietHoaDonRaSoats:', chiTietHoaDonRaSoats);

      let responsedData = {
        id: (selectedRow != null) ? selectedRow.id : null,
        soThongBaoCuaCQT: (selectedRow != null) ? selectedRow.soThongBaoCuaCQT : null,
        ngayThongBao: (selectedRow != null) ? selectedRow.ngayThongBao : null,
        detail: chiTietHoaDonRaSoats.value
      }
      this.modal.destroy(responsedData);
    }
  }

  //hàm này để click chọn 1 dòng <tr>
  selectedRow(data: any) {
    //nếu ở chế độ sửa thì chỉ hiển thị 1 dòng dữ liệu sửa đó
    if (this.data != null) {
      this.mapOfCheckedId[this.data.id] = true;
      data.selected = true;

      //cho hiện 2 cột chọn [hủy/thay thế....] và cột lý do
      this.tongChieuRong2CotChiTiet = 140 + 200; //140 là cột 1, 200 là cột 2

      let chiTietHoaDonRaSoats = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
      chiTietHoaDonRaSoats.clear();

      this.data.detail.forEach(item => {
        chiTietHoaDonRaSoats.push(this.createChiTietHoaDonRaSoat(item));
      });
      return;
    }

    if (this.tongChieuRong2CotChiTiet > 0) {
      if (!this.mapOfCheckedId[data.id]) {
        return; //nếu bấm vào dòng khác dòng hiện tại thì return (ko cho chọn khi đã tích rồi)
      }
    }

    this.tongChieuRong2CotChiTiet = 0; //reset biến
    data.selected = true;
    this.listHoaDonRaSoat.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });

    if (this.mapOfCheckedId[data.id]) {
      //nếu chọn đúng vào dòng đã tích thì cho hiện 2 cột chọn [hủy/thay thế....] và cột lý do
      this.tongChieuRong2CotChiTiet = 140 + 200; //140 là cột 1, 200 là cột 2
    }

    //hiển thị dữ liệu chi tiết
    this.totalRecords = 0;
    this.loadingChiTiet = true;

    this.thongDiepGuiCQTService.GetListChiTietHoaDonRaSoat(data.id).subscribe((res: any) => {
      let chiTietHoaDonRaSoats = this.mainForm.get('chiTietHoaDonRaSoats') as FormArray;
      chiTietHoaDonRaSoats.clear();

      if (res.result) {
        res.result.forEach(item => {
          //điều kiện if để tránh bị thêm 2 dòng giống nhau do lúc tích chọn có gọi đến hàm selectedRow
          if (chiTietHoaDonRaSoats.value.find(x => x.id == item.id) == null) {
            //hiển thị dữ liệu đã nhập trong ghi nhớ
            if (this.listGhiNhoDongDaTuBoTichChon.detail != undefined) {
              let itemGhiNho = this.listGhiNhoDongDaTuBoTichChon.detail.find(x => x.id == item.id);
              if (itemGhiNho != null) {
                item.phanLoaiHDSaiSot = itemGhiNho.phanLoaiHDSaiSot;
                item.lyDo = itemGhiNho.lyDo;
              }
            }
            chiTietHoaDonRaSoats.push(this.createChiTietHoaDonRaSoat(item));
          }
        });
      }
      this.loadingChiTiet = false;
    });
  }

  //hàm này để sắp xếp dữ liệu
  sort(sort: { key: string; value: string }): void {
    this.displayDataTemp.SortKey = sort.key;
    this.displayDataTemp.SortValue = sort.value;
    this.loadDSHoaDonRaSoat();
  }

  changeKy(event: any) {
    SetDate(event, this.displayDataTemp);
  }

  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }


  closeModal() {
    if (this.mainForm.dirty) {
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
    }
    else {
      this.modal.destroy(null);
    }
  }

  //hàm này để mở filter trên cột
  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfStatusFilteredCols[colName] = event;
    let inputFilterColData = this.displayDataTemp.filterColumns.find(x => x.colKey === colName);
    if (inputFilterColData == null) {
      let inputFilterColDataParam: any = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua
      };
      if (template) {
        (template as FilterColumnComponent).inputData(inputFilterColDataParam);
      }
    }
    else {
      if (inputFilterColData.filterCondition == null) inputFilterColData.filterCondition = FilterCondition.Chua;
      if (inputFilterColData.colValue == null) inputFilterColData.colValue = null;

      let inputFilterColDataParam: any = {
        colKey: colName,
        colValue: inputFilterColData.colValue,
        filterCondition: inputFilterColData.filterCondition
      };
      if (template) {
        (template as FilterColumnComponent).inputData(inputFilterColDataParam);
      }
    }
  }

  //hàm này để gửi giá trị đã filter vào database
  onFilterCol(rs: any, taiLaiDSHoaDonRaSoat = true) {
    this.mapOfStatusFilteredCols[rs.colKey] = false;
    let inputFilterColData = this.displayDataTemp.filterColumns.find(x => x.colKey === rs.colKey);
    if (inputFilterColData == null) {
      let inputFilterColValue = {
        colKey: rs.colKey,
        colValue: rs.colValue,
        filterCondition: rs.filterCondition,
        isFilter: rs.status
      };
      this.displayDataTemp.filterColumns.push(inputFilterColValue);
    }
    else {
      inputFilterColData.isFilter = rs.status;
      inputFilterColData.colValue = rs.colValue;
      inputFilterColData.filterCondition = rs.filterCondition;
    }

    this.mapOfStatusFilteredCols[rs.colKey + '_marked'] = rs.status; //đánh dấu (tô màu xanh) cột đã có lọc

    //hiển thị lọc lên giao diện
    this.viewConditionList = [];
    for (let i = 0; i < this.displayDataTemp.filterColumns.length; i++) {
      let item = this.displayDataTemp.filterColumns[i];
      if (item.isFilter) {
        let labelHienThi = '';
        if (item.colKey === 'soThongBaoCuaCQT') labelHienThi = 'Số thông báo của CQT: ';
        else if (item.colKey === 'tenCQTCapTren') labelHienThi = 'Tên CQT cấp trên: ';
        else if (item.colKey === 'tenCQTRaThongBao') labelHienThi = 'Tên CQT ra thông báo: ';
        else if (item.colKey === 'tenNguoiNopThue') labelHienThi = 'Tên người nộp thuế: ';
        else if (item.colKey === 'maSoThue') labelHienThi = 'Mã số thuế: ';

        this.viewConditionList.push({ key: item.colKey, label: labelHienThi, value: item.colValue });
      }
    }

    //nếu truyền vào taiLaiDSHoaDonRaSoat = true thì mới tải lại danh sách hóa đơn rà soát
    if (taiLaiDSHoaDonRaSoat) {
      this.loadDSHoaDonRaSoat();
    }
  }

  //hàm này để xóa giá trị lọc đang hiển thị
  removeFilter(filter: any, taiLaiDSHoaDonRaSoat = true) {
    let inputFilterColValue = {
      colKey: filter.key,
      colValue: null,
      filterCondition: FilterCondition.Chua,
      isFilter: false,
      status: false
    };
    this.onFilterCol(inputFilterColValue, taiLaiDSHoaDonRaSoat);
  }

  //hàm này sẽ trả về tên file theo phân loại loaiFileTraVe
  phanTachTenFile(tenFile: string, loaiFileTraVe: string) {
    if (tenFile == null || tenFile == '') return '';
    let tenFiles = tenFile.split(';');
    let fileKetQua = '';
    for (let i = 0; i < tenFiles.length; i++) {
      let item = tenFiles[i];
      if (item.lastIndexOf(loaiFileTraVe) >= 0) {
        fileKetQua = item;
        break;
      }
    }
    return fileKetQua;
  }

  //hàm này để tải file xml
  downloadFileXML(data: any) {
    if (data.fileDinhKem != null && data.fileDinhKem != '') {
      let fileTaiVe = this.phanTachTenFile(data.fileDinhKem, 'xml');

      //url của file tải về
      let URLFileTaiVe = this.env.apiUrl + '/' + data.fileUploadPath + '/xml/signed/' + fileTaiVe;

      this.thongDiepGuiCQTService.DownloadFile(URLFileTaiVe).subscribe(blob => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'thongBaoHoaDonRaSoat.xml';
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
    }
  }

  //hàm này để mở xem file thể hiện
  openPdfViewer(data: any) {
    if (data.fileDinhKem != null && data.fileDinhKem != '') {
      let filePdf = this.phanTachTenFile(data.fileDinhKem, 'pdf');
      if (filePdf == '') return; //nếu ko có file pdf thì ko mở xem pdf

      this.modalService.create({
        nzTitle: 'Xem thông báo hóa đơn rà soát',
        nzContent: XemMauHoaDonRaSoatModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 1000,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '5px' },
        nzComponentParams: {
          fileUploadPath: data.fileUploadPath,
          fileNames: data.fileDinhKem
        },
        nzFooter: null
      });
    }
  }

  //hàm này để đánh dấu là đã nhập nội dung vào form
  daSuaNhapNoiDung() {
    this.flagDaChinhSua = true;
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase().replace('cqt', 'CQT'));
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  setDefaulThoiGian() {
    let setting = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (setting == 'Quy') {
      SetDate(6, this.displayDataTemp);
      this.displayDataTemp.Ky = 6;
    }
    else if (setting == 'Thang') {
      SetDate(4, this.displayDataTemp);
      this.displayDataTemp.Ky = 4;
    }
  }

  //hàm này được dùng khi nhập giá trị vào ô tìm kiếm theo
  changeTimKiemTheo() {
    let timKiemTheo = this.thamSoForm.get('timKiemTheo').value;
    this.displayDataTemp.GiaTri = timKiemTheo;

    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (this.thamSoForm.controls['timKiemTheo'].value == null || this.thamSoForm.controls['timKiemTheo'].value == '') {
        this.thamSoForm.controls['timKiemTheo'].markAsTouched();
        this.thamSoForm.controls['timKiemTheo'].setValidators([Validators.required]);
        this.thamSoForm.controls['timKiemTheo'].updateValueAndValidity();
        setStyleTooltipError(true);
      }
    }
    else {
      this.thamSoForm.controls['timKiemTheo'].clearValidators();
      this.thamSoForm.controls['timKiemTheo'].updateValueAndValidity();
    }
  }
}
