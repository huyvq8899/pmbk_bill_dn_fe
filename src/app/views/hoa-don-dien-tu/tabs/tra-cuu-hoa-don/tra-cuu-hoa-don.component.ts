import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';

import * as moment from 'moment';
import { forkJoin, from } from 'rxjs';
import { SearchEngine } from 'src/app/shared/searchEngine';
import { PagingParams } from 'src/app/models/PagingParams';
import { CheckValidDateV2 } from 'src/app/shared/getDate';
import { GetKy } from 'src/app/shared/chon-ky';
import { CookieConstant } from 'src/app/constants/constant';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { SharedService } from 'src/app/services/share-service';
import { EnvService } from 'src/app/env.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { TraCuuHoaDonModalComponent } from '../../modals/tra-cuu-hoa-don-modal/tra-cuu-hoa-don-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChonThamSoTongHopGiaTriHoaDonDaSuDungModalComponent } from 'src/app/views/bao-cao/modals/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal/chon-tham-so-tong-hop-gia-tri-hoa-don-da-su-dung-modal.component';
import { mathRound } from 'src/app/shared/SharedFunction';
import { FormatPrice } from 'src/app/shared/formatPrice';
import { formatNumber } from '@angular/common';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { MessageBoxModalComponent, MessageType } from 'src/app/shared/modals/message-box-modal/message-box-modal.component';

