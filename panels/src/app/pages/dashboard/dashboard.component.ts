import {AfterViewInit, Component, inject, OnDestroy} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
  http = inject(HttpClient)
  constructor(private loadScript: LazyLoadScriptService, private communicationService: CommunicationService) {}
    ngOnDestroy(): void {
    // remove script
  }
  ngAfterViewInit(): void {
      this.http.get('https://dev-api.phanmemvet.vn/api/categories').subscribe( list => {
          console.log(list);
      })
    this.loadScript.addListScript(this.list).then();
    setTimeout(() => {
      this.communicationService.sendEventToJs('LOAD-DATA' , {userName: "userName"});
    }, 30*1000);
  }
}
