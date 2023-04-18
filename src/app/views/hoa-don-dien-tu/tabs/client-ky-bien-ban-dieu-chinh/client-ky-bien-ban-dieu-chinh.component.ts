import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { BienBanDieuChinhService } from 'src/app/services/quan-li-hoa-don-dien-tu/bien-ban-dieu-chinh.service';
import * as moment from 'moment';
import { DownloadFile, getNoiDungLoiPhatHanhHoaDon } from 'src/app/shared/SharedFunction';
import { EnvService } from 'src/app/env.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { MessageInv, MessageInvTT78 } from 'src/app/models/messageInv';
import { NzModalService } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CookieConstant } from 'src/app/constants/constant';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { data } from 'jquery';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';

@Component({
  selector: 'app-client-ky-bien-ban-dieu-chinh',
  templateUrl: './client-ky-bien-ban-dieu-chinh.component.html',
  styleUrls: ['./client-ky-bien-ban-dieu-chinh.component.scss']
})
export class ClientKyBienBanDieuChinhComponent implements OnInit {
  bienBanDieuChinhId: any;
  data: any;
  noiDungThongTus = [];
  ngay: any;
  thang: any;
  nam: any;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  wsSubscription: Subscription;
  spinning = false;
  noiDungHoaDonLienQuan: string = '';
  titleHoaDonLienQuan = "<strong>Danh sách hóa đơn điều chỉnh có liên quan</strong>"
  hoaDonLienQuan: any[];
  moTa = "";


  constructor(
    private env: EnvService,
    private router: ActivatedRoute,
    private modalService: NzModalService,
    private wsService: WebSocketService,
    private bienBanDieuChinhService: BienBanDieuChinhService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService
  ) {
  }

