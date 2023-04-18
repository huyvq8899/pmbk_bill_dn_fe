import { AbstractControl } from "@angular/forms";
import { CookieConstant } from "../constants/constant";

export function CheckValidMst(c: AbstractControl) {
    if (!c.value) {
        return null;
    }

    const mstPattern1 = "^[0-9\-]{10}$";
    const mstPattern2 = "^[0-9\-]{14}$";
    if ((!c.value.match(mstPattern1) && !c.value.match(mstPattern2) && c.value != '')) {
        return { invalid: true };
    } 
    
    return null;
}

export function CheckValidMst2(c: AbstractControl) {
    if (!c.value) {
        return null;
    }

    if ((c.value.length >= 15)) {
        return { invalidLength: true };
    } 
    
    return null;
}

export function CheckValidCCCD(c: AbstractControl) {
    if (!c.value) {
        return null;
    }

    const mstPattern1 = "^[0-9\-]{9}$";
    const mstPattern2 = "^[0-9\-]{12}$";
    if ((!c.value.match(mstPattern1) && !c.value.match(mstPattern2) && c.value != '')) {
        return { invalid: true };
    } 
    
    return null;
}
