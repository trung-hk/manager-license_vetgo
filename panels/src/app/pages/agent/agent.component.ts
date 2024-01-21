import {Component, OnInit, AfterViewInit, OnDestroy, Renderer2} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {ApiCommonService} from 'src/app/services/api-common.service';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {
    Constant,
    isEnvironmentPro,
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE, ROLES,
    STATUS_AGENT,
    USER_TYPE
} from "../../Constants/vg-constant";
import {User} from "../../models/User";
import {USER_FORM_FOR_AGENT} from "../../Constants/Form";
import {ResponseError} from "../../models/ResponseError";
import {Message} from "../../Constants/message-constant";
import {Commission} from "../../models/Commission";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_AGENT = STATUS_AGENT;
    listScript = [];
    dataList: User[] = [];
    dataCommission: Commission[] = [];
    dataCommissionMap: Map<string, Commission> = new Map<string, Commission>();
    total: number = 1;
    loading: boolean = true;
    pageSize: number = 10;
    pageIndex: number = 1;
    sort: string | null = "last_modified_date,desc";
    changeFirst: boolean = true;
    isVisible: boolean = false;
    isVisibleDelete = false;
    isConfirmLoadingDelete = false;
    isConfirmLoading = false;
    isHorizontal = false;
    validateForm!: UntypedFormGroup;
    idDelete: number | string | null | undefined = -1;
    idShowModal: number | string | null | undefined = null;
    filter: Array<{ key: string; value: string[] }> | null = null;
    extensionDomain = isEnvironmentPro() ? Constant.EXTENSION_DOMAIN_PRO : Constant.EXTENSION_DOMAIN_DEV;
    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private renderer: Renderer2,
                public scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.init();
        this.validateForm = this.fb.group(USER_FORM_FOR_AGENT);
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.listScript).then(() => {
            this.renderer.addClass(document.querySelector('.agent'), "active");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.agent'), "active");
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        let loading_success_1 = false;
        let loading_success_2 = false;
        const objectSelectUser: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
        this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.AGENT, objectSelectUser).subscribe((data) => {
            console.log(data)
            loading_success_1 = true;
            this.total = data.totalElements;
            this.dataList = data.content;
            this.loading = !(loading_success_1 && loading_success_2);
        });
        const objectSelectCommission: ObjectSelectAll = {keyword: keyWork}
        this.api.getAll<ResponseDataGetAll<Commission>>(URL.API_COMMISSION, objectSelectCommission).subscribe((data) => {
            console.log(data)
            loading_success_2 = true;
            this.dataCommission = data.content;
            this.dataCommissionMap = new Map<string, Commission>(data.content.map(d => [d.id!, d]));
            this.loading = !(loading_success_1 && loading_success_2);
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

    showModal(agent?: User): void {
        this.isVisible = true;
        this.validateForm.clearValidators();
        if (agent) {
            this.validateForm.setValue({
                id: agent.id,
                realm: agent.realm,
                code: agent.code,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                status: agent.status,
                address: agent.address,
                commissionId: agent.commissionId ? agent.commissionId.toString() : null
            });
            this.validateForm.get("realm")?.disable();
            this.validateForm.get("code")?.disable();
        } else {
            this.validateForm.get("realm")?.enable();
            this.validateForm.get("code")?.enable();
            this.validateForm.reset();
            this.validateForm.patchValue({
                status: this.STATUS_AGENT.ACTIVATED.value
            })
        }
        this.idShowModal = this.validateForm.get("id")?.value;
    }

    handleOk(): void {
        try {
            if (this.validateForm.valid) {
                this.isConfirmLoading = true;
                this.validateForm.get("code")?.enable();
                this.validateForm.get("realm")?.enable();
                const data: User = this.validateForm.value
                data.type = USER_TYPE.AGENT;
                if (data.id) {
                    this.api.update(data.id, data, URL.API_USER).subscribe((data) => {
                        if (this.scriptFC.validateResponseAPI(data.status)){
                            data = data as ResponseError;
                            this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                        } else {
                            this.isVisible = false;
                            this.loadDataFromServer();
                            this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                        }
                        this.isConfirmLoading = false;
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                        this.isConfirmLoading = false;
                    });
                } else {
                    this.api.insert(data, URL.API_USER)
                        .subscribe((data) => {
                            if (this.scriptFC.validateResponseAPI(data.status)){
                                data = data as ResponseError;
                                this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                            } else {
                                this.isVisible = false;
                                this.loadDataFromServer();
                                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                            }
                            this.isConfirmLoading = false;
                        }, error => {
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
            this.isConfirmLoadingDelete = true;
            this.api.delete(this.idDelete, URL.API_USER).subscribe(() => {
                this.loadDataFromServer();
                this.handleCancelDeletePopup();
                this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
                this.isConfirmLoadingDelete = false;
            }, (error) => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_DELETE_FAILED);
                this.isConfirmLoadingDelete = false;
            });
        }
    }
    search(event: any): void {
        this.loadDataFromServer(event.target.value);
    }

    protected readonly Constant = Constant;
    protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
    protected readonly ROLES = ROLES;
}
