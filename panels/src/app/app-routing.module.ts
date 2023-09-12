import {inject, NgModule } from '@angular/core';
import {CanActivateFn, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { AgentComponent } from './pages/agent/agent.component';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {PortalLayoutComponent} from "./portal-layout/portal-layout.component";
import {ConfigAppComponent} from "./pages/config-app/config-app.component";
const isAuthenticated: CanActivateFn = (route, state) => {
  return inject(AuthGuard).isAccessAllowed(route, state);
}
const routes: Routes = [
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {
        path: '',
        component:  DashboardComponent
      },
      {
        path: 'agent',
        component: AgentComponent
      },
      {
        path: 'manager-config-app',
        component: ConfigAppComponent
      }
    ],
    canActivate: [isAuthenticated],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
