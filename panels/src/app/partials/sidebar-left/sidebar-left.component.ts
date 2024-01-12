import { Component } from '@angular/core';
import {ROLES} from "../../Constants/vg-constant";
import {RouteURL} from "../../Constants/route-url";

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html'
})
export class SidebarLeftComponent {
  protected readonly ROLES = ROLES;
  protected readonly RouteURL = RouteURL;
}
