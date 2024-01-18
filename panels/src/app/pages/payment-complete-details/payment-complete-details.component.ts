import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../models/OrderService";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {PackageProduct} from "../../models/PackageProduct";
import {ScriptCommonService} from "../../services/script-common.service";
import {Constant, STATUS_PAYMENT, TYPE_COMMISSION, TYPE_PAYMENT} from "../../Constants/vg-constant";
import {RouteURL} from "../../Constants/route-url";
import {DataService, PaymentCompleteDetailsData} from "../../services/data.service";
import {CommissionApproved} from "../../models/CommissionApproved";

@Component({
  selector: 'app-payment-complete-details',
  templateUrl: './payment-complete-details.component.html',
})
export class PaymentCompleteDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly Constant = Constant;
  protected readonly RouteURL = RouteURL;
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly TYPE_COMMISSION = TYPE_COMMISSION;
  orderService: OrderService | null = null;
  commissionApproved: CommissionApproved | null = null;
  loading: boolean = true;
  packageOrder: PackageProduct | null = null;
  dataRedirect!: PaymentCompleteDetailsData;
  constructor(private loadScript: LazyLoadScriptService,
              private route: ActivatedRoute,
              private api: ApiCommonService,
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
    let id = this.route.snapshot.paramMap.get('id');
    if (!id || !this.dataRedirect) RouteURL.nextToPage(RouteURL.PAGE_ERROR_404);
    switch (this.dataRedirect.typePayment) {
      case TYPE_PAYMENT.ORDER_SERVICE:
        this.api.getById<OrderService>(id, URL.API_ORDER_SERVICE).subscribe((data) => {
          console.log(data)
          if (this.scriptFC.validateResponseAPI(data.status)) RouteURL.nextToPage(RouteURL.PAGE_ERROR_404);
          this.orderService = data;
          this.loading = false;
          this.orderService.attributesObject = this.scriptFC.getAttributeOrderProductService(data.attributes);
          this.packageOrder = this.orderService.attributesObject.packagesMap?.get(this.orderService.packageId!)!;
        })
        break;
      case TYPE_PAYMENT.COMMISSION:
        this.api.getById<CommissionApproved>(id, URL.API_COMMISSION_APPROVED).subscribe((data) => {
          console.log(data)
          if (this.scriptFC.validateResponseAPI(data.status)) RouteURL.nextToPage(RouteURL.PAGE_ERROR_404);
          this.commissionApproved = data;
          this.loading = false;
        })
        break;
    }
  }
  loadDataTransactionLog(id: string) {

  }
}
