import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pad'
})
export class PadPipe implements PipeTransform {
    /// args[0] = (left) or (right)
    /// args[1] = Số lượng hiển thị
    /// args[2] = ký tự hiển thị
    transform(value: any, ...args: any[]): any {
        if (value == null || value === undefined || value === '') {
            return null;
        }
        
        return args[0] === 'left' ? String(value).padStart(args[1], args[2]) : String(value).padEnd(args[1], args[2]);
    }
}