import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Constant, MODE_OPEN_MODAL_FORM_ORDER_SERVICE, ROLES} from "../../Constants/vg-constant";
import {NzSafeAny} from "ng-zorro-antd/core/types";
import {User} from "../../models/User";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'vet-title-action',
  templateUrl: './title-action.component.html',
})
export class TitleActionComponent implements OnInit{
  @Input() action?: {name: string, roles?: string[], isShow?: boolean};
  @Output() actionClick: EventEmitter<any> = new EventEmitter();
  @Input() search?: {placeholder?: string};
  @Output() keyEnterSearch: EventEmitter<any> = new EventEmitter();
  @Input() selectSearchByUser?: {placeholder?: string | TemplateRef<NzSafeAny> | null, roles?: string[], value: string | null, userList: User[], isOnlySelectUserId?: boolean};
  @Output() onChangeByUser: EventEmitter<any> = new EventEmitter();
  protected readonly ROLES = ROLES;
  protected readonly Constant = Constant;
  protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
  nzFilterOption = (): boolean => true;
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  ngOnInit(): void {

  }
  handleInputChange(searchText: any): void {
    // Cập nhật giá trị BehaviorSubject khi có sự thay đổi
    console.log(this.searchSubject)
    this.searchSubject.next(searchText);
  }
}
