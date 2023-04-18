import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { LapBienBanXoaBoHoaDonModalComponent } from '../lap-bien-ban-xoa-bo-hoa-don/lap-bien-ban-xoa-bo-hoa-don.modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { HoaDonDienTuModalComponent } from '../hoa-don-dien-tu-modal/hoa-don-dien-tu-modal.component';
import { LyDoThayThe } from 'src/app/models/LyDoThayTheModel';
import { DownloadFile, GetFileUrl, getLoaiLoaiHoaByMoTa, getTenHoaDonByLoai, getTenLoaiHoaDon, mathRound, setStyleTooltipError, showModalPreviewPDF } from 'src/app/shared/SharedFunction';
import { formatNumber } from '@angular/common';
import { Message } from 'src/app/shared/Message';
import { ModalPreviewMutiplePdfComponent } from 'src/app/views/bao-cao/modals/modal-preview-mutiple-pdf/modal-preview-mutiple-pdf.component';
import { TaiLieuDinhKem } from 'src/app/models/UploadFileModel';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { NoWhitespaceValidator } from 'src/app/customValidators/no-whitespace-validator';
import { UtilityService } from 'src/app/services/utility.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { ThongBaoHoaDonSaiSotModalComponent } from 'src/app/views/quan-ly/modals/thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { GlobalConstants } from 'src/app/shared/global';
import { UserService } from 'src/app/services/user.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';
import { CookieConstant } from 'src/app/constants/constant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-xoa-bo-hoa-don-modal',
  templateUrl: './xoa-bo-hoa-don-modal.component.html',
  styleUrls: ['./xoa-bo-hoa-don-modal.component.scss']
})
export class XoaBoHoaDonModalComponent implements OnInit, AfterViewChecked {
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() isCheckViewFromBB: boolean;
  mainForm: FormGroup;
  bienBan: any;
  nguoiChuyenDois: any[] = [];
  selectedhinhThucXoabo: any;
  hinhThucXoabos = [
    { id: 1, name: "Hủy hóa đơn do sai sót", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
    { id: 2, name: "Xóa hóa đơn để lập hóa đơn thay thế", show: false, tooltipContent: "" },
    { id: 3, name: "Hủy hóa đơn theo lý do phát sinh", show: false, tooltipContent: "Trường hợp người bán lập hóa đơn khi thu tiền trước hoặc trong khi cung cấp dịch vụ theo quy định tại Khoản 2 Điều 9 Nghị định số 123/2020/NĐ-CP sau đó có phát sinh việc hủy hoặc chấm dứt việc cung cấp dịch vụ thì người bán thực hiện hủy hóa đơn điện tử đã lập và thông báo với cơ quan thuế về việc hủy hóa đơn theo Mẫu số 04/SS-HĐĐT tại Phụ lục IA ban hành kèm theo Nghị định số 123/2020/NĐ-CP (điểm b, khoản 1, điều 7 của Thông tư số 78/2021/TT-BTC)" },
    { id: 4, name: "Hủy hóa đơn để lập hóa đơn thay thế mới", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
    { id: 5, name: "Xóa hóa đơn để lập hóa đơn thay thế mới", show: false, tooltipContent: "Trường hợp hóa đơn điện tử đã lập có sai sót và người bán đã xử lý theo hình thức điều chỉnh hoặc thay thế theo quy định tại điểm b khoản 2 Điều 19 Nghị định số 123/2020/NĐ-CP, sau đó lại phát hiện hóa đơn tiếp tục có sai sót thì các lần xử lý tiếp theo người bán sẽ thực hiện theo hình thức đã áp dụng khi xử lý sai sót lần đầu (điểm c, khoản 1, điều 7 của Thông tư số 78/2021/TT-BTC)" },
    { id: 6, name: "Hủy hóa đơn để lập hóa đơn điều chỉnh mới", show: false, tooltipContent: "Trường hợp người bán phát hiện hóa đơn điện tử đã được cấp mã của cơ quan thuế chưa gửi cho người mua có sai sót thì người bán thực hiện thông báo với cơ quan thuế theo Mẫu số 04/SS-HĐĐT Phụ lục IA ban hành kèm theo Nghị định này về việc hủy hóa đơn điện tử có mã đã lập có sai sót và lập hóa đơn điện tử mới, ký số gửi cơ quan thuế để cấp mã hóa đơn mới thay thế hóa đơn đã lập để gửi cho người mua. Cơ quan thuế thực hiện hủy hóa đơn điện tử đã được cấp mã có sai sót lưu trên hệ thống của cơ quan thuế (khoản 2, điều 9 của Nghị định số 123/2020/NĐ-CP)" },
  ];
  soCTXoaBo = "";
  lyDoXoaBo = "";
  guiThongBaoXoaBoChoKhachHang: boolean = false;
  daGuiThongBaoXoaBoChoKhachHang: boolean = false;
  isboxEmailCcBcc: boolean = false;
  spinning = true;
  tooltipNotCreatSubstitute = "";
  isNotCreatSubstitute: boolean = false;
  isNotCreatSubstituteDisable: boolean = false;
  isNotCreatSubstituteShow: boolean = false;
  isAlertCustomShow: boolean = true;
  validExtentions = ['.doc', '.docx', '.xls', '.xlsx', '.xml', '.pdf'];
  fileSrc: any = null;
  listFileAttachs: any = [];
  listFile: TaiLieuDinhKem[] = [];
  listUploadedFile: TaiLieuDinhKem[] = [];
  formData: FormData;
  fbBtnSaveDisable: boolean = false;
  isGuiThongbao: boolean = false;
  isHinhThucXoabo: boolean = false;
  tichChonNhanBanThongTin: boolean = false;
  trangThaiShow: any;
  thaoTacHoaDonSaiSot: any[] = [];
  permission: boolean;
  mltd: any;
  boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail').giaTri;
  isPhieuXuatKho: boolean = false;
  txtHD_PXK_UPPER = "Hóa đơn";
  isPos = false;
  boolChoPhepLapHDDTMTT = false;
  isTaxCodeNotAddMtt: boolean = false;
  taxcodeLogin = localStorage.getItem(CookieConstant.TAXCODE);
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private modalService: NzModalService,
    private userService: UserService,
    private uploadFileService: UploadFileService,
    private utilityService: UtilityService,
    private tuyChonService: TuyChonService,
    private router: Router
  ) {
    this.getTuyChonGuiEmail();
  }

  getTuyChonGuiEmail() {
    this.tuyChonService.GetAll().subscribe((rs: any[]) => {
      this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail = rs.find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail') ? rs.find(x => x.ma === 'BoolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail').giaTri : "false";
      this.boolChoPhepLapHDDTMTT = rs.find(x => x.ma == "BoolChoPhepLapHDDTMTT") ? rs.find(x => x.ma == "BoolChoPhepLapHDDTMTT").giaTri == "true" : false;

    })
  }

  ngOnInit() {
    this.spinning = true;
    const _url = this.router.url;
    if (_url.includes('phieu-xuat-kho')) {
      this.isPhieuXuatKho = true;
      this.txtHD_PXK_UPPER = "PXK";
    }
    if (_url.includes('hoa-don-tu-mtt')) {
      this.isPos = true;
      this.isTaxCodeNotAddMtt = this.env.taxCodeNotAddMtt.includes(this.taxcodeLogin);
    }

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen != 'true') {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacHoaDonSaiSot = pq.functions.find(x => x.functionName == "ThongDiepGui") ? pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs : [];
    }
    else this.permission = true;
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.data.hoaDonDienTuId).subscribe((bb: any) => {
      if (bb) {
        this.lyDoXoaBo = bb.lyDoXoaBo;
        this.bienBan = bb;
      }
      else {
        this.lyDoXoaBo = '';
        this.bienBan = null;
      }
    });

