import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {URL} from "../../Constants/api-urls";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {Item} from "../../models/Item";
import {ActivatedRoute} from "@angular/router";
import {Constant, STATUS_ORDER, STATUS_PAYMENT, TYPE_PAYMENT_PACKAGE} from "../../Constants/vg-constant";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {OrderService} from "../../models/OrderService";

@Component({
  selector: 'app-package-renewal',
  templateUrl: './package-renewal.component.html',
})
export class PackageRenewalComponent implements OnInit, AfterViewInit, OnDestroy {
  listScript = [];
  loading: boolean = false;
  data: Item = {};
  isOpenModalChooseTypePayment = false;
  protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private route: ActivatedRoute,) {
  }

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.listScript).then(() => {
      this.renderer.addClass(document.querySelector('.package-purchased'), "active");
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.querySelector('.package-purchased'), "active");
  }

  ngOnInit(): void {
    this.init();
  }
  init(): void {
    this.loadDataFromServer();
  }
  loadDataFromServer(): void {
    this.api.getById<Item>(this.route.snapshot.paramMap.get('id'), URL.API_ITEM).subscribe((data) => {
      console.log(data)
      this.data = data;
      this.data.packages = this.scriptFC.getPackageService(this.data.attributes).filter(pk => pk.typePackage != TYPE_PAYMENT_PACKAGE.FREE.value);
      this.loading = false;
    })
  }
  showModalChoosePayment(): void {
    this.isOpenModalChooseTypePayment = true;
  }
  handleCancelChoosePayment(): void {
    this.isOpenModalChooseTypePayment = false;
  }

  payment(idPackage: string, method: string): void {
    const order: OrderService = {
      id: "1",
      status: STATUS_ORDER.IN_PROCESS.value,
      paymentStatus: STATUS_PAYMENT.UN_PAID.value,
    };
    this.scriptFC.payment(order, method);
  }

    protected readonly Constant = Constant;
}
