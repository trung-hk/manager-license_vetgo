import {Component, Renderer2} from '@angular/core';
import {User} from "../../models/User";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {COMMISSION_APPROVE_PENDING_FORM} from "../../Constants/Form";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {
  Constant,
  ROLES, STATUS_COMMISSION_APPROVE_PENDING,
  USER_TYPE
} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {ResponseError} from "../../models/ResponseError";
import {CommissionApprovePending} from "../../models/CommissionApprovePending";
import {BehaviorSubject} from "rxjs";
import {ConfirmCommissionApproveRequest} from "../../models/ConfirmCommissionApproveRequest";
import {OrderService} from "../../models/OrderService";
import {CommissionApproved} from "../../models/CommissionApproved";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";

interface ObjectByRole {
  userType: string,
  apiUrl: string
}

@Component({
  selector: 'app-commission-approve-pending',
  templateUrl: './commission-approve-pending.component.html',
})

export class CommissionApprovePendingComponent {
  protected readonly Constant = Constant;
  protected readonly ROLES = ROLES;
  protected readonly STATUS_COMMISSION_APPROVE_PENDING = STATUS_COMMISSION_APPROVE_PENDING;
  listScript = [];
  dataList: CommissionApprovePending[] = [];
  userList: User[] = [];
  userMap: Map<string, User> = new Map<string, User>();

  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  filter: Array<{ key: string; value: string[] }> | null = null;
  isShowForm: boolean = false;
  validateForm!: UntypedFormGroup;
  isConfirmLoading: boolean = false;
  isLoadFirstData: boolean = true;
  objectByRole!: ObjectByRole;

  selectUser: string | null = null;
  nzFilterOption = (): boolean => true;
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  canApprove: boolean = false;

  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.init();
    this.validateForm = this.fb.group(COMMISSION_APPROVE_PENDING_FORM);
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.commissions'), "active");
      this.renderer.addClass(document.querySelector('.commissions a'), "toggled");
      this.renderer.addClass(document.querySelector('.commission-approve-pending-list'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.commissions'), "active");
    this.renderer.removeClass(document.querySelector('.commission-approve-pending-list'), "active");
  }
  init(): void {
    this.loadDataFromServer().then();
  }
  async loadDataFromServer(keyWork?: string): Promise<void> {
    this.canApprove = false;
    if (!this.objectByRole) this.objectByRole = await this.getObjectByRoles();
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    const objectSelect: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork, userId: this.selectUser}
    this.api.getAll<ResponseDataGetAll<CommissionApprovePending>>(this.objectByRole.apiUrl, objectSelect).subscribe(data => {
      this.dataList = data.content;
      this.total = data.totalElements;
      loading_success_1 = true;
      this.loading = !(loading_success_1 && loading_success_2);
      this.dataList.forEach(dt => {if (dt.status == STATUS_COMMISSION_APPROVE_PENDING.PENDING.value && this.selectUser) this.canApprove = true;})
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    });
    if (this.isLoadFirstData) {
      this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, this.objectByRole.userType).subscribe((data) => {
        console.log(data)
        this.userList = data.content;
        this.userMap = new Map<string, User>(this.userList.map(user => [user.id!, user]));
        loading_success_2 = true;
        this.loading = !(loading_success_1 && loading_success_2);
      }, error => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
        this.loading = false;
      });
      this.isLoadFirstData = false;
    } else {
      loading_success_2 = true;
      this.loading = !(loading_success_1 && loading_success_2);
    }

  }
  getObjectByRoles(): Promise<ObjectByRole> {
    return new Promise((rs) => {
      this.scriptFC.hasPermission(ROLES.ADMIN).then(result => {
        if (result) rs({userType:USER_TYPE.AGENT, apiUrl: URL.API_COMMISSION_APPROVE_PENDING_BY_ADMIN});
      });
      this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
        if (result) rs({userType:USER_TYPE.DISTRIBUTOR, apiUrl: URL.API_COMMISSION_APPROVE_PENDING_BY_AGENT});
      });
      this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
        if (result) rs({userType:USER_TYPE.PARTNER, apiUrl: URL.API_COMMISSION_APPROVE_PENDING_BY_DISTRIBUTOR});
      });
    });
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.changeFirst) {
      this.changeFirst = false;
      return;
    }
    console.log(params)
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.filter = filter;
    if (!sortField) {
      this.sort = "last_modified_date,desc";
    } else {
      let sortOrder = (currentSort && currentSort.value) || null;
      sortOrder = sortOrder && sortOrder === 'ascend' ? 'asc' : 'desc';
      this.sort = `${sortField},${sortOrder}`;
    }
    this.loadDataFromServer().then();
  }
  search(event: any): void {
    this.loadDataFromServer(event.target.value).then();
  }
  showModal() {
    this.isShowForm = true;
    this.validateForm.clearValidators();
    this.validateForm.reset();
    this.validateForm.patchValue({
      userId: this.selectUser,
      userType: this.objectByRole.userType
    })
  }
  handleCancel() {
    this.isShowForm = false;
  }

  approveCommission() {
    try {
      if (this.validateForm.invalid) {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
          }
        });
        return
      }
      this.isConfirmLoading = true;
      const data: ConfirmCommissionApproveRequest = this.validateForm.value;
      this.api.confirmCommissionApprove<ConfirmCommissionApproveRequest>(URL.API_CONFIRM_COMMISSION_APPROVE, data).subscribe((data) => {
        if (this.scriptFC.validateResponseAPI(data.status)){
          data = data as ResponseError;
          this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
        } else {
          this.isShowForm = false;
          this.loadDataFromServer().then();
          this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
        }
        this.isConfirmLoading = false;
      }, (error) => {
        console.log(error);
        this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
        this.isConfirmLoading = false;
      });
    } catch (error) {
      console.log(error)
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
    }
  }
  filterOrder(e: string) {
    this.loadDataFromServer().then();
  }
  handleInputChange(searchText: any): void {
    // Cập nhật giá trị BehaviorSubject khi có sự thay đổi
    this.searchSubject.next(searchText);
  }

}
