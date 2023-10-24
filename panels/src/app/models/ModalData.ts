import {Item} from "./Item";
import {PackageProduct} from "./PackageProduct";
import {OrderService} from "./OrderService";
import {User} from "./User";

export interface IModalData {
    userId: string | null;
    productInfo: Item[];
    idProductSelect: string | null;
    order: OrderService | null | undefined;
    packageProductMap: Map<string, PackageProduct[]>
}

export interface IModalViewData {
    userInfo: User;
    productName: string | null;
    order: OrderService;
}