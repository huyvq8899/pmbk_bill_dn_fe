import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { LoiTrangThaiPhatHanh } from 'src/app/enums/LoiTrangThaiPhatHanh.enum';
import * as printJS from 'print-js';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoaDonParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { getHeightBangKe, getListEmptyBangKe, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { XoaBoHoaDonModalComponent } from '../xoa-bo-hoa-don-modal/xoa-bo-hoa-don-modal.component';
import { LapBienBanXoaBoHoaDonModalComponent } from '../lap-bien-ban-xoa-bo-hoa-don/lap-bien-ban-xoa-bo-hoa-don.modal.component';
import { CookieConstant } from 'src/app/constants/constant';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { GlobalConstants } from 'src/app/shared/global';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-lap-bien-ban-huy-hoa-don',
  templateUrl: './list-lap-bien-ban-huy-hoa-don.component.html',
  styleUrls: ['./list-lap-bien-ban-huy-hoa-don.component.scss']
})

export class ListLapBienBanHuyHoaDonComponent extends TabShortKeyEventHandler implements OnInit, AfterViewChecked {
  boKyHieuHoaDons: any;
  permission: boolean = false;
  thaoTacHoaDonSaiSot: any[]=[];
  clickThem() {
    throw new Error('Method not implemented.');
  }
  clickXem() {
    throw new Error('Method not implemented.');
  }
  clickSua(isCopy: any) {
    throw new Error('Method not implemented.');
  }
  clickXoa() {
    throw new Error('Method not implemented.');
  }

