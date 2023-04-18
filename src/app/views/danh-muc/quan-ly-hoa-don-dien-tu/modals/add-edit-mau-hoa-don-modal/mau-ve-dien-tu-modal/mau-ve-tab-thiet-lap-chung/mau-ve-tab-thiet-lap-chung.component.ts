import { ValidatorsDupcateMauHoaDon, ValidatorsDupcateName } from 'src/app/customValidators/validatorsDupcateName';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable, Subscription } from 'rxjs';
import { CheckValidKyHieu } from 'src/app/customValidators/check-valid-kyhieu.validator';
import { LoaiChiTietTuyChonNoiDung, LoaiTuyChinhChiTiet } from 'src/app/enums/LoaiThietLapMacDinh.enums';
import { MauHoaDonTuyChonChiTiet } from 'src/app/models/danh-muc/MauHoaDonThietLapMacDinh';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { SharedService } from 'src/app/services/share-service';
import { isValidExtention, isValidFileSize, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { GetRawTuyChinhChiTiet } from 'src/assets/ts/init-create-mau-hd';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-mau-ve-tab-thiet-lap-chung',
  templateUrl: './mau-ve-tab-thiet-lap-chung.component.html',
  styleUrls: ['./mau-ve-tab-thiet-lap-chung.component.scss']
})
export class MauVeTabThietLapChungComponent implements OnInit {

