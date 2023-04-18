import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig, GlobalConstants } from 'src/app/shared/global';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CookieConstant } from 'src/app/constants/constant';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import * as moment from 'moment';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';

@Component({
  selector: 'app-chon-hoa-don-sai-sot-de-lap-thay-the-modal',
  templateUrl: './chon-hoa-don-sai-sot-de-lap-thay-the-modal.component.html',
  styleUrls: ['./chon-hoa-don-sai-sot-de-lap-thay-the-modal.component.scss']
})
export class ChonHoaDonSaiSotDeLapThayTheModalComponent implements OnInit {
  @Input() loaiHoaDon: number = 1;
  @Input() callBack: any = null;
  timKiemTheos: any[] 
  = [
    {value: 'MauSo', name: 'Ký hiệu mẫu số hóa đơn', checked: false},
    {value: 'KyHieu', name: 'Ký hiệu hóa đơn', checked: false},
    {value: 'SoHoaDon', name: 'Số hóa đơn', checked: true},
    {value: 'NgayHoaDon', name: 'Ngày hóa đơn', checked: false}
  ];

  form: FormGroup;
  kys: any[] = GetList();
  spinning = false;
  listData = [];
  total = 0;
  dataSelected = null;
  widthConfig = ['340px', '250px', '150px', '150px', '120px', '100px', '110px', '150px', '270px', '150px', '200px', '90px', '150px'];
  scrollConfig = { x: '', y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  mauHoaDonDuocPQ: any[];
  tichChonNhanBanThongTin = false;

  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.createForm();
    this.setDefaulThoiGian();

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true'){
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[])=>{
        this.mauHoaDonDuocPQ = rs.map(x=>x.boKyHieuHoaDonId);
      })
    } 
    else{
      var pq = JSON.parse(phanQuyen);
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
    }
  }

  createForm() {
    this.form = this.fb.group({
      ky: 5,
      fromDate: [null],
      toDate: [null],
      giaTri: [null]
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

  blurDate() {
    const params = this.form.getRawValue();
    const ky = GetKy(params);
    this.form.get('ky').setValue(ky);
  }

  submitForm() {
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

    let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
    let arrNgayHoaDon = ngayHoaDon.split('/');

    let ghiChuThayTheSaiSot = 'Ghi chú: Hóa đơn <b>mới</b> thay thế cho hóa đơn có ký hiệu mẫu số hóa đơn <b>' + this.dataSelected.mauSo + '</b>, ký hiệu hóa đơn <b>' + this.dataSelected.kyHieu + '</b>, số hóa đơn <b>' + this.dataSelected.soHoaDon + '</b>, lập ngày <b>' + arrNgayHoaDon[0] + '</b> tháng <b>' + arrNgayHoaDon[1] + '</b> năm ' + arrNgayHoaDon[2] + '</b> là hóa đơn có sai sót chưa gửi người mua và đã thông báo với CQT về việc hủy hóa đơn theo mã thông điệp <b>' + this.dataSelected.maThongDiep + '</b> (Thực hiện theo khoản 1, điều 19 của Nghị định số 123/2020/NĐ-CP)';
    const modal1 = this.modalService.create({
      nzTitle: 'Hóa đơn GTGT',
      nzContent: HoaDonDienTuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
        loaiHD: this.loaiHoaDon,
        fbEnableEdit: true,
        thongTinHoaDonSaiSotBiThayThe: 
        { idHoaDonSaiSotBiThayThe: this.dataSelected.hoaDonDienTuId, ghiChuThayTheSaiSot: ghiChuThayTheSaiSot, tichChonNhanBanThongTin: this.tichChonNhanBanThongTin }
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      if (this.callBack != null) {
        this.callBack();
      }
    });

    this.modalRef.destroy();
  }

  closeModal() {
    this.modalRef.destroy();
  }

  selectedRow(data: any) {
    this.dataSelected = data;
    data.selected = true;

    this.listData.forEach((item: any) => {
      if (item !== data) {
        item.selected = false;
      }
    });
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  getData() {
    //kiểm tra xem đã tích chọn tùy chọn nào thì bắt buộc nhập tìm kiếm theo
    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      if (this.form.controls['giaTri'].value == null || this.form.controls['giaTri'].value == '')
      {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else
    {
      this.form.controls['giaTri'].clearValidators();
      this.form.controls['giaTri'].updateValueAndValidity();
    }

    this.spinning = true;
    const params = this.form.getRawValue();
    params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && params.giaTri) {
      var result = {};
      var giaTris = params.giaTri.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = (giaTris[i] != null && giaTris[i] != undefined)?giaTris[i]: null;
      }
      params.TimKiemTheo = result;
    } else {
      params.TimKiemTheo = null;
      params.TimKiemBatKy = params.giaTri;
    }
    
    this.hoaDonDienTuService.GetListHoaDonSaiSotCanThayThe(params)
    .subscribe((res: any[]) => {
      this.listData = res;
      this.total = res.length;
      this.spinning = false;
    });
  }

  //hàm này kiểm tra xem đã tích chọn tùy chọn tìm kiếm nào chưa
  kiemTraDieuKienTimKiem(): boolean
  {
    let value = this.timKiemTheos.filter(x=>x.checked).length;
    return value > 0;
  }

  //hàm này để bắt sự kiện onchange của textbox GiaTri
  changeGiaTri(event:any)
  {
    if (this.timKiemTheos.filter(x=>x.checked).length > 0)
    {
      if (event == null || event == '')
      {
        this.form.controls['giaTri'].markAsTouched();
        this.form.controls['giaTri'].setValidators([Validators.required]);
        this.form.controls['giaTri'].updateValueAndValidity();
        setStyleTooltipError(true);

        return;
      }
    }
    else
    {
      this.form.controls['giaTri'].clearValidators();
      this.form.controls['giaTri'].updateValueAndValidity();
    }
  }

  //hàm này để set default kỳ/thời gian
  setDefaulThoiGian()
  {
    let kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (kyKeKhaiThue == 'Quy')
    {
      this.changeKy(6);
      this.form.get('ky').setValue(6);
    }
    else if (kyKeKhaiThue == 'Thang')
    {
      this.changeKy(4);
      this.form.get('ky').setValue(4);
    }
  }

  //hàm này được dùng khi thay đổi tích chọn tìm kiếm theo
  changeTimKiemTheo()
  {
    let checkBoxes = document.querySelectorAll('.chkCheckBox');
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
}
