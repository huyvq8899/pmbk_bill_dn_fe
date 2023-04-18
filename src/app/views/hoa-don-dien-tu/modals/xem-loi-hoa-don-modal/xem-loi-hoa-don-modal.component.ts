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

@Component({
  selector: 'app-xem-loi-hoa-don-modal',
  templateUrl: './xem-loi-hoa-don-modal.component.html',
  styleUrls: ['./xem-loi-hoa-don-modal.component.scss']
})
export class XemLoiHoaDonModalComponent implements OnInit {
  @Input() hoaDonDienTuId: any;
  @Input() loaiLoi: number;
  errors: string = '';
  
  ActivedModal: any;
  permission: boolean;
  thaoTacs: any[]=[];
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
    this.hoaDonDienTuService.GetError(this.loaiLoi, this.hoaDonDienTuId).subscribe((rs: string[])=>{
      this.errors = rs.join(";&#13;&#10");
    })
  }

  destroyModal(){
    this.modal.destroy();
  }
  
  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if($event.keyCode == 27)
    {
      this.modal.destroy();
    }
  }
}
