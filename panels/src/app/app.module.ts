import {APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {PartialsModule} from "./partials/partials.module";
import { PortalLayoutComponent } from './portal-layout/portal-layout.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import { HttpClientModule } from '@angular/common/http';
import { AgentComponent } from './pages/agent/agent.component';
import { ConfigAppComponent } from './pages/config-app/config-app.component';
import { NgxPermissionsModule } from 'ngx-permissions';
// for production
const fullURL = window.location.href
const domainRegex = new RegExp('.phanmemvet.vn(.*)', 'g');
const  storedCorporate = fullURL.replace(domainRegex, '')
  .replace(/localhost(.*)/g, '')
  .replace(/^http(.*):\/\//g, '')
  .replace(/\./g, '');
console.log( "brand id: " +  storedCorporate);
let realm  = 'datmt-test-realm';
if (storedCorporate) {
  realm = storedCorporate;
}
if (window.location.href.startsWith('https://phanmemvet.vn')) {
  realm  = 'datmt-test-realm';
}
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://keycloak.phanmemvet.vn',
        realm: 'vetgo2',
        clientId: 'vetgo'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html'
      },
      bearerExcludedUrls: ['script.google.com'],
    });
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PortalLayoutComponent,
    AgentComponent,
    ConfigAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PartialsModule,
    KeycloakAngularModule,
    HttpClientModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
