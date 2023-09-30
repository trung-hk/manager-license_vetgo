import { Component } from '@angular/core';
import {ROLES} from "../../Constants/vg-constant";

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html'
})
export class SidebarLeftComponent {
  protected readonly ROLES = ROLES;
}
