import { UserService } from 'src/app/services/user.service';
import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { EnvService } from 'src/app/env.service';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { HoSoHDDTService } from 'src/app/services/danh-muc/ho-so-hddt.service';
import { forkJoin } from 'rxjs';
import { AddEditToKhaiDangKyThayDoiThongTinModalComponent } from '../add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal/add-edit-to-khai-dang-ky-thay-doi-thong-tin-modal.component';
import { ThongBaoHoaDonSaiSotModalComponent } from '../thong-bao-hoa-don-sai-sot-modal/thong-bao-hoa-don-sai-sot-modal.component';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { CookieConstant } from 'src/app/constants/constant';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TabThongDiepGuiComponent } from '../../tab-thong-diep-gui/tab-thong-diep-gui.component';

@Component({
  selector: 'app-add-thong-diep-gui-modal',
  templateUrl: './add-thong-diep-gui-modal.component.html',
  styleUrls: ['./add-thong-diep-gui-modal.component.scss']
})
export class AddThongDiepGuiModalComponent implements OnInit, AfterViewChecked {
  @Input() callBackAfterClosing:() => any;
  @Input() isExistAcceptedRegister: boolean;
  @Input() selectedLoaiTD=100;
  mainForm: FormGroup;
  ActivedModal: any=null;
  loaiThongDieps: any[]=[
    { ma: 100, ten: '01/ĐKTĐ-HĐĐT - Tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử' },
    { ma: 300, ten: '04/SS-HĐĐT - Thông báo hóa đơn điện tử có sai sót' }
  ]
  hinhThucs: any[]=[];
  hinhThucs1: any[]=[
    { id: 1, ten: 'Đăng ký mới'},
    { id: 2, ten: 'Thay đổi thông tin' }
  ]

  hinhThucs2: any[]=[
    { id: 1, ten: 'Chính thức'}
  ]
  hoSoHDDT: any;
  listCQTQLys: any[]=[];
  spinning = false;
  boolCoPhatSinhUyNhiemLapHoaDon = JSON.parse(localStorage.getItem(CookieConstant.SETTING)).find(x => x.ma === 'BoolCoPhatSinhUyNhiemLapHoaDon').giaTri;
  coPhatSinhUyNhiemLapHoaDon = this.boolCoPhatSinhUyNhiemLapHoaDon === 'true' || this.boolCoPhatSinhUyNhiemLapHoaDon === true;
  thaoTacNNTs: any[] = [];
  permission: boolean = false;
  thaoTacs: any[] = [];
  constructor(
    private env: EnvService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private hoaDonDienTuService: HoaDonDienTuService,
    private hoSoHDDTService: HoSoHDDTService,
    private modalService: NzModalService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private userService: UserService,
    private tabThongDiepGuiComponent: TabThongDiepGuiComponent,
  ){
  }
  ngOnInit(){
    this.createForm();
  }

  forkJoin(){
    return forkJoin([
      this.hoSoHDDTService.GetDetail(),
      this.hoSoHDDTService.GetListCoQuanThueQuanLy()
    ])
  }
  createForm(){
    this.spinning = true;
    this.forkJoin().subscribe((rs: any[])=>{
      this.hoSoHDDT = rs[0];
      this.listCQTQLys = rs[1];
      this.hinhThucs = this.hinhThucs1;

      let setting = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
      let kyKeKhaiThue = "";
      if (setting == 'Quy')
      {
        kyKeKhaiThue = "Quý";
      }
      else if (setting == 'Thang')
      {
        kyKeKhaiThue = "Tháng";
      }

      this.mainForm = this.fb.group({
        mLTDiep: [this.loaiThongDieps[0].ma, [Validators.required]],
        cQTQLy: [{value: this.listCQTQLys.find(x=>x.code == this.hoSoHDDT.coQuanThueQuanLy).name, disabled: true}, [Validators.required]],
        pPTThue: [{value: this.hoSoHDDT.phuongPhapTinhThueGTGT, disabled: true}],
        hThuc: !this.isExistAcceptedRegister ? 1 : 2,
        nhanUyNhiem: [false],
        loaiUyNhiem: [null],
        loaiThongBao: ['1'],
        kyKeKhaiThue: [{value: kyKeKhaiThue, disabled: true}]
      });
      this.spinning = false;
    })
  }

