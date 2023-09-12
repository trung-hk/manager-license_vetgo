import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";

@Component({
  selector: 'app-config-app',
  templateUrl: './config-app.component.html'
})
export class ConfigAppComponent implements AfterViewInit , OnDestroy{
  list = [
    'assets/js/app.min.js',
    'assets/js/scripts.js',
    'assets/js/appScript.js',
    'assets/bundles/apexcharts/apexcharts.min.js',
    'assets/bundles/datatables/datatables.min.js',
    'assets/bundles/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js',
    'assets/bundles/jquery-ui/jquery-ui.min.js',
    'assets/js/page/datatables.js',
    'assets/bundles/izitoast/js/iziToast.min.js',
    'assets/js/page/toastr.js',
    'assets/js/page/config-menu.js',
    'assets/js/page/manager-config-app.js'
  ];
  constructor(private loadScript: LazyLoadScriptService) {}

  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.list).then();
  }

  ngOnDestroy(): void {
  }
}
