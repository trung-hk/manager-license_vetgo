import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {
  Constant,
  MODE_DATE_FILTER,
  MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
  ROLES
} from "../../Constants/vg-constant";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {User} from "../../models/User";
import {BehaviorSubject} from "rxjs";
import {
  lastDayOfISOWeek,
  lastDayOfMonth,
  lastDayOfYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear
} from "date-fns";
import {CallbackLoadDataServer} from "../../models/CallbackLoadDataServer";
import {isValidDate} from "rxjs/internal/util/isDate";

@Component({
  selector: 'vet-title-action',
  templateUrl: './title-action.component.html',
})
export class TitleActionComponent implements OnInit, AfterViewInit{
  @Input() action?: {name: string, roles?: string[], isShow?: boolean};
  @Output() actionClick: EventEmitter<any> = new EventEmitter();
  @Input() search?: {placeholder?: string};
  @Input() selectSearchByUser?: {placeholder?: string | TemplateRef<NzSafeAny> | null, roles?: string[], value: string | null, userList: User[], isOnlySelectUserId?: boolean};
  @Output() onChangeByUser: EventEmitter<any> = new EventEmitter();
  @Input() filterByDate?: boolean;
  @Input() filterReload?: CallbackLoadDataServer;
  protected readonly ROLES = ROLES;
  protected readonly Constant = Constant;
  protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
  nzFilterOption = (): boolean => true;
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  protected readonly MODE_DATE_FILTER = MODE_DATE_FILTER;
  modeFilterDate: string = MODE_DATE_FILTER.RANGE.value;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
  handleSearch(event: any): void {
    this.filterReload?.reloadData(undefined, undefined, event.target.value);
    event.target.value = "";
  }
  handleInputChange(searchText: any): void {
    // Cập nhật giá trị BehaviorSubject khi có sự thay đổi
    console.log(this.searchSubject)
    this.searchSubject.next(searchText);
  }
  onChangeDateFilter(result: Date) {
    let from,to;
    switch (this.modeFilterDate) {
      case MODE_DATE_FILTER.DATE.value:
        from = result;
        to = result;
        break;
      case MODE_DATE_FILTER.WEEK.value:
        from = startOfISOWeek(result);
        to = lastDayOfISOWeek(result);
        break;
      case MODE_DATE_FILTER.MONTH.value:
        from = startOfMonth(result);
        to = lastDayOfMonth(result);
        break;
      case MODE_DATE_FILTER.YEAR.value:
        from = startOfYear(result);
        to = lastDayOfYear(result);
        break;
    }
    this.filterReload?.reloadData(from?.toISOString(), to?.toISOString());
  }
  onChangeRange(result: Date[]): void {
    let from = startOfDay(result[0]);
    let to = startOfDay(result[1]);
    console.log(startOfDay(result[0]), startOfDay(result[1]))
    this.filterReload?.reloadData(this.isValidDate(from) ? from.toISOString() : undefined, this.isValidDate(to) ? to.toISOString() : undefined);
  }
  isValidDate(value: any): boolean {
    return value instanceof Date && !isNaN(value as any);
  }
}
