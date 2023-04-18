import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-message-box-modal',
  templateUrl: './message-box-modal.component.html',
  styleUrls: ['./message-box-modal.component.scss']
})
/*
 *message-box-modal dùng để thay thế cho các message box confirm/warning/... có sẵn của angular
 *code message-box-modal vì:
  - cần style mesage box theo yêu cầu
  - khi tích/bỏ tích chọn các checkbox để bật ra confirm/warning/... của angular thì hay bị lỗi ExpressionChangedAfterItHasBeenCheckedError
*/
export class MessageBoxModalComponent implements OnInit {
  @Input() msOkButtonInBlueColor = false; //true = hiển thị nút đồng ý màu xanh dương
  @Input() msOkButtonContinueIcon = false;//true: hiển thị nút đồng ý với icon mũi tên sang phải
  @Input() msCloseButtonBlueColor = false; //true = hiển thị nút đóng màu xanh dương
  @Input() msCloseButtonBackIcon = false;//true: hiển thị nút đồng ý với icon mũi tên sang phải
  @Input() msQuestion: any = false; // icon ?
  @Input() msHasWatchVideo = false;
  @Input() msTitle: any; //tiêu đề thông báo
  @Input() msContent: any; //nội dung thông báo
  @Input() msMessageType: MessageType; //kiểu message box
  @Input() msOKText: string; //nhãn của nút OK
  @Input() msCancelText: string; //nhãn của nút Cancel
  @Input() msCloseText: string; //nhãn của nút đóng
  @Input() msWatchText: string; //nhãn nút xem
  @Input() msOnOk: () => any; //các code sẽ chạy khi bấm nút OK
  @Input() msOnOkCopy: (val1) => any; //các code sẽ chạy khi bấm nút OK
  @Input() msOnCancel: () => any; //các code sẽ chạy khi bấm nút Cancel
  @Input() msOnClose: () => any; //các code sẽ chạy khi bấm nút Close
  @Input() msOnWatch: () => any; //các code sẽ chạy khi bấm nút Xem video
  @Input() msHasThongBaoSaiSot = false; //nếu lập thông báo sai sót
  @Input() msHasCheckedCopy = false; //lập thay thế copy từ hóa đơn cũ
  @Input() msHasGuiHoaDon = false; //nếu gửi hóa đơn
  @Input() msCapNhatNgayHoaDon = false; //cập nhật ngày hóa đơn nếu có hóa đơn có ngày hóa đơn nhỏ hơn ngày hóa đơn đang phát hành
  @Input() msOnCapNhatNgayHoaDon: () => any; //các code sẽ chạy khi bấm nút Cập nhật
  @Input() msListHoaDonChuaCapSo = []; // danh sách hóa đơn chưa cấp số cần cập nhật ngày
  @Input() msXemDanhMucBoKyHieuHoaDon = false; // xem danh mục bộ ký hiệu hóa đơn
  @Input() msButtonLabelThongBaoSaiSot: any; //nhãn lập thông báo sai sót
  @Input() msOnLapThongBaoSaiSot: () => any; //các code sẽ chạy khi bấm nút lập thông báo sai sót
  @Input() msButtonLabelGuiHoaDon: any; //nhãn gửi hóa đơn
  @Input() msOnGuiHoaDon: () => any; //các code sẽ chạy khi bấm nút gửi hóa đơn
  @Input() msHasThongTinNNT = false; //nếu chưa có/chưa nhập đầy đủ thông tin người nộp thuế
  @Input() msButtonLabelThongTinNNT: any; //nhãn xem thông tin người nộp thuế
  @Input() msOnCapNhatThongTinNNT: () => any; //các code chạy khi bấm nút xem thông tin nnt
  messageType = MessageType;
  checkChonNhanBanThongTin = false; //lập thay thế copy từ hóa đơn cũ

  constructor(
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
  }

  //click nút để đóng messagebox (ví dụ nút đóng, hủy, v.v..)
  destroyModal() {
    if (this.msOnClose != null) {
      this.msOnClose();
    }
    if (this.msMessageType == MessageType.Confirm) {
      this.modal.destroy(false);
    } else {
      this.modal.destroy();
    }
  }

  //click nút OK (ví dụ nút đồng ý, ok, xác nhận, v.v..)
  clickOK() {
    if (this.msHasCheckedCopy) {
      if (this.msOnOkCopy != null) {
        console.log(this.checkChonNhanBanThongTin);
        this.msOnOkCopy(this.checkChonNhanBanThongTin);
      }
    } else {
      if (this.msOnOk != null) {
        this.msOnOk();
      }
    }

    if (this.msMessageType == MessageType.Confirm) this.modal.destroy(true);
    else this.modal.destroy();
  }

  //click nút Cancel (ví dụ nút quay lại,...)
  clickCancel() {
    if (this.msOnCancel != null) {
      this.msOnCancel();
    }
    this.modal.destroy();
  }

  clickWatch(){
    if (this.msOnWatch != null) {
      this.msOnWatch();
    }
    this.modal.destroy();

  }

  //click lập thông báo sai sót
  clickLapThongBaoSaiSot() {
    if (this.msOnLapThongBaoSaiSot != null) {
      this.msOnLapThongBaoSaiSot();
    }
    this.modal.destroy();
  }

  clickGuiHoaDon() {
    if (this.msOnGuiHoaDon != null) {
      this.msOnGuiHoaDon();
    }
    this.modal.destroy();
  }
  
  clickXemThongTinNNT(){
    if(this.msOnCapNhatThongTinNNT != null){
      this.msOnCapNhatThongTinNNT();
    }

    this.modal.destroy();
  }

  clickCapNhatNgayHD() {
    if (this.msOnCapNhatNgayHoaDon != null) {
      this.msOnCapNhatNgayHoaDon();
    }
    this.modal.destroy();
  }

  ngungChucNangVaXemChiTiet(item: any) {
    const param = {
      isNgungChucNangVaXemChiTiet: true,
      trangThaiQuyTrinh: item.trangThaiQuyTrinh,
      kyHieuHoaDon: item.kyHieuHoaDon
    };

    this.modal.destroy(param);
  }

  xemChiTietTrongTabMoi(item: any) {
    const param = {
      isNgungChucNangVaXemChiTiet: true,
      trangThaiQuyTrinh: item.trangThaiQuyTrinh,
      kyHieuHoaDon: item.kyHieuHoaDon
    };

    var query = btoa(encodeURIComponent(JSON.stringify(param)));

    const link = document.createElement('a');
    link.target = '_blank';
    link.href = '/hoa-don-dien-tu/quan-li-hoa-don-dien-tu?query=' + query;
    link.click();
    link.remove();
  }
}

export enum MessageType {
  Warning = 1,
  Confirm = 2,
  ConfirmBeforeClosing = 3, //trường hợp có 3 nút (quay lại, đồng ý, hủy) khi đóng modal,
  ConfirmBeforeSubmit = 4,
  Info = 5,
  Error = 6,
  WarningAndInstall = 7,
  InfoWithoutButton = 8
}
