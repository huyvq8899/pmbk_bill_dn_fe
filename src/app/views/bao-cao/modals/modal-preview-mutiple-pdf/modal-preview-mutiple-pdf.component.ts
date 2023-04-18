import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { EnvService } from 'src/app/env.service';

@Component({
  selector: 'app-modal-preview-mutiple-pdf',
  templateUrl: './modal-preview-mutiple-pdf.component.html',
  styleUrls: ['./modal-preview-mutiple-pdf.component.scss']
})
export class ModalPreviewMutiplePdfComponent implements OnInit {
  @Input() data: any;
  fileUrl: string;
  domain = this.env.apiUrl;
  constructor(
    private message: NzMessageService,
    private modal: NzModalRef,
    private env: EnvService,
  ) { 
  }

  ngOnInit() {
    this.fileUrl = `${this.data.name}`;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if($event.keyCode == 27)
    {
      this.modal.destroy();
    }
  }
}
