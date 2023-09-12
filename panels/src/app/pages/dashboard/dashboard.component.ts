import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit , OnDestroy{
 list = [
   'assets/js/app.min.js',
   'assets/js/scripts.js',
   'assets/js/appScript.js',
   'assets/bundles/apexcharts/apexcharts.min.js',
   'assets/js/page/index.js'
 ];

  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) {}
  ngOnDestroy(): void {
    // remove script
  }
  ngAfterViewInit(): void {
    this.loadScript.addListScript(this.list).then();
    setTimeout(() => {
      this.communicationService.sendEventToJs('LOAD-DATA' , {userName: "userName"});
    }, 30*1000);
  }
}
