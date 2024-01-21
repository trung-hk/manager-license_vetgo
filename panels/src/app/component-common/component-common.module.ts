import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgZorroAntdModule} from "../ng-zorro-antd.module";
import { SuccessComponent } from './status-tag/success.component';
import { InfoComponent } from './status-tag/info.component';
import {WarningComponent} from "./status-tag/warning.component";
import { MoneyComponent } from './money/money.component';
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import { TitleContentLeftComponent } from './title-content-left/title-content-left.component';
import { TitleActionComponent } from './title-action/title-action.component';
import {NgxPermissionsModule} from "ngx-permissions";
import {FormsModule} from "@angular/forms";
import { PhoneComponent } from './phone/phone.component';
import {DangerComponent} from "./status-tag/danger.component";
import { PercentComponent } from './percent/percent.component';



@NgModule({
  declarations: [
    SuccessComponent,
    InfoComponent,
    WarningComponent,
    DangerComponent,
    MoneyComponent,
    TitleContentLeftComponent,
    TitleActionComponent,
    PhoneComponent,
    PercentComponent
  ],
    exports: [
        SuccessComponent,
        InfoComponent,
        WarningComponent,
        MoneyComponent,
        TitleContentLeftComponent,
        TitleActionComponent,
        PhoneComponent,
        DangerComponent,
        PercentComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgxPermissionsModule,
        FormsModule,
    ]
})
export class ComponentCommonModule { }
