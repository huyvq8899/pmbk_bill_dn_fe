import { Directive, DoCheck, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[switchSelect]'
})
export class SwitchSelectDirective implements OnInit {
    @Input() blockButton: boolean;

    constructor(private el: ElementRef, private ngControl: NgControl) { }

    ngOnInit(): void {
        this.ngControl.valueChanges.subscribe((val: any) => {
            let radioButton = this.el.nativeElement.getElementsByClassName("ant-radio-button-wrapper");
            for (let i = 0; i < radioButton.length; ++i) {
                let el = radioButton[i] as HTMLElement;
                let nzvalue = radioButton[i].getAttribute('data-value');
                if (val == nzvalue) {
                    el.classList.remove('switchSelectHover');
                } else {
                    el.classList.add('switchSelectHover');
                }
            }

            if (this.blockButton === true) {
                this.el.nativeElement.style.display = 'flex';
                var buttonRadios = this.el.nativeElement.querySelectorAll('.ant-radio-button-wrapper');
                buttonRadios.forEach((element: any) => {
                    element.style.width = '100%';
                });
            }
        });
    }
}
