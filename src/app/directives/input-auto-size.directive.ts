import { Directive, DoCheck, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

interface Options {
  align?: string;
  allowNegative?: boolean;
  precision?: number;
  maxIntegerDigit?: number;
}

@Directive({
  selector: '[inputAutoSize]'
})
export class InputAutoSizeDirective implements OnInit, DoCheck {
  constructor(private el: ElementRef, private ngControl: NgControl) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.styleInput();
    }, 0);

    setTimeout(() => {
      this.ngControl.valueChanges.subscribe((res: any) => {
        this.styleInput();
      });
    }, 0);
  }

  ngDoCheck(): void {
    // this.styleInput();
  }

  styleInput() {
    var element = this.el.nativeElement;
    element.style.overflowY = 'hidden';

    if (element.value) {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
      element.style.maxHeight = element.scrollHeight + 'px';
    } else {
      element.style.height = '24px';
      element.style.maxHeight = '24px';
    }
  }
}
