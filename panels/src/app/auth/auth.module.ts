import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteURL} from "../Constants/route-url";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "../ng-zorro-antd.module";

const routes: Routes =
    [
        {
            path: RouteURL.PAGE_FORGOT_PASSWORD,
            component: ForgotPasswordComponent
        }
    ]

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ]
})
export class AuthModule {
}
