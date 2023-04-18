import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { SharedService } from 'src/app/services/share-service';
import { IsSVG, isValidExtention, isValidFileSize, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { ThietLapChuChimModalComponent } from '../../tab-thiet-lap-hinh-nen/thiet-lap-chu-chim-modal/thiet-lap-chu-chim-modal.component';

@Component({
  selector: 'app-mau-ve-tab-thiet-lap-hinh-nen',
  templateUrl: './mau-ve-tab-thiet-lap-hinh-nen.component.html',
  styleUrls: ['./mau-ve-tab-thiet-lap-hinh-nen.component.scss']
})
export class MauVeTabThietLapHinhNenComponent implements OnInit {
  @Output() valueChangesEvent = new EventEmitter<any>();
  @Output() backgroundChangeEvent = new EventEmitter<FormData>();
  @Output() tabStatusEvent = new EventEmitter<any>();
  @Input() data: any;
  thietLapMauForm: FormGroup;
  backgrounds = [];
  tabPosition = 1;
  _validFileExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPGE', '.PNG'];
  sub: Subscription;
  emptyImage = 'url(../../../../../../../assets/empty-image.svg)';
  isSelectBackground = false;
  typeOfBackground = 1; // 1: Khung, 2 Hình nền
  color = '#000000';
  dataTemp = null;
  defaultBorders = [];
  defaultBackgrounds = [];

  constructor(
    private fb: FormBuilder,
    private mauHoaDonSerivce: MauHoaDonService,
    public env: EnvService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    if (!this.dataTemp) {
      this.dataTemp = Object.assign({}, this.data);
      this.dataTemp.opacityHinhNenMacDinhPer = Math.round(this.dataTemp.opacityHinhNenMacDinh * 100);
    }

    this.sub = this.sharedService.changeEmitted$.subscribe((res: any) => {
      if (res && res.type === 'updatePositionSizeImage') {
        const data = res.value;

        this.thietLapMauForm.get('topHinhNenTaiLen').setValue(data.topHinhNenTaiLen);
        this.thietLapMauForm.get('leftHinhNenTaiLen').setValue(data.leftHinhNenTaiLen);
        this.thietLapMauForm.get('widthHinhNenTaiLen').setValue(data.widthHinhNenTaiLen);
        this.thietLapMauForm.get('heightHinhNenTaiLen').setValue(data.heightHinhNenTaiLen);
      }
      if (res && res.type === 'updateSelectBackgroundStatusFromParent') {
        this.isSelectBackground = res.value;
      }
      if (res && res.type === 'selectedBackgroundFromParent') {
        this.isSelectBackground = false;

        if (res.value) {
          this.setValueForData();
        } else {
          this.thietLapMauForm.patchValue({
            codeKhungVienMacDinh: this.dataTemp.codeKhungVienMacDinh,
            khungVienMacDinh: this.dataTemp.khungVienMacDinh,
            mauKhungVienMacDinh: this.dataTemp.mauKhungVienMacDinh,
            codeHinhNenMacDinh: this.dataTemp.codeHinhNenMacDinh,
            hinhNenMacDinh: this.dataTemp.hinhNenMacDinh,
            mauHinhNenMacDinh: this.dataTemp.mauHinhNenMacDinh,
            opacityHinhNenMacDinh: this.dataTemp.opacityHinhNenMacDinh,
            opacityHinhNenMacDinhPer: this.dataTemp.opacityHinhNenMacDinhPer
          });
          this.emitValueChangesEvent();
        }
      }
    });

    this.createForm();

    this.forkJoin().subscribe((res: any[]) => {
      this.defaultBorders = res[0];
      this.defaultBackgrounds = res[1];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // forkJoin() {
  //   return forkJoin([
  //     this.mauHoaDonSerivce.GetMauHoaDonBackgrounds()
  //   ]);
  // }

  createForm() {
    this.thietLapMauForm = this.fb.group({
      codeHinhNenMacDinh: [null],
      hinhNenMacDinh: [null],
      mauKhungVienMacDinh: [null],
      codeKhungVienMacDinh: [null],
      khungVienMacDinh: [null],
      mauHinhNenMacDinh: [null],
      opacityHinhNenMacDinh: [0.35],
      opacityHinhNenMacDinhPer: [35],
      opacityHinhNenTaiLen: [0.35],
      opacityHinhNenTaiLenPer: [35],
      topHinhNenTaiLen: [0],
      leftHinhNenTaiLen: [0],
      widthHinhNenTaiLen: [0],
      heightHinhNenTaiLen: [0],
      viTriHinhNen: [2],
      loaiHinhNenRieng: [null], // 1: tải lên, 2: viết chữ chìm
      hinhNenTaiLen: [null],
      tenHinhNenTaiLen: [null],
      kieuChuChim: ['Arial'],
      coChuChim: [80],
      boldChuChim: [false],
      italicChuChim: [false],
      mauChuChim: ['#000000'],
      doNetChuChim: [0.35],
      doNetChuChimPer: [35],
      noiDungChuChim: [null],
      blockBackground: [true]
    });

    this.thietLapMauForm.patchValue({
      ...this.data,
    });

    this.thietLapMauForm.valueChanges.subscribe((res: any) => {
      this.tabStatusEvent.emit({ tabPosition: 2, isDirty: true, isInvalid: this.thietLapMauForm.invalid })
    });

    this.data.opacityHinhNenMacDinhPer = Math.round(this.data.opacityHinhNenMacDinh * 100);
  }

  forkJoin() {
    return forkJoin([
      this.mauHoaDonSerivce.GetBorderA5s(),
      this.mauHoaDonSerivce.GetBackgrounds()
    ]);
  }

  selectedTemplate(data: any) {
    if (data.selected) {
      data.selected = false;
      this.thietLapMauForm.get(this.typeOfBackground === 1 ? 'codeKhungVienMacDinh' : 'codeHinhNenMacDinh').setValue(null)
    } else {
      data.selected = true;
      this.thietLapMauForm.get(this.typeOfBackground === 1 ? 'codeKhungVienMacDinh' : 'codeHinhNenMacDinh').setValue(data.code)
    }

    this.thietLapMauForm.get(this.typeOfBackground === 1 ? 'khungVienMacDinh' : 'hinhNenMacDinh').setValue(data.selected ? data.background : null);

    this.backgrounds.forEach((item: any) => {
      if (data != item) {
        item.selected = false;
      }
    });

    this.emitValueChangesEvent();
  }

  uploadBG(files: any[], loaiHinhNenRieng: any, event = null) {
    if (event) {
      this.thietLapMauForm.get('blockBackground').setValue(false);
    }

    if (files && files[0]) {
      this.thietLapMauForm.get('loaiHinhNenRieng').setValue(loaiHinhNenRieng);
      if (!isValidExtention(files[0].name, this._validFileExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }

      if (!isValidFileSize(files[0].size, 3)) {
        this.message.error('Dung lượng file vượt quá 3MB.');
        return;
      }
      this.backgroundChangeEvent.emit(files[0]);
      this.thietLapMauForm.get('tenHinhNenTaiLen').setValue(null);
      this.XemTruocAnh(files);
    }
    if (event) {
      event.target.value = null;
    }
  }

  XemTruocAnh(files: any[]) {
    if (files.length > 0) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.thietLapMauForm.get('hinhNenTaiLen').setValue((<FileReader>event.target).result);
        this.getLogoSize();
      }
      reader.readAsDataURL(files[0]);
    }
    ///
  }

  getLogoSize() {
    var intervalId = setInterval(() => {
      var imgLogo = document.querySelector('.custom-bg-wrapper img') as HTMLImageElement;
      if (imgLogo) {
        clearInterval(intervalId);
        
        this.setKichCoHinhNenKhiChangeViTri();

        this.thietLapMauForm.get('kieuChuChim').setValue(this.data.kieuChuChim);
        this.thietLapMauForm.get('coChuChim').setValue(this.data.coChuChim);
        this.thietLapMauForm.get('boldChuChim').setValue(this.data.boldChuChim);
        this.thietLapMauForm.get('italicChuChim').setValue(this.data.italicChuChim);
        this.thietLapMauForm.get('mauChuChim').setValue(this.data.mauChuChim);
        this.thietLapMauForm.get('doNetChuChim').setValue(this.data.doNetChuChim);
        this.thietLapMauForm.get('doNetChuChimPer').setValue(this.data.doNetChuChimPer);
        this.thietLapMauForm.get('noiDungChuChim').setValue(this.data.noiDungChuChim);

        this.emitValueChangesEvent();

        this.thietLapMauForm.get('blockBackground').setValue(true);
      }
    }, 1);
  }

  deleteBG() {
    this.thietLapMauForm.get('hinhNenTaiLen').setValue(null);
    this.thietLapMauForm.get('topHinhNenTaiLen').setValue(0);
    this.thietLapMauForm.get('leftHinhNenTaiLen').setValue(0);
    this.thietLapMauForm.get('widthHinhNenTaiLen').setValue(0);
    this.thietLapMauForm.get('heightHinhNenTaiLen').setValue(0);
    this.thietLapMauForm.get('tenHinhNenTaiLen').setValue(null);
    this.thietLapMauForm.get('opacityHinhNenTaiLen').setValue(0.35);
    this.thietLapMauForm.get('opacityHinhNenTaiLenPer').setValue(35);
    this.backgroundChangeEvent.emit(null);
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
    this.valueChangesEvent.emit(data);
  }

  afterChangeOpacity(event: any, key: any) {
    this.thietLapMauForm.get(key).setValue(event / 100);
    this.emitValueChangesEvent();
  }

  afterChangeOpacityHinhNenMacDinh(event: any) {
    this.thietLapMauForm.get('opacityHinhNenMacDinh').setValue(event / 100);
    this.thietLapMauForm.get('opacityHinhNenMacDinhPer').setValue(event);
    this.emitValueChangesEvent();
  }

  filesDropped(files: any[]) {
    if (files.length > 0) {
      this.uploadBG(files, 1)
    } else {
      this.message.error('Vui lòng chọn file.');
    }
  }

  clearBackground() {
    this.thietLapMauForm.get('codeKhungVienMacDinh').setValue(null);
    this.thietLapMauForm.get('khungVienMacDinh').setValue(null);
    this.thietLapMauForm.get('mauKhungVienMacDinh').setValue('#000000');
    this.thietLapMauForm.get('codeHinhNenMacDinh').setValue(null);
    this.thietLapMauForm.get('hinhNenMacDinh').setValue(null);
    this.thietLapMauForm.get('mauHinhNenMacDinh').setValue('#000000');
    this.setValueForData();
    this.deleteBG();
  }

  changeViTriHinhNen(blockChange = true) {
    if (!this.thietLapMauForm.get('viTriHinhNen').dirty && blockChange) {
      return;
    }

    this.setKichCoHinhNenKhiChangeViTri();
    this.thietLapMauForm.get('blockBackground').setValue(false);

    this.emitValueChangesEvent();
    this.thietLapMauForm.get('blockBackground').setValue(true);
    this.thietLapMauForm.get('viTriHinhNen').markAsPristine();
  }

  setKichCoHinhNenKhiChangeViTri() {
    const viTriHinhNen = this.thietLapMauForm.get('viTriHinhNen').value;
    
    var imgLogo = document.querySelector('.custom-bg-wrapper img') as HTMLImageElement;
    let width = imgLogo.naturalWidth;
    let height = imgLogo.naturalHeight;

    if (viTriHinhNen === 1) {
      height = (height * 100 / (width * 100 / 864));
      width = 864;
    } else {
      if (width > 864) {
        width = 864;
        height = Math.round(height * (864 * 100 / imgLogo.naturalWidth) / 100);
      }
      if (height > 1224) {
        height = 1224;
        width = Math.round(width * (1224 * 100 / imgLogo.naturalHeight) / 100);
      }
    }

    this.thietLapMauForm.get('topHinhNenTaiLen').setValue(null);
    this.thietLapMauForm.get('leftHinhNenTaiLen').setValue(null);
    this.thietLapMauForm.get('widthHinhNenTaiLen').setValue(width);
    this.thietLapMauForm.get('heightHinhNenTaiLen').setValue(height);
  }

  changeMau() {
    if (this.thietLapMauForm.get('mauKhungVienMacDinh').dirty || this.thietLapMauForm.get('mauHinhNenMacDinh').dirty) {
      this.emitValueChangesEvent();
      this.thietLapMauForm.get('mauKhungVienMacDinh').markAsPristine();
      this.thietLapMauForm.get('mauHinhNenMacDinh').markAsPristine();
      this.setValueForData();
    }
  }

  vietChuChim() {
    this.data.doNetChuChimPer = this.thietLapMauForm.get('opacityHinhNenTaiLenPer').value;
    this.data.doNetChuChim = this.thietLapMauForm.get('opacityHinhNenTaiLen').value;

    const modal = this.modalService.create({
      nzTitle: 'Thiết lập chữ chìm',
      nzContent: ThietLapChuChimModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 770,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data: this.data
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        this.thietLapMauForm.get('blockBackground').setValue(false);

        this.data = {
          ...this.data,
          ...rs.data
        };

        this.thietLapMauForm.get('opacityHinhNenTaiLenPer').setValue(this.data.doNetChuChimPer);
        this.thietLapMauForm.get('opacityHinhNenTaiLen').setValue(this.data.doNetChuChim);

        this.uploadBG(rs.files, 2);
      }
    });
  }

  openSelectHinhNenKhungVien(type: any) {
    this.isSelectBackground = true;
    this.typeOfBackground = type;
    this.color = type === 1 ? this.dataTemp.mauKhungVienMacDinh : this.dataTemp.mauHinhNenMacDinh;

    this.backgrounds = [...type === 1 ? this.defaultBorders : this.defaultBackgrounds];
    this.backgrounds.forEach((item: any) => {
      const code = type === 1 ? this.thietLapMauForm.get('codeKhungVienMacDinh').value : this.thietLapMauForm.get('codeHinhNenMacDinh').value;
      if (code === item.code) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.sharedService.emitChange({
      type: "updateSelectBackgroundStatus",
      value: this.isSelectBackground
    });
  }

  deleteSelectedHinhNenKhungVien(type: any) {
    if (type === 1) {
      this.thietLapMauForm.get('codeKhungVienMacDinh').setValue(null);
      this.thietLapMauForm.get('khungVienMacDinh').setValue(null);
      this.thietLapMauForm.get('mauKhungVienMacDinh').setValue('#000000');
    } else {
      this.thietLapMauForm.get('codeHinhNenMacDinh').setValue(null);
      this.thietLapMauForm.get('hinhNenMacDinh').setValue(null);
      this.thietLapMauForm.get('mauHinhNenMacDinh').setValue('#000000');
    }

    this.emitValueChangesEvent();
    this.setValueForData();
  }

  checkIsSVG(type: any) {
    const data = this.thietLapMauForm.getRawValue();
    return IsSVG(type === 1 ? data.khungVienMacDinh : data.hinhNenMacDinh);
  }

  changeColorBackground(event: any) {
    this.thietLapMauForm.get(this.typeOfBackground === 1 ? 'mauKhungVienMacDinh' : 'mauHinhNenMacDinh').setValue(event);
    this.emitValueChangesEvent();
    // this.setValueForData();
  }

  setValueForData() {
    const data = this.thietLapMauForm.getRawValue();
    this.data = {
      ...this.data,
      ...data
    };
    this.dataTemp = Object.assign({}, this.data);
  }

  getTenHinhNen() {
    const code = this.thietLapMauForm.get('codeHinhNenMacDinh').value;
    if (code) {
      const bg = this.defaultBackgrounds.find(x => x.code === code);
      if (bg) {
        return bg.description;
      }
    } else {
      return 'Chọn từ bộ hình nền có sẵn';
    }
  }
}
