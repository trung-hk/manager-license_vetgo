import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {
    CONFIG, Constant,
    MODE_DISPLAY,
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
    ROLES,
    STATUS_ORDER,
    STATUS_PAYMENT, TYPE_PAYMENT
} from "../../Constants/vg-constant";
import {Message} from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {ModalFormOrderServiceCallback} from "../../models/ModalFormOrderServiceCallback";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {AttributesModalFormOrderService} from "../../models/AttributesModalFormOrderService";
import {RouteURL} from "../../Constants/route-url";
import {CommonParamComponent} from "../../models/CommonParamComponent";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
})
export class OrdersComponent extends CommonParamComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
    protected readonly STATUS_ORDER = STATUS_ORDER;
    protected readonly ROLES = ROLES;
    protected readonly MODE_DISPLAY = MODE_DISPLAY;
    protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
    protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
    protected readonly CONFIG = CONFIG;
    protected readonly Constant = Constant;
    protected readonly RouteURL = RouteURL;
    listScript = [];
    dataList: OrderService[] = [];
    productList: Item[] = [];
    isVisible: boolean = false;
    isVisibleDelete = false;
    isRePayment = false;
    isConfirmLoadingDelete = false;
    orderDelete: OrderService | null | undefined = null;
    orderRepayment: OrderService | null | undefined = null;
    selectUser: string = "";
    nzFilterOption = (): boolean => true;

    modeView!: string;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private renderer: Renderer2,
                public scriptFC: ScriptCommonService,
                private viewContainerRef: ViewContainerRef,
                private elRef: ElementRef,) {
        super()
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
        });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.querySelector('.orders'), "active");
    }

    init(): void {
        this.loadDataFromServer().then();
    }

    async loadDataFromServer(from?: string, to?: string, keyWork?: string): Promise<void> {
        this.loading = true;
        let loading_success_1 = false;
        let loading_success_2 = false;
        const objectSelectOrderService: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork, fromCreatedDate: from, toCreatedDate: to}
        this.api.getAll<ResponseDataGetAll<OrderService>>(URL.API_ORDER_SERVICE, objectSelectOrderService).subscribe((data) => {
            console.log(data)
            loading_success_1 = true;
            this.total = data.totalElements;
            this.dataList = data.content.map(d => {
                d.attributesObject = this.scriptFC.getAttributeOrderProductService(d.attributes);
                return d;
            });
            this.loading = !(loading_success_1 && loading_success_2);
        }, error => {
            console.log(error);
            this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
            this.loading = false;
        });
        this.api.getAll<ResponseDataGetAll<AgentProduct>>(URL.API_AGENT_PRODUCT)
            .subscribe((data) => {
                console.log(data)
                const idProductRegisterList = data.content.map(ap => ap.itemId);
                this.api.getAll<ResponseDataGetAll<Item>>(URL.API_ITEM)
                    .subscribe((data) => {
                        console.log(data)
                        this.productList = data.content
                            .filter(ps => idProductRegisterList.includes(ps.id))
                            .map(product => {
                                product.packages = this.scriptFC.getPackageService(product.attributes);
                                return product;
                            });
                        loading_success_2 = true;
                        this.loading = !(loading_success_1 && loading_success_2);
                    }, error => {
                        console.log(error);
                        this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                        this.loading = false;
                    });
            }, error => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_LOAD_DATA_FAILED);
                this.loading = false;
            });
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
            this.orderDelete.status = STATUS_ORDER.CANCEL_ORDER.value;
            this.api.update(this.orderDelete.id, this.orderDelete, URL.API_ORDER_SERVICE).subscribe((data) => {
                if (this.scriptFC.validateResponseAPI(data.status)) {
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

    createComponentModal(modeOpen: string, order?: OrderService): void {
        const callback: ModalFormOrderServiceCallback = {
            reloadData: () => {
                // Gọi phương thức từ class đã định nghĩa ở đây
                this.loadDataFromServer().then();
            }
        };
        switch (modeOpen) {
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT:
                const attributesInsert: AttributesModalFormOrderService = {
                    modeOpen: MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT,
                    productInfo: this.productList,
                    customerId: order?.customerId!,
                }
                this.scriptFC.createComponentModalFormOrderService(this.viewContainerRef, attributesInsert, callback);
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE:
                const attributesUpdate: AttributesModalFormOrderService = {
                    modeOpen: MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE,
                    productInfo: this.productList,
                    idProductSelect: order?.itemId!,
                    customerId: order?.customerId!,
                    order: order,
                }
                this.scriptFC.createComponentModalFormOrderService(this.viewContainerRef, attributesUpdate, callback);
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG:
                const attributesAddConfig: AttributesModalFormOrderService = {
                    modeOpen: MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG,
                    productInfo: this.productList,
                    idProductSelect: order?.itemId!,
                    customerId: order?.customerId!,
                    order: order,
                }
                this.scriptFC.createComponentModalFormOrderService(this.viewContainerRef, attributesAddConfig, callback);
                break;
        }
    }

    payment(order: OrderService, method: string): void {
        this.scriptFC.payment(order, method, RouteURL.PAGE_ORDERS);
    }
    filterOrder(e: string) {
        this.setFilter(e).then(() => {
            this.loadDataFromServer().then();
        })
    }
    setFilter(value: string): Promise<void> {
        return new Promise( rs => {
            this.scriptFC.hasPermission(ROLES.ADMIN).then(result => {
                if (result) {
                    this.filter = [{key: "ods.realm", value: [value]}];
                    rs();
                }
            })
            this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
                if (result) {
                    this.filter = [{key: "ods.distributor_id", value: [value]}];
                    rs();
                }
            })
            this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
                if (result) {
                    this.filter = [{key: "ods.partner_id", value: [value]}];
                    rs();
                }
            })
            this.scriptFC.hasPermission(ROLES.PARTNER).then(result => {
                if (result) {
                    this.filter = [{key: "ods.customer_id", value: [value]}];
                    rs();
                }
            })
        })
    }
    showRePaymentModal(order: OrderService) {
        this.isRePayment = true;
        this.orderRepayment = order;
    }
    rePayment() {
        this.isRePayment = false;
        this.payment(this.orderRepayment!, PAYMENTS_METHOD.VIET_QR);
    }
    handleCancelRePaymentModalPopup() {
        this.isRePayment = false;
        this.orderRepayment = null;
    }
    protected readonly TYPE_PAYMENT = TYPE_PAYMENT;
}
