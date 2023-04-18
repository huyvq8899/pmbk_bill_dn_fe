import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung, setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin, Subscription } from 'rxjs';
import { SumwidthConfig } from 'src/app/shared/global';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { BangTongHopDuLieuService } from 'src/app/services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { ChonHoaDonBangTongHopModalComponent } from '../chon-hoa-don-bang-tong-hop-modal/chon-hoa-don-bang-tong-hop-modal.component';
import { ChonHoaDonBangTongHopNgoaiHeThongModalComponent } from '../chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal/chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal.component';
import { NhatKyTruyCapService } from 'src/app/services/tien-ich/nhat-ky-truy-cap.service';
import { LoaiHanhDong, RefType } from 'src/app/models/nhat-ky-truy-cap';
import { Message } from 'src/app/shared/Message';
import { EnvService } from 'src/app/env.service';
import { GUID } from 'src/app/shared/Guid';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-add-edit-bang-tong-hop-du-lieu-modal',
  templateUrl: './add-edit-bang-tong-hop-du-lieu-hoa-don-modal.component.html',
  styleUrls: ['./add-edit-bang-tong-hop-du-lieu-hoa-don-modal.component.scss']
})
export class AddEditBangTongHopDuLieuModalComponent implements OnInit {
  @Input() dataTTC: any;
  @Input() data: any;
  @Input() isAddNew: boolean;
  @Input() isCopy: boolean;
  @Input() fbEnableEdit: boolean;
  @Input() autoSign: boolean;
  isSigned = false;
  ActivedModal: any=null;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  fbBtnPlusDisable: boolean;
  fbBtnEditDisable: boolean;
  fbBtnDeleteDisable: boolean;
  fbBtnPrinterDisable: boolean;
  fbBtnESignDisable: boolean;
  fbBtnBackwardDisable: boolean;
  fbBtnForwardDisable: boolean;
  fbBtnSaveDisable: boolean;
  fbBtnFirst: boolean;
  fbBtnLast: boolean;
  tienLuiModel: any;
  mainForm: FormGroup;
  spinning = false;
  sending = false;
  coQuanThueQuanLys: any[]=[];
  coQuanThueCapCucs: any[]=[];
  diaDanhs: any[]=[];
  hoSoHDDT: any;
  nghiDinh = "Theo Nghị định số 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 của Chính phủ, chúng tôi/tôi thuộc đối tượng sử dụng hóa đơn điện tử. Chúng tôi/tôi đăng ký/thay đổi thông tin đã đăng ký với cơ quan thuế về việc sử dụng hóa đơn điện tử như sau:";
  hinhThucDangKys = [
    { id: 1, name: "Thêm mới" },
    { id: 2, name: "Gia hạn" },
    { id: 3, name: "Ngừng sử dụng" },
  ];
  pThucThanhToans = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tiền mặt/Chuyển khoản" },
    { id: 4, name: "Đối trừ công nợ" },
    { id: 5, name: "Không thu tiền" },
    { id: 6, name: "Khác" },
  ]
  webSubcription: Subscription;
  widthConfig = ['50px', '150px', '120px', '130px', '200px', '150px', '200px', '100px', '150px', '150px', '150px', '150px', '150px', '450px', '190px', '190px', '200px'];
  scrollConfig = {x: SumwidthConfig(this.widthConfig), y: '280px'}

  widthConfigBS = ['50px', '50px', '150px', '120px', '130px', '200px', '150px', '200px', '100px', '150px', '150px', '150px', '150px', '150px', '450px', '190px', '190px', '200px'];
  scrollConfigBS = {x: SumwidthConfig(this.widthConfig), y: '560px'}


  title = "01/TH-HĐĐT - Bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế";
  loaiHHs = [
    {value: 1, name: "Xăng dầu"},
    {value: 2, name: "Vận tải hàng không"},
    {value: 9, name: "Khác"},
  ];

  thangs=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  quys=[1,2,3,4];
  nams=[];

  thang: number = moment().month();
  quy: number = moment().quarter();
  nam: number = moment().year();

  mCQTQLy: any;
  total: number = 0;

  listData: any[]=[];

  selectedIndex = 0;
  kyOption = localStorage.getItem(CookieConstant.KYKEKHAITHUE);

  loaiLD: number;
  form: any;
  tuNgay: string;
  denNgay: string;
  isSaved: boolean = false;
  pPTThue: any;
  isIndeterminate: boolean;
  isAllDisplayDataChecked: boolean;
  isDirty = false;
  isSelectKyCung = 'KiCung';

  trangThais = [
    {id: 0, value: "Mới"},
    {id: 1, value: "Hủy"},
    {id: 2, value: "Điều chỉnh"},
    {id: 3, value: "Thay thế"},
    {id: 4, value: "Giải trình"},
    {id: 5, value: "Sai sót do tổng hợp"},
  ]
  permission: boolean;
  thaoTacs: any[]=[];
  loading = false;
  chuoiDiaDanh = '';
  hoaDonTrongHeThongs: any[] = [];
  hoaDonNgoaiHeThongs: any[] = [];
  totalTrongHeThong = 0;
  totalNgoaiHeThong = 0;
  signing = false;
  thongDiepChung: { phienBan: string; maNoiGui: string; maNoiNhan: string; maLoaiThongDiep: string; maThongDiep: string; maThongDiepThamChieu: any; maSoThue: any; soLuong: any; };
  tdc: any;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  serials: any[]=[];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private message: NzMessageService,
    private bangTongHopDuLieuService: BangTongHopDuLieuService,
    private nhatKyTruyCapService: NhatKyTruyCapService,
    private hoSoHDDTService: HoSoHDDTService,
    private env: EnvService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private webSocket: WebSocketService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService
  ) {
    this.createSocket();
  }
  ngOnInit() {
    this.isSelectKyCung = isSelectChuKiCung(this.tuyChonService);

    var phanQuyen = localStorage.getItem('KTBKUserPermission');
    if (phanQuyen == 'true') {
      this.permission = true;
    }
    else {
      var pq = JSON.parse(phanQuyen);
      this.thaoTacs = pq.functions.find(x => x.functionName == "ThongDiepGui").thaoTacs;
    }

    this.isSigned = (this.data && this.data.thoiGianGui != null);
    console.log(this.isSigned);

    this.createForm();
    // this.disableOrEnableHeaderButtons();
  }

  closeModal(){
    this.modal.destroy();
  }

  // disableOrEnableHeaderButtons() {
  //   if (this.fbEnableEdit === false) {
  //     this.disableControls(true);
  //   } else {
  //     this.disableControls(false);
  //   }
  // }

  // disableControls(disabled = true) {
  //   if (disabled) {
  //     this.mainForm.disable();
  //   } else {
  //     this.mainForm.enable();
  //   }
  // }


  forkJoin(){
    return forkJoin([
      this.hoSoHDDTService.GetListCoQuanThueQuanLy(),
      this.hoSoHDDTService.GetListCoQuanThueCapCuc(),
      this.hoSoHDDTService.GetListCity(),
      this.hoSoHDDTService.GetDetail(),
      this.quyDinhKyThuatService.GetAllListCTS()
    ])
  }

  createForm() {
    this.spinning = true;
    if(this.dataTTC){
      const kyDuLieuSelected = this.dataTTC.loaiKyDuLieu == 'N' ? `Ngày ${moment(this.dataTTC.ngayDuLieu).format("DD/MM/YYYY")}` :
                              this.dataTTC.loaiKyDuLieu == 'T' ? (this.dataTTC.thangDuLieu < 10 ? `Tháng 0${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}` : `Tháng ${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}`) :
                              `Quý 0${this.dataTTC.quyDuLieu}/${this.dataTTC.namDuLieu}`
      this.dataTTC.kyDuLieu = this.dataTTC.loaiKyDuLieu == 'N' ? `${moment(this.dataTTC.ngayDuLieu).format("DD/MM/YYYY")}` :
                              this.dataTTC.loaiKyDuLieu == 'T' ? (this.dataTTC.thangDuLieu < 10 ? `0${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}` : `${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}`) :
                              `0${this.dataTTC.quyDuLieu}/${this.dataTTC.namDuLieu}`;
      this.dataTTC.kyDuLieuDisplay = kyDuLieuSelected;
      this.dataTTC.lanDauDisplay = (this.dataTTC.lanDau == 1) ? true : false;
      this.dataTTC.boSungLanThuDisplay = this.dataTTC.lanDau == 2 ? this.dataTTC.boSungLanThu : '';
      this.dataTTC.suaDoiLanThuDisplay = this.dataTTC.lanDau == 3 ? this.dataTTC.boSungLanThu : '';
    }
    else{
      console.log(this.data);
      this.dataTTC = {
        soBTHDLieu: this.data.soBTHDLieu,
        lanDau: this.data.lanDau == true && !this.data.boSungLanThu ? 1 : (this.data.lanDau == false ? 2 : 3),
        boSungLanThu: this.data.boSungLanThu,
        lanDauDisplay: this.data.lanDau == true && !this.data.boSungLanThu,
        boSungLanThuDisplay: this.data.lanDau == false ? this.data.boSungLanThu : '',
        suaDoiLanThuDisplay: this.data.lanDau == true && this.data.boSungLanThu ? this.data.boSungLanThu : '',
        lHHoa: this.data.lhHoa,
        tenLoaiHHoa: this.loaiHHs.find(x=>x.value == this.data.lhHoa).name,
        loaiKyDuLieu: this.data.loaiKyDuLieu,
        kyDuLieu: this.data.kyDuLieu,
        thangDuLieu: this.data.thangDuLieu,
        ngayDuLieu: this.data.ngayDuLieu,
        quyDuLieu: this.data.quyDuLieu,
        namDuLieu: this.data.namDuLieu,
        thoiHanGui: this.data.thoiHanGui,
        tenNNT: this.data.tenNNT,
        maSoThue: this.data.maSoThue,
        ngayLap: moment(this.data.ngayLap).format('YYYY-MM-DD'),
        nnt: this.data.nnt
      }
    }

    this.forkJoin().subscribe((res: any[])=>{
      this.coQuanThueQuanLys = res[0];
      this.coQuanThueCapCucs = res[1];
      this.diaDanhs = res[2];
      this.hoSoHDDT = res[3];
      this.serials = res[4];

      if(this.dataTTC.loaiKyDuLieu == 'N'){
        this.tuNgay = this.dataTTC.ngayDuLieu;
        this.denNgay = this.dataTTC.ngayDuLieu;
      }
      else{
        this.tuNgay = this.dataTTC.tuNgay;
        this.denNgay = this.dataTTC.denNgay;
      }

      this.chuoiDiaDanh = this.getChuoiDiaDanhNgayThang();
      if(this.isAddNew || this.isCopy){
        this.loadData();
        this.spinning = false;
      }
      else{
        if(this.dataTTC.lanDau == 1){
          this.listData = this.data.chiTiets;
        }
        else {
          this.hoaDonNgoaiHeThongs = this.data.chiTiets.filter(x=>x.isSystem == false);
          this.hoaDonTrongHeThongs = this.data.chiTiets.filter(x=>x.isSystem == true);
        }
        this.total = this.listData.length;
        if(this.autoSign == true) this.eSign();
        else this.spinning = false;
      }
    })
  }

  loadData(){
    this.loading = true;
    const paramsGetData = {
      tuNgay: this.tuNgay,
      denNgay: this.denNgay,
      loaiHangHoa: this.dataTTC.loaiHHoa,
    };

    this.bangTongHopDuLieuService.GetDuLieuBangTongHopGuiDenCQT(paramsGetData).subscribe((res: any[])=>{
      this.listData = res;
      this.listData.forEach(x=>{
        x.trangThais = x.trangThaiHoaDon == 1 ? this.trangThais.filter(x=>x.id != 2 && x.id != 3) : x.trangThaiHoaDon == 2 ? this.trangThais.filter(x=>x.id != 0 && x.id != 3) : x.trangThaiHoaDon == 3 ? this.trangThais.filter(x=>x.id != 0 && x.id != 2) : this.trangThais;
      })
      this.total = res.length;
      this.loading = false;
    });
  }

  loadForm(data: any){
    if(!data.chiTiets || data.chiTiets.length == 0){
      this.bangTongHopDuLieuService.GetById(data.id).subscribe((rs: any)=>{
        this.data = rs;
        this.ngOnInit();
      })
    }
  }

  changeSoBTH(event: any){
    this.isDirty = true;
  }

  eSign(){
    // this.isSelectKyCung = this.webSocket.isSelectKiCung();

    this.spinning = true;
    this.thongDiepChung = {
      phienBan: "2.0.0",
      maNoiGui: `${this.env.taxCodeTCGP}`,
      maNoiNhan: `${this.env.taxCodeTCTN}`,
      maLoaiThongDiep: "400",
      maThongDiep: `${this.env.taxCodeTCGP.replace('-', '')}${new GUID().toString().replace('-', '').toUpperCase()}`,
      maThongDiepThamChieu: null,
      maSoThue: this.hoSoHDDT.maSoThue,
      soLuong: 1
    }


    var thongDiep = {
      maLoaiThongDiep: 400,
      maThongDiepThamChieu: moment().format("YYYY/MM/DD HH:MM:SS"),
      thongDiepGuiDi: true,
      soLuong: 1,
      trangThaiGui: -1
    }

    this.bangTongHopDuLieuService.GetById(this.data.id).subscribe((rs: any)=>{
      console.log(rs);
      this.quyDinhKyThuatService.InsertThongDiepChung(thongDiep).subscribe((td: any)=>{
        this.tdc = td;
        const params = {
          ttChung1: this.thongDiepChung,
          duLieu: [rs],
          thongDiepChungId: td.thongDiepChungId
        }
        console.log(params);
        this.bangTongHopDuLieuService.CreateXMLBangTongHopDuLieu(params).subscribe(async (rs: any) => {
          if(this.isSelectKyCung == "KiCung")
            this.sendMessageToServer(rs.result);
          else{
            const msg = this.createXMLToSign(rs.result);
            (await this.webSocket.createObservableSocket("", msg)).subscribe(async (rs: any)=>{
              await this.XuLyThongDiep400(rs);
            })
          }
        })
      })
    })
  }

  sendMessageToServer(xmlData: string) {
    if (xmlData != "") {
      console.log(xmlData);
      const msg = this.createXMLToSign(xmlData);

      // Sending
      this.webSocket.sendMessage(JSON.stringify(msg));
    }
  }

  createXMLToSign(xmlData: string){
    const msg = {
      mLTDiep: MLTDiep.TDCBTHDLHDDDTDCQThue,
      dataXML: xmlData,
      mst: this.hoSoHDDT.maSoThue,
      serials: this.serials,
      isCompression: true,
      tTNKy: {
        mst: this.hoSoHDDT.maSoThue == null ? '' : this.hoSoHDDT.maSoThue,
        ten: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        diaChi: this.hoSoHDDT.diaChi == null ? '' : this.hoSoHDDT.diaChi,
        sDThoai: this.hoSoHDDT.soDienThoaiLienHe == null ? '' : this.hoSoHDDT.soDienThoaiLienHe,
        tenP1: this.hoSoHDDT.tenDonVi == null ? '' : this.hoSoHDDT.tenDonVi,
        tenP2: '',
      }
    };

    return msg;
  }

  async createSocket() {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe(async (rs: string) => {
      await this.XuLyThongDiep400(rs);
    },err => {
      if(this.signing == true){
        this.modalService.create({
          nzTitle: "<strong>Hãy cài đặt công cụ ký số</strong>",
          nzContent: "Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại." +
          "<br>Để ký điện tử lên hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.",
          nzOkType: "primary",
          nzOkText: "Tải bộ cài",
          nzOnOk: ()=>{
            const link = document.createElement('a');
            link.href = `${this.env.apiUrl}/${this.urlTools}`;
            link.download = 'BKSOFT-KYSO-SETUP.zip';
            link.click();
          },
          nzCancelText: "Đóng",
          nzOnCancel: ()=>{
            this.modal.destroy(false);
          }
        });
      }
    });
  }

  async XuLyThongDiep400(rs: any){
    let obj = rs;
    if(this.isSelectKyCung == 'KiCung')
      obj = JSON.parse(rs);

    console.log(obj);
    if (obj.TypeOfError === 0) {
      var params = {
        id: this.tdc.thongDiepChungId,
        encodedContent: obj.XMLSigned,
        actionUser: this.currentUser
      };
      this.bangTongHopDuLieuService.LuuDuLieuKy(params).subscribe((rs: boolean)=>{
        if(rs){
          this.GuiBangTongHop();
        }
        else{
          this.spinning = false

          this.nhatKyThaoTacLoiService.Insert(this.data.id, 'Lỗi hệ thống').subscribe();

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzWidth: '400px',
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzComponentParams: {
              msTitle: "Kiểm tra lại",
              msContent: `Ký và gửi bảng tổng hợp không thành công.
              <br>Nội dung lỗi: Lỗi hệ thống.
              <br>Vui lòng kiểm tra lại!`,
              msMessageType: MessageType.Warning,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: () => {
              }
            }
          });
          return;
        }
      })
    } else {
      this.spinning = false

      this.nhatKyThaoTacLoiService.Insert(this.tdc.thongDiepChungId, obj.Exception).subscribe();

      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '400px',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Kiểm tra lại",
          msContent: `Ký và gửi bảng tổng hợp không thành công.
          <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
          <br>Vui lòng kiểm tra lại!`,
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        }
      });
      return;
    }
  }

  GuiBangTongHop() {
    var paramGuiTKhai = {
      id: this.tdc.thongDiepChungId,
      maThongDiep: this.thongDiepChung.maThongDiep,
      mST: this.thongDiepChung.maSoThue
    };


    this.bangTongHopDuLieuService.GuiBangDuLieu(paramGuiTKhai).subscribe((rs: boolean) => {
      if (rs) {
        var thongDiepChung = {
          thongDiepChungId: this.tdc.thongDiepChungId,
          maThongDiep: this.thongDiepChung.maThongDiep,
          maNoiGui: this.thongDiepChung.maNoiGui,
          maNoiNhan: this.thongDiepChung.maNoiNhan,
          thongDiepGuiDi: this.tdc.thongDiepGuiDi,
          maLoaiThongDiep: this.tdc.maLoaiThongDiep,
          maThongDiepThamChieu: this.thongDiepChung.maThongDiepThamChieu,
          phienBan: this.thongDiepChung.phienBan,
          soLuong: this.thongDiepChung.soLuong,
          maSoThue: this.thongDiepChung.maSoThue,
          createdDate: this.tdc.createdDate,
          modifyDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          ngayGui: moment().format("YYYY-MM-DD HH:mm:ss"),
          trangThaiGui: 0
        }
        this.quyDinhKyThuatService.UpdateThongDiepChung(thongDiepChung).subscribe((res: boolean) => {
          if (res == true) {
            this.bangTongHopDuLieuService.GetById(this.data.id).subscribe((x: any)=>{
              x.thongDiepChungId = this.tdc.thongDiepChungId;
              x.actionUser = JSON.parse(localStorage.getItem('currentUser'));
              this.bangTongHopDuLieuService.Update(x).subscribe();
              this.spinning = false;
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzWidth: '400px',
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msTitle: "Ký và gửi bảng tổng hợp",
                  msContent: "Ký và gửi bảng tổng hợp thành công.",
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: () => {
                  }
                }
              });
            })
          }
          else {
            this.signing = false;
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '400px',
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msTitle: "Kiểm tra lại",
                msContent: "Ký và gửi bảng tổng hợp không thành công<br>Vui lòng kiểm tra lại!",
                msMessageType: MessageType.Warning,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                msOnClose: () => {
                }
              }
            });
            this.modal.destroy(false);
          }
        })

      }
      else{
        this.signing = false;
        this.message.error("Có lỗi trong quá trình ký và gửi")
        this.modal.destroy(false);
      }
    });
  }

  taiLaiThongTinNNT(){
    this.hoSoHDDTService.GetDetail().subscribe((rs: any)=>{
      if(rs){
        this.dataTTC.maSoThue = rs.maSoThue;
        this.dataTTC.tenNNT = rs.tenDonVi;
        this.dataTTC.nnt = rs.hoTenNguoiDaiDienPhapLuat;
      }
    })
  }

  ///

  ///CRUD
  onEditClick() {
    if (this.isAddNew === true) return;
    this.fbEnableEdit = true;

    //this.disableOrEnableHeaderButtons();
  }

  onDeleteClick(){
    const modal = this.ActivedModal = this.modalService.create({
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
        msTitle: `Xóa bảng tổng hợp dữ liệu đã chọn`,
        msContent: '<span>Bạn có chắc chắn muốn xóa bảng tổng hợp dữ liệu này không?</span><br><span>Hãy cân nhắc thật kỹ trước khi xóa!</span>',
        msOnClose: () => {
          return;
        },
        msOnOk: () => {
          this.bangTongHopDuLieuService.Delete(this.data.id).subscribe((rs: any) => {
            if (rs) {
              this.nhatKyTruyCapService.Insert({
                loaiHanhDong: LoaiHanhDong.Xoa,
                refType: RefType.BangTongHopDuLieu,
                thamChieu: 'Số bảng tổng hợp dữ liệu: ' + this.data.soBTHDLieu,
                refId: this.data.id
              }).subscribe();
              this.message.success(TextGlobalConstants.DELETE_SUCCESS_API);
              modal.destroy(true);
            } else {
              this.message.error(Message.DONT_DELETE_DANH_MUC);
            }
          }, _ => {
            this.message.error(Message.DONT_DELETE_DANH_MUC);

          })
        },
      }
    });
  }

  onExportClick(){

  }

  chonHoaDon(){
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: `Chọn hóa đơn từ hệ thống`,
      nzContent: ChonHoaDonBangTongHopModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '85%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        fromDate: this.dataTTC.tuNgay,
        toDate: this.dataTTC.denNgay
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any[]) => {
      this.hoaDonTrongHeThongs = rs;
      this.totalTrongHeThong = rs.length;
      this.isDirty = true;
    })
  }

  themHoaDonNgoaiHeThong(){
    const modal = this.ActivedModal = this.modalService.create({
      nzTitle: `Chọn hóa đơn khác`,
      nzContent: ChonHoaDonBangTongHopNgoaiHeThongModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: '85%',
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        loaiHHoa: this.dataTTC.lHHoa
      },
      nzFooter: null
    });

    modal.afterClose.subscribe((rs: any[]) => {
      this.hoaDonNgoaiHeThongs = rs;
      this.totalNgoaiHeThong = rs.length;
      this.isDirty = true;
    })
  }

  removeRowIdx(index: number, isSystem: boolean = true){
    if(isSystem){
      this.hoaDonTrongHeThongs = this.hoaDonTrongHeThongs.splice(index, 1);
      this.totalTrongHeThong = this.hoaDonTrongHeThongs.length;
    }
    else{
      this.hoaDonNgoaiHeThongs = this.hoaDonNgoaiHeThongs.splice(index, 1);
      this.totalNgoaiHeThong = this.hoaDonNgoaiHeThongs.length;
    }
  }

  ///Lưu thông điệp
  submitForm(){
    if ((this.dataTTC.lanDau == 1 && this.listData.length === 0) || (this.dataTTC.lanDau != 1 && this.hoaDonTrongHeThongs.length == 0 && this.hoaDonNgoaiHeThongs.length == 0)) {
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
          msContent: 'Cần có ít nhất 1 hóa đơn. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          },
        }
      });
      this.spinning = false;
      return;
    }

    this.dataTTC.phienBan = '2.0.0';
    this.dataTTC.mauSo = '01/TH-HĐĐT'
    this.dataTTC.ten = 'Bảng tổng hợp dữ liệu hóa đơn điện tử theo quy định tại Nghị định 123/2020/NĐ-CP';
    this.dataTTC.kyDuLieu =  (this.dataTTC.loaiKyDuLieu == 'N') ? moment(this.dataTTC.ngayDuLieu).format('DD/MM/YYYY')
                          : this.dataTTC.loaiKyDuLieu == 'T' ? (this.dataTTC.thangDuLieu < 10 ? `0${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}` : `${this.dataTTC.thangDuLieu}/${this.dataTTC.namDuLieu}`)
                          : `0${this.dataTTC.quyDuLieu}/${this.dataTTC.namDuLieu}`;
    this.dataTTC.lanDau = this.dataTTC.lanDauDisplay;

    if(this.dataTTC.lanDau && !this.dataTTC.boSungLanThu)
      this.dataTTC.chiTiets = this.listData;
    else{
      this.dataTTC.chiTiets = this.hoaDonTrongHeThongs.concat(this.hoaDonNgoaiHeThongs);
    }

    if(this.isAddNew || this.isCopy){
      if(this.isCopy) this.dataTTC.id = null;
      this.dataTTC.actionUser = JSON.parse(localStorage.getItem('currentUser'));
      this.bangTongHopDuLieuService.Insert(this.dataTTC).subscribe((rs: boolean)=>{
        if(rs){
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Thêm bảng tổng hợp dữ liệu hóa đơn',
              msContent: `Thêm bảng tổng hợp dữ liệu hóa đơn thành công`,
            },
            nzFooter: null
          });

          this.spinning = false;
          this.isSaved = true;
          this.isDirty = false;
          this.fbEnableEdit = false;
          this.loadForm(rs);
          //this.disableOrEnableHeaderButtons();
          return;
        }
        else{
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Error,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `Thêm bảng tổng hợp dữ liệu hóa đơn không thành công<br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });

          this.spinning = false;
          return;
        }
      })
    }
    else{
      this.dataTTC.actionUser = JSON.parse(localStorage.getItem('currentUser'));
      this.bangTongHopDuLieuService.Update(this.dataTTC).subscribe((rs: boolean)=>{
        if(rs){
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Info,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Cập nhật bảng tổng hợp dữ liệu hóa đơn',
              msContent: `Cập nhật bảng tổng hợp dữ liệu hóa đơn thành công`,
            },
            nzFooter: null
          });

          this.spinning = false;
          this.isSaved = true;
          this.isDirty = false;
          this.fbEnableEdit = false;
          this.loadForm(this.data);
          //this.disableOrEnableHeaderButtons();
          return;
        }
        else{
          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.Error,
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msTitle: 'Kiểm tra lại',
              msContent: `Cập nhật bảng tổng hợp dữ liệu hóa đơn không thành công<br>Vui lòng kiểm tra lại!`,
            },
            nzFooter: null
          });

          this.spinning = false;
          return;
        }
      })
    }
  }
  ///

  destroyModal() {
    if (this.isDirty && !this.isSaved)
    {
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.ConfirmBeforeClosing,
          msOnOk: () => {
            this.submitForm();
          },
          msOnClose: () => {
            this.modal.destroy();
          }
        },
        nzFooter: null
      });
    }
    else if(this.isSaved == true){
      this.modal.destroy(true);
    }
    else{
      this.modal.destroy(null);
    }
  }

  getChuoiDiaDanhNgayThang() {
    let chuoiDiaDanhNgayThang = '';

    let ngayLapHoaDon = this.dataTTC.ngayLap;
    if (ngayLapHoaDon != null && ngayLapHoaDon != '') {
      let mangNgayLap = ngayLapHoaDon.split('-');
      let nam = mangNgayLap[0];
      let thang = mangNgayLap[1];
      let ngay = mangNgayLap[2];

      let thangInt = parseInt(thang);
      if (thangInt >= 3) thang = thangInt.toString(); //nếu là tháng 1, 2 thì thêm số 0 ở trước
      let ngayInt = parseInt(ngay);
      if (ngayInt >= 10) ngay = ngayInt.toString(); //nếu là ngày < 10 thì thêm số 0 ở trước

      let chuoiNgay = "Ngày " + ngay + " tháng " + thang + " năm " + nam;

      chuoiDiaDanhNgayThang = chuoiNgay;
    }
    return chuoiDiaDanhNgayThang;
  }
}
