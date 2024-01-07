import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalViewOrderServiceData} from "../../models/ModalData";
import {ScriptCommonService} from "../../services/script-common.service";
import {OrderService} from "../../models/OrderService";
import {Constant, STATUS_PAYMENT} from "../../Constants/vg-constant";
import {RouteURL} from "../../Constants/route-url";
import {PackageProduct} from "../../models/PackageProduct";

@Component({
  selector: 'app-order-service-details-modal',
  templateUrl: './order-service-details-modal.component.html',
})
export class OrderServiceDetailsModalComponent  implements OnInit{
  protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
  protected readonly Constant = Constant;
  protected readonly RouteURL = RouteURL;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: IModalViewOrderServiceData = inject(NZ_MODAL_DATA);
  orderService!: OrderService;
  packageOrder!: PackageProduct;
  constructor(public scriptFC: ScriptCommonService,) {
  }
  ngOnInit(): void {
    this.orderService = this.nzModalData.order;
    this.packageOrder = this.orderService?.attributesObject?.packagesMap?.get(this.orderService.packageId!)!;
  }
}
