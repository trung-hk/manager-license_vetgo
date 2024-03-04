import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {URL} from "../../Constants/api-urls";
import {STATUS_REPORT, TYPE_REPORT, USER_TYPE} from "../../Constants/vg-constant";
import {ObjectSelectReport} from "../../models/ObjectSelectReport";
import {
    lastDayOfISOWeek, lastDayOfMonth, lastDayOfYear,
    startOfDay,
    startOfISOWeek, startOfMonth, startOfYear,
    startOfYesterday
} from "date-fns";
interface ReportData {
    currData: number,
    prevData: number,
    percent?: number,
    status?: string
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
    reportTotalOrder: ReportData = {currData: 0, prevData: 0};
    reportRefund: ReportData = {currData: 0, prevData: 0};
    reportRevenue: ReportData = {currData: 0, prevData: 0};

    listScript = [
        // 'assets/bundles/apexcharts/apexcharts.min.js',
        // 'assets/js/page/index.js'
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
    loadDataFromServer(from: Date, to: Date): void {
       // this.loading = true;
        const objectSelect: ObjectSelectReport = {from: from.toISOString(), to: to.toISOString()}
        this.api.getDataReport<ReportData>(URL.API_REPORT_DATA, TYPE_REPORT.CUSTOMER, objectSelect).subscribe((data) => {
            console.log(data);
            this.reportCustomer = data;
            this.reportCustomer.percent = this.totalPercent(this.reportCustomer);
            this.reportCustomer.status = this.getStatusReport(this.reportCustomer);
        }, error => {
            console.log(error);
        });
        this.api.getDataReport<ReportData>(URL.API_REPORT_DATA, TYPE_REPORT.TOTAL_ORDER, objectSelect).subscribe((data) => {
            console.log(data);
            this.reportTotalOrder = data;
            this.reportTotalOrder.percent = this.totalPercent(this.reportTotalOrder);
            this.reportTotalOrder.status = this.getStatusReport(this.reportTotalOrder);
        }, error => {
            console.log(error);
        });
        this.api.getDataReport<ReportData>(URL.API_REPORT_DATA, TYPE_REPORT.REFUND, objectSelect).subscribe((data) => {
            console.log(data);
            this.reportRefund = data;
            this.reportRefund.percent = this.totalPercent(this.reportRefund);
            this.reportRefund.status = this.getStatusReport(this.reportRefund);
        }, error => {
            console.log(error);
        });
        this.api.getDataReport<ReportData>(URL.API_REPORT_DATA, TYPE_REPORT.REVENUE, objectSelect).subscribe((data) => {
            console.log(data);
            this.reportRevenue = data;
            this.reportRevenue.percent = this.totalPercent(this.reportRevenue);
            this.reportRevenue.status = this.getStatusReport(this.reportRevenue);
        }, error => {
            console.log(error);
        });
    }
    totalPercent(dataReport: ReportData) {
        if ((dataReport.prevData === 0 && dataReport.currData === 0) || (dataReport.prevData === dataReport.currData)) return 0;
        if (dataReport.prevData === 0 && dataReport.currData !== 0) return 100;
        if (dataReport.prevData !== 0 && dataReport.currData === 0) return 100;
        return (dataReport.currData / dataReport.prevData) * 100;
    }
    getStatusReport(dataReport: ReportData): string {
        if (dataReport.prevData === 0 && dataReport.currData === 0) return STATUS_REPORT.INCREASE.value
        return dataReport.currData >= dataReport.prevData ? STATUS_REPORT.INCREASE.value : STATUS_REPORT.DECREASE.value;
    }
    onChangeRange(result: Date[]): void {
        console.log('from: ', startOfDay(result[0]));
        console.log('to: ', startOfDay(result[1]));
        if (!this.isValidDate(startOfDay(result[0])) || !this.isValidDate(startOfDay(result[1]))) {
            this.loadDataFromServer(startOfYesterday(), new Date());
        } else {
            this.loadDataFromServer(startOfDay(result[0]), startOfDay(result[1]));
        }
    }
    isValidDate(value: any): boolean {
        return value instanceof Date && !isNaN(value as any);
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

    protected readonly STATUS_REPORT = STATUS_REPORT;
}