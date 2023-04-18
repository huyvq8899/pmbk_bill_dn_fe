import { HostListener, Input } from '@angular/core';

export enum KeyCode {
  ESCAPE = 27,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  XemTruoc = 188,
  XemSau = 190,
  VeDau = 188,
  VeCuoi = 190,
  ThemItems = 121,
  Luu = 83
}
export abstract class ESCDanhMucKeyEventHandler {

  abstract closeModal();
  @Input() HostComponent: any;   // Component này là component nghiệp vụ (vd: danh sách báo giá, modal báo giá)
  @Input() ActivedModal: any;     // Nếu mở modal thì ActivedModal != null để ngăn sự kiện bàn phím mở modal nhiều lần
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeyCode.ESCAPE:
        this.closeModal();    // ESC Thoast        
        break;
    }
  }
}

export abstract class TabShortKeyEventHandler {

  abstract clickThem();

  abstract clickXem();

  // isCopy = true sao chép
  // isCopy = false -> sửa
  abstract clickSua(isCopy);

  abstract clickXoa();
  @Input() HostComponent: any;   // Component này là component nghiệp vụ (vd: danh sách báo giá, modal báo giá)
  @Input() ActivedModal: any;     // Nếu mở modal thì ActivedModal != null để ngăn sự kiện bàn phím mở modal nhiều lần
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeyCode.F1:      // F1 - Trợ giúp        
        break;
      case KeyCode.F2:      // F2 - Thêm một bản ghi mới        
        // ALT + F2 - Sao chép bản ghi
        if (event.altKey && !event.shiftKey && !event.ctrlKey) {
          this.clickSua(true);
        } else {
          this.clickThem();
        }
        break;
      case KeyCode.F4:      // F4 - Xem thông tin
        this.clickXem();
        break;
      case KeyCode.F8:      // F8 – Sửa một bản ghi
        this.clickSua(false);
        break;
      case KeyCode.F9:      // F9 – Xoá một bản ghi
        this.clickXoa();
        break;
    }
  }
}
export abstract class ModalShortKeyEventHandler {

  abstract onAddObjClick(); // click them

  abstract onEditClick(); // click sua

  abstract submitForm();  // click luu

  abstract onDeleteClick();  // click xoa

  abstract first(); // ve dau

  abstract forward(); // ve truoc

  abstract backward(); // ve sau

  abstract last();  // ve cuoi

  abstract clickXem();  // xem

  abstract addItem();  // them items

  abstract closeModal(); // Đóng modal

