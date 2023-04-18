import { formatNumber } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { isNonEmptyString, NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { stringify } from 'querystring';
import { FilterColumn, FilterCondition, ThongDiepChungParams } from 'src/app/models/PagingParams';
import { HoaDonDienTuService } from 'src/app/services/quan-li-hoa-don-dien-tu/hoa-don-dien-tu.service';
import { QuyDinhKyThuatService } from 'src/app/services/QuyDinhKyThuat/quy-dinh-ky-thuat.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { UserService } from 'src/app/services/user.service';
import { FilterColumnComponent } from 'src/app/shared/components/filter-column/filter-column.component';
import { SumwidthConfig } from 'src/app/shared/global';
import { LichSuTruyenNhanDisplayXmldataComponent } from '../lich-su-truyen-nhan-display-xmldata/lich-su-truyen-nhan-display-xmldata.component';
import { ThongDiepGuiNhanCQTService } from 'src/app/services/quan-li-hoa-don-dien-tu/thong-diep-gui-nhan-cqt.service';
import { DownloadFile, getHeightBangKeKhongChiTiet5, getListEmptyBangKe2, getListEmptyBangKeKhongChiTiet3, getListEmptyBangKeKhongChiTiet5, getListEmptyChiTiet, showModalPreviewPDF } from "src/app/shared/SharedFunction";
import { TabShortKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { EnvService } from 'src/app/env.service';
import { TextGlobalConstants } from 'src/app/shared/TextGlobalConstants';
import { SharedService } from 'src/app/services/share-service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

export interface TreeNodeInterface {
  key: number;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  selected?: boolean;
}

export class dataShow {
  key: string;
  ngayGui: string;
  nguoiThucHien: string;
  maNoiGuiNhan: string;
  loaiThongDiep: string;
  trangThaiGui: string;
  thongDiep: string;
  statusName: string;
  linkXml: string;
  children: any[] = [];
}
@Component({
  selector: 'app-lich-su-truyen-nhan',
  templateUrl: './lich-su-truyen-nhan.component.html',
  styleUrls: ['./lich-su-truyen-nhan.component.scss']
})
export class LichSuTruyenNhanComponent extends TabShortKeyEventHandler implements OnInit {
  clickThem() {
    throw new Error('Method not implemented.');
  }
  clickXem() {
    throw new Error('Method not implemented.');
  }
  clickSua(isCopy: any) {
    throw new Error('Method not implemented.');
  }
  clickXoa() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('filterColumnTemp', { static: false }) filterColumnTemp: FilterColumnComponent;
  @Input() data: any;
  @Input() dataThongTinChung: any;//sử dụng cho thông điệp trên 300
  @Input() maTD: any;
  @Input() loaiTD: any;
  @Input() showForm: boolean;
  mainForm: FormGroup;
  spinning = false;
  listThongDiepChung: any[] = [];
  listDuLieu: dataShow[] = [];
  listOfSelected: any[] = [];
  dataSelected = null;
  listData = [];
  listHoaDon = [];
  loading = false;
  total = 0;
  listDSRutGonBoKyHieuHoaDon: any[] = [];
  hinhThucHoaDonShow: any;
  uyNhiemLapHoaDon = '';
  widthConfig = ['80px', '100px', '100px', '140px', '300px', '350px', '250px', '150px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  // filter col
  filterGeneralVisible = false;
  mapOfVisbleFilterCol: any = {};
  mapOfHightlightFilter: any = {};
  inputFilterColData: FilterColumn = null;
  viewConditionList: Array<{ key: any, label: any, value: any }> = [];
  isFitering = false;
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  pageSizeOptions = [];
  params: ThongDiepChungParams = {
    PageNumber: 1,
    PageSize: 100,
    Keyword: '',
    SortKey: '',
    filterColumns: [],
    userId: ''
  };
  paramsDefault: ThongDiepChungParams = Object.assign({}, this.params);
  displayDataRaw: ThongDiepChungParams = Object.assign({}, this.params);
  loaiThongDieps = [
    { id: 200, type: 1, name: "200 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã " },
    { id: 201, type: 1, name: "201 - Thông điệp gửi hóa đơn điện tử tới cơ quan thuế để cấp mã theo từng lần phát sinh" },
    { id: 203, type: 1, name: "203 - Thông điệp chuyển dữ liệu hóa đơn điện tử không mã đến cơ quan thuế" },
    { id: 206, type: 1, name: "206 - Thông điệp gửi hóa đơn khởi tạo từ máy tính tiền đã cấp mã tới cơ quan thuế." },
    { id: 300, type: 2, name: "300 - Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót" },
    { id: 202, type: 3, name: "202 - Thông điệp thông báo kết quả cấp mã hóa đơn điện tử của cơ quan thuế" },
    { id: 204, type: 3, name: "204 - Thông điệp thông báo mẫu số 01/TB-KTDL về việc kết quả kiểm tra dữ liệu hóa đơn điện tử" },
    { id: 205, type: 3, name: "205 - Thông điệp phản hồi về hồ sơ đề nghị cấp hóa đơn điện tử có mã của cơ quan thuế theo từng lần pháp sinh." },
    { id: 301, type: 4, name: "301 - Thông điệp gửi thông báo về việc tiếp nhận và kết quả xử lý về việc hóa đơn điện tử đã lập có sai sót" },
    { id: 302, type: 4, name: "302 - Thông điệp thông báo về hóa đơn điện tử cần rà soát" },
    { id: 303, type: 4, name: "303 - Thông điệp thông báo về hóa đơn điện tử đã lập có sai sót từ máy tính tiền" },
    { id: 400, type: 10, name: "400 - Thông điệp bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế" },
    { id: 999, type: 5, name: "999 - Thông điệp phản hồi kỹ thuật" },
    { id: 100, type: 6, name: "100 - Thông điệp gửi tờ khai đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
    { id: 101, type: 7, name: "101 - Thông điệp gửi tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 102, type: 8, name: "102 - Thông điệp thông báo về việc tiếp nhận/không tiếp nhận tờ khai đăng ký/thay đổi thông tin sử dụng HĐĐT, tờ khai đăng ký thay đổi thông tin đăng ký sử dụng HĐĐT khi ủy nhiệm/nhận ủy nhiệm lập hóa đơn" },
    { id: 103, type: 9, name: "103 - Thông điệp thông báo về việc chấp nhận/không chấp nhận đăng ký/thay đổi thông tin sử dụng hóa đơn điện tử" },
    { id: 400, type: 10, name: "400 - Thông điệp bảng tổng hợp dữ liệu hóa đơn điện tử gửi cơ quan thuế" },
  ];
  textButtonMoRongThuGon = 'Thu gọn';
  ptChuyenDL = 0;
  phanLoaiHDSaiSot = 0;
  trangThaiQuyTrinh=-1;
  isPhieuXuatKho = false;
  message: any;
  constructor(
    private fb: FormBuilder,
    private hoaDonDienTuService: HoaDonDienTuService,
    private modal: NzModalRef,
    private duLieuGuiHDDTService: ThongDiepGuiDuLieuHDDTService,
    private quyDinhKyThuatService: QuyDinhKyThuatService,
    private userService: UserService,
    private modalService: NzModalService,
    private thongDiepGuiNhanCQTsv: ThongDiepGuiNhanCQTService,
    private env: EnvService,
    private messager: NzMessageService,
    private quyDinhKyThuatsv: QuyDinhKyThuatService,
    private sharedService: SharedService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const _url = this.router.url;
    if(_url.includes('phieu-xuat-kho')){
      this.isPhieuXuatKho = true;
    }
    
    if (this.data != null) {
      if (this.data[0].boKyHieuHoaDon) {
        this.ptChuyenDL = this.data[0].boKyHieuHoaDon.phuongThucChuyenDL;
      }

      this.loadData();
      if (this.showForm) this.createForm();
    }
  }
  createForm() {
    //cài đặt giá trị ủy nhiệm lập hóa đơn
    var data = this.data[0];
    console.log(data);
    this.trangThaiQuyTrinh = data.trangThaiQuyTrinh;
    this.mainForm = this.fb.group({
      kyHieuShow: [{ value: data != null ? data.mauSo + data.kyHieu : null, disabled: true }],
      tongTienThanhToanShow: [{ value: data != null ? formatNumber(Number(data.tongTienThanhToan), 'vi-VN', '1.0-0') + ' ' + data.loaiTien.ma : null, disabled: true }],
      mauSoShow: [{ value: data != null ? data.mauSo : null, disabled: true }],
      soHoaDonShow: [{ value: data != null ? (data.soHoaDon ? data.soHoaDon : '<Chưa cấp số>') : null, disabled: true }],
      ngayHoaDonShow: [{ value: data != null ? moment(data.ngayHoaDon).format("DD/MM/YYYY") : null, disabled: true }],
      tenKhachHangShow: [{ value: data != null ? data.tenKhachHang : null, disabled: true }],
    });


  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = true;
          this.collapse(array, target, true);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  sort(sort: { key: string; value: string }): void {
    this.params.SortKey = sort.key;
    this.params.SortValue = sort.value;
    this.loadData();
  }

  onVisibleFilterCol(event: any, colName: any, template: any) {
    this.mapOfVisbleFilterCol[colName] = event;

    this.inputFilterColData = this.params.filterColumns.find(x => x.colKey === colName) || null;

    if (!this.inputFilterColData) {
      this.inputFilterColData = {
        colKey: colName,
        colValue: null,
        filterCondition: FilterCondition.Chua,
        isFilter: false
      };
      this.params.filterColumns.push(this.inputFilterColData);
    }

    if (template) {
      (template as FilterColumnComponent).inputData(this.inputFilterColData);
    }
  }
  onFilterCol(rs: any) {
    const filterColData = this.params.filterColumns.find(x => x.colKey === rs.colKey);
    if (filterColData) {
      this.mapOfVisbleFilterCol[rs.colKey] = false;
      this.mapOfHightlightFilter[rs.colKey] = filterColData.isFilter;
    }

    this.loadViewConditionList();
  }
  loadViewConditionList() {
    this.viewConditionList = [];

    console.log(this.params);

    console.log(this.viewConditionList);


    if (this.viewConditionList.length > 1 || this.params.Ky !== 5) {
      this.isFitering = true;
    } else {
      this.isFitering = false;
    }
    this.loadData(true);
  }
  loadData(reset = false) {
    if (reset === true) {
      this.params.PageNumber = 1;
    }
    this.loading = true;
    if (this.loaiTD != 100) {
      if (this.data[0].maTraCuu != null) {
        this.quyDinhKyThuatService.GetThongDiepThemMoiToKhaiDuocChapNhan_TraCuu(this.data[0].maTraCuu).subscribe((td: any) => {
          if (td != null) {
            // if (td.toKhaiKhongUyNhiem.dltKhai.ndtKhai.pThuc.cdDu == 1) this.ptChuyenDL = 0;
            // else this.ptChuyenDL = 1;
          }
        });
      }

      this.data.forEach((valHd, ind) => {
        this.params.LoaiThongDiep = 0;
        this.params.Keyword = valHd.hoaDonDienTuId;
        console.log('this.params: ', this.params);
        this.duLieuGuiHDDTService.GetByHoaDonDienTuId(this.params).subscribe(async (res: any) => {
          console.log('duLieuGuiHDDTService: ');
          console.log(res);

          this.loading = false;
          if (res.items.length > 0) {
            var seen = {};
            this.listData = res.items.filter(function (item) {
              if (seen.hasOwnProperty(item.thongDiepChungId)) {
                return false;
              } else {
                seen[item.thongDiepChungId] = true;
                return true;
              }
            });
            this.total = res.totalCount;
            this.params.PageNumber = res.currentPage;
            console.log(this.listData);
            this.listData.forEach((val, ind) => {
              if ((val.maLoaiThongDiep == 300 || val.maLoaiThongDiep == 303) && this.showForm) {
                let param = { thongDiepGuiCQTId: this.data[0].thongDiepGuiCQTId };

                this.thongDiepGuiNhanCQTsv.GetThongDiepGuiCQTById(param).subscribe((res: any) => {
                  console.log(res);
                  this.phanLoaiHDSaiSot = res.thongDiepChiTietGuiCQTs.find(x=>x.hoaDonDienTuId == this.data[0].hoaDonDienTuId).phanLoaiHDSaiSot;
                })
              }
              if (this.maTD == val.maThongDiep) {
                this.selectedRow(val);
              } else {
                val.children.forEach((valChid, ind) => {
                  if (this.maTD == valChid.maThongDiep) {
                    this.selectedRow(valChid);
                  }
                });
              }
              this.mapOfExpandedData[val.key] = this.convertTreeToList(val);
            });
          }
        }
        );
      })
    } else {
      this.loading = false;
      this.listData = this.data[0].result;
      var par = this.params;
      console.log('Listtt: ');
      console.log(this.data[0].result);
      this.data[0].result[0].children.sort(function (a, b) {
        console.log(par);
        if (par.SortKey != '' && par.SortValue == 'ascend') {
          if (a.ngayThongBao < b.ngayThongBao) {
            return -1;
          }
          if (a.ngayThongBao > b.ngayThongBao) {
            return 1;
          }
          return 0;
        } else {
          if (a.ngayThongBao < b.ngayThongBao) {
            return 1;
          }
          if (a.ngayThongBao > b.ngayThongBao) {
            return -1;
          }
          return 0;
        }
      })
      this.total = this.listData.length;

      this.listData.forEach((val, ind) => {
        if (this.maTD == val.maThongDiep) {
          this.selectedRow(val);
        } else {
          val.children.forEach((valChid, ind) => {
            if (this.maTD == valChid.maThongDiep) {
              this.selectedRow(valChid);
            }
          });
        }
        this.mapOfExpandedData[val.key] = this.convertTreeToList(val);
      });
    }


  }
  getLoaiThongDiep(maLoaiThongDiep) {
    let loaiThongDiep = '';
    this.loaiThongDieps.forEach((val, ind) => {
      if (maLoaiThongDiep == val.id) loaiThongDiep = val.name;
    });
    return loaiThongDiep;
  }

  displayXmlData(files: any) {
    console.log("🚀 ~ file: lich-su-truyen-nhan.component.ts ~ line 371 ~ LichSuTruyenNhanComponent ~ displayXmlData ~ files", files)
    const modal1 = this.modalService.create({
      nzTitle: "Chi tiết",
      nzContent: LichSuTruyenNhanDisplayXmldataComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzKeyboard: false,
      nzWidth: window.innerWidth / 100 * 80,
      nzStyle: { top: '10px' },
      nzBodyStyle: { padding: '1px' },
      nzComponentParams: {
        fileData: files,
      },
      nzFooter: null
    });
    modal1.afterClose.subscribe((rs: any) => {

    });
  }
  selectedRow(data: any) {
    if (this.listOfSelected.length === 0) {
      this.dataSelected = data;
      data.selected = true;

      let entries = Object.entries(this.mapOfExpandedData);
      for (const [prop, val] of entries) {
        const list = val;
        for (const item of list) {
          if (!this.dataSelected) {
            item.selected = false;
          } else {
            if (this.dataSelected.key !== item.key) {
              item.selected = false;
            }
          }
        }
      }
    }
  }
  destroyModal() {
    this.modal.destroy();
  }
  downloadFileXML(data: any) {
    console.log(data);
    /// decode xml
    var dataInput = window.btoa(unescape(encodeURIComponent(data.fileXML)));
    /// Create file xml to download
    this.thongDiepGuiNhanCQTsv.GetFileXMLSigned(dataInput, moment(data.createdDate).format("YYYYMMDD-hhmmss")).subscribe((res: any) => {
      if (res.result != '' && res.result != null) {
        ////// Get file
        this.thongDiepGuiNhanCQTsv.GetLinkFileXml(res.result.fileName).subscribe((res1: any) => {
          if (res1.result != '' && res1.result != null) {
            var url = `${this.env.apiUrl}${res1.result}`;
            /// download file by fileName
            this.thongDiepGuiNhanCQTsv.DownloadFile(url).subscribe(blob => {
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = `${res.result.fileName}`;
              a.click();
              URL.revokeObjectURL(objectUrl);
            });
          }
          else {
            this.message.error(TextGlobalConstants.TEXT_ERROR_API);
            return;
          }
        })
      }
      else {
        this.message.error(TextGlobalConstants.TEXT_ERROR_API);
        return;
      }
    })
  }
  viewReceipt(data: any = null) {
    const id = this.messager.loading('Loading...', { nzDuration: 0 }).messageId;
    switch (data.maLoaiThongDiep) {
      case 102:
      case 103:
        this.quyDinhKyThuatsv.ConvertThongDiepToFilePDF(data).subscribe((rs: any) => {
          console.log(rs);
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.messager.remove(id);
        }, (err) => {
          this.messager.warning("Có lỗi xảy ra");
          this.messager.remove(id);
        });
        break;
      case 301:
        this.thongDiepGuiNhanCQTsv.GetPdfFile301(data.thongDiepChungId).subscribe((rs: any) => {
          console.log(rs);
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          showModalPreviewPDF(this.modalService, pathPrint);
          this.messager.remove(id);
        }, (err) => {
          this.messager.warning("Có lỗi xảy ra");
          this.messager.remove(id);
        });
        break;
      default: break;
    }
  }
  downloadPDF(data: any) {
    this.loading = true;

    switch (data.maLoaiThongDiep) {
      case 102:
      case 103:
        this.quyDinhKyThuatsv.ConvertThongDiepToFilePDF(data).subscribe((rs: any) => {
          const fileName = rs.pdfName;
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          this.sharedService.DownloadPdf(pathPrint).subscribe((rs) => {
            saveAs(rs, fileName);
            this.loading = false;
          });
        });
        break;
      case 301:
        this.thongDiepGuiNhanCQTsv.GetPdfFile301(data.thongDiepChungId).subscribe((rs: any) => {
          const fileName = rs.pdfName;
          const pathPrint = this.env.apiUrl + `/${rs.filePDF}`;
          this.sharedService.DownloadPdf(pathPrint).subscribe((rs) => {
            saveAs(rs, fileName);
            this.loading = false;
          });
        });
        break;
      default: break;
    }

  }
}
