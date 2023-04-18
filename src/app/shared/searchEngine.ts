export function SearchEngine(arraySource: any, arrayCondition: any = null, keyword: string) {
    const array = arraySource;
    keyword = keyword.toUpperCase().trim();
    const keywordUnSign = toUnSign(keyword);
    const propertys: any = Object.keys(array[0]);
    
    const result: any[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < array.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < arrayCondition.length; j++) {
            let data = (array[i][arrayCondition[j]]);
            if (data == null) { data = ''; }
            const dataFilter = data.toString().toUpperCase().includes(keyword) ||
                toUnSign(data.toString().toUpperCase()).includes(toUnSign(keywordUnSign));
            if (dataFilter) {
                result.push(array[i]);
                
                break;
            }
        }
    }
    
    return result;
}
export function toUnSign(input: string) {
    if (input === undefined || input === '') {
        return '';
    }
    input = input.replace(/đ/gi, 'd');
    return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

