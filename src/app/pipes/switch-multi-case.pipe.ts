import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'switchMultiCase'
})
export class SwitchMultiCasePipe implements PipeTransform {
  /* ex:
   <ng-container [ngSwitch]="switchOption">
   ...
   <div *ngSwitchCase="['somecase', 'anothercase'] | switchMultiCase:switchOption">
   */
  transform(cases: any[], switchOption: any): any {
    return cases.includes(switchOption) ? switchOption : !switchOption;
  }
}
