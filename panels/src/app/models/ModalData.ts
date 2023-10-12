import {User} from "./User";
import {Item} from "./Item";
import {PackageProduct} from "./PackageProduct";

export interface IModalData {
    userInfo: User | null;
    productInfo: Item[];
    idSelect: string | null;
    order: string | null;
    packageProductMap: Map<string, PackageProduct[]>
    // productSelect: Item | null;
}