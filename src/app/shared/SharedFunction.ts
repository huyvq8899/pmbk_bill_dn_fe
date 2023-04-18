import { LoaiHoaDon } from 'src/app/enums/LoaiHoaDon.enum';
import { HttpHeaders } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd";
import { LyDoDieuChinh, LyDoThayThe } from "../models/LyDoThayTheModel";
import { KetQuaXoaChungTuModalComponent } from "./modals/ket-qua-xoa-chung-tu-modal/ket-qua-xoa-chung-tu-modal.component";
import * as moment from 'moment';
import * as uuid from 'uuid';
import { QuyDinhApDung } from "../enums/QuyDinhApDung.enum";
import { TrangThaiQuyTrinh, TrangThaiQuyTrinhLabel } from "../enums/TrangThaiQuyTrinh.enum";
import { CookieConstant } from '../constants/constant';
import { MessageBoxModalComponent, MessageType } from './modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from './TextGlobalConstants';
import { ThongBaoHoaDonSaiSotModalComponent } from '../views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { Message } from "./Message";
import { ModalPreviewMutiplePdfComponent } from "../views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component";
import { TuyChonService } from "../services/Config/tuy-chon.service";

export enum ComponentCode {
  HE_THONG_TAI_KHOAN_COMPONENT,
  TAI_KHOAN_KE_CHUYEN
}

export enum KeyCode {
  F1 = 112,        // F1 - Trợ giúp
  F2 = 113,        // F2 - Xem thông tin
  F3 = 114,        // F3 - Sửa một bản ghi
  F4 = 115,        // F4 - Thêm một bản ghi mới
  F6 = 117,        // F6 – Sao chép thông tin
  F7 = 118,        // F7 – In
  F8 = 119         // F8 – Xoá một bản ghi
}

export function CheckTaiKhoanExit(soTaiKhoan: any, listTaiKhoan: any[]) {
  let taikhoan = listTaiKhoan.find(x => x.soTaiKhoan == soTaiKhoan);
  if (taikhoan) {
    return taikhoan.soTaiKhoan;
  } else {
    return null;
  }
}

export function handleShortKeyEvent(event: KeyboardEvent, hostComponent: any) {
  if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 78) { // alt + n = thêm mới
    switch (hostComponent.componentCode) {
      case ComponentCode.HE_THONG_TAI_KHOAN_COMPONENT:
      case ComponentCode.TAI_KHOAN_KE_CHUYEN:
        hostComponent.clickThem();
        break;
    }
  }
  else if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 78) { // alt + shift + n = nhân bản
    switch (hostComponent.componentCode) {
      case ComponentCode.HE_THONG_TAI_KHOAN_COMPONENT:
      case ComponentCode.TAI_KHOAN_KE_CHUYEN:
        hostComponent.clickSua(true);
        break;
    }
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 86) { // alt + v = xem chứng từ
    switch (hostComponent.componentCode) {
      case ComponentCode.HE_THONG_TAI_KHOAN_COMPONENT:
      case ComponentCode.TAI_KHOAN_KE_CHUYEN:
        hostComponent.clickXem();
        break;
    }
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 81) { // alt + q = sửa chứng từ
    switch (hostComponent.componentCode) {
      case ComponentCode.HE_THONG_TAI_KHOAN_COMPONENT:
      case ComponentCode.TAI_KHOAN_KE_CHUYEN:
        hostComponent.clickSua(false);
        break;
    }
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 68) { // alt + d = xóa chứng từ
    switch (hostComponent.componentCode) {
      case ComponentCode.HE_THONG_TAI_KHOAN_COMPONENT:
      case ComponentCode.TAI_KHOAN_KE_CHUYEN:
        hostComponent.clickXoa();
        break;
    }
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 83) { // alt + s = lưu chứng từ
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 116) { // alt + f5 = tải lại dữ liệu
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 188) { // alt + < = xem chứng từ trước
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 190) { // alt + > = xem chứng từ sau
  }
  else if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 188) { // alt + shift + < = về đầu
  }
  else if (event.altKey && event.shiftKey && !event.ctrlKey && event.keyCode === 190) { // alt + shift + > = về cuối
  }
  else if (!event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 120) { // f9 = thêm nhanh danh mục trong giao diện nhập liệu (vd: thêm khách hàng, nhân viên)
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 65) { // alt + a = chọn tất cả chứng từ bán hàng
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 113) { // alt + f2 = xem số tồn trên giao diện nhập liệu
  }
  else if (event.altKey && !event.shiftKey && !event.ctrlKey && event.keyCode === 84) { // alt + t = lựa chọn tab trong danh sách tab bán hàng
  }

  // let hostComponentName = hostComponent.constructor.name;



}

