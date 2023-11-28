import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitComman'
})
export class SplitCommanPipe implements PipeTransform {
    transform(value: string | null | undefined): string[] {
        return value ? value.split(",") : [];
    }
}