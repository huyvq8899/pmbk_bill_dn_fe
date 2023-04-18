import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {
    units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    niceBytes(value: any) {
        let l = 0;
        let n = parseInt(value, 10) || 0;

        while (n >= 1024 && ++l) {
            n = n / 1024;
        }

        return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
    }

    checkExtension(fileName: string, extentions: any) {
        return (new RegExp('(' + extentions.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }

    checkFileSize(fileSize) {
        if ((fileSize / 1024 / 1024) < 2048) { return true; }
        return false;
    }

    convertToCulturalDate(value: string) {
        if (value != null && value !== undefined) {
            const dateArrray = value.split(' ')[0].split('/');
            const result = `${dateArrray[1]}/${dateArrray[0]}/${dateArrray[2]}`;
            return result;
        }
        return '';
    }

    getLastDateRage() {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.formatDate(d));
        }

        return {
            fromDate: result[result.length - 1],
            toDate: result[0],
        };
    }

    formatDate(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        const yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        // date = mm + '/' + dd + '/' + yyyy;
        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }

    sliceTagName(tag: string): string {
        if (tag) {
            const lastDot = tag.lastIndexOf('.');
            const fileName = tag.substring(0, lastDot);
            const tagLength = fileName.length;
            if (tagLength > 20) {
                const fileExtention = tag.substring(lastDot, tag.length);
                const result = fileName.slice(0, 14) + '...' + fileName.slice(tagLength - 3, tagLength) + fileExtention;
                return result;
            } else {
                return tag;
            }
        } else {
            return '';
        }
    }
}
