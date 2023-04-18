import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { getHinhThucHoaDons, getListKyTuThu4, getLoaiHoaDons, getThueGTGTs, setStyleTooltipError, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import * as moment from 'moment';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CheckValidMst, CheckValidMst2 } from 'src/app/customValidators/check-valid-mst.validator';
import { DinhDangThapPhan } from 'src/app/shared/DinhDangThapPhan';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { CheckValidMauHoaDon, CheckValidMauHoaDon_HoaDonChiTiet, CheckValidMauHoaDon_HoaDonLienQuan } from 'src/app/customValidators/check-valid-mauhoadon.validator';
import { CheckValidKyHieu_HoaDonChiTiet, CheckValidKyHieu_HoaDonLienQuan } from 'src/app/customValidators/check-valid-kyhieu.validator';

@Component({
  selector: 'app-chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal',
  templateUrl: './chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal.component.html',
  styleUrls: ['./chon-hoa-don-bang-tong-hop-ngoai-he-thong-modal.component.scss']
})
export class ChonHoaDonBangTongHopNgoaiHeThongModalComponent implements OnInit {
  @Input() loaiHHoa: any;
  listDangKyUyNhiem: any[];
  widthConfig = ["50px", "150px", "250px", "85px", "150px", "230px", "180px", "80px", "150px", "250px", '100px', "180px", '80px', "150px", "150px", "100px", "150px", '180px', '180px', '150px', '150px', '150px', '250px']
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  //checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mainForm: FormGroup;
  spinning = false;

