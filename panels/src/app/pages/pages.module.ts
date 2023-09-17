import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AntDemoComponent} from "./ant-demo/ant-demo.component";
import {RouterModule, Routes} from "@angular/router";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
import {DemPaginationComponent} from './dem-pagination/dem-pagination.component';

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
    declarations: [AntDemoComponent, DemPaginationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        DragDropModule,
        ScrollingModule,
        NgZorroAntdModule
    ]
})
export class PagesModule {
}
