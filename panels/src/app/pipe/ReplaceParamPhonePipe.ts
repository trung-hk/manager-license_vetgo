import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceParam'
})
export class ReplaceParamPipe implements PipeTransform {
    transform(text: string, replace: string, value: string): string {
        return text ? text.replace(replace, value) : "";
    }
}