export function findInvalidControls(formGroup: FormGroup) {
  const invalid = [];
  const controls = formGroup.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

export function getHeightBangKeMauHoaDonInBoKyHieu() {
  return (window.innerHeight - 400);
}

export function getListEmptyBangKeKhongChiTiet(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 235) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKeKhongChiTiet2(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 260) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKeKhongChiTiet4(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 420) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getHeightBangKeKhongChiTiet3() {
  return (window.innerHeight - 260);
}

export function getHeightBangKeKhongChiTiet2_1() {
  return (window.innerHeight - 230);
}


export function getHeightBangKeKhongChiTiet4() {
  return (window.innerHeight - 280);
}


export function getListEmptyBangKeKhongChiTiet5(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 210 - 310) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKeKhongChiTiet7(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 480) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKeKhongChiTiet3(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 280) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKe4(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 135 - 380) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKe3(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 135 - 350) / 27;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKe2(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 135 - 330) / 27;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKe1(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 210 - 310) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKe(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 180 - 310) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getListEmptyBangKeTmp(datas: any) {
  var listNumberEmpty = Array();
  let nums = (window.innerHeight - 180 - 60) / 24;
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function getHeightBangKe4() {
  return (window.innerHeight - 135 - 50);
}

export function getHeightBangKe3() {
  return (window.innerHeight - 135 - 305);
}

export function getHeightBangKe2() {
  return (window.innerHeight - 135 - 280);
}

export function getHeightBangKe1() {
  return (window.innerHeight - 135 - 260);
}

export function getHeightBangKe() {
  return (window.innerHeight - 180 - 280);
}

export function getHeightBangKeKhongChiTiet2() {
  return (window.innerHeight - 220);
}

export function getHeightBangKeKhongChiTiet6() {
  return (window.innerHeight - 280);
}

export function getHeightBangKeKhongChiTiet5() {
  console.log(window.innerHeight);
  return (window.innerHeight - 480);
}


export function getHeightBangKeKhongChiTiet() {
  return (window.innerHeight - 190);
}

export function getHeightSimpleTable() {
  return (window.innerHeight - 180);
}

export function getHeightSimpleTable2() {
  return (window.innerHeight - 210);
}

export function getZeroInsteadNull(value: any) {
  if (value == null || value == '') return 0;
  return value;
}

export function getListEmptyChiTiet(datas: any) {
  var listNumberEmpty = Array();
  let nums = 4;    // Chi tiết cố định là 5
  let length = datas == null ? 0 : datas.length;
  for (let i = 0; i < nums - length; i++) {
    listNumberEmpty.push(i);
  }
  return listNumberEmpty;
}

export function GetRootsBySoTaiKhoan(input: any, list: any[]) {
  const soTaiKhoans = input.split(';');
  let result = [];
  for (const soTaiKhoan of soTaiKhoans) {
    const tkInput = list.find(x => x.soTaiKhoan === soTaiKhoan);
    if (tkInput) {
      const children = list.filter(x => x.idTaiKhoanKeToanCha === tkInput.taiKhoanKeToanId);
      if (children.length > 0) {
        for (const item of children) {
          const root = GetRootsBySoTaiKhoan(item.soTaiKhoan, list);
          if (root && root.length > 0) {
            result.push(...root);
          }
        }
      } else {
        result.push(tkInput.soTaiKhoan);
      }
    } else {
      result.push(soTaiKhoan);
    }
  }

  return result;
}

export function GetLastIndexVTHH(vt: any, list: any[]) {
  if (list.filter(x => x.vT_HHId === vt.vT_HHId).length > 0) {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].vT_HHId === vt.vT_HHId) {
        return i;
      }
    }
  }

  return -1;
}

export function GetFileUrl(file: any) {
  var blob = new Blob([file]);
  var url = URL.createObjectURL(blob);
  return url;
}

export function GetFileUrl_2(file: any) {
  var blob = new Blob([file]);
  var url = URL.createObjectURL(blob);
  return url;
}

export function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export function saveByteArray(reportName, byte, type) {
  var blob = new Blob([byte], { type: type });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

export function DownloadFile(url: any, fileName: string) {
  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function GetFileName(path: string) {
  var result = path.replace(/^.*[\\\/]/, '');
  return result;
}

export function convertArrayBufferToBase64(buffer: any) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function generateUUIDV4() {
  return uuid.v4().split('-').join('').toUpperCase();
}

export function BuildListToTree(values: any[]) {
  var list = [...values];
  var roots = [];

  for (var i = 0; i < list.length; i += 1) {
    var node = list[i];
    node.children = list.filter(x => x.parentId === node.key);
    if (node.children.length > 0) {
      node.isParent = true;
    }
  }

  roots = list.filter(x => !x.parentId);
  return roots;
}

export function BuidTreeToList(values: any[]) {
  var trees = [...values];
  var list = [];
  var queue = [];

  for (const parent of trees) {
    queue.push(parent);
    list.push(parent);

    while (queue.length !== 0) {
      const node = queue.shift();
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (child.parentId) {
            var findParent = list.find(x => x.key === child.parentId);
            if (findParent) {
              child.level = findParent.level + 1;
            }
          }

          queue.push(child);
          list.push(child);
        }
      }
    }
  }

  return list;
}

export function GetChildrenIdByKey(key: any, listAll: any[]) {
  var listId = [];
  var queue = [];
  listId.push(key);

  const data = listAll.find(x => x.key === key);
  if (data) {
    const children = listAll.filter(x => x.parentId === data.key);
    if (children.length > 0) {
      for (const item of children) {
        queue.push(item);
        listId.push(item.key);

        while (queue.length !== 0) {
          const node = queue.shift();
          const children2 = listAll.filter(x => x.parentId === node.key);
          for (const item2 of children2) {
            queue.push(item2);
            listId.push(item2.key);
          }
        }
      }
    }
  }

  return listId;
}

