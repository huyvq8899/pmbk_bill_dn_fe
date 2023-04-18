import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'relativepipe'
})
export class RelativepipePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const result = moment(value).locale('vi').fromNow();
    return result;
  }
}
