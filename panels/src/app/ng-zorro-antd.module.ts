
import { NgModule } from '@angular/core';


import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NZ_ICONS} from "ng-zorro-antd/icon";
const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

import { NzIconModule } from 'ng-zorro-antd/icon';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTooltipDirective, NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzListModule} from "ng-zorro-antd/list";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";

@NgModule({
    exports: [
        NzIconModule,
        NzTableModule,
        NzDividerModule,
        NzModalModule,
        NzGridModule,
        NzButtonModule,
        NzSelectModule,
        NzAvatarModule,
        NzFormModule,
        NzNotificationModule,
        NzTagModule,
        NzCardModule,
        NzInputModule,
        NzToolTipModule,
        NzStatisticModule,
        NzListModule,
        NzSkeletonModule,
        NzInputNumberModule,
    ],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class NgZorroAntdModule {

}
