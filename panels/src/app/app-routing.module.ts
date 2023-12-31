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

const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
}
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component:  DashboardComponent
      },
      {
        path: 'agents',
        component: AgentComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'agent-product',
        component: AgentProductComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'manager-config-app',
        component: ConfigAppComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'product',
        component: ProductComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'product-service',
        component: ProductServiceComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'distributors',
        component: DistributorComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.AGENT],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'partners',
        component: PartnerComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.DISTRIBUTOR],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'order-service',
        component: OrderServiceComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.PARTNER],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.PARTNER, ROLES.DISTRIBUTOR],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'commissions',
        component: CommissionsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'payment-bank-transfer/:id',
        component: PaymentBankTransferComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.PARTNER],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN, ROLES.AGENT, ROLES.DISTRIBUTOR, ROLES.PARTNER],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'payment-complete-details/:id',
        component: PaymentCompleteDetailsComponent,
      },
      {
        path: 'license-zalo',
        component: LicenseZaloConfigComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.ADMIN],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'package-purchased',
        component: PackagePurchasedComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.CUSTOMER],
            redirectTo: '/error/403'
          }
        }
      },
      {
        path: 'package-renewal/:id',
        component: PackageRenewalComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: [ROLES.CUSTOMER],
            redirectTo: '/error/403'
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
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: '**',
    redirectTo: '/error/404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
