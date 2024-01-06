import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {User} from "../../models/User";
import {
  CONFIG,
  Constant,
  MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
  ROLES, STATUS_ORDER,
  STATUS_PAYMENT, TYPE_ORDER_SERVICE,
  USER_TYPE
} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";
import {ResponseError} from "../../models/ResponseError";
import {Message} from "../../Constants/message-constant";
import {Commission} from "../../models/Commission";
import {UntypedFormGroup} from "@angular/forms";
import {Transaction} from "../../models/Transaction";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {OrderService} from "../../models/OrderService";
import {BehaviorSubject} from "rxjs";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {RouteURL} from "../../Constants/route-url";
import {PayloadApprovePayment} from "../../models/PayloadApprovePayment";

@Component({
  selector: 'app-approve-manual-payment',
  templateUrl: './approve-manual-payment.component.html'
})
export class ApproveManualPaymentComponent  implements OnInit, AfterViewInit, OnDestroy{
  protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
  protected readonly ROLES = ROLES;
  protected readonly Constant = Constant;
  protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
  protected readonly CONFIG = CONFIG;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly STATUS_ORDER = STATUS_ORDER;
  protected readonly RouteURL = RouteURL;
  listScript = [];
  dataOrderList: OrderService[] = [];
  dataTransactionList: Transaction[] = [];
  userList: User[] = [];
  selectUser: string = "";
  nzFilterOption = (): boolean => true;
  dataCommission: Commission[] = [];
  dataCommissionMap: Map<string, Commission> = new Map<string, Commission>();
  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  isVisible: boolean = false;
  isVisibleDelete = false;
  isConfirmLoadingDelete = false;
  isConfirmLoading = false;
  isHorizontal = false;
  validateForm!: UntypedFormGroup;
  idDelete: number | string | null | undefined = -1;
  idShowModal: boolean = false;
  filter: Array<{ key: string; value: string[] }> | null = [];
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();
  orderApprove!: OrderService | null;
  isAwaitApprove: boolean = false;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private viewContainerRef: ViewContainerRef) {
  }
  ngOnInit() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.transactions'), "active");
      this.renderer.addClass(document.querySelector('.transactions a'), "toggled");
      this.renderer.addClass(document.querySelector('.order-await-approve-list'), "active");
      this.renderer.addClass(document.querySelector('.order-await-approve-list a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.transactions'), "active");
    this.renderer.removeClass(document.querySelector('.order-await-approve-list'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(keyWork?: string) {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    this.filter?.push({key: "ods.payment_status", value: [this.STATUS_PAYMENT.IN_PAYMENT.value]});
    console.log(this.filter)
    const objectGetAll: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<OrderService>>(URL.API_ORDER_SERVICE, objectGetAll).subscribe(data => {
      this.dataOrderList = data.content.map(d => {
        d.attributesObject = this.scriptFC.getAttributeOrderProductService(d.attributes);
        return d;
      });
      this.total = data.totalElements;
      this.loading = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    })
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
    this.loadDataFromServer();
  }

  search(event: any): void {
    this.loadDataFromServer(event.target.value);
    event.target.value = "";
  }
  showApproveModal(order: OrderService) {
    this.idShowModal = true;
    this.orderApprove = order;
  }
  approvePayment() {
    this.isAwaitApprove = true;
    const payload: PayloadApprovePayment = {code: this.orderApprove?.paymentCode, amount: this.orderApprove?.totalAmount, resultCode: 0}
    this.api.approvePayment(URL.API_APPROVE_MANUAL_PAYMENT, payload).subscribe(data => {
      this.loadDataFromServer();
      this.isAwaitApprove = false;
      this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
      this.idShowModal = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
      this.isAwaitApprove = false;
    });

  }
  handleCancelApprovePopup() {
    this.idShowModal = false;
    this.orderApprove = null;
    this.isAwaitApprove = false;
  }
}
