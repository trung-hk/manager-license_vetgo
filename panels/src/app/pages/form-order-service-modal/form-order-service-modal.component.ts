import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalData} from "../../models/ModalData";
import {FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {
    CONFIG_ADMIN_ONLINE_SHOP_FORM,
    CONFIG_CS_ZALO_FORM,
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
    MODE_OPEN_MODAL_FORM_ORDER_SERVICE,
    STATUS_CUSTOMER,
    STATUS_ORDER,
    USER_TYPE
} from "../../Constants/vg-constant";
import {Message} from "../../Constants/message-constant";
import {URL} from "../../Constants/api-urls";
import {ApiCommonService} from "../../services/api-common.service";
import {ResponseError} from "../../models/ResponseError";
import {OrderService} from "../../models/OrderService";
import {AttributeOrderProductService} from "../../models/AttributeOrderProductService";
@Component({
    selector: 'app-form-order-service-modal',
    templateUrl: './form-order-service-modal.component.html',
})
export class FormOrderServiceModalComponent implements OnInit, OnDestroy {
    protected readonly MODE_OPEN_MODAL_FORM_ORDER_SERVICE = MODE_OPEN_MODAL_FORM_ORDER_SERVICE;
    protected readonly CONFIG = CONFIG;
    protected readonly CONFIG_ADMIN_ONLINE_SHOP_FORM = CONFIG_ADMIN_ONLINE_SHOP_FORM;
    validateCustomerForm!: UntypedFormGroup;
    validateOrderForm!: UntypedFormGroup;
    validateConfigForm!: UntypedFormGroup;
    attributePhoneFormArray = "phones";
    phonesArrayForm!: FormArray;

    constructor(private fb: UntypedFormBuilder,
                public scriptFC: ScriptCommonService,
                private api: ApiCommonService,) {
    }

    readonly #modal = inject(NzModalRef);
    readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
    customerId!: string | null;
    products!: Item[];
    productSelect!: Item | null | undefined;
    order!: OrderService | null | undefined;
    totalPrice: string = "0";
    mode!: string;
    attributeOrder!: AttributeOrderProductService;

    destroyModal(): void {
        this.#modal.destroy({data: 'this the result data'});
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.validateCustomerForm = this.fb.group(USER_FORM);
        this.validateOrderForm = this.fb.group(ORDER_SERVICE_FORM);
        this.customerId = this.nzModalData.userId;
        this.products = this.nzModalData.productInfo;
        this.order = this.nzModalData.order;
        this.mode = this.nzModalData.mode;
        this.productSelect = this.products.find(p => p.id === this.nzModalData.idProductSelect);
        if (!this.productSelect) this.productSelect = this.products[0]
        if (this.customerId) {
            this.api.getById<User>(this.customerId, URL.API_USER).subscribe((data) => {
                this.setValueFormCustomer(data);
            })
        } else {
            this.validateCustomerForm.patchValue({
                status: STATUS_CUSTOMER.ACTIVATED.value
            })
        }
        if (this.order) {
            this.attributeOrder = this.scriptFC.getAttributeOrderProductService(this.order.attributes);
            this.setValueFormOrderService(this.order);
        } else {
            this.validateOrderForm.patchValue({
                itemId: this.productSelect.id?.toString()
            })
        }
        if (this.mode === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG) {
            console.log(this.attributeOrder)
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
                    this.validateConfigForm = this.fb.group(CONFIG_CS_ZALO_FORM);
                    break;
                case CONFIG.CS_ZALO_EXPAND.value:
                    this.validateConfigForm = this.fb.group({phones: this.fb.array([])});
                    this.phonesArrayForm = this.validateConfigForm.get(this.attributePhoneFormArray) as FormArray;
                    const packageOrder = this.attributeOrder.packagesMap?.get(this.order?.packageId!);
                    for (let i = 0; i < parseInt(packageOrder?.quantity!); i++) {
                        this.phonesArrayForm.push(this.fb.group(CONFIG_CS_ZALO_FORM));
                    }
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
            customerId: this.customerId,
            itemId: order.itemId?.toString(),
            packageId: order.packageId
        })
        if (this.mode === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE) this.validateOrderForm.get("itemId")?.disable();
        this.totalPrice = order.totalAmount!;
    }

    handleChangeProduct(e: any): void {
        this.productSelect = this.products.find(p => p.id == e);
        this.validateOrderForm.patchValue({
            packageId: ""
        })
    }

    handleChangePackage(id: any): void {
        this.totalPrice = this.productSelect?.packages?.find(p => p.id === id)?.price!;
    }

    async handleSubmit(): Promise<void> {
        // validate form customer
        if (this.mode === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT && this.validateCustomerForm.invalid) {
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
        if (this.mode === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.INSERT) {
            // xử lý insertOrUpdate customer
            let dataCustomer: User = this.validateCustomerForm.value;
            dataCustomer.type = USER_TYPE.CUSTOMER;
            dataCustomer = await this.insertOrUpdateCustomer(dataCustomer);
            if (!dataCustomer.id) return;
            dataOrder.customerId = dataCustomer.id;
        }
        // Trường hợp insert hoặc update order
        if (this.mode !== MODE_OPEN_MODAL_FORM_ORDER_SERVICE.ADD_CONFIG) {
            // Trường hợp update Order thì không cho thay đổi sản phẩm
            if (this.mode === MODE_OPEN_MODAL_FORM_ORDER_SERVICE.UPDATE && this.order?.itemId != dataOrder.itemId) {
                this.scriptFC.alertShowMessageError(Message.MESSAGE_ERROR_UPDATE_ORDER);
                return;
            }
            // xử lý insertOrUpdate order
            await this.insertOrUpdateOrder(dataOrder);
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
            console.log(dataOrder);
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
            const data = {id: this.order?.id, data: this.validateConfigForm.value};
            console.log(data);
            this.api.update(this.order?.id, data, URL.API_UPDATE_CONFIG_ORDER).subscribe((data) => {
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

    protected readonly Constant = Constant;
}
