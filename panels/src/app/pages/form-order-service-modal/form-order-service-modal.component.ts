import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalButtonOptions, NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalData} from "../../models/ModalData";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ORDER_SERVICE_FORM, USER_FORM} from "../../Constants/Form";
import {User} from "../../models/User";
import {Item} from "../../models/Item";
import {ScriptCommonService} from "../../services/script-common.service";
import {STATUS_CUSTOMER, STATUS_ORDER, USER_TYPE} from "../../Constants/vg-constant";
import {Message} from "../../Constants/message-constant";
import {URL} from "../../Constants/api-urls";
import {ApiCommonService} from "../../services/api-common.service";
import {ResponseError} from "../../models/ResponseError";
import {OrderService} from "../../models/OrderService";
@Component({
    selector: 'app-form-order-service-modal',
    templateUrl: './form-order-service-modal.component.html',
})
export class FormOrderServiceModalComponent implements OnInit, OnDestroy {
    validateCustomerForm!: UntypedFormGroup;
    validateOrderForm!: UntypedFormGroup;
    isUpdateOrder: boolean = false;

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

    destroyModal(): void {
        this.#modal.destroy({data: 'this the result data'});
    }

    ngOnDestroy(): void {
        console.log("olala")
    }

    ngOnInit(): void {
        this.validateCustomerForm = this.fb.group(USER_FORM);
        this.validateOrderForm = this.fb.group(ORDER_SERVICE_FORM);
        this.customerId = this.nzModalData.userId;
        this.products = this.nzModalData.productInfo;
        this.order = this.nzModalData.order;
        this.productSelect = this.products.find(p => p.id === this.nzModalData.idProductSelect);
        if (!this.productSelect) this.productSelect = this.products[0]
        if (this.customerId) {
            this.api.getById<User>(this.customerId, URL.API_USER).subscribe((data) => {
                this.setValueFormCustomer(data);
            })
        } else {
            this.validateCustomerForm.patchValue({
                status: STATUS_CUSTOMER.ACTIVATED_VALUE
            })
        }
        if (this.order) {
            this.isUpdateOrder = true;
            this.setValueFormOrderService(this.order);
        } else {
            this.validateOrderForm.patchValue({
                itemId: this.productSelect.id?.toString()
            })
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
                phone: this.scriptFC.formatPhone(customer.phone),
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
        if (this.isUpdateOrder) this.validateOrderForm.get("itemId")?.disable();
        this.totalPrice = order.totalAmount!;
    }

    formatPhone(event: any): void {
        event.target.value = this.scriptFC.formatPhone(event.target.value);
    }

    handleChangeProduct(e: any): void {
        this.productSelect = this.products.find(p => p.id == e);
        this.validateOrderForm.patchValue({
            packageId: ""
        })
    }

    handleChangePackage(id: any): void {
        this.totalPrice = this.nzModalData.packageProductMap.get(this.productSelect?.id!)?.find(p => p.id === id)?.price!;
    }

    async handleSubmit(): Promise<void> {
        // validate form customer
        if (!this.isUpdateOrder && this.validateCustomerForm.invalid) {
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
        if (!this.isUpdateOrder) {
            // xử lý insertOrUpdate customer
            let dataCustomer: User = this.validateCustomerForm.value;
            dataCustomer.type = USER_TYPE.CUSTOMER;
            dataCustomer.phone = this.scriptFC.convertInputFormatToNumber(dataCustomer.phone);
            dataCustomer = await this.insertOrUpdateCustomer(dataCustomer);
            if (!dataCustomer.id) return;
            dataOrder.customerId = dataCustomer.id;
        }
        // Trường hợp update Order thì không cho thay đổi sản phẩm
        if (this.isUpdateOrder && this.order?.itemId != dataOrder.itemId) {
            this.scriptFC.alertShowMessageError(Message.MESSAGE_ERROR_UPDATE_ORDER);
            return;
        }
        // xử lý insertOrUpdate order
        await this.insertOrUpdateOrder(dataOrder);
    }

    /**/
    insertOrUpdateCustomer(dataCustomer: User): Promise<User> {
        return new Promise(rs => {
            if (dataCustomer.id) {
                // update customer
                this.api.update<User>(dataCustomer.id, dataCustomer, URL.API_USER).subscribe((data) => {
                    if (data.status == 400 || data.status == 409) {
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
                    if (data.status == 400 || data.status == 409) {
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
            dataOrder.status = STATUS_ORDER.IN_PROCESS_VALUE;
            console.log(dataOrder);
            if (dataOrder.id) {
                // update order
                this.api.update<OrderService>(dataOrder.id, dataOrder, URL.API_ORDER_SERVICE).subscribe((data) => {
                    if (data.status == 400 || data.status == 409) {
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
                    if (data.status == 400 || data.status == 409) {
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

    onSearch(value: any): void {
        console.log(value)
        const phone = this.scriptFC.convertInputFormatToNumber(value);
        if (phone?.length !== 10) return;
        this.api.getCustomerByPhone(phone).subscribe((data) => {
            console.log(data)
            if (data.status === 404) return;
            this.setValueFormCustomer(data as User, true);
        })

    }
}
