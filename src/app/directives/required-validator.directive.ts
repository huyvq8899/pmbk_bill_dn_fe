import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[requiredValidator]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: RequiredValidatorDirective, multi: true }
    ]
})
export class RequiredValidatorDirective implements Validator, OnInit {
    @Output() onInvalid = new EventEmitter<boolean>();

    ngOnInit() { }

    validate(c: FormControl) {
        let val = c.value;

        if (!val) {
          this.onInvalid.emit(true);
          return { 'required': true }
        }

        this.onInvalid.emit(false);
        return null;
    }
}