  @Output() valueChangesEvent = new EventEmitter<any>();
  @Output() logoChangeEvent = new EventEmitter<FormData>();
  @Output() tabStatusEvent = new EventEmitter<any>();
  @Input() data: any;
  thietLapMauForm: FormGroup;
  fonts = [
    "Arial",
    "Times New Roman"
  ]
  colors1 = ['#F2994A', '#0068FF', '#7D7D7D', '#7B61FF', '#15A85F'];
  colors2 = ['#E82A2A', '#000000', '#7BB6EC', '#FF00F5', '#FFE600'];
  logoUrl = null;
  _validFileExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPGE', '.PNG'];
  sub: Subscription;
  emptyImage = 'url(../../../../../../../assets/empty-image.svg)';
  loai = {
    ThongTinNguoiBan: LoaiTuyChinhChiTiet.ThongTinNguoiBan,
    ThongTinHoaDon: LoaiTuyChinhChiTiet.ThongTinHoaDon,
    MauSoKyHieuSoHoaDon: LoaiTuyChinhChiTiet.MauSoKyHieuSoHoaDon,
    ThongTinNguoiMua: LoaiTuyChinhChiTiet.ThongTinNguoiMua,
    MaQRCode: LoaiTuyChinhChiTiet.MaQRCode,
    ThongTinVeHangHoaDichVu: LoaiTuyChinhChiTiet.ThongTinVeHangHoaDichVu,
    ThongTinVeTongGiaTriHHDV: LoaiTuyChinhChiTiet.ThongTinVeTongGiaTriHHDV,
    ThongTinNgoaiTe: LoaiTuyChinhChiTiet.ThongTinNgoaiTe,
    ThongTinNguoiKy: LoaiTuyChinhChiTiet.ThongTinNguoiKy,
    ThongTinTraCuu: LoaiTuyChinhChiTiet.ThongTinTraCuu,
  };
  isDuplicate : boolean;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private sharedService: SharedService,
    private mauHoaDonService: MauHoaDonService,
  ) { }

  ngOnInit() {
    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res && res.type === 'updatePositionSizeImage') {
        const data = res.value;

        this.thietLapMauForm.get('topLogo').setValue(data.topLogo);
        this.thietLapMauForm.get('leftLogo').setValue(data.leftLogo);
        this.thietLapMauForm.get('widthLogo').setValue(data.widthLogo);
        this.thietLapMauForm.get('heightLogo').setValue(data.heightLogo);
      }
    });

    this.createForm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createForm() {
    console.log("🚀 ~ file: tab-thiet-lap-chung.component.ts:78 ~ TabThietLapChungComponent ~ createForm ~ this.isDuplicate", this.isDuplicate)
    this.thietLapMauForm = this.fb.group({
     // ten: [null, [Validators.required], [ValidatorsDupcateMauHoaDon(this.mauHoaDonService, this.isDuplicate)]],
      ten: [null, [Validators.required]],
      tenBoMau: [null],
      anhLogo: [null],
      tenLogo: [null],
      topLogo: [0],
      leftLogo: [-2],
      widthLogo: [0],
      heightLogo: [0],
      viTriLogo: [1],
      fontChu: [null],
      coChu: [null],
      mauChu: [null],
      isHienThiQRCode: [true],
      isLapLaiTTHDCoNhieuTrang: [false],
      isThietLapDongKyHieuCot: [false],
      soDongTrang: [5]
    });

    this.thietLapMauForm.patchValue({
      ...this.data
    });

    this.thietLapMauForm.valueChanges.subscribe((res: any) => {
      setStyleTooltipError();
      this.tabStatusEvent.emit({ tabPosition: 1, isDirty: true, isInvalid: this.thietLapMauForm.invalid })
    });
  }

  selectedColor(color: any) {
    this.thietLapMauForm.get('mauChu').setValue(color);
    if (this.data.tuyChonChiTiets && this.data.tuyChonChiTiets.length > 0) {
      this.data.tuyChonChiTiets.forEach((parent: MauHoaDonTuyChonChiTiet) => {
        parent.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
          item.tuyChonChiTiet.mauChu = color;
        });
      });
    }
    this.emitValueChangesEvent();
  }

  deleteLogo() {
    this.thietLapMauForm.get('anhLogo').setValue(null);
    this.thietLapMauForm.get('tenLogo').setValue(null);

    this.thietLapMauForm.get('viTriLogo').setValue(1);
    this.thietLapMauForm.get('topLogo').setValue(0);
    this.thietLapMauForm.get('leftLogo').setValue(-2);
    this.thietLapMauForm.get('widthLogo').setValue(0);
    this.thietLapMauForm.get('heightLogo').setValue(0);

    this.logoChangeEvent.emit(null);
    var container = document.querySelector('.logo-container') as HTMLElement;
    var path = '../../../../../../../assets/empty-image.svg';
    container.style.backgroundImage = `url(${path})`;
    this.emitValueChangesEvent();
  }

  decreaseSize() {
    const coChu = this.thietLapMauForm.get('coChu').value - 1;
    this.thietLapMauForm.get('coChu').setValue(coChu);
    if (this.data.tuyChonChiTiets && this.data.tuyChonChiTiets.length > 0) {
      this.data.tuyChonChiTiets.forEach((parent: MauHoaDonTuyChonChiTiet) => {
        parent.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
          const rawItem = GetRawTuyChinhChiTiet(item.loaiChiTiet, this.data);
          if (rawItem) {
            item.tuyChonChiTiet.coChu = rawItem.children.find(x => x.loaiContainer === item.loaiContainer).tuyChonChiTiet.coChu + coChu;
          } else {
            const tempItem = GetRawTuyChinhChiTiet(LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan, this.data);
            if (tempItem.children.find(x => x.loaiContainer === item.loaiContainer)) {
              item.tuyChonChiTiet.coChu = tempItem.children.find(x => x.loaiContainer === item.loaiContainer).tuyChonChiTiet.coChu + coChu;
            }
          }
        });
      });
    }
    this.emitValueChangesEvent();
  }

  increaseSize() {
    const coChu = this.thietLapMauForm.get('coChu').value + 1;
    this.thietLapMauForm.get('coChu').setValue(coChu);
    if (this.data.tuyChonChiTiets && this.data.tuyChonChiTiets.length > 0) {
      this.data.tuyChonChiTiets.forEach((parent: MauHoaDonTuyChonChiTiet) => {
        parent.children.forEach((item: MauHoaDonTuyChonChiTiet) => {
          const rawItem = GetRawTuyChinhChiTiet(item.loaiChiTiet, this.data);

          if (rawItem) {
            item.tuyChonChiTiet.coChu = rawItem.children.find(x => x.loaiContainer === item.loaiContainer).tuyChonChiTiet.coChu + coChu;
          } else {
            const tempItem = GetRawTuyChinhChiTiet(LoaiChiTietTuyChonNoiDung.MaSoThueNguoiBan, this.data);
            if (tempItem.children.find(x => x.loaiContainer === item.loaiContainer)) {
              item.tuyChonChiTiet.coChu = tempItem.children.find(x => x.loaiContainer === item.loaiContainer).tuyChonChiTiet.coChu + coChu;
            }
          }
        });
      });
    }
    this.emitValueChangesEvent();
  }

  uploadLogo(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      if (!isValidExtention(event.target.files[0].name, this._validFileExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!isValidFileSize(event.target.files[0].size, 2)) {
        this.message.error('Dung lượng file vượt quá 2MB.');
        return;
      }

      this.logoChangeEvent.emit(files[0]);
      this.thietLapMauForm.get('tenLogo').setValue(null);
      this.XemTruocAnh(event);
    }
    event.target.value = null;
  }

  XemTruocAnh(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = () => {
        this.thietLapMauForm.get('anhLogo').setValue(reader.result);
        this.getLogoSize();
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getLogoSize() {
    setTimeout(() => {
      var imgLogo = document.querySelector('.logo-container img') as HTMLElement;
      if (imgLogo) {
        if (imgLogo) {
          this.thietLapMauForm.get('widthLogo').setValue(imgLogo.offsetWidth + (imgLogo.offsetWidth * 50 / 100));
          this.thietLapMauForm.get('heightLogo').setValue(imgLogo.offsetHeight + (imgLogo.offsetHeight * 50 / 100));
          this.emitValueChangesEvent();
        }

        var container = document.querySelector('.logo-container') as HTMLElement;
        container.style.backgroundImage = 'unset';
      }
    }, 0);
  }

  changeViTriLogo(value: any) {
    this.thietLapMauForm.get('viTriLogo').setValue(value);
    this.emitValueChangesEvent();
  }

  submitForm() {
    if (this.thietLapMauForm.invalid) {
      for (const i in this.thietLapMauForm.controls) {
        this.thietLapMauForm.controls[i].markAsTouched();
        this.thietLapMauForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return false;
    }
    return true;
  }

  emitValueChangesEvent() {
    const data = this.thietLapMauForm.getRawValue();
    data.tuyChonChiTiets = this.data.tuyChonChiTiets;
    this.valueChangesEvent.emit(data);
    this.isDuplicate = false;
  }

  checkThietLapDongKyHieu(event: any) {
    let hhdvs = this.data.tuyChonChiTiets.filter(x => x.loai === this.loai.ThongTinVeHangHoaDichVu && x.loaiChiTiet !== LoaiChiTietTuyChonNoiDung.SoLuongNhapXuat && x.checked === true) as any[];
    hhdvs = hhdvs.sort((a, b) => a.stt - b.stt);
    hhdvs.forEach((item: any, index: any) => {
      const dongKyHieuCot = item.children.find(x => x.loaiContainer === 3);
      if (dongKyHieuCot) {
        dongKyHieuCot.giaTri = index + 1;
      }
    });

    this.emitValueChangesEvent();
  }

  AfterShowFormCheckDuplicate() {
    this.thietLapMauForm.controls['ten'].markAsTouched();
    this.thietLapMauForm.controls['ten'].updateValueAndValidity();
    setStyleTooltipError(true);
    document.getElementById('TenHoaDon').focus();
    this.isDuplicate = true;
    console.log("🚀 ~ file: tab-thiet-lap-chung.component.ts:269 ~ TabThietLapChungComponent ~ AfterShowFormCheckDuplicate ~ this.isDuplicate", this.isDuplicate)
  }
}
