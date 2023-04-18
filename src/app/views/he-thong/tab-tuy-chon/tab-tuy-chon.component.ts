import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { SearchEngine } from 'src/app/shared/searchEngine';
import * as moment from 'moment';
import { ThietLapTruongDuLieuService } from 'src/app/services/Config/thiet-lap-truong-du-lieu.service';
import { LoaiTruongDuLieu } from 'src/app/enums/LoaiTruongDuLieu.enum';
import { EnvService } from 'src/app/env.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { CKEditorComponent } from 'ckeditor4-angular/ckeditor.component';
import { SharedService } from 'src/app/services/share-service';
import { ActivatedRoute } from '@angular/router';
import { ChonThamSoBangKeSaiSotModalComponent } from '../../quan-ly/modals/bang-ke-hoa-don-sai-sot/chon-tham-so/chon-tham-so-bang-ke-sai-sot-modal.component';
import { UserService } from 'src/app/services/user.service';
import { GetInfoEsigncloudComponent } from '../modals/get-info-esigncloud/get-info-esigncloud.component';
declare var CKEDITOR: any;

@Component({
  selector: 'app-tab-tuy-chon',
  templateUrl: './tab-tuy-chon.component.html',
  styleUrls: ['./tab-tuy-chon.component.scss']
})
export class TabTuyChonComponent implements OnInit, AfterViewChecked {
  @ViewChild('ckEditor', { static: false }) editorComponent: CKEditorComponent;
  @ViewChild('ckEditorPXK', { static: false }) editorPXKComponent: CKEditorComponent;

  mainForm: FormGroup;
  spinning = false;
  searchCustomerOverlayStyle = {
    width: '500px'
  };
  ppTinhTyGiaXuatQuy = 1;
  daPhatSinhHangNhanHoGiaCong = false;
  coPhatSinhNghiepVuNgoaiTe = false;
  titleDaPhatSinhHangNhanHoGiaCong = '';
  oldTuyChons: any[] = [];
  tuyChons: any[] = [];
  taiKhoanKeToans: any[] = [];
  taiKhoanKeToansSearch: any[] = [];
  taiKhoanKeToanLais: any[] = [];
  taiKhoanKeToanLaisSearch: any[] = [];
  taiKhoanKeToanLos: any[] = [];
  taiKhoanKeToanLosSearch: any[] = [];
  tieuDeCanhBao: string = '';
  noiDungCanhBao: string = '';
  hienThiMoTaPhuongPhap: boolean = false;
  radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  selectedTab = 0;
  lsGiaoDichs: any[] = [];
  dinhDangSo = {
    IntDinhDangSoThapPhanTienQuyDoi: '',
    IntDinhDangSoThapPhanTienNgoaiTe: '',
    IntDinhDangSoThapPhanDonGiaQuyDoi: '',
    IntDinhDangSoThapPhanDonGiaNgoaiTe: '',
    IntDinhDangSoThapPhanSoLuong: '',
    IntDinhDangSoThapPhanTyGia: '',
    IntDinhDangSoThapPhanTyLePhanBo: '',
    IntDinhDangSoThapPhanHeSoTyLe: '',
    IntDinhDangSoThapPhanSoCong: ''
  };
  dinhDangThapPhanDefault = {
    IntDinhDangSoThapPhanTienQuyDoi: '0',
    IntDinhDangSoThapPhanTienNgoaiTe: '2',
    IntDinhDangSoThapPhanDonGiaQuyDoi: '2',
    IntDinhDangSoThapPhanDonGiaNgoaiTe: '2',
    IntDinhDangSoThapPhanSoLuong: '2',
    IntDinhDangSoThapPhanTyGia: '2',
    IntDinhDangSoThapPhanTyLePhanBo: '10',
    IntDinhDangSoThapPhanHeSoTyLe: '2',
    IntDinhDangSoThapPhanSoCong: '0'
  };
  loaiEmails: any[] = [
    // {
    //   id: -1, ten: 'Gửi hóa đơn nháp cho khách hàng'
    // },
    {
      id: 0, ten: 'Gửi hóa đơn cho khách hàng'
    },
    {
      id: 1, ten: 'Gửi thông báo xóa bỏ hóa đơn cho khách hàng'
    },
    {
      id: 2, ten: 'Gửi biên bản hủy hóa đơn cho khách hàng',
    },
    {
      id: 3, ten: 'Gửi biên bản điều chỉnh hóa đơn cho khách hàng',
    },
    {
      id: 4, ten: 'Gửi thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn cho khách hàng',
    },
  ];

  noiDungEmails: any[] = [];
  noiDungEmailGocs: any[] = [];
  noiDungEmailPXKs: any[] = [];
  noiDungEmailPXKGocs: any[] = [];
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  config: any;
  configPXK: any;
  noiDungEmail = "";
  noiDungEmailPXK = "";
  truongDuLieuHoaDonGTGTs: any[] = [];
  truongDuLieuHoaDonBHs: any[] = [];
  truongDuLieuHoaDonGTGTChiTiets: any[] = [];
  truongDuLieuHoaDonBHChiTiets: any[] = [];
  danhSachTruongTronsHD: any[] = [
    { tenTruong: '##tendonvi##', tenHienThi: 'Tên công ty' },
    { tenTruong: '##tenkhachhang##', tenHienThi: 'Tên khách hàng' },
    { tenTruong: '##tennguoinhan##', tenHienThi: 'Tên người nhận' },
    { tenTruong: '##loaihoadon##', tenHienThi: 'Loại hóa đơn' },
    { tenTruong: '##so##', tenHienThi: 'Số hóa đơn' },
    { tenTruong: '##mauso##', tenHienThi: 'Ký hiệu mẫu số hóa đơn' },
    { tenTruong: '##kyhieu##', tenHienThi: 'Ký hiệu hóa đơn' },
    { tenTruong: '##ngayhoadon##', tenHienThi: 'Ngày hóa đơn' },
    { tenTruong: '##linktracuu##', tenHienThi: 'Link tra cứu hóa đơn điện tử' },
    { tenTruong: '##lydoxoahoadon##', tenHienThi: 'Lý do xóa bỏ hóa đơn' },
    { tenTruong: '##lydohuy##', tenHienThi: 'Lý do hủy hóa đơn' },
    { tenTruong: '##lydodieuchinh##', tenHienThi: 'Lý do điều chỉnh hóa đơn' },
    { tenTruong: '##hotennguoimuahang_sai##', tenHienThi: 'Họ và tên người mua hàng có sai sót' },
    { tenTruong: '##hotennguoimuahang_dung##', tenHienThi: 'Họ và tên người mua hàng đúng' },
    { tenTruong: '##tendonvi_sai##', tenHienThi: 'Tên đơn vị có sai sót' },
    { tenTruong: '##tendonvi_dung##', tenHienThi: 'Tên đơn vị đúng' },
    { tenTruong: '##diachi_sai##', tenHienThi: 'Địa chỉ có sai sót' },
    { tenTruong: '##diachi_dung##', tenHienThi: 'Địa chỉ đúng' },
    { tenTruong: '##ten_sai##', tenHienThi: 'Họ và tên người mua hàng có sai sót' },
    { tenTruong: '##ten_dung##', tenHienThi: 'Họ và tên người mua hàng đúng' },
    { tenTruong: '##sodienthoai_sai##', tenHienThi: 'Số điện thoại có sai sót' },
    { tenTruong: '##sodienthoai_dung##', tenHienThi: 'Số điện thoại đúng' },
    { tenTruong: '##cancuoccongdan_sai##', tenHienThi: 'Căn cước công dân có sai sót' },
    { tenTruong: '##cancuoccongdan_dung##', tenHienThi: 'Căn cước công dân đúng' },
    { tenTruong: 'TRA CỨU', tenHienThi: 'Nút tra cứu hóa đơn' },
    { tenTruong: 'XEM BIÊN BẢN HỦY HÓA ĐƠN', tenHienThi: 'Nút tra cứu biên bản hủy hóa đơn' },
    { tenTruong: 'XEM BIÊN BẢN ĐIỀU CHỈNH HÓA ĐƠN', tenHienThi: 'Nút tra cứu biên bản điều chỉnh hóa đơn' },
  ];

