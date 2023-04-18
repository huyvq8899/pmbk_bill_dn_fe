import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[greaterThanValidator]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: GreaterThanValidatorDirective, multi: true }
    ]
})
export class GreaterThanValidatorDirective implements Validator, OnInit {
    @Input("greaterThanNum") greaterThanNum: number;
    @Input('noValidation') noValidation: boolean;

    ngOnInit() { }

    validate(c: FormControl) {
        let val = c.value;

        if (this.noValidation === true) {
          return;
        }

        if (val != null && val <= this.greaterThanNum) {
          return { 'greaterThan': true, 'greaterThanNum': this.greaterThanNum }
        }

        return null;
    }
}