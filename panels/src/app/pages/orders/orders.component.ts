import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {MODE_DISPLAY, ROLES, STATUS_ORDER, STATUS_PAYMENT} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Message} from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {PackageProduct} from "../../models/PackageProduct";
import {ModalFormOrderServiceCallback} from "../../models/ModalFormOrderServiceCallback";
import {PAYMENTS_URL} from "../../Constants/payment-urls";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
    protected readonly STATUS_ORDER = STATUS_ORDER;
    protected readonly ROLES = ROLES;
    protected readonly MODE_DISPLAY = MODE_DISPLAY;
    listScript = [];
    dataList: OrderService[] = [];
    productList: Item[] = [];
    dataProductMap: Map<string, Item> = new Map<string, Item>();
    dataPackageProductMap: Map<string, PackageProduct[]> = new Map<string, PackageProduct[]>();
    dataPackageMap: Map<string, PackageProduct> = new Map<string, PackageProduct>();
    total: number = 1;
    loading: boolean = true;
    pageSize: number = 10;
    pageIndex: number = 1;
    sort: string | null = "last_modified_date,desc";
    changeFirst: boolean = true;
    isVisible: boolean = false;
    isVisibleDelete = false;
    isConfirmLoadingDelete = false;
    orderDelete: OrderService | null | undefined = null;
    filter: Array<{ key: string; value: string[] }> | null = null;
    statusList: { text: string, value: string }[] = [
        {text: this.STATUS_ORDER.IN_PROCESS_LABEL, value: this.STATUS_ORDER.IN_PROCESS_VALUE},
        {text: this.STATUS_ORDER.CANCEL_ORDER_LABEL, value: this.STATUS_ORDER.CANCEL_ORDER_VALUE},
        {text: this.STATUS_ORDER.FINISHED_LABEL, value: this.STATUS_ORDER.FINISHED_VALUE}
    ];
    paymentStatusList: { text: string, value: string }[] = [
        {text: this.STATUS_PAYMENT.UN_PAID_LABEL, value: this.STATUS_PAYMENT.UN_PAID_VALUE},
        {text: this.STATUS_PAYMENT.PAID_LABEL, value: this.STATUS_PAYMENT.PAID_VALUE}
    ];
    modeView!: string;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                private scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder,
                private viewContainerRef: ViewContainerRef,
                private elRef: ElementRef) {
    }
    expandSet = new Set<string>();
    onExpandChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
        }
    }

    ngOnInit() {
        this.modeView = this.elRef.nativeElement.offsetWidth < 765 ? MODE_DISPLAY.MOBILE : MODE_DISPLAY.PC;
        this.init();
    }

    ngAfterViewInit(): void {
        this.loadScript.addListScript(this.listScript).then(() => {
            this.renderer.addClass(document.querySelector('.orders'), "active");
        });
        window.addEventListener('resize', () => {
                this.modeView = this.elRef.nativeElement.offsetWidth < 765 ? MODE_DISPLAY.MOBILE : MODE_DISPLAY.PC;
            console.log(this.modeView);
            console.log(this.elRef.nativeElement.offsetWidth);
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.orders'), "active");
    }

    init(): void {
        this.loadDataFromServer().then();
    }

    async loadDataFromServer(keyWork?: string): Promise<void> {
        return new Promise(rs => {
            this.loading = true;
            let isLoadedDataOrderService = false;
            let isLoadedDataProduct = false;
            this.api.getAll<ResponseDataGetAll<OrderService>>(URL.API_ORDER_SERVICE, this.pageIndex - 1, this.pageSize, this.sort, this.filter, keyWork).subscribe((data) => {
                console.log(data)
                this.loading = false;
                this.total = data.totalElements;
                this.dataList = data.content;
                isLoadedDataOrderService = true;
            }, error => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                rs()
                this.loading = false;
            });
            this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
                .subscribe((data) => {
                    console.log(data)
                    const idProductRegisterList = data.content.map(ap => ap.itemId);
                    this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM, null, null, null, null, null)
                        .subscribe((data) => {
                            console.log(data)
                            this.productList = data.content.filter(ps => idProductRegisterList.includes(ps.id));
                            this.dataProductMap = new Map<string, Item>(
                                this.productList.map(p => [p.id!, p])
                            )
                            this.dataPackageProductMap = new Map<string, PackageProduct[]>(
                                this.productList.map(product => {
                                    const packageList = this.scriptFC.getPackageService(product.attributes);
                                    packageList.forEach(p => this.dataPackageMap.set(p.id!, p));
                                    return [product.id!, packageList];
                                })
                            )
                            isLoadedDataProduct = true;
                        }, error => {
                            console.log(error);
                            this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                            rs()
                            this.loading = false;
                        });
                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                    rs()
                    this.loading = false;
                });
            const interval = setInterval(() => {
                if (isLoadedDataProduct && isLoadedDataOrderService) {
                    this.loading = false;
                    clearInterval(interval);
                    rs();
                }
            }, 500);
        })


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
        this.loadDataFromServer().then();
    }
    handleCancel(): void {
        this.isVisible = false;
    }

    showDeleteModal(order: OrderService) {
        this.isVisibleDelete = true;
        this.orderDelete = order;
    }

    handleCancelDeletePopup(): void {
        this.isVisibleDelete = false;
        this.orderDelete = null;
    }

    handleConfirmToDelete() {
        if (this.orderDelete) {
            this.isConfirmLoadingDelete = true;
            this.orderDelete.status = STATUS_ORDER.CANCEL_ORDER_VALUE;
            this.api.update(this.orderDelete.id, this.orderDelete, URL.API_ORDER_SERVICE).subscribe((data) => {
                if (data.status === 400 || data.status === 409) {
                    this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_FAILED);
                    this.isConfirmLoadingDelete = false;
                } else {
                    this.loadDataFromServer().then();
                    this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_SUCCESS);
                    this.isConfirmLoadingDelete = false;
                }
                this.handleCancelDeletePopup();
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


    createComponentModal(order?: OrderService, isNewOrder?: boolean): void {
        const callback: ModalFormOrderServiceCallback = {
            reloadData: () => {
                // Gọi phương thức từ class đã định nghĩa ở đây
                this.loadDataFromServer().then();
            }
        };
        if (isNewOrder) {
            this.scriptFC.createComponentModalFormOrderService(null, this.productList, this.dataPackageProductMap, order?.customerId!, null, this.viewContainerRef, callback);
        } else {
            this.scriptFC.createComponentModalFormOrderService(order?.itemId!, this.productList, this.dataPackageProductMap, order?.customerId!, order, this.viewContainerRef, callback);
        }
    }

    createComponentModalViewOrderService(order: OrderService): void {
       // this.scriptFC.createComponentModalViewOrderService()
    }

    paymentMoMo(id: string | null | undefined): void {
        window.open(PAYMENTS_URL.MOMO, "_blank")
    }
}