export function GetParentOfList(listAll: any[], listSearch: any[]) {
  var list = [];
  var queue = [];
  var listId = [];

  for (const item of listSearch) {
    listId.push(item.key);
    queue.push(item);

    while (queue.length !== 0) {
      const node = queue.shift();
      if (node.parentId) {
        const find = listAll.find(x => x.key === node.parentId);
        if (find) {
          listId.push(find.key);
          queue.push(find);
        }
      }
    }
  }

  list = listAll.filter(x => listId.includes(x.key));
  return list;
}

export function BuildListOrderByTree(values: any[]) {
  var trees = BuildListToTree(values);
  var list = BuidTreeToList(trees);
  return list;
}

export function mathRound(value: any, places: any) {
  return Number(value.toFixed(places));
}

export function getHeader() {
  return {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('tokenKey')}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
    }),
  };
}

export function getRepeatLetterSpecific(char: any, array: string[]) {
  let firstIndex = -1;
  let result = '';
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element === char) {
      if (firstIndex === -1) {
        firstIndex = i;
      } else {
        if (i - 1 === firstIndex) {
          firstIndex = i;
          result += element;
        }
      }
    }
  }

  return result;
}

export function loaiThueGTGTs(): Array<{ value: any, text: any }> {
  return [
    { value: 1, text: 'Mẫu một thuế suất' },
    { value: 2, text: 'Mẫu nhiều thuế suất' }
  ];
}

export function getThueGTGTs(): Array<{ value: any, text: any }> {
  return [
    { value: '0', text: '0%' },
    { value: '5', text: '5%' },
    { value: '10', text: '10%' },
    { value: 'KCT', text: 'KCT' },
    { value: 'KKKNT', text: 'KKKNT' },
    { value: 'KHAC', text: 'KHAC' },
  ];
}

export function getListKyHieuMauHoaDon(): Array<{ value: any, text: any }> {
  return [
    { value: 1, text: '01GTKT' },
    { value: 2, text: '02GTTT' },
    { value: 3, text: '07KPTQ' },
  ];
}

export function getTenHoaDonByLoai(loaiHoaDon: any) {
  switch (loaiHoaDon) {
    case 1:
      return 'Hóa đơn GTGT';
    case 2:
      return 'Hóa đơn bán hàng';
    case 5:
      return 'Hóa đơn khác';
    case 6:
      return 'Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn';
    case 7:
      return 'PXK kiêm vận chuyển nội bộ';
    case 8:
      return 'PXK hàng gửi bán đại lý';
    case 9:
      return 'Hóa đơn GTGT';
    case 10:
      return 'Hóa đơn bán hàng';
    case 13:
      return 'Hóa đơn khác';
      case 14:
        return 'Tem, vé là hóa đơn GTGT';
      case 15:
        return 'Tem, vé là hóa đơn bán hàng';
      case 16:
        return 'Vé tham quan'
    default:
      break;
  }
}

export function getKyHieuMauHoaDon(value: any, quyDinhApDung: any) {
  if (quyDinhApDung === QuyDinhApDung.ND512010TT322021) {
    const item = getListKyHieuMauHoaDon().find(x => x.value === value);
    return item ? item.text : null;
  } else {
    return value;
  }
}

export function getKyHieu(data: any) {
  const kyHieu = getKyHieuHoaDon(data);
  return data.loaiHoaDon + kyHieu;
}

export function getKyHieuHoaDon(data: any) {
  const kyTuThu1 = data.hinhThucHoaDon === 1 ? 'C' : 'K';
  const kyTuThu23 = moment().format('YY');
  let kyTuThu4 = '';
  switch (data.loaiHoaDon) {
    case 1:
    case 2:
      kyTuThu4 = 'T';
      break;
    case 3:
    case 4:
      kyTuThu4 = 'D';
      break;
    case 5:
      kyTuThu4 = 'G';
      break;
    case 6:
      kyTuThu4 = 'N';
      break;
    default:
      break;
  }

  const result = `${kyTuThu1}${kyTuThu23}${kyTuThu4}YY`;
  return result;
}

export function dinhDangHoaDons(): Array<{ value: any, text: any }> {
  return [
    { value: 1, text: 'Hóa đơn mẫu' },
    { value: 2, text: 'Hóa đơn dạng chuyển đổi' },
    { value: 3, text: 'Hóa đơn có chiết khấu' },
    { value: 4, text: 'Ngoại tệ' },
  ];
}

export function getTenLoaiHoaDon(type: any) {
  switch (type) {
    case LoaiHoaDon.HoaDonGTGT:
      return 'Hóa đơn giá trị gia tăng';
    case LoaiHoaDon.HoaDonBanHang:
      return 'Hóa đơn bán hàng';
    case LoaiHoaDon.HoaDonBanTaiSanCong:
      return 'Hóa đơn bán hàng (dành cho tổ chức, cá nhân trong khu phi thuế quan)';
    case LoaiHoaDon.HoaDonBanHangDuTruQuocGia:
      return 'Hóa đơn giá trị gia tăng';
    case LoaiHoaDon.PXKKiemVanChuyenNoiBo:
      return 'PXK kiêm vận chuyển nội bộ';
    case LoaiHoaDon.PXKHangGuiBanDaiLy:
      return 'PXK hàng gửi bán đại lý';
    case LoaiHoaDon.HoaDonGTGTCMTMTT:
      return 'Hóa đơn GTGT có mã từ máy tính tiền';
    case LoaiHoaDon.HoaDonBanHangCMTMTT:
      return 'Hóa đơn bán hàng có mã từ máy tính tiền';


    default:
      break;
  }
  if (type === 1) {
    return 'Hóa đơn giá trị gia tăng';
  } else if (type === 2) {
    return 'Hóa đơn bán hàng';
  } else if (type === 3) {
    return 'Hóa đơn bán hàng (dành cho tổ chức, cá nhân trong khu phi thuế quan)';
  } else if (type === 4) {
    return 'PXK kiêm vận chuyển nội bộ';
  } else {
    return 'PXK hàng gửi bán đại lý';
  }
}

