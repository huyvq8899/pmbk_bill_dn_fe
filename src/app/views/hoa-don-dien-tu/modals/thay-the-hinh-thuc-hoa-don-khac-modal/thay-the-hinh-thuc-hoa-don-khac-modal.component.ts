import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { getLoaiHoaDon, setStyleTooltipError, GetFileUrl, kiemTraHoaDonHopLeTheoKyKeKhai, getLoaiHoaDons, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
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
import { CookieConstant } from 'src/app/constants/constant';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { tap } from 'rxjs/operators';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thay-the-hinh-thuc-hoa-don-khac-modal',
  templateUrl: './thay-the-hinh-thuc-hoa-don-khac-modal.component.html',
  styleUrls: ['./thay-the-hinh-thuc-hoa-don-khac-modal.component.scss']
})
export class ThayTheHinhThucHoaDonKhacModalComponent implements OnInit {
  //loaiHinhThuc = 1: bị thay thế, = 2: bị điều chỉnh
  @Input() loaiHinhThuc: number = 1;
  spinning = false;
  form: FormGroup;
  hinhThucHoaDonCanThayThes: any[] = [];
  hinhThucHoaDonCanThayTheSample: any[] = [];
  customOverlayStyle = {
    width: '600px'
  };
  customOverlayStyle2 = {
    width: '250px'
  };
  customOverlayStyle3 = {
    width: '330px'
  };
  listFile: any[] = [];
  formData: any;
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
  list_LoaiHoaDon: any[] = []; //biến list_LoaiHoaDon này để lọc tùy chỉnh
  loaiHoaDon: number = 1; //phân loại hóa đơn dựa theo trường <Loại hóa đơn (Hóa đơn thay thế)>
  loaiTiensSearch: any[] = [];
  isVND = true;
  ddtp = new DinhDangThapPhan();
  listTrangThaiHoaDon: any[] = [{ value: 1, name: 'Hóa đơn gốc' }, { value: 3, name: 'Hóa đơn thay thế' }];
  hinhThucValue: any;
  loaiHoaDonsAll: any[] = [];
  loaiHoaDons: any[] = [];
  confirmWarningMessage = null;
  warningMessage = null;
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail') ? JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail').giaTri : false;
  isPhieuXuatKho: boolean = false;

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private router: Router,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongDiepGuiCQTService: ThongDiepGuiNhanCQTService,
    private thongTinHoaDonService: ThongTinHoaDonService,
    private uploadFileService: UploadFileService,
    private loaiTienService: LoaiTienService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
  ) { }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }

    this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc;
    if (this.loaiHinhThuc == 1) {
      this.listTrangThaiHoaDon = this.listTrangThaiHoaDon.filter(x => x.value != 4);
    }
    else if (this.loaiHinhThuc == 2) {
      this.listTrangThaiHoaDon = this.listTrangThaiHoaDon.filter(x => x.value != 3);
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

    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      trangThaiHoaDon: [1, [Validators.required]],
      //hinhThucHoaDonCanThayThe: [null, [Validators.required]],
      hinhThucHoaDonCanThayThe: [{ value: this.loaiHinhThuc == 2 ? 4 : null, disabled: this.loaiHinhThuc == 2 }, [Validators.required]],
      maCQTCap: [null, [CheckValidMaCQTCap]],
      soHoaDon: [null, [Validators.required]],
      ngayHoaDon: [moment().format('YYYY-MM-DD'), [Validators.required]],
      dinhKem: [null],
      maTraCuu: [null],
      thanhTien: [0, [Validators.required]],
      loaiHoaDonThayThe: [null, [Validators.required]],
      loaiTienId: [null],

      mauSoHoaDon_LoaiHoaDonText: [null],
      mauSoHoaDon_SoLienHoaDonText: [null],
      mauSoHoaDon_SoThuTuMauText: [null],
      mauSoHoaDon_LoaiHoaDon: ['01GTKT'],
      mauSoHoaDon_SoLienHoaDon: [3],
      mauSoHoaDon_SoThuTuMau: ['001'],

      kyHieuHoaDon_2KyTuDauText: [null],
      kyHieuHoaDon_2KyTuDau_DatInText: ['01'],
      kyHieuHoaDon_2SoCuoiNamThongBaoText: [null],
      kyHieuHoaDon_hinhThucHoaDonText: [null],
      kyHieuHoaDon_2KyTuDau_DatIn: ['01'],
      kyHieuHoaDon_2KyTuDau: ['AA'],
      kyHieuHoaDon_2SoCuoiNamThongBao: ['00'],
      kyHieuHoaDon_hinhThucHoaDon: ['E'],

      // loaiHoaDonThayTheText: [null]
    });

    this.hinhThucValue = 'E';
    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      this.hinhThucHoaDonCanThayThes = res[0].filter(x => x.value != 1); //ko hiển thị loại 1
      this.hinhThucHoaDonCanThayTheSample = this.hinhThucHoaDonCanThayThes;
      this.list_KyHieuHoaDon_2KyTuDau_DatIn = res[2];
      this.loaiHoaDonsAll = res[3];
      this.loaiHoaDons = res[3];

      if (this.loaiHinhThuc == 1) {
        this.hinhThucHoaDonCanThayThes = this.hinhThucHoaDonCanThayTheSample;
      }
      else {
        this.hinhThucHoaDonCanThayThes = this.hinhThucHoaDonCanThayTheSample.filter(x => x.value == 4);
        this.changeHinhThucHoaDon(4);
      }
      this.loaiTiensSearch = res[1];

      if (this.loaiHinhThuc == 1) {
        this.hinhThucHoaDonCanThayThes = this.hinhThucHoaDonCanThayTheSample;
      }
      else {
        this.hinhThucHoaDonCanThayThes = this.hinhThucHoaDonCanThayTheSample.filter(x => x.value == 4);
        this.changeHinhThucHoaDon(4);
      }

      if (this.loaiTiensSearch.length > 0) {
        this.form.get('loaiTienId').setValue(this.loaiTiensSearch[0].loaiTienId); //default value
      }

      if (this.isPhieuXuatKho) {
        this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc.filter(x => x.value == '03XKNB' || x.value == '04HGDL');
        this.form.get('mauSoHoaDon_LoaiHoaDon').setValue('03XKNB');
        this.changeMauSoHoaDon_LoaiHoaDon('03XKNB');
      }
      else {
        this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc.filter(x => x.value != '03XKNB' && x.value != '04HGDL');
        this.changeMauSoHoaDon_LoaiHoaDon('01GTKT');
      }

      this.changeMauSoHoaDon_SoLienHoaDon(3);
      this.changeMauSoHoaDon_SoThuTuMau('001');
      this.changeKyHieuHoaDon_2KyTuDau('AA');
      this.changeKyHieuHoaDon_2SoCuoiNamThongBao('00');

      if (this.loaiHinhThuc == 1) {
        this.changeKyHieuHoaDon_hinhThucHoaDon('E');
      }

      this.spinning = false;
    });
  }

  forkJoin() {
    let params: PagingParams = {
      Keyword: '',
      isActive: true
    };

    return forkJoin([
      this.hoaDonDienTuService.GetListHinhThucHoaDonCanThayThe(),
      this.loaiTienService.GetAll(params),
      this.thongDiepGuiCQTService.GetDanhSachDiaDanh(),
      this.quanLyThongTinHoaDonService.GetLoaiHoaDonDangSuDung()
    ]);
  }

  submitForm() {
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.saveData();
  }

  closeModal() {
    this.modalRef.destroy();
  }

  inputMauSo(event: any) {
    if (event.target.value) {
      this.form.get('mauSo').setValue(event.target.value.toUpperCase());
    }
  }

  inputKyHieu(event: any) {
    if (event.target.value) {
      this.form.get('kyHieu').setValue(event.target.value.toUpperCase());
    }
  }

  //hàm này để nhận biết xem hình thức hóa đơn nào được chọn
  changeHinhThucHoaDon(event: any) {
    if (event == 2) {
      this.list_MauSoHoaDon_SoLienHoaDon = [];
      for (let i = 0; i <= 3; i++) {
        this.list_MauSoHoaDon_SoLienHoaDon.push(i);
      }
      this.form.get('mauSoHoaDon_SoLienHoaDon').setValue(0);
      this.form.get('mauSoHoaDon_SoLienHoaDon').disable();
      this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').setValue('');
      this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').disable();
    }
    else if (event == 3) {
      //reset số liên hóa đơn
      this.list_MauSoHoaDon_SoLienHoaDon = [];
      for (let i = 0; i <= 9; i++) {
        this.list_MauSoHoaDon_SoLienHoaDon.push(i);
      }
      this.form.get('mauSoHoaDon_SoLienHoaDon').setValue(0);
      this.form.get('mauSoHoaDon_SoLienHoaDon').disable();

      this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').setValue('');
      this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').disable();

      //reset lại list_LoaiHoaDon
      this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc;
      this.form.get('mauSoHoaDon_LoaiHoaDon').setValue('01GTKT');
    }
    else {
      //reset lại list_LoaiHoaDon
      this.list_LoaiHoaDon = this.list_LoaiHoaDonGoc.filter(x => x.value != '06HDXK');

      //reset số liên hóa đơn
      this.list_MauSoHoaDon_SoLienHoaDon = [];
      for (let i = 1; i <= 3; i++) {
        this.list_MauSoHoaDon_SoLienHoaDon.push(i);
      }
      this.form.get('mauSoHoaDon_SoLienHoaDon').setValue(3);
      this.form.get('mauSoHoaDon_SoLienHoaDon').enable();
    }

    //cài đặt giá trị hình thức hóa đơn
    if (event != 2) {
      this.form.get('maCQTCap').setValue('');
      if (event == 4) {
        this.form.get('kyHieuHoaDon_hinhThucHoaDon').setValue('P_CT');
        this.changeKyHieuHoaDon_hinhThucHoaDon('P_CT');
      }
      else this.form.get('kyHieuHoaDon_hinhThucHoaDon').setValue('E');
    }
    else {
      this.form.get('kyHieuHoaDon_hinhThucHoaDon').setValue('E');
    }

    this.hinhThucValue = this.form.get('kyHieuHoaDon_hinhThucHoaDon').value;
    // this.changeTextLoaiHoaDonThayThe();
  }

  changeHinhThuc(event: any) {
    this.form.get('kyHieuHoaDon_hinhThucHoaDon').setValue(event);
    this.changeKyHieuHoaDon_hinhThucHoaDon(event);
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

  //save data
  saveData() {
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
            this.checkAndInsertData();
          },
          msOnClose: () => {
            ///////////
          }
        },
        nzFooter: null
      });
      return;
    } else {


      this.checkAndInsertData();
    }
  }

  async checkAndInsertData() {
    let kyHieuMauSoHoaDon = '';
    let kyHieuHoaDon = '';

    let mauSoHoaDon_LoaiHoaDonText = this.form.get('mauSoHoaDon_LoaiHoaDonText').value;
    let mauSoHoaDon_SoLienHoaDonText = this.form.get('mauSoHoaDon_SoLienHoaDonText').value;
    let mauSoHoaDon_SoThuTuMauText = this.form.get('mauSoHoaDon_SoThuTuMauText').value;
    kyHieuMauSoHoaDon = mauSoHoaDon_LoaiHoaDonText + mauSoHoaDon_SoLienHoaDonText + '/' + mauSoHoaDon_SoThuTuMauText;

    let kyHieuHoaDon_2KyTuDau_DatInText = this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').value;
    let kyHieuHoaDon_2KyTuDauText = this.form.get('kyHieuHoaDon_2KyTuDauText').value;
    let kyHieuHoaDon_2SoCuoiNamThongBaoText = this.form.get('kyHieuHoaDon_2SoCuoiNamThongBaoText').value;
    let kyHieuHoaDon_hinhThucHoaDonText = this.form.get('kyHieuHoaDon_hinhThucHoaDonText').value;
    if (kyHieuHoaDon_hinhThucHoaDonText == 'E' || kyHieuHoaDon_hinhThucHoaDonText == 'T')
      kyHieuHoaDon = kyHieuHoaDon_2KyTuDauText + '/' + kyHieuHoaDon_2SoCuoiNamThongBaoText + kyHieuHoaDon_hinhThucHoaDonText;
    else {
      kyHieuHoaDon = kyHieuHoaDon_2KyTuDau_DatInText + kyHieuHoaDon_2KyTuDauText + '/' + kyHieuHoaDon_2SoCuoiNamThongBaoText + kyHieuHoaDon_hinhThucHoaDonText;
    }
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

    // formValues.loaiHoaDon = getLoaiHoaDon(kyHieuMauSoHoaDon);
    formValues.loaiHoaDon = this.loaiHoaDon = this.form.get('loaiHoaDonThayThe').value;
    formValues.mauSo = kyHieuMauSoHoaDon;//trường này để đẩy sang form lập hóa đơn thay thế
    formValues.kyHieu = kyHieuHoaDon;//trường này để đẩy sang form lập hóa đơn thay thế

    let data = {
      hinhThucHoaDonCanThayThe: formValues.hinhThucHoaDonCanThayThe,
      hinhThucApDung: formValues.hinhThucHoaDonCanThayThe,
      maCQTCap: formValues.maCQTCap,
      mauSoHoaDon: kyHieuMauSoHoaDon,
      kyHieuHoaDon: kyHieuHoaDon,
      mauSo: kyHieuMauSoHoaDon,
      soHoaDon: formValues.soHoaDon,
      trangThaiHoaDon: formValues.trangThaiHoaDon,
      ngayHoaDon: formValues.ngayHoaDon,
      loaiHoaDon: formValues.loaiHoaDonThayThe,
      loaiTienId: formValues.loaiTienId,
      maTraCuu: formValues.maTraCuu,
      thanhTien: formValues.thanhTien,
      isDaLapThongBao04: false,
      lanGui04: 0
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
            canhBao += "Bạn đã lựa chọn xử lý sai sót theo hình thức thay thế cho hóa đơn <span class = 'cssyellow'>"
              + kyHieuMauSoHoaDon + ' - ' + kyHieuHoaDon + ' - ' + formValues.soHoaDon + ' - ' + moment(formValues.ngayHoaDon).format('DD/MM/YYYY') + '</span>;. Vui lòng kiểm tra lại.';
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
            canhBao += "Bạn đã lựa chọn xử lý sai sót theo hình thức điều chỉnh (Lập biên bản điều chỉnh, Lập hóa đơn điều chỉnh) cho hóa đơn <span class = 'cssyellow'>"
              + kyHieuMauSoHoaDon + ' - ' + kyHieuHoaDon + ' - ' + formValues.soHoaDon + ' - ' + moment(formValues.ngayHoaDon).format('DD/MM/YYYY') + '</span>. Vui lòng kiểm tra lại.';
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
        //this.insertData(formValues, data);
      }
      else {
        //nếu không trùng thì insert data
        this.insertData(formValues, data);
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

  //hàm này để insert data
  insertData(formValues: any, data: any) {
    this.thongTinHoaDonService.Insert(data).subscribe((res: any) => {
      if (res) {
        formValues.hoaDonDienTuId = res.id;
        formValues.ngayXoaBo = null; //để ngày = null vì chưa có biên bản hủy
        formValues.loaiHoaDon = this.loaiHoaDon;
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
          else this.modalRef.destroy(formValues);
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

  changeMauSoHoaDon_LoaiHoaDon(event: string) {
    this.form.get('mauSoHoaDon_LoaiHoaDonText').setValue(event);

    this.loaiHoaDons = JSON.parse(JSON.stringify(this.loaiHoaDonsAll));

    this.confirmWarningMessage = null;
    this.warningMessage = null;

    const tenLoaiHinhThuc = this.loaiHinhThuc === 1 ? 'thay thế' : 'điều chỉnh';

    switch (event) {
      case '01GTKT':
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
      case '02GTTT':
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
      case '06HDXK':
        if (this.loaiHoaDons.some(x => x.value === 1) && !this.loaiHoaDons.some(x => x.value === 2)) { // Nếu chỉ đăng ký sử dụng Hóa đơn GTGT
          this.form.get('loaiHoaDonThayThe').setValue(1);
          this.form.get('loaiHoaDonThayThe').disable();
        } else if (!this.loaiHoaDons.some(x => x.value === 1) && this.loaiHoaDons.some(x => x.value === 2)) { // Nếu chỉ đăng ký sử dụng Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(2);
          this.form.get('loaiHoaDonThayThe').disable();
        } else if (this.loaiHoaDons.some(x => x.value === 1) && this.loaiHoaDons.some(x => x.value === 2)) { // Nếu đăng ký cả Hóa đơn GTGT và Hóa đơn Bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').enable();
          this.loaiHoaDons = this.loaiHoaDons.filter(x => x.value === 1 || x.value === 2);
        } else {
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp (<b>Hóa đơn bán hàng</b> hoặc <b>Hóa đơn GTGT</b>)
          để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là loại <b>Hóa đơn xuất khẩu</b>. Vui lòng kiểm tra lại!`;
        }
        break;
      case '07KPTQ':
        if (this.loaiHoaDons.some(x => x.value === 2)) { // Nếu có đăng ký sử dụng Hóa đơn bán hàng
          this.form.get('loaiHoaDonThayThe').setValue(2);
          this.form.get('loaiHoaDonThayThe').disable();
        } else {
          this.form.get('loaiHoaDonThayThe').setValue(null);
          this.form.get('loaiHoaDonThayThe').disable();
          this.warningMessage = `Hệ thống nhận thấy bạn chưa đăng ký sử dụng loại hóa đơn phù hợp là
          <b>Hóa đơn bán hàng</b> để lập hóa đơn ${tenLoaiHinhThuc} cho hóa đơn bị ${tenLoaiHinhThuc} là loại <b>Hóa đơn bán hàng
          (dành cho tổ chức, cá nhân trong khu phi thuế quan)</b>. Vui lòng kiểm tra lại!`;
        }
        break;
      case '03XKNB':
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
      case '04HGDL':
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

    //this.changeTextLoaiHoaDonThayThe();
  }

  changeMauSoHoaDon_SoLienHoaDon(event: number) {
    this.form.get('mauSoHoaDon_SoLienHoaDonText').setValue(event.toString());
  }

  changeMauSoHoaDon_SoThuTuMau(event: string) {
    this.form.get('mauSoHoaDon_SoThuTuMauText').setValue(event);
  }

  changeKyHieuHoaDon_2KyTuDau(event: string) {
    this.form.get('kyHieuHoaDon_2KyTuDauText').setValue(event);
  }

  changeKyHieuHoaDon_2KyTuDau_DatIn(event: string) {
    this.form.get('kyHieuHoaDon_2KyTuDau_DatInText').setValue(event);
  }


  changeKyHieuHoaDon_2SoCuoiNamThongBao(event: string) {
    this.form.get('kyHieuHoaDon_2SoCuoiNamThongBaoText').setValue(event);
  }

  changeKyHieuHoaDon_hinhThucHoaDon(event: string) {
    let hinhThucHoaDonCanThayThe = this.form.get('hinhThucHoaDonCanThayThe').value;
    if (event == 'E' || event == 'T') {
      this.form.get('kyHieuHoaDon_hinhThucHoaDonText').setValue(event);
    }
    else {
      this.form.get('kyHieuHoaDon_hinhThucHoaDonText').setValue('P');
    }
    if (event == 'E') {
      //reset số liên hóa đơn
      if (hinhThucHoaDonCanThayThe == 2 || hinhThucHoaDonCanThayThe == 3 || hinhThucHoaDonCanThayThe == null) {
        this.list_MauSoHoaDon_SoLienHoaDon = [];
        this.list_MauSoHoaDon_SoLienHoaDon.push(0);
        this.form.get('mauSoHoaDon_SoLienHoaDon').setValue(0);
        this.form.get('mauSoHoaDon_SoLienHoaDon').disable();
      }
    }
    else {
      if (hinhThucHoaDonCanThayThe == 2 || hinhThucHoaDonCanThayThe == 3) {
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
      this.form.get('mauSoHoaDon_SoLienHoaDon').setValue(3);

      this.form.get('mauSoHoaDon_SoLienHoaDon').enable();
    }

    if (event == 'E') {
      // this.form.get('maTraCuu').setValidators(Validators.required);
    }
    else {
      this.form.get('maTraCuu').markAsDirty;
      this.form.get('maTraCuu').clearValidators();
    }

  }

  //hàm này để thay đổi text của trường loaiHoaDonThayTheText
  changeTextLoaiHoaDonThayThe() {
    let hinhThucApDung = this.form.get('hinhThucHoaDonCanThayThe').value;
    let loaiHoaDon = this.form.get('mauSoHoaDon_LoaiHoaDon').value;
    if (hinhThucApDung == 2 || hinhThucApDung == 3) {
      switch (loaiHoaDon) {
        case '01GTKT':
          this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn GTGT');
          this.loaiHoaDon = 1;
          break;
        case '02GTTT':
        case '06HDXK':
        case '07KPTQ':
          this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn bán hàng');
          this.loaiHoaDon = 2;
          break;
        case '03XKNB':
        case '04HGDL':
          this.form.get('loaiHoaDonThayTheText').setValue('Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn.');
          this.loaiHoaDon = 3;
          break;
        default:
          break;
      }
    }
    else {
      switch (loaiHoaDon) {
        case '01GTKT':
          this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn GTGT');
          this.loaiHoaDon = 1;
          break;
        case '02GTTT':
        case '07KPTQ':
          this.form.get('loaiHoaDonThayTheText').setValue('Hóa đơn bán hàng');
          this.loaiHoaDon = 2;
          break;
        case '03XKNB':
        case '04HGDL':
          this.form.get('loaiHoaDonThayTheText').setValue('Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn.');
          this.loaiHoaDon = 3;
          break;
        default:
          break;
      }
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
    // if (event == null) {
    //   this.form.get('thanhTien').setValue(0);
    // }
  }
}