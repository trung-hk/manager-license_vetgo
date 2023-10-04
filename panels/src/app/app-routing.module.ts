import {inject, NgModule } from '@angular/core';
import {CanActivateFn, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { AgentComponent } from './pages/agent/agent.component';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {PortalLayoutComponent} from "./portal-layout/portal-layout.component";
import {ConfigAppComponent} from "./pages/config-app/config-app.component";
import { ProductComponent } from './pages/product/product.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductServiceComponent } from './pages/product-service/product-service.component';
import { PartnerComponent } from './pages/partner/partner.component';
import {NgxPermissionsGuard} from "ngx-permissions";
import {ROLES} from "./Constants/vg-constant";
import {AgentProductComponent} from "./pages/agent-product/agent-product.component";

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
        path: 'partner',
        component: PartnerComponent
      }
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
