import { Component, Input, OnInit} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal',
  templateUrl: './ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal.component.html',
  styleUrls: ['./ket-qua-so-sanh-thong-tin-nguoi-nop-thue-modal.component.scss']
})
/**
 * Class này:
 * - Thể hiện kết quả so sánh thông tin người nộp thuế với thông tin người bán trên mẫu hóa đơn.
 * - Đưa ra câu hỏi trả lời dạng 'yes/no' để người dùng lựa chọn.
 * - Lớp này chỉ nên được dùng khi thông tin so sánh là không giống/trùng nhau.
 */
export class KetQuaSoSanhThongTinNguoinopThueComponent implements OnInit {
  @Input() resultData: any[] = []; // Dữ liệu của kết quả so sánh.
  @Input() callBackOnOk: any; // callBack là các đoạn code sẽ được chạy khi bấm nút Đồng ý.
  msOKText = TextGlobalConstants.TEXT_CONFIRM_ACCEPT;
  msCloseText = TextGlobalConstants.TEXT_CONFIRM_NO;
  msTitle = 'Phát hành hóa đơn';
  isDoingTaskOnOk = false; // doingTaskOnOk = true cho biết đang thực hiện nhiệm vụ sau khi bấm nút Đồng ý.

  constructor(
    private modal: NzModalRef,
  ) { }

  ngOnInit() {
  }

  // Hàm này được gọi khi người dùng click vào nút 'Không/ hoặc Đóng'
  destroyModal() {
    this.modal.destroy();
  }

  // Hàm này được gọi khi người dùng click vào nút 'Đồng ý'
  clickOK() {
    // Nếu có truyền vào code callBack thì cho chạy code đó
    if (this.callBackOnOk != null)
    {
      this.isDoingTaskOnOk = true;
      this.callBackOnOk();
    }
    else
    {
      this.modal.destroy();
    }
  }
}
