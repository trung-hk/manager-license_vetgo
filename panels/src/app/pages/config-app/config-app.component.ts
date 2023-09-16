import {AfterViewInit, Component, inject, OnDestroy, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ConfigApp} from "../../models/ConfigApp";
import {HttpClient} from '@angular/common/http';
import {BackEndCrud} from "../../app-sheet/back-end.crud";
import {Constant} from 'src/app/utils/constant';
import {ScriptCommonService} from "../../services/script-common.service";

@Component({
    selector: 'app-config-app',
    templateUrl: './config-app.component.html'
})
export class ConfigAppComponent implements AfterViewInit, OnDestroy {
    http = inject(HttpClient);
    apiSheet = new BackEndCrud<any>(this.http, 'AKfycbzC9sSxdtHmTpbzOBMNcOwBV8D36PUOEehuM4XlKe2_B9eNhmrJOf8LRWIv-nYN2LG4');
    listScript = [
        'assets/js/page/manager-config-app.js'
    ];
    data: ConfigApp[] = [];
    showModal: boolean = false;
    // dataCustomerList:
    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                private scriptFC: ScriptCommonService) {
    }

    ngAfterViewInit(): void {
        this.renderer.addClass(document.querySelector('.config'), "active");
        this.renderer.addClass(document.querySelector('.config a'), "toggled");
        this.renderer.addClass(document.querySelector('.manager-config-app'), "active");
        this.renderer.addClass(document.querySelector('.manager-config-app a'), "toggled");
        this.loadScript.addListScript(this.listScript).then(() => this.init());
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.config'), "active");
        this.renderer.removeClass(document.querySelector('.manager-config-app'), "active");
    }

    init(): void {
        this.api.getAll<ConfigApp>(Constant.API_CONFIG_APP, "0", "2").subscribe((data) => {
            this.communicationService.sendEventToJs("ConfigAppComponent", {event: 'init-data', data: data});
        });
    }

    async saveData(buttonId: string): Promise<void> {
        const config_id_element: HTMLInputElement | null = document.querySelector("#id-config-app");
        const config_firebase_element: HTMLInputElement | null = document.querySelector("#config-firebase");
        const config_sheet_id_element: HTMLInputElement | null = document.querySelector("#config-sheet-id");
        const customer_id_element: HTMLInputElement | null = document.querySelector("#customer");
        const status_element: HTMLInputElement | null = document.querySelector("#status");
        const save_data_element: any | null = document.querySelector(`#${buttonId}`);
        let config_id_value: string | null = config_id_element ? config_id_element.value : null;
        console.log(config_id_value);
        let config_firebase_value: string | null = config_firebase_element ? config_firebase_element.value : null;
        let config_sheet_id_value: string | null = config_sheet_id_element ? config_sheet_id_element.value : null;
        let customer_id_value: string | null = customer_id_element ? customer_id_element.value : null;
        let status_value: string | null = status_element ? status_element.value : null;
        let isError = false;
        if (!config_firebase_value || config_firebase_value.trim() === '') {
            this.scriptFC.alertShowMessageError("Config firebase", "không được để trống");
            isError = true;
        }
        if (!config_sheet_id_value || config_sheet_id_value.trim() === '') {
            this.scriptFC.alertShowMessageError("Config sheetId", "không được để trống");
            isError = true;
        }
        if (isError) return;
        const isAddNew: boolean = !config_id_value || config_id_value.trim() === "";
        console.log(isAddNew);
        this.renderer.addClass(save_data_element, 'disabled');
        this.renderer.addClass(save_data_element, 'btn-progress');
        try {
            let configApp: ConfigApp = {
                id: config_id_value,
                firebase: config_firebase_value,
                sheetId: config_sheet_id_value,
                status: status_value,
                customerId: customer_id_value,
            };
            const api = isAddNew ?
                this.api.insert<ConfigApp>(configApp, Constant.API_CONFIG_APP) :
                this.api.update<ConfigApp>(configApp.id, configApp, Constant.API_CONFIG_APP)
            api.subscribe(() => {
                    this.scriptFC.alertShowMessageSuccess('', "Lưu thành công");
                    (document.querySelector(".modal-header button") as HTMLElement).click();
                    this.init();
                })
        } catch (error) {
            console.error(error);
            this.scriptFC.alertShowMessageError('', "Lưu thất bại");
        }
        this.renderer.removeClass(save_data_element, 'disabled');
        this.renderer.removeClass(save_data_element, 'btn-progress');
    }
    deleteData(): void {
        const config_id_element: HTMLInputElement | null = document.querySelector("#id-config-app");
        const save_data_element: any = document.querySelector(`#btn-delete`);
        this.renderer.addClass(save_data_element, 'disabled');
        this.renderer.addClass(save_data_element, 'btn-progress');
        const config_id_value: string | null = config_id_element ? config_id_element.value : null;
        try {
            if (!config_id_value) {
                throw new Error("Delete error");
            } else {
                this.api.delete(config_id_value, Constant.API_CONFIG_APP).subscribe(() => {
                    this.scriptFC.alertShowMessageSuccess('', "Xóa thành công");
                    (document.querySelector(".modal-header button") as HTMLElement).click();
                    this.init();
                })
            }
        } catch (error) {
            console.error(error);
            this.scriptFC.alertShowMessageSuccess('', "Xóa thất bại");
        }
        this.renderer.removeClass(save_data_element, 'disabled');
        this.renderer.removeClass(save_data_element, 'btn-progress');
    }
}
