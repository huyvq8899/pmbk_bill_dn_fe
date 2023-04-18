import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { getLoaiHoaDon, setStyleTooltipError, GetFileUrl, getUyNhiemLapHoaDons, getHinhThucHoaDons, getLoaiHoaDons, getListKyTuThu4, getPhuongThucChuyenDLieu, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import * as moment from 'moment';
import { CheckValidMaCQTCap } from 'src/app/customValidators/check-common-valid.validator';
import { ThongTinHoaDonService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-tin-hoa-don.service';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { RefType } from 'src/app/models/nhat-ky-truy-cap';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { PagingParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { error } from 'console';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { TabHoaDonDieuChinhComponent } from '../../tabs/tab-hoa-don-dieu-chinh/tab-hoa-don-dieu-chinh.component';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { tap } from 'rxjs/operators';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { CookieConstant } from 'src/app/constants/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thay-the-hinh-thuc-hoa-don-khac-pmgp-modal',
  templateUrl: './thay-the-hinh-thuc-hoa-don-khac-pmgp-modal.component.html',
  styleUrls: ['./thay-the-hinh-thuc-hoa-don-khac-pmgp-modal.component.scss']
})
export class ThayTheHinhThucHoaDonKhacPMGPModalComponent implements OnInit {
  //loaiHinhThuc = 1: bị thay thế, = 2: bị điều chỉnh
  @Input() loaiHinhThuc: number = 1;
  spinning = false;
  form: FormGroup;
  hinhThucHoaDonCanThayThes: any[] = [];
  customOverlayStyle = {
    width: '600px'
  };
  customOverlayStyle1 = {
    width: '420px'
  };
  customOverlayStyle2 = {
    width: '530px'
  };
  customOverlayStyle3 = {
    width: '330px'
  };
  listFile: any[] = [];
  formData: any;
  chuCais = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  uyNhiemLapHoaDons = getUyNhiemLapHoaDons();
  hinhThucHoaDons = getHinhThucHoaDons();
  phuongThucChuyenDLs = getPhuongThucChuyenDLieu();
  loaiHoaDons: any[];
  loaiHoaDonsAll: any[];
  kyHieuThu4s = getListKyTuThu4();
  kyHieuThu4sSearch = getListKyTuThu4();
  list_LoaiHoaDonGoc = getLoaiHoaDons();
  list_TrangThaiHoaDon: any = [
    { value: 1, name: 'Hóa đơn gốc' },
    { value: 3, name: 'Hóa đơn thay thế' },
  ]
  kyHieu23s: any[] = [];
  kyHieu56s: Array<string> = [];
  list_LoaiHoaDon: any[] = []; //biến list_LoaiHoaDon này để lọc tùy chỉnh
  loaiHoaDon: number = 1; //phân loại hóa đơn dựa theo trường <Loại hóa đơn (Hóa đơn thay thế)>
  loaiTiensSearch: any[] = [];
  isVND = true;
  ddtp = new DinhDangThapPhan();
  confirmWarningMessage = null;
  warningMessage = null;
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail') ? JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail').giaTri : false;
  isPhieuXuatKho: boolean = false;
  isPos: boolean = false;


  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private uploadFileService: UploadFileService,
    private loaiTienService: LoaiTienService,
    private tabHoaDonDieuChinhComponent: TabHoaDonDieuChinhComponent,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService
  ) { }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }
    else if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
    }

    if (this.loaiHinhThuc == 1) {
      this.list_TrangThaiHoaDon = this.list_TrangThaiHoaDon.filter(x => x.value != 4);
    }
    else if (this.loaiHinhThuc == 2) {
      this.list_TrangThaiHoaDon = this.list_TrangThaiHoaDon.filter(x => x.value != 3);
    }

    for (let i = 0; i < this.chuCais.length; i++) {
      for (let j = 0; j < this.chuCais.length; j++) {
        var item1 = this.chuCais[i];
        var item2 = this.chuCais[j];
        this.kyHieu56s.push(item1 + item2);
      }
    }

    for (let i = 21; i < 100; i++) {
      this.kyHieu23s.push(i + '');
    }

    this.createForm();
    this.setKyHieuHoaDon();
    //this.changeTextLoaiHoaDonThayThe();
  }

  createForm() {
    this.form = this.fb.group({
      hinhThucHoaDon: [1],
      hinhThucHoaDonCanThayThe: [1],
      maCQTCap: [null, [CheckValidMaCQTCap]],
      phuongThucChuyenDL: [null],
      soHoaDon: [null, [Validators.required]],
      ngayHoaDon: [moment().format('YYYY-MM-DD'), [Validators.required]],
      dinhKem: [null],
      maTraCuu: [null],
      thanhTien: [0, [Validators.required]],
      loaiTienId: [null],
      trangThaiHoaDon: [1, [Validators.required]],
      loaiHoaDon: [1],
      loaiHoaDonThayThe: [null, [Validators.required]],

      kyHieuMauSoHoaDon: [{value: 1, disabled: true}],
      kyHieuHoaDon: [{value: null, disabled: true}],
      mauSoHoaDon_LoaiHoaDon: [null],
      kyHieu: [null],
      kyHieu23: [moment().format('YY'), [Validators.required]],
      kyHieu4: ['T'],
      kyHieu56: ['AA'],

      // loaiHoaDonThayTheText: [null]
    });

    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.hinhThucHoaDonCanThayThes = res[0].filter(x => x.value != 1); //ko hiển thị loại 1
      this.loaiTiensSearch = res[1];
      this.loaiHoaDons = res[2];
      this.loaiHoaDonsAll = res[2];

      
      if(this.isPhieuXuatKho){
        this.list_LoaiHoaDonGoc = this.list_LoaiHoaDonGoc.filter(x=>x.key == 7 || x.key == 8);
        this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x=>x.key != 2);
        this.kyHieuThu4sSearch = this.kyHieuThu4sSearch.filter(x=>x.key == 'N' || x.key == 'B');
        this.form.get('loaiHoaDon').setValue(7);
        this.changeLoaiHoaDon(7);
      }
      else if(this.isPos){
        this.list_LoaiHoaDonGoc = this.list_LoaiHoaDonGoc.filter(x=>x.key == 9 || x.key == 10);
        this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x=>x.key == 2);
        this.kyHieuThu4sSearch = this.kyHieuThu4sSearch.filter(x=>x.key == "M");
        this.form.get('hinhThucHoaDon').setValue(2);
        this.form.get('hinhThucHoaDon').disable();
        this.form.get('loaiHoaDon').setValue(9);
        this.changeLoaiHoaDon(9);
      }
      else{
        this.list_LoaiHoaDonGoc = this.list_LoaiHoaDonGoc.filter(x=>x.key == 1 || x.key == 2);
        this.hinhThucHoaDons = this.hinhThucHoaDons.filter(x=>x.key != 2);
        this.kyHieuThu4sSearch = this.kyHieuThu4sSearch.filter(x=>x.key == "T");
        this.changeLoaiHoaDon(1);
      }



      if (this.loaiTiensSearch.length > 0) {
        this.form.get('loaiTienId').setValue(this.loaiTiensSearch[0].loaiTienId); //default value
      }
      this.spinning = false;
    });
  }


  changeLoaiHoaDon(event: any) {
    if(event != 7 && event != 8 && event != 9 && event != 10){
      this.form.get('kyHieuMauSoHoaDon').setValue(event);
      this.form.get('kyHieu4').setValue('T');
    }
    else if(event == 9){
      this.form.get('kyHieuMauSoHoaDon').setValue(1);
      this.form.get('kyHieu4').setValue('M');
    }
    else if(event == 10){
      this.form.get('kyHieuMauSoHoaDon').setValue(2);
      this.form.get('kyHieu4').setValue('M');
    }
    else {
      this.form.get('kyHieuMauSoHoaDon').setValue(6);
      if(event == 7)
        this.form.get('kyHieu4').setValue('N');
      else
        this.form.get('kyHieu4').setValue('B');
    }

    this.setKyHieuHoaDon();

    this.loaiHoaDons = JSON.parse(JSON.stringify(this.loaiHoaDonsAll));

    this.confirmWarningMessage = null;
    this.warningMessage = null;

    const tenLoaiHinhThuc = this.loaiHinhThuc === 1 ? 'thay thế' : 'điều chỉnh';

    switch (event) {
      case 1: // Hóa đơn GTGT
        if (this.loaiHoaDons.some(x => x.value === 1)) { // Nếu có đăng ký sử dụng Hóa đơn GTGT
          this.form.get('loaiHoaDonThayThe').setValue(1);
          this.form.get('loaiHoaDonThayThe').disable();
        } else if (!this.loaiHoaDons.some(x => x.value === 1) && this.loaiHoaDons.some(x => x.value === 2)) { // Nếu không đăng ký sử dụng Hóa đơn GTGT và có đăng ký Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(2);
          this.form.get('loaiHoaDonThayThe').enable();
          this.loaiHoaDons = this.loaiHoaDons.filter(x => x.value === 2);
          this.confirmWarningMessage = `Bạn đang chọn <b>Hóa đơn bán hàng</b> để ${tenLoaiHinhThuc} cho <b>Hóa đơn GTGT</b>. Bạn có muốn tiếp tục lập hóa đơn ${tenLoaiHinhThuc} không?`;
        } else if (!this.loaiHoaDons.some(x => x.value === 1 || x.value === 2)) { // Nếu không đăng ký sử dụng cả Hóa đơn GTGT và Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp
          (<b>Hóa đơn GTGT</b> hoặc <b>Hóa đơn bán hàng</b>) để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là loại <b>Hóa đơn GTGT</b>. Vui lòng kiểm tra lại!`
        }
        break;
      case 2: // Hóa đơn bán hàng
        if (this.loaiHoaDons.some(x => x.value === 2)) { // Nếu có đăng ký sử dụng Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(2);
          this.form.get('loaiHoaDonThayThe').disable();
        } else if (!this.loaiHoaDons.some(x => x.value === 2) && this.loaiHoaDons.some(x => x.value === 1)) { // Nếu không đăng ký sử dụng Hóa đơn bán hàng và có đăng ký Hóa đơn GTGT
          this.form.get('loaiHoaDonThayThe').setValue(1);
          this.form.get('loaiHoaDonThayThe').enable();
          this.loaiHoaDons = this.loaiHoaDons.filter(x => x.value === 1);
          this.confirmWarningMessage = `Bạn đang chọn <b>Hóa đơn GTGT</b> để ${tenLoaiHinhThuc} cho <b>Hóa đơn bán hàng</b>. Bạn có muốn tiếp tục lập hóa đơn ${tenLoaiHinhThuc} không?`;
        } else if (!this.loaiHoaDons.some(x => x.value === 1 || x.value === 2)) { // Nếu không đăng ký sử dụng cả Hóa đơn GTGT và Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp
          (<b>Hóa đơn bán hàng</b> hoặc <b>Hóa đơn GTGT</b>) để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là loại <b>Hóa đơn bán hàng</b>. Vui lòng kiểm tra lại!`;
        }
        break;
      case 7: // PXK kiêm vận chuyển nội bộ
        if (this.loaiHoaDons.some(x => x.value === 7)) { // Nếu có đăng ký sử dụng Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn
          this.form.get('loaiHoaDonThayThe').setValue(7);
          this.form.get('loaiHoaDonThayThe').disable();
        } else {
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp là
        <b>Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn</b> để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là
        loại <b>Phiếu xuất kho kiêm vân chuyển hàng hóa nội bộ</b>. Vui lòng kiểm tra lại!`;
        }
        break;
      case 8: // PXK hàng gửi bán đại lý
        if (this.loaiHoaDons.some(x => x.value === 8)) { // Nếu có đăng ký sử dụng Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn
          this.form.get('loaiHoaDonThayThe').setValue(8);
          this.form.get('loaiHoaDonThayThe').disable();
        } else {
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp là
        <b>Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn</b> để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là
        loại <b>Phiếu xuất kho gửi bán hàng đại lý</b>. Vui lòng kiểm tra lại!`;
        }
        break;
      default:
        break;
    }
  }

  changeHinhThucHoaDon(event: any) {
    this.setKyHieuHoaDon();

    //vì sau khi validate thì phải enable/disable ở đây mới được
    if (event == 1 || event == 2) {
      this.form.get('maCQTCap').setValidators(CheckValidMaCQTCap);
      this.form.get('phuongThucChuyenDL').clearValidators();
      this.form.get('phuongThucChuyenDL').updateValueAndValidity();
    }
    else {
      this.form.get('maCQTCap').clearValidators();
      this.form.get('maCQTCap').updateValueAndValidity();
      this.form.get('phuongThucChuyenDL').setValidators(Validators.required);
    }
  }

  forkJoin() {
    let params: PagingParams = {
      Keyword: '',
      isActive: true
    };

    return forkJoin([
      this.hoaDonDienTuService.GetListHinhThucHoaDonCanThayThe(),
      this.loaiTienService.GetAll(params),
      this.quanLyThongTinHoaDonService.GetLoaiHoaDonDangSuDung()
    ]);
  }

  submitForm() {
    if (this.form.invalid) {
      console.log('invalid')
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    if (this.confirmWarningMessage || this.warningMessage) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '430px',
        nzComponentParams: {
          msMessageType: this.confirmWarningMessage ? MessageType.Confirm : MessageType.Warning,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msCloseText: this.confirmWarningMessage ? TextGlobalConstants.TEXT_CONFIRM_NO : TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOkButtonInBlueColor: true,
          msTitle: this.confirmWarningMessage ? `Loại hóa đơn của hóa đơn ${this.loaiHinhThuc === 1 ? 'thay thế' : 'điều chỉnh'}` : 'Kiểm tra lại',
          msContent: this.confirmWarningMessage || this.warningMessage,
          msOnOk: () => {
            this.saveData();
          },
          msOnClose: () => {
            ///////////
          }
        },
        nzFooter: null
      });
    } else {
      this.saveData();
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }

  kyHieu4() {
    this.setKyHieuHoaDon();
  }

  changeKyHieu56() {
    this.setKyHieuHoaDon();
  }

  setKyHieuHoaDon() {
    const data = this.form.getRawValue();
    const kyHieu1 = data.hinhThucHoaDon === 0 ? 'K' : 'C';
    const value = `${kyHieu1}${data.kyHieu23}${data.kyHieu4}${data.kyHieu56}`;

    this.form.get('kyHieuHoaDon').setValue(value);

    this.form.get('kyHieu').setValue(data.kyHieuMauSoHoaDon + value);
  }

  setKyHieu() {
    const data = this.form.getRawValue();
    this.form.get('kyHieu').setValue(data.kyHieuMauSoHoaDon + data.kyHieuHoaDon);
  }

  //chuyển số hóa đơn sang 7 ký tự nếu chưa đủ
  changeSoHoaDon(event: any) {
    let soHoaDon = event.target.value;
    if (soHoaDon != null && soHoaDon != '') {
      soHoaDon = this.padLeft(soHoaDon, 7);
      this.form.get('soHoaDon').setValue(soHoaDon);
    }
  }

  //hàm này để thêm số 0 vào đầu số hóa đơn nếu chưa đủ 7 ký tự
  padLeft(value: string, size: number) {
    while (value.length < size) value = "0" + value;
    return value;
  }

  //saveData có kiểm tra có trùng hóa đơn hệ thống hay không
  async saveData() {
    let formValues = this.form.getRawValue();

        /// Yêu cầu mới - trước khi tạo hóa đơn thay thế check - bộ ký hiệu
        let type = formValues.loaiHoaDonThayThe;
        if (type == null) {
          this.showThongBaoKhongTonTaiBoKyHieu(type);
          return;
        }
    
        var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);
        if (listKyHieus.length === 0) {
          this.showThongBaoKhongTonTaiBoKyHieu(type);
          return;
        }

    let params = {
      maCQTCap: formValues.maCQTCap,
      soHoaDon: formValues.soHoaDon,
      ngayHoaDon: formValues.ngayHoaDon,
      maTraCuu: formValues.maTraCuu,
      mauSoHoaDon: formValues.kyHieuMauSoHoaDon,
      kyHieuHoaDon: formValues.kyHieuHoaDon
    };

    this.thongTinHoaDonService.CheckTrungHoaDonHeThong(params).subscribe((rs0: any) => {
      if (rs0) {
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: '460px',
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: 'Thông tin hóa đơn vừa nhập trùng với thông tin hóa đơn đã lập từ hệ thống. Vui lòng kiểm tra lại.',
          },
          nzFooter: null
        });
      }
      else {
        this.saveData2();
      }
    });
  }

  showThongBaoKhongTonTaiBoKyHieu(type) {

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
        msContent: `Bạn không thể lập <b> ${getTenHoaDonByLoai(type)} </b> do không tồn tại bộ ký hiệu hóa đơn có trạng thái sử dụng là <b>Đang sử dụng</b>, <b>Đã xác thực</b>. Vui lòng kiểm tra lại!`,
        msXemDanhMucBoKyHieuHoaDon: true,
        msOnOk: () => {
          this.router.navigate(['quan-ly/bo-ky-hieu-hoa-don']);
        },
        msOnClose: () => {
        }
      },
      nzFooter: null
    });
  }
  //savedata2 có kiểm tra thông tin lần 2
  saveData2() {
    let formValues = this.form.getRawValue();

    let data = {
      hinhThucHoaDonCanThayThe: formValues.hinhThucHoaDonCanThayThe,
      hinhThucApDung: 1, //mặc định loại 1
      maCQTCap: formValues.maCQTCap,
      soHoaDon: formValues.soHoaDon,
      trangThaiHoaDon: formValues.trangThaiHoaDon,
      ngayHoaDon: formValues.ngayHoaDon,
      loaiHoaDon: formValues.loaiHoaDonThayThe,
      loaiTienId: formValues.loaiTienId,
      maTraCuu: formValues.maTraCuu,
      thanhTien: formValues.thanhTien,
      mauSoHoaDon: formValues.kyHieuMauSoHoaDon,
      kyHieuHoaDon: formValues.kyHieuHoaDon,
      phuongThucChuyenDL: (formValues.hinhThucHoaDon == 1 || formValues.hinhThucHoaDon == 2)  ? 0 : formValues.phuongThucChuyenDL
    };

    //nếu là loại thay thế thì kiểm tra xem có trùng hóa đơn ko
    this.thongTinHoaDonService.CheckTrungThongTin(data).subscribe((rs: any) => {
      if (rs != null) {
        if (rs.loaiHinhThuc == 1) //thông báo kiểm tra có hóa đơn thay thế hóa đơn đã nhập
        {
          if (this.loaiHinhThuc == 1) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzWidth: '450px',
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: 'Bạn đã lập hóa đơn thay thế cho hóa đơn này. Vui lòng kiểm tra lại.',
              },
              nzFooter: null
            });
          }
          else {
            let canhBao = '<i>Trường hợp hóa đơn đã lập có sai sót, người bán sẽ xử lý theo hình thức điều chỉnh hoặc thay thế.</i><br>';
            canhBao += "Bạn đã lựa chọn xử lý sai sót theo hình thức thay thế cho hóa đơn &lt;<span class = 'mauHoaDon'>"
              + formValues.kyHieuMauSoHoaDon + ' - ' + formValues.kyHieuHoaDon + ' - ' + formValues.soHoaDon + ' - ' + moment(formValues.ngayHoaDon).format('DD/MM/YYYY') + '</span>&gt;. Vui lòng kiểm tra lại.';
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
                msContent: canhBao,
              },
              nzFooter: null
            });
          }
        }
        else if (rs.loaiHinhThuc == 2) //thông báo kiểm tra có hóa đơn điều chỉnh hóa đơn đã nhập
        {
          if (this.loaiHinhThuc == 1) {
            let canhBao = '<i>Trường hợp hóa đơn đã lập có sai sót, người bán sẽ xử lý theo hình thức điều chỉnh hoặc thay thế.</i><br>';
            canhBao += "Bạn đã lựa chọn xử lý sai sót theo hình thức điều chỉnh (Lập biên bản điều chỉnh, Lập hóa đơn điều chỉnh) cho hóa đơn &lt;<span class = 'mauHoaDon'>"
              + formValues.kyHieuMauSoHoaDon + ' - ' + formValues.kyHieuHoaDon + ' - ' + formValues.soHoaDon + ' - ' + moment(formValues.ngayHoaDon).format('DD/MM/YYYY') + '</span>&gt;. Vui lòng kiểm tra lại.';
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
                msContent: canhBao,
              },
              nzFooter: null
            });
          }
          else {
            this.hoaDonDienTuService.GetAllListHoaDonLienQuan(rs.id, moment().format("YYYY-MM-DDThh:mm:ss")).subscribe((hdlq: any[]) => {
              var hddc = '';
              for (var i = 0; i < hdlq.length; i++) {
                if (hdlq[i].trangThaiGuiHoaDon == TrangThaiGuiHoaDon.ChuaGui && (hdlq[i].boKyHieuHoaDon.hinhThucHoaDon != 2 || this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == true))
                  hddc += `&nbsp;${i + 1}.Hóa đơn điều chỉnh <span class="cssyellow">&lt;Ký hiệu mẫu số hóa đơn ${hdlq[i].mauSo}, Ký hiệu hóa đơn ${hdlq[i].kyHieu}, Số hóa đơn ${hdlq[i].soHoaDon}, Ngày hóa đơn ${moment(hdlq[i].ngayHoaDon).format('DD/MM/YYYY')}&gt;</span><br>`
              }
              console.log(hddc);
              if (hddc != '') {
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: 600,
                  nzStyle: { top: '10px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    msTitle: "Kiểm tra lại",
                    msContent: `Tồn tại hóa đơn điều chỉnh có liên quan đến hóa đơn bị điều chỉnh chưa gửi cho khách hàng:<br>
                    ${hddc}
                    Tất cả các hóa đơn điều chỉnh liên quan đến hóa đơn bị điều chỉnh cần thực hiện gửi hóa đơn cho khách hàng trước khi tiếp tục điều chỉnh hóa đơn bị điều chỉnh. Vui lòng kiểm tra lại!
                    `,
                    msMessageType: MessageType.Warning,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: () => {
                      this.spinning = false;
                      return;
                    }
                  }
                });
              }
              else {
                formValues.hoaDonDienTuId = rs.id;
                this.modalRef.destroy(formValues);
              }
            })
          }
        }
      }
      else {
        //nếu không trùng thì insert data
        this.insertData(formValues, data);
      }
    });
  }

  //hàm này để insert data
  insertData(formValues: any, data: any) {
    this.thongTinHoaDonService.Insert(data).subscribe((res: any) => {
      if (res) {
        formValues.hoaDonDienTuId = res.id;
        formValues.ngayXoaBo = null; //để ngày = null vì chưa có biên bản hủy
        formValues.loaiHoaDon = formValues.loaiHoaDonThayThe;
        formValues.mauSo = formValues.kyHieuMauSoHoaDon;
        formValues.kyHieu = formValues.kyHieuHoaDon;
        formValues.isSystem = false;
        if (this.listFile.length > 0) {
          //upload file lên server
          this.callUploadApi(res.id, formValues);
        }
        else {
          if (this.loaiHinhThuc == 2) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '55%',
              nzStyle: { top: '10px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: "Chọn hình thức điều chỉnh hóa đơn sai sót",
                msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
                <span class="clsspan">“Trường hợp hóa đơn điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu”</span><br>
                Theo đó, khi đã chọn hình thức điều chỉnh cho hóa đơn (hóa đơn gốc) có ký hiệu mẫu số hóa đơn <span class='cssyellow'>${formValues.mauSo}</span>, ký hiệu hóa đơn <span class='cssyellow'>${formValues.kyHieu}</span>, số hóa đơn <span class='cssyellow'>${formValues.soHoaDon}</span>, ngày hóa đơn <span class='cssyellow'>${moment(formValues.ngayHoaDon).format('DD/MM/YYYY')}</span> thì:<br>
                &nbsp;- Không được tiếp tục xử lý theo hình thức thay thế<br>
                &nbsp;- Tiếp tục được lập hóa đơn điều chỉnh nếu phát hiện còn sai sót.<br>
                &nbsp;- Khi hóa đơn điều chỉnh đã lập có sai sót thì: <br>
                &nbsp;&nbsp;+ Không được phép: hủy hoá đơn điều chỉnh; xóa bỏ hóa đơn điều chỉnh để lập hóa đơn thay thế để thay thế hóa đơn điều chỉnh; lập hóa đơn điều chỉnh để điều chỉnh hóa đơn điều chỉnh; <br>
                &nbsp;&nbsp;+ Được phép: lập hóa đơn điều chỉnh để điều chỉnh hóa đơn gốc có ký hiệu mẫu số hóa đơn <span class='cssyellow'>${formValues.mauSo}</span>, ký hiệu hóa đơn <span class='cssyellow'>${formValues.kyHieu}</span>, số hóa đơn <span class='cssyellow'>${formValues.soHoaDon}</span>, ngày hóa đơn <span class='cssyellow'>${moment(formValues.ngayHoaDon).format('DD/MM/YYYY')}</span> (đã chuyển trạng thái hóa đơn thành Hóa đơn gốc bị điều chỉnh) những sai sót phát hiện tại hóa đơn điều chỉnh đã ảnh hưởng đến hóa đơn gốc<br>
                <br>
                <strong class="cssbrown">Khuyến nghị người bán xử lý hóa đơn đã lập có sai sót theo hình thức thay thế.</strong><br>
                Chọn <strong class='cssblue'>Đồng ý</strong> nếu bạn vẫn muốn thực hiện xử lý sai sót theo hình thức điều chỉnh, chọn <strong class="cssred">Không</strong> trở lại giao diện lúc đầu.
                `,
                msMessageType: MessageType.Confirm,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                msOkButtonInBlueColor: true,
                msOnOk: () => {
                  this.modalRef.destroy(formValues);
                },
                msOnClose: () => {
                  this.spinning = false;
                  this.modalRef.destroy();
                }
              }
            });
          }
          else {
            this.modalRef.destroy(formValues);
          }
        }
      }
      else {
        this.message.error("Không lưu được thông tin hóa đơn");
      }
    });
  }

  //upload File
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

  //api để upload file lên server
  callUploadApi(id: string, formValues: any) {
    var files = this.listFile.filter(x => x.file).map(x => x.file);

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: id,
      loaiNghiepVu: RefType.HoaDonDienTu,
      files: this.formData,
      removedFileIds: []
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
        if (this.loaiHinhThuc == 2) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '55%',
            nzStyle: { top: '10px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Chọn hình thức điều chỉnh đơn sai sót",
              msContent: `Theo điểm c, điều 7 tại Thông tư số 78/2021/TT-BTC quy định:<br>
              <span class="clsspan">"Trường hợp hóa đơn điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu"</span><br>
              Theo đó, khi đã chọn hình thức điều chỉnh cho hóa đơn (hóa đơn gốc) <span class='cssyellow'>&lt;Ký hiệu mẫu số hóa đơn ${formValues.mauSo}, Ký hiệu hóa đơn ${formValues.kyHieu}, Số hóa đơn ${formValues.soHoaDon} Ngày hóa đơn ${moment(formValues.ngayHoaDon).format('DD/MM/YYYY')}&gt;</span> thì:<br>
              &nbsp;- Không được tiếp tục xử lý theo hình thức thay thế<br>
              &nbsp;- Tiếp tục được lập hóa đơn điều chỉnh nếu phát hiện còn sai sót.<br>
              &nbsp;- Khi hóa đơn điều chỉnh đã lập có sai sót thì: <br>
              &nbsp;&nbsp;+ Không được phép: hủy hoá đơn điều chỉnh; xóa bỏ hóa đơn điều chỉnh để lập hóa đơn thay thế để thay thế hóa đơn điều chỉnh; lập hóa đơn điều chỉnh để điều chỉnh hóa đơn điều chỉnh; <br>
              &nbsp;&nbsp;+ Được phép: lập hóa đơn điều chỉnh để điều chỉnh hóa đơn gốc <span class='cssyellow'>&lt;Ký hiệu mẫu số hóa đơn ${formValues.mauSo}, Ký hiệu hóa đơn ${formValues.kyHieu}, Số hóa đơn ${formValues.soHoaDon} Ngày hóa đơn ${moment(formValues.ngayHoaDon).format('DD/MM/YYYY')}&gt;</span> những sai sót phát hiện tại hóa đơn điều chỉnh đã ảnh hưởng đến hóa đơn gốc<br>
              <br>
              <strong class="cssbrown">Khuyến nghị người bán xử lý hóa đơn đã lập có sai sót theo hình thức thay thế.</strong><br>
              Chọn <strong class='cssblue'>Đồng ý</strong> nếu bạn vẫn muốn thực hiện xử lý sai sót theo hình thức điều chỉnh, chọn <strong class="cssred">Không</strong> trở lại giao diện lúc đầu.
              `,
              msMessageType: MessageType.Confirm,
              msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
              msOnOk: () => {
                this.modalRef.destroy(formValues);
              },
              msOnClose: () => {
                this.spinning = false;
                this.modalRef.destroy();
              }
            }
        });
      }
      else this.modalRef.destroy(formValues);
    }
    , _ => {
      this.message.error('Có lỗi lưu file đính kèm');
    });
  }

  //hàm này để xóa file khỏi danh sách file đã chọn
  deleteFile(tldk: any) {
    this.listFile = this.listFile.filter(x => x.tenGoc != tldk.tenGoc);
  }

  //hàm này để thay đổi text của trường loaiHoaDonThayTheText
  changeTextLoaiHoaDonThayThe() {
    let loaiHoaDon = this.form.get('loaiHoaDon').value;

    switch (loaiHoaDon) {
      case 1:
        this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn GTGT');
        this.loaiHoaDon = 1;
        break;
      case 2:
        this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn bán hàng');
        this.loaiHoaDon = 2;
        break;
      case 3:
        this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn bán tài sản công');
        this.loaiHoaDon = 3;
        break;
      case 4:
        this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn bán hàng dự trữ quốc gia');
        this.loaiHoaDon = 4;
        break;
      case 5:
        this.form.get('loaiHoaDonThayTheText').setValue('Các loại hóa đơn khác');
        this.loaiHoaDon = 5;
        break;
      case 6:
        this.form.get('loaiHoaDonThayTheText').setValue('Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn.');
        this.loaiHoaDon = 6;
        break;
      default:
        break;
    }
  }

  //hàm change loại tiền
  changeLoaiTien(event: any) {
    //lọc ra loại tiền
    let loaiTien = this.loaiTiensSearch.find(x => x.loaiTienId == event);
    if (loaiTien != null) {
      this.isVND = loaiTien.ma == 'VND';
    }
  }

  //nếu người dùng xóa ko nhập thì mặc định = 0
  inputThanhTien(event: any) {
    // if (event == null)
    // {
    //   this.form.get('thanhTien').setValue(0);
    // }
  }
}