import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ErrorForbiddenComponent} from './error-forbidden/error-forbidden.component';
import {ErrorNotFoundComponent} from './error-not-found/error-not-found.component';
import {RouteURL} from "../Constants/route-url";

const routes: Routes =
    [
        {
            path: RouteURL.PAGE_403,
            component: ErrorForbiddenComponent
        },
        {
            path: RouteURL.PAGE_404,
            component: ErrorNotFoundComponent
        },

    ]

@NgModule({
    declarations: [
        ErrorForbiddenComponent,
        ErrorNotFoundComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ErrorModule {
}
