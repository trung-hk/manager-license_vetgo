import {Item} from "./Item";
import {PackageProduct} from "./PackageProduct";
import {OrderService} from "./OrderService";
import {User} from "./User";

export interface IModalData {
    userId: string | null;
    productInfo: Item[];
    idProductSelect: string | null;
    order: OrderService | null | undefined;
    mode: string;
}

export interface IModalViewProductServiceData {
    product: Item;
}