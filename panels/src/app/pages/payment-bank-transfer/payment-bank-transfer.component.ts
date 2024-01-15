import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {
  Constant,
  ROLES,
  STATUS_AGENT,
  STATUS_CODE_ERROR,
  STATUS_ORDER,
  STATUS_PAYMENT, TYPE_PAYMENT
} from "../../Constants/vg-constant";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {URL} from "../../Constants/api-urls";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {ActivatedRoute} from "@angular/router";
import {ResponsePaymentVietQR} from "../../models/ResponesePayment";
import {Message} from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {DataService, PaymentBankTransferData} from "../../services/data.service";
import {RouteURL} from "../../Constants/route-url";
import {CommissionApproved} from "../../models/CommissionApproved";

@Component({
  selector: 'app-payment-bank-transfer',
  templateUrl: './payment-bank-transfer.component.html',
})
export class PaymentBankTransferComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly STATUS_AGENT = STATUS_AGENT;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly STATUS_ORDER = STATUS_ORDER;
  protected readonly ROLES = ROLES;
  protected readonly Constant = Constant;
  protected readonly RouteURL = RouteURL;
  loading: boolean = true;
  data: ResponsePaymentVietQR = {};
  orderInfo: OrderService = {};
  commissionInfo: CommissionApproved = {};
  dataRedirect!: PaymentBankTransferData;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private route: ActivatedRoute,
              public scriptFC: ScriptCommonService,
              private dataService: DataService) {
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript([]).then(() => {
    });
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dataRedirect = this.dataService.getData();
    this.init();
  }
  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    debugger;
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    const id = this.route.snapshot.paramMap.get('id');
    const api = this.scriptFC.formatString(this.getApiURLPayment(), [id!, PAYMENTS_METHOD.VIET_QR]);
    const returnURL = window.location.origin + RouteURL.nextToPageWithId(RouteURL.PAGE_PAYMENT_COMPLETE_DETAILS, id!);
    this.api.payment<ResponsePaymentVietQR>(api, returnURL).subscribe((data) => {
      if (this.scriptFC.validateResponseAPI(data.status)){
        console.log(data.status)
        if (data.status == STATUS_CODE_ERROR.ERROR_400) {
          console.log(data)
          //this.dataService.navigateToPage(RouteURL.PAGE_ERROR_404);
        }
        this.scriptFC.alertShowMessageError(`${Message.MESSAGE_LOAD_DATA_FAILED}`);
      } else {
        this.data  = data as ResponsePaymentVietQR;
        this.data.requestJsonObject = JSON.parse(this.data.requestJson!);
      }
      loading_success_1 = true;
      this.loading = !(loading_success_1 && loading_success_2);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(`${Message.MESSAGE_LOAD_DATA_FAILED}`);
      this.loading = false;
    });
    switch (this.dataRedirect.typePayment) {
      case TYPE_PAYMENT.ORDER_SERVICE:
        this.api.getById<OrderService>(id, URL.API_ORDER_SERVICE).subscribe((data) => {
          this.orderInfo = data;
          loading_success_2 = true;
          this.loading = !(loading_success_1 && loading_success_2);
        }, error => {
          console.log(error);
          this.scriptFC.alertShowMessageError(`${Message.MESSAGE_LOAD_DATA_FAILED}`);
          this.loading = false;
        });
        break;
      case TYPE_PAYMENT.COMMISSION:
        this.api.getById<CommissionApproved>(id, URL.API_COMMISSION_APPROVED).subscribe((data) => {
          this.commissionInfo = data;
          loading_success_2 = true;
          this.loading = !(loading_success_1 && loading_success_2);
        }, error => {
          console.log(error);
          this.scriptFC.alertShowMessageError(`${Message.MESSAGE_LOAD_DATA_FAILED}`);
          this.loading = false;
        });
        break;
    }
  }
  getApiURLPayment() {
    switch (this.dataRedirect.typePayment) {
      case TYPE_PAYMENT.ORDER_SERVICE: return URL.API_PAYMENT_CONFIRM_ORDER_SERVICE;
      case TYPE_PAYMENT.COMMISSION: return URL.API_PAYMENT_COMMISSION_APPROVED;
      default: return URL.API_PAYMENT_CONFIRM_ORDER_SERVICE;
    }
  }

  protected readonly TYPE_PAYMENT = TYPE_PAYMENT;
}
