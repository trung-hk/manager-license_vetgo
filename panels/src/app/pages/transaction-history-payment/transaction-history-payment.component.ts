import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {Transaction} from "../../models/Transaction";
import {URL} from "../../Constants/api-urls";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {Message} from "../../Constants/message-constant";
import {Constant, STATUS_PAYMENT, TYPE_REFERENCE_PAYMENT} from "../../Constants/vg-constant";
import {OrderService} from "../../models/OrderService";
import {CommissionApproved} from "../../models/CommissionApproved";
import {IModalViewPaymentData} from "../../models/ModalData";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
  selector: 'app-transaction-history-payment',
  templateUrl: './transaction-history-payment.component.html',
})
export class TransactionHistoryPaymentComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  listScript = [];
  dataList: Transaction[] = [];
  selectReference?: string;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              public scriptFC: ScriptCommonService,
              private viewContainerRef: ViewContainerRef) {
    super()
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.transactions'), "active");
      this.renderer.addClass(document.querySelector('.transactions a'), "toggled");
      this.renderer.addClass(document.querySelector('.history-transactions'), "active");
      this.renderer.addClass(document.querySelector('.history-transactions a'), "toggled");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.transactions'), "active");
    this.renderer.removeClass(document.querySelector('.history-transactions'), "active");
  }
  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(from?: string, to?: string, keyWork?: string): void {
    this.loading = true;
    const objectSelect: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork, fromCreatedDate: from, toCreatedDate: to, referenceType: this.selectReference}
    this.api.getAll<ResponseDataGetAll<Transaction>>(URL.API_TRANSACTION_HISTORY_PAYMENT, objectSelect).subscribe(data => {
      this.dataList = data.content;
      this.total = data.totalElements;
      this.loading = false;
    }, error => {
      console.log(error);
      this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
      this.loading = false;
    })
  }
  createComponentPaymentDetailsModal(id: string, typePayment: string) {
    let paymentData: IModalViewPaymentData = {};
    switch (typePayment) {
      case TYPE_REFERENCE_PAYMENT.PAYMENT_ORDER_SERVICE.value:
        this.api.getById<OrderService>(id, URL.API_ORDER_SERVICE).subscribe(data => {
          if (this.scriptFC.validateResponseAPI(data.status)) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
          } else {
            paymentData.order = data;
            this.scriptFC.createComponentPaymentDetailsModal(paymentData, this.viewContainerRef);
          }
        });
        break;
      case TYPE_REFERENCE_PAYMENT.REFUND_COMMISSION_APPROVE.value:
        this.api.getById<CommissionApproved>(id, URL.API_COMMISSION_APPROVED).subscribe(data => {
          if (this.scriptFC.validateResponseAPI(data.status)) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
          } else {
            paymentData.commissionApproved = data;
            this.scriptFC.createComponentPaymentDetailsModal(paymentData, this.viewContainerRef);
          }
        });
        break;
    }

  }
  onChangeReference(value: string): void {
    this.loadDataFromServer();
  }

  protected readonly TYPE_REFERENCE_PAYMENT = TYPE_REFERENCE_PAYMENT;
}
