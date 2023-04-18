import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: any) {
      if (!value) {
          return '';
      }

      return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
