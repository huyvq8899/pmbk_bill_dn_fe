import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';
import { ThongDiepGuiDuLieuHDDTService } from 'src/app/services/QuyDinhKyThuat/thong-diep-gui-du-lieu-hddt.service';
import { SumwidthConfig } from 'src/app/shared/global';
import { DownloadFile } from 'src/app/shared/SharedFunction';

@Component({
  selector: 'app-ket-qua-thong-diep-gui-du-lieu-hddt.component',
  templateUrl: './ket-qua-thong-diep-gui-du-lieu-hddt.component.html',
  styleUrls: ['./ket-qua-thong-diep-gui-du-lieu-hddt.component.scss']
})
export class KetQuaThongDiepGuiDuLieuHDDTComponent implements OnInit{
  @Input() id: any;
  @Input() data: any;
  list: any[] = [];
  widthConfig = ['50px', '100px', '100px', '150px', '120px', '200px'];
  scrollConfig = { x: SumwidthConfig(this.widthConfig), y: '400px' };
  loadingExport = false;

  constructor(
    private env: EnvService,
    private modal: NzModalRef,
    private thongDiepGuiDuLieuHDDTService: ThongDiepGuiDuLieuHDDTService
  ) {
  }

  ngOnInit() {
    this.list = this.data.dLieu.tBao.dltBao.lhdkMa.dshDon;
  }
 
  closeModal() {
    this.modal.destroy();
  }

  export() {
    this.loadingExport = true;
    this.thongDiepGuiDuLieuHDDTService.ExportXMLKetQua(this.id)
      .subscribe((rs: any) => {
        const url = this.env.apiUrl + '/' + rs.result;
        DownloadFile(url, 'thong-diep.xml');
        this.loadingExport = false;
      });
  }
}
