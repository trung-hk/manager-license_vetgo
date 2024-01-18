import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CommissionApproved} from "../../models/CommissionApproved";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {
  Constant,
  ROLES,
  STATUS_PAYMENT,
} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {RouteURL} from "../../Constants/route-url";
import {PayloadApprovePayment} from "../../models/PayloadApprovePayment";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";

@Component({
  selector: 'app-approve-manual-payment-commission',
  templateUrl: './approve-manual-payment-commission.component.html',
})
export class ApproveManualPaymentCommissionComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly RouteURL = RouteURL;
  listScript = [];
  dataCommissionApprovedList: CommissionApproved[] = [];
  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  idShowModal: boolean = false;
  filter: Array<{ key: string; value: string[] }> | null = [];
  commissionApproved!: CommissionApproved | null;
  isAwaitApprove: boolean = false;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,) {
  }
  ngOnInit() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.transactions'), "active");
      this.renderer.addClass(document.querySelector('.transactions a'), "toggled");
      this.renderer.addClass(document.querySelector('.commission-await-approve-list'), "active");
      this.renderer.addClass(document.querySelector('.commission-await-approve-list a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.transactions'), "active");
    this.renderer.removeClass(document.querySelector('.commission-await-approve-list'), "active");
  }

  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(keyWork?: string) {
    this.loading = true;
    //this.filter?.push({key: "ods.payment_status", value: [this.STATUS_PAYMENT.IN_PAYMENT.value]});
    //console.log(this.filter)
    const objectGetAll: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
    this.api.getAll<ResponseDataGetAll<CommissionApproved>>(URL.API_COMMISSION_APPROVED, objectGetAll).subscribe(data => {
      this.dataCommissionApprovedList = data.content;
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
  showApproveModal(commissionApproved: CommissionApproved) {
    this.idShowModal = true;
    this.commissionApproved = commissionApproved;
  }
  approvePayment() {
    this.isAwaitApprove = true;
    const payload: PayloadApprovePayment = {code: "P8-REF-1705418505641", amount: this.commissionApproved?.totalCommissionAmount, resultCode: 0}
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
    this.commissionApproved = null;
    this.isAwaitApprove = false;
  }

  protected readonly ROLES = ROLES;
  protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
}
