
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

@NgModule({
    exports: [
        NzIconModule,
        NzTableModule,
        NzDividerModule,
        NzModalModule,
        NzGridModule,
        NzButtonModule,
    ],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class NgZorroAntdModule {

}
