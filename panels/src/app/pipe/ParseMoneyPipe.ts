import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'parseMoneyFormat'
})
export class ParseMoneyPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        return value ? value.replace(',', '') : "0";
    }
}