export function getListKyTuThu4(): Array<{ key: any, value: any }> {
  return [
    { key: 'T', value: 'Áp dụng đối với hóa đơn điện tử do các doanh nghiệp, tổ chức, hộ, cá nhân kinh doanh đăng ký sử dụng với cơ quan thuế' },
    // { key: 'D', value: 'Áp dụng đối với hóa đơn bán tài sản công và hóa đơn bán hàng dự trữ quốc gia hoặc hóa đơn điện tử đặc thù không nhất thiết phải có một số tiêu thức do các doanh nghiệp, tổ chức đăng ký sử dụng' },
    // { key: 'L', value: 'Áp dụng đối với hóa đơn điện tử của cơ quan thuế cấp theo từng lần phát sinh' },
    { key: 'M', value: 'Áp dụng đối với hóa đơn điện tử được khởi tạo từ máy tính tiền' },
    { key: 'N', value: 'Áp dụng đối với phiếu xuất kho kiêm vận chuyển nội bộ điện tử' },
    { key: 'B', value: 'Áp dụng đối với phiếu xuất kho hàng gửi bán đại lý điện tử' },
    { key: 'G', value: 'Áp dụng đối với tem, vé, thẻ điện tử là hóa đơn giá trị gia tăng' },
    { key: 'H', value: 'Áp dụng đối với tem, vé, thẻ điện tử là hóa đơn bán hàng' },
  ];
}

export function getLyDoThayThe(model: LyDoThayThe): string {
  const mo = moment(model.ngayHoaDon, 'YYYY-MM-DD');
  var day = mo.format('DD');
  var month = mo.format('MM');
  var year = mo.format('YYYY');

  return `Thay thế cho hóa đơn Mẫu số ${convertToUpperCase(model.mauSo)} ký hiệu ${convertToUpperCase(model.kyHieu)} số ${convertToUpperCase(model.soHoaDon)} ngày ${day} tháng ${month} năm ${year}`;
}

export function getLyDoDieuChinh(model: LyDoDieuChinh): string {
  const mo = moment(model.ngayHoaDon, 'YYYY-MM-DD');
  var day = mo.format('DD');
  var month = mo.format('MM');
  var year = mo.format('YYYY');

  return `Điều chỉnh cho hóa đơn Mẫu số ${model.mauSo} ký hiệu ${model.kyHieu} số ${model.soHoaDon} ngày ${day} tháng ${month} năm ${year}`;
}

export function getLyDoDieuChinhTTHHDV(model: LyDoDieuChinh): string {
  const mo = moment(model.ngayHoaDon, 'YYYY-MM-DD');
  var day = mo.format('DD');
  var month = mo.format('MM');
  var year = mo.format('YYYY');

  return `Thông tin hàng hóa, dịch vụ của hóa đơn số ${model.soHoaDon}, ký hiệu mẫu số hóa đơn ${model.mauSo},
   ký hiệu hóa đơn ${model.kyHieu}, ngày ${day} tháng ${month} năm ${year}`;
}


export function getMoTaLoaiHoaDons() {
  return ['01GTKT', '02GTTT', '06HDXK', '07KPTQ', '03XKNB', '04HGDL'];
}

export function getHinhThucHoaDons(hasAll = false): Array<{ key: any, value: any }> {
  var data = [
    { key: 1, value: 'Có mã của cơ quan thuế' },
    { key: 0, value: 'Không có mã của cơ quan thuế' },
    { key: 2, value: 'Có mã của cơ quan thuế khởi tạo từ máy tính tiền' },
  ];

  if (hasAll) {
    data.unshift({ key: -1, value: 'Tất cả' });
  }

  return data;
}

export function getPhuongThucChuyenDLieu(hasAll = false): Array<{ key: any, value: any }> {
  var data = [
    { key: 1, value: 'Chuyển theo bảng tổng hợp dữ liệu hóa đơn điện tử' },
    { key: 0, value: 'Chuyển đầy đủ nội dung từng hóa đơn' },
  ];

  if (hasAll) {
    data.unshift({ key: -1, value: 'Tất cả' });
  }

  return data;
}

export function getLoaiHoaDon(mauSoHoaDon: string) {
  var moTa = mauSoHoaDon.substring(0, 6);
  if (moTa == '01GTKT') {
    return 1;
  }
  else if (moTa == '02GTTT') {
    return 2;
  }
}

export function getUyNhiemLapHoaDons(hasAll = false): Array<{ key: any, value: any }> {
  var data = [
    { key: 1, value: 'Đăng ký' },
    { key: 0, value: 'Không đăng ký' },
  ];

  if (hasAll) {
    data.unshift({ key: -1, value: 'Tất cả' });
  }

  return data;
}

