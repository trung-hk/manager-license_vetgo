import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ErrorForbiddenComponent} from './error-forbidden/error-forbidden.component';
import {ErrorNotFoundComponent} from './error-not-found/error-not-found.component';

const routes: Routes =
    [
        {
            path: '403',
            component: ErrorForbiddenComponent
        },
        {
            path: '404',
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
