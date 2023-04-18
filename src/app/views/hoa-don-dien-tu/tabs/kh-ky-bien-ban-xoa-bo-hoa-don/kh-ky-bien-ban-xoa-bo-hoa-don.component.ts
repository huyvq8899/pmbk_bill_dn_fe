import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Subscription } from 'rxjs';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { HoaDonParams } from 'src/app/models/PagingParams';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { GetKy, GetList, SetDate } from 'src/app/shared/chon-ky';
import { MessageInv, MessageInvTT78 } from 'src/app/models/messageInv';
import { saveAs } from 'file-saver'
import { SharedService } from 'src/app/services/share-service';
import { ActivatedRoute } from '@angular/router';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { getNoiDungLoiPhatHanhHoaDon } from 'src/app/shared/SharedFunction';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';

@Component({
  selector: 'app-kh-ky-bien-ban-xoa-bo-hoa-don',
  templateUrl: './kh-ky-bien-ban-xoa-bo-hoa-don.component.html',
  styleUrls: ['./kh-ky-bien-ban-xoa-bo-hoa-don.component.scss']
})
export class KHKyBienBanXoaBoHoaDonComponent implements OnInit, AfterViewChecked {
  @Input() fbEnableEdit: boolean = false;
  @Input() bienBanXoaBoHoaDonId: string;
  subcription: Subscription;
  isPhatHanh = false;
  fdata: any;
  formData: any;
  scrollConfig = { x: '1300px', y: '35vh' };
  mainForm: FormGroup;
  nguoiChuyenDois: any[] = [];
  selectedIndex: number = 0;
  thongTu: string = "";
  displayDatas: any[] = [];
  displayData: HoaDonParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    SortValue: '',
    oldFromDate: moment().startOf('month').format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    Ky: 5,
    TrangThaiPhatHanh: TrangThaiQuyTrinh.DaKyDienTu,
    LoaiHoaDon: -1,
    TrangThaiHoaDonDienTu: -1,
    TrangThaiChuyenDoi: -1,
    TrangThaiGuiHoaDon: -1,
    TrangThaiBienBanXoaBo: 0,
    Filter: {
      maSoThue: '',
      tenKhachHang: '',
      soHoaDon: '',
      hoTenNguoiMuaHang: ''
    },
  };
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  ddtp = new DinhDangThapPhan();
  lstBangKeEmpty: any;
  numberBangKeCols: any;
  isKyBenB = false;
  loaiKey: number = 1;
  keyword: string = '';
  total = 0;
  pageSizeOptions: number[] = [];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  loading = false;
  listOfSelected: any[] = [];
  dataSelected: any;
  hoSoHDDT: any;
  kys = GetList();
  soBB: string;
  hoaDonDienTuForm: any;
  wsSubscription: Subscription;
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private hoSoHDDTService: HoSoHDDTService,
    private modalService: NzModalService,
    private sharedService: SharedService,
    private websocketService: WebSocketService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
    ) {
    this.thongTu = "- Căn cứ Luật Quản lý thuế ngày 13 tháng 6 năm 2019;\n" +
      "- Căn cứ Luật Giao dịch điện tử ngày 29 tháng 11 năm 2005;\n" +
      "- Căn cứ Luật Công nghệ thông tin ngày 29 tháng 6 năm 2006;\n" +
      "- Căn cứ Nghị định số 123/2020/NĐ-CP ngày 19/10/2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
      "- Căn cứ Thông tư số 78/2021/TT-BTC ngày 17/09/2021 của Bộ Tài chính hướng dẫn thực hiện một số điều của Luật Quản lý thuế ngày 13 tháng 6 năm 2019, Nghị định số 123/2020/NĐ-CP ngày 19 tháng 10 năm 2020 của Chính phủ quy định về hóa đơn, chứng từ;\n" +
      "- Căn cứ vào thỏa thuận giữa các bên.";
  }
  ngOnInit() {
    this.getBienBanXoaBoId();
    console.log(this.formData);
    this.loading = true;
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDonById(this.bienBanXoaBoHoaDonId).subscribe((rs: any) => {
      if(rs){this.formData = rs;
        let hdId = rs.hoaDonDienTuId == null ? rs.thongTinHoaDonId : rs.hoaDonDienTuId;
        this.hoaDonDienTuService.GetById_TraCuu(hdId).subscribe((res: any)=>{
          this.fdata = res;
          console.log(this.fdata);
          this.loading = false;
          this.createForm();
        })}
      else {
        this.fdata = null;
        this.createForm();

        return;
      }
    })
  }

  getBienBanXoaBoId() {
    this.router.params.subscribe((params: any) => {
      console.log(params);
      if (params != null) {
        this.bienBanXoaBoHoaDonId = params["id"];
        console.log(this.bienBanXoaBoHoaDonId);
      }
    })
  }

  async kyDienTu() {
    this.isKyBenB = true;
    (await this.websocketService.createObservableSocket('ws://localhost:15872/bksoft')).subscribe((rs: any) => {
      let obj = JSON.parse(rs);
      obj.typeKy = 11;
      obj.bienBan = this.fdata;
      obj.dataXML = obj.XMLSigned;
      obj.dataPDF = this.fdata.dataPDF;
      if (obj.TypeOfError === 0) {
        this.hoaDonDienTuService.KyBienBanXoaBo(obj).subscribe(
          (res) => {
            console.log(res);
            if (res) {
              this.ngOnInit();
            }
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.nhatKyThaoTacLoiService.Insert(this.bienBanXoaBoHoaDonId, obj.Exception).subscribe();
        
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: 400,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msTitle: 'Kiểm tra lại',
            msContent: `Ký biên bản hủy hóa đơn không thành công.
            <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
            <br>Vui lòng kiểm tra lại!`,
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: () => { }
          },
        });
      }
    }, err => {
      this.modalService.create({
        nzTitle: "<strong>Hãy cài đặt công cụ ký số</strong>",
        nzContent: "Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại." +
          "<br>Để ký điện tử lên biên bản hủy hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.",
        nzOkType: "primary",
        nzOkText: "Tải bộ cài",
        nzOnOk: () => {
          const link = document.createElement('a');
          link.href = `${this.env.apiUrl}/${this.urlTools}`;
          link.download = 'BKSOFT-KYSO-SETUP.zip';
          link.click();
        },
        nzCancelText: "Đóng",
        nzOnCancel: () => {
        }
      });
    });
    const _data = this.mainForm.getRawValue();
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDonById(_data.id).subscribe((rs: any) => {
      this.sendMessageToServer(rs);
    })
  }

  sendMessageToServer(orderData: any) {
    let domain = this.env.apiUrl;
    //let domain = 'https://hdbk.pmbk.vn';
    orderData.ngayKyBenB = new Date();
    let dattt = Object.assign(orderData,{'IsKhachHangKy':'true'});
    console.log("sendMessageToServer");
    console.log(dattt);
    this.hoaDonDienTuService.ConvertBienBanXoaBoToFilePdf(dattt).subscribe((rs: any) => {
      console.log(rs);
      if (rs.filePDF != "" && rs.fileXML != "") {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const apiURLPDF = this.env.apiUrl + `/${rs.filePDF}`;
        const apiURLXML = this.env.apiUrl + `/${rs.fileXML}`;
        orderData.fileChuaKy = rs.filePDF;
        orderData.xMLChuaKy = rs.fileXML;
        orderData.dataXML = rs.xmlBase64;
        orderData.dataPDF = rs.pdfBase64;
        orderData.actionUser = user;
        this.fdata = orderData;

        let msg: MessageInvTT78 = {};
        msg.mLTDiep = 11;
        msg.mst = this.formData.maSoThue;
        msg.urlPdf = apiURLPDF;
        //msg.dataXML = `https://localhost:44383/uploaded/${user.databaseName}/xml/unsign/${orderData.bill.lookupCode}.xml`;
        msg.tTNKy = {
          mst: this.formData.maSoThue == null ? '' : this.formData.maSoThue,
          ten: this.formData.tenKhachHang == null ? '' : this.formData.tenKhachHang,
          diaChi: this.formData.diaChi == null ? '' : this.formData.diaChi,
          sDThoai: this.formData.soDienThoai == null ? '' : this.formData.soDienThoai,
          tenP1: this.formData.tenKhachHang == null ? '' : this.formData.tenKhachHang,
          tenP2: '',
        }
        // console.log(msg);
        // Sending
        this.websocketService.sendMessage(JSON.stringify(msg));
      }
    });
  }

  createForm() {
    console.log(this.formData);
    console.log(this.fbEnableEdit);
      this.mainForm = this.fb.group({
        id: [this.formData != null ? this.formData.id : null],
        hoaDonDienTuId: [this.fdata !=null ? this.fdata.hoaDonDienTuId : ''],
        ngayBienBan: [{ value: this.formData != null ? moment(this.formData.ngayBienBan).format("YYYY-MM-DD") : moment().format('YYYY-MM-DD'), disabled: !this.fbEnableEdit }],
        soBienBan: [{ value: this.formData != null ? this.formData.soBienBan : this.soBB, disabled: !this.fbEnableEdit }],
        thongTu: [{ value: this.formData != null ? this.formData.thongTu : this.thongTu, disabled: !this.fbEnableEdit }],
        tenCongTyBenA: [{ value: this.formData != null ? this.formData.tenCongTyBenA : "", disabled: true }],
        diaChiBenA: [{ value: this.formData != null ? this.formData.diaChiBenA : "", disabled: true }],
        maSoThueBenA: [{ value: this.formData != null ? this.formData.maSoThueBenA : "", disabled: true }],
        soDienThoaiBenA: [{ value: this.formData != null ? this.formData.soDienThoaiBenA : "", disabled: !this.fbEnableEdit }],
        daiDienBenA: [{ value: this.formData != null ? this.formData.daiDienBenA : "", disabled: !this.fbEnableEdit }],
        chucVuBenA: [{ value: this.formData != null ? this.formData.chucVuBenA : null, disabled: !this.fbEnableEdit }],
        tenKhachHang: [{ value: this.formData != null ? this.formData.tenKhachHang : this.fdata != null ? this.fdata.tenKhachHang : '', disabled: !this.fbEnableEdit }],
        diaChi: [{ value: this.formData != null ? this.formData.diaChi : this.fdata != null ?this.fdata.diaChi : '', disabled: !this.fbEnableEdit }],
        maSoThue: [{ value: this.formData != null ? this.formData.maSoThue : this.fdata != null ? this.fdata.maSoThue : '', disabled: !this.fbEnableEdit }],
        soDienThoai: [{ value: this.formData != null ? this.formData.soDienThoai : this.fdata != null ? this.fdata.soDienThoai : '', disabled: !this.fbEnableEdit }],
        daiDien: [{ value: this.formData != null ? this.formData.daiDien : this.fdata != null ? this.fdata.hoTenNguoiMuaHang : '', disabled: !this.fbEnableEdit }],
        chucVu: [{ value: this.formData != null ? this.formData.chucVu : null, disabled: !this.fbEnableEdit }],
        lyDoXoaBo: [{ value: this.formData != null ? this.formData.lyDoXoaBo : this.fdata != null ? this.fdata.lyDoXoaBo : '', disabled: !this.fbEnableEdit }]
    });
  }

  ngAfterViewChecked() {

  }

  download() {
    const id = this.message.loading('Loading...', { nzDuration: 0 }).messageId;
    console.log(this.bienBanXoaBoHoaDonId);
    this.hoaDonDienTuService.GetBienBanXoaBoHoaDonById(this.bienBanXoaBoHoaDonId).subscribe((rs: any) => {
      console.log(rs);
      if (rs != null) {
        this.hoaDonDienTuService.ConvertBienBanXoaBoToFilePdf(rs).subscribe((res: any) => {
          console.log(res);
          if (res != null && res.filePDF != null && res.filePDF != '') {
            const path = this.env.apiUrl + "/" + res.filePDF;
            console.log(path);
            this.sharedService.DownloadPdf(path).subscribe((rs: any) => {
              saveAs(rs, "BIEN_BAN_XOA_BO_HOA_DON.pdf");
              this.message.remove(id);
            })
          }
          else {
            this.message.error("Lỗi khi tải biên bản xóa bỏ");
            this.message.remove(id);
          }
        })
      }
      else {
        this.message.error("Lỗi khi tải biên bản xóa bỏ");
        this.message.remove(id);
      }
    })
  }

  taiBoCai(){
    const link = document.createElement('a');
    link.href = `${this.env.apiUrl}/${this.urlTools}`;
    link.download = 'BKSOFT-KYSO-SETUP.zip';
    link.click();
  }

  traCuuThongTinNguoiBan(){
    const link = document.createElement('a');
    link.href = `http://tracuunnt.gdt.gov.vn/tcnnt/mstdn.jsp`;
    link.target = '_blank';
    link.click();
  }
  async xemCTS(type: number){
    if(this.wsSubscription && this.wsSubscription.closed || !this.wsSubscription){
      this.wsSubscription = (await this.websocketService.createObservableSocket('ws://localhost:15872/bksoft')).subscribe((rs: string) => {
      });
    }
    this.hoaDonDienTuService.GetById_TraCuu(this.fdata.hoaDonDienTuId).subscribe((res: any) => {
      this.hoaDonDienTuService.TaiHoaDon_TraCuu(res).subscribe((rs: any) => {
        var params = {
          filePath: rs.fileXML,
          type: type,
          hoaDonDienTuId:this.fdata.hoaDonDienTuId
        }
        this.hoaDonDienTuService.FindSignatureElement(params).subscribe((info: any)=>{
          if(!info){
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
                msTitle: 'Xem thông tin chứng thư số ' + (type==1 ? 'người bán' : 'người mua'),
                msContent: `Không tìm thấy thông tin chứng thư số ${type == 1 ? 'người bán' : 'người mua'}`
              },
              nzFooter: null
            });
            return;
          }
          let msg = {
            mLTDiep: 60,
            cert: info
          };
          console.log('msg: ', msg);

          // Sending
          const rsSend = this.websocketService.sendMessage(JSON.stringify(msg));
          console.log(rsSend);
        })
      })
    })
  }
}

