import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoSoHDDTService } from './../../../services/danh-muc/ho-so-hddt.service';
import { Component, OnInit } from '@angular/core';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { LichSuTruyenNhanComponent } from '../../hoa-don-dien-tu/modals/lich-su-truyen-nhan/lich-su-truyen-nhan.component';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { Subscription } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { DoiChieuThongTin103Component, DoiChieuThongTinInterface } from './modals/doi-chieu-thong-tin103/doi-chieu-thong-tin103.component';
import { XacNhanChuoiMaCqtComponent } from './modals/xac-nhan-chuoi-ma-cqt/xac-nhan-chuoi-ma-cqt.component';
import * as moment from 'moment';
import { DownloadFile } from 'src/app/shared/SharedFunction';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { LichSuSinhSoHoaDonCmtmttComponent } from './modals/lich-su-sinh-so-hoa-don-cmtmtt/lich-su-sinh-so-hoa-don-cmtmtt.component';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { CapNhatSoKetThucComponent } from './modals/cap-nhat-so-ket-thuc/cap-nhat-so-ket-thuc.component';
const TATCATHOIGIAN = -1;
@Component({
  selector: 'app-tab-thong-tin-hoa-don',
  templateUrl: './tab-thong-tin-hoa-don.component.html',
  styleUrls: ['./tab-thong-tin-hoa-don.component.scss']
})
export class TabThongTinHoaDonComponent implements OnInit {
  listHinhThucThanhToan = [];
  listLoaiHoaDon = [];
  widthConfig = ['50px', '400px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '140px' };
  scrollConfigLoaihd = { x: SumwidthConfig(this.widthConfig), y: '500px' };
  innerHeight = window.innerHeight;
  tab = 1;
  isOpenDetailMCQT = false;
  maCCQT = null;
  btnLayDuLieuDisabled = false;
  stringThongBaoOfMCQT = '';
  maThongDiepChuaMCQT: any;
  ActivedModal: any;
  xmlFileName: string;
  isAccept: boolean;
  dataReader: any;
  _xmlExtensions = ['.xml'];
  fileData: FormData;
  signing = false;
  spinning = false;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  tDiepGui: any;
  hoSoHDDT: any;
  listThongTinDoiChieu103Import: any[] = [];
  fileIdMCQT: string;
  isImportMaCQT: boolean;
  soBatDau: any;
  soKetThuc: any;
  btnSuaSoBatDauDisabled: boolean = false;
  isEditSoBatDau: boolean = false;
  curentYear = new Date().getFullYear();
  sinhSoCurrentYear: any;
  sinhSoAllTimes: any;
  soBatDauCu: number;
  permission: boolean;
  thaoTacs: any;
  soBatDauView: any;

  constructor(
    private modalService: NzModalService,
    private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private hoSoHDDTService: HoSoHDDTService,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
    private message: NzMessageService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private webSocket: WebSocketService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private env: EnvService,
    private thongDiepGuiNhanCQTsv: ThongDiepGuiNhanCQTService
  ) { }

  ngOnInit() {
    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      console.log(pq);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongTinHoaDon").thaoTacs;
    }
    this.innerHeight = innerHeight - 135;
    this.scrollConfigLoaihd.y = this.innerHeight - 125 + 'px';
    this.scrollConfig.y = '400px';
    this.getData();
    this.getInfo();

    this.GetHistorySinhSoHoaDonCMMTTien();

  }
  ngAfterViewInit() {

  }
  getData() {
    this.quanLyThongTinHoaDonService.GetListByLoaiThongTin()
      .subscribe((res: any[]) => {
        this.listHinhThucThanhToan = res.filter(x => x.loaiThongTin === 1);
        this.listLoaiHoaDon = res.filter(x => x.loaiThongTin === 2);
      });
  }
  changeNVHD(event: any) {
    let radioButton = document.getElementsByClassName("btn-nvhd");
    for (let i = 0; i < radioButton.length; ++i) {
      let el = radioButton[i] as HTMLElement;
      let nzvalue = radioButton[i].getAttribute('data-value');
      if (event == nzvalue) {
        el.classList.add('tabHoaDonActive');
        el.classList.remove('switchSelectHover');
      } else {
        el.classList.remove('tabHoaDonActive');
        el.classList.add('switchSelectHover');
      }
    }
    this.BlurSoBatDau(true);
  }

