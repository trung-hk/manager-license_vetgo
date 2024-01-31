import {Component, EventEmitter, Output} from '@angular/core';
import {
  lastDayOfISOWeek,
  lastDayOfMonth,
  lastDayOfYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear
} from "date-fns";

@Component({
  selector: 'vet-filter-date-action',
  template: `<div nz-row>
    <div nz-col nzSpan="24">
      <nz-tabset>
        <nz-tab nzTitle="From-To">
          <nz-range-picker  ngModel="" (ngModelChange)="onChangeRange($event)"></nz-range-picker>
        </nz-tab>
        <nz-tab nzTitle="Week">
          <nz-date-picker nzMode="week" ngModel="" (ngModelChange)="onChangeWeek($event)"></nz-date-picker>
        </nz-tab>
        <nz-tab nzTitle="Month">
          <nz-date-picker nzMode="month" ngModel="" (ngModelChange)="onChangeMonth($event)"></nz-date-picker>
        </nz-tab>
        <nz-tab nzTitle="Year">
          <nz-date-picker nzMode="year" ngModel="" (ngModelChange)="onChangeYear($event)"></nz-date-picker>
        </nz-tab>
      </nz-tabset>
    </div>
  </div>`
})
export class FilterDateActionComponent {
  @Output() loadDataFromServer: EventEmitter<{ from: Date, to: Date }> = new EventEmitter();
  onChangeRange(result: Date[]): void {
    console.log('from: ', startOfDay(result[0]));
    console.log('to: ', startOfDay(result[1]));
    this.loadDataFromServer.emit({from: startOfDay(result[0]), to: startOfDay(result[1])});
  }

  onChangeWeek(result: Date): void {
    console.log('from: ', startOfISOWeek(result));
    console.log('to: ', lastDayOfISOWeek(result));
    this.loadDataFromServer.emit({from: startOfISOWeek(result), to: lastDayOfISOWeek(result)});
  }
  onChangeMonth(result: Date): void {
    console.log('from: ', startOfMonth(result));
    console.log('to: ', lastDayOfMonth(result));
    this.loadDataFromServer.emit({from: startOfMonth(result), to: lastDayOfMonth(result)});
  }
  onChangeYear(result: Date): void {
    console.log('from: ', startOfYear(result));
    console.log('to: ', lastDayOfYear(result));
    this.loadDataFromServer.emit({from: startOfYear(result), to: lastDayOfYear(result)});
  }
}
