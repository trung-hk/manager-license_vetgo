import {Injectable, ViewContainerRef} from '@angular/core';
import {CommunicationService} from "./communication.service";
import {PackageProduct} from "../models/PackageProduct";
import {FormOrderServiceModalComponent} from "../pages/form-order-service-modal/form-order-service-modal.component";
import {
    IModalData,
    IModalViewCustomerData,
    IModalViewOrderServiceData,
    IModalViewProductServiceData
} from "../models/ModalData";
import {NzModalService} from "ng-zorro-antd/modal";
import {Item} from "../models/Item";
import {User} from "../models/User";
import {OrderService} from "../models/OrderService";
import {ModalFormOrderServiceCallback} from "../models/ModalFormOrderServiceCallback";
import {AttributeObjectProductService} from "../models/AttributeObjectProductService";
import {
    ProductServiceDetailsModalComponent
} from "../pages/product-service-details-modal/product-service-details-modal.component";
import {
    ERROR_LIST,
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE, MODE_ORDER,
    STATUS_ORDER,
    STATUS_PAYMENT, TYPE_PAYMENT
} from "../Constants/vg-constant";
import {AttributeOrderProductService} from "../models/AttributeOrderProductService";
import {NgxPermissionsService} from "ngx-permissions";
import {CustomerDetailsModalComponent} from "../pages/customer-details-modal/customer-details-modal.component";
import {AttributePackagePurchased} from "../models/PackagePurchased";
import {Message} from "../Constants/message-constant";
import {URL} from "../Constants/api-urls";
import {ResponsePaymentMoMo} from "../models/ResponesePayment";
import {PAYMENTS_METHOD, PAYMENTS_URL} from "../Constants/payment-urls";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiCommonService} from "./api-common.service";
import {AttributesModalFormOrderService} from "../models/AttributesModalFormOrderService";
import {DataService, PaymentBankTransferData} from "./data.service";
import {AccountInfo} from "../models/LicenseZalo";
import {
    OrderServiceDetailsModalComponent
} from "../pages/order-service-details-modal/order-service-details-modal.component";
import {RouteURL} from "../Constants/route-url";
import {CommissionApproved} from "../models/CommissionApproved";

@Injectable({
    providedIn: 'root'
})
export class ScriptCommonService {
    constructor(private communicationService: CommunicationService,
                private modal: NzModalService,
                private permissionsService: NgxPermissionsService,
                private dataService: DataService,
                private api: ApiCommonService,
                private activatedRoute: ActivatedRoute,) {
    }
    getParamUrl(param: string, activatedRoute: ActivatedRoute): string | null {
        console.log("nani", activatedRoute.snapshot.paramMap)
        return activatedRoute.snapshot.paramMap.get(param);
    }
    getQueryParamUrl(param: string): string | null {
        return this.activatedRoute.snapshot.queryParamMap.get(param);
    }
    alertShowMessageSuccess(message: string, title?: string): void {
        this.communicationService.sendEventToJs("ScriptComponent", {
            event: "alert-success",
            data: {title: title, message: message}
        });
    }

    alertShowMessageError(message?: string, title?: string): void {
        this.communicationService.sendEventToJs("ScriptComponent", {
            event: "alert-error",
            data: {title: title, message: message}
        })
    }

    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    getPackageService(value: string | null | undefined): PackageProduct[] {
        return this.getAttributeProductService(value!).packages!;
    }

    getAttributeProductService(value: string | null | undefined): AttributeObjectProductService {
        return JSON.parse(value!);
    }
    getAttributeOrderProductService(value: string | null | undefined): AttributeOrderProductService {
        const result: AttributeOrderProductService = JSON.parse(value!);
        result.packagesMap = new Map<string, PackageProduct>(result.packages?.map(r => [r.id!, r]));
        return result;
    }
    convertAttributeStringToObjectForPackagePurchased(value: string | null | undefined): AttributePackagePurchased {
        try {
            const result: AttributePackagePurchased = JSON.parse(value!);
            result.packagesMap = new Map<string, PackageProduct>(result.packages?.map(r => [r.id!, r]));
            return result;
        } catch (error) {
            console.error(error);
            return new AttributePackagePurchased();
        }
    }
    displayContentTextArea = (value: string): string => value ? value.replaceAll("\n", `<br>`) : "";