  importCQTFrom103() {

  }
  getInfo() {
    this.hoSoHDDTService.GetDetail()
      .subscribe((res: any) => {
        if (res) {
          this.maCCQT = res.maCuaCQTToKhaiChapNhan;
          this.stringThongBaoOfMCQT = res.thongBaoChiTietMaCuaCQT;
          this.maThongDiepChuaMCQT = res.maThongDiepChuaMCQT;
          this.hoSoHDDT = res;
          this.isImportMaCQT = res.isNhapKhauMaCQT;
          this.fileIdMCQT = res.fileId103Import;
        }
      });
  }

  ImportFile(event: any) {
    const files = event.target.files;

    if (files && files[0]) {
      this.isAccept = false;
      this.dataReader = null;
      if (!this.hasExtension(event.target.files[0].name, this._xmlExtensions)) {
        this.message.error('File không hợp lệ.');
        return;
      }
      if (!this.hasFileSize(event.target.files[0].size)) {
        this.message.error('Dung lượng file vượt quá 10MB.');
        return;
      }

      this.fileData = new FormData();
      this.xmlFileName = event.target.files[0].name;
      for (let i = 0; i < files.length; i++) {
        this.fileData.append('files', files[i]);
      }
      this.quyDinhKyThuatService.GetThongDiep103FromFile(this.fileData).subscribe((rs: any) => {
        if (rs) {
          if (rs.dltBao.mSo != '01/TB-ĐKĐT') {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzWidth: '450px',
              nzComponentParams: {
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msTitle: 'Kiểm tra lại',
                msContent: `File xml tải lên không phải Thông điệp 103 - Thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử. Vui lòng kiểm tra lại.`,
              },
              nzFooter: null
            });

            this.isAccept = !event;
            this.xmlFileName = null;
            return;
          }
          else {
            this.quyDinhKyThuatService.VerifyFile103(this.fileData).subscribe((rsVerify: boolean) => {
              if (!rsVerify) {
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzWidth: '450px',
                  nzComponentParams: {
                    msMessageType: MessageType.Warning,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msTitle: 'Kiểm tra lại',
                    msContent: `Cấu trúc file XML không còn nguyên vẹn (có thể file đã bị chỉnh sửa sau khi ký điện tử). Vui lòng kiểm tra lại.`,
                  },
                  nzFooter: null
                });

                this.xmlFileName = null;
                return;
              } else {
                this.dataReader = rs;
                let ketQuaKhongHoaMan = this.XuLyInPut(rs);
                if (ketQuaKhongHoaMan) {
                  const modal1 = this.modalService.create({
                    nzTitle: "Kết quả đối chiếu ",
                    nzContent: DoiChieuThongTin103Component,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: 1000,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '10px' },
                    nzComponentParams: {
                      data: this.listThongTinDoiChieu103Import
                      ,
                    },
                    nzFooter: null
                  });
                  modal1.afterClose.subscribe((rs: any) => {
                    this.listThongTinDoiChieu103Import = [];
                    this.fileData = new FormData();
                  });
                } else {
                  const modal1 = this.modalService.create({
                    nzContent: XacNhanChuoiMaCqtComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: 600,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '10px' },
                    nzComponentParams: {
                      dataReader: this.dataReader,
                      fileData: this.fileData,
                      msTitle: "Xác nhận chuỗi 05 ký tự do CQT cấp",
                    },
                    nzFooter: null
                  });
                  modal1.afterClose.subscribe((rs: any) => {
                    this.ngOnInit();
                  });
                }
              }
            });
          }
        } else {
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `File xml tải lên không phải Thông điệp 103 - Thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử. Vui lòng kiểm tra lại.`,
            },
            nzFooter: null
          });

          this.isAccept = !event;
          this.xmlFileName = null;
          return;
        }
      })
    }
  }


  displayLichSuTruyenNhan() {
    this.duLieuGuiHDDTService.GetThongDiepTraVeInTransLogs(this.maThongDiepChuaMCQT).subscribe((rs: any) => {
      if (rs != null) {
        if (this.ActivedModal != null) return;
        const modal1 = this.ActivedModal = this.modalService.create({
          nzTitle: "Lịch sử truyền nhận",
          nzContent: LichSuTruyenNhanComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: window.innerWidth / 100 * 96,
          nzStyle: { top: '10px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            data: [rs],
            maTD: this.maThongDiepChuaMCQT,
            showForm: false,
            loaiTD: 100,

          },
          nzFooter: null
        });
        modal1.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
        });
      }
    });
  }

  hasExtension(fileName, exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
  hasFileSize(fileSize) {
    if ((fileSize / 1024 / 1024) < 10240) { return true; }
    return false;
  }
  XuLyInPut(data) {
    if (data) {
      console.log("🚀 ~ file: doi-chieu-thong-tin103.component.ts ~ line 24 ~ DoiChieuThongTin103Component ~ ngOnInit ~ data", data)
      for (let index = 0; index < 4; index++) {
        let newItem = {
          Stt: index,
        } as DoiChieuThongTinInterface;
        switch (index) {
          /// Mẫu số
          case 0:
            newItem.ThongTin = "Mẫu số";
            newItem.ThongTinYeuCau = "01/TB-ĐKĐT";
            newItem.ThongTinDoiChieu = data.dltBao.mSo;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.ThongTinDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.KetQuaDoiChieu == "Trùng" ? true : false;
            break;
          /// Trạng thái xác nhận của cơ quan thuế
          case 1:
            newItem.ThongTin = "Trạng thái xác nhận cơ quan thuế";
            newItem.ThongTinYeuCau = "1";
            newItem.ThongTinDoiChieu = data.dltBao.ttxncqt;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.ThongTinDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.KetQuaDoiChieu == "Trùng" ? true : false;
            break;
          /// Mã số thuế
          case 2:
            newItem.ThongTin = "Mã số thuế";
            newItem.ThongTinYeuCau = this.hoSoHDDT.maSoThue;
            newItem.ThongTinDoiChieu = data.dltBao.mst;
            newItem.KetQuaDoiChieu = newItem.ThongTinYeuCau == newItem.ThongTinDoiChieu ? "Trùng" : "Không trùng";
            newItem.IsNotPassed = newItem.KetQuaDoiChieu == "Trùng" ? true : false;
            break;
          /// Mã của cơ quan thuế
          case 3:
            newItem.ThongTin = "Mã của cơ quan thuế";
            newItem.ThongTinYeuCau = "Không để trống và tối đa 5 ký tự";
            newItem.ThongTinDoiChieu = data.dltBao.mccqt;
            newItem.KetQuaDoiChieu = newItem.ThongTinDoiChieu != null ? ((newItem.ThongTinDoiChieu.length > 4 && newItem.ThongTinDoiChieu.length < 6) ? "Thỏa mãn" : "Không thỏa mãn") : "Không thỏa mãn";
            newItem.IsNotPassed = newItem.KetQuaDoiChieu == "Thỏa mãn" ? true : false;
            break;
          default:
            break;
        }

        this.listThongTinDoiChieu103Import.push(newItem);
        console.log("🚀 ~ file: doi-chieu-thong-tin103.component.ts ~ line 76 ~ DoiChieuThongTin103Component ~ ngOnInit ~ this.listOutPuts", this.listThongTinDoiChieu103Import)
      }
      return this.listThongTinDoiChieu103Import.some(x => x.IsNotPassed != true);
    }
  }
  dowLoadFileXML103Imported() {
    this.quyDinhKyThuatService.GetFile103Imported(this.fileIdMCQT).subscribe(
      (res: any) => {
        this.thongDiepGuiNhanCQTsv.DownloadFile(res.result).subscribe(blob => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = `Thong_Bao_Chap_Nhan_${moment().format("YYYY-MM-DDThh:mm:ss")}.xml`;
          a.click();
          URL.revokeObjectURL(objectUrl);
        });

      },
      err => {
        this.message.error("Lỗi xuất khẩu");
        return;
      }
    );
  }

  EditSoBatDau() {
    this.isEditSoBatDau = true;
    this.btnSuaSoBatDauDisabled = false;
    setTimeout(() => {
      let inPutSoBatDau = document.getElementById('inPutSoBatDau');
      console.log("🚀 ~ file: tab-thong-tin-hoa-don.component.ts:391 ~ TabThongTinHoaDonComponent ~ EditSoBatDau ~ inPutSoBatDau", inPutSoBatDau)
      if (inPutSoBatDau != null) {
  
        inPutSoBatDau.focus();
      }
    }, 100);
 
  }
  ChangeInputSoBatDau() {
    this.btnSuaSoBatDauDisabled = false;
  }

  FoCusSoBatDau() {
    console.log('zô fosucs')

     this.soBatDauView = this.soBatDau;
  }

  BlurSoBatDau(reset =  false) {
    if (this.soBatDauView) {
      this.soBatDauView = this.viewNumber11KyTu(this.soBatDauView);
    }
    if(reset) {
      this.btnSuaSoBatDauDisabled = false;
      this.isEditSoBatDau = false;
    }
  }

  ChangeValueSoBatDau(SoBatDauView: number) {
    this.soBatDau = SoBatDauView;
  }

  SaveSoBatDauToTbSinhSo() {
    this.quanLyThongTinHoaDonService.UpdateSoBatDauSinhSoHoaDonCMMTTien(this.soBatDau).subscribe(
      (res: any) => {
        if (res) {
          this.isEditSoBatDau = false;
          this.GetHistorySinhSoHoaDonCMMTTien(this.curentYear);
          this.message.success(TextGlobalConstants.UPDATE_SUCCESS_API);
        } else {
          this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        }

      },
      err => {
        return;
      }
    );
  }
  GetHistorySinhSoHoaDonCMMTTien(year: number = this.curentYear) {
    this.quanLyThongTinHoaDonService.GetHistorySinhSoHoaDonCMMTTien(year).subscribe(
      (res: any[]) => {
        console.log("🚀 ~ file: tab-thong-tin-hoa-don.component.ts ~ line 353 ~ TabThongTinHoaDonComponent ~ SaveSoBatDauToTbSinhSo ~ res", res)
        if (res) {
          this.sinhSoCurrentYear = res.find(x => x.namPhatHanh = this.curentYear);
          this.soBatDau = this.sinhSoCurrentYear.soBatDau;
          this.soBatDauView = this.viewNumber11KyTu(this.sinhSoCurrentYear.soBatDau);
          this.soBatDauCu = this.soBatDauView
          this.soKetThuc = this.viewNumber11KyTu(this.sinhSoCurrentYear.soKetThuc);
          this.btnSuaSoBatDauDisabled = this.soKetThuc > 0 ? true : false;
        }
      },
      err => {
        return;
      }
    );
  }
  ViewHistorySinhSoHoaDon() {
    const modal1 = this.modalService.create({
      nzTitle: "Xem nhật ký sinh chuỗi 11 số tăng liên tục tự sinh từ phần mềm bán hàng",
      nzContent: LichSuSinhSoHoaDonCmtmttComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 600,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {
      },
      nzFooter: null
    });
  }
  viewNumber11KyTu(input: number) {
    let stringInit = '00000000000';
    let numberOfZezo = stringInit.substring(0, (11 - input.toString().length))
    return numberOfZezo + input.toString();
  }
  UpdateSoKetThuc() {
    const modal1 = this.modalService.create({
      nzContent: CapNhatSoKetThucComponent,
      nzTitle: 'Cập nhật số lớn nhất đã tự sinh đến hiện tại',
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: 400,
      nzStyle: { top: '100px' },
      nzBodyStyle: { padding: '10px' },
      nzComponentParams: {

      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {
      this.ngOnInit();
    });
  }
}
