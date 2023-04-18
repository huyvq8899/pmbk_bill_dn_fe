import { AbstractControl } from '@angular/forms';
import { getMoTaLoaiHoaDons } from '../shared/SharedFunction';

export function CheckValidMauHoaDon(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    
    const hinhThucHoaDonCanThayThe = c.parent.get('hinhThucHoaDonCanThayThe').value;

    if (hinhThucHoaDonCanThayThe == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        const value = c.value as string;
        if (!value) {
            return null;
        }
    
        if (value.length !== 1) {
            return { invalid: true };
        }
    
        if (value.charCodeAt(0) < 49 || value.charCodeAt(0) > 54) {
            return { invalid: true };
        }
    }
    else
    {
        const value = c.value as string;
        if (!value) {
            return null;
        }
        
        if (value.length !== 11) {
            return { invalid: true };
        }

        const loaiHoaDons = getMoTaLoaiHoaDons();
        if (!loaiHoaDons.includes(value.substring(0, 6))) {
            return { invalid: true };
        }
    }

    return null;

    /* sửa theo thông tư 78
    const value = c.value as string;
    if (!value) {
        return null;
    }
    
    if (value.length !== 11) {
        return { invalid: true };
    }

    const loaiHoaDons = getMoTaLoaiHoaDons();
    if (!loaiHoaDons.includes(value.substring(0, 6))) {
        return { invalid: true };
    }

    if (value.length !== 1) {
        return { invalid: true };
    }

    if (value.charCodeAt(0) < 49 || value.charCodeAt(0) > 54) {
        return { invalid: true };
    }

    return null;
    */
}


export function CheckValidMauHoaDon_HoaDonChiTiet(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    
   let loaiApDungHoaDon = c.parent.get('loaiApDungHoaDon').value;

   console.log(loaiApDungHoaDon);
   const value = c.value as string;
   if (!value) {
       return null;
   }

   if (Number.parseInt(loaiApDungHoaDon) == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        let value = c.value.toString();
        if(value == '7' || value == '8'){
            value = '6';
        }
        
        if(value == '9'){
            value = '1';
        }

        if(value == '10'){
            value = '2';
        }

        if(value == '13' || value == '14' || value == '15'){
            value = '5';
        }
        
        console.log(value.length);
        if (!value) {
            return null;
        }
    
        if (value.length !== 1) {
            return { invalid: true };
        }
    
        if (value.charCodeAt(0) < 49 || value.charCodeAt(0) > 54) {
            return { invalid: true };
        }
    }
    else
    {
        const value = c.value as string;
        if (!value) {
            return null;
        }
        
        if (value.length !== 11) {
            return { invalid: true };
        }

        const loaiHoaDons = getMoTaLoaiHoaDons();
        if (!loaiHoaDons.includes(value.substring(0, 6))) {
            return { invalid: true };
        }
    }

    return null;
}

export function CheckValidMauHoaDon_HoaDonLienQuan(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    
   let loaiApDungHoaDon = c.parent.get('loaiHoaDonLienQuan').value;

   const value = c.value as string;
   if (!value) {
       return null;
   }

   if (loaiApDungHoaDon == 1) //nếu theo Nghị định 123/2020/NĐ-CP (thông tư 78)
    {
        const value = c.value as string;
        if (!value) {
            return null;
        }
    
        if (value.length !== 1) {
            return { invalid: true };
        }
    
        if (value.charCodeAt(0) < 49 || value.charCodeAt(0) > 54) {
            return { invalid: true };
        }
    }
    else
    {
        const value = c.value as string;
        if (!value) {
            return null;
        }
        
        if (value.length !== 11) {
            return { invalid: true };
        }

        const loaiHoaDons = getMoTaLoaiHoaDons();
        if (!loaiHoaDons.includes(value.substring(0, 6))) {
            return { invalid: true };
        }
    }

    return null;
}