export function getTimKiemTheo(): Array<{ key: any, value: any, checked: boolean, hidden: boolean}> {
  var data = [
    { key: 'MauSo', value: 'Ký hiệu mẫu số hóa đơn', checked: false, hidden: false },
    { key: 'KyHieu', value: 'Ký hiệu hóa đơn', checked: false, hidden: false },
    { key: 'SoHoaDon', value: 'Số hóa đơn', checked: false, hidden: false },
    { key: 'MaSoThue', value: 'Mã số thuế', checked: false, hidden: false },
    { key: 'MaKhachHang', value: 'Mã khách hàng', checked: false, hidden: false },
    { key: 'TenKhachHang', value: 'Tên khách hàng', checked: false, hidden: false },
    { key: 'NguoiMuaHang', value: 'Người mua hàng', checked: false, hidden: false },
  ];

  return data;
}

export function getTimKiemTheoKhachHang(): Array<{ key: any, value: any, checked: boolean }> {
  var data = [
    { key: 'Ma', value: 'Mã khách hàng', checked: false },
    { key: 'Ten', value: 'Tên khách hàng', checked: false },
    { key: 'MaSoThue', value: 'Mã số thuế', checked: false },
    { key: 'NguoiMuaHang', value: 'Người mua hàng', checked: false },
  ];

  return data;
}

export function getLoaiHoaDons(hasAll = false): Array<{ key: any, value: any, checked: boolean }> {
  var data = [
    { key: 1, mhd: 1, value: 'Hóa đơn GTGT', checked: true },
    { key: 2, mhd: 2, value: 'Hóa đơn bán hàng', checked: true },
    // { key: 3, value: 'Hóa đơn bán tài sản công', checked: true },
    // { key: 4, value: 'Hóa đơn bán hàng dự trữ quốc gia', checked: true },
    //{ key: 5, mhd: 5, value: 'Các loại hóa đơn khác', checked: true },
    // { key: 6, value: 'Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn', checked: true },
    { key: 7, mhd: 6, value: 'PXK kiêm vận chuyển nội bộ', checked: true },
    { key: 8, mhd: 6, value: 'PXK hàng gửi bán đại lý', checked: true },
    /// Key 9 - 10 -13 tương tự như loại hóa đơn có mã thông thường => nhưng thêm key ra để phân biệt loại hóa đơn của máy tính tiền
    /// 9 Hóa đơn GTGT có mã từ máy tính tiền
    /// 10 Hóa đơn bán hàng có mã từ máy tính tiền
    /// 13 Hóa đơn khác có mã từu máy tính tiền
    { key: 9, mhd: 1, value: 'Hóa đơn GTGT', checked: true },
    { key: 10, mhd: 2, value: 'Hóa đơn bán hàng', checked: true },
    // { key: 13, mhd: 5, value: 'Hóa đơn khác', checked: true },
    { key: 14, mhd: 5, value: 'Tem, vé, điện tử là hóa đơn GTGT', checked: true },
    { key: 15, mhd: 5, value: 'Tem, vé, điện tử là hóa đơn bán hàng', checked: true },
   // { key: 16, mhd: 5, value: 'Tem, vé, điện tử là hóa đơn GTGT', checked: true },
    //{ key: 17, mhd: 5, value: 'Tem, vé, điện tử là hóa đơn bán hàng', checked: true },
  ];

  if (hasAll) {
    data.unshift({ key: -1, mhd: -1, value: 'Tất cả', checked: true });
  }

  return data;
}

export function getTrangThaiSuDungs(hasAll = false): Array<{ key: any, value: any, checked: boolean }> {
  var data = [
    { key: 0, value: 'Chưa xác thực', checked: true },
    { key: 1, value: 'Đã xác thực', checked: true },
    { key: 2, value: 'Đang sử dụng', checked: true },
    { key: 3, value: 'Ngừng sử dụng', checked: true },
    { key: 4, value: 'Hết hiệu lực', checked: true },
  ];

  if (hasAll) {
    data.unshift({ key: -1, value: 'Tất cả', checked: true });
  }

  return data;
}

export function getTrangThaiQuyTrinhs(hasAll = false, checkAll = false): Array<{ key: any, value: any, checked: boolean }> {
  const arrayObjects: Array<{ key: any, value: any, checked: boolean }> = []

  for (const [propertyKey, propertyValue] of Object.entries(TrangThaiQuyTrinh)) {
    if (!Number.isNaN(Number(propertyKey)) || (!hasAll && propertyValue === -1)) {
      continue;
    }

    arrayObjects.push({ key: propertyValue, value: TrangThaiQuyTrinhLabel.get(parseInt(propertyValue.toString())), checked: checkAll });
  }

  return arrayObjects;
}

export function getLoaiMaus(): Array<{ key: any, value: any, }> {
  return [
    { key: 1, value: 'Mẫu cơ bản' },
    // { key: 2, value: 'Đại lý vé máy bay' },
    { key: 3, value: 'Vé vận tải hành khách thể hiện mệnh giá' },
    { key: 4, value: 'Vé vận tải hành khách không thể hiện mệnh giá' },
    { key: 5, value: 'Vé dịch vụ thể hiện mệnh giá' },
    { key: 6, value: 'Vé dịch vụ không thể hiện mệnh giá' },
    { key: 7, value: 'Vé dịch vụ công ích thể hiện mệnh giá' },
  ];
}

export function getKieuThueSuats(): Array<{ key: any, value: any }> {
  return [
    { key: 1, value: 'Một thuế suất' },
    { key: 2, value: 'Nhiều thuế suất' }
  ];
}

