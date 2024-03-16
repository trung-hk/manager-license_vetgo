import {APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {PartialsModule} from "./partials/partials.module";
import {PortalLayoutComponent} from './portal-layout/portal-layout.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AgentComponent} from './pages/agent/agent.component';
import {ConfigAppComponent} from './pages/config-app/config-app.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {LoaderInterceptor} from "./interceptors/loader.interceptor";
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductServiceComponent } from './pages/product-service/product-service.component';
import { PartnerComponent } from './pages/partner/partner.component';
import {CommonModule, registerLocaleData} from "@angular/common";
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from "./ng-zorro-antd.module";
import {ShareModule} from "./pipe/share/share.module";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {isEnvironmentPro, REALM} from "./Constants/vg-constant";
import {ComponentCommonModule} from "./component-common/component-common.module";
import {PagesModule} from "./pages/pages.module";
registerLocaleData(vi);
if (isEnvironmentPro()) {
    console.log = function () {};
}
// for production
const realm = REALM();
const URL_KEY_CLOAK_PRO: string = 'https://keycloak.phanmemvet.vn';
const URL_KEY_CLOAK_DEV: string = 'https://keycloak.moonpet.vn';
function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: isEnvironmentPro() ? URL_KEY_CLOAK_PRO : URL_KEY_CLOAK_DEV,
                realm: realm,
                clientId: 'vetgo-fe'
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
    ConfigAppComponent,
    ProfileComponent,
    ProductServiceComponent,
    PartnerComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PartialsModule,
        KeycloakAngularModule,
        HttpClientModule,
        NgxPermissionsModule.forRoot(),
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        ShareModule,
        NgxMaskPipe,
        NgxMaskDirective,
        ComponentCommonModule,
        PagesModule
    ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    [
      { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
      { provide: NZ_I18N, useValue: vi_VN }
  ],
      provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