   observableSocket() {
    this.wsSubscription =  this.wsService.createObservableSocket('ws://localhost:15872/bksoft')
      .subscribe(
        data => {
          let obj = JSON.parse(data);
          console.log(obj);
          obj.bienBanDieuChinhId = this.data.bienBanDieuChinhId;
          obj.isKyBenB = true;
          if (obj.TypeOfError === 0) {
            this.spinning = false;
            this.bienBanDieuChinhService.GateForWebSocket_NM(obj)
              .subscribe((res: any) => {
                if (res) {
                  this.data = res;
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
                      msTitle: 'Ký biên bản điều chỉnh',
                      msContent: `Ký biên bản điều chỉnh thành công!`,
                    },
                    nzFooter: null
                  });
                }
              });
          } else {
            this.spinning = false;

            this.nhatKyThaoTacLoiService.Insert(this.data.bienBanDieuChinhId, obj.Exception).subscribe();

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
                msContent: `Ký biên bản điều chỉnh không thành công.
                <br>Nội dung lỗi: ${getNoiDungLoiPhatHanhHoaDon(obj.Exception)}
                <br>Vui lòng kiểm tra lại!`,
              },
              nzFooter: null
            });
          }
        },
        err => {
          this.spinning = false;

          // if (this.blockDownloadTool) {
          //   this.isKy = false;
          //   this.blockDownloadTool = false;
          //   return;
          // }

          this.modalService.create({
            nzContent: MessageBoxModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzKeyboard: false,
            nzStyle: { top: '100px' },
            nzBodyStyle: { padding: '1px' },
            nzWidth: '450px',
            nzComponentParams: {
              msMessageType: MessageType.WarningAndInstall,
              msOKText: "Tải bộ cài",
              msOnOk: ()=>{
                const link = document.createElement('a');
                link.href = `${this.env.apiUrl}/${this.urlTools}`;
                link.download = 'BKSOFT-KYSO-SETUP.zip';
                link.click();
              },
              msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
              msOnClose: ()=>{
              },
              msTitle: 'Hãy cài đặt công cụ ký số',
              msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
              <br>Để ký biên bản điều chỉnh, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
            },
            nzFooter: null
          });
        },
        () => console.log('The observable stream is complete')
      );
  }

  sendMessageToServer() {
    this.spinning = true;
    this.bienBanDieuChinhService.PreviewBienBan_NM(this.data.bienBanDieuChinhId)
      .subscribe((res: any) => {
/*         let msg: MessageInv = {};
        msg.type = 1005;
        msg.DataPDF =  `${this.env.apiUrl}/${res.filePath}`;
        msg.NBan = {
          mST: this.data.maSoThueBenB || '',
          ten: this.data.tenDonViBenB || '',
          dChi: this.data.diaChiBenB || '',
          sDThoai: this.data.soDienThoaiBenB || '',
          tenP1: this.data.tenDonViBenB || '',
          tenP2: '',
        } */

        let msg: MessageInvTT78 = {};
        msg.mLTDiep = 11;
        const databaseName = localStorage.getItem(CookieConstant.DATABASENAME);
        msg.mst = this.data.maSoThueBenB;
        msg.urlPdf = `${this.env.apiUrl}/${res.filePath}`;
        //msg.dataXML = `https://localhost:44383/uploaded/${user.databaseName}/xml/unsign/${orderData.bill.lookupCode}.xml`;
        msg.tTNKy = {
          mst: this.data.maSoThueBenB || '',
          ten: this.data.tenDonViBenB || '',
          diaChi: this.data.diaChiBenB || '',
          sDThoai: this.data.soDienThoaiBenB || '',
          tenP1: this.data.tenDonViBenB || '',
          tenP2: '',
        }
        // console.log(msg);
        // Sending
        this.wsService.sendMessage(JSON.stringify(msg));
        const isConnected = this.wsService.sendMessage(JSON.stringify(msg));

      });
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

  xemCTS(type = 1){
    if(this.wsSubscription && this.wsSubscription.closed || !this.wsSubscription){
      this.wsSubscription = this.wsService.createObservableSocket('ws://localhost:15872/bksoft').subscribe((rs: string) => {
      });
    }

    var info = type == 1 ? this.data.certA : this.data.certB;
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
    const rsSend = this.wsService.sendMessage(JSON.stringify(msg));
  }

  ngOnInit() {
    this.spinning = true;
    this.router.params.subscribe((params: any) => {
      if (params && params['id']) {
        this.bienBanDieuChinhId = params["id"];

        this.bienBanDieuChinhService.GetById_NM(this.bienBanDieuChinhId)
          .subscribe((res: any) => {
              console.log(res);
              this.data = res;
              if(this.data){
                this.noiDungThongTus = this.data.noiDungBienBan.split('\n');
                this.ngay = moment(this.data.ngayBienBan).format('DD');
                this.thang = moment(this.data.ngayBienBan).format('MM');
                this.nam = moment(this.data.ngayBienBan).format('YYYY');
                console.log('this.data: ', this.data);
                var getHD = this.data.hoaDonBiDieuChinhId;
                this.hoaDonDienTuService.GetById_TraCuu(getHD).subscribe((hd: any)=>{
                  this.hoaDonDienTuService.GetAllListHoaDonLienQuan_TraCuu(getHD, moment(hd.createdDate).format("YYYY-MM-DDThh:mm:ss")).subscribe((rs: any[])=>{
                    this.hoaDonLienQuan = rs;
                    this.moTa = this.getMoTa(hd);
                    if(this.hoaDonLienQuan.length > 0){
                      for(var i=0; i<this.hoaDonLienQuan.length; i++){
                        this.noiDungHoaDonLienQuan += `${i+1}.Hóa đơn có Ký hiệu mẫu số hóa đơn <b>${this.hoaDonLienQuan[i].mauSo}</b> Ký hiệu hóa đơn <b>${this.hoaDonLienQuan[i].kyHieu}</b> Số <b>${this.hoaDonLienQuan[i].soHoaDon}</b> Ngày <b>${moment(this.hoaDonLienQuan[i].ngayHoaDon).format('DD/MM/YYYY')}</b> mã tra cứu <a href='${this.env.apiUrl}/tra-cuu-hoa-don/${this.hoaDonLienQuan[i].maTraCuu}'><strong>${this.hoaDonLienQuan[i].maTraCuu}</strong></a><br>`
                      }
                    }
                  })
                });
                this.observableSocket();
                this.spinning = false;
              }
              else {
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzWidth: '550px',
                  nzComponentParams: {
                    msMessageType: MessageType.InfoWithoutButton,
                    msTitle: 'Xóa biên bản điều chỉnh hóa đơn',
                    msContent: `Người bán đã xóa biên bản điều chỉnh hóa đơn khỏi hệ thống. Vui lòng liên hệ với người bán nếu bạn chưa được người bán thông báo về việc xóa này.`,
                  },
                  nzFooter: null
                });

                this.spinning = false;
                return;
              }

        });
      }
    });


  }

  taiXuong() {
    this.bienBanDieuChinhService.PreviewBienBan_NM(this.data.bienBanDieuChinhId)
      .subscribe((res: any) => {
        DownloadFile(`${this.env.apiUrl}/${res.filePath}`, 'Bien_ban_dieu_chinh_hoa_don.pdf');
      });
  }

  getMoTa(hoaDonBiDieuChinh: any) {
    console.log(hoaDonBiDieuChinh);
    let moTa = `Hai bên thống nhất lập biên bản này để điều chỉnh hóa đơn có mẫu số <b style="font-family: Times New Roman">${hoaDonBiDieuChinh.mauSo}</b> ký hiệu <b style="font-family: Times New Roman">${hoaDonBiDieuChinh.kyHieu}</b> số <b style="font-family: Times New Roman">${hoaDonBiDieuChinh.soHoaDon}</b> ngày <b style="font-family: Times New Roman">${moment(hoaDonBiDieuChinh.ngayHoaDon).format('DD/MM/YYYY')}</b> ` + (hoaDonBiDieuChinh.maTraCuu ? `mã tra cứu <b style="font-family: Times New Roman">${hoaDonBiDieuChinh.maTraCuu}</b>` : '') +  ` theo quy định.`;
    return moTa;
  }

  kyDienTu() {
    this.sendMessageToServer();
  }
}