    createComponentModalFormOrderService(viewContainerRef: ViewContainerRef,
                                         attributes: AttributesModalFormOrderService,
                                         callBack?: ModalFormOrderServiceCallback,): void {
        let titleModal;
        let buttonText;
        switch (attributes.modeOpen) {
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT:
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.CUSTOMER_ORDER:
                titleModal = "Đặt đơn hàng";
                buttonText = "Thêm đơn hàng";
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE:
                titleModal = "Cập nhật đơn hàng";
                buttonText = "Cập nhật đơn hàng";
                break;
            case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG:
                titleModal = "Cài đặt";
                buttonText = "Thêm cài đặt";
                break;
        }
        const modal = this.modal.create<FormOrderServiceModalComponent, IModalData>({
            nzTitle: titleModal,
            nzContent: FormOrderServiceModalComponent,
            nzWidth: "800px",
            nzViewContainerRef: viewContainerRef,
            nzData: {
                attributes: attributes
            },
            nzOkType:"primary",
            nzOkText: buttonText,
            nzOnOk: (componentInstance: FormOrderServiceModalComponent) => {
                return new Promise((resolve) => {
                    componentInstance.handleSubmit().then(() => {
                        callBack?.reloadData();
                        resolve(null);
                    });
                }).then(() => false); // Ngăn chặn đóng modal
            },
        });
        const instance = modal.getContentComponent();
        modal.afterOpen.subscribe(() => {
            switch (attributes.modeOpen) {
                case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT:
                case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE:
                    modal.getConfig().nzOkDisabled = instance.validateCustomerForm.invalid || instance.validateOrderForm.invalid;
                    // Lắng nghe sự kiện statusChanges của form để cập nhật trạng thái của button disabled
                    instance.validateCustomerForm.statusChanges.subscribe(status => {
                        modal.getConfig().nzOkDisabled = status === 'INVALID' || instance.validateOrderForm.invalid;
                    });
                    instance.validateOrderForm.statusChanges.subscribe(status => {
                        modal.getConfig().nzOkDisabled = status === 'INVALID' || instance.validateCustomerForm.invalid;
                    });
                    break;
                case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG:
                    modal.getConfig().nzOkDisabled = instance.validateConfigForm.invalid;
                    instance.validateConfigForm.statusChanges.subscribe(status => {
                        modal.getConfig().nzOkDisabled = status === 'INVALID' || instance.validateConfigForm.invalid;
                    });
                    break;
                case MODE_OPEN_MODAL_FORM_ORDER_SERVICE.CUSTOMER_ORDER:
                    switch (attributes.fromOrderMode) {
                        case MODE_ORDER.FROM_CUSTOMER_CS_ZALO:
                        case MODE_ORDER.FROM_CUSTOMER_CS_ZALO_EXPAND:
                            modal.getConfig().nzOkDisabled = instance.validateConfigForm.invalid || instance.validateOrderForm.invalid;
                            // Lắng nghe sự kiện statusChanges của form để cập nhật trạng thái của button disabled
                            instance.validateConfigForm.statusChanges.subscribe(status => {
                                modal.getConfig().nzOkDisabled = status === 'INVALID' || instance.validateOrderForm.invalid;
                            })
                            instance.validateOrderForm.statusChanges.subscribe(status => {
                                modal.getConfig().nzOkDisabled = status === 'INVALID' || instance.validateConfigForm.invalid;
                            });
                            break;
                        default:
                            modal.getConfig().nzOkDisabled = instance.validateOrderForm.invalid;
                            instance.validateOrderForm.statusChanges.subscribe(status => {
                                modal.getConfig().nzOkDisabled = status === 'INVALID';
                            });
                            break;

                    }

                    break;
            }
        });
    }

