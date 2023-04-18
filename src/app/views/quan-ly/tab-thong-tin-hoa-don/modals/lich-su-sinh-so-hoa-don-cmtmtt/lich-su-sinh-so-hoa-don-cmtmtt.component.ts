import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forEach } from 'jszip';
import { Component, Input, OnInit } from '@angular/core';
import { QuanLyThongTinHoaDonService } from 'src/app/services/quan-ly/quan-ly-thong-tin-hoa-don.service';
import { SumwidthConfig } from 'src/app/shared/global';
const TATCATHOIGIAN = -1;
@Component({
  selector: 'app-lich-su-sinh-so-hoa-don-cmtmtt',
  templateUrl: './lich-su-sinh-so-hoa-don-cmtmtt.component.html',
  styleUrls: ['./lich-su-sinh-so-hoa-don-cmtmtt.component.scss']
})
export class LichSuSinhSoHoaDonCmtmttComponent implements OnInit {
  widthConfig = ['150px', '150px', '150px',];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '140px' };
  listLichSuSinhSo: any[] = [];
  isViewHistory = false;
  listNhatKySinhSo: any[] = [];
  visible = false;
  constructor(private quanLyThongTinHoaDonService: QuanLyThongTinHoaDonService,
    private modal: NzModalRef,
    ) { }

  ngOnInit() {
    this.GetHistorySinhSoHoaDonCMMTTien();
  }
  ngAfterViewChecked(): void {
    let list = document.getElementsByClassName('ant-timeline-item-tail');
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if(!element.className.includes('custom-tail')) {
        element.className += " custom-tail";
      }
    }  
      let listHead = document.getElementsByClassName('ant-timeline-item-head');
    for (let index = 0; index < listHead.length; index++) {
      const element = listHead[index];
      if(!element.className.includes('custom-tail-head')) {
        element.className += " custom-tail-head";
      }
    }
  }
  GetHistorySinhSoHoaDonCMMTTien(year: number = TATCATHOIGIAN) {
    this.quanLyThongTinHoaDonService.GetHistorySinhSoHoaDonCMMTTien(year).subscribe(
      (res: any[]) => {
        console.log("🚀 ~ file: tab-thong-tin-hoa-don.component.ts ~ line 353 ~ TabThongTinHoaDonComponent ~ SaveSoBatDauToTbSinhSo ~ res", res)
        if (res) {
          this.listLichSuSinhSo = res;
          this.listLichSuSinhSo.forEach(element => {
            element.soBatDau = this.viewNumber11KyTu(element.soBatDau);
            element.soKetThuc = this.viewNumber11KyTu(element.soKetThuc);
          });
        }
      },
      err => {
        return;
      }
    );
  }

  GetHistorySinhSoHoaDonCMMTTienInNhatKyTruyCap(id: string) {
    this.quanLyThongTinHoaDonService.GetHistorySinhSoHoaDonCMMTTienInNhatKyTruyCap(id).subscribe(
      (res: any[]) => {
        console.log("🚀 ~ file: tab-thong-tin-hoa-don.component.ts ~ line 353 ~ TabThongTinHoaDonComponent ~ SaveSoBatDauToTbSinhSo ~ res", res)
        if (res) {
          this.listNhatKySinhSo = res;
        }
      },
      err => {
        return;
      }
    );
  }

  viewNumber11KyTu(input: number) {
    let stringInit = '00000000000';
    let numberOfZezo = stringInit.substring(0, (11 - input.toString().length))
    return numberOfZezo + input.toString();
  }
  clickOpenNhatKySinhSo(event: any) {
    event.visible = true;
    this.listLichSuSinhSo.forEach(element => {
      if(element.sinhSoHDMayTinhTienId != event.sinhSoHDMayTinhTienId) {
        element.visible = false;
      }
    });
    this.GetHistorySinhSoHoaDonCMMTTienInNhatKyTruyCap(event.sinhSoHDMayTinhTienId);
  }
  destroyModal() {
    this.modal.destroy();
  }
  change() {
    this.visible = !this.visible;
  }
}
