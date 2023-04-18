import { FormGroup } from '@angular/forms';

export function GetSelectedArray(array: any) {
  const propertys: any = Object.keys(array);
  let result: any = [];
  for (let i = 0; i < propertys.length; i++) {
    if (array[propertys[i]] === true) {
      result.push(propertys[i]);
    }
  }
  return result;
}

export function GetLoaiThongTu() {
  const kyKeToan = JSON.parse(localStorage.getItem('kyKeToan'));
  return kyKeToan.loaiThongTu;
}

export function GetFileName(str: string) {
  var n = str.lastIndexOf("/");
  var fileName = str.substring(n + 1, str.length);
  return fileName;
}

export function SetPoiterNumber(form: FormGroup, hoaDonChiTiets: any, input: any, index: number, name: string, isFocusPoiter: boolean) {
  if (isFocusPoiter) {
    if (hoaDonChiTiets[index][name] === 0) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(1, 1);
      } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', 1);
        range.moveStart('character', 1);
        range.select();
      }
      isFocusPoiter = false;
    } else {
      if (hoaDonChiTiets[index][name]  > 0) {
        let xxx: any = input.value;
        const j = xxx.indexOf(",");
        if (input.setSelectionRange) {
          input.focus();
          input.setSelectionRange(j, j);
        } else if (input.createTextRange) {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', j);
          range.moveStart('character', j);
          range.select();
        }
      }
      isFocusPoiter = false;
    }
  }
  else {
    // if (form.get(`${formChiTiet}.${index}.${name}`).value === 0) {
    //   if (input.setSelectionRange) {
    //     input.focus();
    //     input.setSelectionRange(1, 1);
    //   } else if (input.createTextRange) {
    //     var range = input.createTextRange();
    //     range.collapse(true);
    //     range.moveEnd('character', 1);
    //     range.moveStart('character', 1);
    //     range.select();
    //   }
    //   isFocusPoiter = false;
    // } 
  }
  isFocusPoiter = false;
  return isFocusPoiter;
}

export function dynamicSort(prop, reverse) {
  return function (a, b) {
    if (a[prop] < b[prop]) { return reverse ? 1 : -1; }
    if (a[prop] > b[prop]) { return reverse ? -1 : 1; }
    return 0;
  };
}

export function GroupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    // Add object to list for given key's value
    acc[key].push(obj);
    return acc;
  }, {});
}

export function DropKeyAfterGroupBy(rs: any) {
  return (Object.keys(rs) as Array<keyof typeof rs>).reduce((accumulator, current) => {
    accumulator.push(rs[current]);
    return accumulator;
  }, [] as (typeof rs[keyof typeof rs])[]);
}

export function GroupByMultiKey(array, f) {
  var groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  })
}

