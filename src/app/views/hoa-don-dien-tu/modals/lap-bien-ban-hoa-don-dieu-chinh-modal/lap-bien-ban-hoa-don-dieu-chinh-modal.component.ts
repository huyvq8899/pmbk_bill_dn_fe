import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import * as moment from 'moment';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { TrangThaiGuiHoaDon } from 'src/app/enums/TrangThaiGuiHoaDon.enum';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { LyDoDieuChinh } from 'src/app/models/LyDoThayTheModel';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { BoKyHieuHoaDonService } from 'src/app/services/quan-ly/bo-ky-hieu-hoa-don.service';
import { SharedService } from 'src/app/services/share-service';
import { UserService } from 'src/app/services/user.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { SumwidthConfig } from 'src/app/shared/global';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getLoaiHoaDons, getTimKiemTheo, setStyleTooltipError, getTenHoaDonByLoai } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { TabHoaDonDieuChinhComponent } from '../../tabs/tab-hoa-don-dieu-chinh/tab-hoa-don-dieu-chinh.component';
import { GuiHoaDonModalComponent } from '../gui-hoa-don-modal/gui-hoa-don-modal.component';
import { GuiHoaDonXoaBoModalComponent } from '../gui-hoa-don-xoa-bo-modal/gui-hoa-don-xoa-bo-modal.component';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { ThayTheHinhThucHoaDonKhacModalComponent } from '../thay-the-hinh-thuc-hoa-don-khac-modal/thay-the-hinh-thuc-hoa-don-khac-modal.component';
import { ThayTheHinhThucHoaDonKhacPMGPModalComponent } from '../thay-the-hinh-thuc-hoa-don-khac-pmgp-modal/thay-the-hinh-thuc-hoa-don-khac-pmgp-modal.component';

