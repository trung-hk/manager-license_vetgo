import {AfterViewInit, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Constant, STATUS_PAYMENT, TYPE_COMMISSION} from "../../Constants/vg-constant";
import {RouteURL} from "../../Constants/route-url";
import {OrderService} from "../../models/OrderService";
import {CommissionApproved} from "../../models/CommissionApproved";
import {PackageProduct} from "../../models/PackageProduct";
import {PaymentCompleteDetailsData} from "../../services/data.service";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalViewPaymentData} from "../../models/ModalData";
import {ScriptCommonService} from "../../services/script-common.service";

@Component({
  selector: 'app-payment-details-modal',
  templateUrl: './payment-details-modal.component.html',
})
export class PaymentDetailsModalComponent implements OnInit, AfterViewInit, OnDestroy{

    protected readonly Constant = Constant;
    protected readonly RouteURL = RouteURL;
    protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
    protected readonly TYPE_COMMISSION = TYPE_COMMISSION;
    orderService!: OrderService | undefined;
    commissionApproved: CommissionApproved | undefined;
    loading: boolean = true;
    packageOrder: PackageProduct | null = null;
    dataRedirect!: PaymentCompleteDetailsData;
    readonly #modal = inject(NzModalRef);
    readonly nzModalData: IModalViewPaymentData = inject(NZ_MODAL_DATA);
    constructor(public scriptFC: ScriptCommonService,) {
    }
    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        console.log(this.nzModalData)
        this.orderService = this.nzModalData.order;
        this.commissionApproved = this.nzModalData.commissionApproved;
        if (this.orderService) {
            this.orderService.attributesObject = this.scriptFC.getAttributeOrderProductService(this.orderService.attributes);
            this.packageOrder = this.orderService.attributesObject.packagesMap?.get(this.orderService.packageId!)!;
        }
        this.loading = false;
    }
}
