import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { getHinhThucHoaDons, getListKyTuThu4, getLoaiHoaDons, setStyleTooltipError, setStyleTooltipError_Detail } from 'src/app/shared/SharedFunction';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import * as moment from 'moment';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CheckValidMst, CheckValidMst2 } from 'src/app/customValidators/check-valid-mst.validator';

@Component({
  selector: 'app-add-edit-dang-ky-uy-nhiem-modal',
  templateUrl: './add-edit-dang-ky-uy-nhiem-modal.component.html',
  styleUrls: ['./add-edit-dang-ky-uy-nhiem-modal.component.scss']
})
export class AddEditDangKyUyNhiemModalComponent implements OnInit {
  @Input() toKhaiId: any;
  listDangKyUyNhiem: any[];
  widthConfig = ["50px", "50px", "350px", "85px", "300px", "230px", "250px", "400px", "150px", "150px", '150px']
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  //checkbox
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mainForm: FormGroup;
  spinning = false;

  hinhThucHoaDons = getHinhThucHoaDons();
  kyHieu1s = ['C', 'K'];
  loaiHoaDons = getLoaiHoaDons();
  kyHieuThu4s = getListKyTuThu4();
  kyHieuThu4sSearch = getListKyTuThu4();
  chuCais = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];
  kyHieu23s: any[] = [];
  kyHieu56s: Array<string> = [];
  pThucThanhToans = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tiền mặt/Chuyển khoản" },
    { id: 4, name: "Đối trừ công nợ" },
    { id: 5, name: "Không thu tiền" },
    { id: 9, name: "Khác" },
  ]

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private hoSoHDDTService: HoSoHDDTService,
    private message: NzMessageService,
    private quyDinhKyThuatService: QuyDinhKyThuatService
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
    this.loadData();
  }

  loadData(){
    this.spinning = true;
    const dKUNArr = this.mainForm.get('dKUNhiem') as FormArray;
    dKUNArr.clear();
    if(this.toKhaiId){
      this.quyDinhKyThuatService.GetListDangKyUyNhiem(this.toKhaiId).subscribe((rs: any)=>{
        this.listDangKyUyNhiem = rs;
        if(this.listDangKyUyNhiem.length != 0){
          this.listDangKyUyNhiem.forEach((item: any) => {
            const formGroup = this.createDKUN(item);
            dKUNArr.push(formGroup);
          });
        }
        else{
          const formGroup = this.createDKUN(null);
          dKUNArr.push(formGroup);
        }
        this.spinning = false;
      })
    }
    else{
      const formGroup = this.createDKUN(null);
      dKUNArr.push(formGroup);
      this.spinning = false;
    }
  }

  createForm(){
    this.mainForm = this.fb.group({
      dKUNhiem: this.fb.array([])
    });
  }

  createDKUN(data: any = null): FormGroup {
    return this.fb.group({
      id: [data == null ? null : data.id] ,
      idToKhai: [data == null ? this.toKhaiId : data.idToKhai],
      sTT: [data == null ? 1 : data.stt],
      tLHDon: [data == null ? null : data.tlhDon, [Validators.required]],
      kHMSHDon: [data == null ? 1 : data.khmshDon,  [Validators.required]],
      kHHDon: [data == null ? `C${moment().format('YY')}TAA` : data.khhDon,  [Validators.required]],
      kyHieu1: [data == null ? 'C' : data.kyHieu1,  [Validators.required]],
      kyHieu23: [data == null ? moment().format('YY') : data.kyHieu23,  [Validators.required]],
      kyHieu4: [data == null ? 'T' : data.kyHieu4,  [Validators.required]],
      kyHieu56: [data == null ? 'AA' : data.kyHieu56,  [Validators.required]],
      mST: [data == null ? null : data.mst,  [Validators.required, CheckValidMst, CheckValidMst2]],
      tTChuc: [data == null ? null : data.ttChuc, [Validators.required]],
      mDich: [data == null ? null : data.mDich,  [Validators.required]],
      tNgay: [data == null ? moment().format("YYYY-MM-DD") : data.tNgay,  [Validators.required]],
      dNgay: [data == null ? moment().format("YYYY-MM-DD") : data.dNgay,  [Validators.required]],
      pThuc: [data == null ? 1 : data.pThuc,  [Validators.required]]
    });
  }

  addItemDK() {
    const dKUNArr = this.mainForm.get('dKUNhiem') as FormArray;
    const dkUNs = dKUNArr.value as any[];

    if (dkUNs.length === 0) {
      dKUNArr.push(this.createDKUN({
        idToKhai: this.toKhaiId,
        stt: 1,
        tLHDon: null,
        kHMSHDon: 1,
        kHHDon: `C${moment().format('YY')}TAA`,
        kyHieu1: 'C',
        kyHieu23: moment().format('YY'),
        kyHieu4: 'T',
        kyHieu56: 'AA',
        mST: null,
        tTChuc: null,
        mDich: null,
        tNgay: moment().format("YYYY-MM-DD"),
        dNgay: moment().format("YYYY-MM-DD"),
        pThuc: 1,
      }));
    } else {
      const lastItem = dkUNs[dkUNs.length - 1];
      dKUNArr.push(this.createDKUN({
        idToKhai: this.toKhaiId,
        stt: lastItem.stt + 1,
        tLHDon: null,
        kHMSHDon: null,
        kHHDon: null,
        kyHieu1: 'C',
        kyHieu23: moment().format('YY'),
        kyHieu4: 'T',
        kyHieu56: 'AA',
        mST: null,
        tTChuc: null,
        mDich: null,
        tNgay: moment().format("YYYY-MM-DD"),
        dNgay: moment().format("YYYY-MM-DD"),
        pThuc: 1
      }));
    }
  }

  removeRowDK(i: any) {
    const dKUNArr = this.mainForm.get('dKUNhiem') as FormArray;
    dKUNArr.removeAt(i);
  }

  setKyHieuHoaDon(i: number) {
    console.log(i);
    const data = this.mainForm.get(`dKUNhiem`).value as any[];
    console.log(data);
    const value = `${data[i].kyHieu1}${data[i].kyHieu23}${data[i].kyHieu4}${data[i].kyHieu56}`;
    this.mainForm.get(`dKUNhiem.${i}.kHHDon`).setValue(value);
    this.checkTrung(i);
  }

  checkTrung(i: number){
    const dkUNArr = this.mainForm.get('dKUNhiem') as FormArray;
    const dKUNhiems = dkUNArr.value as any[];
    for(let index = 0; index < dKUNhiems.length; index++){
      if(index != i){
        if(dKUNhiems[index].tLHDon == dKUNhiems[i].tLHDon 
        && dKUNhiems[index].kHMSHDon == dKUNhiems[i].kHMSHDon
        && dKUNhiems[index].kHHDon == dKUNhiems[i].kHHDon
        && dKUNhiems[index].mST == dKUNhiems[i].mST
        && dKUNhiems[index].tTChuc == dKUNhiems[i].tTChuc
        && moment(dKUNhiems[index].tNgay).format("YYYY-MM-DD") == moment(dKUNhiems[i].tNgay).format("YYYY-MM-DD") && moment(dKUNhiems[index].dNgay).format("YYYY-MM-DD") == moment(dKUNhiems[i].dNgay).format("YYYY-MM-DD")
        && dKUNhiems[index].pThuc == dKUNhiems[i].pThuc)
        {
          this.message.error(`&lt;Thông tin đăng ký ủy nhiệm&gt; bị trùng dòng ${i+1} với dòng ${index + 1}`);
          return;
        }
      }
    }
  }

  submitForm(){
    const dkUNArr = this.mainForm.get('dKUNhiem') as FormArray;
    console.log(dkUNArr);
    const forms = dkUNArr.controls as FormGroup[];
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
    var selectedRows = data.dKUNhiem;
    selectedRows.forEach(x=>{
      x.tenPThuc = this.pThucThanhToans.find(o=>o.id == x.pThuc).name;
    })
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
          msContent: `Chưa có thông tin đăng ký ủy nhiệm lập hóa đơn. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });
      return;
    }

    this.quyDinhKyThuatService.GetListTrungKyHieuTrongHeThong(selectedRows).subscribe((rs: any[])=>{
      if(rs.length > 0){
        var noiDungTBao = `Ký hiệu ${rs.map(x=>x.khhDon).join(",")} đã tồn tại. Vui lòng kiểm tra lại!`;
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
            this.modal.destroy(this.listDangKyUyNhiem);
          }
        },
        nzFooter: null
      });
    }
    else{
      this.modal.destroy(this.listDangKyUyNhiem);
    }
  }

}