  @Input() HostComponent: any;   // Component này là component nghiệp vụ (vd: danh sách báo giá, modal báo giá)
  @Input() ActivedModal: any;     // Nếu mở modal thì ActivedModal != null để ngăn sự kiện bàn phím mở modal nhiều lần
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case KeyCode.F1:      // F1 - Trợ giúp        
        break;
      case KeyCode.F2:      // F2 - Them
        this.onAddObjClick();
        break;
      case KeyCode.F4:      // F4 - Xem thông tin
        this.clickXem();
        break;
      case KeyCode.F8:         // F8 – Sửa một bản ghi
        this.onEditClick();
        break;
      case KeyCode.F9:         // F9 – Xoá một bản ghi
        this.onDeleteClick();
        break;
      case KeyCode.VeDau:     // alt + shift + < = về đầu
        if (event.altKey && event.shiftKey && event.keyCode === 188 && !event.ctrlKey) {
          this.first();
        } else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 188) {
          this.forward();
        }
        break;
      case KeyCode.VeCuoi:    // alt + shift + > = về cuoi
        if (event.altKey && event.shiftKey && event.keyCode === 190 && !event.ctrlKey) {
          this.last();
        }
        else if (event.altKey && !event.shiftKey && event.keyCode === 190 && !event.ctrlKey) {
          this.backward();
        }
        break;
      case KeyCode.ThemItems:
        this.addItem();
        break;
      case KeyCode.Luu:
        if (event.altKey && !event.shiftKey && !event.ctrlKey) {
          this.submitForm();
        }
        break;
      case KeyCode.ESCAPE:
        this.closeModal();
      default:
        break;
    }
  }
}
export class KeyboardEventHandler {
  @Input() HostComponent: any;   // Component này là component nghiệp vụ (vd: danh sách báo giá, modal báo giá)
  @Input() ActivedModal: any;     // Nếu mở modal thì ActivedModal != null để ngăn sự kiện bàn phím mở modal nhiều lần
  hostComponentName: any;         // Tên class của component để nhận biết đang mở component nào

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    /*
    this.hostComponentName = this.HostComponent.constructor.name;

    
    

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 78) { // alt + n = thêm mới
      switch (this.hostComponentName) {
        // case 'TabBaoGiaComponent':
        // case 'TabDonDatHangComponent':
        // case 'TabChungTuBanHangComponent':
        // case 'HeThongTaiKhoanComponent':
        // case 'TaiKhoanKetChuyenComponent':
        // case 'DinhKhoanTuDongComponent':
        // case 'CoCauToChucComponent':
        // case 'KhachHangComponent':
        // case 'NhaCungCapComponent':
        // case 'NhanVienComponent':
        // case 'NhomKhachHangNhaCungCapComponent':
        // case 'ListLoaiCongCuDungCuComponent':
        // case 'ListLoaiTaiSanCoDinhComponent':
        // case 'VatTuHangHoaComponent':
        // case 'KhoComponent':
        // case 'NhomVatTuHangHoaComponent':
        // case 'DonViTinhComponent':
        // case 'DoiTuongTapHopChiPhiComponent':
        // case 'KhoanMucChiPhiComponent':
        // case 'CongTrinhComponent':
        // case 'NganHangComponent':
        // case 'TaiKhoanNganHangComponent':
        // case 'DieuKhoanThanhToanComponent':
        // case 'MucThuChiComponent':
        // case 'MaThongKeComponent':
        // case 'LoaiTienComponent':
        // case 'LoaiChungTuComponent':
        // case 'TabXuatHoaDonComponent':
        // case 'TabTraLaiHangBanComponent':
        case 'TabChungTuGiamGiaHangBanComponent':

          this.HostComponent.clickThem();
          break;
        case 'AddEditChungTuTraLaiHangBanComponent':
          this.HostComponent.onAddObjClick();

      }
    }
    if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 78) { // alt + shift + n = nhân bản
      switch (this.hostComponentName) {
        case 'TabBaoGiaComponent':
        case 'TabDonDatHangComponent':
        case 'TabChungTuBanHangComponent':
        case 'HeThongTaiKhoanComponent':
        case 'TaiKhoanKetChuyenComponent':
        case 'DinhKhoanTuDongComponent':
        case 'KhachHangComponent':
        case 'NhaCungCapComponent':
        case 'NhanVienComponent':
        case 'NhomKhachHangNhaCungCapComponent':
        case 'ListLoaiCongCuDungCuComponent':
        case 'ListLoaiTaiSanCoDinhComponent':
        case 'VatTuHangHoaComponent':
        case 'KhoComponent':
        case 'NhomVatTuHangHoaComponent':
        case 'DonViTinhComponent':
        case 'DoiTuongTapHopChiPhiComponent':
        case 'KhoanMucChiPhiComponent':
        case 'CongTrinhComponent':
        case 'TaiKhoanNganHangComponent':
        case 'DieuKhoanThanhToanComponent':
        case 'MucThuChiComponent':
        case 'MaThongKeComponent':
        case 'LoaiTienComponent':
        case 'LoaiChungTuComponent':
        case 'TabXuatHoaDonComponent':
        case 'TabTraLaiHangBanComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          this.HostComponent.clickSua(true);
          break;
        case 'CoCauToChucComponent':
        case 'NganHangComponent':

          this.HostComponent.clickSua();
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 86) { // alt + v = xem chứng từ
      switch (this.hostComponentName) {
        case 'TabBaoGiaComponent':
        case 'TabDonDatHangComponent':
        case 'TabChungTuBanHangComponent':
          this.HostComponent.clickView(false);
          break;
        case 'LoaiChungTuComponent':
          this.HostComponent.clickXem();
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 81) { // alt + q = sửa chứng từ
      switch (this.hostComponentName) {
        case 'TabBaoGiaComponent':
        case 'TabDonDatHangComponent':
        case 'TabChungTuBanHangComponent':
        case 'HeThongTaiKhoanComponent':
        case 'TaiKhoanKetChuyenComponent':
        case 'TaiKhoanNgamDinhComponent':
        case 'DinhKhoanTuDongComponent':
        case 'CoCauToChucComponent':
        case 'KhachHangComponent':
        case 'NhaCungCapComponent':
        case 'NhanVienComponent':
        case 'NhomKhachHangNhaCungCapComponent':
        case 'ListLoaiCongCuDungCuComponent':
        case 'ListLoaiTaiSanCoDinhComponent':
        case 'VatTuHangHoaComponent':
        case 'KhoComponent':
        case 'NhomVatTuHangHoaComponent':
        case 'DonViTinhComponent':
        case 'DoiTuongTapHopChiPhiComponent':
        case 'KhoanMucChiPhiComponent':
        case 'CongTrinhComponent':
        case 'NganHangComponent':
        case 'TaiKhoanNganHangComponent':
        case 'DieuKhoanThanhToanComponent':
        case 'MucThuChiComponent':
        case 'MaThongKeComponent':
        case 'LoaiTienComponent':
        case 'LoaiChungTuComponent':
        case 'TabXuatHoaDonComponent':
        case 'TabTraLaiHangBanComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          this.HostComponent.clickSua(false);
          break;
      }
    }
    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 68) { // alt + d = xóa chứng từ
      switch (this.hostComponentName) {
        case 'TabBaoGiaComponent':
        case 'TabDonDatHangComponent':
        case 'TabChungTuBanHangComponent':
        case 'HeThongTaiKhoanComponent':
        case 'TaiKhoanKetChuyenComponent':
        case 'DinhKhoanTuDongComponent':
        case 'CoCauToChucComponent':
        case 'KhachHangComponent':
        case 'NhaCungCapComponent':
        case 'NhanVienComponent':
        case 'NhomKhachHangNhaCungCapComponent':
        case 'ListLoaiCongCuDungCuComponent':
        case 'ListLoaiTaiSanCoDinhComponent':
        case 'VatTuHangHoaComponent':
        case 'KhoComponent':
        case 'NhomVatTuHangHoaComponent':
        case 'DonViTinhComponent':
        case 'DoiTuongTapHopChiPhiComponent':
        case 'KhoanMucChiPhiComponent':
        case 'CongTrinhComponent':
        case 'LoaiCongTrinhComponent':
        case 'NganHangComponent':
        case 'TaiKhoanNganHangComponent':
        case 'DieuKhoanThanhToanComponent':
        case 'MucThuChiComponent':
        case 'MaThongKeComponent':
        case 'LoaiTienComponent':
        case 'LoaiChungTuComponent':
        case 'TabXuatHoaDonComponent':
        case 'TabTraLaiHangBanComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          this.HostComponent.clickXoa();
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 83) { // alt + s = lưu chứng từ
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          if (!this.hostComponentName.fbEnableEdit) // Nếu xem thì không cho lưu
          {
            this.HostComponent.submitForm();
          }
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 116) { // alt + f5 = tải lại dữ liệu
      switch (this.hostComponentName) {
        case 'TabBaoGiaComponent':
        case 'TabDonDatHangComponent':
        case 'TabChungTuBanHangComponent':
          this.HostComponent.LoadData();
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 188) { // alt + < = xem chứng từ trước
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          if (!this.hostComponentName.fbEnableEdit) {
            this.HostComponent.forward();
          }
          break;
      }
    }
    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 190) { // alt + > = xem chứng từ sau
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          if (!this.hostComponentName.fbEnableEdit) {
            this.HostComponent.backward();
          }
          break;
      }
    }
    if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 188) { // alt + shift + < = về đầu
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          if (!this.hostComponentName.fbEnableEdit) {
            this.HostComponent.first();
          }
          break;
      }
    }
    if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 190) { // alt + shift + > = về cuối
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
        case 'AddEditHoaDonModalComponent':
        case 'TabChungTuGiamGiaHangBanComponent':
          if (!this.hostComponentName.fbEnableEdit) {
            this.HostComponent.last();
          }
          break;
      }
    }

    if (!event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 120) { // f9 = thêm nhanh danh mục trong giao diện nhập liệu (vd: thêm khách hàng, nhân viên)
      switch (this.hostComponentName) {
        case 'AddEditBaoGiaComponent':
        case 'AddEditDonDatHangComponent':
        case 'AddEditChungTuBanHangComponent':
          if (this.HostComponent.comboboxFocusKey.trim() === '') return;
          this.HostComponent.clickLinkForF9(this.HostComponent.comboboxFocusKey);
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 65) { // alt + a = chọn tất cả chứng từ bán hàng
      switch (this.hostComponentName) {
        case 'TabChungTuBanHangComponent':
          this.HostComponent.checkAll(true);
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 113) { // alt + f2 = xem số tồn trên giao diện nhập liệu
      switch (this.hostComponentName) {
        case 'AddEditDonDatHangComponent':
          this.HostComponent.xemSoLuongTon();
          break;
        case 'AddEditBaoGiaComponent':
        case 'AddEditChungTuBanHangComponent':
          this.HostComponent.xemSoLuongTon(false);
          break;
      }
    }

    if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 84) { // alt + t = lựa chọn tab trong danh sách tab bán hàng
      switch (this.hostComponentName) {
        case 'BanHangComponent':
          if (this.HostComponent.selectedTab < 7) {
            this.HostComponent.selectedTab = this.HostComponent.selectedTab + 1;
          } else {
            this.HostComponent.selectedTab = 0;
          }
          break;
      }
    }
    */
  }
}