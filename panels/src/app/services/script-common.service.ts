import {Injectable, ViewContainerRef} from '@angular/core';
import {CommunicationService} from "./communication.service";
import {PackageProduct} from "../models/PackageProduct";
import {FormOrderServiceModalComponent} from "../pages/form-order-service-modal/form-order-service-modal.component";
import {IModalData} from "../models/ModalData";
import {NzModalService} from "ng-zorro-antd/modal";
import {Item} from "../models/Item";
import {User} from "../models/User";
import {OrderService} from "../models/OrderService";
import {ModalFormOrderServiceCallback} from "../models/ModalFormOrderServiceCallback";
import {AttributeObjectProductService} from "../models/AttributeObjectProductService";

@Injectable({
  providedIn: 'root'
})
export class ScriptCommonService {
  constructor(private communicationService: CommunicationService,
              private modal: NzModalService) { }

  alertShowMessageSuccess(message: string, title?: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: "alert-success", data:{title: title, message: message}});
    // this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "green"} });
  }
  alertShowMessageError(message?: string, title?: string): void {
    this.communicationService.sendEventToJs("ScriptComponent", {event: "alert-error", data:{title: title, message: message}})
    // this.notificationService.template(notificationTemplate!, { nzData: {message: message, color: "red"} });
  }
  formatPhone(value: string | null | undefined): string | null {
    value = this.convertInputFormatToNumber(value);
    if (!value) return null;
    if (value.length <= 3) {
      return `${value.slice(0, 3)}`;
    }
    if (value.length > 3 && value.length <=6) {
      return `(${value.slice(0, 3)}) ${value.slice(3, 6)}`;
    }
    return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }
  convertInputFormatToNumber(value: string | null | undefined): string | null {
    return value ? value.replace(/\D/g, "") : null;
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
    // console.log((this.getAttributeProductService(value!).packages)?.length)
    return this.getAttributeProductService(value!).packages!;
  }
  getAttributeProductService(value: string | null | undefined): AttributeObjectProductService {
    console.log(JSON.parse(value!))
    return JSON.parse(value!);
  }
  formatterMoney = (value: number) =>  value && `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserMoney = (value: string): string => value.replace(',', '');
  displayContentTextArea = (value: string): string => value ? value.replaceAll("\n", `<br>`) : "";
  createComponentModalFormOrderService(idProductSelect: string,
                                       dataProductList: Item[],
                                       dataPackageProductMap: Map<string, PackageProduct[]>,
                                       userId: string | null,
                                       order: OrderService | null | undefined,
                                       viewContainerRef: ViewContainerRef,
                                       callBack?: ModalFormOrderServiceCallback): void {
    const modal = this.modal.create<FormOrderServiceModalComponent, IModalData>({
      nzTitle: order ? 'Cập nhật đơn hàng' : 'Đặt đơn hàng',
      nzContent: FormOrderServiceModalComponent,
      nzWidth:"800px",
      nzViewContainerRef: viewContainerRef,
      nzData: {
        userId: userId,
        productInfo: dataProductList,
        idProductSelect: idProductSelect,
        order: order,
        packageProductMap: dataPackageProductMap
      },
      nzFooter: [
        {
          label: order ? 'Cập nhật đơn hàng' : 'Thêm đơn hàng',
          type: 'primary',
          onClick: componentInstance => {
            return new Promise( (resolve) => {
              componentInstance!.handleSubmit().then(() => {
                callBack?.reloadData();

                resolve(null);
              });
            })
          }
        },
        {
          label: 'Hủy',
          onClick: () => this.modal.ngOnDestroy()
        },
      ]
    });
    // const instance = modal.getContentComponent();
    // modal.afterOpen.subscribe(() => test = instance.validateCustomerForm.invalid);
    // Return a result when closed
    // modal.afterClose.subscribe(() => {
    //   modal.
    //   modal.componentInstance.beforeModalClose.subscribe(() => {
    //     if (this.preventModalClose) {
    //       // Ngăn chặn modal đóng
    //       modal.componentInstance.cancelModalClose();
    //     }
    //   });
    // })
  }
}
