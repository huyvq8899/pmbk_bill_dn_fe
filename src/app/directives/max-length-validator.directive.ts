import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[maxLengthValidator]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: MaxLengthValidatorDirective, multi: true }
    ]
})
export class MaxLengthValidatorDirective implements Validator, OnInit {
    @Input("maxLengthNum") maxLengthNum: number;
    isPaste: boolean;

    @HostListener('keydown', ['$event']) onKeydown(event: any) { 
        if (event.ctrlKey && event.key === 'v') {
            this.isPaste = true;
        }
    }

    ngOnInit() { }

    validate(c: FormControl) {
        let val = c.value;

        if (val && val.length > this.maxLengthNum) {
            val = val.substring(0, this.maxLengthNum);
            c.setValue(val);

            if (this.isPaste) {
                this.isPaste = false;
            } else {
                return { 'maxLength': true, 'maxLengthNum': this.maxLengthNum }
            }
        }

        return null;
    }
}