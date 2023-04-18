import { AbstractControl, ValidatorFn } from '@angular/forms';

export function CheckDuplicateValidator(result: boolean): ValidatorFn {
    return (currentControl: AbstractControl): { [key: string]: any } => {
        return result === true ? { duplicate: true } : null;
    };
}
