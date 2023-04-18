import { AbstractControl } from '@angular/forms';
import { getRepeatLetterSpecific } from '../shared/SharedFunction';
export function CheckValidEmail(c: AbstractControl) {
    if (!c.value) {
        return null;
    }
    
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emails = c.value.split(';');
    const checkRepeat = getRepeatLetterSpecific(';', c.value.split(''));
    if (checkRepeat) {
        return { invalid: true, email: checkRepeat };
    }
    
    for (const email of emails) {
        if (email) {
            if (!email.match(emailPattern)) {
                return { invalid: true, email };
            }    
        }
    }
    
    return null;
}

export function CheckValidSingleEmail(c: AbstractControl) {
    if (!c.value) {
        return null;
    }
    
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!c.value.match(emailPattern)) {
        return { invalid: true, email: c.value };
    }  
    
    return null;
}

