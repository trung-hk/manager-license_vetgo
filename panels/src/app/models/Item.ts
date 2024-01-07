import {PackageProduct} from "./PackageProduct";
import {AbstractModel} from "./AbstractModel";

export class Item extends AbstractModel{
    id?: string | null ;
    name?: string | null;
    code?: string | null;
    images?: string | null;
    description?: string | null;
    categoryId?: string | null;
    attributes?: string | null;
    orgPrice?: string | null;
    sellingPrice?: string | null;
    type?: string | null;
    usingConfig?: string | null;
    packages?: PackageProduct[] | [];
    typeProductService?: string | null;
}

