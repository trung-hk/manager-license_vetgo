import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../models/OrderService";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {PackageProduct} from "../../models/PackageProduct";
import {ScriptCommonService} from "../../services/script-common.service";
import {Constant} from "../../Constants/vg-constant";

@Component({
  selector: 'app-payment-complete-details',
  templateUrl: './payment-complete-details.component.html',
})
export class PaymentCompleteDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  orderService: OrderService | null = null;
  loading: boolean = true;
  packageOrder: PackageProduct | null = null;
  constructor(private loadScript: LazyLoadScriptService,
              private route: ActivatedRoute,
              private api: ApiCommonService,
              private scriptFC: ScriptCommonService,) {
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript([]).then(() => {
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.api.getById<OrderService>(this.route.snapshot.paramMap.get('id'), URL.API_ORDER_SERVICE).subscribe((data) => {
      console.log(data)
      this.orderService = data;
      this.loading = false;
      this.packageOrder = this.scriptFC.getPackageService(data.attributes).find(d => d.id === data.packageId)!;
    })
  }

    protected readonly Constant = Constant;
}
