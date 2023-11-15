import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";
import {LazyLoadScriptService} from "../../services/lazy-load-script.service";
import {ApiCommonService} from "../../services/api-common.service";
import {CommunicationService} from "../../services/communication.service";
import {ScriptCommonService} from "../../services/script-common.service";
import {ResponseDataGetAll} from "../../models/ResponseDataGetAll";
import {URL} from "../../Constants/api-urls";
import {
    CONFIG,
    MODE_DISPLAY,
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
    ROLES,
    STATUS_ORDER,
    STATUS_PAYMENT, USER_TYPE
} from "../../Constants/vg-constant";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Message} from "../../Constants/message-constant";
import {OrderService} from "../../models/OrderService";
import {Item} from "../../models/Item";
import {AgentProduct} from "../../models/AgentProduct";
import {ModalFormOrderServiceCallback} from "../../models/ModalFormOrderServiceCallback";
import {PAYMENTS_METHOD, PAYMENTS_URL} from "../../Constants/payment-urls";
import {ResponesePayment} from "../../models/ResponesePayment";
import {Router} from "@angular/router";
import {ObjectSelectAll} from "../../models/ObjectSelectAll";
import {User} from "../../models/User";
import {BehaviorSubject, debounceTime, distinctUntilChanged} from "rxjs";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
    protected readonly STATUS_PAYMENT = STATUS_PAYMENT;
    protected readonly STATUS_ORDER = STATUS_ORDER;
    protected readonly ROLES = ROLES;
    protected readonly MODE_DISPLAY = MODE_DISPLAY;
    protected readonly PAYMENTS_METHOD = PAYMENTS_METHOD;
    protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
    protected readonly CONFIG = CONFIG;
    listScript = [];
    dataList: OrderService[] = [];
    productList: Item[] = [];
    userList: User[] = [];
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
    filter: Array<{ key: string; value: string[] }> = [];
    selectUser: string = "";
    private searchSubject = new BehaviorSubject<string>('');
    search$ = this.searchSubject.asObservable();
    test: string[] = [];
    nzFilterOption = (): boolean => true;

    modeView!: string;

    constructor(private loadScript: LazyLoadScriptService,
                private api: ApiCommonService,
                private communicationService: CommunicationService,
                private renderer: Renderer2,
                private scriptFC: ScriptCommonService,
                private fb: UntypedFormBuilder,
                private viewContainerRef: ViewContainerRef,
                private elRef: ElementRef,
                private router: Router,) {
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
        this.search$
            .pipe(
                debounceTime(500), // Đặt thời gian debounce (miligiây)
                distinctUntilChanged() // Chỉ gọi khi giá trị thay đổi
            )
            .subscribe(searchText => {
                // Gọi hàm tìm kiếm của bạn ở đây
                this.onSearch(searchText);
            });
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
        this.loadDataFromServer();
    }

    loadDataFromServer(keyWork?: string): void {
        this.loading = true;
        let loading_success_1 = false;
        let loading_success_2 = false;
        const objectSelectOrderService: ObjectSelectAll = {page: this.pageIndex - 1, size: this.pageSize, sort: this.sort, filter: this.filter, keyword: keyWork}
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
        if (!sortField) {
            this.sort = "last_modified_date,desc";
        } else {
            let sortOrder = (currentSort && currentSort.value) || null;
            sortOrder = sortOrder && sortOrder === 'ascend' ? 'asc' : 'desc';
            this.sort = `${sortField},${sortOrder}`;
        }
        this.loadDataFromServer();
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
                if (data.status === 400 || data.status === 409) {
                    this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_DELETE_FAILED);
                    this.isConfirmLoadingDelete = false;
                } else {
                    this.loadDataFromServer();
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


    createComponentModal(modeOpen: string, order?: OrderService): void {
        const callback: ModalFormOrderServiceCallback = {
            reloadData: () => {
                // Gọi phương thức từ class đã định nghĩa ở đây
                this.loadDataFromServer();
            }
        };
        switch (modeOpen) {
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT:
                this.scriptFC.createComponentModalFormOrderService(null, this.productList, order?.customerId!, null, this.viewContainerRef, MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT, callback);
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE:
                this.scriptFC.createComponentModalFormOrderService(order?.itemId!, this.productList, order?.customerId!, order, this.viewContainerRef, MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE, callback);
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG:
                this.scriptFC.createComponentModalFormOrderService(order?.itemId!, this.productList, order?.customerId!, order, this.viewContainerRef, MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG, callback);
                break;
        }
    }

    payment(order: OrderService, method: string): void {
        if (order.paymentStatus !== STATUS_PAYMENT.UN_PAID.value) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_CHECK_PAYMENT);
            return;
        }
        if (order.status !== STATUS_ORDER.IN_PROCESS.value) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_CHECK_STATUS_ORDER);
            return;
        }
        switch (method) {
            case PAYMENTS_METHOD.MOMO:
                const api = this.scriptFC.formatString(URL.API_PAYMENT_CONFIRM, [order.id!, PAYMENTS_METHOD.MOMO]);
                this.api.payment<ResponesePayment>(api, PAYMENTS_URL.MOMO).subscribe((data) => {
                    // Lấy thông tin thanh toán lỗi
                    if (this.scriptFC.validateResponseAPI(data.status)) {
                        this.scriptFC.alertShowMessageError(Message.MESSAGE_PAYMENT_FAILED);
                        // lấy thông tin thanh toán thành công
                    } else {
                        data = data as ResponesePayment;
                        window.open(data.url!)
                    }

                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                })
                break;
            case PAYMENTS_METHOD.BANK_TRANSFER:
                this.router.navigate(['/payment-bank-transfer', order.id]);
                break;
            default:
                break;
        }

    }
    onSearch(searchText: string): void {
        // Gọi hàm tìm kiếm của bạn ở đây
        console.log('Searching for:', searchText);
        const objectSelectUser: ObjectSelectAll = {keyword: searchText}
        this.scriptFC.hasPermission(ROLES.ADMIN).then(result => {
            if (result) {
                this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.AGENT, objectSelectUser).subscribe((data) => {
                    console.log(data)
                    this.userList = data.content;
                });
            }
        })
        this.scriptFC.hasPermission(ROLES.AGENT).then(result => {
            if (result) {
                this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.DISTRIBUTOR, objectSelectUser).subscribe((data) => {
                    console.log(data)
                    this.userList = data.content;
                });
            }
        })
        this.scriptFC.hasPermission(ROLES.DISTRIBUTOR).then(result => {
            if (result) {
                this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.PARTNER, objectSelectUser).subscribe((data) => {
                    console.log(data)
                    this.userList = data.content;
                });
            }
        })
        this.scriptFC.hasPermission(ROLES.PARTNER).then(result => {
            if (result) {
                this.api.getAllUsersByType<ResponseDataGetAll<User>>(URL.API_USER_BY_TYPE, USER_TYPE.CUSTOMER, objectSelectUser).subscribe((data) => {
                    console.log(data)
                    this.userList = data.content;
                });
            }
        })
    }

    handleInputChange(searchText: any): void {
        // Cập nhật giá trị BehaviorSubject khi có sự thay đổi
        this.searchSubject.next(searchText);
    }
    filterOrder(e: string) {
        this.setFilter(e).then(() => {
            this.loadDataFromServer();
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
}
