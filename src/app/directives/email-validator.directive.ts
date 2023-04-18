import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { getRepeatLetterSpecific } from '../shared/SharedFunction';

@Directive({
  selector: '[emailValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }
  ]
})
export class EmailValidatorDirective implements Validator, OnInit {
  @Output() onInvalid = new EventEmitter<boolean>();
  
  ngOnInit() { }

  validate(c: FormControl) {
    if (!c.value) {
      return null;
    }

    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emails = c.value.split(';');
    const checkRepeat = getRepeatLetterSpecific(';', c.value.split(''));
    if (checkRepeat) {
      this.onInvalid.emit(true);
      return { invalid: true, email: checkRepeat };
    }

    for (const email of emails) {
      if (email) {
        if (!email.match(emailPattern)) {
          this.onInvalid.emit(true);
          return { invalid: true, email };
        }
      }
    }

    this.onInvalid.emit(false);
    return null;
  }
}