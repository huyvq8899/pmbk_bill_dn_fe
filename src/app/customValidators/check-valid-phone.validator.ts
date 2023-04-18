import { AbstractControl } from '@angular/forms';
import { getRepeatLetterSpecific } from '../shared/SharedFunction';
export function CheckValidPhone(c: AbstractControl) {
    if (!c.value) {
        return null;
    }

    const phonePattern = "^[0-9]{10}$";
    const phonePattern1 = "^[0-9]{11}$";
    const phones = c.value.split(';');
    const checkRepeat = getRepeatLetterSpecific(';', c.value.split(''));
    if (checkRepeat) {
        return { invalid: true, phone: checkRepeat };
    }

    for (const phone of phones) {
        if (phone) {
            console.log(phone.length)
            if (!phone.match(phonePattern) && !phone.match(phonePattern1)) {
                return { invalid: true, phone };
            }
        }
    }

    return null;
}

export function CheckValidSinglePhone(c: AbstractControl) {
    if (!c.value) {
        return null;
    }

    const phonePattern = "^[0-9]{10}$";
    const phonePattern1 = "^[0-9]{11}$";
    if (!c.value.match(phonePattern) && !c.value.match(phonePattern1)) {
        return { invalid: true, phone: c.value };
    }

    return null;
}
