import {inject, NgModule} from '@angular/core';
import {CanActivateFn, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './authentication/auth.guard';
import {AgentComponent} from './pages/agent/agent.component';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {PortalLayoutComponent} from "./portal-layout/portal-layout.component";
import {ConfigAppComponent} from "./pages/config-app/config-app.component";
import {ProductComponent} from './pages/product/product.component';
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
        path: RouteURL.PAGE_PRODUCT,
        component: ProductComponent
      },
      {
        path: RouteURL.PAGE_PROFILE,
        component: ProfileComponent
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
            only: [ROLES.PARTNER, ROLES.CUSTOMER],
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
    ],
    canActivate: [isAuthenticated],
  },
  {
    path: 'demo',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
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
