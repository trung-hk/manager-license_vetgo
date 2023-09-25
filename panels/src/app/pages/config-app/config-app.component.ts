import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ConfigApp} from "../../models/ConfigApp";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {STATUS_CONFIG} from "../../Constants/vg-constant";
import {URL} from "../../Constants/api-urls";

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
    keyWork: string | null = null;
    filter: Array<{ key: string; value: string[] }> | null = null;
    filterStatus = [
        {text: STATUS_CONFIG.NOT_ACTIVATED_LABEL, value: STATUS_CONFIG.NOT_ACTIVATED_VALUE},
        {text: STATUS_CONFIG.PENDING_ACTIVE_LABEL, value: STATUS_CONFIG.PENDING_ACTIVE_VALUE},
        {text: STATUS_CONFIG.ACTIVATED_LABEL, value: STATUS_CONFIG.ACTIVATED_VALUE},
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
        this.validateForm = this.fb.group({
            id: [null],
            firebase: [null, [Validators.required]],
            sheetId: [null, [Validators.required]],
            customer: [null],
            status: [null, [Validators.required]]
        });
    }

    ngAfterViewInit(): void {
        this.renderer.addClass(document.querySelector('.config'), "active");
        this.renderer.addClass(document.querySelector('.config a'), "toggled");
        this.renderer.addClass(document.querySelector('.manager-config-app'), "active");
        this.renderer.addClass(document.querySelector('.manager-config-app a'), "toggled");
        this.loadScript.addListScript(this.listScript).then();
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
                firebase: configApp.firebase,
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
            this.validateForm.setValue({
                id: null,
                firebase: null,
                sheetId: null,
                customer: "",
                status: "0"
            });
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
                        this.scriptFC.alertShowMessageSuccess('Lưu thành công');
                        this.isConfirmLoading = false;
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError('Lưu thất bại');
                        this.isConfirmLoading = false;
                    });
                } else {
                    this.api.insert<ConfigApp>(data, URL.API_CONFIG_APP).subscribe(() => {
                        this.isVisible = false;
                        this.loadDataFromServer();
                        this.scriptFC.alertShowMessageSuccess('Lưu thành công');
                        this.isConfirmLoading = false;
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError('Lưu thất bại');
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
            this.scriptFC.alertShowMessageError('Lưu thất bại');
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
                this.scriptFC.alertShowMessageSuccess('Xóa thành công');
            }, (error) => {
                console.log(error);
                this.scriptFC.alertShowMessageError('Xóa thất bại');
            });
        }
    }
    search(event: any): void {
        console.log(event);
        this.loadDataFromServer(event.target.value);
        event.target.value = "";
    }
}