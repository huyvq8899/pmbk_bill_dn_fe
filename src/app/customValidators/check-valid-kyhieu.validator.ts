import { AbstractControl } from '@angular/forms';
import { QuyDinhApDung } from '../enums/QuyDinhApDung.enum';

export function CheckValidKyHieu(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const value = c.value as string;
    if (!value) {
        return null;
    }

    const hinhThucHoaDonCanThayThe = c.parent.get('hinhThucHoaDonCanThayThe').value;

    if (hinhThucHoaDonCanThayThe == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }
    
        const alphas = ['T', 'D', 'L', 'M', 'N', 'B', 'G', 'H'];
    
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0) {
                if (element !== 'K' && element !== 'C') {
                    return { invalid: true };
                }
            } else if (i === 1 || i === 2) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else if (i === 3) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else {
                if (element.charCodeAt(0) < 65 || element.charCodeAt(0) > 90) {
                    return { invalid: true };
                }
            }
        }
    }
    else
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }

        const alphas = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0 || i === 1) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else if (i === 2) {
                if (element !== '/') {
                    return { invalid: true };
                }
            } else if (i === 3 || i === 4) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else {
                if (element !== 'E') {
                    return { invalid: true };
                }
            }
        }
    }

    return null;
    
    /* code cũ bỏ vì theo thông tư 78
    const quyDinhApDung = c.parent.get('quyDinhApDung').value;

    if (quyDinhApDung === QuyDinhApDung.ND512010TT322021) {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }

        const alphas = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0 || i === 1) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else if (i === 2) {
                if (element !== '/') {
                    return { invalid: true };
                }
            } else if (i === 3 || i === 4) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else {
                if (element !== 'E') {
                    return { invalid: true };
                }
            }
        }

        return null;
    } else {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }

        const alphas = ['T', 'D', 'L', 'M', 'N', 'B', 'G', 'H'];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0) {
                if (element !== 'K' && element !== 'C') {
                    return { invalid: true };
                }
            } else if (i === 1 || i === 2) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else if (i === 3) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else {
                if (element.charCodeAt(0) < 65 || element.charCodeAt(0) > 90) {
                    return { invalid: true };
                }
            }
        }
    }
    */
}


export function CheckValidKyHieu_HoaDonChiTiet(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const value = c.value as string;
    if (!value) {
        return null;
    }

    let loaiApDungHoaDon = c.parent.get('loaiApDungHoaDon').value;

    if (loaiApDungHoaDon == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }
    
        const alphas = ['T', 'D', 'L', 'M', 'N', 'B', 'G', 'H'];
    
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0) {
                if (element !== 'K' && element !== 'C') {
                    return { invalid: true };
                }
            } else if (i === 1 || i === 2) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else if (i === 3) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else {
                if (element.charCodeAt(0) < 65 || element.charCodeAt(0) > 90) {
                    return { invalid: true };
                }
            }
        }
    }
    else
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }

        const alphas = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0 || i === 1) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else if (i === 2) {
                if (element !== '/') {
                    return { invalid: true };
                }
            } else if (i === 3 || i === 4) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else {
                if (element !== 'E') {
                    return { invalid: true };
                }
            }
        }
    }

    return null;
}

export function CheckValidKyHieu_HoaDonLienQuan(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const value = c.value as string;
    if (!value) {
        return null;
    }

    let loaiApDungHoaDon = c.parent.get('loaiHoaDonLienQuan').value;

    if (loaiApDungHoaDon == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }
    
        const alphas = ['T', 'D', 'L', 'M', 'N', 'B', 'G', 'H'];
    
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0) {
                if (element !== 'K' && element !== 'C') {
                    return { invalid: true };
                }
            } else if (i === 1 || i === 2) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else if (i === 3) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else {
                if (element.charCodeAt(0) < 65 || element.charCodeAt(0) > 90) {
                    return { invalid: true };
                }
            }
        }
    }
    else
    {
        const array = value.toUpperCase().split('');
        if (array.length !== 6) {
            return { invalid: true };
        }

        const alphas = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y'];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (i === 0 || i === 1) {
                if (!alphas.includes(element)) {
                    return { invalid: true };
                }
            } else if (i === 2) {
                if (element !== '/') {
                    return { invalid: true };
                }
            } else if (i === 3 || i === 4) {
                if (element.charCodeAt(0) < 48 || element.charCodeAt(0) > 57) {
                    return { invalid: true };
                }
            } else {
                if (element !== 'E') {
                    return { invalid: true };
                }
            }
        }
    }

    return null;
}