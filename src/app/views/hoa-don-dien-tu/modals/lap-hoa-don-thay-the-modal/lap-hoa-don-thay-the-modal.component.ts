import { async } from '@angular/core/testing';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig, GlobalConstants } from 'src/app/shared/global';
import { getTenHoaDonByLoai, setStyleTooltipError, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { ThayTheHinhThucHoaDonKhacModalComponent } from '../thay-the-hinh-thuc-hoa-don-khac-modal/thay-the-hinh-thuc-hoa-don-khac-modal.component';
import { ThayTheHinhThucHoaDonKhacPMGPModalComponent } from '../thay-the-hinh-thuc-hoa-don-khac-pmgp-modal/thay-the-hinh-thuc-hoa-don-khac-pmgp-modal.component';
import { CookieConstant } from 'src/app/constants/constant';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import * as moment from 'moment';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { data } from 'jquery';

@Component({
  selector: 'app-lap-hoa-don-thay-the-modal',
  templateUrl: './lap-hoa-don-thay-the-modal.component.html',
  styleUrls: ['./lap-hoa-don-thay-the-modal.component.scss']
})
export class LapHoaDonThayTheModalComponent implements OnInit, AfterViewChecked {
  @Input() timKiemTheos: any[];
  @Input() isChuyenHoaDonGocThanhThayThe: boolean = false;
  @Input() mauSo: number;
  @Input() loaiHoaDon: number;
  form: FormGroup;
  kys: any[] = GetList();
  spinning = false;
  listData = [];
  total = 0;
  dataSelected = null;
  // widthConfig = ['150px', '190px', '150px', '150px','150px','150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
  widthConfig = ['180px', '150px', '110px', '100px', '90px', '150px', '250px', '120px', '150px', '70px', '150px'];
  scrollConfig = { x: '', y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  mauHoaDonDuocPQ: any[];
  tichChonNhanBanThongTin = false;
  isPhieuXuatKho = false;
  isPos = false;

  thaoTacHoaDonSaiSot: any[] = [];
  txtHD_PXK_UPPER = "Hóa đơn";
  thayTheForm: FormGroup;

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK_UPPER = "PXK";
    }
    else if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
    }

    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.createForm();
    this.setDefaulThoiGian();

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
      this.boKyHieuHoaDonService.GetAll().subscribe((rs: any[]) => {
        this.mauHoaDonDuocPQ = rs.map(x => x.boKyHieuHoaDonId);
      })
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.mauHoaDonDuocPQ = pq.mauHoaDonIds;
      this.thaoTacHoaDonSaiSot = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs : [];
    }

    setTimeout(() => {
      const soHoaDon = this.timKiemTheos.find(x => x.key === 'SoHoaDon');
      soHoaDon.checked = true;
    }, 0);
  }

  createForm() {
    this.form = this.fb.group({
      ky: 5,
      fromDate: [null],
      toDate: [null],
      giaTri: [null],
    });

    this.form.valueChanges.subscribe(() => {
      setStyleTooltipError();
    });

    if (this.isChuyenHoaDonGocThanhThayThe) {
      this.thayTheForm = this.fb.group({
        hoaDonGocCanThayThes: this.fb.array([])
      })
    }
  }


  blurDetail(index: number, control: any) {
    const ctsArr = this.thayTheForm.get('hoaDonGocCanThayThes') as FormArray;
    const forms = ctsArr.controls as FormGroup[];
    forms[index].get(control).markAsTouched();
    forms[index].get(control).updateValueAndValidity();
    if (forms[index].get(control).invalid) {
      setStyleTooltipError_Detail();
    }
  }

  createFormHoaDonCanThayThe(item: any) {
    return this.fb.group({
      hoaDonDienTuId: [item == null ? null : item.hoaDonDienTuId],
      trangThai: [item == null ? 1 : item.trangThai],
      hinhThucXoabo: [item == null ? null : item.hinhThucXoabo],
      mauSo: [item == null ? null : item.mauSo],
      kyHieu: [item == null ? null : item.kyHieu],
      ngayHoaDon: [item == null ? moment().format("YYYY-MM-DD") : moment(item.ngayHoaDon).format("YYYY-MM-DD")],
      soHoaDon: [item == null ? null : item.soHoaDon],
      maKhachHang: [item == null ? null : item.maKhachHang],
      tenKhachHang: [item == null ? null : item.tenKhachHang],
      maSoThue: [item == null ? null : item.maSoThue],
      hoTenNguoiMuaHang: [item == null ? null : item.hoTenNguoiMuaHang],
      maLoaiTien: [item == null ? null : item.maLoaiTien],
      tongTienThanhToan: [item == null ? null : item.tongTienThanhToan],
      tongTienThanhToanQuyDoi: [item == null ? null : item.tongTienThanhToanQuyDoi],
      lyDoThayThe: [null, [Validators.required, Validators.maxLength(255)]],
      selected: false
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

  async submitForm() {
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

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

    // this.dataSelected.tichChonNhanBanThongTin = this.tichChonNhanBanThongTin;
    // this.dataSelected.isSystem = true;
    // this.modalRef.destroy(this.dataSelected);

    this.hoaDonDienTuService.GetById(this.dataSelected.hoaDonDienTuId).subscribe((hd: any) => {
      if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
        this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(this.dataSelected.hoaDonDienTuId).subscribe(async (rs: any) => {
          if (rs != null && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
            if (!rs.isDaLapThongBao) {
              //nếu chưa lập thông báo
              let mauHoaDon = this.dataSelected.mauSo;
              let kyHieuHoaDon = this.dataSelected.kyHieu;
              let soHoaDon = this.dataSelected.soHoaDon;
              let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
              let cauThongBao = 'Hóa đơn có Ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> Số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> Ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn thay thế. Vui lòng kiểm tra lại!';

              this.modalService.create({
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
                    if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_CREATE") < 0) {
                      this.userService.getAdminUser().subscribe((rs: any[]) => {
                        let content = '';
                        if (rs && rs.length > 0) {
                          content = `
                          Bạn không có quyền <b>Thêm</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                        }
                        else {
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
                            msOnClose: () => {
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
              return;
            }
            if (rs.isDaLapThongBao && !rs.isDaGuiThongBao) {
              //nếu đã lập thông báo nhưng chưa gửi CQT
              let mauHoaDon = this.dataSelected.mauSo;
              let kyHieuHoaDon = this.dataSelected.kyHieu;
              let soHoaDon = this.dataSelected.soHoaDon;
              let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
              let cauThongBao = 'Hóa đơn có Ký hiệu <span class = "colorChuYTrongThongBao"><b>' + mauHoaDon + kyHieuHoaDon + '</b></span> Số hóa đơn <span class = "colorChuYTrongThongBao"><b>' + soHoaDon + '</b></span> Ngày hóa đơn <span class = "colorChuYTrongThongBao"><b>' + ngayHoaDon + '</b></span> có sai sót <b>Không phải lập lại hóa đơn</b> đã thực hiện lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn thay thế. Vui lòng kiểm tra lại!';

              this.modalService.create({
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
                    if (this.permission != true && this.thaoTacHoaDonSaiSot.indexOf("MNG_FULL") < 0 && this.thaoTacHoaDonSaiSot.indexOf("MNG_VIEW") < 0) {
                      this.userService.getAdminUser().subscribe((rs: any[]) => {
                        let content = '';
                        if (rs && rs.length > 0) {
                          content = `
                          Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                        }
                        else {
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
                            msOnClose: () => {
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
            }
          }
          else {
            /// Yêu cầu mới - trước khi tạo hóa đơn thay thế check - bộ ký hiệu
            let type = hd.loaiHoaDon;
            if (type == null) {
              this.showThongBaoKhongTonTaiBoKyHieu(type);
              return;
            }

            var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);
            if (listKyHieus.length === 0) {
              this.showThongBaoKhongTonTaiBoKyHieu(type);
              return;
            }

            hd.tichChonNhanBanThongTin = this.tichChonNhanBanThongTin;
            hd.isSystem = true;
            this.modalRef.destroy(hd);
          }
        });
      }
      else {
        this.modalRef.destroy(hd);
      }
    });
  }

  closeModal() {
    this.modalRef.destroy();
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
  selectedRow(data: any) {
    // if(this.isChuyenHoaDonGocThanhThayThe){
    //   const hoaDonCanThayTheArray = this.thayTheForm.get('hoaDonGocCanThayThes') as FormArray;
    //   data.value.selected = true;
    //   for(let i=0; i<hoaDonCanThayTheArray.length;i++){
    //     hoaDonCanThayTheArray.controls[i].get('lyDoThayThe').setValue(null);
    //     hoaDonCanThayTheArray.controls[i].get('lyDoThayThe').reset();
    //     if(data.value.hoaDonDienTuId != hoaDonCanThayTheArray.controls[i].get('hoaDonDienTuId').value){
    //       console.log('khac');
    //       this.thayTheForm.get(`hoaDonGocCanThayThes`)['controls'][i].get('selected').setValue(false);
    //     }
    //     else{
    //       console.log('bang');
    //       this.thayTheForm.get(`hoaDonGocCanThayThes`)['controls'][i].get('selected').setValue(true);
    //     }
    //   }
    // }
    // else{
    this.dataSelected = data;
    data.selected = true;

    this.listData.forEach((item: any) => {
      if (item !== data) {
        item.selected = false;
      }
    });
    // }
  }

  changeLyDoThayThe(i: number, event: any) {
    const hoaDonCanThayTheArray = this.thayTheForm.get('hoaDonGocCanThayThes') as FormArray;
    hoaDonCanThayTheArray.controls[i].markAsDirty();
    hoaDonCanThayTheArray.controls[i].updateValueAndValidity();
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm';
    }
  }

  getData() {
    /*
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }
    */

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
    }

    this.spinning = true;
    const params = this.form.getRawValue();
    params.MauHoaDonDuocPQ = this.mauHoaDonDuocPQ;


    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
    if (timKiemTheoChecked.length > 0 && params.giaTri) {
      var result = {};
      var giaTris = params.giaTri.split(',');
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i] || null;

      }

      if(this.isChuyenHoaDonGocThanhThayThe) {
        result['MauSo'] = this.mauSo;
        params.LoaiHoaDon = this.loaiHoaDon;
      }
      params.TimKiemTheo = result;
    } else {
      params.TimKiemTheo = null;
      params.TimKiemBatKy = params.giaTri;
    }

    /*
    if (params.TimKiemTheo == null)
    {
      this.spinning = false;
      return;
    }
    */

    console.log('params: ', params);
    params.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;

    this.hoaDonDienTuService.GetListHoaDonXoaBoCanThayThe(params)
      .subscribe((res: any[]) => {
        this.listData = res;

        if (this.isChuyenHoaDonGocThanhThayThe) {
          const hoaDonCanThayTheArray = this.thayTheForm.get('hoaDonGocCanThayThes') as FormArray;
          hoaDonCanThayTheArray.clear();

          this.listData.forEach(x => {
            x.lyDoThayThe = null;
            hoaDonCanThayTheArray.push(this.createFormHoaDonCanThayThe(x));
          })
        }

        this.total = res.length;
        this.spinning = false;
      });
  }

  thayTheHinhThucHoaDonKhac(loai: number) {
    if (loai === 1) //nếu nhập thông tin hóa đơn loại 1
    {
      // call modal
      const modal = this.modalService.create({
        nzTitle: 'Nhập thông tin hóa đơn điện tử theo Nghị định số 123/2020/NĐ-CP',
        nzContent: ThayTheHinhThucHoaDonKhacPMGPModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 560,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          loaiHinhThuc: 1
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.modalRef.destroy(rs);
        }
      });
    }
    else //nếu nhập thông tin hóa đơn loại 2,3,4
    {
      // call modal
      const modal = this.modalService.create({
        nzTitle: 'Nhập thông tin hóa đơn',
        nzContent: ThayTheHinhThucHoaDonKhacModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 560,
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          loaiHinhThuc: 1
        },
        nzFooter: null
      });
      modal.afterClose.subscribe((rs: any) => {
        if (rs) {
          this.modalRef.destroy(rs);
        }
      });
    }
  }

  //hàm này kiểm tra xem đã tích chọn tùy chọn tìm kiếm nào chưa
  kiemTraDieuKienTimKiem(): boolean {
    let value = this.timKiemTheos.filter(x => x.checked).length;
    return value > 0;
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

  setDefaulThoiGian() {
    let kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if (kyKeKhaiThue == 'Quy') {
      this.changeKy(6);
      this.form.get('ky').setValue(6);
    }
    else if (kyKeKhaiThue == 'Thang') {
      this.changeKy(4);
      this.form.get('ky').setValue(4);
    }
  }

  //hàm này để bắt sự kiện onchange của textbox GiaTri
  onchange_timKiemTheos(event: any) {
    let checkBoxes = document.querySelectorAll('.ckbcheckBox');
    if (this.timKiemTheos.filter(x => x.checked).length == 0) {
      checkBoxes.forEach((ckbFormControl: any) => {
        if (ckbFormControl.outerText != undefined) {
          if (ckbFormControl.outerText == "Số hóa đơn") {
            ckbFormControl.childNodes[0].childNodes[0].click();
            if (ckbFormControl.childNodes[0].childNodes[0].checked == false) {
              ckbFormControl.childNodes[0].childNodes[0].click();
            }
          }
        }
      });
    }
  }
}
