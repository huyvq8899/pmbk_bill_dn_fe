import { AbstractControl } from '@angular/forms';
export function CheckChangePasswordConfirmValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const pwd = c.parent.get('password');
    const cpwd = c.parent.get('confirmPassword');

    if (!pwd || !cpwd) {
        return;
    }
    if (pwd.value !== cpwd.value) {
        return { notSame: true };
    }
}
