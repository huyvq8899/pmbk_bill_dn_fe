import { Input } from "@angular/core";
import { NzModalService } from "ng-zorro-antd";
import { Subscription } from "rxjs";
import { CookieConstant } from "../constants/constant";
import { WebSocketService } from "../services/websocket.service";
import { KetQuaCheckMauHoaDonModalComponent } from "../views/hoa-don-dien-tu/modals/ket-qua-check-mau-hoa-don-modal/ket-qua-check-mau-hoa-don-modal.component";
import { KetQuaSoSanhThongTinNguoinopThueComponent } from "../views/hoa-don-dien-tu/modals/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal/ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal.component";
import { MessageBoxModalComponent, MessageType } from "./modals/message-box-modal/message-box-modal.component";
import { toTrimAndToUpperCase } from "./SharedFunction";
import { TextGlobalConstants } from "./TextGlobalConstants";

/**
 * Class này định nghĩa các hàm được sử dụng để kiểm tra so sánh 
 * thông tin người bán trên mẫu hóa đơn với người ký trên chữ ký số.
 */
export class NguoiBanNguoiKyChecker 
{
  @Input() comparingData: any[] = []; // Dữ liệu để so sánh.
  @Input() checkValidHoaDon: any[] = [];
  @Input() loading = false;
  @Input() callBack: any; // Đây là các code hóa đơn khác có thể chạy.
  @Input() apiUrl: any; // URL của API
  @Input() hasCoCanhBao: boolean;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  // Đọc ra giá trị của tùy chọn cảnh báo thông tin người bán khác thông tin người ký điện tử
  modalKetQuaSoSanh: any; // Modal hiện kết quả so sánh thông tin người nộp thuế với người bán

  constructor
  (
    private webSocket: WebSocketService,
    private modalService: NzModalService
  ){}

  // Hàm này sẽ so sánh thông tin của người nộp thuế với thông tin của người bán trên mẫu hóa đơn;
  // nếu các thông tin không trùng khớp thì đưa ra câu hỏi 'yes/no' để người dùng chọn, còn nếu tất cả
  // đều trùng khớp thì sẽ gọi hàm kiemTraNguoiBanTrenChuKySo() để kiểm tra chữ ký số. 
  kiemTraNguoiNopThueTrenMauHoaDon()
  {
    // Nếu không tích chọn thì chạy code bình thường, không kiểm tra và đưa ra cảnh báo
    if (toTrimAndToUpperCase(this.hasCoCanhBao) != "TRUE")
    {
      // Chạy đoạn code callBack
      if (this.callBack != null)
      {
        this.callBack();
      }

      return;
    }

    if (this.comparingData.find(x => x.ketQuaDoiChieu == true) != null)
    {
      // Nếu có một thông tin không trùng nhau thì mở confirm thông báo
      this.modalKetQuaSoSanh = this.modalService.create({
        nzContent: KetQuaSoSanhThongTinNguoinopThueComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '850px',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px'},
        nzComponentParams: {
          resultData: this.comparingData,
          callBackOnOk: () => { this.kiemTraNguoiBanTrenChuKySo(this.callBack); }
        },
        nzFooter: null
      });
    }
    else if(this.checkValidHoaDon.find(x=>x.ketQuaDoiChieu == true) != null){
        // Nếu có một thông tin invaild thì mở confirm thông báo
        this.modalKetQuaSoSanh = this.modalService.create({
          nzContent: KetQuaCheckMauHoaDonModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '850px',
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px'},
          nzComponentParams: {
            resultData: this.checkValidHoaDon,
          },
          nzFooter: null
        });

        return;
    }
    else
    {
      this.kiemTraNguoiBanTrenChuKySo(this.callBack);
    }
  }

  // Hàm này sẽ so sánh tên của người bán trên mẫu hóa đơn với tên của người ký trên chữ ký số;
  // nếu 2 tên khác nhau thì đưa ra câu hỏi 'yes/no', còn nếu giống nhau thì tiếp tục chạy code callBack.
  // Tham số: 
  // - callBack là các code hóa đơn khác.
  kiemTraNguoiBanTrenChuKySo(callBack: any = null)
  {
    this.createObservableSocket(callBack);
    this.sendMessageToGetCKS(callBack);
  }

  // Hàm này được dùng để gửi lệnh đọc thông tin về chữ ký số đang sử dụng để ký
  // Tham số: 
  // - callBack là các code hóa đơn khác.
  sendMessageToGetCKS(callBack: any = null) {
    this.loading = true;
    console.log(this.comparingData);
    if(this.comparingData.length == 0){
      this.loading = false;
      if(callBack) callBack();
    }
    else{
      let maSoThueTrenMauHoaDon = this.comparingData.find(x => x.tieuChi == 'Mã số thuế');
      let msg = {
        mLTDiep: "050",
        // Đọc ra mã số thuế của người bán trên mẫu hóa đơn
        mst: (maSoThueTrenMauHoaDon != null)? maSoThueTrenMauHoaDon.thongTinTrenMauHoaDon : null
      };

      if(this.webSocket.isOpenSocket()){
        // Nếu socket mở thì gửi thông tin lên 
        this.webSocket.sendMessage(JSON.stringify(msg));
      }
      else{
        if(this.webSocket.isConnecting()){
          // Khi socket ở trạng thái đang kết nối
          // đợi 2000ms để socket được mở
          setTimeout(()=>{
            if(this.webSocket.isOpenSocket()){
              // Nếu socket mở thì thoát time out
              this.webSocket.sendMessage(JSON.stringify(msg));
            }
          }, 2000);

          // Sau 2000ms vẫn chưa kết nối được thì ngắt
          if(!this.webSocket.isOpenSocket()){
            this.loading = false; 
            return;
          }
        }
        else{
          // Nếu socket không mở cũng không phải đang kết nối thì ngắt
          this.loading = false;
          return;
        }
      }
    }
  }

