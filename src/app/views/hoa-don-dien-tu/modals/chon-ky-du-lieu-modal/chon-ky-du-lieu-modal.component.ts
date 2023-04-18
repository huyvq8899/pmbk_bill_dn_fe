import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { setStyleTooltipError } from 'src/app/shared/SharedFunction';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin, Subscription } from 'rxjs';
import { SumwidthConfig } from 'src/app/shared/global';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { BangTongHopDuLieuService } from 'src/app/services/QuyDinhKyThuat/bang-tong-hop-du-lieu.service';
import { checkServerIdentity } from 'tls';
import { TrangThaiQuyTrinh_BangTongHop } from 'src/app/enums/TrangThaiQuyTrinh.enum';

@Component({
  selector: 'app-chon-ky-du-lieu-modal',
  templateUrl: './chon-ky-du-lieu-modal.component.html',
  styleUrls: ['./chon-ky-du-lieu-modal.component.scss']
})
export class ChonKyDuLieuModalComponent implements OnInit, AfterViewChecked {
  mainForm: FormGroup;
  spinning = false;
  coQuanThueQuanLys: any[]=[];
  coQuanThueCapCucs: any[]=[];
  diaDanhs: any[]=[];
  hoSoHDDT: any;
  hinhThucDangKys = [
    { id: 1, name: "Thêm mới" },
    { id: 2, name: "Gia hạn" },
    { id: 3, name: "Ngừng sử dụng" },
  ];
  pThucThanhToans = [
    { id: 1, name: "Tiền mặt" },
    { id: 2, name: "Chuyển khoản" },
    { id: 3, name: "Tiền mặt/Chuyển khoản" },
    { id: 4, name: "Đối trừ công nợ" },
    { id: 5, name: "Không thu tiền" },
    { id: 6, name: "Khác" },
  ]

  title = "01/TH-HĐĐT - Bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế";
  loaiHHs = [
    {value: 1, name: "Xăng dầu"},
    {value: 2, name: "Vận tải hàng không"},
    {value: 9, name: "Khác"},
  ];

  thangs=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  quys=[1,2,3,4];
  nams=[];

  thang: number = moment().month();
  quy: number = moment().quarter();
  nam: number = moment().year();

  mCQTQLy: any;
  kyOption = localStorage.getItem(CookieConstant.KYKEKHAITHUE);

  loaiLD: any;
  tuNgay: string;
  denNgay: string;
  pPTThue: any;
  enableSuaDoi: boolean;
  soLanSuaDoi: number;
  soLanBoSung: number;

