import { AbstractControl } from '@angular/forms';

export function NoWhitespaceValidator(c: AbstractControl) {
    if (c !== null) {
        const isWhitespace = (c.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    return null;
}
