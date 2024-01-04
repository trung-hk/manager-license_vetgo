import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Constant, ROLES, STATUS_AGENT, STATUS_ORDER, STATUS_PAYMENT} from "../../Constants/vg-constant";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {URL} from "../../Constants/api-urls";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {ActivatedRoute} from "@angular/router";
import {ResponsePaymentVietQR} from "../../models/ResponesePayment";
import {Message} from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {DataService} from "../../services/data.service";

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
  loading: boolean = true;
  data: ResponsePaymentVietQR = {};
  orderInfo: OrderService = {};
  backUrl!: string;
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
    this.init();
    const dataRedirect: {backUrl: string} = this.dataService.getData();
    this.backUrl = dataRedirect.backUrl;
  }
  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    this.loading = true;
    let loading_success_1 = false;
    let loading_success_2 = false;
    const idOrder = this.route.snapshot.paramMap.get('id');
    const api = this.scriptFC.formatString(URL.API_PAYMENT_CONFIRM, [idOrder!, PAYMENTS_METHOD.VIET_QR]);
    const returnURL = `${window.location.origin}/payment-complete-details/${idOrder}`
    this.api.payment<ResponsePaymentVietQR>(api, returnURL).subscribe((data) => {
      if (this.scriptFC.validateResponseAPI(data.status)){
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
    this.api.getById<OrderService>(idOrder, URL.API_ORDER_SERVICE).subscribe((data) => {
      this.orderInfo = data;
      loading_success_2 = true;
      this.loading = !(loading_success_1 && loading_success_2);
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(`${Message.MESSAGE_LOAD_DATA_FAILED}`);
      this.loading = false;
    });

  }
}
