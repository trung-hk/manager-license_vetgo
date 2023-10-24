import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ConfigApp} from "../../models/ConfigApp";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {URL} from "../../Constants/api-urls";
import {STATUS_CONFIG} from "../../Constants/vg-constant";
import {CONFIG_APP_FORM} from "../../Constants/Form";
import {Message} from "../../Constants/message-constant";

@Component({
    selector: 'app-config-app',
    templateUrl: './config-app.component.html',
})
export class ConfigAppComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_CONFIG = STATUS_CONFIG;
    listScript = [];
    dataList: ConfigApp[] = [];
    total: number = 1;
    loading: boolean = true;
    pageSize: number = 10;
    pageIndex: number = 1;
    sort: string | null = "last_modified_date,desc";
    changeFirst: boolean = true;
    isVisible: boolean = false;
    isVisibleDelete = false;
    isConfirmLoading = false;
    isHorizontal = false;
    validateForm!: UntypedFormGroup;
    idDelete: number | string | null | undefined = -1;
    idShowModal: number | string | null | undefined = null;
    customerShowModal: { id: string | null | undefined, name: string | null | undefined } | null = null;
    filter: Array<{ key: string; value: string[] }> | null = null;
    statusList: {text: string, value: string}[] = [
        {text: this.STATUS_CONFIG.IN_ACTIVE_LABEL, value: this.STATUS_CONFIG.IN_ACTIVE_VALUE},
        {text: this.STATUS_CONFIG.PENDING_ACTIVE_LABEL, value: this.STATUS_CONFIG.PENDING_ACTIVE_VALUE},
        {text: this.STATUS_CONFIG.ACTIVATED_LABEL, value: this.STATUS_CONFIG.ACTIVATED_VALUE},
    ];

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                private scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.init();
        this.validateForm = this.fb.group(CONFIG_APP_FORM);
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.listScript).then(() => {
            this.renderer.addClass(document.querySelector('.config'), "active");
            this.renderer.addClass(document.querySelector('.config a'), "toggled");
            this.renderer.addClass(document.querySelector('.manager-config-app'), "active");
            this.renderer.addClass(document.querySelector('.manager-config-app a'), "toggled");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.config'), "active");
        this.renderer.removeClass(document.querySelector('.manager-config-app'), "active");
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        this.api.getAll<ResponseDataGetAll<ConfigApp>>(URL.API_CONFIG_APP, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
            console.log(data)
            this.loading = false;
            this.total = data.totalElements;
            this.dataList = data.content;
        });
    }

    onQueryParamsChange(params: NzTableQueryParams): void {
        if (this.changeFirst) {
            this.changeFirst = false;
            return;
        }
        console.log(params)
        const {pageSize, pageIndex, sort, filter} = params;
        const currentSort = sort.find(item => item.value !== null);
        const sortField = (currentSort && currentSort.key) || null;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.filter = filter;
        if (!sortField) {
            this.sort = "last_modified_date,desc";
        } else {
            let sortOrder = (currentSort && currentSort.value) || null;
            sortOrder = sortOrder && sortOrder === 'ascend' ? 'asc' : 'desc';
            this.sort = `${sortField},${sortOrder}`;
        }
        this.loadDataFromServer();
    }

    showModal(configApp?: ConfigApp): void {
        this.isVisible = true;
        if (configApp) {
            this.validateForm.setValue({
                id: configApp.id,
                sheetName: configApp.sheetName,
                firebase: configApp.firebase,
                codeAppVetgo: configApp.codeAppVetgo,
                sheetId: configApp.sheetId,
                customer: configApp.customerId ? configApp.customerId : "",
                status: configApp.status
            });
            if (configApp.customerId && configApp.customerId !== "") {
                this.customerShowModal = {
                    id: configApp.customerId,
                    name: configApp.userName
                }
            } else {
                this.customerShowModal = null;
            }
        } else {
            this.validateForm.reset();
            this.validateForm.patchValue({
                status: this.STATUS_CONFIG.IN_ACTIVE_VALUE
            })
            this.customerShowModal = null;
        }
        this.idShowModal = this.validateForm.get("id")?.value;
    }

    handleOk(): void {
        try {
            if (this.validateForm.valid) {
                this.isConfirmLoading = true;
                const data: ConfigApp = this.validateForm.value
                if (data.id) {
                    this.api.update<ConfigApp>(data.id, data, URL.API_CONFIG_APP).subscribe(() => {
                        this.isVisible = false;
                        this.loadDataFromServer();
                        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                        this.isConfirmLoading = false;
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                        this.isConfirmLoading = false;
                    });
                } else {
                    this.api.insert<ConfigApp>(data, URL.API_CONFIG_APP).subscribe(() => {
                        this.isVisible = false;
                        this.loadDataFromServer();
                        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                        this.isConfirmLoading = false;
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                        this.isConfirmLoading = false;
                    })
                }
            } else {
                Object.values(this.validateForm.controls).forEach(control => {
                    if (control.invalid) {
                        control.markAsDirty();
                        control.updateValueAndValidity({onlySelf: true});
                    }
                });
            }
        } catch (error) {
            console.log(error)
            this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
        }


    }

    handleCancel(): void {
        this.isVisible = false;
    }

    showDeleteModal(id: number | string | null | undefined) {
        this.isVisibleDelete = true;
        this.idDelete = id;
    }

    handleCancelDeletePopup(): void {
        this.isVisibleDelete = false;
        this.idDelete = -1;
    }

    handleConfirmToDelete() {
        if (this.idDelete) {
            this.api.delete(this.idDelete, URL.API_CONFIG_APP).subscribe(() => {
                this.loadDataFromServer();
                this.handleCancelDeletePopup();
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
            }, (error) => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
            });
        }
    }
    search(event: any): void {
        console.log(event);
        this.loadDataFromServer(event.target.value);
        event.target.value = "";
    }
}