import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { LoaiEmail } from 'src/app/models/LoaiEmail.enum';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { GuiHoaDonModalComponent } from '../gui-hoa-don-modal/gui-hoa-don-modal.component';
import { saveAs } from "file-saver";
import { ChuyenThanhHoaDonGiayModalComponent } from '../chuyen-thanh-hoa-don-giay-modal/chuyen-thanh-hoa-don-giay-modal.component';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { mathRound } from 'src/app/shared/SharedFunction';
import { FormatPrice } from 'src/app/shared/formatPrice';

@Component({
  selector: 'app-chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal',
  templateUrl: './chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal.component.html',
  styleUrls: ['./chi-tiet-thong-tin-chung-thu-so-nguoi-ban-modal.component.scss']
})
export class ChiTietThongTinChungThuSoNguoiBanModalComponent implements OnInit {
  @Input() data: any;
  domain = this.env.apiUrl;
  ActivedModal: any;
  permission: boolean;
  thaoTacs: any[]=[];
  ddtp: DinhDangThapPhan = new DinhDangThapPhan();
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  constructor(
    private message: NzMessageService,
    private modal: NzModalRef,
    private env: EnvService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private sharedService: SharedService
  ) { 
   
  }

  ngOnInit() {
    
  }
  

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if($event.keyCode == 27)
    {
      this.modal.destroy();
    }
  }
}
