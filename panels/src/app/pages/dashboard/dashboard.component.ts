import {AfterViewInit, Component, inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
    listScript = [
        'assets/bundles/apexcharts/apexcharts.min.js',
        'assets/js/page/index.js'
    ];

    constructor(private loadScript: LazyLoadScriptService, private renderer: Renderer2) {
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
}
