import {PackageProduct} from "./PackageProduct";

export class AttributeOrderProductService{
    usingConfig?: string | null;
    itemName?: string | null;
    packages?: PackageProduct[] | null;
    packagesMap?: Map<string, PackageProduct>| null;
    data?: {} | null
}

