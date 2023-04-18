import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { CookieConstant } from 'src/app/constants/constant';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { WebSocketService } from 'src/app/services/websocket.service';
import { GetKy, GetList, GetTenKy, SetDate } from 'src/app/shared/chon-ky';
import { BangTongHopParams, FilterColumn, FilterCondition } from 'src/app/models/PagingParams';
import { RowScrollerToViewEdit } from 'src/app/shared/utils';
import { getListEmptyBangKe } from 'src/app/shared/SharedFunction';
import { SumwidthConfig } from 'src/app/shared/global';
import { BangTongHopDuLieuService } from 'src/app/services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { GUID } from 'src/app/shared/Guid';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { MLTDiep } from 'src/app/enums/MLTDiep.enum';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { TrangThaiQuyTrinh } from 'src/app/enums/TrangThaiQuyTrinh.enum';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';

@Component({
  selector: 'app-chon-hoa-don-bang-tong-hop-modal',
  templateUrl: './chon-hoa-don-bang-tong-hop-modal.component.html',
  styleUrls: ['./chon-hoa-don-bang-tong-hop-modal.component.scss']
})
export class ChonHoaDonBangTongHopModalComponent implements OnInit {
  @Input() fromDate: any;
  @Input() toDate: any;
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
    TrangThaiQuyTrinh: -1,
    LoaiHangHoa: -1
    
  }; 
  displayDataTemp = Object.assign({}, this.displayData);
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
  widthConfig = ['50px','150px', '180px', '120px', '150px', '150px', '250px', '150px', '200px', '150px', '120px', '120px', '200px', '250px'];

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
  selectedNumber = 0;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  isFitering = false;

  trangThais = [
    {id: 0, value: "Mới"},
    {id: 1, value: "Hủy"},
    {id: 2, value: "Điều chỉnh"},
    {id: 3, value: "Thay thế"},
    {id: 4, value: "Giải trình"},
    {id: 5, value: "Sai sót do tổng hợp"},
  ]
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
    private webSocket: WebSocketService
  ){
  }

  changeKy(event: any) {
    SetDate(event, this.displayData);
  }

  blurDate() {
    const ky = GetKy(this.displayData);
    this.displayData.Ky = ky;
  }

  ngOnInit(){
    this.getTimKiemTheos();
    this.changeKy(this.displayData.Ky);
    this.scrollConfig.x = SumwidthConfig(this.widthConfig);
  }

  loadViewConditionList() {
    this.viewConditionList = [];

    this.viewConditionList.push({ key: 'Ky', label: 'Kỳ: ', value: GetTenKy(this.displayData.Ky) });
    if (this.viewConditionList.length > 1 || this.displayData.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }
    this.displayData.filterColumns.forEach((item: FilterColumn) => {
      if (item.isFilter) {
        this.viewConditionList.push({
          key: item.colKey,
          label: `${item.colNameVI}: `,
          value: item.colValue
        });
      }
    });

    this.displayDataTemp = Object.assign({}, this.displayData);
    this.filterTable();
  }

  onFilterCol(rs: any) {
    const filterColData = this.displayData.filterColumns.find(x => x.colKey === rs.colKey);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = filterColData.isFilter;
    }

    this.loadViewConditionList();
  }

  removeFilter(filter: any) {

    const idxdisplayData = this.displayDataTemp.filterColumns.findIndex(x => x.colKey === filter.key);
    this.displayDataTemp.filterColumns.splice(idxdisplayData, 1);
    const idx = this.viewConditionList.findIndex(x => x.key === filter.key);
    this.viewConditionList.splice(idx, 1);
    this.mapOfHightlightFilter[filter.key] = false;
    this.displayData = Object.assign({}, this.displayDataTemp);

    this.loadViewConditionList();
  }

  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfVisbleFilterCol[colName] = event;

    this.inputFilterColData = this.displayData.filterColumns.find(x => x.colKey === colName) || null;

    if (!this.inputFilterColData) {
      this.inputFilterColData = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.displayData.filterColumns.push(this.inputFilterColData);
    }

    console.log(template);
    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }

  getData() {
    this.filterTable();
  }

  cancel(){
    this.modal.destroy();
  }

  getTimKiemTheos(){
    this.hoaDonDienTuService.GetListTimKiemTheoHoaDonThayThe().subscribe((rs: any[])=>{
      this.timKiemTheos = rs;
    })
  }

  placeHolderTimKiemTheo() {
    const list = this.timKiemTheos.filter(x => x.checked === true).map(x => x.name.toLowerCase());
    if (list.length > 0) {
      return 'Nhập ' + list.join(', ');
    } else {
      return 'Nhập từ khóa cần tìm kiếm';
    }
  }

  filterTable() {
    this.loading = true;
    if(moment(this.displayData.fromDate).format("YYYY-MM-DD") > moment(this.toDate).format("YYYY-MM-DD") 
    || moment(this.displayData.toDate).format("YYYY-MM-DD") < moment(this.fromDate).format("YYYY-MM-DD")){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '450px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msTitle: "Kiểm tra lại",
          msContent: "Kỳ lấy dữ liệu không phù hợp với kỳ dữ liệu của bảng tổng hợp dữ liệu hóa đơn. Vui lòng kiểm tra lại!",
          msCloseText: "Đóng",
        },
        nzFooter: null
      });

      this.loading = false;
      return;
    }

    const timKiemTheoChecked = this.timKiemTheos.filter(x => x.checked === true).map(x => x.value);
    if (timKiemTheoChecked.length > 0 && this.displayData.GiaTri) {
      var result = {};
      for (var i = 0; i < timKiemTheoChecked.length; i++) {
        result[timKiemTheoChecked[i]] = this.displayData.GiaTri;
      }
      this.displayData.TimKiemTheo = result;
    } else {
      this.displayData.TimKiemTheo = null;
    }

    this.displayDatas.forEach(x=>{
      if(x.selected == true) x.selected == false;
    })

    this.displayData.LanDau = 3;
    
    this.bangTongHopDuLieuService.GetDuLieuBangTongHopGuiDenCQT(this.displayData).subscribe((res: any[])=>{
      this.displayDatas = res;
      this.listOfDisplayData = res;

      this.total = res.length;

      this.rowScrollerToViewEdit.scrollToRow(this.displayDatas, "id").then((result) => {
        this.selectedRow(result);
      });
      this.loading = false;
    })
  }

  changeEdit(data: any){
    if(!data.isEdit) data.isEdit = true;
  }

  blurTrangThai(data: any){
    if(data.isEdit == true) data.isEdit = false;
    data.tenTrangThaiHoaDon = this.trangThais.find(x=>x.id == data.trangThaiHoaDon).value;
  }

  selectedRow(data: any) {
    if(data.selected == true){
      data.selected = false;
    }

    data.selected = true;
  }

  destroyModal(){
    this.listData = this.displayDatas.filter(x=>x.selected == true);
    if(this.listData.length > 0){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: '465px',
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.ConfirmBeforeClosing,
          msOnOk: () => {
            this.xacNhan();
          },
          msOnClose: () => {
            this.modal.destroy();
          }
        },
        nzFooter: null
      });
    }
    else this.modal.destroy();
  }

  xacNhan(){
    this.listData = this.displayDatas.filter(x=>x.selected == true);
    if(this.listData.length == 0){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '345px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: 'Bạn chưa chọn hóa đơn để lập bảng tổng hợp dữ liệu hóa đơn. Vui lòng kiểm tra lại!',
        },
        nzFooter: null
      });
      return;
    }

    this.modal.destroy(this.listData);
  }

  checkAll(value: boolean): void {
    this.displayDatas.forEach(item => (item.checked = value));
    if(value) this.selectedNumber = this.displayDatas.length;
    else this.selectedNumber = 0;
  }

  checkedRow(event: boolean){
    if(event == true){
      this.selectedNumber += 1;
    }
    else this.selectedNumber -= 1;
  }
}
