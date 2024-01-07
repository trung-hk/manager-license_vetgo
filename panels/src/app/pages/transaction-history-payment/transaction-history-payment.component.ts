import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {FormArray, UntypedFormBuilder} from "@angular/forms";
import {PRODUCT_SERVICE_FORM} from "../../Constants/Form";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Item} from "../../models/Item";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {Transaction} from "../../models/Transaction";
import {URL} from "../../Constants/api-urls";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {Message} from "../../Constants/message-constant";
import {Constant, STATUS_PAYMENT, TYPE_REFERENCE_PAYMENT} from "../../Constants/vg-constant";
import {OrderService} from "../../models/OrderService";

@Component({
  selector: 'app-transaction-history-payment',
  templateUrl: './transaction-history-payment.component.html',
})
export class TransactionHistoryPaymentComponent implements OnInit, AfterViewInit, OnDestroy{
  protected readonly Constant = Constant;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  listScript = [];
  dataList: Transaction[] = [];
  total: number = 1;
  loading: boolean = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  sort: string | null = "last_modified_date,desc";
  changeFirst: boolean = true;
  filter: Array<{ key: string; value: string[] }> | null = null;
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
  loadDataFromServer(keyWork?: string): void {
    this.loading = true;
    const objectSelect: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
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
  createComponentOrderServiceDetailsModal(idOrder: string): void {
    this.api.getById<OrderService>(idOrder, URL.API_ORDER_SERVICE).subscribe(data => {
      data.attributesObject = this.scriptFC.getAttributeOrderProductService(data.attributes);
      this.scriptFC.createComponentOrderServiceDetailsModal(data, this.viewContainerRef);
    })
  }

  protected readonly TYPE_REFERENCE_PAYMENT = TYPE_REFERENCE_PAYMENT;
}
