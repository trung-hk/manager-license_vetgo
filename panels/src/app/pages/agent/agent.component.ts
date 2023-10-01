import {Component, OnInit, AfterViewInit, OnDestroy, Renderer2} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ApiCommonService} from 'src/app/services/api-common.service';
import {ConfigApp} from "../../models/ConfigApp";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {STATUS_AGENT, USER_TYPE} from "../../Constants/vg-constant";
import {User} from "../../models/User";
import {USER_FORM} from "../../Constants/Form";
import {ResponseError} from "../../models/ResponseError";

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_AGENT = STATUS_AGENT;
    listScript = [];
    dataList: User[] = [];
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
    filter: Array<{ key: string; value: string[] }> | null = null;
    statusList: {text: string, value: string}[] = [
        {text: this.STATUS_AGENT.IN_ACTIVE_LABEL, value: this.STATUS_AGENT.IN_ACTIVE_VALUE},
        {text: this.STATUS_AGENT.ACTIVATED_LABEL, value: this.STATUS_AGENT.ACTIVATED_VALUE}
    ];

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                public scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.init();
        this.validateForm = this.fb.group(USER_FORM);
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.listScript).then(() => {
            this.renderer.addClass(document.querySelector('.agent'), "active");
            this.renderer.addClass(document.querySelector('.agent a'), "toggled");
            this.renderer.addClass(document.querySelector('.agent-list'), "active");
            this.renderer.addClass(document.querySelector('.agent-list a'), "toggled");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.agent'), "active");
        this.renderer.removeClass(document.querySelector('.agent-list'), "active");
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        this.api.getAllUsersByType<ResponseDataGetAll<ConfigApp>>(URL.API_USER_BY_TYPE, USER_TYPE.AGENT, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
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
                phone: this.scriptFC.formatPhone(agent.phone),
                status: agent.status,
                address: agent.address,
            });
            this.validateForm.get("realm")?.disable();
        } else {
            this.validateForm.get("realm")?.enable();
            this.validateForm.reset();
            this.validateForm.patchValue({
                status: this.STATUS_AGENT.ACTIVATED_VALUE
            })
        }
        this.idShowModal = this.validateForm.get("id")?.value;
    }

    handleOk(): void {
        try {
            if (this.validateForm.valid) {
                this.isConfirmLoading = true;
                const data: User = this.validateForm.value
                data.type = USER_TYPE.AGENT;
                let phoneUnFormat = this.scriptFC.convertInputFormatToNumber(data.phone);
                data.phone = phoneUnFormat?.slice(0, 10);
                if (data.id) {
                    this.api.update(data.id, data, URL.API_USER).subscribe((data) => {
                        if (data.status == 400){
                            data = data as ResponseError;
                            this.scriptFC.alertShowMessageError(`Lưu thất bại ${data.message}`);
                        } else {
                            this.isVisible = false;
                            this.loadDataFromServer();
                            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
                        }
                    }, (error) => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError('Lưu thất bại, kiểm tra lại đường truyền');
                        this.isConfirmLoading = false;
                    });
                } else {
                    this.api.insert(data, URL.API_USER)
                        .subscribe((data) => {
                            if (data.status == 400){
                                data = data as ResponseError;
                                this.scriptFC.alertShowMessageError(`Lưu thất bại ${data.message}`);
                            } else {
                                this.isVisible = false;
                                this.loadDataFromServer();
                                this.scriptFC.alertShowMessageSuccess('Lưu thành công');
                            }
                            this.isConfirmLoading = false;
                        }, error => {
                            console.log(error);
                            this.scriptFC.alertShowMessageError('Lưu thất bại, kiểm tra lại đường truyền');
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
            this.scriptFC.alertShowMessageError('Lưu thất bại, kiểm tra lại đường truyền');
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
            this.api.delete(this.idDelete, URL.API_USER).subscribe(() => {
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
        this.loadDataFromServer(event.target.value);
        event.target.value = "";
    }

    formatPhone(event: any): void {
        event.target.value = this.scriptFC.formatPhone(event.target.value);
    }
}
