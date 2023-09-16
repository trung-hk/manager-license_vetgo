import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AntDemoComponent} from "./ant-demo/ant-demo.component";
import {RouterModule, Routes} from "@angular/router";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
const routes: Routes = [{
  path: 'demo',
  component: AntDemoComponent
} ]
@NgModule({
  declarations: [AntDemoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule,
    ScrollingModule,
    NgZorroAntdModule
  ]
})
export class PagesModule { }
