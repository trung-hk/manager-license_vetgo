import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {TYPE_REPORT, USER_TYPE} from "../../Constants/vg-constant";
import {ObjectSelectReport} from "../../models/ObjectSelectReport";
import {
    lastDayOfISOWeek, lastDayOfMonth, lastDayOfYear,
    startOfDay,
    startOfISOWeek, startOfMonth, startOfYear,
    startOfYesterday
} from "date-fns";
interface ReportData {
    currData: number,
    prevData: number
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [
        `
      nz-date-picker,
      nz-range-picker {
        margin: 0 8px 12px 0;
      }
    `
    ]
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
    dateOfWeek = null;
    dateOfMonth = null;
    dateOfYear = null;
    rangeDate = null;
    reportCustomer: ReportData = {currData: 0, prevData: 0};

    listScript = [
        'assets/bundles/apexcharts/apexcharts.min.js',
        'assets/js/page/index.js'
    ];

    constructor(private loadScript: LazyLoadScriptService,
                private renderer: Renderer2,
                private api: ApiCommonService) {
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
        this.loadDataFromServer(startOfYesterday(), new Date());
    }
    loadDataFromServer(from: Date, to: Date, keyWork?: string): void {
       // this.loading = true;
        const objectSelect: ObjectSelectReport = {from: from.toISOString(), to: to.toISOString()}
        this.api.getDataReport<ReportData>(URL.API_REPORT_DATA, TYPE_REPORT.CUSTOMER, objectSelect).subscribe((data) => {
            console.log(data);
            this.reportCustomer = data;
        }, error => {
            console.log(error);
        });
    }
    onChangeRange(result: Date[]): void {
        console.log('from: ', startOfDay(result[0]));
        console.log('to: ', startOfDay(result[1]));
        this.loadDataFromServer(startOfDay(result[0]), startOfDay(result[1]));
    }

    onChangeWeek(result: Date): void {
        console.log('from: ', startOfISOWeek(result));
        console.log('to: ', lastDayOfISOWeek(result));
        this.loadDataFromServer(startOfISOWeek(result), lastDayOfISOWeek(result));
    }
    onChangeMonth(result: Date): void {
        console.log('from: ', startOfMonth(result));
        console.log('to: ', lastDayOfMonth(result));
        this.loadDataFromServer(startOfMonth(result), lastDayOfMonth(result));
    }
    onChangeYear(result: Date): void {
        console.log('week: ', startOfYear(result));
        console.log('week: ', lastDayOfYear(result));
        this.loadDataFromServer(startOfYear(result), lastDayOfYear(result));
    }
}