export function getNgonNgus(): Array<{ key: any, value: any }> {
  return [
    { key: 1, value: 'Tiếng Việt' },
    { key: 2, value: 'Song ngữ (Việt - Anh)' }
  ];
}

export function getKhoGiays(): Array<{ key: any, value: any }> {
  return [
    { key: 1, value: 'A4' },
    { key: 2, value: 'A5' }
  ];
}

export function getLoaiLoaiHoaByMoTa(value: string) {
  const moTaLoaiHDs = getMoTaLoaiHoaDons();
  if (value.includes(moTaLoaiHDs[0])) {
    return 1;
  }

  if (value.includes(moTaLoaiHDs[1])) {
    return 2;
  }

  if (value.includes(moTaLoaiHDs[3])) {
    return 3;
  }

  if (value.includes(moTaLoaiHDs[4])) {
    return 4;
  }

  if (value.includes(moTaLoaiHDs[5])) {
    return 5;
  }
}

export function setStyleTooltipError(displayAll = null) {
  setTimeout(() => {
    var selectors = document.querySelectorAll('.tooltip-error');
    if (selectors && selectors.length > 0) {
      selectors.forEach((element: HTMLElement) => {
        element.style.color = 'white';
        element.style.padding = '2px 10px';
        var errorContainer = element.closest('.ant-form-explain') as HTMLElement;
        errorContainer.style.backgroundColor = '#4A4A4A';
        errorContainer.style.position = 'absolute';
        errorContainer.style.right = '0';
        errorContainer.style.top = '27px';
        errorContainer.style.zIndex = '1000';
        errorContainer.style.borderRadius = '4px';
        if (displayAll) {
          errorContainer.style.display = 'block';
        }
        errorContainer.style.boxShadow = '0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)';

        const parentFC = element.closest('nz-form-control') as HTMLElement;
        if (parentFC) {
          parentFC.classList.forEach((value: any, key: any, parent: any) => {
            if (value.includes('tooltip-width')) {
              const arraySplit = value.split('-');
              const width = arraySplit[arraySplit.length - 1];
              errorContainer.style.width = width + 'px';
              return;
            }
            if (value.includes('tooltip-left')) {
              const arraySplit = value.split('-');
              const left = arraySplit[arraySplit.length - 1];
              errorContainer.style.left = left + 'px';
              return;
            }
          });
        }
      });
    }
  }, 0);
}

export function setStyleTooltipError_Detail(displayAll = null) {
  setTimeout(() => {
    var selectors = document.querySelectorAll('.tooltip-error');
    console.log(selectors);
    if (selectors && selectors.length > 0) {
      selectors.forEach((element: HTMLElement) => {
        element.style.color = 'white';
        element.style.padding = '1px 5px';
        var errorContainer = element.closest('.ant-form-explain') as HTMLElement;
        errorContainer.style.backgroundColor = '#4A4A4A';
        errorContainer.style.position = 'relative';
        errorContainer.style.left = '0';
        errorContainer.style.top = '-3px';
        errorContainer.style.zIndex = '1000';
        errorContainer.style.borderRadius = '4px';
        errorContainer.style.boxShadow = '0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)';
        errorContainer.style.whiteSpace = 'initial';
        errorContainer.style.display = 'block';

        if (displayAll) {
          errorContainer.style.display = 'table-cell';
        }

        const parentFC = element.closest('nz-form-control') as HTMLElement;
        console.log(parentFC.classList);
        parentFC.classList.forEach((value: any, key: any, parent: any) => {
          if (value.includes('tooltip-width')) {
            const arraySplit = value.split('-');
            const width = arraySplit[arraySplit.length - 1];
            errorContainer.style.width = width + 'px';
            return;
          }
          if (value.includes('tooltip-left')) {
            const arraySplit = value.split('-');
            const left = arraySplit[arraySplit.length - 1];
            errorContainer.style.left = left + 'px';
            return;
          }
        });
      });
    }
  }, 0);
}

export function showKetQuaXoaChungTuHangLoat(model: any, modalService: NzModalService) {
  modalService.create({
    nzTitle: 'Kết quả xóa hóa đơn',
    nzContent: KetQuaXoaChungTuModalComponent,
    nzMaskClosable: false,
    nzClosable: false,
    nzWidth: '1000px',
    nzStyle: { 'top': '10px' },
    nzBodyStyle: { 'padding': '5px' },
    nzComponentParams: {
      model
    },
    nzFooter: null
  });
}

