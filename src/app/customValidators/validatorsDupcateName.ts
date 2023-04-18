import { MauHoaDonService } from 'src/app/services/danh-muc/mau-hoa-don.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export function ValidatorsDupcateName(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl):
        Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return userService.checkUserName(control.value).pipe(
            map(res => {
                // tslint:disable-next-line: object-literal-key-quotes
                return (res === true) ? { 'checkUserName': true } : null;
            })
        );
    };
}

export function ValidatorsDupcateMauHoaDon(mauHoaDonService: MauHoaDonService): AsyncValidatorFn {
    return (control: AbstractControl):
    Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return mauHoaDonService.CheckTrungTenMauHoaDon1Async({ ten: control.value}).pipe(
            map(res => {
                // tslint:disable-next-line: object-literal-key-quotes
                return (res === true) ? { 'duplicate': true } : null;
            })
        );;
    };
}
