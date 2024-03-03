import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {
  Constant,
  STATUS_PAYMENT,
} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";
import {Message} from "../../Constants/message-constant";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {OrderService} from "../../models/OrderService";
import {RouteURL} from "../../Constants/route-url";
import {PayloadApprovePayment} from "../../models/PayloadApprovePayment";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
  selector: 'app-approve-manual-payment',
  templateUrl: './approve-manual-payment.component.html'
})
export class ApproveManualPaymentComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly RouteURL = RouteURL;
  listScript = [];
  dataOrderList: OrderService[] = [];
  idShowModal: boolean = false;
  orderApprove!: OrderService | null;
  isAwaitApprove: boolean = false;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,) {
    super()
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
  loadDataFromServer(from?: string, to?: string, keyWork?: string) {
    this.loading = true;
    this.filter?.push({key: "ods.payment_status", value: [this.STATUS_PAYMENT.IN_PAYMENT.value]});
    console.log(this.filter)
    const objectGetAll: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork, fromCreatedDate: from, toCreatedDate: to}
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