export function isValidExtention(fileName, exts) {
  return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
}
export function isValidFileSize(fileSize: any, limit: any) {
  if ((fileSize / 1024 / 1024) < (limit * 1024)) { return true; }
  return false;
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function IsSVG(value: string) {
  if (!value) {
    return false;
  }
  const ext = value.split('.')[1];
  return ext === 'SVG' || ext === 'svg';
}

export function convertToUpperCase(value: any) {
  if (value == null) return "";
  return "<span class = 'boldText'>" + value.toString().toUpperCase() + "</span>";
}

export function getKyKeKhaiTheoThang(thang: number, nam: number) {
  console.log(thang);
  var startDate = moment([nam, thang - 1]);
  return moment(startDate).endOf('month');
}

export function getKyKeKhaiTheoQuy(quy: number, nam: number) {
  console.log(quy);
  var startDate = moment([nam]).quarter(quy).startOf('quarter');
  return moment(startDate).endOf('quarter');
}

export function getNoiDungLoiPhatHanhHoaDon(inputMessage: any) {
  let errorMessage = '';
  if (inputMessage.includes('The keyset is not defined')) {
    errorMessage = 'Chữ ký số chưa được cài đặt/Chưa cắm USB chữ ký số vào máy tính.';
  } else if (inputMessage.includes('Provider DLL failed')) {
    errorMessage = 'Đã có lỗi trong cài đặt chữ ký số. Vui lòng gỡ ra và cài đặt lại.';
  } else if (inputMessage.includes('Invalid Signature')) {
    errorMessage = 'Máy tính chưa nhận driver của USB Token đã cài. Vui lòng gỡ ra và cài đặt lại.';
  } else if (inputMessage.includes('An internal error occurred')) {
    errorMessage = 'Máy tính chưa nhận USB Token.';
  } else {
    errorMessage = inputMessage;
  }

  return errorMessage;
}

export function getNoiDungLoiKyDienTuChoNhatKy(inputMessage: any) {
  let moTa = '';
  let huongDanXuLy = '';
  if (inputMessage.includes('The keyset is not defined')) {
    moTa = 'Chữ ký số chưa được cài đặt/Chưa cắm USB chữ ký số vào máy tính';
    huongDanXuLy = 'Vui lòng kiểm tra lại';
  } else if (inputMessage.includes('Provider DLL failed')) {
    moTa = 'Đã có lỗi trong cài đặt chữ ký số';
    huongDanXuLy = 'Vui lòng gỡ ra và cài đặt lại';
  } else if (inputMessage.includes('An internal error occurred')) {
    moTa = 'Máy tính chưa nhận USB Token';
    huongDanXuLy = 'Vui lòng kiểm tra lại';
  } else if (inputMessage.includes('Lỗi hệ thống')) {
    moTa = 'Lỗi hệ thống';
    huongDanXuLy = 'Vui lòng liên hệ với bộ phận hỗ trợ để được trợ giúp';
  } else {
    moTa = inputMessage;
    huongDanXuLy = 'Vui lòng kiểm tra lại';
  }

  return { moTa, huongDanXuLy };
}
export function getEmailWithBCCAndCC(email: any, cc: any, bcc: any) {
  const list = [email];
  if (cc) {
    const listCC = cc.split(';') as any[];
    listCC.forEach((item: any) => {
      list.push('(CC)' + item);
    });
  }
  if (bcc) {
    const listBCC = bcc.split(';') as any[];
    listBCC.forEach((item: any) => {
      list.push('(BCC)' + item);
    });
  }

  return list.join(';');
}

export function getMainEmailFromDairy(value: any) {
  const list = value.split(';');
  const listMain = [];

  list.forEach((item: string) => {
    if (!(item.startsWith('(CC)') || item.startsWith('(BCC)'))) {
      listMain.push(item);
    }
  });

  return listMain.join(';');
}

export function kiemTraHoaDonHopLeTheoKyKeKhai(modalService: NzModalService, ngayHoaDonParam: string, thaoTac: string, ngayHienTaiParam: string, kyHieuHoaDon: string) {
  //thaoTac = luuDuLieu: kiểm tra lúc lưu; thaoTac = phatHanhHoaDon: phát hành hóa đơn

  //hàm này được dùng để kiểm tra lúc lưu và phát hành hóa đơn thay thế
  //hàm này kiểm tra ngày hóa đơn theo kỳ kê khai có hợp lệ so với ngày hiện tại ko
  //ví dụ: ngày của hóa đơn đang thuộc kỳ kê khai A;
  //...ngày cuối cùng của A là B, mà ngày hiện tại > B thì hóa đơn không hợp lệ
  //tương tự với kỳ kê khai theo quý

  var ngayHienTai = new Date(ngayHienTaiParam);
  let ngayHoaDon = new Date(ngayHoaDonParam);
  var thongBao = '';

  let kyKeKhaiThue = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
  console.log(kyKeKhaiThue)
  if (kyKeKhaiThue != null) {
    if (kyKeKhaiThue == 'Quy') {
      var ngayCuoiCungCuaQuy = new Date(moment(ngayHoaDon).endOf('quarter').format("YYYY-MM-DD"));
      var tenQuy = moment(ngayHoaDon).format("0Q/YYYY");

      if (ngayHienTai > ngayCuoiCungCuaQuy) {
        var thongBao = '';
        if (thaoTac == 'luuDuLieu') {
          thongBao = 'Bạn đang lựa chọn kỳ kê khai thuế GTGT là kê khai theo quý. Hóa đơn thay thế đang lập có ngày hóa đơn <b>' + moment(ngayHoaDon).format('DD/MM/YYYY') + '</b> thuộc kỳ kê khai thuế quý ' + tenQuy + ' và có ngày cuối cùng của kỳ kê khai thuế này là <b>' + moment(ngayHoaDon).endOf('quarter').format("DD/MM/YYYY") + '</b>. Thời điểm hiện tại đã qua ngày cuối cùng của kỳ kê khai thuế. Vui lòng kiểm tra lại!';
        }
        if (thaoTac == 'phatHanhHoaDon') {
          thongBao = 'Bạn đang lựa chọn kỳ kê khai thuế GTGT là kê khai theo quý. Hóa đơn thay thế đang thực hiện phát hành có ngày hóa đơn <b>' + moment(ngayHoaDon).format('DD/MM/YYYY') + '</b> thuộc kỳ kê khai thuế quý ' + tenQuy + ' và có ngày cuối cùng của kỳ kê khai thuế này là <b>' + moment(ngayHoaDon).endOf('quarter').format("DD/MM/YYYY") + '</b>. Thời điểm hiện tại đã qua ngày cuối cùng của kỳ kê khai thuế. Vui lòng kiểm tra lại!';
        }
      }
    }
    else if (kyKeKhaiThue == 'Thang') {
      var ngayCuoiCungCuaThangFull = new Date(ngayHoaDon.getFullYear(), ngayHoaDon.getMonth() + 1, 0);
      var ngayCuoiCungCuaThang = new Date(moment(ngayCuoiCungCuaThangFull).format('YYYY-MM-DD'));

      if (ngayHienTai > ngayCuoiCungCuaThang) {
        var thongBao = '';
        if (thaoTac == 'luuDuLieu') {
          thongBao = 'Bạn đang lựa chọn kỳ kê khai thuế GTGT là kê khai theo tháng. Hóa đơn thay thế đang lập có ngày hóa đơn <b>' + moment(ngayHoaDon).format('DD/MM/YYYY') + '</b> thuộc kỳ kê khai thuế tháng ' + moment(ngayHoaDon).format('MM/YYYY') + ' và có ngày cuối cùng của kỳ kê khai thuế này là <b>' + moment(ngayCuoiCungCuaThangFull).format('DD/MM/YYYY') + '</b>. Thời điểm hiện tại đã qua ngày cuối cùng của kỳ kê khai thuế. Vui lòng kiểm tra lại!';
        }
        if (thaoTac == 'phatHanhHoaDon') {
          thongBao = 'Bạn đang lựa chọn kỳ kê khai thuế GTGT là kê khai theo tháng.  Hóa đơn thay thế đang thực hiện phát hành có ngày hóa đơn <b>' + moment(ngayHoaDon).format('DD/MM/YYYY') + '</b> thuộc kỳ kê khai thuế tháng ' + moment(ngayHoaDon).format('MM/YYYY') + ' và có ngày cuối cùng của kỳ kê khai thuế này là <b>' + moment(ngayHoaDon).format('MM/YYYY') + '</b>. Thời điểm hiện tại đã qua ngày cuối cùng của kỳ kê khai thuế. Vui lòng kiểm tra lại!';
        }
      }
    }

    if (thongBao != '') {
      modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '500px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: thongBao,
        },
        nzFooter: null
      });

      return false;
    }
  }

  return true;
}

