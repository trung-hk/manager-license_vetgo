import {Item} from "./Item";
import {User} from "./User";
import {AttributesModalFormOrderService} from "./AttributesModalFormOrderService";
import {OrderService} from "./OrderService";

export interface IModalData {
    attributes: AttributesModalFormOrderService;
}

export interface IModalViewProductServiceData {
    product: Item;
}
export interface IModalViewCustomerData {
    customer: User;
}
export interface IModalViewOrderServiceData {
    order: OrderService;
}