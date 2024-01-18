import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
import { SuccessComponent } from './status-tag/success.component';
import { InfoComponent } from './status-tag/info.component';
import {WarningComponent} from "./status-tag/warning.component";
import { MoneyComponent } from './money/money.component';
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import { TitleContentLeftComponent } from './title-content-left/title-content-left.component';



@NgModule({
  declarations: [
    SuccessComponent,
    InfoComponent,
    WarningComponent,
    MoneyComponent,
    TitleContentLeftComponent
  ],
  exports: [
    SuccessComponent,
    InfoComponent,
    WarningComponent,
    MoneyComponent,
    TitleContentLeftComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ]
})
export class ComponentCommonModule { }
