import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import * as moment from "moment";
import { EnvService } from "src/app/env.service";
import { HoaDonDienTuService } from "src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service";
import { TextGlobalConstants } from "src/app/shared/TextGlobalConstants";
import {
  MessageBoxModalComponent,
  MessageType,
} from "src/app/shared/modals/message-box-modal/message-box-modal.component";
import { DinhDangThapPhan } from "src/app/shared/DinhDangThapPhan";
import {
  getEmailWithBCCAndCC,
  getMainEmailFromDairy,
  setStyleTooltipError,
  showModalPreviewPDF,
} from "src/app/shared/SharedFunction";
import { ThongBaoHoaDonSaiSotModalComponent } from "src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component";
import { GlobalConstants } from "src/app/shared/global";
import { NhatKyGuiEmailService } from "src/app/services/tien-ich/nhat-ky-gui-email.service";
import { SharedService } from "src/app/services/share-service";
import { CheckValidEmail } from "src/app/customValidators/check-valid-email.validator";
import { NhatKyTruyCapService } from "src/app/services/tien-ich/nhat-ky-truy-cap.service";
import { LoaiHanhDong, RefType } from "src/app/models/nhat-ky-truy-cap";

@Component({
  selector: "app-gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component",
  templateUrl: "./gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component.html",
  styleUrls: ["./gui-tbao-sai-sot-khong-phai-lap-hdon-modal.component.scss"],
})
export class GuiTBaoSaiSotKhongPhaiLapHDonModalComponent implements OnInit {
  @Input() data: any;
  @Input() isView: any = false;
  @Input() isPhieuXuatKho: boolean = false;
  @Input() isPos: boolean = false;
  mainForm: FormGroup;
  loading = false;
  ddtp: DinhDangThapPhan = new DinhDangThapPhan();
  hasEmailCcBcc = false;
  soLanGuiSaiSot_HoTen = 0;
  soLanGuiSaiSot_DonVi = 0;
  soLanGuiSaiSot_DiaChi = 0;
  soLanGuiSaiSot_CanCuocCongDan = 0;
  soLanGuiSaiSot_SoDienThoai = 0;
  isSended = false;
  isHoTenNguoiMuaHang = false;
  isTenDonVi = false;
  isDiaChi = false;
  isSoDienThoai = false;
  isCanCuocCongDan = false;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyGuiEmailService: NhatKyGuiEmailService,
    private sharedService: SharedService,
    private nhatKyTruyCapService: NhatKyTruyCapService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.mainForm = this.fb.group({
      hoaDonDienTuId: [this.data.hoaDonDienTuId],
      kyHieuMau: [
        this.kiemTraNull(this.data.mauSo) + this.kiemTraNull(this.data.kyHieu),
      ],
      mauHoaDon: [this.data.mauSo],
      kyHieuHoaDon: [this.data.kyHieu],
      soHoaDon: [
        this.data.soHoaDon == "" || this.data.soHoaDon == null
          ? "<Chưa cấp số>"
          : this.data.soHoaDon,
      ],
      ngayHoaDon: [moment(this.data.ngayHoaDon).format("YYYY-MM-DD")],
      ngayHoaDonText: [moment(this.data.ngayHoaDon).format("DD/MM/YYYY")],
      tongTienThanhToan: [this.data.tongTienThanhToan],
      tenKhachHang: [this.data.tenKhachHang || this.data.hoTenNguoiMuaHang],
      // tichChon_HoTenNguoiMuaHang: [this.isHoTenNguoiMuaHang],
      // tichChon_TenDonVi: [this.isTenDonVi],
      // tichChon_DiaChi: [this.isDiaChi],
      // tichChon_SoDienThoai:[this.isSoDienThoai],
      // tichChon_CanCuocCongDan:[this.isCanCuocCongDan],
      // hoTenNguoiMuaHang_Sai: this.kiemTraThongTin(this.data.hoTenNguoiMuaHang, 'Trên hóa đơn không có thông tin <Họ và tên người mua hàng>'),
      // hoTenNguoiMuaHang_Dung: [this.data.hoTenNguoiMuaHang, [this.kiemTraTrungSaiDung_HoTen]],
      // tenDonVi_Sai: this.kiemTraThongTin(this.data.tenKhachHang, 'Trên hóa đơn không có thông tin <Tên đơn vị>'),
      // tenDonVi_Dung: [this.data.tenKhachHang, [this.kiemTraTrungSaiDung_DonVi]],
      // diaChi_Sai: this.kiemTraThongTin(this.data.diaChi, 'Trên hóa đơn không có thông tin <Địa chỉ>'),
      // diaChi_Dung: [this.data.diaChi, [this.kiemTraTrungSaiDung_DiaChi]],
      // canCuocCongDan_Sai :[this.kiemTraThongTin(this.data.canCuocCongDan, 'Trên hóa đơn không có thông tin <Căn cước công dân>')],
      // canCuocCongDan_Dung: [this.data.canCuocCongDan, [this.kiemTraTrungSaiDung_CanCuocCongDan]],
      // soDienThoai_Sai :[this.kiemTraThongTin(this.data.soDienThoaiNguoiMuaHang, 'Trên hóa đơn không có thông tin <Số điện thoại>')],
      // soDienThoai_Dung: [this.data.soDienThoaiNguoiMuaHang, [this.kiemTraTrungSaiDung_SoDienThoai]],
      tenNguoiNhan: [this.data.khachHang && this.data.khachHang.hoTenNguoiNhanHD || this.data.hoTenNguoiMuaHang, [Validators.required]],
      emailCuaNguoiNhan: [this.data.khachHang && this.data.khachHang.emailNguoiNhanHD || this.data.emailNguoiMuaHang, [Validators.required, CheckValidEmail]],
      emailCCNguoiNhan: [null, [CheckValidEmail]],
      emailBCCNguoiNhan: [null, [CheckValidEmail]],
      soDienThoaiNguoiNhan: [
        { value: this.data.soDienThoaiNguoiNhanHD, disabled: true },
      ],
      maLoaiTien: [this.data.loaiTien.ma],
      khachHangId: [this.data.khachHangId],
      giaiTrinhSaiSot: [null],
    });

