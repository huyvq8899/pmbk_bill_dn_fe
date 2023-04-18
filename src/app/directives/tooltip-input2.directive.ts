import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[tooltipInput2]'
})
export class TooltipInput2Directive {

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
      var closest = element.closest('.ant-form-item-children') as HTMLElement;
      if (closest) {
        var errorContainer = closest.querySelector('.invalid-msg-tooltip') as HTMLElement;
        if (errorContainer) {
          errorContainer.style.display = value;
        }
      }
    }
  }
}
