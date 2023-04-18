import * as moment from 'moment';
import { CookieConstant } from '../constants/constant';

export function GetList(): any[] {
    return [
        { key: 1, value: 'Hôm nay' },
        { key: 2, value: 'Tuần này' },
        { key: 3, value: 'Đầu tuần đến hiện tại' },
        { key: 4, value: 'Tháng này' },
        { key: 5, value: 'Đầu tháng đến hiện tại' },
        { key: 6, value: 'Quý này' },
        { key: 7, value: 'Đầu quý đến hiện tại' },
        { key: 8, value: 'Năm nay' },
        { key: 9, value: 'Đầu năm đến hiện tại' },
        { key: 10, value: '6 tháng đầu năm' },
        { key: 11, value: '6 tháng cuối năm' },
        { key: 12, value: 'Tháng 1' },
        { key: 13, value: 'Tháng 2' },
        { key: 14, value: 'Tháng 3' },
        { key: 15, value: 'Tháng 4' },
        { key: 16, value: 'Tháng 5' },
        { key: 17, value: 'Tháng 6' },
        { key: 18, value: 'Tháng 7' },
        { key: 19, value: 'Tháng 8' },
        { key: 20, value: 'Tháng 9' },
        { key: 21, value: 'Tháng 10' },
        { key: 22, value: 'Tháng 11' },
        { key: 23, value: 'Tháng 12' },
        { key: 24, value: 'Quý 1' },
        { key: 25, value: 'Quý 2' },
        { key: 26, value: 'Quý 3' },
        { key: 27, value: 'Quý 4' },
        { key: 28, value: 'Hôm qua' },
        { key: 29, value: 'Tuần trước' },
        { key: 30, value: 'Tháng trước' },
        { key: 31, value: 'Quý trước' },
        { key: 32, value: 'Năm trước' },
        { key: 33, value: 'Tuần sau' },
        { key: 34, value: 'Tháng sau' },
        { key: 35, value: 'Quý sau' },
        { key: 36, value: 'Năm sau' },
        { key: 0, value: 'Tùy chọn' },
    ];
}

export function GetList2(): any[] {
    return [
        { key: 1, value: 'Tháng này' },
        { key: 2, value: 'Quý này' },
        { key: 3, value: 'Cả năm' },
        { key: 4, value: '6 tháng đầu năm' },
        { key: 5, value: '6 tháng cuối năm' },
        { key: 6, value: 'Tháng 1' },
        { key: 7, value: 'Tháng 2' },
        { key: 8, value: 'Tháng 3' },
        { key: 9, value: 'Tháng 4' },
        { key: 10, value: 'Tháng 5' },
        { key: 11, value: 'Tháng 6' },
        { key: 12, value: 'Tháng 7' },
        { key: 13, value: 'Tháng 8' },
        { key: 14, value: 'Tháng 9' },
        { key: 15, value: 'Tháng 10' },
        { key: 16, value: 'Tháng 11' },
        { key: 17, value: 'Tháng 12' },
        { key: 18, value: 'Quý 1' },
        { key: 19, value: 'Quý 2' },
        { key: 20, value: 'Quý 3' },
        { key: 21, value: 'Quý 4' },
        { key: 0, value: 'Tùy chọn' },
    ];
}

export function GetTenKy(key: any) {
    return GetList().find(x => x.key === key).value;
}

export function GetTenKy2(key: any) {
    return GetList2().find(x => x.key === key).value;
}