  danhSachTruongTronsPXK: any[] = [
    { tenTruong: '##tendonvi##', tenHienThi: 'Tên công ty' },
    { tenTruong: '##tenkhachhang##', tenHienThi: 'Tên khách hàng' },
    { tenTruong: '##tennguoinhan##', tenHienThi: 'Tên người nhận' },
    { tenTruong: '##loaihoadon##', tenHienThi: 'Loại phiếu xuất kho' },
    { tenTruong: '##so##', tenHienThi: 'Số phiếu xuất kho' },
    { tenTruong: '##mauso##', tenHienThi: 'Ký hiệu mẫu số phiếu xuất kho' },
    { tenTruong: '##kyhieu##', tenHienThi: 'Ký hiệu phiếu xuất kho' },
    { tenTruong: '##ngayhoadon##', tenHienThi: 'Ngày phiếu xuất kho' },
    { tenTruong: '##linktracuu##', tenHienThi: 'Link tra cứu phiếu xuất kho điện tử' },
    { tenTruong: '##lydoxoahoadon##', tenHienThi: 'Lý do xóa bỏ phiếu xuất kho' },
    { tenTruong: '##lydohuy##', tenHienThi: 'Lý do hủy phiếu xuất kho' },
    { tenTruong: '##lydodieuchinh##', tenHienThi: 'Lý do điều chỉnh phiếu xuất kho' },
    { tenTruong: '##thongtingiaitrinhsaisot##', tenHienThi: 'Thông tin giải trình sai sót' },
    { tenTruong: 'TRA CỨU', tenHienThi: 'Nút tra cứu phiếu xuất kho' },
    { tenTruong: 'XEM BIÊN BẢN HỦY HÓA ĐƠN', tenHienThi: 'Nút tra cứu biên bản hủy phiếu xuất kho' },
    { tenTruong: 'XEM BIÊN BẢN ĐIỀU CHỈNH HÓA ĐƠN', tenHienThi: 'Nút tra cứu biên bản điều chỉnh phiếu xuất kho' },
  ];
  listCachTheHienSoTienThue = ['0', '-', '/', '\\', 'x', 'X', 'xx', 'XX', 'xxx', 'XXX', 'xxxx', 'XXXX', 'xxxxx', 'XXXXX'];
  loadingSearchDropdown = false;
  emailTab = 0;
  daXemThem = false;
  daThongBaoSauKhiThayDoiKySangThang = false;
  daThongBaoSauKhiThayDoiKySangQuy = false;
  coThaoTacChuyenKySangQuy = false;
  thaoTacs: any[] = [];
  phanQuyen: any;
  listQuyens: any;
  isEmailMacDinh = false;
  isEmailPXKMacDinh = false;
  chucNangChon: any;
  permission: boolean = false;
  listTenQuyens: any;
  visibleDropDownTruongTron = false;
  isFocusCKEditor = false;
  isFocusCKEditorPXK = false;
  oldNoiDungEmails: any[];
  oldNoiDungEmailPXKs: any[];
  note = '';
  userkeySign = '';
  signValue = 'B';
  changeChuKySo: boolean = false;
  radioIcropDisabled: boolean = false;
  isSelectChuKiCungShow = true;
  isSelectChuKiMemShow = false;
  dataChuKiMem: any;
  isVnd : boolean = true

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private tuyChonService: TuyChonService,
    private thietLapTruongDuLieuService: ThietLapTruongDuLieuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private env: EnvService,
    private sharedService: SharedService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }


  selectTuyChon(event: number, first = false) {
    switch (event) {
      case 1:
        this.chucNangChon = "TuyChonChung";
        break;
      case 2:
        this.chucNangChon = "DinhDangSo";
        break;
      case 3:
        this.chucNangChon = "ThongTinTaiNguyen";
        break;
      case 4:
        this.chucNangChon = "ThietLapCongCuKy";
        break;
      case 5:
        this.chucNangChon = "MayChuGuiEmail";
        break;
      case 6:
        this.chucNangChon = "EmailGuiHoaDon";
        break;
      default:
        break;
    }

    if (this.chucNangChon && !first) {
      if (this.listQuyens) this.thaoTacs = this.listQuyens.functions.find(x => x.functionName == this.chucNangChon).thaoTacs;
      if (this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0) {
        this.userService.getAdminUser().subscribe((users: any[]) => {
          if (users && users.length > 0) {
            this.note = `<span style="display: flex; justify-content: flex-start; align-items: center!important;">Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b>${users.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.</span>`
          }
          else {
            this.note = `<i nz-icon nzType="info" nzTheme="fill" style="color: #fff"></i>&nbsp;Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
          }
        })
      }
      else this.note = '';

      if (this.chucNangChon == "EmailGuiHoaDon") {
        this.config.readOnly = this.permission != true && this.thaoTacs.indexOf("SYS_UPDATE") < 0;
      }

      console.log(this.chucNangChon);
      if (this.chucNangChon == "EmailGuiPhieuXuatKho") {
        this.configPXK.readOnly = this.permission != true && this.thaoTacs.indexOf("SYS_UPDATE") < 0;
        console.log(this.configPXK.readOnly);
      }
    }
  }
  changeNCCDV(event: any) {
    this.mainForm.get('TenMayChu').disable();
    this.mainForm.get('SoCong').disable();

    if (event === '1') {
      this.mainForm.get('TenNguoiGui').setValue("HÓA ĐƠN BÁCH KHOA");
      this.mainForm.get('TenDangNhapEmail').setValue('hotro@pmbk.vn');
      this.mainForm.get('MatKhauEmail').setValue("pmbk@2019");
      this.mainForm.get('TenMayChu').setValue('mail9096.maychuemail.com');
      this.mainForm.get('SoCong').setValue(465);

      this.mainForm.get('TenDangNhapEmail').disable();
      this.mainForm.get('MatKhauEmail').disable();
    } else {
      this.mainForm.get('TenNguoiGui').setValue(null);
      this.mainForm.get('TenDangNhapEmail').setValue(null);
      this.mainForm.get('MatKhauEmail').setValue(null);
      this.mainForm.get('TenMayChu').setValue('smtp.gmail.com');
      this.mainForm.get('SoCong').setValue(587);

      this.mainForm.get('TenDangNhapEmail').enable();
      this.mainForm.get('MatKhauEmail').enable();
    }
  }
  ngOnInit() {
    this.phanQuyen = localStorage.getItem('KTBKUserPermission');

    if (this.phanQuyen == 'true') {
      this.permission = true;
      this.listTenQuyens = [
        'TuyChonChung',
        'DinhDangSo',
        // 'ThongTinTaiNguyen',
        'ThietLapCongCuKy',
        'MayChuGuiEmail',
        'EmailGuiHoaDon',
        'EmailGuiPhieuXuatKho'
      ]
    }
    else {
      this.listQuyens = JSON.parse(this.phanQuyen);
      console.log(this.listQuyens);
      this.listTenQuyens = this.listQuyens.functions.map(x => x.functionName);
    }
    //khi click ở bảng điều khiển
    this.activatedRoute.queryParams.subscribe(params => {
      const tabIndex = params['tab'];
      if (tabIndex) {
        this.selectedTab = tabIndex;
      }
    });

    this.spinning = true;
    this.config = {
      toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'editing'] },
        // { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'forms', groups: ['forms'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        // { name: 'tools', groups: ['tools'] }
      ],
      height: "55vh",
      extraPlugins: 'colorbutton',
      allowedContent: true,
      extraAllowedContent: '*(*);*{*}',
      removePlugins: 'elementspath'
    };

    this.configPXK = {
      toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'editing'] },
        // { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'forms', groups: ['forms'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        // { name: 'tools', groups: ['tools'] }
      ],
      height: "55vh",
      extraPlugins: 'colorbutton',
      allowedContent: true,
      extraAllowedContent: '*(*);*{*}',
      removePlugins: 'elementspath'
    };
    this.createForm();
    //this.mainForm.get('loaiEmail').setValue(this.loaiEmails[0].id);
    this.forkJoin().subscribe((res: any[]) => {
      this.oldTuyChons = JSON.parse(JSON.stringify(res[0]));
      this.tuyChons = JSON.parse(JSON.stringify(res[0]));
      this.noiDungEmails = res[1].filter(x => x.isDefault == false && this.loaiEmails.map(o => o.id).includes(x.loaiEmail));
      this.oldNoiDungEmails = res[1].filter(x => x.isDefault == false && this.loaiEmails.map(o => o.id).includes(x.loaiEmail));
      this.noiDungEmailGocs = res[1].filter(x => x.isDefault == true && this.loaiEmails.map(o => o.id).includes(x.loaiEmail));

      console.log('this.noiDungEmails: ', this.noiDungEmails);


      this.truongDuLieuHoaDonGTGTs = res[2];
      this.truongDuLieuHoaDonBHs = res[3];
      this.truongDuLieuHoaDonGTGTChiTiets = res[4];
      this.truongDuLieuHoaDonBHChiTiets = res[4];
      this.changeLoaiEmail(this.loaiEmails[0].id);

      if (this.listTenQuyens.indexOf('TuyChonChung') >= 0) {
        this.chucNangChon = "TuyChonChung"
      }
      else if (this.listTenQuyens.indexOf('DinhDangSo') >= 0) {
        this.chucNangChon = "DinhDangSo"
      }
      else if (this.listTenQuyens.indexOf('ThongTinTaiNguyen') >= 0) {
        this.chucNangChon = "ThongTinTaiNguyen"
      }
      else if (this.listTenQuyens.indexOf('ThietLapCongCuKy') >= 0) {
        this.chucNangChon = "ThietLapCongCuKy"
      }
      else if (this.listTenQuyens.indexOf('MayChuGuiEmail') >= 0) {
        this.chucNangChon = "MayChuGuiEmail"
      }
      else if (this.listTenQuyens.indexOf('EmailGuiHoaDon') >= 0) {
        this.chucNangChon = "EmailGuiHoaDon"
      }
      else if (this.listTenQuyens.indexOf('EmailGuiPhieuXuatKho') >= 0) {
        this.chucNangChon = "EmailGuiPhieuXuatKho"
      }

      console.log(this.listTenQuyens);
      if (this.chucNangChon) {
        if (this.listQuyens) this.thaoTacs = this.listQuyens.functions.find(x => x.functionName == this.chucNangChon) ? this.listQuyens.functions.find(x => x.functionName == this.chucNangChon).thaoTacs : [];

        if (this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0) {
          this.userService.getAdminUser().subscribe((users: any[]) => {
            if (users && users.length > 0) {
              this.note = `<span style="display: flex; justify-content: flex-start; align-items: center!important;">Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b>${users.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.</span>`
            }
            else {
              this.note = `<i nz-icon nzType="info" nzTheme="fill" style="color: #fff"></i>&nbsp;Bạn không có quyền <b>Sửa</b>. Nếu bạn muốn sửa thì liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
            }
            this.spinning = false;
          })
        }
        else {
          this.note = '';
          this.spinning = false;
        }


        if (this.chucNangChon == "EmailGuiHoaDon") {
          this.config.readOnly = this.permission != true && this.thaoTacs.indexOf("SYS_UPDATE") < 0 || this.isEmailMacDinh;
        }

        if (this.chucNangChon == "EmailGuiPhieuXuatKho") {
          this.configPXK.readOnly = this.permission != true && this.thaoTacs.indexOf("SYS_UPDATE") < 0 || this.isEmailPXKMacDinh;
        }
      }

      this.setFormValue();
      if (this.coPhatSinhNghiepVuNgoaiTe == true) {
        this.mainForm.get('BoolCoPhatSinhNghiepVuNgoaiTe').setValue(this.coPhatSinhNghiepVuNgoaiTe);
        this.getFormValue();
        this.saveChanges(false);
      }
      this.spinning = false;

      if (this.mainForm.get('PhatSinhBanHangTheoDGSauThue').value == false || this.mainForm.get('PhatSinhBanHangTheoDGSauThue').value == 'false') {
        this.mainForm.get('TinhTienTheoDGSauThue').disable();
        this.mainForm.get('TinhTienTheoSLvaDGSauThue').disable();
        this.mainForm.get('TinhSLTheoDGvaTienSauThue').disable();
      }

      let chk = document.querySelector('#TinhTienTheoDGSauThue .ant-checkbox-input');
      if (chk) {
        chk.addEventListener('click', this.tichChonTuyChon.bind(this, 'TinhTienTheoDGSauThue', true), false);
      }

      chk = document.querySelector('#TinhTienTheoSLvaDGSauThue .ant-checkbox-input');
      if (chk) {
        chk.addEventListener('click', this.tichChonTuyChon.bind(this, 'TinhTienTheoSLvaDGSauThue', true), false);
      }

      chk = document.querySelector('#TinhSLTheoDGvaTienSauThue .ant-checkbox-input');
      if (chk) {
        chk.addEventListener('click', this.tichChonTuyChon.bind(this, 'TinhSLTheoDGvaTienSauThue', true), false);
      }

      if (this.checkIsDefaultDinhDangThapPhan()) {
        this.changeDinhDangChuSo(parseInt(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTienQuyDoi), 'IntDinhDangSoThapPhanTienQuyDoi');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTienNgoaiTe, 'IntDinhDangSoThapPhanTienNgoaiTe');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanDonGiaQuyDoi, 'IntDinhDangSoThapPhanDonGiaQuyDoi');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanDonGiaNgoaiTe, 'IntDinhDangSoThapPhanDonGiaNgoaiTe');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanSoLuong, 'IntDinhDangSoThapPhanSoLuong');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTyGia, 'IntDinhDangSoThapPhanTyGia');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanHeSoTyLe, 'IntDinhDangSoThapPhanHeSoTyLe');
        this.changeDinhDangChuSo(this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTyLePhanBo, 'IntDinhDangSoThapPhanTyLePhanBo');
      }
      this.changeChuKySo = false;
      this.getTypeChuKi();
    });
  }
  getTypeChuKi() {
    this.tuyChonService.GetTypeChuKi().subscribe((rs) => {
      if (rs) {
        this.isSelectChuKiCungShow = true;
        this.signValue = null;
        this.isSelectChuKiMemShow = false;
      } else {
        this.isSelectChuKiCungShow = false;
        this.isSelectChuKiMemShow = true;
        this.signValue = 'B';
      }
    });
  }

  changeLoaiEmail(event: any,) {
    this.mainForm.get('loaiEmail').markAsPristine();

    if (this.noiDungEmails != null && this.noiDungEmails.length > 0) {
      const tieuDeEmail = this.noiDungEmails.find(x => x.loaiEmail == event).tieuDeEmail;
      const noiDungEmail = this.noiDungEmails.find(x => x.loaiEmail == event).noiDungEmail;
      if (noiDungEmail && tieuDeEmail) {
        this.mainForm.get('tieuDeEmail').setValue(tieuDeEmail);
        this.mainForm.get('noiDungEmail').setValue(noiDungEmail);
        this.noiDungEmail = noiDungEmail;

        const tieuDeDefault = this.noiDungEmailGocs.find(x => x.loaiEmail == event).tieuDeEmail;
        const noiDungDefault = this.noiDungEmailGocs.find(x => x.loaiEmail == event).noiDungEmail;

        if (tieuDeEmail === tieuDeDefault && noiDungEmail === noiDungDefault) {
          this.isEmailMacDinh = true;
        } else {
          this.isEmailMacDinh = false;
        }
      }
      else {
        this.mainForm.get('tieuDeEmail').setValue('');
        this.mainForm.get('noiDungEmail').setValue('');
        this.noiDungEmail = "";
      }
    }
    else {
      this.mainForm.get('tieuDeEmail').setValue('');
      this.mainForm.get('noiDungEmail').setValue('');
      this.noiDungEmail = "";
    }
  }

  changeLoaiEmailPXK(event: any) {
    this.mainForm.get('loaiEmail').markAsPristine();

    if (this.noiDungEmailPXKs != null && this.noiDungEmailPXKs.length > 0) {
      const tieuDeEmail = this.noiDungEmailPXKs.find(x => x.loaiEmail == event).tieuDeEmail;
      const noiDungEmail = this.noiDungEmailPXKs.find(x => x.loaiEmail == event).noiDungEmail;
      if (noiDungEmail && tieuDeEmail) {
        this.mainForm.get('tieuDeEmailPXK').setValue(tieuDeEmail);
        this.mainForm.get('noiDungEmailPXK').setValue(noiDungEmail);
        this.noiDungEmailPXK = noiDungEmail;

        const tieuDeDefault = this.noiDungEmailPXKGocs.find(x => x.loaiEmail == event).tieuDeEmail;
        const noiDungDefault = this.noiDungEmailPXKGocs.find(x => x.loaiEmail == event).noiDungEmail;

        if (tieuDeEmail === tieuDeDefault && noiDungEmail === noiDungDefault) {
          this.isEmailPXKMacDinh = true;
        } else {
          this.isEmailPXKMacDinh = false;
        }
      }
      else {
        this.mainForm.get('tieuDeEmailPXK').setValue('');
        this.mainForm.get('noiDungEmailPXK').setValue('');
        this.noiDungEmailPXK = "";
      }
    }
    else {
      this.mainForm.get('tieuDeEmailPXK').setValue('');
      this.mainForm.get('noiDungEmailPXK').setValue('');
      this.noiDungEmailPXK = "";
    }
  }

  changeNoiDungEmail() {
    this.mainForm.get('noiDungEmail').markAsDirty();

    if (!this.isFocusCKEditor) {
      return;
    }

    this.noiDungEmail = this.editorComponent.instance.getData();

    const loaiEmail = this.mainForm.get('loaiEmail').value;
    const tieuDeEmail = this.mainForm.get('tieuDeEmail').value;
    this.mainForm.get('noiDungEmail').setValue(this.noiDungEmail);

    var index = this.noiDungEmails.findIndex(x => x.loaiEmail == loaiEmail);
    if (index !== -1) {
      this.noiDungEmails[index].tieuDeEmail = tieuDeEmail;
      this.noiDungEmails[index].noiDungEmail = this.noiDungEmail;
    }

    this.isEmailMacDinh = false;
  }

  changeNoiDungEmailPXK() {
    this.mainForm.get('noiDungEmailPXK').markAsDirty();

    if (!this.isFocusCKEditorPXK) {
      return;
    }

    this.noiDungEmailPXK = this.editorPXKComponent.instance.getData();

    const loaiEmail = this.mainForm.get('loaiEmailPXK').value;
    const tieuDeEmail = this.mainForm.get('tieuDeEmailPXK').value;
    this.mainForm.get('noiDungEmailPXK').setValue(this.noiDungEmailPXK);

    var index = this.noiDungEmailPXKs.findIndex(x => x.loaiEmail == loaiEmail);
    if (index !== -1) {
      this.noiDungEmailPXKs[index].tieuDeEmail = tieuDeEmail;
      this.noiDungEmailPXKs[index].noiDungEmail = this.noiDungEmailPXK;
    }

    this.isEmailPXKMacDinh = false;
  }

  setFormValue() {
    Object.keys(this.mainForm.controls).forEach(key => {
      const data = this.tuyChons.find(x => x.ma === key);
      if (data) {
        if (data.ma === 'StringThoiGianNhap' || data.ma === 'StringThoiGianXuat') {
          const time = new Date(moment(`2020-12-12 ${data.giaTri}`).format('YYYY-MM-DD HH:mm:ss'));
          this.mainForm.controls[key].setValue(time);
        } else {
          this.mainForm.controls[key].setValue(data.giaTri);
        }
      }
    });
    let kyKeKhaiThueGTGT = this.mainForm.get('KyKeKhaiThueGTGT');
    //đánh dấu đã touch để bắt sự kiện ngmodelchange mà ko bị hiện các câu cảnh báo lúc mới load form
    kyKeKhaiThueGTGT.markAsTouched();
  }

  getFormValue() {
    Object.keys(this.mainForm.controls).forEach((key: any) => {
      const idx = this.tuyChons.findIndex(x => x.ma === key);
      if (idx !== -1) {
        if (key === 'StringThoiGianNhap' || key === 'StringThoiGianXuat') {
          this.tuyChons[idx].giaTri = moment(this.mainForm.controls[key].value).format('HH:mm:ss');
        } else {
          this.tuyChons[idx].giaTri = this.mainForm.controls[key].value;
        }
      }else{
        //nếu không tìm thấy key trong bảng thì thêm mới
        if(key == 'BoolAutoSendHDDTMTT'){
          this.tuyChons.push({
            ma:'BoolAutoSendHDDTMTT',
            giaTri: this.mainForm.controls[key].value,
          })
        }
        if(key == 'IntTimeStartAutoSendHDDTMTT'){
          this.tuyChons.push({
            ma:'IntTimeStartAutoSendHDDTMTT',
            giaTri: this.mainForm.controls[key].value,
          })
        }
        if(key == 'BoolAutoSendHd'){
          this.tuyChons.push({
            ma:'BoolAutoSendHd',
            giaTri: this.mainForm.controls[key].value,
          })
        }
      }
    });
  }

  changeThietLapGioNhapXuat(event: any) {
    if (event === '1') {
      this.mainForm.get('StringThoiGianNhap').disable();
      this.mainForm.get('StringThoiGianXuat').disable();
    } else {
      this.mainForm.get('StringThoiGianNhap').enable();
      this.mainForm.get('StringThoiGianXuat').enable();
    }
  }

  createForm() {
    this.mainForm = this.fb.group({
      CachDocSo0OHangChuc: [],
      CachDocSoTienOHangNghin: [],
      BoolHienThiTuChanKhiDocSoTien: [null],
      BoolCoPhatSinhNghiepVuNgoaiTe: [null],
      BoolHienThiDonViTienNgoaiTeTrenHoaDon: [null],
      PhatSinhBanHangTheoDGSauThue: [null],
      BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon: [null],
      TinhTienTheoDGSauThue: [null],
      TinhTienTheoSLvaDGSauThue: [null],
      TinhSLTheoDGvaTienSauThue: [null],
      CanhBaoKhongChonNhanVienBanHang: [null],
      IntDinhDangSoThapPhanTienQuyDoi: [0],
      IntDinhDangSoThapPhanTienNgoaiTe: [2],
      IntDinhDangSoThapPhanDonGiaQuyDoi: [2],
      IntDinhDangSoThapPhanDonGiaNgoaiTe: [2],
      IntDinhDangSoThapPhanSoLuong: [2],
      IntDinhDangSoThapPhanTyGia: [2],
      IntDinhDangSoThapPhanTyLePhanBo: [10],
      IntDinhDangSoThapPhanHeSoTyLe: [2],
      IntDinhDangSoThapPhanSoCong: [0],
      CanhBaoHDChenhLech: [null],
      CanhBaoKhiNhapMaSoThueKhongHopLe: [null],
      CachTheHienSoTienBangChu: [null],
      CachTheHienSoTienThueLaKCT: [null],
      CachTheHienSoTienThueLaKKKNT: [null],
      KyNopBaoCaoTinhHinhSuDungHoaDon: [null],
      BoolCoPhatSinhUyNhiemLapHoaDon: [{ value: null, disabled: true }],
      KyKeKhaiThueGTGT: [null],
      IntCanhBaoKhiKhongLapVBDTTT: [1],
      BoolQuanLyNhanVienBanHangTrenHoaDon: [null],
      NhaCungCapDichVuEmail: ['1'],
      TenNguoiGui: ["HÓA ĐƠN BÁCH KHOA", [Validators.required]],
      TenDangNhapEmail: ["hotro@pmbk.vn", [Validators.required]],
      MatKhauEmail: ["pmbk@2019", [Validators.required]],
      TenMayChu: ["mail9096.maychuemail.com"],
      SoCong: [465],
      loaiEmail: [this.loaiEmails[0].id],
      tieuDeEmail: [null],
      noiDungEmail: [null],
      tieuDeEmailPXK: [null],
      noiDungEmailPXK: [null],
      BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail: [null],
      BoolChoPhepNhapSoAm: [null],
      BoolChoPhepXacNhanHDDaGuiKhachHang: [null],
      IsNopThueTheoThongTu1032014BTC: [null],
      BoolChoPhepLapHDDTMTT:[null],
      BoolCanhBaoNguoiBanKhacNguoiKy: [null],
      BoolAutoSendHDDTMTT: [false],
      BoolAutoSendHd: [false],
      IntTimeStartAutoSendHDDTMTT: [22]
    });

    this.mainForm.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });
  }

  getDefaultEmail() {
    var loaiEmail = this.mainForm.get('loaiEmail').value;
    // set giá trị email default
    const itemGoc = this.noiDungEmailGocs.find(x => x.loaiEmail === loaiEmail);
    const item = this.noiDungEmails.find(x => x.loaiEmail === loaiEmail);

    item.tieuDeEmail = itemGoc.tieuDeEmail;
    item.noiDungEmail = itemGoc.noiDungEmail;

    this.isFocusCKEditor = false;
    this.mainForm.get('tieuDeEmail').setValue(item.tieuDeEmail);
    this.mainForm.get('noiDungEmail').setValue(item.noiDungEmail);
    this.noiDungEmail = item.noiDungEmail;

    // this.changeLoaiEmail(loaiEmail);
    this.isEmailMacDinh = true;
  }

  getDefaultEmailPXK() {
    var loaiEmail = this.mainForm.get('loaiEmailPXK').value;
    // set giá trị email default
    const itemGoc = this.noiDungEmailPXKGocs.find(x => x.loaiEmail === loaiEmail);
    const item = this.noiDungEmailPXKs.find(x => x.loaiEmail === loaiEmail);

    item.tieuDeEmail = itemGoc.tieuDeEmail;
    item.noiDungEmail = itemGoc.noiDungEmail;

    this.isFocusCKEditorPXK = false;
    this.mainForm.get('tieuDeEmailPXK').setValue(item.tieuDeEmail);
    this.mainForm.get('noiDungEmailPXK').setValue(item.noiDungEmail);
    this.noiDungEmailPXK = item.noiDungEmail;

    // this.changeLoaiEmail(loaiEmail);
    this.isEmailPXKMacDinh = true;
  }

  forkJoin() {
    return forkJoin([
      this.tuyChonService.GetAll(),
      this.tuyChonService.GetAllNoiDungEmail(),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(LoaiTruongDuLieu.NhomBangKe, 1),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(LoaiTruongDuLieu.NhomBangKe, 2),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(LoaiTruongDuLieu.NhomHangHoaDichVu, 1),
      this.thietLapTruongDuLieuService.GetListTruongDuLieuByLoaiTruong(LoaiTruongDuLieu.NhomHangHoaDichVu, 2)
    ]);
  }

  saveChanges(closeForm = true) {

    if (this.changeChuKySo == true) {
      if (this.isSelectChuKiCungShow == true) {
        if(this.tuyChons.find(x => x.ma == "IsSelectChuKiCung"))this.tuyChons.find(x => x.ma == "IsSelectChuKiCung").giaTri = "KiCung";
        this.changeChuKySo = false;
        this.isSelectChuKiCungShow = true;
        this.signValue = null;
        this.isSelectChuKiMemShow = false;

      }
      else if (this.isSelectChuKiMemShow == true) {
        if(this.tuyChons.find(x => x.ma == "IsSelectChuKiCung"))this.tuyChons.find(x => x.ma == "IsSelectChuKiCung").giaTri = "KiMem|"+this.userkeySign;
        this.spinning = false;
        this.changeChuKySo = false;
        this.isSelectChuKiCungShow = false;
        this.signValue = 'B';
        this.isSelectChuKiMemShow = true;

      }
    }
    if (this.mainForm.controls["BoolAutoSendHDDTMTT"].value == true && this.isSelectChuKiMemShow == false) {
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
          msContent: "Vui lòng thiết lập chữ ký số mềm trước khi sử dụng tùy chọn <b>Cho phép hệ thống tự động gửi hóa đơn điện tử khởi tạo từ máy tính tiền lên cơ quan thuế.</b>.",
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      return;
    }
    if (this.mainForm.controls["BoolAutoSendHd"].value == true && this.isSelectChuKiMemShow == false) {
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
          msContent: "Vui lòng thiết lập chữ ký số mềm trước khi sử dụng tùy chọn <b>Cho phép hệ thống tự động gửi hóa đơn lên cơ quan thuế.</b>.",
          msOnClose: () => {
          }
        },
        nzFooter: null
      });

      return;
    }
    this.spinning = true;

    if (this.mainForm.invalid) {
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsDirty();
        this.mainForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      this.spinning = false;
      return;
    }

    this.getFormValue();
    if(this.tuyChons.find(x => x.ma == "IsSelectChuKiCung") && this.tuyChons.find(x => x.ma == "IsSelectChuKiCung").giaTri == "KiCung")this.tuyChons.find(x => x.ma == "BoolAutoSendHDDTMTT").giaTri = "false";
    if(this.tuyChons.find(x => x.ma == "IsSelectChuKiCung") && this.tuyChons.find(x => x.ma == "IsSelectChuKiCung").giaTri == "KiCung")this.tuyChons.find(x => x.ma == "BoolAutoSendHd").giaTri = "false";
      
    this.tuyChonService.GetAllNoiDungEmail().subscribe((rs: any[]) => {
      this.oldNoiDungEmails = rs.filter(x => x.isDefault == false && this.loaiEmails.map(o => o.id).includes(x.loaiEmail));
      // this.tuyChons.push({ma:"BoolChoPhepLapHDDTMTT",ten:"Cho phép lập hóa đơn điện tử khởi tạo từ máy tính tiền (Hóa đơn gốc) trên phần mềm giải pháp",giaTri:"false",newList:null,oldList:null})
      const data = {
        oldList: this.oldTuyChons,
        newList: this.tuyChons
      };

      forkJoin([
        this.tuyChonService.Update(data),
        this.tuyChonService.UpdateRangeNoiDungEmailAsync(this.noiDungEmails),
        this.tuyChonService.UpdateRangeNoiDungEmailAsync(this.noiDungEmailPXKs),
        this.thietLapTruongDuLieuService.UpdateHienThiTruongBanHangTheoDonGiaSauThues(data)
      ])
        .subscribe((res: any) => {
          if (res[0] && res[1] && res[2]) {
            this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);

            let thietLapEmail = this.checkThietLapEmail();
            if (thietLapEmail != '') {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Sua,
                refType: RefType.EmailGuiHoaDon,
                thamChieu: 'Email gửi hóa đơn',
                moTaChiTiet: thietLapEmail
              }).subscribe();
            }

            localStorage.setItem(CookieConstant.SETTING, JSON.stringify(this.tuyChons));
            this.mainForm.markAsPristine();

            let tuyChonChiTiet = this.checkNhatKyTruyCap();
            if (tuyChonChiTiet != '') {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Sua,
                refType: RefType.TuyChon,
                thamChieu: 'Tùy chọn',
                moTaChiTiet: tuyChonChiTiet
              }).subscribe();
            }
            this.oldTuyChons = JSON.parse(JSON.stringify(this.tuyChons));
            //this.oldNoiDungEmails = this.noiDungEmails;
          } else {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
          }

          this.spinning = false;
        });
    });

    //reset các biến này sau khi lưu xong
    this.daThongBaoSauKhiThayDoiKySangThang = false;
    this.daThongBaoSauKhiThayDoiKySangQuy = false;
    this.coThaoTacChuyenKySangQuy = false;
  }

  // check thay đổi tùy chọn
  checkNhatKyTruyCap() {
    const length = this.oldTuyChons.length;
    let moTaChiTiet = '';

    for (let i = 0; i < length; i++) {
      const oldItem = this.oldTuyChons[i];
      const newItem = this.tuyChons[i];

      let oldValue = oldItem.giaTri.toString();
      let newValue = newItem.giaTri.toString();

      if (oldValue !== newValue) {
        switch (oldValue) {
          case 'true':
          case 'false':
            oldValue = oldValue === 'true' ? 'Có' : 'Không';
            newValue = newValue === 'true' ? 'Có' : 'Không';
            break;
          case 'KhongCB':
          case 'CBVaKhongLuu':
          case 'CB':
            oldValue = oldValue === 'KhongCB' ? 'Không cảnh báo' : (oldValue === 'CB' ? 'Cảnh báo' : 'Cảnh báo và không lưu');
            newValue = newValue === 'KhongCB' ? 'Không cảnh báo' : (newValue === 'CB' ? 'Cảnh báo' : 'Cảnh báo và không lưu');
            break;
          case 'Thang':
          case 'Quy':
            oldValue = oldValue === 'Thang' ? 'Tháng' : 'Quý';
            newValue = newValue === 'Thang' ? 'Tháng' : 'Quý';
            break;
          default:
            if (newItem.ma === 'IntCanhBaoKhiKhongLapVBDTTT') {
              oldValue = oldValue === '0' ? 'Không cảnh báo' : (oldValue === '1' ? 'Cảnh báo' : 'Cảnh báo và không cho phép lưu');
              newValue = newValue === '0' ? 'Không cảnh báo' : (newValue === '1' ? 'Cảnh báo' : 'Cảnh báo và không cho phép lưu');
            } else if (newItem.ma === 'NhaCungCapDichVuEmail') {
              oldValue = oldValue === '1' ? 'DỊCH VỤ EMAIL BKSOFT' : 'Gmail';
              newValue = newValue === '1' ? 'DỊCH VỤ EMAIL BKSOFT' : 'Gmail';
            }
            break;
        }

        if (newItem.ma === 'MatKhauEmail') {
          moTaChiTiet += `- ${newItem.ten}: đã đổi\n`;
        } else {
          moTaChiTiet += `- ${newItem.ten}: Từ <${oldValue}> thành <${newValue}>\n`;
        }
      }
    }

    return moTaChiTiet;
  }

  checkThietLapEmail() {
    let moTaChiTiet = '';
    const emailLength = this.oldNoiDungEmails.length;
    for (let i = 0; i < emailLength; i++) {
      const oldItem = this.oldNoiDungEmails[i];
      const newItem = this.noiDungEmails[i];
      const tenLoaiEmail = this.loaiEmails.find(x => x.id == newItem.loaiEmail).ten;
      if (oldItem.tieuDeEmail !== newItem.tieuDeEmail || oldItem.noiDungEmail !== newItem.noiDungEmail) {
        moTaChiTiet = `+ Sửa thiết lập loại email ${tenLoaiEmail}\n`
        if (oldItem.tieuDe != newItem.tieuDe) {
          moTaChiTiet += `\t- Tiêu đề email ${tenLoaiEmail} đã đổi \n`;
          moTaChiTiet += `\t- Tiêu đề email ${tenLoaiEmail} : Từ <${oldItem.tieuDe}> thành <${newItem.tieuDe}>`
        }

        if (oldItem.noiDungEmail != newItem.noiDungEmail) {
          moTaChiTiet += `\t- Sửa nội dung loại email ${tenLoaiEmail} \n`;
        }
      }
    }

    return moTaChiTiet;
  }

  isVisible(): boolean {
    const element = this.elementRef.nativeElement;
    return element.offsetParent !== null;
  }

  changePPTinhTyGiaXuatQuy(event: any) {
    this.ppTinhTyGiaXuatQuy = event;
    if (event == null) event = '1';
    if (event === '1') {
      if (this.mainForm.value.IntPPTTGXuatQuy === '1') {
        this.hienThiMoTaPhuongPhap = false;
      } else {
        this.hienThiMoTaPhuongPhap = true;
      }

      this.tieuDeCanhBao = '<b>Lưu ý khi chuyển từ phương pháp bình quân cuối kỳ sang phương pháp bình quân tức thời</b>';
      this.noiDungCanhBao = '1. Bạn chỉ nên thay đổi phương pháp tính tỷ giá xuất quỹ khi hết năm tài chính.<br>';
      this.noiDungCanhBao += '2. Khi thay đổi phương pháp tính tỷ giá xuất quỹ <b>cần lưu ý</b> như sau:<br><ul class = "customLiItems">';
      this.noiDungCanhBao += '<li>Việc thay đổi phương pháp có thể ảnh hưởng đến số liệu kế toán. Vì vậy, cần <b>liên hệ với BP hỗ trợ Phần mềm Bách Khoa để sao lưu dữ liệu trước khi thay đổi</b>.</li>';
      this.noiDungCanhBao += '<li>Nên <b>khóa sổ kế toán</b> của kỳ kế toán đã chốt số liệu.</li>';
      this.noiDungCanhBao += '<li>Để đảm bảo số liệu đã chốt không thay đổi thì khi <b>bảo trì, tính tỷ giá xuất quỹ không thực hiện cho tháng đã chốt số liệu</b>.</li>';
      this.noiDungCanhBao += '<li>Khi Sửa và Lưu lại chứng từ thì chương trình sẽ tự động tính lại tỷ giá xuất quỹ theo phương pháp bình quân tức thời, khi đó số liệu có thể sẽ bị thay đổi.</li></ul>';
    }
    if (event === '2') {
      if (this.mainForm.value.IntPPTTGXuatQuy === '2') {
        this.hienThiMoTaPhuongPhap = false;
      } else {
        this.hienThiMoTaPhuongPhap = true;
      }

      this.tieuDeCanhBao = '<b>Lưu ý khi chuyển từ phương pháp bình quân tức thời sang phương pháp bình quân cuối kỳ</b>';
      this.noiDungCanhBao = '1. Bạn chỉ nên thay đổi phương pháp tính tỷ giá xuất quỹ khi hết năm tài chính.<br>';
      this.noiDungCanhBao += '2. Khi thay đổi phương pháp tính tỷ giá xuất quỹ <b>cần lưu ý</b> như sau:<br><ul class = "customLiItems">';
      this.noiDungCanhBao += '<li>Việc thay đổi phương pháp có thể ảnh hưởng đến số liệu kế toán. Vì vậy, cần <b>liên hệ với BP hỗ trợ Phần mềm Bách Khoa để sao lưu dữ liệu trước khi thay đổi</b>.</li>';
      this.noiDungCanhBao += '<li>Nên <b>khóa sổ kế toán</b> của kỳ kế toán đã chốt số liệu.</li>';
      this.noiDungCanhBao += '<li>Cuối tháng cần thực hiện tính tỷ giá xuất quỹ quỹ bằng cách vào Nghiệp vụ\\Tổng hợp\\Tính tỷ giá xuất quỹ.</li>';
    }
  }

  changeCoPhatSinhNghiepVuNgoaiTe(event: any) {
    const tuyChon = JSON.parse(localStorage.getItem(CookieConstant.SETTING));
    const coPhatSinhNghiepVuNgoaiTe = tuyChon.find(x => x.ma == "BoolCoPhatSinhNghiepVuNgoaiTe");
    if (event == false && (coPhatSinhNghiepVuNgoaiTe.giaTri == "true" || coPhatSinhNghiepVuNgoaiTe.giaTri == true)) {
      this.tuyChonService.CheckCoPhatSinhNgoaiTe().subscribe((rs: boolean) => {
        if (rs) {
          // this.modalService.warning({
          //   nzTitle: "Lưu ý",
          //   nzContent: "Dữ liệu đã có phát sinh hạch toán đa tiền tệ. Bạn không được bỏ tích chọn hạch toán đa tiền tệ",
          //   nzOkText: null,
          //   nzCancelText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          //   nzOnCancel: () => {
          //     this.mainForm.get("BoolCoPhatSinhNghiepVuNgoaiTe").setValue(coPhatSinhNghiepVuNgoaiTe.giaTri);
          //   }
          // })

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '40%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Phát sinh nghiệp vụ liên quan đến ngoại tệ",
              msContent: `Đã phát sinh hóa đơn liên quan đến ngoại tệ. Bạn không được phép bỏ lựa chọn này.`,
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
                this.mainForm.get("BoolCoPhatSinhNghiepVuNgoaiTe").setValue(coPhatSinhNghiepVuNgoaiTe.giaTri);

                if (coPhatSinhNghiepVuNgoaiTe.giaTri === true || coPhatSinhNghiepVuNgoaiTe.giaTri === 'true') {
                  this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').enable();
                } else {
                  this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').disable();
                  this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').setValue(false);
                }
              }
            }
          })
        } else {
          // Nếu chọn thì enable option con, còn không thì disable
          if (event === true || event === 'true') {
            this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').enable();
          } else {
            this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').disable();
            this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').setValue(false);
          }
        }
      });
    } else {
      // Nếu chọn thì enable option con, còn không thì disable
      if ((event === true || event === 'true') && !(this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0)) {
        this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').enable();
      } else {
        this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').disable();
        this.mainForm.get('BoolHienThiDonViTienNgoaiTeTrenHoaDon').setValue(false);
      }
    }
  }

  searchTaiKhoanKeToan(event: any) {
    const arrCondition = ['soTaiKhoan', 'tenTaiKhoan'];
    this.taiKhoanKeToansSearch = SearchEngine(this.taiKhoanKeToans, arrCondition, event);
  }

  searchTaiKhoanKeToanLai(event: any) {
    const arrCondition = ['soTaiKhoan', 'tenTaiKhoan'];
    this.taiKhoanKeToanLaisSearch = SearchEngine(this.taiKhoanKeToanLais, arrCondition, event);
  }

  searchTaiKhoanKeToanLo(event: any) {
    const arrCondition = ['soTaiKhoan', 'tenTaiKhoan'];
    this.taiKhoanKeToanLosSearch = SearchEngine(this.taiKhoanKeToanLos, arrCondition, event);
  }

  getDinhDangSo(value: any, decimal: any) {
    let rs = '';

    let val = (value).toFixed(decimal > 2 ? 2 : decimal).replace('.', ',');
    const split = val.split(',');
    var intVal = split[0];
    rs = intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (split.length > 1 ? (',' + (decimal > 2 ? (split[1].padEnd(decimal, '0')) : split[1])) : '');
    return rs;
  }

  downloadBKSOFT() {
    const link = document.createElement('a');
    link.href = `${this.env.apiUrl}/${this.urlTools}`;
    link.download = 'BKSOFT-KYSO-SETUP.zip';
    link.click();
  }

  changeDinhDangChuSo(decimal: any, key: any) {
    if (!decimal) {
      decimal = 0;
    }

    let value = 0;
    if (decimal === 0) {

      value = 1234568;
    } else if (decimal === 1) {

      value = 1234567.9;
    } else {
      value = 1234567.89;
    }

    const result = this.getDinhDangSo(value, decimal);
    this.dinhDangSo[key] = result;
  }

  blurDinhDangChuSo(key: any) {
    const value = this.mainForm.get(key).value;
    if (!value) {
      this.mainForm.get(key).setValue(0);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.saveChanges();
    }
  }

  changePhatSinhBanHang(event: any) {
    if ((event || event == 'true') && !(this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0)) {
      this.mainForm.get('TinhTienTheoDGSauThue').enable();
      this.mainForm.get('TinhTienTheoSLvaDGSauThue').enable();
      this.mainForm.get('TinhSLTheoDGvaTienSauThue').enable();

    } else {
      this.mainForm.get('TinhTienTheoDGSauThue').disable();
      this.mainForm.get('TinhTienTheoSLvaDGSauThue').disable();
      this.mainForm.get('TinhSLTheoDGvaTienSauThue').disable();

      this.mainForm.get('TinhTienTheoDGSauThue').setValue(false);
      this.mainForm.get('TinhTienTheoSLvaDGSauThue').setValue(false);
      this.mainForm.get('TinhSLTheoDGvaTienSauThue').setValue(false);
    }
  }

  changeQLNhanVienBanHang(event) {
    let value = JSON.parse(event);
    if (value) {
      this.mainForm.get('BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon').enable();
      this.truongDuLieuHoaDonGTGTs.forEach(ele => {
        if (ele.tenCot == "NhanVienBanHang") {
          ele.hienThi = true;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHs).subscribe(rs => { });
      this.truongDuLieuHoaDonBHs.forEach(ele => {
        if (ele.tenCot == "NhanVienBanHang") {
          ele.hienThi = true;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHs).subscribe(rs => { });
      this.truongDuLieuHoaDonGTGTChiTiets.forEach(ele => {
        if (ele.maTruong == "HHDV 25" || ele.maTruong == "HHDV 26") {
          ele.hienThi = true;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonGTGTChiTiets).subscribe(rs => {
      });
      this.truongDuLieuHoaDonBHChiTiets.forEach(ele => {
        if (ele.maTruong == "HHDV 25" || ele.maTruong == "HHDV 26") {
          ele.hienThi = true;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHChiTiets).subscribe(rs => {
      });
    } else {
      this.mainForm.get('BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon').disable();
      this.mainForm.get('BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon').setValue(false);
      this.truongDuLieuHoaDonGTGTs.forEach(ele => {
        if (ele.tenCot == "NhanVienBanHang") {
          ele.hienThi = false;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHs).subscribe(rs => { });
      this.truongDuLieuHoaDonBHs.forEach(ele => {
        if (ele.tenCot == "NhanVienBanHang") {
          ele.hienThi = false;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHs).subscribe(rs => { });
      this.truongDuLieuHoaDonGTGTChiTiets.forEach(ele => {
        if (ele.maTruong == "HHDV 25" || ele.maTruong == "HHDV 26") {
          ele.hienThi = false;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonGTGTChiTiets).subscribe(rs => {
      });
      this.truongDuLieuHoaDonBHChiTiets.forEach(ele => {
        if (ele.maTruong == "HHDV 25" || ele.maTruong == "HHDV 26") {
          ele.hienThi = false;
        }
      });
      this.thietLapTruongDuLieuService.UpdateRange(this.truongDuLieuHoaDonBHChiTiets).subscribe(rs => {
      });
    }

    // emit value to layout
    this.sharedService.emitChange({
      type: "BoolQuanLyNhanVienBanHangTrenHoaDon",
      value
    });

    console.log(this.thaoTacs);
    if (this.permission != true && this.thaoTacs.indexOf('SYS_UPDATE') < 0) {
      this.mainForm.get('BoolCanhBaoKhiKhongChonNhanVienBanHangTrenHoaDon').disable();
    }
  }

  changeTab(event: number) {
    console.log(event);
    console.log(this.listTenQuyens.indexOf('EmailGuiHoaDon'));
    console.log(this.listTenQuyens.indexOf('EmailGuiHoaDon') == event);
    this.selectedTab = event;
  }

  changeEmailTab(event: number) {
    this.emailTab = event;
  }

  tichChonTuyChon(ma, byHtml = false) {
    if (byHtml == false) {
      if (ma == 'TinhTienTheoDGSauThue') {
        if (this.mainForm.get(ma).value || this.mainForm.get(ma).value == 'true') {
          //this.mainForm.get('TinhTienTheoSLvaDGSauThue').setValue(false);
          this.mainForm.get('TinhSLTheoDGvaTienSauThue').setValue(false);
        }
      }

      if (ma == 'TinhTienTheoSLvaDGSauThue') {
        if (this.mainForm.get(ma).value || this.mainForm.get(ma).value == 'true') {
          //this.mainForm.get('TinhTienTheoDGSauThue').setValue(false);
          this.mainForm.get('TinhSLTheoDGvaTienSauThue').setValue(false);
        }
      }

      if (ma == 'TinhSLTheoDGvaTienSauThue') {
        if (this.mainForm.get(ma).value || this.mainForm.get(ma).value == 'true') {
          this.mainForm.get('TinhTienTheoDGSauThue').setValue(false);
          this.mainForm.get('TinhTienTheoSLvaDGSauThue').setValue(false);
        }
      }
    }

    if (byHtml) {
      if (ma == 'TinhTienTheoDGSauThue') {
        let chk: any = document.querySelector('#TinhTienTheoDGSauThue .ant-checkbox-input');
        if (chk.checked) {
          //this.mainForm.get('TinhTienTheoSLvaDGSauThue').setValue(false);
          this.mainForm.get('TinhSLTheoDGvaTienSauThue').setValue(false);
        }
      }

      if (ma == 'TinhTienTheoSLvaDGSauThue') {
        let chk: any = document.querySelector('#TinhTienTheoSLvaDGSauThue .ant-checkbox-input');
        if (chk.checked) {
          //this.mainForm.get('TinhTienTheoDGSauThue').setValue(false);
          this.mainForm.get('TinhSLTheoDGvaTienSauThue').setValue(false);
        }
      }

      if (ma == 'TinhSLTheoDGvaTienSauThue') {
        let chk: any = document.querySelector('#TinhSLTheoDGvaTienSauThue .ant-checkbox-input');
        if (chk.checked) {
          this.mainForm.get('TinhTienTheoSLvaDGSauThue').setValue(false);
          this.mainForm.get('TinhTienTheoDGSauThue').setValue(false);
        }
      }
    }
  }

  setDefaultDinhDangThapPhan() {
    this.mainForm.patchValue({
      ...this.dinhDangThapPhanDefault
    });

    this.mainForm.markAsDirty();
  }

  checkIsDefaultDinhDangThapPhan() {
    const data = this.mainForm.getRawValue();
    if (data.IntDinhDangSoThapPhanTienQuyDoi != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTienQuyDoi ||
      data.IntDinhDangSoThapPhanTienNgoaiTe != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTienNgoaiTe ||
      data.IntDinhDangSoThapPhanDonGiaQuyDoi != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanDonGiaQuyDoi ||
      data.IntDinhDangSoThapPhanDonGiaNgoaiTe != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanDonGiaNgoaiTe ||
      data.IntDinhDangSoThapPhanSoLuong != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanSoLuong ||
      data.IntDinhDangSoThapPhanTyGia != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTyGia ||
      data.IntDinhDangSoThapPhanTyLePhanBo != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanTyLePhanBo ||
      data.IntDinhDangSoThapPhanHeSoTyLe != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanHeSoTyLe ||
      data.IntDinhDangSoThapPhanSoCong != this.dinhDangThapPhanDefault.IntDinhDangSoThapPhanSoCong) {
      return false;
    }
    return true;
  }

  //hàm này để ẩn/hiện nội dung đã xem thêm
  xemThem() {
    this.daXemThem = !this.daXemThem;
  }

  //hàm này để kiểm tra đã thay đổi giá trị của kỳ kê khai thuế
  changeKyKeKhai() {
    let kyKeKhaiThueGTGT = this.mainForm.get('KyKeKhaiThueGTGT');
    if (kyKeKhaiThueGTGT.touched) {
      let giaTriCu = this.tuyChons.find(x => x.ma == 'KyKeKhaiThueGTGT');
      if (giaTriCu.giaTri == kyKeKhaiThueGTGT.value) return; //nếu đã chọn lại giá trị cũ thì bỏ qua

      if (kyKeKhaiThueGTGT.value == 'Quy' && !this.daThongBaoSauKhiThayDoiKySangQuy) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: '440px',
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msTitle: 'Chuyển sang khai thuế GTGT theo quý',
            msContent: 'Khi người nộp thuế lựa chọn chuyển sang khai thuế theo quý thì gửi văn bản đề nghị quy định tại Phụ lục I ban hành kèm theo Nghị định số 126/2020/NĐ-CP đề nghị thay đổi kỳ tính thuế đến cơ quan thuế quản lý trực tiếp chậm nhất là 31 tháng 01 của năm bắt đầu khai thuế theo quý. ' +
              'Nếu sau thời hạn này người nộp thuế không gửi văn bản đến cơ quan thuế thì người nộp thuế tiếp tục thực hiện khai thuế theo tháng ổn định trọn năm dương lịch.' +
              '<br><br>Bạn có chắn chắn đã gửi văn bản đề nghị theo quy định và muốn thiết lập chuyển sang khai thuế theo quý không?',
            msOnOk: () => {
              this.daThongBaoSauKhiThayDoiKySangQuy = true;
              this.hienThongBao();
            },
            msOnClose: () => {
              this.coThaoTacChuyenKySangQuy = true;
              this.mainForm.get('KyKeKhaiThueGTGT').setValue('Thang');
            }
          },
          nzFooter: null
        });
      }
      else {
        if (!this.coThaoTacChuyenKySangQuy && !this.daThongBaoSauKhiThayDoiKySangThang) {
          this.hienThongBao();
          this.daThongBaoSauKhiThayDoiKySangThang = true;
        }
      }
    }
  }

  //hàm này hiện thông báo hóa đơn sai sót
  hienThongBao() {
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzWidth: '440px',
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Info,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msTitle: 'Cập nhật tình trạng thông báo hóa đơn có sai sót',
        msContent: 'Thay đổi kỳ kê khai thuế GTGT sẽ làm thay đổi thời điểm được xác định là ngày cuối cùng của kỳ kê khai thuế GTGT. Căn cứ vào ngày cuối cùng của kỳ kê khai thuế GTGT sau khi thay đổi, hệ thống sẽ cập nhập lại tình trạng thông báo hóa đơn điện tử có sai sót đối với các trạng thái thông báo hóa đơn có sai sót là <b>Chưa lập thông báo</b> và <b>Chưa gửi</b>',
        msOnClose: () => {
          this.spinning = false;
        }
      },
      nzFooter: null
    });
  }

  selectTruongTron(item: any) {
    this.visibleDropDownTruongTron = false;

    // add tenTruong to cursor text
    switch (item.tenTruong) {
      case 'TRA CỨU':
        this.insertTextEditor(`<div class='bt-search'><a href='##linktracuu##/##matracuu##' style='font-family: Tahoma, serif;background-color: #ff7500;color: #ebebeb;font-weight: 500;padding: 10px 50px 10px 50px;border-radius: 4px;box-shadow: 1px 1px 1px #ddd;border-style: none;cursor: pointer;text-decoration: none;'>TRA CỨU</a></div>`);
        break;
      case 'XEM BIÊN BẢN HỦY HÓA ĐƠN':
      case 'XEM BIÊN BẢN ĐIỀU CHỈNH HÓA ĐƠN':
        this.insertTextEditor(`<div class='bt-search'><a href = '##duongdanbienban##' style='font-family: Tahoma, serif;background-color: #ff7500;color: #ebebeb;font-weight: 500;padding: 10px 50px 10px 50px;border-radius: 4px;box-shadow: 1px 1px 1px #ddd;border-style: none;cursor: pointer;text-decoration: none;'>XEM CHI TIẾT BI&Ecirc;N BẢN</a></div>`);
        break;
      default:
        this.insertTextEditor(`<span>${item.tenTruong}</span>`)
        break;
    }

    setTimeout(() => {
      this.changeNoiDungEmail();
    }, 0);
  }

  insertTextEditor(text: any) {
    var selection = this.editorComponent.instance.getSelection()
    var e1 = CKEDITOR.dom.element.createFromHtml(text);
    this.editorComponent.instance.insertElement(e1, selection);
  }
  selectChuKySo(data: any) {
    if (data == true) {
      this.changeChuKySo = true;
      this.isSelectChuKiCungShow = true;
      this.isSelectChuKiMemShow = false;
      this.signValue = '';
    }
    else {
      this.isSelectChuKiCungShow = false;
      this.changeChuKySo = false;
      // this.message.info("Vui lòng chọn nhà cung cấp dịch vụ chữ kí mềm")
      setTimeout(() => {
        this.isSelectChuKiMemShow = true;
      }, 100);
    }
  }
  dangNhapESignCloud(data: any) {
    this.changeChuKySo = true;
    this.isSelectChuKiCungShow = false;
    this.signValue = 'B';
    // call modal
    const modal = this.modalService.create({
      nzTitle: 'Đăng nhập chứng thư số',
      nzContent: GetInfoEsigncloudComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzKeyboard: false,
      nzWidth: '27%',
      nzStyle: { top: '2vh' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.userkeySign = rs.agreementUUID+"|"+rs.passCode;
        this.changeChuKySo = true;
        this.isSelectChuKiCungShow = false;
        this.signValue = 'B';
      } else {
        this.isSelectChuKiCungShow = true;
        this.isSelectChuKiMemShow = false;
      }
    });
  }
  changeRadioKiSo(data: any) {
    if (data == 'B') {
      this.changeChuKySo = true;
      this.isSelectChuKiCungShow = false;
      this.isSelectChuKiMemShow = true;
    }
  }
}
