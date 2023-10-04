import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AntDemoComponent} from "./ant-demo/ant-demo.component";
import {RouterModule, Routes} from "@angular/router";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
import {DemPaginationComponent} from './dem-pagination/dem-pagination.component';
import { AgentProductComponent } from './agent-product/agent-product.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgxPermissionsModule} from "ngx-permissions";

const routes: Routes =
    [
        {
            path: 'demo',
            component: AntDemoComponent
        },
        {
            path: 'pagination',
            component: DemPaginationComponent
        }
    ]

@NgModule({
    declarations: [AntDemoComponent, DemPaginationComponent, AgentProductComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DragDropModule,
        ScrollingModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        NgxPermissionsModule
    ]
})
export class PagesModule {
}
