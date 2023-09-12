import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { SidebarSettingRightComponent } from './sidebar-setting-right/sidebar-setting-right.component';
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarLeftComponent,
    SidebarSettingRightComponent
  ],
    imports: [
        CommonModule,
        RouterLink
    ],
  exports: [
      FooterComponent,
      HeaderComponent,
      SidebarLeftComponent,
      SidebarSettingRightComponent
  ]
})
export class PartialsModule { }