@Component({
  selector: 'app-tra-cuu-hoa-don',
  templateUrl: './tra-cuu-hoa-don.component.html',
  styleUrls: ['./tra-cuu-hoa-don.component.scss']
})
export class TraCuuHoaDonComponent implements OnInit {
  logo = `${this.env.apiUrl}/images/img/logo.png`;
  images = [
    { source: this.env.apiUrl + "/images/img/bannerA.png", url: 'https://pmbk.vn/hoa-don-bk/' },
    { source: this.env.apiUrl + "/images/img/bannerB.png", url: 'https://pmbk.vn/hoa-don-bk/' },
  ];
  @Input() maTraCuu: string = null;
  searchCustomerOverlayStyle = {
    width: '200px'
  };
  traCuuBangMaForm: FormGroup;
  traCuuBangFileForm: FormGroup;
  loaiTraCuu: any;
  spinning: boolean;
  indeterminate = false;
  loading = false;
  formData: FormData;
  validExtentions = ['xml'];
  ActivedModal: any;
  selectedTab = 0;
  isFromPhone: boolean = false;

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private hoaDonDienTuService: HoaDonDienTuService,
    private sharedService: SharedService,
    private env: EnvService,
    private quyDinhKyThuatService: QuyDinhKyThuatService
  ) {
    this.isFromPhone = window.innerWidth < 768;
  }

  ngOnInit() {
    this.getMaTraCuu();
    console.log(this.router);
    console.log(this.maTraCuu);
    this.selectedTab = 0;
    this.loaiTraCuu = "code";
    this.createForm();
    this.formData = new FormData();
    this.isFromPhone = window.innerWidth < 768;

    //tìm kiếm khi quét mã qr-code của hóa đơn máy tính tiền
    const hoadonId = this.router.snapshot.queryParams['hoadon'];
    if (hoadonId) {
      this.hoaDonDienTuService.GetById_TraCuu(hoadonId).subscribe((res: any) => {
        if (res != null) {
          this.hoaDonDienTuService.ConvertHoaDonToFilePDF_TraCuu(res).subscribe((rs: any) => {
            const fileUrl = this.env.apiUrl + `/${rs.filePDF}`;
            var dataInp = res;
            dataInp.kyHieuShow = res.kyHieuHoaDon;
            dataInp.ngayHoaDonShow = moment(res.ngayHoaDon).format("DD/MM/YYYY");
            dataInp.tongTienThanhToanShow = `${formatNumber(Number(res.tongTienThanhToan), 'vi-VN', '1.0-0')} ${dataInp.maLoaiTien}`;

            const modal1 = this.ActivedModal = this.modalService.create({
              nzTitle: "Kết quả tra cứu hóa đơn",
              nzContent: TraCuuHoaDonModalComponent,
              nzMaskClosable: false,
              nzClosable: true,
              nzKeyboard: false,
              nzWidth: '100%',
              nzStyle: { top: '0px' },
              nzBodyStyle: { padding: '1px', height : '100%' },
              nzComponentParams: {
                data: dataInp,
                fileUrl: fileUrl,
                ptChuyenDL: 1,
                isFromPhone: this.isFromPhone
              },
              nzFooter: null
            });
            modal1.afterClose.subscribe((rs: any) => {
              this.ActivedModal = null;
            });
          });
        }
      });

    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event) {
      this.isFromPhone = window.innerWidth < 768;
    }
  }


  changeLoaiTraCuu() {
    this.traCuuBangFileForm.reset();
    this.traCuuBangMaForm.reset();
  }

  changeSelectTab(event: any) {
    if (event == 0) this.loaiTraCuu = "code";
    else this.loaiTraCuu = "file";
    this.changeLoaiTraCuu();
  }

  createForm() {
    this.traCuuBangMaForm = this.fb.group({
      maTraCuu: [this.maTraCuu != null ? this.maTraCuu : null, [Validators.required]]
    });

    this.traCuuBangFileForm = this.fb.group({
      fileTraCuu: [null, [Validators.required]]
    })
  }

  getMaTraCuu() {
    this.router.params.subscribe((params: any) => {
      console.log(params);
      if (params != null)
        this.maTraCuu = params["maTraCuu"];
    })
  }
  setValidator() {
    if (this.loaiTraCuu === 'code') {
      this.traCuuBangMaForm.clearAsyncValidators();
      this.traCuuBangMaForm.updateValueAndValidity();
      this.traCuuBangMaForm.get('maTraCuu').setValidators([Validators.required]);
      this.traCuuBangMaForm.get('maTraCuu').updateValueAndValidity();
    } else {
      this.traCuuBangFileForm.clearAsyncValidators();
      this.traCuuBangFileForm.updateValueAndValidity();
      this.traCuuBangFileForm.get('fileTraCuu').setValidators([Validators.required]);
      this.traCuuBangFileForm.get('fileTraCuu').updateValueAndValidity();
    }
  }

  id: any = null;
  submitForm() {
    this.setValidator();
    var ptChuyenDL = null;
    var fileUrl = "";
    if (this.loaiTraCuu == 'code') {
      var codeData = this.traCuuBangMaForm.getRawValue();
      if(codeData.maTraCuu && codeData.maTraCuu != ''){
        this.id = this.message.loading('Đang tra cứu, vui lòng chờ...', { nzDuration: 0 }).messageId;
        this.hoaDonDienTuService.TraCuuByMa(codeData.maTraCuu).subscribe((res: any) => {
          if (res != null) {
            console.log(res);
            fileUrl = this.env.apiUrl + `//${res.path}`;

            console.log(fileUrl);
            this.openKetQuaTraCuu(res.data, fileUrl);
          }
          else {
            if(this.id) this.message.remove(this.id);
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
                msTitle: `Không tìm thấy hóa đơn`,
                msContent: 'Không tìm thấy hóa đơn. Hãy thử lại sau.',
                msOnClose: () => {
                },
              }
            });
            return;
          }
        });
      }
    }
    else {
      this.id = this.message.loading('Đang tra cứu, vui lòng chờ...', { nzDuration: 0 }).messageId;
      this.hoaDonDienTuService.GetMaTraCuuInXml(this.formData).subscribe((code: any) => {
        if (code != null && code.soHoaDon != 0 && code.kyHieuHoaDon != '') {
          this.hoaDonDienTuService.TraCuuBySoHoaDon(code).subscribe((res: any) => {
            if (res != null) {
              console.log(res);
              fileUrl = this.env.apiUrl + `//${res.path}`;
              this.openKetQuaTraCuu(res.data, fileUrl);
            }
            else {
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
                  msTitle: `Không tìm thấy hóa đơn`,
                  msContent: 'Không tìm thấy hóa đơn. Hãy thử lại sau.',
                  msOnClose: () => {
                  },
                }
              });
              return;
            }
          });
        }
        else {
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
              msTitle: `Không tìm thấy hóa đơn`,
              msContent: 'Không tìm thấy số hóa đơn và ký hiệu hóa đơn. Hãy thử lại sau hoặc nạp lại file xml.',
              msOnClose: () => {
              },
            }
          });
          return;
        }
      })
    }

  }

  openKetQuaTraCuu(data: any, fileUrl: any) {
    console.log(data);
    if (data && fileUrl && data != '' && fileUrl != '') {
      if (this.ActivedModal != null) return;
      if(this.id) this.message.remove(this.id);
      var dataInp = data;
      dataInp.kyHieuShow = `${data.mauSo}${data.kyHieu}`
      dataInp.ngayHoaDonShow = moment(data.ngayHoaDon).format("DD/MM/YYYY");
      dataInp.tongTienThanhToanShow = `${formatNumber(Number(data.tongTienThanhToan), 'vi-VN', '1.0-0')} ${dataInp.maLoaiTien}`;

      const modal1 = this.ActivedModal = this.modalService.create({
        nzTitle: "Kết quả tra cứu hóa đơn",
        nzContent: TraCuuHoaDonModalComponent,
        nzMaskClosable: false,
        nzClosable: true,
        nzKeyboard: false,
        nzWidth: '100%',
        nzStyle: { top: '0px' },
        nzBodyStyle: { padding: '1px' },
        nzComponentParams: {
          data: dataInp,
          fileUrl: fileUrl,
          isFromPhone: this.isFromPhone
        },
        nzFooter: null
      });
      modal1.afterClose.subscribe((rs: any) => {
        this.ActivedModal = null;
      });
    }
  }

  chooseXml(event: any) {
    const files = event.target.files;

    this.traCuuBangFileForm.get('fileTraCuu').reset();
    this.traCuuBangFileForm.get('fileTraCuu').clearValidators();
    this.traCuuBangFileForm.get('fileTraCuu').setValidators([Validators.required]);
    this.traCuuBangFileForm.get('fileTraCuu').updateValueAndValidity();

    if (files && files[0]) {
      if (!this.checkExtension(event.target.files[0].name, this.validExtentions)) {
        this.message.warning('File không hợp lệ.');
        return;
      }

      this.traCuuBangFileForm.patchValue({
        fileTraCuu: event.target.files[0].name
      });

      this.formData.delete('file');
      this.formData.append('file', files[0]);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm();
    }
  }

  checkExtension(fileName: string, extentions: any) {
    return (new RegExp('(' + extentions.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
  }
}
