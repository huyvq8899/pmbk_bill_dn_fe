import { AbstractControl, ValidatorFn } from "@angular/forms";

export function CheckCommomValidator(result: boolean): ValidatorFn {
    return (currentControl: AbstractControl): { [key: string]: any } => {
        return result === true ? { invalid: true } : null;
    };
}

export function CheckValidMaCQTCap(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    let ctlHinhThucHoaDonCanThayThe = c.parent.get('hinhThucHoaDonCanThayThe');
    let ctlHinhThucHoaDon = c.parent.get('hinhThucHoaDon');

    if (ctlHinhThucHoaDonCanThayThe != null && ctlHinhThucHoaDonCanThayThe != undefined)
    {
        let hinhThucHoaDonCanThayThe = ctlHinhThucHoaDonCanThayThe.value;
        if (hinhThucHoaDonCanThayThe == 2) //nếu chọn loại 2 thì kiểm tra xem đã nhập mã CQT cấp
        {
            let value = c.value;
            if (!value) {
                return { invalid: true };
            }

            if(c.value && c.value.length != 34){
                return {invalidLength: true}
            }
        }
    }

    if (ctlHinhThucHoaDon != null && ctlHinhThucHoaDon != undefined)
    {
        let hinhThucHoaDon = ctlHinhThucHoaDon.value;
        if (hinhThucHoaDon == 1) //nếu có mã của CQT
        {
            let value = c.value;
            if (!value) {
                return { invalid: true };
            }

            if(c.value && c.value.length < 34){
                return {invalidLength: true}
            }
        }
    }

    if(c.value && c.value.length < 34){
        return {invalidLength: true};
    }

    return null;
}

export function CheckValidLyDoSaiSot(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const value = c.value as string;
    if (!value) {
        return { required: true };
    }

    if (value.length > 255) //nếu chiều dài > 255 ký tự
    {
        return { invalid: true };
    }

    return null;
}
export function CheckValidHuyGiaiTrinh(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }

    const value = c.value as string;
    if (!value) {
        return { required: true };
    }
    return null;
}

export function CheckValidMaCQTCapSaiSot(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    
    let loaiApDungHoaDon = Number.parseInt(c.parent.get('loaiApDungHoaDon').value);

    const value = c.value as string;
    if (loaiApDungHoaDon == 1 || loaiApDungHoaDon == 2)
    {
        if (!value) {
            return { invalid: true };
        }

        let hinhThucHoaDon = c.parent.get('hinhThucHoaDon').value;
        if(hinhThucHoaDon != '2' && hinhThucHoaDon != '0'){
            if(c.value && c.value.length != 34){
                return {invalidLength: true}
            }
        }
        else{
            if(c.value && c.value.length != 23){
                return {invalidLength: true}
            }
        }
    }
    else
    {
        return null;
    }


    return null;
}

export function CheckValidMaCQTCapChuoiKyTuSo(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    
    let loaiApDungHoaDon = Number.parseInt(c.parent.get('loaiApDungHoaDon').value);
    let hinhThucHoaDon = c.parent.get('hinhThucHoaDon').value;

    const value = c.value as string;
    if (loaiApDungHoaDon == 1 && hinhThucHoaDon == 2)
    {
        if (!value) {
            return { invalid: true };
        }


        if(c.value && c.value.length != 11){
            return {invalidLength: true}
        }
    }
    else
    {
        return null;
    }


    return null;
}
