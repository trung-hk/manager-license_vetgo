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
        component: AgentComponent
      },
      {
        path: 'manager-config-app',
        component: ConfigAppComponent
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
        component: ProductServiceComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
