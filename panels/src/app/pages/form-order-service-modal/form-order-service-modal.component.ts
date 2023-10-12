import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {IModalData} from "../../models/ModalData";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ORDER_SERVICE_FORM, USER_FORM} from "../../Constants/Form";
import {User} from "../../models/User";
import {Item} from "../../models/Item";
import {ScriptCommonService} from "../../services/script-common.service";
import {STATUS_CUSTOMER, STATUS_ORDER, STATUS_PAYMENT, USER_TYPE} from "../../Constants/vg-constant";
import * as Message from "../../Constants/message-constant";
import {AgentProduct} from "../../models/AgentProduct";
import {URL} from "../../Constants/api-urls";
import {MESSAGE_REGISTER_ORDER_PRODUCT_SERVICE_FAILED} from "../../Constants/message-constant";
import {ApiCommonService} from "../../services/api-common.service";
import {ResponseError} from "../../models/ResponseError";
import {OrderService} from "../../models/OrderService";

@Component({
  selector: 'app-form-order-service-modal',
  templateUrl: './form-order-service-modal.component.html',
})
export class FormOrderServiceModalComponent implements OnInit, OnDestroy{
  @Input() title?: string;
  @Input() subtitle?: string;
  validateCustomerForm!: UntypedFormGroup;
  validateOrderForm!: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder,
              public scriptFC: ScriptCommonService,
              private api: ApiCommonService,) {
  }

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: IModalData = inject(NZ_MODAL_DATA);
  customer!: User | null;
  products!: Item[];
  productSelect!: Item | null | undefined;
  order!: string | null;
  totalPrice: string = "0";

  destroyModal(): void {
    this.#modal.destroy({ data: 'this the result data' });
  }

  ngOnDestroy(): void {
    console.log("olala")
  }

  ngOnInit(): void {
    this.validateCustomerForm = this.fb.group(USER_FORM);
    this.validateOrderForm = this.fb.group(ORDER_SERVICE_FORM);
    this.customer = this.nzModalData.userInfo;
    this.products = this.nzModalData.productInfo;
    this.order = this.nzModalData.order;
    this.productSelect = this.products.find(p => p.id === this.nzModalData.idSelect);
    if (!this.productSelect) this.productSelect = this.products[0]
    if (this.customer) {
      this.validateCustomerForm.setValue({
        id: this.customer.id,
        code: this.customer.code,
        name: this.customer.name,
        email: this.customer.email,
        phone: this.customer.phone,
        address: this.customer.address,
        status: this.customer.status,
      })
    } else {
      this.validateCustomerForm.patchValue({
        status: STATUS_CUSTOMER.ACTIVATED_VALUE
      })
    }
    if (this.order) {
    } else {
      this.validateOrderForm.patchValue({
        itemId: this.productSelect.id?.toString()
      })
    }
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
    this.validateOrderForm.patchValue({
      totalAmount: this.totalPrice
    })
  }
  handleSubmit(): void {
    // this.loading = true;
    if (this.validateCustomerForm.valid && this.validateOrderForm.valid) {
      let dataCustomer: User = this.validateCustomerForm.value;
      dataCustomer.type = USER_TYPE.CUSTOMER;
      dataCustomer.phone = this.scriptFC.convertInputFormatToNumber(dataCustomer.phone);
      if (dataCustomer.id) {
        this.api.update<User>(dataCustomer.id, dataCustomer, URL.API_USER).subscribe((data) => {
          if (data.status == 400 || data.status == 409){
            data = data as ResponseError;
            this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
          } else {
            data = data as User;
            const dataOrder: OrderService = this.validateOrderForm.value
            if (dataOrder.id) {

            } else {
              // insert order
              dataOrder.customerId = data.id;
              dataOrder.status = STATUS_ORDER.IN_PROCESS_VALUE;
              dataOrder.attributes = JSON.stringify(this.products.find(p => p.id === dataOrder.itemId))
              this.api.insert<OrderService>(dataOrder, URL.API_ORDER_SERVICE).subscribe(() => {
                if (data.status == 400 || data.status == 409){
                  data = data as ResponseError;
                  this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                } else {
                  this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                  // this.destroyModal();
                }
              })
            }
            this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
          }

        }, error => {

        })
      } else {
        // insert customer
        this.api.insert<User>(dataCustomer, URL.API_USER).subscribe((data) => {
          if (data.status == 400 || data.status == 409){
            data = data as ResponseError;
            this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
          } else {
            data = data as User;
            const dataOrder: OrderService = this.validateOrderForm.value;
            console.log("pa no", dataOrder)
            if (dataOrder.id) {
              // update order
            } else {
              // insert order
              dataOrder.customerId = data.id;
              dataOrder.status = STATUS_ORDER.IN_PROCESS_VALUE;
              dataOrder.attributes = JSON.stringify(this.products.find(p => p.id === dataOrder.itemId))
              this.api.insert<OrderService>(dataOrder, URL.API_ORDER_SERVICE).subscribe(() => {
                if (data.status == 400 || data.status == 409){
                  data = data as ResponseError;
                  this.scriptFC.alertShowMessageError(`${Message.MESSAGE_SAVE_FAILED} ${data.message}`);
                } else {
                  this.scriptFC.alertShowMessageSuccess(Message.MESSAGE_SAVE_SUCCESS);
                  // this.destroyModal();
                }
              })
            }

          }
        })

      }
    } else {
      this.scriptFC.alertShowMessageError(Message.MESSAGE_REGISTER_ORDER_PRODUCT_SERVICE_FAILED);
      Object.values(this.validateCustomerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      Object.values(this.validateOrderForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }

  }
}
