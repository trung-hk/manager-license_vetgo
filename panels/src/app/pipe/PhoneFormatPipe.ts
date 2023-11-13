import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return "";
        if (value.length <= 3) {
            return `${value.slice(0, 3)}`;
        }
        if (value.length > 3 && value.length <=6) {
            return `(${value.slice(0, 3)}) ${value.slice(3, 6)}`;
        }
        return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
}