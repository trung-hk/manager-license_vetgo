import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RouterModule, Routes} from "@angular/router";
import {RouteURL} from "../Constants/route-url";

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
        RouterModule.forChild(routes)
    ]
})
export class AuthModule {
}