    createComponentModalViewProductDetails(product: Item, viewContainerRef: ViewContainerRef): void {
        const modal = this.modal.create<ProductServiceDetailsModalComponent, IModalViewProductServiceData>({
            nzTitle: product.name!,
            nzContent: ProductServiceDetailsModalComponent,
            nzWidth: "800px",
            nzViewContainerRef: viewContainerRef,
            nzData: {
                product: product,
            },
            nzFooter: [
                {
                    type: "default",
                    label: "Hủy",
                    onClick: () => {
                        modal.destroy();
                    }
                }
            ]
        });
    }
    createComponentModalViewCustomerDetails(customer: User, viewContainerRef: ViewContainerRef): void {
        const modal = this.modal.create<CustomerDetailsModalComponent, IModalViewCustomerData>({
            nzTitle: "Thông tin khách hàng",
            nzContent: CustomerDetailsModalComponent,
            nzWidth: "800px",
            nzViewContainerRef: viewContainerRef,
            nzData: {
                customer: customer,
            },
            nzFooter: [
                {
                    type: "default",
                    label: "Hủy",
                    onClick: () => {
                        modal.destroy();
                    }
                }
            ]
        });
    }
    createComponentOrderServiceDetailsModal(orderService: OrderService, viewContainerRef: ViewContainerRef): void {
        const modal = this.modal.create<OrderServiceDetailsModalComponent, IModalViewOrderServiceData>({
            nzTitle: "Thông tin chi tiết",
            nzContent: OrderServiceDetailsModalComponent,
            nzWidth: "800px",
            nzViewContainerRef: viewContainerRef,
            nzData: {
                order: orderService,
            },
            nzFooter: [
                {
                    type: "default",
                    label: "Hủy",
                    onClick: () => {
                        modal.destroy();
                    }
                }
            ]
        });
    }
    formatString (value: string, params: string[]) {
        let result = value;
        for (let i = 0; i < params.length; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            result = result.replace(reg, params[i]);
        }
        return result;
    }
    validateResponseAPI (status: string | number | null | undefined): boolean {
        if (!status) return false;
        for (let code of ERROR_LIST) {
            if (status == code) return true;
        }
        return false;
    }
    hasPermission(role: string | string[]): Promise<boolean> {
        return this.permissionsService.hasPermission(role);
    }
    formatDate_YYYY_MM_DD = (date: string): Date => new Date(date.split('-').join('-'));
    parseFormatDateToString(date?: string | null): string | null {
        if (!date) return null;
        const stringToDate = new Date(date);
        const day = String(stringToDate.getDate()).padStart(2, '0'); // Lấy ngày và thêm '0' nếu cần thiết
        const month = String(stringToDate.getMonth() + 1).padStart(2, '0'); // Lấy tháng (lưu ý tháng bắt đầu từ 0)
        const year = stringToDate.getFullYear(); // Lấy năm
        return `${day}/${month}/${year}`;
    }
    getDayDiff(startDate: any, endDate: any): number {
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }
    payment(order: OrderService, method: string, backUrl: string): void {
        if (order.paymentStatus === STATUS_PAYMENT.PAID.value) {
            this.alertShowMessageError(Message.MESSAGE_CHECK_PAYMENT);
            return;
        }
        if (order.status !== STATUS_ORDER.IN_PROCESS.value) {
            this.alertShowMessageError(Message.MESSAGE_CHECK_STATUS_ORDER);
            return;
        }
        switch (method) {
            case PAYMENTS_METHOD.MOMO:
                const api = this.formatString(URL.API_PAYMENT_CONFIRM_ORDER_SERVICE, [order.id!, PAYMENTS_METHOD.MOMO]);
                this.api.payment<ResponsePaymentMoMo>(api, PAYMENTS_URL.MOMO).subscribe((data) => {
                    // Lấy thông tin thanh toán lỗi
                    if (this.validateResponseAPI(data.status)) {
                        this.alertShowMessageError(Message.MESSAGE_PAYMENT_FAILED);
                        // lấy thông tin thanh toán thành công
                    } else {
                        data = data as ResponsePaymentMoMo;
                        window.open(data.url!)
                    }

                }, error => {
                    console.log(error);
                    this.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                })
                break;
            case PAYMENTS_METHOD.BANK_TRANSFER:
            case PAYMENTS_METHOD.VIET_QR:
                const data : PaymentBankTransferData = {backUrl: backUrl, typePayment: TYPE_PAYMENT.ORDER_SERVICE}
                this.dataService.setData(data);
                this.dataService.navigateToPage(RouteURL.nextToPageWithId(RouteURL.PAGE_PAYMENT_BANK_TRANSFER, order.id!));
                break;
            default:
                break;
        }

    }
    paymentForCommission(commissionApproved: CommissionApproved, method: string, backUrl: string): void {
        if (commissionApproved.status === STATUS_PAYMENT.PAID.value) {
            this.alertShowMessageError(Message.MESSAGE_CHECK_PAYMENT);
            return;
        }
        switch (method) {
            case PAYMENTS_METHOD.MOMO:
                const api = this.formatString(URL.API_PAYMENT_COMMISSION_APPROVED, [commissionApproved.id!, PAYMENTS_METHOD.MOMO]);
                this.api.payment<ResponsePaymentMoMo>(api, PAYMENTS_URL.MOMO).subscribe((data) => {
                    // Lấy thông tin thanh toán lỗi
                    if (this.validateResponseAPI(data.status)) {
                        this.alertShowMessageError(Message.MESSAGE_PAYMENT_FAILED);
                        // lấy thông tin thanh toán thành công
                    } else {
                        data = data as ResponsePaymentMoMo;
                        window.open(data.url!)
                    }

                }, error => {
                    console.log(error);
                    this.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                })
                break;
            case PAYMENTS_METHOD.BANK_TRANSFER:
            case PAYMENTS_METHOD.VIET_QR:
                const data : PaymentBankTransferData = {backUrl: backUrl, typePayment: TYPE_PAYMENT.COMMISSION}
                this.dataService.setData(data);
                this.dataService.navigateToPage(RouteURL.nextToPageWithId(RouteURL.PAGE_PAYMENT_BANK_TRANSFER, commissionApproved.id!));
                break;
            default:
                break;
        }

    }
    getAccountZaloListFromJson(value: string): AccountInfo[] {
        try {
            return JSON.parse(value).phones;
        } catch (error) {
            return [];
        }
    }
    inputTransformFn = (value: unknown): string =>
        typeof value === 'string' ? value.toUpperCase() : String(value);

    outputTransformFn = (value: string | number | null | undefined): string => {
        return value ? String(value).toUpperCase() : ''
    };
}
