import {User} from "./User";
import {Item} from "./Item";
import {PackageProduct} from "./PackageProduct";
import {OrderService} from "./OrderService";

export interface IModalData {
    userId: string | null;
    productInfo: Item[];
    idProductSelect: string | null;
    order: OrderService | null | undefined;
    packageProductMap: Map<string, PackageProduct[]>
    // productSelect: Item | null;
}