@Component({
  selector: 'app-lap-bien-ban-hoa-don-dieu-chinh-modal',
  templateUrl: './lap-bien-ban-hoa-don-dieu-chinh-modal.component.html',
  styleUrls: ['./lap-bien-ban-hoa-don-dieu-chinh-modal.component.scss']
})
export class LapBienBanHoaDonDieuChinhModalComponent implements OnInit {
  @Input() isBienBan: boolean;
  timKiemTheos = getTimKiemTheo();
  form: FormGroup;
  kys: any[] = GetList();
  spinning = false;
  listData = [];
  total = 0;
  dataSelected = null;
  // checkbox
  // fix table
  widthConfig = ['200px', '150px', '150px', '150px', '100px', '100px', '150px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  permission: boolean = false;
  thaoTacs: any[] = [];
  listDSRutGonBoKyHieuHoaDon: any[] = [];
  boKyHieuHoaDons: any[]
  loaiHoaDons = getLoaiHoaDons();
  thaoTacHoaDonSaiSot: any[] = [];
  isPhieuXuatKho = false;
  isPos = false;
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail') ? JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail').giaTri : false;

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private boKyHieuHoaDonService: BoKyHieuHoaDonService,
    private userService: UserService,
    private tabHoaDonDieuChinhComponent: TabHoaDonDieuChinhComponent,
    private fb: FormBuilder,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
    }
    else if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
    }

    this.createForm();
    this.setDefaulThoiGian();
    this.spinning = true;
    this.forkJoin().subscribe((res: any[]) => {
      // this.timKiemTheos = res[0].filter(x=>x.name != 'Loại hóa đơn');
      this.listDSRutGonBoKyHieuHoaDon = res[1];
      this.boKyHieuHoaDons = res[2].map(x => x.boKyHieuHoaDonId);
      var phanQuyen = localStorage.getItem('KTBKUserPermission');
      if (phanQuyen != 'true') {
        var pq = JSON.parse(phanQuyen);
        var mauHoaDonDuocPQ = pq.mauHoaDonIds;
        this.thaoTacHoaDonSaiSot = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs : [];
        this.boKyHieuHoaDons = this.boKyHieuHoaDons.filter(x => mauHoaDonDuocPQ.indexOf(x) >= 0);
      }
      else this.permission = true;
      this.spinning = false;
    });

    setTimeout(() => {
      const soHoaDon = this.timKiemTheos.find(x => x.key === 'SoHoaDon');
      soHoaDon.checked = true;
    }, 0);
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

  forkJoin() {
    return forkJoin([
      this.hoaDonDienTuService.GetListTimKiemTheoHoaDonThayThe(),
      this.hoaDonDienTuService.GetDSRutGonBoKyHieuHoaDon(),
      this.boKyHieuHoaDonService.GetAll()
    ]);
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

    /// Yêu cầu mới - trước khi tạo hóa đơn thay thế check - bộ ký hiệu
    let type = this.dataSelected.loaiHoaDon;
    if (type == null) {
      this.showThongBaoKhongTonTaiBoKyHieu(type);
      return;
    }

    var listKyHieus: any = await this.boKyHieuHoaDonService.GetListForHoaDonAsync(type);
    if (listKyHieus.length === 0) {
      this.showThongBaoKhongTonTaiBoKyHieu(type);
      return;
    }


    console.log(this.dataSelected.trangThaiLanDieuChinhGanNhat);
    console.log(this.dataSelected);
    if (this.dataSelected.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.ChuaKyDienTu
      || this.dataSelected.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.DangKyDienTu
      || this.dataSelected.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.GuiTCTNLoi) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '30%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến hóa đơn bị điều chỉnh thì tất cả các hóa đơn điều chỉnh liên quan đến hóa đơn bị điều chỉnh cần <strong>Phát hành thành công</strong> và thực hiện <strong>Gửi hóa đơn cho khách hàng</strong> trước khi tiếp tục điều chỉnh hóa đơn bị điều chỉnh.<br>
          <br>
          Tồn tại hóa đơn điều chỉnh có ký hiệu <span class="cssyellow">${this.dataSelected.mauSoHoaDonLanDieuChinhGanNhat}${this.dataSelected.kyHieuHoaDonLanDieuChinhGanNhat}</span> số hóa đơn <span class="cssyellow">Chưa cấp số</span> ngày hóa đơn <span class="cssyellow">${moment(this.dataSelected.ngayHoaDonLanDieuChinhGanNhat).format("DD/MM/YYYY")}</span> liên quan đến hóa đơn bị điều chỉnh có trạng thái quy trình là <strong>${this.dataSelected.tenTrangThaiLanDieuChinhGanNhat}</strong>. Vui lòng kiểm tra lại!
          `,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        }
      })
      this.spinning = false;
      return;
    }
    else if (this.dataSelected.trangThaiLanDieuChinhGanNhat == TrangThaiQuyTrinh.ChoPhanHoi) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '30%',
        nzStyle: { top: '10px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến hóa đơn bị điều chỉnh thì tất cả các hóa đơn điều chỉnh liên quan đến hóa đơn bị điều chỉnh cần <strong>Phát hành thành công</strong> và thực hiện <strong>Gửi hóa đơn cho khách hàng</strong> trước khi tiếp tục điều chỉnh hóa đơn bị điều chỉnh.<br>
          <br>
          Tồn tại hóa đơn điều chỉnh có ký hiệu <span class="cssyellow">${this.dataSelected.mauSoHoaDonLanDieuChinhGanNhat}${this.dataSelected.kyHieuHoaDonLanDieuChinhGanNhat}</span> số hóa đơn <span class="cssyellow">${this.dataSelected.soHoaDonLanDieuChinhGanNhat}</span> ngày hóa đơn <span class="cssyellow">${moment(this.dataSelected.ngayHoaDonLanDieuChinhGanNhat).format("DD/MM/YYYY")}</span> liên quan đến hóa đơn bị điều chỉnh có trạng thái quy trình là <strong>Chờ phản hồi</strong>. Vui lòng kiểm tra lại!
          `,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { }
        }
      })
      this.spinning = false;
      return;
    }

    this.hoaDonDienTuService.GetAllListHoaDonLienQuan(this.dataSelected.hoaDonDienTuId, moment().format('YYYY-MM-DD hh:mm:ss')).subscribe((hdlq: any[]) => {
      console.log(hdlq);
      if (!hdlq || hdlq.length == 0) {
        this.hoaDonDienTuService.GetById(this.dataSelected.hoaDonDienTuId).subscribe((hd: any) => {
          if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
            this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
              if (rs != null && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
                if (!rs.isDaLapThongBao) {
                  console.log(this.dataSelected.ngayHoaDon);
                  //nếu chưa lập thông báo
                  let mauHoaDon = this.dataSelected.mauSo;
                  let kyHieuHoaDon = this.dataSelected.kyHieu;
                  let soHoaDon = this.dataSelected.soHoaDon;
                  let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
                  console.log(ngayHoaDon);

                  let cauThongBao = null;
                  if (this.isBienBan == false) {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh. Vui lòng kiểm tra lại!`;
                  }
                  else {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn. Vui lòng kiểm tra lại!`;
                  }

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
                              isTraVeThongDiepChung: true,
                              hoaDonDienTuIdLienQuan: 'KhongLapLaiHoaDon'
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
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
                  console.log('nếu đã lập thông báo nhưng chưa gửi CQT');
                  //nếu đã lập thông báo nhưng chưa gửi CQT
                  let mauHoaDon = this.dataSelected.mauSo;
                  let kyHieuHoaDon = this.dataSelected.kyHieu;
                  let soHoaDon = this.dataSelected.soHoaDon;
                  let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');

                  var cauThongBao = null;
                  if (this.isBienBan == false) {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh. Vui lòng kiểm tra lại!`;
                  }
                  else {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn. Vui lòng kiểm tra lại!`;
                  }

                  console.log(cauThongBao);
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
                              content = `Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class="css-blue">${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                            }
                            else {
                              content = `Bạn không có quyền <b>Xem</b> thông điệp gửi (<b>Thông báo hóa đơn điện tử có sai sót</b>). Vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
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
                              thongDiepGuiCQTId: hd.thongDiepGuiCQTId,
                              hoaDonDienTuIdLienQuan: 'KhongLapLaiHoaDon'
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
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

                this.modalRef.destroy(this.dataSelected);
              }
            });
          }
          else {
            this.modalRef.destroy(this.dataSelected);
          }
        })
      }
      else {
        var hddc = 'Tồn tại hóa đơn điều chỉnh có';
        var hdlqs = '';
        var isGui = false;
        var pos = 0;
        for (var i = 0; i < hdlq.length; i++) {
          if (hdlq[i].trangThaiGuiHoaDon == TrangThaiGuiHoaDon.ChuaGui && (hdlq[i].boKyHieuHoaDon.hinhThucHoaDon != 2 || this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == true)) {
            isGui = true;
            pos = i;
            hdlqs += ` ký hiệu <span class="cssyellow">${hdlq[i].mauSo}${hdlq[i].kyHieu}</span> số hóa đơn <span class="cssyellow">${!hdlq[i].soHoaDon ? "&ltChưa cấp số&gt;" : hdlq[i].soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${moment(hdlq[i].ngayHoaDon).format('DD/MM/YYYY')}</span>`
            break;
          }
        }

        hddc += hdlqs + ' liên quan đến hóa đơn bị điều chỉnh Chưa gửi cho khách hàng. Vui lòng kiểm tra lại!'
        console.log(hdlqs);
        if (hdlqs != '' && isGui == true) {
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
              msContent: `Để đảm bảo khách hàng xác định ảnh hưởng của giá trị sai sót đã thực hiện điều chỉnh trước đó đến hóa đơn bị điều chỉnh thì tất cả các hóa đơn điều chỉnh liên quan đến hóa đơn bị điều chỉnh cần thực hiện Gửi hóa đơn cho khách hàng trước khi tiếp tục điều chỉnh hóa đơn bị điều chỉnh.
                <br>
                <br>
                ${hddc}
                `,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msHasGuiHoaDon: true,
              msButtonLabelGuiHoaDon: 'Gửi hóa đơn cho khách hàng tại đây',
              msOnGuiHoaDon: () => {
                this.hoaDonDienTuService.GetById(hdlq[pos].hoaDonDienTuId)
                  .subscribe((res: any) => {
                    if (res) {
                      var title = res.boKyHieuHoaDon.hinhThucHoaDon == 1 ? "Gửi hóa đơn có mã của cơ quan thuế đến khách hàng" : "Gửi hóa đơn không có mã của cơ quan thuế đến khách hàng"
                      const modal1 = this.modalService.create({
                        nzTitle: title,
                        nzContent: GuiHoaDonModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: 600,
                        nzStyle: { top: '10px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          data: res,
                          loaiEmail: LoaiEmail.ThongBaoPhatHanhHoaDon,
                          hanhDong: title
                        },
                        nzFooter: null
                      });
                      modal1.afterClose.subscribe((rs: any) => {
                        if (rs != null) {
                          if (rs) {
                            // this.GetTreeTrangThai();
                            // this.GetTreeTrangThaiLuyKe();
                            // this.modalService.create({
                            //   nzContent: MessageBoxModalComponent,
                            //   nzMaskClosable: false,
                            //   nzClosable: false,
                            //   nzKeyboard: false,
                            //   nzWidth: 400,
                            //   nzStyle: { top: '10px' },
                            //   nzBodyStyle: { padding: '1px' },
                            //   nzComponentParams: {
                            //     msTitle: "Gửi hóa đơn đến khách hàng",
                            //     msContent: `Đã hoàn thành việc gửi hóa đơn đến khách hàng`,
                            //     msMessageType: MessageType.Info,
                            //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                            //     msOnClose: () => { }
                            //   }
                            // })
                            this.message.success('Gửi hóa đơn đến khách hàng thành công',{
                              nzDuration:5000
                            })
                          }
                        }
                      });
                    }
                  });
              },
              msOnClose: () => {
              }
            }
          });
          return;
        }


        this.hoaDonDienTuService.GetById(this.dataSelected.hoaDonDienTuId).subscribe((hd: any) => {
          if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
            this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(this.dataSelected.hoaDonDienTuId).subscribe((rs: any) => {
              if (rs != null && (!rs.isDaGuiThongBao || !rs.isDaLapThongBao)) {
                if (!rs.isDaLapThongBao) {
                  console.log(this.dataSelected.ngayHoaDon);
                  //nếu chưa lập thông báo
                  let mauHoaDon = this.dataSelected.mauSo;
                  let kyHieuHoaDon = this.dataSelected.kyHieu;
                  let soHoaDon = this.dataSelected.soHoaDon;
                  let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
                  console.log(ngayHoaDon);
                  var cauThongBao = null;
                  if (this.isBienBan == false) {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh. Vui lòng kiểm tra lại!`;
                  }
                  else {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <b>Không phải lập lại hóa đơn</b> nhưng chưa lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn. Vui lòng kiểm tra lại!`;
                  }

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
                              isTraVeThongDiepChung: true,
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
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

                  var cauThongBao = null;
                  if (this.isBienBan == false) {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh. Vui lòng kiểm tra lại!`;
                  }
                  else {
                    cauThongBao = `Hóa đơn có ký hiệu <span class="cssyellow">${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class="cssyellow">${soHoaDon}</span> ngày hóa đơn <span class="cssyellow">${ngayHoaDon}</span> có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn. Vui lòng kiểm tra lại!`;
                  }

                  console.log(cauThongBao);
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzComponentParams: {
                      msHasThongBaoSaiSot: true,
                      msButtonLabelThongBaoSaiSot: 'Gửi thông báo hóa đơn điện tử có sai sót đến CQT tại đây',
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
                              thongDiepGuiCQTId: this.dataSelected.thongDiepGuiCQTId,
                            },
                            nzFooter: null
                          });
                          modal.afterClose.subscribe((rs: any) => {
                            if (rs) {
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
                var hdgns = hdlq.filter(x => x.thongBaoSaiSot && x.thongBaoSaiSot.trangThaiLapVaGuiThongBao <= -1);
                if (hdgns.length > 0) {
                  var hdgn = hdgns[hdgns.length - 1];
                  if (hdgn) {
                    this.hoaDonDienTuService.GetById(hdgn.hoaDonDienTuId).subscribe((hd: any) => {
                      if (hd.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                        this.hoaDonDienTuService.KiemTraHoaDonDaLapTBaoCoSaiSot(hdgn.hoaDonDienTuId).subscribe((res: any) => {
                          console.log(res);
                          console.log(hdgn);
                          if (res != null && (!res.isDaGuiThongBao || res.isDaGuiThongBao == false || !res.isDaLapThongBao || res.isDaLapThongBao == false)) {
                            if (!res.isDaLapThongBao || res.isDaLapThongBao == false) {
                              //nếu chưa lập thông báo
                              let mauHoaDon = this.dataSelected.mauSo;
                              let kyHieuHoaDon = this.dataSelected.kyHieu;
                              let soHoaDon = this.dataSelected.soHoaDon;
                              let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
                              let mauHoaDonLQ = hdgn.mauSo;
                              let kyHieuHoaDonLQ = hdgn.kyHieu;
                              let soHoaDonLQ = hdgn.soHoaDon;
                              let ngayHoaDonLQ = moment(hdgn.ngayHoaDon).format('DD/MM/YYYY');
                              var cauThongBao = '';
                              if (this.isBienBan == false) {
                                cauThongBao = `
                                Hóa đơn bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class='cssyellow'>${soHoaDon}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số hóa đơn <span class='cssyellow'>${soHoaDonLQ}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDonLQ}</span>. Hóa đơn điều chỉnh này có sai sót <strong>Không phải lập lại hóa đơn</strong> nhưng chưa lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                `;
                              }
                              else {
                                cauThongBao = `
                                Hóa đơn bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class='cssyellow'>${soHoaDon}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số hóa đơn <span class='cssyellow'>${soHoaDonLQ}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDonLQ}</span>. Hóa đơn điều chỉnh này có sai sót <strong>Không phải lập lại hóa đơn</strong> nhưng chưa lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong>. Bạn cần lập và gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                `;
                              }

                              if (cauThongBao) {
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
                                            lapTuHoaDonDienTuId: hdlq[0].hoaDonDienTuId,
                                            isTraVeThongDiepChung: true,
                                          },
                                          nzFooter: null
                                        });
                                        modal.afterClose.subscribe((rs: any) => {
                                          if (rs) {
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
                              else this.modalRef.destroy(this.dataSelected);
                            }
                            if (res.isDaLapThongBao == true && (!res.isDaGuiThongBao || res.isDaGuiThongBao == false)) {
                              //nếu đã lập thông báo nhưng chưa gửi CQT
                              let mauHoaDon = this.dataSelected.mauSo;
                              let kyHieuHoaDon = this.dataSelected.kyHieu;
                              let soHoaDon = this.dataSelected.soHoaDon;
                              let ngayHoaDon = moment(this.dataSelected.ngayHoaDon).format('DD/MM/YYYY');
                              let mauHoaDonLQ = hdgn.mauSo;
                              let kyHieuHoaDonLQ = hdgn.kyHieu;
                              let soHoaDonLQ = hdgn.soHoaDon;
                              let ngayHoaDonLQ = moment(hdgn.ngayHoaDon).format('DD/MM/YYYY');
                              let cauThongBao = null;
                              if (this.isBienBan == false) {
                                cauThongBao = `
                                Hóa đơn bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class='cssyellow'>${soHoaDon}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số hóa đơn <span class='cssyellow'>${soHoaDonLQ}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDonLQ}</span>. Hóa đơn điều chỉnh này có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập hóa đơn điều chỉnh cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                `;
                              }
                              else {
                                cauThongBao = `
                                Hóa đơn bị điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDon}${kyHieuHoaDon}</span> số hóa đơn <span class='cssyellow'>${soHoaDon}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDon}</span> được điều chỉnh lần gần nhất bởi hóa đơn điều chỉnh có ký hiệu <span class='cssyellow'>${mauHoaDonLQ}${kyHieuHoaDonLQ}</span> số hóa đơn <span class='cssyellow'>${soHoaDonLQ}</span> ngày hóa đơn <span class='cssyellow'>${ngayHoaDonLQ}</span>. Hóa đơn điều chỉnh này có sai sót <strong>Không phải lập lại hóa đơn</strong> đã thực hiện lập <strong>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</strong> nhưng chưa thực hiện gửi CQT. Bạn cần gửi Thông báo hóa đơn điện tử có sai sót đến CQT trước khi thực hiện thao tác Lập biên bản điều chỉnh hóa đơn cho lần điều chỉnh này. Vui lòng kiểm tra lại!
                                `;
                              }

                              if (cauThongBao) {
                                this.modalService.create({
                                  nzContent: MessageBoxModalComponent,
                                  nzMaskClosable: false,
                                  nzClosable: false,
                                  nzKeyboard: false,
                                  nzStyle: { top: '100px' },
                                  nzBodyStyle: { padding: '1px' },
                                  nzComponentParams: {
                                    msHasThongBaoSaiSot: true,
                                    msButtonLabelThongBaoSaiSot: 'Gửi thông báo hóa đơn điện tử có sai sót đến CQT tại đây',
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
                                            thongDiepGuiCQTId: hd.thongDiepGuiCQTId
                                          },
                                          nzFooter: null
                                        });
                                        modal.afterClose.subscribe((rs: any) => {
                                          if (rs) {
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
                              else this.modalRef.destroy(this.dataSelected);
                            }
                          }
                          else {
                            this.modalRef.destroy(this.dataSelected);
                          }
                        });
                      }
                      else {
                        this.modalRef.destroy(this.dataSelected);
                      }
                    });
                  }
                  else this.modalRef.destroy(this.dataSelected);
                }
                else this.modalRef.destroy(this.dataSelected);
              }
            });
          }
          else {
            this.modalRef.destroy(this.dataSelected);
          }
        });
      }
    });

  }

  closeModal() {
    this.modalRef.destroy();
  }

  selectedRow(data: any) {
    this.dataSelected = data;

    data.selected = true;
    this.listData.forEach(element => {
      if (element !== data) {
        element.selected = false;
      }
    });
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm kiếm';
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
    }

    this.spinning = true;
    const params = this.form.getRawValue();
    params.isLapBienBan = this.isBienBan;
    params.MauHoaDonDuocPQ = this.boKyHieuHoaDons;

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.key);
    var giaTris = params.giaTri != "" ? params.giaTri.split(",") : [];
    if (timKiemTheoChecked.length > 0 && giaTris.length > 0) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = giaTris[i] || null;
      }
      params.TimKiemTheo = result;
    } else {
      params.TimKiemTheo = null;
    }

    params.LoaiNghiepVu = this.isPhieuXuatKho ? 2 : this.isPos ? 3 : 1;
    this.hoaDonDienTuService.GetListHoaDonCanDieuChinh(params)
      .subscribe((res: any[]) => {
        this.listData = res;

        this.listData.forEach(x => {
          //cài đặt giá trị ủy nhiệm lập hóa đơn
          let boKyHieuHD = this.listDSRutGonBoKyHieuHoaDon.find(y => y.kyHieu.toLowerCase() == (x.mauSo + x.kyHieu).toLowerCase());
          if (boKyHieuHD != null) {
            if (boKyHieuHD.uyNhiemLapHoaDon == 0) {
              x.tenUyNhiemLapHoaDon = 'Không đăng ký';
              x.uyNhiemLapHoaDon = 0;
            }
            if (boKyHieuHD.uyNhiemLapHoaDon == 1) {
              x.tenUyNhiemLapHoaDon = 'Đăng ký';
              x.uyNhiemLapHoaDon = 1;
            }
          }
        });

        this.total = res.length;
        this.spinning = false;
      })
  }

  thayTheHinhThucHoaDonKhac() {
    // call modal
    const modal = this.modalService.create({
      nzTitle: 'Nhập thông tin hóa đơn',
      nzContent: ThayTheHinhThucHoaDonKhacModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 550,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiHinhThuc: 2
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        rs.hinhThucHoaDonBiDieuChinh = rs.hinhThucHoaDonCanThayThe;
        const modal = this.modalService.create({
          nzTitle: getTenHoaDonByLoai(rs.loaiHoaDon),
          nzContent: HoaDonDienTuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            lyDoDieuChinh: {
              hinhThucHoaDonBiDieuChinh: rs.hinhThucHoaDonBiDieuChinh,
              dieuChinhChoHoaDonId: rs.hoaDonDienTuId,
              kyHieu: rs.kyHieu,
              mauSo: rs.mauSo,
              soHoaDon: rs.soHoaDon,
              ngayHoaDon: rs.ngayHoaDon,
              isSystem: rs.isSystem,
              loaiTienId: rs.loaiTienId
            },
            loaiHD: rs.loaiHoaDon,
            isAddNew: true
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.modalRef.destroy();
        });
      }
    });
  }

  thayTheHinhThucHoaDonKhacPMGP() {
    // call modal
    const modal = this.modalService.create({
      nzTitle: 'Nhập thông tin hóa đơn điện tử theo Nghị định số 123/2020/NĐ-CP',
      nzContent: ThayTheHinhThucHoaDonKhacPMGPModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 550,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiHinhThuc: 2
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      if (rs) {
        rs.hinhThucHoaDonBiDieuChinh = rs.hinhThucHoaDonCanThayThe;
        const modal = this.modalService.create({
          nzTitle: getTenHoaDonByLoai(rs.loaiHoaDon),
          nzContent: HoaDonDienTuModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 90,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            lyDoDieuChinh: {
              hinhThucHoaDonBiDieuChinh: rs.hinhThucHoaDonBiDieuChinh,
              dieuChinhChoHoaDonId: rs.hoaDonDienTuId,
              kyHieu: rs.kyHieu,
              mauSo: rs.mauSo,
              soHoaDon: rs.soHoaDon,
              ngayHoaDon: rs.ngayHoaDon,
              isSystem: rs.isSystem,
              loaiTienId: rs.loaiTienId
            },
            loaiHD: rs.loaiHoaDon,
            isAddNew: true
          },
          nzFooter: null
        });
        modal.afterClose.subscribe((rs: any) => {
          this.modalRef.close();
        });
      }
    });
  }

  kiemTraDieuKienTimKiem(): boolean {
    let value = this.timKiemTheos.filter(x => x.checked).length;
    return value > 0;
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