  // Tạo ra một socket để đón lấy (lắng nghe) các dữ liệu gửi về
  // Tham số: 
  // - callBack là các code hóa đơn khác.
  createObservableSocket(callBack: any = null)
  {
    this.webSubcription = this.webSocket.createObservableSocket('ws://localhost:15872/bksoft').subscribe(async (res: string) => {
      console.log(res);
      // var isOpened = this.webSocket.isOpenSocket();
      // console.log(isOpened);
      // if (!isOpened) {
      //   // Nếu socket chưa được mở thì bỏ qua
      //   return;
      // }

      // Biến này cho biết kết quả so sánh tên người bán trên mẫu hóa đơn với tên người ký;
      // nếu kết quả trùng nhau thì ketQuaSoSanh = true và ngược lại.
      let ketQuaSoSanh = true;

      let tenNguoiKyTrenCKS = ''; // Tên người ký chữ ký số
      let tenNguoiBanTrenMauHoaDon = ''; // Tên người bán trên mẫu hóa đơn

      let responseData = JSON.parse(res);
      responseData.DataJSON = (responseData.DataJson != null && responseData.DataJson != undefined) ? JSON.parse(responseData.DataJson) : null;
      
      if (responseData.DataJSON != null)
      {
        let subject = responseData.DataJSON.Subject;
        if (subject != null)
        {
          // Phân tách chuỗi subject để tìm ra tên của người ký trên chữ ký số
          let tachChuoiSubject = subject.split(',');
          tachChuoiSubject.forEach((item: string) => {
            // Tên của người ký nằm ở chuỗi bắt đầu với 'CN='
            let itemTemp = (item != null)?item.trim():'';
            if (itemTemp.startsWith("CN="))
            {
              tenNguoiKyTrenCKS = itemTemp.substring(3); // substring(3) vì 'CN='.length == 3

              // Kiểm tra xem kết quả so sánh có nhiều hơn một bộ ký hiệu hay không
              if (this.comparingData.find(x => x.isNhomBoKyHieu == true) != null)
              {
                // Nếu có một mảng nhiều bộ ký hiệu thì phải duyệt mảng lấy ra những dòng khác tên nhau
                let listTieuChiTheoTen = this.comparingData.filter(x => x.tieuChi == 'Tên' && toTrimAndToUpperCase(tenNguoiKyTrenCKS) != toTrimAndToUpperCase(x.thongTinTrenMauHoaDon));

                // Đưa kết quả kiểm tra so sánh vào biến ketQuaSoSanh
                // ở đây so sánh listTieuChiTheoTen.length == 0 vì nếu = 0 thì tất cả dữ liệu đều hợp lệ
                ketQuaSoSanh = (listTieuChiTheoTen.length == 0);
                
                listTieuChiTheoTen.forEach((item2: any) => {
                  tenNguoiBanTrenMauHoaDon += `<br>Bộ ký hiệu ${item2.tenBoKyHieu}: ${item2.thongTinTrenMauHoaDon}.`
                });
              }
              else
              {
                // Đọc tên người bán trên mẫu hóa đơn
                let nguoiBanTrenMauHoaDon = this.comparingData.find(x => x.tieuChi == 'Tên');

                // So sánh 2 tên có giống nhau không
                if (nguoiBanTrenMauHoaDon != null)
                {
                  tenNguoiBanTrenMauHoaDon = nguoiBanTrenMauHoaDon.thongTinTrenMauHoaDon;
                  ketQuaSoSanh = (toTrimAndToUpperCase(tenNguoiKyTrenCKS) == toTrimAndToUpperCase(tenNguoiBanTrenMauHoaDon));
                }
              }
            }
          });
        }
      }

      if (ketQuaSoSanh != true) // Nếu kết quả so sánh không trùng nhau
      {
        // Đưa ra câu hỏi 'yes/no' để người dùng chọn
        let contentAndQuestion = "<span class = 'space-trim'>Thông tin người bán khác thông tin người ký.<br><br>";
        contentAndQuestion += `Thông tin người bán là: <b>${tenNguoiBanTrenMauHoaDon}</b><br><br>`;
        contentAndQuestion += `Thông tin người ký là: <b>${tenNguoiKyTrenCKS}</b><br><br>`;
        contentAndQuestion += 'Bạn có muốn tiếp tục phát hành không?</span>';

        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: '465px',
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
            msTitle: 'Phát hành hóa đơn',
            msContent: contentAndQuestion,
            msOnOk: () => {
              // Chạy đoạn code callBack
              if (callBack != null)
              {
                callBack();
              }
            },
          },
          nzFooter: null
        });

        // Nếu đã có mở modal kết quả so sánh
        if (this.modalKetQuaSoSanh)
        {
          this.modalKetQuaSoSanh.getContentComponent().destroyModal();
        }
      }
      else
      {
        // Chạy đoạn code callBack
        if (callBack != null)
        {
          callBack();
        }
      }
    }
    , err => {
      this.loading = false;
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
          msOnOk: () => {
            const link = document.createElement('a');
            link.href = `${this.apiUrl}/${this.urlTools}`;
            link.download = 'BKSOFT-KYSO-SETUP.zip';
            link.click();
          },
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Hãy cài đặt công cụ ký số',
          msContent: `Bạn chưa cài đặt công cụ ký. Vui lòng kiểm tra lại.
          <br>Để ký điện tử lên hóa đơn, bạn cần cài đặt công cụ ký <b>BK-CHUKYSO</b>.`,
        },
        nzFooter: null
      });
    });
  }
}
