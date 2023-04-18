import { PagingParams } from '../models/PagingParams';

export function GetDate(inputDate: string) {
    const date = new Date(inputDate);
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;
    return currentDate;
}

export function CheckValidDate(dateField: any) {
    //inputDate: format yyyy-mm-dd
    let inputDate = dateField.value;
    if (inputDate === null || inputDate === '') {
        dateField.setValue(null);
        return;
    }
    let values = inputDate.toString().split('-');
    if (parseInt(values[0]) < 1900) { //values[0] là năm
        dateField.setValue(null);
    }
}

export function CheckValidDateV2(pagingParam: PagingParams) {
    let date = new Date(Date.now());
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;
    let fromDate = pagingParam.fromDate;
    let values = fromDate.split('-');
    if (values[0] !== null && values[0] !== '' && parseInt(values[0]) > 1900) { //values[0] là năm
        pagingParam.oldFromDate = pagingParam.fromDate;
    }
    if (values[0] === null || values[0] === '' || parseInt(values[0]) < 1900) { //values[0] là năm
        pagingParam.fromDate = pagingParam.oldFromDate;
        
    }
    let toDate = pagingParam.toDate;
    values = toDate.split('-');
    if (values[0] !== null && values[0] !== '' && parseInt(values[0]) > 1900) { //values[0] là năm
        pagingParam.oldToDate = pagingParam.toDate;
    }
    if (values[0] === null || values[0] === '' || parseInt(values[0]) < 1900) { //values[0] là năm
        pagingParam.toDate = pagingParam.oldToDate;
    }
}

export function CheckValidDateV3(pagingParam: PagingParams) {
    let fromDate = pagingParam.fromDate;
    let valuesF: string[] = [];
    valuesF.push('');
    if (fromDate != null) {
        valuesF = fromDate.split('-');
    }
    if (pagingParam.fromDate == null) {
        if (valuesF[0] !== null && valuesF[0] !== '' && parseInt(valuesF[0]) > 1900) {
            pagingParam.fromDate = pagingParam.fromDate;
        } else {
            pagingParam.fromDate == null;
        }
    } else {
        if (valuesF[0] !== null && valuesF[0] !== '' && parseInt(valuesF[0]) > 1900) { //valuesF[0] là năm
            pagingParam.oldFromDate = pagingParam.fromDate;
        }
        if (valuesF[0] === null || valuesF[0] === '' || parseInt(valuesF[0]) < 1900) { //values[0] là năm
            pagingParam.fromDate = pagingParam.oldFromDate;
        }
    }

    let toDate = pagingParam.toDate;
    let values: string[] = [];
    values.push('');
    if (toDate != null) {
        values = toDate.split('-');
    }
    if (pagingParam.toDate == null) {
        if (values[0] !== null && values[0] !== '' && parseInt(values[0]) > 1900) {
            pagingParam.toDate = pagingParam.toDate;
        } else {
            pagingParam.toDate == null;
        }
    } else {
        if (values[0] !== null && values[0] !== '' && parseInt(values[0]) > 1900) { //values[0] là năm
            pagingParam.oldToDate = pagingParam.toDate;
        }
        if (values[0] === null || values[0] === '' || parseInt(values[0]) < 1900) { //values[0] là năm
            pagingParam.toDate = pagingParam.oldToDate;
        }
    }
   
}

export function isValidDate(dateString) {
    //dateString format:yyyy-mm-dd -> true
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}
