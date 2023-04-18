import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CookieConstant } from 'src/app/constants/constant';
import { LyDoDieuChinh } from 'src/app/models/LyDoThayTheModel';
import { PagingParams } from 'src/app/models/PagingParams';
import { LoaiTienService } from 'src/app/services/danh-muc/loai-tien.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { SumwidthConfig } from 'src/app/shared/global';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { getLyDoDieuChinh, getLyDoDieuChinhTTHHDV } from 'src/app/shared/SharedFunction';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';

@Component({
  selector: 'app-chon-hhdv-tu-hoa-don-goc-modal',
  templateUrl: './chon-hhdv-tu-hoa-don-goc-modal.component.html',
  styleUrls: ['./chon-hhdv-tu-hoa-don-goc-modal.component.scss']
})
export class ChonHhdvTuHoaDonGocModalComponent implements OnInit {
  @Input() lyDoDieuChinh: LyDoDieuChinh;
  @Input() hoaDonBiDieuChinhId: any;
  @Input() loaiTienId: any;
  @Input() tyGia: any;
  listData = [];
  noiDungDieuChinhHoaDon: any;
  widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  //checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  isVND = true;
  spinning = false;
  boolCoPhatSinhNghiepVuNgoaiTe = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCoPhatSinhNghiepVuNgoaiTe').giaTri;

  loaiTienSearchs: any[]=[];

  displayData: PagingParams = {
    PageNumber: 1,
    PageSize: 20,
    Keyword: '',
    fromDate: '',
    toDate: '',
    oldFromDate: moment().format('YYYY-MM-DD'),
    oldToDate: moment().format('YYYY-MM-DD'),
    Filter: null,
    isActive: true
  };
  ddtp = new DinhDangThapPhan();
  ///////
  constructor(
    private modalRef: NzModalRef,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private loaiTienService: LoaiTienService
  ) { 
  }

  ngOnInit() {
    this.getLoaiTiens();
    this.noiDungDieuChinhHoaDon = getLyDoDieuChinhTTHHDV(this.lyDoDieuChinh);
    this.loadData();
  }

  getLoaiTiens(){
    this.loaiTienService.GetAll(this.displayData).subscribe((rs: any[])=>{
      this.loaiTienSearchs = rs;
    })
  }

  loadData() {
    this.spinning = true;
    this.hoaDonDienTuService.GetById(this.hoaDonBiDieuChinhId)
      .subscribe((res: any) => {
        this.listData = res.hoaDonChiTiets;
        this.loaiTienId = res.loaiTienId;
        this.tyGia = res.tyGia;
        this.listData.forEach(x=>{
          x.loaiTienId = res.loaiTienId;
          x.tyGia = res.tyGia;
        })
        this.config();
        this.spinning = false;
      });
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listData.every(item => item.checked === true);
    this.isIndeterminate = this.listData.some(item => item.checked === true && !this.isAllDisplayDataChecked);
  }

  checkAll(value: boolean): void {
    this.listData.forEach((item: any) => item.checked = value);
    this.refreshStatus();
  }

  config() {
    if (this.isVND) {
      this.widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
    } else {
      this.widthConfig = ['50px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px', '150px'];
    }

    this.scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  }

  submitForm() {
    var dataSelected = this.listData.filter(x => x.checked);
    if(dataSelected.length == 0){
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
          msContent: 'Bạn chưa chọn hàng hóa, dịch vụ bị điều chỉnh. Vui lòng kiểm tra lại!',
          msOnClose: () => {
          },
        }
      });
      return;
    }
    this.modalRef.destroy(dataSelected);
  }

  closeModal() {
    this.modalRef.destroy();
  }
}
