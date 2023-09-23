import {AfterViewInit, Component, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {USER_TYPE} from "../../Constants/vg-constant";

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
        this.api.getAllUsersByType(URL.API_USER_BY_TYPE, USER_TYPE.AGENT).subscribe((data) => {
            console.log(data);
        })
        // setTimeout(() => {
        //     this.communicationService.sendEventToJs('LOAD-DATA', {userName: "userName"});
        // }, 30 * 1000);
    }
}
