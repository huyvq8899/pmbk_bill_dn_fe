import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { formatNumber } from '@angular/common';
import { SumwidthConfig } from 'src/app/shared/global';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { ChiTietHanhDongModalComponent } from 'src/app/views/tien-ich/modals/chi-tiet-hanh-dong-modal/chi-tiet-hanh-dong-modal.component';

@Component({
  selector: 'app-phat-hanh-hoa-don-modal',
  templateUrl: './xem-lich-su-modal.component.html',
  styleUrls: ['./xem-lich-su-modal.component.scss']
})
export class XemLichSuModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() isPhieuXuatKho: any;
  mainForm: FormGroup;
  displayData: any[] = [];
  total = 0;
  loading = false;
  widthConfig = ['100px', '100px', '180px', '450px', '120px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  ptChuyenDL = 0;
  isPos=0;
  SoHD;
  KyHieuMauHD;
  KyHieuHD;
  MCQMTT;
  spinning = false;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
  ) {
  }
  ngOnInit() {
    this.createForm();
    this.LoadData();
  }

  createForm() {
    this.spinning = true;
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.data != null ? this.data.mauSo + this.data.kyHieu : null, disabled: true }],
      tongTienThanhToanShow: [{ value: this.data != null ? formatNumber(Number(this.data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + this.data.loaiTien.ma : null, disabled: true }],
      mauSoShow: [{ value: this.data != null ? this.data.mauSo : null, disabled: true }],
      soHoaDonShow: [{ value: this.data != null ? (this.data.soHoaDon ? this.data.soHoaDon : '<Chưa cấp số>') : null, disabled: true }],
      ngayHoaDonShow: [{ value: this.data != null ? moment(this.data.ngayHoaDon).format("DD/MM/YYYY") : null, disabled: true }],
      tenKhachHangShow: [{ value: this.data != null ? this.data.tenKhachHang : null, disabled: true }],
    });
    this.spinning = false;
  }

  LoadData() {
    this.loading = true;
    this.ptChuyenDL = this.data.boKyHieuHoaDon.phuongThucChuyenDL;
    // if (this.data.maTraCuu != null) {
    //   this.quyDinhKyThuatService.GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu(this.data.maTraCuu).subscribe((td: any) => {
    //     if (td != null) {
    //       if (td.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu == 1) this.ptChuyenDL = 0;
    //       else this.ptChuyenDL = 1;
    //     }
    //   });
    // }
    this.nhatKyTruyCapService.GetByRefId(this.data.hoaDonDienTuId).subscribe((rs: any[]) => {
      this.displayData = rs;
      this.total = rs.length;
      this.loading = false;
    });
  }
  ngAfterViewChecked() {

  }

  destroyModal() {
    this.modal.destroy();
  }
  xemThem(data: any) {
    this.modalService.create({
      nzTitle: 'Chi tiết hành động',
      nzContent: ChiTietHanhDongModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
        data
      },
      nzFooter: null
    });
  }
}