export function SetDate2(value: any, nam: number, params: any) {
    const format = 'YYYY-MM-DD';
    const currentYear = moment().year();
    var dis = nam - currentYear;

    if (value === 1) {
        if((nam % 4 == 0 && nam % 100 != 0) || nam % 400 == 0){
            const currentMonth = moment().month();
            if(currentMonth == 2){
                params.fromDate = moment().startOf('month').add(dis, 'year').format(format);
                params.toDate = moment(nam + "-02-29").format('YYYY-MM-DD');
            }
            else{
                params.fromDate = moment().startOf('month').add(dis, 'year').format(format);
                params.toDate = moment().endOf('month').add(dis, 'year').format(format);
            }

        }
        else{
            params.fromDate = moment().startOf('month').add(dis, 'year').format(format);
            params.toDate = moment().endOf('month').add(dis, 'year').format(format);
        }
    } else if (value === 2) {
        params.fromDate = moment().quarter(moment(moment().format(format)).quarter()).startOf('quarter').add(dis, 'year').format(format);
        params.toDate = moment().quarter(moment(moment().format(format)).quarter()).endOf('quarter').add(dis, 'year').format(format);
    } else if (value === 3) {
        params.fromDate = moment().startOf('year').add(dis, 'year').format(format);
        params.toDate = moment().endOf('year').add(dis, 'year').format(format);
    } else if (value === 4) {
        params.fromDate = moment(`${moment().year()}-1`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-6`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 5) {
        params.fromDate = moment(`${moment().year()}-7`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-12`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 6) {
        params.fromDate = moment(`${moment().year()}-1`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-1`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 7) {
        params.fromDate = moment(`${moment().year()}-2`).startOf('month').add(dis, 'year').format(format);
        if(((nam % 4 == 0 && nam % 100 != 0) || nam % 400 == 0) && (currentYear % 4 != 0)){
            params.toDate = moment(`${moment().year()}-2`).endOf('month').add(dis, 'year').add(1,'d').format(format);
        }else{
            params.toDate = moment(`${moment().year()}-2`).endOf('month').add(dis, 'year').format(format);
        }
    } else if (value === 8) {
        params.fromDate = moment(`${moment().year()}-3`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-3`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 9) {
        params.fromDate = moment(`${moment().year()}-4`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-4`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 10) {
        params.fromDate = moment(`${moment().year()}-5`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-5`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 12) {
        params.fromDate = moment(`${moment().year()}-6`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-6`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 13) {
        params.fromDate = moment(`${moment().year()}-7`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-7`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 14) {
        params.fromDate = moment(`${moment().year()}-8`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-8`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 15) {
        params.fromDate = moment(`${moment().year()}-9`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-9`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 16) {
        params.fromDate = moment(`${moment().year()}-10`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-10`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 17) {
        params.fromDate = moment(`${moment().year()}-11`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-11`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 18) {
        params.fromDate = moment(`${moment().year()}-12`).startOf('month').add(dis, 'year').format(format);
        params.toDate = moment(`${moment().year()}-12`).endOf('month').add(dis, 'year').format(format);
    } else if (value === 19) {
        params.fromDate = moment().quarter(1).startOf('quarter').add(dis, 'year').format(format);
        params.toDate = moment().quarter(1).endOf('quarter').add(dis, 'year').format(format);
    } else if (value === 20) {
        params.fromDate = moment().quarter(2).startOf('quarter').add(dis, 'year').format(format);
        params.toDate = moment().quarter(2).endOf('quarter').add(dis, 'year').format(format);
    } else if (value === 21) {
        params.fromDate = moment().quarter(3).startOf('quarter').add(dis, 'year').format(format);
        params.toDate = moment().quarter(3).endOf('quarter').add(dis, 'year').format(format);
    } else if (value === 22) {
        params.fromDate = moment().quarter(4).startOf('quarter').add(dis, 'year').format(format);
        params.toDate = moment().quarter(4).endOf('quarter').add(dis, 'year').format(format);
    } else {
        ////
    }
}

export function SetDate(value: any, params: any) {
    const format = 'YYYY-MM-DD';

    if (value === 1) {
        params.fromDate = moment().format(format);
        params.toDate = moment().format(format);
    } else if (value === 2) {
        params.fromDate = moment().startOf('week').format(format);
        params.toDate = moment().endOf('week').format(format);
    } else if (value === 3) {
        params.fromDate = moment().startOf('week').format(format);
        params.toDate = moment().format(format);
    } else if (value === 4) {
        params.fromDate = moment().startOf('month').format(format);
        params.toDate = moment().endOf('month').format(format);
    } else if (value === 5) {
        params.fromDate = moment().startOf('month').format(format);
        params.toDate = moment().format(format);
    } else if (value === 6) {
        params.fromDate = moment().quarter(moment(moment().format(format)).quarter()).startOf('quarter').format(format);
        params.toDate = moment().quarter(moment(moment().format(format)).quarter()).endOf('quarter').format(format);
    } else if (value === 7) {
        params.fromDate = moment().quarter(moment(moment().format(format)).quarter()).startOf('quarter').format(format);
        params.toDate = moment().format(format);
    } else if (value === 8) {
        params.fromDate = moment().startOf('year').format(format);
        params.toDate = moment().endOf('year').format(format);
    } else if (value === 9) {
        params.fromDate = moment().startOf('year').format(format);
        params.toDate = moment().format(format);
    } else if (value === 10) {
        params.fromDate = moment(`${moment().year()}-1`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-6`).endOf('month').format(format);
    } else if (value === 11) {
        params.fromDate = moment(`${moment().year()}-7`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-12`).endOf('month').format(format);
    } else if (value === 12) {
        params.fromDate = moment(`${moment().year()}-1`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-1`).endOf('month').format(format);
    } else if (value === 13) {
        params.fromDate = moment(`${moment().year()}-2`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-2`).endOf('month').format(format);
    } else if (value === 14) {
        params.fromDate = moment(`${moment().year()}-3`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-3`).endOf('month').format(format);
    } else if (value === 15) {
        params.fromDate = moment(`${moment().year()}-4`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-4`).endOf('month').format(format);
    } else if (value === 16) {
        params.fromDate = moment(`${moment().year()}-5`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-5`).endOf('month').format(format);
    } else if (value === 17) {
        params.fromDate = moment(`${moment().year()}-6`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-6`).endOf('month').format(format);
    } else if (value === 18) {
        params.fromDate = moment(`${moment().year()}-7`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-7`).endOf('month').format(format);
    } else if (value === 19) {
        params.fromDate = moment(`${moment().year()}-8`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-8`).endOf('month').format(format);
    } else if (value === 20) {
        params.fromDate = moment(`${moment().year()}-9`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-9`).endOf('month').format(format);
    } else if (value === 21) {
        params.fromDate = moment(`${moment().year()}-10`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-10`).endOf('month').format(format);
    } else if (value === 22) {
        params.fromDate = moment(`${moment().year()}-11`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-11`).endOf('month').format(format);
    } else if (value === 23) {
        params.fromDate = moment(`${moment().year()}-12`).startOf('month').format(format);
        params.toDate = moment(`${moment().year()}-12`).endOf('month').format(format);
    } else if (value === 24) {
        params.fromDate = moment().quarter(1).startOf('quarter').format(format);
        params.toDate = moment().quarter(1).endOf('quarter').format(format);
    } else if (value === 25) {
        params.fromDate = moment().quarter(2).startOf('quarter').format(format);
        params.toDate = moment().quarter(2).endOf('quarter').format(format);
    } else if (value === 26) {
        params.fromDate = moment().quarter(3).startOf('quarter').format(format);
        params.toDate = moment().quarter(3).endOf('quarter').format(format);
    } else if (value === 27) {
        params.fromDate = moment().quarter(4).startOf('quarter').format(format);
        params.toDate = moment().quarter(4).endOf('quarter').format(format);
    } else if (value === 28) {
        params.fromDate = moment().subtract(1, 'days').format(format);
        params.toDate = moment().subtract(1, 'days').format(format);
    } else if (value === 29) {
        params.fromDate = moment().subtract(1, 'weeks').startOf('week').format(format);
        params.toDate = moment().subtract(1, 'weeks').endOf('week').format(format);
    } else if (value === 30) {
        params.fromDate = moment().subtract(1, 'months').startOf('month').format(format);
        params.toDate = moment().subtract(1, 'months').endOf('month').format(format);
    } else if (value === 31) {
        params.fromDate = moment().subtract(1, 'quarters').startOf('quarter').format(format);
        params.toDate = moment().subtract(1, 'quarters').endOf('quarter').format(format);
    } else if (value === 32) {
        params.fromDate = moment().subtract(1, 'years').startOf('year').format(format);
        params.toDate = moment().subtract(1, 'years').endOf('year').format(format);
    } else if (value === 33) {
        params.fromDate = moment().add(1, 'weeks').startOf('week').format(format);
        params.toDate = moment().add(1, 'weeks').endOf('week').format(format);
    } else if (value === 34) {
        params.fromDate = moment().add(1, 'months').startOf('month').format(format);
        params.toDate = moment().add(1, 'months').endOf('month').format(format);
    } else if (value === 35) {
        params.fromDate = moment().add(1, 'quarters').startOf('quarter').format(format);
        params.toDate = moment().add(1, 'quarters').endOf('quarter').format(format);
    } else if (value === 36) {
        params.fromDate = moment().add(1, 'years').startOf('year').format(format);
        params.toDate = moment().add(1, 'years').endOf('year').format(format);
    } else {
        ////
    }
}

export function GetKy(params: any): any {
    const temp = Object.assign({}, params);
    const kys = GetList();
    for (const item of kys) {
        SetDate(item.key, temp);
        if (temp.fromDate === params.fromDate && temp.toDate === params.toDate) {
            return item.key;
        }
    }

    return 0;
}

export function GetKy2(params: any, nam: number): any {
    const temp = Object.assign({}, params);
    const kys = GetList2();
    for (const item of kys) {
        SetDate2(item.key, nam, temp);
        if (temp.fromDate === params.fromDate && temp.toDate === params.toDate) {
            return item.key;
        }
    }

    return 0;
}

export function GetKyMacDinh(): number{
    var kyOption = localStorage.getItem(CookieConstant.KYKEKHAITHUE);
    if(kyOption == 'Thang'){
        return 4;
    }
    else if(kyOption == 'Quy'){
        return 6;
    }
    return 5;
}
