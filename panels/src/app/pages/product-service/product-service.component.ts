import {AfterViewInit, Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {LazyLoadScriptService} from 'src/app/services/lazy-load-script.service';
import {FormArray, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Item} from "../../models/Item";
import {URL} from "../../Constants/api-urls";
import {
    STATUS_PRODUCT_SERVICE,
    TYPE_PACKAGE,
    TYPE_PRODUCT, CONFIG, Enum, TYPE_PAYMENT_PACKAGE,
} from "../../Constants/vg-constant";
import {PACKAGE_PRODUCT_SERVICE_FORM, PRODUCT_SERVICE_FORM} from "../../Constants/Form";
import {PackageProduct} from "../../models/PackageProduct";
import {Message} from "../../Constants/message-constant";
import {AttributeObjectProductService} from "../../models/AttributeObjectProductService";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";

@Component({
    selector: 'app-product-service',
    templateUrl: './product-service.component.html',
})
export class ProductServiceComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
    protected readonly TYPE_PAYMENT_PACKAGE = TYPE_PAYMENT_PACKAGE;
    protected readonly JSON = JSON;
    protected readonly TYPE_PACKAGE = TYPE_PACKAGE;
    protected readonly CONFIG = CONFIG;
    protected readonly CONFIG_LIST = CONFIG.CONFIG_LIST;
    CONFIG_MAP = new Map(this.CONFIG_LIST.map(config => [config.value, config]));
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
    formPackage!: FormArray;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
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
            this.renderer.addClass(document.querySelector('.product-service'), "active");
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.product-service'), "active");
    }

    init(): void {
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        const objectSelectItem: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
        this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, objectSelectItem).subscribe((data) => {
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
        this.formPackage.clear();
        if (product) {
            const attribute = this.scriptFC.getAttributeProductService(product.attributes);
            this.validateProductForm.setValue({
                id: product.id,
                code: product.code,
                name: product.name,
                description: product.description,
                status: product.status,
                usingConfig: attribute.usingConfig ? attribute.usingConfig : this.CONFIG.NOT_USING.value,
            });
            attribute.packages?.forEach(packageItem => {
                packageItem.type = TYPE_PACKAGE.DAY.value;
                if (packageItem.day) {
                    packageItem.type = TYPE_PACKAGE.DAY.value;
                    packageItem.expired = packageItem.day;
                }
                if (packageItem.month) {
                    packageItem.type = TYPE_PACKAGE.MONTH.value;
                    packageItem.expired = packageItem.month;
                }
                if (packageItem.year) {
                    packageItem.type = TYPE_PACKAGE.YEAR.value;
                    packageItem.expired = packageItem.year;
                }
                if (packageItem.year) {
                    packageItem.type = TYPE_PACKAGE.YEAR.value;
                    packageItem.expired = packageItem.year;
                }
                if (!packageItem.typePackage) packageItem.typePackage = TYPE_PAYMENT_PACKAGE.PAYMENT.value;
                this.formPackage.push(this.fb.group({
                    id: [packageItem.id],
                    name: [packageItem.name],
                    price: [packageItem.price],
                    type: [packageItem.type],
                    expired: [packageItem.expired],
                    typePackage: [packageItem.typePackage],
                }));
            });
        } else {
            this.validateProductForm.reset();
            this.validateProductForm.patchValue({
                status: this.STATUS_PRODUCT_SERVICE.DEPLOYED.value,
                usingConfig: this.CONFIG.NOT_USING.value
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
                            switch (p.type) {
                                case TYPE_PACKAGE.DAY.value:
                                    p.day = p.expired;
                                    break;
                                case TYPE_PACKAGE.MONTH.value:
                                    p.month = p.expired;
                                    break;
                                case TYPE_PACKAGE.YEAR.value:
                                    p.year = p.expired;
                                    break;
                                default:
                                    p.day = p.expired;
                            }
                            delete p.expired;
                            delete p.type;
                            return p;
                        })
                }
                const attributeProduct: AttributeObjectProductService = {usingConfig: data.usingConfig, packages: packages.packages}
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

    addPackage() {
       this.formPackage.push(this.fb.group(PACKAGE_PRODUCT_SERVICE_FORM));
    }

    removeField(index: number, e: MouseEvent): void {
        e.preventDefault();
        this.formPackage.removeAt(index)
    }
    eventChangeTypeConfig(value: string) {
        if (value != CONFIG.NOT_USING.value) {
            const conFig = this.CONFIG_MAP.get(value);
            this.validateProductForm.patchValue({
                code: conFig?.value,
                name: conFig?.text
            });
        }
    }
    changeTypePackage(value: string, i: number) {
        switch (value) {
            case TYPE_PAYMENT_PACKAGE.FREE.value:
                this.formPackage.controls[i].patchValue({
                    name: "Dùng thử",
                    price: 0,
                    expired: 7
                })
                break;
        }
    }
    inputExpired(event: any, i: number) {
        if (this.formPackage.controls[i].get('typePackage')?.value === TYPE_PAYMENT_PACKAGE.FREE.value) return;
        let name = event.target.value;
        switch (this.formPackage.controls[i].get('type')?.value) {
            case TYPE_PACKAGE.DAY.value:
                name += ` ${TYPE_PACKAGE.DAY.text}`;
                break;
            case TYPE_PACKAGE.MONTH.value:
                name += ` ${TYPE_PACKAGE.MONTH.text}`;
                break;
            case TYPE_PACKAGE.YEAR.value:
                name += ` ${TYPE_PACKAGE.YEAR.text}`;
                break;
        }
        this.formPackage.controls[i].patchValue({name})
    }
    changeExpired(value: string, i: number) {
        if (this.formPackage.controls[i].get('typePackage')?.value === TYPE_PAYMENT_PACKAGE.FREE.value) return;
        let name = "";
        switch (value) {
            case TYPE_PACKAGE.DAY.value:
                name = `${this.formPackage.controls[i].get('expired')?.value} ${TYPE_PACKAGE.DAY.text}`;
                break;
            case TYPE_PACKAGE.MONTH.value:
                name = `${this.formPackage.controls[i].get('expired')?.value} ${TYPE_PACKAGE.MONTH.text}`;
                break;
            case TYPE_PACKAGE.YEAR.value:
                name = `${this.formPackage.controls[i].get('expired')?.value} ${TYPE_PACKAGE.YEAR.text}`;
                break;
        }
        this.formPackage.controls[i].patchValue({name})
    }
}
