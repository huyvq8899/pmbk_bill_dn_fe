import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {
    constructor() { }

    transform(value: any, showZero: boolean, dinhDangSo: any): any {
        if (value == null || value === undefined || value === '' || (value == 0 && !showZero)) {
            return '';
        }

        if (!dinhDangSo) {
            dinhDangSo = 0;
        }

        let val = (value / 1).toFixed(dinhDangSo).replace('.', ',');
        let result = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') === 'NaN' ? value : val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        if (result === 'NaN') {
            return value < 0 ? `(${value})` : value;
        } else {
            if (value < 0) {
                value = Math.abs(value);
                val = (value / 1).toFixed(dinhDangSo).replace('.', ',');
                const split = val.split(',');
                const decimal = split.length > 1 ? split[1] : null;
                return `(${split[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (decimal ? (',' + decimal) : '')})`;
            } else {
                const split = val.split(',');
                const decimal = split.length > 1 ? split[1] : null;
                return split[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (decimal ? (',' + decimal) : '');
            }
        }
    }
}