  trangThais = [
    {id: 0, value: "Mới"},
    {id: 1, value: "Hủy"},
    {id: 2, value: "Điều chỉnh"},
    {id: 3, value: "Thay thế"},
    {id: 4, value: "Giải trình"},
    {id: 5, value: "Sai sót do tổng hợp"},
  ]
  

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private modal: NzModalRef,
    private bangTongHopDuLieuService: BangTongHopDuLieuService,
    private hoSoHDDTService: HoSoHDDTService,
  ) {
  }
  ngOnInit() {
    const currentYear = moment().year();
    for(let i=2021; i<=currentYear; i++){
      this.nams.push(i);
    }

    this.createForm();
  }

  closeModal(){
    this.modal.destroy();
  }
  
  forkJoin(){
    return forkJoin([
      this.hoSoHDDTService.GetListCoQuanThueQuanLy(),
      this.hoSoHDDTService.GetListCoQuanThueCapCuc(),
      this.hoSoHDDTService.GetListCity(),
      this.hoSoHDDTService.GetDetail()
    ])
  }

  createForm() {
    this.spinning = true;
    this.mainForm = this.fb.group({
      soBTHDLieu: [null],
      lHHoa: [this.loaiHHs.find(x=>x.name=="Khác").value],
      loaiKyDuLieu: ['N'],
      kyDuLieu: [null],
      thangDuLieu: [this.thang],
      ngayDuLieu: [moment().format('YYYY-MM-DD')],
      quyDuLieu: [this.quy],
      namDuLieu: [this.nam],
      lanDau: [1],
      boSungLanThu: [null],
      thoiHanGui: [{value: moment().format("YYYY-MM-DD HH:mm:ss"), disabled: true}],
      thoiHanGuiDisplay: [{value: moment().format("DD/MM/YYYY HH:mm:ss"), disabled: true}],
      thoiGianGui: [{ value: moment().format('YYYY-MM-DD'), disabled: true }],
      tenNNT: [null],
      maSoThue: [null],
      ngayLap: [moment().format('YYYY-MM-DD')],
      nnt: [null]
    });

    this.forkJoin().subscribe((rs: any[])=>{
      console.log(rs[0]);
      this.coQuanThueQuanLys = rs[0];
      this.coQuanThueCapCucs = rs[1];
      this.diaDanhs = rs[2];
      this.hoSoHDDT = rs[3];

      
      this.mCQTQLy = this.hoSoHDDT.coQuanThueQuanLy;
      this.pPTThue = this.hoSoHDDT.phuongPhapTinhThueGTGT;
      this.mainForm.get('tenNNT').setValue(this.hoSoHDDT.tenDonVi);
      this.mainForm.get('maSoThue').setValue(this.hoSoHDDT.maSoThue);
      this.mainForm.get('nnt').setValue(this.hoSoHDDT.hoTenNguoiDaiDienPhapLuat);
      if(this.kyOption == 'Thang'){
        this.mainForm.get('loaiKyDuLieu').setValue('T');
      }
      else if(this.kyOption == 'Quy'){
        this.mainForm.get('loaiKyDuLieu').setValue('Q');
      }

      this.changeLoaiKyDuLieu(this.mainForm.get('loaiKyDuLieu').value);

      this.spinning = false;
    });
  }

  GetSoBangTongHop() {
    const params = {
      namDuLieu: this.mainForm.get('namDuLieu').value,
      quyDuLieu: this.mainForm.get('loaiKyDuLieu').value != 'Q' ? null : this.mainForm.get('quyDuLieu').value,
      thangDuLieu: this.mainForm.get('loaiKyDuLieu').value != 'T' ? null : this.mainForm.get('thangDuLieu').value,
      ngayDuLieu: this.mainForm.get('loaiKyDuLieu').value != 'N' ? null : moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD"),
    };
    this.bangTongHopDuLieuService.GetSoBangTongHopDuLieu(params).subscribe((rs: number) => {
      this.mainForm.get('soBTHDLieu').setValue(rs);
    })
  }
  
  CheckLanDau(){
    const params = {
      namDuLieu: this.mainForm.get('namDuLieu').value,
      quyDuLieu: (this.kyOption == 'Thang' || this.mainForm.get('loaiKyDuLieu').value != 'Q') ? null : this.mainForm.get('quyDuLieu').value,
      thangDuLieu: (this.kyOption == 'Quy' || this.mainForm.get('loaiKyDuLieu').value != 'T') ? null : this.mainForm.get('thangDuLieu').value,
      ngayDuLieu: (this.mainForm.get('ngayDuLieu').value == null || this.mainForm.get('loaiKyDuLieu').value != 'N') ? null : moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD"),
      loaiHH: this.mainForm.get('lHHoa').value
    };

    this.bangTongHopDuLieuService.CheckLanDau(params).subscribe((res: any)=>{
      this.loaiLD =  res;
      console.log(res)
      if(res.rs == 1){
        this.bangTongHopDuLieuService.GetLanBoSung(params).subscribe((rs: number)=>{
          if(rs){
            this.soLanBoSung = rs;
            if(this.soLanBoSung > 1){
              this.soLanSuaDoi = this.soLanBoSung;
              this.mainForm.get('lanDau').setValue(3);
              this.changeLanDau(3);
            }
            else{
              this.mainForm.get('lanDau').setValue(2);
              this.changeLanDau(2);
            }
          }
        })
      }
      else{
        this.mainForm.get('lanDau').setValue(1);
        this.changeLanDau(1);
      }
    })
  }

  CheckSuaDoi(){
    const params = {
      namDuLieu: this.mainForm.get('namDuLieu').value,
      quyDuLieu: (this.kyOption == 'Thang' || this.mainForm.get('loaiKyDuLieu').value != 'Q') ? null : this.mainForm.get('quyDuLieu').value,
      thangDuLieu: (this.kyOption == 'Quy' || this.mainForm.get('loaiKyDuLieu').value != 'T') ? null : this.mainForm.get('thangDuLieu').value,
      ngayDuLieu: (this.mainForm.get('ngayDuLieu').value == null || this.mainForm.get('loaiKyDuLieu').value != 'N') ? null : moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD"),
      loaiHH: this.mainForm.get('lHHoa').value
    };

    this.bangTongHopDuLieuService.CheckSuaDoi(params).subscribe((rs: boolean)=>{
      this.enableSuaDoi = rs;
      if(rs){
        this.bangTongHopDuLieuService.GetLanSuaDoi(params).subscribe((res: number)=>{
          this.soLanSuaDoi = res;
        })
      }
      else this.soLanSuaDoi = 0;
    })
  }

  ///Thao tác trên checkbox, radio button
  changeLanDau(event: any){
    if(event == 1){
      if((this.soLanBoSung && this.soLanBoSung > 1) || (this.soLanSuaDoi && this.soLanSuaDoi > 1)){
        const kyDuLieuSelected = this.mainForm.get('loaiKyDuLieu').value == 'N' ? moment(this.mainForm.get('ngayDuLieu').value).format("DD/MM/YYYY") :
                                this.mainForm.get('loaiKyDuLieu').value == 'T' ? (this.mainForm.get('thangDuLieu').value < 10 ? `0${this.mainForm.get('thangDuLieu').value}/${this.mainForm.get('namDuLieu').value}` : `${this.mainForm.get('thangDuLieu').value}/${this.mainForm.get('namDuLieu').value}`) :
                                `0${this.mainForm.get('quyDuLieu').value}/${this.mainForm.get('namDuLieu').value}`
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Info,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
            },
            msTitle: `Hình thức bảng tổng hợp dữ liệu hóa đơn`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${this.loaiHHs.find(x=>x.value == this.mainForm.get('lHHoa').value).name}</b> của kỳ dữ liệu <span class="TBAOINFO"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình là Bảng tổng hợp hợp lệ. Bạn cần chọn hình thức Bổ sung hoặc Sửa đổi. `,
          },
          nzFooter: null
        });

        if(this.soLanBoSung){
          this.mainForm.get('lanDau').setValue(2);
          this.changeLanDau(2);
        }
        else{
          this.mainForm.get('lanDau').setValue(3);
          this.changeLanDau(3);
        }
      }
      else{
        this.mainForm.get('boSungLanThu').setValue(null);
        this.mainForm.get('boSungLanThu').disable();
      }
    }
    else if (event == 2){
      this.mainForm.get('boSungLanThu').setValue(this.soLanBoSung);
      this.mainForm.get('boSungLanThu').enable();
      this.enableSuaDoi = true;
    }
    else{
      this.mainForm.get('boSungLanThu').setValue(this.soLanSuaDoi);
      this.mainForm.get('boSungLanThu').enable();
    }
  }

  changeLoaiKyDuLieu(event: any){
    this.spinning = true;
    const namHienTai = moment().year();
    if(event == "N"){
      this.mainForm.get('thangDuLieu').setValue(null);
      this.mainForm.get('quyDuLieu').setValue(null);
      this.mainForm.get('thoiHanGuiDisplay').setValue(`${moment(this.mainForm.get('ngayDuLieu').value).format("DD/MM/YYYY")} 23:59:59`);
      this.mainForm.get('thoiHanGui').setValue(`${moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD")} 23:59:59`);
      this.CheckLanDau();
      this.CheckSuaDoi();
      this.GetSoBangTongHop();
    }
    else if(event == "T"){
      const thangHienTai = moment().month() + 1;
      this.mainForm.get('ngayDuLieu').setValue(null);
      this.mainForm.get('quyDuLieu').setValue(null);
      this.mainForm.get('thangDuLieu').setValue(thangHienTai);
      this.mainForm.get('namDuLieu').setValue(namHienTai);
      this.changeThang(thangHienTai);
    }
    else{
      const quyHienTai = moment().quarter();
      this.mainForm.get('ngayDuLieu').setValue(null);
      this.mainForm.get('thangDuLieu').setValue(null);
      this.mainForm.get('quyDuLieu').setValue(quyHienTai);
      this.mainForm.get('namDuLieu').setValue(namHienTai);
      this.changeQuy(quyHienTai);
    }
  }

  ///
  changeNam(event: any){
    if(this.mainForm.get('loaiKyDuLieu').value == 'T'){
      this.changeThang(this.mainForm.get('thangDuLieu').value);
    }
    else if(this.mainForm.get('loaiKyDuLieu').value == 'Q'){
      this.changeQuy(this.mainForm.get('quyDuLieu').value);
    }
  }

  ngAfterViewChecked() {

  }

  onNextClick(){
    this.spinning = true;
    
    if (this.mainForm.invalid) {
      let invalidFormChung = false;
      for (const i in this.mainForm.controls) {
        this.mainForm.controls[i].markAsTouched();
        this.mainForm.controls[i].updateValueAndValidity();
        if (invalidFormChung === false && this.mainForm.controls[i].invalid) {
          invalidFormChung = true;
        }
      }

      if (invalidFormChung) {
        setStyleTooltipError(true);
        this.spinning = false;
        return;
      }
    }

    var params: any = {
      namDuLieu: this.mainForm.get('namDuLieu').value,
      quyDuLieu: (this.kyOption == 'Thang' || this.mainForm.get('loaiKyDuLieu').value != 'Q') ? null : this.mainForm.get('quyDuLieu').value,
      thangDuLieu: (this.kyOption == 'Quy' || this.mainForm.get('loaiKyDuLieu').value != 'T') ? null : this.mainForm.get('thangDuLieu').value,
      ngayDuLieu: this.mainForm.get('loaiKyDuLieu').value != 'N' ? null : moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD"),
      loaiHH: this.mainForm.get('lHHoa').value
    };
      
    const kyDuLieuSelected = this.mainForm.get('loaiKyDuLieu').value == 'N' ? `Ngày ${moment(this.mainForm.get('ngayDuLieu').value).format("DD/MM/YYYY")}` :
    this.mainForm.get('loaiKyDuLieu').value == 'T' ? (this.mainForm.get('thangDuLieu').value < 10 ? `Tháng 0${this.mainForm.get('thangDuLieu').value}/${this.mainForm.get('namDuLieu').value}` : `Tháng ${this.mainForm.get('thangDuLieu').value}/${this.mainForm.get('namDuLieu').value}`) :
    `Quý 0${this.mainForm.get('quyDuLieu').value}/${this.mainForm.get('namDuLieu').value}`

    console.log(this.mainForm.get('lHHoa').value);
    const tenLoaiHHoa = this.loaiHHs.find(x=>x.value == this.mainForm.get('lHHoa').value).name;
    if(this.mainForm.get('loaiKyDuLieu').value == 'N' && moment().format('YYYY-MM-DD') < moment(this.mainForm.get('ngayDuLieu').value).format("YYYY-MM-DD")){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: ()=>{
          },
          msTitle: `Kiểm tra lại`,
          msContent: `Kỳ dữ liệu không được lớn hơn kỳ hiện tại. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    if(this.mainForm.get('loaiKyDuLieu').value == 'T' && moment().format('YYYY-MM-DD HH:mm:ss') < moment(this.denNgay).format("YYYY-MM-DD HH:mm:ss")){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: ()=>{
          },
          msTitle: `Kiểm tra lại`,
          msContent: `Kỳ dữ liệu không được lớn hơn kỳ hiện tại. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    if(this.mainForm.get('loaiKyDuLieu').value == 'Q' && moment().format('YYYY-MM-DD HH:mm:ss') < moment(this.denNgay).format("YYYY-MM-DD HH:mm:ss")){
      this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '450px',
        nzComponentParams: {
          msMessageType: MessageType.Warning,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOnClose: ()=>{
          },
          msTitle: `Kiểm tra lại`,
          msContent: `Kỳ dữ liệu không được lớn hơn kỳ hiện tại. Vui lòng kiểm tra lại!`,
        },
        nzFooter: null
      });

      this.spinning = false;
      return;
    }

    let next = false;
    if(this.mainForm.get('lanDau').value == 2 || this.mainForm.get('lanDau').value == 3){
      if(this.loaiLD.rs == -1 || this.loaiLD.rs == 0){
        //trường hợp bảng tổng hợp lần đầu chưa lập hoặc chưa gửi
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msOnOk: ()=>{
              next = true;
            },
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
              this.spinning = false;
              return;
            },
            msTitle: `Hình thức bảng tổng hợp dữ liệu hóa đơn`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> chưa được lập. Bạn có muốn tiếp tục không?`,
          },
          nzFooter: null
        });
      }
      else if(this.loaiLD.rs == 2){
        //trường hợp tồn tại bảng tổng hợp dữ liệu Lần đầu có các trạng thái Gửi TCTN lỗi; Chờ phản hồi; Gửi CQT không lỗi, Gửi CQT có lỗi, Bảng tổng hợp không hợp lệ, Bảng tổng hợp có hóa đơn không hợp lệ
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
            },
            msTitle: `Hình thức bảng tổng hợp dữ liệu hóa đơn`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="TBAOINFO"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình <b>${this.loaiLD.tenTrangThaiQuyTrinh}</b>. Hệ thống chỉ cho phép lập <b>Bổ sung</b> hoặc <b>Sửa đổi</b> khi bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${tenLoaiHHoa} của kỳ dữ liệu <b>${kyDuLieuSelected}</b> có trạng thái quy trình là <b>Bảng tổng hợp hợp lệ</b>`,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
      else{
        //trường hợp tồn tại bảng tổng hợp Lần đầu có trạng thái Bảng tổng hợp hợp lệ
        next = true;
      }
    }

    if(this.mainForm.get('lanDau').value == 1){
      if(this.loaiLD.rs == -1){
        //trường hợp bảng tổng hợp lần đầu chưa gửi
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Warning,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
            },
            msTitle: `Kiểm tra lại`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> của loại hàng hóa <b>${tenLoaiHHoa}</b> cho kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> chưa gửi CQT. Vui lòng kiểm tra lại!`,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
      else if(this.loaiLD.rs == 2 && (this.loaiLD.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.ChoPhanHoi || this.loaiLD.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiTCTNLoi || this.loaiLD.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiLoi)){
        //trường hợp tồn tại bảng tổng hợp dữ liệu Lần đầu có các trạng thái Gửi TCTN lỗi; Chờ phản hồi; Gửi CQT không lỗi, Gửi CQT có lỗi, Bảng tổng hợp không hợp lệ, Bảng tổng hợp có hóa đơn không hợp lệ
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Confirm,
            msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
            msOnOk: ()=>{
              next = true;
            },
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
              this.spinning = false;
              return;
            },
            msTitle: `Lập bảng tổng hợp dữ liệu hóa đơn`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình là <b>${this.loaiLD.tenTrangThaiQuyTrinh}</b>. Bạn có muốn tiếp tục lập bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> không?`,
          },
          nzFooter: null
        });
      }
      else if(this.loaiLD.rs == 1){
        //trường hợp tồn tại bảng tổng hợp Lần đầu có trạng thái Bảng tổng hợp hợp lệ
        this.modalService.create({
          nzContent: MessageBoxModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzStyle: { top: '100px' },
          nzBodyStyle: { padding: '1px' },
          nzWidth: '450px',
          nzComponentParams: {
            msMessageType: MessageType.Info,
            msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
            msOnClose: ()=>{
            },
            msTitle: `Hình thức bảng tổng hợp dữ liệu hóa đơn`,
            msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Lần đầu</b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình là <b>Bảng tổng hợp hợp lệ</b>. Bạn cần chọn hình thức <b>Bổ sung</b> hoặc <b>Sửa đổi</b>.`,
          },
          nzFooter: null
        });

        this.spinning = false;
        return;
      }
      else next = true;
    }
    
    if(next == true){
      if(this.mainForm.get('lanDau').value == 1){
        this.sendData();
      }
      else{
        if(this.mainForm.get('lanDau').value == 3){
          params = {
            ...params,
            soLanSuaDoi: this.soLanSuaDoi
          };
          this.bangTongHopDuLieuService.CheckSuaDoi(params).subscribe((res: any)=>{
            if(res.rs == 0){
              //trường hợp tích sửa đổi mà có bảng tổng hợp sửa đổi lần n chưa gửi
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '450px',
                nzComponentParams: {
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: ()=>{
                  },
                  msTitle: `Kiểm tra lại`,
                  msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Sửa đổi <span class="cssyellow">lần thứ ${this.soLanSuaDoi}</span></b> của loại hàng hóa <b>${tenLoaiHHoa}</b> cho kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> chưa gửi CQT. Vui lòng kiểm tra lại!`,
                },
                nzFooter: null
              });

              this.spinning = false;
              return;
            }
            else if(res.rs == 2){
              if(res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiTCTNLoi || res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.ChoPhanHoi || res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiKhongLoi){
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzWidth: '450px',
                  nzComponentParams: {
                    msMessageType: MessageType.Confirm,
                    msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                    msOnOk: ()=>{
                      this.sendData();
                    },
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: ()=>{
                    },
                    msTitle: `Lập bảng tổng hợp dữ liệu hóa đơn`,
                    msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Sửa đổi <span class="cssyellow">lần thứ ${this.soLanSuaDoi}</span></b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình là <b>${res.tenTrangThaiQuyTrinh}</b>. Bạn có muốn tiếp tục lập bảng tổng hợp dữ liệu hóa đơn điện tử <b>Sửa đổi lần thứ ${this.soLanSuaDoi}</b> không?`,
                  },
                  nzFooter: null
                });
              }
              else this.sendData();
            }
            else{
              this.spinning = false;
              return;
            }
          })
        }
        else{
          params = {
            ...params,
            soLanBoSung: this.soLanBoSung
          };
          this.bangTongHopDuLieuService.CheckBoSung(params).subscribe((res: any)=>{
            if(res.rs == 0){
              //trường hợp tích sửa đổi mà có bảng tổng hợp sửa đổi lần n chưa gửi
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzWidth: '450px',
                nzComponentParams: {
                  msMessageType: MessageType.Warning,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msOnClose: ()=>{
                  },
                  msTitle: `Kiểm tra lại`,
                  msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Bổ sung <span class="cssyellow">lần thứ ${this.soLanBoSung}</span></b> của loại hàng hóa <b>${tenLoaiHHoa}</b> cho kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> chưa gửi CQT. Vui lòng kiểm tra lại!`,
                },
                nzFooter: null
              });

              this.spinning = false;
              return;
            }
            else if(res.rs == 2){
              if(res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiTCTNLoi || res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.ChoPhanHoi || res.trangThaiQuyTrinh == TrangThaiQuyTrinh_BangTongHop.GuiKhongLoi){
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzWidth: '450px',
                  nzComponentParams: {
                    msMessageType: MessageType.Confirm,
                    msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                    msOnOk: ()=>{
                      this.sendData();
                    },
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                    msOnClose: ()=>{
                      this.spinning = false;
                      return;
                    },
                    msTitle: `Lập bảng tổng hợp dữ liệu hóa đơn`,
                    msContent: `Bảng tổng hợp dữ liệu hóa đơn điện tử <b>Bổ sung <span class="cssyellow">lần thứ ${this.soLanBoSung}</span></b> cho loại hàng hóa <b>${tenLoaiHHoa}</b> của kỳ dữ liệu <span class="cssyellow"><b>${kyDuLieuSelected}</b></span> có trạng thái quy trình là <b>${res.tenTrangThaiQuyTrinh}</b>. Bạn có muốn tiếp tục lập bảng tổng hợp dữ liệu hóa đơn điện tử <b>Bổ sung lần thứ ${this.soLanBoSung}</b> không?`,
                  },
                  nzFooter: null
                });
              }
              else this.sendData();
            }
            else{
              this.spinning = false;
              return;
            }
          })
        }
      }
    }
  }

  sendData(){
    const data = this.mainForm.getRawValue();
    data.tuNgay = this.tuNgay;
    data.denNgay = this.denNgay;
    data.tenLoaiHHoa = this.loaiHHs.find(x=>x.value == data.lHHoa).name;
    this.modal.destroy(data);
  }

  changeNgay(event: any){
    this.CheckLanDau();
    this.CheckSuaDoi();
    this.GetSoBangTongHop();
    this.spinning = false;
  }

  changeQuy(event: any){
    const nam = this.mainForm.get('namDuLieu').value;

    console.log(event);
    switch(event){
      case 1:
        var fromDate = nam + "-01-01";
        var toDate=nam + "-03-31";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");

        var ngayCuoiCungThangTiepTheo = new Date(nam, 3, 30, 23, 59, 59);
        if(ngayCuoiCungThangTiepTheo.getDay()== 0){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 1);
        }
        else if(ngayCuoiCungThangTiepTheo.getDay()==6){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 2);
        }
        
        this.mainForm.get('thoiHanGui').setValue(moment(ngayCuoiCungThangTiepTheo).format("YYYY-MM-DD HH:mm:ss"));
        this.mainForm.get('thoiHanGuiDisplay').setValue(moment(ngayCuoiCungThangTiepTheo).format("DD/MM/YYYY HH:mm:ss"));
        break;
      case 2:
        var fromDate = nam + "-04-01";
        var toDate=nam + "-06-30";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");

        var ngayCuoiCungThangTiepTheo = new Date(nam, 6, 31, 23, 59, 59);
        if(ngayCuoiCungThangTiepTheo.getDay()== 0){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 1);
        }
        else if(ngayCuoiCungThangTiepTheo.getDay()==6){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 2);
        }
        
        this.mainForm.get('thoiHanGui').setValue(moment(ngayCuoiCungThangTiepTheo).format("YYYY-MM-DD HH:mm:ss"));
        this.mainForm.get('thoiHanGuiDisplay').setValue(moment(ngayCuoiCungThangTiepTheo).format("DD/MM/YYYY HH:mm:ss"));
        break;
      case 3:
        var fromDate = nam + "-07-01";
        var toDate=nam + "-09-30";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");

        var ngayCuoiCungThangTiepTheo = new Date(nam, 9, 31, 23, 59, 59);
        if(ngayCuoiCungThangTiepTheo.getDay()== 0){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 1);
        }
        else if(ngayCuoiCungThangTiepTheo.getDay()==6){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 2);
        }
        
        this.mainForm.get('thoiHanGui').setValue(moment(ngayCuoiCungThangTiepTheo).format("YYYY-MM-DD HH:mm:ss"));
        this.mainForm.get('thoiHanGuiDisplay').setValue(moment(ngayCuoiCungThangTiepTheo).format("DD/MM/YYYY HH:mm:ss"));
        break;
      case 4:
        var fromDate = nam + "-10-01";
        var toDate=nam + "-12-31";
        this.tuNgay = moment(fromDate).format("YYYY-MM-DD");
        this.denNgay = moment(toDate).format("YYYY-MM-DD");

        var ngayCuoiCungThangTiepTheo = new Date(nam + 1, 0, 31, 23, 59, 59);
        if(ngayCuoiCungThangTiepTheo.getDay()== 0){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 1);
        }
        else if(ngayCuoiCungThangTiepTheo.getDay()==6){
          ngayCuoiCungThangTiepTheo.setDate(ngayCuoiCungThangTiepTheo.getDate() + 2);
        }
        
        this.mainForm.get('thoiHanGui').setValue(moment(ngayCuoiCungThangTiepTheo).format("YYYY-MM-DD HH:mm:ss"));
        this.mainForm.get('thoiHanGuiDisplay').setValue(moment(ngayCuoiCungThangTiepTheo).format("DD/MM/YYYY HH:mm:ss"));
        break;
    }

    this.CheckLanDau();
    this.CheckSuaDoi();
    this.GetSoBangTongHop();
    this.spinning = false;
  }

  changeThang(event: any){
    const nam = this.mainForm.get('namDuLieu').value;

    var ngay20 = new Date(nam, event, 20, 23, 59, 59);
    var tmpNgay = ngay20;
    var day = tmpNgay.getDay();
    if(day == 0){
      ngay20.setDate(ngay20.getDate() + 1)
    }
    else if(day == 6){
      ngay20.setDate(ngay20.getDate() + 2)
    }
    this.mainForm.get('thoiHanGui').setValue(moment(ngay20).format("YYYY-MM-DD HH:mm:ss"));
    this.mainForm.get('thoiHanGuiDisplay').setValue(moment(ngay20).format("DD/MM/YYYY HH:mm:ss"));


    switch(event){
      case 1:
        this.tuNgay = moment(nam + "-01-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-01-31").format("YYYY-MM-DD");
        break;
      case 2:
        this.tuNgay = moment(nam + "-02-01").format("YYYY-MM-DD");
        if((nam % 4 == 0 && nam % 100 != 0) || (nam % 400 == 0))
          this.denNgay = moment(nam + "-02-29").format("YYYY-MM-DD");
        else this.denNgay = moment(nam + "-02-28").format("YYYY-MM-DD");
        break;
      case 3:
        this.tuNgay = moment(nam + "-03-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-03-31").format("YYYY-MM-DD");
        break;
      case 4:
        this.tuNgay = moment(nam + "-04-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-04-30").format("YYYY-MM-DD");
        break;
      case 5:
        this.tuNgay = moment(nam + "-05-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-05-31").format("YYYY-MM-DD");
        break;
      case 6:
        this.tuNgay = moment(nam + "-06-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-06-30").format("YYYY-MM-DD");
        break;
      case 7:
        this.tuNgay = moment(nam + "-07-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-07-31").format("YYYY-MM-DD");
        break;
      case 8:
        this.tuNgay = moment(nam + "-08-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-08-31").format("YYYY-MM-DD");
        break;
      case 9:
        this.tuNgay = moment(nam + "-09-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-09-30").format("YYYY-MM-DD");
        break;
      case 10:
        this.tuNgay = moment(nam + "-10-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-10-31").format("YYYY-MM-DD");
        break;
      case 11:
        this.tuNgay = moment(nam + "-11-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-11-30").format("YYYY-MM-DD");
        break;
      case 12:
        this.tuNgay = moment(nam + "-12-01").format("YYYY-MM-DD");
        this.denNgay = moment(nam + "-12-31").format("YYYY-MM-DD");
        break;
    }

    this.CheckLanDau();
    this.CheckSuaDoi();
    this.GetSoBangTongHop();
    this.spinning = false;
  }

  destroyModal() {
    this.modal.destroy();
  }
}
