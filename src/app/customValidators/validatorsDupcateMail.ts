import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
// tslint:disable-next-line: no-unused-expression
export function ValidatorsDupcateMail(userService: UserService, currentEmail: string): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.checkMail(c.value).pipe(
      map(res => {
        if (c.value.toLowerCase().trim() === currentEmail.toLowerCase().trim()) {
          return null;
        }
        // tslint:disable-next-line: object-literal-key-quotes
        return res ? { 'checkMail': true } : null;
      })
    );
  };
}