    // if(this.isPhieuXuatKho){
    //   this.mainForm.get('giaiTrinhSaiSot').setValidators(Validators.required);
    //   this.mainForm.get('giaiTrinhSaiSot').setValidators(Validators.maxLength(255));
    //   this.mainForm.get('hoTenNguoiMuaHang_Dung').clearValidators();
    //   this.mainForm.get('tenDonVi_Dung').clearValidators();
    //   this.mainForm.get('diaChi_Dung').clearValidators();
    //   this.mainForm.get('canCuocCongDan_Dung').clearValidators();
    //   this.mainForm.get('soDienThoai_Dung').clearValidators();
    // }

    if (!this.mainForm.get("emailCuaNguoiNhan").value) {
      this.nhatKyGuiEmailService
        .GetThongTinEmailDaGuiChoKHGanNhat(this.data.hoaDonDienTuId)
        .subscribe((res: any) => {
          if (res) {
            this.mainForm.get("tenNguoiNhan").setValue(res.tenNguoiNhan);
            this.mainForm
              .get("emailCuaNguoiNhan")
              .setValue(getMainEmailFromDairy(res.emailNguoiNhan));
          }
        });
    }

    this.mainForm.valueChanges.subscribe(() => {
      setStyleTooltipError(true);
    });

    this.nhatKyGuiEmailService.KiemTraDaGuiTBSSKhongLapHd(this.data.nhatKyGuiEmailId).subscribe((rs: any) => {
      if (rs) {
        this.isSended = rs != null;
        if (rs.thongBaoSaiThongTin) {
          if (this.isView) {
            // if(rs.thongBaoSaiThongTin.hoTenNguoiMuaHang_Dung) this.mainForm.get('tichChon_HoTenNguoiMuaHang').setValue(rs.thongBaoSaiThongTin.hoTenNguoiMuaHang_Dung != rs.thongBaoSaiThongTin.hoTenNguoiMuaHang_Sai);
            // this.mainForm.get('hoTenNguoiMuaHang_Sai').setValue(rs.thongBaoSaiThongTin.hoTenNguoiMuaHang_Sai);
            // this.mainForm.get('hoTenNguoiMuaHang_Dung').setValue(rs.thongBaoSaiThongTin.hoTenNguoiMuaHang_Dung);

            // if(rs.thongBaoSaiThongTin.tenDonVi_Dung) this.mainForm.get('tichChon_TenDonVi').setValue(rs.thongBaoSaiThongTin.tenDonVi_Dung != rs.thongBaoSaiThongTin.tenDonVi_Sai);
            // this.mainForm.get('tenDonVi_Sai').setValue(rs.thongBaoSaiThongTin.tenDonVi_Sai);
            // this.mainForm.get('tenDonVi_Dung').setValue(rs.thongBaoSaiThongTin.tenDonVi_Dung);

            // if(rs.thongBaoSaiThongTin.diaChi_Dung) this.mainForm.get('tichChon_DiaChi').setValue(rs.thongBaoSaiThongTin.diaChi_Dung != rs.thongBaoSaiThongTin.diaChi_Sai);
            // this.mainForm.get('diaChi_Sai').setValue(rs.thongBaoSaiThongTin.diaChi_Sai);
            // this.mainForm.get('diaChi_Dung').setValue(rs.thongBaoSaiThongTin.diaChi_Dung);
            // this.mainForm.get('tenNguoiNhan').setValue(rs.thongBaoSaiThongTin.tenNguoiNhan);

            // if(rs.thongBaoSaiThongTin.soDienThoai_Dung) this.mainForm.get('tichChon_SoDienThoai').setValue(rs.thongBaoSaiThongTin.soDienThoai_Dung != rs.thongBaoSaiThongTin.soDienThoai_Sai);
            // this.mainForm.get('soDienThoai_Sai').setValue(rs.thongBaoSaiThongTin.soDienThoai_Sai);
            // this.mainForm.get('soDienThoai_Dung').setValue(rs.thongBaoSaiThongTin.soDienThoai_Dung);

            // if(rs.thongBaoSaiThongTin.canCuocCongDan_Dung) this.mainForm.get('tichChon_CanCuocCongDan').setValue(rs.thongBaoSaiThongTin.canCuocCongDan_Dung != rs.thongBaoSaiThongTin.canCuocCongDan_Sai);
            // this.mainForm.get('canCuocCongDan_Sai').setValue(rs.thongBaoSaiThongTin.canCuocCongDan_Sai);
            // this.mainForm.get('canCuocCongDan_Dung').setValue(rs.thongBaoSaiThongTin.canCuocCongDan_Dung);


            this.mainForm.get('emailCuaNguoiNhan').setValue(rs.thongBaoSaiThongTin.emailCuaNguoiNhan);
            this.mainForm.get('emailCCNguoiNhan').setValue(rs.thongBaoSaiThongTin.emailCCCuaNguoiNhan);
            this.mainForm.get('emailBCCNguoiNhan').setValue(rs.thongBaoSaiThongTin.emailBCCCuaNguoiNhan);

            this.mainForm.get('giaiTrinhSaiSot').setValue(rs.thongBaoSaiThongTin.thongTinGiaiTrinhSaiSot);

            // this.mainForm.get('tichChon_HoTenNguoiMuaHang').disable();
            // this.mainForm.get('hoTenNguoiMuaHang_Sai').disable();
            // this.mainForm.get('hoTenNguoiMuaHang_Dung').disable();
            // this.mainForm.get('tichChon_TenDonVi').disable();
            // this.mainForm.get('tenDonVi_Sai').disable();
            // this.mainForm.get('tenDonVi_Dung').disable();
            // this.mainForm.get('tichChon_DiaChi').disable();
            // this.mainForm.get('diaChi_Sai').disable();
            // this.mainForm.get('diaChi_Dung').disable();
            // this.mainForm.get('tichChon_SoDienThoai').disable();
            // this.mainForm.get('soDienThoai_Dung').disable();
            // this.mainForm.get('soDienThoai_Sai').disable();
            // this.mainForm.get('tichChon_CanCuocCongDan').disable();
            // this.mainForm.get('canCuocCongDan_Sai').disable();
            // this.mainForm.get('canCuocCongDan_Dung').disable();
            // this.mainForm.get('tenNguoiNhan').disable();
            // this.mainForm.get('emailCuaNguoiNhan').disable();
            // this.mainForm.get('emailCCNguoiNhan').disable();
            // this.mainForm.get('emailBCCNguoiNhan').disable();
            this.mainForm.get('giaiTrinhSaiSot').disable();
          }
        }
      }
    });
  }

  thucHien() {
    //validate dữ liệu

    // if (this.mainForm.get('tichChon_HoTenNguoiMuaHang').value) {
    //   if (this.mainForm.controls['hoTenNguoiMuaHang_Dung'].value == null || this.mainForm.controls['hoTenNguoiMuaHang_Dung'].value == '') {
    //     this.mainForm.controls['hoTenNguoiMuaHang_Dung'].setValidators([Validators.required]);
    //     this.mainForm.controls['hoTenNguoiMuaHang_Dung'].markAsTouched();
    //     this.mainForm.controls['hoTenNguoiMuaHang_Dung'].updateValueAndValidity();
    //     setStyleTooltipError(true);
    //     return;
    //   }
    //   if (this.mainForm.get('hoTenNguoiMuaHang_Sai').value == this.mainForm.get('hoTenNguoiMuaHang_Dung').value) {
    //     this.modalService.create({
    //       nzContent: MessageBoxModalComponent,
    //       nzMaskClosable: false,
    //       nzClosable: false,
    //       nzKeyboard: false,
    //       nzStyle: { top: '100px' },
    //       nzBodyStyle: { padding: '1px' },
    //       nzWidth: '475px',
    //       nzComponentParams: {
    //         msMessageType: MessageType.Warning,
    //         msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //         msTitle: 'Kiểm tra lại',
    //         msContent: 'Thông tin đúng và thông tin sai sót không được trùng nhau. Vui lòng kiểm tra lại!'
    //       },
    //       nzFooter: null
    //     });
    //     return;
    //   }

    //   if (this.mainForm.controls['hoTenNguoiMuaHang_Dung'].value && this.mainForm.controls['hoTenNguoiMuaHang_Dung'].value != '') {
    //     if(this.mainForm.invalid){
    //       this.mainForm.markAsTouched();
    //       this.mainForm.updateValueAndValidity();
    //       setStyleTooltipError(true);
    //       return;
    //     }
    //   }
    // }

    // if (this.mainForm.get('tichChon_TenDonVi').value) {
    //   if (this.mainForm.controls['tenDonVi_Dung'].value == null || this.mainForm.controls['tenDonVi_Dung'].value == '') {
    //     this.mainForm.controls['tenDonVi_Dung'].setValidators([Validators.required]);
    //     this.mainForm.controls['tenDonVi_Dung'].markAsTouched();
    //     this.mainForm.controls['tenDonVi_Dung'].updateValueAndValidity();
    //     setStyleTooltipError(true);
    //     return;
    //   }
    //   if (this.mainForm.get('tenDonVi_Sai').value == this.mainForm.get('tenDonVi_Dung').value) {
    //     this.modalService.create({
    //       nzContent: MessageBoxModalComponent,
    //       nzMaskClosable: false,
    //       nzClosable: false,
    //       nzKeyboard: false,
    //       nzStyle: { top: '100px' },
    //       nzBodyStyle: { padding: '1px' },
    //       nzComponentParams: {
    //         msMessageType: MessageType.Warning,
    //         msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //         msTitle: 'Kiểm tra lại',
    //         msContent: 'Thông tin đúng và thông tin sai sót không được trùng nhau. Vui lòng kiểm tra lại!'
    //       },
    //       nzFooter: null
    //     });
    //     return;
    //   }

    //   if (this.mainForm.controls['tenDonVi_Dung'].value && this.mainForm.controls['tenDonVi_Dung'].value != '') {
    //     if(this.mainForm.invalid){
    //       this.mainForm.markAsTouched();
    //       this.mainForm.updateValueAndValidity();
    //       setStyleTooltipError(true);
    //       return;
    //     }
    //   }
    // }

    // if (this.mainForm.get('tichChon_DiaChi').value) {
    //   if (this.mainForm.controls['diaChi_Dung'].value == null || this.mainForm.controls['diaChi_Dung'].value == '') {
    //     this.mainForm.controls['diaChi_Dung'].setValidators([Validators.required]);
    //     this.mainForm.controls['diaChi_Dung'].markAsTouched();
    //     this.mainForm.controls['diaChi_Dung'].updateValueAndValidity();
    //     setStyleTooltipError(true);
    //     return;
    //   }
    //   if (this.mainForm.get('diaChi_Sai').value == this.mainForm.get('diaChi_Dung').value) {
    //     this.modalService.create({
    //       nzContent: MessageBoxModalComponent,
    //       nzMaskClosable: false,
    //       nzClosable: false,
    //       nzKeyboard: false,
    //       nzStyle: { top: '100px' },
    //       nzBodyStyle: { padding: '1px' },
    //       nzComponentParams: {
    //         msMessageType: MessageType.Warning,
    //         msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //         msTitle: 'Kiểm tra lại',
    //         msContent: 'Thông tin đúng và thông tin sai sót không được trùng nhau. Vui lòng kiểm tra lại!'
    //       },
    //       nzFooter: null
    //     });
    //     return;
    //   }

    //   if (this.mainForm.controls['diaChi_Sai'].value && this.mainForm.controls['diaChi_Sai'].value != '') {
    //     if(this.mainForm.invalid){
    //       this.mainForm.markAsTouched();
    //       this.mainForm.updateValueAndValidity();
    //       setStyleTooltipError(true);
    //       return;
    //     }
    //   }
    // }

    // if (this.mainForm.get('tichChon_HoTenNguoiMuaHang').value ||
    //   this.mainForm.get('tichChon_TenDonVi').value ||
    //   this.mainForm.get('tichChon_DiaChi').value) {
    //   if (this.mainForm.invalid) {
    //     this.mainForm.controls['emailCuaNguoiNhan'].markAsTouched();
    //     this.mainForm.controls['emailCuaNguoiNhan'].updateValueAndValidity();
    //     setStyleTooltipError(true);
    //     //còn kiểm tra bcc, cc, list email nữa
    //     return;
    //   }
    // }

    if (this.mainForm.invalid) {
      this.mainForm.markAsTouched();
      this.mainForm.updateValueAndValidity();
      setStyleTooltipError(true);
      //còn kiểm tra bcc, cc, list email nữa
      return;
    }

    // if(this.isPhieuXuatKho){
    //   if (this.mainForm.invalid) {
    //     this.mainForm.markAsTouched();
    //     this.mainForm.updateValueAndValidity();
    //     setStyleTooltipError(true);
    //     //còn kiểm tra bcc, cc, list email nữa
    //     return;
    //   }
    // }

    this.loading = true;
    let formData = this.mainForm.getRawValue();
    formData.soHoaDon =
      this.data.soHoaDon == "" || this.data.soHoaDon == null
        ? "<Chưa cấp số>"
        : this.data.soHoaDon;

    this.hoaDonDienTuService.SendEmailThongBaoSaiThongTin(formData).subscribe(
      (rs: any) => {
        if (rs == false) {
          this.message.warning("Không gửi được thông báo đến khách hàng");
          this.loading = false;
          return;
        }

        this.sharedService.emitChange({
          type: "LoadDataAfterAddNew",
          status: true,
        });

        this.nhatKyTruyCapService
          .Insert({
            loaiHanhDong: LoaiHanhDong.GuiThongBaoHoaDonCoThongTinSaiSot,
            doiTuongThaoTac: "empty",
            refType: RefType.HoaDonDienTu,
            thamChieu: null,
            moTaChiTiet: `Gửi thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn thành công.\nMẫu số: <${
              this.data.mauSo
            }>; Ký hiệu: <${this.data.kyHieu}>; Số hóa đơn: <${
              this.data.soHoaDon || "<Chưa cấp số>"
            }>; Ngày hóa đơn: <${moment(this.data.ngayHoaDon).format(
              "DD/MM/YYYY"
            )}>; Tên người nhận: <${
              formData.tenNguoiNhan
            }>; Email người nhận: <${getEmailWithBCCAndCC(
              formData.emailCuaNguoiNhan,
              formData.emailCCNguoiNhan,
              formData.emailBCCNguoiNhan
            )}>;`,
            refId: this.data.hoaDonDienTuId,
          }).subscribe();

        // this.modalService.create({
        //   nzContent: MessageBoxModalComponent,
        //   nzMaskClosable: false,
        //   nzClosable: false,
        //   nzKeyboard: false,
        //   nzStyle: { top: "100px" },
        //   nzBodyStyle: { padding: "1px" },
        //   nzComponentParams: {
        //     msMessageType: MessageType.Info,
        //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        //     msTitle: "Gửi thông báo sai sót đến khách hàng",
        //     msContent:
        //       "Đã hoàn thành việc gửi thông báo sai sót không lập lại hóa đơn đến khách hàng. Hãy nhắc khách hàng của bạn kiểm tra email để nhận thông báo này.",
        //   },
        //   nzFooter: null,
        // });
        this.message.success('Gửi thông báo sai sót đến khách hàng thành công',{
          nzDuration:5000
        })
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: "100px" },
          nzBodyStyle: { padding: "1px" },
          nzComponentParams: {
            msHasThongBaoSaiSot: true,
            msButtonLabelThongBaoSaiSot:
              "Lập thông báo hóa đơn điện tử có sai sót tại đây",
            msMessageType: MessageType.Info,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: "Lập thông báo hóa đơn điện tử có sai sót gửi CQT",
            msContent:
              "Sau khi đã gửi <b>Thông báo hóa đơn có thông tin sai sót không phải lập lại hóa đơn cho khách hàng</b>, người nộp thuế cần lập <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> để gửi CQT.<br>" +
              "<div class='contentlaptbss'>1. Để không làm gián đoạn quá trình xử lý sai sót phải lập lại hóa đơn sau này (nếu phát sinh), người nộp thuế cần lập và gửi <b>Thông báo hóa đơn điện tử có sai sót</b> đến CQT ngay sau khi gửi <b>Thông báo hóa đơn có sai sót thông tin không phải lập lại hóa đơn cho khách hàng.</b><br>" +
              "2. Thời hạn phải gửi <b>Thông báo hóa đơn điện tử có sai sót</b> tới CQT chậm nhất là ngày cuối cùng của kỳ kê khai thuế giá trị gia tăng của hóa đơn có thông tin sai sót (<span class = 'orangeColorTBaoSaiThongTin'>Ngày cuối cùng của kỳ kê khai, không phải ngày cuối cùng của thời hạn kê khai</span>) </div>",
            msOnClose: () => {
              this.modal.destroy();
            },
            msOnLapThongBaoSaiSot: () => {
              this.modal.destroy();
              let modal04 = this.modalService.create({
                nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
                nzContent: ThongBaoHoaDonSaiSotModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: "100%",
                nzStyle: { top: "0px" },
                nzBodyStyle: { padding: "1px" },
                nzComponentParams: {
                  loaiThongBao: 1, //để mặc định, vì các hóa đơn hệ thống là 1
                  lapTuHoaDonDienTuId: this.data.hoaDonDienTuId,
                  isTraVeThongDiepChung: true,
                },
                nzFooter: null,
              });
              modal04.afterClose.subscribe((rs: any) => {
                if (rs) {
                  GlobalConstants.ThongDiepChungId = rs;
                  window.location.href = "quan-ly/thong-diep-gui";
                }
              });
            },
          },
          nzFooter: null,
        });
        this.loading = false;
      },
      (err) => {
        this.message.error("Lỗi khi gửi email");
        this.loading = false;
      }
    );

  }

  xemHoaDon() {
    this.loading = true;
    this.hoaDonDienTuService.ConvertHoaDonToFilePDF(this.data).subscribe(
      (rs: any) => {
        const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
        showModalPreviewPDF(this.modalService, `${pathPrint}`);
        this.loading = false;
      },
      (err) => {
        this.message.warning("Lỗi khi xem hóa đơn");
        this.loading = false;
      }
    );
  }

  destroyModal() {
    this.modal.destroy();
  }

  anHienEmailCC_BCC() {
    this.hasEmailCcBcc = !this.hasEmailCcBcc;
  }

  //hàm này để kiểm tra thông tin sai có dữ liệu ko để hiển thị mặc định
  kiemTraThongTin(duLieu: string, thongBaoHienThi: string) {
    if (duLieu == null) duLieu = "";
    duLieu = duLieu.trim();
    if (duLieu == "") {
      return thongBaoHienThi;
    } else {
      return duLieu;
    }
  }

  //hàm này để kiểm tra dữ liệu null
  kiemTraNull(duLieu: any) {
    if (duLieu == null) duLieu = "";
    duLieu = duLieu.toString().trim();
    return duLieu;
  }

  //validate dữ liệu: nếu trùng họ và tên
  kiemTraTrungSaiDung_HoTen(c: AbstractControl) {
    if (!c.parent || !c) {
      return null;
    }

    //nếu ko tích chọn
    if (c.parent.get("tichChon_HoTenNguoiMuaHang").value != true) {
      return null;
    }

    const value = c.value as string;
    if (!value) {
      return null;
    }

    let thongTinSai = c.parent.get("hoTenNguoiMuaHang_Sai").value;
    if (thongTinSai == null) thongTinSai = "";

    if (thongTinSai.trim().toLowerCase() == value.trim().toLowerCase()) {
      return { invalid: true };
    }

    return null;
  }

  //validate dữ liệu: nếu trùng đơn vị
  kiemTraTrungSaiDung_DonVi(c: AbstractControl) {
    if (!c.parent || !c) {
      return null;
    }

    //nếu ko tích chọn
    if (c.parent.get("tichChon_TenDonVi").value != true) {
      return null;
    }

    const value = c.value as string;
    if (!value) {
      return null;
    }

    let thongTinSai = c.parent.get("tenDonVi_Sai").value;
    if (thongTinSai == null) thongTinSai = "";

    if (thongTinSai.trim().toLowerCase() == value.trim().toLowerCase()) {
      return { invalid: true };
    }

    return null;
  }

  //validate dữ liệu: nếu trùng địa chỉ
  kiemTraTrungSaiDung_DiaChi(c: AbstractControl) {
    if (!c.parent || !c) {
      return null;
    }

    //nếu ko tích chọn
    if (c.parent.get("tichChon_DiaChi").value != true) {
      return null;
    }

    const value = c.value as string;
    if (!value) {
      return null;
    }

    let thongTinSai = c.parent.get("diaChi_Sai").value;
    if (thongTinSai == null) thongTinSai = "";

    if (thongTinSai.trim().toLowerCase() == value.trim().toLowerCase()) {
      return { invalid: true };
    }

    return null;
  }
  kiemTraTrungSaiDung_CanCuocCongDan(c: AbstractControl) {
    if (!c.parent || !c) {
      return null;
    }

    //nếu ko tích chọn
    if (c.parent.get("tichChon_CanCuocCongDan").value != true) {
      return null;
    }

    const value = c.value as string;
    if (!value) {
      return null;
    }

    let thongTinSai = c.parent.get("canCuocCongDan_Sai").value;
    if (thongTinSai == null) thongTinSai = "";

    if (thongTinSai.trim().toLowerCase() == value.trim().toLowerCase()) {
      return { invalid: true };
    }

    return null;
  }
  kiemTraTrungSaiDung_SoDienThoai(c: AbstractControl) {
    if (!c.parent || !c) {
      return null;
    }

    //nếu ko tích chọn
    if (c.parent.get("tichChon_SoDienThoai").value != true) {
      return null;
    }

    const value = c.value as string;
    if (!value) {
      return null;
    }

    let thongTinSai = c.parent.get("soDienThoai_Sai").value;
    if (thongTinSai == null) thongTinSai = "";

    if (thongTinSai.trim().toLowerCase() == value.trim().toLowerCase()) {
      return { invalid: true };
    }

    return null;
  }

  //hàm này change chọn loại sai sót
  changeChonLoaiSaiSot(loaiSaiSot: number) {
    this.hoaDonDienTuService
      .KiemTraSoLanGuiEmailSaiSot(this.data.hoaDonDienTuId, loaiSaiSot)
      .subscribe((rs: any) => {
        switch (loaiSaiSot) {
          case 0:
            this.soLanGuiSaiSot_HoTen = rs;
            break;
          case 1:
            this.soLanGuiSaiSot_DonVi = rs;
            break;
          case 2:
            this.soLanGuiSaiSot_DiaChi = rs;
            break;
          case 3:
            this.soLanGuiSaiSot_CanCuocCongDan = rs;
            break;
          case 4:
            this.soLanGuiSaiSot_SoDienThoai = rs;
            break;
          default:
            break;
        }
      });
  }

  changeThongTinNguoiNhan() {
    if (
      !(
        this.isPhieuXuatKho ||
        this.mainForm.get("tichChon_HoTenNguoiMuaHang").value ||
        this.mainForm.get("tichChon_TenDonVi").value ||
        this.mainForm.get("tichChon_DiaChi").value ||
        this.mainForm.get("tichChon_SoDienThoai").value ||
        this.mainForm.get("tichChon_CanCuocCongDan").value
      )
    ) {
      this.mainForm.get("tenNguoiNhan").disable();
      this.mainForm.get("emailCuaNguoiNhan").disable();
    } else {
      this.mainForm.get("tenNguoiNhan").enable();
      this.mainForm.get("emailCuaNguoiNhan").enable();
    }
  }
}
