import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { EnvService } from 'src/app/env.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { generateUUIDV4 } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { HoSoHDDTService } from '../danh-muc/ho-so-hddt.service';
import { HoaDonDienTuService } from '../quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { ThongDiepGuiDuLieuHDDTService } from './thong-diep-gui-du-lieu-hddt.service';

@Injectable({
  providedIn: 'root'
})
export class ThongDiepGuiHoaDonKhongMaService {
  hoSoHDDT: any;
  mainForm: FormGroup;
  data: any;
  isDaGuiEmailHoaDon: false;

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private hoSoHDDTService: HoSoHDDTService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService,
    private message: NzMessageService,
  ) { }

  init(callback: () => any) {
    this.createForm();

    this.forkJoin().subscribe((res: any[]) => {
      this.hoSoHDDT = res[0];
      this.isDaGuiEmailHoaDon = res[1];

      this.mainForm.patchValue({
        phienBan: '2.0.0',
        maNoiGui: `${this.env.taxCodeTCGP}`,
        maNoiNhan: `${this.env.taxCodeTCTN}`,
        maLoaiThongDiep: MLTDiep.TDCDLHDKMDCQThue,
        maThongDiep: `${this.env.taxCodeTCGP}` + generateUUIDV4(),
        maSoThue: this.hoSoHDDT.maSoThue,
        soLuong: 1
      });

      callback();
    });
  }

  forkJoin() {
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoaDonDienTuService.IsDaGuiEmailChoKhachHang(this.data.hoaDonDienTuId)
    ]);
  }

  createForm() {
    this.mainForm = this.fb.group({
      thongDiepChungId: [null],
      phienBan: [{ value: null, disabled: true }],
      maNoiGui: [{ value: null, disabled: true }],
      maNoiNhan: [{ value: null, disabled: true }],
      maLoaiThongDiep: [{ value: null, disabled: true }],
      maThongDiep: [{ value: null, disabled: true }],
      maThongDiepThamChieu: [{ value: null, disabled: true }],
      maSoThue: [{ value: null, disabled: true }],
      soLuong: [{ value: null, disabled: true }],
      hoaDonDienTuId: [this.data.hoaDonDienTuId],
      kyHieu: [{ value: this.data.boKyHieuHoaDon.kyHieu, disabled: true }],
      tongTienThanhToan: [{ value: this.data.tongTienThanhToan, disabled: true }],
      soHoaDon: [{ value: this.data.soHoaDon, disabled: true }],
      ngayHoaDon: [{ value: moment(this.data.ngayHoaDon).format("DD/MM/YYYY"), disabled: true }],
      tenKhachHang: [{ value: this.data.tenKhachHang, disabled: true }],
      hoTenNguoiNhanHD: [{ value: this.data.hoTenNguoiNhanHD, disabled: true }],
      emailNguoiNhanHD: [{ value: this.data.emailNguoiNhanHD, disabled: true }],
      soDienThoaiNguoiNhanHD: [{ value: this.data.soDienThoaiNguoiNhanHD, disabled: true }],
      fileXML: [null],
      hinhThuc: [0],
      thongDiepGuiDi: [true],
      trangThaiGui: [0],
      tenTrangThaiGui: [{ value: 'Chưa gửi', disabled: true }],
      trangThaiTiepNhan: [0],
      tenTrangThaiTiepNhan: [{ value: 'Chưa phản hồi', disabled: true }],
      createdDate: [null],
      createdBy: [null],
      status: [true]
    });
  }

  submitForm(callback: () => any) {
    const data = this.mainForm.getRawValue();

    data.duLieuGuiHDDT = {
      hoaDonDienTuId: data.hoaDonDienTuId,
      hoaDonDienTu: this.data,
      // duLieuGuiHDDTChiTiets: data.hoaDonDienTuId ? null : this.hoaDonDienTus.map(x => {
      //   return { hoaDonDienTuId: x.hoaDonDienTuId, hoaDonDienTu: x }
      // })
    };

    this.thongDiepGuiDuLieuHDDTService.Insert(data) // insert thongDiep
      .subscribe((res: any) => {
        this.thongDiepGuiDuLieuHDDTService.GuiThongDiepDuLieuHDDT(res.thongDiepChungId) // gửi thongDiep tới CQT
          .subscribe((res2: any) => {
            if (res2 === TrangThaiQuyTrinh.GuiKhongLoi || res2 === TrangThaiQuyTrinh.GuiTCTNLoi) {
              this.hoaDonDienTuService.WaitForTCTResonse(data).subscribe((res3) => { // đợi phản hồi từ CQT
                if (res3) {
                  this.openPopupGuiThanhCongHoaDonKhongMa();
                  callback();
                } else {
                  this.hoaDonDienTuService.GetTrangThaiQuyTrinhById(this.data.hoaDonDienTuId)
                    .subscribe((res3: any) => {
                      // trường hợp đợi quá 60s và gửi TCTN có lỗi
                      if (res3 === TrangThaiQuyTrinh.GuiTCTNLoi) {
                        this.modalService.create({
                          nzContent: MessageBoxModalComponent,
                          nzMaskClosable: false,
                          nzClosable: false,
                          nzKeyboard: false,
                          nzWidth: 430,
                          nzStyle: { top: '100px' },
                          nzBodyStyle: { padding: '1px' },
                          nzComponentParams: {
                            msMessageType: MessageType.Warning,
                            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                            msTitle: `Gửi dữ liệu hóa đơn không có mã của CQT`,
                            msContent: `Không gửi được hóa đơn đến <b>TCTN</b> (Tổ chức cung cấp dịch vụ nhận, truyền, lưu trữ dữ liệu hóa đơn điện tử). Vui lòng thực hiện lại!`,
                            msOnClose: () => {
                            },
                          }
                        });
                      } else {
                        this.openPopupGuiThanhCongHoaDonKhongMa();
                      }

                      callback();
                    });
                }
              });
            } else {
              callback();
            }
          });
      }, _ => {
        callback();
      });
  }

  openPopupGuiThanhCongHoaDonKhongMa() {
    // this.modalService.create({
    //   nzContent: MessageBoxModalComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzKeyboard: false,
    //   nzWidth: 430,
    //   nzStyle: { top: '100px' },
    //   nzBodyStyle: { padding: '1px' },
    //   nzComponentParams: {
    //     msMessageType: MessageType.Info,
    //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
    //     msTitle: `Gửi dữ liệu hóa đơn không có mã của CQT`,
    //     msContent: `<div>Đã hoàn thành việc gửi dữ liệu hóa đơn không có mã đến CQT qua phương thức chuyển dữ liệu là <b>Chuyển đầy đủ nội dung từng hóa đơn</b>.</div>
    //     <div>Bạn cần theo dõi <b>Trạng thái và phản hồi từ CQT</b> tại <b>Thông điệp gửi</b></div>`,
    //     msOnClose: () => {
    //       ///////////////////////
    //     },
    //   }
    // });
    this.message.success('Gửi dữ liệu hóa đơn không có mã của CQT thành công',{
      nzDuration : 5000
    })
  }
}
