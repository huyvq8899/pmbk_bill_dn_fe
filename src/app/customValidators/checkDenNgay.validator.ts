import { AbstractControl } from '@angular/forms';

export function CheckDenNgayValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const tuNgay = c.parent.get('tuNgay');
    const denNgay = c.parent.get('denNgay');

    if (!tuNgay || !denNgay) {
        return;
    }

    if (!denNgay.value) {
        return;
    }

    if (tuNgay.value >= denNgay.value) {
        return { lessThan: true };
    }
}
