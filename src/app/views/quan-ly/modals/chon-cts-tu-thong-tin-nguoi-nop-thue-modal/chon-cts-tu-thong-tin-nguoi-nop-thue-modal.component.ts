import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { SumwidthConfig } from 'src/app/shared/global';

@Component({
  selector: 'app-chon-cts-tu-thong-tin-nguoi-nop-thue-modal',
  templateUrl: './chon-cts-tu-thong-tin-nguoi-nop-thue-modal.component.html',
  styleUrls: ['./chon-cts-tu-thong-tin-nguoi-nop-thue-modal.component.scss']
})
export class ChonCTSTuThongTinNguoiNopThueModalComponent implements OnInit {
  listChungThuSo: any[]=[];
  widthConfig = ["50px","50px", "300px", "170px", "120px", '120px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  //checkbox
  isAllDisplayDataChecked = false;
  total = 0;
  isIndeterminate = false;
  mainForm: FormGroup;
  spinning = false;
  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private hoSoHDDTService: HoSoHDDTService,
    private message: NzMessageService
  ) {
  }
  
  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.spinning = true;
    this.hoSoHDDTService.GetDanhSachChungThuSoSuDung().subscribe((rs: any)=>{
      this.listChungThuSo = rs;
      this.total = rs.length;
      this.spinning = false;
    })
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listChungThuSo.every(item => item.checked === true);
    this.isIndeterminate = this.listChungThuSo.some(item => item.checked === true && !this.isAllDisplayDataChecked);
  }

  checkAll(value: boolean): void {
    this.listChungThuSo.forEach((item: any) => item.checked = value);
    this.refreshStatus();
  }

  submitForm(){
    var selectedRows = this.listChungThuSo.filter(x=>x.checked == true);
    if(selectedRows.length == 0){
      this.message.error("Vui lòng chọn ít nhất một chứng thư số");
      return;
    }

    this.modal.destroy(selectedRows);
  }

  closeModal() {
    this.modal.destroy();
  }

}
