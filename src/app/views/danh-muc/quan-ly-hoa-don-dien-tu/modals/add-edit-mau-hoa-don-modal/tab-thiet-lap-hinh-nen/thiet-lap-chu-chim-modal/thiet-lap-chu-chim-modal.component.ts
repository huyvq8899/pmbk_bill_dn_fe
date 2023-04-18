import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ESCDanhMucKeyEventHandler } from 'src/app/shared/KeyboardEventHandler';
import { dataURLtoFile } from 'src/app/shared/SharedFunction';
declare let html2canvas: any;

@Component({
  selector: 'app-thiet-lap-chu-chim-modal',
  templateUrl: './thiet-lap-chu-chim-modal.component.html',
  styleUrls: ['./thiet-lap-chu-chim-modal.component.scss']
})
export class ThietLapChuChimModalComponent extends ESCDanhMucKeyEventHandler implements OnInit, AfterViewInit {
  @Input() data: any;
  form: any;
  coChus: number[] = [];
  html = '';
  spinning = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalRef,
    private modalService: NzModalService
  ) {
    super();
  }

  ngOnInit() {
    this.form = Object.assign({}, this.data);

    this.form.kieuChuChim = this.form.kieuChuChim || 'Arial';
    this.form.coChuChim = this.form.coChuChim || 80;
    this.form.boldChuChim = this.form.boldChuChim || false;
    this.form.italicChuChim = this.form.italicChuChim || false;
    this.form.mauChuChim = this.form.mauChuChim || '#000000';
    this.form.doNetChuChim = this.form.doNetChuChim || 0.35;
    this.form.doNetChuChimPer = this.form.doNetChuChimPer || 35;
    this.form.noiDungChuChim = this.form.noiDungChuChim || null;
    this.form.loaiHinhNenRieng = 2;

    for (let i = 30; i <= 200; i += 2) {
      this.coChus.push(i);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setStyleInput('txtNoiDungChuChim');
      this.setColorIconPicker();
    }, 0);
  }

  submitForm() {
    this.spinning = true;
    this.html = this.buildHTMLFromValue();
    this.setStyleInput('innerHTMLNoiDungChuChim');
  }

  closeModal() {
    this.modal.destroy();
  }

  changeKieuChu(event: any) {
    this.form.kieuChuChim = event;
    this.setStyleInput('txtNoiDungChuChim');
  }

  changeCoChu(event: any) {
    this.form.coChuChim = event;
    this.setStyleInput('txtNoiDungChuChim');
  }

  afterChangeOpacity(event: any) {
    this.form.doNetChuChim = event / 100;
    this.setStyleInput('txtNoiDungChuChim');
  }

  setStyleInput(id: any) {
    setTimeout(() => {
      const element = document.getElementById(id);
      element.style.setProperty('font-size', `${this.form.coChuChim}px`, 'important');
      element.style.setProperty('font-family', `${this.form.kieuChuChim}`, 'important');
      element.style.setProperty('font-weight', `${this.form.boldChuChim ? 'bold' : 'normal'}`, 'important');
      element.style.setProperty('font-style', `${this.form.italicChuChim ? 'italic' : 'unset'}`, 'important');
      element.style.setProperty('color', `${this.form.mauChuChim}`, 'important');
      element.style.setProperty('opacity', `${this.form.doNetChuChim}`, 'important');

      if (id === 'txtNoiDungChuChim') {
        element.focus();
      }

      if (id === 'innerHTMLNoiDungChuChim') {
        element.style.setProperty('max-width', `${720}px`);
        element.style.setProperty('padding-top', `${this.form.coChuChim}px`);
        element.style.setProperty('white-space', 'break-spaces');

        html2canvas(element, {
          // allowTaint: true,
          // backgroundColor: null,
          // height: 300
        }).then(canvas => {
          var imgData = canvas.toDataURL("image/png");

          var myImage = new Image();
          myImage.crossOrigin = "Anonymous";
          var _this = this;
          myImage.onload = function () {
            var imageData = _this.removeImageBlanks(myImage); //Will return cropped image data
            var file = dataURLtoFile(imageData, 'chu-chim.png');
            _this.spinning = false;
            _this.modal.destroy({
              files: [file],
              data: _this.form
            });
          }
          myImage.src = imgData;
        });
      }
    }, 0);
  }

  removeImageBlanks(imageObject) {
    let imgWidth = imageObject.width;
    let imgHeight = imageObject.height;
    var canvas = document.createElement('canvas');
    canvas.setAttribute("width", imgWidth);
    canvas.setAttribute("height", imgHeight);
    var context = canvas.getContext('2d');
    context.drawImage(imageObject, 0, 0);

    var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
      data = imageData.data,
      getRBG = function (x, y) {
        var offset = imgWidth * y + x;
        return {
          red: data[offset * 4],
          green: data[offset * 4 + 1],
          blue: data[offset * 4 + 2],
          opacity: data[offset * 4 + 3]
        };
      },
      isWhite = function (rgb) {
        // many images contain noise, as the white is not a pure #fff white
        return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
      },
      scanY = function (fromTop) {
        var offset = fromTop ? 1 : -1;

        // loop through each row
        for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

          // loop through each column
          for (var x = 0; x < imgWidth; x++) {
            var rgb = getRBG(x, y);
            if (!isWhite(rgb)) {
              if (fromTop) {
                return y;
              } else {
                return Math.min(y + 1, imgHeight);
              }
            }
          }
        }
        return null; // all image is white
      },
      scanX = function (fromLeft) {
        var offset = fromLeft ? 1 : -1;

        // loop through each column
        for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

          // loop through each row
          for (var y = 0; y < imgHeight; y++) {
            var rgb = getRBG(x, y);
            if (!isWhite(rgb)) {
              if (fromLeft) {
                return x;
              } else {
                return Math.min(x + 1, imgWidth);
              }
            }
          }
        }
        return null; // all image is white
      };

    var cropTop = scanY(true) - 5;
    var cropBottom = scanY(false);
    var cropLeft = scanX(true);
    var cropRight = scanX(false);
    var cropWidth = cropRight - cropLeft;
    var cropHeight = cropBottom - cropTop;

    canvas.setAttribute("width", cropWidth + '');
    canvas.setAttribute("height", cropHeight + '');
    // finally crop the guy
    canvas.getContext("2d").drawImage(imageObject,
      cropLeft, cropTop, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight);

    var context2 = canvas.getContext('2d');
    context2.drawImage(canvas, 0, 0);

    var imageData2 = context2.getImageData(0, 0, cropWidth, cropHeight);
    const pix2 = imageData2.data;
    const newColor = { r: 0, g: 0, b: 0, a: 0 };
    for (var i = 0, n = pix2.length; i < n; i += 4) {
      var r = pix2[i],
        g = pix2[i + 1],
        b = pix2[i + 2];

      if (r >= 230 && g >= 230 && b >= 230) {
        // Change the white to the new color.
        pix2[i] = newColor.r;
        pix2[i + 1] = newColor.g;
        pix2[i + 2] = newColor.b;
        pix2[i + 3] = newColor.a;
      }
    }

    context2.putImageData(imageData2, 0, 0);

    return canvas.toDataURL();
  }

  setColorIconPicker() {
    setTimeout(() => {
      const element = document.querySelector('.color-icon') as HTMLElement;
      element.style.setProperty('color', `${this.form.mauChuChim}`, 'important');
    }, 0);
  }

  buildHTMLFromValue() {
    this.form.noiDungChuChim;

    let result = `<div id="innerHTMLNoiDungChuChim">`;

    result += (this.form.noiDungChuChim || '')

    result += '</div>';
    return result;
  }

  setBold() {
    this.form.boldChuChim = !this.form.boldChuChim;
    this.setStyleInput('txtNoiDungChuChim');
  }

  setItalic() {
    this.form.italicChuChim = !this.form.italicChuChim;
    this.setStyleInput('txtNoiDungChuChim');
  }

  changeColorPicker(event: any) {
    this.form.mauChuChim = event;
    this.setColorIconPicker();
    this.setStyleInput('txtNoiDungChuChim');
  }
}