  @Input() data: any;
  timKiemTheos: Array<{ value: any, label: any, checked: boolean }> = [
    // { value: 'LoaiHoaDon', name: 'Loại hóa đơn', checked: false },
    { value: 'MauSo', label: 'Ký hiệu mẫu số hóa đơn', checked: false },
    { value: 'KyHieu', label: 'Ký hiệu hóa đơn', checked: false },
    { value: 'SoHoaDon', label: 'Số hóa đơn', checked: true },
    { value: 'MaSoThue', label: 'Mã số thuế', checked: false },
    { value: 'MaKhachHang', label: 'Mã khách hàng', checked: false },
    { value: 'TenKhachHang', label: 'Tên khách hàng', checked: false },
    { value: 'NguoiMuaHang', label: 'Người mua hàng', checked: false },
  ];
  @Input() formData: any;
  @Input() isAddNew: boolean;
  @Input() fbEnableEdit: boolean = false;
  subcription: Subscription;
  isPhatHanh = false;
  spinning = false;
  isCheckInput = false;
  fdata: any;
  scrollConfig = { x: '1300px', y: '35vh' };
  form: FormGroup;
  nguoiChuyenDois: any[] = [];
  selectedIndex: number = 0;
  thongTu: string = "";
  displayDatas: any[] = [];
  listDSRutGonBoKyHieuHoaDon: any[] = [];
  kyKeKhaiThueGTGT = localStorage.getItem(CookieConstant.KYKEKHAITHUE) == 'Quy' ? 6 : 5;
  tempToDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).endOf('quarter').format('YYYY-MM-DD') : moment().endOf('month').format('YYYY-MM-DD');
  tempFormDate = this.kyKeKhaiThueGTGT == 6 ? moment().quarter(moment(moment().format('YYYY-MM-DD')).quarter()).startOf('quarter').format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');

  displayData: HoaDonParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: this.tempFormDate,
    oldToDate: this.tempToDate,
    fromDate: this.tempFormDate,
    toDate: this.tempToDate,
    Ky: this.kyKeKhaiThueGTGT,
    TrangThaiPhatHanh: 3,
    LoaiHoaDon: 100,//để phân biệt là vào list hay ở tab và check điều kiện
    TrangThaiHoaDonDienTu: -1,
    TrangThaiChuyenDoi: -1,
    TrangThaiGuiHoaDon: -1,
    TrangThaiBienBanXoaBo: 0,//lấy Hóa đơn chưa lập biên bản
    TrangThaiXoaBo: 100,
    TimKiemTheo: {},
    Filter: {},
    filterColumns: [],
    LoaiNghiepVu: 1
  };
  urlTools = 'https://hoadonbachkhoa.pmbk.vn/tools/BKSOFT-KYSO-SETUP.zip';
  ddtp = new DinhDangThapPhan();
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  loaiKey: number = 1;
  keyword: string = '';
  total = 0;
  pageSizeOptions: number[] = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  loading = false;
  listOfSelected: any[] = [];
  listPaging: any[] = [];
  mapOfCheckedId: any = {};
  dataSelected: any;
  listOfDisplayData: any[] = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  hoSoHDDT: any;
  kys = GetList();
  soBB: string;
  hoaDonDienTuForm: any;
  checktimKiemTheoDefault: any;
  indeterminate = true;
  txtHD_PXK_UPPER: string = "Hóa đơn";
  txtHD_PXK: string = "hóa đơn";
  constructor(
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private hoSoHDDTService: HoSoHDDTService,
    private userService: UserService,
    private modalService: NzModalService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private fb: FormBuilder
  ) {
    super();
  }
  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.displayData.LoaiNghiepVu = 2;
      this.txtHD_PXK_UPPER="PXK";
      this.txtHD_PXK = "PXK";
    }
    else if(_url.includes('hoa-don-tu-mtt')){
      this.displayData.LoaiNghiepVu = 3;
    }

    this.spinning = true;
    this.createForm();
    this.changeKy(this.kyKeKhaiThueGTGT);
    this.numberBangKeCols = Array(12).fill(0);
    this.lstBangKeEmpty = getListEmptyBangKe(this.displayDatas);
    this.scrollConfig.y = getHeightBangKe() + 'px';
    this.forkJoin().subscribe((res: any[]) => {
      this.listDSRutGonBoKyHieuHoaDon = res[1];
      this.boKyHieuHoaDons = res[2].map(x=>x.boKyHieuHoaDonId);
      var phanQuyen = localStorage.getItem('KTBKUserPermission');
      if (phanQuyen != 'true') {
        var pq = JSON.parse(phanQuyen);
        var mauHoaDonDuocPQ = pq.mauHoaDonIds;
        this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x=>mauHoaDonDuocPQ.indexOf(x) >= 0);
        this.thaoTacHoaDonSaiSot = pq.functions.find(x=>x.functionName == "ThongDiepGui") ? pq.functions.find(x=>x.functionName == "ThongDiepGui").thaoTacs : [];
      }
      else this.permission = true;

      this.spinning = false;
    });

  }
  createForm() {
    this.form = this.fb.group({
      ky: this.kyKeKhaiThueGTGT,
      fromDate: [null],
      toDate: [null],
      giaTri: [null],
      myChoices: new FormArray([]),

    });

    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }
  changeKy(event: any) {
    const params = this.form.getRawValue();
    SetDate(event, params);
    this.form.patchValue({
      fromDate: params.fromDate,
      toDate: params.toDate
    });
  }
  //hàm này để bắt sự kiện onchange của textbox GiaTri
  changeGiaTri(event: any) {
    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (event == null || event == '') {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else {
      this.form.controls['giaTri'].clearValidators();
      this.form.controls['giaTri'].updateValueAndValidity();
    }
  }
  //hàm này để bắt sự kiện onchange của textbox GiaTri
  onchange_timKiemTheos(event: any) {
    let checkBoxes = document.querySelectorAll('.ckbcheckBox');
    if (this.timKiemTheos.filter(x => x.checked).length == 0) {
      checkBoxes.forEach((ckbFormControl: any) => {
        if(ckbFormControl.outerText != undefined){
          if (ckbFormControl.outerText == "Số hóa đơn") {
          ckbFormControl.childNodes[0].childNodes[0].click();
          if(ckbFormControl.childNodes[0].childNodes[0].checked ==false){
            ckbFormControl.childNodes[0].childNodes[0].click();
          }
        }}
      });
    }
  }
  getData() {

    //kiểm tra xem đã tích chọn tùy chọn nào thì bắt buộc nhập tìm kiếm theo
    if (this.timKiemTheos.filter(x => x.checked).length > 0) {
      if (this.form.controls['giaTri'].value == null || this.form.controls['giaTri'].value == '') {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else {
      this.form.controls['giaTri'].clearValidators();
      this.form.controls['giaTri'].updateValueAndValidity();
      setStyleTooltipError(false);
    }
    const params = this.form.getRawValue();


    // if (timKiemTheoChecked.length > 0 && params.giaTri) {
    //   var result = {};
    //   for (var i = 0; i < timKiemTheoChecked.length; i++) {
    //     result[timKiemTheoChecked[i]] = params.giaTri;
    //   }
    //   this.displayData.TimKiemTheo = result;
    // } else {
    //   this.displayData.TimKiemTheo = null;
    //   this.displayData.GiaTri = params.giaTri;
    // }

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    var giaTris = params.giaTri != "" ? params.giaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i] || null;
      }
      this.displayData.TimKiemTheo = result;
    } else {
      this.displayData.TimKiemTheo = null;
      this.displayData.GiaTri = params.giaTri;
    }
    this.displayData.fromDate = params.fromDate;
    this.displayData.toDate = params.toDate;
    this.filterTable();
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.label.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  forkJoin() {
    return forkJoin([
      this.hoaDonDienTuService.GetListTimKiemTheoHoaDonThayThe(),
      this.hoaDonDienTuService.GetDSRutGonBoKyHieuHoaDon(),
      this.boKyHieuHoaDonService.GetAll()
    ]);
  }

  changeLoaiKey(event: any) {
    this.loaiKey = event;
  }

  blurDate() {
    CheckValidDateV2(this.displayData);
    const ky = GetKy(this.displayData);
    this.displayData.Ky = ky;
  }

  getThongTinCongTy() {
    this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
      this.hoSoHDDT = rs;
    })
  }

  changeKeyword(event: any) {
    this.keyword = event;
    if (this.loaiKey == 1) {
      this.displayData.Filter.soHoaDon = this.keyword;
    }
    else if (this.loaiKey == 2) {
      this.displayData.Filter.maSoThue = this.keyword;
    }
    else if (this.loaiKey == 3) {
      this.displayData.Filter.tenKhachHang = this.keyword;
    }
    else {
      this.displayData.Filter.hoTenNguoiMuaHang = this.keyword;
    }
  }

  filterTable() {
    this.loading = true;
    // console.log(this.listDSRutGonBoKyHieuHoaDon);
    this.displayData.MauHoaDonDuocPQ = this.boKyHieuHoaDons;
    this.hoaDonDienTuService.GetDSHoaDonDeXoaBo(this.displayData).subscribe((res: any) => {
      this.displayDatas = res;
      this.total = res.length;
      // if (res.currentPage != 0) this.displayData.PageNumber = res.currentPage;
      // this.displayData.PageSize = res.pageSize;
      // this.pageSizeOptions = [100, 150, 200];
      this.displayDatas.forEach(x => {
        //cài đặt giá trị ủy nhiệm lập hóa đơn
        let boKyHieuHD = this.listDSRutGonBoKyHieuHoaDon.find(y => y.kyHieu.toLowerCase() == (x.mauSo + x.kyHieu).toLowerCase());
        if (boKyHieuHD != null) {
          if (boKyHieuHD.uyNhiemLapHoaDon == 0) {
            x.uyNhiemLapHoaDon = 'Không đăng ký';
          }
          if (boKyHieuHD.uyNhiemLapHoaDon == 1) {
            x.uyNhiemLapHoaDon = 'Đăng ký';
          }
        }
      });
      // console.log(this.displayDatas);
      // if (this.displayDatas && this.displayDatas.length > 0) {
      //   this.selectedRow(this.displayDatas[0]);
      // }

      this.rowScrollerToViewEdit.scrollToRow(this.displayDatas, "hoaDonDienTuId").then((result) => {
        this.selectedRow(result);
      });
      this.loading = false;
    })
  }

  selectedRow(data: any) {
    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;
      this.displayDatas.forEach(element => {
        if (element !== data) {
          element.selected = false;
        }
      });
    }

    this.dataSelected = data;

  }
  // Checkbox
  // Checkbox
  refreshStatus(): void {
    let entries = Object.entries(this.mapOfCheckedId);
    for (const [prop, val] of entries) {
      const item = this.displayDatas.find(x => x.hoaDonDienTuId === prop);
      const selectedIndex = this.listOfSelected.findIndex(x => x.hoaDonDienTuId === prop);
      const index = this.listPaging.findIndex(x => x.hoaDonDienTuId === prop);

      if (val) {
        if (selectedIndex === -1) {
          this.listOfSelected.push(item);
          this.dataSelected = item;
        }
      } else {
        if (selectedIndex !== -1) {
          this.listOfSelected = this.listOfSelected.filter(x => x.hoaDonDienTuId !== prop);
          this.dataSelected = this.listOfSelected[0];
        }
      }

      if (index !== -1) {
        this.listPaging[index].selected = val;
      }
    }


  }
  ngAfterViewChecked() {

  }
  next() {
    if (!this.dataSelected) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '345px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: 'Bạn chưa chọn hóa đơn. Vui lòng kiểm tra lại!',
        },
        nzFooter: null
      });
      return;
    }
    this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs != null && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
        if (!rs.isDaLapThongBao) {
          //nếu chưa lập thông báo
          let mauHoaDon = this.dataSelected.mauSo;
          let kyHieuHoaDon = this.dataSelected.kyHieu;
          let soHoaDon = this.dataSelected.soHoaDon;
          let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
          let cauThongBao = 'Hóa đơn có Ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> Số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> Ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản hủy hóa đơn. Vui lòng kiểm tra lại!';

          const modal1 = this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msHasThongBaoSaiSot: true,
              msButtonLabelThongBaoSaiSot: 'Lập và gửi thông báo hóa đơn điện tử có sai sót tại đây',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: cauThongBao,
              msOnLapThongBaoSaiSot: () => {
                if(this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0){
                  this.userService.getAdminUser().subscribe((rs: any[])=>{
                    let content = '';
                    if(rs && rs.length > 0){
                      content = `
                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                    }
                    else{
                      content = `
                      Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
                    }
                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzStyle: { top: '100px' },
                      nzBodyStyle: { padding: '1px' },
                      nzWidth: '430px',
                      nzComponentParams: {
                        msMessageType: MessageType.Info,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                        msTitle: 'Phân quyền người dùng',
                        msContent: content,
                        msOnClose: ()=>{
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  });
                }
                //chưa lập thì mở thêm 04
                else {
                  let modal = this.modalService.create({
                    nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: '100%',
                    nzStyle: { top: '0px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      loaiThongBao: 1, //để mặc định, vì các hóa đơn hệ thống là 1
                      lapTuHoaDonDienTuId: this.dataSelected.hoaDonDienTuId,
                      isTraVeThongDiepChung: true
                    },
                    nzFooter: null
                  });
                  modal.afterClose.subscribe((rs: any) => {
                    console.log('đóng');
                    console.log(rs);
                    if (rs) {
                      GlobalConstants.ThongDiepChungId = rs;
                      window.location.href = "quan-ly/thong-diep-gui";
                    }
                  });
                }
              }
            },
            nzFooter: null
          });
          // modal1.afterClose.subscribe((rs: any) => {
          //   if(rs)this.openBB();
          // });
        }
        if (rs.isDaLapThongBao && !rs.isDaGuiThongBao) {
          //nếu đã lập thông báo nhưng chưa gửi CQT
          let mauHoaDon = this.dataSelected.mauSo;
          let kyHieuHoaDon = this.dataSelected.kyHieu;
          let soHoaDon = this.dataSelected.soHoaDon;
          let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
          let cauThongBao = 'Hóa đơn có Ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> Số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> Ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> đã thực hiện lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản hủy hóa đơn. Vui lòng kiểm tra lại!';

          const modal1 =  this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msHasThongBaoSaiSot: true,
              msButtonLabelThongBaoSaiSot: 'Gửi thông báo hóa đơn điện tử có sai sót tại đây',
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: cauThongBao,
              msOnLapThongBaoSaiSot: () => {
                if(this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0){
                  this.userService.getAdminUser().subscribe((rs: any[])=>{
                    let content = '';
                    if(rs && rs.length > 0){
                      content = `
                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x=>x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                    }
                    else{
                      content = `
                      Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
                    }
                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzStyle: { top: '100px' },
                      nzBodyStyle: { padding: '1px' },
                      nzWidth: '430px',
                      nzComponentParams: {
                        msMessageType: MessageType.Info,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                        msTitle: 'Phân quyền người dùng',
                        msContent: content,
                        msOnClose: ()=>{
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  });
                }
                //chưa lập thì mở thêm 04
                else {
                  const modal = this.modalService.create({
                    nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
                    nzContent: ThongBaoHoaDonSaiSotModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: '100%',
                    nzStyle: { top: '0px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      isView: true,
                      isTraVeThongDiepChung: true,
                      thongDiepGuiCQTId: this.dataSelected.thongDiepGuiCQTId
                    },
                    nzFooter: null
                  });
                  modal.afterClose.subscribe((rs: any) => {
                    console.log("quan-ly/thong-diep-gui");
                    console.log(rs);
                    if (rs) {
                      GlobalConstants.ThongDiepChungId = rs;
                      window.location.href = "quan-ly/thong-diep-gui";
                    }else{return;}
                  });
                }
              }
            },
            nzFooter: null
          });
          // modal1.afterClose.subscribe((rs: any) => {
          //   this.openBB();
          // });
        }
      }
      else {
        this.openBB();
      }
    });



  }
  openBB(){
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs == null) {
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Lập biên bản hủy hóa đơn",
          nzContent: LapBienBanXoaBoHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: "100%",
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: this.dataSelected,
            isAddNew: true,
            isEdit: true,
            ActivedModal: true
          },
          nzFooter: null,
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.modal.destroy(true);
          }
        });
      }
      else {
        const modal1 = this.modalService.create({
          nzTitle: "Lập biên bản hủy hóa đơn",
          nzContent: LapBienBanXoaBoHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: this.dataSelected,
            formData: rs,
            isAddNew: false,
            isEdit: false,
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.modal.destroy(true);
          }
        });
      }
    })
  }
  destroyModal() {
    this.modal.destroy();
  }
}

