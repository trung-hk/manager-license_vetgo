import {inject, NgModule} from '@angular/core';
import {CanActivateFn, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './authentication/auth.guard';
import {AgentComponent} from './pages/agent/agent.component';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {PortalLayoutComponent} from "./portal-layout/portal-layout.component";
import {ConfigAppComponent} from "./pages/config-app/config-app.component";
import {ProfileComponent} from './pages/profile/profile.component';
import {ProductServiceComponent} from './pages/product-service/product-service.component';
import {PartnerComponent} from './pages/partner/partner.component';
import {NgxPermissionsGuard} from "ngx-permissions";
import {ROLES} from "./Constants/vg-constant";
import {AgentProductComponent} from "./pages/agent-product/agent-product.component";
import {DistributorComponent} from "./pages/distributor/distributor.component";
import {OrderServiceComponent} from "./pages/order-service/order-service.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {CommissionsComponent} from "./pages/commissions/commissions.component";
import {PaymentBankTransferComponent} from "./pages/payment-bank-transfer/payment-bank-transfer.component";
import {PaymentCompleteDetailsComponent} from "./pages/payment-complete-details/payment-complete-details.component";
import {CustomersComponent} from "./pages/customers/customers.component";
import {LicenseZaloConfigComponent} from "./pages/license-zalo-config/license-zalo-config.component";
import {PackagePurchasedComponent} from "./pages/package-purchased/package-purchased.component";
import {PackageRenewalComponent} from "./pages/package-renewal/package-renewal.component";
import {RouteURL} from "./Constants/route-url";
import {ApproveManualPaymentComponent} from "./pages/approve-manual-payment/approve-manual-payment.component";
import {
  TransactionHistoryPaymentComponent
} from "./pages/transaction-history-payment/transaction-history-payment.component";
import {SettingBankingComponent} from "./pages/setting-banking/setting-banking.component";
import {CommissionApproveComponent} from "./pages/commission-approve/commission-approve.component";
import {
  CommissionApprovePendingComponent
} from "./pages/commission-approve-pending/commission-approve-pending.component";
import {
  ApproveManualPaymentCommissionComponent
} from "./pages/approve-manual-payment-commission/approve-manual-payment-commission.component";

const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
}
const routes: Routes = [
  {
    path: '',
    redirectTo: RouteURL.PAGE_DASHBOARD,
    pathMatch: 'full',
  },
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {
        path: RouteURL.PAGE_DASHBOARD,
        component:  DashboardComponent
      },
      {
        path: RouteURL.PAGE_AGENTS,
        component: AgentComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo: RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_AGENT_PRODUCT,
        component: AgentProductComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_MANAGER_CONFIG_APP,
        component: ConfigAppComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PROFILE,
        component: ProfileComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER, ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PRODUCT_SERVICE,
        component: ProductServiceComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_DISTRIBUTORS,
        component: DistributorComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.AGENT],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PARTNERS,
        component: PartnerComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.DISTRIBUTOR],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_ORDER_SERVICE,
        component: OrderServiceComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.PARTNER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_ORDERS,
        component: OrdersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.PARTNER, ROLES.DISTRIBUTOR, ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_COMMISSIONS,
        component: CommissionsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PAYMENT_BANK_TRANSFER,
        component: PaymentBankTransferComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER, ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_CUSTOMERS,
        component: CustomersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PAYMENT_COMPLETE_DETAILS,
        component: PaymentCompleteDetailsComponent,
      },
      {
        path: RouteURL.PAGE_LICENSE_ZALO,
        component: LicenseZaloConfigComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PACKAGE_PURCHASED,
        component: PackagePurchasedComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_PACKAGE_RENEWAL,
        component: PackageRenewalComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_APPROVE_MANUAL_PAYMENT,
        component: ApproveManualPaymentComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_TRANSACTION_HISTORY_PAYMENT,
        component: TransactionHistoryPaymentComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER, ROLES.CUSTOMER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_SETTING_BANKING,
        component: SettingBankingComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_COMMISSION_APPROVE,
        component: CommissionApproveComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_COMMISSION_APPROVE_PENDING,
        component: CommissionApprovePendingComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
      {
        path: RouteURL.PAGE_APPROVE_MANUAL_PAYMENT_COMMISSION,
        component: ApproveManualPaymentCommissionComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER],
            redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_403)
          }
        }
      },
    ],
    canActivate: [isAuthenticated],
  },
  {
    path: RouteURL.PAGE_AUTH,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: RouteURL.PAGE_ERROR,
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo:  RouteURL.nextToPage(RouteURL.PAGE_ERROR_404)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
