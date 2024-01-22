import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {TYPE_REPORT, USER_TYPE} from "../../Constants/vg-constant";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {User} from "../../models/User";
import {Message} from "../../Constants/message-constant";
import {ObjectSelectReport} from "../../models/ObjectSelectReport";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
    listScript = [
        'assets/bundles/apexcharts/apexcharts.min.js',
        'assets/js/page/index.js'
    ];

    constructor(private loadScript: LazyLoadScriptService, private renderer: Renderer2, private api: ApiCommonService) {
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.index'), "active");
    }

    ngAfterViewInit(): void {
        this.renderer.addClass(document.querySelector('.index'), "active");
        this.loadScript.addListScript(this.listScript).then();
        // setTimeout(() => {
        //     this.communicationService.sendEventToJs('LOAD-DATA', {userName: "userName"});
        // }, 30 * 1000);
    }

    ngOnInit(): void {
        this.loadDataFromServer();
    }
    loadDataFromServer(keyWork?: string): void {
       // this.loading = true;
        const objectSelect: ObjectSelectReport = {from: new Date().toISOString(), to: new Date().toISOString()}
        this.api.getDataReport(URL.API_REPORT_DATA, TYPE_REPORT.CUSTOMER, objectSelect).subscribe((data) => {
            console.log(data)
        }, error => {
            console.log(error);
        });
    }
}