    console.log(this.data);
    if (this.data != null) {
      if (this.data.hinhThucHoaDon == 2) {
        //check hình hóa đơn là MTT
        if (this.boolChoPhepXuLySaiSotMTTDuaTrenLichSuGuiEmail == "true") {
          //Nếu tùy chọn này = true thì sẽ lấy trạng thái gửi hóa đơn theo thực tế
          this.daGuiThongBaoXoaBoChoKhachHang = (this.data.isXacNhanDaGuiHDChoKhachHang != true && (this.data.trangThaiGuiHoaDon == 0 || this.data.trangThaiGuiHoaDon == 1 || this.data.trangThaiGuiHoaDon == 2)) ? false : true;
        } else {
          //nếu là hóa đơn gốc thì mặc định là đã gửi
          if (this.data.trangThai == 1) {
            this.daGuiThongBaoXoaBoChoKhachHang = true;
          } else {
            this.daGuiThongBaoXoaBoChoKhachHang = (this.data.isXacNhanDaGuiHDChoKhachHang != true && (this.data.trangThaiGuiHoaDon == 0 || this.data.trangThaiGuiHoaDon == 1 || this.data.trangThaiGuiHoaDon == 2)) ? false : true;
          }
        }
      } else {
        this.daGuiThongBaoXoaBoChoKhachHang = (this.data.isXacNhanDaGuiHDChoKhachHang != true && (this.data.trangThaiGuiHoaDon == 0 || this.data.trangThaiGuiHoaDon == 1 || this.data.trangThaiGuiHoaDon == 2)) ? false : true;
      }

      this.spinning = false;
      this.trangThaiShow = this.data.trangThai;
      if (this.data.trangThai == 1 || (this.data.backUpTrangThai == 1 && (this.data.isTBaoHuyKhongDuocChapNhan == true || !this.isAddNew))) {
        //hóa đơn gốc
        //check hình hóa đơn là MTT hay HD
        console.log("hóa đơn gốc");
        if (this.daGuiThongBaoXoaBoChoKhachHang == false) {
          //Chưa gửi cho khách hàng
          //Mặc định hiển thị: <Hủy hóa đơn để lập hóa đơn gốc mới>
          this.hinhThucXoabos.forEach((currentValue, index) => {
            if (currentValue.id == 1) {
              this.selectedhinhThucXoabo = currentValue.id;
              currentValue.show = true;
            }
          });
          this.isGuiThongbao = true;
        } else {
          //Đã gửi cho khách hàng
          //Nếu Có tồn tại hóa đơn thay cho HĐ này và trạng thái gửi hóa đơn khi xóa bỏ là <Đã gửi hóa đơn cho khách hàng> và  trạng thái hóa đơn là <Hóa đơn gốc> thì hình thức xóa bỏ chọn luôn là <Xóa hóa đơn để lập hóa đơn thay thế>. Đồng thời vô hiệu hóa
          this.hoaDonDienTuService.GetHoaDonByThayTheChoHoaDonId(this.data.hoaDonDienTuId).subscribe((res) => {
            if (res != null) {
              this.isHinhThucXoabo = true;
              this.hinhThucXoabos.forEach((currentValue, index) => {
                if (currentValue.id == 2) {
                  this.selectedhinhThucXoabo = currentValue.id;
                  currentValue.show = true;
                }
              });
            } else {
              this.hinhThucXoabos.forEach((currentValue, index) => {
                //nếu là hd MTT thì kiểm tra xem có quyền để lập hóa đơn k? nếu không có quyền lập thì chỉ để xóa bỏ do Hủy hd theo lý do phát sinh
                // và mst login có nằm trong DS không được lập hóa đơn
                if (this.isPos && (this.boolChoPhepLapHDDTMTT == false || this.isTaxCodeNotAddMtt == true)) {
                  if (currentValue.id == 3) {
                    this.selectedhinhThucXoabo = currentValue.id;
                    currentValue.show = true;
                  }
                } else {
                  if (currentValue.id == 2 || currentValue.id == 3) {
                    // this.selectedhinhThucXoabo = currentValue.id;
                    currentValue.show = true;
                  }
                }

              });
            }
          });
        }
      }
      if (this.data.trangThai == 3 || (this.data.backUpTrangThai == 3 && (this.data.isTBaoHuyKhongDuocChapNhan == true || !this.isAddNew))) {
        //hóa đơn thay thế
        if (this.data.trangThaiGuiHoaDon == 0 || this.data.trangThaiGuiHoaDon == 1 || this.data.trangThaiGuiHoaDon == 2) {
          //Chưa gửi cho khách hàng
          //Mặc định hiển thị: <Hủy hóa đơn để lập hóa đơn thay thế mới>
          console.log('Không có quyền truy cập');
          return;
        } else {
          //Đã gửi cho khách hàng
          //Nếu trạng thái gửi hóa đơn khi xóa bỏ là <Đã gửi hóa đơn cho khách hàng> và  trạng thái hóa đơn là <Hóa đơn thay thế> thì hình thức xóa bỏ chọn luôn là <Xóa hóa đơn để lập hóa đơn thay thế mới>. Đồng thời vô hiệu hóa để NSD không thay đổi được
          this.isHinhThucXoabo = true;
          this.hinhThucXoabos.forEach((currentValue, index) => {
            if (currentValue.id == 5) {
              this.selectedhinhThucXoabo = currentValue.id;
              currentValue.show = true;
            }
          });

        }
      }
      if (this.data.trangThai == 4) {
        //hóa đơn điều chỉnh
        console.log('Không có quyền truy cập');
        return;
      }

      if (this.isGuiThongbao == true) this.data.trangThaiBienBanXoaBo = -10;
      this.createForm();
      this.listFile = this.data.taiLieuDinhKems || [];
      this.listUploadedFile = this.data.taiLieuDinhKems || [];

      this.isAlertCustomShow = this.data.trangThaiBienBanXoaBo != -10;
    }

