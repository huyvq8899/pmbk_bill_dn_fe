import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[tooltipInput]'
})
export class TooltipInputDirective {
  @Input() tooltipWidth = null;

  constructor(private el: ElementRef) {
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.display('block');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.display('none');
  }

  @HostListener('focus') onFocus() {
    this.display('block');
  }

  @HostListener('blur') onBlur() {
    this.display('none');
  }

  @HostListener('keypress') onKeypress() {
    this.display('none');
  }

  private display(value: any) {
    if (this.el.nativeElement) {
      var element = this.el.nativeElement as HTMLElement;
      var closest = element.closest('.ant-form-item-control') as HTMLElement;
      if (closest) {
        var errorContainer = closest.querySelector('.ant-form-explain') as HTMLElement;
        if (errorContainer) {
          errorContainer.style.display = value;
          if (this.tooltipWidth) {
            errorContainer.style.width = this.tooltipWidth + 'px';
          }
        }
      }
    }
  }
}
