import { Directive, HostListener, Input } from '@angular/core';
import { NhatKyThaoTacLoiService } from '../services/tien-ich/nhat-ky-thao-tac-loi.service';

@Directive({
  selector: '[tooltipActionError]'
})
export class TooltipActionErrorDirective {
  @Input() refId: any;
  @Input() thaoTacLoi = 0; // 0: ký điện tử, 1: gửi email
  @Input() data: any;

  constructor(private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService) { }

  @HostListener('mouseenter') onMouseenter() {
    this.nhatKyThaoTacLoiService.GetByDetail(this.refId, this.thaoTacLoi)
      .subscribe((res: any[]) => {
        let moTaLoi = '<div class="text-underline">Mô tả lỗi:</div>';

        for (let i = 0; i < res.length; i++) {
          const item = res[i];
          moTaLoi += `<div>&#8226; ${i + 1}-Mô tả: ${item.moTa} | Hướng dẫn xử lý: ${item.huongDanXuLy}</div>`;
        }

        this.data.moTaLoi = moTaLoi;
      });
  }
}
