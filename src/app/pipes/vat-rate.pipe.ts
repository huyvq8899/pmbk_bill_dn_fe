import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'vatRate'
})
export class VatRatePipe implements PipeTransform {
  transform(value: any) {
      if (!value) {
          return '';
      }

      if (value === 'KCT' || value === 'KKKNT') {
          return value;
      }

      return value + '%';
  }
}