    this.isboxEmailCcBcc = false;
  }
  ToggleButton() {
    this.isboxEmailCcBcc = !this.isboxEmailCcBcc;
  }
  ngAfterViewChecked() {

  }
  chonHoaDon() {
    this.destroyModal();
  }

  reselect() {
    if (this.data.trangThai != 2) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: "35%",
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msTitle: 'Chọn lại hóa đơn xóa bỏ',
          msContent:
            "Bạn đang thực hiện xóa bỏ hóa đơn có ký hiệu <b class='cssyellow'>" + this.data.mauSo + this.data.kyHieu + "</b> số <b class='cssyellow'>" + this.data.soHoaDon + "</b> ngày <b class='cssyellow'>" + moment(this.data.ngayHoaDon).format("DD/MM/YYYY") + "</b>. Bạn có thực sự muốn dừng xóa hóa đơn này để chọn lại hóa đơn bị xóa bỏ không?",
          msOnClose: () => {
            return;
          },
          msOnOk: () => {
            this.chonHoaDon();
          }
        },
        nzFooter: null
      });
    } else {
      this.chonHoaDon();
    }
  }

  createForm() {
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: this.data != null ? this.data.mauSo + this.data.kyHieu : null, disabled: true }],
      tongTienThanhToanShow: [{ value: this.data != null ? formatNumber(Number(this.data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + this.data.loaiTien.ma : null, disabled: true }],
      mauSoShow: [{ value: this.data != null ? this.data.mauSo : null, disabled: true }],
      soHoaDonShow: [{ value: this.data != null ? this.data.soHoaDon : null, disabled: true }],
      ngayHoaDonShow: [{ value: this.data != null ? moment(this.data.ngayHoaDon).format("YYYY-MM-DD") : null, disabled: true }],
      tenKhachHangShow: [{ value: this.data != null ? (this.data.tenKhachHang || this.data.hoTenNguoiMuaHang) : null, disabled: true }],
      diaChi: [{ value: this.data != null ? this.data.diaChi : null, disabled: true }],
      ngayXoaBo: [{ value: this.data != null && this.data.ngayXoaBo != null && this.data.trangThai == 2 && this.data.isTBaoHuyKhongDuocChapNhan == false ? moment(this.data.ngayXoaBo).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), disabled: true }, [Validators.required]],
      soCTXoaBo: [{ value: this.data != null && this.data.soCTXoaBo != null ? this.data.soCTXoaBo : this.soCTXoaBo, disabled: true }],
      lyDoXoaBo: [{ value: this.data != null ? this.data.lyDoXoaBo : this.lyDoXoaBo, disabled: !this.isAddNew }, [Validators.required]],
      hoTenNguoiNhanHD: [{ value: this.data != null ? this.data.hoTenNguoiNhanHD : null, disabled: !this.isAddNew }, [Validators.required]],
      emailNguoiNhanHD: [{ value: this.data != null ? this.data.emailNguoiNhanHD : null, disabled: !this.isAddNew }, [Validators.required, Validators.email, NoWhitespaceValidator]],
      cC: [{ value: null, disabled: !this.isAddNew }, [Validators.email]],
      bCC: [{ value: null, disabled: !this.isAddNew }, [Validators.email]],
      soDienThoaiNguoiNhanHD: [{ value: this.data != null ? this.data.soDienThoaiNguoiNhanHD : null, disabled: !this.isAddNew }],
      taiLieuDinhKem: [null],
      hinhThucXoabo: [{ value: this.data != null && this.data.hinhThucXoabo != null ? this.data.hinhThucXoabo : null, disabled: !this.isAddNew }, [Validators.required]]

    });

    this.changeGuiThongBaoChoKH(false);

  }
  viewBienBan() {
    if (this.isCheckViewFromBB) {
      return;
    }
    if (this.isGuiThongbao == true) {
      return;
    }
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDon(this.data.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs != null) {
        const modal1 = this.modalService.create({
          nzTitle: "Biên bản hủy hóa đơn",
          nzContent: LapBienBanXoaBoHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: "100%",
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: this.data,
            formData: rs,
            isAddNew: false,
            isEdit: false,
            checkHideBtnXoa: true
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs) {
          }
        });
      }
      else {
        const modal1 = this.modalService.create({
          nzTitle: "Lập biên bản hủy hóa đơn",
          nzContent: LapBienBanXoaBoHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: "100%",
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: this.data,
            isAddNew: true,
            isEdit: true,
            checkHideBtnXoa: true
          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          if (rs) {
            this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
              this.data = res;
            })
          }
        });
      }
    });
  }

  view() {
    if (this.data != null) {
      const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((res: any) => {
        this.hoaDonDienTuService.ConvertHoaDonToFilePDF(res).subscribe((rs: any) => {
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.message.remove(id);
        }, (err) => {
          this.message.warning("Lỗi khi xem hóa đơn");
          this.message.remove(id);
        });
      }, (err) => {
        console.log(err);
        this.message.warning("Lỗi khi xem hóa đơn");
        this.message.remove(id);
      })
    }
  }

  changeGuiThongBaoChoKH(event: any) {
    if (event == true) {
      this.mainForm.get('hoTenNguoiNhanHD').enable();
      this.mainForm.get('emailNguoiNhanHD').enable();
      this.mainForm.get('cC').enable();
      this.mainForm.get('bCC').enable();
      // this.mainForm.get('soDienThoaiNguoiNhanHD').enable();//Đợi khi cung cấp dịch vụ SMS thì mới mở ra để sử dụng
    }
    else {
      this.mainForm.get('cC').disable();
      this.mainForm.get('bCC').disable();
      this.mainForm.get('hoTenNguoiNhanHD').disable();
      this.mainForm.get('emailNguoiNhanHD').disable();
      this.mainForm.get('soDienThoaiNguoiNhanHD').disable();
    }
  }
  uploadFile(event: any) {
    if (event && event.target.files.length > 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > (1024 * 1024 * 3)) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'Dung lượng file vượt quá 3MB. ',
              msOnClose: () => {
              },
            }
          });
          return;
        }
        if (!this.utilityService.checkExtension(event.target.files[i].name, this.validExtentions)) {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: `Kiểm tra lại`,
              msContent: 'File không hợp lệ. ',
              msOnClose: () => {
              },
            }
          });

          return;
        }

        const file = event.target.files[i];
        var li = GetFileUrl(file);
        this.listFile.push({ tenGoc: file.name, file: file, link: li });
      }
    }
  }
  async onFileInputSave(event: any) {
    const files = event.target.files;
    if (files && files[0]) {
      this.uploadFile(event);
      //file đính kèm
      this.callUploadApi(this.data.hoaDonDienTuId);
      this.message.success("Thêm file thành công.");
    }
  }
  callUploadApi(id: any) {
    var files = this.listFile.filter(x => x.file).map(x => x.file);
    var removedFiles = this.listUploadedFile.filter(x => !this.listFile.map(y => y.taiLieuDinhKemId).includes(x.taiLieuDinhKemId));

    this.formData = new FormData();
    files.forEach((file: any) => {
      this.formData.append('Files', file);
    });

    const param: TaiLieuDinhKem = {
      nghiepVuId: id,
      loaiNghiepVu: RefType.HoaDonXoaBo,
      files: this.formData,
      removedFileIds: removedFiles.map(x => x.taiLieuDinhKemId)
    };

    this.uploadFileService.InsertFileAttaches(param, this.formData)
      .subscribe((res: any) => {
      });
  }

  downloadFile(item: TaiLieuDinhKem) {
    DownloadFile(item.link, item.tenGoc);
  }

  deleteFile(item: TaiLieuDinhKem) {
    if (item.taiLieuDinhKemId == undefined) {
      this.listFile = this.listFile.filter(x => x !== item);
    } else {
      //xóa file trên server
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msTitle: `Xóa tài liệu đính kèm`,
          msContent: 'Bạn có muốn xóa tài liệu đính kèm này không?',
          msOnClose: () => {
            return;
          },
          msOnOk: () => {
            this.listFile = this.listFile.filter(x => x !== item);

            this.uploadFileService.DeleteFileAttach({
              nghiepVuId: this.data.hoaDonDienTuId,
              loaiNghiepVu: RefType.HoaDonXoaBo,
              tenGoc: item.tenGoc,
              tenGuid: item.tenGuid,
              taiLieuDinhKemId: item.taiLieuDinhKemId
            }).subscribe();
          },
        }
      });
    }
  }

  submitForm() {
    if (this.mainForm.invalid) {
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
      }
      setStyleTooltipError(true);
      return;
    }

    this.save(1);
  }

  deleting = false;
  save(optional: number = 1) {
    const _data = this.mainForm.getRawValue();
    let ngayXoaBo = new Date;
    this.deleting = true;
    if (moment(ngayXoaBo) < moment(this.data.ngayHoaDon)) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Cảnh báo',
          msContent: "Ngày xóa bỏ không nhỏ hơn ngày bị xóa bỏ",
          msOnClose: () => {
            this.deleting = false;
            this.modal.destroy(false);
          },
        }
      });
      return;
    }

    if (this.bienBan != null && moment(ngayXoaBo) < moment(this.bienBan.ngayBienBan)) {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Cảnh báo',
          msContent: `Hóa đơn bị xóa bỏ này đã được lập biên bản hủy hóa đơn ngày <b>${moment(this.bienBan.ngayLap).format("DD/MM/YYYY")}</b>. Ngày xóa bỏ phải lớn hơn hoặc bằng ngày lập biên bản hủy hóa đơn.`,
          msOnClose: () => {
            this.deleting = false;
            this.modal.destroy(false);
          },
        }
      });
      return;
    }

    if (this.isGuiThongbao == true) _data.trangThaiBienBanXoaBo = -10;
    _data.hoaDonDienTuId = this.data.hoaDonDienTuId;
    _data.ngayXoaBo = ngayXoaBo;
    _data.isNotCreateThayThe = null;
    _data.soCTXoaBo = 'XHD-' + this.data.mauSo + this.data.kyHieu + '-' + this.data.soHoaDon + '-' + moment().format("DD/MM/YYYY HH:mm:ss");
    _data.hinhThucXoabo = this.selectedhinhThucXoabo;
    _data.actionUser = JSON.parse(localStorage.getItem('currentUser'));
    if (_data.trangThai != 2)
      _data.backUpTrangThai = this.data.trangThai;
    else _data.backUpTrangThai = this.data.backUpTrangThai;

    const _params = {
      hoaDon: _data,
      optionalSend: optional
    };
    // let contentConfirm = "Sau khi xóa bỏ hóa đơn &lt;ký hiệu " + this.data.mauSo + this.data.kyHieu + ", số hóa đơn " + this.data.soHoaDon + ", ngày hóa đơn " + moment(this.data.ngayHoaDon).format("DD/MM/YYYY") + "&gt thì hóa đơn này sẽ không còn giá trị sử dụng, bạn không thể khôi phục được trạng thái ban đầu của hóa đơn. Bạn có thực sự muốn xóa hóa đơn này không?";
    console.log(_params);
    this.modalService.create({
      nzContent: MessageBoxModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        msMessageType: MessageType.Confirm,
        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
        msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
        msTitle: 'Xóa bỏ hóa đơn',
        msContent:
          "Sau khi xóa bỏ hóa đơn có ký hiệu <b class='cssyellow'>" + this.data.mauSo + this.data.kyHieu + "</b> số <b class='cssyellow'>" + this.data.soHoaDon + "</b> ngày <b class='cssyellow'>" + moment(this.data.ngayHoaDon).format("DD/MM/YYYY") + "</b> thì hóa đơn này sẽ không còn giá trị sử dụng, bạn không thể khôi phục được trạng thái ban đầu của hóa đơn. Bạn có thực sự muốn xóa hóa đơn này không?",
        msOnClose: () => {
          this.deleting = false;
          this.modal.destroy(false);
        },
        msOnOk: () => {
          this.spinning = true;
          this.hoaDonDienTuService.XoaBoHoaDon(_params).subscribe((rs: any) => {
            this.spinning = false;
            if (rs) {
              let idXoaBo = rs.result;
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.XoaBoHoaDon,
                doiTuongThaoTac: 'empty',
                refType: RefType.HoaDonDienTu,
                thamChieu: null,
                moTaChiTiet: `Mẫu số: <${this.data.mauSo}>; ký hiệu: <${this.data.kyHieu}>; số: <${this.data.soHoaDon || '<Chưa cấp số>'}>`,
                refId: this.data.hoaDonDienTuId,
              }).subscribe();
              //file đính kèm

              this.callUploadApi(this.data.hoaDonDienTuId);
              if (this.guiThongBaoXoaBoChoKhachHang == true) {
                this.send();
              }
              if (this.selectedhinhThucXoabo == 2 || this.selectedhinhThucXoabo == 4 || this.selectedhinhThucXoabo == 5) {
                this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
                  // let configCLose = this.modalService.create({
                  //   nzContent: MessageBoxModalComponent,
                  //   nzMaskClosable: false,
                  //   nzClosable: false,
                  //   nzKeyboard: false,
                  //   nzStyle: { top: '100px' },
                  //   nzBodyStyle: { padding: '1px' },
                  //   nzWidth: '450px',
                  //   nzComponentParams: {
                  //     msMessageType: MessageType.Info,
                  //     msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  //     msTitle: 'Xóa bỏ hóa đơn',
                  //     msContent: `Đã hoàn thành việc xóa bỏ hóa đơn`,
                  //   },
                  //   nzFooter: null
                  // });
                  // configCLose.afterClose.subscribe((rs: any) => {
                    this.message.success("Xóa bỏ hóa đơn thành công.");
                    this.spinning = false;
                    // this.modal.destroy(true);
                  // });
                });
              } else {
                if (this.selectedhinhThucXoabo == 1 || this.selectedhinhThucXoabo == 3) {
                  this.message.success("Xóa bỏ hóa đơn thành công.");

                  //Hiển thị box Lập thông báo hóa đơn điện tử có sai sót gửi CQT
                  this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
                    if (rs.boKyHieuHoaDon.phuongThucChuyenDL != 1) {
                      let modalAlert04 = this.modalService.create({
                        nzContent: MessageBoxModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzStyle: { top: '100px' },
                        nzBodyStyle: { padding: '1px' },
                        nzComponentParams: {
                          msHasThongBaoSaiSot: true,
                          msButtonLabelThongBaoSaiSot: 'Lập và gửi thông báo hóa đơn điện tử có sai sót tại đây',
                          msMessageType: MessageType.Info,
                          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                          msTitle: 'Lập thông báo hóa đơn điện tử có sai sót gửi CQT',
                          msContent:
                            "Hóa đơn có ký hiệu <b class='csslightBlue'>" + rs.mauSo + rs.kyHieu + "</b> số <b class='csslightBlue'>" + rs.soHoaDon + "</b> ngày <b class='csslightBlue'>" + moment(rs.ngayHoaDon).format("DD/MM/YYYY") + "</b> có sai sót <b>Hủy</b> hóa đơn. Bạn cần lập và gửi <b>Thông báo hóa đơn điện tử có sai sót (Mẫu số 04/SS-HĐĐT)</b> để gửi CQT.",
                          msOnClose: () => {
                            this.modal.destroy(true);
                          },
                          msOnLapThongBaoSaiSot: () => {
                            this.modal.destroy(true);
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
                              let modal04 = this.modalService.create({
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
                                  lapTuHoaDonDienTuId: idXoaBo,
                                  isTraVeThongDiepChung: true
                                },
                                nzFooter: null
                              });
                              modal04.afterClose.subscribe((rs: any) => {
                                // this.message.success("Xóa bỏ hóa đơn thành công.");
                                this.modal.destroy(true);
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
                      modalAlert04.afterClose.subscribe((rs: any) => {
                        this.deleting = false;
                        this.modal.destroy(true);
                      });
                    }
                    else {
                      this.deleting = false;
                      this.modal.destroy(true);
                    }
                  });

                } else {
                  this.deleting = false;
                  this.message.success("Xóa bỏ hóa đơn thành công.");
                  this.modal.destroy(true);
                }

              }
            }
            else {
              this.deleting = false;
              this.message.success("Có lỗi xảy ra");
              this.modal.destroy(false);
            }
          });
        }
      },
      nzFooter: null
    });

  }
  send() {
    console.log('Vào sendmail');
    this.hoaDonDienTuService.GetById(this.data.hoaDonDienTuId).subscribe((rs: any) => {
      if (rs) {
        console.log(rs);
        const rawValue = this.mainForm.getRawValue();
        let refType = RefType.HoaDonXoaBo;
        const params = {
          hoaDon: rs,
          tenNguoiNhan: rawValue.hoTenNguoiNhanHD,
          toMail: rawValue.emailNguoiNhanHD,
          cC: rawValue.cC,
          bCC: rawValue.bCC,
          soDienThoaiNguoiNhan: rawValue.soDienThoaiNguoiNhanHD,
          loaiEmail: !this.isPhieuXuatKho ? LoaiEmail.ThongBaoXoaBoHoaDon : LoaiEmail.ThongBaoXoaBoPXK,
          link: this.env.apiUrl
        }

        console.log(params);
        this.hoaDonDienTuService.SendEmailAsync(params).subscribe(result => {
          if (result) {
            this.nhatKyTruyCapService.Insert({
              loaiHanhDong: LoaiHanhDong.GuiHoaDonChoKhachHang,
              doiTuongThaoTac: 'Tên loại hóa đơn: ' + getTenLoaiHoaDon(rs.loaiHoaDon),
              refType: refType,
              thamChieu: null,
              moTaChiTiet: `Mẫu số: <${rs.mauSo}>; ký hiệu: <${rs.kyHieu}>; số: <${rs.soHoaDon || '<Chưa cấp số>'}>; ngày: <${moment(rs.ngayHoaDon).format('DD/MM/YYYY')}>; Tên người nhận: <${rawValue.hoTenNguoiNhanHD}>; Email người nhận: <${rawValue.emailNguoiNhanHD}>;`,
              refId: rs.hoaDonDienTuId
            }).subscribe();
            console.log('sendmail success');
            this.message.success("Gửi email thành công.");

            this.spinning = false;
            // this.modal.destroy(true);
          }
          else {
            console.log('sendmail error');
            this.spinning = false;
            // this.modal.destroy(true);
          }
        });
      }
    });
  }

  addHDTT(type: number, lyDoThayThe: LyDoThayThe) {
    const modal = this.modalService.create({
      nzTitle: getTenHoaDonByLoai(type),
      nzContent: HoaDonDienTuModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 90,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        isAddNew: true,
        loaiHD: type,
        fbEnableEdit: true,
        lyDoThayThe,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe((rs: any) => {
      this.modal.destroy(true);
      if (rs) {
      }
    });
  }

  destroyModal() {
    if (this.deleting) this.deleting = false;
    this.modal.destroy();
  }
}
