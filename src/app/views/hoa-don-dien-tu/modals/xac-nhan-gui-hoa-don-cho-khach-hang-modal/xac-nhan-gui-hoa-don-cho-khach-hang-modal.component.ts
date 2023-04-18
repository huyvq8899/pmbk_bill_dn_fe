import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { getTenLoaiHoaDon } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-xac-nhan-gui-hoa-don-cho-khach-hang-modal',
  templateUrl: './xac-nhan-gui-hoa-don-cho-khach-hang-modal.component.html',
  styleUrls: ['./xac-nhan-gui-hoa-don-cho-khach-hang-modal.component.scss']
})
export class XacNhanGuiHoaDonModalComponent implements OnInit {
  @Input() hoaDon: any;
  @Input() RefType: RefType;
  mainForm: FormGroup;
  ActivedModal: any=null;
  isAccept: boolean;
  isPhieuXuatKho = false;

  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService  ){
  }

  ngOnInit(){
  }

  confirm(){
    if(this.ActivedModal) return;
    if(this.isAccept){
      this.ActivedModal = this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: 450,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: `Xác nhận hóa đơn đã gửi cho khách hàng`,
          msContent: `Bạn có thực sự muốn xác nhận không?`,
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => { },
          msOnOk: ()=>{
            this.hoaDonDienTuService.XacNhanHoaDonDaGuiChoKhachHang(this.hoaDon.hoaDonDienTuId).subscribe((rs: boolean)=>{
              if(rs){
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.XacNhanHoaDonDaGuiChoKhachHang,
                  doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.hoaDon.loaiHoaDon),
                  refType: this.RefType,
                  thamChieu: `Mẫu số: <${this.hoaDon.mauSo}>; Ký hiệu: <${this.hoaDon.kyHieu}>; Số hóa đơn: <${this.hoaDon.soHoaDon}>`,
                  moTaChiTiet: `Xác nhận hóa đơn có mẫu số: <${this.hoaDon.mauSo}>; ký hiệu: <${this.hoaDon.kyHieu}>; số hóa đơn: <${this.hoaDon.soHoaDon}> đã gửi cho khách hàng thành công`,
                  refId: this.hoaDon.hoaDonDienTuId
                }).subscribe();

                this.modal.destroy(true);
              }
              else{
                this.nhatKyTruyCapService.Insert({
                  loaiHanhDong: LoaiHanhDong.XacNhanHoaDonDaGuiChoKhachHang,
                  doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(this.hoaDon.loaiHoaDon),
                  refType: this.RefType,
                  thamChieu: `Mẫu số: <${this.hoaDon.mauSo}>; Ký hiệu: <${this.hoaDon.kyHieu}>; Số hóa đơn: <${this.hoaDon.soHoaDon}>`,
                  moTaChiTiet: `Xác nhận hóa đơn có mẫu số: <${this.hoaDon.mauSo}>; ký hiệu: <${this.hoaDon.kyHieu}>; số hóa đơn: <${this.hoaDon.soHoaDon}> đã gửi cho khách hàng không thành công`,
                  refId: this.hoaDon.hoaDonDienTuId
                }).subscribe();

                this.modal.destroy(false);
              }
            })
          },
          msOKText: TextGlobalConstants.TEXT_CONFIRM_OK
        }
      });
    }
  }

  closeModal(){
    this.modal.destroy();
  }
}
