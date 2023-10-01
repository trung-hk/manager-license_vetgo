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
import {STATUS_PRODUCT_SERVICE, TYPE_PRODUCT} from "../../Constants/vg-constant";
import {PACKAGE_PRODUCT_SERVICE_FORM, PRODUCT_SERVICE_FORM} from "../../Constants/Form";
import {PackageProduct} from "../../models/PackageProduct";

@Component({
    selector: 'app-product-service',
    templateUrl: './product-service.component.html',
    styles: [
        `
          .dynamic-delete-button {
            cursor: pointer;
            position: relative;
            top: 4px;
            font-size: 24px;
            color: #999;
            transition: all 0.3s;
          }

          .dynamic-delete-button:hover {
            color: #777;
          }
        `
    ]
})
export class ProductServiceComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PRODUCT_SERVICE = STATUS_PRODUCT_SERVICE;
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
            this.validateProductForm.setValue({
                id: product.id,
                code: product.code,
                name: product.name,
                description: product.description,
                status: product.status,
            });
            this.scriptFC.getPackageService(product.attributes).forEach(packageItem => {
                this.formPackage.push(this.fb.group({
                    id: [packageItem.id],
                    name: [packageItem.name],
                    price: [packageItem.price]
                }));
            });
        } else {
            this.validateProductForm.reset();
            this.validateProductForm.patchValue({
                status: this.STATUS_PRODUCT_SERVICE.DEPLOYED_VALUE
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
                            return p;
                        })
                }
                data.attributes = JSON.stringify(packages);
                if (data.id) {
                    this.api.update<Item>(data.id, data, URL.API_ITEM).subscribe(() => {
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
                    this.api.insert<Item>(data, URL.API_ITEM)
                        .subscribe(() => {
                            this.isVisible = false;
                            this.loadDataFromServer();
                            this.scriptFC.alertShowMessageSuccess('Lưu thành công');
                            this.isConfirmLoading = false;
                        }, error => {
                            console.log(error);
                            this.scriptFC.alertShowMessageError('Lưu thất bại');
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
            this.api.delete(this.idDelete, URL.API_ITEM).subscribe(() => {
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

    get formPackage() {
        return (this.validatePackageProductForm.get(this.attributeArrayForm) as FormArray);
    }

    addPackage() {
        this.formPackage.push(this.fb.group(PACKAGE_PRODUCT_SERVICE_FORM));
    }

    removeField(index: number, e: MouseEvent): void {
        e.preventDefault();
        this.formPackage.removeAt(index)
    }

    protected readonly JSON = JSON;
}
