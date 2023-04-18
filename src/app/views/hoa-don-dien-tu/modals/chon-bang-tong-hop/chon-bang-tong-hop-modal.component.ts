import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { GetList, SetDate } from 'src/app/shared/chon-ky';
import { BangTongHopParams } from 'src/app/models/PagingParams';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { getListEmptyBangKe, getNoiDungLoiPhatHanhHoaDon, isSelectChuKiCung } from 'src/app/shared/SharedFunction';
import { SumwidthConfig } from 'src/app/shared/global';
import { BangTongHopDuLieuService } from 'src/app/services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { GUID } from 'src/app/shared/Guid';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TrangThaiQuyTrinh, TrangThaiQuyTrinh_BangTongHop } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { NhatKyThaoTacLoiService } from 'src/app/services/tien-ich/nhat-ky-thao-tac-loi.service';
import { TuyChonService } from 'src/app/services/Config/tuy-chon.service';

@Component({
  selector: 'app-chon-bang-tong-hop-modal',
  templateUrl: './chon-bang-tong-hop-modal.component.html',
  styleUrls: ['./chon-bang-tong-hop-modal.component.scss']
})
export class ChonBangTongHopModalComponent implements OnInit {
  @Input() selectedData: any[];
  mainForm: FormGroup;
  nguoiChuyenDois: any[]=[];
  kys = GetList();
  displayData: BangTongHopParams = {
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
    LoaiHangHoa: -1,
    TrangThaiQuyTrinh: TrangThaiQuyTrinh_BangTongHop.ChuaGui
  };
  keyword: string = '';
  loaiKey: number = 1;
  loading = false;
  displayDatas: any[]=[];
  total = 0;
  pageSizeOptions: number[]=[];
  rowScrollerToViewEdit = new RowScrollerToViewEdit();
  listOfSelected: any[] = [];
  dataSelected: any;
  timKiemTheos: any[]=[];
  numberBangKeCols: any[];
  lstBangKeEmpty: any;
  scrollConfig = { x: '', y: '280px'};
  widthConfig = ['50px', '50px', '80px', '140px', '320px', '170px', '100px', '80px', '80px', '120px', '100px', '300px', '120px', '100px', '100px'];

  // checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: any = {};
  thongDiepChung:  any;
  hoSoHDDT: any;
  webSubcription: Subscription;
  urlTools = 'tools/DigitalSignature/BKSOFT-KYSO-SETUP.zip';
  signing: boolean;
  tdc: any;
  listData: any[];
  spinning = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  isSelectKyCung: string;
  serials: any[]=[];

  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private bangTongHopDuLieuService: BangTongHopDuLieuService,
    private hoSoHDDTService: HoSoHDDTService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private webSocket: WebSocketService,
    private nhatKyThaoTacLoiService: NhatKyThaoTacLoiService,
    private tuyChonService: TuyChonService
  ){
  }

  changeKy(event: any) {
    SetDate(event, this.displayData);
  }

  getHoSoHDDT(){
    this.hoSoHDDTService.GetDetail().subscribe((rs: any)=>{
      this.hoSoHDDT = rs;
    })
  }

  getCTS(){
    this.quyDinhKyThuatService.GetAllListCTS().subscribe((rs: any[])=>{
      this.serials = rs;
    });
  }

  ngOnInit(){
    this.isSelectKyCung = isSelectChuKiCung(this.tuyChonService);
    this.createSocket();
    this.getHoSoHDDT();
    this.getCTS();
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
    this.getData();
  }

  getData() {
    if(this.selectedData.length > 0) {
      this.displayDatas = this.selectedData;
      this.listOfDisplayData = this.selectedData;
    }
    else this.filterTable();
  }

  changeKeyword(event: any){
    this.keyword = event.target.value;
    if(this.loaiKey == 1){
      this.displayData.Filter.soHoaDon = this.keyword;
    }
    else if(this.loaiKey == 2){
      this.displayData.Filter.maSoThue = this.keyword;
    }
    else if(this.loaiKey == 3){
      this.displayData.Filter.tenKhachHang = this.keyword;
    }
    else{
      this.displayData.Filter.hoTenNguoiMuaHang = this.keyword;
    }
  }

  cancel(){
    this.modal.destroy();
  }

  filterTable(){
    this.loading = true;
    this.bangTongHopDuLieuService.GetAllPaging(this.displayData).subscribe((res: any)=>{
      this.displayDatas = res.items;
      this.listOfDisplayData = res.items;

      this.total = res.totalCount;
      if(res.currentPage != 0) this.displayData.PageNumber = res.currentPage;
      this.displayData.PageSize = res.pageSize;
      this.pageSizeOptions = [100, 150, 200];
      this.numberBangKeCols = Array(11).fill(0);
      this.lstBangKeEmpty = getListEmptyBangKe(this.displayDatas);

      if (this.displayDatas && this.displayDatas.length > 0) {
        this.selectedRow(this.displayDatas[0]);
      }

      this.rowScrollerToViewEdit.scrollToRow(this.displayDatas, "id").then((result) => {
        this.selectedRow(result);
      });
      this.loading = false;
    })
  }

  selectedRow(data: any) {
    if(data.selected == true){
      data.selected = false;
    }

    data.selected = true;
  }

  destroyModal(){
    this.modal.destroy();
  }

  next(){
    if(this.listOfSelected.length == 0){
      //this.message.error("Bạn phải chọn ít nhất 1 bảng tổng hợp dữ liệu.");
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzWidth: '400px',
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msTitle: "Chọn bảng tổng hợp để gửi",
          msContent: "Bạn phải chọn ít nhất 1 bảng tổng hợp dữ liệu.",
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: () => {
          }
        }
      });
      return;
    }

    this.signing = true;
    var vals = this.displayDatas.filter(x=>x.selected == true);
    console.log(vals);
    this.thongDiepChung = {
      phienBan: "2.0.0",
      maNoiGui: `${this.env.taxCodeTCGP}`,
      maNoiNhan: `${this.env.taxCodeTCTN}`,
      maLoaiThongDiep: "400",
      maThongDiep: `${this.env.taxCodeTCGP.replace('-', '')}${new GUID().toString().replace('-', '').toUpperCase()}`,
      maThongDiepThamChieu: null,
      maSoThue: this.hoSoHDDT.maSoThue,
      soLuong: vals.length
    }


    var thongDiep = {
      maLoaiThongDiep: 400,
      maThongDiepThamChieu: moment().format("YYYY/MM/DD HH:MM:SS"),
      thongDiepGuiDi: true,
      soLuong: vals.length,
      trangThaiGui: -1
    }

    let observables: Observable<any>[] = [];
    for (let i = 0; i < vals.length; i++) {
      console.log(vals[i].id)
      observables.push(this.bangTongHopDuLieuService.GetById(vals[i].id));
    }

    forkJoin(observables).subscribe((rs: any[])=>{
      this.listData = rs;
      this.quyDinhKyThuatService.InsertThongDiepChung(thongDiep).subscribe((td: any)=>{
        this.tdc = td;
        const params = {
          ttChung1: this.thongDiepChung,
          duLieu: rs,
          thongDiepChungId: td.thongDiepChungId
        }
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

          this.nhatKyThaoTacLoiService.Insert(params.id, 'Lỗi hệ thống').subscribe();

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
      mST: this.thongDiepChung.maSoThue,
      actionUser: this.currentUser
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
            let count = 0;
            let observables: Observable<any>[] = [];
            for (let i = 0; i < this.listData.length; i++) {
              this.listData[i].chiTiets.forEach(element=>{
                count ++;
                observables.push(this.hoaDonDienTuService.GetBySoHoaDon(element.soHoaDon, element.kyHieu, element.mauSo));
              })
            }

            forkJoin(observables).subscribe((rs: any[]) => {
              if (rs.length == count) {
                // for (let index = 0; index < rs.length; index++)
                //   this.hoaDonDienTuService.UpdateTrangThaiQuyTrinh(rs[index].hoaDonDienTuId, TrangThaiQuyTrinh.ChoPhanHoi).subscribe();

                this.listData.forEach(x=>{
                  console.log(this.tdc.thongDiepChungId);
                  x.thongDiepChungId = this.tdc.thongDiepChungId;
                  x.actionUser = JSON.parse(localStorage.getItem('currentUser'));
                  this.bangTongHopDuLieuService.Update(x).subscribe();
                })
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
                    msTitle: "Ký và gửi bảng tổng hợp",
                    msContent: "Ký và gửi bảng tổng hợp thành công.",
                    msMessageType: MessageType.Info,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: () => {
                    }
                  }
                });
                this.modal.destroy(true);
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
                    msContent: "Ký và gửi bảng tổng hợp không thành công. Vui lòng kiểm tra lại!",
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
      else{
        this.signing = false;
        this.message.error("Có lỗi trong quá trình ký và gửi")
        this.modal.destroy(false);
      }
    })
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.doiTuongId]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.doiTuongId]) && !this.isAllDisplayDataChecked;

    this.dataSelected = null;
    this.displayDatas.forEach((item: any) => {
      item.selected = false;
    });

    let entries = Object.entries(this.mapOfCheckedId);
    for (const [prop, val] of entries) {
      const item = this.listOfDisplayData.find(x => x.id === prop);
      const selectedIndex = this.listOfSelected.findIndex(x => x.id === prop);
      const index = this.displayDatas.findIndex(x => x.id === prop);

      if (val) {
        if (selectedIndex === -1) {
          this.listOfSelected.push(item);
        }
      } else {
        if (selectedIndex !== -1) {
          this.listOfSelected = this.listOfSelected.filter(x => x.id !== prop);
        }
      }

      if (index !== -1) {
        this.displayDatas[index].selected = val;
      }
    }
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
}