//hàm này hiển thị title theo từng loại áp dụng hóa đơn
export function getTitleTheoLoaiHoaDon(loaiHoaDon: any) {
  let ketQua = '';
  switch (loaiHoaDon) {
    case 1:
      ketQua = 'Hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP';
      break;
    case 2:
      ketQua = 'Hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC ngày 23 tháng 6 năm 2015 và Quyết định số 2660/QĐ-BTC ngày 14 tháng 12 năm 2016 của Bộ Tài chính (Hóa đơn có mã xác thực của CQT theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP)';
      break;
    case 3:
      ketQua = 'Các loại hóa đơn theo Nghị định số 51/2010/NĐ-CP và Nghị định số 04/2014/NĐ-CP (Trừ hóa đơn điện tử có mã xác thực của cơ quan thuế theo Quyết định số 1209/QĐ-BTC và Quyết định số 2660/QĐ-BTC)';
      break;
    case 4:
      ketQua = 'Hóa đơn đặt in theo Nghị định 123/2020/NĐ-CP';
      break;
    default:
      ketQua = '';
      break;
  }

  return ketQua;
}

export function showModalPreviewPDF(modalService: NzModalService, res, callback: () => any = null, customTitle = null) {
  const data = {
    name: res
  }

  const modal = modalService.create({
    nzTitle: customTitle || Message.IN_ESC,
    nzContent: ModalPreviewMutiplePdfComponent,
    nzMaskClosable: false,
    nzClosable: true,
    nzKeyboard: false,
    nzWidth: '100%',
    nzStyle: { top: '0px' },
    nzClassName: "videoHD",
    nzBodyStyle: { padding: '1px' },
    nzComponentParams: {
      data
    },
    nzFooter: null
  });
  modal.afterClose.subscribe(() => {
    if (callback) {
      callback();
    }
  });
}
export function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
export function isSelectChuKiCung(tuyChonServices: any) {
  return localStorage.getItem(CookieConstant.SETTING) ? JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IsSelectChuKiCung') ? JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'IsSelectChuKiCung').giaTri : 'KiCung' : 'KiCung';
}
export async function getcks(tuyChonService): Promise<string> {
  let rs = await tuyChonService.GetAllAsync();
  localStorage.setItem(CookieConstant.SETTING, JSON.stringify(rs));

  return rs.find(x => x.ma == "IsSelectChuKiCung") ? rs.find(x => x.ma == "IsSelectChuKiCung").giaTri : "KiCung";
}

/**
 * Hàm này sẽ kiểm tra chuỗi null, trim và convert chuỗi sang chữ viết hoa.
 */
export function toTrimAndToUpperCase(input: any) {
  if (input == null || input == undefined)
  {
    return '';
  }
  return input.toString().trim().toUpperCase();
}

