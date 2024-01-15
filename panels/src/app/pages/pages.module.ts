import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AntDemoComponent} from "./ant-demo/ant-demo.component";
import {RouterModule, Routes} from "@angular/router";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
import {DemPaginationComponent} from './dem-pagination/dem-pagination.component';
import { AgentProductComponent } from './agent-product/agent-product.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPermissionsModule} from "ngx-permissions";
import { DistributorComponent } from './distributor/distributor.component';
import { OrderServiceComponent } from './order-service/order-service.component';
import { FormOrderServiceModalComponent } from './form-order-service-modal/form-order-service-modal.component';
import {ShareModule} from "../pipe/share/share.module";
import { OrdersComponent } from './orders/orders.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { ProductServiceDetailsModalComponent } from './product-service-details-modal/product-service-details-modal.component';
import { PaymentBankTransferComponent } from './payment-bank-transfer/payment-bank-transfer.component';
import { PaymentCompleteDetailsComponent } from './payment-complete-details/payment-complete-details.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerDetailsModalComponent } from './customer-details-modal/customer-details-modal.component';
import { LicenseZaloConfigComponent } from './license-zalo-config/license-zalo-config.component';
import { PackagePurchasedComponent } from './package-purchased/package-purchased.component';
import { PackageRenewalComponent } from './package-renewal/package-renewal.component';
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import { ApproveManualPaymentComponent } from './approve-manual-payment/approve-manual-payment.component';
import { TransactionHistoryPaymentComponent } from './transaction-history-payment/transaction-history-payment.component';
import { OrderServiceDetailsModalComponent } from './order-service-details-modal/order-service-details-modal.component';
import { SettingBankingComponent } from './setting-banking/setting-banking.component';
import { CommissionApproveComponent } from './commission-approve/commission-approve.component';
import { CommissionApprovePendingComponent } from './commission-approve-pending/commission-approve-pending.component';

const routes: Routes =
    [
        {
            path: 'demo',
            component: AntDemoComponent
        },
        {
            path: 'pagination',
            component: DemPaginationComponent
        }
    ]

@NgModule({
    declarations: [AntDemoComponent,
        DemPaginationComponent,
        AgentProductComponent,
        DistributorComponent,
        OrderServiceComponent,
        FormOrderServiceModalComponent,
        OrdersComponent,
        CommissionsComponent,
        ProductServiceDetailsModalComponent,
        PaymentBankTransferComponent,
        PaymentCompleteDetailsComponent,
        CustomersComponent,
        CustomerDetailsModalComponent,
        LicenseZaloConfigComponent,
        PackagePurchasedComponent,
        PackageRenewalComponent,
        ApproveManualPaymentComponent,
        TransactionHistoryPaymentComponent,
        OrderServiceDetailsModalComponent,
        SettingBankingComponent,
        CommissionApproveComponent,
        CommissionApprovePendingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DragDropModule,
        ScrollingModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        ShareModule,
        FormsModule,
        NgxMaskDirective,
        NgxMaskPipe
    ]
})
export class PagesModule {
}