  changeUyNhiem(event: any){
    if(event == true){
      this.mainForm.get('loaiUyNhiem').enable();
      this.mainForm.get('loaiUyNhiem').setValue('1');
    }
    else
    {
      this.mainForm.get('loaiUyNhiem').disable();
      this.mainForm.get('loaiUyNhiem').setValue(null);
    }
  }

  changeLoaiTDiep(event: any){
    if(event == 100){
      this.hinhThucs = this.hinhThucs1;
      if(this.isExistAcceptedRegister) this.mainForm.get('hThuc').setValue(2);
      else  this.mainForm.get('hThuc').setValue(1); //default
    }
    else
    {
      this.hinhThucs = this.hinhThucs2;
      this.mainForm.get('hThuc').setValue(1); //default
    }
  }

  next(){
    const rawValue = this.mainForm.getRawValue();
    console.log(rawValue);
    this.modal.destroy();

    if(rawValue.mLTDiep == 100 || rawValue.mLTDiep == 101){
      if(rawValue.hThuc == 1){
        this.quyDinhKyThuatService.GetThongDiepThemMoiToKhaiDuocChapNhan().subscribe((td: any)=>{
          console.log(td);
          if(td != null){
            if(td.hinhThuc == 1){
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Hình thức tờ khai`,
                  msContent: 'Đã tồn tại tờ khai có hình thức <b>Đăng ký mới</b> được CQT chấp nhận. Bạn cần chọn hình thức tờ khai là <b>Thay đổi thông tin</b>.',
                  msOnClose: () => {
                  },
                }
              });

              return;
            }
            else{
              this.modalService.create({
                nzContent: MessageBoxModalComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzKeyboard: false,
                nzStyle: { top: '100px' },
                nzBodyStyle: { padding: '1px' },
                nzComponentParams: {
                  msMessageType: MessageType.Info,
                  msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                  msTitle: `Hình thức tờ khai`,
                  msContent: "Không được phép chọn hình thức tờ khai là <b>Đăng ký mới</b> khi đã tồn tại tờ khai có hình thức <b>Thay đổi thông tin</b> được CQT chấp nhận. Bạn cần chọn hình thức tờ khai là <b>Thay đổi thông tin</b>.",
                  msOnClose: () => {
                  },
                }
              });

              return;
            }
          }
          else{
            this.quyDinhKyThuatService.GetThongDiepThemMoiToKhai().subscribe((td: any) =>{
              if(td!=null){
                this.modalService.create({
                  nzContent: MessageBoxModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzStyle: { top: '100px' },
                  nzBodyStyle: { padding: '1px' },
                  nzComponentParams: {
                    msMessageType: MessageType.Confirm,
                    msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                    msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                    msTitle: `Hình thức tờ khai`,
                    msOkButtonInBlueColor: true,
                    msContent: 'Bạn đã lập tờ khai có hình thức <b>Đăng ký mới</b>. Bạn có muốn tiếp tục không?',
                    msOnClose: () => {
                      return;
                    },
                    msOnOk: () => {
                      const modal = this.ActivedModal = this.modalService.create({
                        nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
                        nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzKeyboard: false,
                        nzWidth: '100%',
                        nzStyle: { top: '0px' },
                        nzBodyStyle: { padding: '1px', innerHeight: '800px' },
                        nzComponentParams: {
                          callBackAfterClosing:()=> {this.callBackAfterClosing();},
                          isAddNew: true,
                          isThemMoi: rawValue.hThuc == 1 ? true : false,
                          nhanUyNhiem: rawValue.nhanUyNhiem,
                          loaiUyNhiem: rawValue.loaiUyNhiem,
                          tenCQTQLy: rawValue.cQTQLy,
                          fbEnableEdit: true,
                          hoSoHDDT: this.hoSoHDDT,
                          phuongPhapTinh: rawValue.pPTThue
                        },
                        nzFooter: null
                      });

                      modal.afterClose.subscribe((rs: any) => {
                        this.ActivedModal = null;
                        if (rs) {
                          this.modal.destroy(rs);
                        }
                        else{
                          modal.destroy(false);
                          this.modal.destroy(null);
                        }
                      });
                    },
                  }
                });
              }
              else{
                const modal = this.ActivedModal = this.modalService.create({
                  nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
                  nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
                  nzMaskClosable: false,
                  nzClosable: false,
                  nzKeyboard: false,
                  nzWidth: '100%',
                  nzStyle: { top: '0px' },
                  nzBodyStyle: { padding: '1px', innerHeight: '800px' },
                  nzComponentParams: {
                    callBackAfterClosing: ()=> {this.callBackAfterClosing();},
                    isAddNew: true,
                    isThemMoi: rawValue.hThuc == 1 ? true : false,
                    nhanUyNhiem: rawValue.nhanUyNhiem,
                    loaiUyNhiem: rawValue.loaiUyNhiem,
                    tenCQTQLy: rawValue.cQTQLy,
                    fbEnableEdit: true,
                    hoSoHDDT: this.hoSoHDDT,
                    phuongPhapTinh: rawValue.pPTThue
                  },
                  nzFooter: null
                });

                modal.afterClose.subscribe((rs: any) => {
                  this.ActivedModal = null;
                  if (rs) {
                    this.modal.destroy(rs);
                  }
                  else{
                    modal.destroy(false);
                    this.modal.destroy(null);
                  }
                });
              }
            });
          }
        });
      }
      else{
        this.quyDinhKyThuatService.CheckChuaLapToKhai().subscribe((res: any) => {
          if (res) {
            this.modalService.create({
              nzContent: MessageBoxModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzStyle: { top: '100px' },
              nzBodyStyle: { padding: '1px' },
              nzComponentParams: {
                msMessageType: MessageType.Confirm,
                msCloseText: TextGlobalConstants.TEXT_CONFIRM_NO,
                msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
                msTitle: `Hình thức tờ khai`,
                msOkButtonInBlueColor: true,
                msContent: 'Bạn chưa lập tờ khai có hình thức <b>Đăng ký mới</b>. Bạn có muốn tiếp tục không?',
                msOnClose: () => {
                  return;
                },
                msOnOk: () => {
                  const modal = this.ActivedModal = this.modalService.create({
                    nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
                    nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzWidth: '100%',
                    nzStyle: { top: '0px' },
                    nzBodyStyle: { padding: '1px', innerHeight: '800px' },
                    nzComponentParams: {
                      callBackAfterClosing: ()=> {this.callBackAfterClosing();},
                      isAddNew: true,
                      isThemMoi: rawValue.hThuc == 1 ? true : false,
                      nhanUyNhiem: rawValue.nhanUyNhiem,
                      loaiUyNhiem: rawValue.loaiUyNhiem,
                      tenCQTQLy: rawValue.cQTQLy,
                      fbEnableEdit: true,
                      hoSoHDDT: this.hoSoHDDT,
                      phuongPhapTinh: rawValue.pPTThue
                    },
                    nzFooter: null
                  });

                  modal.afterClose.subscribe((rs: any) => {
                    this.ActivedModal = null;
                    if (rs) {
                      this.modal.destroy(rs);
                    }
                    else{
                      modal.destroy(false);
                      this.modal.destroy(null);
                    }
                  });
                },
              }
            });
          } else {
            const modal = this.ActivedModal = this.modalService.create({
              nzTitle: `Tờ khai đăng ký/thay đổi thông tin sử dụng dịch vụ hóa đơn điện tử`,
              nzContent: AddEditToKhaiDangKyThayDoiThongTinModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzKeyboard: false,
              nzWidth: '100%',
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px', innerHeight: '800px' },
              nzComponentParams: {
                callBackAfterClosing: ()=> {this.callBackAfterClosing();},
                isAddNew: true,
                isThemMoi: rawValue.hThuc == 1 ? true : false,
                nhanUyNhiem: rawValue.nhanUyNhiem,
                loaiUyNhiem: rawValue.loaiUyNhiem,
                tenCQTQLy: rawValue.cQTQLy,
                fbEnableEdit: true,
                phuongPhapTinh: rawValue.pPTThue,
                hoSoHDDT: this.hoSoHDDT
              },
              nzFooter: null
            });

            modal.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
              if (rs) {
                this.modal.destroy(rs);
              }
              else{
                modal.destroy(false);
                this.modal.destroy(null);
              }
            });
          }
        });
      }
    }
    else if (rawValue.mLTDiep == 300)
    {
      this.modal.destroy();
      console.log("🚀 ~ file: add-thong-diep-gui-modal.component.ts:376 ~ AddThongDiepGuiModalComponent ~ next ~ this.isExistAcceptedRegister", this.isExistAcceptedRegister)

      if(!this.isExistAcceptedRegister)
        this.modalService.create({
        nzContent: MessageBoxModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzKeyboard: false,
        nzStyle: { top: '100px' },
        nzBodyStyle: { padding: '1px' },
        nzWidth: '430px',
        nzComponentParams: {
          msMessageType: MessageType.Confirm,
          msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
          msOKText: TextGlobalConstants.TEXT_CONFIRM_ACCEPT,
          msOkButtonInBlueColor: true,
          msTitle: 'Lập tờ khai đăng ký sử dụng',
          msContent: `<div>Không thể tạo ký hiệu hóa đơn do chưa tồn tại tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử được cơ quan thuế chấp nhận.</div>
          <br />
          <div>Bạn có muốn lập tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử không?</div>`,
          msOnOk: () => {
            this.hoSoHDDTService.GetDetail().subscribe((rs: any) => {
              if (!rs || !rs.tenDonVi || rs.tenDonVi == '' || !rs.diaChi || rs.diaChi == '' || !rs.phuongPhapTinhThueGTGT || !rs.coQuanThueQuanLy || !rs.coQuanThueCapCuc) {
                if (this.thaoTacNNTs.indexOf('SYS_VIEW') >= 0 || this.permission == true) {
                  this.modalService.create({
                    nzContent: MessageBoxModalComponent,
                    nzMaskClosable: false,
                    nzClosable: false,
                    nzKeyboard: false,
                    nzStyle: { top: '100px' },
                    nzBodyStyle: { padding: '1px' },
                    nzWidth: '430px',
                    nzComponentParams: {
                      msMessageType: MessageType.Warning,
                      msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                      msTitle: 'Kiểm tra lại',
                      msContent: `Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại!`,
                      msHasThongTinNNT: true,
                      msButtonLabelThongTinNNT: "Xem thông tin người nộp thuế tại đây",
                      msOnCapNhatThongTinNNT: () => {
                        window.location.href = "he-thong/thong-tin-nguoi-nop-thue";
                      },
                      msOnClose: () => {
                        return;
                      }
                    },
                    nzFooter: null
                  });

                }
                else {
                  this.userService.getAdminUser().subscribe((rs: any[]) => {
                    let content = '';
                    if (rs && rs.length > 0) {
                      if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                      }
                      else {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> hoặc người dùng <b class='cssyellow'>${rs.map(x => x.fullName).join(", ")}</b> có quyền <b>Quản trị</b> để được phân quyền.`
                      }
                    }
                    else {
                      if (this.thaoTacNNTs.indexOf('SYS_UPDATE') >= 0) {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
                      }
                      else {
                        content = `<div>Thông tin người nộp thuế chưa nhập đầy đủ thông tin bắt buộc. Vui lòng kiểm tra lại.
                        <br>
                        Bạn không có quyền <b>Xem</b> và <b>Sửa</b> thông tin người nộp thuế. Để xem thông tin người nộp thuế, vui lòng liên hệ với <b>Quản trị hệ thống</b> để được phân quyền.`
                      }
                    }

                    this.modalService.create({
                      nzContent: MessageBoxModalComponent,
                      nzMaskClosable: false,
                      nzClosable: false,
                      nzKeyboard: false,
                      nzStyle: { top: '100px' },
                      nzBodyStyle: { padding: '1px' },
                      nzWidth: '430px',
                      nzComponentParams: {
                        msMessageType: MessageType.Warning,
                        msCloseText: TextGlobalConstants.TEXT_CONFIRM_CLOSE,
                        msTitle: 'Kiểm tra lại',
                        msContent: content,
                        msOnClose: () => {
                          return;
                        }
                      },
                      nzFooter: null
                    });
                  })
                }
              }
              else {
                this.tabThongDiepGuiComponent.clickThem();
              }

            })
          },
          msOnClose: () => { }
        },
        nzFooter: null
      }); else {
        const modal = this.ActivedModal = this.modalService.create({
          nzTitle: `Thông báo hóa đơn điện tử có sai sót`,
          nzContent: ThongBaoHoaDonSaiSotModalComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzKeyboard: false,
          nzWidth: '100%',
          nzStyle: { top: '0px' },
          nzBodyStyle: { padding: '1px' },
          nzComponentParams: {
            loaiThongBao: this.mainForm.get('loaiThongBao').value,
            callBackAfterClosing: this.callBackAfterClosing
          },
          nzFooter: null
        });
  
        modal.afterClose.subscribe((rs: any) => {
          this.ActivedModal = null;
          if (rs) {
            this.modal.destroy(rs);
          }
          else modal.destroy(false)
        });
      }

    }
  }

  ngAfterViewChecked(){

  }

  destroyModal(){
    this.modal.destroy();
  }
}
