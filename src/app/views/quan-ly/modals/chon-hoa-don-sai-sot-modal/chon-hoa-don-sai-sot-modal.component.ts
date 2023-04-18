import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, AfterViewInit, AfterContentInit, DoCheck, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GetList, SetDate, GetKy } from 'src/app/shared/chon-ky';
import { HoaDonParams, FilterCondition, FilterColumn } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import * as moment from 'moment';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CookieConstant } from 'src/app/constants/constant';
import { setStyleTooltipError, getMoTaLoaiHoaDons, getTitleTheoLoaiHoaDon, getListKyTuThu4, getLoaiHoaDons, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { CheckValidMauHoaDon_HoaDonChiTiet } from 'src/app/customValidators/check-valid-mauhoadon.validator';
import { CheckValidKyHieu_HoaDonChiTiet } from 'src/app/customValidators/check-valid-kyhieu.validator';
import { CheckValidLyDoSaiSot, CheckValidMaCQTCapChuoiKyTuSo, CheckValidMaCQTCapSaiSot } from 'src/app/customValidators/check-common-valid.validator';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { TrangThaiSuDungDescription } from 'src/app/enums/TrangThaiSuDung.enum';
import { forEach } from 'jszip';
import { forkJoin } from 'rxjs';
import { isBuffer } from 'util';
import { ɵangular_packages_platform_browser_platform_browser_h } from '@angular/platform-browser';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';

@Component({
  selector: 'app-chon-hoa-don-sai-sot',
  templateUrl: './chon-hoa-don-sai-sot-modal.component.html',
  styleUrls: ['./chon-hoa-don-sai-sot-modal.component.scss']
})
export class ChonHoaDonSaiSotModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any = null;
  @Input() ngayLapThongBao: string = '';
  @Input() isTBaoHuyGiaiTrinhKhacCuaNNT = false;
  @Input() lapTuHoaDonDienTuId: string = ''; //nếu lập thông báo 04 từ hóa đơn id
  @Input() hoaDonDienTuIdLienQuan: string = ''; //đây là id của hóa đơn liên quan (như điều chỉnh, sai thông tin)
  //trường hoaDonDienTuIdLienQuan này để tìm kiếm đúng bản ghi cần lập sai sót khi có nhiều dòng sai sót
  @Input() isXemChiTiet = false; //nếu là xem chi tiết
  @Input() fbEnableEdit: boolean = false;
  mainForm: FormGroup;
  mainFormKhac: FormGroup;
  mainForm2: FormGroup;
  mainForm3: FormGroup;
  mainForm4: FormGroup;
  mainForm5: FormGroup;
  thamSoForm: FormGroup;
  spinning = false;
  listDaTichChonHoaDonSaiSot: any = [];
  kys: any[] = GetList();
  displayDataTemp: HoaDonParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    Ky: 5,
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    filterColumns: []
  };
  loading = false;
  loading2 = false;
  loading3 = false;
  loading4 = false;
  loading5 = false;
  loaiHoaDon = '';
  kyHieuHoaDon = '';
  searchCustomOverlayStyle = {
    width: '430px'
  };
  customOverlayStyle = {
    width: '600px'
  };
  totalRecords = 0; //tổng số dòng đối với loại áp dụng 1
  totalRecords234 = 10000; //tổng số dòng đối với loại áp dụng 2,3,4
  indexSelectedRow2 = -1; //index của dòng được chọn với loại 2
  indexSelectedRow3 = -1; //index của dòng được chọn với loại 3
  indexSelectedRow4 = -1; //index của dòng được chọn với loại 4
  checkedSuDungLoai = true; //các checkedSuDungLoai là được dùng để kiểm tra xem đã tích chọn từng mục chưa
  checkedSuDungLoai2 = false;
  checkedSuDungLoai3 = false;
  checkedSuDungLoai4 = false;
  truongDuLieuHoaDons: any[] = [];
  tenFilterMaCQTCap = 'Mã CQT cấp';
  tenFilterChungTuHoaDonLienQuan = 'Chứng từ/hóa đơn liên quan'
  tenFilterSoHoaDon = 'Số hóa đơn điện tử'
  mapOfStatusFilteredCols: any = {};
  noiDungDongDaTichChon = '';
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  listKyHieuHoaDon: any[] = [];
  listKyHieuHoaDonChecked: string[] = [];
  listKyHieuHoaDonTextChecked: string[] = [];
  invalidMessageNgayLapHoaDon = '';
  listLoaiHoaDon: any[] = [];
  listLoaiHoaDonChecked: any[] = [];
  listLoaiHoaDonTextChecked: string[] = [];
  listHinhThucHoaDon: any[] = [];
  listTrangThaiGuiHoaDon: any[] = [];
  listLoaiApDungHoaDon: any[] = [];
  modalInClosing: NzModalRef;
  listLoaiSaiSot: any[] = [
    { value: -1, text: 'Tất cả' },
    { value: 2, text: 'Hủy' },
    { value: 0, text: 'Giải trình' }
  ];
  timKiemTheos = [
    { value: 'MauHoaDon', name: 'Ký hiệu mẫu số hóa đơn', checked: false },
    { value: 'KyHieuHoaDon', name: 'Ký hiệu hóa đơn', checked: false },
    { value: 'SoHoaDon', name: 'Số hóa đơn', checked: false },
    { value: 'NgayLapHoaDon', name: 'Ngày lập hóa đơn', checked: false },
  ];
  getTitleLoaiHoaDon = getTitleTheoLoaiHoaDon;
  tatCaPhanLoaiHDChecked = false;
  hinhThucHoaDon = 1;
  trangThaiGuiHoaDon = 0;

  loaiApDungHoaDonKhac = '1';
  hinhThucHoaDonKhac: any = '1';
  maCQTToKhaiChapNhan: string = null;

  chuCais = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  list_KyHieuHoaDon_2KyTuDau_DatIn: any[];

  list_KyHieuHoaDon_2KyTuDau: Array<string> = [];
  list_KyHieuHoaDon_2SoCuoiNamThongBao: Array<string> = [];
  list_MauSoHoaDon_SoLienHoaDon: Array<number> = [];
  list_MauSoHoaDon_SoThuTuMau: Array<string> = [];
  list_LoaiHoaDonGoc: any[] = [
    { value: '01GTKT', name: 'Hóa đơn GTGT' },
    { value: '02GTTT', name: 'Hóa đơn bán hàng' },
    { value: '06HDXK', name: 'Hóa đơn xuất khẩu' },
    { value: '07KPTQ', name: 'Hóa đơn bán hàng (dành cho tổ chức, cá nhân trong khu phi thuế quan)' },
    { value: '03XKNB', name: 'Phiếu xuất kho kiêm vận chuyển hàng hóa nội bộ' },
    { value: '04HGDL', name: 'Phiếu xuất kho gửi bán hàng đại lý' }
  ];
  list_LoaiHoaDon: any[] = this.list_LoaiHoaDonGoc; //biến list_LoaiHoaDon này để lọc tùy chỉnh

  loaiHoaDons: any[] = [];
  loaiHoaDonsAll: any[] = getLoaiHoaDons();
  kyHieuThu4s = getListKyTuThu4();
  kyHieuThu4sSearch = getListKyTuThu4();
  kyHieu1s = ['C', 'K'];
  kyHieu23s: any[] = [];
  kyHieu56s: Array<string> = [];
  namHienTai = moment().format('YY');
  oldLoaiApDungHoaDonKhac: string;
  oldHinhThucHoaDonKhac: string;
  checked = false;
  hinhThucHoaDonDangSuDungs: any[] = [];
  hinhThucHoaDons: any[]=[];
  maxMaCQT: string = '';

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private cdr: ChangeDetectorRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private hoSoHDDTService: HoSoHDDTService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService
  ) {
  }

  @HostListener('window:load', ['$event'])
  onPageLoad(event: Event) {
    console.log('loaded', event);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    if (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true && this.checked == false) {
      let radioButton = document.getElementsByClassName("loaiApDungHoaDon ant-radio-button-wrapper");
      var nameArray = Array.prototype.slice.call(radioButton);
      console.log(nameArray.length);
      for (let i = 0; i < radioButton.length; i++) {
        let el = radioButton[i] as HTMLElement;
        let nzvalue = radioButton[i].getAttribute('data-value');
        if (this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value != nzvalue)
          el.classList.remove('ant-radio-button-wrapper-checked');
      }

      for (let i = 0; i < radioButton.length; ++i) {
        let el = radioButton[i] as HTMLElement;
        let nzvalue = radioButton[i].getAttribute('data-value');
        if (this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value == nzvalue) {
          if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
          el.classList.remove('switchSelectHover');
        } else {
          el.classList.add('switchSelectHover');
        }
      }

      let radioButton1 = document.getElementsByClassName("hinhThucHoaDon ant-radio-button-wrapper");
      var nameArray = Array.prototype.slice.call(radioButton1);
      console.log(nameArray.length);
      for (let i = 0; i < radioButton1.length; i++) {
        let el = radioButton1[i] as HTMLElement;
        let nzvalue = radioButton1[i].getAttribute('data-value');
        if (this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value != nzvalue)
          el.classList.remove('ant-radio-button-wrapper-checked');
      }

      for (let i = 0; i < radioButton1.length; ++i) {
        let el = radioButton1[i] as HTMLElement;
        let nzvalue = radioButton1[i].getAttribute('data-value');
        if (this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value == nzvalue) {
          if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
          el.classList.remove('switchSelectHover');
        } else {
          el.classList.add('switchSelectHover');
        }
      }

      this.checked = true;
    }
    else if (!this.isTBaoHuyGiaiTrinhKhacCuaNNT && this.checked == false) {
      let radioButton = document.getElementsByClassName("ant-radio-button-wrapper");
      for (let i = 0; i < radioButton.length; i++) {
        let el = radioButton[i] as HTMLElement;
        let nzvalue = radioButton[i].getAttribute('data-value');
        if (this.thamSoForm.get('hinhThucHoaDon').value != nzvalue)
          el.classList.remove('ant-radio-button-wrapper-checked');
      }

      for (let i = 0; i < radioButton.length; ++i) {
        let el = radioButton[i] as HTMLElement;
        let nzvalue = radioButton[i].getAttribute('data-value');
        if (this.thamSoForm.get('hinhThucHoaDon').value == nzvalue) {
          if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
          el.classList.remove('switchSelectHover');
        } else {
          el.classList.add('switchSelectHover');
        }
      }

      this.checked = true;
    }
  }

  ngOnInit() {
    this.spinning = true;
    if (this.ngayLapThongBao != '') {
      this.invalidMessageNgayLapHoaDon = '<Ngày lập hóa đơn> không được lớn hơn ngày lập thông báo <' + moment(this.ngayLapThongBao).format('DD/MM/YYYY') + '>';
    }
    // this.quyDinhKyThuatService.GetThongDiepThemMoiToKhaiDuocChapNhan().subscribe((td: any) => {
    //   this.quyDinhKyThuatService.GetToKhaiById(td.idThamChieu).subscribe((tk: any) => {
    //     if (tk) {
    //       this.hinhThucHoaDon = tk.toKhaiKhongUyNhiem.dltKhai.ndtKhai.hthDon.kcMa == 1 ? 0 : 1;
    //       this.createListHinhThucHoaDon(this.hinhThucHoaDon);
    //     }
    //   });
    // });

    for (let i = 0; i < this.chuCais.length; i++) {
      for (let j = 0; j < this.chuCais.length; j++) {
        var item1 = this.chuCais[i];
        var item2 = this.chuCais[j];
        this.kyHieu56s.push(item1 + item2);
      }
    }

    let limit = Number.parseInt(moment().format("YY"));
    for (let i = 22; i <= limit; i++) {
      this.kyHieu23s.push(i + '');
    }

    //add 2 ký tự đầu
    for (let i = 0; i < this.chuCais.length; i++) {
      for (let j = 0; j < this.chuCais.length; j++) {
        var item1 = this.chuCais[i];
        var item2 = this.chuCais[j];
        this.list_KyHieuHoaDon_2KyTuDau.push(item1 + item2);
      }
    }

    //add 2 số cuối năm thông báo từ 0-99
    for (let i = 0; i < 100; i++) {
      this.list_KyHieuHoaDon_2SoCuoiNamThongBao.push(String(i).padStart(2, '0'));
    }

    //add số liên hóa đơn (ban đầu để là 0 vì có tích chọn <điện tử>)
    for (let i = 0; i <= 9; i++) {
      this.list_MauSoHoaDon_SoLienHoaDon.push(i);
    }

    //add số thứ tự mẫu từ 001 đến 999
    for (let i = 1; i <= 999; i++) {
      this.list_MauSoHoaDon_SoThuTuMau.push(String(i).padStart(3, '0'));
    }

    this.setDefaulThoiGian();
    this.createForm();

    // if (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true) {
    //   //nếu dữ liệu là của trường hợp gửi của NNT khác và chọn hinh thức hủy/giải trình
    //   //thì return
    //   this.fillDataToForms();
    // }
  }

  GetMaCQTCap(index) {
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    console.log(hoaDonSaiSotFormArray);
    const maCQT = hoaDonSaiSotFormArray.controls[index].get('maCQT12').value + '-' + hoaDonSaiSotFormArray.controls[index].get('maCQT45').value + '-' + hoaDonSaiSotFormArray.controls[index].get('maCQTToKhaiChapNhan').value + '-' + hoaDonSaiSotFormArray.controls[index].get('maCQTChuoiKyTuSo').value;
    hoaDonSaiSotFormArray.controls[index].get('maCQTCap').setValue(maCQT);
  }

  GetDanhSachDiaDanh() {
    this.thongDiepGuiCQTService.GetDanhSachDiaDanh().subscribe((rs: any) => {
      this.list_KyHieuHoaDon_2KyTuDau_DatIn = rs;
    })
  }

  //hàm này đọc ra danh sách loại áp dụng hóa đơn
  getListLoaiApDungHoaDon() {
    if (this.isTBaoHuyGiaiTrinhKhacCuaNNT == false) return;

    this.hoaDonDienTuService.GetListHinhThucHoaDonCanThayThe().subscribe((res: any) => {
      this.listLoaiApDungHoaDon = res;
    });
  }

  GetMaCQTToKhaiChapNhan() {
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.maCQTToKhaiChapNhan = rs.maCuaCQTToKhaiChapNhan
    })
  }

  GetLoaiHoaDonDangSuDung() {
    this.quanLyThongTinHoaDonService.GetLoaiHoaDonDangSuDung().subscribe((rs: any[]) => {
      console.log(rs);
      this.loaiHoaDons = this.loaiHoaDonsAll.filter(x => rs.indexOf(x.key) > -1);
      this.loaiHoaDonsAll = this.loaiHoaDons;
    })
  }

  forkJoin() {
    return forkJoin([
      this.quanLyThongTinHoaDonService.GetLoaiHoaDonDangSuDung(),
      this.hoSoHDDTService.GetDetail(),
      this.thongDiepGuiCQTService.GetDanhSachDiaDanh(),
      this.hoaDonDienTuService.GetListHinhThucHoaDonCanThayThe(),
      this.quanLyThongTinHoaDonService.GetHinhThucHoaDonDangSuDung(),
      this.quanLyThongTinHoaDonService.GetSoCuoiMaxMaCQTCapMTTAsync(moment().year())
    ]);
  }

  //hàm này để tạo hình thức hóa đơn
  createListHinhThucHoaDon(hinhthuc) {
    this.listHinhThucHoaDon = [];
    this.listHinhThucHoaDon.push({ value: 1, text: 'Có mã của cơ quan thuế' });
    this.listHinhThucHoaDon.push({ value: 2, text: 'Có mã từ máy tính tiền' });
    this.listHinhThucHoaDon.push({ value: 0, text: 'Không có mã của cơ quan thuế' });
    this.thamSoForm.get('hinhThucHoaDon').setValue(hinhthuc);
    this.changeHinhThucHoaDon(hinhthuc);
  }

  //hàm này để tạo trạng thái gửi hóa đơn
  createListTrangThaiGuiHoaDon() {
    this.listTrangThaiGuiHoaDon = [];
    this.listTrangThaiGuiHoaDon.push({ value: 0, text: 'Chưa gửi cho khách hàng' });
    this.listTrangThaiGuiHoaDon.push({ value: 3, text: 'Đã gửi cho khách hàng' });
  }
  //hàm này để tạo form
  createForm() {
    this.forkJoin().subscribe((rs: any[]) => {
      console.log(rs);
      let values = rs[0].map(x => x.value);
      if (!this.isXemChiTiet) {
        this.loaiHoaDons = getLoaiHoaDons().filter(x => values.indexOf(x.key) > -1);
        this.loaiHoaDonsAll = getLoaiHoaDons().filter(x => values.indexOf(x.key) > -1);
      }

      this.hinhThucHoaDonDangSuDungs = rs[4].map(x => x.value);
      this.hinhThucHoaDons = rs[4];
      this.maxMaCQT = this.padLeft((rs[5] + 1) + '', 11);

      if(this.hinhThucHoaDons.length == 0){
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
            msOkButtonInBlueColor: true,
            msTitle: this.isTBaoHuyGiaiTrinhKhacCuaNNT ? 'Nhập thông tin hóa đơn sai sót' : 'Chọn hóa đơn sai sót',
            msContent: `<div>Không thể chọn/nhập thông tin hóa đơn do không có hình thức hóa đơn nào có trạng thái khác <b>Không sử dụng</b>. Vui lòng kiểm tra lại!</div>`,
            msOnClose: () => { this.modal.destroy(); }
          },
          nzFooter: null
        });

        return;
      }

      if(this.hinhThucHoaDonDangSuDungs[0] == 1){
        this.hinhThucHoaDon = 1;
      }
      else if(this.hinhThucHoaDonDangSuDungs[0] == 2){
        this.hinhThucHoaDon = 0;
      }
      else this.hinhThucHoaDon = 2;
      
      this.maCQTToKhaiChapNhan = rs[1].maCuaCQTToKhaiChapNhan;
      this.list_KyHieuHoaDon_2KyTuDau_DatIn = rs[2];
      this.listLoaiApDungHoaDon = rs[3];

      this.thamSoForm = this.fb.group({
        loaiSaiSot: [-1, [Validators.required]],
        hinhThucHoaDon: this.hinhThucHoaDon,
        trangThaiGuiHoaDon: this.trangThaiGuiHoaDon,
        timKiemTheo: [null],
        hinhThucTBaoHuyGiaiTrinhKhac: [(this.data != null) ?
          ((this.data.hinhThucTBaoHuyGiaiTrinhKhac != null && this.data.hinhThucTBaoHuyGiaiTrinhKhac != undefined) ?
            this.data.hinhThucTBaoHuyGiaiTrinhKhac.toString() : '1') : '1'],
        loaiApDungHoaDonKhac: [this.isTBaoHuyGiaiTrinhKhacCuaNNT == false ? null : (this.data ? this.data[0].loaiApDungHoaDon : '1')],
        loaiApDungHoaDonKhacHienThi: [this.isTBaoHuyGiaiTrinhKhacCuaNNT == false ? null : (this.data ? this.data[0].loaiApDungHoaDon : '1')],
        hinhThucHoaDonKhac: [this.isTBaoHuyGiaiTrinhKhacCuaNNT == false ? null : (this.data ? this.data[0].hinhThucHoaDon : (this.hinhThucHoaDonDangSuDungs.indexOf(1) > -1 ? '1' : this.hinhThucHoaDonDangSuDungs.indexOf(2) ? '0' : '2'))],
        hinhThucHoaDonKhacHienThi: [this.isTBaoHuyGiaiTrinhKhacCuaNNT == false ? null : (this.data ? this.data[0].hinhThucHoaDon : (this.hinhThucHoaDonDangSuDungs.indexOf(1) > -1 ? '1' : this.hinhThucHoaDonDangSuDungs.indexOf(2) ? '0' : '2'))],
      });

      this.mainForm = this.fb.group({
        id: [null],
        tichChonTatCa: [false],
        tichChonTatCaPhanLoaiHD: [false],
        hoaDonSaiSots: this.fb.array([])
      });

      this.mainFormKhac = this.fb.group({
        id: [null],
        tichChonTatCa: [false],
        tichChonTatCaPhanLoaiHD: [false],
        hoaDonSaiSots: this.fb.array([])
      });

      if (this.data != null) {
        if (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true) {
          //nếu dữ liệu là của trường hợp gửi của NNT khác và chọn hinh thức hủy/giải trình
          //thì return
          this.fillDataToForms();
        }
        else {
          //nếu có danh sách hoá đơn đã chọn truyền vào form thì ko cần kiểm tra bắt buộc nhập
          this.loadDSHoaDonSaiSot(false);
        }
      }
      else {
        if (this.lapTuHoaDonDienTuId != '') {
          //load hd by id
          this.hoaDonDienTuService.GetById(this.lapTuHoaDonDienTuId).subscribe((rs: any) => {
            if (rs) {
              console.log(rs);
              this.hinhThucHoaDon = rs.hinhThucHoaDon;
              rs.maCQTCap = rs.maCuaCQT;
              this.trangThaiGuiHoaDon = rs.trangThaiGuiHoaDon == 3 ? rs.trangThaiGuiHoaDon : 0;
              console.log(this.trangThaiGuiHoaDon);
              this.thamSoForm.get('hinhThucHoaDon').setValue(rs.boKyHieuHoaDon.hinhThucHoaDon);
              // this.thamSoForm.get('trangThaiGuiHoaDon').setValue(this.trangThaiGuiHoaDon);
              this.thamSoForm.get('loaiSaiSot').setValue(-1);
              //nếu lập từ hóa đơn điện tử id
              this.loadDSHoaDonSaiSot(false);
            }
          })

        }

        if (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true) {
          this.thamSoForm.get('loaiApDungHoaDonKhac').setValue('1');
          this.changeLoaiApDungHoaDon(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value);
          this.changeHinhThucHoaDonKhac(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value);
        }
        else {
          this.changeHinhThucHoaDon('1');

        }
        this.spinning = false;
        this.checked = false;

      }
    });
  }

  isNgungSuDung(key: number){
    return this.hinhThucHoaDons.find(x=>x.value == key).trangThai == 3;
  }

  //hàm này để điền giá trị cũ vào form
  fillDataToForms() {
    //điền vào form 5
    console.log(this.data);

    this.changeLoaiApDungHoaDon(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value, this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value);
    let mainFormKhac = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    mainFormKhac.clear();
    this.data.forEach(item => {
      let chiTietArray = this.createChiTietHoaDonSaiSot(item);
      if (this.isXemChiTiet) chiTietArray.disable();
      mainFormKhac.push(chiTietArray);
      this.totalRecords = mainFormKhac.length;
    });

    this.spinning = false;
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

  //hàm này được dùng khi bấm nút lấy dữ liệu
  layDuLieu() {
    //xóa các bộ lọc đi
    if (this.displayDataTemp.filterColumns != null) {
      this.displayDataTemp.filterColumns.forEach(item => {
        let thamSo = { key: item.colKey };
        this.removeFilter(thamSo, false);
      });
    }

    //tải lại dữ liệu
    this.loadDSHoaDonSaiSot();
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

  //hàm này đọc ra danh sách hóa đơn sai sót
  loadDSHoaDonSaiSot(coKiemTraDuLieuNhap = true) {
    this.noiDungDongDaTichChon = ''; //xóa đã tích chọn trước đó
    this.mainForm.get('tichChonTatCa').setValue(false);

    //nếu là xem chi tiết khi đã ký và gửi CQT rồi
    if (this.isXemChiTiet && this.data != null) {
      this.loading = true;

      if (this.data.length > 0) {
        this.totalRecords = this.data.length;
        let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
        hoaDonSaiSotFormArray.clear();

        //thêm dòng dữ liệu hiển thị vào bảng
        this.data.forEach(item => {
          //kiểm tra để tích chọn/ko tích chọn checkbox hủy/điều chỉnh/thay thế/giải trình
          if (item.phanLoaiHDSaiSotMacDinh != null) {
            if (item.phanLoaiHDSaiSot != item.phanLoaiHDSaiSotMacDinh) {
              item.tichChonPhanLoaiHD = false;
            }
            else {
              item.tichChonPhanLoaiHD = true;
            }
          }
          else {
            item.tichChonPhanLoaiHD = true;
          }

          hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
        });

        this.data = [];//sau khi đã điền dữ liệu thì xóa đi để ko bị thêm lại

        //tích chọn tất cả phân loại hóa đơn
        let listTichChonPhanLoaiHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChonPhanLoaiHD);
        this.tatCaPhanLoaiHDChecked = (listTichChonPhanLoaiHD.length == this.totalRecords);

        //nếu đã tích chọn tất cả
        let listTichChonTatCaHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChon);
        if (listTichChonTatCaHD.length == this.totalRecords) {
          this.mainForm.get('tichChonTatCa').setValue(true);
          this.checkTichChonTatCa(true); //thêm code này vì để chạy cho trường hợp cột tichChonTatCa bị ẩn
        }
      }
      this.loading = false;
      this.spinning = false;
      return;
    }

    //nếu dữ liệu được truyền từ form khác vào
    if (!this.isXemChiTiet && this.data != null) {
      if (this.data.length > 0) {
        this.loading = true;

        if (this.data.hinhThucTBaoHuyGiaiTrinhKhac != undefined) {
          if (this.data.hinhThucTBaoHuyGiaiTrinhKhac != 2) //nếu khác loại chọn hủy/giải trình
          {
            this.listDaTichChonHoaDonSaiSot = this.data.filter(x => x.tichChon);
            let hinhThucTBaoHuyGiaiTrinhKhacTemp = this.data.hinhThucTBaoHuyGiaiTrinhKhac;
            this.data = [];//sau khi đã điền dữ liệu thì xóa đi để ko bị thêm lại
            //gán lại hinhThucTBaoHuyGiaiTrinhKhac để kiểm tra lúc lưu
            this.data.hinhThucTBaoHuyGiaiTrinhKhac = hinhThucTBaoHuyGiaiTrinhKhacTemp;
          }
        }
        else {
          this.listDaTichChonHoaDonSaiSot = this.data.filter(x => x.tichChon && x.loaiApDungHoaDon === 1);
          this.data = [];//sau khi đã điền dữ liệu thì xóa đi để ko bị thêm lại
        }

        if (this.listDaTichChonHoaDonSaiSot.length > 0) {
          let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
          hoaDonSaiSotFormArray.clear();
          this.totalRecords = this.listDaTichChonHoaDonSaiSot.length;

          //thêm dòng dữ liệu hiển thị vào bảng
          this.listDaTichChonHoaDonSaiSot.forEach(item => {
            //kiểm tra để tích chọn/ko tích chọn checkbox hủy/điều chỉnh/thay thế/giải trình
            if (item.phanLoaiHDSaiSotMacDinh != null) {
              if (item.phanLoaiHDSaiSot != item.phanLoaiHDSaiSotMacDinh) {
                item.tichChonPhanLoaiHD = false;
              }
              else {
                item.tichChonPhanLoaiHD = true;
              }
            }
            else {
              item.tichChonPhanLoaiHD = true;
            }
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          });

          //tích chọn tất cả phân loại hóa đơn
          let listTichChonPhanLoaiHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChonPhanLoaiHD);
          this.tatCaPhanLoaiHDChecked = (listTichChonPhanLoaiHD.length == this.totalRecords);

          //nếu đã tích chọn tất cả
          let listTichChonTatCaHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChon);
          if (listTichChonTatCaHD.length == this.totalRecords) {
            this.mainForm.get('tichChonTatCa').setValue(true);
            this.checkTichChonTatCa(true); //thêm code này vì để chạy cho trường hợp cột tichChonTatCa bị ẩn
          }
        }

        this.loading = false;
        this.spinning = false;
        return;
      }
    }

    //nếu có kiểm tra dữ liệu trước khi tải dữ liệu
    if (coKiemTraDuLieuNhap) {
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

      if (this.isTBaoHuyGiaiTrinhKhacCuaNNT != true) {
        if (this.thamSoForm.controls['loaiSaiSot'].value == null) {
          this.thamSoForm.controls['loaiSaiSot'].markAsTouched();
          this.thamSoForm.controls['loaiSaiSot'].setValidators([Validators.required]);
          this.thamSoForm.controls['loaiSaiSot'].updateValueAndValidity();
          setStyleTooltipError(true);
          invalidForm = true;
        }
        else {
          this.thamSoForm.controls['loaiSaiSot'].clearValidators();
          this.thamSoForm.controls['loaiSaiSot'].updateValueAndValidity();
        }
      }

      //nếu form ko hợp lệ thì ko tìm kiếm
      if (invalidForm) {
        return;
      }
    }

    this.loading = true;
    let timKiemTheos = this.getDataToFind();

    let thamSoTimKiem = {
      fromDate: this.displayDataTemp.fromDate,
      toDate: this.displayDataTemp.toDate,

      hinhThucHoaDon: this.thamSoForm.get('hinhThucHoaDon').value,
      trangThaiGuiHoaDon: this.thamSoForm.get('trangThaiGuiHoaDon').value,
      loaiSaiSot: this.thamSoForm.get('loaiSaiSot').value,

      sortKey: this.displayDataTemp.SortKey,
      sortValue: this.displayDataTemp.SortValue,
      filterColumns: this.displayDataTemp.filterColumns,

      timKiemTheo: timKiemTheos.TimKiemTheo,
      timKiemBatKy: timKiemTheos.TimKiemBatKy,

      isTBaoHuyGiaiTrinhKhacCuaNNT: this.isTBaoHuyGiaiTrinhKhacCuaNNT,

      lapTuHoaDonDienTuId: this.lapTuHoaDonDienTuId,
      hoaDonDienTuIdLienQuan: this.hoaDonDienTuIdLienQuan
    };
    this.totalRecords = 0;
    let hoaDonSaiSotFormArray = null;
    this.thongDiepGuiCQTService.GetListHoaDonSaiSot(thamSoTimKiem).subscribe((res: any) => {

      hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
      hoaDonSaiSotFormArray.clear();

      /* không cần giữ lại các dòng cũ nữa
      //giữ lại các dòng đã tích chọn trước đó để hiển thị nếu có tải lại dữ liệu
      this.listDaTichChonHoaDonSaiSot = hoaDonSaiSotFormArray.value.filter(x=>x.tichChon);
      hoaDonSaiSotFormArray.clear();

      if (this.listDaTichChonHoaDonSaiSot.length > 0)
      {
        //nếu trước đó đã tích chọn dòng thì phải hiển thị dòng đã tích chọn ở trước rồi mới đến các dữ liệu mới tải về
        let dsHoaDonDienTuId = this.listDaTichChonHoaDonSaiSot.map(y=>y.hoaDonDienTuId);
        res = res.filter(x=> dsHoaDonDienTuId.includes(x.hoaDonDienTuId) === false);
        this.totalRecords = this.listDaTichChonHoaDonSaiSot.length;

        //thêm dòng dữ liệu hiển thị vào bảng
        this.listDaTichChonHoaDonSaiSot.forEach(item => {
          //kiểm tra để tích chọn/ko tích chọn checkbox hủy/điều chỉnh/thay thế/giải trình
          if (item.phanLoaiHDSaiSotMacDinh != null)
          {
            if (item.phanLoaiHDSaiSot != item.phanLoaiHDSaiSotMacDinh)
            {
              item.tichChonPhanLoaiHD = false;
            }
            else
            {
              item.tichChonPhanLoaiHD = true;
            }
          }
          else
          {
            item.tichChonPhanLoaiHD = true;
          }

          hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
        });
      }
      */

      if (res) {
        console.log(res);
        this.totalRecords = res.length;
        res.forEach(item => {
          item.mauVaKyHieuHoaDon = `${item.mauHoaDon}${item.kyHieuHoaDon}`;
          if (moment(moment(item.ngayLapHoaDon).format('YYYY-MM-DD')) > moment(this.ngayLapThongBao)) {
            item.errorNgayLapHoaDon = true;
          }
          else {
            item.errorNgayLapHoaDon = false;
          }

          //kiểm tra để tích chọn/ko tích chọn checkbox hủy/điều chỉnh/thay thế/giải trình
          if (item.phanLoaiHDSaiSotMacDinh != null) {
            if (item.phanLoaiHDSaiSot != item.phanLoaiHDSaiSotMacDinh) {
              item.tichChonPhanLoaiHD = false;
            }
            else {
              item.tichChonPhanLoaiHD = true;
            }
          }
          else {
            item.tichChonPhanLoaiHD = true;
          }

          if (this.isTBaoHuyGiaiTrinhKhacCuaNNT) {
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          }
          else {
            hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(item));
          }

          console.log(hoaDonSaiSotFormArray);
        });
      }

      if (this.lapTuHoaDonDienTuId != '') {
        //mặc định tích sẵn
        this.mainForm.get('tichChonTatCa').setValue(true);
      }

      //tích chọn tất cả phân loại hóa đơn
      let listTichChonPhanLoaiHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChonPhanLoaiHD);
      this.tatCaPhanLoaiHDChecked = (listTichChonPhanLoaiHD.length == this.totalRecords);

      this.loading = false;
      this.spinning = false;
    });
  }

  //hàm này tạo chi tiết hóa đơn sai sót cho từng loại áp dụng
  createChiTietHoaDonSaiSot(data: any = null): FormGroup {
    console.log('dataaaaaaaaaaaaaaaaaa: ', data);

    let form = this.fb.group({
      tichChon: [data == null ? false : data.tichChon],
      id: [data == null ? null : data.id],
      thongDiepGuiCQTId: [data == null ? null : data.thongDiepGuiCQTId],
      hoaDonDienTuId: [data == null ? null : data.hoaDonDienTuId],
      maCQTCap: [{ value: data == null ? '' : data.maCQTCap, disabled: this.isTBaoHuyGiaiTrinhKhacCuaNNT == true && Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) != 1 && Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) != 2 }, [CheckValidMaCQTCapSaiSot]],
      maCQT12: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2 ? "M1" : null) : null) : null) : data.maCQT12],
      maCQT45: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2 ? this.namHienTai : null) : null) : null) : data.maCQT45],
      maCQTToKhaiChapNhan: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2 ? this.maCQTToKhaiChapNhan : null) : null) : null) : data.maCQTToKhaiChapNhan],
      maCQTFixed: [null],
      maCQTChuoiKyTuSo: [data == null ? null : data.maCQTChuoiKyTuSo, [CheckValidMaCQTCapChuoiKyTuSo]],
      mauHoaDon: [data == null ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? this.loaiHoaDons[0].key : this.list_LoaiHoaDon[0].value) : data.mauHoaDon, [CheckValidMauHoaDon_HoaDonChiTiet, Validators.required]],
      kyHieuHoaDon: [data == null ? '' : data.kyHieuHoaDon, [CheckValidKyHieu_HoaDonChiTiet, Validators.required]],
      kyHieu1: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 1 || Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhac').value) == 2 ? "C" : "K") : null) : null) : data.kyHieu1],
      kyHieu23: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? moment().format("YY") : null) : null) : data.kyHieu23],
      kyHieu4: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 1 || Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhac').value) == 0 ? "T" : "M") : null) : null) : data.kyHieu4],
      kyHieu56: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? "AA" : null) : null) : data.kyHieu56],
      mauSoHoaDon_LoaiHoaDon: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : '01GTKT') : null) : data.mauSoHoaDon_LoaiHoaDon],
      mauSoHoaDon_SoLienHoaDon: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : 3) : null) : data.mauSoHoaDon_SoLienHoaDon],
      mauSoHoaDon_SoThuTuMau: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : '001') : null) : data.mauSoHoaDon_SoThuTuMau],
      kyHieuHoaDon_2KyTuDau_DatIn: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 4 ? '01' : null)) : null) : data.kyHieuHoaDon_2KyTuDau_DatIn],
      kyHieuHoaDon_2KyTuDau: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : 'AA') : null) : data.kyHieuHoaDon_2KyTuDau],
      kyHieuHoaDon_2SoCuoiNamThongBao: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : moment().format('YY')) : null) : data.kyHieuHoaDon_2SoCuoiNamThongBao],
      kyHieuHoaDon_hinhThucHoaDon: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1 ? null : (this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value.includes('P') ? 'P' : this.thamSoForm.get('hinhThucHoaDonKhac').value)) : null) : data.kyHieuHoaDon_hinhThucHoaDon],
      mauVaKyHieuHoaDon: [data == null ? null : data.mauVaKyHieuHoaDon],
      soHoaDon: [data == null ? '' : data.soHoaDon, [Validators.required]],
      ngayLapHoaDon: [data == null ? moment().format('YYYY-MM-DD') : (data.ngayLapHoaDon != null ? moment(data.ngayLapHoaDon).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))],
      ngayLapHoaDonText: [data == null ? moment().format('YYYY-MM-DD') : (data.ngayLapHoaDon != null ? moment(data.ngayLapHoaDon).format('DD/MM/YYYY') : moment().format('YYYY-MM-DD'))],
      loaiApDungHoaDon: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) : 1) : (data.loaiApDungHoaDon ? data.loaiApDungHoaDon : data.loaiApDungHDDT)],
      tenLoaiApDungHDDT: [data == null ? null : data.tenLoaiApDungHDDT],
      phanLoaiHDSaiSot: [data == null ? 1 : data.phanLoaiHDSaiSot],
      lyDo: [data == null ? '' : data.lyDo, [CheckValidLyDoSaiSot]],
      createdDate: [data == null ? null : data.createdDate],
      createdBy: [data == null ? null : data.createdBy],
      modifyDate: [data == null ? null : data.modifyDate],
      modifyBy: [data == null ? null : data.modifyBy],
      hinhThucHoaDon: [data == null ? (this.isTBaoHuyGiaiTrinhKhacCuaNNT ? this.thamSoForm.get('hinhThucHoaDonKhac').value : 1) : data.hinhThucHoaDon],
      errorNgayLapHoaDon: [data == null ? false : data.errorNgayLapHoaDon],
      tichChonPhanLoaiHD: [data == null ? true : data.tichChonPhanLoaiHD],
      chungTuLienQuan: [data == null ? null : data.chungTuLienQuan],
      trangThaiHoaDon: [data == null ? null : data.trangThaiHoaDon],
      loaiDieuChinh: [data == null ? null : data.loaiDieuChinh],
      dienGiaiTrangThai: [data == null ? null : data.dienGiaiTrangThai],
      soLanGuiCQT: [data == null ? null : data.soLanGuiCQT],
      laHoaDonNgoaiHeThong: [data == null ? false : data.laHoaDonNgoaiHeThong],
      loaiHoaDon: [data == null ? this.isTBaoHuyGiaiTrinhKhacCuaNNT == true ? (this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value == '1' ? (this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value != '2' ? 1 : 9) : null) : null : (data.loaiApDungHoaDon == '1' ? Number.parseInt(data.loaiHoaDon) : data.loaiHoaDon)]
    });

    form.get('maCQTFixed').setValue(form.value.maCQT12 + '-' + form.value.maCQT45 + '-' + form.value.maCQTToKhaiChapNhan);
    return form;
  }

  blurDetail(index: number, control: any) {

    const hoaDonSaiSotArr = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    const forms = hoaDonSaiSotArr.controls as FormGroup[];

    forms[index].get(control).markAsTouched();
    forms[index].get(control).updateValueAndValidity();
    // if (forms[index].get(control).invalid || forms[index].get(control).hasError) {
    //   setStyleTooltipError_Detail();
    // }

  }


  getMauHoaDon(index) {
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    const mauHoaDon = hoaDonSaiSotFormArray[index].get('mauSoHoaDon_LoaiHoaDon').value + hoaDonSaiSotFormArray[index].get('mauSoHoaDon_SoLienHoaDon') + '/' + hoaDonSaiSotFormArray[index].get('mauSoHoaDon_SoThuTuMau').value;
    hoaDonSaiSotFormArray[index].get('mauSoHoaDon').setValue(mauHoaDon);
  }

  changeHinhThucHoaDonKhac(event: any) {
    console.log(event);
    console.log(this.oldHinhThucHoaDonKhac);

    if (event != this.oldHinhThucHoaDonKhac || this.oldLoaiApDungHoaDonKhac != this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) {
      if (this.mainFormKhac.get('hoaDonSaiSots').dirty && this.oldLoaiApDungHoaDonKhac == this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) {
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
              this.thamSoForm.get('hinhThucHoaDonKhac').setValue(event);
              let radioButton = document.getElementsByClassName("hinhThucHoaDon ant-radio-button-wrapper");
              var nameArray = Array.prototype.slice.call(radioButton);
              console.log(nameArray.length);
              for (let i = 0; i < radioButton.length; i++) {
                let el = radioButton[i] as HTMLElement;
                let nzvalue = radioButton[i].getAttribute('data-value');
                if (event != nzvalue)
                  el.classList.remove('ant-radio-button-wrapper-checked');
              }

              for (let i = 0; i < radioButton.length; ++i) {
                let el = radioButton[i] as HTMLElement;
                let nzvalue = radioButton[i].getAttribute('data-value');
                if (event == nzvalue) {
                  if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
                  el.classList.remove('switchSelectHover');
                } else {
                  el.classList.add('switchSelectHover');
                }
              }

              if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
                console.log('hóa dơn loại 1')
                if (event == '1' || event == '0') {
                  this.loaiHoaDons = this.loaiHoaDonsAll.filter(x => x.key < 9 || x.key == 14 || x.key == 15);
                  this.loaiHoaDons = this.loaiHoaDons.sort((a, b) => a.mhd - b.mhd);
                  this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key != 'M');
                }
                else {
                  this.loaiHoaDons = this.loaiHoaDonsAll.filter(x => (x.key >= 9 && x.key < 13 && x.key != 12) || x.key == 14 || x.key == 15);
                  this.loaiHoaDons = this.loaiHoaDons.sort((a, b) => a.mhd - b.mhd);
                  this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key == 'M');
                }
              }

              console.log(this.loaiHoaDons)

              //thay đổi loại áp dụng hóa đơn trên chi tiết
              let hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

              hoaDonSaiSotFormArray.clear();
              hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(null));

              this.totalRecords = hoaDonSaiSotFormArray.length;

              hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

              console.log(hoaDonSaiSotFormArray);
              for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
                  if (event == '1' || event == '0') {
                    this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key != 'M');
                    if (hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value == '1' || hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value == '2') {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('T');
                    }
                    else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 14) {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('G');
                    }
                    else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 15) {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('H');
                    }
                    else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 7) {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('N');
                    }
                    else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 8) {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('B');
                    }

                    if (event == '0') {
                      hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                      hoaDonSaiSotFormArray.controls[i].get('maCQTCap').disable();
                    }
                    else {
                      hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                      hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
                      hoaDonSaiSotFormArray.controls[i].get('maCQTCap').enable();
                    }
                  }
                  else if (event == '2') {
                    this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key == "M");
                    hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('M');

                    hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                    hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
                    hoaDonSaiSotFormArray.controls[i].get('maCQTCap').enable();
                  }
                }
                else {
                  if (event == "E") {
                    hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue('E');
                    if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 2 || Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 3) {
                      this.list_MauSoHoaDon_SoLienHoaDon = [];
                      this.list_MauSoHoaDon_SoLienHoaDon.push(0);
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();
                    }
                  }
                  else {
                    if (event == "T") {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue(event);
                    }
                    else hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue('P');

                    if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 2 || Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 3) {
                      //reset số liên hóa đơn
                      this.list_MauSoHoaDon_SoLienHoaDon = [];
                      for (let i = 2; i <= 9; i++) {
                        this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                      }
                    }
                    else {
                      //reset số liên hóa đơn
                      this.list_MauSoHoaDon_SoLienHoaDon = [];
                      for (let i = 1; i <= 3; i++) {
                        this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                      }
                    }


                    //cả 2 trường hợp đều set mặc định mauSoHoaDon_SoLienHoaDon về 3
                    hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(3);

                    hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').enable();

                    if (event == "P_CT") {
                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('01');
                    }
                  }
                }

              }

              this.oldHinhThucHoaDonKhac = event;
              this.checked = false;
            },
            msOnClose: () => {
              this.thamSoForm.get('hinhThucHoaDonKhac').setValue(this.oldHinhThucHoaDonKhac);
              this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').setValue(this.oldLoaiApDungHoaDonKhac);
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(this.oldHinhThucHoaDonKhac);
              return;
            }
          }
        });
        modal1.afterOpen.subscribe(() => {
          let checkedRadio = document.getElementsByClassName('hinhThucHoaDon switchSelectHover ant-radio-button-wrapper ant-radio-button-wrapper-checked')
          for (let i = 0; i < checkedRadio.length; i++) {
            let el = checkedRadio[i] as HTMLElement;
            el.classList.remove('ant-radio-button-wrapper-checked');
          }
        })
      }
      else {
        console.log('ko sửa');
        this.thamSoForm.get('hinhThucHoaDonKhac').setValue(event);

        let radioButton = document.getElementsByClassName("hinhThucHoaDon ant-radio-button-wrapper");
        var nameArray = Array.prototype.slice.call(radioButton);
        console.log(nameArray.length);
        console.log(radioButton.length);
        for (let i = 0; i < radioButton.length; i++) {
          let el = radioButton[i] as HTMLElement;
          let nzvalue = radioButton[i].getAttribute('data-value');
          if (event != nzvalue)
            el.classList.remove('ant-radio-button-wrapper-checked');
        }

        for (let i = 0; i < radioButton.length; ++i) {
          let el = radioButton[i] as HTMLElement;
          let nzvalue = radioButton[i].getAttribute('data-value');
          console.log(nzvalue);
          if (event == nzvalue) {
            if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
            el.classList.remove('switchSelectHover');
          } else {
            el.classList.add('switchSelectHover');
          }
        }

        if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
          console.log('hóa dơn loại 1')
          if (event == '1' || event == '0') {
            this.loaiHoaDons = this.loaiHoaDonsAll.filter(x => x.key < 9 || x.key == 14 || x.key == 15);
            this.loaiHoaDons = this.loaiHoaDons.sort((a, b) => a.mhd - b.mhd);
            this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key != 'M');
          }
          else {
            this.loaiHoaDons = this.loaiHoaDonsAll.filter(x => (x.key >= 9 && x.key < 13 && x.key != 12) || x.key == 14 || x.key == 15);
            this.loaiHoaDons = this.loaiHoaDons.sort((a, b) => a.mhd - b.mhd);
            this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key == 'M');
            console.log(this.loaiHoaDons);
          }
        }

        //thay đổi loại áp dụng hóa đơn trên chi tiết

        let hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

        hoaDonSaiSotFormArray.clear();
        hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(null));

        this.totalRecords = hoaDonSaiSotFormArray.length;

        hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

        console.log(hoaDonSaiSotFormArray);
        for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
          if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
            if (event == '1' || event == '0') {
              this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key != 'M');
              if (hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value == '1' || hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value == '2') {
                hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('T');
              }
              else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 14) {
                hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('G');
              }
              else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 15) {
                hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('H');
              }
              else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 7) {
                hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('N');
              }
              else if (Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('mauHoaDon').value) == 8) {
                hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('B');
              }

              if (event == '0') {
                hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                hoaDonSaiSotFormArray.controls[i].get('maCQTCap').disable();
              }
              else {
                hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
                hoaDonSaiSotFormArray.controls[i].get('maCQTCap').enable();
              }
            }
            else if (event == '2') {
              this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key == "M");
              hoaDonSaiSotFormArray.controls[i].get('kyHieu4').setValue('M');

              hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
              hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
              hoaDonSaiSotFormArray.controls[i].get('maCQTCap').enable();
            }
          }
          else {
            if (event == "E") {
              hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue('E');
              if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 2 || Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 3) {
                this.list_MauSoHoaDon_SoLienHoaDon = [];
                this.list_MauSoHoaDon_SoLienHoaDon.push(0);
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();
              }
            }
            else {
              if (event == "T") {
                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue(event);
              }
              else hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_hinhThucHoaDon').setValue('P');

              if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 2 || Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 3) {
                //reset số liên hóa đơn
                this.list_MauSoHoaDon_SoLienHoaDon = [];
                for (let i = 2; i <= 9; i++) {
                  this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                }
              }
              else {
                //reset số liên hóa đơn
                this.list_MauSoHoaDon_SoLienHoaDon = [];
                for (let i = 1; i <= 3; i++) {
                  this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                }
              }


              //cả 2 trường hợp đều set mặc định mauSoHoaDon_SoLienHoaDon về 3
              hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(3);

              hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').enable();

              if (event == "P_CT") {
                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('01');
              }
            }
          }

        }

        this.oldHinhThucHoaDonKhac = event;
        this.checked = false;
      }
    }
    else {
      let radioButtons = document.getElementsByClassName('hinhThucHoaDon');
      for (let i = 0; i < radioButtons.length; i++) {
        let el = radioButtons[i] as HTMLElement;
        let nzvalue = radioButtons[i].getAttribute('data-value');
        if (event.toString() != nzvalue)
          el.classList.remove('ant-radio-button-wrapper-checked');
      }

      for (let i = 0; i < radioButtons.length; ++i) {
        let el = radioButtons[i] as HTMLElement;
        let nzvalue = radioButtons[i].getAttribute('data-value');
        if (event.toString() == nzvalue) {
          if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
          el.classList.remove('switchSelectHover');
        } else {
          el.classList.add('switchSelectHover');
        }
      }
      return;
    }
  }

  changeMauSoHoaDon(index: number, event) {
    console.log(event);
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    var mau = this.loaiHoaDons.find(x => x.key == event);
    // hoaDonSaiSotFormArray.controls[index].get('mauHoaDon').setValue(mau.mhd);
    if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhac').value) == 1) {
      hoaDonSaiSotFormArray.controls[index].get('mauHoaDon').setValue(mau.mhd);

      if (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhac').value) == 1 || Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhac').value) == 0) {
        this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key != "M");
        if (Number.parseInt(event) == 1 || Number.parseInt(event) == 2) {
          hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('T');
        }
        else if (Number.parseInt(event) == 14) {
          hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('G');
        }
        else if (Number.parseInt(event) == 15) {
          hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('H');
        }
        else if (Number.parseInt(event) == 7) {
          hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('N');
        }
        else if (Number.parseInt(event) == 8) {
          hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('B');
        }
      }
      else if (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhac').value) == 2) {
        this.kyHieuThu4s = this.kyHieuThu4sSearch.filter(x => x.key == "M");
        hoaDonSaiSotFormArray.controls[index].get('kyHieu4').setValue('M');

        hoaDonSaiSotFormArray.controls[index].get('maCQT12').setValue(`M${mau.mhd}`);
      }

    }
  }

  setKyHieuHoaDon(index: number) {
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
      const kyHieuHoaDon = `${hoaDonSaiSotFormArray.controls[index].get('kyHieu1').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieu23').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieu4').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieu56').value}`;
      hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon').setValue(kyHieuHoaDon);

      if(Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2){
        hoaDonSaiSotFormArray.controls[index].get('maCQT45').setValue(hoaDonSaiSotFormArray.controls[index].get('kyHieu23').value);
        hoaDonSaiSotFormArray.controls[index].get('maCQTFixed').setValue(hoaDonSaiSotFormArray.controls[index].value.maCQT12 + '-' + hoaDonSaiSotFormArray.controls[index].value.maCQT45 + '-' + hoaDonSaiSotFormArray.controls[index].value.maCQTToKhaiChapNhan);
      }
    }
    else {
      if (this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value != 'P_CT') {
        const kyHieuHoaDon = `${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2KyTuDau').value}/${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2SoCuoiNamThongBao').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_hinhThucHoaDon').value}`;
        hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon').setValue(kyHieuHoaDon);
      }
      else {
        const kyHieuHoaDon = `${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2KyTuDau_DatIn').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2KyTuDau').value}/${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2SoCuoiNamThongBao').value}${hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_hinhThucHoaDon').value}`;
        hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon').setValue(kyHieuHoaDon);
      }
    }
  }

  changeKyHieu23(i, event){
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    const hoaDonSaiSots = hoaDonSaiSotFormArray.value;
    let hoaDonCoKyHieu23 = hoaDonSaiSots.filter(x=>x.kyHieu23 == event && hoaDonSaiSots.indexOf(x) != i);
    if(Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2){
      if(hoaDonCoKyHieu23.length > 0){
        let maxChuoiSo = Math.max(hoaDonCoKyHieu23.map(x=>Number.parseInt(x.maCQTChuoiKyTuSo)));
        hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').setValue(this.padLeft((maxChuoiSo + 1) + '', 11));
      }
    }
  }

  blurKyTuSo(i, event: any){
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    if(hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').value)
      hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').setValue(this.padLeft(event.target.value, 11));
  }

  focusKyTuSo(i){
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    if(!hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').value){

    }
    else hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').setValue(Number.parseInt(hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').value) + '');
    
  }

  clickChuoiKyTu(i, controlName){
     //đặt chuột luôn sang phải
     const input = document.getElementsByName(controlName);
     for(let index = 0; i < input.length; i++){
       if(index == i){
         let el = input[i] as HTMLInputElement;
         const len = el.value.length;
        
         if(controlName == 'maCQTChuoiKyTuSo')
         el.setSelectionRange(0,0);
         else if(controlName == 'soHoaDon')
         el.setSelectionRange(len, len)
       }
     }
  }

  changeNgayLapHoaDon(index, event) {
    const hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    let SoCuoiNam = moment(event).format('YY');
    if (Number.parseInt(this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').value) == 1) {
      console.log('hoa don dien tu');
      hoaDonSaiSotFormArray.controls[index].get('kyHieu23').enable();
      hoaDonSaiSotFormArray.controls[index].get('kyHieu23').setValue(SoCuoiNam);
      hoaDonSaiSotFormArray.controls[index].get('kyHieu23').disable();

      if (Number.parseInt(this.thamSoForm.get('hinhThucHoaDonKhacHienThi').value) == 2) {
        hoaDonSaiSotFormArray.controls[index].get('maCQT45').setValue(SoCuoiNam);
      }
    }
    else {
      hoaDonSaiSotFormArray.controls[index].get('kyHieuHoaDon_2SoCuoiNamThongBao').setValue(SoCuoiNam);
    }
  }

  //hàm này để lưu dữ liệu sang modal thông báo hóa đơn sai sót
  submitForm() {
    //câu hỏi xác thực lại trong trường hợp loại 3 (thông báo của NNT (Khác))
    if (this.isTBaoHuyGiaiTrinhKhacCuaNNT) {
      if (this.data != null) {
        if (this.data.hinhThucTBaoHuyGiaiTrinhKhac != undefined) {
          if (this.thamSoForm.get('hinhThucTBaoHuyGiaiTrinhKhac').value != this.data.hinhThucTBaoHuyGiaiTrinhKhac) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '370px',
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Confirm,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msOkButtonInBlueColor: true,
                msTitle: 'Thay đổi hình thức thông báo sai sót',
                msContent: `Dữ liệu sẽ bị xóa khi bạn thay đổi hình thức thông báo sai sót. Bạn có chắc chắn muốn thay đổi không?`,
                msOnOk: () => {
                  this.submitForm2();
                }
              },
              nzFooter: null
            });
          }
          else {
            this.submitForm2();
          }
        }
        else {
          this.submitForm2();
        }
      }
      else {
        this.submitForm2();
      }
    }
    else {
      this.submitForm2();
    }
  }

  //hàm này để lưu dữ liệu sang modal thông báo hóa đơn sai sót
  submitForm2() {
    //tính riêng trường hợp loại 3 (thông báo của NNT (Khác)), và chọn hình thức là hủy/giải trình
    if (this.isTBaoHuyGiaiTrinhKhacCuaNNT) {

      //validate dữ liệu trước, nếu ko hợp lệ thì return
      const hoaDonSaiSotFormArray5 = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
      for (let i = 0; i < hoaDonSaiSotFormArray5.length; i++) {
        if (hoaDonSaiSotFormArray5.controls[i].get('kyHieuHoaDon').value == '') {
          this.setKyHieuHoaDon(i);
        }
      }

      if (this.mainFormKhac.invalid) {
        console.log(this.mainFormKhac);
        for (const i in this.mainFormKhac.get('hoaDonSaiSots').value) {
          this.mainFormKhac.get(`hoaDonSaiSots.${i}.mauHoaDon`).markAsTouched();
          this.mainFormKhac.get(`hoaDonSaiSots.${i}.mauHoaDon`).updateValueAndValidity();

          this.mainFormKhac.get(`hoaDonSaiSots.${i}.kyHieuHoaDon`).markAsTouched();
          this.mainFormKhac.get(`hoaDonSaiSots.${i}.kyHieuHoaDon`).updateValueAndValidity();

          this.mainFormKhac.get(`hoaDonSaiSots.${i}.soHoaDon`).markAsTouched();
          this.mainFormKhac.get(`hoaDonSaiSots.${i}.soHoaDon`).updateValueAndValidity();

          this.mainFormKhac.get(`hoaDonSaiSots.${i}.lyDo`).markAsTouched();
          this.mainFormKhac.get(`hoaDonSaiSots.${i}.lyDo`).updateValueAndValidity();

          var loaiApDungHoaDonTemp = this.mainFormKhac.get(`hoaDonSaiSots.${i}.loaiApDungHoaDon`).value;
          if (loaiApDungHoaDonTemp == 1 || loaiApDungHoaDonTemp == 2) {
            this.mainFormKhac.get(`hoaDonSaiSots.${i}.maCQTCap`).markAsTouched();
            this.mainFormKhac.get(`hoaDonSaiSots.${i}.maCQTCap`).updateValueAndValidity();
          }
        }
        return;
      }

      const forms = hoaDonSaiSotFormArray5.controls as FormGroup[];
      console.log(forms);
      for (let i = 0; i < forms.length; i++) {
        var invalid = false;
        if (forms[i].invalid) {
          for (const f in forms[i].controls) {
            forms[i].controls[f].markAsTouched();
            forms[i].controls[f].updateValueAndValidity();
            if (invalid === false && forms[i].controls[f].invalid) {
              invalid = true;
            }
          }

          if (invalid == true) {
            setStyleTooltipError_Detail(true);
            return;
          }
        }
      }

      let listKetQua = hoaDonSaiSotFormArray5.value;
      console.log(listKetQua);

      listKetQua.forEach((x: any) => {
        x.loaiHoaDon = x.loaiHoaDon.toString()
      });

      if (listKetQua.length > 0) {
        //kiểm tra ngày lập hóa đơn hợp lệ
        let validData = listKetQua.filter(x => x.ngayLapHoaDon == null || x.ngayLapHoaDon == '').length == 0;
        if (validData) {
          //Kiểm tra chọn trùng hóa đơn
          var existDouble = [];
          var stt = 1;
          var barPromise = new Promise<void>((resolve, reject) => {
            listKetQua.forEach((value, index, array) => {
              stt++;
              var matchedItem = listKetQua.filter((val) => val.soHoaDon === value.soHoaDon && val.mauVaKyHieuHoaDon === value.mauVaKyHieuHoaDon
                && val.ngayLapHoaDon === value.ngayLapHoaDon && val.maCQTCap === value.maCQTCap && val.loaiApDungHoaDon === value.loaiApDungHoaDon);
              if (matchedItem.length > 1) {
                const index: number = hoaDonSaiSotFormArray5.value.indexOf(value);
                value.stt = index;
                existDouble.push(value);
              }
              if (index === array.length - 1) resolve();
            });
          });
          barPromise.then(() => {
            if (existDouble.length > 0) {
              let cauThongBao = '';
              let tempSoHoaDon = 0;
              var barPromise2 = new Promise<void>((resolve, reject) => {
                existDouble.forEach((value, index, array) => {
                  var matchedItem = tempSoHoaDon != value.soHoaDon ? existDouble.filter((val) => val.soHoaDon === value.soHoaDon) : [];
                  let txtDs = '';
                  var barPromiseChild = new Promise<void>((resolve, reject) => {
                    matchedItem.forEach((value, index, array) => {
                      tempSoHoaDon = value.soHoaDon;
                      let stt = value.stt + 1;
                      if (txtDs === '') {
                        txtDs = '- Trùng thông tin hóa đơn dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>';
                      } else {
                        if (index === array.length - 1) {
                          txtDs += ' và <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>.<br>';
                        } else {
                          if (matchedItem.length > 3) {
                            txtDs += ' với dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>, ';
                          } else {
                            txtDs += ' với dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>';
                          }
                        }
                      }
                      if (index === array.length - 1) resolve();
                    });
                  });
                  barPromiseChild.then(() => {
                    cauThongBao += txtDs;
                  });
                  if (index === array.length - 1) resolve();
                });
              });
              barPromise2.then(() => {
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
                    msTitle: 'Kiểm tra lại',
                    msContent: `Không được chọn trùng hóa đơn trong một thông báo hóa đơn điện tử có sai sót.<br>Danh sách hóa đơn bị trùng:<br> ` + cauThongBao + `<br>Vui lòng kiểm tra lại!`,
                  },
                  nzFooter: null
                });
              });
              return;
            } else {
              //kiểm tra xem ngày lập hóa đơn có hợp lệ không
              let validData2 = listKetQua.filter(x => moment(moment(x.ngayLapHoaDon).format('YYYY-MM-DD')) > moment(this.ngayLapThongBao)).length == 0;
              //nếu validData2 = false thì đã có dòng có ngayLapHoaDon > ngayLapThongBao là không hợp lệ
              if (validData2) {
                //Kiểm tra xem người dùng có nhập thông tin hóa đơn có trung với thông tin hóa đơn trong hệ thống không
                // tiêu chí (Trùng: Loại áp dụng hóa đơn điện tử, Mã CQT cấp, Ký hiệu mẫu và ký hiệu hóa đơn, Số hóa đơn điện tử và Ngày lập hóa đơn)
                this.hoaDonDienTuService.CheckExistInvoid(listKetQua).subscribe((rs: any) => {
                  let kq = true;
                  let ketQuaThayTheKhac = true;
                  let ketQuaDieuChinhKhac = true;
                  //Kiểm tra tồn tại thông tin đã nhập
                  let ketQuaDaTonTaiSaiSot = true;
                  let txtCheckDublicate = '';
                  let soLanCheckDublicate = 0;
                  if (rs) {
                    let sttCheckLyDo = 0;
                    let txtCheckLyDo = '';
                    let txtAlertThayTheKhac = '';
                    let txtAlertDieuChinhKhac = '';
                    //số lần lý do trống
                    let soLanLyDoTrong = 0;
                    let soLanThayTheKhac = 0;
                    let soLanDieuChinhKhac = 0;
                    var bar = new Promise<void>((resolve, reject) => {
                      rs.forEach((value, index, array) => {
                        sttCheckLyDo++;
                        if (value.ketQua == true) {
                          kq = false;
                          soLanLyDoTrong++;
                          if (txtCheckLyDo === '') {
                            txtCheckLyDo = ' <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                          } else {
                            if (soLanLyDoTrong === rs.filter(x => x.ketQua == true).length) {
                              txtCheckLyDo += ' và <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                            } else {
                              if (soLanLyDoTrong > 3) {
                                txtCheckLyDo += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>, ';
                              } else {
                                txtCheckLyDo += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                              }
                            }
                          }
                        }
                        //Trùng với hóa đơn thay thế khác (trong thông tin hóa đơn)
                        if (value.ketQuaThayTheKhac == true) {
                          ketQuaThayTheKhac = false;
                          soLanThayTheKhac++;
                          if (txtAlertThayTheKhac === '') {
                            txtAlertThayTheKhac = ' <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                          } else {
                            if (soLanThayTheKhac === rs.filter(x => x.ketQuaThayTheKhac == true).length) {
                              txtAlertThayTheKhac += ' và <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                            } else {
                              if (soLanThayTheKhac > 3) {
                                txtAlertThayTheKhac += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>, ';
                              } else {
                                txtAlertThayTheKhac += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                              }
                            }
                          }
                        }
                        //Trùng với hóa đơn điều chỉnh khác (trong thông tin hóa đơn)
                        if (value.ketQuaDieuChinhKhac == true) {
                          ketQuaDieuChinhKhac = false;
                          soLanDieuChinhKhac++;
                          if (txtAlertDieuChinhKhac === '') {
                            txtAlertDieuChinhKhac = ' <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                          } else {
                            if (soLanDieuChinhKhac === rs.filter(x => x.ketQuaDieuChinhKhac == true).length) {
                              txtAlertDieuChinhKhac += ' và <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                            } else {
                              if (soLanDieuChinhKhac > 3) {
                                txtAlertDieuChinhKhac += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>, ';
                              } else {
                                txtAlertDieuChinhKhac += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                              }
                            }
                          }
                        }

                        if (value.ketQuaDaTonTaiSaiSot == true) {
                          //bị trùng
                          ketQuaDaTonTaiSaiSot = false;
                          soLanCheckDublicate++;
                          if (txtCheckDublicate === '') {
                            txtCheckDublicate = ' <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                          } else {
                            if (soLanCheckDublicate === rs.filter(x => x.ketQuaDaTonTaiSaiSot == true).length) {
                              txtCheckDublicate += ' và <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                            } else {
                              if (soLanCheckDublicate > 3) {
                                txtCheckDublicate += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>, ';
                              } else {
                                txtCheckDublicate += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
                              }
                            }
                          }
                        }

                        if (index === array.length - 1) resolve();
                      });
                    });

                    bar.then(() => {
                      if (kq && ketQuaThayTheKhac && ketQuaDieuChinhKhac && ketQuaDaTonTaiSaiSot) {
                        listKetQua.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
                        this.modal.destroy(listKetQua);
                      } else {
                        //thông báo lỗi trùng lặp
                        if (!kq) {
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
                              msTitle: 'Kiểm tra lại',
                              msContent: `Thông tin hóa đơn ở dòng ` + txtCheckLyDo + ` trùng với hóa đơn điện tử đã lập từ hệ thống.<br>Vui lòng kiểm tra lại !`,
                            },
                            nzFooter: null
                          });
                        } else {
                          if (ketQuaDaTonTaiSaiSot == false) {
                            let dupContent = `Thông tin hóa đơn ở dòng ` + txtCheckDublicate + ` đã lập thông báo hóa đơn điện tử có sai sót.</br>`;
                            this.modalService.create({
                              nzContent: MessageBoxModalComponent,
                              nzMaskClosable: false,
                              nzClosable: false,
                              nzKeyboard: false,
                              nzStyle: { top: '100px' },
                              nzWidth: '430px',
                              nzBodyStyle: { padding: '1px' },
                              nzComponentParams: {
                                msMessageType: MessageType.Confirm,
                                msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
                                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                                msOkButtonContinueIcon: true,
                                msOkButtonInBlueColor: true,
                                msTitle: 'Lập thông báo hóa đơn điện tử có sai sót',
                                msContent: dupContent + 'Bạn có muốn tiếp tục lập thông báo hóa đơn điện tử có sai sót không?',
                                msOnOk: () => {
                                  listKetQua.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
                                  listKetQua.hinhThucTBaoHuyGiaiTrinhKhac = 2;
                                  this.modal.destroy(listKetQua);
                                },
                                msOnClose: () => {
                                }
                              },
                              nzFooter: null
                            });
                          } else {
                            //trùng với thông tin hóa đơn đã nhập từ nghiệp vụ <Thay thế khác> trên giao diệp Lập hóa đơn thay thế và <Điều chỉnh khác> trên giao diện Lập hóa đơn điều chỉnh
                            let gopContent = '';
                            if (!ketQuaThayTheKhac) gopContent += `Thông tin hóa đơn ở dòng ` + txtAlertThayTheKhac + ` trùng với hóa đơn bị thay thế đã nhập thông tin từ nghiệp vụ <b>Thay thế khác</b>.</br>`;
                            if (!ketQuaDieuChinhKhac) gopContent += `Thông tin hóa đơn ở dòng ` + txtAlertDieuChinhKhac + ` trùng với hóa đơn bị điều chỉnh đã nhập thông tin từ nghiệp vụ <b>Điều chỉnh khác</b>.</br>`;
                            this.modalService.create({
                              nzContent: MessageBoxModalComponent,
                              nzMaskClosable: false,
                              nzClosable: false,
                              nzKeyboard: false,
                              nzStyle: { top: '100px' },
                              nzWidth: '430px',
                              nzBodyStyle: { padding: '1px' },
                              nzComponentParams: {
                                msMessageType: MessageType.Confirm,
                                msOKText: TextGlobalConstants.TEXT_CONFIRM_CONT,
                                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                                msOkButtonContinueIcon: true,
                                msOkButtonInBlueColor: true,
                                msTitle: 'Lập thông báo hóa đơn điện tử có sai sót',
                                msContent: gopContent + 'Bạn có muốn tiếp tục lập thông báo hóa đơn điện tử có sai sót không?',
                                msOnOk: () => {
                                  listKetQua.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
                                  listKetQua.hinhThucTBaoHuyGiaiTrinhKhac = 2;
                                  this.modal.destroy(listKetQua);
                                },
                                msOnClose: () => {
                                }
                              },
                              nzFooter: null
                            });
                          }


                        }
                      }
                    });
                  }
                })
              }
              else {
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
                    msContent: this.invalidMessageNgayLapHoaDon.replace('<', '&lt;').replace('>', '&gt;'),
                  },
                  nzFooter: null
                });
              }
            }
          });
        }
        else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '370px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: "Ngày lập hóa đơn không được để trống. Vui lòng kiểm tra lại!",
            },
            nzFooter: null
          });
        }
      }
      else {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '400px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: "Chưa có thông tin hóa đơn điện tử có sai sót. Vui lòng kiểm tra lại!",
          },
          nzFooter: null
        });
      }
      return;
    }
    //kiểm tra xem đã nhập lý do chưa
    let invalidForm = false;
    let sttCheckLyDo = 0;
    let txtCheckLyDo = '';
    //số lần lý do trống
    let soLanLyDoTrong = 0;
    let soHoaDonTrongLyDo = this.mainForm.get('hoaDonSaiSots').value.filter(x => x.tichChon && (x.lyDo == '' || x.lyDo == null)).length;
    for (const i in this.mainForm.get('hoaDonSaiSots').value) {
      sttCheckLyDo++;
      if (this.mainForm.get(`hoaDonSaiSots.${i}.tichChon`).value) {
        if (this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).value == null || this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).value == '') {
          soLanLyDoTrong++;
          this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).markAsTouched();
          this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).updateValueAndValidity();
          invalidForm = true;
          if (txtCheckLyDo === '') {
            txtCheckLyDo = ' <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
          } else {
            if (soLanLyDoTrong === soHoaDonTrongLyDo) {
              txtCheckLyDo += ' và <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>.<br>';
            } else {
              if (soLanLyDoTrong > 2) {
                txtCheckLyDo += ', <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong> ';
              } else {
                txtCheckLyDo += ' với dòng <strong class = "orangeColorTBaoSaiThongTin">' + sttCheckLyDo + '</strong>';
              }
            }
          }
        }
        else {
          if (this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).value.length > 255) {
            this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).markAsTouched();
            this.mainForm.get(`hoaDonSaiSots.${i}.lyDo`).updateValueAndValidity();
            invalidForm = true;
          }
        }
      }
    }

    if (invalidForm) {
      let closs = this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Lý do không được để trống.<br>Cột lý do đang để trống ở các dòng: ` + txtCheckLyDo + `<br>Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      closs.afterClose.subscribe((rs: any) => {
        var element = document.getElementById("tblScroll");
        var element2 = document.getElementsByClassName("has-error");
        // console.log(element2[0]);
        // element.scrollTo(element2[0]);
        element2[0].scrollIntoView({ inline: "end" });
      });
      return;
    }

    const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    let listTichChon = hoaDonSaiSotFormArray.value.filter(x => x.tichChon);

    listTichChon.forEach(x=>{
      if(this.isTBaoHuyGiaiTrinhKhacCuaNNT != true){
        x.hinhThucHoaDon = this.thamSoForm.get('hinhThucHoaDon').value
      }
    })

    if (this.checkedSuDungLoai == false) {
      listTichChon = [];
    }

    // const hoaDonSaiSotFormArray2 = this.mainForm2.get('hoaDonSaiSots') as FormArray;
    // if (this.checkedSuDungLoai2 == false) {
    //   hoaDonSaiSotFormArray2.clear();
    // }

    // const hoaDonSaiSotFormArray3 = this.mainForm3.get('hoaDonSaiSots') as FormArray;
    // if (this.checkedSuDungLoai3 == false) {
    //   hoaDonSaiSotFormArray3.clear();
    // }

    // const hoaDonSaiSotFormArray4 = this.mainForm4.get('hoaDonSaiSots') as FormArray;
    // if (this.checkedSuDungLoai4 == false) {
    //   hoaDonSaiSotFormArray4.clear();
    // }

    //gộp tất cả các dữ liệu đã nhập
    //let listKetQua: any = [...listTichChon, ...hoaDonSaiSotFormArray2.value, ...hoaDonSaiSotFormArray3.value, ...hoaDonSaiSotFormArray4.value];
    let listKetQua: any = [...listTichChon];

    //kiểm tra xem ngày lập hóa đơn có bị để trắng không
    let validData = true;
    if (listKetQua.length > 0) {
      //Kiểm tra chọn trùng hóa đơn
      var existDouble = [];
      var stt = 1;
      var barPromise = new Promise<void>((resolve, reject) => {
        listKetQua.forEach((value, index, array) => {
          stt++;
          var matchedItem = listKetQua.filter((val) => val.soHoaDon === value.soHoaDon && val.mauVaKyHieuHoaDon === value.mauVaKyHieuHoaDon
            && val.ngayLapHoaDon === value.ngayLapHoaDon && val.maCQTCap === value.maCQTCap && val.loaiApDungHoaDon === value.loaiApDungHoaDon);
          if (matchedItem.length > 1) {
            const index: number = hoaDonSaiSotFormArray.value.indexOf(value);
            value.stt = index;
            existDouble.push(value);
          }
          if (index === array.length - 1) resolve();
        });
      });
      barPromise.then(() => {
        if (existDouble.length > 0) {
          console.log("existDouble");
          let cauThongBao = '';
          let tempSoHoaDon = 0;
          var barPromise2 = new Promise<void>((resolve, reject) => {
            existDouble.forEach((value, index, array) => {
              console.log(value);
              var matchedItem = tempSoHoaDon != value.soHoaDon ? existDouble.filter((val) => val.soHoaDon === value.soHoaDon) : [];
              let txtDs = '';
              var barPromiseChild = new Promise<void>((resolve, reject) => {
                matchedItem.forEach((value, index, array) => {
                  tempSoHoaDon = value.soHoaDon;
                  let stt = value.stt + 1;
                  if (txtDs === '') {
                    txtDs = '- Trùng thông tin hóa đơn dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>';
                  } else {
                    if (index === array.length - 1) {
                      txtDs += ' và <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>.<br>';
                    } else {
                      if (matchedItem.length > 3) {
                        txtDs += ' với dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>, ';
                      } else {
                        txtDs += ' với dòng <strong class = "orangeColorTBaoSaiThongTin">' + stt + '</strong>';
                      }
                    }
                  }
                  if (index === array.length - 1) resolve();
                });
              });
              barPromiseChild.then(() => {
                console.log(txtDs)
                cauThongBao += txtDs;
              });
              if (index === array.length - 1) resolve();
            });
          });
          barPromise2.then(() => {
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
                msTitle: 'Kiểm tra lại',
                msContent: `Không được chọn trùng hóa đơn trong một thông báo hóa đơn điện tử có sai sót.<br>Danh sách hóa đơn bị trùng:<br> ` + cauThongBao + `<br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
          });
          return;
        } else {
          validData = listKetQua.filter(x => x.ngayLapHoaDon == null || x.ngayLapHoaDon == '').length == 0;
          if (validData) {
            //kiểm tra xem ngày lập hóa đơn có hợp lệ không
            let validData2 = listKetQua.filter(x => moment(moment(x.ngayLapHoaDon).format('YYYY-MM-DD')) > moment(this.ngayLapThongBao)).length == 0;
            //nếu validData2 = false thì đã có dòng có ngayLapHoaDon > ngayLapThongBao là không hợp lệ
            if (validData2) {
              if (this.isTBaoHuyGiaiTrinhKhacCuaNNT) {
                listKetQua.isTBaoHuyGiaiTrinhKhacCuaNNT = true;
                listKetQua.hinhThucTBaoHuyGiaiTrinhKhac = 1;
              }
              this.modal.destroy(listKetQua);
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
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: 'Kiểm tra lại',
                  msContent: this.invalidMessageNgayLapHoaDon.replace('<', '&lt;').replace('>', '&gt;'),
                },
                nzFooter: null
              });
            }
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
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: "Ngày lập hóa đơn không được để trống. Vui lòng kiểm tra lại!",
              },
              nzFooter: null
            });
          }
        }
      });
      //END
    }
    else {
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
          msContent: "Bạn chưa chọn hóa đơn điện tử có sai sót. Vui lòng kiểm tra lại!",
        },
        nzFooter: null
      });
    }
  }
  changeHinhThucHoaDon(event) {
    console.log(event);
    console.log(this.hinhThucHoaDon);
    if (event.length > 0) {
      if (event != this.hinhThucHoaDon) {
        if (this.mainFormKhac.get('hoaDonSaiSots').value && this.mainFormKhac.get('hoaDonSaiSots').dirty) {
          let modal = this.modalService.create({
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
                let hoaDonSaiSot = this.mainForm.get('hoaDonSaiSots') as FormArray;
                hoaDonSaiSot.clear()
                this.checked = false;
                this.hinhThucHoaDon = event
              },
              msOnClose: () => {
                this.thamSoForm.get('hinhThucHoaDon').setValue(this.hinhThucHoaDon);
              },
            },
          })
          modal.afterOpen.subscribe(() => {
            let checkedRadio = document.getElementsByClassName('switchSelectHover ant-radio-button-wrapper ant-radio-button-wrapper-checked')
            for (let i = 0; i < checkedRadio.length; i++) {
              let el = checkedRadio[i] as HTMLElement;
              el.classList.remove('ant-radio-button-wrapper-checked');
            }
          })
        }else {
          console.log('ko vào');
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
          this.checked = false;
          this.hinhThucHoaDon = event;
        }
      }


      this.checked = false;
    }
  }
  //hàm này để sắp xếp dữ liệu
  sort(sort: { key: string; value: string }): void {
    if (this.checkedSuDungLoai === false) return;
    this.displayDataTemp.SortKey = sort.key;
    this.displayDataTemp.SortValue = sort.value;
    this.loadDSHoaDonSaiSot();
  }

  changeKy(event: any) {
    SetDate(event, this.displayDataTemp);
  }

  blurDate() {
    CheckValidDateV2(this.displayDataTemp);
    const ky = GetKy(this.displayDataTemp);
    this.displayDataTemp.Ky = ky;
  }

  //hàm này để hiển thị thông báo khi bấm nút hủy
  closeModal() {
    if (this.isXemChiTiet) {
      //nếu là xem chi tiết thì đóng form mà ko hỏi xác thực
      this.modal.destroy(null);
      return;
    }

    if (this.mainForm.dirty || this.mainFormKhac.dirty) {
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

  //hàm này để tích/bỏ tích chọn tất cả
  checkTichChonTatCa(event: any) {
    if (event) {
      for (let index = 0; index < this.mainForm.get(`hoaDonSaiSots`).value.length; index++) {
        if (this.mainForm.get(`hoaDonSaiSots.${index}.errorNgayLapHoaDon`).value == false) {
          this.mainForm.get(`hoaDonSaiSots.${index}.tichChon`).setValue(true);
        }
      }
      this.noiDungDongDaTichChon = "<span class = 'text-bold'>Đã chọn: <span class = 'text-red'>" + this.mainForm.get(`hoaDonSaiSots`).value.filter(x => x.tichChon).length.toString() + '</span></span>';
    }
    else {
      for (let index = 0; index < this.mainForm.get(`hoaDonSaiSots`).value.length; index++) {
        this.mainForm.get(`hoaDonSaiSots.${index}.tichChon`).setValue(false);
      }
      this.noiDungDongDaTichChon = '';
    }
  }

  //hàm này để tích chọn dòng dữ liệu
  tichChonDong() {
    const hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    let listTichChon = hoaDonSaiSotFormArray.value.filter(x => x.tichChon);
    if (listTichChon.length > 0) {
      this.noiDungDongDaTichChon = "<span class = 'text-bold'>Đã chọn: <span class = 'text-red'>" + listTichChon.length.toString() + '</span></span>';
    }
    else {
      this.noiDungDongDaTichChon = '';
    }
  }

  //hàm này để tích chọn phân loại hoá đơn
  checkTichChonTatCaPhanLoaiHD(event: any) {
    if (this.isXemChiTiet) return;
    for (let index = 0; index < this.mainForm.get(`hoaDonSaiSots`).value.length; index++) {
      this.mainForm.get(`hoaDonSaiSots.${index}.tichChonPhanLoaiHD`).setValue(event);
    }
  }

  //hàm này để thêm dòng cho form mainForm5; theo thiết kế mới
  addRowV2() {
    let hoaDonSaiSotFormArray = this.mainForm5.get('hoaDonSaiSots') as FormArray;
    hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(null));
  }

  //hàm này để xóa dòng của form mainForm5; theo thiết kế mới
  removeRowV2(rowIndex: number) {
    let hoaDonSaiSotFormArray = this.mainForm5.get('hoaDonSaiSots') as FormArray;
    hoaDonSaiSotFormArray.removeAt(rowIndex);
  }

  //hàm này để thêm dòng
  addRow(loaiApDung: number) {
    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    if (loaiApDung === 2) {
      hoaDonSaiSotFormArray = this.mainForm2.get('hoaDonSaiSots') as FormArray;
    }
    else if (loaiApDung === 3) {
      hoaDonSaiSotFormArray = this.mainForm3.get('hoaDonSaiSots') as FormArray;
    }
    else if (loaiApDung === 4) {
      hoaDonSaiSotFormArray = this.mainForm4.get('hoaDonSaiSots') as FormArray;
    }

    hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(null));
  }

  addRowKhac() {
    let hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;
    let array = this.createChiTietHoaDonSaiSot(null);
    hoaDonSaiSotFormArray.push(array);
    this.totalRecords = hoaDonSaiSotFormArray.controls.length;
    this.changeKyHieu23(this.totalRecords - 1, hoaDonSaiSotFormArray.controls[this.totalRecords - 1].get('kyHieu23').value);
  }

  removeRowKhac(index: number) {
    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    hoaDonSaiSotFormArray.removeAt(index);
    this.totalRecords = hoaDonSaiSotFormArray.controls.length;
  }

  //hàm này để lựa chọn dòng dữ liệu
  selectRow(loaiApDung: number, data: any, index: number) {
    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    if (loaiApDung === 2) {
      hoaDonSaiSotFormArray = this.mainForm2.get('hoaDonSaiSots') as FormArray;
      this.indexSelectedRow2 = index;
    }
    else if (loaiApDung === 3) {
      hoaDonSaiSotFormArray = this.mainForm3.get('hoaDonSaiSots') as FormArray;
      this.indexSelectedRow3 = index;
    }
    else if (loaiApDung === 4) {
      hoaDonSaiSotFormArray = this.mainForm4.get('hoaDonSaiSots') as FormArray;
      this.indexSelectedRow4 = index;
    }

    hoaDonSaiSotFormArray.controls.forEach((element, index) => {
      element.value.tichChon = false;
    });

    data.tichChon = true;
  }

  //hàm này để xóa dòng đang chọn
  removeRow(loaiApDung: number) {
    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    if (loaiApDung === 2) {
      if (this.indexSelectedRow2 > -1) {
        hoaDonSaiSotFormArray = this.mainForm2.get('hoaDonSaiSots') as FormArray;
        hoaDonSaiSotFormArray.removeAt(this.indexSelectedRow2);
        this.indexSelectedRow2 = -1;
      }
    }
    else if (loaiApDung === 3) {
      if (this.indexSelectedRow3 > -1) {
        hoaDonSaiSotFormArray = this.mainForm3.get('hoaDonSaiSots') as FormArray;
        hoaDonSaiSotFormArray.removeAt(this.indexSelectedRow3);
        this.indexSelectedRow3 = -1;
      }
    }
    else if (loaiApDung === 4) {
      if (this.indexSelectedRow4 > -1) {
        hoaDonSaiSotFormArray = this.mainForm4.get('hoaDonSaiSots') as FormArray;
        hoaDonSaiSotFormArray.removeAt(this.indexSelectedRow4);
        this.indexSelectedRow4 = -1;
      }
    }
  }

  //hàm này để mở filter trên cột
  onVisibleFilterCol(event: any, colName: any, template: any) {
    if (this.checkedSuDungLoai === false) return;
    this.mapOfStatusFilteredCols[colName] = event;
    let inputFilterColData = this.displayDataTemp.filterColumns.find(x => x.colKey === colName);
    if (inputFilterColData == null) {

      let inputFilterColDataParam: any = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
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
  onFilterCol(rs: any, taiLaiDSHoaDonSaiSot = true) {
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
        if (item.colKey === 'chungTu') labelHienThi = 'Chứng từ/hoá đơn liên quan: ';
        else if (item.colKey === 'maCQTCap') labelHienThi = 'Mã CQT cấp: ';
        else if (item.colKey === 'soHoaDon') labelHienThi = 'Số hóa đơn điện tử: ';

        this.viewConditionList.push({ key: item.colKey, label: labelHienThi, value: item.colValue });
      }
    }

    //nếu truyền vào taiLaiDSHoaDonSaiSot = true thì mới tải lại danh sách hóa đơn sai sót
    if (taiLaiDSHoaDonSaiSot) {
      this.loadDSHoaDonSaiSot();
    }
  }

  //hàm này để xóa giá trị lọc đang hiển thị
  removeFilter(filter: any, taiLaiDSHoaDonSaiSot = true) {
    let inputFilterColValue = {
      colKey: filter.key,
      colValue: null,
      filterCondition: FilterCondition.Chua,
      isFilter: false,
      status: false
    };
    this.onFilterCol(inputFilterColValue, taiLaiDSHoaDonSaiSot);
  }

  //hàm này để kiểm tra nếu nhập ngày lập hóa đơn chưa hợp lệ
  nhapNgayLapHoaDon(event: any, data: any) {
    if (moment(moment(event).format('YYYY-MM-DD')) > moment(this.ngayLapThongBao)) {
      data.value.errorNgayLapHoaDon = true;
    }
    else {
      data.value.errorNgayLapHoaDon = false;
    }
  }

  //hàm này để hiển thị ngày tháng năm ra tooltip
  hienThiNgay(input: any) {
    if (input == null || input == '') return '<Ngày lập hóa đơn> không được để trống';
    return moment(input).format('DD/MM/YYYY');
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
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

  //khi tích chọn thông báo hủy/giải trình của NNT khác
  //hàm này được dùng khi thay đổi loại áp dụng hóa đơn
  changeLoaiApDungHoaDon(event: any, hinhThucHoaDon = null) {
    if (event) {
      if (event != this.oldLoaiApDungHoaDonKhac) {
        if (this.mainFormKhac.get('hoaDonSaiSots').dirty) {
          var modal1 = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '400px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Thay đổi loại áp dụng hóa đơn",
              msContent: "Dữ liệu sẽ bị xóa và sẽ phải nhập lại từ đầu khi bạn thay đổi loại áp dụng hóa đơn. Bạn có chắc chắn muốn thay đổi không?",
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msOkButtonInBlueColor: true,
              msOnOk: () => {
                let radioButtons = document.getElementsByClassName('loaiApDungHoaDon ant-radio-button-wrapper');
                console.log(radioButtons);
                console.log(radioButtons.length)
                for (let i = 0; i < radioButtons.length; i++) {
                  console.log(radioButtons[i]);
                  let el = radioButtons[i] as HTMLElement;
                  let nzvalue = radioButtons[i].getAttribute('data-value');
                  console.log(nzvalue);
                  if (event.toString() != nzvalue)
                    el.classList.remove('ant-radio-button-wrapper-checked');
                }

                for (let i = 0; i < radioButtons.length; ++i) {
                  let el = radioButtons[i] as HTMLElement;
                  let nzvalue = radioButtons[i].getAttribute('data-value');
                  if (event.toString() == nzvalue) {
                    if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
                    el.classList.remove('switchSelectHover');
                  } else {
                    el.classList.add('switchSelectHover');
                  }
                }

                //thay đổi loại áp dụng hóa đơn trên chi tiết
                let hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

                //thay đổi hình thức hóa đơn
                if (event == '1') {
                  if (hinhThucHoaDon) {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
                    this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
                  }
                  else {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('1');
                    this.changeHinhThucHoaDonKhac('1');
                  }
                }
                else if (event == '2' || event == '3') {
                  if (event == '2') {
                    this.list_MauSoHoaDon_SoLienHoaDon = [];
                    for (let i = 0; i <= 3; i++) {
                      this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                    }

                    for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();
                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('');
                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').disable();
                    }
                  }
                  else if (event == '3') {
                    //reset số liên hóa đơn
                    this.list_MauSoHoaDon_SoLienHoaDon = [];
                    for (let i = 0; i <= 9; i++) {
                      this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                    }

                    for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();

                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('');
                      hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').disable();

                      //reset lại list_LoaiHoaDon
                      this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc;
                      hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_LoaiHoaDon').setValue('01GTKT');
                    }
                  }

                  if (hinhThucHoaDon) {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
                    this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
                  }
                  else {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('E');
                    this.changeHinhThucHoaDonKhac('E');
                  }
                }
                else if (event == '4') {
                  //reset lại list_LoaiHoaDon
                  this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc.filter(x => x.value != '06HDXK');

                  //reset số liên hóa đơn
                  this.list_MauSoHoaDon_SoLienHoaDon = [];
                  for (let i = 1; i <= 3; i++) {
                    this.list_MauSoHoaDon_SoLienHoaDon.push(i);
                  }

                  for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                    hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(3);
                    hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').enable();
                  }

                  if (hinhThucHoaDon) {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
                    this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
                  }
                  else {
                    this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('P_CT');
                    this.changeHinhThucHoaDonKhac("P_CT")
                  }
                }

                if (event != '1' && event != '2') {
                  for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                    hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValue(null);
                    hoaDonSaiSotFormArray.controls[i].get('maCQT12').setValue(null);
                    hoaDonSaiSotFormArray.controls[i].get('maCQTToKhaiChapNhan').setValue(null);
                    hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').setValue(null);
                  }
                }
                else {
                  if (event == '1') {
                    if (this.thamSoForm.get('hinhThucHoaDonKhac').value == '0') {
                      for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                        hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                        hoaDonSaiSotFormArray.controls[i].get('maCQTCap').disable();
                      }
                    }
                    else {
                      for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                        hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
                      }
                    }
                  }
                }

                this.oldLoaiApDungHoaDonKhac = event;
                this.checked = false;
              },
              msOnClose: () => {
                this.thamSoForm.get('loaiApDungHoaDonKhac').setValue(this.oldLoaiApDungHoaDonKhac);
                this.thamSoForm.get('loaiApDungHoaDonKhacHienThi').setValue(this.oldLoaiApDungHoaDonKhac);
              }
            }
          });
          modal1.afterOpen.subscribe(() => {
            let checkedRadio = document.getElementsByClassName('loaiApDungHoaDon xanhButton switchSelectHover ant-radio-button-wrapper ant-radio-button-wrapper-checked')
            for (let i = 0; i < checkedRadio.length; i++) {
              let el = checkedRadio[i] as HTMLElement;
              el.classList.remove('ant-radio-button-wrapper-checked');
            }
          })
        }
        else {
          let radioButtons = document.getElementsByClassName('loaiApDungHoaDon');
          console.log(radioButtons);
          console.log(radioButtons.length)
          for (let i = 0; i < radioButtons.length; i++) {
            console.log(radioButtons[i]);
            let el = radioButtons[i] as HTMLElement;
            let nzvalue = radioButtons[i].getAttribute('data-value');
            console.log(nzvalue);
            if (event.toString() != nzvalue)
              el.classList.remove('ant-radio-button-wrapper-checked');
          }

          for (let i = 0; i < radioButtons.length; ++i) {
            let el = radioButtons[i] as HTMLElement;
            let nzvalue = radioButtons[i].getAttribute('data-value');
            if (event.toString() == nzvalue) {
              if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
              el.classList.remove('switchSelectHover');
            } else {
              el.classList.add('switchSelectHover');
            }
          }

          //thay đổi loại áp dụng hóa đơn trên chi tiết
          let hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;


          hoaDonSaiSotFormArray.clear();
          // hoaDonSaiSotFormArray.push(this.createChiTietHoaDonSaiSot(null));

          // this.totalRecords = hoaDonSaiSotFormArray.length;

          // hoaDonSaiSotFormArray = this.mainFormKhac.get('hoaDonSaiSots') as FormArray;

          //thay đổi hình thức hóa đơn
          if (event == '1') {
            console.log(hinhThucHoaDon);
            if (hinhThucHoaDon) {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
              this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
            }
            else {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('1');
              this.changeHinhThucHoaDonKhac('1');
            }
          }
          else if (event == '2' || event == '3') {
            if (event == '2') {
              this.list_MauSoHoaDon_SoLienHoaDon = [];
              for (let i = 0; i <= 3; i++) {
                this.list_MauSoHoaDon_SoLienHoaDon.push(i);
              }

              for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();
                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('');
                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').disable();
              }
            }
            else if (event == '3') {
              //reset số liên hóa đơn
              this.list_MauSoHoaDon_SoLienHoaDon = [];
              for (let i = 0; i <= 9; i++) {
                this.list_MauSoHoaDon_SoLienHoaDon.push(i);
              }

              for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(0);
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').disable();

                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').setValue('');
                hoaDonSaiSotFormArray.controls[i].get('kyHieuHoaDon_2KyTuDau_DatIn').disable();

                //reset lại list_LoaiHoaDon
                this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc;
                hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_LoaiHoaDon').setValue('01GTKT');
              }
            }

            if (hinhThucHoaDon) {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
              this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
            }
            else {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('E');
              this.changeHinhThucHoaDonKhac('E');
            }
          }
          else if (event == '4') {
            //reset lại list_LoaiHoaDon
            this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc.filter(x => x.value != '06HDXK');

            //reset số liên hóa đơn
            this.list_MauSoHoaDon_SoLienHoaDon = [];
            for (let i = 1; i <= 3; i++) {
              this.list_MauSoHoaDon_SoLienHoaDon.push(i);
            }

            for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
              hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').setValue(3);
              hoaDonSaiSotFormArray.controls[i].get('mauSoHoaDon_SoLienHoaDon').enable();
            }

            if (hinhThucHoaDon) {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue(hinhThucHoaDon);
              this.changeHinhThucHoaDonKhac(hinhThucHoaDon);
            }
            else {
              this.thamSoForm.get('hinhThucHoaDonKhacHienThi').setValue('P_CT');
              this.changeHinhThucHoaDonKhac("P_CT")
            }
          }

          if (event != '1' && event != '2') {
            for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
              hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValue(null);
              hoaDonSaiSotFormArray.controls[i].get('maCQT12').setValue(null);
              hoaDonSaiSotFormArray.controls[i].get('maCQTToKhaiChapNhan').setValue(null);
              hoaDonSaiSotFormArray.controls[i].get('maCQTChuoiKyTuSo').setValue(null);
            }
          }
          else {
            if (event == '1') {
              if (this.thamSoForm.get('hinhThucHoaDonKhac').value == '0') {
                for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                  hoaDonSaiSotFormArray.controls[i].get('maCQTCap').clearValidators();
                  hoaDonSaiSotFormArray.controls[i].get('maCQTCap').disable();
                }
              }
              else {
                for (let i = 0; i < hoaDonSaiSotFormArray.length; i++) {
                  hoaDonSaiSotFormArray.controls[i].get('maCQTCap').setValidators(CheckValidMaCQTCapSaiSot);
                }
              }
            }
          }

          this.oldLoaiApDungHoaDonKhac = event;
          this.checked = false;
        }

      }
      else {
        let radioButtons = document.getElementsByClassName('loaiApDungHoaDon');
        for (let i = 0; i < radioButtons.length; i++) {
          let el = radioButtons[i] as HTMLElement;
          let nzvalue = radioButtons[i].getAttribute('data-value');
          if (event.toString() != nzvalue)
            el.classList.remove('ant-radio-button-wrapper-checked');
        }

        for (let i = 0; i < radioButtons.length; ++i) {
          let el = radioButtons[i] as HTMLElement;
          let nzvalue = radioButtons[i].getAttribute('data-value');
          if (event.toString() == nzvalue) {
            if (!el.classList.contains('ant-radio-button-wrapper-checked')) el.classList.add('ant-radio-button-wrapper-checked')
            el.classList.remove('switchSelectHover');
          } else {
            el.classList.add('switchSelectHover');
          }
        }
        this.oldLoaiApDungHoaDonKhac = event;
        return;
      }
    }
  }

  //chuyển số hóa đơn sang 7 ký tự nếu chưa đủ
  changeSoHoaDon(index: number, data: any) {
    let loaiApDungHoaDon = Number.parseInt(this.mainFormKhac.get(`hoaDonSaiSots.${index}.loaiApDungHoaDon`).value);
    console.log(loaiApDungHoaDon);
    if (loaiApDungHoaDon == 1) return;

    let soHoaDon = data.target.value;
    if (soHoaDon != null && soHoaDon != '') {
      soHoaDon = this.padLeft(soHoaDon, 8);
      this.mainFormKhac.get(`hoaDonSaiSots.${index}.soHoaDon`).setValue(soHoaDon);
    }
  }

  //hàm này để thêm số 0 vào đầu số hóa đơn nếu chưa đủ 7 ký tự
  padLeft(value: string, size: number) {
    while (value.length < size) value = "0" + value;
    return value;
  }

  //disable mã CQT cấp
  disableMaCQTCap(loaiApDungHoaDon: number, index: number) {
    if (loaiApDungHoaDon == 1 || loaiApDungHoaDon == 2) {
      this.mainForm5.get(`hoaDonSaiSots.${index}.maCQTCap`).enable();
    }
    else {
      this.mainForm5.get(`hoaDonSaiSots.${index}.maCQTCap`).setValue(null);
      this.mainForm5.get(`hoaDonSaiSots.${index}.maCQTCap`).disable();
    }
  }

  //kiểm tra đã lập thông báo sai sót cho hóa đơn đã nhập chưa
  kiemTraDaLapThongBaoSaiSot() {
    const hoaDonSaiSotFormArray = this.mainForm5.get('hoaDonSaiSots') as FormArray;
    this.thongDiepGuiCQTService.KiemTraHoaDonDaLapThongBaoSaiSot(hoaDonSaiSotFormArray.value).subscribe((res: any) => {
      if (res) {
        if (res.length > 0) {
          //mở ra câu hỏi
          let cacHoaDonDaLapThongBao = '';
          for (let i = 0; i < res.length; i++) {
            cacHoaDonDaLapThongBao += (i + 1).toString() + '. Ký hiệu mẫu số hóa đơn <b>' + res[i].mauHoaDon + '</b> Ký hiệu hóa đơn <b>' + res[i].kyHieuHoaDon + '</b> Số hóa đơn <b>' + res[i].soHoaDon + '</b> Ngày <b>' + moment(res[i]).format('DD/MM/YYYY') + '</b><br>';
          }

          let cauThongBao = 'Đã tồn tại thông báo hóa đơn điện tử có sai sót cho các hóa đơn sau:<br>';
          cauThongBao = cauThongBao + cacHoaDonDaLapThongBao;
          cauThongBao = cauThongBao + 'Bạn có muốn tiếp tục lập thông báo hóa đơn điện tử có sai sót cho các hóa đơn này không?';

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '370px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msOkButtonInBlueColor: true,
              msMessageType: MessageType.Confirm,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msTitle: 'Tiếp tục lập thông báo hóa đơn điện tử có sai sót',
              msContent: cauThongBao,
              msOnOk: () => {
                //tiếp tục kiểm tra điều kiện trùng hóa đơn hệ thống
              }
            },
            nzFooter: null
          });
        }
        else {

        }
      }
      else {

      }
    });
  }


  //hàm này để chọn lại hóa đơn, khi lập 04 từ cột thông tin sai sót ở các tab hóa đơn
  chonLaiHoaDon() {
    if (this.lapTuHoaDonDienTuId == '') return;

    let mauSoHoaDon = '';
    let kyHieuHoaDon = '';
    let soHoaDon = '';
    let ngayHoaDon = '';

    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    let listTichChon = hoaDonSaiSotFormArray.value;
    if (listTichChon.length > 0) {
      //chỉ cần lấy 1 dòng dữ liệu vì dữ liệu chỉ có 1 dòng
      let data = listTichChon[0];
      mauSoHoaDon = data.mauHoaDon;
      kyHieuHoaDon = data.kyHieuHoaDon;
      soHoaDon = data.soHoaDon;
      ngayHoaDon = data.ngayLapHoaDonText;
    }

    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '535px',
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: 'Chọn lại hóa đơn điện tử có sai sót',
        msContent: 'Bạn đang thực hiện lập thông báo hóa đơn điện tử có sai sót cho hóa đơn có Ký hiệu mẫu số hóa đơn <span class = "colorChuYTrongThongBao"><b>' +
          mauSoHoaDon + '</b></span> Ký hiệu hóa đơn <span class = "colorChuYTrongThongBao"><b>' + kyHieuHoaDon +
          '</b></span> Số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> Ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span>.<br>Bạn có thực sự muốn dừng lập thông báo hóa đơn điện tử có sai sót cho hóa đơn này không?',
        msOnOk: () => {
          const modalKhac = this.modalService.create({
            nzTitle: 'Chọn hóa đơn điện tử có sai sót',
            nzContent: ChonHoaDonSaiSotModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '98%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              lapTuHoaDonDienTuId: '',
              data: null,
              ngayLapThongBao: this.ngayLapThongBao
            },
            nzFooter: null
          });
          modalKhac.afterClose.subscribe((rs: any) => {
            if (rs) {
              rs.daChonLaiHoaDonKhac = true;
              this.modal.destroy(rs);
            }
          });
        }
      },
      nzFooter: null
    });
  }

  //hàm này để change tích chọn phân loại hóa đơn
  changeTichChonPhanLoaiHD(event: any, index: number) {
    if (event) {
      let phanLoaiHDSaiSotMacDinh = this.mainForm.get(`hoaDonSaiSots.${index}.phanLoaiHDSaiSotMacDinh`).value;
      if (phanLoaiHDSaiSotMacDinh != null) {
        this.mainForm.get(`hoaDonSaiSots.${index}.phanLoaiHDSaiSot`).setValue(phanLoaiHDSaiSotMacDinh);
      }
    }

    //tích/bỏ tích chọn tất cả phân loại hóa đơn
    let hoaDonSaiSotFormArray = this.mainForm.get('hoaDonSaiSots') as FormArray;
    let listTichChonPhanLoaiHD = hoaDonSaiSotFormArray.value.filter(x => x.tichChonPhanLoaiHD);
    this.tatCaPhanLoaiHDChecked = (listTichChonPhanLoaiHD.length == this.totalRecords);
  }

  //hàm này để tách ra chuỗi chứng từ liên quan
  //chuỗi chứng từ liên quan có kèm cả id của chứng từ
  getChungTuLienQuan(chungTuLienQuan: string) {
    if (chungTuLienQuan == null || chungTuLienQuan == '') return '';
    if (chungTuLienQuan.indexOf(';') >= 0) {
      var chuoiChungTu = chungTuLienQuan.split(';');
      return chuoiChungTu[0]; //index = 0 là tên hiển thị của chứng từ liên quan
      //index = 1: id của chứng từ liên quan
    }
    else {
      return chungTuLienQuan;
    }
  }
}
