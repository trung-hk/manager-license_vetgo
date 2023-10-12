import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'moneyFormat'
})
export class MoneyPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "0";
    }
}