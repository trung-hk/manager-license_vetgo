import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {URL} from "../../Constants/api-urls";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {Item} from "../../models/Item";
import {ActivatedRoute} from "@angular/router";
import {
  CONFIG,
  Constant,
  MODE_OPEN_MODAL_FORM_ORDER_SERVICE, MODE_ORDER,
  TYPE_PAYMENT_PACKAGE
} from "../../Constants/vg-constant";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {AttributesModalFormOrderService} from "../../models/AttributesModalFormOrderService";
import {DataService} from "../../services/data.service";

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
  protected readonly Constant = Constant;
  protected readonly CONFIG = CONFIG;
  constructor(private loadScript: LazyLoadScriptService,
              private api: ApiCommonService,
              private renderer: Renderer2,
              private scriptFC: ScriptCommonService,
              private activatedRoute: ActivatedRoute,
              private viewContainerRef: ViewContainerRef,
              private dataService: DataService,) {
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
    this.api.getById<Item>(this.scriptFC.getParamUrl("id", this.activatedRoute), URL.API_ITEM).subscribe((data) => {
      console.log(data)
      this.data = data;
      const attributeObject = this.scriptFC.getAttributeProductService(this.data.attributes);
      this.data.packages = attributeObject.packages?.filter(pk => pk.typePackage != TYPE_PAYMENT_PACKAGE.FREE.value);
      this.data.usingConfig = attributeObject.usingConfig;
      this.loading = false;
    })
  }
  showModalChoosePayment(): void {
    this.isOpenModalChooseTypePayment = true;
  }
  handleCancelChoosePayment(): void {
    this.isOpenModalChooseTypePayment = false;
  }

  createComponentModal(packageId: string): void {
    const attributes: AttributesModalFormOrderService = {
      modeOpen: MODE_OPEN_MODAL_FORM_ORDER_SERVICE.CUSTOMER_ORDER,
      productInfo: [this.data],
      idProductSelect: this.data.id!,
      packageId: packageId
    }
    switch (this.data.usingConfig) {
      case CONFIG.VET_APP.value:
      case CONFIG.ADMIN_ONLINE_SHOP.value:
      case CONFIG.WIFI_MARKETING.value:
      case CONFIG.POS.value:
      case CONFIG.SPA.value:
        attributes.fromOrderMode = MODE_ORDER.FROM_CUSTOMER;
        break;
      case CONFIG.CS_ZALO_EXPAND.value:
        attributes.fromOrderMode = MODE_ORDER.FROM_CUSTOMER_CS_ZALO_EXPAND;
      break;
      case CONFIG.CS_ZALO.value:
        const data: {phones: string[], phoneSelect: string} = this.dataService.getData();
        attributes.phoneSelect = [data.phoneSelect];
        attributes.phoneList = data.phones;
        attributes.fromOrderMode = MODE_ORDER.FROM_CUSTOMER_CS_ZALO;
        // attributes.phoneSelect = ["01472583690"];
        // attributes.phoneList = ["01472583690", "01472583691", "01472583692"];
        break;
      default:
        attributes.fromOrderMode = MODE_ORDER.FROM_CUSTOMER;
        break;
    }
    this.scriptFC.createComponentModalFormOrderService(this.viewContainerRef, attributes);

  }
}
