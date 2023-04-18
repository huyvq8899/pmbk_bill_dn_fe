import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AlertStartupService } from 'src/app/services/alert-startup.service';
import { AlertStartup } from 'src/app/models/alert-startup.model';

@Component({
  selector: 'app-thong-bao-start-modal',
  templateUrl: './thong-bao-start-modal.component.html',
  styleUrls: ['./thong-bao-start-modal.component.scss']
})
export class ThongBaoStartModalComponent implements OnInit {

  spinning = false;
  data: AlertStartup;
  titleAlert: string = '';
  contentAlert: string = '';
  subtitleAlert: string = '';
  linkAlert: string = '';
  constructor(
    private modal: NzModalRef,
    private modalService: NzModalService,
    private alertStartupService: AlertStartupService,
  ) {

  }
  ngOnInit() {
    this.spinning = true;
    this.alertStartupService.getAlertStartupActive().subscribe((rs: any) => {
      if (rs != null) {
        const element = document.getElementById("contentAlert");
        element.innerHTML = rs.content;
        this.titleAlert = rs.title.toUpperCase();
        this.contentAlert = rs.content;
        this.subtitleAlert = rs.subtitle;
        this.linkAlert = rs.link;
        this.data = rs;
      }
      this.spinning = false;

    },error => {
      console.log("getAlertStartupActive error");
    });
  }


  destroyModal() {
    this.modal.destroy(true);
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
}
