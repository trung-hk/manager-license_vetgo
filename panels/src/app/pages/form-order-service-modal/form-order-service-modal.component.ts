import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {IModalData} from "../../models/ModalData";
import {FormArray, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {
    CONFIG_ADMIN_ONLINE_SHOP_FORM,
    CONFIG_CS_ZALO_FORM, CONFIG_CS_ZALO_TIME_EXTENSION_FORM,
    CONFIG_POS_FORM,
    CONFIG_SPA_FORM, CONFIG_VET_APP_FORM, CONFIG_WIFI_MARKETING_FORM,
    ORDER_SERVICE_FORM,
    USER_FORM
} from "../../Constants/Form";
import {User} from "../../models/User";
import {Item} from "../../models/Item";
import {ScriptCommonService} from "../../services/script-common.service";
import {
    CONFIG, Constant,
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE, MODE_ORDER,
    STATUS_CUSTOMER,
    STATUS_ORDER, STATUS_PAYMENT, TYPE_ORDER_SERVICE,
    USER_TYPE
} from "../../Constants/vg-constant";
import {Message} from "../../Constants/message-constant";
import {URL} from "../../Constants/api-urls";
import {ApiCommonService} from "../../services/api-common.service";
import {ResponseError} from "../../models/ResponseError";
import {OrderService} from "../../models/OrderService";
import {AttributeOrderProductService} from "../../models/AttributeOrderProductService";
import {AttributesModalFormOrderService} from "../../models/AttributesModalFormOrderService";
import {DataService} from "../../services/data.service";
import {PAYMENTS_METHOD} from "../../Constants/payment-urls";
import {RouteURL} from "../../Constants/route-url";
@Component({
    selector: 'app-form-order-service-modal',
    templateUrl: './form-order-service-modal.component.html',
})
export class FormOrderServiceModalComponent implements OnInit, OnDestroy {
    protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
    protected readonly CONFIG = CONFIG;
    protected readonly CONFIG_ADMIN_ONLINE_SHOP_FORM = CONFIG_ADMIN_ONLINE_SHOP_FORM;
    protected readonly Constant = Constant;
    protected readonly MODE_ORDER = MODE_ORDER;
    validateCustomerForm!: UntypedFormGroup;
    validateOrderForm!: UntypedFormGroup;
    validateConfigForm!: UntypedFormGroup;
    attributePhoneFormArray = "phones";
    phonesArrayForm!: FormArray;
    selectTabIndex: number = 0;

    constructor(private fb: UntypedFormBuilder,
                public scriptFC: ScriptCommonService,
                private api: ApiCommonService,
                private modalService: NzModalService,) {
    }

    readonly #modal = inject(NzModalRef);
    readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
    productSelect!: Item;
    totalPrice: string = "0";
    attributeOrder!: AttributeOrderProductService;
    attributes!: AttributesModalFormOrderService;

    destroyModal(): void {
        this.#modal.destroy({data: 'this the result data'});
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.validateCustomerForm = this.fb.group(USER_FORM);
        this.validateOrderForm = this.fb.group(ORDER_SERVICE_FORM);
        this.attributes = this.nzModalData.attributes;
        this.productSelect = this.attributes.productInfo.find(p => p.id === this.attributes.idProductSelect)!;
        if (!this.productSelect) this.productSelect = this.attributes.productInfo[0];
        if (this.attributes.customerId) {
            this.api.getById<User>(this.attributes.customerId, URL.API_USER).subscribe((data) => {
                this.setValueFormCustomer(data);
            })
        } else {
            this.validateCustomerForm.patchValue({
                status: STATUS_CUSTOMER.ACTIVATED.value
            })
        }
        if (this.attributes.order) {
            this.attributeOrder = this.scriptFC.getAttributeOrderProductService(this.attributes.order.attributes);
            this.setValueFormOrderService(this.attributes.order);
        } else {
            this.validateOrderForm.patchValue({
                itemId: this.productSelect.id?.toString()
            })
        }
        if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG) {
            switch (this.attributeOrder.usingConfig) {
                case CONFIG.VET_APP.value:
                    this.validateConfigForm = this.fb.group(CONFIG_VET_APP_FORM);
                    break;
                case CONFIG.POS.value:
                    this.validateConfigForm = this.fb.group(CONFIG_POS_FORM);
                    break;
                case CONFIG.SPA.value:
                    this.validateConfigForm = this.fb.group(CONFIG_SPA_FORM);
                    break;
                case CONFIG.CS_ZALO.value:
                    this.validateConfigForm = this.fb.group({phones: this.fb.array([])});
                    this.phonesArrayForm = this.validateConfigForm.get(this.attributePhoneFormArray) as FormArray;
                    this.phonesArrayForm.push(this.fb.group(CONFIG_CS_ZALO_FORM));
                    break;
                case CONFIG.WIFI_MARKETING.value:
                    this.validateConfigForm = this.fb.group(CONFIG_WIFI_MARKETING_FORM);
                    break;
                case CONFIG.ADMIN_ONLINE_SHOP.value:
                    this.validateConfigForm = this.fb.group(CONFIG_ADMIN_ONLINE_SHOP_FORM);
                    break;
                default: this.validateConfigForm = this.fb.group({});
            }

        }
        if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.CUSTOMER_ORDER) {
            this.validateOrderForm.patchValue({
                itemId: this.productSelect.id?.toString(),
                packageId: this.attributes.packageId,
            });
            switch (this.attributes.fromOrderMode) {
                case MODE_ORDER.FROM_CUSTOMER_CS_ZALO_EXPAND:
                    this.validateConfigForm = this.fb.group({phones: this.fb.array([])});
                    this.phonesArrayForm = this.validateConfigForm.get(this.attributePhoneFormArray) as FormArray;
                    this.phonesArrayForm.push(this.fb.group(CONFIG_CS_ZALO_FORM));
                    break;
                case MODE_ORDER.FROM_CUSTOMER_CS_ZALO:
                    this.validateConfigForm = this.fb.group(CONFIG_CS_ZALO_TIME_EXTENSION_FORM);
                    this.validateConfigForm.patchValue({phones: this.attributes.phoneSelect});
                    break;
                default: break;
            }
            this.handleChangePackage();
        }
    }
    addPhone() {
        this.phonesArrayForm.push(this.fb.group(CONFIG_CS_ZALO_FORM));
        this.handleChangePackage();
    }
    removePhone(index: number, e: MouseEvent): void {
        e.preventDefault();
        this.phonesArrayForm.removeAt(index)
        this.handleChangePackage();
    }
    setValueFormCustomer(customer: User, isNotChangePhone?: boolean): void {
        if (isNotChangePhone) {
            this.validateCustomerForm.patchValue({
                id: customer.id,
                code: customer.code,
                name: customer.name,
                email: customer.email,
                address: customer.address,
                status: customer.status,
                commissionId: customer.commissionId
            })
        } else {
            this.validateCustomerForm.setValue({
                id: customer.id,
                code: customer.code,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                status: customer.status,
                commissionId: customer.commissionId
            })
        }

    }

    setValueFormOrderService(order: OrderService): void {
        this.validateOrderForm.setValue({
            id: order.id,
            code: order.code,
            customerId: this.attributes.customerId,
            itemId: order.itemId?.toString(),
            packageId: order.packageId
        })
        if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE) this.validateOrderForm.get("itemId")?.disable();
        this.totalPrice = order.totalAmount!;
    }

    handleChangeProduct(e: any): void {
        this.productSelect = this.attributes.productInfo.find(p => p.id == e)!;
        this.validateOrderForm.patchValue({
            packageId: ""
        })
    }

    handleChangePackage(): void {
        switch (this.attributes.fromOrderMode) {
            case MODE_ORDER.FROM_CUSTOMER_CS_ZALO_EXPAND:
                this.totalPrice = (parseInt(this.productSelect?.packages?.find(p => p.id === this.validateOrderForm.get("packageId")?.value)?.price!) * this.phonesArrayForm.length).toString();
                break;
            case MODE_ORDER.FROM_CUSTOMER_CS_ZALO:
                 const valueForm:{phones: string[]} = this.validateConfigForm.value;
                 this.totalPrice = (parseInt(this.productSelect?.packages?.find(p => p.id === this.validateOrderForm.get("packageId")?.value)?.price!) * valueForm.phones.length).toString();
                break;
            default:
                this.totalPrice = this.productSelect?.packages?.find(p => p.id === this.validateOrderForm.get("packageId")?.value)?.price!;
                break;
        }
    }

    async handleSubmit(): Promise<void> {
        // validate form customer
        if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT && this.validateCustomerForm.invalid) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_REGISTER_CUSTOMER_PRODUCT_SERVICE_FAILED);
            Object.values(this.validateCustomerForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            return;
        }
        // validate form order
        this.validateOrderForm.get("itemId")?.enable();
        if (this.validateOrderForm.invalid) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_REGISTER_ORDER_PRODUCT_SERVICE_FAILED);
            Object.values(this.validateOrderForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            return;
        }
        let dataOrder: OrderService = this.validateOrderForm.value;
        // trường hợp update Order thì ko xử lý update thông tin customer
        if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT) {
            // xử lý insertOrUpdate customer
            let dataCustomer: User = this.validateCustomerForm.value;
            dataCustomer.type = USER_TYPE.CUSTOMER;
            dataCustomer = await this.insertOrUpdateCustomer(dataCustomer);
            if (!dataCustomer.id) return;
            dataOrder.customerId = dataCustomer.id;
        }
        // Trường hợp insert hoặc update order
        if (this.attributes.modeOpen !== MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG) {
            // Trường hợp update Order thì không cho thay đổi sản phẩm
            if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE && this.attributes.order?.itemId != dataOrder.itemId) {
                this.scriptFC.alertShowMessageError(Message.MESSAGE_ERROR_UPDATE_ORDER);
                return;
            }
            // xử lý insertOrUpdate order
            const orderService = await this.insertOrUpdateOrder(dataOrder);
            console.log(orderService);
            if (orderService.paymentStatus == STATUS_PAYMENT.PAID.value) return;
            const titleConfirm = this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT ? "<i>Thêm đơn hàng thành công</i>"  : "<i>Cập nhật đơn hàng thành công</i>"
             this.modalService.confirm({
                nzTitle: titleConfirm,
                nzContent: '<b>Đi tới trang thanh toán?</b>',
                nzOnOk: () => this.scriptFC.payment(orderService, PAYMENTS_METHOD.VIET_QR, RouteURL.PAGE_ORDERS)
            });
            // Trường hợp update config order
        } else {
            await this.updateConfigOrder();
        }

    }

    /**/
    insertOrUpdateCustomer(dataCustomer: User): Promise<User> {
        return new Promise(rs => {
            if (dataCustomer.id) {
                // update customer
                this.api.update<User>(dataCustomer.id, dataCustomer, URL.API_USER).subscribe((data) => {
                    if (this.scriptFC.validateResponseAPI(data.status)) {
                        data = data as ResponseError;
                        this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                        this.setValueFormCustomer(dataCustomer);
                        rs(new User());
                    } else {
                        data = data as User;
                        rs(data);
                    }
                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                    this.setValueFormCustomer(dataCustomer);
                    rs(new User());
                })
            } else {
                // insert customer
                this.api.insert<User>(dataCustomer, URL.API_USER).subscribe((data) => {
                    if (this.scriptFC.validateResponseAPI(data.status)) {
                        data = data as ResponseError;
                        this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                        this.setValueFormCustomer(dataCustomer);
                        rs(new User());
                    } else {
                        data = data as User;
                        rs(data);
                    }
                }, error => {
                    console.log(error);
                    this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                    this.setValueFormCustomer(dataCustomer);
                    rs(new User());
                });
            }
        })
    }

    insertOrUpdateOrder(dataOrder: OrderService): Promise<OrderService> {
        return new Promise(rs => {
            dataOrder.status = STATUS_ORDER.IN_PROCESS.value;
            dataOrder.type = TYPE_ORDER_SERVICE.PARTNER_ORDER;
            if (this.attributes.modeOpen === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.CUSTOMER_ORDER) {
                switch (this.attributes.fromOrderMode) {
                    case MODE_ORDER.FROM_CUSTOMER_CS_ZALO_EXPAND:
                        dataOrder.type = TYPE_ORDER_SERVICE.CUSTOMER_ORDER;
                        dataOrder.attributes = JSON.stringify({data: {phones: this.phonesArrayForm.value}});
                        break;
                    case MODE_ORDER.FROM_CUSTOMER_CS_ZALO:
                        dataOrder.type = TYPE_ORDER_SERVICE.RENEW_PACKAGE;
                        const data: {phones: string[]} = this.validateConfigForm.value;
                        dataOrder.attributes = JSON.stringify({data: {phones: data.phones.map(phone => {return {phone}})}});
                        break;
                    default:
                        dataOrder.type = TYPE_ORDER_SERVICE.RENEW_PACKAGE;
                        break;
                }
            }
             if (dataOrder.id) {
                // update order
                this.api.update<OrderService>(dataOrder.id, dataOrder, URL.API_ORDER_SERVICE).subscribe((data) => {
                    if (this.scriptFC.validateResponseAPI(data.status)) {
                        data = data as ResponseError;
                        this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                        rs(dataOrder);
                    } else {
                        data = data as OrderService;
                        this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                        this.destroyModal();
                        rs(data);
                    }
                })
            } else {
                 // insert order
                 this.api.insert<OrderService>(dataOrder, URL.API_ORDER_SERVICE).subscribe((data) => {
                     if (this.scriptFC.validateResponseAPI(data.status)) {
                         data = data as ResponseError;
                         this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                         rs(dataOrder);
                     } else {
                         data = data as OrderService;
                         this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                         this.destroyModal();
                         rs(data);
                     }
                 }, error => {
                     console.log(error);
                     this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                     rs(dataOrder);
                 })
             }
        })
    }
    updateConfigOrder(): Promise<void> {
        return new Promise(rs => {
            const data = {id: this.attributes.order?.id, data: this.validateConfigForm.value};
            console.log(data);
            this.api.update(this.attributes.order?.id, data, URL.API_UPDATE_CONFIG_ORDER).subscribe((data) => {
                data = data as ResponseError;
                if (this.scriptFC.validateResponseAPI(data.status)) {
                    this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                    rs();
                } else {
                    this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                    this.destroyModal();
                    rs();
                }
            }, error => {
                console.log(error);
                this.scriptFC.alertShowMessageError(Message.MESSAGE_CONNECT_FAILED);
                rs();
            })
        })
    }

    onSearch(value: any): void {
        if (value.length !== 10) return;
        this.api.getCustomerByPhone(value).subscribe((data) => {
            console.log(data)
            if (this.scriptFC.validateResponseAPI(data.status)) return;
            this.setValueFormCustomer(data as User, true);
        })
    }
    switchTab() {
        if (this.attributes.modeOpen == MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT) {
            if (this.selectTabIndex == 0) {
                this.#modal.getConfig().nzOkText = "Đăng ký sản phẩm"
                this.#modal.getConfig().nzOkDisabled = false;
            } else {
                if (this.selectTabIndex == 1) {
                    this.#modal.getConfig().nzOkText = "Thêm đơn hàng"
                    this.#modal.getConfig().nzOkDisabled = this.validateCustomerForm.invalid || this.validateOrderForm.invalid;
                }
            }
        }
    }
}
