import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {CommunicationService} from 'src/app/services/communication.service';
import {LazyLoadScriptService} from 'src/app/services/lazy-load-script.service';
import {FormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Item} from "../../models/Item";
import {URL} from "../../Constants/api-urls";
import {
    STATUS_PRODUCT_SERVICE,
    TYPE_EXPIRED_PACKAGE,
    TYPE_PRODUCT,
    TYPE_PACKAGE,
    CONFIG, TYPE_PRODUCT_SERVICE_LIST
} from "../../Constants/vg-constant";
import {PACKAGE_PRODUCT_SERVICE_FORM, PRODUCT_SERVICE_FORM} from "../../Constants/Form";
import {PackageProduct} from "../../models/PackageProduct";
import {Message} from "../../Constants/message-constant";
import {AttributeObjectProductService} from "../../models/AttributeObjectProductService";

@Component({
    selector: 'app-product-service',
    templateUrl: './product-service.component.html',
})
export class ProductServiceComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
    protected readonly TYPE_PACKAGE = TYPE_PACKAGE;
    protected readonly CONFIG_USING = CONFIG;
    protected readonly JSON = JSON;
    protected readonly TYPE_EXPIRED_PACKAGE = TYPE_EXPIRED_PACKAGE;
    protected readonly TYPE_PRODUCT_SERVICE_LIST = TYPE_PRODUCT_SERVICE_LIST;
    listScript = [];
    dataList: Item[] = [];
    total: number = 1;
    loading: boolean = true;
    pageSize: number = 10;
    pageIndex: number = 1;
    sort: string | null = "last_modified_date,desc";
    changeFirst: boolean = true;
    isVisible: boolean = false;
    isVisibleDelete = false;
    isConfirmLoadingDelete: boolean = false;
    isConfirmLoading = false;
    isHorizontal = false;
    validateProductForm!: UntypedFormGroup;
    validatePackageProductForm!: UntypedFormGroup;
    attributeArrayForm: string = "packages";
    idDelete: number | string | null | undefined = -1;
    idShowModal: number | string | null | undefined = null;
    filter: Array<{ key: string; value: string[] }> | null = null;
    statusList: { text: string, value: string }[] = [
        {text: this.STATUS_PRODUCT_SERVICE.UN_DEPLOYED_LABEL, value: this.STATUS_PRODUCT_SERVICE.UN_DEPLOYED_VALUE},
        {text: this.STATUS_PRODUCT_SERVICE.DEPLOYED_LABEL, value: this.STATUS_PRODUCT_SERVICE.DEPLOYED_VALUE}
    ];
    statusConfigList: { text: string, value: string }[] = [
        {text: this.CONFIG_USING.NOT_USING_LABEL, value: this.CONFIG_USING.NOT_USING_VALUE},
        {text: this.CONFIG_USING.USING_LABEL, value: this.CONFIG_USING.USING_VALUE}
    ];
    formPackage!: FormArray;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                public scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.init();
        this.validateProductForm = this.fb.group(PRODUCT_SERVICE_FORM);
        this.validatePackageProductForm = this.fb.group({
            packages: this.fb.array([])
        });
        this.formPackage = this.validatePackageProductForm.get(this.attributeArrayForm) as FormArray;
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.listScript).then(() => {
            this.renderer.addClass(document.querySelector('.product'), "active");
            this.renderer.addClass(document.querySelector('.product a'), "toggled");
            this.renderer.addClass(document.querySelector('.product-service'), "active");
            this.renderer.addClass(document.querySelector('.product-service a'), "toggled");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.product'), "active");
        this.renderer.removeClass(document.querySelector('.product-service'), "active");
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
            console.log(data)
            this.loading = false;
            this.total = data.totalElements;
            this.dataList = data.content;
            this.dataList.forEach(d => d.packages = this.scriptFC.getPackageService(d.attributes));
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

    showModal(product?: Item): void {
        this.isVisible = true;
        this.formPackage.clear()
        if (product) {
            const attribute = this.scriptFC.getAttributeProductService(product.attributes);
            this.validateProductForm.setValue({
                id: product.id,
                code: product.code,
                name: product.name,
                description: product.description,
                status: product.status,
                usingConfig: attribute.usingConfig ? attribute.usingConfig : this.CONFIG_USING.NOT_USING_VALUE,
                typeProductService: attribute.typeProductService ? attribute.typeProductService : ""
            });
            attribute.packages?.forEach(packageItem => {
                packageItem.typeExpired = TYPE_EXPIRED_PACKAGE.DAY;
                if (packageItem.day) {
                    packageItem.typeExpired = TYPE_EXPIRED_PACKAGE.DAY;
                    packageItem.expired = packageItem.day;
                }
                if (packageItem.month) {
                    packageItem.typeExpired = TYPE_EXPIRED_PACKAGE.MONTH;
                    packageItem.expired = packageItem.month;
                }
                if (packageItem.year) {
                    packageItem.typeExpired = TYPE_EXPIRED_PACKAGE.YEAR;
                    packageItem.expired = packageItem.year;
                }
                if (!packageItem.typePackage) packageItem.typePackage = TYPE_PACKAGE.PAYMENT_VALUE;
                this.formPackage.push(this.fb.group({
                    id: [packageItem.id],
                    name: [packageItem.name],
                    price: [packageItem.price],
                    typeExpired: [packageItem.typeExpired],
                    expired: [packageItem.expired],
                    typePackage: [packageItem.typePackage]
                }));
            });
        } else {
            this.validateProductForm.reset();
            this.validateProductForm.patchValue({
                status: this.STATUS_PRODUCT_SERVICE.DEPLOYED_VALUE,
                usingConfig: this.CONFIG_USING.NOT_USING_VALUE
            });
        }
        this.idShowModal = this.validateProductForm.get("id")?.value;
    }

    handleOk(): void {
        try {
            if (this.validateProductForm.valid) {
                this.isConfirmLoading = true;
                const data: Item = this.validateProductForm.value;
                data.type = TYPE_PRODUCT.SERVICE_PRODUCT;
                const packages = this.validatePackageProductForm.value;
                if (packages.packages.length > 0) {
                    packages.packages = (packages.packages as PackageProduct[])
                        .map(p => {
                            p.id = !p.id ? this.scriptFC.generateUUID() : p.id;
                            switch (p.typeExpired) {
                                case TYPE_EXPIRED_PACKAGE.DAY:
                                    p.day = p.expired;
                                    break;
                                case TYPE_EXPIRED_PACKAGE.MONTH:
                                    p.month = p.expired;
                                    break;
                                case TYPE_EXPIRED_PACKAGE.YEAR:
                                    p.year = p.expired;
                                    break;
                                default:
                                    p.day = p.expired;
                            }
                            delete p.expired;
                            delete p.typeExpired;
                            return p;
                        })
                }
                const attributeProduct: AttributeObjectProductService = {usingConfig: data.usingConfig, packages: packages.packages, typeProductService: data.typeProductService}
                data.attributes = JSON.stringify(attributeProduct);
                if (data.id) {
                    this.api.update<Item>(data.id, data, URL.API_ITEM).subscribe(() => {
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
                    this.api.insert<Item>(data, URL.API_ITEM)
                        .subscribe(() => {
                            this.isVisible = false;
                            this.loadDataFromServer();
                            this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                            this.isConfirmLoading = false;
                        }, error => {
                            console.log(error);
                            this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                            this.isConfirmLoading = false;
                        })
                }
            } else {
                Object.values(this.validateProductForm.controls).forEach(control => {
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
            this.api.delete(this.idDelete, URL.API_ITEM).subscribe(() => {
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
        event.target.value = "";
    }

    formatPhone(event: any): void {
        event.target.value = this.scriptFC.formatPhone(event.target.value);
    }

    addPackage() {
        this.formPackage.push(this.fb.group(PACKAGE_PRODUCT_SERVICE_FORM));
    }

    removeField(index: number, e: MouseEvent): void {
        e.preventDefault();
        this.formPackage.removeAt(index)
    }
}