  hinhThucHoaDons = getHinhThucHoaDons();
  kyHieu1s = ['C', 'K'];
  loaiHoaDons = getLoaiHoaDons();
  list_LoaiHoaDonGoc: any[] = [
    { value: '01GTKT', name: 'Hóa đơn GTGT' },
    { value: '02GTTT', name: 'Hóa đơn bán hàng' },
    { value: '06HDXK', name: 'Hóa đơn xuất khẩu' },
    { value: '07KPTQ', name: 'Hóa đơn bán hàng (dành cho tổ chức, cá nhân trong khu phi thuế quan)' },
    { value: '03XKNB', name: 'Phiếu xuất kho kiêm vận chuyển hàng hóa nội bộ' },
    { value: '04HGDL', name: 'Phiếu xuất kho gửi bán hàng đại lý' }
  ];
  kyHieuThu4s = getListKyTuThu4();
  kyHieuThu4sSearch = getListKyTuThu4();
  chuCais = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  kyHieu23s: any[] = [];
  kyHieu56s: Array<string> = [];
  trangThais = [
    {id: 0, value: "Mới"},
    {id: 1, value: "Hủy"},
    {id: 2, value: "Điều chỉnh"},
    {id: 3, value: "Thay thế"},
    {id: 4, value: "Giải trình"},
    {id: 5, value: "Sai sót do tổng hợp"},
  ]
  phanTramThueGTGTs: any[] = getThueGTGTs();
  ddtp: DinhDangThapPhan = new DinhDangThapPhan();
  hinhThucHoaDonCanThayThes: any[]=[]

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private hoSoHDDTService: HoSoHDDTService,
    private message: NzMessageService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private hoaDonDienTuService: HoaDonDienTuService
  ) {
  }
  
  ngOnInit() {
    this.createForm();
    for (let i = 0; i < this.chuCais.length; i++) {
      for (let j = 0; j < this.chuCais.length; j++) {
        var item1 = this.chuCais[i];
        var item2 = this.chuCais[j];
        this.kyHieu56s.push(item1 + item2);
      }
    }

    for (let i = 21; i < 100; i++) {
      this.kyHieu23s.push(i + '');
    }

    this.getHinhThucHoaDonCanThayThe();
    this.loadData();
  }

  loadData(){
    this.spinning = true;
    const hoaDonArr = this.mainForm.get('hoaDons') as FormArray;
    hoaDonArr.clear();
    const formGroup = this.createHD(null);
    hoaDonArr.push(formGroup);
    this.spinning = false;
  }

  getHinhThucHoaDonCanThayThe(){
    this.hoaDonDienTuService.GetListHinhThucHoaDonCanThayThe().subscribe((rs: any[])=>{
      this.hinhThucHoaDonCanThayThes = rs;
    })
  }

  createForm(){
    this.mainForm = this.fb.group({
      hoaDons: this.fb.array([])
    });
  }

  createHD(data: any = null): FormGroup {
    var formHD = this.fb.group({
      id: [data == null ? null : data.id],
      mauSo: [data == null ? null : data.mauSo,  [Validators.required, CheckValidMauHoaDon_HoaDonChiTiet]],
      loaiApDungHoaDon: 1, 
      kyHieu: [data == null ? null : data.kyHieu,  [Validators.required, CheckValidKyHieu_HoaDonChiTiet]],
      kyHieuInput: [data == null ? null : data.kyHieu.splice(0)],
      soHoaDon: [data == null ? null : data.soHoaDon,  [Validators.required]],
      ngayHoaDon: [data == null ? moment().format("YYYY-MM-DD") : moment(data.ngayHoaDon).format("YYYY-MM-DD"), [Validators.required]],
      tenKhachHang: [data == null ? null : data.tenKhachHang,  [Validators.required]],
      maSoThue: [data == null ? null : data.maSoThue,  [Validators.required, CheckValidMst, CheckValidMst2]],
      tienNgoaiTe: [data == null ? false : data.tienNgoaiTe],
      nhieuThueSuat: [data == null ? false : data.nhieuThueSuat],
      tenHang: [data == null ? null : data.tenHang],
      soLuong: [data == null ? 0 : data.soLuong],
      thanhTien: [data == null ? 0 : data.thanhTien],
      thueGTGT: [data == null ? 0 : data.thueGTGT],
      thueKhac: [data == null ? null : data.thueKhac],
      tienThueGTGT: [data == null ? 0 : data.tienThueGTGT],
      tongTienThanhToan: [data == null ? 0 : data.tongTienThanhToan],
      trangThaiHoaDon: [data == null ? 1 : data.trangThaiHoaDon],
      loaiHoaDonLienQuan: [data == null ? null : data.loaiHoaDonLienQuan],
      mauSoHoaDonLienQuan: [data == null ? null : data.mauSoHoaDonLienQuan, [CheckValidMauHoaDon_HoaDonLienQuan]],
      kyHieuHoaDonLienQuan: [data == null ? null : data.kyHieuHoaDonLienQuan, [CheckValidKyHieu_HoaDonLienQuan]],
      soHoaDonLienQuan: [data == null ? null : data.soHoaDonLienQuan],
      sTBao: [data == null ? null : data.stBao, [Validators.maxLength(30)]],
      nTBao: [{value: data == null ? null : moment(data.ntBao).format('YYYY-MM-DD'), disabled: true}],
      ghiChu: [data == null ? null : data.ghiChu, [Validators.maxLength(255)]]
    });

    if(this.loaiHHoa == 1){
      formHD.get('tenHang').setValidators(Validators.required);
      formHD.get('soLuong').setValidators(Validators.required);
    }

    return formHD;
  }

  changeKyHieu(event: any, i: number){
    this.mainForm.get(`hoaDons.${i}.kyHieu`).setValue(`K${event}`)
  }

  addItemHD() {
    const hdArr = this.mainForm.get('hoaDons') as FormArray;
    const hoaDons = hdArr.value as any[];

    if (hoaDons.length === 0) {
      hdArr.push(this.createHD({
        mauSo: 1,
        kyHieu: `K${moment().format('YY')}TAA`,
        kyHieu1: 'K',
        kyHieu23: moment().format('YY'),
        kyHieu4: 'T',
        kyHieu56: 'AA',
        soHoaDon: null,
        ngayHoaDon: moment().format("YYYY-MM-DD"),
        tienNgoaiTe: false,
        nhieuThueSuat: false,
        soLuong: 0,
        thanhTien: 0,
        thueSuat: null,

      }));
    } else {
      const lastItem = hoaDons[hoaDons.length - 1];
      hoaDons.push(this.createHD({
        mauSo: 1,
        kyHieu: lastItem.kyHieu,
        kyHieu1: lastItem.kyHieu1,
        kyHieu23: lastItem.kyHieu23,
        kyHieu4: 'T',
        kyHieu56: 'AA',
        soHoaDon: null,
        ngayHoaDon: moment().format("YYYY-MM-DD"),
        tienNgoaiTe: false,
        nhieuThueSuat: false,
        soLuong: 0,
        thanhTien: 0,
        thueSuat: null,
      }));
    }
  }

  changeNgayTBao(i: number){
    if(this.mainForm.get(`hoaDons.${i}.sTBao`).value && (this.mainForm.get(`hoaDons.${i}.soThongBaoCuaCQT`).value != "")){
      this.mainForm.get(`hoaDons.${i}.nTBao`).enable();
      this.mainForm.get(`hoaDons.${i}.nTBao`).setValue(moment().format("YYYY-MM-DD"));
    }
    else {
      this.mainForm.get(`hoaDons.${i}.nTBao`).disable();
      this.mainForm.get(`hoaDons.${i}.nTBao`).setValue(null);
    }
  }

  changeTrangThai(i: number, event: any){
    if(event != 0){
      this.mainForm.get(`hoaDons.${i}.ghiChu`).setValidators(Validators.required);
    }
    else{
      this.mainForm.get(`hoaDons.${i}.ghiChu`).clearAsyncValidators();
    }

    if(event == 2 || event == 3){
      this.mainForm.get(`hoaDons.${i}.loaiHoaDonLienQuan`).setValidators(Validators.required);
      this.mainForm.get(`hoaDons.${i}.mauSoHoaDonLienQuan`).setValidators(Validators.required);
      this.mainForm.get(`hoaDons.${i}.kyHieuHoaDonLienQuan`).setValidators(Validators.required);
      this.mainForm.get(`hoaDons.${i}.soHoaDonLienQuan`).setValidators(Validators.required);
    }
    else if(event == 5){
      this.mainForm.get(`hoaDons.${i}.loaiHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.mauSoHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.kyHieuHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.soHoaDonLienQuan`).clearAsyncValidators();

      this.mainForm.get(`hoaDons.${i}.sTBao`).setValidators(Validators.required);
      this.mainForm.get(`hoaDons.${i}.nTBao`).setValidators(Validators.required);
    }
    else{
      this.mainForm.get(`hoaDons.${i}.loaiHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.mauSoHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.kyHieuHoaDonLienQuan`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.soHoaDonLienQuan`).clearAsyncValidators();

      this.mainForm.get(`hoaDons.${i}.sTBao`).clearAsyncValidators();
      this.mainForm.get(`hoaDons.${i}.nTBao`).clearAsyncValidators();
    }
  }

  removeRowHD(i: any) {
    const hoaDonsArr = this.mainForm.get('hoaDons') as FormArray;
    hoaDonsArr.removeAt(i);
  }

  setKyHieuHoaDon(i: number) {
    const data = this.mainForm.get(`hoaDons`).value as any[];
    const value = `${data[i].kyHieu1}${data[i].kyHieu23}${data[i].kyHieu4}${data[i].kyHieu56}`;
    this.mainForm.get(`hoaDons.${i}.kyHieuHoaDon`).setValue(value);
  }

  submitForm(){
    const hoaDonArr = this.mainForm.get('hoaDons') as FormArray;
    const forms = hoaDonArr.controls as FormGroup[];
    console.log(forms);
    for(let i=0; i<forms.length; i++){
      var invalid = false;
      if(forms[i].invalid){
        for (const f in forms[i].controls) {
          forms[i].controls[f].markAsTouched();
          forms[i].controls[f].updateValueAndValidity();
          if (invalid === false && forms[i].controls[f].invalid) {
            invalid = true;
          }
        }

        if(invalid == true){
          setStyleTooltipError_Detail(true);
          return;
        }
      }
    }
    var data = this.mainForm.getRawValue();
    var selectedRows = data.hoaDons;

    if(selectedRows.length == 0){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzWidth: 500,
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msTitle: 'Kiểm tra lại',
          msContent: `Cần chọn ít nhất 1 hóa đơn. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      return;
    }

    this.quyDinhKyThuatService.GetListTrungKyHieuTrongHeThong(selectedRows).subscribe((rs: any[])=>{
      if(rs.length > 0){
        var noiDungTBao = `Ký hiệu ${rs.map(x=>x.kyHieuHoaDon).join(",")} đã tồn tại. Vui lòng kiểm tra lại!`;
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzWidth: 500,
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msTitle: 'Kiểm tra lại',
            msContent: noiDungTBao,
          },
          nzFooter: null
        });
        return;
      }
      else this.modal.destroy(selectedRows);
    })
  }

  closeModal() {
    if (this.mainForm.dirty)
    {
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
            this.submitForm();
          },
          msOnClose: () => {
            this.modal.destroy();
          }
        },
        nzFooter: null
      });
    }
    else{
      this.modal.destroy();
    }
  }

  selectedThueGTGT(item: any, index: any) {
    this.mainForm.get(`hoaDons.${index}.thueGTGT`).setValue(item.value)
  }
}
